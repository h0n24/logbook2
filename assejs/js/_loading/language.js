"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.changeDocumentLanguage = changeDocumentLanguage;
// change language on site
function changeDocumentLanguage() {
  var _localStorage;
  var xLanguage = ((_localStorage = localStorage) === null || _localStorage === void 0 ? void 0 : _localStorage.getItem("X-Language")) || null;
  if (xLanguage === "cs") {
    document.documentElement.setAttribute("lang", "cs-CZ");
  } else if (xLanguage === "sk") {
    document.documentElement.setAttribute("lang", "sk-SK");
  } else {
    // Výchozí jazyk, pokud není nastaveno cs nebo sk
    document.documentElement.setAttribute("lang", "en");
  }
}