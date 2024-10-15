// @ts-nocheck
// Detect new window or tab opened (usefull when downloading assets)
chrome.webNavigation.onCreatedNavigationTarget.addListener(function (details) {
  console.log("New window or tab opened:", details);

  // Only close the new tab if the URL matches the specific pattern
  if (
    details.url &&
    details.url.includes("https://fsx1.itstep.org/api/v1/files")
  ) {
    // Close the new tab or window:
    chrome.tabs.remove(details.tabId);

    // Send a message to the content script
    chrome.tabs.sendMessage(details.sourceTabId, {
      type: "NEW_WINDOW_OPENED",
      tabId: details.tabId,
      url: details.url,
    });
  } else {
    // Do not close the new tab for other URLs
    console.log("New tab opened with URL:", details.url);
  }
});
