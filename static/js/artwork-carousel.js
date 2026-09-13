/**
 * artwork-carousel.js — lightweight image viewer for artwork pages.
 *
 * Two modes:
 *   - Multi-image artworks render .artwork-carousel[data-carousel]: a track
 *     carousel navigable by swipe / arrow-keys / dots, whose slides open a
 *     fullscreen lightbox when clicked.
 *   - Single-image artworks (plain .artwork-figure) open the same lightbox
 *     directly from a click, without any navigation controls.
 *
 * The lightbox dims and blurs the page behind the image and letterboxes it
 * (object-fit: contain) so it fills the viewport as far as its own aspect
 * ratio allows without cropping anything. Prev/next arrows are hidden at
 * either end, and both the carousel and the lightbox share the current index.
 */
(function () {
  "use strict";

  var carouselRoot = document.querySelector("[data-carousel]");
  var singleFigure = document.querySelector(".artwork-figure");
  if (!carouselRoot && !singleFigure) return;

  /* Collect the artwork views in DOM order. */
  var items = [];
  var slideEls = [];
  var singleImg = null;

  if (carouselRoot) {
    slideEls = carouselRoot.querySelectorAll(".artwork-carousel-slide");
    for (var s = 0; s < slideEls.length; s++) {
      var slideImg = slideEls[s].querySelector("img");
      items.push({ src: slideImg.getAttribute("src"), alt: slideImg.alt });
    }
  } else {
    singleImg = singleFigure.querySelector("img");
    items.push({ src: singleImg.getAttribute("src"), alt: singleImg.alt });
  }

  var total = items.length;
  if (!total) return;
  var current = 0;

  /* ---- Carousel wiring (multi-image only) ---- */
  var carousel = null;
  var suppressClick = false;

  if (carouselRoot) {
    var root = carouselRoot;
    var track = root.querySelector(".artwork-carousel-track");
    var carouselPrev = root.querySelector("[data-carousel-prev]");
    var carouselNext = root.querySelector("[data-carousel-next]");
    var dots = root.querySelectorAll("[data-carousel-dot]");
    var counter = root.querySelector("[data-carousel-counter]");

    function applyAspectRatio(img) {
      if (img && img.naturalWidth && img.naturalHeight) {
        root.style.aspectRatio = img.naturalWidth + "/" + img.naturalHeight;
      }
    }

    var firstImg = slideEls[0] && slideEls[0].querySelector("img");
    if (firstImg) {
      if (firstImg.complete) {
        applyAspectRatio(firstImg);
      } else {
        firstImg.addEventListener("load", function () {
          applyAspectRatio(firstImg);
        }, { once: true });
      }
    }

    function carouselRender() {
      track.style.transform = "translateX(-" + (current * 100) + "%)";
      for (var i = 0; i < dots.length; i++) {
        dots[i].classList.toggle("is-active", i === current);
        dots[i].setAttribute("aria-current", i === current ? "true" : "false");
      }
      if (counter) {
        counter.textContent = (current + 1) + " / " + total;
      }
      updateArrows();
    }

    carousel = {
      root: root,
      render: carouselRender,
      prevBtn: carouselPrev,
      nextBtn: carouselNext,
    };

    function goTo(index) {
      index = Math.max(0, Math.min(total - 1, index));
      if (index === current) return;
      current = index;
      carouselRender();
    }

    if (carouselPrev) {
      carouselPrev.addEventListener("click", function () { goTo(current - 1); });
    }
    if (carouselNext) {
      carouselNext.addEventListener("click", function () { goTo(current + 1); });
    }
    for (var d = 0; d < dots.length; d++) {
      (function (dot) {
        dot.addEventListener("click", function () {
          goTo(parseInt(dot.getAttribute("data-carousel-dot"), 10));
        });
      })(dots[d]);
    }

    root.setAttribute("tabindex", "0");
    root.addEventListener("keydown", function (e) {
      if (lightboxOpen) return;
      if (e.key === "ArrowLeft" || e.key === "Left") {
        e.preventDefault();
        goTo(current - 1);
      }
      if (e.key === "ArrowRight" || e.key === "Right") {
        e.preventDefault();
        goTo(current + 1);
      }
    });

    var startX = 0;
    var deltaX = 0;
    var dragging = false;
    var SWIPE_THRESHOLD = 40;

    track.addEventListener("touchstart", function (e) {
      startX = e.touches[0].clientX;
      dragging = true;
      deltaX = 0;
      track.style.transition = "none";
    }, { passive: true });

    track.addEventListener("touchmove", function (e) {
      if (!dragging) return;
      deltaX = e.touches[0].clientX - startX;
      if (Math.abs(deltaX) > 5) suppressClick = true;
      var pct = -(current * 100) + (deltaX / root.offsetWidth) * 100;
      track.style.transform = "translateX(" + pct + "%)";
    }, { passive: true });

    track.addEventListener("touchend", function () {
      if (!dragging) return;
      dragging = false;
      track.style.transition = "";
      if (deltaX < -SWIPE_THRESHOLD) {
        goTo(current + 1);
      } else if (deltaX > SWIPE_THRESHOLD) {
        goTo(current - 1);
      } else {
        track.style.transform = "translateX(-" + (current * 100) + "%)";
      }
    }, { passive: true });

    carouselRender();
  }

  /* ------------------------------------------------------------------ *
   * Lightbox (shared by carousel and single-image modes)                *
   * ------------------------------------------------------------------ */

  var lightbox = null;
  var lightboxImg = null;
  var lightboxOpen = false;
  var previousOverflow = "";
  var focusReturn = null;

  var CHEVRON_PREV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6" /></svg>';
  var CHEVRON_NEXT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6" /></svg>';
  var ICON_CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18" /></svg>';

  function setArrow(btn, show) {
    if (btn) btn.hidden = !show;
  }

  function updateArrows() {
    if (carousel) {
      setArrow(carousel.prevBtn, current > 0);
      setArrow(carousel.nextBtn, current < total - 1);
    }
    if (lightbox) {
      setArrow(lightbox.querySelector("[data-lb-prev]"), current > 0);
      setArrow(lightbox.querySelector("[data-lb-next]"), current < total - 1);
    }
  }

  function buildLightbox() {
    lightbox = document.createElement("div");
    lightbox.className = "artwork-lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Image viewer");

    var nav = "";
    if (total > 1) {
      nav =
        '<button class="artwork-lightbox-btn is-prev" type="button" data-lb-prev aria-label="Previous image">' + CHEVRON_PREV + "</button>" +
        '<button class="artwork-lightbox-btn is-next" type="button" data-lb-next aria-label="Next image">' + CHEVRON_NEXT + "</button>";
    }

    lightbox.innerHTML =
      '<button class="artwork-lightbox-btn is-close" type="button" data-lb-close aria-label="Close image viewer">' + ICON_CLOSE + "</button>" +
      nav +
      '<img class="artwork-lightbox-img">';
    document.body.appendChild(lightbox);
    lightboxImg = lightbox.querySelector(".artwork-lightbox-img");

    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    lightbox.querySelector("[data-lb-close]").addEventListener("click", closeLightbox);
    var prev = lightbox.querySelector("[data-lb-prev]");
    var next = lightbox.querySelector("[data-lb-next]");
    if (prev) prev.addEventListener("click", function () { lbGoTo(current - 1); });
    if (next) next.addEventListener("click", function () { lbGoTo(current + 1); });
  }

  function syncLightboxImage() {
    lightboxImg.src = items[current].src;
    lightboxImg.alt = items[current].alt;
  }

  function openLightbox(focusEl) {
    if (!lightbox) buildLightbox();
    syncLightboxImage();
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    focusReturn = focusEl || (carousel ? carousel.root : singleImg);
    lightbox.classList.add("is-open");
    lightboxOpen = true;
    updateArrows();
    lightbox.querySelector("[data-lb-close]").focus();
  }

  function closeLightbox() {
    if (!lightboxOpen) return;
    lightbox.classList.remove("is-open");
    document.body.style.overflow = previousOverflow;
    lightboxOpen = false;
    if (focusReturn && focusReturn.focus) focusReturn.focus();
  }

  function lbGoTo(index) {
    var clamped = Math.max(0, Math.min(total - 1, index));
    if (clamped === current) return;
    current = clamped;
    if (carousel) {
      carousel.render();
    } else {
      updateArrows();
    }
    syncLightboxImage();
  }

  if (carouselRoot) {
    for (var c = 0; c < slideEls.length; c++) {
      (function (slide) {
        slide.addEventListener("click", function () {
          if (suppressClick) {
            suppressClick = false;
            return;
          }
          openLightbox(slide);
        });
      })(slideEls[c]);
    }
  } else if (singleImg) {
    singleImg.addEventListener("click", function () {
      openLightbox(singleImg);
    });
  }

  document.addEventListener("keydown", function (e) {
    if (!lightboxOpen) return;
    if (e.key === "Escape" || e.key === "Esc") {
      e.preventDefault();
      closeLightbox();
    } else if (e.key === "ArrowLeft" || e.key === "Left") {
      e.preventDefault();
      lbGoTo(current - 1);
    } else if (e.key === "ArrowRight" || e.key === "Right") {
      e.preventDefault();
      lbGoTo(current + 1);
    }
  });
})();