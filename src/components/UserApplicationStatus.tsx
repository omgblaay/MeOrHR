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
    classes: "border-[#cbd1cc] bg-[#f0f2f0] text-[#414a45]",
  },
  applied: {
    label: "Applied",
    icon: ApplicationsLineIcon,
    classes: "border-[#b9c9ed] bg-[#f2f6ff] text-[#244f9f]",
  },
  in_review: {
    label: "In review",
    icon: ClockLineIcon,
    classes: "border-[#ead19f] bg-[#fff8e8] text-[#80500b]",
  },
  interview: {
    label: "Interview",
    icon: UserGroupLineIcon,
    classes: "border-[#d8c2e5] bg-[#f8f1fc] text-[#633f80]",
  },
  offer: {
    label: "Offer",
    icon: CheckCircleLineIcon,
    classes: "border-[#addbc7] bg-[#edf8f2] text-[#1f704f]",
  },
  rejected: {
    label: "Rejected",
    icon: CloseCircleLineIcon,
    classes: "border-[#ebc2be] bg-[#fff3f1] text-[#913a34]",
  },
  withdrawn: {
    label: "Withdrawn",
    icon: DoorExitLineIcon,
    classes: "border-[#cbd0d3] bg-[#f1f3f4] text-[#465058]",
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
      className={`inline-flex h-7 shrink-0 items-center gap-1.5 rounded-md border px-2 text-base font-semibold ${
        presentation ? presentation.classes : "border-gray-200 text-[#707b74]"
      }`}
      aria-label={`Your application status: ${presentation?.label ?? "Not tracked"}`}
    >
      <Icon aria-hidden="true" width="14" height="14" />
      <span className="font-medium opacity-75">You</span>
      <span aria-hidden="true">·</span>
      {presentation?.label ?? "Not tracked"}
    </span>
  );
}
