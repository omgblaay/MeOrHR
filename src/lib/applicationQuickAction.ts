export type ApplicationQuickAction =
  | "applied"
  | "received_reply"
  | "interview"
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
