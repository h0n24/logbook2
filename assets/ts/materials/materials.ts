// file: materials.ts
// TODO FUTURE: zbavit se setTimeoutů

import * as incl from "../_incl";
import Fuse from "fuse.js";
import { juniorAcademyOrder } from "./_junior-order";
import { seniorAcademyOrder } from "./_senior-order";
import { hideEmptyRows } from "./_hideEmpty";

// Interface pro přeložené materiály
interface TranslatedMaterial {
  id: number;
  short_name_spec: string;
  name_spec: string;
  translated_name_spec: string;
  id_direction: number;
  direction_name: string;
  translated_direction_name: string;
  translate_key: string;
  direction_translate_key: string;
  junior_order: string;
  senior_order: string;
  additional_search_text: string; // Dodatečný text pro vyhledávání
  searchable_text: string; // Kombinace všech vyhledávacích polí
}

// Globální proměnná pro přeložené materiály
let translatedMaterialsData: TranslatedMaterial[] = [];

// Globální observer pro sledování změn v DOM
let globalObserver: MutationObserver | null = null;
let pendingMaterialSelection: string | null = null;

// Globální observer pro sledování mat-progress-bar
let progressBarObserver: MutationObserver | null = null;
let progressBarShown: boolean = false;

/**
 * Inicializuje event listener pro lib-expanded-select[formcontrolname="id_form"]
 */
function initializeFormSelectListener() {
  const formSelect = document.querySelector(
    'lib-expanded-select[formcontrolname="id_form"]'
  );

  if (!formSelect) {
    console.log("Form select element not found, will retry...");
    // Retry after a short delay
    setTimeout(initializeFormSelectListener, 1000);
    return;
  }

  console.log("Form select element found, adding change listener");

  // Add click event listener
  formSelect.addEventListener("click", async (event) => {
    console.log("Form select clicked");

    // Wait for cdk-overlay-pane to appear
    const waitForOverlay = () => {
      return new Promise<void>((resolve) => {
        const checkOverlay = () => {
          const overlay = document.querySelector(".cdk-overlay-pane");
          if (overlay) {
            console.log("cdk-overlay-pane found");
            resolve();
          } else {
            setTimeout(checkOverlay, 100);
          }
        };
        checkOverlay();
      });
    };

    try {
      await waitForOverlay();

      // Add click listener to mat-option elements in the overlay
      const overlay = document.querySelector(".cdk-overlay-pane");
      if (overlay) {
        const matOptions = overlay.querySelectorAll("mat-option");

        matOptions.forEach((option) => {
          option.addEventListener("click", async (clickEvent) => {
            const optionText = option.textContent?.trim();
            console.log("Mat-option clicked:", optionText);

            if (!optionText) {
              console.log("No option text found");
              return;
            }

            // Get forms data and translate data from localStorage
            const formsData = JSON.parse(
              localStorage.getItem(
                "logbook-rework-materials-data-get-public-form"
              ) || "[]"
            );
            const translateData = JSON.parse(
              localStorage.getItem("logbook-rework-translate-data") || "{}"
            );

            // Find matching form by translating backwards
            let matchingForm: any = null;

            // First try direct match
            matchingForm = formsData.find(
              (form: any) => form.name_form === optionText
            );

            // If no direct match, try reverse translation
            if (!matchingForm) {
              console.log(
                "No direct match found, trying reverse translation for:",
                optionText
              );

              // Find form where translated name matches optionText
              matchingForm = formsData.find((form: any) => {
                const translatedName = translateData[form.translate_key];
                return translatedName === optionText;
              });
            }

            if (!matchingForm) {
              console.log("No matching form found for:", optionText);
              console.log(
                "Available forms:",
                formsData.map((f: any) => ({
                  name_form: f.name_form,
                  translate_key: f.translate_key,
                  translated_name: translateData[f.translate_key],
                }))
              );
              return;
            }

            console.log("Found matching form:", matchingForm);
            const formId = matchingForm.id_form;

            // Fetch new data for the selected form
            await fetchMaterialsDataForForm(formId);

            // Recreate translated data and refresh table
            refreshMaterialsTable();
          });
        });
      }
    } catch (error) {
      console.error("Error waiting for overlay:", error);
    }
  });
}

