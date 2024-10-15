function hideEmptyColumn(table, columnNumber) {
  const column = table.querySelectorAll(`td:nth-child(${columnNumber + 1})`);

  // detect if empty
  let allColumnsEmpty = true;

  column.forEach((cell) => {
    const cellElement = cell as HTMLTableCellElement;
    if (cellElement.innerText.trim() !== "") {
      allColumnsEmpty = false;
    }
  });

  if (allColumnsEmpty) {
    column.forEach((cell) => {
      const cellElement = cell as HTMLTableCellElement;
      cellElement.classList.add("hidden-column");
    });
  }

  // add class to tr th if all columns are empty
  const header = table.querySelector(
    `th:nth-child(${columnNumber + 1})`
  ) as HTMLTableHeaderCellElement;
  if (allColumnsEmpty) {
    header.classList.add("hidden-column");
  } else {
    header.classList.remove("hidden-column");
  }
}

function hideEmptyCheckboxController(table: HTMLTableElement) {
  // check if checkbox already exists
  const checkbox = document.querySelector(".hide-empty-cols-checkbox");
  if (checkbox) return;

  const newDiv = document.createElement("div");
  newDiv.classList.add("hide-empty-cols-wrapper");

  // create checkbox element
  const newCheckbox = document.createElement("input");
  newCheckbox.type = "checkbox";
  newCheckbox.id = "hideEmptyCols";
  newCheckbox.classList.add("hide-empty-cols-checkbox");
  newCheckbox.checked = true;
  newCheckbox.addEventListener("change", function () {
    if (newCheckbox.checked) {
      table.classList.add("hide-empty-cols");
    } else {
      table.classList.remove("hide-empty-cols");
    }
  });

  // create label for checkbox
  const newLabel = document.createElement("label");
  newLabel.htmlFor = "hideEmptyCols";
  newLabel.innerText = "Skrýt prázdné sloupce";

  newDiv.appendChild(newCheckbox);
  newDiv.appendChild(newLabel);

  // add div to table
  table.parentElement?.insertBefore(newDiv, table);
}

function hideEmptyColumnsMain() {
  // get table from .table-wrapper .lab_work-table
  const table = document.querySelector(
    ".table-wrapper .lab_work-table"
  ) as HTMLTableElement;
  if (!table) return;

  // add default class to table
  table.classList.add("hide-empty-cols");

  // get number of columns
  const columns = table.querySelectorAll("th");
  const columnsLength = columns.length;

  for (let i = 1; i < columnsLength; i++) {
    hideEmptyColumn(table, i);
  }

  // add div with checkbox
  hideEmptyCheckboxController(table);
}

export function reportsEnhacements(state) {
  if (state !== "report") return;

  const hash = window.location.hash;
  if (hash !== "#/report") return;

  // needs small timeout because angular firstly
  // adds and after that removes previous rows
  // so it would count previous rows as present
  setTimeout(function () {
    try {
      console.log("reportAutomation");
      hideEmptyColumnsMain();
    } catch (error) {}
  }, 100);
}
