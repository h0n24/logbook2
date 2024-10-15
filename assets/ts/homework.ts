import { vocative } from "./vocative";
import * as zip from "@zip.js/zip.js";
import { debounce } from "./_incl";

// TODO FUTURE: detect multiple opened modals and close them

const filesAllowedToShowAsText = [
  ".txt",
  ".js",
  ".css",
  ".html",
  ".json",
  ".md",
];
const filesAllowedToShowAsImage = [".png", ".jpg", ".jpeg", ".gif", ".svg"];
let zipBypassModal = false; // allow at the beginning to open the file
let zipBypassModalFirstRun = true; // allow at the beginning to open the file
const hwAutocompleteAnswers = [
  {
    title: "Super",
    choices: [
      "Super!",
      "Paráda!",
      "Skvělé!",
      "Super práce!",
      "Parádní!",
      "Super práce!",
      "Parádní práce!",
      "Dokonalé!",
      "Perfektní!",
      "Luxusní!",
      "Mega dobré!",
      "Hezké!",
      "Výborné!",
      "Wow!",
      "Wow, super!",
      "Bravo!",
      "Skvělá práce!",
    ],
  },
  {
    title: "Díky",
    choices: [
      "Díky!",
      "Děkuji!",
      "Díky moc!",
      "Bezva, děkuju!",
      "Děkuji, skvělý!",
      "Díky, super!",
    ],
  },
  {
    title: "Jejda",
    choices: [
      "Jejda, to se moc nepodařilo.",
      "Jejda, to se nepovedlo. :(",
      "Jejda, to se nepovedlo, zkus to znovu prosím.",
    ],
  },
  {
    title: "Znovu",
    choices: [
      "Zkus to znovu prosím.",
      "Zkus to ještě jednou prosím.",
      "Věřím, že to zvládneš opravit.",
      "Prosím pošli mi to ještě jednou.",
      "Prosím pošli mi to znovu.",
      "Prosím zkus si to opravit.",
    ],
  },
  {
    title: "Figma",
    choices: [
      "Komentáře přidány do Figmy.",
      "Rady a tipy jsem napsal do Figmy.",
      "Komentáře a rady k nalezení ve Figmě.",
      "Tipy přidány do Figmy jako komentáře.",
    ],
  },
];

let focusedElement = document.activeElement as HTMLElement;
let lastFocusedAutocompleteAnswer = null as any;
let keyboardShortcutsForNewModals = null as any;

function selectRandomFromArray(array: string[]): string {
  return array[Math.floor(Math.random() * array.length)];
}

function findAllUnfinishedHomeworksFromModal(homeworksWrap) {
  try {
    const homeworks = homeworksWrap.querySelectorAll(
      "md-dialog .hw-md_content .hw-md_item"
    );

    for (let i = 0; i < homeworks.length; i++) {
      const homework = homeworks[i];
      enhanceHomeworkAssessment(homework);
    }
  } catch (error) {}
}

function findAllUnfinishedHomeworksFromSingleModal(homeworksWrap) {
  try {
    const homeworks = homeworksWrap.querySelectorAll(
      ".md-dialog-container[tabindex='-1'] md-dialog .hw-md_single__content"
    );

    for (let i = 0; i < homeworks.length; i++) {
      const homework = homeworks[i];
      enhanceHomeworkAssessment(homework, true);
    }
  } catch (error) {}
}

// add event listener to all homework buttons
function enhanceSingleHomeworkFromModalAfterEvent() {
  try {
    let homeworkButtons = document.querySelectorAll(".hw_new, .hw_checked");
    for (let i = 0; i < homeworkButtons.length; i++) {
      const homeworkButton = homeworkButtons[i];
      homeworkButton.addEventListener("click", function () {
        setTimeout(function () {
          const newHomework = document.querySelector(
            ".md-dialog-container[tabindex='-1'] md-dialog .hw-md_single__content"
          ) as Element;

          if (!newHomework) return;
          enhanceHomeworkAssessment(newHomework, true);
        }, 1);
      });
    }
  } catch (error) {}
}

function findStudentsFirstName(homework: Element, single?: boolean) {
  const singleSel = single ? ".hw-md_single_stud__info" : ".hw-md_stud__info";

  const fullNameEl = homework.querySelector(
    `${singleSel} .bold`
  ) as HTMLSpanElement;

  if (!fullNameEl) return "";

  // find vocativ for a name
  const fullName = fullNameEl.innerText;
  let firstName = fullName.split(" ")[0];

  // apply vocativ only if the page is in czech language
  if (document.documentElement.getAttribute("lang") === "cs-CZ") {
    firstName = vocative(firstName);
  }
  return firstName;
}

function getSelectedMark(homework: Element) {
  let selectedMark = 0;

  // preselect maximmum mark only if it's not already selected
  const radioButtons = homework.querySelectorAll(
    "md-radio-group md-radio-button"
  ) as NodeListOf<HTMLInputElement>;

  radioButtons.forEach(function (radioButton) {
    // @ts-ignore - unofficial element
    if (radioButton.ariaChecked == "true") {
      // @ts-ignore - unofficial element
      selectedMark = parseInt(radioButton.ariaLabel);
    }
  });

  if (selectedMark == 0) {
    const maxMark = homework.querySelector(
      'md-radio-group  md-radio-button[aria-label="12"]'
    ) as HTMLInputElement;
    maxMark.click();
    selectedMark = 12;
  }

  return selectedMark;
}

