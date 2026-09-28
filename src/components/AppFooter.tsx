import { Link } from "react-router-dom";
import { openCookieConsentEvent } from "../lib/cookieConsent";
import AppLogo from "./AppLogo";

export default function AppFooter() {
  return (
    <footer className="mx-auto max-w-[90rem] border-x border-t border-brandgray-250 bg-brandgray-50">
      <div className="flex flex-col gap-6 px-4 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <AppLogo className="h-6 w-auto shrink-0" />
          <div>
            <p className="text-sm text-brandgray-550">
              Community job offers and clearer hiring signals.
            </p>
          </div>
        </div>

        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-brandgray-700"
        >
          <Link className="hover:text-brand-900" to="/explore">
            Offers
          </Link>
          <Link className="hover:text-brand-900" to="/offers/new">
            Add an offer
          </Link>
          <Link className="hover:text-brand-900" to="/applications">
            My board
          </Link>
          <Link className="hover:text-brand-900" to="/about">
            About
          </Link>
          <Link className="hover:text-brand-900" to="/terms">
            Terms
          </Link>
          <Link className="hover:text-brand-900" to="/privacy">
            Privacy
          </Link>
          <button
            type="button"
            className="font-semibold hover:text-brand-900"
            onClick={() => window.dispatchEvent(new Event(openCookieConsentEvent))}
          >
            Cookie settings
          </button>
        </nav>
      </div>
      <div className="border-t border-brandgray-250 px-4 py-3 text-xs text-brandgray-500 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} MeOrHR. Built for applicants who want a
        clearer picture.
      </div>
    </footer>
  );
}
