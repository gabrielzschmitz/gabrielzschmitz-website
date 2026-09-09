/**
 * Sword cursor easter egg.
 * Applies a dagger-shaped cursor to interactive elements and spins it a few
 * degrees while the mouse button is held. Exposes window.applySwordCursor so
 * theme.js and lang.js can re-apply it after class/innerHTML changes.
 */
function swordCursor() {
  const isDark = document.body.classList.contains('dark-mode');
  const png = isDark
    ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAFQUExURbMkOAAAALMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOAAAAN2tvPMAAABudFJOUwAAs3EFcuJ4C3fylhQKlfyqIBOnwzIevtNDAS/Q5F4EPt7vCVbt948RA2rz/aMcBoL7vS0Om/7OPRat3wIkxuwH9IcxCEScGDvaQFzutSF8b/bMi/h1D50VgTp9yfmDJqiFezO7ehDxdG3w3JLXLJHlyQAAAAFiS0dEAf8CLd4AAAAJcEhZcwAAASwAAAEsAHOI6VIAAAAHdElNRQfqCQEONBKMqjjlAAABMUlEQVQoz3XSV1PCUBAF4HMlWFDAhiKCqCBIADWAsaESxd4VxYpdrPv/H10cdSbJzX3b+R727J2DJpcC4fDgbm5pdVIobZ72DgcFvD5/ZxekDIHuHuoNSJURff0UHAhBhqyDYYoMRSFD1uERGnXHIEPW+BglkuOQoUBKTVMmO2GJ9TthckojyuXN+jegMK0TzcyaQv8j5uaJaCFehB1ZF5dYl9US7MgaCLIaKwUgtlqGCVnXIqza+gY2t7YtKBDa2WXV9/YPKNlIZo6eOjxqqO+YcjErCpRP/KwV0k5hQ4GzaoaVsgXrzh89v0gz+rx2ROny6lonnW5qkp23Yb7l7t5DiQf+DAtGH2tPzy+Kq07Ga8lWHRTLKUB5eyejGpCXElG1TvTh1FjlkzM7lj3/RZVvLRE5pMcJpvoAAAAASUVORK5CYII='
    : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAFQUExURZ4UJgAAAJ4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJgAAAH7STPEAAABudFJOUwAAs3EFcuJ4C3fylhQKlfyqIBOnwzIevtNDAS/Q5F4EPt7vCVbt948RA2rz/aMcBoL7vS0Om/7OPRat3wIkxuwH9IcxCEScGDvaQFzutSF8b/bMi/h1D50VgTp9yfmDJqiFezO7ehDxdG3w3JLXLJHlyQAAAAFiS0dEAf8CLd4AAAAJcEhZcwAAASwAAAEsAHOI6VIAAAAHdElNRQfqCQEONBKMqjjlAAABMUlEQVQoz3XSV1PCUBAF4HMlWFDAhiKCqCBIADWAsaESxd4VxYpdrPv/H10cdSbJzX3b+R727J2DJpcC4fDgbm5pdVIobZ72DgcFvD5/ZxekDIHuHuoNSJURff0UHAhBhqyDYYoMRSFD1uERGnXHIEPW+BglkuOQoUBKTVMmO2GJ9TthckojyuXN+jegMK0TzcyaQv8j5uaJaCFehB1ZF5dYl9US7MgaCLIaKwUgtlqGCVnXIqza+gY2t7YtKBDa2WXV9/YPKNlIZo6eOjxqqO+YcjErCpRP/KwV0k5hQ4GzaoaVsgXrzh89v0gz+rx2ROny6lonnW5qkp23Yb7l7t5DiQf+DAtGH2tPzy+Kq07Ga8lWHRTLKUB5eyejGpCXElG1TvTh1FjlkzM7lj3/RZVvLRE5pMcJpvoAAAAASUVORK5CYII=';
  return `url("${png}") 2 2, pointer`;
}

function applySwordCursorWith(pen) {
  const selectors = [
    'a', 'a:link', 'a:visited', 'a:hover', 'a:active', 'a:focus',
    'button', '[data-resume]', '[data-en]', '#theme-toggle', '#language-toggle', '#music-toggle'
  ].join(',');
  document.querySelectorAll(selectors).forEach(el => {
    el.style.cursor = pen;
  });
  document.body.style.cursor = pen;
}

function applySwordCursor(deg = 0) {
  if (deg === 0) {
    applySwordCursorWith(swordCursor());
  } else {
    rotatedCursor(deg).then(pen => applySwordCursorWith(pen));
  }
}

/* click "press" rotation in degrees (applied while the mouse is down) */
const CURSOR_CLICK_DEG = -5;
const cursorRotationCache = new Map();

let cursorImagePromise = null;
function cursorImage() {
  if (!cursorImagePromise) {
    cursorImagePromise = new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = swordCursor().match(/url\("([^"]+)"\)/)[1];
    });
  }
  return cursorImagePromise;
}

function cursorShorthand(url) {
  return `url("${url}") 2 2, pointer`;
}

/* Rotate the base sword image around its centre by `deg` and resolve to a
   data URL suitable for the `cursor` shorthand. Cached per degree. */
function rotatedCursor(deg) {
  if (cursorRotationCache.has(deg)) {
    return Promise.resolve(cursorShorthand(cursorRotationCache.get(deg)));
  }
  return cursorImage().then(img => {
    if (!img) return swordCursor();
    const size = img.naturalWidth || 28;
    const out = Math.ceil(size * Math.SQRT2) + 2;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = out;
    const ctx = canvas.getContext('2d');
    ctx.translate(out / 2, out / 2);
    ctx.rotate((deg * Math.PI) / 180);
    ctx.drawImage(img, -size / 2, -size / 2);
    const url = canvas.toDataURL('image/png');
    cursorRotationCache.set(deg, url);
    return cursorShorthand(url);
  });
}

function initCursorClickRotation() {
  document.addEventListener('mousedown', () => {
    applySwordCursor(CURSOR_CLICK_DEG);
  });
  document.addEventListener('mouseup', () => {
    applySwordCursor(0);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  applySwordCursor();
  initCursorClickRotation();
});