/**
 * Inicializuje event listener pro lib-expanded-select[formcontrolname="id_spec"]
 */
function initializeSpecSelectListener() {
  const specSelect = document.querySelector(
    'lib-expanded-select[formcontrolname="id_spec"]'
  );

  if (!specSelect) {
    console.log("Spec select element not found, will retry...");
    // Retry after a short delay
    setTimeout(initializeSpecSelectListener, 1000);
    return;
  }

  console.log("Spec select element found, adding click listener");

  // Add click event listener
  specSelect.addEventListener("click", async (event) => {
    console.log("Spec select clicked");

    // Wait for cdk-overlay-pane with listbox to appear
    const waitForSpecOverlay = () => {
      return new Promise<void>((resolve) => {
        const checkOverlay = () => {
          const overlay = document.querySelector(
            ".cdk-overlay-pane div[role='listbox']"
          );
          if (overlay) {
            console.log("Spec cdk-overlay-pane with listbox found");
            resolve();
          } else {
            setTimeout(checkOverlay, 100);
          }
        };
        checkOverlay();
      });
    };

    try {
      await waitForSpecOverlay();

      // Add click listener to mat-option elements in the spec overlay
      const overlay = document.querySelector(
        ".cdk-overlay-pane div[role='listbox']"
      );
      if (overlay) {
        const matOptions = overlay.querySelectorAll("mat-option");

        matOptions.forEach((option) => {
          option.addEventListener("click", async (clickEvent) => {
            const optionText = option.textContent?.trim();
            console.log("Spec mat-option clicked:", optionText);

            if (!optionText) {
              console.log("No spec option text found");
              return;
            }

            // Get materials data and translate data from localStorage
            const materialsData = JSON.parse(
              localStorage.getItem(
                "logbook-rework-materials-data-get-public-spec"
              ) || "[]"
            );
            const translateData = JSON.parse(
              localStorage.getItem("logbook-rework-translate-data") || "{}"
            );

            // Find matching material by translating backwards
            let matchingMaterial: any = null;

            // First try direct match
            matchingMaterial = materialsData.find(
              (material: any) => material.name_spec === optionText
            );

            // If no direct match, try reverse translation
            if (!matchingMaterial) {
              console.log(
                "No direct match found, trying reverse translation for spec:",
                optionText
              );

              // Find material where translated name matches optionText
              matchingMaterial = materialsData.find((material: any) => {
                const translatedName = translateData[material.translate_key];
                return translatedName === optionText;
              });
            }

            if (!matchingMaterial) {
              console.log("No matching material found for:", optionText);
              console.log(
                "Available materials:",
                materialsData.map((m: any) => ({
                  name_spec: m.name_spec,
                  translate_key: m.translate_key,
                  translated_name: translateData[m.translate_key],
                }))
              );
              return;
            }

            console.log("Found matching material:", matchingMaterial);

            // Set pending selection for global observer
            pendingMaterialSelection =
              translateData[matchingMaterial.translate_key] ||
              matchingMaterial.name_spec;
            console.log(
              "Set pending material selection:",
              pendingMaterialSelection
            );

            // Initialize global observer if not already done
            initializeGlobalObserver();
          });
        });
      }
    } catch (error) {
      console.error("Error waiting for spec overlay:", error);
    }
  });
}

/**
 * Získá formId z URL parametrů
 */
function getFormIdFromUrl(): number | null {
  const urlParams = new URLSearchParams(window.location.search);
  const formIdParam = urlParams.get("id_form");

  if (formIdParam) {
    const formId = parseInt(formIdParam);
    if (!isNaN(formId)) {
      console.log("Found formId in URL:", formId);
      return formId;
    }
  }

  console.log("No valid formId found in URL, will use default");
  return null;
}

/**
 * Načte data materiálů pro konkrétní formId
 */
