import ArrowLeftLineIcon from "@iconify-react/majesticons/arrow-left-line";
import ApplicationsLineIcon from "@iconify-react/majesticons/applications-line";
import BriefcaseLineIcon from "@iconify-react/majesticons/briefcase-line";
import EditPenLineIcon from "@iconify-react/majesticons/edit-pen-4-line";
import ExternalLinkLineIcon from "@iconify-react/majesticons/external-link-line";
import LocationMarkerLineIcon from "@iconify-react/majesticons/location-marker-line";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "./auth/useAuth";
import AppHeader from "./components/AppHeader";
import AppFooter from "./components/AppFooter";
import ApplicantActivitySummary from "./components/ApplicantActivitySummary";
import ApplicationActivity from "./components/ApplicationActivity";
import Button from "./components/Button";
import CommentsSection from "./components/CommentsSection";
import JobCompanyLogo from "./components/JobCompanyLogo";
import JobCategoryBadge from "./components/JobCategoryBadge";
import {
  ApplicantCountryPreview,
  OfferHiringContext,
} from "./components/OfferGeography";
import JobCommentCount from "./components/JobCommentCount";
import JobSourceBadge from "./components/JobSourceBadge";
import OfferDescription from "./components/OfferDescription";
import OfferCommunityFlags from "./components/OfferCommunityFlags";
import OfferPublisher from "./components/OfferPublisher";
import TechnologyTag from "./components/TechnologyTag";
import { recordSourceClick } from "./lib/sourceTracking";
import type { JobCategory, JobOffer } from "./types/job";

type JobOfferPageProps = {
  jobOffers: JobOffer[];
  isLoading: boolean;
  loadError: string | null;
  onRetry: () => void;
};

const offerGradientClasses: Record<JobCategory, string> = {
  "AI/ML": "from-amber-100",
  JavaScript: "from-amber-100",
  HTML: "from-red-100",
  PHP: "from-purple-100",
  Ruby: "from-red-100",
  Python: "from-blue-100",
  Java: "from-red-100",
  ".NET": "from-purple-100",
  Scala: "from-red-100",
  C: "from-blue-100",
  Mobile: "from-brand-100",
  Testing: "from-red-50",
  DevOps: "from-blue-100",
  Admin: "from-amber-100",
  "UX/UI": "from-purple-100",
  PM: "from-blue-100",
  Game: "from-purple-100",
  Analytics: "from-amber-100",
  Security: "from-red-100",
  Data: "from-blue-100",
  Go: "from-blue-100",
  Webflow: "from-blue-50",
  Framer: "from-purple-50",
  Support: "from-blue-100",
  ERP: "from-blue-100",
  Architecture: "from-blue-100",
  Other: "from-brandgray-100",
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

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-[90rem] border-x border-brandgray-250 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brandgray-250 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2  font-semibold text-brandgray-700 transition hover:text-brand-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-900"
          >
            <ArrowLeftLineIcon aria-hidden="true" width="18" height="18" />
            Back to offers
          </Link>
          {!isLoading && !loadError && job && (
            <OfferCommunityFlags job={job} compact />
          )}
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
            <section
              id="offer-overview"
              className={`scroll-mt-20 border-b border-brandgray-250 bg-gradient-to-br ${offerGradientClasses[job.category]} via-white/90 to-white px-4 py-8 sm:px-6 sm:py-10 lg:px-8`}
            >
              <div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex min-w-0 gap-4 sm:gap-5">
                  <JobCompanyLogo
                    job={job}
                    size="job-offer"
                    className="mt-1 shadow-sm ring-1 ring-black/5"
                  />
                  <div className="min-w-0">
                    <h1 className="max-w-3xl text-2xl font-semibold leading-tight text-brand-950 sm:text-3xl">
                      {job.title}
                    </h1>
                    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-brandgray-650">
                      <Link
                        to={`/explore?q=${encodeURIComponent(job.company)}`}
                        className="font-semibold text-brandgray-800 transition hover:text-brand-900 hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-900"
                      >
                        {job.company}
                      </Link>
                      <span className="text-brandgray-350" aria-hidden="true">
                        ·
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <LocationMarkerLineIcon
                          aria-hidden="true"
                          width="15"
                          height="15"
                        />
                        {job.location}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <JobCategoryBadge category={job.category} />
                      <span className="text-sm text-brandgray-450">via</span>
                      <JobSourceBadge source={job.sourcePlatform} />
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2 text-sm font-medium text-brandgray-700">
                      <span className="inline-flex h-9 items-center gap-1.5 border border-brandgray-250 bg-white/70 px-3">
                        <ApplicationsLineIcon
                          aria-hidden="true"
                          width="16"
                          height="16"
                        />
                        {job.workplace}
                      </span>
                      <span className="inline-flex h-9 items-center gap-1.5 border border-brandgray-250 bg-white/70 px-3">
                        <BriefcaseLineIcon
                          aria-hidden="true"
                          width="16"
                          height="16"
                        />
                        {job.type}
                      </span>
                      <span className="inline-flex h-9 items-center border border-brandgray-250 bg-white/70 px-3">
                        {job.roleLevel ?? "Level not specified"}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-brandgray-500">
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
                  </div>
                </div>

                <div className="flex shrink-0 flex-col gap-4 lg:min-w-64 lg:items-end lg:border-l lg:border-brandgray-300/70 lg:pl-8 lg:text-right">
                  <div>
                    <span className="block text-xs font-medium uppercase text-brandgray-500">
                      Compensation
                    </span>
                    <strong className="mt-1 block max-w-sm text-xl font-semibold leading-snug text-brand-850">
                      {job.salary ?? "Not disclosed"}
                    </strong>
                  </div>

                  <div className="flex flex-col gap-3">
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
                        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-brandgray-300 bg-white/75 px-4 font-semibold text-brandgray-750 transition hover:border-brandgray-450 hover:bg-white hover:text-brandgray-900 lg:w-auto"
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
              </div>
            </section>

            <OfferSectionNav />
            <section
              id="offer-description"
              className="scroll-mt-16 border-b border-brandgray-250"
            >
              <div className="px-4 py-10 sm:px-6 lg:px-8">
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <TechnologyTag key={tag} technology={tag} />
                  ))}
                </div>
                <OfferDescription job={job} />
              </div>
            </section>
            {/* <OfferSources sources={job.sources} /> */}
            <section
              id="hiring-signals"
              className="scroll-mt-16 border-b border-brandgray-250"
            >
              <div
                className={`grid ${
                  job.applicantCountries.length > 0 ||
                  job.companyCountryCode ||
                  job.hiringRegions.length > 0 ||
                  job.hiringCountryCodes.length > 0
                    ? "lg:grid-cols-[minmax(0,2fr)_minmax(20rem,1fr)]"
                    : ""
                }`}
              >
                <ApplicantActivitySummary job={job} />
                {(job.applicantCountries.length > 0 ||
                  job.companyCountryCode ||
                  job.hiringRegions.length > 0 ||
                  job.hiringCountryCodes.length > 0) && (
                  <div className="border-t border-brandgray-250 px-4 sm:px-6 lg:border-l lg:border-t-0 lg:px-8">
                    <OfferHiringContext job={job} />
                    <ApplicantCountryPreview job={job} />
                  </div>
                )}
              </div>
            </section>
            <ApplicationActivity job={job} />
            <div className="border-b border-brandgray-250">
              <CommentsSection key={job.id} jobId={job.id} />
            </div>
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

