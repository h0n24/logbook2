// TODO: needs major refactor
// schedulePage

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

function icalHeader() {
  let header = "";

  // Example: BEGIN:VCALENDAR
  header += "BEGIN:VCALENDAR\r\n";

  // Example: VERSION:2.0
  header += "VERSION:2.0\r\n";

  // Example: PRODID:-//caldav.icloud.com//CALDAVJ 2413B278//EN
  header += `PRODID:-//caldav.icloud.com//CALDAVJ 2413B278//EN\r\n`;

  // Example: X-WR-CALNAME:IT Step — Rozvrh
  header += `X-WR-CALNAME:IT Step — Rozvrh\r\n`;

  // Example: X-APPLE-CALENDAR-COLOR:#FF9500
  header += `X-APPLE-CALENDAR-COLOR:#5755d9\r\n`;

  // wasnt in Apple Demo
  // Example: CALSCALE:GREGORIAN
  // header += `CALSCALE:GREGORIAN\r\n`;

  // Example: METHOD:PUBLISH
  // header += `METHOD:PUBLISH\r\n`;

  return header;
}

function icalTimezone() {
  let timezone = "";

  // Example: X-WR-TIMEZONE:Europe/Prague
  timezone += `X-WR-TIMEZONE:Europe/Prague\r\n`;

  // Example: BEGIN:VTIMEZONE
  timezone += `BEGIN:VTIMEZONE\r\n`;

  // Example: TZID:Europe/Prague
  timezone += `TZID:Europe/Prague\r\n`;

  // Example: BEGIN:DAYLIGHT
  timezone += `BEGIN:DAYLIGHT\r\n`;

  // Example: DTSTART:20230326T030000
  timezone += `DTSTART:20230326T030000\r\n`;

  // Example: TZOFFSETFROM:+0100
  timezone += `TZOFFSETFROM:+0100\r\n`;

  // Example: TZOFFSETTO:+0200
  timezone += `TZOFFSETTO:+0200\r\n`;

  // Example: TZNAME:CEST
  timezone += `TZNAME:CEST\r\n`;

  // Example: END:DAYLIGHT
  timezone += `END:DAYLIGHT\r\n`;

  // Example: BEGIN:STANDARD
  timezone += `BEGIN:STANDARD\r\n`;

  // Example: DTSTART:20231029T020000
  timezone += `DTSTART:20231029T020000\r\n`;

  // Example: TZOFFSETFROM:+0200
  timezone += `TZOFFSETFROM:+0200\r\n`;

  // Example: TZOFFSETTO:+0100
  timezone += `TZOFFSETTO:+0100\r\n`;

  // Example: TZNAME:CET
  timezone += `TZNAME:CET\r\n`;

  // Example: END:STANDARD
  timezone += `END:STANDARD\r\n`;

  // Example: END:VTIMEZONE
  timezone += `END:VTIMEZONE\r\n`;

  return timezone;
}

function icalFooter() {
  return "END:VCALENDAR\r\n";
}

function formatIsoDateString(date, withoutZatEnd = true) {
  let formatted = "";

  // test if date is in iso format
  if (date instanceof Date) {
    formatted = date.toISOString();
  } else {
    formatted = date;
  }

  formatted = formatted.replace(/-|:|\.\d+/g, "");
  if (withoutZatEnd) {
    formatted = formatted.replace("Z", "");
  }
  return formatted;
}

function addAlarmToEvent(isAlarm) {
  let alarm = "";

  if (isAlarm) {
    // Example: BEGIN:VALARM
    alarm += `BEGIN:VALARM\r\n`;

    // Example: ACTION:DISPLAY
    alarm += `ACTION:DISPLAY\r\n`;

    // Example: DESCRIPTION:This is an event reminder
    alarm += `DESCRIPTION:Nezapomeň: představit závěrečnou práci + zadat jako domácí úkol\r\n`;

    // Example: TRIGGER:-P0DT0H15M0S
    // want to trigger 7 days and 15 minutes before the event
    alarm += `TRIGGER:-P7DT0H15M0S\r\n`;

    // Example: END:VALARM
    alarm += `END:VALARM\r\n`;
  }

  return alarm;
}

