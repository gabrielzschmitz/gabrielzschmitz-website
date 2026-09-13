/**
 * Sword cursor easter egg.
 * Applies a dagger-shaped cursor to interactive elements and spins it a few
 * degrees while the mouse button is held. Exposes window.applySwordCursor so
 * theme.js and lang.js can re-apply it after class/innerHTML changes.
 */
function swordCursor() {
  const isDark = document.body.classList.contains('dark-mode');
  const png = isDark
    ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAFQUExURbMkOAAAALMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOLMkOAAAAN2tvPMAAABudFJOUwAAs3EFcuJ4C3fylhQKlfyqIBOnwzIevtNDAS/Q5F4EPt7vCVbt948RA2rz/aMcBoL7vS0Om/7OPRat3wIkxuwH9IcxCEScGDvaQFzutSF8b/bMi/h1D50VgTp9yfmDJqiFezO7ehDxdG3w3JLXLJHlyQAAAAFiS0dEAf8CLd4AAAAJcEhZcwAAASwAAAEsAHOI6VIAAAAHdElNRQfqCQEONBKMqjjlAAABMUlEQVQoz3XSV1PCUBAF4HMlWFDAhiKCqCBIADWAsaESxd4VxYpdrPv/H10cdSbJzX3b+R727J2DJpcC4fDgbm5pdVIobZ72DgcFvD5/ZxekDIHuHuoNSJURff0UHAhBhqyDYYoMRSFD1uERGnXHIEPW+BglkuOQoUBKTVMmO2GJ9TthckojyuXN+jegMK0TzcyaQv8j5uaJaCFehB1ZF5dYl9US7MgaCLIaKwUgtlqGCVnXIqza+gY2t7YtKBDa2WXV9/YPKNlIZo6eOjxqqO+YcjErCpRP/KwV0k5hQ4GzaoaVsgXrzh89v0gz+rx2ROny6lonnW5qkp23Yb7l7t5DiQf+DAtGH2tPzy+Kq07Ga8lWHRTLKUB5eyejGpCXElG1TvTh1FjlkzM7lj3/RZVvLRE5pMcJpvoAAAAASUVORK5CYII='
    : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAFQUExURZ4UJgAAAJ4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJp4UJgAAAH7STPEAAABudFJOUwAAs3EFcuJ4C3fylhQKlfyqIBOnwzIevtNDAS/Q5F4EPt7vCVbt948RA2rz/aMcBoL7vS0Om/7OPRat3wIkxuwH9IcxCEScGDvaQFzutSF8b/bMi/h1D50VgTp9yfmDJqiFezO7ehDxdG3w3JLXLJHlyQAAAAFiS0dEAf8CLd4AAAAJcEhZcwAAASwAAAEsAHOI6VIAAAAHdElNRQfqCQEONBKMqjjlAAABMUlEQVQoz3XSV1PCUBAF4HMlWFDAhiKCqCBIADWAsaESxd4VxYpdrPv/H10cdSbJzX3b+R727J2DJpcC4fDgbm5pdVIobZ72DgcFvD5/ZxekDIHuHuoNSJURff0UHAhBhqyDYYoMRSFD1uERGnXHIEPW+BglkuOQoUBKTVMmO2GJ9TthckojyuXN+jegMK0TzcyaQv8j5uaJaCFehB1ZF5dYl9US7MgaCLIaKwUgtlqGCVnXIqza+gY2t7YtKBDa2WXV9/YPKNlIZo6eOjxqqO+YcjErCpRP/KwV0k5hQ4GzaoaVsgXrzh89v0gz+rx2ROny6lonnW5qkp23Yb7l7t5DiQf+DAtGH2tPzy+Kq07Ga8lWHRTLKUB5eyejGpCXElG1TvTh1FjlkzM7lj3/RZVvLRE5pMcJpvoAAAAASUVORK5CYII=';
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

/* ---- Magnifying-glass cursor over artworks -------------------------- */

const MAG_LIGHT_B64 = "iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAABmJLR0QA/wD/AP+gvaeTAAADBUlEQVRIia2VT2hUVxTGf+e+SYwlKOPMpBADDuaf+AehIrjRYMWKFCmoBBohIWMgK6OCbgShyy5FUZuFM63dSNOFYKuULGq7UWs3WkqH50tIU12oM4rGQWPm3dOFjZU3L3mTjN/ufd8993cu973zhBANx1cvr3di3QqfA5uAZUAJKCBcF/iu/7F7Naw2ShI0csn2HhU5jZKYv1JuiNVMf9HNLwqoILlk53nQwQXUP8eY7syj/E8LBmYT7acQObwA2KxKVvl4oOj+VjXwQqpjtyiLuhMAlIlYrGF978O7pailJpdON4jKVyGZr8oZ6zsbGgtuTMqv46rsBf4KaTtdti+PVNObZFOd+1EdqQiU3v6i+23QH46vXl7nxEaBzYHofmPBTXeDPx/QgPZUuKrfh8EABp+OP7Pi9wDlQNRSWtEWbCIEqGwIsc/PVzTweMwDfqwIxHwUDYSWoOm8ljtRhYj+HrQsrKwGWPHxv1oi9ZFAFRPiTkUDFTdo1lPeHsmDbUFPHPNrJFCF0crN5ORwc/MHcxVlm9bsEtgRsAuTj/I3I4FGuRTir6mbabx88cPWpgpYovMzrA2r+eMLsFFAAcglO35Q+DQkf4VwDZUxEV2qaBcq6+fYawrVnZnivVuRwK+b2lqtNbeBeFSHEbLACA4nMg/d8TmBANlkWxeYa8DSGqEgFNW3ew4+8W4Eo7evdqbg/WIwW0EmawYqCTFm9EJT+77KXgI6m1rX2KAzxwQOAStCtnsJ/A20AnWRbOVMKW6PD3nedChwVsNsqqtPvdiBZaMabcHKMyD/Iu6PDHnedC7VsVWVyO/uP93G+vsyT8b+mRNYjbLJzuugXVUtViZQf1vYeKpajuoBwItY9uZ3JaQxsaGagH1F94EzbbYAP4evkBlFp/9/1lU1AQH6pvLFyULzJyJ8ScWksUaQtyNS4M+a7jCoXLJtj+JcAg2bw88dZW3NJ3xX/QXvCkZ2AoVANIUx3X1F98F7PeGsvkl0rPSFo8BahLuxcvlc79Px2gfKYvQvajIHqa2QCO4AAAAASUVORK5CYII=";
const MAG_DARK_B64 = "iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAABmJLR0QA/wD/AP+gvaeTAAAC+UlEQVRIia2VTUgUYRjHf8/brqhFYUGHMpJ2i+iDoKV0g7IPLPqYigohgw5dOvUFdQmCjh2joLp3iYwIx5LYQx9Eo2mHjEi2UezrEBhUYrq4M0+HMmJ2dHZb/7f5/9/n/T0vM+8zQogyS1JzxiTejHAYSAGzgRFgCOExnt62BroehNVGSYKGvTTdguoVYN7UpepgzDEr6/T9F1BB7ifqr6vI8RLqfwjSvMd1HpYMtBPpy4ieKgE2oRGMbLWyzouigW2Jhp0i/Nc7ARBlMD7z56odvb0jUWvNo7rNlSLcCMk8Fa6KmtWj7qJYPl9Zg8oB4G1woQp1uZHq00U1ZyfrD4G0FmyCHt3rdt0M+pklqTljM+IZlHWB6NOou6iumVZvKqBBpCWkjzthMICmgZfffV9agHwgqq1Mfgg2EQJUVgdNVe/6VEX7+h1XkPsh0dpoINQGzXycV1GFKtpT6MrCYoAFl79avIpIoIopwKHDxQCzQXM8X7ElqlBENxV4ap4WA8wUuKoX7AWp6smK2pPpHSjbAvZQT7/TGQlU39wK8ZdLdfze3cSG+cGgLVm/T/HDal5fBD8KKAB2It2O6O6QfAyhQ5B+Vb8KpBFYNclew0Zo2v2usysS+CC5IeHhdwM1UR1GyAdaxXjn92S7ByYFArQl042CdgBVZUIBvoKxLPe5Ewz/ftp7XeeJqG4EPkwDcB74mbal9QeDQcEdvL1y86yq3NhZ4AQwN2SzUeA9kADiUWQVrsa05twutyMXCpxQTyoV//KtYpuKrlGoFeE7qn2Gua273I5c+7L1G9WPvnd/jtXt+d7B/f3dHycFFiM72fAYaCyKqQzm8TYVjKeSZOQI4Eas8uD3PzNmYifLAlpZ5/N4zG8AHoXlAuMouYlnVV1c3gmBA30vvs6qrdwOconApFEVg/DviHxT1jsMyk42WMAtIGwO/8DIirJP+K8st9MWlSZgKBANC9JsZZ3P03rCCdnL0gvx9QywQqFX/Ng1a+DZdAyU0vULpbYDsUbb/soAAAAASUVORK5CYII=";
const MAG_SELECTOR = '.artwork-carousel-slide, .artwork-img, .artwork-lightbox-img';
const MAG_HOTSPOT = '14 14';

function magShorthand(url) {
  return `url("${url}") ${MAG_HOTSPOT}, zoom-in`;
}

/* Rotate a PNG data URL around its centre by `deg` and resolve to a new
   data URL. Used to tilt the artwork magnifying-glass cursor while held. */
function rotateDataUrlImage(dataUrl, deg) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const size = img.naturalWidth || 28;
      const out = Math.ceil(size * Math.SQRT2) + 2;
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = out;
      const ctx = canvas.getContext('2d');
      ctx.translate(out / 2, out / 2);
      ctx.rotate((deg * Math.PI) / 180);
      ctx.drawImage(img, -size / 2, -size / 2);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => resolve(null);
    img.src = dataUrl;
  });
}

