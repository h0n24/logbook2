// change language on site
export function changeDocumentLanguage(): void {
  const xLanguage = localStorage?.getItem("X-Language") || null;

  if (xLanguage === "cs") {
    document.documentElement.setAttribute("lang", "cs-CZ");
  } else if (xLanguage === "sk") {
    document.documentElement.setAttribute("lang", "sk-SK");
  } else {
    // Výchozí jazyk, pokud není nastaveno cs nebo sk
    document.documentElement.setAttribute("lang", "en");
  }
}
