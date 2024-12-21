(() => {
  "use strict";

  let CURRENT_LANG;
  const translations = {};

  // Function to fetch translations for a specific language
  async function fetchTranslations(selectedLanguage) {
    try {
      const response = await fetch(`/_locales/${selectedLanguage}/messages.json`);
      const translationsData = await response.json();
      translations[selectedLanguage] = translationsData;
    } catch (error) {
      console.error(`Error fetching translations for ${selectedLanguage}:`, error);
    }
  }

  // Function to set language and update translations
  function setLanguage(selectedLanguage) {
    const items = document.querySelectorAll("[data-i18n]");
    for (let item of items) {
      const translationKey = item.getAttribute("data-i18n");
      const translation = translations[selectedLanguage]?.[translationKey]?.message;

      if (translation?.length) {
        if (item.value === "i18n") {
          item.value = translation;
        } else {
          item.innerText = translation;
        }
      }
    }
  }

  // Function to update URL without reloading
  function updateURLLang(selectedLanguage) {
    const currentPath = window.location.pathname;
  
    // Match and replace the language code in the path, regardless of the structure
    const newPath = currentPath.replace(/\/[a-z]{2}(?=\/|$)/, `/${selectedLanguage}`);
    
    if (currentPath !== newPath) {
      history.pushState(null, "", newPath);
    } else if (!/\/[a-z]{2}(?=\/|$)/.test(currentPath)) {
      // If no language code exists, prepend it
      const base = currentPath.startsWith("/") ? currentPath : `/${currentPath}`;
      history.pushState(null, "", `/${selectedLanguage}${base}`);
    }
  }

  // Function to handle language settings
  async function handleLanguage(selectedLanguage) {
    CURRENT_LANG = selectedLanguage;
    document.documentElement.setAttribute("lang", selectedLanguage);

    const rtlLocales = ["ar", "he", "ku", "fa", "ur", "sd"];
    document.documentElement.setAttribute("dir", rtlLocales.includes(selectedLanguage) ? "rtl" : "ltr");

    // updateURLLang(selectedLanguage);
    await fetchTranslations(selectedLanguage);
    setLanguage(selectedLanguage);
  }

  // Listen for language change events
  window.addEventListener("languageChange", async (event) => {
    const newLang = event.detail.lang;
    if (newLang !== CURRENT_LANG) {
      await handleLanguage(newLang);
    }
  });

  // Initialize language
  const notInBeta = [  "en",
    "pl",
    "fr",
    "es",
    "de",
    "nl",
    "uk",
    "be",
    "ru",
    "pt",
    "hi",
    "sv",
    "ar",
    "ja",
    "zh"];
  const browserLang = navigator.language.split("-")[0]?.toLowerCase() || "en";

  const savedLang = localStorage.getItem("lang_set");
  const initialLang = savedLang || (notInBeta.includes(browserLang) ? browserLang : "en");

  if (!savedLang) {
    localStorage.setItem("lang_set", initialLang);
  }

  handleLanguage(initialLang);

  // Expose a method to change language
  window.changeLanguage = (newLang) => {
    localStorage.setItem("lang_set", newLang);
    const langChangeEvent = new CustomEvent("languageChange", { detail: { lang: newLang } });
    window.dispatchEvent(langChangeEvent);
  };

  // Add event listener to the select dropdown
  const languageSelector = document.getElementById("lang_set");
  if (languageSelector) {
    languageSelector.value = initialLang; // Set initial value based on saved language
    languageSelector.addEventListener("change", (event) => {
      const selectedLanguage = event.target.value;
      window.changeLanguage(selectedLanguage);
    });
  }
})();
