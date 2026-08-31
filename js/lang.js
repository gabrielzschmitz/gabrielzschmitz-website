/**
 * Logic to cycle website text language.
 */
document.addEventListener("DOMContentLoaded", () => {
  const languageCycle = document.getElementById("LanguageCycle");
  const elements = document.querySelectorAll("[data-en]");
  let isEnglish = true;

  function updateCVLinks() {
    const cvLinks = document.querySelectorAll("[data-cv]");
    cvLinks.forEach(link => {
      link.href = isEnglish ? "./resume/resume.pdf" : "./resume/curriculo.pdf";
    });
  }

  updateCVLinks();

  languageCycle.addEventListener("click", () => {
    languageCycle.innerHTML = isEnglish ? '<i class="fi fi-us"></i>' : '<i class="fi fi-br"></i>';

    elements.forEach(el => {
      const temp = el.innerHTML;
      el.innerHTML = el.getAttribute(isEnglish ? "data-pt" : "data-en");
      el.setAttribute(isEnglish ? "data-en" : "data-pt", temp);
    });

    isEnglish = !isEnglish;
    updateCVLinks();
  });
});