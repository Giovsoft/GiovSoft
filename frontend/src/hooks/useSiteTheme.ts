import { useEffect, useState } from "react";
import { cookieConsentKey, cookieConsentUpdatedEvent } from "../components/CookieConsent";

function canStorePreference() {
  try {
    return JSON.parse(window.localStorage.getItem(cookieConsentKey) || "null")?.preferences === true;
  } catch {
    return false;
  }
}

export function useSiteTheme() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const storedTheme = window.localStorage.getItem("site-theme");

    return storedTheme === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    if (canStorePreference()) window.localStorage.setItem("site-theme", theme);
  }, [theme]);

  useEffect(() => {
    const syncPreference = () => {
      if (canStorePreference()) window.localStorage.setItem("site-theme", theme);
      else window.localStorage.removeItem("site-theme");
    };
    window.addEventListener(cookieConsentUpdatedEvent, syncPreference);
    return () => window.removeEventListener(cookieConsentUpdatedEvent, syncPreference);
  }, [theme]);

  const isDark = theme === "dark";

  const toggleTheme = () => {
    const nextTheme = isDark ? "light" : "dark";
    const transitionDocument = document as Document & {
      startViewTransition?: (callback: () => void) => void;
    };

    if (transitionDocument.startViewTransition) {
      transitionDocument.startViewTransition(() => setTheme(nextTheme));
      return;
    }

    setTheme(nextTheme);
  };

  return { isDark, toggleTheme };
}
