// file: attendance.ts

import * as incl from "../_incl";

// TODO: refactor this file into separate files

const selectorForWorkInClass = ".wrapper-students thead tr th:nth-child(8)";
const titleTextNotRated = "Pozor: máte nepřidělené známky";
const titleTextNotDiamonds = "Pozor: máte nepřidělené diamanty";

function hideMarkPopup(event, popup) {
  // click outside
  setTimeout(() => {
    incl.clickOnPosition(event.clientX - 50, event.clientY);
    document.body.style.cursor = "default";
  }, 500);

  setTimeout(() => {
    // show popup after custom click
    popup.style.visibility = "visible";
    popup.style.zIndex = "";
    document.body.style.cursor = "default";
  }, 1000);
}

function set12Mark(event, popup) {
  // hide popup before clicking
  popup.style.visibility = "hidden";

  document.body.style.cursor = "wait";

  // make click for us
  const maxMark = popup.querySelector("md-option[value='12']") as HTMLElement;
  maxMark.click();

  // change z-index to don't block scroll
  popup.style.zIndex = "-1";

  hideMarkPopup(event, popup);
}

// Funkce pro kontextové menu
function addContextMenu(event): void {
  event.preventDefault();

  const matFormField = event.currentTarget;
  const matSelect = matFormField.querySelector("mat-select");

  if (!matSelect) {
    console.error("Nebylo nalezeno mat-select uvnitř mat-form-field");
    return;
  }

  selectValueInMatSelect(matSelect, "12").then(() => {
    console.log('Hodnota "12" byla nastavena pomocí kontextového menu.');
  });
}

function whenClickedOnPresenceTh() {
  const workInClass: HTMLElement = document.querySelector(
    selectorForWorkInClass
  ) as HTMLElement;

  workInClass.title =
    "Pravé tlačítko: Dát maximální známku všem studentům. Pozor: trvá +1 sekundu za každého žáka.";

  workInClass.addEventListener("contextmenu", (event) => {
    event.preventDefault();

    incl.showLoader();

    const classWorkSelects = document.querySelectorAll(
      '.presentr-classWork md-select[aria-disabled="false"]'
    );

    let iteration = 0;

    classWorkSelects.forEach((select, key, parent) => {
      const popupID = select.getAttribute("aria-owns") as string;
      const popup = document.getElementById(popupID) as HTMLElement;

      // skip if already selected
      try {
        const isAlreadySelected = select.querySelector(
          ".md-select-value .md-text"
        ) as HTMLElement;
        if (isAlreadySelected.innerHTML === "12") return;
      } catch (error) {}

      // click on select on our behalf
      setTimeout(() => {
        set12Mark(event, popup);
      }, key * 1000 + 1);

      // last iteration
      if (key === parent.length - 1) {
        setTimeout(() => {
          hideMarkPopup(event, popup);
        }, (key + 1) * 1000 + 500);
      }

      iteration = key + 1;
    });

    setTimeout(() => incl.hideLoader(), iteration * 1000 + 2);
  });
}

// Aktualizace addContextMenuForEachSelect
function addContextMenuForEachSelect() {
  try {
    const selects = document.querySelectorAll("mat-form-field");

    selects.forEach((select) => {
      select.addEventListener("contextmenu", addContextMenu);

      (select as HTMLElement).title =
        "Levé tlačítko: Otevřít — Pravé tlačítko: Dát maximální známku";
    });
  } catch (error) {
    console.error("Chyba při přidávání kontextového menu:", error);
  }
}

function countPresentStudents() {
  const students = document.querySelectorAll(
    ".wrapper-students tbody tr .presents"
  );

  let total = Object.keys(students).length;
  let totalStudents = total ? total : 0;
  let totalPresent = 0;

  students.forEach((student) => {
    const dots = student.querySelectorAll("span");

    let wasPresent = 0;

    dots.forEach((dot) => {
      const selection = dot.querySelector("i:last-child") as HTMLElement;

      if (selection.classList.contains("ng-hide")) return;
      if (selection.classList.contains("was-not")) return;

      wasPresent++;
    });

    totalPresent += wasPresent;
  });

  const thTotal = document.querySelector(
    ".wrapper-students thead .number"
  ) as HTMLElement;

  thTotal.innerHTML = `${totalPresent}/${totalStudents}`;
  thTotal.title = "Celkový počet přítomných / celkový počet studentů";
}

