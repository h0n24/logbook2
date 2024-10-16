"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.homeworkMulti = homeworkMulti;
var _homeworkBase = require("./homework-base");
function processHomeworksOnScroll() {
  var homeworks = document.querySelectorAll("app-new-homework-list .page-content > div");
  var observerOptions = {
    root: null,
    // Use the viewport as the container
    rootMargin: "275px 0px 275px 0px",
    // Top margin of 50px, bottom margin of 975px
    threshold: 0 // Trigger when at least 0% of the homework is visible
  };
  var observer = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      // Check if the homework is within the observer's range
      if (entry.isIntersecting) {
        var homework = entry.target;
        // @ts-ignore
        if (!homework.dataset.processed) {
          try {
            (0, _homeworkBase.enhanceHomeworkAssessment)(homework);
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
  homeworks.forEach(function (homework) {
    return observer.observe(homework);
  });
}
function homeworkMulti() {
  try {
    // console.log("homeworkAutomation");
    processHomeworksOnScroll();
  } catch (error) {
    console.log(error);
  }
}