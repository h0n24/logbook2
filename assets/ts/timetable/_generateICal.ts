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

function getStoredItems() {
  const storedItems = localStorage.getItem("logbook-rework-calendar");
  return storedItems ? JSON.parse(storedItems) : [];
}

function filterFutureEvents(items) {
  const todayString = new Date().toISOString();
  return items.filter((item) => item.dateTo > todayString);
}

function updateDownloadButtonText(itemsCount) {
  const downloadIcalSpan = document.querySelector("#download-ical span");
  if (downloadIcalSpan) {
    downloadIcalSpan.textContent = `(${itemsCount} událostí)`;
  }
}

function createDownloadLink(itemsCount) {
  const a = document.createElement("a");
  a.href = "#";
  a.id = "download-ical";
  a.innerHTML = `Stáhnout jako iCal <span>(${itemsCount} událostí)</span>`;
  a.title = `Poznámka: pro načtení více událostí je třeba načíst další (budoucí) týdny. Události se ukládají do lokální paměti prohlížeče. Novější události přepisují starší. Data starší než dnešní datum se automaticky odstraňují.`;

  a.addEventListener("click", handleDownloadClick);

  return a;
}

function handleDownloadClick(event) {
  event.preventDefault();

  const storedItemsParsed = getStoredItems();
  const onlyNewerDates = filterFutureEvents(storedItemsParsed);
  const icalBody = generateICalBody(onlyNewerDates);
  const ical = icalHeader() + icalBody + icalTimezone() + icalFooter();

  downloadICalFile(ical);
}

function generateICalBody(events) {
  let icalBody = "";

  events.forEach((item) => {
    const newSubject = `${item.isOnline ? "Online " : ""}IT Step — ${
      item.subject
    }`;
    const newGroup = `Skupina: ${item.group}`;
    const DSToffsetInHours = new Date(item.dateFrom).getTimezoneOffset() / 60;

    const newDateFrom = parseDate(item.dateFrom, DSToffsetInHours);
    const newDateTo = parseDate(item.dateTo, DSToffsetInHours);

    icalBody += icalEvent(
      newSubject,
      newGroup,
      newDateFrom,
      newDateTo,
      !item.isOnline
    );
  });

  return icalBody;
}

function parseDate(dateString, DSToffsetInHours) {
  const oldDate = dateString.replace("T", " ").replace("Z", "");
  const offsetSign = DSToffsetInHours >= 0 ? "-" : "+";
  const offsetHours = Math.abs(DSToffsetInHours).toString().padStart(2, "0");
  return new Date(`${oldDate} GMT${offsetSign}${offsetHours}:00`);
}

function downloadICalFile(icalData) {
  const blob = new Blob([icalData], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = generateFileName();
  a.click();
}

function generateFileName() {
  const date = new Date();
  const localizedDate = date.toLocaleDateString("cs-CZ", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const fileNameTime = localizedDate
    .replace(/ /g, "-")
    .replace(/:/g, "-")
    .replace(/\//g, "-")
    .replace(/\./g, "")
    .replace(/,/g, "-");

  return `rozvrh-IT-step-${fileNameTime}.ics`;
}

export function generateICalFromSchedule() {
  try {
    const storedItemsParsed = getStoredItems();
    const onlyNewerDates = filterFutureEvents(storedItemsParsed);
    const itemsCount = onlyNewerDates.length;

    updateDownloadButtonText(itemsCount);

    const downloadIcal = document.querySelector("#download-ical");
    if (downloadIcal) return;

    const downloadLink = createDownloadLink(itemsCount);

    const scheduleTop = document.querySelector("app-timetable-filters");
    if (scheduleTop) {
      scheduleTop.prepend(downloadLink);
    }
  } catch (error) {
    console.error("Error generating iCal from schedule:", error);
  }
}