function whenPresenceChanged() {
  const presenceButtons = document.querySelectorAll(".presents > span");

  presenceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setTimeout(() => countPresentStudents(), 250);
    });
  });
}

function hideMaterialsWhenNoTeacher(isTeacher) {
  const addMaterial: HTMLDivElement = document.querySelector(
    ".add-material"
  ) as HTMLDivElement;

  if (isTeacher) {
    // addMaterial.style.display = "inline-block";
    addMaterial.style.transitionDuration = "0.3s";
    addMaterial.style.opacity = "1";
    addMaterial.style.zIndex = "auto";
  } else {
    // addMaterial.style.display = "none";
    addMaterial.style.transitionDuration = "0s";
    addMaterial.style.zIndex = "-1";
    addMaterial.style.opacity = "0";
  }
}

function whenTeacherRoleChanged() {
  const teacherRole = document.querySelectorAll(
    ".teacherInit .check-techers input"
  );

  let selected = false;
  teacherRole.forEach((input) => {
    if ((input as HTMLInputElement).checked) {
      selected = true;
    }
  });

  hideMaterialsWhenNoTeacher(selected);
}

function removeActiveTabs() {
  const tabs = document.querySelectorAll(".presents ul.pars li");

  tabs.forEach((tab) => {
    if (tab.classList.contains("active")) {
      tab.classList.remove("active");
    }
  });
}

// opravuje chybu, kdy se "zaškrtne" i když není studentů
function correctBugTabsActiveWhenBreak() {
  // find if there is a break
  const breakSelector =
    "body > main > div:nth-child(4) > div > div.interna-wrap > div:nth-child(2) > h3";
  const targetBreakText = "Máte přestávku nebo momentálně neprobíhá hodina";

  const breakElement = document.querySelector(breakSelector);
  if (!breakElement) return;
  if (!breakElement.innerHTML.includes(targetBreakText)) return;

  // check if its currently visible on screen
  const observer = new IntersectionObserver(
    function (entries) {
      if (entries[0].isIntersecting === true) {
        // console.log("Element is fully visible in screen");
        removeActiveTabs();
      }
    },
    { threshold: [1] }
  );

  observer.observe(breakElement);
}

function automaticallySelectOnlineForOnlineGroups() {
  const groupName = document.querySelector(".groupName") as HTMLElement;
  const groupNameText = groupName.textContent as string;
  if (groupNameText.includes("JAO")) {
    // automatically set student as online to every online group

    // if no checkbox in class .check-techers is checked, return
    const checkboxes = document.querySelectorAll(".check-techers input");
    let isAnyChecked = false;
    checkboxes.forEach((checkbox) => {
      if ((checkbox as HTMLInputElement).checked) {
        isAnyChecked = true;
      }
    });

    if (!isAnyChecked) return;

    // when clicked on .presents .presents span
    const presents = document.querySelectorAll(".presents .presents span");
    presents.forEach((present) => {
      present.addEventListener("click", () => {
        setTimeout(() => {
          // select closest tr
          const tr = present.closest("tr") as HTMLElement;
          if (!tr) return;

          // select checkbox
          const checkbox = tr.querySelector(
            ".presents-online input[type='checkbox']"
          );
          if (!checkbox) return;

          // if only one checkbox is not checked, click on it
          if (!(checkbox as HTMLInputElement).checked) {
            (checkbox as HTMLElement).click();
          }
        }, 500);
      });
    });

    // for design purposes -> to change color/opacity
    // add class hide-cell-online to class .wrapper-students
    const wrapperStudents = document.querySelector(
      ".wrapper-students"
    ) as HTMLElement;

    if (wrapperStudents) {
      wrapperStudents.classList.add("hide-cells-online");
    }

    // for UX purposes -> add title to every checkbox
    const checkbox = document.querySelectorAll(
      ".presents-online input[type='checkbox']"
    );
    if (checkbox) {
      checkbox.forEach((check) => {
        let checkBox = check as HTMLElement;
        checkBox.title =
          "Pokud je student na hodině, automaticky se zaškrtne při přítomnosti, netřeba nic dalšího dělat.";
      });
    }

    const checkboxLabel = document.querySelector(
      'label[for="isAllOnline"]'
    ) as HTMLElement;
    if (checkboxLabel) {
      checkboxLabel.title =
        "U online skupin je automaticky zaškrtnuto online při přítomnosti";
    }
  }
}

