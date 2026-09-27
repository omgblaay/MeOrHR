import BriefcaseIcon from "@iconify-react/majesticons/briefcase";
import { Link } from "react-router-dom";

export default function AppFooter() {
  return (
    <footer className="mx-auto max-w-[90rem] border-x border-t border-brandgray-250 bg-brandgray-50">
      <div className="flex flex-col gap-6 px-4 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="grid size-8 place-items-center rounded-md bg-brand-900 text-white">
            <BriefcaseIcon aria-hidden="true" width="17" height="17" />
          </span>
          <div>
            <p className="font-semibold text-brandgray-900">MeOrHR</p>
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
          <Link className="hover:text-brand-900" to="/terms">
            Terms
          </Link>
          <Link className="hover:text-brand-900" to="/privacy">
            Privacy
          </Link>
        </nav>
      </div>
      <div className="border-t border-brandgray-250 px-4 py-3 text-xs text-brandgray-500 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} MeOrHR. Built for applicants who want a
        clearer picture.
      </div>
    </footer>
  );
}
