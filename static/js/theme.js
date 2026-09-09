/**
 * Dark/Light theme toggle.
 * Shared by the portfolio (/) and every blog page (extends base.html).
 * The saved preference is applied pre-paint by an inline script in the
 * templates' <head>; this module only binds the #theme-toggle control and
 * keeps the persisted value in sync.
 */
function getCSSVar(name) {
  return getComputedStyle(document.body).getPropertyValue(name).trim();
}

function applyTheme(isDark) {
  document.body.classList.toggle('dark-mode', isDark);
  document.documentElement.classList.toggle('dark-mode', isDark);
  localStorage.setItem('newspaper-theme', isDark ? 'dark' : 'light');
  if (window.applySwordCursor) window.applySwordCursor();
}

document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('newspaper-theme')
    || localStorage.getItem('theme')
    || 'light';
  applyTheme(saved === 'dark');

  const modeCtrl = document.getElementById('theme-toggle');
  if (!modeCtrl) return;
  modeCtrl.addEventListener('click', () => {
    applyTheme(!document.body.classList.contains('dark-mode'));
  });
});