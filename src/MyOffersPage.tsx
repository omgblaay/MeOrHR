import ArrowLeftLineIcon from "@iconify-react/majesticons/arrow-left-line";
import BriefcaseLineIcon from "@iconify-react/majesticons/briefcase-line";
import CalendarLineIcon from "@iconify-react/majesticons/calendar-line";
import EditPenLineIcon from "@iconify-react/majesticons/edit-pen-4-line";
import LocationMarkerLineIcon from "@iconify-react/majesticons/location-marker-line";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "./auth/useAuth";
import AppFooter from "./components/AppFooter";
import AppHeader from "./components/AppHeader";
import type { JobOffer } from "./types/job";

export default function MyOffersPage({
  jobOffers,
  isLoading,
}: {
  jobOffers: JobOffer[];
  isLoading: boolean;
}) {
  const { user, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen">
        <AppHeader />
        <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-[90rem] animate-pulse border-x border-brandgray-250 bg-brandgray-50" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: "/my-offers" }} />;
  }

  const publishedOffers = jobOffers.filter(
    (offer) => offer.createdBy === user.id,
  );

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-[90rem] border-x border-brandgray-250 bg-white">
        <header className="border-b border-brandgray-250 bg-brandgray-50 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-semibold text-brandgray-700 transition hover:text-brandgray-900"
          >
            <ArrowLeftLineIcon aria-hidden="true" width="18" height="18" />
            Back to all offers
          </Link>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-brand-500">
                Your contributions
              </p>
              <h1 className="mt-1 text-2xl font-semibold text-brand-950 sm:text-3xl">
                Published job offers
              </h1>
            </div>
            <Link
              to="/offers/new"
              className="inline-flex h-10 items-center gap-2 rounded-md bg-lime-300 px-4 font-semibold text-brand-900 transition hover:bg-lime-400"
            >
              <BriefcaseLineIcon aria-hidden="true" width="17" height="17" />
              Add an offer
            </Link>
          </div>
        </header>

        {isLoading ? (
          <div
            className="space-y-px bg-brandgray-200"
            aria-label="Loading offers"
          >
            {[0, 1, 2].map((item) => (
              <div key={item} className="h-24 animate-pulse bg-white" />
            ))}
          </div>
        ) : publishedOffers.length > 0 ? (
          <div className="divide-y divide-brandgray-200">
            {publishedOffers.map((offer) => (
              <article
                key={offer.id}
                className="grid gap-4 px-4 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-6 lg:px-8"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-brandgray-550">
                    {offer.company}
                  </p>
                  <Link
                    to={`/jobs/${offer.id}`}
                    className="mt-1 block truncate text-lg font-semibold text-brandgray-900 hover:text-brand-650"
                  >
                    {offer.title}
                  </Link>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-brandgray-500">
                    <span className="inline-flex items-center gap-1.5">
                      <LocationMarkerLineIcon
                        aria-hidden="true"
                        width="14"
                        height="14"
                      />
                      {offer.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarLineIcon
                        aria-hidden="true"
                        width="14"
                        height="14"
                      />
                      Published {formatPublishedDate(offer.createdAt)}
                    </span>
                  </div>
                </div>
                <Link
                  to={`/jobs/${offer.id}/edit`}
                  className="inline-flex h-9 w-fit items-center gap-2 rounded-md border border-brandgray-300 bg-white px-3 font-semibold text-brandgray-750 transition hover:border-brandgray-450 hover:text-brandgray-900"
                >
                  <EditPenLineIcon aria-hidden="true" width="16" height="16" />
                  Edit
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="px-4 py-20 text-center sm:px-6 lg:px-8">
            <BriefcaseLineIcon
              aria-hidden="true"
              width="28"
              height="28"
              className="mx-auto text-brandgray-400"
            />
            <h2 className="mt-3 text-lg font-semibold text-brandgray-900">
              No published offers yet
            </h2>
            <p className="mt-1 text-brandgray-550">
              Offers you add to JobRater will appear here.
            </p>
          </div>
        )}
      </main>
      <AppFooter />
    </div>
  );
}

function formatPublishedDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
