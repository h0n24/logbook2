// file name: listener.ts
// @ts-nocheck

// Global variable to store whether the modal should be bypassed
let shouldBypassModal = false;

// Listen for messages from the page context
window.addEventListener("message", function (event) {
  if (event.source !== window) {
    return; // Only accept messages from the same window
  }
  if (event.data && event.data.type === "BY_PASS_MODAL") {
    // console.log("Received message to bypass modal");

    // Send a message to the background script
    chrome.runtime.sendMessage({ type: "BY_PASS_MODAL" }, function (response) {
      // console.log("Background script acknowledged BY_PASS_MODAL");
    });
  }
});

// Existing code to handle file downloads
export function fileListener() {
  chrome.runtime.onMessage.addListener(function (
    request: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ) {
    if (request.type === "NEW_WINDOW_OPENED" && request.url) {
      const urlText = request.url;
      // console.log("New window or tab was opened:", urlText);

      // Check if the URL includes the specified text
      if (urlText.includes("https://fsx1.itstep.org/api/v1/files")) {
        if (shouldBypassModal) {
          // Bypass the modal and proceed to download directly
          setTimeout(() => {
            shouldBypassModal = false; // Reset the flag
          }, 100);

          // Allow the download to proceed by not calling the custom handler
          // return;
        } else {
          // Call the custom handler to display the modal
          if (window.customData) {
            window.customData.whenOpeningLinkWithFile({
              urlText: urlText,
              original: null, // Original window.open is not accessible here
              url: urlText,
              windowName: request.windowName,
              windowFeatures: request.windowFeatures,
            });
          }
        }
      } else {
        // console.log("URL does not match the specified pattern.");
      }
    }
  });
}
