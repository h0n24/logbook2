"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.homeworkAutomation = homeworkAutomation;
var _vocative = require("../vocative");
var zip = _interopRequireWildcard(require("@zip.js/zip.js"));
var _incl = require("../_incl");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// TODO FUTURE: detect multiple opened modals and close them

var filesAllowedToShowAsText = [".txt", ".js", ".css", ".html", ".json", ".md"];
var filesAllowedToShowAsImage = [".png", ".jpg", ".jpeg", ".gif", ".svg"];
var zipBypassModal = false; // allow at the beginning to open the file
var zipBypassModalFirstRun = true; // allow at the beginning to open the file
var hwAutocompleteAnswers = [{
  title: "Super",
  choices: ["Super!", "Paráda!", "Skvělé!", "Super práce!", "Parádní!", "Super práce!", "Parádní práce!", "Dokonalé!", "Perfektní!", "Luxusní!", "Mega dobré!", "Hezké!", "Výborné!", "Wow!", "Wow, super!", "Bravo!", "Skvělá práce!"]
}, {
  title: "Díky",
  choices: ["Díky!", "Děkuji!", "Díky moc!", "Bezva, děkuju!", "Děkuji, skvělý!", "Díky, super!"]
}, {
  title: "Jejda",
  choices: ["Jejda, to se moc nepodařilo.", "Jejda, to se nepovedlo. :(", "Jejda, to se nepovedlo, zkus to znovu prosím."]
}, {
  title: "Znovu",
  choices: ["Zkus to znovu prosím.", "Zkus to ještě jednou prosím.", "Věřím, že to zvládneš opravit.", "Prosím pošli mi to ještě jednou.", "Prosím pošli mi to znovu.", "Prosím zkus si to opravit."]
}, {
  title: "Figma",
  choices: ["Komentáře přidány do Figmy.", "Rady a tipy jsem napsal do Figmy.", "Komentáře a rady k nalezení ve Figmě.", "Tipy přidány do Figmy jako komentáře."]
}];
var focusedElement = document.activeElement;
var lastFocusedAutocompleteAnswer = null;
var keyboardShortcutsForNewModals = null;
function selectRandomFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}
function findAllUnfinishedHomeworksFromModal(homeworksWrap) {
  try {
    var homeworks = homeworksWrap.querySelectorAll("md-dialog .hw-md_content .hw-md_item");
    for (var i = 0; i < homeworks.length; i++) {
      var homework = homeworks[i];
      enhanceHomeworkAssessment(homework);
    }
  } catch (error) {}
}
function findAllUnfinishedHomeworksFromSingleModal(homeworksWrap) {
  try {
    var homeworks = homeworksWrap.querySelectorAll(".md-dialog-container[tabindex='-1'] md-dialog .hw-md_single__content");
    for (var i = 0; i < homeworks.length; i++) {
      var homework = homeworks[i];
      enhanceHomeworkAssessment(homework, true);
    }
  } catch (error) {}
}