async function fetchMaterialsDataForForm(formId: number) {
  try {
    console.log("Fetching materials data for form ID:", formId);

    // get config data from localStorage
    const xLanguage = localStorage?.getItem("X-Language") || "cs";
    let city = "brno";

    if (xLanguage === "sk") {
      city = "brat";
    }

    // Get directions data for the specific form
    const directionsData = await incl.fetchApiDataWithToken(
      `https://lbapi.itstep.org/v1/logbook/${city}/bind/get-public-direction?id_form=${formId}`
    );

    if (!directionsData) {
      console.log("Failed to fetch directions data for form:", formId);
      return;
    }

    console.log(
      "Successfully fetched directions data for form:",
      formId,
      directionsData
    );

    // Save directions data to localStorage
    localStorage.setItem(
      "logbook-rework-materials-data-get-public-direction",
      JSON.stringify(directionsData)
    );

    // Get materials data for the specific form
    const materialsData = await incl.fetchApiDataWithToken(
      `https://lbapi.itstep.org/v1/logbook/${city}/bind/get-public-spec?id_form=${formId}`
    );

    if (!materialsData) {
      console.log("Failed to fetch materials data for form:", formId);
      return;
    }

    console.log(
      "Successfully fetched materials data for form:",
      formId,
      materialsData
    );

    // Save materials data to localStorage
    localStorage.setItem(
      "logbook-rework-materials-data-get-public-spec",
      JSON.stringify(materialsData)
    );
  } catch (error) {
    console.error("Error in fetchMaterialsDataForForm:", error);
  }
}

/**
 * Obnoví tabulku materiálů s novými daty
 */
function refreshMaterialsTable() {
  console.log("Refreshing materials table with new data");

  // Recreate translated materials data
  translatedMaterialsData = createTranslatedMaterialsData();

  if (!translatedMaterialsData.length) {
    console.warn("No translated materials data available for refresh");
    return;
  }

  console.log("Refreshed translated materials data:", translatedMaterialsData);

  // Find the existing table container
  const tableContainer = document.querySelector(
    ".logbook-rework-better-search"
  );

  if (!tableContainer) {
    console.log("Table container not found, creating new one");
    createOwnMaterialsData();
    return;
  }

  // Recreate the table with new data
  createMaterialsTable(tableContainer as HTMLElement, translatedMaterialsData);

  // Update the search functionality
  const input = tableContainer.querySelector(
    "#logbook-rework-better-search__input"
  ) as HTMLInputElement;
  if (input) {
    // Clear the search input
    input.value = "";

    // Recreate Fuse.js instance with new data
    const fuse = new Fuse(translatedMaterialsData, {
      includeScore: true,
      threshold: 0.4,
      keys: [
        "short_name_spec",
        "name_spec",
        "translated_name_spec",
        "direction_name",
        "translated_direction_name",
        "additional_search_text",
        "searchable_text",
      ],
      ignoreLocation: true,
      findAllMatches: true,
      minMatchCharLength: 2,
    });

    // Update the input event listener
    input.removeEventListener("input", () => {}); // Remove old listener
    input.addEventListener("input", (e) => {
      const searchValue = (e.target as HTMLInputElement).value.trim();

      if (searchValue.length === 0) {
        createMaterialsTable(
          tableContainer as HTMLElement,
          translatedMaterialsData
        );
        return;
      }

      const results = fuse.search(searchValue);
      const filteredData =
        results.length > 0 ? results.map((result) => result.item) : [];
      createMaterialsTable(tableContainer as HTMLElement, filteredData);

      console.log(
        `Nalezeno ${filteredData.length} výsledků pro "${searchValue}"`
      );
    });
  }
}

/**
 * Inicializuje globální observer pro sledování mat-progress-bar
 */