function detectIfNotDiamonds() {
  function detectDiamonds() {
    const diamondsElement = document.querySelector(
      ".diamonds .diamond"
    ) as HTMLElement;
    const activeTabElement = document.querySelector(
      ".presents .pars li.active"
    ) as HTMLElement;

    if (diamondsElement) {
      const diamonds = diamondsElement.textContent as string;

      if (diamonds == "5") {
        activeTabElement.classList.add("show-badge-diamonds");
        if (activeTabElement.title != titleTextNotRated) {
          activeTabElement.title = titleTextNotDiamonds;
        }
      } else {
        activeTabElement.classList.remove("show-badge-diamonds");
        if (activeTabElement.title == titleTextNotDiamonds) {
          activeTabElement.title = "";
        }
      }
    }
  }

  function debounceDetectIfDiamods(): EventListenerOrEventListenerObject {
    return () => {
      // activeTabElement.removeAttribute("data-diamonds");
      incl.debounce(detectIfNotDiamonds, 3000)();
    };
  }

  try {
    detectDiamonds();

    // debounceDetectIfDiamods();
  } catch (error) {}

  try {
    // when someone clicks on .awarded span then remove data-diamonds
    const awarded = document.querySelectorAll(".awarded span i");

    awarded.forEach((award) => {
      // remove previous listener
      award.removeEventListener("click", debounceDetectIfDiamods());
      award.addEventListener("click", debounceDetectIfDiamods());
    });
  } catch (error) {}
}

function detectIfNotRated() {
  function debounceDetectIfNotRated(): EventListenerOrEventListenerObject {
    return () => {
      incl.debounce(detectIfNotRated, 3000)();
    };
  }

  const activeTabElement = document.querySelector(
    ".presents .pars li.active"
  ) as HTMLElement;

  try {
    // detect every md-select
    const selects = document.querySelectorAll(
      '.presentr-classWork md-select[aria-disabled="false"]'
    );

    // find if atleast one of those's innerHTML contains "-"
    // find element "md-select-value" and check if it contains "-"
    let isNotRated = false;
    selects.forEach((select) => {
      const selectValue = select.querySelector(
        ".md-select-value span"
      ) as HTMLElement;

      const selectValueText = selectValue?.textContent;

      if (selectValueText?.includes("-")) {
        isNotRated = true;
      }
    });

    if (isNotRated) {
      activeTabElement.classList.add("show-badge-work");
      activeTabElement.title = titleTextNotRated;
    } else {
      activeTabElement.classList.remove("show-badge-work");
      if (activeTabElement.title == titleTextNotRated) {
        activeTabElement.title = "";
      }
    }
  } catch (error) {}

  try {
    // when someone clicks on .presentr-classWork md-select[aria-disabled="false"]
    // then remove data-work
    const classWorkSelects = document.querySelectorAll(
      ".presentr-classWork md-input-container"
    );
    classWorkSelects.forEach((select) => {
      select.removeEventListener("click", debounceDetectIfNotRated());
      select.addEventListener("click", debounceDetectIfNotRated());
    });

    const classWorkSelects2 = document.querySelector(
      selectorForWorkInClass
    ) as HTMLElement;
    classWorkSelects2.removeEventListener("click", debounceDetectIfNotRated());
    classWorkSelects2.addEventListener("click", debounceDetectIfNotRated());
  } catch (error) {}
}

