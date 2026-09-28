export type ApplicationQuickAction =
  | "applied"
  | "follow_up"
  | "contacted_hr"
  | "rejected"
  | "linkedin_connection"
  | "received_reply"
  | "interview"
  | "interview_completed"
  | "task_completed"
  | "no_reply_30";

export const applicationQuickActionEvent =
  "jobrater:application-quick-action";

export function triggerApplicationQuickAction(
  jobId: number,
  action: ApplicationQuickAction,
) {
  window.dispatchEvent(
    new CustomEvent(applicationQuickActionEvent, {
      detail: { jobId, action },
    }),
  );
  window.requestAnimationFrame(() => {
    document
      .getElementById("your-application")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}
