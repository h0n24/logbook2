function getDateFromPagePicker() {
  // get date from app-timetable-filters mat-form-field .mat-mdc-form-field-infix
  // example format: "15. 4. 2024- 21. 4. 2024"
  let dateRange = document.querySelector(
    "app-timetable-filters mat-form-field .mat-mdc-form-field-infix input"
  ) as HTMLInputElement;
  if (!dateRange) return;

  // get first date
  let dateRangeText = dateRange.value || "";
  let dateRangeSplit = dateRangeText.split("-");
  let dateFrom = dateRangeSplit[0].trim();

  // remodel date to be in format: "2024-04-15"
  // currently in format: "15. 4. 2024"

  dateFrom = dateFrom.replace(/\s/g, ""); // remove spaces
  let dateSplitted = dateFrom.split("."); // split by dots

  let day = dateSplitted[0];
  let month = dateSplitted[1];
  let year = dateSplitted[2];

  // add leading zeros
  day = day.padStart(2, "0");
  month = month.padStart(2, "0");

  let newDateFrom = `${year}-${month}-${day}`;

  return newDateFrom;
}

function generateDataFromCell(
  lessonItem: HTMLElement,
  mondayDate: string,
  dayIndex: number,
  lessonItems: any[]
) {
  // subject
  let subjectEl = lessonItem.querySelector(
    ".schedule__lesson > div:nth-child(1) > div:nth-child(2)"
  ) as HTMLElement;
  let subject = subjectEl.textContent || "Neznámá událost";
  subject = subject.trim();

  // group
  let groupEl = lessonItem.querySelector(
    ".schedule__lesson > div:nth-child(2) > div:nth-child(1)"
  ) as HTMLElement;
  let group = groupEl.textContent || "Neznámá skupina";
  group = group.trim();
  // remove "group" word from the beginning
  group = group.replace("group", "");

  // is online?
  // group has codes like "UIUX-TH-09-24" or UIUXO-TU-09-24
  // if the first part of code divided by "-" has "O" then it is online
  let isOnline = group.split("-")[0].includes("O");

  // time
  let timeEl = lessonItem.querySelector(
    ".schedule__lesson > div:nth-child(1) > div:nth-child(1)"
  ) as HTMLElement;
  let time = timeEl.textContent || "00:00-00:00";
  // remove everything that is not number or - or :
  time = time.replace(/[^0-9:-]/g, "");

  let timeSplit = time.split("-");
  let timeFrom = timeSplit[0];
  let timeTo = timeSplit[1];

  // remodel so it will be in format: "2024-04-15T08:00:00"
  let dateFrom = new Date(`${mondayDate}T${timeFrom}:00`);
  let dateTo = new Date(`${mondayDate}T${timeTo}:00`);

  // add day based on dayNumber
  dateFrom.setDate(dateFrom.getDate() + dayIndex);
  dateTo.setDate(dateTo.getDate() + dayIndex);

  // add to array
  lessonItems.push({
    dateFrom,
    dateTo,
    dateCreated: new Date(),
    subject,
    group,
    isOnline,
  });
}

function sortAndSaveToLocalStorage(lessonItems: any[]) {
  let lessonItemsBase = lessonItems;
  let lessonItemsSorted = lessonItemsBase.sort(
    (a, b) => a.dateFrom - b.dateFrom
  );

  // stringify lessonItemsSorted
  let lessonItemsSortedStringified = JSON.stringify(lessonItemsSorted);
  // parse lessonItemsSorted
  let lessonItemsSortedParsed = JSON.parse(lessonItemsSortedStringified);

  // load data from localstorage
  let storedItems = localStorage.getItem("logbook-rework-calendar");
  let storedItemsParsed = storedItems ? JSON.parse(storedItems) : [];

  // merge arrays
  let mergedItems = [...storedItemsParsed, ...lessonItemsSortedParsed];

  // sort by "dateFrom" key that is a string in format "2024-04-13T01:41:55.706Z"
  mergedItems = sortArrayByDateFrom(mergedItems);

  // find if it has two items with the same "dateFrom", if yes, console.log it
  // create mergedItemsFiltered array
  let mergedItemsFiltered = mergedItems.filter((item, index, array) => {
    let sameItems = array.filter((x) => x.dateFrom === item.dateFrom);
    if (sameItems.length > 1) {
      // console.log("sameItems", { dateFrom: item.dateFrom, sameItems });

      // find the one that has newer dateCreated
      let newestItem = sameItems.reduce((prev, current) =>
        prev.dateCreated > current.dateCreated ? prev : current
      );

      return item === newestItem;
    } else {
      return true;
    }
  });

  let mergedItemsFilteredSorted = sortArrayByDateFrom(mergedItemsFiltered);

  // save to localstorage
  localStorage.setItem(
    "logbook-rework-calendar",
    JSON.stringify(mergedItemsFilteredSorted)
  );
}

function sortArrayByDateFrom(mergedItems: any[]) {
  mergedItems.sort((a, b) => {
    let dateA = new Date(a.dateFrom) as any;
    let dateB = new Date(b.dateFrom) as any;
    return dateA - dateB;
  });

  return mergedItems;
}

function findAllTdThatHaveLessonItem() {
  // from .schedule_table tbody get all td
  // skip td with .mat-column-time
  // get .lesson-item

  let tableTbody = document.querySelector("app-schedule-table tbody");
  if (!tableTbody) return;

  // get all rows
  let rows = tableTbody.querySelectorAll("tr");
  if (!rows) return;

  let lessonItems = [] as any[];
  let mondayDate = getDateFromPagePicker() as string;

  // detect if dateFrom is valid date, if not, return
  if (mondayDate === undefined) return;
  let testDate = new Date(mondayDate);
  if (isNaN(testDate.getTime())) return;

  // iterate over rows
  rows.forEach((row) => {
    let cells = row.querySelectorAll("td");
    if (!cells) return;

    cells.forEach((cell) => {
      if (cell.classList.contains("mat-column-time")) return;

      let dayIndex = cell.cellIndex - 1;

      let lessonItem = cell.querySelector("app-schedule-lesson") as HTMLElement;
      if (lessonItem) {
        generateDataFromCell(lessonItem, mondayDate, dayIndex, lessonItems);
      }
    });
  });

  // sort by dateFrom
  sortAndSaveToLocalStorage(lessonItems);
}

// add right click to menu
export function getTableData() {
  try {
    findAllTdThatHaveLessonItem();
  } catch (error) {}
}
