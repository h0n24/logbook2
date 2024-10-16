import { enhanceHomeworkAssessment } from "./homework-base";

function processHomeworksOnScroll() {
  const homeworks = document.querySelectorAll(
    "app-new-homework-list app-homework-review"
  );

  const observerOptions = {
    root: null, // Use the viewport as the container
    rootMargin: "275px 0px 275px 0px", // Top margin of 50px, bottom margin of 975px
    threshold: 0, // Trigger when at least 0% of the homework is visible
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      // Check if the homework is within the observer's range
      if (entry.isIntersecting) {
        const homework = entry.target;
        // @ts-ignore
        if (!homework.dataset.processed) {
          try {
            enhanceHomeworkAssessment(homework);
            // @ts-ignore
            homework.dataset.processed = "true";
          } catch (error) {
            console.log(error);
          }
        }
        // Unobserve the homework since it's already processed
        observer.unobserve(homework);
      }
    });
  }, observerOptions);

  // Observe each homework item
  homeworks.forEach((homework) => observer.observe(homework));
}

export function homeworkMulti() {
  try {
    // console.log("homeworkAutomation");
    processHomeworksOnScroll();
  } catch (error) {
    console.log(error);
  }
}
