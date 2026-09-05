/**
 * Logic to cycle website text language.
 */
document.addEventListener("DOMContentLoaded", () => {
  const languageCycle = document.getElementById("language-toggle");
  const elements = document.querySelectorAll("[data-en]");
  let isEnglish = (localStorage.getItem("newspaper-lang") || "en") !== "pt";

  function updateCVLinks() {
    const cvLinks = document.querySelectorAll("[data-resume]");
    cvLinks.forEach(link => {
      link.href = isEnglish ? "./assets/resume/resume.pdf" : "./assets/resume/curriculo.pdf";
    });
  }

  function applyLanguage() {
    updateCVLinks();
    elements.forEach(el => {
      const temp = el.innerHTML;
      el.innerHTML = el.getAttribute(isEnglish ? "data-en" : "data-pt");
      el.setAttribute(isEnglish ? "data-pt" : "data-en", temp);
    });
  }

  function setFlag() {
    const flag = document.getElementById("language-flag");
    if (flag) flag.outerHTML = isEnglish ? FLAG_BR : FLAG_US;
  }

  const FLAG_US = '<svg class="flag-icon" id="language-flag" viewBox="0 0 30 20" width="27" height="18" aria-hidden="true">' +
    '<rect width="30" height="20" fill="#fff"></rect>' +
    '<g fill="#b22234">' +
    '<rect y="0" width="30" height="1.54"/><rect y="3.08" width="30" height="1.54"/>' +
    '<rect y="6.15" width="30" height="1.54"/><rect y="9.23" width="30" height="1.54"/>' +
    '<rect y="12.31" width="30" height="1.54"/><rect y="15.38" width="30" height="1.54"/>' +
    '<rect y="18.46" width="30" height="1.54"/>' +
    '</g><rect width="12" height="10.78" fill="#3c3b6e"></rect>' +
    '<g fill="#fff">' +
    '<circle cx="1.6" cy="1.35" r="0.55"/><circle cx="4.1" cy="1.35" r="0.55"/><circle cx="6.6" cy="1.35" r="0.55"/><circle cx="9.1" cy="1.35" r="0.55"/><circle cx="11.6" cy="1.35" r="0.55"/>' +
    '<circle cx="2.85" cy="4.05" r="0.55"/><circle cx="5.35" cy="4.05" r="0.55"/><circle cx="7.85" cy="4.05" r="0.55"/><circle cx="10.35" cy="4.05" r="0.55"/>' +
    '<circle cx="1.6" cy="6.75" r="0.55"/><circle cx="4.1" cy="6.75" r="0.55"/><circle cx="6.6" cy="6.75" r="0.55"/><circle cx="9.1" cy="6.75" r="0.55"/><circle cx="11.6" cy="6.75" r="0.55"/>' +
    '<circle cx="2.85" cy="9.45" r="0.55"/><circle cx="5.35" cy="9.45" r="0.55"/><circle cx="7.85" cy="9.45" r="0.55"/><circle cx="10.35" cy="9.45" r="0.55"/>' +
    '</g></svg>';

  const FLAG_BR = '<svg class="flag-icon" id="language-flag" viewBox="0 0 30 20" width="27" height="18" aria-hidden="true">' +
    '<rect width="30" height="20" fill="#009c3b"></rect>' +
    '<polygon points="15,1 29,10 15,19 1,10" fill="#ffdf00"></polygon>' +
    '<circle cx="15" cy="10" r="6.5" fill="#002776"></circle>' +
    '<path d="M8.8 9 Q15 11.6 21.2 9 L21.2 11.6 Q15 14.2 8.8 11.6 Z" fill="#fff"></path>' +
    '<circle cx="10" cy="7.6" r="0.6" fill="#fff"></circle>' +
    '<circle cx="20" cy="7.6" r="0.6" fill="#fff"></circle>' +
    '<circle cx="13" cy="5.9" r="0.6" fill="#fff"></circle>' +
    '<circle cx="17" cy="13.5" r="0.6" fill="#fff"></circle>' +
    '<circle cx="14.5" cy="14.5" r="0.6" fill="#fff"></circle>' +
    '</svg>';

  setFlag();
  if (!isEnglish) {
    applyLanguage();
  } else {
    updateCVLinks();
  }

  languageCycle.addEventListener("click", () => {
    isEnglish = !isEnglish;
    localStorage.setItem("newspaper-lang", isEnglish ? "en" : "pt");

    setFlag();
    applyLanguage();
    document.dispatchEvent(new CustomEvent("languagechange", { detail: { isEnglish } }));

    /* Re-apply theme-colored sword cursor to recreated elements */
    applySwordCursor();
  });
});