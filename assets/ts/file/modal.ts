// file name: modal.ts

import * as zip from "@zip.js/zip.js";
import { debounce } from "../_incl";

// TODO FUTURE: detect multiple opened modals and close them

const filesAllowedToShowAsText = [
  ".txt",
  ".js",
  ".css",
  ".html",
  ".json",
  ".md",
];
const filesAllowedToShowAsImage = [
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".svg",
  ".jfif",
];
let zipBypassModal = false; // allow at the beginning to open the file TODO: remove
let zipBypassModalFirstRun = true; // allow at the beginning to open the file TODO: remove

let focusedElement = document.activeElement as HTMLElement;
let keyboardShortcutsForNewModals = null as any; // TODO ADD: !!!
let backspaceEventListener = null as any;

function eventListenerForNewModal(event) {
  if (event.key === "Escape") {
    const dialogElement = document.querySelector("#modal-file") as Element;
    dialogElement.classList.remove("active");
    removeBackspaceEventListener();
  }
}

function createEventListenerForFileModal() {
  document.addEventListener("keyup", eventListenerForNewModal);
}

function removeBackspaceEventListener() {
  if (backspaceEventListener) {
    document.removeEventListener("keydown", backspaceEventListener);
    backspaceEventListener = null;
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

function convertnl2br(text: string) {
  return text.replace(/(?:\r\n|\r|\n)/g, "<br>");
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
    removeBackspaceEventListener();
  }

  const dialog = document.createElement("div");
  dialog.id = "modal-file";
  dialog.classList.add("modal-file", "active");

  // Create link with href #close class .modal-overlay and aria-label Close
  const modalOverlay = document.createElement("a");
  modalOverlay.href = "#close";
  modalOverlay.classList.add("modal-overlay");
  modalOverlay.setAttribute("aria-label", "Close");

  // Create modal container
  const container = document.createElement("div");
  container.classList.add("modal-container");

  // Create modal header
  const header = document.createElement("div");
  header.classList.add("modal-header");

  // Create close button
  const close = document.createElement("a");
  close.href = "#close";
  close.classList.add("btn-modal-close");
  close.title = "Klávesová zkratka: Escape";
  close.setAttribute("aria-label", "Close");

  // Create modal title
  const title = document.createElement("h4");
  createModalTitle(type, title);

  // Create modal body
  const body = document.createElement("div");
  body.classList.add("modal-body");

  // Create pre element to display content
  // @ts-ignore
  const pre = document.createElement("div") as HTMLPreElement;
  pre.classList.add("modal-pre");
  addDataToPre(type, data, pre);

  // Create modal footer
  const footer = document.createElement("div");
  footer.classList.add("modal-footer");

  // Add button to download original file
  const download = document.createElement("a");
  download.id = "modal-download-file";
  download.classList.add("btn", "btn-primary");
  updateDownloadButtonData(download, url, filename);

  // Add event listener to the download button
  if (!download.hasAttribute("data-listener-added")) {
    download.addEventListener("click", function (event) {
      event.preventDefault();

      // Get the current href and download attributes from the button
      const currentUrl = download.href;
      const currentFilename = download.getAttribute("download") || "file";

      // Fetch the file and download it directly
      fetch(currentUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = currentFilename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
        })
        .catch((error) => {
          console.error("Error downloading the file:", error);
          alert("Chyba při stahování souboru.");
        });
    });

    // Mark that the listener has been added
    download.setAttribute("data-listener-added", "true");
  }

  // Add event listeners to close the modal
  close.addEventListener("click", eventCloseNewModal);
  modalOverlay.addEventListener("click", eventCloseNewModal);

  // Close modal on escape key
  createEventListenerForFileModal();

  // Append elements to build the modal
  header.appendChild(title);
  header.appendChild(close);
  body.appendChild(pre);
  footer.appendChild(download);
  container.appendChild(header);
  container.appendChild(body);
  container.appendChild(footer);
  dialog.appendChild(modalOverlay);
  dialog.appendChild(container);

  // Append modal to body
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

    // Add event listener for backspace key
    backspaceEventListener = function (event) {
      if (event.key === "Backspace") {
        event.preventDefault();
        createZipFileTable();
      }
    };

    document.addEventListener("keydown", backspaceEventListener);

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
  download.setAttribute("download", filename || "file"); // Use the provided filename

  // Update button text and title
  if (filename === "") {
    download.innerHTML = "Stáhnout původní soubor";
  } else {
    let shorterFilename = filename;
    if (filename.length > 30) {
      const firstHalf = filename.slice(0, 15);
      const secondHalf = filename.slice(-15);
      shorterFilename = firstHalf + " … " + secondHalf;
    }
    download.title = `Celý vygenerovaný název souboru: ${filename}\n\nPro stáhnutí s původním názvem zavřete toto okno a klikněte na tlačítko pravým tlačítkem myši.`;
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

async function readZipFile(
  blob: Blob,
  originalFileUrl: string,
  filename: string
) {
  const reader = new FileReader();
  reader.readAsArrayBuffer(blob);

  reader.addEventListener("load", function () {
    const arrayBuffer = reader.result as ArrayBuffer;
    const uint8Array = new Uint8Array(arrayBuffer);
    const zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(uint8Array));

    // Save data to global variables
    // @ts-ignore
    window.zipReaderData = zipReader;
    // @ts-ignore
    window.zipOriginalFileUrl = originalFileUrl;
    // @ts-ignore
    window.zipOriginalFilename = filename;

    createZipFileTable();
  });
}

function createZipFileTable() {
  removeBackspaceEventListener();

  // @ts-ignore
  const zipReader2 = window.zipReaderData;
  // @ts-ignore
  const originalFileUrl = window.zipOriginalFileUrl;
  // @ts-ignore
  const filename = window.zipOriginalFilename || "file";

  const entriesTable = document.createElement("table");
  entriesTable.id = "zip-entries-table";
  entriesTable.classList.add("zip-entries-table");

  const thead = createTheadForZipFileTable();
  const tbody = document.createElement("tbody");

  zipReader2.getEntries().then(function (entries) {
    entries.forEach(function (entry) {
      if (entry.directory) return;
      if (entry.filename.startsWith("__MACOSX")) return;
      if (entry.filename.includes(".DS_Store")) return;

      createTrForZipFileTable(entry, tbody);
    });
  });

  entriesTable.appendChild(thead);
  entriesTable.appendChild(tbody);
  createModalForFiles(entriesTable, originalFileUrl, "zip", filename, false);
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

  // convert to lowercase
  extension = extension.toLowerCase();
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

function whenOpeningLinkWithFile({
  urlText,
  original,
  url,
  windowName,
  windowFeatures,
}: {
  urlText: string;
  original: any;
  url: string | URL | undefined;
  windowName: string | undefined;
  windowFeatures: string | undefined;
}) {
  // Use the last clicked filename
  let filename = lastClickedFilename || "file";

  // Fetch the file
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
      // Handle different file types
      if (blob.type.includes("text")) {
        const reader = new FileReader();

        reader.addEventListener("load", function () {
          const data = reader.result;
          createModalForFiles(data, urlText, "text", filename);
        });

        reader.readAsText(blob);
      } else if (blob.type.includes("pdf")) {
        const url = URL.createObjectURL(blob);
        createModalForFiles(url, urlText, "pdf", filename);
      } else if (blob.type.includes("zip")) {
        readZipFile(blob, urlText, filename);
      } else {
        // For other types, display the modal with the appropriate filename
        const url = URL.createObjectURL(blob);
        createModalForFiles(url, urlText, blob.type.split("/")[1], filename);
      }
    })
    .catch((error) => {
      console.error("Error fetching the file:", error);
    });
}

// Map to store URLs to filenames
const urlToFilenameMap = new Map<string, string>();

// Global variable to store the last clicked filename
let lastClickedFilename = "";

// Add event listener to capture clicks on the document
document.addEventListener("click", function (event) {
  const target = event.target as HTMLElement;
  // Check if the clicked element is one of the buttons or inside it
  const button = target.closest(
    ".hw-better-buttons__lector, .hw-better-buttons__student"
  ) as HTMLElement;

  if (button) {
    // Get the filename from data-filename attribute
    const filename = button.getAttribute("data-filename") || "file";
    // Update the last clicked filename
    lastClickedFilename = filename;
  }
});

export function fileModal() {
  // @ts-ignore
  window.customData = {
    zipBypassModal: false,
    whenOpeningLinkWithFile: function (params) {
      const { urlText, original, url, windowName, windowFeatures } = params;

      // Display a modal or custom UI
      whenOpeningLinkWithFile({
        urlText,
        original,
        url,
        windowName,
        windowFeatures,
      });
    },
  };
}
