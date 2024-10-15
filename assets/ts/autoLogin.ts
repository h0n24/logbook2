const PC = globalThis.PasswordCredential;
export const storeCred = async (creds: {
  id: string;
  password: string;
}): Promise<Credential | null> => {
  // check if PasswordCredential is supported by this browser.
  if (PC) {
    const cred = new PC(creds);
    // @ts-ignore custom chrome extension
    return navigator.credentials.store(cred);
  } else {
    return null;
  }
};

export const fetchCred = async (): Promise<Credential | null> => {
  // check if PasswordCredential is supported by this browser.
  if (PC) {
    // alert("before signin");
    return navigator.credentials.get({
      password: true,
    } as any);
  } else {
    return null;
  }
};

export const preventSilentAccess = async (): Promise<void | null> => {
  // check if PasswordCredential is supported by this browser.
  if (PC) {
    return navigator.credentials.preventSilentAccess();
  } else {
    return null;
  }
};

// automatically login
export function autoLogin(state) {
  setTimeout(function () {
    try {
      if (state !== "login") return;

      const languages = document.querySelectorAll(".lang-item");

      languages.forEach((language) => {
        const liElement = language as HTMLLIElement;
        const aElement = liElement.querySelector("a") as HTMLAnchorElement;
        const foundLanguage = liElement.innerText.toLowerCase();

        // skip other languages
        if (foundLanguage !== navigator.language) return;

        // skip if already active
        if (aElement.classList.contains("active")) return;

        aElement.click();
      });

      // automatic login

      const buttonLogin = document.querySelector(
        ".btn-login"
      ) as HTMLButtonElement;
      const buttonLoginSpan = buttonLogin.querySelector(
        "span"
      ) as HTMLSpanElement;
      buttonLoginSpan.textContent = "Přihlásit";

      // main logic
      (async () => {
        const cred = await fetchCred();

        const username = document.querySelector("#login") as HTMLInputElement;
        const password = document.querySelector(
          "#password"
        ) as HTMLInputElement;

        if (cred) {
          setTimeout(() => {
            username.value = cred.id;
            // @ts-ignore custom chrome extension
            password.value = cred.password;

            let event = new Event("input", { bubbles: true });
            username.dispatchEvent(event);
            password.dispatchEvent(event);

            // wait for angular to load
            setTimeout(() => {
              // alert("automatické přihlášení?");
              buttonLogin.click();
            }, 400);
          }, 0);
        }
      })();
    } catch (error) {}
  }, 2000);
}

export function onLogout(state) {
  try {
    if (state === "login") return;

    const logoutButton = document.querySelector(
      "[ng-click='clearLocalStorage()']"
    ) as HTMLButtonElement;

    // on click
    logoutButton.addEventListener("click", async () => {
      // prevent silent access
      await preventSilentAccess();
    });
  } catch (error) {}
}
