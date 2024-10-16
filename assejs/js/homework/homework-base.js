"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enhanceHomeworkAssessment = enhanceHomeworkAssessment;
var _vocative = require("../vocative");
var zip = _interopRequireWildcard(require("@zip.js/zip.js"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; } // file name: homework-base.ts
var filesAllowedToShowAsText = [".txt", ".js", ".css", ".html", ".json", ".md"];
var filesAllowedToShowAsImage = [".png", ".jpg", ".jpeg", ".gif", ".svg"];
var zipBypassModal = false; // allow at the beginning to open the file
var zipBypassModalFirstRun = true; // allow at the beginning to open the file
var hwAutocompleteAnswers = [{
  title: "Super",
  choices: ["Super!", "Paráda!", "Skvělé!", "Super práce!", "Parádní!", "Super práce!", "Parádní práce!", "Dokonalé!", "Perfektní!", "Luxusní!", "Mega dobré!", "Hezké!", "Výborné!", "Wow!", "Wow, super!", "Bravo!", "Skvělá práce!"]
}, {
  title: "Díky",
  choices: ["Díky!", "Děkuji!", "Díky moc!", "Bezva, děkuju!", "Děkuji, skvělý!", "Díky, super!"]
}, {
  title: "Jejda",
  choices: ["Jejda, to se moc nepodařilo.", "Jejda, to se nepovedlo. :(", "Jejda, to se nepovedlo, zkus to znovu prosím."]
}, {
  title: "Znovu",
  choices: ["Zkus to znovu prosím.", "Zkus to ještě jednou prosím.", "Věřím, že to zvládneš opravit.", "Prosím pošli mi to ještě jednou.", "Prosím pošli mi to znovu.", "Prosím zkus si to opravit."]
}, {
  title: "Figma",
  choices: ["Komentáře přidány do Figmy.", "Rady a tipy jsem napsal do Figmy.", "Komentáře a rady k nalezení ve Figmě.", "Tipy přidány do Figmy jako komentáře."]
}];
function selectRandomFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Helper function to determine if a space should be added
function shouldAddSpace(character, isStart) {
  // List of whitespace characters where we don't want to add an extra space
  var whitespaceChars = [" ", "\n", "\t"];

  // Check if the character at the specified position is not a space or is one of the whitespace characters
  if (isStart) {
    return !whitespaceChars.includes(character) ? " " : "";
  } else {
    return whitespaceChars.includes(character) ? "" : " ";
  }
}
function betterButtonsRework(homework) {
  // Add new class .hw-better-buttons
  homework.classList.add("hw-better-buttons");
  try {
    var _lectorWrap$classList, _studentWrap$classLis;
    // Find the lector button
    var lectorWrap = homework.querySelector(".mdc-icon-button-xs");

    // Set the button text
    lectorWrap.innerHTML = "Zadání od lektora";
    lectorWrap.title = "Levé tlačítko: modální okno, pravé tlačítko: stáhnout";

    // Remove existing classes and add new ones
    (_lectorWrap$classList = lectorWrap.classList).remove.apply(_lectorWrap$classList, _toConsumableArray(lectorWrap.classList));
    lectorWrap.classList.add("hw-better-buttons__lector", "mdc-button", "mat-mdc-button", "mat-mdc-outlined-button");

    // Add the new attribute `data-filename` to `lectorWrap`
    var lectorFilename = extractFilenameFromLector(homework);
    lectorWrap.setAttribute("data-filename", lectorFilename);

    // Add right-click (contextmenu) event listener to lectorWrap
    lectorWrap.addEventListener("contextmenu", function (event) {
      event.preventDefault(); // Prevent the context menu from showing
      // Send a message to bypass the modal
      window.postMessage({
        type: "BY_PASS_MODAL"
      }, "*");
      // Programmatically trigger the click event on the button
      setTimeout(function () {
        lectorWrap.click();
      }, 10); // Delay in milliseconds
    });

    // Find the student button
    var studentWrap = homework.querySelector(".mat-mdc-icon-button");
    if (!studentWrap) return;

    // Set the button text
    studentWrap.innerHTML = "Stáhnout práci studenta";
    studentWrap.title = "Levé tlačítko: modální okno, pravé tlačítko: stáhnout";

    // Remove existing classes and add new ones
    (_studentWrap$classLis = studentWrap.classList).remove.apply(_studentWrap$classLis, _toConsumableArray(studentWrap.classList));
    studentWrap.classList.add("hw-better-buttons__student", "mdc-button", "mat-mdc-button", "mat-mdc-outlined-button", "mat-primary");

    // Add the new attribute `data-filename` to `studentWrap`
    var studentFilename = extractFilenameFromStudent(homework);
    studentWrap.setAttribute("data-filename", studentFilename);

    // Add right-click (contextmenu) event listener to studentWrap
    studentWrap.addEventListener("contextmenu", function (event) {
      event.preventDefault(); // Prevent the context menu from showing
      // Send a message to bypass the modal
      window.postMessage({
        type: "BY_PASS_MODAL"
      }, "*");
      // Programmatically trigger the click event on the button
      setTimeout(function () {
        studentWrap.click();
      }, 10); // Delay in milliseconds
    });
  } catch (error) {
    console.error("Error in betterButtonsRework:", error);
  }
}

// Helper function to extract filename for lector button
function extractFilenameFromLector(homework) {
  var _homework$querySelect;
  var parent = (_homework$querySelect = homework.querySelector(".hw-better-buttons__lector")) === null || _homework$querySelect === void 0 ? void 0 : _homework$querySelect.parentElement;
  if (parent) {
    var span = parent.querySelector("span.mx-2");
    if (span) {
      var text = span.textContent || "Zadani_od_lektora";
      return sanitizeFilename(text);
    }
  }
  return "Zadani_od_lektora";
}

// Helper function to extract filename for student button
function extractFilenameFromStudent(homework) {
  var appHomeworkReview = homework.querySelector("app-homework-review");
  if (appHomeworkReview) {
    var div = appHomeworkReview.querySelector("div.mb-1.ng-star-inserted .text-dark");
    var h2 = appHomeworkReview.querySelector("h2");
    if (div && h2) {
      var _h2$textContent, _div$textContent;
      var studentInfo = ((_h2$textContent = h2.textContent) === null || _h2$textContent === void 0 ? void 0 : _h2$textContent.trim()) || "Student";
      var dateInfo = ((_div$textContent = div.textContent) === null || _div$textContent === void 0 ? void 0 : _div$textContent.trim()) || "";
      // remove dots from dateInfo
      dateInfo = dateInfo.replace(/\./g, "");
      var text = "".concat(studentInfo, "_").concat(dateInfo);
      return sanitizeFilename(text);
    }
  }
  return "Prace_studenta";
}

// Function to sanitize filenames
function sanitizeFilename(name) {
  return name.replace(/[<>:"/\\|?*\x00-\x1F]/g, "").trim().replace(/\s+/g, "_");
}
function createUrlfromText(originalText) {
  // detect if text contains url
  var text = originalText;
  var url = text.match(/(https?:\/\/[^\s]+)/g);

  // make the url in the text clickable for every url
  if (url) {
    for (var i = 0; i < url.length; i++) {
      var selURL = url[i];

      // make url more readable
      var urlText = selURL;
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
        var firstHalf = urlText.slice(0, 15);
        var secondHalf = urlText.slice(-15);
        urlText = firstHalf + " … " + secondHalf;
      }
      text = text.replace(selURL, "<a href=\"".concat(selURL, "\" title=\"Cel\xE1 adresa: ").concat(selURL, "\" target=\"_blank\">").concat(urlText, "</a>"));
    }
    return text;
  }
}
function makeURLinTextClickable(homework) {
  try {
    var studentsComments = homework.querySelector(".review-hw__stud-answer");
    if (studentsComments === null) return;
    var originalText = studentsComments.innerText;
    if (!originalText) return;

    // Convert URLs in the text to clickable links
    var newText = createUrlfromText(originalText);
    if (newText) {
      studentsComments.innerHTML = newText;
    }

    // Find all links within studentsComments
    var links = studentsComments.querySelectorAll("a");
    links.forEach(function (link) {
      // Create the span element
      var span = document.createElement("span");
      span.classList.add("homework-copy-url-to-clipboard");
      span.textContent = "📋";
      span.title = "Kopírovat odkaz do schránky";

      // Insert the span directly after the link
      link.parentNode.insertBefore(span, link.nextSibling);

      // Insert br after the span
      var br = document.createElement("br");
      // @ts-ignore
      span.parentNode.insertBefore(br, span.nextSibling);

      // Remove leading whitespace from the following text node
      var nextNode = br.nextSibling;
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
function findStudentsFirstName(homework, single) {
  // const singleSel = single ? ".hw-md_single_stud__info" : ".hw-md_stud__info";
  //   const fullNameEl = homework.querySelector(`${singleSel} .bold`) as HTMLSpanElement;

  var singleSel = "app-homework-review h2";
  var fullNameEl = homework.querySelector(singleSel);
  if (!fullNameEl) return "";

  // find vocativ for a name
  var fullName = fullNameEl.innerText;
  var firstName = fullName.split(" ")[0];

  // apply vocativ only if the page is in czech language
  if (document.documentElement.getAttribute("lang") === "cs-CZ") {
    firstName = (0, _vocative.vocative)(firstName);
  }
  return firstName;
}
function getSelectedMark(homework) {
  var selectedMark = 0;

  // preselect maximmum mark only if it's not already selected
  var radioButtons = homework.querySelectorAll("mat-button-toggle-group .mat-button-toggle-button");
  radioButtons.forEach(function (radioButton) {
    // @ts-ignore - unofficial element
    if (radioButton.ariaPressed == "true") {
      var markElement = radioButton.querySelector(".mat-button-toggle-label-content");
      // @ts-ignore - unofficial element
      selectedMark = parseInt(markElement === null || markElement === void 0 ? void 0 : markElement.textContent) || 0;
    }
  });
  if (selectedMark == 0) {
    var maxMark = homework.querySelector("mat-button-toggle-group .mat-button-toggle-button");
    maxMark.click();
    selectedMark = 12;
  }
  return selectedMark;
}
function automateMessagesForStudents(homework, firstName, selectedMark) {
  var textarea = homework.querySelector("textarea");
  if (!textarea) return;

  // if textarea already has a some text value, don't overwrite it
  if (textarea.value) return;

  // remove focus functionality
  // if (textarea.getAttribute("md-select-on-focus")) {
  //   textarea.removeAttribute("md-select-on-focus");
  // }

  var partialInteresting = selectRandomFromArray(["Moc pěkná práce!", "Luxusní práce!", "Perfektní práce!", "Super práce!", "Super!", "Parádní práce!"]);
  var partialEnjoying = selectRandomFromArray(["Líbí se mi to.", "Je to moc zajímavé.", "Je to super.", "Je to parádní.", "Hodně dobře zpracované."]);
  // let partialGetting = selectRandomFromArray([
  //   "Dostáváš",
  //   "Dávám Ti",
  //   "Zasloužíš si",
  //   "Dostáváš ode mě",
  // ]);
  //  const message = `Zdravím ${firstName},\n\r${partialInteresting} ${partialEnjoying} ${partialGetting} ${selectedMark} bodů.\n\rS pozdravem`;
  var message = "Zdrav\xEDm ".concat(firstName, ",\n\r").concat(partialInteresting, " ").concat(partialEnjoying, "\n\rS pozdravem");
  textarea.value = message;

  // simulate input event
  textarea.dispatchEvent(new Event("input"));
  textarea.dispatchEvent(new Event("change"));
}
function addTextAnswerToTextarea(target, addedText) {
  var textarea = target;
  var cursorPosition = textarea.selectionStart;
  var text = textarea.value;
  var textBefore = text.substring(0, cursorPosition);
  var textAfter = text.substring(cursorPosition);

  // if user also selected a text, remove it
  // @ts-ignore
  var selectedText = window.getSelection().toString();
  if (selectedText) {
    textAfter = text.substring(cursorPosition + selectedText.length);
  }
  var addSpaceBefore = shouldAddSpace(textBefore.slice(-1), false);
  var addSpaceAfter = shouldAddSpace(textAfter.slice(0, 1), true);

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
  var textToAdd = addSpaceBefore + addedText + addSpaceAfter;
  var newText = textBefore + textToAdd + textAfter;
  textarea.value = newText;
  textarea.dispatchEvent(new Event("input"));
  textarea.dispatchEvent(new Event("change"));

  // set cursor position after the added text
  textarea.selectionStart = cursorPosition + textToAdd.length;
  textarea.selectionEnd = cursorPosition + textToAdd.length;
  textarea.focus();
}
function createAnswersAutocomplete(target) {
  var skipFocus = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  // find parent .hw-better-buttons
  var targetDialog = target.closest(".hw-better-buttons");

  // add element to the textarea
  var teacherWrap = targetDialog.querySelector("mat-form-field");
  if (teacherWrap) {
    // detect if element already exists
    var addedWrapElement = teacherWrap.querySelector(".added-autocomplete-wrap");
    if (addedWrapElement) {
      // set first element as active
      if (!skipFocus) {
        var firstElement = addedWrapElement.querySelector(".added-autocomplete-answer");
        firstElement.focus();
      }
      return;
    }

    // create wrap element
    addedWrapElement = document.createElement("div");
    addedWrapElement.classList.add("added-autocomplete-wrap");
    addedWrapElement.classList.add("added-autocomplete-wrap-active");

    // create items from hwAutocompleteAnswers variable
    var _loop = function _loop() {
      var answer = hwAutocompleteAnswers[i];
      var answerText = answer.title;

      // crate new a href element
      var addedAnswerElement = document.createElement("a");
      addedAnswerElement.href = "#";
      addedAnswerElement.classList.add("added-autocomplete-answer");
      addedAnswerElement.textContent = answerText;
      var addClickForAnswerElement = function addClickForAnswerElement(event) {
        event.preventDefault();
        var answerChoice = answer.choices[Math.floor(Math.random() * answer.choices.length)];
        addTextAnswerToTextarea(target, answerChoice);
      };
      // when clicked
      addedAnswerElement.addEventListener("click", addClickForAnswerElement);
      addedWrapElement.appendChild(addedAnswerElement);
    };
    for (var i = 0; i < hwAutocompleteAnswers.length; i++) {
      _loop();
    }

    // add close element
    var addedCloseElement = document.createElement("a");
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
      var _firstElement = addedWrapElement.querySelector(".added-autocomplete-answer");
      _firstElement.focus();
    }
  }
}
function enhanceHomeworkAssessment(homework, single) {
  // console.log("enhanceHomeworkAssessment");

  if (homework === null) return;
  // prevent doing this multiple times by adding a data-attribute alreadyEnhanced
  if (homework.getAttribute("alreadyEnhancedHomework") === "true") {
    return;
  } else {
    betterButtonsRework(homework);
    makeURLinTextClickable(homework);
    var firstName = findStudentsFirstName(homework, single);
    var selectedMark = getSelectedMark(homework);
    automateMessagesForStudents(homework, firstName, selectedMark);

    // add autocomplete
    var textarea = homework.querySelector("textarea");

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