function icalEvent(
  summary,
  notes,
  startDate,
  endDate,
  isOffline = false,
  addAlarm = false
) {
  // basic structure was made based on ideas from this video: https://www.youtube.com/watch?v=bgUL35CztVY
  // it was premade on the iphone and then exported to icalendar format

  let event = "";

  // default variables
  let startISO = formatIsoDateString(startDate);
  let endISO = formatIsoDateString(endDate);
  let dtstampISO = formatIsoDateString(new Date(), false);

  let latitude = 49.216529;
  let longitude = 16.5855978;

  // generate event
  event += "BEGIN:VEVENT\r\n";

  // Example: DESCRIPTION:Skupina: JAO-TU-O-11-20
  if (notes) {
    event += `DESCRIPTION:${notes}\r\n`;
  }

  // Example: DTEND;TZID=Europe/Prague:20240414T203700
  event += `DTEND;TZID=Europe/Prague:${endISO}\r\n`;

  // Example: DTSTAMP:20240412T230040Z
  event += `DTSTAMP:${dtstampISO}\r\n`;

  // Example: DTSTART;TZID=Europe/Prague:20240414T193700
  event += `DTSTART;TZID=Europe/Prague:${startISO}\r\n`;

  if (isOffline) {
    // Example: X-CANT-HANDLE:49.216529\;16.5855978\;
    event += `X-CANT-HANDLE:${latitude}\\;${longitude}\\;\r\n`;
  }

  // Example: LAST-MODIFIED:20240412T230038Z
  event += `LAST-MODIFIED:${dtstampISO}\r\n`;

  if (isOffline) {
    // Example: LOCATION:Jana Babáka 2733/11\nBrno\, Okres Brno-město\, Česko
    event += `LOCATION:Jana Babáka 2733/11\\nBrno\\, Okres Brno-město\\, Česko\r\n`;
  }

  // Example: SEQUENCE:1 (rework: default is 0)
  event += `SEQUENCE:0\r\n`;

  // Example: SUMMARY:Online IT Step — Prezentace projektu
  event += `SUMMARY:${summary}\r\n`;

  // Example: UID:20240412T173709Z/1lqi85jpq
  let uid = dtstampISO + "/" + Math.random().toString(36).substr(2, 9);
  event += `UID:${uid}\r\n`;

  // Example: URL;VALUE=URI:
  event += `URL;VALUE=URI:\r\n`;

  if (isOffline) {
    // it wasnt in the example, probably unnecessary
    // event += `GEO:${latitude};${longitude};\r\n`;

    // Apple pregenerated structured location
    let appleStructured = `X-APPLE-STRUCTURED-LOCATION;VALUE=URI;X-ADDRESS="Brno, Okres Brno-město, \r\n Česko";X-APPLE-MAPKIT-HANDLE=CAES1QII2TIaEgm62R8ot5tIQBHT+IVXkpYwQCKoAQo\r\n GxIxlc2tvEgJDWhoSSmlob21vcmF2c2vDvSBrcmFqIgI2NCoRT2tyZXMgQnJuby1txJtzdG8\r\n yBEJybm86BjYxMiAwMEINS3LDoWxvdm8gUG9sZVIMSmFuYSBCYWLDoWthWgIxMWIUSmFuYSB\r\n CYWLDoWthIDI3MzMvMTGKASlWZXRlcmluw6FybsOtIGEgRmFybWFjZXV0aWNrw6EgVW5pdmV\r\n yeml0YSoUSmFuYSBCYWLDoWthIDI3MzMvMTEyFEphbmEgQmFiw6FrYSAyNzMzLzExMhs2MTI\r\n gMDAgQnJubyAtIEtyw6Fsb3ZvIFBvbGUyEU9rcmVzIEJybm8tbcSbc3RvMgbEjGVza284OUA\r\n EUAFaJwolEhIJutkfKLebSEAR0/iFV5KWMEAY2TIgkfH7/43W+PLtAZADAQ==;X-APPLE-RA\r\n DIUS=70.58736906493787;X-APPLE-REFERENCEFRAME=1;X-TITLE="Jana Babáka 273\r\n 3/11":geo:49.216527,16.588171`;
    // appleStructured = appleStructured.replace(/(.{74})/g, "$1\r\n ");
    event += `${appleStructured}\r\n`;
  }

  // add alarm if "summary" contains "opakování"
  let testSummary = summary.toLowerCase();
  // convert to lowercase and remove diacritics
  testSummary = testSummary.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  // check if testSummary contains "opakovani"
  let isAlarm = testSummary.includes("opakovani");
  event += addAlarmToEvent(isAlarm);

  // end event
  event += "END:VEVENT\r\n";

  return event;
}

