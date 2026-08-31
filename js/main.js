/**
 * Dark/Light Theme
 */
function applyTheme(isDark) {
  document.body.classList.toggle('dark-mode', isDark);
  localStorage.setItem('neocities-theme', isDark ? 'dark' : 'light');
}

document.addEventListener('DOMContentLoaded', () => {
  const modeSeal = document.getElementById('ModeToggle');
  const saved = localStorage.getItem('neocities-theme')
    || localStorage.getItem('theme')
    || 'light';

  applyTheme(saved === 'dark');

  if (modeSeal) {
    modeSeal.addEventListener('click', () => {
      applyTheme(!document.body.classList.contains('dark-mode'));
    });
  }
});

/**
 * Minecraft cube
 */
function toggleMinecraft() {
  const cube = document.querySelector(".Minecraft");

  if (cube.style.display === "none" || cube.style.display === "") {
    cube.style.display = "block";
    mouse_glow.classList.add("hidden");
    mouse_glow_blur.classList.add("hidden");
  } else {
    cube.style.display = "none";
    mouse_glow.classList.remove("hidden");
    mouse_glow_blur.classList.remove("hidden");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("MinecraftToggle");
  toggleButton.addEventListener("click", toggleMinecraft);
});

/**
* Matrix effect
*/
function SetupCanvas() {
  const dpr = window.devicePixelRatio || 1;

  const fullHeight = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight
  );
  canvas.width = window.innerWidth + dpr;
  canvas.height = (fullHeight + font_size) * dpr;

  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${fullHeight}px`;

  canvas_context.scale(dpr, dpr);
  canvas_context.font = `${font_size}px monospace`;
  canvas_context.textBaseline = "top";

  columns = Math.floor(window.innerWidth / font_size);
  drops = new Array(columns).fill(0);
}

function DrawMatrix() {
  if (!is_effect_on) return;

  canvas_context.fillStyle = "rgb(13, 13, 13)";
  canvas_context.fillRect(0, 0, canvas.width, canvas.height);
  canvas_context.fillStyle = "#d2c8b6";
  canvas_context.font = `${font_size}px monospace`;

  for (let i = 0; i < drops.length; i++) {
    let text = String.fromCharCode(0x30A0 + Math.random() * 96);
    canvas_context.fillText(text, i * font_size, drops[i] * font_size);
    if (drops[i] * font_size > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }

  animation_frame_id = requestAnimationFrame(DrawMatrix);
}

function toggleMatrixEffect() {
  is_effect_on = !is_effect_on;

  if (is_effect_on) {
    // Hide mouse glow effects
    mouse_glow.classList.add("hidden");
    mouse_glow_blur.classList.add("hidden");

    // Initialize and start the Matrix effect
    SetupCanvas();
    DrawMatrix();
  } else {
    // Show mouse glow effects
    mouse_glow.classList.remove("hidden");
    mouse_glow_blur.classList.remove("hidden");

    // Stop the Matrix effect
    cancelAnimationFrame(animation_frame_id);
    canvas_context.clearRect(0, 0, canvas.width, canvas.height);
  }
}

document.getElementById("CryptoToggle").addEventListener("click", toggleMatrixEffect);

/**
 * ASCII Warning Message in the Console
 */
console.log(`
%cHacking detected...\nInitializing firewall defense. 🛡️
%cJust kidding, happy coding! :)
`, "color: indianred; font-weight: bold;", "color: seagreen; font-weight: bold;");

/**
 * Simulate Disabling JavaScript
 */
function disableJS() {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.zIndex = "9999";
  overlay.style.fontSize = "24px";
  overlay.style.color = "white";
  overlay.style.background = "rgb(13, 13, 13)";
  overlay.innerHTML = "Error 418: I'm a teapot <span id='Teapot' style='cursor: pointer; margin-left: 10px;'>🫖</span>";
  document.body.appendChild(overlay);

  /* Hide the rest of the page */
  document.body.style.overflow = "hidden";
  Array.from(document.body.children).forEach(child => {
    if (child !== overlay) {
      child.style.display = "none";
    }
  });

  console.log(`
  %cYou found the teapot!...\n
  %cNow you're cursed forever! 🧿
  `, "color: lightblue; font-weight: bold;", "color: cornflowerblue; font-weight: bold;");

  /* Restore the page if the teapot emoji is clicked */
  document.getElementById("Teapot").addEventListener("click", enableJS);
}

/**
 * Restore the Page
 */
function enableJS() {
  const teapot = document.getElementById("Teapot");
  if (!teapot) {
    console.warn("Teapot vanished into the void! 🌀");
    return;
  }
  const overlay = teapot.parentElement;
  if (overlay) overlay.remove();
  document.body.style.overflow = "";
  Array.from(document.body.children).forEach(child => {
    child.style.display = "";
  });
  console.log(`
  %cTeapot broken!...\n
  %cNow your curse is broken! 🔮
  `, "color: lightblue; font-weight: bold;", "color: mediumpurple; font-weight: bold;");
}