function automateMessagesForStudents(
  homework: Element,
  firstName: string,
  selectedMark: number
) {
  const textarea = homework.querySelector(
    ".hw-md_single_teacher__comment"
  ) as HTMLTextAreaElement;

  if (!textarea) return;

  // if textarea already has a some text value, don't overwrite it
  if (textarea.value) return;

  // remove focus functionality
  if (textarea.getAttribute("md-select-on-focus")) {
    textarea.removeAttribute("md-select-on-focus");
  }

  let partialInteresting = selectRandomFromArray([
    "Moc pěkná práce!",
    "Luxusní práce!",
    "Perfektní práce!",
    "Super práce!",
    "Super!",
    "Parádní práce!",
  ]);
  let partialEnjoying = selectRandomFromArray([
    "Líbí se mi to.",
    "Je to moc zajímavé.",
    "Je to super.",
    "Je to parádní.",
    "Hodně dobře zpracované.",
  ]);
  let partialGetting = selectRandomFromArray([
    "Dostáváš",
    "Dávám Ti",
    "Zasloužíš si",
    "Dostáváš ode mě",
  ]);
  const message = `Zdravím ${firstName},\n\r${partialInteresting} ${partialEnjoying} ${partialGetting} ${selectedMark} bodů.\n\rS pozdravem`;
  textarea.value = message;

  // simulate input event
  textarea.dispatchEvent(new Event("input"));
  textarea.dispatchEvent(new Event("change"));
}

function makeURLinTextClickable(homework) {
  try {
    // if you find class .hw-md_single_stud-work__answer-text make any text inside that is a link clickable
    const studentsComments = homework.querySelector(
      ".hw-md_single_stud-work__answer-text"
    );

    if (studentsComments === null) return;
    let originalText = studentsComments.innerText;

    if (!originalText) return;
    let newText = createUrlfromText(originalText);

    if (newText) {
      studentsComments.innerHTML = newText;
    }

    // detect if original text contains only url
    let onlyUrl = originalText.match(/(https?:\/\/[^\s]+)/g);

    if (onlyUrl && onlyUrl.length === 1) {
      // add clickable span to the studentsComments
      const span = document.createElement("span");
      span.classList.add("homework-copy-url-to-clipboard");
      span.textContent = "📋";
      span.title = "Kopírovat odkaz do schránky";
      studentsComments.appendChild(span);

      // add event listener to the span
      span.addEventListener("click", function () {
        // copy url to clipboard
        navigator.clipboard.writeText(onlyUrl[0]);
      });
    }
  } catch (error) {
    console.warn("makeURLinTextClickable error", error);
  }
}

function createUrlfromText(originalText: any) {
  // detect if text contains url
  let text = originalText as string;
  const url = text.match(/(https?:\/\/[^\s]+)/g);

  // make the url in the text clickable for every url
  if (url) {
    for (let i = 0; i < url.length; i++) {
      const selURL = url[i];

      // make url more readable
      let urlText = selURL;
      // remove http:// or https://
      urlText = urlText.replace(/(^\w+:|^)\/\//, "");
      // remowe www.
      urlText = urlText.replace("www.", "");
      // remove everything after ? plus remove ? itself
      urlText = urlText.replace(/\?.*/, "");
      // remove everything after # plus remove # itself
      urlText = urlText.replace(/#.*/, "");
      // remove last / if it's there
      urlText = urlText.replace(/\/$/, "");

      // url encode back to original
      urlText = decodeURIComponent(urlText);

      // if longer than 60 characters, shorten it in the middle with …
      if (urlText.length > 40) {
        const firstHalf = urlText.slice(0, 15);
        const secondHalf = urlText.slice(-15);
        urlText = firstHalf + " … " + secondHalf;
      }

      text = text.replace(
        selURL,
        `<a href="${selURL}" title="Celá adresa: ${selURL}" target="_blank">${urlText}</a>`
      );
    }

    return text;
  }
}

function enhanceHomeworkAssessment(homework: Element, single?: boolean) {
  if (homework === null) return;
  // prevent doing this multiple times by adding a data-attribute alreadyEnhanced
  if (homework.getAttribute("alreadyEnhancedHomework") === "true") {
    return;
  } else {
    betterButtonsRework(homework);

    makeURLinTextClickable(homework);

    if (single) {
      // better back button than original
      const backButton = homework.querySelector(
        ".hw-md_single__back"
      ) as HTMLElement;
      btnBackCreateInnerHtml(backButton, false);
    }

    let firstName = findStudentsFirstName(homework, single);
    let selectedMark = getSelectedMark(homework);
    automateMessagesForStudents(homework, firstName, selectedMark);

    // add autocomplete
    const textarea = homework.querySelector(
      ".hw-md_single_teacher__comment"
    ) as HTMLTextAreaElement;

    // select parent
    const parent = textarea.parentElement as HTMLElement;
    parent.addEventListener("onchange", function () {
      createAnswersAutocomplete(textarea, true);
    });

    // TODO: add back after solving the focus all bug
    // when textarea is focused, show autocomplete
    textarea.addEventListener("focus", function () {
      createAnswersAutocomplete(textarea, true);
    });

    homework.setAttribute("alreadyEnhancedHomework", "true");
  }
}

function betterButtonsRework(homework: Element) {
  // add new class .hw-better-buttons
  homework.classList.add("hw-better-buttons");

  try {
    // find .hw-md_stud-work__download-wrap
    let lectorWrap = homework.querySelector(
      ".hw-md_stud-work__download-wrap"
    ) as HTMLDivElement;
    // add text to it as "Stáhnout zadání od učitele"
    lectorWrap.innerHTML = "Zadání od lektora";

    // find .hw-md_single_stud-work__download-wrap
    let studentWrap = homework.querySelector(
      ".hw-md_single_stud-work__download-wrap"
    ) as HTMLDivElement;
    // add text to it as "Stáhnout studentovu práci"
    studentWrap.innerHTML = "Stáhnout práci studenta";
  } catch (error) {}
}

// original menu has a bug -> it doesn't update homework count
// -> observe if number of homework changes
function observeHomeworkCountAndUpdateMenu() {
  try {
    const hwCount = document.querySelector(
      "[ng-show='new_hw && new_hw.length'] .hw-count"
    ) as HTMLSpanElement;

    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === "characterData") {
          const hwCountMenu = document.querySelector(
            `[ng-class="{active: activeNav == 'homeWork'}"]  .orange-count[aria-hidden="false"]`
          ) as HTMLSpanElement;

          hwCountMenu.innerText = hwCount.innerText;

          if (hwCount.innerText === "0") {
            hwCountMenu.classList.add("ng-hide");
          }
        }
      });
    });

    const config = {
      characterData: true,
      attributes: false,
      childList: false,
      subtree: true,
    };
    observer.observe(hwCount, config);
  } catch (error) {}
}

