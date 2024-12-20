// file name: script.ts

// imports ---------------------------------------------------------------------
// import * as incl from "./ts/_incl"; // TODO: check for unnecessary parts
import { checkForUrlChanges, observeProgressBar } from "./ts/_loading/loading";
import { changeDocumentLanguage } from "./ts/_loading/language";
import { autoLogin, onLogout } from "./ts/_loading/autoLogin";

import { attendance } from "./ts/attendance/attendance"; // TODO: incorporate replaceDates
import { homeworkMulti } from "./ts/homework/homework-multi";
import { homeworkSingle } from "./ts/homework/homework-single";

// import { homeworkEnhancements } from "./ts/presenceAddHomework"; //TODO + incorporate into attendance
import { timetable } from "./ts/timetable/timetable";

// init ------------------------------------------------------------------------

function anyPageLoaded(url) {
  // console.log("Stránka je načtená: ", url);
  onLogout(); // needs to be added to all pages to prevent silent access
}

function loginPageLoaded() {
  // console.log("Login, stránka je načtená");
  autoLogin();
}

function attendancePageLoaded() {
  // console.log("Přítomnost, stránka je načtená");
  attendance();
}

function homeworkMultiPageLoaded() {
  // console.log("Domácí úkoly multi, stránka je načtená");
  homeworkMulti();
}

function homeworkSinglePageLoaded() {
  // console.log("Domácí úkoly single, stránka je načtená");
  homeworkSingle();
}

function timetablePageLoaded() {
  // console.log("Rozvrh, stránka je načtená");
  timetable();
}

const urlHandlers = {
  "https://lb.itstep.org/auth/login": loginPageLoaded,
  "https://lb.itstep.org/attendance": attendancePageLoaded,
  "https://lb.itstep.org/homework": homeworkMultiPageLoaded,
  "https://lb.itstep.org/homework/homeworks": homeworkSinglePageLoaded,
  "https://lb.itstep.org/timetable": timetablePageLoaded,
  default: anyPageLoaded,
};

(function () {
  changeDocumentLanguage();

  checkForUrlChanges(urlHandlers);
})();
