export const applicationStatuses = [
  "saved",
  "applied",
  "in_review",
  "interview",
  "offer",
  "rejected",
  "withdrawn",
] as const;

export type ApplicationStatus = (typeof applicationStatuses)[number];

export const applicationStatusChangedEvent = "jobrater:application-status-changed";

export function applicationStorageKey(userId: string, jobId: number) {
  return `jobrater:application-progress:${userId}:${jobId}`;
}

function isApplicationStatus(value: unknown): value is ApplicationStatus {
  return applicationStatuses.includes(value as ApplicationStatus);
}

export function readApplicationStatus(
  userId: string,
  jobId: number,
): ApplicationStatus | null {
  try {
    const stored = window.localStorage.getItem(
      applicationStorageKey(userId, jobId),
    );
    if (!stored) return null;

    const tracker = JSON.parse(stored) as Record<string, unknown>;
    if (isApplicationStatus(tracker.status)) return tracker.status;

    if (tracker.rejected) return "rejected";
    if (tracker.interview) return "interview";
    if (tracker.replied) return "in_review";
    if (tracker.applied) return "applied";
    return tracker.saved ? "saved" : null;
  } catch {
    return null;
  }
}

export function notifyApplicationStatusChanged(
  userId: string,
  jobId: number,
) {
  window.dispatchEvent(
    new CustomEvent(applicationStatusChangedEvent, {
      detail: { userId, jobId },
    }),
  );
}
