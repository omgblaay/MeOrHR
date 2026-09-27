import ApplicationsLineIcon from "@iconify-react/majesticons/applications-line";
import ChevronRightLineIcon from "@iconify-react/majesticons/chevron-right-line";
import ClockLineIcon from "@iconify-react/majesticons/clock-line";
import CloseCircleLineIcon from "@iconify-react/majesticons/close-circle-line";
import LocationMarkerLineIcon from "@iconify-react/majesticons/location-marker-line";
import UsersLineIcon from "@iconify-react/majesticons/users-line";
import { Link, useNavigate } from "react-router-dom";
import JobCategoryBadge from "./components/JobCategoryBadge";
import JobCompanyLogo from "./components/JobCompanyLogo";
import JobCommentCount from "./components/JobCommentCount";
import CountryFlag from "./components/CountryFlag";
import { HiringReach } from "./components/OfferGeography";
import JobSourceBadge from "./components/JobSourceBadge";
import ResponseBar from "./components/ResponseBar";
import TechnologyTag from "./components/TechnologyTag";
import UserApplicationStatus from "./components/UserApplicationStatus";
import type { JobOffer } from "./types/job";

type JobCardProps = {
  job: JobOffer;
  variant?: "default" | "small";
  lastActivity?: string | null;
};

export default function JobCard({
  job,
  variant = "default",
  lastActivity = null,
}: JobCardProps) {
  const navigate = useNavigate();
  const responseRate = Math.min(100, Math.max(0, job.responseRate));
  const openJob = () => navigate(`/jobs/${job.id}`);

  if (variant === "small") {
    return <SmallJobCard job={job} lastActivity={lastActivity} />;
  }

  return (
    <article
      role="link"
      tabIndex={0}
      aria-label={`View ${job.title} at ${job.company}${job.isGone ? ", marked gone" : ""}`}
      onClick={openJob}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openJob();
        }
      }}
      className={`group flex flex-col lg:flex-row relative cursor-pointer border-b border-brandgray-250 transition-colors focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-900 ${
        job.isGone ? "opacity-50" : "bg-white hover:bg-brandgray-25"
      }`}
    >
      <div className="min-w-0 px-4 flex-1 py-5 sm:px-6 flex sm:flex-rowflex-1 gap-8 sm:py-6 lg:px-8">
        <JobCompanyLogo job={job} size="job-card" className="hidden sm:grid" />

        <div className="min-w-0">
          <div className="flex min-w-0  items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
                <JobCompanyLogo
                  job={job}
                  size="job-card-mobile"
                  className="sm:hidden"
                />
                <span className="truncate font-semibold text-brandgray-900">
                  {job.company}
                </span>
                {job.companyCountryCode && (
                  <CountryFlag countryCode={job.companyCountryCode} />
                )}
                <span
                  className="hidden text-brandgray-350 sm:inline"
                  aria-hidden="true"
                >
                  /
                </span>
                <JobSourceBadge source={job.sourcePlatform} />
                {job.isGone && (
                  <span className="inline-flex h-7 items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-2 text-xs font-semibold text-red-700">
                    <CloseCircleLineIcon
                      aria-hidden="true"
                      width="14"
                      height="14"
                    />
                    Gone
                  </span>
                )}
                <UserApplicationStatus jobId={job.id} />
              </div>

              <h2 className="mt-2 text-xl font-semibold leading-snug text-brand-950 sm:text-2xl">
                {job.title}
              </h2>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-brandgray-600">
            <JobCategoryBadge category={job.category} />
            <span className="inline-flex min-w-0 items-center gap-1.5">
              <LocationMarkerLineIcon
                aria-hidden="true"
                width="15"
                height="15"
              />
              <span className="truncate">{job.location}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ApplicationsLineIcon aria-hidden="true" width="15" height="15" />
              {[job.workplace, job.type, job.roleLevel].filter(Boolean).join(" · ")}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {job.salary && (
              <span className="font-semibold text-brand-850">{job.salary}</span>
            )}
          </div>

          <div className="mt-3 text-sm">
            <HiringReach job={job} compact />
          </div>

          <div className="job-type-scrollbar -mr-4 mt-4 flex gap-1.5 overflow-x-auto pr-4 sm:mr-0 flex-wrap sm:gap-2 sm:overflow-visible sm:pr-0">
            {job.tags.map((tag) => (
              <span className="shrink-0" key={tag}>
                <TechnologyTag technology={tag} />
              </span>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between gap-4 text-xs text-brandgray-500 lg:hidden">
            <JobCommentCount jobId={job.id} />
            <span className="flex items-center gap-1.5">
              <ClockLineIcon aria-hidden="true" width="14" height="14" />
              Posted {job.posted}
            </span>
          </div>
        </div>
      </div>

      <aside
        className="grid grid-cols-2 min-w-xs border-t border-brandgray-200 lg:grid-cols-1 lg:border-l lg:border-t-0"
        aria-label="Offer insights"
      >
        <Insight
          icon={<UsersLineIcon aria-hidden="true" width="17" height="17" />}
          value={job.confirmedApplicants}
          label="confirmed applications"
        />
        <div className="min-w-0 border-l border-brandgray-200 px-3 py-4 sm:px-5 lg:border-l-0 lg:px-6">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-brand gray-600">
              Response rate
            </span>
            <strong className="text-sm text-brandgray-900">
              {responseRate}%
            </strong>
          </div>
          <ResponseBar
            responseRate={responseRate}
            className="mt-2 h-4 w-full min-w-14 lg:h-3"
          />
        </div>

        <div className="hidden items-center justify-between gap-4 border-t border-brandgray-200 px-6 py-3 text-xs text-brandgray-500 lg:flex">
          <span className="flex items-center gap-1.5">
            <ClockLineIcon aria-hidden="true" width="14" height="14" />
            Posted {job.posted}
          </span>
          <JobCommentCount jobId={job.id} />
        </div>
      </aside>
      <span className="grid size-8 shrink-0 absolute right-5 top-5 place-items-center text-brandgray-500 transition-transform group-hover:translate-x-1 group-hover:text-brand-900">
        <ChevronRightLineIcon aria-hidden="true" width="20" height="20" />
      </span>
    </article>
  );
}

function SmallJobCard({
  job,
  lastActivity,
}: {
  job: JobOffer;
  lastActivity: string | null;
}) {
  return (
    <Link
      to={`/jobs/${job.id}`}
      aria-label={`View ${job.title} at ${job.company}`}
      className={`group grid gap-3 px-3 py-4 transition-colors focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-900 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-4 ${
        job.isGone
          ? "bg-brandgray-100 hover:bg-brandgray-150"
          : "bg-white hover:bg-brandgray-50"
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <JobCompanyLogo job={job} size="job-card-mobile" />
        <div className="min-w-0">
          <p className="truncate font-semibold text-brandgray-900 transition-colors group-hover:text-brand-650">
            {job.title}
          </p>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-brandgray-550">
            <span className="font-medium text-brandgray-700">
              {job.company}
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex min-w-0 items-center gap-1">
              <LocationMarkerLineIcon
                aria-hidden="true"
                width="13"
                height="13"
              />
              {job.location}
            </span>
            {lastActivity && (
              <>
                <span aria-hidden="true">·</span>
                <span>Updated {formatCompactDate(lastActivity)}</span>
              </>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <UserApplicationStatus jobId={job.id} />
        <ChevronRightLineIcon
          aria-hidden="true"
          width="18"
          height="18"
          className="shrink-0 text-brandgray-400 transition-transform group-hover:translate-x-1 group-hover:text-brandgray-800"
        />
      </div>
    </Link>
  );
}

function formatCompactDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
  }).format(new Date(`${value}T12:00:00`));
}

function Insight({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div className="min-w-0 border-r border-brandgray-200 px-3 py-4 last:border-r-0 sm:px-5 lg:border-b lg:border-r-0 lg:px-6">
      <span className="flex items-center gap-1.5 text-brandgray-700">
        {icon}
        <strong className="text-lg font-semibold text-brandgray-900">
          {value}
        </strong>
      </span>
      <span className="mt-1 block text-xs leading-4 text-brandgray-600">
        {label}
      </span>
    </div>
  );
}
