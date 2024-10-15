"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.presence = presence;
var incl = _interopRequireWildcard(require("../_incl"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
// TODO: refactor this file into separate files

var selectorForWorkInClass = ".wrapper-students thead tr th:nth-child(8)";
var titleTextNotRated = "Pozor: máte nepřidělené známky";
var titleTextNotDiamonds = "Pozor: máte nepřidělené diamanty";
function hideMarkPopup(event, popup) {
  // click outside
  setTimeout(function () {
    incl.clickOnPosition(event.clientX - 50, event.clientY);
    document.body.style.cursor = "default";
  }, 500);
  setTimeout(function () {
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
  var maxMark = popup.querySelector("md-option[value='12']");
  maxMark.click();

  // change z-index to don't block scroll
  popup.style.zIndex = "-1";
  hideMarkPopup(event, popup);
}
function addContextMenu(event) {
  event.preventDefault();
  incl.clickOnPosition(event.clientX, event.clientY);
  var popupID = event.target.getAttribute("aria-owns");
  var isEnabled = event.target.getAttribute("aria-disabled") === "false";
  var popup = document.getElementById(popupID);
  if (popup && isEnabled) {
    set12Mark(event, popup);
  }
}
function whenClickedOnPresenceTh() {
  var workInClass = document.querySelector(selectorForWorkInClass);
  workInClass.title = "Pravé tlačítko: Dát maximální známku všem studentům. Pozor: trvá +1 sekundu za každého žáka.";
  workInClass.addEventListener("contextmenu", function (event) {
    event.preventDefault();
    incl.showLoader();
    var classWorkSelects = document.querySelectorAll('.presentr-classWork md-select[aria-disabled="false"]');
    var iteration = 0;
    classWorkSelects.forEach(function (select, key, parent) {
      var popupID = select.getAttribute("aria-owns");
      var popup = document.getElementById(popupID);

      // skip if already selected
      try {
        var isAlreadySelected = select.querySelector(".md-select-value .md-text");
        if (isAlreadySelected.innerHTML === "12") return;
      } catch (error) {}

      // click on select on our behalf
      setTimeout(function () {
        set12Mark(event, popup);
      }, key * 1000 + 1);

      // last iteration
      if (key === parent.length - 1) {
        setTimeout(function () {
          hideMarkPopup(event, popup);
        }, (key + 1) * 1000 + 500);
      }
      iteration = key + 1;
    });
    setTimeout(function () {
      return incl.hideLoader();
    }, iteration * 1000 + 2);
  });
}
function addContextMenuForEachSelect() {
  try {
    var selects = document.querySelectorAll("mat-form-field");
    selects.forEach(function (select) {
      select.addEventListener("contextmenu", addContextMenu);
      select.title = "Levé tlačítko: Otevřít — Pravé tlačítko: Dát maximální známku";
    });
  } catch (error) {}
}
function countPresentStudents() {
  var students = document.querySelectorAll(".wrapper-students tbody tr .presents");
  var total = Object.keys(students).length;
  var totalStudents = total ? total : 0;
  var totalPresent = 0;
  students.forEach(function (student) {
    var dots = student.querySelectorAll("span");
    var wasPresent = 0;
    dots.forEach(function (dot) {
      var selection = dot.querySelector("i:last-child");
      if (selection.classList.contains("ng-hide")) return;
      if (selection.classList.contains("was-not")) return;
      wasPresent++;
    });
    totalPresent += wasPresent;
  });
  var thTotal = document.querySelector(".wrapper-students thead .number");
  thTotal.innerHTML = "".concat(totalPresent, "/").concat(totalStudents);
  thTotal.title = "Celkový počet přítomných / celkový počet studentů";
}
function whenPresenceChanged() {
  var presenceButtons = document.querySelectorAll(".presents > span");
  presenceButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      setTimeout(function () {
        return countPresentStudents();
      }, 250);
    });
  });
}
function hideMaterialsWhenNoTeacher(isTeacher) {
  var addMaterial = document.querySelector(".add-material");
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
  var teacherRole = document.querySelectorAll(".teacherInit .check-techers input");
  var selected = false;
  teacherRole.forEach(function (input) {
    if (input.checked) {
      selected = true;
    }
  });
  hideMaterialsWhenNoTeacher(selected);
}
function removeActiveTabs() {
  var tabs = document.querySelectorAll(".presents ul.pars li");
  tabs.forEach(function (tab) {
    if (tab.classList.contains("active")) {
      tab.classList.remove("active");
    }
  });
}