function observeIfNewHomeworksAdded(homeworksWrap, single?: boolean) {
  // if  .hw-md_item in .md-dialog in .hw-md_content is added
  // then enhance it
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === "childList") {
        if (single) {
          findAllUnfinishedHomeworksFromSingleModal(homeworksWrap);
        } else {
          findAllUnfinishedHomeworksFromModal(homeworksWrap);
        }
      }
    });
  });

  const config = {
    characterData: false,
    attributes: false,
    childList: true,
    subtree: true,
  };
  observer.observe(homeworksWrap, config);
}

function convertnl2br(text: string) {
  return text.replace(/(?:\r\n|\r|\n)/g, "<br>");
}

function eventListenerForNewModal(event) {
  if (event.key === "Escape") {
    const dialogElement = document.querySelector("#modal-file") as Element;
    dialogElement.classList.remove("active");
  }
}

function createEventListenerForFileModal() {
  document.addEventListener("keyup", eventListenerForNewModal);
}

function addDataToPre(originalType: any, data: any, pre: HTMLPreElement) {
  // convert type to lowercase
  let type = originalType.toLowerCase();

  function ifUnableToRead(dataText: string) {
    if (!dataText) {
      dataText =
        "Obsah souboru se nepodařilo načíst. :( Zkuste to ještě jednou, nebo si jej stáhněte";
    }
    return dataText;
  }

  if (type === "text") {
    let dataText = createUrlfromText(data ?? "") ?? "";
    if (!dataText) {
      dataText = data;
    }
    dataText = ifUnableToRead(dataText);
    dataText = convertnl2br(dataText);

    pre.innerHTML = dataText;
  }
  if (filesAllowedToShowAsText.includes("." + type)) {
    let dataText = data;
    dataText = ifUnableToRead(dataText);

    if (type === "html") {
      dataText = dataText.replace(/</g, "&lt;");
      dataText = dataText.replace(/>/g, "&gt;");
    }

    dataText = convertnl2br(dataText);

    pre.innerHTML = dataText;
  }
  if (filesAllowedToShowAsImage.includes("." + type)) {
    pre.innerHTML = `<img src="${data}" alt="Obrázek" />`;
  }

  if (type === "pdf") {
    const iframe = document.createElement("iframe");
    iframe.src = data;

    pre.innerHTML = "";
    pre.appendChild(iframe);
  }
  if (type === "zip") {
    pre.innerHTML = "";
    pre.appendChild(data);
  }
}

