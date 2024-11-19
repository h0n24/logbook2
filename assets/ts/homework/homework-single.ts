// file name: homework-single.ts

import { enhanceHomeworkAssessment } from "./homework-base";

function observeCdkOverlayContainer() {
  console.log("observeCdkOverlayContainer");

  // Function to start observing when .cdk-overlay-container is available
  const startObserving = () => {
    const overlayContainer = document.querySelector(".cdk-overlay-container");

    if (overlayContainer) {
      const observer = new MutationObserver((mutations) => {
        // When mutations occur, check if 'app-homework-review' is present
        const homework = overlayContainer.querySelector("app-homework-review");
        if (homework) {
          // Enhance the homework assessment
          enhanceHomeworkAssessment(homework, true);
        }
      });

      // Observe changes in the child list and subtree
      observer.observe(overlayContainer, { childList: true, subtree: true });
    } else {
      // If not found, try again after a short delay
      setTimeout(startObserving, 500);
    }
  };

  startObserving();
}

export function homeworkSingle() {
  try {
    setTimeout(() => {
      observeCdkOverlayContainer();
    }, 500);
  } catch (error) {
    console.error("Error in homeworkSingle:", error);
  }
}
