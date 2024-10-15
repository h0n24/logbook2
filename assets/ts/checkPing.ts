/**
 * Creates and loads an image element by url.
 * @param  {String} url
 * @return {Promise} promise that resolves to an image element or
 *                   fails to an Error.
 */
function request_image(url: string): Promise<any> {
  return new Promise(function (resolve, reject) {
    var img = new Image();
    img.onload = function () {
      resolve(img);
    };
    img.onerror = function () {
      reject(url);
    };
    img.src =
      url +
      "?random-no-cache=" +
      Math.floor((1 + Math.random()) * 0x10000).toString(16);
  });
}

/**
 * Pings a url.
 * @param  {String} url
 * @param  {Number} multiplier - optional, factor to adjust the ping by.  0.3 works well for HTTP servers.
 * @return {Promise} promise that resolves to a ping (ms, float).
 */
function ping(url: string, multiplier: number): Promise<any> {
  return new Promise(function (resolve, reject) {
    var start = new Date().getTime();
    var response = function () {
      var delta = new Date().getTime() - start;
      delta *= multiplier || 1;
      delta = Math.round(delta);
      resolve(delta);
    };
    request_image(url).then(response).catch(response);

    // Set a timeout for max-pings, 5s.
    setTimeout(function () {
      reject(Error("Timeout"));
    }, 5000);
  });
}

function messageYourVPNisOnline(pulseElement: HTMLElement, delta: any) {
  pulseElement.classList.remove("disconnected");
  pulseElement.classList.add("connected");
  pulseElement.title = `Spojení se serverem v pořádku (${String(delta)} ms)`;
}

function messageYourVPNisOffline(pulseElement: HTMLElement) {
  pulseElement.classList.remove("connected");
  pulseElement.classList.add("disconnected");
  pulseElement.title = "Server není dostupný. Je VPN zapnutá?";
}

function messageYoureOffline(pulseElement: HTMLDivElement) {
  pulseElement.classList.remove("connected");
  pulseElement.classList.add("disconnected");
  pulseElement.title = "Váš počítač je offline.";
}

function hasPing(delta: any) {
  // console.error("Your ping is: ", delta);
  const pulseElement = document.getElementById("pulse");
  if (pulseElement) messageYourVPNisOnline(pulseElement, delta);
}

function hasNoPing(err: any) {
  // console.error("Could not ping remote URL", err);
  const pulseElement = document.getElementById("pulse");
  if (pulseElement) messageYourVPNisOffline(pulseElement);
}

function testPing() {
  try {
    ping("https://logbook.itstep.org/favicon.ico", 0.4)
      .then((delta) => hasPing(delta))
      .catch((err) => hasNoPing(err));
  } catch (error) {
    hasNoPing(error);
  }
}

// check ping regularly
// beware, this function is very CPU intensive
// on a low-end computer it can cause around 5-6% CPU usage
export function checkPing() {
  const body = document.body as HTMLElement;

  // skip if computer is running on less than 2 cores
  if (navigator.hardwareConcurrency < 2) {
    return;
  }

  // we want to do a performance test, check how fast the computer is
  // and run the code only if it can handle the load
  let performance = window.performance;
  if (!performance) {
    console.log("Performance API is not supported.");
    return;
  }
  let canRun = false;

  let skip = false;
  const howLong = 10;
  const howMany = 200;
  const startTest = performance.now();

  for (let i = 1; i < howMany; i++) {
    if (skip) {
      continue;
    }
    // generate array of 1000 random numbers
    const arr = Array.from({ length: howMany }, () =>
      Math.floor(Math.random() * howMany)
    );
    // sort the array
    arr.sort();

    if (performance.now() - startTest > howLong) {
      skip = true;
    }

    if (i === howMany - 1) {
      canRun = true;
    }
  }

  const endTest = performance.now();
  setTimeout(() => {
    if (endTest - startTest < howLong) {
      canRun = true;
    }
  }, howLong);

  if (!canRun) {
    return;
  }

  // init
  const pulseElement = document.createElement("div");
  pulseElement.id = "pulse";
  pulseElement.title = "Zkouším navázat spojení...";
  body.appendChild(pulseElement);

  // first run
  testPing();

  // repeat every 5 seconds
  let repeatWhenOnline = setInterval(() => testPing(), 5000);

  // addEventListener version
  window.addEventListener("offline", () => {
    // console.log("The network connection has been lost.");
    clearInterval(repeatWhenOnline);

    messageYoureOffline(pulseElement);
    setTimeout(() => messageYoureOffline(pulseElement), 5000);
  });

  window.addEventListener("online", () => {
    // console.log("The network connection has been restored.");

    testPing();
    repeatWhenOnline = setInterval(() => testPing(), 5000);
  });
}
