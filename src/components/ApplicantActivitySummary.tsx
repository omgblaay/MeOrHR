import ApplicationsLineIcon from "@iconify-react/majesticons/applications-line";
import ClockLineIcon from "@iconify-react/majesticons/clock-line";
import MessageLineIcon from "@iconify-react/majesticons/message-line";
import UserGroupLineIcon from "@iconify-react/majesticons/user-group-line";
import type { ComponentType } from "react";
import {
  triggerApplicationQuickAction,
  type ApplicationQuickAction,
} from "../lib/applicationQuickAction";
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
  action: ApplicationQuickAction;
  actionLabel: string;
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
      color: "var(--color-blue-500)",
      surface: "var(--color-blue-50)",
      action: "applied",
      actionLabel: "I applied",
    },
    {
      label: "Replies",
      count: job.repliedApplicants,
      medianDays: job.medianDaysToReply,
      timingLabel: "to reply",
      icon: MessageLineIcon,
      color: "var(--color-amber-500)",
      surface: "var(--color-amber-50)",
      action: "received_reply",
      actionLabel: "I received a reply",
    },
    {
      label: "Interviews",
      count: job.nextInterviewApplicants,
      medianDays: job.medianDaysReplyToInterview,
      timingLabel: "after reply",
      icon: UserGroupLineIcon,
      color: "var(--color-purple-500)",
      surface: "var(--color-purple-50)",
      action: "interview",
      actionLabel: "I was invited",
    },
  ];
  const matureApplications = job.applicantsOlderThan30Days;
  const noReplyPercentage = percentage(
    job.noReplyAfter30DaysApplicants,
    matureApplications,
  );

  return (
    <section
      className="border-b border-brandgray-250 bg-brandgray-25"
      aria-labelledby="recruitment-pipeline-heading"
    >
      <div className="flex flex-col gap-1 px-4 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-6 lg:px-8">
        <div>
          <h2
            id="recruitment-pipeline-heading"
            className="font-semibold text-brandgray-900"
          >
            Recruitment pipeline
          </h2>
          <p className="mt-1 text-sm text-brandgray-550">
            Anonymous outcomes from {job.confirmedApplicants} confirmed{" "}
            {job.confirmedApplicants === 1 ? "application" : "applications"}
          </p>
        </div>
        <span className="text-xs text-brandgray-500">
          Stage percentages use confirmed applications
        </span>
      </div>

      <div className="job-type-scrollbar overflow-x-auto border-t border-brandgray-250">
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
                className="relative border-r border-brandgray-250 last:border-r-0"
              >
                <button
                  type="button"
                  className="h-full w-full px-4 py-5 text-left transition-colors hover:bg-white focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-900 sm:px-5 lg:px-6"
                  onClick={() =>
                    triggerApplicationQuickAction(job.id, stage.action)
                  }
                  aria-label={`${stage.actionLabel} for ${job.title}`}
                >
                <div className="relative flex items-center gap-3">
                  <span
                    className="relative z-10 grid size-9 shrink-0 place-items-center rounded-full border border-white shadow-[0_0_0_1px_var(--color-brandgray-250)]"
                    style={{
                      backgroundColor: stage.surface,
                      color: stage.color,
                    }}
                  >
                    <Icon aria-hidden="true" width="18" height="18" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-medium text-brandgray-600">
                      {stage.label}
                    </span>
                    <span className="flex items-baseline gap-1.5">
                      <strong className="text-xl font-semibold text-brandgray-900">
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

                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-brandgray-200">
                  <span
                    className="block h-full rounded-full"
                    style={{
                      backgroundColor: stage.color,
                      width: `${stagePercentage}%`,
                    }}
                  />
                </div>

                <span className="mt-3 flex items-center gap-1.5 text-xs text-brandgray-550">
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
                <span
                  className="mt-3 block text-xs font-semibold"
                  style={{ color: stage.color }}
                >
                  {stage.actionLabel} →
                </span>
                </button>
              </li>
            );
          })}

          <li className="relative bg-brandgray-25">
            <button
              type="button"
              className="h-full w-full px-4 py-5 text-left transition-colors hover:bg-red-50 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-red-800 sm:px-5 lg:px-6"
              onClick={() =>
                triggerApplicationQuickAction(job.id, "no_reply_30")
              }
              aria-label={`Still no reply after 30 days for ${job.title}`}
            >
            <div className="relative flex items-center gap-3">
              <span className="relative z-10 grid size-9 shrink-0 place-items-center rounded-full border border-white bg-red-50 text-red-500 shadow-[0_0_0_1px_var(--color-red-200)]">
                <ClockLineIcon aria-hidden="true" width="18" height="18" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-medium text-brandgray-600">
                  No reply after 30 days
                </span>
                <span className="flex items-baseline gap-1.5">
                  <strong className="text-xl font-semibold text-brandgray-900">
                    {matureApplications > 0
                      ? job.noReplyAfter30DaysApplicants
                      : "—"}
                  </strong>
                  {matureApplications > 0 && (
                    <span className="text-xs font-semibold text-red-500">
                      {noReplyPercentage}%
                    </span>
                  )}
                </span>
              </span>
            </div>

            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-brandgray-200">
              <span
                className="block h-full rounded-full bg-red-500"
                style={{
                  width: `${matureApplications > 0 ? noReplyPercentage : 0}%`,
                }}
              />
            </div>

            <span className="mt-3 flex items-center gap-1.5 text-xs text-brandgray-550">
              {matureApplications > 0
                ? `${matureApplications} ${matureApplications === 1 ? "application" : "applications"} reached 30 days`
                : "No applications have reached 30 days yet"}
            </span>
            <span className="mt-3 block text-xs font-semibold text-red-500">
              Still no reply →
            </span>
            </button>
          </li>
        </ol>
      </div>
    </section>
  );
}
