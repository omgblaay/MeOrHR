import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import {
  openCookieConsentEvent,
  readCookieConsent,
  writeCookieConsent,
  type CookieConsentChoice,
} from "../lib/cookieConsent";

export default function CookieConsent() {
  const [isOpen, setIsOpen] = useState(() => readCookieConsent() === null);

  useEffect(() => {
    const openConsent = () => setIsOpen(true);
    window.addEventListener(openCookieConsentEvent, openConsent);
    return () => window.removeEventListener(openCookieConsentEvent, openConsent);
  }, []);

  function chooseConsent(choice: CookieConsentChoice) {
    writeCookieConsent(choice);
    setIsOpen(false);
  }

  if (!isOpen) return null;

  return (
    <aside
      className="fixed inset-x-0 bottom-0 z-50 border-t border-brandgray-300 bg-white shadow-[0_-8px_30px_rgba(20,34,28,0.12)]"
      aria-label="Cookie consent"
      aria-live="polite"
    >
      <div className="mx-auto flex max-w-[90rem] flex-col gap-5 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="max-w-3xl">
          <h2 className="font-semibold text-brandgray-950">
            Cookies and browser storage
          </h2>
          <p className="mt-1 text-sm leading-6 text-brandgray-600">
            MeOrHR uses essential storage for sign-in, security, and your
            private application tracker. Optional cookies are only allowed
            with your permission. See the{" "}
            <Link
              to="/privacy#browser-storage"
              className="font-semibold text-brand-800 underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        <div className="flex shrink-0 flex-col-reverse gap-2 sm:flex-row">
          <Button
            variant="secondary"
            onClick={() => chooseConsent("necessary")}
          >
            Necessary only
          </Button>
          <Button onClick={() => chooseConsent("optional")}>
            Allow optional
          </Button>
        </div>
      </div>
    </aside>
  );
}
