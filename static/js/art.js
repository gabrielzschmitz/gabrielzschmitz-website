/* Magazine mosaic layout for /art/.
 *
 * A dense CSS-grid collage instead of a masonry stream: every work fills one
 * or more base cells, and each artwork's cell size is keyed to its aspect
 * ratio (portraits get tall cells, wide pieces get wide cells). The `wide`
 * artwork spans the whole grid as a feature band; the work immediately
 * before it is promoted to a full-width feature too, so it sits alone on its
 * line — keeping the reading order chronological (descending, as listed in
 * art.json) with nothing back-filled above the band. Images fill their cell
 * edge to edge (`object-fit: cover`), so the frame around each artwork
 * never shows gaps.
 *
 * The container stays hidden (`visibility: hidden`) until the layout has
 * been computed, so captions never show before their panels are placed.
 */
(function () {
  "use strict";

  var GAP = 4;

  var container = document.querySelector(".art-masonry");
  if (!container) {
    return;
  }

  function naturalSize(img) {
    var w = img.naturalWidth || 300;
    var h = img.naturalHeight || Math.round(w * 0.75);
    return { w: w, h: h };
  }

  function spanFor(nat) {
    var ratio = nat.w / nat.h;
    if (ratio >= 1.55) {
      return { c: 2, r: 1 };
    }
    if (ratio >= 0.85) {
      return { c: 1, r: 1 };
    }
    if (ratio >= 0.55) {
      return { c: 1, r: 2 };
    }
    return { c: 1, r: 3 };
  }

  /* Full-width feature rows for the work preceding a `wide` band: tall
   * enough that its own aspect ratio fills most of the line. */
  function featureRows(nat, cols) {
    return Math.min(6, Math.max(2, Math.round(cols / (nat.w / nat.h))));
  }

  function layout() {
    var raw = container.clientWidth;
    if (!raw) {
      return;
    }
    var figures = Array.prototype.slice.call(container.querySelectorAll(".art-figure"));
    if (!figures.length) {
      return;
    }

    var cols = raw < 560 ? 1 : raw < 800 ? 2 : 3;
    var cell = (raw - GAP * (cols - 1)) / cols;

    container.style.display = "grid";
    container.style.gridTemplateColumns = "repeat(" + cols + ", 1fr)";
    container.style.gridAutoRows = cell + "px";
    container.style.gridAutoFlow = "dense";
    container.style.gap = GAP + "px";

    /* Promote the work directly before each wide band to a full-width
     * feature, so nothing younger back-fills onto the same line. */
    var feature = {};
    figures.forEach(function (figure, i) {
      if (i > 0 && figure.classList.contains("art-figure--wide") && !figures[i - 1].classList.contains("art-figure--wide")) {
        feature[i - 1] = true;
      }
    });

    figures.forEach(function (figure, i) {
      var img = figure.querySelector("img");
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";
      figure.style.margin = "0";
      figure.style.position = "relative";

      if (figure.classList.contains("art-figure--wide")) {
        figure.style.gridColumnEnd = "span " + cols;
        figure.style.gridRowEnd = "span 2";
        return;
      }
      if (feature[i]) {
        figure.style.gridColumnEnd = "span " + cols;
        figure.style.gridRowEnd = "span " + featureRows(naturalSize(img), cols);
        return;
      }
      var span = spanFor(naturalSize(img));
      figure.style.gridColumnEnd = "span " + Math.min(span.c, cols);
      figure.style.gridRowEnd = "span " + span.r;
    });

    container.classList.add("art-masonry--ready");
  }

  var done = false;
  function run() {
    if (done) {
      return;
    }
    layout();
    if (document.readyState === "complete") {
      done = true;
    }
  }

  if (document.readyState === "complete") {
    run();
  } else {
    document.addEventListener("DOMContentLoaded", run);
    window.addEventListener("load", run);
  }

  /* Recompute on resize (window resize, or browser zoom changing the CSS
   * viewport width) so the column count always follows the current width. */
  var resizeTimer = null;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layout, 120);
  });
})();