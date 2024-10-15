// TODO: possible future rework to use scopes of angular, more here: https://jsfiddle.net/e7gw3Lm8/

// simple debounce
export function debounce(func: Function, timeout: number = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

// clicks on target mouse position
// i.e. used when clicking outside custom selects when automating stuff
export function clickOnPosition(x: number, y: number) {
  const ev = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
    screenX: x,
    screenY: y,
  });

  const el = document.elementFromPoint(x, y) as HTMLElement;
  el.dispatchEvent(ev);
}

// show and hide loader programatically
export function showLoader() {
  const loader = document.querySelector("loading .loader") as HTMLElement;
  loader.classList.remove("ng-hide");
}

export function hideLoader() {
  const loader = document.querySelector("loading .loader") as HTMLElement;
  loader.classList.add("ng-hide");
}

// loading observer with debounce,
// solving issue with catching angular loading times
export function runLoadingObserver(func: Function) {
  const targetNode = document.querySelector("loading .loader") as HTMLElement;
  const config = { attributes: true };

  const debounceObserver = debounce(() => func());

  const observer = new MutationObserver(function (mutations) {
    for (let mutation of mutations) {
      if (mutation.type === "attributes") {
        if (mutation.attributeName === "data-ng-animate") {
          debounceObserver();
        }
      }
    }
  });

  observer.observe(targetNode, config);
}

// ability to override event listeners via trap function for logging all "add listener calls"
// for example used in multiple esc listeners when modals are open

export function trapAddEventListeners() {
  (function () {
    let target = EventTarget.prototype;
    let functionName = "addEventListener";
    let func = target[functionName];

    let symbolHidden = Symbol("hidden");

    function hidden(instance) {
      try {
        if (instance === undefined) return null;

        if (instance[symbolHidden] === undefined) {
          let area = {};
          instance[symbolHidden] = area;
          return area;
        }
        return instance[symbolHidden];
      } catch (error) {
        console.error("Error in hidden function", error);
        return null;
      }
    }

    function listenersFrom(instance) {
      let area = hidden(instance);
      if (area == null || area.listeners === undefined) {
        return [];
      }
      return area.listeners;
    }

    target[functionName] = function (type, listener) {
      let listeners = listenersFrom(this);

      listeners.push({ type, listener });

      func.apply(this, [type, listener]);
    };

    target["removeEventListeners"] = function (targetType) {
      let self = this;

      let listeners = listenersFrom(this);
      let removed = [];

      listeners.forEach((item) => {
        let type = item.type;
        let listener = item.listener;

        if (type == targetType) {
          self.removeEventListener(type, listener);
        }
      });
    };
  })();
}
