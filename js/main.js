const mouse_glow = document.getElementById("MouseGlow");
const canvas = document.getElementById("Matrix");
const canvas_context = canvas.getContext("2d");

let is_effect_on = false;
let animation_frame_id;
const font_size = 16;
let columns, drops;

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

window.addEventListener("resize", () => {
  if (is_effect_on) {
    SetupCanvas();
  }
});

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