function initializeProgressBarObserver() {
  if (progressBarObserver) {
    return; // Observer už existuje
  }

  progressBarObserver = new MutationObserver(() => {
    const matProgressBar = document.querySelector("mat-progress-bar");

    if (matProgressBar && !progressBarShown) {
      // Progress bar se právě zobrazil
      progressBarShown = true;
    } else if (!matProgressBar && progressBarShown) {
      // Progress bar zmizel po tom, co se zobrazil

      setTimeout(() => {
        // Find and scroll the wrapper__content element
        const wrapperContent = document.querySelector(
          ".wrapper__content"
        ) as HTMLElement;

        if (wrapperContent) {
          wrapperContent.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        } else {
          // console.log("wrapper__content not found");
        }

        // Reset state for next time
        progressBarShown = false;
      }, 100);
    }
  });

  // Spustit sledování změn v celém dokumentu
  progressBarObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

/**
 * Inicializuje globální observer pro sledování existence mat-dialog-container
 */
function initializeGlobalObserver() {
  if (globalObserver) {
    return; // Observer už existuje
  }

  globalObserver = new MutationObserver(() => {
    // Kontrolovat existenci mat-dialog-container nebo cdk-overlay-pane s listbox
    const dialogContainer = document.querySelector("mat-dialog-container");
    const specOverlay = document.querySelector(
      ".cdk-overlay-pane div[role='listbox']"
    );

    if ((dialogContainer || specOverlay) && pendingMaterialSelection) {
      console.log(
        "Overlay detected:",
        dialogContainer ? "dialog" : "spec listbox"
      );

      if (dialogContainer) {
        // Handle mat-dialog-container (original logic)
        // PROBLEM + SOLUTION:
        // bohužel některé možnosti v mat-dialog-container se zobrazí až poté, co se začne scrollovat v elementu nadřazeném pro mat-list-option se jménem cdk-virtual-scroll-viewport, proto je třeba vytvořit programovatelný scrollování, které nascrolluje na konec

        const cdkVirtualScrollViewport = document.querySelector(
          "cdk-virtual-scroll-viewport"
        ) as HTMLElement;

        if (cdkVirtualScrollViewport) {
          console.log("Found cdk-virtual-scroll-viewport, scrolling to bottom");

          // Scroll to bottom in one smooth operation
          cdkVirtualScrollViewport.scrollTo({
            top: cdkVirtualScrollViewport.scrollHeight,
            behavior: "smooth",
          });

          // Wait a bit for content to load, then try to find options
          setTimeout(() => {
            console.log("Scroll completed, looking for mat-list-options");
          }, 500);
        } else {
          console.log("cdk-virtual-scroll-viewport not found, skipping scroll");
        }

        // Hledat mat-list-option elementy s retry mechanismem
        const findAndClickMatListOptions = () => {
          const matListOptions = document.querySelectorAll(
            "mat-list-option"
          ) as NodeListOf<HTMLElement>;

          if (matListOptions.length > 0) {
            console.log("Found mat-list-options:", matListOptions.length);

            // Použít for...of místo forEach pro možnost break
            for (const option of matListOptions) {
              let optionTextContentValue = option.textContent?.trim();
              let pendingMaterialSelectionValue =
                pendingMaterialSelection?.trim();

              if (optionTextContentValue === pendingMaterialSelectionValue) {
                console.log("Found matching dialog option, clicking...");
                option.click();

                // Inicializovat globální progress bar observer pokud ještě neexistuje
                initializeProgressBarObserver();

                // Vyčistit pending selection
                pendingMaterialSelection = null;
                // stop processing the loop
                return true; // Success
              }
            }
            return false; // No match found
          } else {
            console.log("No mat-list-options found yet");
            return false; // Not found yet
          }
        };

        // Try to find options immediately
        if (!findAndClickMatListOptions()) {
          // If not found, retry after scroll delay
          setTimeout(() => {
            if (!findAndClickMatListOptions()) {
              console.log(
                "Still no mat-list-options found after scroll, giving up"
              );
            }
          }, 1000);
        }
      } else if (specOverlay) {
        // Handle spec overlay with mat-option elements
        const matOptions = specOverlay.querySelectorAll(
          "mat-option"
        ) as NodeListOf<HTMLElement>;

        if (matOptions.length > 0) {
          console.log("Found mat-options in spec overlay:", matOptions.length);

          // Použít for...of místo forEach pro možnost break
          for (const option of matOptions) {
            let optionTextContentValue = option.textContent?.trim();
            let pendingMaterialSelectionValue =
              pendingMaterialSelection?.trim();

            console.log(
              "Checking option:",
              optionTextContentValue,
              "against:",
              pendingMaterialSelectionValue
            );

            if (optionTextContentValue === pendingMaterialSelectionValue) {
              console.log("Found matching spec option, clicking...");
              option.click();

              // Inicializovat globální progress bar observer pokud ještě neexistuje
              initializeProgressBarObserver();

              // Vyčistit pending selection
              pendingMaterialSelection = null;
              // stop processing the loop
              break;
            }
          }
        }
      }
    }
  });

  // Spustit sledování změn v celém dokumentu
  globalObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

/**
 * Najde pořadí materiálu v Junior Academy podle translate_key
 */
function findJuniorAcademyOrder(translateKey: string): {
  junior_order: string;
  senior_order: string;
  additional_search_text: string;
} {
  const foundJuniorOrder = juniorAcademyOrder.find(
    (order) => order.translate_key === translateKey
  );

  const foundSeniorOrder = seniorAcademyOrder.find(
    (order) => order.translate_key === translateKey
  );

  let juniorOrder = "—";
  let seniorOrder = "—";

  if (foundJuniorOrder) {
    juniorOrder = `${foundJuniorOrder.theme}. téma (${foundJuniorOrder.year}. rok)`;
  }
  if (foundSeniorOrder) {
    seniorOrder = `${foundSeniorOrder.theme}. téma (${foundSeniorOrder.year}. rok)`;
  }

  const additionalSearchText =
    foundJuniorOrder?.additional_search_text ||
    foundSeniorOrder?.additional_search_text ||
    "";

  return {
    junior_order: juniorOrder,
    senior_order: seniorOrder,
    additional_search_text: additionalSearchText,
  };
}

/**
 * Vytvoří přeložený objekt materiálů s optimalizovanými daty pro vyhledávání
 */
function createTranslatedMaterialsData(): TranslatedMaterial[] {
  // console.log("Vytváření přeložených dat materiálů...");

  // Načtení dat z localStorage
  const materialsData = JSON.parse(
    localStorage.getItem("logbook-rework-materials-data-get-public-spec") ||
      "[]"
  );

  const directionsData = JSON.parse(
    localStorage.getItem(
      "logbook-rework-materials-data-get-public-direction"
    ) || "[]"
  );

  const translateData = JSON.parse(
    localStorage.getItem("logbook-rework-translate-data") || "{}"
  );

  if (!materialsData.length || !directionsData.length) {
    console.warn("Chybí potřebná data pro vytvoření přeložených materiálů");
    return [];
  }

  const translatedMaterials: TranslatedMaterial[] = materialsData.map(
    (material: any) => {
      // Najít směr podle ID
      const direction = directionsData.find(
        (dir: any) => dir.id === material.id_direction
      );

      // Přeložit název materiálu
      const translatedName =
        translateData[material.translate_key] || material.name_spec;

      // Přeložit název směru
      const translatedDirection = direction
        ? translateData[direction.translate_key] || direction.dir_name
        : "Neznámý směr";

      // Najít správné pořadí podle translate_key
      const orderInfo = findJuniorAcademyOrder(material.translate_key || "");

      // Vytvořit vyhledávací text kombinující všechna pole včetně additional_search_text
      const searchableText = [
        material.short_name_spec,
        material.name_spec,
        translatedName,
        direction?.dir_name || "",
        translatedDirection,
        orderInfo.junior_order,
        orderInfo.senior_order,
        orderInfo.additional_search_text,
      ]
        .filter((text) => text && text.trim() !== "") // Odstranit prázdné hodnoty
        .join(" ")
        .toLowerCase();

      return {
        id: material.id_spec || material.id || 0,
        short_name_spec: material.short_name_spec || "",
        name_spec: material.name_spec || "",
        translated_name_spec: translatedName,
        id_direction: material.id_direction || 0,
        direction_name: direction?.dir_name || "",
        translated_direction_name: translatedDirection,
        translate_key: material.translate_key || "",
        direction_translate_key: direction?.translate_key || "",
        junior_order: orderInfo.junior_order,
        senior_order: orderInfo.senior_order,
        additional_search_text: orderInfo.additional_search_text,
        searchable_text: searchableText,
      };
    }
  );

  // console.log(`Vytvořeno ${translatedMaterials.length} přeložených materiálů`);
  return translatedMaterials;
}

function clickSecondOption() {
  // console.log("Clicking on second option");
  const secondOption = document.querySelector(
    ".cdk-overlay-pane div[role='listbox'] mat-option:nth-child(2)"
  ) as HTMLElement | null;

  if (secondOption) {
    secondOption.click();
  } else {
    // console.log("Second option not found");
  }
}

function clickSelectLabel(selectLabel: HTMLElement) {
  // console.log("Clicking on select wrapper");
  selectLabel.click();

  setTimeout(() => {
    clickSecondOption();
  }, 100);
}

function autoSelectFirstMaterial() {
  const selectWrapper = document.querySelector(
    "app-materials-bind form mat-form-field:nth-child(1)"
  ) as HTMLElement | null;
  const selectLabel = document.querySelector(
    "lib-expanded-select"
  ) as HTMLElement | null;

  // Check if elements exist before proceeding
  if (!selectWrapper || !selectLabel) {
    // console.log("Required elements not found for auto-select");
    return;
  }

  // if text-content of selectlabel is empty, select first option
  if (selectLabel.textContent === "") {
    // console.log("Select label is empty, selecting first option");

    setTimeout(() => {
      clickSelectLabel(selectLabel);
    }, 400);
  }
}

async function fetchAllMaterialsData() {
  try {
    // get config data from localStorage
    const xLanguage = localStorage?.getItem("X-Language") || "cs";
    let city = "brno";

    if (xLanguage === "sk") {
      city = "brat";
    }

    // Step 1: Get forms data
    const formsData = await incl.fetchApiDataWithToken(
      `https://lbapi.itstep.org/v1/logbook/${city}/bind/get-public-form`
    );

    if (!formsData) {
      console.log("Failed to fetch forms data");
      return;
    }

    // console.log("Successfully fetched forms data:", formsData);

    // Save forms data to localStorage
    localStorage.setItem(
      "logbook-rework-materials-data-get-public-form",
      JSON.stringify(formsData)
    );

    // Step 2: Get formId from URL or default to Junior Computer Academy
    let formId: number;
    const urlFormId = getFormIdFromUrl();

    if (urlFormId) {
      formId = urlFormId;
      console.log("Using formId from URL:", formId);
    } else {
      // Fallback to Junior Computer Academy
      const juniorForm = formsData.find(
        (item: any) => item.name_form === "Junior Computer Academy"
      );

      if (!juniorForm) {
        console.log("Junior Computer Academy form not found");
        return;
      }

      formId = juniorForm.id_form || 0;
      console.log("Using default formId (Junior Computer Academy):", formId);
    }

    // Step 3: Get directions data
    const directionsData = await incl.fetchApiDataWithToken(
      `https://lbapi.itstep.org/v1/logbook/${city}/bind/get-public-direction?id_form=${formId}`
    );

    if (!directionsData) {
      console.log("Failed to fetch directions data");
      return;
    }

    // console.log("Successfully fetched directions data:", directionsData);

    // Save directions data to localStorage
    localStorage.setItem(
      "logbook-rework-materials-data-get-public-direction",
      JSON.stringify(directionsData)
    );

    // Step 4: Get materials data for the specific form
    const materialsData = await incl.fetchApiDataWithToken(
      `https://lbapi.itstep.org/v1/logbook/${city}/bind/get-public-spec?id_form=${formId}`
    );

    if (!materialsData) {
      console.log("Failed to fetch materials data");
      return;
    }

    // console.log("Successfully fetched materials data:", materialsData);

    // Save materials data to localStorage
    localStorage.setItem(
      "logbook-rework-materials-data-get-public-spec",
      JSON.stringify(materialsData)
    );
  } catch (error) {
    console.error("Error in fetchAllMaterialsData:", error);
  }
}

function createMaterialsTable(
  container: HTMLElement,
  materialsData: TranslatedMaterial[]
) {
  // Remove existing table if it exists
  const existingTable = container.querySelector("table");
  if (existingTable) {
    existingTable.remove();
  }

  // create simple table and show the data
  const table = document.createElement("table");
  table.classList.add("logbook-rework-better-search__table");
  container.appendChild(table);

  // create thead for the table
  const thead = document.createElement("thead");
  table.appendChild(thead);
  const trHead = document.createElement("tr");
  thead.appendChild(trHead);

  const thHead = document.createElement("th");
  thHead.textContent = "Zkratka";
  trHead.appendChild(thHead);
  const thHead1 = document.createElement("th");
  thHead1.textContent = "Přeložený název";
  trHead.appendChild(thHead1);
  const thHead2 = document.createElement("th");
  thHead2.textContent = "Originální název";
  trHead.appendChild(thHead2);

  const thHead6 = document.createElement("th");
  thHead6.textContent = "Alternativní název";
  trHead.appendChild(thHead6);

  const thHead3 = document.createElement("th");
  thHead3.textContent = "Směr";
  trHead.appendChild(thHead3);

  const thHead4 = document.createElement("th");
  thHead4.textContent = "Pořadí Junior";
  thHead4.title =
    "Pozor, pořadí nemusí přesně odpovídat! Tohle je ideální pořadí, kdyby se skupina nikdy nespojovala s jinou a po celou dobu 5 let by nikdo neodešel a nikdy byste nepotřebovali přidat hodiny navíc. V realitě se to neděje.";
  thHead4.classList.add("logbook-rework-better-search__table-th-note");
  trHead.appendChild(thHead4);

  const thHead5 = document.createElement("th");
  thHead5.textContent = "Pořadí Senior";
  thHead5.title =
    "Pozor, pořadí nemusí přesně odpovídat! Tohle je ideální pořadí, kdyby se skupina nikdy nespojovala s jinou a po celou dobu 4 let by nikdo neodešel a nikdy byste nepotřebovali přidat hodiny navíc. V realitě se to neděje.";
  thHead5.classList.add("logbook-rework-better-search__table-th-note");
  trHead.appendChild(thHead5);

  // create tbody for the table
  const tbody = document.createElement("tbody");
  table.appendChild(tbody);

  // iterate over materialsData and create tr for each item
  materialsData.forEach((item: TranslatedMaterial) => {
    const tr = document.createElement("tr");
    tbody.appendChild(tr);

    // Přidat event listener pro klikání na řádek
    tr.addEventListener("click", () => {
      console.log("Přeložený název:", item.translated_name_spec);

      // Inicializovat globální observer pokud ještě neexistuje
      initializeGlobalObserver();

      // Nastavit pending selection pro globální observer
      pendingMaterialSelection = item.translated_name_spec;
      console.log("Set pending material selection:", pendingMaterialSelection);

      // click on lib-expanded-select[formcontrolname="id_spec"]
      const expandedSelect = document.querySelector(
        `lib-expanded-select[formcontrolname="id_spec"]`
      ) as HTMLElement;
      if (expandedSelect) {
        expandedSelect.click();
      }
    });

    // Přidat CSS třídu pro indikaci klikatelnosti
    tr.style.cursor = "pointer";
    tr.title = "Klikněte pro zobrazení přeloženého názvu v konzoli";

    const td = document.createElement("td");
    td.textContent = item.short_name_spec;
    tr.appendChild(td);

    const td1 = document.createElement("td");
    td1.textContent = item.translated_name_spec;
    td1.classList.add("logbook-rework-better-search__table-td-primary");
    tr.appendChild(td1);

    const td2 = document.createElement("td");
    td2.textContent = item.name_spec;
    tr.appendChild(td2);

    const td6 = document.createElement("td");
    td6.textContent = item.additional_search_text || "";
    tr.appendChild(td6);

    const td3 = document.createElement("td");
    td3.textContent = item.translated_direction_name;
    tr.appendChild(td3);

    const td4 = document.createElement("td");
    td4.textContent = item.junior_order;
    tr.appendChild(td4);

    const td5 = document.createElement("td");
    td5.textContent = item.senior_order;
    tr.appendChild(td5);
  });
}

function createOwnMaterialsData() {
  // if ".sticky-table-header table" has element named "lib-no-data", remove all the contents of .sticky-table-header
  const stickyTableWrapper = document.querySelector(
    ".sticky-table-header"
  ) as HTMLElement;
  if (stickyTableWrapper) {
    // create it only once
    if (document.querySelector(".logbook-rework-better-search")) {
      return;
    }

    // create element after stickyTableWrapper and hide the stickyTableWrapper
    const newElement = document.createElement("div");
    newElement.classList.add("logbook-rework-better-search");
    stickyTableWrapper.after(newElement);

    // create simple input with placeholder "Hledat materiály"
    const input = document.createElement("input");
    input.type = "search";
    input.id = "logbook-rework-better-search__input";
    input.placeholder =
      "Hledejte materiály dle názvu, zkratky, směru či ročníku. Vyhledávání je inteligentní, neřeší překlepy.";
    input.classList.add("logbook-rework-better-search__input");
    newElement.appendChild(input);

    // Vytvořit přeložená data materiálů
    translatedMaterialsData = createTranslatedMaterialsData();

    if (!translatedMaterialsData.length) {
      console.warn("Nepodařilo se vytvořit přeložená data materiálů");
      return;
    }

    console.log("Přeložená data materiálů:", translatedMaterialsData);

    // Create initial table with all data
    createMaterialsTable(newElement, translatedMaterialsData);

    // Použít Fuse.js pro pokročilé vyhledávání s přeloženými daty
    const fuse = new Fuse(translatedMaterialsData, {
      includeScore: true,
      threshold: 0.4, // Mírně vyšší threshold pro lepší přesnost
      keys: [
        "short_name_spec",
        "name_spec",
        "translated_name_spec",
        "direction_name",
        "translated_direction_name",
        "additional_search_text", // Přidáno jako samostatné vyhledávací pole
        "searchable_text",
      ],
      // Pokročilé možnosti pro lepší vyhledávání
      ignoreLocation: true, // Ignorovat pozici v textu
      findAllMatches: true, // Najít všechny shody
      minMatchCharLength: 2, // Minimální délka shody
    });

    // autofocus input
    setTimeout(() => {
      input.focus();
    }, 100);

    // when input is changed, search through the materials data
    input.addEventListener("input", (e) => {
      const searchValue = (e.target as HTMLInputElement).value.trim();

      if (searchValue.length === 0) {
        // Pokud je vyhledávání prázdné, zobrazit všechna data
        createMaterialsTable(newElement, translatedMaterialsData);
        return;
      }

      const results = fuse.search(searchValue);

      // Extract the actual items from Fuse results
      const filteredData =
        results.length > 0 ? results.map((result) => result.item) : [];

      // Recreate table with filtered data
      createMaterialsTable(newElement, filteredData);

      // Zobrazit počet výsledků
      console.log(
        `Nalezeno ${filteredData.length} výsledků pro "${searchValue}"`
      );
    });
  }
}

//page-filters

// Aktualizace funkce materials
export function materials() {
  // console.log("Inicializace materials funkcí.");

  autoSelectFirstMaterial();

  hideEmptyRows();

  // Inicializovat globální progress bar observer
  initializeProgressBarObserver();

  // Inicializovat form select listener
  initializeFormSelectListener();

  // Inicializovat spec select listener
  initializeSpecSelectListener();

  // Wait a bit for the page to load, then fetch all materials data
  setTimeout(() => {
    fetchAllMaterialsData();

    // Počkat na načtení dat a pak vytvořit přeložená data
    setTimeout(() => {
      createOwnMaterialsData();
    }, 1000); // Více času pro načtení všech dat
  }, 500);
}

// Export funkce pro vytvoření přeložených dat (pro případné externí použití)
export function getTranslatedMaterialsData(): TranslatedMaterial[] {
  return translatedMaterialsData.length > 0
    ? translatedMaterialsData
    : createTranslatedMaterialsData();
}