const offerSections = [
  { id: "overview", label: "Overview", href: "#offer-overview" },
  { id: "description", label: "Job description", href: "#offer-description" },
  { id: "signals", label: "Hiring signals", href: "#hiring-signals" },
  {
    id: "application",
    label: "Your application",
    href: "#your-application",
  },
  { id: "discussion", label: "Discussion", href: "#discussion" },
];

function OfferSectionNav() {
  const items = offerSections;
  const [activeId, setActiveId] = useState("overview");

  useEffect(() => {
    let animationFrameId: number | null = null;

    const updateActiveSection = () => {
      animationFrameId = null;
      const sections = items.flatMap((item) => {
        const elementId = item.href?.startsWith("#")
          ? item.href.slice(1)
          : null;
        const element = elementId ? document.getElementById(elementId) : null;

        return element ? [{ id: item.id, element }] : [];
      });

      if (!sections.length) return;

      const readingLine = window.innerHeight * 0.28;
      let nextActiveId = sections[0].id;

      for (const section of sections) {
        if (section.element.getBoundingClientRect().top <= readingLine) {
          nextActiveId = section.id;
        } else {
          break;
        }
      }

      const pageBottom = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      if (pageBottom >= documentHeight - 2) {
        nextActiveId = sections.at(-1)?.id ?? nextActiveId;
      }

      setActiveId((currentId) =>
        currentId === nextActiveId ? currentId : nextActiveId,
      );
    };

    const queueUpdate = () => {
      if (animationFrameId === null) {
        animationFrameId = window.requestAnimationFrame(updateActiveSection);
      }
    };

    updateActiveSection();
    window.addEventListener("scroll", queueUpdate, { passive: true });
    window.addEventListener("resize", queueUpdate);

    return () => {
      window.removeEventListener("scroll", queueUpdate);
      window.removeEventListener("resize", queueUpdate);
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [items]);

  return (
    <nav
      aria-label="Job offer sections"
      className="sticky top-0 z-30 border-b border-brandgray-250 bg-white/95 backdrop-blur"
    >
      <div className="job-type-scrollbar flex overflow-x-auto px-4 sm:px-6 lg:px-8">
        {items.map((item) => (
          <a
            key={item.id}
            href={item.href}
            aria-current={activeId === item.id ? "location" : undefined}
            onClick={() => setActiveId(item.id)}
            className={`relative flex h-12 shrink-0 items-center px-3 text-sm font-medium transition first:pl-0 after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 first:after:left-0 ${
              activeId === item.id
                ? "text-brandgray-950 after:bg-brand-700"
                : "text-brandgray-500 after:bg-transparent hover:text-brandgray-850"
            }`}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
