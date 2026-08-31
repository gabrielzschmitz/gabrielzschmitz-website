/**
 * Dark/Light Theme
 */
function getCSSVar(name) {
  return getComputedStyle(document.body).getPropertyValue(name).trim();
}

function applyTheme(isDark) {
  document.body.classList.toggle('dark-mode', isDark);
  localStorage.setItem('newspaper-theme', isDark ? 'dark' : 'light');
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
let cubeX = window.innerWidth / 2;
let cubeY = window.innerHeight / 2;

function toggleMinecraft() {
  const cube = document.querySelector('.Minecraft');
  cubeActive = !cubeActive;

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
  const modeSeal = document.getElementById('ModeToggle');
  const saved = localStorage.getItem('newspaper-theme')
    || localStorage.getItem('theme')
    || 'light';
  applyTheme(saved === 'dark');

  if (modeSeal) {
    modeSeal.addEventListener('click', () => {
      applyTheme(!document.body.classList.contains('dark-mode'));
    });
  }

  /* --- Matrix canvas --- */
  canvas = document.getElementById('Matrix');
  canvas.style.pointerEvents = 'none';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.zIndex = '0';

  /* --- Minecraft cube mouse-follow --- */
  const cube = document.querySelector('.Minecraft');
  document.addEventListener('mousemove', (e) => {
    cubeX = e.clientX + 10;
    cubeY = e.clientY - 10;
    if (cubeActive) {
      cube.style.left = `${cubeX}px`;
      cube.style.top = `${cubeY}px`;
    }
  });

  /* --- MinecraftToggle --- */
  const minecraftButton = document.getElementById('MinecraftToggle');
  if (minecraftButton) {
    minecraftButton.addEventListener('click', toggleMinecraft);
  }

  /* --- CryptoToggle --- */
  const cryptoButton = document.getElementById('CryptoToggle');
  if (cryptoButton) {
    cryptoButton.addEventListener('click', toggleMatrixEffect);
  }
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