function generateIcalDemo() {
  let calendarDateFrom = new Date();
  let calendarDateFromLocalized = calendarDateFrom.toLocaleDateString("cs-CZ", {
    month: "numeric",
    day: "numeric",
  });

  let calendarDateTo = new Date();
  calendarDateTo.setDate(calendarDateTo.getDate() + 7);
  let calendarDateToLocalized = calendarDateTo.toLocaleDateString("cs-CZ", {
    month: "numeric",
    day: "numeric",
  });

  let afterHour = new Date();
  afterHour.setHours(afterHour.getHours() + 1);
  let afterTwoHours = new Date();
  afterTwoHours.setHours(afterTwoHours.getHours() + 2);

  let icalBody = "";

  icalBody += icalEvent(
    "IT Step — Web Design: CMS",
    "Skupina: UI/UX-TH-11-23",
    afterHour,
    afterTwoHours,
    true
  );

  icalBody += icalEvent(
    "Online IT Step — Prezentace projektu",
    "Skupina: JAO-TU-O-11-20",
    new Date(),
    afterHour,
    false
  );

  let ical = icalHeader() + icalBody + icalTimezone() + icalFooter();

  // if line of text between \r\n is longer than 75 characters, it needs to be split by additional \r\n
  // ical = ical.replace(/(.{75})/g, "$1\r\n");

  const blob = new Blob([ical], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "test.ics";
  a.click();
}

function getDateFromPagePicker() {
  // get date from .page_picker .beetwen_nav
  // example format: "15. 4. 2024- 21. 4. 2024"
  let dateRange = document.querySelector(".page_picker .beetwen_nav");
  if (!dateRange) return;

  // get first date
  let dateRangeText = dateRange.textContent || "";
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
  let subjectEl = lessonItem.querySelector(".subject") as HTMLElement;
  let subject = subjectEl.textContent || "Neznámá událost";
  subject = subject.trim();

  let groupEl = lessonItem.querySelector(".group") as HTMLElement;
  let group = groupEl.textContent || "Neznámá skupina";
  group = group.trim();

  let auditoryElement = lessonItem.querySelector(".auditory") as HTMLElement;
  let auditoryText = auditoryElement.textContent || "";
  auditoryText = auditoryText.trim();
  // remove every character that is not a letter
  auditoryText = auditoryText.replace(/[^a-zA-Z]/g, "");
  // convert to lowercase
  auditoryText = auditoryText.toLowerCase();
  let isOnline = auditoryText.includes("online");

  let timeEl = lessonItem.querySelector(".lesson-time") as HTMLElement;
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
  let storedItems = localStorage.getItem("logbook-rework-ical");
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

  // remove all events that are older than today
  let today = new Date();
  let todayString = today.toISOString();
  let onlyNewerDates = mergedItemsFilteredSorted.filter(
    (item) => item.dateTo > todayString
  );

  // save to localstorage
  localStorage.setItem("logbook-rework-ical", JSON.stringify(onlyNewerDates));
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
  // skip td with .para
  // get .lesson-item

  let tableTbody = document.querySelector(".schedule_table tbody");
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
      if (cell.classList.contains("para")) return;

      let dayIndex = cell.cellIndex - 1;

      let lessonItem = cell.querySelector(".lesson-item") as HTMLElement;
      if (lessonItem) {
        generateDataFromCell(lessonItem, mondayDate, dayIndex, lessonItems);
      }
    });
  });

  // sort by dateFrom
  sortAndSaveToLocalStorage(lessonItems);
}

