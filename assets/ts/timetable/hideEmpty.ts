function isRowEmpty(row: HTMLTableRowElement): boolean {
  const cells = row.querySelectorAll("td");
  for (const cell of cells) {
    if (cell.classList.contains("mat-column-time")) continue;
    if (cell.innerText.trim() !== "") {
      return false;
    }
  }
  return true;
}

function getFirstContentRowIndex(
  rows: NodeListOf<HTMLTableRowElement>
): number {
  for (let i = 0; i < rows.length; i++) {
    if (!isRowEmpty(rows[i])) {
      return i;
    }
  }
  return -1; // All rows are empty
}

function getLastContentRowIndex(rows: NodeListOf<HTMLTableRowElement>): number {
  for (let i = rows.length - 1; i >= 0; i--) {
    if (!isRowEmpty(rows[i])) {
      return i;
    }
  }
  return -1; // All rows are empty
}

function processRows(
  rows: NodeListOf<HTMLTableRowElement>,
  firstContentRowIndex: number,
  lastContentRowIndex: number
): void {
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const isEmpty = isRowEmpty(row);

    // Remove any existing .last-visible-row class
    row.classList.remove("last-visible-row");

    if (i < firstContentRowIndex) {
      // Rows before the first content row
      if (i === firstContentRowIndex - 1 && isEmpty) {
        // Keep the last empty row before content visible
        row.classList.remove("hidden-row");
      } else if (isEmpty) {
        // Hide other empty rows before content
        row.classList.add("hidden-row");
      } else {
        row.classList.remove("hidden-row");
      }
    } else if (i > lastContentRowIndex) {
      // Rows after the last content row
      if (i === lastContentRowIndex + 1 && isEmpty) {
        // Keep the first empty row after content visible
        row.classList.remove("hidden-row");
      } else if (isEmpty) {
        // Hide other empty rows after content
        row.classList.add("hidden-row");
      } else {
        row.classList.remove("hidden-row");
      }
    } else {
      // Rows between first and last content rows
      row.classList.remove("hidden-row");
    }
  }
}

function updateLastVisibleRow(rows: NodeListOf<HTMLTableRowElement>): void {
  let lastVisibleRow: HTMLTableRowElement | null = null;
  for (let i = rows.length - 1; i >= 0; i--) {
    const row = rows[i];
    if (!row.classList.contains("hidden-row")) {
      lastVisibleRow = row;
      break;
    }
  }

  // Remove .last-visible-row from all rows
  rows.forEach((row) => row.classList.remove("last-visible-row"));

  // Add .last-visible-row to the last visible row, if any
  if (lastVisibleRow) {
    lastVisibleRow.classList.add("last-visible-row");
  }
}

function createHideEmptyRowsCheckbox(table: HTMLTableElement): void {
  // Check if the checkbox already exists
  const existingCheckbox = document.querySelector("#hideEmptyRows");
  if (existingCheckbox) return;

  // Create container div
  const newDiv = document.createElement("div");
  newDiv.classList.add("hide-empty-rows-wrapper");

  // Create checkbox element
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = "hideEmptyRows";
  checkbox.checked = true;

  // Create label element
  const label = document.createElement("label");
  label.htmlFor = "hideEmptyRows";
  label.innerText = "Zobrazuji pouze řádky s obsahem";

  // Event listener for checkbox
  checkbox.addEventListener("change", function () {
    const isChecked = (this as HTMLInputElement).checked;
    if (isChecked) {
      table.classList.add("hide-empty-rows");
      label.innerText = "Zobrazuji pouze řádky s obsahem";
    } else {
      table.classList.remove("hide-empty-rows");
      label.innerText = "Skrýt řádky bez obsahu";
    }
  });

  // Append elements
  newDiv.appendChild(checkbox);
  newDiv.appendChild(label);

  // Append to the table wrapper
  const tableWrapper = document.querySelector(".schedule__name") as HTMLElement;
  tableWrapper.innerHTML = "";
  tableWrapper.appendChild(newDiv);
}

function hideRowsWithEmptyContent() {
  const table = document.querySelector(
    "app-schedule-table table"
  ) as HTMLTableElement;
  if (!table) return;

  table.classList.add("hide-empty-rows");

  const rows = table.querySelectorAll("tr") as NodeListOf<HTMLTableRowElement>;

  const firstContentRowIndex = getFirstContentRowIndex(rows);
  const allRowsEmpty = firstContentRowIndex === -1;

  if (allRowsEmpty) {
    // If all rows are empty, do not hide any rows
    rows.forEach((row) => {
      row.classList.remove("hidden-row", "last-visible-row");
    });
    return;
  }

  const lastContentRowIndex = getLastContentRowIndex(rows);

  processRows(rows, firstContentRowIndex, lastContentRowIndex);

  updateLastVisibleRow(rows);

  createHideEmptyRowsCheckbox(table);
}

// Add right-click to menu
export function hideEmptyRows() {
  // Needs a small timeout because Angular first adds and then removes previous rows
  // So it would count previous rows as present
  setTimeout(function () {
    try {
      // Detect if table changes its data
      const observer = new MutationObserver(function () {
        hideRowsWithEmptyContent();
      });

      const table = document.querySelector(
        "app-schedule-table tbody"
      ) as HTMLElement;
      observer.observe(table, {
        childList: true,
      });

      // Hide rows with empty content (default)
      hideRowsWithEmptyContent();
    } catch (error) {
      // Handle errors if necessary
    }
  }, 100);
}
