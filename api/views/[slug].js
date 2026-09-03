import { Redis } from "@upstash/redis";

/**
 * Vercel serverless function backing the per-post view counter.
 *
 * Endpoint:           /api/views/:slug
 *   GET                -> read-only, returns current count
 *   POST               -> atomic increment, returns the new count
 *
 * Counts are stored in Vercel KV (Upstash Redis) under `views:post:{slug}`.
 * Credentials are read from the Vercel KV integration's env vars
 * (KV_REST_API_URL / KV_REST_API_TOKEN) via Redis.fromEnv(); they are never
 * committed to the repo.
 */

const kv = Redis.fromEnv();

const NAMESPACE = "views:post:";

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

function notFound() {
  return new Response(JSON.stringify({ error: "Not found" }), {
    status: 404,
    headers: { "content-type": "application/json" },
  });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export async function GET(request, ctx) {
  const slug = getSlug(request, ctx);
  if (!slug) return notFound();
  const key = NAMESPACE + slug;
  const raw = (await kv.get(key)) || 0;
  const views = typeof raw === "number" ? raw : Number(raw) || 0;
  return json({ views });
}

export async function POST(request, ctx) {
  const slug = getSlug(request, ctx);
  if (!slug) return notFound();
  const key = NAMESPACE + slug;
  const views = await kv.incr(key);
  return json({ views });
}

export const config = {
  runtime: "nodejs",
};
