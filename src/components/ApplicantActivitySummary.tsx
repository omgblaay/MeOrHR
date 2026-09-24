import ApplicationsLineIcon from "@iconify-react/majesticons/applications-line";
import ArrowRightCircleLineIcon from "@iconify-react/majesticons/arrow-right-circle-line";
import LinkLineIcon from "@iconify-react/majesticons/link-line";
import MailLineIcon from "@iconify-react/majesticons/mail-line";
import MessageLineIcon from "@iconify-react/majesticons/message-line";
import UserLineIcon from "@iconify-react/majesticons/user-line";
import type { JobOffer } from "../types/job";

export default function ApplicantActivitySummary({ job }: { job: JobOffer }) {
  const percentageOfApplicants = (value: number) =>
    job.confirmedApplicants > 0
      ? Math.round((value / job.confirmedApplicants) * 100)
      : 0;

  const metrics = [
    {
      label: "Applied",
      value: job.confirmedApplicants,
      count: job.confirmedApplicants,
      icon: ApplicationsLineIcon,
      isPercentage: false,
    },
    {
      label: "Received a reply",
      value: percentageOfApplicants(job.repliedApplicants),
      count: job.repliedApplicants,
      icon: MessageLineIcon,
      isPercentage: true,
    },
    {
      label: "Next interview step",
      value: percentageOfApplicants(job.nextInterviewApplicants),
      count: job.nextInterviewApplicants,
      icon: ArrowRightCircleLineIcon,
      isPercentage: true,
    },
    {
      label: "Contacted HR",
      value: percentageOfApplicants(job.contactedHrApplicants),
      count: job.contactedHrApplicants,
      icon: UserLineIcon,
      isPercentage: true,
    },
    {
      label: "LinkedIn connection",
      value: percentageOfApplicants(job.linkedinConnectionApplicants),
      count: job.linkedinConnectionApplicants,
      icon: LinkLineIcon,
      isPercentage: true,
    },
    {
      label: "Additional email",
      value: percentageOfApplicants(job.additionalEmailApplicants),
      count: job.additionalEmailApplicants,
      icon: MailLineIcon,
      isPercentage: true,
    },
  ];

  return (
    <section
      className="border-y border-gray-200"
      aria-labelledby="applicant-activity-heading"
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <h2
            id="applicant-activity-heading"
            className=" font-semibold uppercase text-[#667069]"
          >
            Applicants activity
          </h2>
        </div>
      </div>

      <dl
        className="job-type-scrollbar flex overflow-x-auto border-t border-gray-300"
        aria-label="Applicant activity percentages"
      >
        {metrics.map((metric) => {
          const MetricIcon = metric.icon;

          return (
            <div
              key={metric.label}
              className="min-w-40 bg-[#f7f8f8] flex-1 border-r border-gray-300 px-4 py-4 last:border-r-0 sm:px-5"
            >
              <dt className="flex items-center gap-2 text-gray-600">
                <span className="">{metric.label}</span>
              </dt>
              <dd className="mt-1 text-lg font-semibold flex items-center gap-2 text-[#27322c]">
                <MetricIcon
                  aria-hidden="true"
                  width="16"
                  height="16"
                  className="shrink-0 text-[#278b63]"
                />
                {metric.count}
                {metric.isPercentage && (
                  <span
                    className="font-normal text-[#707b74]"
                    aria-label={`${metric.count} applicants`}
                  >
                    {metric.value}
                    {metric.isPercentage && "%"}
                  </span>
                )}
              </dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
