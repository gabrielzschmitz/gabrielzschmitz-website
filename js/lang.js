/**
* Logic to cycle website text language.
*/
document.addEventListener("DOMContentLoaded", () => {
  const languageCycle = document.getElementById("LanguageCycle");
  const elements = document.querySelectorAll("[data-en]");
  let isEnglish = true;

  languageCycle.addEventListener("click", () => {
    languageCycle.innerHTML = isEnglish ? '<i class="fi fi-us">' : '<i class="fi fi-br">';

    elements.forEach(el => {
      const temp = el.innerHTML;
      el.innerHTML = el.getAttribute(isEnglish ? "data-pt" : "data-en");
      el.setAttribute(isEnglish ? "data-en" : "data-pt", temp);

      /* Update the data-value attribute for <p> elements */
      if (el.tagName === "P" && el.hasAttribute("data-value")) {
        const newValue = el.getAttribute(isEnglish ? "data-pt" : "data-en");
        el.setAttribute("data-value", newValue);
      }
    });

    isEnglish = !isEnglish;

	/* Readd the MinecraftToggle button */
    const minecraftButton = document.getElementById("MinecraftToggle");
	if (minecraftButton) {
      minecraftButton.addEventListener("click", toggleMinecraft);
	} else {
	  console.error("MinecraftToggle button not found!");
	}

	/* Readd the CryptoToggle button */
    const cryptoButton = document.getElementById("CryptoToggle");
	if (cryptoButton) {
      cryptoButton.addEventListener("click", toggleMatrixEffect);
	} else {
	  console.error("CryptoToggle button not found!");
	}
  });
});
