// @ts-nocheck

import { fileModal } from "./ts/file/modal";
import { fileListener } from "./ts/file/listener";

// inject script into the page
const s = document.createElement("script");
s.src = chrome.runtime.getURL("script-dist.js");
(document.head || document.documentElement).appendChild(s);
s.onload = function () {
  s.parentNode.removeChild(s);
};

fileListener();
fileModal();
