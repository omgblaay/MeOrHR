export type CookieConsentChoice = "necessary" | "optional";

export const cookieConsentStorageKey = "meorhr-cookie-consent-v1";
export const openCookieConsentEvent = "meorhr:open-cookie-consent";

export function readCookieConsent(): CookieConsentChoice | null {
  const storedChoice = window.localStorage.getItem(cookieConsentStorageKey);
  return storedChoice === "necessary" || storedChoice === "optional"
    ? storedChoice
    : null;
}

export function writeCookieConsent(choice: CookieConsentChoice) {
  window.localStorage.setItem(cookieConsentStorageKey, choice);
}

export function optionalCookiesAllowed() {
  return readCookieConsent() === "optional";
}
