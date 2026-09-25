import type { JobOffer } from "../types/job";

type JobCompanyLogoSize = "job-card-mobile" | "job-card" | "job-offer";

const sizeClasses: Record<JobCompanyLogoSize, string> = {
  "job-card-mobile": "size-9 text-[10px]",
  "job-card": "size-12 text-xs",
  "job-offer": "size-16 text-sm",
};

export default function JobCompanyLogo({
  job,
  size,
  className = "",
}: {
  job: Pick<JobOffer, "companyLogoUrl" | "initials" | "logoColor">;
  size: JobCompanyLogoSize;
  className?: string;
}) {
  return (
    <span
      className={`relative grid shrink-0 place-items-center overflow-hidden rounded-md font-bold text-white ${sizeClasses[size]} ${className}`}
      style={{ backgroundColor: job.logoColor }}
      aria-hidden="true"
    >
      {job.initials}
      {job.companyLogoUrl && (
        <img
          className="absolute inset-0 size-full object-cover"
          src={job.companyLogoUrl}
          alt=""
          onError={(event) => {
            event.currentTarget.hidden = true;
          }}
        />
      )}
    </span>
  );
}
