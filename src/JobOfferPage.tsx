import ArrowLeftLineIcon from "@iconify-react/majesticons/arrow-left-line";
import ApplicationsLineIcon from "@iconify-react/majesticons/applications-line";
import BriefcaseLineIcon from "@iconify-react/majesticons/briefcase-line";
import ClockLineIcon from "@iconify-react/majesticons/clock-line";
import ExternalLinkLineIcon from "@iconify-react/majesticons/external-link-line";
import LocationMarkerLineIcon from "@iconify-react/majesticons/location-marker-line";
import RefreshLineIcon from "@iconify-react/majesticons/refresh-line";
import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import AppHeader from "./components/AppHeader";
import ApplicantActivitySummary from "./components/ApplicantActivitySummary";
import ApplicationActivity from "./components/ApplicationActivity";
import Button from "./components/Button";
import CommentsSection from "./components/CommentsSection";
import JobSourceBadge from "./components/JobSourceBadge";
import OfferDescription from "./components/OfferDescription";
import OfferSources from "./components/OfferSources";
import { recordSourceClick } from "./lib/sourceTracking";
import Tag from "./components/Tag";
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
            <section className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
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
                    <JobSourceBadge source={job.sourcePlatform} />

                    <h1 className="mt-3 text-2xl font-semibold text-[#18201c] sm:text-3xl">
                      {job.title}
                    </h1>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                      <Tag>{job.category}</Tag>
                      <p className="flex items-center gap-2 text-[#566159]">
                        <BriefcaseLineIcon
                          aria-hidden="true"
                          width="16"
                          height="16"
                        />
                        {job.company}
                      </p>
                    </div>
                  </div>
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
                    className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-[#eaff6a] px-4  font-semibold text-[#173f35] transition hover:bg-[#def258]"
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
            </section>

            <ApplicantActivitySummary job={job} />

            <OfferSources sources={job.sources} />

            <section className="border-b border-[#dfe3dd]">
              <div className="px-4 py-8 sm:px-6 lg:px-8">
                <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-5">
                  <div>
                    <dt className="mt-1text-md text-[#7a847e]">Location</dt>
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
                    <Dt> Work arrangement</Dt>
                    <Dd>
                      <ApplicationsLineIcon
                        aria-hidden="true"
                        width="15"
                        height="15"
                      />
                      {job.workplace} · {job.type}
                    </Dd>
                  </div>
                  <div>
                    <Dt>Published</Dt>
                    <Dd>
                      <ClockLineIcon
                        aria-hidden="true"
                        width="15"
                        height="15"
                      />
                      {job.posted}
                    </Dd>
                  </div>
                  <div>
                    <Dt>Compensation</Dt>
                    <Dd>{job.salary ?? "Not disclosed"}</Dd>
                  </div>
                  <div>
                    <Dt>Last updated</Dt>
                    <Dd>
                      <RefreshLineIcon
                        aria-hidden="true"
                        width="15"
                        height="15"
                      />
                      {job.updated}
                    </Dd>
                  </div>
                </dl>

                <div className="mt-10 flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <Tag key={tag} tag={tag} />
                  ))}
                </div>
              </div>
            </section>
            <OfferDescription job={job} />
            <ApplicationActivity job={job} />
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
