/**
 * artwork-carousel.js — lightweight image carousel for artwork pages.
 * Renders only when .artwork-carousel[data-carousel] exists on the page.
 * Touch swipe, arrow-key and dot navigation; no dependencies.
 */
(function () {
  "use strict";

  var root = document.querySelector("[data-carousel]");
  if (!root) return;

  var track = root.querySelector(".artwork-carousel-track");
  var slides = root.querySelectorAll(".artwork-carousel-slide");
  var prevBtn = root.querySelector("[data-carousel-prev]");
  var nextBtn = root.querySelector("[data-carousel-next]");
  var dots = root.querySelectorAll("[data-carousel-dot]");
  var counter = root.querySelector("[data-carousel-counter]");
  var total = slides.length;
  var current = 0;

  function applyAspectRatio(img) {
    if (img && img.naturalWidth && img.naturalHeight) {
      root.style.aspectRatio = img.naturalWidth + "/" + img.naturalHeight;
    }
  }

  var firstImg = slides[0] && slides[0].querySelector("img");
  if (firstImg) {
    if (firstImg.complete) {
      applyAspectRatio(firstImg);
    } else {
      firstImg.addEventListener("load", function () {
        applyAspectRatio(firstImg);
      }, { once: true });
    }
  }

  function goTo(index) {
    index = Math.max(0, Math.min(total - 1, index));
    if (index === current) return;
    current = index;
    track.style.transform = "translateX(-" + (current * 100) + "%)";
    for (var i = 0; i < dots.length; i++) {
      dots[i].classList.toggle("is-active", i === current);
      dots[i].setAttribute("aria-current", i === current ? "true" : "false");
    }
    if (counter) {
      counter.textContent = (current + 1) + " / " + total;
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function () { goTo(current - 1); });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", function () { goTo(current + 1); });
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
})();
