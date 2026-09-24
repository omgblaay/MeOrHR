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
      className="group cursor-pointer border-b border-slate-200 bg-white px-4 py-5 transition-all duration-300 hover:scale-99 hover:bg-[#fafcfa] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#173f35] sm:px-6 lg:px-8"
    >
      <div className="flex gap-3.5 sm:gap-5">
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
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap gap-4  mb-2">
                <span className="flex gap-1 items-center">
                  <BriefcaseLineIcon
                    aria-hidden="true"
                    width="14"
                    height="14"
                  />
                  {job.company}
                </span>
                <span className="flex gap-1 items-center">
                  <LocationMarkerLineIcon
                    aria-hidden="true"
                    width="15"
                    height="15"
                  />
                  {job.location}
                </span>
                <span className="flex gap-1 items-center">
                  <ApplicationsLineIcon
                    aria-hidden="true"
                    width="15"
                    height="15"
                  />
                  {job.workplace} · {job.type}
                </span>
              </div>

              <span className="flex items-start gap-2 mb-2">
                {" "}
                <Tag tag="">{job.category}</Tag>
                <h2 className="truncate text-xl font-semibold">{job.title}</h2>
              </span>
            </div>

            <span className="grid size-9 shrink-0 place-items-center text-[#7a847e] transition group-hover:translate-x-0.5 group-hover:text-[#173f35]">
              <ChevronRightLineIcon aria-hidden="true" width="19" height="19" />
            </span>
          </div>

          {job.salary && (
            <span className="font-medium text-[#32453d]">{job.salary}</span>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            {job.tags.map((tag) => (
              <Tag key={tag} tag={tag} />
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-3 border-t border-[#edf0ec] pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs ">
              <span className="flex items-center gap-1.5">
                <UsersLineIcon aria-hidden="true" width="15" height="15" />
                <strong>{job.confirmedApplicants} </strong>confirmed
                applications
              </span>
              <span className="flex items-center gap-1.5">
                <ExternalLinkLineIcon
                  aria-hidden="true"
                  width="15"
                  height="15"
                />
                {job.sourceClicks} source clicks
              </span>
              <div className="flex items-center gap-2.5">
                Response rate: <ResponseBar responseRate={responseRate} />
              </div>
            </div>
            <span className="flex items-center gap-1.5 text-xs">
              <ClockLineIcon aria-hidden="true" width="14" height="14" />
              {job.posted}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
