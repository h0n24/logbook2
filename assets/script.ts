// @ts-nocheck

// imports ---------------------------------------------------------------------
// import * as incl from "./ts/_incl"; // TODO: check for unnecessary parts
import { checkForUrlChanges, observeProgressBar } from "./ts/_loading/loading";
import { changeDocumentLanguage } from "./ts/_loading/language";
import { autoLogin, onLogout } from "./ts/_loading/autoLogin";

import { attendance } from "./ts/attendance/attendance";
import { homeworkMulti } from "./ts/homework/homework-multi";

// import { homeworkEnhancements } from "./ts/presenceAddHomework";
// import { scheduleEnhancements } from "./ts/schedule";
// import { reportsEnhacements } from "./ts/reports";

// init ------------------------------------------------------------------------

function anyPageLoaded(url) {
  console.log("Stránka je načtená: ", url);
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

function homeworkPageLoaded() {
  // console.log("Domácí úkoly, stránka je načtená");
  homeworkMulti();
}

const urlHandlers = {
  "https://lb.itstep.org/auth/login": loginPageLoaded,
  "https://lb.itstep.org/attendance": attendancePageLoaded,
  "https://lb.itstep.org/homework": homeworkPageLoaded,
  default: anyPageLoaded,
};

(function () {
  changeDocumentLanguage();

  checkForUrlChanges(urlHandlers);
})();
