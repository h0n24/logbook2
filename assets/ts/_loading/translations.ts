import * as incl from "../_incl";

export function getTranslations() {
  // console.log("Inicializace getTranslations funkcí.");

  // use similar logic as in materials.ts
  // load the contents of
  (async () => {
    // check if config data is already in localStorage

    // get "X-Language" from localStorage
    const xLanguage = localStorage?.getItem("X-Language") || "cs";

    // console.log("Fetching config data...");
    const translateData = await incl.fetchApiDataWithToken(
      "https://lbapi.itstep.org/v1/translate?lang_id=" + xLanguage
    );

    if (!translateData) {
      console.log("Failed to fetch translate data");
      return;
    }

    // console.log("Successfully fetched translate data:", translateData);

    // save to localStorage
    localStorage.setItem(
      "logbook-rework-translate-data",
      JSON.stringify(translateData)
    );
  })();
}
