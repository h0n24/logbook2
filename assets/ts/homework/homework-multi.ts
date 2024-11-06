import { enhanceHomeworkAssessment } from "./homework-base";

// Variables to keep track of the homework counts
let totalHomeworks = 0;

function setHomeworksCount(count: number) {
  let homeworksCount = document.querySelector(
    "lib-submenu > div a.active"
  ) as HTMLElement;

  if (!homeworksCount) return;

  const xLanguage = localStorage?.getItem("X-Language") || null;

  if (xLanguage === "cs") {
    homeworksCount.textContent = `Úkoly k ověření: ${count}`;
  } else if (xLanguage === "sk") {
    homeworksCount.textContent = `Úkoly na overovanie: ${count}`;
  } else {
    homeworksCount.textContent = `Homeworks to verify: ${count}`;
  }
}

function processHomeworksOnScroll() {
  // Get all homework items and update the total count
  const homeworks = document.querySelectorAll(
    "app-new-homework-list app-homework-review"
  );
  totalHomeworks = homeworks.length;
  setHomeworksCount(totalHomeworks);

  const observerOptions = {
    root: null, // Use the viewport as the container
    rootMargin: "275px 0px 275px 0px", // Margins for triggering
    threshold: 0, // Trigger when at least 0% of the homework is visible
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const homework = entry.target as HTMLElement;
        if (!homework.dataset.processed) {
          try {
            enhanceHomeworkAssessment(homework);
            homework.dataset.processed = "true";

            // Recalculate the total homeworks in case new ones are added dynamically
            totalHomeworks = document.querySelectorAll(
              "app-new-homework-list app-homework-review"
            ).length;
            setHomeworksCount(totalHomeworks);
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
    processHomeworksOnScroll();
  } catch (error) {
    console.log(error);
  }
}
