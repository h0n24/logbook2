// file name: homework-base.ts

import { vocative } from "../vocative";

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

function betterButtonsRework(homework: Element, single?: boolean) {
  // Add new class .hw-better-buttons
  homework.classList.add("hw-better-buttons");

  if (single) {
    homework.classList.add("hw-better-buttons_single");
  }

  try {
    // Find the lector button
    let lectorWrap = homework.querySelector(
      ".mdc-icon-button-xs"
    ) as HTMLDivElement;

    if (!lectorWrap) {
      lectorWrap = homework.querySelector(
        "h2 + div a[download]"
      ) as HTMLDivElement;

      if (!lectorWrap) return;
    }

    // Set the button text
    lectorWrap.innerHTML = "Zadání od lektora";
    lectorWrap.title = "Levé tlačítko: modální okno, pravé tlačítko: stáhnout";

    // Remove existing classes and add new ones
    lectorWrap.classList.remove(...lectorWrap.classList);
    lectorWrap.classList.add(
      "hw-better-buttons__lector",
      "mdc-button",
      "mat-mdc-button",
      "mat-mdc-outlined-button"
    );

    // Add the new attribute `data-filename` to `lectorWrap`
    const lectorFilename = extractFilenameFromLector(homework);
    lectorWrap.setAttribute("data-filename", lectorFilename);

    // Add right-click (contextmenu) event listener to lectorWrap
    lectorWrap.addEventListener("contextmenu", function (event) {
      event.preventDefault(); // Prevent the context menu from showing
      // Send a message to bypass the modal
      window.postMessage({ type: "BY_PASS_MODAL" }, "*");
      // Programmatically trigger the click event on the button
      setTimeout(() => {
        lectorWrap.click();
      }, 10); // Delay in milliseconds
    });

    // Find the student button
    let studentWrap = homework.querySelector(
      ".mat-mdc-icon-button"
    ) as HTMLDivElement;

    // class="mdc-button mdc-button--unelevated mat-mdc-unelevated-button mat-primary mat-mdc-button-base"

    if (!studentWrap) {
      console.log("No studentWrap found, probably single homework");

      studentWrap = homework.querySelector(
        ".mb-2.ng-star-inserted a[download]"
      ) as HTMLDivElement;

      console.log("studentWrap", studentWrap);

      if (!studentWrap) return;
    }

    // Set the button text
    studentWrap.innerHTML = "Stáhnout práci studenta";
    studentWrap.title = "Levé tlačítko: modální okno, pravé tlačítko: stáhnout";

    // Remove existing classes and add new ones
    studentWrap.classList.remove(...studentWrap.classList);
    studentWrap.classList.add(
      "hw-better-buttons__student",
      "mdc-button",
      "mat-mdc-button",
      "mat-mdc-outlined-button",
      "mat-primary"
    );

    // Add the new attribute `data-filename` to `studentWrap`
    const studentFilename = extractFilenameFromStudent(homework);
    studentWrap.setAttribute("data-filename", studentFilename);

    // Add right-click (contextmenu) event listener to studentWrap
    studentWrap.addEventListener("contextmenu", function (event) {
      event.preventDefault(); // Prevent the context menu from showing
      // Send a message to bypass the modal
      window.postMessage({ type: "BY_PASS_MODAL" }, "*");
      // Programmatically trigger the click event on the button
      setTimeout(() => {
        studentWrap.click();
      }, 10); // Delay in milliseconds
    });
  } catch (error) {
    console.error("Error in betterButtonsRework:", error);
  }
}

// Helper function to extract filename for lector button
function extractFilenameFromLector(homework: Element): string {
  const parent = homework.querySelector(
    ".hw-better-buttons__lector"
  )?.parentElement;
  if (parent) {
    const span = parent.querySelector("span.mx-2") as HTMLSpanElement;
    if (span) {
      const text = span.textContent || "Zadani_od_lektora";
      return sanitizeFilename(text);
    }
  }
  return "Zadani_od_lektora";
}

// Helper function to extract filename for student button
function extractFilenameFromStudent(homework: Element): string {
  if (homework) {
    const div = homework.querySelector("div.mb-1.ng-star-inserted .text-dark");
    const h2 = homework.querySelector("h2");

    if (div && h2) {
      let studentInfo = h2.textContent?.trim() || "Student";
      let dateInfo = div.textContent?.trim() || "";
      // remove dots from dateInfo
      dateInfo = dateInfo.replace(/\./g, "");

      let text = `${studentInfo}_${dateInfo}`;
      return sanitizeFilename(text);
    }
  }
  return "Prace_studenta";
}

