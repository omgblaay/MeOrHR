import ApplicationsLineIcon from "@iconify-react/majesticons/applications-line";
import ClipboardListLineIcon from "@iconify-react/majesticons/clipboard-list-line";
import ClockLineIcon from "@iconify-react/majesticons/clock-line";
import CloseCircleLineIcon from "@iconify-react/majesticons/close-circle-line";
import LinkLineIcon from "@iconify-react/majesticons/link-line";
import MailLineIcon from "@iconify-react/majesticons/mail-line";
import MessageLineIcon from "@iconify-react/majesticons/message-line";
import UserLineIcon from "@iconify-react/majesticons/user-line";
import UserGroupLineIcon from "@iconify-react/majesticons/user-group-line";
import {
  useCallback,
  useMemo,
  useSyncExternalStore,
  type ComponentType,
} from "react";
import { useAuth } from "../auth/useAuth";
import {
  applicationStatusChangedEvent,
  applicationStorageKey,
} from "../lib/applicationStatus";
import type { JobOffer } from "../types/job";

type StageIcon = ComponentType<{
  "aria-hidden"?: boolean | "true" | "false";
  width?: string;
  height?: string;
}>;

type StatusRow = {
  label: string;
  count: number | null;
  total: number;
  icon: StageIcon;
  color: string;
  surface: string;
  eventTypes: string[];
};

function percentage(count: number, total: number) {
  return total > 0 ? Math.round((count / total) * 100) : 0;
}

