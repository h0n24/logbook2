// file: background.ts
// @ts-nocheck

let shouldBypassModal = false;

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === "BY_PASS_MODAL") {
    shouldBypassModal = true;
    console.log("Background script set shouldBypassModal to true");
    sendResponse({ acknowledged: true });
  }
});

// Listen for new tabs/windows being opened
chrome.webNavigation.onCreatedNavigationTarget.addListener(function (details) {
  console.log("New window or tab opened:", details);

  // Only process the new tab if the URL matches the specific pattern
  if (
    details.url &&
    details.url.includes("https://fsx1.itstep.org/api/v1/files")
  ) {
    if (shouldBypassModal) {
      // Bypass the modal, initiate download
      console.log("Bypassing modal, initiating download");
      shouldBypassModal = false; // Reset the flag

      // Initiate the download via chrome.downloads API
      chrome.downloads.download({ url: details.url }, function (downloadId) {
        if (chrome.runtime.lastError) {
          console.error("Download failed:", chrome.runtime.lastError.message);
        } else {
          console.log("Download initiated with ID:", downloadId);
        }
      });

      // Close the new tab
      chrome.tabs.remove(details.tabId);
    } else {
      // Close the new tab or window:
      chrome.tabs.remove(details.tabId);

      // Send a message to the content script
      chrome.tabs.sendMessage(details.sourceTabId, {
        type: "NEW_WINDOW_OPENED",
        tabId: details.tabId,
        url: details.url,
      });
    }
  } else {
    // Do not close the new tab for other URLs
    console.log("New tab opened with URL:", details.url);
  }
});
