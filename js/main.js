/**
* Handles the glowing effect that follows the mouse cursor.
*/
const mouse_glow = document.getElementById("MouseGlow");
window.addEventListener("mousemove", (event) => {
  const scroll_x = window.scrollX || window.pageXOffset;
  const scroll_y = window.scrollY || window.pageYOffset;

  const mouse_x = event.pageX;
  const mouse_y = event.pageY;

  mouse_glow.animate(
    {left: `${mouse_x}px`, top: `${mouse_y}px`},
    {duration: 3500, fill: "forwards"}
  );
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
