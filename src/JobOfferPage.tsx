import ArrowLeftLineIcon from "@iconify-react/majesticons/arrow-left-line";
import ApplicationsLineIcon from "@iconify-react/majesticons/applications-line";
import BriefcaseLineIcon from "@iconify-react/majesticons/briefcase-line";
import ExternalLinkLineIcon from "@iconify-react/majesticons/external-link-line";
import LocationMarkerLineIcon from "@iconify-react/majesticons/location-marker-line";
import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import AppHeader from "./components/AppHeader";
import ApplicantActivitySummary from "./components/ApplicantActivitySummary";
import ApplicationActivity from "./components/ApplicationActivity";
import Button from "./components/Button";
import CommentsSection from "./components/CommentsSection";
import JobCategoryIcon from "./components/JobCategoryIcon";
import JobSourceBadge from "./components/JobSourceBadge";
import OfferDescription from "./components/OfferDescription";
import OfferSources from "./components/OfferSources";
import TechnologyTag from "./components/TechnologyTag";
import UserApplicationStatus from "./components/UserApplicationStatus";
import { recordSourceClick } from "./lib/sourceTracking";
import type { JobOffer } from "./types/job";

type JobOfferPageProps = {
  jobOffers: JobOffer[];
  isLoading: boolean;
  loadError: string | null;
  onRetry: () => void;
};

