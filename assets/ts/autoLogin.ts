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
export function autoLogin() {
  setTimeout(function () {
    try {
      // automatic login
      const buttonLogin = document.querySelector(
        "button.mat-primary"
      ) as HTMLButtonElement;

      // main logic
      (async () => {
        const cred = await fetchCred();

        const username = document.querySelector(
          "[formcontrolname='email']"
        ) as HTMLInputElement;
        const password = document.querySelector(
          "[formcontrolname='password']"
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
              buttonLogin.click();
            }, 400);
          }, 0);
        }
      })();
    } catch (error) {}
  }, 2000);
}

export function onLogout() {
  try {
    const userMenuButton = document.querySelector(
      "app-header .header__right > button:has(mat-icon)"
    ) as HTMLButtonElement;

    if (!userMenuButton) return;

    userMenuButton.addEventListener("click", () => {
      setTimeout(() => {
        const logoutButtonIcon = document.querySelector(
          "[data-mat-icon-name='logout']"
        ) as HTMLElement | null;

        // Přidáme kontrolu, zda logoutButtonIcon existuje
        if (logoutButtonIcon && logoutButtonIcon.parentElement) {
          const logoutButton =
            logoutButtonIcon.parentElement as HTMLButtonElement;

          logoutButton.addEventListener("click", async () => {
            await preventSilentAccess();
          });
        } else {
          console.error("Tlačítko pro odhlášení nebylo nalezeno");
        }
      }, 400);
    });
  } catch (error) {
    console.error("Chyba při nastavování odhlašovací funkce:", error);
  }
}
