// @ts-nocheck

// TODO: block assets that are super slow, such as outdated jquery, raven and few material js and css

//  and then load them from the extension

// imports ---------------------------------------------------------------------
// import * as incl from "./ts/_incl"; // TODO: check for unnecessary parts
import { homeworkMulti } from "./ts/homework-multi";
// import { manipulateWithWindowOpen } from "./ts/homework-modal";

// import { autoLogin, onLogout } from "./ts/autoLogin";
// import { onContextMenu, addInfoForMenu } from "./ts/contextMenu";
// import { checkPing } from "./ts/checkPing";
// import { presenceEnhancements } from "./ts/presence";
// import { homeworkEnhancements } from "./ts/presenceAddHomework";
// import { addRightClickStar } from "./ts/contextMenuStar";
// import { scheduleEnhancements } from "./ts/schedule";
// import { reportsEnhacements } from "./ts/reports";

// grab links to assets and download them
// TODO: dont forget to manually comment validateCommentLength() in homeWOrkCtrl.js as its buggy
let needsRedownloadAssets = false;
import { findScripts } from "./ts/automate/find-js-files";
if (needsRedownloadAssets) {
  alert("Downloading assets, please wait around 20 seconds.");
  findScripts();
}

// init ------------------------------------------------------------------------

// change language on site (it keeps the same, ru-RU all the time)
document.documentElement.setAttribute("lang", "cs-CZ");

// TODO:
// right click on menu -> leads to doubleclick to prevent waiting
// document.body.addEventListener("contextmenu", onContextMenu);

// TODO: after angular ---------------------------------------------------------------
// // auto login
// autoLogin(state);
// onLogout(state);
// // UX QOL improvements
// addInfoForMenu();
// addRightClickStar();
// function runAfterObserve() {
//   // general stuff
//   replaceDates();
//   replaceStrings();
//   // specific stuff
//   presenceEnhancements(state);
//   homeworkEnhancements(state);
//   homeworkAutomation(state);
//   scheduleEnhancements(state);
//   reportsEnhacements(state);
// }

function anyPageLoaded(url) {
  console.log("Stránka je načtená: ", url);
}

function homeworkPageLoaded() {
  console.log("Domácí úkoly, stránka je načtená");
  homeworkMulti();
}

function observeProgressBar(func, navigationId) {
  const appRoot = document.querySelector("app-root");

  if (appRoot) {
    const progressBar = appRoot.querySelector("mat-progress-bar");

    if (progressBar) {
      // Observe the progress bar for removal
      const progressBarObserver = new MutationObserver(() => {
        if (!appRoot.contains(progressBar)) {
          // Progress bar has been removed
          progressBarObserver.disconnect();
          window.progressBarObserver = null;
          // console.log("mat-progress-bar has been removed from the DOM");

          // Check if this navigation has already been handled
          if (window.lastExecutedNavigationId !== navigationId) {
            func();
            window.lastExecutedNavigationId = navigationId;
          }
        }
      });

      // Observe the parent of the progress bar for childList changes
      progressBarObserver.observe(appRoot, {
        childList: true,
        subtree: true,
      });

      window.progressBarObserver = progressBarObserver;
    } else {
      // Progress bar is not present; execute function immediately

      // Check if this navigation has already been handled
      if (window.lastExecutedNavigationId !== navigationId) {
        // console.log(
        //   "mat-progress-bar is not present. Executing function immediately."
        // );
        func();
        window.lastExecutedNavigationId = navigationId;
      }
    }
  } else {
    console.error("app-root element not found");
  }
}

(function () {
  let lastUrl = location.href;

  // Initialize global variables
  window.isLoading = false;
  window.isNewNavigation = false;
  window.navigationId = 0;
  window.lastExecutedNavigationId = null;

  // Initial call
  handleUrlChange(lastUrl);

  const checkUrl = function () {
    if (location.href !== lastUrl) {
      lastUrl = location.href;

      // Main logic when URL changes
      handleUrlChange(lastUrl);
    } else {
      // Check for navigation changes when URL hasn't changed
      const progressBar = document.querySelector("app-root mat-progress-bar");

      if (progressBar && !window.isLoading) {
        // Navigation has started
        window.isLoading = true;
        window.isNewNavigation = true;
        // console.log("Navigation detected. Loading started.");
      } else if (!progressBar && window.isLoading) {
        // Navigation has completed
        window.isLoading = false;
        // console.log("Navigation completed.");

        // Handle navigation completion
        handleUrlChange(lastUrl);
      }
    }
    requestAnimationFrame(checkUrl);
  };

  requestAnimationFrame(checkUrl);
})();

function handleUrlChange(url) {
  // Initialize navigation tracking variables if not already set
  if (window.lastHandledUrl === undefined) {
    window.lastHandledUrl = null;
  }
  if (window.navigationId === undefined) {
    window.navigationId = 0;
  }

  // Proceed if the URL has changed or if it's a new navigation
  if (window.lastHandledUrl !== url || window.isNewNavigation) {
    window.lastHandledUrl = url;
    window.isNewNavigation = false; // Reset the flag after handling

    // Disconnect any existing observer to avoid duplicates
    if (window.progressBarObserver) {
      window.progressBarObserver.disconnect();
      window.progressBarObserver = null;
    }

    // Increment navigation ID to track unique navigations
    window.navigationId++;

    if (url === "https://lb.itstep.org/homework") {
      observeProgressBar(homeworkPageLoaded, window.navigationId);
    } else {
      observeProgressBar(() => anyPageLoaded(url), window.navigationId);
    }
  }
}