function detectIfNotRatedOrDiamonds() {
  detectIfNotDiamonds();
  detectIfNotRated(); // needs to be after detectIfNotDiamonds, so title is set properly
}

function copyTableForPrinting() {
  // if exists, remove
  const tableCopyExists = document.querySelector("#print-table") as HTMLElement;
  if (tableCopyExists) {
    tableCopyExists.remove();
  }

  const table = document.querySelector(
    ".wrapper-students table"
  ) as HTMLElement;
  const tableCopy = table.cloneNode(true) as HTMLElement;
  tableCopy.id = "print-table";
  tableCopy.classList.add("print-table");

  // remove hidden + uncheck
  const presentsOnline = tableCopy.querySelectorAll(".presents-online input");
  presentsOnline.forEach((input) => {
    let inputElement = input as HTMLInputElement;
    inputElement.classList.remove("ng-hide");
    inputElement.checked = false;
  });

  // append new body to html with table
  const newBody = document.createElement("body");
  newBody.id = "print-table-body";

  // create new h1 with content of .groupName
  const h1 = document.createElement("h1");
  h1.classList.add("print-table-title");
  const groupName = document.querySelector(".groupName") as HTMLElement;
  h1.innerHTML = "Skupina: " + groupName.textContent;
  newBody.appendChild(h1);

  // create new h2 with content of .specName
  const h2 = document.createElement("h2");
  h2.classList.add("print-table-subtitle");
  const specName = document.querySelector(".specName") as HTMLElement;
  let specNameText = specName.textContent as string;
  specNameText = specNameText.replace("(", "");
  specNameText = specNameText.replace(")", "");
  h2.innerHTML = "Téma: " + specNameText;
  newBody.appendChild(h2);

  // create new h3 with date
  const h3 = document.createElement("h3");
  h3.classList.add("print-table-subtitle");
  const date = new Date();

  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  } as const;
  const dateText = date.toLocaleDateString("cs-CZ", options);

  let firstTimeText = "";
  let secondTimeText = "";
  try {
    const firstTimeElement = document.querySelector(
      ".pars .tab.active a"
    ) as HTMLElement;
    firstTimeText = firstTimeElement.textContent as string;
    // text looks like this: '\n                        15:30 - 16:30\n                    '
    firstTimeText = firstTimeText.replace(/\s/g, "");
    firstTimeText = firstTimeText.replace("\n", "");
    firstTimeText = firstTimeText.split("-")[0];

    // get next element after ".pars .tab.active" that has class .tab
    const firstTimeElementParent =
      firstTimeElement.parentElement as HTMLElement;
    const nextElement =
      firstTimeElementParent.nextElementSibling as HTMLElement;
    let secondTimeElement = nextElement.querySelector("a") as HTMLElement;
    secondTimeText = secondTimeElement.textContent as string;
    secondTimeText = secondTimeText.replace(/\s/g, "");
    secondTimeText = secondTimeText.replace("\n", "");
    secondTimeText = secondTimeText.split("-")[1];
  } catch (error) {}

  if (firstTimeText == "" || secondTimeText == "") {
    h3.textContent = "Datum: " + dateText;
  } else {
    h3.textContent =
      "Datum: " + dateText + ", " + firstTimeText + "–" + secondTimeText;
  }

  newBody.appendChild(h3);

  newBody.appendChild(tableCopy);
  document.documentElement.appendChild(newBody);

  // original body with class .main hide via hidden attribute
  const main = document.querySelector("body.main") as HTMLElement;
  main.hidden = true;

  // create temporary style for printing
  const style = document.createElement("style");
  style.innerHTML = `
    @media print {
      .print-table {
        width: max-content !important;
        font-size: 12px;
        border-collapse: collapse;
      }
      .print-table th, .print-table td {
        // border: 1px solid #000;
        padding: 8px;
        min-width: auto !important;
        width: auto !important;
        height: auto !important;
        text-align: left !important;
        color: #000 !important;
      }
    }

    .open-menu-block, md-sidenav, toolbar, .topPanel {
      display: none;
    }
    .table-wrapper .table {
      display: none;
    }

    #print-table {
      margin-top: 1rem;
      display: table !important;
    }

    #print-table .presents_stud td:not(.name) {
        display: none;
    }

    #print-table .presents_stud .number {
      display: table-cell !important;
      color: #000;
      font-weight: 300;
    }

    #print-table .presents_stud .presents-online {
      display: table-cell !important;
    }

    #print-table .presents_stud [ng-model="stud.was"] {
        display: none;
    }
    
    #print-table thead {
        display: none;
    }

    .print-table-title {
      font-weight: 500;
      font-size: 20px;
      margin-bottom: 1rem;
    }

    .print-table-subtitle {
      font-weight: 300;
      font-size: 16px;
      margin-bottom: 0.5rem;
    }
    
  `;
  document.head.appendChild(style);

  // print
  window.print();

  function returnToOriginal() {
    // remove temporary style
    style.remove();

    // remove temporary body
    newBody.remove();

    // show original body
    main.hidden = false;
  }

  addEventListener("afterprint", (event) => {
    returnToOriginal();
  });

  setTimeout(() => {
    returnToOriginal();
  }, 1000);
}

