import ApplicationsLineIcon from "@iconify-react/majesticons/applications-line";
import ChevronRightLineIcon from "@iconify-react/majesticons/chevron-right-line";
import ClockLineIcon from "@iconify-react/majesticons/clock-line";
import LocationMarkerLineIcon from "@iconify-react/majesticons/location-marker-line";
import UsersLineIcon from "@iconify-react/majesticons/users-line";
import { useNavigate } from "react-router-dom";
import JobCategoryIcon from "./components/JobCategoryIcon";
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
      aria-label={`View ${job.title} at ${job.company}`}
      onClick={openJob}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openJob();
        }
      }}
      className="group relative cursor-pointer border-b border-[#dfe3dd] bg-white transition-colors hover:bg-[#f9fbf8] focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#173f35]"
    >
      <div className="grid lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="min-w-0 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
          <div className="flex items-start gap-3 sm:gap-4">
            <div
              className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-md text-xs font-bold text-white sm:size-12"
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

            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
                    <span className="truncate font-semibold text-[#27322c]">
                      {job.company}
                    </span>
                    <span
                      className="hidden text-[#c3c9c4] sm:inline"
                      aria-hidden="true"
                    >
                      /
                    </span>
                    <JobSourceBadge source={job.sourcePlatform} />
                    <UserApplicationStatus jobId={job.id} />
                  </div>

                  <h2 className="mt-2 text-xl font-semibold leading-snug text-[#18201c] sm:text-2xl">
                    {job.title}
                  </h2>
                </div>

                <span className="grid size-8 shrink-0 place-items-center text-[#7a847e] transition-transform group-hover:translate-x-1 group-hover:text-[#173f35]">
                  <ChevronRightLineIcon
                    aria-hidden="true"
                    width="20"
                    height="20"
                  />
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-[#667169]">
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
                  <span className="font-semibold text-[#244a3d]">
                    {job.salary}
                  </span>
                )}
                <span className="inline-flex h-7 items-center gap-1.5 rounded-md border border-[#dbe3dc] bg-[#f5f8f5] px-2 text-xs font-semibold text-[#405d52]">
                  <JobCategoryIcon
                    category={job.category}
                    size={14}
                    className="size-5"
                  />
                  {job.category}
                </span>
              </div>

              <div className="job-type-scrollbar -mr-4 mt-4 flex gap-1.5 overflow-x-auto pr-4 sm:mr-0 sm:flex-wrap sm:gap-2 sm:overflow-visible sm:pr-0">
                {job.tags.map((tag) => (
                  <span className="shrink-0" key={tag}>
                    <TechnologyTag technology={tag} />
                  </span>
                ))}
              </div>

              <span className="mt-4 flex items-center gap-1.5 text-xs text-[#78827b] lg:hidden">
                <ClockLineIcon aria-hidden="true" width="14" height="14" />
                Posted {job.posted}
              </span>
            </div>
          </div>
        </div>

        <aside
          className="grid grid-cols-2 border-t border-[#e3e7e3] bg-[#fbfcfa] lg:grid-cols-1 lg:border-l lg:border-t-0"
          aria-label="Offer insights"
        >
          <Insight
            icon={<UsersLineIcon aria-hidden="true" width="17" height="17" />}
            value={job.confirmedApplicants}
            label="confirmed applications"
          />
          <div className="min-w-0 border-l border-[#e3e7e3] px-3 py-4 sm:px-5 lg:border-l-0 lg:px-6">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-[#667169]">
                Response rate
              </span>
              <strong className="hidden text-sm text-[#27322c] sm:block">
                {responseRate}%
              </strong>
            </div>
            <ResponseBar
              responseRate={responseRate}
              className="mt-2 h-4 w-full min-w-14 lg:h-3"
            />
          </div>

          <span className="hidden items-center gap-1.5 border-t border-[#e3e7e3] px-6 py-3 text-xs text-[#78827b] lg:flex">
            <ClockLineIcon aria-hidden="true" width="14" height="14" />
            Posted {job.posted}
          </span>
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
    <div className="min-w-0 border-r border-[#e3e7e3] px-3 py-4 last:border-r-0 sm:px-5 lg:border-b lg:border-r-0 lg:px-6">
      <span className="flex items-center gap-1.5 text-[#526058]">
        {icon}
        <strong className="text-lg font-semibold text-[#27322c]">
          {value}
        </strong>
      </span>
      <span className="mt-1 block text-xs leading-4 text-[#667169]">
        {label}
      </span>
    </div>
  );
}
