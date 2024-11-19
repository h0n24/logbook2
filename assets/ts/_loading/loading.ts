// file name: loading.ts

declare global {
  interface Window {
    progressBarObserver: MutationObserver | null;
    lastExecutedNavigationId: number | null;
    isLoading: boolean;
    isNewNavigation: boolean;
    navigationId: number;
    lastHandledUrl: string | null;
  }
}

type UrlHandlers = Record<string, (url: string) => void> & {
  default: (url: string) => void;
};

function observeProgressBar(func: () => void, navigationId: number) {
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
        func();
        window.lastExecutedNavigationId = navigationId;
      }
    }
  } else {
    console.error("app-root element not found");
  }
}

function checkForUrlChanges(urlHandlers: UrlHandlers) {
  let lastUrl = location.href;

  // Initialize global variables
  window.isLoading = false;
  window.isNewNavigation = false;
  window.navigationId = 0;
  window.lastExecutedNavigationId = null;

  // Initial call
  handleUrlChange(lastUrl, urlHandlers);

  const checkUrl = function () {
    if (location.href !== lastUrl) {
      lastUrl = location.href;

      // Main logic when URL changes
      handleUrlChange(lastUrl, urlHandlers);
    } else {
      // Check for navigation changes when URL hasn't changed
      const progressBar = document.querySelector("app-root mat-progress-bar");

      if (progressBar && !window.isLoading) {
        // Navigation has started
        window.isLoading = true;
        window.isNewNavigation = true;
      } else if (!progressBar && window.isLoading) {
        // Navigation has completed
        window.isLoading = false;

        // Handle navigation completion
        handleUrlChange(lastUrl, urlHandlers);
      }
    }
    requestAnimationFrame(checkUrl);
  };

  requestAnimationFrame(checkUrl);
}

function handleUrlChange(url: string, urlHandlers: UrlHandlers) {
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

    handleSpecificUrl(url, urlHandlers);
  }
}

function handleSpecificUrl(url: string, urlHandlers: UrlHandlers) {
  const parsedUrl = new URL(url);
  const fullUrlWithoutQuery = parsedUrl.origin + parsedUrl.pathname;

  const specificHandler = urlHandlers[fullUrlWithoutQuery];
  if (specificHandler) {
    observeProgressBar(() => specificHandler(url), window.navigationId);
  } else {
    observeProgressBar(() => urlHandlers.default(url), window.navigationId);
  }
}

export { checkForUrlChanges, observeProgressBar };