export default function JobOfferPage({
  jobOffers,
  isLoading,
  loadError,
  onRetry,
}: JobOfferPageProps) {
  const { jobId } = useParams();
  const job = jobOffers.find((offer) => offer.id === Number(jobId));

  const firstSeenAt = job?.sources.length
    ? [...job.sources]
        .map((source) => source.firstSeenAt)
        .sort((first, second) => first.localeCompare(second))[0]
    : null;
  const lastSeenAt = job?.sources.length
    ? [...job.sources]
        .map((source) => source.lastSeenAt)
        .sort((first, second) => second.localeCompare(first))[0]
    : null;
  const isClosed = Boolean(
    job?.sources.length && job.sources.every((source) => source.closedAt),
  );

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-6xl border-x border-[#dfe3dd] bg-white">
        <div className="border-b border-[#dfe3dd] px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2  font-semibold text-[#526058] transition hover:text-[#173f35] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#173f35]"
          >
            <ArrowLeftLineIcon aria-hidden="true" width="18" height="18" />
            Back to offers
          </Link>
        </div>

        {isLoading ? (
          <div
            className="animate-pulse px-4 py-10 sm:px-6 lg:px-8"
            aria-label="Loading job offer"
          >
            <div className="h-8 w-2/3 bg-[#edf0ec]" />
            <div className="mt-5 h-4 w-1/3 bg-[#edf0ec]" />
            <div className="mt-10 h-40 border-y border-[#edf0ec] bg-[#f7f9f6]" />
          </div>
        ) : loadError ? (
          <div className="px-4 py-20 text-center sm:px-6 lg:px-8">
            <h1 className="text-xl font-semibold text-[#18201c]">
              Couldn&apos;t load this offer
            </h1>
            <p className="mx-auto mt-2 max-w-lg  text-[#707b74]">{loadError}</p>
            <Button className="mt-6" onClick={onRetry}>
              Try again
            </Button>
          </div>
        ) : !job ? (
          <div className="px-4 py-20 text-center sm:px-6 lg:px-8">
            <h1 className="text-xl font-semibold text-[#18201c]">
              Offer not found
            </h1>
            <p className="mt-2  text-[#707b74]">
              This offer may have been removed or the link is incorrect.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex  font-semibold text-[#173f35] underline underline-offset-4"
            >
              Browse all offers
            </Link>
          </div>
        ) : (
          <>
            <section className="border-b border-[#dfe3dd] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
              <div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex min-w-0 gap-4 sm:gap-5">
                  <div
                    className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-md  font-bold text-white sm:size-16"
                    style={{ backgroundColor: job.logoColor }}
                    aria-hidden="true"
                  >
                    {job.companyLogoUrl ? (
                      <img
                        className="size-full object-cover"
                        src={job.companyLogoUrl}
                        alt=""
                      />
                    ) : (
                      job.initials
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <JobSourceBadge source={job.sourcePlatform} />
                      <span className="text-[#c1c8c2]" aria-hidden="true">
                        ·
                      </span>
                      <span className="text-sm text-[#707b74]">
                        Posted {job.posted}
                      </span>
                      <span className="text-[#c1c8c2]" aria-hidden="true">
                        ·
                      </span>
                      <span className="text-sm text-[#707b74]">
                        Updated {job.updated}
                      </span>
                    </div>

                    <h1 className="mt-3 text-2xl font-semibold text-[#18201c] sm:text-3xl">
                      {job.title}
                    </h1>

                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                      <p className="flex items-center gap-2 text-[#566159]">
                        <BriefcaseLineIcon
                          aria-hidden="true"
                          width="16"
                          height="16"
                        />
                        {job.company}
                      </p>
                      <UserApplicationStatus jobId={job.id} />
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col gap-4 lg:min-w-64 lg:items-end lg:border-l lg:border-[#e0e5e0] lg:pl-8 lg:text-right">
                  <div>
                    <span className="block text-xs font-medium uppercase text-[#7a847e]">
                      Compensation
                    </span>
                    <strong className="mt-1 block max-w-sm text-xl font-semibold leading-snug text-[#244a3d]">
                      {job.salary ?? "Not disclosed"}
                    </strong>
                  </div>

                  {(job.sources[0]?.url ?? job.sourceUrl) ? (
                    <a
                      href={job.sources[0]?.url ?? job.sourceUrl ?? undefined}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => {
                        const source = job.sources[0];
                        if (source) recordSourceClick(source.id);
                      }}
                      className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-md bg-[#eaff6a] px-4 font-semibold text-[#173f35] transition hover:bg-[#def258] lg:w-auto"
                    >
                      View original offer
                      <ExternalLinkLineIcon
                        aria-hidden="true"
                        width="17"
                        height="17"
                      />
                    </a>
                  ) : (
                    <Button disabled>Source unavailable</Button>
                  )}
                </div>
              </div>
            </section>

            <section className="border-b border-[#dfe3dd]">
              <div className="px-4 sm:px-6 lg:px-8">
                <dl className="grid divide-y divide-[#e4e8e4] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x [&>div]:py-5 lg:[&>div]:px-6 lg:[&>div:first-child]:pl-0 lg:[&>div:last-child]:pr-0">
                  <div>
                    <Dt>Location</Dt>
                    <Dd>
                      <LocationMarkerLineIcon
                        aria-hidden="true"
                        width="15"
                        height="15"
                      />
                      {job.location}
                    </Dd>
                  </div>
                  <div>
                    <Dt>Work model</Dt>
                    <Dd>
                      <ApplicationsLineIcon
                        aria-hidden="true"
                        width="15"
                        height="15"
                      />
                      {job.workplace}
                    </Dd>
                  </div>
                  <div>
                    <Dt>Contract</Dt>
                    <Dd>
                      <BriefcaseLineIcon
                        aria-hidden="true"
                        width="15"
                        height="15"
                      />
                      {job.type}
                    </Dd>
                  </div>
                  <div>
                    <Dt>Category</Dt>
                    <Dd>
                      <JobCategoryIcon
                        category={job.category}
                        size={17}
                        className="size-7"
                      />
                      {job.category}
                    </Dd>
                  </div>
                </dl>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-[#e4e8e4] py-4 text-sm text-[#667169]">
                  <span className="font-semibold text-[#405048]">
                    Offer lifecycle
                  </span>
                  <LifecyclePoint
                    label="First detected"
                    value={
                      firstSeenAt
                        ? formatLifecycleDate(firstSeenAt)
                        : job.posted
                    }
                  />
                  <LifecyclePoint
                    label="Last checked"
                    value={
                      lastSeenAt ? formatLifecycleDate(lastSeenAt) : job.updated
                    }
                  />
                  <LifecyclePoint
                    label={isClosed ? "Closed" : "Active"}
                    value={`${job.sources.length || 1} ${job.sources.length === 1 ? "source" : "sources"}`}
                    active={!isClosed}
                  />
                </div>
              </div>
            </section>

            <ApplicantActivitySummary job={job} />

            <section className="border-b border-[#dfe3dd]">
              <div className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-5 flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <TechnologyTag key={tag} technology={tag} />
                  ))}
                </div>
                <OfferDescription job={job} />
              </div>
            </section>
            <ApplicationActivity job={job} />
            <OfferSources sources={job.sources} />
            <CommentsSection />
          </>
        )}
      </main>
    </div>
  );
}

function Dd({ children }: { children: ReactNode }) {
  return (
    <dd className="mt-1  flex flex-row gap-1 items-center  font-semibold text-[#27322c]">
      {children}
    </dd>
  );
}

function Dt({ children }: { children: ReactNode }) {
  return (
    <dt className="mt-1 flex flex-row gap-1 items-center text-[#7a847e]">
      {children}
    </dt>
  );
}

function formatLifecycleDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year:
      new Date(value).getFullYear() === new Date().getFullYear()
        ? undefined
        : "numeric",
  }).format(new Date(value));
}

function LifecyclePoint({
  label,
  value,
  active = false,
}: {
  label: string;
  value: string;
  active?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`size-1.5 rounded-full ${active ? "bg-[#278b63]" : "bg-[#a7b0a9]"}`}
        aria-hidden="true"
      />
      <span>{label}</span>
      <strong className="font-semibold text-[#405048]">{value}</strong>
    </span>
  );
}