function printTable() {
  // if table doesnt have any content, return
  const testTable = document.querySelector(".wrapper-students table tbody");
  let testTableContent = testTable?.textContent || "";
  testTableContent = testTableContent?.replace(/\s/g, "");
  if (!testTableContent) return;

  // if print-students-button exists, return
  const printButtonExists = document.querySelector(
    "#print-students-button"
  ) as HTMLElement;
  if (printButtonExists) {
    return;
  }

  // prepend button to .topPanel .dialog-demo-content
  const topPanel = document.querySelector(
    ".topPanel .dialog-demo-content"
  ) as HTMLElement;
  const printButton = document.createElement("a");
  printButton.href = "#";
  printButton.id = "print-students-button";
  printButton.title = "Tisk studentů";
  printButton.innerHTML = "🖨️";
  printButton.classList.add("print-students-button");

  printButton.addEventListener("click", () => {
    copyTableForPrinting();
  });

  topPanel.appendChild(printButton);
}

// TODO: rework this whole function
function presenceEnhancements(state) {
  if (state !== "presents") return;

  const hash = window.location.hash;
  if (hash !== "#/presents") return;

  // needs small timeout because angular firstly
  // adds and after that removes previous rows
  // so it would count previous rows as present
  // so it would count previous rows as present
  setTimeout(function () {
    try {
      addContextMenuForEachSelect();
      countPresentStudents();
      whenPresenceChanged();
      whenTeacherRoleChanged();
      whenClickedOnPresenceTh();

      printTable();

      // @ts-ignore
      window.getPresenceAsText = function () {
        console.log("test");
      };

      automaticallySelectOnlineForOnlineGroups();
      detectIfNotRatedOrDiamonds();

      // when clicked on .presents .pars li
      const tabs = document.querySelectorAll(".presents .pars li");
      tabs.forEach((tab) => {
        tab.addEventListener("click", detectIfNotRatedOrDiamonds);
      });

      // observe .table-wrapper for changes
      const tableWrapper = document.querySelector(
        ".table-wrapper"
      ) as HTMLElement;
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes.length) {
            automaticallySelectOnlineForOnlineGroups();
            detectIfNotRatedOrDiamonds();
          }
        });
      });

      observer.observe(tableWrapper, {
        childList: true,
        subtree: true,
      });
    } catch (error) {}
  }, 100);

  // longer timeout
  setTimeout(function () {
    try {
      correctBugTabsActiveWhenBreak();
    } catch (error) {}
  }, 200);
}