function createModalLayout(data: any, url: any, type: any, filename: any = "") {
  function eventCloseNewModal(event) {
    event.preventDefault();
    dialog.classList.remove("active");
    // BUG: doesn't work as intended :(
    // addOriginalEventListenerBack2(eventListenerForNewModal);
  }

  const dialog = document.createElement("div");
  dialog.id = "modal-file";
  dialog.classList.add("modal-file", "active");

  // create link a with href #close class .modal-overlay and aria-label Close
  const modalOverlay = document.createElement("a");
  modalOverlay.href = "#close";
  modalOverlay.classList.add("modal-overlay");
  modalOverlay.setAttribute("aria-label", "Close");

  // create div with class .modal-container
  const container = document.createElement("div");
  container.classList.add("modal-container");

  // create div with class .modal-header
  const header = document.createElement("div");
  header.classList.add("modal-header");

  // create a#close with class btn btn-clear float-right aria-label Close
  const close = document.createElement("a");
  close.href = "#close";
  close.classList.add("btn-modal-close");
  close.setAttribute("aria-label", "Close");

  // create modal title
  const title = document.createElement("h4");
  createModalTitle(type, title);

  // create div with class .modal-body
  const body = document.createElement("div");
  body.classList.add("modal-body");

  // create pre with data from file
  const pre = document.createElement("div") as unknown as HTMLPreElement;
  pre.classList.add("modal-pre");
  addDataToPre(type, data, pre);

  // create modal-footer
  const footer = document.createElement("div");
  footer.classList.add("modal-footer");

  // add button to download original file
  const download = document.createElement("a");
  download.id = "modal-download-file";
  download.classList.add("btn", "btn-primary");
  download.target = "_blank"; // to open in new tab
  updateDownloadButtonData(download, url, filename);

  // add second button to close
  // const close2 = document.createElement("a");
  // close2.href = "#close";
  // close2.classList.add("btn-modal-close2");
  // close2.innerText = "Zavřít okno";

  // add buttons to close the modal
  close.addEventListener("click", eventCloseNewModal);
  // close2.addEventListener("click", eventCloseNewModal);
  modalOverlay.addEventListener("click", eventCloseNewModal);

  // close modal on escape key
  createEventListenerForFileModal();

  // append elements
  header.appendChild(title);
  header.appendChild(close);
  body.appendChild(pre);
  // footer.appendChild(close2);
  footer.appendChild(download);
  container.appendChild(header);
  container.appendChild(body);
  container.appendChild(footer);
  dialog.appendChild(modalOverlay);
  dialog.appendChild(container);

  // append modal to body
  document.body.appendChild(dialog);
}

function createModalTitle(
  type: any,
  title: HTMLHeadingElement,
  showBackButton?: boolean
) {
  if (showBackButton) {
    // create back button
    const backButton = document.createElement("a");
    backButton.href = "#close";

    btnBackCreateInnerHtml(backButton, true);

    // add event listener that runs createZipFileTable();
    backButton.addEventListener("click", function (event) {
      event.preventDefault();
      createZipFileTable();
    });

    title.innerHTML = "";
    title.appendChild(backButton);
  } else {
    if (type === "text") {
      title.textContent = "Obsah souboru .txt";
    } else if (type === "zip") {
      title.textContent = "Obsah souboru .zip";
    } else {
      title.textContent = `Obsah souboru .${type}`;
    }
  }
}

function btnBackCreateInnerHtml(backButton: HTMLElement, isZipModal?: boolean) {
  backButton.classList.add("btn-modal-zip-back");
  // add svg icon
  const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 -6.5 38 38"><path fill="#1C1C1F" d="M11.19.58.67 11l-.08.09c-.35.34-.56.8-.59 1.35v.18c.03.43.2.84.52 1.21l.12.13 10.55 10.46a2 2 0 0 0 2.82 0 2 2 0 0 0 0-2.82l-7.28-7.23H36a2 2 0 1 0 0-3.98H6.96l7.05-6.99a2 2 0 0 0 0-2.82 2 2 0 0 0-2.82 0Z"/></svg>`;

  if (isZipModal) {
    backButton.title = "Klávesová zkratka: Backspace";
    backButton.innerHTML = svgIcon + "<span>Zpět na seznam souborů</span>";
  } else {
    backButton.innerHTML = svgIcon + "<span>Zpět</span>";
  }
}

function updateDownloadButtonData(
  download: HTMLAnchorElement,
  url: any,
  filename: any
) {
  download.href = url;
  download.setAttribute("download", filename); // to force download
  if (filename === "") {
    download.innerHTML = "Stáhnout původní soubor";
  } else {
    let shorterFilename = filename;
    if (filename.length > 30) {
      // shorten filename from the middle
      const firstHalf = filename.slice(0, 15);
      const secondHalf = filename.slice(-15);
      shorterFilename = firstHalf + " … " + secondHalf;
    }
    download.title = `Celý název souboru: ${filename}`;
    download.innerHTML = `Stáhnout soubor <span>${shorterFilename}</span>`;
  }
}

function createModalForFiles(
  data,
  url,
  type,
  filename = "",
  showBackButton = false
) {
  // detect if #modal-file exists and if it does, just update the content
  const existingModal = document.querySelector("#modal-file");
  if (existingModal) {
    existingModal.classList.add("active");

    const title = existingModal.querySelector("h4") as HTMLHeadingElement;
    createModalTitle(type, title, showBackButton);

    const pre = existingModal.querySelector(".modal-pre") as HTMLPreElement;
    addDataToPre(type, data, pre);

    let download = existingModal.querySelector(
      ".modal-footer #modal-download-file"
    ) as HTMLAnchorElement;
    updateDownloadButtonData(download, url, filename);

    return;
  }

  // create modal via HTML dialog
  createModalLayout(data, url, type, filename);
}