// opravuje chybu, kdy se "zaškrtne" i když není studentů
function correctBugTabsActiveWhenBreak() {
  // find if there is a break
  var breakSelector = "body > main > div:nth-child(4) > div > div.interna-wrap > div:nth-child(2) > h3";
  var targetBreakText = "Máte přestávku nebo momentálně neprobíhá hodina";
  var breakElement = document.querySelector(breakSelector);
  if (!breakElement) return;
  if (!breakElement.innerHTML.includes(targetBreakText)) return;

  // check if its currently visible on screen
  var observer = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting === true) {
      // console.log("Element is fully visible in screen");
      removeActiveTabs();
    }
  }, {
    threshold: [1]
  });
  observer.observe(breakElement);
}
function automaticallySelectOnlineForOnlineGroups() {
  var groupName = document.querySelector(".groupName");
  var groupNameText = groupName.textContent;
  if (groupNameText.includes("JAO")) {
    // automatically set student as online to every online group

    // if no checkbox in class .check-techers is checked, return
    var checkboxes = document.querySelectorAll(".check-techers input");
    var isAnyChecked = false;
    checkboxes.forEach(function (checkbox) {
      if (checkbox.checked) {
        isAnyChecked = true;
      }
    });
    if (!isAnyChecked) return;

    // when clicked on .presents .presents span
    var presents = document.querySelectorAll(".presents .presents span");
    presents.forEach(function (present) {
      present.addEventListener("click", function () {
        setTimeout(function () {
          // select closest tr
          var tr = present.closest("tr");
          if (!tr) return;

          // select checkbox
          var checkbox = tr.querySelector(".presents-online input[type='checkbox']");
          if (!checkbox) return;

          // if only one checkbox is not checked, click on it
          if (!checkbox.checked) {
            checkbox.click();
          }
        }, 500);
      });
    });

    // for design purposes -> to change color/opacity
    // add class hide-cell-online to class .wrapper-students
    var wrapperStudents = document.querySelector(".wrapper-students");
    if (wrapperStudents) {
      wrapperStudents.classList.add("hide-cells-online");
    }

    // for UX purposes -> add title to every checkbox
    var checkbox = document.querySelectorAll(".presents-online input[type='checkbox']");
    if (checkbox) {
      checkbox.forEach(function (check) {
        var checkBox = check;
        checkBox.title = "Pokud je student na hodině, automaticky se zaškrtne při přítomnosti, netřeba nic dalšího dělat.";
      });
    }
    var checkboxLabel = document.querySelector('label[for="isAllOnline"]');
    if (checkboxLabel) {
      checkboxLabel.title = "U online skupin je automaticky zaškrtnuto online při přítomnosti";
    }
  }
}
function detectIfNotDiamonds() {
  function detectDiamonds() {
    var diamondsElement = document.querySelector(".diamonds .diamond");
    var activeTabElement = document.querySelector(".presents .pars li.active");
    if (diamondsElement) {
      var diamonds = diamondsElement.textContent;
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
  function debounceDetectIfDiamods() {
    return function () {
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
    var awarded = document.querySelectorAll(".awarded span i");
    awarded.forEach(function (award) {
      // remove previous listener
      award.removeEventListener("click", debounceDetectIfDiamods());
      award.addEventListener("click", debounceDetectIfDiamods());
    });
  } catch (error) {}
}
function detectIfNotRated() {
  function debounceDetectIfNotRated() {
    return function () {
      incl.debounce(detectIfNotRated, 3000)();
    };
  }
  var activeTabElement = document.querySelector(".presents .pars li.active");
  try {
    // detect every md-select
    var selects = document.querySelectorAll('.presentr-classWork md-select[aria-disabled="false"]');

    // find if atleast one of those's innerHTML contains "-"
    // find element "md-select-value" and check if it contains "-"
    var isNotRated = false;
    selects.forEach(function (select) {
      var selectValue = select.querySelector(".md-select-value span");
      var selectValueText = selectValue === null || selectValue === void 0 ? void 0 : selectValue.textContent;
      if (selectValueText !== null && selectValueText !== void 0 && selectValueText.includes("-")) {
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
    var classWorkSelects = document.querySelectorAll(".presentr-classWork md-input-container");
    classWorkSelects.forEach(function (select) {
      select.removeEventListener("click", debounceDetectIfNotRated());
      select.addEventListener("click", debounceDetectIfNotRated());
    });
    var classWorkSelects2 = document.querySelector(selectorForWorkInClass);
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
  var tableCopyExists = document.querySelector("#print-table");
  if (tableCopyExists) {
    tableCopyExists.remove();
  }
  var table = document.querySelector(".wrapper-students table");
  var tableCopy = table.cloneNode(true);
  tableCopy.id = "print-table";
  tableCopy.classList.add("print-table");

  // remove hidden + uncheck
  var presentsOnline = tableCopy.querySelectorAll(".presents-online input");
  presentsOnline.forEach(function (input) {
    var inputElement = input;
    inputElement.classList.remove("ng-hide");
    inputElement.checked = false;
  });

  // append new body to html with table
  var newBody = document.createElement("body");
  newBody.id = "print-table-body";

  // create new h1 with content of .groupName
  var h1 = document.createElement("h1");
  h1.classList.add("print-table-title");
  var groupName = document.querySelector(".groupName");
  h1.innerHTML = "Skupina: " + groupName.textContent;
  newBody.appendChild(h1);

  // create new h2 with content of .specName
  var h2 = document.createElement("h2");
  h2.classList.add("print-table-subtitle");
  var specName = document.querySelector(".specName");
  var specNameText = specName.textContent;
  specNameText = specNameText.replace("(", "");
  specNameText = specNameText.replace(")", "");
  h2.innerHTML = "Téma: " + specNameText;
  newBody.appendChild(h2);

  // create new h3 with date
  var h3 = document.createElement("h3");
  h3.classList.add("print-table-subtitle");
  var date = new Date();
  var options = {
    year: "numeric",
    month: "numeric",
    day: "numeric"
  };
  var dateText = date.toLocaleDateString("cs-CZ", options);
  var firstTimeText = "";
  var secondTimeText = "";
  try {
    var firstTimeElement = document.querySelector(".pars .tab.active a");
    firstTimeText = firstTimeElement.textContent;
    // text looks like this: '\n                        15:30 - 16:30\n                    '
    firstTimeText = firstTimeText.replace(/\s/g, "");
    firstTimeText = firstTimeText.replace("\n", "");
    firstTimeText = firstTimeText.split("-")[0];

    // get next element after ".pars .tab.active" that has class .tab
    var firstTimeElementParent = firstTimeElement.parentElement;
    var nextElement = firstTimeElementParent.nextElementSibling;
    var secondTimeElement = nextElement.querySelector("a");
    secondTimeText = secondTimeElement.textContent;
    secondTimeText = secondTimeText.replace(/\s/g, "");
    secondTimeText = secondTimeText.replace("\n", "");
    secondTimeText = secondTimeText.split("-")[1];
  } catch (error) {}
  if (firstTimeText == "" || secondTimeText == "") {
    h3.textContent = "Datum: " + dateText;
  } else {
    h3.textContent = "Datum: " + dateText + ", " + firstTimeText + "–" + secondTimeText;
  }
  newBody.appendChild(h3);
  newBody.appendChild(tableCopy);
  document.documentElement.appendChild(newBody);

  // original body with class .main hide via hidden attribute
  var main = document.querySelector("body.main");
  main.hidden = true;

  // create temporary style for printing
  var style = document.createElement("style");
  style.innerHTML = "\n    @media print {\n      .print-table {\n        width: max-content !important;\n        font-size: 12px;\n        border-collapse: collapse;\n      }\n      .print-table th, .print-table td {\n        // border: 1px solid #000;\n        padding: 8px;\n        min-width: auto !important;\n        width: auto !important;\n        height: auto !important;\n        text-align: left !important;\n        color: #000 !important;\n      }\n    }\n\n    .open-menu-block, md-sidenav, toolbar, .topPanel {\n      display: none;\n    }\n    .table-wrapper .table {\n      display: none;\n    }\n\n    #print-table {\n      margin-top: 1rem;\n      display: table !important;\n    }\n\n    #print-table .presents_stud td:not(.name) {\n        display: none;\n    }\n\n    #print-table .presents_stud .number {\n      display: table-cell !important;\n      color: #000;\n      font-weight: 300;\n    }\n\n    #print-table .presents_stud .presents-online {\n      display: table-cell !important;\n    }\n\n    #print-table .presents_stud [ng-model=\"stud.was\"] {\n        display: none;\n    }\n    \n    #print-table thead {\n        display: none;\n    }\n\n    .print-table-title {\n      font-weight: 500;\n      font-size: 20px;\n      margin-bottom: 1rem;\n    }\n\n    .print-table-subtitle {\n      font-weight: 300;\n      font-size: 16px;\n      margin-bottom: 0.5rem;\n    }\n    \n  ";
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
  addEventListener("afterprint", function (event) {
    returnToOriginal();
  });
  setTimeout(function () {
    returnToOriginal();
  }, 1000);
}
function printTable() {
  var _testTableContent;
  // if table doesnt have any content, return
  var testTable = document.querySelector(".wrapper-students table tbody");
  var testTableContent = (testTable === null || testTable === void 0 ? void 0 : testTable.textContent) || "";
  testTableContent = (_testTableContent = testTableContent) === null || _testTableContent === void 0 ? void 0 : _testTableContent.replace(/\s/g, "");
  if (!testTableContent) return;

  // if print-students-button exists, return
  var printButtonExists = document.querySelector("#print-students-button");
  if (printButtonExists) {
    return;
  }

  // prepend button to .topPanel .dialog-demo-content
  var topPanel = document.querySelector(".topPanel .dialog-demo-content");
  var printButton = document.createElement("a");
  printButton.href = "#";
  printButton.id = "print-students-button";
  printButton.title = "Tisk studentů";
  printButton.innerHTML = "🖨️";
  printButton.classList.add("print-students-button");
  printButton.addEventListener("click", function () {
    copyTableForPrinting();
  });
  topPanel.appendChild(printButton);
}

// TODO: rework this whole function
function presenceEnhancements(state) {
  if (state !== "presents") return;
  var hash = window.location.hash;
  if (hash !== "#/presents") return;

  // needs small timeout because angular firstly
  // adds and after that removes previous rows
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
      var tabs = document.querySelectorAll(".presents .pars li");
      tabs.forEach(function (tab) {
        tab.addEventListener("click", detectIfNotRatedOrDiamonds);
      });

      // observe .table-wrapper for changes
      var tableWrapper = document.querySelector(".table-wrapper");
      var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          if (mutation.addedNodes.length) {
            automaticallySelectOnlineForOnlineGroups();
            detectIfNotRatedOrDiamonds();
          }
        });
      });
      observer.observe(tableWrapper, {
        childList: true,
        subtree: true
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
function presence() {
  console.log("jsem tu");
  addContextMenuForEachSelect();
}