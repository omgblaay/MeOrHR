import ApplicationsLineIcon from "@iconify-react/majesticons/applications-line";
import BookmarkLineIcon from "@iconify-react/majesticons/bookmark-line";
import CheckCircleLineIcon from "@iconify-react/majesticons/check-circle-line";
import ClockLineIcon from "@iconify-react/majesticons/clock-line";
import CloseCircleLineIcon from "@iconify-react/majesticons/close-circle-line";
import DoorExitLineIcon from "@iconify-react/majesticons/door-exit-line";
import UserGroupLineIcon from "@iconify-react/majesticons/user-group-line";
import UserLineIcon from "@iconify-react/majesticons/user-line";
import { useCallback, useSyncExternalStore, type ComponentType } from "react";
import { useAuth } from "../auth/useAuth";
import {
  applicationStatusChangedEvent,
  applicationStorageKey,
  readApplicationStatus,
  type ApplicationStatus,
} from "../lib/applicationStatus";

type StatusIcon = ComponentType<{
  "aria-hidden"?: boolean | "true" | "false";
  width?: string;
  height?: string;
}>;

const statusPresentation: Record<
  ApplicationStatus,
  { label: string; icon: StatusIcon; classes: string }
> = {
  saved: {
    label: "Saved",
    icon: BookmarkLineIcon,
    classes: "border-brandgray-300 bg-brandgray-100 text-brandgray-850",
  },
  applied: {
    label: "Applied",
    icon: ApplicationsLineIcon,
    classes: "border-blue-300 bg-blue-50 text-blue-800",
  },
  in_review: {
    label: "In review",
    icon: ClockLineIcon,
    classes: "border-amber-200 bg-amber-50 text-amber-700",
  },
  interview: {
    label: "Interview",
    icon: UserGroupLineIcon,
    classes: "border-purple-200 bg-purple-50 text-purple-700",
  },
  offer: {
    label: "Offer",
    icon: CheckCircleLineIcon,
    classes: "border-brand-200 bg-brand-50 text-brand-600",
  },
  rejected: {
    label: "Rejected",
    icon: CloseCircleLineIcon,
    classes: "border-red-200 bg-red-50 text-red-700",
  },
  withdrawn: {
    label: "Withdrawn",
    icon: DoorExitLineIcon,
    classes: "border-brandgray-300 bg-brandgray-100 text-brandgray-750",
  },
};

export default function UserApplicationStatus({ jobId }: { jobId: number }) {
  const { user, isAuthLoading } = useAuth();
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (!user) return () => undefined;

      const handleStatusChange = (event: Event) => {
        const detail = (event as CustomEvent<{ userId: string; jobId: number }>)
          .detail;
        if (detail.userId === user.id && detail.jobId === jobId)
          onStoreChange();
      };
      const handleStorage = (event: StorageEvent) => {
        if (event.key === applicationStorageKey(user.id, jobId))
          onStoreChange();
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
    [jobId, user],
  );
  const getSnapshot = useCallback(
    () => (user ? readApplicationStatus(user.id, jobId) : null),
    [jobId, user],
  );
  const status = useSyncExternalStore(subscribe, getSnapshot, () => null);

  if (isAuthLoading || !user) return null;

  const presentation = status ? statusPresentation[status] : null;
  const Icon = presentation?.icon ?? UserLineIcon;

  return (
    <span
      className={`inline-flex px-2 shrink-0 items-center gap-1.5 rounded-xl border h-8 ${
        presentation
          ? presentation.classes
          : "border-gray-200 text-brandgray-550"
      }`}
      aria-label={`Your application status: ${presentation?.label ?? "Not tracked"}`}
    >
      <Icon aria-hidden="true" className="size-4" />
      <span className="text-brandgray-400">You</span>
      <span aria-hidden="true">·</span>
      {presentation?.label ?? "Not tracked"}
    </span>
  );
}