function createTheadForZipFileTable() {
  const thead = document.createElement("thead");
  const trHead = document.createElement("tr");

  const thFilename = document.createElement("th");
  thFilename.textContent = "Cesta nebo název souboru";
  trHead.appendChild(thFilename);

  const thSize = document.createElement("th");
  thSize.textContent = "Velikost";
  trHead.appendChild(thSize);

  const thDate = document.createElement("th");
  thDate.textContent = "Datum";
  trHead.appendChild(thDate);

  thead.appendChild(trHead);
  return thead;
}

async function readZipFile(blob, originalFileUrl) {
  const reader = new FileReader();
  reader.readAsArrayBuffer(blob);

  reader.addEventListener("load", function () {
    const arrayBuffer = reader.result as ArrayBuffer;
    const uint8Array = new Uint8Array(arrayBuffer);
    const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(uint8Array));

    // save zipReaderData to global variable
    // @ts-ignore
    window.zipReaderData = zipReader;

    // @ts-ignore
    window.zipOriginalFileUrl = originalFileUrl;

    createZipFileTable();
  });
}

function createZipFileTable() {
  // @ts-ignore
  let zipReader2 = window.zipReaderData;

  // @ts-ignore
  let originalFileUrl = window.zipOriginalFileUrl;

  const entriesTable = document.createElement("table");
  entriesTable.id = "zip-entries-table";
  entriesTable.classList.add("zip-entries-table");

  const thead = createTheadForZipFileTable();
  const tbody = document.createElement("tbody");

  zipReader2.getEntries().then(function (entries) {
    entries.forEach(function (entry) {
      if (entry.directory) return; // skip directories
      if (entry.filename.startsWith("__MACOSX")) return; // skip mac os x files
      if (entry.filename.includes(".DS_Store")) return; // skip .DS_Store files

      createTrForZipFileTable(entry, tbody);
    });
  });

  entriesTable.appendChild(thead);
  entriesTable.appendChild(tbody);
  createModalForFiles(entriesTable, originalFileUrl, "zip", "", false);
}

function toCzechNumber(number) {
  return number.toLocaleString("cs-CZ", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
    useGrouping: true,
  });
}

function createTrForZipFileTable(
  entry: zip.Entry,
  tbody: HTMLTableSectionElement
) {
  const tr = document.createElement("tr");
  tr.title = `Klinutím zobrazíte obsah souboru ${entry.filename}. Soubor se stáhne, pokud jde o neznámý typ.`;

  // get shortcut name from entry.filename
  let extension = getExtensionFromEntryFilename(entry);

  // create td with filename
  const td = document.createElement("td");
  td.classList.add("zip-entry-filename");

  // detect / and replace it with <span>/</span>
  let betterFilename = entry.filename;
  betterFilename = betterFilename.replace(/\//g, "<span>/</span>");

  // get extension length
  const extLength = extension.length;
  // remove extension from filename
  betterFilename = betterFilename.slice(0, -extLength);
  // if last character is a dot
  let hasDot = betterFilename.slice(-1) === ".";
  let dot = "";
  if (hasDot) {
    // then remove it too
    betterFilename = betterFilename.slice(0, -1);
    dot = ".";
  }
  betterFilename += `<span>${dot}${extension}</span>`;

  // last part after / make <strong>
  const lastPart = betterFilename.split("<span>/</span>").pop() ?? "";
  betterFilename = betterFilename.replace(
    lastPart,
    `<strong>${lastPart}</strong>`
  );

  td.innerHTML = betterFilename;
  tr.appendChild(td);

  // create td with file size
  const tdSize = document.createElement("td") as HTMLTableCellElement;

  let originalSize = entry.uncompressedSize ?? 0;
  let betterSize = "";
  if (originalSize > 1000000) {
    betterSize = toCzechNumber(originalSize / 1000000) + " MB";
  } else if (originalSize > 1000) {
    betterSize = toCzechNumber(originalSize / 1000) + " KB";
  } else {
    betterSize = originalSize + " B";
  }

  tdSize.textContent = betterSize;
  tr.appendChild(tdSize);

  // create td with last modified date
  const tdDate = document.createElement("td") as HTMLTableCellElement;

  // localize date to czech and show only day, month, hour and minute
  let options = {
    day: "numeric",
    month: "numeric",
    hour: "numeric",
    minute: "numeric",
  } as Intl.DateTimeFormatOptions;

  tdDate.textContent = entry.lastModDate.toLocaleDateString("cs-CZ", options);
  tr.appendChild(tdDate);

  tbody.appendChild(tr);

  tr.dataset.filename = entry.filename;

  // when clicked on tr, show the file
  tr.addEventListener("click", function () {
    addClickEventToTr(tr);
  });
}

// Helper function to manage blob and URL creation and to open a modal
function handleBlobAndOpenModal(
  blob,
  fileType,
  entryFilename,
  showModalBackButton
) {
  const newBlob = new Blob([blob], { type: fileType });
  const objectURL = URL.createObjectURL(newBlob);
  createModalForFiles(
    objectURL,
    objectURL,
    fileType.split("/")[1],
    entryFilename,
    showModalBackButton
  );
}

function downloadFile(blob, filename) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  link.remove();
}

