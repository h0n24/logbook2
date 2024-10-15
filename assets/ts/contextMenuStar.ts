function addContextMenu(event): void {
  event.preventDefault();

  // @ts-ignore: Not in this file, it's on the website
  angular.element(document).scope().showTeachingNotifications();
}

function addContextMenuForStar() {
  try {
    const select = document.querySelector(
      "toolbar .evaluation_star"
    ) as HTMLElement;

    select.addEventListener("contextmenu", addContextMenu);
    select.title = "Levé tlačítko: Otevřít — Pravé tlačítko: Zobrazit Evaulaci";
  } catch (error) {}
}

// add right click to menu
export function addRightClickStar() {
  // we need to wait until angular part is ready
  // todo: potential rework, but dunno how yet
  setTimeout(function () {
    // add it to currently visible
    try {
      addContextMenuForStar();
    } catch (error) {}
  }, 1);
}
