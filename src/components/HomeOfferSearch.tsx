import LocationMarkerLineIcon from "@iconify-react/majesticons/location-marker-line";
import PlusLineIcon from "@iconify-react/majesticons/plus-line";
import SearchLineIcon from "@iconify-react/majesticons/search-line";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { JobOffer } from "../types/job";
import JobCompanyLogo from "./JobCompanyLogo";
import Label from "./Label";
import ResponsiveModal from "./ResponsiveModal";

export default function HomeOfferSearch({
  jobOffers,
  isLoading,
}: {
  jobOffers: JobOffer[];
  isLoading: boolean;
}) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const openFromKeyboard = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener("keydown", openFromKeyboard);
    return () => document.removeEventListener("keydown", openFromKeyboard);
  }, []);

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return jobOffers.slice(0, 6);

    return jobOffers
      .filter((job) => searchableOfferValues(job).includes(normalizedQuery))
      .slice(0, 10);
  }, [jobOffers, query]);

  function closeSearch() {
    setIsOpen(false);
    setQuery("");
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="mt-7 flex h-14 w-full max-w-2xl items-center gap-3 rounded-md border border-brandgray-300 bg-white px-4 text-left text-brandgray-500 shadow-[0_1px_2px_rgba(24,32,28,0.05)] transition hover:border-brandgray-450 hover:text-brandgray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-900"
      >
        <SearchLineIcon
          aria-hidden="true"
          width="21"
          height="21"
          className="shrink-0"
        />
        <span className="truncate">Search title, company, location or link</span>
      </button>

      {isOpen && (
        <ResponsiveModal title="Search job offers" onClose={closeSearch}>
          <div className="bg-white">
            <div className="relative border-b border-brandgray-200 px-4 py-4 sm:px-6">
              <Label htmlFor="home-offer-search" className="sr-only">
                Search all job offer details
              </Label>
              <SearchLineIcon
                aria-hidden="true"
                width="21"
                height="21"
                className="pointer-events-none absolute left-7 top-1/2 -translate-y-1/2 text-brandgray-500 sm:left-9"
              />
              <input
                id="home-offer-search"
                type="search"
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Type a title, company, location, technology or URL"
                className="h-12 w-full rounded-md border border-brandgray-300 bg-white pl-11 pr-4 text-lg text-brandgray-900 outline-none transition placeholder:text-brandgray-450 focus:border-brand-700 focus:ring-3 focus:ring-brand-700/10"
              />
            </div>

            <div className="max-h-[60dvh] overflow-y-auto">
              {isLoading ? (
                <div className="space-y-px bg-brandgray-150" aria-label="Searching offers">
                  {[0, 1, 2].map((item) => (
                    <div key={item} className="h-20 animate-pulse bg-white" />
                  ))}
                </div>
              ) : results.length > 0 ? (
                <div className="divide-y divide-brandgray-150">
                  {results.map((job) => (
                    <Link
                      key={job.id}
                      to={`/jobs/${job.id}`}
                      onClick={closeSearch}
                      className="group flex items-center gap-3 px-4 py-4 transition hover:bg-brandgray-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-900 sm:px-6"
                    >
                      <JobCompanyLogo job={job} size="job-card-mobile" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-brandgray-900 group-hover:text-brand-650">
                          {job.title}
                        </p>
                        <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-brandgray-550">
                          <span>{job.company}</span>
                          <span aria-hidden="true">·</span>
                          <span className="inline-flex items-center gap-1">
                            <LocationMarkerLineIcon
                              aria-hidden="true"
                              width="14"
                              height="14"
                            />
                            {job.location}
                          </span>
                        </p>
                        {query.trim() && matchesSourceLink(job, query) && (
                          <p className="mt-1 truncate text-xs text-brandgray-450">
                            {job.sources[0]?.url ?? job.sourceUrl}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : query.trim() ? (
                <div className="px-4 py-12 text-center sm:px-6">
                  <SearchLineIcon
                    aria-hidden="true"
                    width="26"
                    height="26"
                    className="mx-auto text-brandgray-400"
                  />
                  <h3 className="mt-3 font-semibold text-brandgray-900">
                    No matching offers
                  </h3>
                  <p className="mt-1 text-sm text-brandgray-550">
                    This role may not have been shared yet.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      closeSearch();
                      navigate("/offers/new");
                    }}
                    className="mt-5 inline-flex h-10 items-center gap-2 rounded-md bg-lime-300 px-4 font-semibold text-brand-900 transition hover:bg-lime-400"
                  >
                    <PlusLineIcon aria-hidden="true" width="17" height="17" />
                    Add an offer
                  </button>
                </div>
              ) : (
                <p className="px-4 py-10 text-center text-sm text-brandgray-500 sm:px-6">
                  Start typing to search all offer details.
                </p>
              )}
            </div>
          </div>
        </ResponsiveModal>
      )}
    </>
  );
}

function searchableOfferValues(job: JobOffer) {
  return [
    job.title,
    job.company,
    job.location,
    job.workplace,
    job.category,
    job.roleLevel,
    job.type,
    job.salary,
    job.sourceUrl,
    job.sourcePlatform,
    ...job.tags,
    ...job.sources.flatMap((source) => [source.url, source.platform]),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function matchesSourceLink(job: JobOffer, query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  return [job.sourceUrl, ...job.sources.map((source) => source.url)].some(
    (url) => url?.toLowerCase().includes(normalizedQuery),
  );
}
