import { vocative } from "./vocative";
import * as zip from "@zip.js/zip.js";

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

function selectRandomFromArray(array: string[]): string {
  return array[Math.floor(Math.random() * array.length)];
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

function betterButtonsRework(homework: Element) {
  // add new class .hw-better-buttons
  homework.classList.add("hw-better-buttons");

  try {
    // find .mat-icon
    let lectorWrap = homework.querySelector(
      ".mdc-icon-button-xs"
    ) as HTMLDivElement;
    // add text to it as "Stáhnout zadání od učitele"
    lectorWrap.innerHTML = "Zadání od lektora";
    // remove all classes and set a new one .hw-better-buttons__lector
    lectorWrap.classList.remove(...lectorWrap.classList);
    lectorWrap.classList.add(
      "hw-better-buttons__lector",
      "mdc-button",
      "mat-mdc-button",
      "mat-mdc-outlined-button"
    );

    // find .mdc-icon-button-xs
    let studentWrap = homework.querySelector(
      ".mat-mdc-icon-button"
    ) as HTMLDivElement;
    // add text to it as "Stáhnout studentovu práci"
    studentWrap.innerHTML = "Stáhnout práci studenta";
    // remove all classes and set a new one .hw-better-buttons__student
    studentWrap.classList.remove(...studentWrap.classList);
    studentWrap.classList.add(
      "hw-better-buttons__student",
      "mdc-button",
      "mat-mdc-button",
      "mat-mdc-outlined-button",
      "mat-primary"
    );
  } catch (error) {}
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

function makeURLinTextClickable(homework) {
  try {
    const studentsComments = homework.querySelector(".review-hw__stud-answer");
    if (studentsComments === null) return;

    let originalText = studentsComments.innerText;
    if (!originalText) return;

    // Convert URLs in the text to clickable links
    let newText = createUrlfromText(originalText);
    if (newText) {
      studentsComments.innerHTML = newText;
    }

    // Find all links within studentsComments
    const links = studentsComments.querySelectorAll("a");

    links.forEach((link) => {
      // Create the span element
      const span = document.createElement("span");
      span.classList.add("homework-copy-url-to-clipboard");
      span.textContent = "📋";
      span.title = "Kopírovat odkaz do schránky";

      // Insert the span directly after the link
      link.parentNode.insertBefore(span, link.nextSibling);

      // Insert br after the span
      const br = document.createElement("br");
      // @ts-ignore
      span.parentNode.insertBefore(br, span.nextSibling);

      // Remove leading whitespace from the following text node
      let nextNode = br.nextSibling;
      if (nextNode && nextNode.nodeType === Node.TEXT_NODE) {
        // @ts-ignore
        nextNode.textContent = nextNode.textContent.replace(/^\s+/, "");
      }

      // Add event listener to copy the URL to the clipboard
      span.addEventListener("click", function () {
        navigator.clipboard.writeText(link.href);
      });
    });
  } catch (error) {
    console.warn("makeURLinTextClickable error", error);
  }
}

function findStudentsFirstName(homework: Element, single?: boolean) {
  // const singleSel = single ? ".hw-md_single_stud__info" : ".hw-md_stud__info";
  //   const fullNameEl = homework.querySelector(`${singleSel} .bold`) as HTMLSpanElement;

  const singleSel = "app-homework-review h2";
  const fullNameEl = homework.querySelector(singleSel) as HTMLSpanElement;

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
    "mat-button-toggle-group .mat-button-toggle-button"
  ) as NodeListOf<HTMLInputElement>;

  radioButtons.forEach(function (radioButton) {
    // @ts-ignore - unofficial element
    if (radioButton.ariaPressed == "true") {
      const markElement = radioButton.querySelector(
        ".mat-button-toggle-label-content"
      );
      // @ts-ignore - unofficial element
      selectedMark = parseInt(markElement?.textContent) || 0;
    }
  });

  if (selectedMark == 0) {
    const maxMark = homework.querySelector(
      "mat-button-toggle-group .mat-button-toggle-button"
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
  const textarea = homework.querySelector("textarea") as HTMLTextAreaElement;

  if (!textarea) return;

  // if textarea already has a some text value, don't overwrite it
  if (textarea.value) return;

  // remove focus functionality
  // if (textarea.getAttribute("md-select-on-focus")) {
  //   textarea.removeAttribute("md-select-on-focus");
  // }

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
  // let partialGetting = selectRandomFromArray([
  //   "Dostáváš",
  //   "Dávám Ti",
  //   "Zasloužíš si",
  //   "Dostáváš ode mě",
  // ]);
  //  const message = `Zdravím ${firstName},\n\r${partialInteresting} ${partialEnjoying} ${partialGetting} ${selectedMark} bodů.\n\rS pozdravem`;
  const message = `Zdravím ${firstName},\n\r${partialInteresting} ${partialEnjoying}\n\rS pozdravem`;
  textarea.value = message;

  // simulate input event
  textarea.dispatchEvent(new Event("input"));
  textarea.dispatchEvent(new Event("change"));
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
  let teacherWrap = targetDialog.querySelector("mat-form-field");

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

    // TODO: add back ability to refresh quick answers
    // add info about keyboard shortcuts
    // to the closest .hw-md_single__add-comment element
    // const addCommentElements = targetDialog.querySelectorAll(
    //   ".hw-md_single__add-comment"
    // ) as NodeListOf<HTMLElement>;
    // for (let i = 0; i < addCommentElements.length; i++) {
    //   const addCommentElement = addCommentElements[i] as HTMLElement;
    //   const textContent = addCommentElement.textContent ?? "";

    //   if (textContent.includes("Přidat komentář")) {
    //     addCommentElement.classList.add("added-autocomplete-info");
    //     addCommentElement.title =
    //       "Klávesové zkratky: Ctrl + mezerník pro rychlé odpovědi. Ctrl + Shift + mezerník pro náhodnou zprávu (je nutné předem vše smazat).";
    //   }
    // }

    if (!skipFocus) {
      // set first element as active
      let firstElement = addedWrapElement.querySelector(
        ".added-autocomplete-answer"
      ) as HTMLElement;
      firstElement.focus();
    }
  }
}

export function enhanceHomeworkAssessment(homework: Element, single?: boolean) {
  console.log("enhanceHomeworkAssessment");

  if (homework === null) return;
  // prevent doing this multiple times by adding a data-attribute alreadyEnhanced
  if (homework.getAttribute("alreadyEnhancedHomework") === "true") {
    return;
  } else {
    betterButtonsRework(homework);

    makeURLinTextClickable(homework);

    let firstName = findStudentsFirstName(homework, single);
    let selectedMark = getSelectedMark(homework);
    automateMessagesForStudents(homework, firstName, selectedMark);

    // add autocomplete
    const textarea = homework.querySelector("textarea") as HTMLTextAreaElement;

    // TODO: check if necessary
    // select parent
    // const parent = textarea.parentElement as HTMLElement;
    // parent.addEventListener("onchange", function () {
    //   createAnswersAutocomplete(textarea, true);
    // });

    // when textarea is focused, show autocomplete
    textarea.addEventListener("focus", function () {
      createAnswersAutocomplete(textarea, true);
    });

    homework.setAttribute("alreadyEnhancedHomework", "true");
  }
}