function magBase64(dark) {
  return dark ? MAG_DARK_B64 : MAG_LIGHT_B64;
}

function magClickRotationKey(dark, deg) {
  const prefix = dark ? MAG_DARK_B64 : MAG_LIGHT_B64;
  return prefix.slice(0, 12) + ':' + deg;
}

const magRotationCache = new Map();

/* Apply the click "press" tilt (CURSOR_CLICK_DEG) to the magnifying-glass
   cursor as a data URL, cached per theme + degree. */
function rotatedMagCursor(deg, dark) {
  const key = magClickRotationKey(dark, deg);
  if (magRotationCache.has(key)) {
    return Promise.resolve(magShorthand(magRotationCache.get(key)));
  }
  return rotateDataUrlImage('data:image/png;base64,' + magBase64(dark), deg).then(url => {
    if (!url) return magShorthand(magBase64(dark));
    magRotationCache.set(key, url);
    return magShorthand(url);
  });
}

let magCursorEl = null;

function initMagCursorRotation() {
  document.addEventListener('mousedown', (e) => {
    if (!e.target || !e.target.closest || !e.target.closest(MAG_SELECTOR)) return;
    const dark = document.body.classList.contains('dark-mode');
    rotatedMagCursor(CURSOR_CLICK_DEG, dark).then(cur => {
      if (magCursorEl && magCursorEl !== e.target) magCursorEl.style.cursor = '';
      magCursorEl = e.target;
      magCursorEl.style.cursor = cur;
    });
  });
  document.addEventListener('mouseup', () => {
    if (magCursorEl) {
      magCursorEl.style.cursor = '';
      magCursorEl = null;
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  applySwordCursor();
  initCursorClickRotation();
  initMagCursorRotation();
});