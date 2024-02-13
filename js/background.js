const element = document.querySelector("body");
let currentX = 0;
let currentY = 0;

// Mouse move event listener
element.addEventListener("mousemove", (mouse) => {
  updateCoordinates(-mouse.offsetX, -mouse.offsetY);
});

// Touch move event listener
element.addEventListener("touchmove", (touch) => {
  const touchX = touch.touches[0].clientX;
  const touchY = touch.touches[0].clientY;
  updateCoordinates(touchX, touchY);
});

function updateCoordinates(x, y) {
  currentX = lerp(currentX, x, 0.001);
  currentY = lerp(currentY, y, 0.001);

  element.style.setProperty("--x", currentX + "px");
  element.style.setProperty("--y", currentY + "px");
}

function lerp(a, b, n) {
  return (1 - n) * a + n * b;
}