function processFileBasedOnType(entry, blob) {
  let extension = getExtensionFromEntryFilename(entry);

  if (filesAllowedToShowAsText.includes("." + extension)) {
    getTextFromBlobAndCreateModal(blob, entry, extension);
  } else if (filesAllowedToShowAsImage.includes("." + extension)) {
    handleBlobAndOpenModal(blob, `image/${extension}`, entry.filename, true);
  } else if (entry.filename.includes(".pdf")) {
    handleBlobAndOpenModal(blob, "application/pdf", entry.filename, true);
  } else {
    downloadFile(blob, entry.filename);
  }
}

function addClickEventToTr(tr: HTMLTableRowElement) {
  // @ts-ignore
  const zipReader = window.zipReaderData;

  // get entry data from zipReader
  zipReader.getEntries().then(function (entries) {
    // find entry by filename
    // also get filename from dataset.filename
    const entry = entries.find((e) => e.filename === tr.dataset.filename);

    entry.getData(new zip.BlobWriter()).then(function (blob) {
      processFileBasedOnType(entry, blob);
    });
  });
}

function getExtensionFromEntryFilename(entry: zip.Entry) {
  let extension = "";

  // split by / and get last element
  extension = entry.filename.split("/").pop() ?? "";

  // split by . and get last element
  extension = extension.split(".").pop() ?? "";
  return extension;
}

function getTextFromBlobAndCreateModal(blob: any, entry: any, type: any) {
  let typeCorrections = type;
  if (type === ".txt") {
    typeCorrections = "text";
  }
  const reader = new FileReader();
  reader.readAsText(blob);
  reader.addEventListener("load", function () {
    const dataUrl = URL.createObjectURL(blob);
    createModalForFiles(
      reader.result,
      dataUrl,
      typeCorrections,
      entry.filename,
      true
    );
  });
}

function manipulateWithWindowOpen() {
  // This will get argument url from window.open without changing the original function
  // @ts-ignore
  window.open = (function (original) {
    return function (url, windowName, windowFeatures) {
      if (zipBypassModal) {
        // NOTE: we have to use set timeout,
        // otherwise it calls itself with false on return
        setTimeout(function () {
          zipBypassModal = false;
        }, 100);

        return original(url, windowName, windowFeatures);
      }

      // show modal for files from fsx1.itstep.org
      const urlText = url as string;
      if (urlText.includes("https://fsx1.itstep.org/api/v1/files")) {
        whenOpeningLinkWithFile({
          urlText,
          original,
          url,
          windowName,
          windowFeatures,
        });
      } else {
        // returning original function
        return original(url, windowName, windowFeatures);
      }
    };
  })(window.open);
}

function whenOpeningLinkWithFile({
  urlText,
  original,
  url,
  windowName,
  windowFeatures,
}: {
  urlText: string;
  original: ((
    url?: string | URL,
    target?: string,
    features?: string
  ) => Window | null) &
    ((url?: string | URL, target?: string, features?: string) => Window | null);
  url: string | URL | undefined;
  windowName: string | undefined;
  windowFeatures: string | undefined;
}) {
  // fetch the file
  fetch(urlText, {
    method: "GET",
    headers: {
      "Content-Type": "text/plain;charset=UTF-8",
    },
  })
    .then((response) => {
      return response.blob();
    })
    .then((blob) => {
      // create a url for the file
      if (blob.type.includes("text")) {
        // read contents of the blob via FileReader
        const reader = new FileReader();

        reader.addEventListener("load", function () {
          const data = reader.result;
          createModalForFiles(data, urlText, "text");
        });

        reader.readAsText(blob);
      } else if (blob.type.includes("pdf")) {
        const url = URL.createObjectURL(blob);
        createModalForFiles(url, urlText, "pdf");
      } else if (blob.type.includes("zip")) {
        readZipFile(blob, urlText);
      } else {
        // returning original function for other type of files (images, unreadable files, etc.)
        return original(url, windowName, windowFeatures);
      }
    });
}

let debouncedTarget: HTMLElement;

function bypassModalWhenRightClicked() {
  document.addEventListener("contextmenu", function (event) {
    const target = event.target as HTMLElement;

    if (target.classList.contains("hw-md_stud-work__download-wrap")) {
      bypassModal();
    }

    if (target.classList.contains("hw-md_single_stud-work__download-wrap")) {
      bypassModal();
    }

    function bypassModal() {
      // prevent default context menu
      event.preventDefault();

      if (zipBypassModalFirstRun) {
        zipBypassModal = true;
        zipBypassModalFirstRun = false;
      }

      if (zipBypassModal) {
        target.click();

        zipBypassModal = false;

        setTimeout(function () {
          zipBypassModal = true;
        }, 300);
      }
    }
  });
}