// Pomocné funkce
function isMatSelectEnabled(matSelect: HTMLElement): boolean {
  const isDisabled =
    matSelect.getAttribute("disabled") !== null ||
    matSelect.classList.contains("mat-select-disabled");
  return !isDisabled;
}

function selectValueInMatSelect(
  matSelect: HTMLElement,
  value: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!isMatSelectEnabled(matSelect)) {
      console.warn("mat-select je zakázán.");
      return resolve();
    }

    // Otevření mat-select
    matSelect.click();

    // Čekáme, než se panel otevře
    const panelClass = ".mat-mdc-select-panel";
    const timeout = 200; // Může být upraveno dle potřeby

    setTimeout(() => {
      const panels = document.querySelectorAll(panelClass);

      if (panels.length === 0) {
        // console.error("Žádný .mat-mdc-select-panel nebyl nalezen");
        return resolve();
      }

      // Předpokládáme, že poslední otevřený panel je ten náš
      const panel = panels[panels.length - 1];

      // Nalezení mat-option s požadovanou hodnotou
      const matOptions = panel.querySelectorAll("mat-option");
      let desiredOption: HTMLElement | null = null;

      matOptions.forEach((option) => {
        if (option.textContent?.trim() === value) {
          desiredOption = option as HTMLElement;
        }
      });

      if (!desiredOption) {
        console.error(`Nebyla nalezena mat-option s textem "${value}"`);
        // Zavřeme panel
        matSelect.click();
        return resolve();
      }

      // Kliknutí na požadovanou možnost
      (desiredOption as HTMLElement).click();

      // mat-select by se měl automaticky zavřít po výběru možnosti
      resolve();
    }, timeout);
  });
}

// Přidání tlačítka a hromadné nastavení hodnot
function addGiveAll12ButtonToPage() {
  // Nejprve zkontrolujeme, zda tlačítko již neexistuje
  if (document.getElementById("set-all-to-12-button")) {
    // console.log("Tlačítko pro nastavení známky 12 již existuje.");
    return;
  }

  const parentElement = document.querySelector(
    ".page-content div:nth-child(2):where(.d-flex) > div:nth-child(2):where(.d-flex)"
  );
  if (!parentElement) {
    // console.log("Parent element pro tlačítko nebyl nalezen.");
    return;
  }

  const button = document.createElement("button");
  button.id = "set-all-to-12-button";
  button.textContent = "Nastavit všem známku 12";
  button.title =
    "Kliknutím nastavíte všem studentům známku 12 ve sloupci Třídní práce";

  button.classList.add(
    "mdc-button",
    "mat-mdc-button",
    "mat-mdc-outlined-button"
  );

  button.addEventListener("click", () => {
    setAllSelectsTo12();
  });

  parentElement.prepend(button);
  // console.log("Tlačítko pro nastavení známky 12 bylo úspěšně přidáno.");
}

async function setAllSelectsTo12() {
  const selects = document.querySelectorAll(
    ".mat-column-mark4 mat-form-field mat-select"
  );

  if (selects.length === 0) {
    // console.warn("Žádné mat-select prvky nebyly nalezeny.");
    return;
  }

  for (const matSelect of selects) {
    // Kontrola, zda již má hodnotu '12'
    const selectedValue = (matSelect as HTMLElement)
      .querySelector(".mat-select-value-text")
      ?.textContent?.trim();
    if (selectedValue === "12") {
      continue; // Přeskočíme, pokud již má hodnotu '12'
    }

    await selectValueInMatSelect(matSelect as HTMLElement, "12");
    // Můžete přidat malé zpoždění mezi nastavením jednotlivých selectů, pokud je to potřeba
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // console.log('Všem vybraným mat-select prvkům byla nastavena hodnota "12".');
}

// Aktualizace funkce attendance
export function attendance() {
  // console.log("Inicializace attendance funkcí.");

  addContextMenuForEachSelect();
  addGiveAll12ButtonToPage();
}
