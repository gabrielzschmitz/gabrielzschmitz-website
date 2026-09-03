/**
 * view-counter.js — per-post unique visitor counter.
 *
 * On every post page a <span data-view-slug="{slug}"> placeholder is rendered
 * next to the post language in article-meta. This script POSTs to the Vercel
 * KV-backed serverless function /api/views/:slug. The server counts at most
 * one unique visitor per post per year (using a privacy-friendly, HttpOnly,
 * same-site cookie), then returns the number so it can be rendered as
 * "{n} reads".
 *
 * This script does no fingerprinting and stores nothing itself; the
 * same-origin request simply carries the cookie that the server set.
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

    fetch("/api/views/" + encodeURIComponent(slug), {
      method: "POST",
      credentials: "same-origin",
    })
      .then(function (res) {
        if (!res.ok) throw new Error("view counter request failed");
        return res.json();
      })
      .then(function (data) {
        var views = data && data.views;
        if (typeof views !== "number") return;
        var pt = (localStorage.getItem("newspaper-lang") || "en") === "pt";
        el.textContent =
          views.toLocaleString() + (pt ? " LEITORES" : " READS");
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
