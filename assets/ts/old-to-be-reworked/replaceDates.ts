// using forced czech date format:
// dateFormat = "d. M. yyyy"
function detectDate(element: HTMLElement): Number | string {
  const elementText = element.innerText;
  const testElementText = elementText.replace(/\s/g, "");

  let [day, month, year] = testElementText.split(".");
  if (day.length === 1) {
    day = "0" + day;
  }
  if (month.length === 1) {
    month = "0" + month;
  }

  const date = `${year}-${month}-${day}`;
  const parsedDate = Date.parse(date);

  if (isNaN(parsedDate)) {
    return elementText as string;
  }
  return parsedDate as Number;
}

// time since
function timeSince(date) {
  const now = +new Date();
  const seconds = Math.floor((now - date) / 1000);

  let interval = seconds / 31536000;

  // if not recognized, return original
  if (typeof interval !== "number") {
    return date;
  }

  if (interval > 1) {
    if (interval > 2) {
      return "před " + Math.floor(interval) + " lety";
    }
    return "před rokem";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    if (interval > 2) {
      return "před " + Math.floor(interval) + " měsíci";
    }
    return "před měsícem";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    if (interval > 2) {
      return "před " + Math.floor(interval) + " dny";
    }
    return "včera";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    // před hodinami
    return "dnes";
  }
  interval = seconds / 60;
  if (interval > 1) {
    // před minutami
    return "dnes";
  }
  return "nyní";
}

function localizedDate(date) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  } as const;

  try {
    return new Date(date).toLocaleDateString("cs-CZ", options);
  } catch (error) {
    return date;
  }
}

// Rewrite dates to ago
// Example: Naposledy navštívil MyStat : 13.12.21
// Return: před 2 hodinami
export function replaceDates() {
  const debug = false;

  debug ? console.time("replaceDates") : null;

  // test elements
  const testedElements = document.querySelectorAll(
    '[ng-if="stud.last_date_vizit != null"] span, .presents_stud td.mystat'
  );

  // for each element
  for (let i = 0; i < testedElements.length; i++) {
    try {
      const testElement = testedElements[i] as HTMLElement;
      const date = detectDate(testElement);

      testElement.innerText = timeSince(date);
      testElement.title = localizedDate(date);
    } catch (error) {}
  }

  debug ? console.timeEnd("replaceDates") : null;
}
