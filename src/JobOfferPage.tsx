import ArrowLeftLineIcon from "@iconify-react/majesticons/arrow-left-line";
import ApplicationsLineIcon from "@iconify-react/majesticons/applications-line";
import BriefcaseLineIcon from "@iconify-react/majesticons/briefcase-line";
import EditPenLineIcon from "@iconify-react/majesticons/edit-pen-4-line";
import ExternalLinkLineIcon from "@iconify-react/majesticons/external-link-line";
import LocationMarkerLineIcon from "@iconify-react/majesticons/location-marker-line";
import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "./auth/useAuth";
import AppHeader from "./components/AppHeader";
import AppFooter from "./components/AppFooter";
import ApplicantActivitySummary from "./components/ApplicantActivitySummary";
import ApplicationActivity from "./components/ApplicationActivity";
import Button from "./components/Button";
import CommentsSection from "./components/CommentsSection";
import JobCategoryIcon from "./components/JobCategoryIcon";
import JobCompanyLogo from "./components/JobCompanyLogo";
import JobCommentCount from "./components/JobCommentCount";
import JobSourceBadge from "./components/JobSourceBadge";
import OfferDescription from "./components/OfferDescription";
import OfferCommunityFlags from "./components/OfferCommunityFlags";
import OfferPublisher from "./components/OfferPublisher";
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
  const { user } = useAuth();
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
      <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-[90rem] border-x border-brandgray-250 bg-white">
        <div className="border-b border-brandgray-250 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2  font-semibold text-brandgray-700 transition hover:text-brand-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-900"
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
            <div className="h-8 w-2/3 bg-brandgray-150" />
            <div className="mt-5 h-4 w-1/3 bg-brandgray-150" />
            <div className="mt-10 h-40 border-y border-brandgray-150 bg-brandgray-50" />
          </div>
        ) : loadError ? (
          <div className="px-4 py-20 text-center sm:px-6 lg:px-8">
            <h1 className="text-xl font-semibold text-brand-950">
              Couldn&apos;t load this offer
            </h1>
            <p className="mx-auto mt-2 max-w-lg  text-brandgray-550">
              {loadError}
            </p>
            <Button className="mt-6" onClick={onRetry}>
              Try again
            </Button>
          </div>
        ) : !job ? (
          <div className="px-4 py-20 text-center sm:px-6 lg:px-8">
            <h1 className="text-xl font-semibold text-brand-950">
              Offer not found
            </h1>
            <p className="mt-2  text-brandgray-550">
              This offer may have been removed or the link is incorrect.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex  font-semibold text-brand-900 underline underline-offset-4"
            >
              Browse all offers
            </Link>
          </div>
        ) : (
          <>
            <OfferCommunityFlags job={job} />
            <section className="border-b border-brandgray-250 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
              <div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex min-w-0 gap-4 sm:gap-5">
                  <JobCompanyLogo job={job} size="job-offer" />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <JobSourceBadge source={job.sourcePlatform} />
                      <span className="text-brandgray-350" aria-hidden="true">
                        ·
                      </span>
                      <span className="text-sm text-brandgray-550">
                        Posted {job.posted}
                      </span>
                      <span className="text-brandgray-350" aria-hidden="true">
                        ·
                      </span>
                      <span className="text-sm text-brandgray-550">
                        Updated {job.updated}
                      </span>
                      <span className="text-brandgray-350" aria-hidden="true">
                        ·
                      </span>
                      <a
                        href="#discussion"
                        className="text-sm text-brandgray-550 transition hover:text-brand-900"
                      >
                        <JobCommentCount jobId={job.id} />
                      </a>
                    </div>

                    <h1 className="mt-3 text-2xl font-semibold text-brand-950 sm:text-3xl">
                      {job.title}
                    </h1>

                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                      <p className="flex items-center gap-2 text-brandgray-700">
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

                <div className="flex shrink-0 flex-col gap-4 lg:min-w-64 lg:items-end lg:border-l lg:border-brandgray-250 lg:pl-8 lg:text-right">
                  <div>
                    <span className="block text-xs font-medium uppercase text-brandgray-500">
                      Compensation
                    </span>
                    <strong className="mt-1 block max-w-sm text-xl font-semibold leading-snug text-brand-850">
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
                      className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-md bg-lime-300 px-4 font-semibold text-brand-900 transition hover:bg-lime-400 lg:w-auto"
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
                  {user?.id === job.createdBy && (
                    <Link
                      to={`/jobs/${job.id}/edit`}
                      className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-brandgray-300 bg-white px-4 font-semibold text-brandgray-750 transition hover:border-brandgray-450 hover:text-brandgray-900 lg:w-auto"
                    >
                      <EditPenLineIcon
                        aria-hidden="true"
                        width="17"
                        height="17"
                      />
                      Edit offer
                    </Link>
                  )}
                </div>
              </div>
            </section>

            <section className="border-b border-brandgray-250">
              <div className="px-4 sm:px-6 lg:px-8">
                <dl className="grid divide-y divide-brandgray-200 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x [&>div]:py-5 lg:[&>div]:px-6 lg:[&>div:first-child]:pl-0 lg:[&>div:last-child]:pr-0">
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

                <div className="flex flex-wrap items-center gap-10 border-t border-brandgray-200 py-4 text-sm text-brandgray-600">
                  <span className=" text-brandgray-400">Offer lifecycle</span>
                  <LifecyclePoint
                    label="First detected"
                    value={
                      firstSeenAt
                        ? formatLifecycleDate(firstSeenAt)
                        : job.posted
                    }
                  />{" "}
                  <LifecyclePoint
                    label="Last checked"
                    value={
                      lastSeenAt ? formatLifecycleDate(lastSeenAt) : job.updated
                    }
                  />{" "}
                  <LifecyclePoint
                    label={isClosed ? "Closed" : "Active"}
                    value={`${job.sources.length || 1} ${job.sources.length === 1 ? "source" : "sources"}`}
                  />
                </div>
              </div>
            </section>

            <ApplicantActivitySummary job={job} />

            <section className="border-b border-brandgray-250">
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
            <CommentsSection key={job.id} jobId={job.id} />
            <OfferPublisher
              createdBy={job.createdBy}
              createdAt={job.createdAt}
            />
          </>
        )}
      </main>
      <AppFooter />
    </div>
  );
}

function Dd({ children }: { children: ReactNode }) {
  return (
    <dd className="mt-1  flex flex-row gap-1 items-center  font-semibold text-brandgray-900">
      {children}
    </dd>
  );
}

function Dt({ children }: { children: ReactNode }) {
  return (
    <dt className="mt-1 flex flex-row gap-1 items-center text-brandgray-500">
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

function LifecyclePoint({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span>{label}</span>
      <strong className="font-semibold text-brandgray-800">{value}</strong>
    </span>
  );
}
