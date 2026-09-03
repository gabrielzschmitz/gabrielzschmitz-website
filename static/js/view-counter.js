/**
 * view-counter.js — per-post global view counter.
 *
 * On every post page a <span data-view-slug="{slug}"> placeholder is rendered
 * next to the post language in article-meta. This script POSTs to the Vercel
 * KV-backed serverless function /api/views/:slug to increment the global
 * count, then displays the returned number as "{n} reads".
 *
 * If the counter backend is unavailable (e.g. local build without KV
 * configured), it fails silently and leaves the placeholder empty.
 */
(function () {
  "use strict";

  function init() {
    var el = document.querySelector("[data-view-slug]");
    if (!el) return;

    var slug = el.getAttribute("data-view-slug");
    if (!slug) return;

    fetch("/api/views/" + encodeURIComponent(slug), { method: "POST" })
      .then(function (res) {
        if (!res.ok) throw new Error("view counter request failed");
        return res.json();
      })
      .then(function (data) {
        var views = data && data.views;
        if (typeof views !== "number") return;
        el.textContent = views.toLocaleString() + " reads";
      })
      .catch(function () {
        /* silently hide on failure */
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