function addKeyboardCtrlAShortcut(event: KeyboardEvent) {
  if (event.ctrlKey) {
    if (event.key === "a" || event.key === "A") {
      const homeWorks = document.querySelector(".homeWorks") as Element;
      if (homeWorks) {
        // if not textarea is focused
        focusedElement = document.activeElement as HTMLElement;

        if (focusedElement.tagName !== "TEXTAREA") {
          event.preventDefault();
        }
      }

      const modalFile = document.querySelector("#modal-file") as Element;
      if (modalFile) {
        if (modalFile.classList.contains("active")) {
          const pre = modalFile.querySelector(".modal-pre") as HTMLPreElement;
          const selection = window.getSelection() as Selection;
          const range = document.createRange();
          range.selectNodeContents(pre);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    }
  }
}

function addKeyboardBackspaceShortcut(event: KeyboardEvent) {
  // if #modal-file has classList active
  // when pressed backspace
  // trigger click on .btn-modal-zip-back
  if (event.key === "Backspace") {
    const modalFile = document.querySelector("#modal-file") as Element;
    if (modalFile) {
      if (modalFile.classList.contains("active")) {
        const backButton = modalFile.querySelector(
          ".btn-modal-zip-back"
        ) as HTMLElement;
        if (backButton) {
          backButton.click();
        }
      }
    }
  }
}

function regenerateMessageOnCtrlShiftSpace(target: HTMLElement) {
  let targetDialog = target.closest(".hw-better-buttons") as HTMLElement;

  // detect if target dialog has child with class .hw-md_content or .hw-md_single__content
  if (targetDialog === null) return;
  // if has class .hw-md_single__content
  let isSingle = targetDialog.classList.contains("hw-md_single__content");

  // get firstName and selectedMark
  let firstName = findStudentsFirstName(targetDialog, isSingle);
  let selectedMark = getSelectedMark(targetDialog);

  // add random message to the textarea
  automateMessagesForStudents(targetDialog, firstName, selectedMark);
}

// Helper function to determine if a space should be added
function shouldAddSpace(character, isStart) {
  // List of whitespace characters where we don't want to add an extra space
  const whitespaceChars = [" ", "\n", "\t"];

  // Check if the character at the specified position is not a space or is one of the whitespace characters
  if (isStart) {
    return !whitespaceChars.includes(character) ? " " : "";
  } else {
    return whitespaceChars.includes(character) ? "" : " ";
  }
}

function addTextAnswerToTextarea(target: HTMLElement, addedText: string) {
  let textarea = target as HTMLTextAreaElement;
  let cursorPosition = textarea.selectionStart;
  let text = textarea.value;
  let textBefore = text.substring(0, cursorPosition);
  let textAfter = text.substring(cursorPosition);

  // if user also selected a text, remove it
  // @ts-ignore
  let selectedText = window.getSelection().toString();
  if (selectedText) {
    textAfter = text.substring(cursorPosition + selectedText.length);
  }

  let addSpaceBefore = shouldAddSpace(textBefore.slice(-1), false);
  let addSpaceAfter = shouldAddSpace(textAfter.slice(0, 1), true);

  // detect if selectedText is the whole text in textarea
  // if so, remove it
  if (selectedText === text) {
    addSpaceBefore = "";
    addSpaceAfter = "";
  }

  // if textBefore is empty, dont add space before
  if (textBefore === "") {
    addSpaceBefore = "";
  }

  let textToAdd = addSpaceBefore + addedText + addSpaceAfter;
  let newText = textBefore + textToAdd + textAfter;

  textarea.value = newText;
  textarea.dispatchEvent(new Event("input"));
  textarea.dispatchEvent(new Event("change"));

  // set cursor position after the added text
  textarea.selectionStart = cursorPosition + textToAdd.length;
  textarea.selectionEnd = cursorPosition + textToAdd.length;

  textarea.focus();
}

function createAnswersAutocomplete(target, skipFocus = false) {
  // find parent .hw-better-buttons
  let targetDialog = target.closest(".hw-better-buttons") as HTMLElement;

  // add element to the textarea
  let teacherWrap = targetDialog.querySelector(
    ".hw-md_single_teacher__file-wrap"
  );

  if (teacherWrap) {
    // detect if element already exists
    let addedWrapElement = teacherWrap.querySelector(
      ".added-autocomplete-wrap"
    );
    if (addedWrapElement) {
      // set first element as active
      if (!skipFocus) {
        let firstElement = addedWrapElement.querySelector(
          ".added-autocomplete-answer"
        ) as HTMLElement;
        firstElement.focus();
      }

      return;
    }

    // create wrap element
    addedWrapElement = document.createElement("div");
    addedWrapElement.classList.add("added-autocomplete-wrap");
    addedWrapElement.classList.add("added-autocomplete-wrap-active");

    // create items from hwAutocompleteAnswers variable
    for (let i = 0; i < hwAutocompleteAnswers.length; i++) {
      let answer = hwAutocompleteAnswers[i];
      let answerText = answer.title;

      // crate new a href element
      let addedAnswerElement = document.createElement("a") as HTMLAnchorElement;
      addedAnswerElement.href = "#";
      addedAnswerElement.classList.add("added-autocomplete-answer");
      addedAnswerElement.textContent = answerText;

      const addClickForAnswerElement = function (
        this: HTMLAnchorElement,
        event: MouseEvent
      ): void {
        event.preventDefault();
        let answerChoice =
          answer.choices[Math.floor(Math.random() * answer.choices.length)];
        addTextAnswerToTextarea(target, answerChoice);
      };
      // when clicked
      addedAnswerElement.addEventListener("click", addClickForAnswerElement);

      addedWrapElement.appendChild(addedAnswerElement);
    }

    // add close element
    let addedCloseElement = document.createElement("a");
    addedCloseElement.href = "#";
    addedCloseElement.classList.add("added-autocomplete-close");
    addedCloseElement.textContent = "";
    addedCloseElement.title = "Zavřít rychlé odpovědi";

    addedCloseElement.addEventListener("click", function (event) {
      event.preventDefault();
      addedWrapElement.remove();
    });

    addedWrapElement.appendChild(addedCloseElement);
    teacherWrap.appendChild(addedWrapElement);

    // add info about keyboard shortcuts
    // to the closest .hw-md_single__add-comment element
    const addCommentElements = targetDialog.querySelectorAll(
      ".hw-md_single__add-comment"
    ) as NodeListOf<HTMLElement>;
    for (let i = 0; i < addCommentElements.length; i++) {
      const addCommentElement = addCommentElements[i] as HTMLElement;
      const textContent = addCommentElement.textContent ?? "";

      if (textContent.includes("Přidat komentář")) {
        addCommentElement.classList.add("added-autocomplete-info");
        addCommentElement.title =
          "Klávesové zkratky: Ctrl + mezerník pro rychlé odpovědi. Ctrl + Shift + mezerník pro náhodnou zprávu (je nutné předem vše smazat).";
      }
    }

    if (!skipFocus) {
      // set first element as active
      let firstElement = addedWrapElement.querySelector(
        ".added-autocomplete-answer"
      ) as HTMLElement;
      firstElement.focus();
    }
  }
}

function keyboardShortcutsForNewModalsBase(): (
  this: HTMLElement,
  ev: KeyboardEvent
) => any {
  return function (event) {
    addKeyboardCtrlAShortcut(event);
    addKeyboardBackspaceShortcut(event);

    // when pressing ctrl+space inside .hw-md_single_teacher__comment
    // add random message to the textarea
    if (event.ctrlKey && event.key === " ") {
      // get textarea from event target
      let target = event.target as HTMLElement;

      // if target is textarea
      if (target.classList.contains("hw-md_single_teacher__comment")) {
        // if user also pressed shift key
        if (event.shiftKey) {
          // find closest parent target "md-dialog"
          regenerateMessageOnCtrlShiftSpace(target);
          event.preventDefault();
        } else {
          createAnswersAutocomplete(target);
          event.preventDefault();
        }
      }
    } else if (event.key === " ") {
      // if any .added-autocomplete-answer is focused, then click on it
      focusedElement = document.activeElement as HTMLElement;
      if (focusedElement.classList.contains("added-autocomplete-answer")) {
        event.preventDefault();
        focusedElement.click();
      }
      if (focusedElement.classList.contains("added-autocomplete-close")) {
        event.preventDefault();
        focusedElement.click();
      }
    }
  };
}
function addKeyboardShortcutsForNewModals() {
  // Remove the previous event listener if it exists
  if (keyboardShortcutsForNewModals) {
    document.body.removeEventListener("keydown", keyboardShortcutsForNewModals);
  }

  // Create a new instance of the function
  keyboardShortcutsForNewModals = keyboardShortcutsForNewModalsBase();

  document.body.addEventListener(
    "keydown",
    keyboardShortcutsForNewModalsBase(),
    { once: true }
  );
}

function enhanceHomeworksMain() {
  function enhanceMultiHomeworks() {
    const homeworksWrap = document.querySelector(".hw-md_content") as Element;
    findAllUnfinishedHomeworksFromModal(homeworksWrap);
    observeIfNewHomeworksAdded(homeworksWrap);
  }

  function enhanceSingleHomework() {
    const homeworksSingleWrap = document.querySelector(".main") as Element;
    findAllUnfinishedHomeworksFromSingleModal(homeworksSingleWrap);
    enhanceSingleHomeworkFromModalAfterEvent();
  }

  enhanceMultiHomeworks();
  enhanceSingleHomework();

  // page_picker - add event listener to all buttons
  // - if clicked, remove all attributes alreadyEnhancedHomework
  // and then add them again so it will enhance all homeworks again
  const pagePicker = document.querySelector(".page_picker") as Element;
  pagePicker.addEventListener("click", function () {
    // remove all attributes alreadyEnhancedHomework
    const homeworksWrap = document.querySelectorAll(
      "[alreadyEnhancedHomework]"
    ) as NodeListOf<Element>;
    homeworksWrap.forEach(function (homework) {
      homework.removeAttribute("alreadyEnhancedHomework");
    });

    enhanceSingleHomework();

    // reset bypass modal
    zipBypassModal = false;
    zipBypassModalFirstRun = true;
  });
}

export function homeworkAutomation() {
  try {
    console.log("homeworkAutomation");

    enhanceHomeworksMain();

    // observeHomeworkCountAndUpdateMenu();

    manipulateWithWindowOpen();

    bypassModalWhenRightClicked();

    addKeyboardShortcutsForNewModals();
  } catch (error) {}
}
