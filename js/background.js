const element = document.querySelector("body");
let currentX = 0;
let currentY = 0;

// Mouse move event listener
element.addEventListener("mousemove", (mouse) => {
  updateCoordinates(-mouse.clientX, -mouse.clientY);
});

// Touch move event listener
element.addEventListener("touchmove", (touch) => {
  const touchX = touch.touches[0].clientX;
  const touchY = touch.touches[0].clientY;
  updateCoordinates(-touchX, -touchY);
});

// Scroll event listener
window.addEventListener("scroll", () => {
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  updateCoordinates(currentX, currentY - scrollY);
});

function updateCoordinates(x, y) {
  currentX = lerp(currentX, x, 0.01);
  currentY = lerp(currentY, y, 0.01);

  element.style.setProperty("--x", currentX + "px");
  element.style.setProperty("--y", currentY + "px");
}

function lerp(a, b, n) {
  return (1 - n) * a + n * b;
}