function generateICalFromSchedule() {
  // generateIcalDemo();
  findAllTdThatHaveLessonItem();

  let storedItems = localStorage.getItem("logbook-rework-ical");
  let storedItemsParsed = storedItems ? JSON.parse(storedItems) : [];
  let itemsCount = storedItemsParsed.length;

  // if #download-ical exists, skip
  let downloadIcal = document.querySelector("#download-ical");
  // update count of items
  let downloadIcalSpan = document.querySelector("#download-ical span");
  if (downloadIcalSpan) {
    downloadIcalSpan.textContent = `(${itemsCount} událostí)`;
  }

  if (downloadIcal) return;

  // create a href element with download attribute
  // and text "Stáhnout rozvrh jako iCal (200 událostí)"
  let a = document.createElement("a");
  a.href = "#";
  a.id = "download-ical";
  a.innerHTML = `Stáhnout jako iCal <span>(${itemsCount} událostí)</span>`;
  a.title = `Poznámka: pro načtení více událostí je třeba načíst další (budoucí) týdny. Události se ukládají do lokální paměti prohlížeče. Novější události přepisují starší. Data starší než dnešní datum se automaticky odstraňují.`;

  // add event listener to a
  a.addEventListener("click", function (e) {
    e.preventDefault();

    let storedItems = localStorage.getItem("logbook-rework-ical");
    let storedItemsParsed = storedItems ? JSON.parse(storedItems) : [];

    let icalBody = "";

    storedItemsParsed.forEach((item) => {
      let newSubject = "";

      if (item.isOnline) {
        newSubject += "Online ";
      }
      newSubject += "IT Step — " + item.subject;

      let newGroup = "Skupina: " + item.group;

      // is daylight saving time?
      let DSToffsetInHours = new Date(item.dateFrom).getTimezoneOffset() / 60;

      let oldDateFrom = item.dateFrom.replace("T", " ").replace("Z", "");
      let newDateFrom = new Date(oldDateFrom + ` GMT-0${DSToffsetInHours}:00`);

      let oldDateTo = item.dateTo.replace("T", " ").replace("Z", "");
      let newDateTo = new Date(oldDateTo + ` GMT-0${DSToffsetInHours}:00`);

      icalBody += icalEvent(
        newSubject,
        newGroup,
        newDateFrom,
        newDateTo,
        !item.isOnline
      );
    });

    let ical = icalHeader() + icalBody + icalTimezone() + icalFooter();

    const blob = new Blob([ical], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    // get date and convert it so we can use it in the file name
    const date = new Date();
    const localizedDate = date.toLocaleDateString("cs-CZ", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    // get rid of spaces and colons in the date
    const fileNameTime = localizedDate
      .replace(/ /g, "-")
      .replace(/:/g, "-")
      .replace(/\//g, "-")
      .replace(/\./g, "")
      .replace(/,/g, "-");

    a.download = `rozvrh-IT-step-${fileNameTime}.ics`;
    a.click();
  });

  // preppend to .schedule .schedule_top
  let scheduleTop = document.querySelector(".schedule .schedule_top");
  if (scheduleTop) {
    scheduleTop.prepend(a);
  }
}

// add right click to menu
export function timetableEnhancements() {
  // needs small timeout because angular firstly
  // adds and after that removes previous rows
  // so it would count previous rows as present
  setTimeout(function () {
    try {
      // alert("schedule");

      // generateICalFromSchedule(); // TODO

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
