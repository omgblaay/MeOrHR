import ApplicationsLineIcon from "@iconify-react/majesticons/applications-line";
import CheckCircleLineIcon from "@iconify-react/majesticons/check-circle-line";
import ClockLineIcon from "@iconify-react/majesticons/clock-line";
import MessageLineIcon from "@iconify-react/majesticons/message-line";
import UserGroupLineIcon from "@iconify-react/majesticons/user-group-line";
import type { ComponentType } from "react";
import type { JobOffer } from "../types/job";

type StageIcon = ComponentType<{
  "aria-hidden"?: boolean | "true" | "false";
  width?: string;
  height?: string;
}>;

type FunnelStage = {
  label: string;
  count: number;
  medianDays: number | null;
  timingLabel: string;
  icon: StageIcon;
  color: string;
  surface: string;
};

function percentage(count: number, total: number) {
  return total > 0 ? Math.round((count / total) * 100) : 0;
}

function medianLabel(days: number | null, label: string) {
  if (days === null) return "Not enough data";
  return `Median ${days} ${days === 1 ? "day" : "days"} ${label}`;
}

export default function ApplicantActivitySummary({ job }: { job: JobOffer }) {
  const stages: FunnelStage[] = [
    {
      label: "Applications",
      count: job.confirmedApplicants,
      medianDays: null,
      timingLabel: "",
      icon: ApplicationsLineIcon,
      color: "#3568d4",
      surface: "#f2f6ff",
    },
    {
      label: "Replies",
      count: job.repliedApplicants,
      medianDays: job.medianDaysToReply,
      timingLabel: "to reply",
      icon: MessageLineIcon,
      color: "#ad7217",
      surface: "#fff8e8",
    },
    {
      label: "Interviews",
      count: job.nextInterviewApplicants,
      medianDays: job.medianDaysReplyToInterview,
      timingLabel: "after reply",
      icon: UserGroupLineIcon,
      color: "#79529a",
      surface: "#f8f1fc",
    },
    {
      label: "Offers",
      count: job.offerApplicants,
      medianDays: job.medianDaysInterviewToOffer,
      timingLabel: "after interview",
      icon: CheckCircleLineIcon,
      color: "#278b63",
      surface: "#edf8f2",
    },
  ];

  return (
    <section
      className="border-y border-[#dfe3dd] bg-[#fbfcfa]"
      aria-labelledby="recruitment-pipeline-heading"
    >
      <div className="flex flex-col gap-1 px-4 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-6 lg:px-8">
        <div>
          <h2
            id="recruitment-pipeline-heading"
            className="font-semibold text-[#27322c]"
          >
            Recruitment pipeline
          </h2>
          <p className="mt-1 text-sm text-[#707b74]">
            Anonymous outcomes from {job.confirmedApplicants} confirmed{" "}
            {job.confirmedApplicants === 1 ? "application" : "applications"}
          </p>
        </div>
        <span className="text-xs text-[#7a847e]">
          Percentages use confirmed applications
        </span>
      </div>

      <div className="job-type-scrollbar overflow-x-auto border-t border-[#dfe3dd]">
        <ol className="grid min-w-[46rem] grid-cols-4 sm:min-w-0">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const stagePercentage =
              index === 0
                ? 100
                : percentage(stage.count, job.confirmedApplicants);

            return (
              <li
                key={stage.label}
                className="relative border-r border-[#dfe3dd] px-4 py-5 last:border-r-0 sm:px-5 lg:px-6"
              >
                <div className="relative flex items-center gap-3">
                  <span
                    className="relative z-10 grid size-9 shrink-0 place-items-center rounded-full border border-white shadow-[0_0_0_1px_#d9dfda]"
                    style={{
                      backgroundColor: stage.surface,
                      color: stage.color,
                    }}
                  >
                    <Icon aria-hidden="true" width="18" height="18" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-medium text-[#667169]">
                      {stage.label}
                    </span>
                    <span className="flex items-baseline gap-1.5">
                      <strong className="text-xl font-semibold text-[#27322c]">
                        {stage.count}
                      </strong>
                      <span
                        className="text-xs font-semibold"
                        style={{ color: stage.color }}
                      >
                        {stagePercentage}%
                      </span>
                    </span>
                  </span>
                </div>

                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#e5e9e5]">
                  <span
                    className="block h-full rounded-full"
                    style={{
                      backgroundColor: stage.color,
                      width: `${stagePercentage}%`,
                    }}
                  />
                </div>

                <span className="mt-3 flex items-center gap-1.5 text-xs text-[#707b74]">
                  {index === 0 ? (
                    "Starting point"
                  ) : (
                    <>
                      <ClockLineIcon
                        aria-hidden="true"
                        width="14"
                        height="14"
                      />
                      {medianLabel(stage.medianDays, stage.timingLabel)}
                    </>
                  )}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