export default function ApplicantActivitySummary({ job }: { job: JobOffer }) {
  const { user } = useAuth();
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (!user) return () => undefined;

      const handleStatusChange = (event: Event) => {
        const detail = (event as CustomEvent<{ userId: string; jobId: number }>)
          .detail;
        if (detail.userId === user.id && detail.jobId === job.id) {
          onStoreChange();
        }
      };
      const handleStorage = (event: StorageEvent) => {
        if (event.key === applicationStorageKey(user.id, job.id)) {
          onStoreChange();
        }
      };

      window.addEventListener(
        applicationStatusChangedEvent,
        handleStatusChange,
      );
      window.addEventListener("storage", handleStorage);
      return () => {
        window.removeEventListener(
          applicationStatusChangedEvent,
          handleStatusChange,
        );
        window.removeEventListener("storage", handleStorage);
      };
    },
    [job.id, user],
  );
  const getSnapshot = useCallback(
    () =>
      user
        ? window.localStorage.getItem(applicationStorageKey(user.id, job.id))
        : null,
    [job.id, user],
  );
  const trackerJson = useSyncExternalStore(subscribe, getSnapshot, () => null);
  const myEventTypes = useMemo(() => {
    if (!trackerJson) return new Set<string>();

    try {
      const tracker = JSON.parse(trackerJson) as {
        events?: { type?: unknown }[];
      };
      return new Set(
        (tracker.events ?? [])
          .map((event) => event.type)
          .filter((type): type is string => typeof type === "string"),
      );
    } catch {
      return new Set<string>();
    }
  }, [trackerJson]);
  const includesMyApplication = myEventTypes.has("applied");
  const confirmedApplications =
    job.confirmedApplicants + (includesMyApplication ? 1 : 0);
  const includesMyNoReply = myEventTypes.has("no_reply_30");
  const matureApplications =
    job.applicantsOlderThan30Days + (includesMyNoReply ? 1 : 0);
  const statuses: StatusRow[] = [
    {
      label: "Applied",
      count: job.confirmedApplicants,
      total: confirmedApplications,
      icon: ApplicationsLineIcon,
      color: "var(--color-blue-500)",
      surface: "var(--color-blue-50)",
      eventTypes: ["applied"],
    },
    {
      label: "Sent a follow-up",
      count: job.additionalEmailApplicants,
      total: confirmedApplications,
      icon: MailLineIcon,
      color: "var(--color-brand-500)",
      surface: "var(--color-brand-50)",
      eventTypes: ["follow_up"],
    },
    {
      label: "Contacted HR",
      count: job.contactedHrApplicants,
      total: confirmedApplications,
      icon: UserLineIcon,
      color: "var(--color-blue-600)",
      surface: "var(--color-blue-50)",
      eventTypes: ["contacted_hr"],
    },
    {
      label: "Connected on LinkedIn",
      count: job.linkedinConnectionApplicants,
      total: confirmedApplications,
      icon: LinkLineIcon,
      color: "var(--color-blue-500)",
      surface: "var(--color-blue-50)",
      eventTypes: ["linkedin_connection"],
    },
    {
      label: "Received a reply",
      count: job.repliedApplicants,
      total: confirmedApplications,
      icon: MessageLineIcon,
      color: "var(--color-amber-500)",
      surface: "var(--color-amber-50)",
      eventTypes: ["received_reply"],
    },
    {
      label: "Invited to interview",
      count: job.nextInterviewApplicants,
      total: confirmedApplications,
      icon: UserGroupLineIcon,
      color: "var(--color-purple-500)",
      surface: "var(--color-purple-50)",
      eventTypes: ["interview_invited"],
    },
    {
      label: "Completed an interview",
      count: null,
      total: confirmedApplications,
      icon: ApplicationsLineIcon,
      color: "var(--color-purple-500)",
      surface: "var(--color-purple-50)",
      eventTypes: ["interview_completed"],
    },
    {
      label: "Completed a task",
      count: null,
      total: confirmedApplications,
      icon: ClipboardListLineIcon,
      color: "var(--color-orange-400)",
      surface: "var(--color-amber-50)",
      eventTypes: ["task_completed"],
    },
    {
      label: "Got rejected",
      count: null,
      total: confirmedApplications,
      icon: CloseCircleLineIcon,
      color: "var(--color-red-500)",
      surface: "var(--color-red-50)",
      eventTypes: ["rejected"],
    },
    {
      label: "No reply after 30 days",
      count: job.noReplyAfter30DaysApplicants,
      total: matureApplications,
      icon: ClockLineIcon,
      color: "var(--color-red-500)",
      surface: "var(--color-red-50)",
      eventTypes: ["no_reply_30"],
    },
  ];

  return (
    <aside
      className="bg-brandgray-25 px-4 py-8 sm:px-6 lg:px-8"
      aria-labelledby="recruitment-pipeline-heading"
    >
      <h3
        id="recruitment-pipeline-heading"
        className="font-semibold text-brandgray-900"
      >
        Applicant activity
      </h3>
      <p className="mt-1 text-sm text-brandgray-550">
        From {confirmedApplications} confirmed{" "}
        {confirmedApplications === 1 ? "application" : "applications"}
        {includesMyApplication ? ", including you" : ""}
      </p>

      <ol className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
        {statuses.map((status) => {
          const Icon = status.icon;
          const includesMyInput = status.eventTypes.some((eventType) =>
            myEventTypes.has(eventType),
          );
          const displayedCount =
            status.count === null
              ? includesMyInput
                ? 1
                : null
              : status.count + (includesMyInput ? 1 : 0);
          const statusPercentage = percentage(
            displayedCount ?? 0,
            status.total,
          );
          const hasData = displayedCount !== null && status.total > 0;

          return (
            <li key={status.label}>
              <div className="flex items-center gap-3">
                <span
                  className="grid size-8 shrink-0 place-items-center rounded-full"
                  style={{
                    backgroundColor: status.surface,
                    color: status.color,
                  }}
                >
                  <Icon aria-hidden="true" width="16" height="16" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate font-medium text-brandgray-800">
                      {status.label}
                      {includesMyInput && (
                        <span className="ml-2 text-xs font-semibold text-brand-700">
                          You
                        </span>
                      )}
                    </span>
                    <span className="shrink-0 text-xs font-semibold text-brandgray-700">
                      {hasData
                        ? `${displayedCount} · ${statusPercentage}%`
                        : includesMyInput
                          ? "You"
                          : "No data"}
                    </span>
                  </span>
                  <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-brandgray-200">
                    <span
                      className="block h-full rounded-full transition-[width] duration-300"
                      style={{
                        backgroundColor: status.color,
                        width: `${hasData ? statusPercentage : 0}%`,
                      }}
                    />
                  </span>
                </span>
              </div>
            </li>
          );
        })}
      </ol>

      <p className="mt-6 text-xs leading-5 text-brandgray-500">
        Your contributions are included anonymously and marked here for you.
      </p>
    </aside>
  );
}
