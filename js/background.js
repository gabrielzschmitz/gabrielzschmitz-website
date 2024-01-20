const element = document.querySelector("body");
let currentX = 0;
let currentY = 0;

element.addEventListener("mousemove", (mouse) => {
  currentX = lerp(currentX, -mouse.offsetX, 0.001);
  currentY = lerp(currentY, -mouse.offsetY, 0.001);

  element.style.setProperty("--x", currentX + "px");
  element.style.setProperty("--y", currentY + "px");
});

function lerp(a, b, n) {
  return (1 - n) * a + n * b;
}
