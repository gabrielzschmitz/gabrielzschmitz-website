const mouse_glow = document.getElementById("MouseGlow");
const canvas = document.getElementById("Matrix");
const canvas_context = canvas.getContext("2d");

/**
* Handles the hidden matrix effect.
*/

let is_effect_on = false;
let animation_frame_id;
const font_size = 16;
let columns, drops;

/**
* Handle background Canvas to Matrix effect.
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

/**
* Matrix effect.
*/
function DrawMatrix() {
  if (!is_effect_on) return;

  canvas_context.fillStyle = "rgba(26, 26, 26, 0.25)";
  canvas_context.fillRect(0, 0, canvas.width, canvas.height);
  canvas_context.fillStyle = "dimgray";
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

/**
* Logic to toggle matrix effect.
*/
document.getElementById("cryptoToggle").addEventListener("click", () => {
  is_effect_on = !is_effect_on;
  if (is_effect_on) {
    mouse_glow.classList.add('hidden');
    SetupCanvas();
    DrawMatrix();
  } else {
    mouse_glow.classList.remove('hidden');
    cancelAnimationFrame(animation_frame_id);
    canvas_context.clearRect(0, 0, canvas.width, canvas.height);
  }
});

/**
* Make canvas resize when window resize.
*/
window.addEventListener("resize", () => {
  if (is_effect_on) {
    SetupCanvas();
  }
});

/******************************************************************************/

/**
* ASCII Warning Message in the Console
*/
console.log(`
%cHacking detected...\nInitializing firewall defense. 🛡️
%cJust kidding, happy coding! :)
`, "color: indianred; font-weight: bold;", "color: seagreen; font-weight: bold;");

/**
* Function to Simulate Disabling JavaScript
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
  overlay.style.background = "rgb(26, 26, 26)";
  overlay.innerHTML = "Error 418: I'm a teapot <span id='teapot' style='cursor: pointer; margin-left: 10px;'>🫖</span>";
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
  document.getElementById("teapot").addEventListener("click", enableJS);
}

/**
* Function to Restore the Page
*/
function enableJS() {
  const teapot = document.getElementById("teapot");
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

/******************************************************************************/

/**
* Handles the glowing effect that follows the mouse cursor.
*/
window.addEventListener("mousemove", (event) => {
  if (!is_effect_on) {
    const scroll_x = window.scrollX || window.pageXOffset;
    const scroll_y = window.scrollY || window.pageYOffset;

    const mouse_x = event.pageX;
    const mouse_y = event.pageY;

    mouse_glow.animate(
      {left: `${mouse_x}px`, top: `${mouse_y}px`},
      {duration: 3500, fill: "forwards"}
    );
  }
});

/******************************************************************************/

/**
* Scrollspy logic to highlight the active section in the navigation.
*/
const right_panel = document.getElementById("RightPanel");
const nav_items = document.querySelectorAll(".NavItem");
const sections = document.querySelectorAll(".Section");

/**
* Determines which section is currently visible and highlights the corresponding
* nav item.
*/
function SetActiveSection() {
  const scrollPosition = right_panel.scrollTop;
  const scrollHeight = right_panel.scrollHeight;
  const clientHeight = right_panel.clientHeight;

  const isNearBottom = scrollHeight - (scrollPosition + clientHeight) < 50;

  if (isNearBottom) {
    nav_items.forEach((item) => item.classList.remove("Active"));
    nav_items[nav_items.length - 1].classList.add("Active");
    return;
  }

  let index = sections.length;
  while (--index && scrollPosition + 125 < sections[index].offsetTop) {}
  nav_items.forEach((item) => item.classList.remove("Active"));
  nav_items[index].classList.add("Active");
}

/**
* Scrolls smoothly to the selected section when a nav item is clicked.
*/
function ScrollToSection(event) {
  const section_id = event.currentTarget.getAttribute("DataSection");
  const target_section = document.getElementById(section_id);
  right_panel.scrollTo({
    top: target_section.offsetTop - window.innerHeight * 0.05,
    behavior: "smooth"
  });
}

nav_items.forEach(item => item.addEventListener("click", ScrollToSection));
right_panel.addEventListener("scroll", SetActiveSection);
SetActiveSection();

/******************************************************************************/

/**
* Projects list logic - Animates project text by scrambling characters when
* hovered.
*/
const projects = document.querySelectorAll(".Project");
const letters = "abcdefghijklmnopqrstuvwxyz0123456789";

projects.forEach(project => {
  project.addEventListener("mouseenter", event => {
    event.target.querySelectorAll("p").forEach(text => {
      let iteration = 0;
      let interval = setInterval(() => {
        text.innerText = text.innerText.split("")
          .map((letter, index) => {
            if (index < iteration || text.dataset.value[index] === " ") {
              return text.dataset.value[index];
            }
            return letters[Math.floor(Math.random() * letters.length)];
          })
          .join("");
        if (iteration >= text.dataset.value.length) {
          clearInterval(interval);
        }
        iteration += 1;
      }, 30);
    });
  });
});
