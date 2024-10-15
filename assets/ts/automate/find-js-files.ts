import { downloadZip } from "./client-zip.js";

function getAllScriptsLinks() {
  let scriptsArray: string[] = [];
  // find all scripts on the page
  const scripts = document.querySelectorAll("script");
  // filter out the ones that are not external
  const externalScripts = Array.from(scripts).filter((script) => script.src);
  // get the src attribute of the script and log it but not via map
  externalScripts.forEach((script) => scriptsArray.push(script.src));
  return scriptsArray;
}

function filterScripts(scriptsArray: string[]) {
  let filteredScriptsArray: string[] = [];

  // clean scripts of those we don't need
  for (let i = 0; i < scriptsArray.length; i++) {
    // remove all chrome-extension scripts
    if (scriptsArray[i].startsWith("chrome-extension://")) {
      continue;
    }
    // remove google metrics
    if (scriptsArray[i].startsWith("https://www.googletagmanager.com")) {
      continue;
    }
    // remove google metrics
    if (
      scriptsArray[i].startsWith(
        "https://www.google-analytics.com/analytics.js"
      )
    ) {
      continue;
    }

    // remove angular material cuz it's included two times
    if (
      scriptsArray[i].startsWith(
        "https://cdnjs.cloudflare.com/ajax/libs/angular-material"
      )
    ) {
      continue;
    }
    // remove multiple occurencies of jquery
    if (scriptsArray[i].endsWith("jquery.js")) {
      continue;
    }

    // remove angular-tablesort.js
    if (scriptsArray[i].endsWith("angular-tablesort.js")) {
      continue;
    }

    // // remove bootstrap
    // if (scriptsArray[i].endsWith("bootstrap/dist/js/bootstrap.js")) {
    //   continue;
    // }

    // // remove d3.js
    // if (scriptsArray[i].endsWith("d3.js")) {
    //   continue;
    // }
    // // remove angular.min.js
    // if (scriptsArray[i].endsWith("angular.min.js")) {
    //   continue;
    // }
    // // remove angular-ui-router.min.js
    // if (scriptsArray[i].endsWith("angular-ui-router.min.js")) {
    //   continue;
    // }
    // // remove angular-animate.min.js
    // if (scriptsArray[i].endsWith("angular-animate.min.js")) {
    //   continue;
    // }
    // // remove angular-aria.min.js
    // if (scriptsArray[i].endsWith("angular-aria.min.js")) {
    //   continue;
    // }
    // // remove angular-messages.min.js
    // if (scriptsArray[i].endsWith("angular-messages.min.js")) {
    //   continue;
    // }
    // // remove angular-local-storage.min.js
    // if (scriptsArray[i].endsWith("angular-local-storage.min.js")) {
    //   continue;
    // }
    // // remove angular-translate.min.js
    // if (scriptsArray[i].endsWith("angular-translate.min.js")) {
    //   continue;
    // }
    // // remove toArrayFilter.js
    // if (scriptsArray[i].endsWith("toArrayFilter.js")) {
    //   continue;
    // }
    // // remove angular-translate-loader-url.min.js
    // if (scriptsArray[i].endsWith("angular-translate-loader-url.min.js")) {
    //   continue;
    // }

    // // remove chosen.js
    // if (scriptsArray[i].endsWith("chosen.js")) {
    //   continue;
    // }
    // // remove angular-chosen.min.js
    // if (scriptsArray[i].endsWith("angular-chosen.min.js")) {
    //   continue;
    // }
    // // if it starts with "logbook.itstep.org/js/angular"
    // if (scriptsArray[i].startsWith("https://logbook.itstep.org/js/angular")) {
    //   continue;
    // }
    // // if angular-material.min.js
    // if (scriptsArray[i].endsWith("angular-material.min.js")) {
    //   continue;
    // }
    // // if raven.js
    // if (scriptsArray[i].endsWith("raven.js")) {
    //   continue;
    // }
    // // if raven-js/dist/plugins/angular.js
    // if (scriptsArray[i].endsWith("raven-js/dist/plugins/angular.js")) {
    //   continue;
    // }

    // add to filteredScriptsArray
    filteredScriptsArray.push(scriptsArray[i]);
  }
  return filteredScriptsArray;
}

async function downloadTestZip(arrayOfScripts: string[]) {
  // define what we want in the ZIP
  let arrayOfFiles: any[] = [];
  for (let i = 0; i < arrayOfScripts.length; i++) {
    console.info(
      "fetching " + i + 1 + " from " + arrayOfScripts.length,
      arrayOfScripts[i]
    );
    try {
      const code = await fetch(arrayOfScripts[i]);
      arrayOfFiles.push(code);
    } catch (error) {
      console.warn("Error fetching " + arrayOfScripts[i], error);
    }
  }

  // get the ZIP stream in a Blob
  const blob = await downloadZip(arrayOfFiles).blob();

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

  // make and click a temporary link to download the Blob
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "logbook-changing-assets-" + fileNameTime + ".zip";
  link.click();
  link.remove();

  // in real life, don't forget to revoke your Blob URLs if you use them
}

// export this function to be used in other files
export function findScripts() {
  let scriptsArray: string[] = getAllScriptsLinks();

  // remove from urls the part after ?v=...
  // it's used for cache busting
  for (let i = 0; i < scriptsArray.length; i++) {
    if (scriptsArray[i].includes("?v=")) {
      scriptsArray[i] = scriptsArray[i].split("?v=")[0];
    }
  }

  // filter out scripts that doesn't change that often, so we don't need to download them
  let filteredScriptsArray: string[] = filterScripts(scriptsArray);

  let automatedBlockUrls: any = [];

  for (let i = 0; i < filteredScriptsArray.length; i++) {
    let url = filteredScriptsArray[i];
    // remove https:// from the url
    url = url.replace("https://", "");

    let nameOfScript = url.split("/").pop();

    let blockedUrlScheme: string[] = [];
    blockedUrlScheme.push(url);
    blockedUrlScheme.push("script");
    blockedUrlScheme.push(`/js/${nameOfScript}`);

    automatedBlockUrls.push(blockedUrlScheme);
  }

  // convert automatedBlockUrls to JSON
  let automatedBlockUrlsJSON = JSON.stringify(automatedBlockUrls);
  // copy to clipboard
  navigator.clipboard.writeText(automatedBlockUrlsJSON);

  // log to console
  console.clear();
  console.warn("Automated block URLs JSON copied to clipboard: ");
  console.log(automatedBlockUrlsJSON);

  // download the zip
  downloadTestZip(filteredScriptsArray);
}
