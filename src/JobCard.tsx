import ApplicationsLineIcon from "@iconify-react/majesticons/applications-line";
import ChevronRightLineIcon from "@iconify-react/majesticons/chevron-right-line";
import ClockLineIcon from "@iconify-react/majesticons/clock-line";
import CloseCircleLineIcon from "@iconify-react/majesticons/close-circle-line";
import LocationMarkerLineIcon from "@iconify-react/majesticons/location-marker-line";
import UsersLineIcon from "@iconify-react/majesticons/users-line";
import { useNavigate } from "react-router-dom";
import JobCategoryBadge from "./components/JobCategoryBadge";
import JobCompanyLogo from "./components/JobCompanyLogo";
import JobCommentCount from "./components/JobCommentCount";
import JobSourceBadge from "./components/JobSourceBadge";
import ResponseBar from "./components/ResponseBar";
import TechnologyTag from "./components/TechnologyTag";
import UserApplicationStatus from "./components/UserApplicationStatus";
import type { JobOffer } from "./types/job";

export default function JobCard({ job }: { job: JobOffer }) {
  const navigate = useNavigate();
  const responseRate = Math.min(100, Math.max(0, job.responseRate));
  const openJob = () => navigate(`/jobs/${job.id}`);

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
      className={`group relative cursor-pointer border-b border-brandgray-250 transition-colors focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-900 ${
        job.isGone
          ? "bg-brandgray-100 hover:bg-brandgray-150"
          : "bg-white hover:bg-brandgray-25"
      }`}
    >
      <div className="grid lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="min-w-0 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
          <div className="flex items-start gap-3 sm:gap-4">
            <JobCompanyLogo
              job={job}
              size="job-card"
              className="hidden sm:grid"
            />

            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 items-start justify-between gap-3">
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

                <span className="grid size-8 shrink-0 place-items-center text-brandgray-500 transition-transform group-hover:translate-x-1 group-hover:text-brand-900">
                  <ChevronRightLineIcon
                    aria-hidden="true"
                    width="20"
                    height="20"
                  />
                </span>
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
                  <ApplicationsLineIcon
                    aria-hidden="true"
                    width="15"
                    height="15"
                  />
                  {job.workplace} · {job.type}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                {job.salary && (
                  <span className="font-semibold text-brand-850">
                    {job.salary}
                  </span>
                )}
              </div>

              <div className="job-type-scrollbar -mr-4 mt-4 flex gap-1.5 overflow-x-auto pr-4 sm:mr-0 flex-wrap sm:gap-2 sm:overflow-visible sm:pr-0">
                {job.tags.map((tag) => (
                  <span className="shrink-0" key={tag}>
                    <TechnologyTag technology={tag} />
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between gap-4 text-xs text-brandgray-500 lg:hidden">
                <span className="flex items-center gap-1.5">
                  <ClockLineIcon aria-hidden="true" width="14" height="14" />
                  Posted {job.posted}
                </span>
                <JobCommentCount jobId={job.id} />
              </div>
            </div>
          </div>
        </div>

        <aside
          className="grid grid-cols-2 border-t border-brandgray-200 bg-brandgray-25 lg:grid-cols-1 lg:border-l lg:border-t-0"
          aria-label="Offer insights"
        >
          <Insight
            icon={<UsersLineIcon aria-hidden="true" width="17" height="17" />}
            value={job.confirmedApplicants}
            label="confirmed applications"
          />
          <div className="min-w-0 border-l border-brandgray-200 px-3 py-4 sm:px-5 lg:border-l-0 lg:px-6">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-brandgray-600">
                Response rate
              </span>
              <strong className="hidden text-sm text-brandgray-900 sm:block">
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
      </div>
    </article>
  );
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
