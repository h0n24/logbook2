function isRowEmpty(row: HTMLTableRowElement): boolean {
  const cells = row.querySelectorAll("td");
  for (const cell of cells) {
    if (cell.classList.contains("mat-column-id")) continue;
    if (cell.innerText.trim() !== "") {
      return false;
    }
  }
  return true;
}

function isColumnEmpty(table: HTMLTableElement, columnIndex: number): boolean {
  const rows = table.querySelectorAll("tr");

  for (const row of rows) {
    const cells = row.querySelectorAll("td, th");
    const cell = cells[columnIndex] as HTMLElement;

    if (!cell) continue;

    // Skip first th with mat-header-cell attribute (it has heading)
    if (cell.hasAttribute("mat-header-cell")) {
      continue;
    }

    if (cell.innerText.trim() !== "") {
      return false;
    }
  }

  return true;
}

function processRows(rows: NodeListOf<HTMLTableRowElement>): void {
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const isEmpty = isRowEmpty(row);

    // Remove any existing .last-visible-row class
    row.classList.remove("last-visible-row");

    if (isEmpty) {
      // Hide all empty rows
      row.classList.add("hidden-row");
    } else {
      // Show all non-empty rows
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

function processColumns(table: HTMLTableElement): void {
  const rows = table.querySelectorAll("tr");
  if (rows.length === 0) return;

  // Get the number of columns from the first row
  const firstRowCells = rows[0].querySelectorAll("td, th");
  const columnCount = firstRowCells.length;

  for (let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
    const isEmpty = isColumnEmpty(table, columnIndex);

    // Apply hidden-column class to all cells in this column (including th with mat-header-cell)
    rows.forEach((row) => {
      const cells = row.querySelectorAll("td, th");
      const cell = cells[columnIndex] as HTMLElement;

      if (cell) {
        if (isEmpty) {
          cell.classList.add("hidden-column");
        } else {
          cell.classList.remove("hidden-column");
        }
      }
    });
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
  label.innerText = "Zobrazuji pouze řádky a sloupce s obsahem";

  // Event listener for checkbox
  checkbox.addEventListener("change", function () {
    const isChecked = (this as HTMLInputElement).checked;
    if (isChecked) {
      table.classList.add("hide-empty-rows");
      label.innerText = "Zobrazuji pouze řádky a sloupce s obsahem";
    } else {
      table.classList.remove("hide-empty-rows");
      label.innerText = "Skrýt řádky a sloupce bez obsahu";
    }
  });

  // Append elements
  newDiv.appendChild(checkbox);
  newDiv.appendChild(label);

  // Append to the table wrapper
  const tableWrapper = document.querySelector(".page-filters") as HTMLElement;
  tableWrapper.appendChild(newDiv);
}

function hideRowsWithEmptyContent() {
  const table = document.querySelector(
    "app-materials-bind table"
  ) as HTMLTableElement;
  if (!table) return;

  table.classList.add("hide-empty-rows");

  const rows = table.querySelectorAll("tr") as NodeListOf<HTMLTableRowElement>;

  processRows(rows);
  processColumns(table);

  updateLastVisibleRow(rows);

  createHideEmptyRowsCheckbox(table);
}

// Add right-click to menu
export function hideEmptyRows() {
  try {
    // Detect if table changes its data
    const observer = new MutationObserver(function () {
      hideRowsWithEmptyContent();
    });

    const table = document.querySelector(
      "app-materials-bind .page-content table tbody"
    ) as HTMLElement;
    observer.observe(table, {
      childList: true,
    });

    // Hide rows with empty content (default)
    hideRowsWithEmptyContent();
  } catch (error) {
    // Handle errors if necessary
  }
}
