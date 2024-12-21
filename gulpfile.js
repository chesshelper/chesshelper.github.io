const gulp = require("gulp");
const through = require("through2");
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

// Paths
const sourceFile = "./ch/index.html"; // Your base HTML file
const destFolder = "./dist"; // Output folder
const localesFolder = "./_locales"; // Folder with translations

// Helper to load translations for a specific locale
function loadTranslations(locale) {
  const filePath = path.join(localesFolder, locale, "messages.json");
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  }
  return {};
}

// Transform HTML for a specific language
function translateHTML(locale, translations) {
  return through.obj(function (file, _, cb) {
    if (file.isNull()) return cb(null, file);
    if (file.isStream()) {
      return cb(new Error("Streaming not supported"));
    }

    const dom = new JSDOM(file.contents.toString());
    const document = dom.window.document;

    // Update the lang attribute of the <html> element
    document.documentElement.setAttribute("lang", locale);

    // Creates the <link> element
    var link = document.createElement('link');
    link.rel = 'canonical';
    link.href = `https://weblxapplications.com/ch/${locale}/`;

    // Append it to the <head>
    document.head.appendChild(link);

    // Select all elements with the `data-i18n` attribute
    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach((element) => {
      const key = element.getAttribute("data-i18n");
      const translation = translations[key]?.message || element.textContent;
      element.textContent = translation; // Replace the innerText with translation
    });

    file.contents = Buffer.from(dom.serialize());
    cb(null, file);
  });
}

// Generate localized HTML files
gulp.task("generate-locale-files", function () {
  const languages = fs.readdirSync(localesFolder).filter((file) =>
    fs.lstatSync(path.join(localesFolder, file)).isDirectory()
  );

  return Promise.all(
    languages.map((lang) => {
      const translations = loadTranslations(lang);
      return gulp
        .src(sourceFile)
        .pipe(translateHTML(lang, translations)) // Apply translations
        .pipe(gulp.dest(`${destFolder}/${lang}`)); // Save the translated file
    })
  );
});

// Default Task
gulp.task("default", gulp.series("generate-locale-files"));
