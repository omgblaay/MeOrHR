import ApplicationsLineIcon from "@iconify-react/majesticons/applications-line";
import BriefcaseLineIcon from "@iconify-react/majesticons/briefcase-line";
import ChevronRightLineIcon from "@iconify-react/majesticons/chevron-right-line";
import ClockLineIcon from "@iconify-react/majesticons/clock-line";
import LocationMarkerLineIcon from "@iconify-react/majesticons/location-marker-line";
import UsersLineIcon from "@iconify-react/majesticons/users-line";
import ExternalLinkLineIcon from "@iconify-react/majesticons/external-link-line";
import { useNavigate } from "react-router-dom";
import Tag from "./components/Tag";
import ResponseBar from "./components/ResponseBar";
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
      className="group cursor-pointer border-b border-slate-200 bg-white px-4 py-4 transition-all duration-300 hover:bg-[#fafcfa] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#173f35] sm:px-6 sm:py-5 sm:hover:scale-99 lg:px-8"
    >
      <div className="flex gap-3 sm:gap-5">
        <div
          className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-md text-xs font-bold text-white sm:size-12"
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
          <div className="flex items-start justify-between gap-2 sm:gap-3">
            <div className="min-w-0">
              <div className="mb-1.5 flex min-w-0 items-center gap-2 text-sm sm:mb-2 sm:flex-wrap sm:gap-4 sm:text-base">
                <span className="flex min-w-0 items-center gap-1 font-medium sm:font-normal">
                  <BriefcaseLineIcon
                    className="hidden sm:block"
                    aria-hidden="true"
                    width="14"
                    height="14"
                  />
                  <span className="truncate">{job.company}</span>
                </span>
                <span className="hidden items-center gap-1 sm:flex">
                  <LocationMarkerLineIcon
                    aria-hidden="true"
                    width="15"
                    height="15"
                  />
                  {job.location}
                </span>
                <span className="hidden items-center gap-1 sm:flex">
                  <ApplicationsLineIcon
                    aria-hidden="true"
                    width="15"
                    height="15"
                  />
                  {job.workplace} · {job.type}
                </span>
              </div>

              <div className="mb-2 sm:flex sm:items-start sm:gap-2">
                <span className="hidden sm:inline-flex">
                  <Tag tag="">{job.category}</Tag>
                </span>
                <h2 className="text-lg font-semibold leading-snug text-[#1c201d] sm:truncate sm:text-xl">
                  {job.title}
                </h2>
              </div>
            </div>

            <span className="grid size-7 shrink-0 place-items-center text-[#7a847e] transition group-hover:translate-x-0.5 group-hover:text-[#173f35] sm:size-9">
              <ChevronRightLineIcon aria-hidden="true" width="19" height="19" />
            </span>
          </div>

          {job.salary && (
            <span className="block text-sm font-semibold text-[#32453d] sm:text-base sm:font-medium">
              {job.salary}
            </span>
          )}

          <div className="mt-2 flex items-center gap-x-3 gap-y-1 text-xs text-[#667169] sm:hidden">
            <span className="flex min-w-0 items-center gap-1">
              <LocationMarkerLineIcon aria-hidden="true" width="14" height="14" />
              <span className="truncate">{job.location}</span>
            </span>
            <span className="shrink-0">{job.workplace} · {job.type}</span>
          </div>

          <div className="job-type-scrollbar -mr-4 mt-3 flex gap-1.5 overflow-x-auto pr-4 sm:mr-0 sm:mt-4 sm:flex-wrap sm:gap-2 sm:overflow-visible sm:pr-0">
            <span className="shrink-0 sm:hidden">
              <Tag tag="">{job.category}</Tag>
            </span>
            {job.tags.map((tag) => (
              <span className="shrink-0" key={tag}>
                <Tag tag={tag} />
              </span>
            ))}
          </div>

          <div className="mt-3 border-t border-[#edf0ec] pt-3 sm:mt-4 sm:flex sm:items-center sm:justify-between sm:gap-3 sm:pt-4">
            <div className="grid grid-cols-3 divide-x divide-[#edf0ec] text-xs sm:flex sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-2 sm:divide-x-0">
              <span className="flex min-w-0 flex-col gap-1 pr-2 sm:flex-row sm:items-center sm:gap-1.5 sm:pr-0">
                <UsersLineIcon aria-hidden="true" width="15" height="15" />
                <span>
                  <strong>{job.confirmedApplicants}</strong>{" "}
                  <span className="text-[#667169] sm:hidden">applied</span>
                  <span className="hidden sm:inline">confirmed applications</span>
                </span>
              </span>
              <span className="flex min-w-0 flex-col gap-1 px-2 sm:flex-row sm:items-center sm:gap-1.5 sm:px-0">
                <ExternalLinkLineIcon
                  aria-hidden="true"
                  width="15"
                  height="15"
                />
                <span>
                  <strong className="font-semibold text-[#1c201d]">{job.sourceClicks}</strong>{" "}
                  <span className="text-[#667169]">clicks</span>
                  <span className="hidden sm:inline"> source</span>
                </span>
              </span>
              <div className="flex min-w-0 flex-col gap-1 pl-2 sm:flex-row sm:items-center sm:gap-2.5 sm:pl-0">
                <span className="text-[#667169] sm:text-[#1c201d]">Response</span>
                <ResponseBar
                  responseRate={responseRate}
                  className="h-4 w-full min-w-14 sm:w-28"
                />
              </div>
            </div>
            <span className="mt-3 flex items-center gap-1.5 text-xs text-[#667169] sm:mt-0 sm:text-[#1c201d]">
              <ClockLineIcon aria-hidden="true" width="14" height="14" />
              {job.posted}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
