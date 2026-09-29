import { useEffect } from "react";
import {
  cookieConsentChangedEvent,
  optionalCookiesAllowed,
  type CookieConsentChoice,
} from "../lib/cookieConsent";
import {
  clearHotjarBrowserData,
  hotjarIsLoaded,
  loadHotjar,
} from "../lib/hotjar";

export default function HotjarTracking() {
  useEffect(() => {
    if (optionalCookiesAllowed()) loadHotjar();

    const updateTracking = (event: Event) => {
      const choice = (event as CustomEvent<CookieConsentChoice>).detail;

      if (choice === "optional") {
        loadHotjar();
        return;
      }

      const shouldReload = hotjarIsLoaded();
      clearHotjarBrowserData();
      if (shouldReload) window.location.reload();
    };

    window.addEventListener(cookieConsentChangedEvent, updateTracking);
    return () =>
      window.removeEventListener(cookieConsentChangedEvent, updateTracking);
  }, []);

  return null;
}
