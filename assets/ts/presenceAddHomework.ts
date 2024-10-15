export function homeworkEnhancements(state) {
  if (state !== "presents.addHomeWork") return;

  const hash = window.location.hash;
  console.log("hash", hash);
  if (hash !== "#/presents/addHomeWork") return;

  // needs small timeout because angular firstly
  // adds and after that removes previous rows
  // so it would count previous rows as present
  setTimeout(function () {
    try {
      // reset value if its weird
      const max100mb = "(Maximálně 100 MB)";
      const inputFile = document.querySelector(
        '[ng-model="file_hw_filename"]'
      ) as HTMLInputElement;
      if (inputFile.value === "select_file_dz") {
        inputFile.value = max100mb;
      }

      const inputCover = document.querySelector(
        '[ng-model="file_cover"]'
      ) as HTMLInputElement;
      if (inputCover.value === "select_file_dz") {
        inputCover.value = max100mb;
      }

      // homeworkMessages ------------------------------------------------------

      const homeworkMessagesEl = document.querySelector(
        'textarea[ng-model="form.descr"]'
      ) as HTMLTextAreaElement;

      if (!homeworkMessagesEl) return;

      // preset basic message
      let duePartialMessage = "Na úkol je klasicky týden.";
      const message = `Milí studenti, čeká nás další úkol. V přiloženém souboru najdete veškeré informace. Jistě si s tím hravě poradíte. ${duePartialMessage} Těším se na Vaše práce. S pozdravem`;

      if (homeworkMessagesEl.innerText === "") {
        homeworkMessagesEl.innerText = message;
      }

      // Prevent automatic message being send as empty

      // simulate input event
      homeworkMessagesEl.dispatchEvent(new Event("input"));

      // trick Angular -> test if necessary (maybe event input is enough)
      // remove few angular classes
      homeworkMessagesEl.classList.remove("ng-empty");
      homeworkMessagesEl.classList.remove("ng-pristine");
      homeworkMessagesEl.classList.remove("ng-untouched");

      // add angular classes
      homeworkMessagesEl.classList.add("ng-not-empty");
      homeworkMessagesEl.classList.add("ng-dirty");
      homeworkMessagesEl.classList.add("ng-touched");
      homeworkMessagesEl.classList.add("ng-valid-parse");

      // add .md-input-has-value to md-input-container
      const inputContainer = homeworkMessagesEl.closest("md-input-container");
      if (inputContainer) {
        inputContainer.classList.add("md-input-has-value");
      }

      // TODO:
      // check if the date is selected then change duePartialMessage
    } catch (error) {}
  }, 100);
}
