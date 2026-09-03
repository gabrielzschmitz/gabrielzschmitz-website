/**
 * Dark/Light Theme
 */
function getCSSVar(name) {
  return getComputedStyle(document.body).getPropertyValue(name).trim();
}

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
    'button', '[data-resume]', '[data-en]', '#theme-toggle', '#language-toggle'
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

function applyTheme(isDark) {
  document.body.classList.toggle('dark-mode', isDark);
  localStorage.setItem('newspaper-theme', isDark ? 'dark' : 'light');
  applySwordCursor();
}

/**
 * Matrix effect
 */
let is_effect_on = false;
let animation_frame_id;
let canvas, canvas_context;
let columns, drops;
const font_size = 16;

const MATRIX_CONFIG = {
  speed: 2.5,       // rows advanced per frame (higher = faster)
  trail: 4,         // glyphs in each falling trail
  resetChance: 0.99 // chance to reset a column once it passes the bottom
};

function SetupCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const fullHeight = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight
  );
  canvas.width = window.innerWidth * dpr;
  canvas.height = fullHeight * dpr;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${fullHeight}px`;
  canvas_context = canvas.getContext('2d');
  canvas_context.scale(dpr, dpr);
  canvas_context.font = `${font_size}px monospace`;
  canvas_context.textBaseline = 'top';
  columns = Math.floor(window.innerWidth / font_size);
  drops = new Array(columns).fill(0);
}

function DrawMatrix() {
  if (!is_effect_on) return;

  const bg = getCSSVar('--bg-color');
  const fg = getCSSVar('--text-subtle');

  canvas_context.fillStyle = bg;
  canvas_context.fillRect(0, 0, canvas.width, canvas.height);
  canvas_context.fillStyle = fg;
  canvas_context.font = `${font_size}px monospace`;

  for (let i = 0; i < drops.length; i++) {
    /* draw a vertical trail of glyphs per column for a denser rain */
    for (let k = 0; k < MATRIX_CONFIG.trail; k++) {
      const text = String.fromCharCode(0x30A0 + Math.random() * 96);
      canvas_context.fillText(
        text,
        i * font_size,
        (drops[i] - k) * font_size
      );
    }
    if (drops[i] * font_size > canvas.height && Math.random() > MATRIX_CONFIG.resetChance) {
      drops[i] = 0;
    }
    drops[i] += MATRIX_CONFIG.speed;
  }

  animation_frame_id = requestAnimationFrame(DrawMatrix);
}

function toggleMatrixEffect() {
  is_effect_on = !is_effect_on;

  if (is_effect_on) {
    SetupCanvas();
    DrawMatrix();
  } else {
    cancelAnimationFrame(animation_frame_id);
    canvas_context.clearRect(0, 0, canvas.width, canvas.height);
  }
}

/**
 * Minecraft cube
 */
let cubeActive = false;
let cubeX = 0;
let cubeY = 0;

let cubeCssLoaded = false;

function loadCubeCss() {
  if (cubeCssLoaded) return;
  cubeCssLoaded = true;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = './css/cube.css';
  document.head.appendChild(link);
}

function toggleMinecraft() {
  const cube = document.querySelector('.cube-stage');
  cubeActive = !cubeActive;
  if (cubeActive) loadCubeCss();

  if (cubeActive) {
    cube.style.display = 'block';
    cube.style.left = `${cubeX}px`;
    cube.style.top = `${cubeY}px`;
  } else {
    cube.style.display = 'none';
  }
}

/**
 * Initialize everything once the DOM is ready.
 */
document.addEventListener('DOMContentLoaded', () => {
  /* --- Theme --- */
  const modeSeal = document.getElementById('theme-toggle');
  const saved = localStorage.getItem('newspaper-theme')
    || localStorage.getItem('theme')
    || 'light';
  applyTheme(saved === 'dark');
  initCursorClickRotation();

  if (modeSeal) {
    modeSeal.addEventListener('click', () => {
      applyTheme(!document.body.classList.contains('dark-mode'));
    });
  }

  /* --- Matrix canvas --- */
  canvas = document.getElementById('matrix-canvas');
  canvas.style.pointerEvents = 'none';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.zIndex = '0';

  /* --- Minecraft cube mouse-follow --- */
  const cube = document.querySelector('.cube-stage');
  document.addEventListener('mousemove', (e) => {
    cubeX = e.clientX + 20;
    cubeY = e.clientY - 5;
    if (cubeActive) {
      cube.style.left = `${cubeX}px`;
      cube.style.top = `${cubeY}px`;
    }
  });

  /* --- cube-toggle / matrix-toggle (delegated so the inline spans keep
       working after the language innerHTML swap in lang.js) --- */
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest && e.target.closest('#cube-toggle, #matrix-toggle');
    if (!trigger) return;
    if (trigger.id === 'cube-toggle') {
      toggleMinecraft();
    } else {
      toggleMatrixEffect();
    }
  });
});

/**
 * Resize matrix canvas when window resizes.
 */
window.addEventListener('resize', () => {
  if (is_effect_on) {
    SetupCanvas();
  }
});

/**
 * ASCII Warning Message in the Console
 */
console.log(`
%cHacking detected...\nInitializing firewall defense. 🛡️
%cJust kidding, happy coding! :)
`, 'color: indianred; font-weight: bold;', 'color: seagreen; font-weight: bold;');

/**
 * Function to Simulate Disabling JavaScript
 */
function disableJS() {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.zIndex = '9999';
  overlay.style.fontSize = '24px';
  overlay.style.color = 'white';
  overlay.style.background = 'rgb(13, 13, 13)';
  overlay.innerHTML = "Error 418: I'm a teapot <span id='Teapot' style='cursor: pointer; margin-left: 10px;'>🫖</span>";
  document.body.appendChild(overlay);

  /* Hide the rest of the page */
  document.body.style.overflow = 'hidden';
  Array.from(document.body.children).forEach(child => {
    if (child !== overlay) {
      child.style.display = 'none';
    }
  });

  console.log(`
  %cYou found the teapot!...\n
  %cNow you're cursed forever! 🧿
  `, 'color: lightblue; font-weight: bold;', 'color: cornflowerblue; font-weight: bold;');

  /* Restore the page if the teapot emoji is clicked */
  document.getElementById('Teapot').addEventListener('click', enableJS);
}

/**
 * Function to Restore the Page
 */
function enableJS() {
  const teapot = document.getElementById('Teapot');
  if (!teapot) {
    console.warn('Teapot vanished into the void! 🌀');
    return;
  }
  const overlay = teapot.parentElement;
  if (overlay) overlay.remove();
  document.body.style.overflow = '';
  Array.from(document.body.children).forEach(child => {
    child.style.display = '';
  });
  console.log(`
  %cTeapot broken!...\n
  %cNow your curse is broken! 🔮
  `, 'color: lightblue; font-weight: bold;', 'color: mediumpurple; font-weight: bold;');
}
