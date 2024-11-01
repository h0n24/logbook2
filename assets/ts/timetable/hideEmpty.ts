function hideRowsWithEmptyContent() {
  const table = document.querySelector(
    "app-schedule-table table"
  ) as HTMLTableElement;
  if (!table) return;

  table.classList.add("hide-empty-rows");

  const rows = table.querySelectorAll("tr");
  let allRowsEmpty = true; // Initialize the variable

  // Find the index of the first non-empty row
  let firstContentRowIndex = -1;
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const cells = row.querySelectorAll("td");
    let isEmpty = true;

    cells.forEach((cell) => {
      if (cell.classList.contains("mat-column-time")) return;
      if (cell.innerText.trim() !== "") {
        isEmpty = false;
      }
    });

    if (!isEmpty) {
      firstContentRowIndex = i;
      allRowsEmpty = false; // Set to false when a non-empty row is found
      break;
    }
  }

  // Find the index of the last non-empty row
  let lastContentRowIndex = -1;
  if (!allRowsEmpty) {
    for (let i = rows.length - 1; i >= 0; i--) {
      const row = rows[i];
      const cells = row.querySelectorAll("td");
      let isEmpty = true;

      cells.forEach((cell) => {
        if (cell.classList.contains("mat-column-time")) return;
        if (cell.innerText.trim() !== "") {
          isEmpty = false;
        }
      });

      if (!isEmpty) {
        lastContentRowIndex = i;
        break;
      }
    }
  }

  // If all rows are empty, do not hide any rows
  if (allRowsEmpty) {
    rows.forEach((row) => {
      row.classList.remove("hidden-row", "last-visible-row");
    });
    // You can use allRowsEmpty here as needed
    return;
  }

  // Process the rows to hide or show
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const cells = row.querySelectorAll("td");
    let isEmpty = true;

    cells.forEach((cell) => {
      if (cell.classList.contains("mat-column-time")) return;
      if (cell.innerText.trim() !== "") {
        isEmpty = false;
      }
    });

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

  // After processing, find the last visible row and add .last-visible-row class
  let lastVisibleRow: HTMLTableRowElement | null = null;
  for (let i = rows.length - 1; i >= 0; i--) {
    const row = rows[i] as HTMLTableRowElement;
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

  // create row with td with checkbox element
  const newDiv = document.createElement("div");
  newDiv.classList.add("hide-empty-rows-wrapper");

  // create checkbox element
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = "hideEmptyRows";
  checkbox.checked = true;
  checkbox.addEventListener("change", function () {
    const isChecked = (this as HTMLInputElement).checked;
    const rows = table.querySelectorAll("tr");
    rows.forEach((row) => {
      if (isChecked) {
        table.classList.add("hide-empty-rows");
      } else {
        table.classList.remove("hide-empty-rows");
      }
    });

    // change inner text of label
    label.innerText = isChecked
      ? "Zobrazuji pouze řádky s obsahem"
      : "Skrýt řádky bez obsahu";
  });

  // create label element
  const label = document.createElement("label");
  label.htmlFor = "hideEmptyRows";
  label.innerText = "Zobrazuji pouze řádky s obsahem";

  // check if exists
  const existingCheckbox = document.querySelector("#hideEmptyRows");

  // do not add if already exists
  if (existingCheckbox) return;

  // append elements
  newDiv.appendChild(checkbox);
  newDiv.appendChild(label);
  const tableWrapper = document.querySelector(".schedule__name") as HTMLElement;
  // remove contents of tableWrapper
  tableWrapper.innerHTML = "";
  tableWrapper.appendChild(newDiv);
}

// add right click to menu
export function hideEmptyRows() {
  // needs small timeout because angular firstly
  // adds and after that removes previous rows
  // so it would count previous rows as present
  setTimeout(function () {
    try {
      // detect if table changes its data
      const observer = new MutationObserver(function (mutations) {
        hideRowsWithEmptyContent();
      });

      const table = document.querySelector(
        "app-schedule-table tbody"
      ) as HTMLElement;
      observer.observe(table, {
        childList: true,
      });

      // hide rows with empty content (default)
      hideRowsWithEmptyContent();
    } catch (error) {}
  }, 100);
}
