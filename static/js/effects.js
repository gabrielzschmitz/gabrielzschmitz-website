/**
 * Portfolio "effects": Matrix rain canvas, Minecraft-style mouse-follow cube,
 * and the disable-JS teapot joke. Every hook is guarded so this file can also
 * load on blog pages (which have no #matrix-canvas / .cube-stage).
 */
let isEffectOn = false;
let animationFrameId;
let canvas, canvasCtx;
let columns, drops;
const fontSize = 16;

const MATRIX_CONFIG = {
  speed: 2.5,       // rows advanced per frame (higher = faster)
  trail: 4,         // glyphs in each falling trail
  resetChance: 0.99 // chance to reset a column once it passes the bottom
};

function setupCanvas() {
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  const fullHeight = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight
  );
  canvas.width = window.innerWidth * dpr;
  canvas.height = fullHeight * dpr;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${fullHeight}px`;
  canvasCtx = canvas.getContext('2d');
  canvasCtx.scale(dpr, dpr);
  canvasCtx.font = `${fontSize}px monospace`;
  canvasCtx.textBaseline = 'top';
  columns = Math.floor(window.innerWidth / fontSize);
  drops = new Array(columns).fill(0);
}

function drawMatrix() {
  if (!isEffectOn) return;

  const bg = getCSSVar('--bg-color');
  const fg = getCSSVar('--text-subtle');

  canvasCtx.fillStyle = bg;
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
  canvasCtx.fillStyle = fg;
  canvasCtx.font = `${fontSize}px monospace`;

  for (let i = 0; i < drops.length; i++) {
    /* draw a vertical trail of glyphs per column for a denser rain */
    for (let k = 0; k < MATRIX_CONFIG.trail; k++) {
      const text = String.fromCharCode(0x30A0 + Math.random() * 96);
      canvasCtx.fillText(
        text,
        i * fontSize,
        (drops[i] - k) * fontSize
      );
    }
    if (drops[i] * fontSize > canvas.height && Math.random() > MATRIX_CONFIG.resetChance) {
      drops[i] = 0;
    }
    drops[i] += MATRIX_CONFIG.speed;
  }

  animationFrameId = requestAnimationFrame(drawMatrix);
}

function toggleMatrixEffect() {
  if (!canvas) return;
  isEffectOn = !isEffectOn;

  if (isEffectOn) {
    setupCanvas();
    drawMatrix();
  } else {
    cancelAnimationFrame(animationFrameId);
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

/* Minecraft cube */
let cubeActive = false;
let cubeX = 0;
let cubeY = 0;

let cubeCssLoaded = false;

function loadCubeCss() {
  if (cubeCssLoaded) return;
  cubeCssLoaded = true;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/css/effects/cube.css';
  document.head.appendChild(link);
}

function toggleMinecraft() {
  const cube = document.querySelector('.cube-stage');
  if (!cube) return;
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

document.addEventListener('DOMContentLoaded', () => {
  /* --- Matrix canvas --- */
  canvas = document.getElementById('matrix-canvas');
  if (canvas) {
    canvas.style.pointerEvents = 'none';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '0';
  }

  /* --- Minecraft cube mouse-follow --- */
  const cube = document.querySelector('.cube-stage');
  document.addEventListener('mousemove', (e) => {
    cubeX = e.clientX + 20;
    cubeY = e.clientY - 5;
    if (cubeActive && cube) {
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

window.addEventListener('resize', () => {
  if (isEffectOn) {
    setupCanvas();
  }
});

/* ASCII Warning Message in the Console */
console.log(`
%cHacking detected...\nInitializing firewall defense. 🛡️
%cJust kidding, happy coding! :)
`, 'color: indianred; font-weight: bold;', 'color: seagreen; font-weight: bold;');

/* Function to Simulate Disabling JavaScript */
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

/* Function to Restore the Page */
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