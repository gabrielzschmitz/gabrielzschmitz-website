import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

/**
 * Vercel serverless function backing the per-post view counter.
 *
 * Endpoint:           /api/views/:slug
 *   GET                -> read-only, returns current count (never sets a cookie)
 *   POST               -> counts at most ONE unique visitor per post per year
 *
 * Privacy posture (deliberately minimal):
 *   - The server stores ONLY an anonymous integer count per post
 *     (views:post:{slug}) in Vercel KV. No visitor IDs, IPs, user agents,
 *     referrers, or logs are ever persisted.
 *   - Uniqueness is tracked with a single-purpose, first-party cookie
 *     `viewed_{slug}=1` scoped to one post. It carries no identifying data,
 *     is HttpOnly (unreadable by scripts), SameSite=Lax (never sent cross-site),
 *     and Secure over HTTPS. It expires after 1 year (no indefinite marker).
 *   - The cookie is only set on the visitor's POST (the act of loading the
 *     post); GET reads never create an identity marker.
 *
 * Credentials are read from the Vercel KV integration's env vars
 * (KV_REST_API_URL / KV_REST_API_TOKEN) via Redis.fromEnv(); they are never
 * committed to the repo.
 *
 * Abuse posture: writes are the only path that mutates state (and costs an
 * Upstash call per request), so POST is rate limited per client IP with a
 * generous sliding window. Blocked clients receive 429 + Retry-After instead
 * of burning Redis calls. Reads stay unthrottled because they are cheap,
 * stateless, and must serve crawlers/browser preloads. A per-slug ceiling
 * additionally stops a single scripted client from inflating one post to an
 * absurd count.
 */

const kv = Redis.fromEnv();

const NAMESPACE = "views:post:";

/* Absolute per-post view ceiling (stops unbounded single-key inflation). */
const CEILING_POST_VIEWS = 99999;

/* Single-purpose cookie for deduping unique visitors per post. */
const COOKIE_PREFIX = "viewed_";
const COOKIE_MAX_AGE_SECONDS = 31536000; /* 1 year */
const COOKIE_VALUE = "1";

/*
 * Per-IP rate limiters backed by the same Upstash database (keys namespaced
 * under `rl:views:*`). The `read` window is deliberately generous; `write` is
 * the one being protected. `ephemeralCache` lives at module scope so warm
 * invocations short-circuit already-blocked clients without extra Redis calls.
 * `timeout` fail-opens: if Upstash is slow, pages never break on a counter.
 */
const rateLimit = {
  read: new Ratelimit({
    redis: kv,
    prefix: "rl:views:read",
    limiter: Ratelimit.slidingWindow(600, "60 s"),
    timeout: 3000,
    ephemeralCache: new Map(),
  }),
  write: new Ratelimit({
    redis: kv,
    prefix: "rl:views:write",
    limiter: Ratelimit.slidingWindow(20, "60 s"),
    timeout: 3000,
    ephemeralCache: new Map(),
  }),
};

/* Best-effort client IP: Vercel populates x-forwarded-for for Function runs. */
function clientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0].trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip") || "unknown";
}

function tooManyRequests(reset) {
  const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
  return new Response(JSON.stringify({ error: "Too many requests" }), {
    status: 429,
    headers: {
      "content-type": "application/json",
      "retry-after": String(retryAfter),
    },
  });
}

function getSlug(request, ctx) {
  // Prefer the dynamic route param injected by Vercel...
  const paramSlug =
    ctx && ctx.params && (ctx.params.slug || (ctx.params[0] || {}).slug);
  if (paramSlug) return String(paramSlug);

  // ...otherwise fall back to parsing the request path.
  const url = new URL(request.url);
  const parts = url.pathname.split("/").filter(Boolean);
  const last = parts[parts.length - 1];
  return last ? String(last) : null;
}

/* Parse a single cookie value from the request's Cookie header. */
function getCookie(request, name) {
  const header = request.headers.get("cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    const key = eq === -1 ? part.trim() : part.slice(0, eq).trim();
    if (key === name) {
      return eq === -1 ? "" : part.slice(eq + 1).trim();
    }
  }
  return null;
}

function notFound() {
  return new Response(JSON.stringify({ error: "Not found" }), {
    status: 404,
    headers: { "content-type": "application/json" },
  });
}

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", ...extraHeaders },
  });
}

function toInt(value) {
  return typeof value === "number" ? value : Number(value) || 0;
}

/* Increment a counter, but never above `ceiling` (read-then-incr; the small
   race near the boundary is harmless for a cosmetics counter). */
async function incrementWithCeiling(key, ceiling) {
  const current = toInt((await kv.get(key)) || 0);
  if (current >= ceiling) return current;
  return kv.incr(key);
}

export async function GET(request, ctx) {
  const slug = getSlug(request, ctx);
  if (!slug) return notFound();
  const key = NAMESPACE + slug;

  const allowed = await rateLimit.read.limit(clientIp(request));
  if (!allowed.success) return tooManyRequests(allowed.reset);

  const raw = (await kv.get(key)) || 0;
  return json({ views: toInt(raw) });
}

export async function POST(request, ctx) {
  const slug = getSlug(request, ctx);
  if (!slug) return notFound();
  const key = NAMESPACE + slug;

  const cookieName = COOKIE_PREFIX + slug;
  const alreadyViewed = getCookie(request, cookieName);

  const allowed = await rateLimit.write.limit(clientIp(request));
  if (!allowed.success) return tooManyRequests(allowed.reset);

  // Returning visitor within the cookie lifetime: no increment, no new marker.
  if (alreadyViewed !== null) {
    const raw = (await kv.get(key)) || 0;
    return json({ views: toInt(raw) });
  }

  // First visit: atomically increment (capped) and record the visitor marker.
  const views = await incrementWithCeiling(key, CEILING_POST_VIEWS);

  const isSecure = new URL(request.url).protocol === "https:";
  const setCookie = [
    `${cookieName}=${COOKIE_VALUE}`,
    `Path=/`,
    `Max-Age=${COOKIE_MAX_AGE_SECONDS}`,
    `HttpOnly`,
    `SameSite=Lax`,
    isSecure ? `Secure` : null,
  ]
    .filter(Boolean)
    .join("; ");

  return json({ views }, 200, { "Set-Cookie": setCookie });
}

export const config = {
  runtime: "nodejs",
};
