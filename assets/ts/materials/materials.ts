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
      console.log("mat-progress-bar detected - waiting for completion");
      progressBarShown = true;
    } else if (!matProgressBar && progressBarShown) {
      // Progress bar zmizel po tom, co se zobrazil
      console.log("mat-progress-bar disappeared - scrolling to top");

      setTimeout(() => {
        // Find the actual scrollable element inside app-materials-bind
        const appMaterialsBind = document.querySelector("app-materials-bind");
        let actualScrollTarget: HTMLElement | null = null;

        if (appMaterialsBind) {
          // Look for elements with overflow: auto or scroll AND actually scrollable content
          const scrollableElements = appMaterialsBind.querySelectorAll("*");
          for (const element of scrollableElements) {
            const style = window.getComputedStyle(element);
            const isOverflowScrollable =
              style.overflow === "auto" ||
              style.overflow === "scroll" ||
              style.overflowY === "auto" ||
              style.overflowY === "scroll";

            if (isOverflowScrollable) {
              const isActuallyScrollable =
                element.scrollHeight > element.clientHeight;
              console.log(
                "Checking element:",
                element.tagName,
                element.className,
                "overflow:",
                style.overflow,
                "scrollHeight:",
                element.scrollHeight,
                "clientHeight:",
                element.clientHeight,
                "scrollable:",
                isActuallyScrollable
              );

              if (isActuallyScrollable) {
                actualScrollTarget = element as HTMLElement;
                console.log(
                  "Found actually scrollable element:",
                  element.tagName,
                  element.className
                );
                break;
              }
            }
          }
        }

        // If no scrollable element found inside app-materials-bind, try to find main scrollable element
        if (!actualScrollTarget) {
          console.log(
            "No scrollable element found inside app-materials-bind, searching globally..."
          );
          const globalScrollableElements = document.querySelectorAll("*");
          for (const element of globalScrollableElements) {
            const style = window.getComputedStyle(element);
            const isOverflowScrollable =
              style.overflow === "auto" ||
              style.overflow === "scroll" ||
              style.overflowY === "auto" ||
              style.overflowY === "scroll";

            if (isOverflowScrollable) {
              const isActuallyScrollable =
                element.scrollHeight > element.clientHeight;
              if (isActuallyScrollable && element.scrollHeight > 500) {
                // Only consider elements with substantial content
                actualScrollTarget = element as HTMLElement;
                console.log(
                  "Found global scrollable element:",
                  element.tagName,
                  element.className,
                  "scrollHeight:",
                  element.scrollHeight
                );
                break;
              }
            }
          }
        }

        // Try multiple scroll targets
        const scrollTargets = [
          actualScrollTarget,
          document.querySelector("app-materials-bind"),
          document.querySelector(".page.parent-sticky-container"),
          document.querySelector(".page-content"),
          document.body,
          document.documentElement,
        ].filter(Boolean); // Remove null/undefined values

        for (const target of scrollTargets) {
          if (target) {
            console.log(
              "Attempting to scroll:",
              target.tagName,
              target.className
            );

            // Check if element is actually scrollable
            const isScrollable = target.scrollHeight > target.clientHeight;
            console.log(
              "Is scrollable:",
              isScrollable,
              "scrollHeight:",
              target.scrollHeight,
              "clientHeight:",
              target.clientHeight
            );

            // Try scrollTo method
            if (typeof target.scrollTo === "function") {
              target.scrollTo({
                top: 0,
                behavior: "smooth",
              });
              console.log("Scrolled using scrollTo method");

              // Check if scroll actually happened
              setTimeout(() => {
                console.log("Scroll position after:", target.scrollTop);
              }, 100);
              break;
            }

            // Try scrollTop property
            if ("scrollTop" in target) {
              console.log("Scroll position before:", target.scrollTop);
              target.scrollTop = 0;
              console.log("Scrolled using scrollTop property");
              console.log("Scroll position after:", target.scrollTop);
              break;
            }
          }
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

  console.log("Global ProgressBar MutationObserver initialized");
}

/**
 * Inicializuje globální observer pro sledování existence mat-dialog-container
 */
function initializeGlobalObserver() {
  if (globalObserver) {
    return; // Observer už existuje
  }

  globalObserver = new MutationObserver(() => {
    // Pouze kontrolovat existenci mat-dialog-container
    const dialogContainer = document.querySelector("mat-dialog-container");
    if (dialogContainer && pendingMaterialSelection) {
      console.log("Dialog container detected via Global MutationObserver");

      // PROBLEM + SOLUTION:
      // bohužel některé možnosti v mat-dialog-container se zobrazí až poté, co se začne scrollovat v elementu nadřazeném pro mat-list-option se jménem cdk-virtual-scroll-viewport, proto je třeba vytvořit programovatelný scrollování, které nascrolluje na konec

      const cdkVirtualScrollViewport = document.querySelector(
        "cdk-virtual-scroll-viewport"
      ) as HTMLElement;

      // we need to do a for loop and scroll multiple times, eg. 5 times by 20%
      for (let i = 0; i < 5; i++) {
        // wait 200ms
        setTimeout(() => {
          cdkVirtualScrollViewport.scrollTo({
            top: cdkVirtualScrollViewport.scrollHeight * (i + 1) * 0.2,
            behavior: "smooth",
          });
        }, 200 * i);
      }

      // Hledat mat-list-option elementy
      const matListOptions = document.querySelectorAll(
        "mat-list-option"
      ) as NodeListOf<HTMLElement>;

      if (matListOptions.length > 0) {
        // console.log("Mat list options found:", matListOptions.length);

        // Použít for...of místo forEach pro možnost break
        for (const option of matListOptions) {
          let optionTextContentValue = option.textContent?.trim();
          let pendingMaterialSelectionValue = pendingMaterialSelection?.trim();

          // console.log("Option text content:", optionTextContentValue);
          // console.log(
          //   "Pending material selection:",
          //   pendingMaterialSelectionValue
          // );

          if (optionTextContentValue === pendingMaterialSelectionValue) {
            // console.warn("Found matching option, clicking...");
            option.click();

            // Inicializovat globální progress bar observer pokud ještě neexistuje
            initializeProgressBarObserver();

            // Vyčistit pending selection
            // console.log("Clearing pending material selection");
            pendingMaterialSelection = null;
            // stop processing the loop
            break;
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

  console.log(
    "Global MutationObserver initialized - watching for mat-dialog-container"
  );
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

    // Step 2: Find form ID for "Junior Computer Academy"
    const juniorForm = formsData.find(
      (item: any) => item.name_form === "Junior Computer Academy"
    );

    if (!juniorForm) {
      console.log("Junior Computer Academy form not found");
      return;
    }

    const formId = juniorForm.id_form || 0;

    // Step 2: Get directions data
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

    // Step 3: Get materials data for the specific form
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