// add event listener to all homework buttons
function enhanceSingleHomeworkFromModalAfterEvent() {
  try {
    var homeworkButtons = document.querySelectorAll(".hw_new, .hw_checked");
    for (var i = 0; i < homeworkButtons.length; i++) {
      var homeworkButton = homeworkButtons[i];
      homeworkButton.addEventListener("click", function () {
        setTimeout(function () {
          var newHomework = document.querySelector(".md-dialog-container[tabindex='-1'] md-dialog .hw-md_single__content");
          if (!newHomework) return;
          enhanceHomeworkAssessment(newHomework, true);
        }, 1);
      });
    }
  } catch (error) {}
}
function findStudentsFirstName(homework, single) {
  var singleSel = single ? ".hw-md_single_stud__info" : ".hw-md_stud__info";
  var fullNameEl = homework.querySelector("".concat(singleSel, " .bold"));
  if (!fullNameEl) return "";

  // find vocativ for a name
  var fullName = fullNameEl.innerText;
  var firstName = fullName.split(" ")[0];

  // apply vocativ only if the page is in czech language
  if (document.documentElement.getAttribute("lang") === "cs-CZ") {
    firstName = (0, _vocative.vocative)(firstName);
  }
  return firstName;
}
function getSelectedMark(homework) {
  var selectedMark = 0;

  // preselect maximmum mark only if it's not already selected
  var radioButtons = homework.querySelectorAll("md-radio-group md-radio-button");
  radioButtons.forEach(function (radioButton) {
    // @ts-ignore - unofficial element
    if (radioButton.ariaChecked == "true") {
      // @ts-ignore - unofficial element
      selectedMark = parseInt(radioButton.ariaLabel);
    }
  });
  if (selectedMark == 0) {
    var maxMark = homework.querySelector('md-radio-group  md-radio-button[aria-label="12"]');
    maxMark.click();
    selectedMark = 12;
  }
  return selectedMark;
}
function automateMessagesForStudents(homework, firstName, selectedMark) {
  var textarea = homework.querySelector(".hw-md_single_teacher__comment");
  if (!textarea) return;

  // if textarea already has a some text value, don't overwrite it
  if (textarea.value) return;

  // remove focus functionality
  if (textarea.getAttribute("md-select-on-focus")) {
    textarea.removeAttribute("md-select-on-focus");
  }
  var partialInteresting = selectRandomFromArray(["Moc pěkná práce!", "Luxusní práce!", "Perfektní práce!", "Super práce!", "Super!", "Parádní práce!"]);
  var partialEnjoying = selectRandomFromArray(["Líbí se mi to.", "Je to moc zajímavé.", "Je to super.", "Je to parádní.", "Hodně dobře zpracované."]);
  var partialGetting = selectRandomFromArray(["Dostáváš", "Dávám Ti", "Zasloužíš si", "Dostáváš ode mě"]);
  var message = "Zdrav\xEDm ".concat(firstName, ",\n\r").concat(partialInteresting, " ").concat(partialEnjoying, " ").concat(partialGetting, " ").concat(selectedMark, " bod\u016F.\n\rS pozdravem");
  textarea.value = message;

  // simulate input event
  textarea.dispatchEvent(new Event("input"));
  textarea.dispatchEvent(new Event("change"));
}
function makeURLinTextClickable(homework) {
  try {
    // if you find class .hw-md_single_stud-work__answer-text make any text inside that is a link clickable
    var studentsComments = homework.querySelector(".hw-md_single_stud-work__answer-text");
    if (studentsComments === null) return;
    var originalText = studentsComments.innerText;
    if (!originalText) return;
    var newText = createUrlfromText(originalText);
    if (newText) {
      studentsComments.innerHTML = newText;
    }

    // detect if original text contains only url
    var onlyUrl = originalText.match(/(https?:\/\/[^\s]+)/g);
    if (onlyUrl && onlyUrl.length === 1) {
      // add clickable span to the studentsComments
      var span = document.createElement("span");
      span.classList.add("homework-copy-url-to-clipboard");
      span.textContent = "📋";
      span.title = "Kopírovat odkaz do schránky";
      studentsComments.appendChild(span);

      // add event listener to the span
      span.addEventListener("click", function () {
        // copy url to clipboard
        navigator.clipboard.writeText(onlyUrl[0]);
      });
    }
  } catch (error) {
    console.warn("makeURLinTextClickable error", error);
  }
}
function createUrlfromText(originalText) {
  // detect if text contains url
  var text = originalText;
  var url = text.match(/(https?:\/\/[^\s]+)/g);

  // make the url in the text clickable for every url
  if (url) {
    for (var i = 0; i < url.length; i++) {
      var selURL = url[i];

      // make url more readable
      var urlText = selURL;
      // remove http:// or https://
      urlText = urlText.replace(/(^\w+:|^)\/\//, "");
      // remowe www.
      urlText = urlText.replace("www.", "");
      // remove everything after ? plus remove ? itself
      urlText = urlText.replace(/\?.*/, "");
      // remove everything after # plus remove # itself
      urlText = urlText.replace(/#.*/, "");
      // remove last / if it's there
      urlText = urlText.replace(/\/$/, "");

      // url encode back to original
      urlText = decodeURIComponent(urlText);

      // if longer than 60 characters, shorten it in the middle with …
      if (urlText.length > 40) {
        var firstHalf = urlText.slice(0, 15);
        var secondHalf = urlText.slice(-15);
        urlText = firstHalf + " … " + secondHalf;
      }
      text = text.replace(selURL, "<a href=\"".concat(selURL, "\" title=\"Cel\xE1 adresa: ").concat(selURL, "\" target=\"_blank\">").concat(urlText, "</a>"));
    }
    return text;
  }
}
function enhanceHomeworkAssessment(homework, single) {
  if (homework === null) return;
  // prevent doing this multiple times by adding a data-attribute alreadyEnhanced
  if (homework.getAttribute("alreadyEnhancedHomework") === "true") {
    return;
  } else {
    betterButtonsRework(homework);
    makeURLinTextClickable(homework);
    if (single) {
      // better back button than original
      var backButton = homework.querySelector(".hw-md_single__back");
      btnBackCreateInnerHtml(backButton, false);
    }
    var firstName = findStudentsFirstName(homework, single);
    var selectedMark = getSelectedMark(homework);
    automateMessagesForStudents(homework, firstName, selectedMark);

    // add autocomplete
    var textarea = homework.querySelector(".hw-md_single_teacher__comment");

    // select parent
    var parent = textarea.parentElement;
    parent.addEventListener("onchange", function () {
      createAnswersAutocomplete(textarea, true);
    });

    // TODO: add back after solving the focus all bug
    // when textarea is focused, show autocomplete
    textarea.addEventListener("focus", function () {
      createAnswersAutocomplete(textarea, true);
    });
    homework.setAttribute("alreadyEnhancedHomework", "true");
  }
}
function betterButtonsRework(homework) {
  // add new class .hw-better-buttons
  homework.classList.add("hw-better-buttons");
  try {
    // find .hw-md_stud-work__download-wrap
    var lectorWrap = homework.querySelector(".hw-md_stud-work__download-wrap");
    // add text to it as "Stáhnout zadání od učitele"
    lectorWrap.innerHTML = "Zadání od lektora";

    // find .hw-md_single_stud-work__download-wrap
    var studentWrap = homework.querySelector(".hw-md_single_stud-work__download-wrap");
    // add text to it as "Stáhnout studentovu práci"
    studentWrap.innerHTML = "Stáhnout práci studenta";
  } catch (error) {}
}

// original menu has a bug -> it doesn't update homework count
// -> observe if number of homework changes
function observeHomeworkCountAndUpdateMenu() {
  try {
    var hwCount = document.querySelector("[ng-show='new_hw && new_hw.length'] .hw-count");
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === "characterData") {
          var hwCountMenu = document.querySelector("[ng-class=\"{active: activeNav == 'homeWork'}\"]  .orange-count[aria-hidden=\"false\"]");
          hwCountMenu.innerText = hwCount.innerText;
          if (hwCount.innerText === "0") {
            hwCountMenu.classList.add("ng-hide");
          }
        }
      });
    });
    var config = {
      characterData: true,
      attributes: false,
      childList: false,
      subtree: true
    };
    observer.observe(hwCount, config);
  } catch (error) {}
}
function observeIfNewHomeworksAdded(homeworksWrap, single) {
  // if  .hw-md_item in .md-dialog in .hw-md_content is added
  // then enhance it
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === "childList") {
        if (single) {
          findAllUnfinishedHomeworksFromSingleModal(homeworksWrap);
        } else {
          findAllUnfinishedHomeworksFromModal(homeworksWrap);
        }
      }
    });
  });
  var config = {
    characterData: false,
    attributes: false,
    childList: true,
    subtree: true
  };
  observer.observe(homeworksWrap, config);
}
function convertnl2br(text) {
  return text.replace(/(?:\r\n|\r|\n)/g, "<br>");
}
function eventListenerForNewModal(event) {
  if (event.key === "Escape") {
    var dialogElement = document.querySelector("#modal-file");
    dialogElement.classList.remove("active");
  }
}
function createEventListenerForFileModal() {
  document.addEventListener("keyup", eventListenerForNewModal);
}
function addDataToPre(originalType, data, pre) {
  // convert type to lowercase
  var type = originalType.toLowerCase();
  function ifUnableToRead(dataText) {
    if (!dataText) {
      dataText = "Obsah souboru se nepodařilo načíst. :( Zkuste to ještě jednou, nebo si jej stáhněte";
    }
    return dataText;
  }
  if (type === "text") {
    var _createUrlfromText;
    var dataText = (_createUrlfromText = createUrlfromText(data !== null && data !== void 0 ? data : "")) !== null && _createUrlfromText !== void 0 ? _createUrlfromText : "";
    if (!dataText) {
      dataText = data;
    }
    dataText = ifUnableToRead(dataText);
    dataText = convertnl2br(dataText);
    pre.innerHTML = dataText;
  }
  if (filesAllowedToShowAsText.includes("." + type)) {
    var _dataText = data;
    _dataText = ifUnableToRead(_dataText);
    if (type === "html") {
      _dataText = _dataText.replace(/</g, "&lt;");
      _dataText = _dataText.replace(/>/g, "&gt;");
    }
    _dataText = convertnl2br(_dataText);
    pre.innerHTML = _dataText;
  }
  if (filesAllowedToShowAsImage.includes("." + type)) {
    pre.innerHTML = "<img src=\"".concat(data, "\" alt=\"Obr\xE1zek\" />");
  }
  if (type === "pdf") {
    var iframe = document.createElement("iframe");
    iframe.src = data;
    pre.innerHTML = "";
    pre.appendChild(iframe);
  }
  if (type === "zip") {
    pre.innerHTML = "";
    pre.appendChild(data);
  }
}
function createModalLayout(data, url, type) {
  var filename = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
  function eventCloseNewModal(event) {
    event.preventDefault();
    dialog.classList.remove("active");
    // BUG: doesn't work as intended :(
    // addOriginalEventListenerBack2(eventListenerForNewModal);
  }
  var dialog = document.createElement("div");
  dialog.id = "modal-file";
  dialog.classList.add("modal-file", "active");

  // create link a with href #close class .modal-overlay and aria-label Close
  var modalOverlay = document.createElement("a");
  modalOverlay.href = "#close";
  modalOverlay.classList.add("modal-overlay");
  modalOverlay.setAttribute("aria-label", "Close");

  // create div with class .modal-container
  var container = document.createElement("div");
  container.classList.add("modal-container");

  // create div with class .modal-header
  var header = document.createElement("div");
  header.classList.add("modal-header");

  // create a#close with class btn btn-clear float-right aria-label Close
  var close = document.createElement("a");
  close.href = "#close";
  close.classList.add("btn-modal-close");
  close.setAttribute("aria-label", "Close");

  // create modal title
  var title = document.createElement("h4");
  createModalTitle(type, title);

  // create div with class .modal-body
  var body = document.createElement("div");
  body.classList.add("modal-body");

  // create pre with data from file
  var pre = document.createElement("div");
  pre.classList.add("modal-pre");
  addDataToPre(type, data, pre);

  // create modal-footer
  var footer = document.createElement("div");
  footer.classList.add("modal-footer");

  // add button to download original file
  var download = document.createElement("a");
  download.id = "modal-download-file";
  download.classList.add("btn", "btn-primary");
  download.target = "_blank"; // to open in new tab
  updateDownloadButtonData(download, url, filename);

  // add second button to close
  // const close2 = document.createElement("a");
  // close2.href = "#close";
  // close2.classList.add("btn-modal-close2");
  // close2.innerText = "Zavřít okno";

  // add buttons to close the modal
  close.addEventListener("click", eventCloseNewModal);
  // close2.addEventListener("click", eventCloseNewModal);
  modalOverlay.addEventListener("click", eventCloseNewModal);

  // close modal on escape key
  createEventListenerForFileModal();

  // append elements
  header.appendChild(title);
  header.appendChild(close);
  body.appendChild(pre);
  // footer.appendChild(close2);
  footer.appendChild(download);
  container.appendChild(header);
  container.appendChild(body);
  container.appendChild(footer);
  dialog.appendChild(modalOverlay);
  dialog.appendChild(container);

  // append modal to body
  document.body.appendChild(dialog);
}
function createModalTitle(type, title, showBackButton) {
  if (showBackButton) {
    // create back button
    var backButton = document.createElement("a");
    backButton.href = "#close";
    btnBackCreateInnerHtml(backButton, true);

    // add event listener that runs createZipFileTable();
    backButton.addEventListener("click", function (event) {
      event.preventDefault();
      createZipFileTable();
    });
    title.innerHTML = "";
    title.appendChild(backButton);
  } else {
    if (type === "text") {
      title.textContent = "Obsah souboru .txt";
    } else if (type === "zip") {
      title.textContent = "Obsah souboru .zip";
    } else {
      title.textContent = "Obsah souboru .".concat(type);
    }
  }
}
function btnBackCreateInnerHtml(backButton, isZipModal) {
  backButton.classList.add("btn-modal-zip-back");
  // add svg icon
  var svgIcon = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 -6.5 38 38\"><path fill=\"#1C1C1F\" d=\"M11.19.58.67 11l-.08.09c-.35.34-.56.8-.59 1.35v.18c.03.43.2.84.52 1.21l.12.13 10.55 10.46a2 2 0 0 0 2.82 0 2 2 0 0 0 0-2.82l-7.28-7.23H36a2 2 0 1 0 0-3.98H6.96l7.05-6.99a2 2 0 0 0 0-2.82 2 2 0 0 0-2.82 0Z\"/></svg>";
  if (isZipModal) {
    backButton.title = "Klávesová zkratka: Backspace";
    backButton.innerHTML = svgIcon + "<span>Zpět na seznam souborů</span>";
  } else {
    backButton.innerHTML = svgIcon + "<span>Zpět</span>";
  }
}
function updateDownloadButtonData(download, url, filename) {
  download.href = url;
  download.setAttribute("download", filename); // to force download
  if (filename === "") {
    download.innerHTML = "Stáhnout původní soubor";
  } else {
    var shorterFilename = filename;
    if (filename.length > 30) {
      // shorten filename from the middle
      var firstHalf = filename.slice(0, 15);
      var secondHalf = filename.slice(-15);
      shorterFilename = firstHalf + " … " + secondHalf;
    }
    download.title = "Cel\xFD n\xE1zev souboru: ".concat(filename);
    download.innerHTML = "St\xE1hnout soubor <span>".concat(shorterFilename, "</span>");
  }
}
function createModalForFiles(data, url, type) {
  var filename = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
  var showBackButton = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  // detect if #modal-file exists and if it does, just update the content
  var existingModal = document.querySelector("#modal-file");
  if (existingModal) {
    existingModal.classList.add("active");
    var title = existingModal.querySelector("h4");
    createModalTitle(type, title, showBackButton);
    var pre = existingModal.querySelector(".modal-pre");
    addDataToPre(type, data, pre);
    var download = existingModal.querySelector(".modal-footer #modal-download-file");
    updateDownloadButtonData(download, url, filename);
    return;
  }

  // create modal via HTML dialog
  createModalLayout(data, url, type, filename);
}
function createTheadForZipFileTable() {
  var thead = document.createElement("thead");
  var trHead = document.createElement("tr");
  var thFilename = document.createElement("th");
  thFilename.textContent = "Cesta nebo název souboru";
  trHead.appendChild(thFilename);
  var thSize = document.createElement("th");
  thSize.textContent = "Velikost";
  trHead.appendChild(thSize);
  var thDate = document.createElement("th");
  thDate.textContent = "Datum";
  trHead.appendChild(thDate);
  thead.appendChild(trHead);
  return thead;
}
function readZipFile(_x, _x2) {
  return _readZipFile.apply(this, arguments);
}
function _readZipFile() {
  _readZipFile = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(blob, originalFileUrl) {
    var reader;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          reader = new FileReader();
          reader.readAsArrayBuffer(blob);
          reader.addEventListener("load", function () {
            var arrayBuffer = reader.result;
            var uint8Array = new Uint8Array(arrayBuffer);
            var zipReader = new zip.ZipReader(new zip.Uint8ArrayReader(uint8Array));

            // save zipReaderData to global variable
            // @ts-ignore
            window.zipReaderData = zipReader;

            // @ts-ignore
            window.zipOriginalFileUrl = originalFileUrl;
            createZipFileTable();
          });
        case 3:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _readZipFile.apply(this, arguments);
}
function createZipFileTable() {
  // @ts-ignore
  var zipReader2 = window.zipReaderData;

  // @ts-ignore
  var originalFileUrl = window.zipOriginalFileUrl;
  var entriesTable = document.createElement("table");
  entriesTable.id = "zip-entries-table";
  entriesTable.classList.add("zip-entries-table");
  var thead = createTheadForZipFileTable();
  var tbody = document.createElement("tbody");
  zipReader2.getEntries().then(function (entries) {
    entries.forEach(function (entry) {
      if (entry.directory) return; // skip directories
      if (entry.filename.startsWith("__MACOSX")) return; // skip mac os x files
      if (entry.filename.includes(".DS_Store")) return; // skip .DS_Store files

      createTrForZipFileTable(entry, tbody);
    });
  });
  entriesTable.appendChild(thead);
  entriesTable.appendChild(tbody);
  createModalForFiles(entriesTable, originalFileUrl, "zip", "", false);
}
function toCzechNumber(number) {
  return number.toLocaleString("cs-CZ", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
    useGrouping: true
  });
}
function createTrForZipFileTable(entry, tbody) {
  var _betterFilename$split, _entry$uncompressedSi;
  var tr = document.createElement("tr");
  tr.title = "Klinut\xEDm zobraz\xEDte obsah souboru ".concat(entry.filename, ". Soubor se st\xE1hne, pokud jde o nezn\xE1m\xFD typ.");

  // get shortcut name from entry.filename
  var extension = getExtensionFromEntryFilename(entry);

  // create td with filename
  var td = document.createElement("td");
  td.classList.add("zip-entry-filename");

  // detect / and replace it with <span>/</span>
  var betterFilename = entry.filename;
  betterFilename = betterFilename.replace(/\//g, "<span>/</span>");

  // get extension length
  var extLength = extension.length;
  // remove extension from filename
  betterFilename = betterFilename.slice(0, -extLength);
  // if last character is a dot
  var hasDot = betterFilename.slice(-1) === ".";
  var dot = "";
  if (hasDot) {
    // then remove it too
    betterFilename = betterFilename.slice(0, -1);
    dot = ".";
  }
  betterFilename += "<span>".concat(dot).concat(extension, "</span>");

  // last part after / make <strong>
  var lastPart = (_betterFilename$split = betterFilename.split("<span>/</span>").pop()) !== null && _betterFilename$split !== void 0 ? _betterFilename$split : "";
  betterFilename = betterFilename.replace(lastPart, "<strong>".concat(lastPart, "</strong>"));
  td.innerHTML = betterFilename;
  tr.appendChild(td);

  // create td with file size
  var tdSize = document.createElement("td");
  var originalSize = (_entry$uncompressedSi = entry.uncompressedSize) !== null && _entry$uncompressedSi !== void 0 ? _entry$uncompressedSi : 0;
  var betterSize = "";
  if (originalSize > 1000000) {
    betterSize = toCzechNumber(originalSize / 1000000) + " MB";
  } else if (originalSize > 1000) {
    betterSize = toCzechNumber(originalSize / 1000) + " KB";
  } else {
    betterSize = originalSize + " B";
  }
  tdSize.textContent = betterSize;
  tr.appendChild(tdSize);

  // create td with last modified date
  var tdDate = document.createElement("td");

  // localize date to czech and show only day, month, hour and minute
  var options = {
    day: "numeric",
    month: "numeric",
    hour: "numeric",
    minute: "numeric"
  };
  tdDate.textContent = entry.lastModDate.toLocaleDateString("cs-CZ", options);
  tr.appendChild(tdDate);
  tbody.appendChild(tr);
  tr.dataset.filename = entry.filename;

  // when clicked on tr, show the file
  tr.addEventListener("click", function () {
    addClickEventToTr(tr);
  });
}

// Helper function to manage blob and URL creation and to open a modal
function handleBlobAndOpenModal(blob, fileType, entryFilename, showModalBackButton) {
  var newBlob = new Blob([blob], {
    type: fileType
  });
  var objectURL = URL.createObjectURL(newBlob);
  createModalForFiles(objectURL, objectURL, fileType.split("/")[1], entryFilename, showModalBackButton);
}
function downloadFile(blob, filename) {
  var link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  link.remove();
}
function processFileBasedOnType(entry, blob) {
  var extension = getExtensionFromEntryFilename(entry);
  if (filesAllowedToShowAsText.includes("." + extension)) {
    getTextFromBlobAndCreateModal(blob, entry, extension);
  } else if (filesAllowedToShowAsImage.includes("." + extension)) {
    handleBlobAndOpenModal(blob, "image/".concat(extension), entry.filename, true);
  } else if (entry.filename.includes(".pdf")) {
    handleBlobAndOpenModal(blob, "application/pdf", entry.filename, true);
  } else {
    downloadFile(blob, entry.filename);
  }
}
function addClickEventToTr(tr) {
  // @ts-ignore
  var zipReader = window.zipReaderData;

  // get entry data from zipReader
  zipReader.getEntries().then(function (entries) {
    // find entry by filename
    // also get filename from dataset.filename
    var entry = entries.find(function (e) {
      return e.filename === tr.dataset.filename;
    });
    entry.getData(new zip.BlobWriter()).then(function (blob) {
      processFileBasedOnType(entry, blob);
    });
  });
}
function getExtensionFromEntryFilename(entry) {
  var _entry$filename$split, _extension$split$pop;
  var extension = "";

  // split by / and get last element
  extension = (_entry$filename$split = entry.filename.split("/").pop()) !== null && _entry$filename$split !== void 0 ? _entry$filename$split : "";

  // split by . and get last element
  extension = (_extension$split$pop = extension.split(".").pop()) !== null && _extension$split$pop !== void 0 ? _extension$split$pop : "";
  return extension;
}
function getTextFromBlobAndCreateModal(blob, entry, type) {
  var typeCorrections = type;
  if (type === ".txt") {
    typeCorrections = "text";
  }
  var reader = new FileReader();
  reader.readAsText(blob);
  reader.addEventListener("load", function () {
    var dataUrl = URL.createObjectURL(blob);
    createModalForFiles(reader.result, dataUrl, typeCorrections, entry.filename, true);
  });
}
function manipulateWithWindowOpen() {
  // This will get argument url from window.open without changing the original function
  // @ts-ignore
  window.open = function (original) {
    return function (url, windowName, windowFeatures) {
      if (zipBypassModal) {
        // NOTE: we have to use set timeout,
        // otherwise it calls itself with false on return
        setTimeout(function () {
          zipBypassModal = false;
        }, 100);
        return original(url, windowName, windowFeatures);
      }

      // show modal for files from fsx1.itstep.org
      var urlText = url;
      if (urlText.includes("https://fsx1.itstep.org/api/v1/files")) {
        whenOpeningLinkWithFile({
          urlText: urlText,
          original: original,
          url: url,
          windowName: windowName,
          windowFeatures: windowFeatures
        });
      } else {
        // returning original function
        return original(url, windowName, windowFeatures);
      }
    };
  }(window.open);
}
function whenOpeningLinkWithFile(_ref) {
  var urlText = _ref.urlText,
    original = _ref.original,
    url = _ref.url,
    windowName = _ref.windowName,
    windowFeatures = _ref.windowFeatures;
  // fetch the file
  fetch(urlText, {
    method: "GET",
    headers: {
      "Content-Type": "text/plain;charset=UTF-8"
    }
  }).then(function (response) {
    return response.blob();
  }).then(function (blob) {
    // create a url for the file
    if (blob.type.includes("text")) {
      // read contents of the blob via FileReader
      var reader = new FileReader();
      reader.addEventListener("load", function () {
        var data = reader.result;
        createModalForFiles(data, urlText, "text");
      });
      reader.readAsText(blob);
    } else if (blob.type.includes("pdf")) {
      var _url = URL.createObjectURL(blob);
      createModalForFiles(_url, urlText, "pdf");
    } else if (blob.type.includes("zip")) {
      readZipFile(blob, urlText);
    } else {
      // returning original function for other type of files (images, unreadable files, etc.)
      return original(url, windowName, windowFeatures);
    }
  });
}
var debouncedTarget;
function bypassModalWhenRightClicked() {
  document.addEventListener("contextmenu", function (event) {
    var target = event.target;
    if (target.classList.contains("hw-md_stud-work__download-wrap")) {
      bypassModal();
    }
    if (target.classList.contains("hw-md_single_stud-work__download-wrap")) {
      bypassModal();
    }
    function bypassModal() {
      // prevent default context menu
      event.preventDefault();
      if (zipBypassModalFirstRun) {
        zipBypassModal = true;
        zipBypassModalFirstRun = false;
      }
      if (zipBypassModal) {
        target.click();
        zipBypassModal = false;
        setTimeout(function () {
          zipBypassModal = true;
        }, 300);
      }
    }
  });
}
function addKeyboardCtrlAShortcut(event) {
  if (event.ctrlKey) {
    if (event.key === "a" || event.key === "A") {
      var homeWorks = document.querySelector(".homeWorks");
      if (homeWorks) {
        // if not textarea is focused
        focusedElement = document.activeElement;
        if (focusedElement.tagName !== "TEXTAREA") {
          event.preventDefault();
        }
      }
      var modalFile = document.querySelector("#modal-file");
      if (modalFile) {
        if (modalFile.classList.contains("active")) {
          var pre = modalFile.querySelector(".modal-pre");
          var selection = window.getSelection();
          var range = document.createRange();
          range.selectNodeContents(pre);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    }
  }
}
function addKeyboardBackspaceShortcut(event) {
  // if #modal-file has classList active
  // when pressed backspace
  // trigger click on .btn-modal-zip-back
  if (event.key === "Backspace") {
    var modalFile = document.querySelector("#modal-file");
    if (modalFile) {
      if (modalFile.classList.contains("active")) {
        var backButton = modalFile.querySelector(".btn-modal-zip-back");
        if (backButton) {
          backButton.click();
        }
      }
    }
  }
}
function regenerateMessageOnCtrlShiftSpace(target) {
  var targetDialog = target.closest(".hw-better-buttons");

  // detect if target dialog has child with class .hw-md_content or .hw-md_single__content
  if (targetDialog === null) return;
  // if has class .hw-md_single__content
  var isSingle = targetDialog.classList.contains("hw-md_single__content");

  // get firstName and selectedMark
  var firstName = findStudentsFirstName(targetDialog, isSingle);
  var selectedMark = getSelectedMark(targetDialog);

  // add random message to the textarea
  automateMessagesForStudents(targetDialog, firstName, selectedMark);
}

// Helper function to determine if a space should be added
function shouldAddSpace(character, isStart) {
  // List of whitespace characters where we don't want to add an extra space
  var whitespaceChars = [" ", "\n", "\t"];

  // Check if the character at the specified position is not a space or is one of the whitespace characters
  if (isStart) {
    return !whitespaceChars.includes(character) ? " " : "";
  } else {
    return whitespaceChars.includes(character) ? "" : " ";
  }
}
function addTextAnswerToTextarea(target, addedText) {
  var textarea = target;
  var cursorPosition = textarea.selectionStart;
  var text = textarea.value;
  var textBefore = text.substring(0, cursorPosition);
  var textAfter = text.substring(cursorPosition);

  // if user also selected a text, remove it
  // @ts-ignore
  var selectedText = window.getSelection().toString();
  if (selectedText) {
    textAfter = text.substring(cursorPosition + selectedText.length);
  }
  var addSpaceBefore = shouldAddSpace(textBefore.slice(-1), false);
  var addSpaceAfter = shouldAddSpace(textAfter.slice(0, 1), true);

  // detect if selectedText is the whole text in textarea
  // if so, remove it
  if (selectedText === text) {
    addSpaceBefore = "";
    addSpaceAfter = "";
  }

  // if textBefore is empty, dont add space before
  if (textBefore === "") {
    addSpaceBefore = "";
  }
  var textToAdd = addSpaceBefore + addedText + addSpaceAfter;
  var newText = textBefore + textToAdd + textAfter;
  textarea.value = newText;
  textarea.dispatchEvent(new Event("input"));
  textarea.dispatchEvent(new Event("change"));

  // set cursor position after the added text
  textarea.selectionStart = cursorPosition + textToAdd.length;
  textarea.selectionEnd = cursorPosition + textToAdd.length;
  textarea.focus();
}
function createAnswersAutocomplete(target) {
  var skipFocus = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  // find parent .hw-better-buttons
  var targetDialog = target.closest(".hw-better-buttons");

  // add element to the textarea
  var teacherWrap = targetDialog.querySelector(".hw-md_single_teacher__file-wrap");
  if (teacherWrap) {
    // detect if element already exists
    var addedWrapElement = teacherWrap.querySelector(".added-autocomplete-wrap");
    if (addedWrapElement) {
      // set first element as active
      if (!skipFocus) {
        var firstElement = addedWrapElement.querySelector(".added-autocomplete-answer");
        firstElement.focus();
      }
      return;
    }

    // create wrap element
    addedWrapElement = document.createElement("div");
    addedWrapElement.classList.add("added-autocomplete-wrap");
    addedWrapElement.classList.add("added-autocomplete-wrap-active");

    // create items from hwAutocompleteAnswers variable
    var _loop = function _loop() {
      var answer = hwAutocompleteAnswers[i];
      var answerText = answer.title;

      // crate new a href element
      var addedAnswerElement = document.createElement("a");
      addedAnswerElement.href = "#";
      addedAnswerElement.classList.add("added-autocomplete-answer");
      addedAnswerElement.textContent = answerText;
      var addClickForAnswerElement = function addClickForAnswerElement(event) {
        event.preventDefault();
        var answerChoice = answer.choices[Math.floor(Math.random() * answer.choices.length)];
        addTextAnswerToTextarea(target, answerChoice);
      };
      // when clicked
      addedAnswerElement.addEventListener("click", addClickForAnswerElement);
      addedWrapElement.appendChild(addedAnswerElement);
    };
    for (var i = 0; i < hwAutocompleteAnswers.length; i++) {
      _loop();
    }

    // add close element
    var addedCloseElement = document.createElement("a");
    addedCloseElement.href = "#";
    addedCloseElement.classList.add("added-autocomplete-close");
    addedCloseElement.textContent = "";
    addedCloseElement.title = "Zavřít rychlé odpovědi";
    addedCloseElement.addEventListener("click", function (event) {
      event.preventDefault();
      addedWrapElement.remove();
    });
    addedWrapElement.appendChild(addedCloseElement);
    teacherWrap.appendChild(addedWrapElement);

    // add info about keyboard shortcuts
    // to the closest .hw-md_single__add-comment element
    var addCommentElements = targetDialog.querySelectorAll(".hw-md_single__add-comment");
    for (var _i = 0; _i < addCommentElements.length; _i++) {
      var _addCommentElement$te;
      var addCommentElement = addCommentElements[_i];
      var textContent = (_addCommentElement$te = addCommentElement.textContent) !== null && _addCommentElement$te !== void 0 ? _addCommentElement$te : "";
      if (textContent.includes("Přidat komentář")) {
        addCommentElement.classList.add("added-autocomplete-info");
        addCommentElement.title = "Klávesové zkratky: Ctrl + mezerník pro rychlé odpovědi. Ctrl + Shift + mezerník pro náhodnou zprávu (je nutné předem vše smazat).";
      }
    }
    if (!skipFocus) {
      // set first element as active
      var _firstElement = addedWrapElement.querySelector(".added-autocomplete-answer");
      _firstElement.focus();
    }
  }
}
function keyboardShortcutsForNewModalsBase() {
  return function (event) {
    addKeyboardCtrlAShortcut(event);
    addKeyboardBackspaceShortcut(event);

    // when pressing ctrl+space inside .hw-md_single_teacher__comment
    // add random message to the textarea
    if (event.ctrlKey && event.key === " ") {
      // get textarea from event target
      var target = event.target;

      // if target is textarea
      if (target.classList.contains("hw-md_single_teacher__comment")) {
        // if user also pressed shift key
        if (event.shiftKey) {
          // find closest parent target "md-dialog"
          regenerateMessageOnCtrlShiftSpace(target);
          event.preventDefault();
        } else {
          createAnswersAutocomplete(target);
          event.preventDefault();
        }
      }
    } else if (event.key === " ") {
      // if any .added-autocomplete-answer is focused, then click on it
      focusedElement = document.activeElement;
      if (focusedElement.classList.contains("added-autocomplete-answer")) {
        event.preventDefault();
        focusedElement.click();
      }
      if (focusedElement.classList.contains("added-autocomplete-close")) {
        event.preventDefault();
        focusedElement.click();
      }
    }
  };
}
function addKeyboardShortcutsForNewModals() {
  // Remove the previous event listener if it exists
  if (keyboardShortcutsForNewModals) {
    document.body.removeEventListener("keydown", keyboardShortcutsForNewModals);
  }

  // Create a new instance of the function
  keyboardShortcutsForNewModals = keyboardShortcutsForNewModalsBase();
  document.body.addEventListener("keydown", keyboardShortcutsForNewModalsBase(), {
    once: true
  });
}
function enhanceHomeworksMain() {
  function enhanceMultiHomeworks() {
    var homeworksWrap = document.querySelector(".hw-md_content");
    findAllUnfinishedHomeworksFromModal(homeworksWrap);
    observeIfNewHomeworksAdded(homeworksWrap);
  }
  function enhanceSingleHomework() {
    var homeworksSingleWrap = document.querySelector(".main");
    findAllUnfinishedHomeworksFromSingleModal(homeworksSingleWrap);
    enhanceSingleHomeworkFromModalAfterEvent();
  }
  enhanceMultiHomeworks();
  enhanceSingleHomework();

  // page_picker - add event listener to all buttons
  // - if clicked, remove all attributes alreadyEnhancedHomework
  // and then add them again so it will enhance all homeworks again
  var pagePicker = document.querySelector(".page_picker");
  pagePicker.addEventListener("click", function () {
    // remove all attributes alreadyEnhancedHomework
    var homeworksWrap = document.querySelectorAll("[alreadyEnhancedHomework]");
    homeworksWrap.forEach(function (homework) {
      homework.removeAttribute("alreadyEnhancedHomework");
    });
    enhanceSingleHomework();

    // reset bypass modal
    zipBypassModal = false;
    zipBypassModalFirstRun = true;
  });
}
function homeworkAutomation() {
  try {
    console.log("homeworkAutomation");
    enhanceHomeworksMain();

    // observeHomeworkCountAndUpdateMenu();

    manipulateWithWindowOpen();
    bypassModalWhenRightClicked();
    addKeyboardShortcutsForNewModals();
  } catch (error) {}
}