// Function to sanitize filenames
function sanitizeFilename(name: string): string {
  return name
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
    .trim()
    .replace(/\s+/g, "_");
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
    let studentsComments = homework.querySelector(".review-hw__stud-answer");

    if (!studentsComments) {
      console.warn("No studentsComments found");

      studentsComments = homework.querySelector(
        ".d-flex.mb-2.ng-star-inserted p.m-0"
      );

      console.log("studentsComments", studentsComments);

      if (!studentsComments) return;
    }

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

  // preselect maximum mark only if it's not already selected
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

  // if textarea already has some text value, don't overwrite it
  if (textarea.value) return;

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

function addRandomMessageToTextarea(textarea: HTMLTextAreaElement) {
  let homework = textarea.closest("app-homework-review") as HTMLElement;
  let firstName = findStudentsFirstName(homework);
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
  const message = `Zdravím ${firstName},\n\r${partialInteresting} ${partialEnjoying}\n\rS pozdravem`;
  textarea.value = message;
  textarea.dispatchEvent(new Event("input"));
  textarea.dispatchEvent(new Event("change"));
}

function focusNextAutocompleteAnswer(currentElement: HTMLElement) {
  let parent = currentElement.parentElement;
  if (!parent) return;
  let autocompleteAnswers = parent.querySelectorAll(
    ".added-autocomplete-answer"
  ) as NodeListOf<HTMLElement>;
  let currentIndex = Array.prototype.indexOf.call(
    autocompleteAnswers,
    currentElement
  );
  let nextIndex = (currentIndex + 1) % autocompleteAnswers.length;
  autocompleteAnswers[nextIndex].focus();
}

function createAnswersAutocomplete(target, skipFocus = false) {
  // find parent .hw-better-buttons
  let targetDialog = target.closest(
    "app-homework-review.hw-better-buttons"
  ) as HTMLElement;

  // add element to the textarea
  let teacherWrap = targetDialog.querySelector("mat-form-field") as HTMLElement;

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

      // create new a href element
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

      // when keydown
      addedAnswerElement.addEventListener("keydown", function (event) {
        if (event.key === " " || event.key === "Spacebar") {
          // Prevent default scrolling behavior
          event.preventDefault();
          // Simulate click
          this.click();
        } else if (event.ctrlKey && event.key === " ") {
          // Handle Ctrl + Space to focus next autocomplete answer
          event.preventDefault();
          focusNextAutocompleteAnswer(this);
        }
      });

      addedWrapElement.appendChild(addedAnswerElement);
    }

    // Add info about keyboard shortcuts
    // Create the info element
    let infoElement = document.createElement("span");
    infoElement.classList.add("added-autocomplete-info");
    infoElement.innerHTML = "?";
    infoElement.title =
      "Klávesové zkratky:\nCtrl + mezerník pro rychlé odpovědi. Tab / Shift + Tab pro přechod mezi odpověďmi. Mezerník pro vybrání odpovědi.\nCtrl + Shift + mezerník pro náhodnou zprávu.\nCtrl + Enter pro odeslání.";

    addedWrapElement.appendChild(infoElement);

    // add close element
    let addedCloseElement = document.createElement("a");
    addedCloseElement.href = "#";
    addedCloseElement.classList.add("added-autocomplete-close");
    addedCloseElement.textContent = "";
    addedCloseElement.title = "Zavřít rychlé odpovědi";

    addedCloseElement.addEventListener("click", function (event) {
      event.preventDefault();
      console.log("addedCloseElement clicked");
      console.log("addedWrapElement", addedWrapElement);

      addedWrapElement.remove();
      target.focus();
    });

    addedWrapElement.appendChild(addedCloseElement);
    teacherWrap.appendChild(addedWrapElement);

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
  // console.log("enhanceHomeworkAssessment");

  if (homework === null) return;
  // prevent doing this multiple times by adding a data-attribute alreadyEnhanced
  if (homework.getAttribute("alreadyEnhancedHomework") === "true") {
    return;
  } else {
    betterButtonsRework(homework, single);

    makeURLinTextClickable(homework);

    let firstName = findStudentsFirstName(homework, single);
    let selectedMark = getSelectedMark(homework);
    automateMessagesForStudents(homework, firstName, selectedMark);

    // add autocomplete
    const textarea = homework.querySelector("textarea") as HTMLTextAreaElement;

    // when textarea is focused, show autocomplete
    textarea.addEventListener("focus", function () {
      createAnswersAutocomplete(textarea, true);
    });

    // Add keydown event listener to handle Ctrl shortcuts
    textarea.addEventListener("keydown", function (event) {
      if (event.ctrlKey && event.shiftKey && event.key === " ") {
        event.preventDefault();
        // Remove all text and add a random message
        textarea.value = "";
        addRandomMessageToTextarea(textarea);
      } else if (event.ctrlKey && event.key === " ") {
        event.preventDefault();
        createAnswersAutocomplete(textarea, false);
        // Focus the first autocomplete answer
        let firstAnswer = homework.querySelector(
          ".added-autocomplete-answer"
        ) as HTMLElement;
        if (firstAnswer) {
          firstAnswer.focus();
        }
      }

      if (event.ctrlKey && event.key === "Enter") {
        event.preventDefault();
        // Trigger button.mat-primary inside that particular app-homework-review element
        let appHomeworkReview = textarea.closest("app-homework-review");
        if (appHomeworkReview) {
          let matPrimaryButton = appHomeworkReview.querySelector(
            "button.mat-primary.mat-mdc-unelevated-button"
          ) as HTMLButtonElement;
          if (matPrimaryButton) {
            matPrimaryButton.click();
          }
        }
      }
    });

    homework.setAttribute("alreadyEnhancedHomework", "true");
  }
}
