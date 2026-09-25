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

export const applicationStatusLabels: Record<ApplicationStatus, string> = {
  saved: "Saved",
  applied: "Applied",
  in_review: "In review",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

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

const statusEventTypes: Record<ApplicationStatus, string> = {
  saved: "saved",
  applied: "applied",
  in_review: "in_review",
  interview: "interview_invited",
  offer: "offer_received",
  rejected: "rejected",
  withdrawn: "withdrawn",
};

export function updateApplicationStatus(
  userId: string,
  jobId: number,
  status: ApplicationStatus,
) {
  const storageKey = applicationStorageKey(userId, jobId);
  let tracker: Record<string, unknown> = {};

  try {
    const stored = window.localStorage.getItem(storageKey);
    if (stored) tracker = JSON.parse(stored) as Record<string, unknown>;
  } catch {
    tracker = {};
  }

  if (tracker.status === status) return;

  const events = Array.isArray(tracker.events) ? [...tracker.events] : [];
  events.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type: statusEventTypes[status],
    date: new Date().toISOString().slice(0, 10),
    note: "Status updated from application board",
  });

  window.localStorage.setItem(
    storageKey,
    JSON.stringify({ ...tracker, status, events }),
  );
  notifyApplicationStatusChanged(userId, jobId);
}

export function readApplicationLastActivity(userId: string, jobId: number) {
  try {
    const stored = window.localStorage.getItem(
      applicationStorageKey(userId, jobId),
    );
    if (!stored) return null;

    const tracker = JSON.parse(stored) as { events?: { date?: string }[] };
    const dates = (tracker.events ?? [])
      .map((event) => event.date)
      .filter((date): date is string => Boolean(date))
      .sort((a, b) => b.localeCompare(a));
    return dates[0] ?? null;
  } catch {
    return null;
  }
}
