"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hideEmptyRows = hideEmptyRows;
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
// TODO: needs major refactor
// schedulePage

function hideRowsWithEmptyContent() {
  var table = document.querySelector("app-schedule-table table");
  if (!table) return;
  table.classList.add("hide-empty-rows");
  var rows = table.querySelectorAll("tr");
  var allRowsEmpty = true; // Initialize the variable

  // Find the index of the first non-empty row
  var firstContentRowIndex = -1;
  var _loop = function _loop() {
    var row = rows[i];
    var cells = row.querySelectorAll("td");
    var isEmpty = true;
    cells.forEach(function (cell) {
      if (cell.classList.contains("mat-column-time")) return;
      if (cell.innerText.trim() !== "") {
        isEmpty = false;
      }
    });
    if (!isEmpty) {
      firstContentRowIndex = i;
      allRowsEmpty = false; // Set to false when a non-empty row is found
      return 1; // break
    }
  };
  for (var i = 0; i < rows.length; i++) {
    if (_loop()) break;
  }

  // Find the index of the last non-empty row
  var lastContentRowIndex = -1;
  if (!allRowsEmpty) {
    var _loop2 = function _loop2() {
      var row = rows[_i];
      var cells = row.querySelectorAll("td");
      var isEmpty = true;
      cells.forEach(function (cell) {
        if (cell.classList.contains("mat-column-time")) return;
        if (cell.innerText.trim() !== "") {
          isEmpty = false;
        }
      });
      if (!isEmpty) {
        lastContentRowIndex = _i;
        return 1; // break
      }
    };
    for (var _i = rows.length - 1; _i >= 0; _i--) {
      if (_loop2()) break;
    }
  }

  // If all rows are empty, do not hide any rows
  if (allRowsEmpty) {
    rows.forEach(function (row) {
      row.classList.remove("hidden-row", "last-visible-row");
    });
    // You can use allRowsEmpty here as needed
    return;
  }

  // Process the rows to hide or show
  var _loop3 = function _loop3() {
    var row = rows[_i2];
    var cells = row.querySelectorAll("td");
    var isEmpty = true;
    cells.forEach(function (cell) {
      if (cell.classList.contains("mat-column-time")) return;
      if (cell.innerText.trim() !== "") {
        isEmpty = false;
      }
    });

    // Remove any existing .last-visible-row class
    row.classList.remove("last-visible-row");
    if (_i2 < firstContentRowIndex) {
      // Rows before the first content row
      if (_i2 === firstContentRowIndex - 1 && isEmpty) {
        // Keep the last empty row before content visible
        row.classList.remove("hidden-row");
      } else if (isEmpty) {
        // Hide other empty rows before content
        row.classList.add("hidden-row");
      } else {
        row.classList.remove("hidden-row");
      }
    } else if (_i2 > lastContentRowIndex) {
      // Rows after the last content row
      if (_i2 === lastContentRowIndex + 1 && isEmpty) {
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
  };
  for (var _i2 = 0; _i2 < rows.length; _i2++) {
    _loop3();
  }

  // After processing, find the last visible row and add .last-visible-row class
  var lastVisibleRow = null;
  for (var _i3 = rows.length - 1; _i3 >= 0; _i3--) {
    var row = rows[_i3];
    if (!row.classList.contains("hidden-row")) {
      lastVisibleRow = row;
      break;
    }
  }

  // Remove .last-visible-row from all rows
  rows.forEach(function (row) {
    return row.classList.remove("last-visible-row");
  });

  // Add .last-visible-row to the last visible row, if any
  if (lastVisibleRow) {
    lastVisibleRow.classList.add("last-visible-row");
  }

  // create row with td with checkbox element
  var newDiv = document.createElement("div");
  newDiv.classList.add("hide-empty-rows-wrapper");

  // create checkbox element
  var checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = "hideEmptyRows";
  checkbox.checked = true;
  checkbox.addEventListener("change", function () {
    var isChecked = this.checked;
    var rows = table.querySelectorAll("tr");
    rows.forEach(function (row) {
      if (isChecked) {
        table.classList.add("hide-empty-rows");
      } else {
        table.classList.remove("hide-empty-rows");
      }
    });

    // change inner text of label
    label.innerText = isChecked ? "Zobrazuji pouze řádky s obsahem" : "Skrýt řádky bez obsahu";
  });

  // create label element
  var label = document.createElement("label");
  label.htmlFor = "hideEmptyRows";
  label.innerText = "Zobrazuji pouze řádky s obsahem";

  // check if exists
  var existingCheckbox = document.querySelector("#hideEmptyRows");

  // do not add if already exists
  if (existingCheckbox) return;

  // append elements
  newDiv.appendChild(checkbox);
  newDiv.appendChild(label);
  var tableWrapper = document.querySelector(".schedule__name");
  // remove contents of tableWrapper
  tableWrapper.innerHTML = "";
  tableWrapper.appendChild(newDiv);
}
function icalHeader() {
  var header = "";

  // Example: BEGIN:VCALENDAR
  header += "BEGIN:VCALENDAR\r\n";

  // Example: VERSION:2.0
  header += "VERSION:2.0\r\n";

  // Example: PRODID:-//caldav.icloud.com//CALDAVJ 2413B278//EN
  header += "PRODID:-//caldav.icloud.com//CALDAVJ 2413B278//EN\r\n";

  // Example: X-WR-CALNAME:IT Step — Rozvrh
  header += "X-WR-CALNAME:IT Step \u2014 Rozvrh\r\n";

  // Example: X-APPLE-CALENDAR-COLOR:#FF9500
  header += "X-APPLE-CALENDAR-COLOR:#5755d9\r\n";

  // wasnt in Apple Demo
  // Example: CALSCALE:GREGORIAN
  // header += `CALSCALE:GREGORIAN\r\n`;

  // Example: METHOD:PUBLISH
  // header += `METHOD:PUBLISH\r\n`;

  return header;
}
function icalTimezone() {
  var timezone = "";

  // Example: X-WR-TIMEZONE:Europe/Prague
  timezone += "X-WR-TIMEZONE:Europe/Prague\r\n";

  // Example: BEGIN:VTIMEZONE
  timezone += "BEGIN:VTIMEZONE\r\n";

  // Example: TZID:Europe/Prague
  timezone += "TZID:Europe/Prague\r\n";

  // Example: BEGIN:DAYLIGHT
  timezone += "BEGIN:DAYLIGHT\r\n";

  // Example: DTSTART:20230326T030000
  timezone += "DTSTART:20230326T030000\r\n";

  // Example: TZOFFSETFROM:+0100
  timezone += "TZOFFSETFROM:+0100\r\n";

  // Example: TZOFFSETTO:+0200
  timezone += "TZOFFSETTO:+0200\r\n";

  // Example: TZNAME:CEST
  timezone += "TZNAME:CEST\r\n";

  // Example: END:DAYLIGHT
  timezone += "END:DAYLIGHT\r\n";

  // Example: BEGIN:STANDARD
  timezone += "BEGIN:STANDARD\r\n";

  // Example: DTSTART:20231029T020000
  timezone += "DTSTART:20231029T020000\r\n";

  // Example: TZOFFSETFROM:+0200
  timezone += "TZOFFSETFROM:+0200\r\n";

  // Example: TZOFFSETTO:+0100
  timezone += "TZOFFSETTO:+0100\r\n";

  // Example: TZNAME:CET
  timezone += "TZNAME:CET\r\n";

  // Example: END:STANDARD
  timezone += "END:STANDARD\r\n";

  // Example: END:VTIMEZONE
  timezone += "END:VTIMEZONE\r\n";
  return timezone;
}
function icalFooter() {
  return "END:VCALENDAR\r\n";
}
function formatIsoDateString(date) {
  var withoutZatEnd = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var formatted = "";

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
  var alarm = "";
  if (isAlarm) {
    // Example: BEGIN:VALARM
    alarm += "BEGIN:VALARM\r\n";

    // Example: ACTION:DISPLAY
    alarm += "ACTION:DISPLAY\r\n";

    // Example: DESCRIPTION:This is an event reminder
    alarm += "DESCRIPTION:Nezapome\u0148: p\u0159edstavit z\xE1v\u011Bre\u010Dnou pr\xE1ci + zadat jako dom\xE1c\xED \xFAkol\r\n";

    // Example: TRIGGER:-P0DT0H15M0S
    // want to trigger 7 days and 15 minutes before the event
    alarm += "TRIGGER:-P7DT0H15M0S\r\n";

    // Example: END:VALARM
    alarm += "END:VALARM\r\n";
  }
  return alarm;
}
function icalEvent(summary, notes, startDate, endDate) {
  var isOffline = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  var addAlarm = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
  // basic structure was made based on ideas from this video: https://www.youtube.com/watch?v=bgUL35CztVY
  // it was premade on the iphone and then exported to icalendar format

  var event = "";

  // default variables
  var startISO = formatIsoDateString(startDate);
  var endISO = formatIsoDateString(endDate);
  var dtstampISO = formatIsoDateString(new Date(), false);
  var latitude = 49.216529;
  var longitude = 16.5855978;

  // generate event
  event += "BEGIN:VEVENT\r\n";

  // Example: DESCRIPTION:Skupina: JAO-TU-O-11-20
  if (notes) {
    event += "DESCRIPTION:".concat(notes, "\r\n");
  }

  // Example: DTEND;TZID=Europe/Prague:20240414T203700
  event += "DTEND;TZID=Europe/Prague:".concat(endISO, "\r\n");

  // Example: DTSTAMP:20240412T230040Z
  event += "DTSTAMP:".concat(dtstampISO, "\r\n");

  // Example: DTSTART;TZID=Europe/Prague:20240414T193700
  event += "DTSTART;TZID=Europe/Prague:".concat(startISO, "\r\n");
  if (isOffline) {
    // Example: X-CANT-HANDLE:49.216529\;16.5855978\;
    event += "X-CANT-HANDLE:".concat(latitude, "\\;").concat(longitude, "\\;\r\n");
  }

  // Example: LAST-MODIFIED:20240412T230038Z
  event += "LAST-MODIFIED:".concat(dtstampISO, "\r\n");
  if (isOffline) {
    // Example: LOCATION:Jana Babáka 2733/11\nBrno\, Okres Brno-město\, Česko
    event += "LOCATION:Jana Bab\xE1ka 2733/11\\nBrno\\, Okres Brno-m\u011Bsto\\, \u010Cesko\r\n";
  }

  // Example: SEQUENCE:1 (rework: default is 0)
  event += "SEQUENCE:0\r\n";

  // Example: SUMMARY:Online IT Step — Prezentace projektu
  event += "SUMMARY:".concat(summary, "\r\n");

  // Example: UID:20240412T173709Z/1lqi85jpq
  var uid = dtstampISO + "/" + Math.random().toString(36).substr(2, 9);
  event += "UID:".concat(uid, "\r\n");

  // Example: URL;VALUE=URI:
  event += "URL;VALUE=URI:\r\n";
  if (isOffline) {
    // it wasnt in the example, probably unnecessary
    // event += `GEO:${latitude};${longitude};\r\n`;

    // Apple pregenerated structured location
    var appleStructured = "X-APPLE-STRUCTURED-LOCATION;VALUE=URI;X-ADDRESS=\"Brno, Okres Brno-m\u011Bsto, \r\n \u010Cesko\";X-APPLE-MAPKIT-HANDLE=CAES1QII2TIaEgm62R8ot5tIQBHT+IVXkpYwQCKoAQo\r\n GxIxlc2tvEgJDWhoSSmlob21vcmF2c2vDvSBrcmFqIgI2NCoRT2tyZXMgQnJuby1txJtzdG8\r\n yBEJybm86BjYxMiAwMEINS3LDoWxvdm8gUG9sZVIMSmFuYSBCYWLDoWthWgIxMWIUSmFuYSB\r\n CYWLDoWthIDI3MzMvMTGKASlWZXRlcmluw6FybsOtIGEgRmFybWFjZXV0aWNrw6EgVW5pdmV\r\n yeml0YSoUSmFuYSBCYWLDoWthIDI3MzMvMTEyFEphbmEgQmFiw6FrYSAyNzMzLzExMhs2MTI\r\n gMDAgQnJubyAtIEtyw6Fsb3ZvIFBvbGUyEU9rcmVzIEJybm8tbcSbc3RvMgbEjGVza284OUA\r\n EUAFaJwolEhIJutkfKLebSEAR0/iFV5KWMEAY2TIgkfH7/43W+PLtAZADAQ==;X-APPLE-RA\r\n DIUS=70.58736906493787;X-APPLE-REFERENCEFRAME=1;X-TITLE=\"Jana Bab\xE1ka 273\r\n 3/11\":geo:49.216527,16.588171";
    // appleStructured = appleStructured.replace(/(.{74})/g, "$1\r\n ");
    event += "".concat(appleStructured, "\r\n");
  }

  // add alarm if "summary" contains "opakování"
  var testSummary = summary.toLowerCase();
  // convert to lowercase and remove diacritics
  testSummary = testSummary.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  // check if testSummary contains "opakovani"
  var isAlarm = testSummary.includes("opakovani");
  event += addAlarmToEvent(isAlarm);

  // end event
  event += "END:VEVENT\r\n";
  return event;
}
function generateIcalDemo() {
  var calendarDateFrom = new Date();
  var calendarDateFromLocalized = calendarDateFrom.toLocaleDateString("cs-CZ", {
    month: "numeric",
    day: "numeric"
  });
  var calendarDateTo = new Date();
  calendarDateTo.setDate(calendarDateTo.getDate() + 7);
  var calendarDateToLocalized = calendarDateTo.toLocaleDateString("cs-CZ", {
    month: "numeric",
    day: "numeric"
  });
  var afterHour = new Date();
  afterHour.setHours(afterHour.getHours() + 1);
  var afterTwoHours = new Date();
  afterTwoHours.setHours(afterTwoHours.getHours() + 2);
  var icalBody = "";
  icalBody += icalEvent("IT Step — Web Design: CMS", "Skupina: UI/UX-TH-11-23", afterHour, afterTwoHours, true);
  icalBody += icalEvent("Online IT Step — Prezentace projektu", "Skupina: JAO-TU-O-11-20", new Date(), afterHour, false);
  var ical = icalHeader() + icalBody + icalTimezone() + icalFooter();

  // if line of text between \r\n is longer than 75 characters, it needs to be split by additional \r\n
  // ical = ical.replace(/(.{75})/g, "$1\r\n");

  var blob = new Blob([ical], {
    type: "text/calendar"
  });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = "test.ics";
  a.click();
}
function getDateFromPagePicker() {
  // get date from .page_picker .beetwen_nav
  // example format: "15. 4. 2024- 21. 4. 2024"
  var dateRange = document.querySelector(".page_picker .beetwen_nav");
  if (!dateRange) return;

  // get first date
  var dateRangeText = dateRange.textContent || "";
  var dateRangeSplit = dateRangeText.split("-");
  var dateFrom = dateRangeSplit[0].trim();

  // remodel date to be in format: "2024-04-15"
  // currently in format: "15. 4. 2024"

  dateFrom = dateFrom.replace(/\s/g, ""); // remove spaces
  var dateSplitted = dateFrom.split("."); // split by dots

  var day = dateSplitted[0];
  var month = dateSplitted[1];
  var year = dateSplitted[2];

  // add leading zeros
  day = day.padStart(2, "0");
  month = month.padStart(2, "0");
  var newDateFrom = "".concat(year, "-").concat(month, "-").concat(day);
  return newDateFrom;
}
function generateDataFromCell(lessonItem, mondayDate, dayIndex, lessonItems) {
  var subjectEl = lessonItem.querySelector(".subject");
  var subject = subjectEl.textContent || "Neznámá událost";
  subject = subject.trim();
  var groupEl = lessonItem.querySelector(".group");
  var group = groupEl.textContent || "Neznámá skupina";
  group = group.trim();
  var auditoryElement = lessonItem.querySelector(".auditory");
  var auditoryText = auditoryElement.textContent || "";
  auditoryText = auditoryText.trim();
  // remove every character that is not a letter
  auditoryText = auditoryText.replace(/[^a-zA-Z]/g, "");
  // convert to lowercase
  auditoryText = auditoryText.toLowerCase();
  var isOnline = auditoryText.includes("online");
  var timeEl = lessonItem.querySelector(".lesson-time");
  var time = timeEl.textContent || "00:00-00:00";
  // remove everything that is not number or - or :
  time = time.replace(/[^0-9:-]/g, "");
  var timeSplit = time.split("-");
  var timeFrom = timeSplit[0];
  var timeTo = timeSplit[1];

  // remodel so it will be in format: "2024-04-15T08:00:00"
  var dateFrom = new Date("".concat(mondayDate, "T").concat(timeFrom, ":00"));
  var dateTo = new Date("".concat(mondayDate, "T").concat(timeTo, ":00"));

  // add day based on dayNumber
  dateFrom.setDate(dateFrom.getDate() + dayIndex);
  dateTo.setDate(dateTo.getDate() + dayIndex);

  // add to array
  lessonItems.push({
    dateFrom: dateFrom,
    dateTo: dateTo,
    dateCreated: new Date(),
    subject: subject,
    group: group,
    isOnline: isOnline
  });
}
function sortAndSaveToLocalStorage(lessonItems) {
  var lessonItemsBase = lessonItems;
  var lessonItemsSorted = lessonItemsBase.sort(function (a, b) {
    return a.dateFrom - b.dateFrom;
  });

  // stringify lessonItemsSorted
  var lessonItemsSortedStringified = JSON.stringify(lessonItemsSorted);
  // parse lessonItemsSorted
  var lessonItemsSortedParsed = JSON.parse(lessonItemsSortedStringified);

  // load data from localstorage
  var storedItems = localStorage.getItem("logbook-rework-ical");
  var storedItemsParsed = storedItems ? JSON.parse(storedItems) : [];

  // merge arrays
  var mergedItems = [].concat(_toConsumableArray(storedItemsParsed), _toConsumableArray(lessonItemsSortedParsed));

  // sort by "dateFrom" key that is a string in format "2024-04-13T01:41:55.706Z"
  mergedItems = sortArrayByDateFrom(mergedItems);

  // find if it has two items with the same "dateFrom", if yes, console.log it
  // create mergedItemsFiltered array
  var mergedItemsFiltered = mergedItems.filter(function (item, index, array) {
    var sameItems = array.filter(function (x) {
      return x.dateFrom === item.dateFrom;
    });
    if (sameItems.length > 1) {
      // console.log("sameItems", { dateFrom: item.dateFrom, sameItems });

      // find the one that has newer dateCreated
      var newestItem = sameItems.reduce(function (prev, current) {
        return prev.dateCreated > current.dateCreated ? prev : current;
      });
      return item === newestItem;
    } else {
      return true;
    }
  });
  var mergedItemsFilteredSorted = sortArrayByDateFrom(mergedItemsFiltered);

  // remove all events that are older than today
  var today = new Date();
  var todayString = today.toISOString();
  var onlyNewerDates = mergedItemsFilteredSorted.filter(function (item) {
    return item.dateTo > todayString;
  });

  // save to localstorage
  localStorage.setItem("logbook-rework-ical", JSON.stringify(onlyNewerDates));
}
function sortArrayByDateFrom(mergedItems) {
  mergedItems.sort(function (a, b) {
    var dateA = new Date(a.dateFrom);
    var dateB = new Date(b.dateFrom);
    return dateA - dateB;
  });
  return mergedItems;
}
function findAllTdThatHaveLessonItem() {
  // from .schedule_table tbody get all td
  // skip td with .para
  // get .lesson-item

  var tableTbody = document.querySelector(".schedule_table tbody");
  if (!tableTbody) return;

  // get all rows
  var rows = tableTbody.querySelectorAll("tr");
  if (!rows) return;
  var lessonItems = [];
  var mondayDate = getDateFromPagePicker();

  // detect if dateFrom is valid date, if not, return
  if (mondayDate === undefined) return;
  var testDate = new Date(mondayDate);
  if (isNaN(testDate.getTime())) return;

  // iterate over rows
  rows.forEach(function (row) {
    var cells = row.querySelectorAll("td");
    if (!cells) return;
    cells.forEach(function (cell) {
      if (cell.classList.contains("para")) return;
      var dayIndex = cell.cellIndex - 1;
      var lessonItem = cell.querySelector(".lesson-item");
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
  var storedItems = localStorage.getItem("logbook-rework-ical");
  var storedItemsParsed = storedItems ? JSON.parse(storedItems) : [];
  var itemsCount = storedItemsParsed.length;

  // if #download-ical exists, skip
  var downloadIcal = document.querySelector("#download-ical");
  // update count of items
  var downloadIcalSpan = document.querySelector("#download-ical span");
  if (downloadIcalSpan) {
    downloadIcalSpan.textContent = "(".concat(itemsCount, " ud\xE1lost\xED)");
  }
  if (downloadIcal) return;

  // create a href element with download attribute
  // and text "Stáhnout rozvrh jako iCal (200 událostí)"
  var a = document.createElement("a");
  a.href = "#";
  a.id = "download-ical";
  a.innerHTML = "St\xE1hnout jako iCal <span>(".concat(itemsCount, " ud\xE1lost\xED)</span>");
  a.title = "Pozn\xE1mka: pro na\u010Dten\xED v\xEDce ud\xE1lost\xED je t\u0159eba na\u010D\xEDst dal\u0161\xED (budouc\xED) t\xFDdny. Ud\xE1losti se ukl\xE1daj\xED do lok\xE1ln\xED pam\u011Bti prohl\xED\u017Ee\u010De. Nov\u011Bj\u0161\xED ud\xE1losti p\u0159episuj\xED star\u0161\xED. Data star\u0161\xED ne\u017E dne\u0161n\xED datum se automaticky odstra\u0148uj\xED.";

  // add event listener to a
  a.addEventListener("click", function (e) {
    e.preventDefault();
    var storedItems = localStorage.getItem("logbook-rework-ical");
    var storedItemsParsed = storedItems ? JSON.parse(storedItems) : [];
    var icalBody = "";
    storedItemsParsed.forEach(function (item) {
      var newSubject = "";
      if (item.isOnline) {
        newSubject += "Online ";
      }
      newSubject += "IT Step — " + item.subject;
      var newGroup = "Skupina: " + item.group;

      // is daylight saving time?
      var DSToffsetInHours = new Date(item.dateFrom).getTimezoneOffset() / 60;
      var oldDateFrom = item.dateFrom.replace("T", " ").replace("Z", "");
      var newDateFrom = new Date(oldDateFrom + " GMT-0".concat(DSToffsetInHours, ":00"));
      var oldDateTo = item.dateTo.replace("T", " ").replace("Z", "");
      var newDateTo = new Date(oldDateTo + " GMT-0".concat(DSToffsetInHours, ":00"));
      icalBody += icalEvent(newSubject, newGroup, newDateFrom, newDateTo, !item.isOnline);
    });
    var ical = icalHeader() + icalBody + icalTimezone() + icalFooter();
    var blob = new Blob([ical], {
      type: "text/calendar"
    });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;

    // get date and convert it so we can use it in the file name
    var date = new Date();
    var localizedDate = date.toLocaleDateString("cs-CZ", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });

    // get rid of spaces and colons in the date
    var fileNameTime = localizedDate.replace(/ /g, "-").replace(/:/g, "-").replace(/\//g, "-").replace(/\./g, "").replace(/,/g, "-");
    a.download = "rozvrh-IT-step-".concat(fileNameTime, ".ics");
    a.click();
  });

  // preppend to .schedule .schedule_top
  var scheduleTop = document.querySelector(".schedule .schedule_top");
  if (scheduleTop) {
    scheduleTop.prepend(a);
  }
}

// add right click to menu
function hideEmptyRows() {
  // needs small timeout because angular firstly
  // adds and after that removes previous rows
  // so it would count previous rows as present
  setTimeout(function () {
    try {
      // alert("schedule");

      // generateICalFromSchedule(); // TODO

      // detect if table changes its data
      var observer = new MutationObserver(function (mutations) {
        hideRowsWithEmptyContent();
      });
      var table = document.querySelector("app-schedule-table tbody");
      observer.observe(table, {
        childList: true
      });

      // hide rows with empty content (default)
      hideRowsWithEmptyContent();
    } catch (error) {}
  }, 100);
}