// @ts-nocheck

export function fileListener() {
  chrome.runtime.onMessage.addListener(function (
    request: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ) {
    if (request.type === "NEW_WINDOW_OPENED" && request.url) {
      const urlText = request.url;
      console.log("New window or tab was opened:", urlText);

      // Check if the URL includes the specified text
      if (urlText.includes("https://fsx1.itstep.org/api/v1/files")) {
        // Call the custom handler
        if (window.customData) {
          window.customData.whenOpeningLinkWithFile({
            urlText: urlText,
            original: null, // Original window.open is not accessible here
            url: urlText,
            windowName: request.windowName,
            windowFeatures: request.windowFeatures,
          });
        }
      } else {
        console.log("URL does not match the specified pattern.");
      }
    }
  });
}
