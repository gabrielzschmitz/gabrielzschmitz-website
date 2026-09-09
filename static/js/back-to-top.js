/**
 * "Back to top" floating seal (blog/post pages only). Shown after scrolling
 * past a threshold; clicking smooth-scrolls to the top of the page.
 */
document.addEventListener('DOMContentLoaded', () => {
  const topBtn = document.getElementById('back-to-top');
  if (!topBtn) return;

  topBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const THRESHOLD = 1000;
  function toggle() {
    topBtn.hidden = (window.scrollY || document.documentElement.scrollTop) < THRESHOLD;
  }
  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
});