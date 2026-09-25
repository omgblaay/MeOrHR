import ApplicationsLineIcon from "@iconify-react/majesticons/applications-line";
import BookmarkLineIcon from "@iconify-react/majesticons/bookmark-line";
import CalendarLineIcon from "@iconify-react/majesticons/calendar-line";
import CheckCircleLineIcon from "@iconify-react/majesticons/check-circle-line";
import CheckLineIcon from "@iconify-react/majesticons/check-line";
import ClipboardListLineIcon from "@iconify-react/majesticons/clipboard-list-line";
import ClockLineIcon from "@iconify-react/majesticons/clock-line";
import CloseCircleLineIcon from "@iconify-react/majesticons/close-circle-line";
import DoorExitLineIcon from "@iconify-react/majesticons/door-exit-line";
import EditPenLineIcon from "@iconify-react/majesticons/edit-pen-2-line";
import FlagLineIcon from "@iconify-react/majesticons/flag-line";
import LinkLineIcon from "@iconify-react/majesticons/link-line";
import LockLineIcon from "@iconify-react/majesticons/lock-line";
import MailLineIcon from "@iconify-react/majesticons/mail-line";
import MessageLineIcon from "@iconify-react/majesticons/message-line";
import PlusLineIcon from "@iconify-react/majesticons/plus-line";
import TrashLineIcon from "@iconify-react/majesticons/trash-line";
import UserLineIcon from "@iconify-react/majesticons/user-line";
import UserGroupLineIcon from "@iconify-react/majesticons/user-group-line";
import {
  useEffect,
  useState,
  type ComponentType,
  type FormEvent,
  type ReactNode,
} from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import {
  applicationStorageKey,
  notifyApplicationStatusChanged,
  type ApplicationStatus,
} from "../lib/applicationStatus";
import {
  applicationQuickActionEvent,
  type ApplicationQuickAction,
} from "../lib/applicationQuickAction";
import type { JobOffer } from "../types/job";
import Button from "./Button";
import Input from "./Input";
import JobSourceBadge from "./JobSourceBadge";
import Label from "./Label";
import RadioCard from "./RadioCard";
import ResponsiveModal from "./ResponsiveModal";

type ApplicationEventType =
  | "saved"
  | "applied"
  | "in_review"
  | "interview_invited"
  | "offer_received"
  | "rejected"
  | "withdrawn"
  | "follow_up"
  | "contacted_hr"
  | "linkedin_connection"
  | "received_reply"
  | "no_reply_30"
  | "interview_completed"
  | "task_completed";

type ApplicationEvent = {
  id: string;
  type: ApplicationEventType;
  date: string;
  note: string;
  source?: JobOffer["sourcePlatform"];
};

type ApplicationTracker = {
  status: ApplicationStatus;
  events: ApplicationEvent[];
};

type LegacyProgress = Partial<{
  applied: boolean;
  replied: boolean;
  interview: boolean;
  contactedHr: boolean;
  linkedInConnection: boolean;
  followUpEmail: boolean;
  rejected: boolean;
}>;

type ActivityIcon = ComponentType<{
  "aria-hidden"?: boolean | "true" | "false";
  width?: string;
  height?: string;
}>;

const statusOptions: {
  value: ApplicationStatus;
  label: string;
  icon: ActivityIcon;
  selectedClasses: string;
  iconClasses: string;
}[] = [
  {
    value: "saved",
    label: "Saved",
    icon: BookmarkLineIcon,
    selectedClasses: "border-brandgray-600 bg-brandgray-100 text-brandgray-850",
    iconClasses: "bg-brandgray-600 text-white",
  },
  {
    value: "applied",
    label: "Applied",
    icon: ApplicationsLineIcon,
    selectedClasses: "border-blue-500 bg-blue-50 text-blue-800",
    iconClasses: "bg-blue-500 text-white",
  },
  {
    value: "in_review",
    label: "In review",
    icon: ClockLineIcon,
    selectedClasses: "border-amber-500 bg-amber-50 text-amber-700",
    iconClasses: "bg-amber-500 text-white",
  },
  {
    value: "interview",
    label: "Interview",
    icon: UserGroupLineIcon,
    selectedClasses: "border-purple-500 bg-purple-50 text-purple-700",
    iconClasses: "bg-purple-500 text-white",
  },
  {
    value: "offer",
    label: "Offer",
    icon: CheckCircleLineIcon,
    selectedClasses: "border-brand-500 bg-brand-50 text-brand-600",
    iconClasses: "bg-brand-500 text-white",
  },
  {
    value: "rejected",
    label: "Rejected",
    icon: CloseCircleLineIcon,
    selectedClasses: "border-red-500 bg-red-50 text-red-700",
    iconClasses: "bg-red-500 text-white",
  },
  {
    value: "withdrawn",
    label: "Withdrawn",
    icon: DoorExitLineIcon,
    selectedClasses: "border-brandgray-600 bg-brandgray-100 text-brandgray-750",
    iconClasses: "bg-brandgray-600 text-white",
  },
];

const activityOptions: {
  value: ApplicationEventType;
  label: string;
  icon: ActivityIcon;
}[] = [
  { value: "follow_up", label: "Sent a follow-up", icon: MailLineIcon },
  { value: "contacted_hr", label: "Contacted HR", icon: UserLineIcon },
  { value: "rejected", label: "Got rejected", icon: MailLineIcon },
  {
    value: "linkedin_connection",
    label: "Connected on LinkedIn",
    icon: LinkLineIcon,
  },
  { value: "received_reply", label: "Received a reply", icon: MessageLineIcon },
  {
    value: "interview_completed",
    label: "Completed an interview",
    icon: ApplicationsLineIcon,
  },
  {
    value: "task_completed",
    label: "Completed a task",
    icon: ClipboardListLineIcon,
  },
];

const statusEventTypes: Record<ApplicationStatus, ApplicationEventType> = {
  saved: "saved",
  applied: "applied",
  in_review: "in_review",
  interview: "interview_invited",
  offer: "offer_received",
  rejected: "rejected",
  withdrawn: "withdrawn",
};

const eventLabels: Record<ApplicationEventType, string> = {
  saved: "Saved this offer",
  applied: "Applied",
  in_review: "Application moved to review",
  interview_invited: "Invited to interview",
  offer_received: "Received an offer",
  rejected: "Received a rejection",
  withdrawn: "Withdrew the application",
  follow_up: "Sent a follow-up",
  contacted_hr: "Contacted HR",
  linkedin_connection: "Connected with someone on LinkedIn",
  received_reply: "Received a reply",
  no_reply_30: "No reply after 30 days",
  interview_completed: "Completed an interview",
  task_completed: "Completed a task",
};

function localDateValue() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
}

function createEvent(
  type: ApplicationEventType,
  date = localDateValue(),
  note = "",
): ApplicationEvent {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    date,
    note,
  };
}

function migrateLegacyProgress(
  progress: LegacyProgress,
): ApplicationTracker | null {
  if (!Object.values(progress).some(Boolean)) return null;

  const date = localDateValue();
  const events: ApplicationEvent[] = [];
  if (progress.applied) events.push(createEvent("applied", date));
  if (progress.contactedHr) events.push(createEvent("contacted_hr", date));
  if (progress.linkedInConnection) {
    events.push(createEvent("linkedin_connection", date));
  }
  if (progress.followUpEmail) events.push(createEvent("follow_up", date));
  if (progress.replied) events.push(createEvent("received_reply", date));
  if (progress.interview) events.push(createEvent("interview_invited", date));
  if (progress.rejected) events.push(createEvent("rejected", date));

  const status: ApplicationStatus = progress.rejected
    ? "rejected"
    : progress.interview
      ? "interview"
      : progress.replied
        ? "in_review"
        : "applied";

  return { status, events };
}

function readTracker(storageKey: string): ApplicationTracker | null {
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as ApplicationTracker | LegacyProgress;
    if ("status" in parsed && Array.isArray(parsed.events)) {
      return parsed as ApplicationTracker;
    }
    return migrateLegacyProgress(parsed as LegacyProgress);
  } catch {
    return null;
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year:
      new Date(value).getFullYear() === new Date().getFullYear()
        ? undefined
        : "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

function daysBetween(firstDate: string, secondDate: string) {
  const milliseconds =
    new Date(`${secondDate}T12:00:00`).getTime() -
    new Date(`${firstDate}T12:00:00`).getTime();
  return Math.max(0, Math.round(milliseconds / 86_400_000));
}

function statusLabel(status: ApplicationStatus) {
  return (
    statusOptions.find((option) => option.value === status)?.label ?? status
  );
}

function TrackerForm({ job, userId }: { job: JobOffer; userId: string }) {
  const storageKey = applicationStorageKey(userId, job.id);
  const [tracker, setTracker] = useState<ApplicationTracker | null>(() =>
    readTracker(storageKey),
  );
  const [openForm, setOpenForm] = useState<"status" | "activity" | null>(null);
  const [statusDraft, setStatusDraft] = useState<ApplicationStatus>(
    tracker?.status ?? "applied",
  );
  const [activityType, setActivityType] =
    useState<ApplicationEventType>("follow_up");
  const [eventDate, setEventDate] = useState(localDateValue());
  const [note, setNote] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editNote, setEditNote] = useState("");
  const [message, setMessage] = useState("");
  const [hoveredEventType, setHoveredEventType] =
    useState<ApplicationEventType | null>(null);

  function saveTracker(nextTracker: ApplicationTracker) {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(nextTracker));
      setTracker(nextTracker);
      notifyApplicationStatusChanged(userId, job.id);
      setMessage("Application tracker updated.");
    } catch {
      setMessage("Could not save this update in your browser.");
    }
  }

  function startApplication() {
    const nextTracker: ApplicationTracker = {
      status: "applied",
      events: [{ ...createEvent("applied"), source: job.sourcePlatform }],
    };
    saveTracker(nextTracker);
    setStatusDraft("applied");
  }

  function resetEntryForm() {
    setEventDate(localDateValue());
    setNote("");
    setOpenForm(null);
  }

  function submitStatus(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!tracker) return;
    saveTracker({
      status: statusDraft,
      events: [
        ...tracker.events,
        createEvent(statusEventTypes[statusDraft], eventDate, note.trim()),
      ],
    });
    resetEntryForm();
  }

  function submitActivity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!tracker) return;
    saveTracker({
      ...tracker,
      events: [
        ...tracker.events,
        createEvent(activityType, eventDate, note.trim()),
      ],
    });
    resetEntryForm();
  }

  function beginEdit(event: ApplicationEvent) {
    setEditingId(event.id);
    setEditDate(event.date);
    setEditNote(event.note);
    setMessage("");
  }

  function saveEditedEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!tracker || !editingId) return;
    saveTracker({
      ...tracker,
      events: tracker.events.map((item) =>
        item.id === editingId
          ? { ...item, date: editDate, note: editNote.trim() }
          : item,
      ),
    });
    setEditingId(null);
  }

  function removeEvent(eventId: string) {
    if (!tracker) return;
    saveTracker({
      ...tracker,
      events: tracker.events.filter((event) => event.id !== eventId),
    });
  }

  useEffect(() => {
    function handleQuickAction(event: Event) {
      const detail = (
        event as CustomEvent<{
          jobId: number;
          action: ApplicationQuickAction;
        }>
      ).detail;
      if (detail.jobId !== job.id) return;

      const currentTracker = readTracker(storageKey);
      const today = localDateValue();
      let nextTracker: ApplicationTracker;
      let nextMessage: string;

      if (detail.action === "applied") {
        if (currentTracker) {
          setMessage("This application is already being tracked.");
          return;
        }
        nextTracker = {
          status: "applied",
          events: [
            {
              ...createEvent("applied", today),
              source: job.sourcePlatform,
            },
          ],
        };
        nextMessage = "Application recorded.";
      } else if (!currentTracker) {
        setMessage("Record your application before adding this outcome.");
        return;
      } else if (detail.action === "received_reply") {
        const keepTerminalStatus = ["offer", "rejected", "withdrawn"].includes(
          currentTracker.status,
        );
        nextTracker = {
          status: keepTerminalStatus ? currentTracker.status : "in_review",
          events: [
            ...currentTracker.events,
            createEvent("received_reply", today),
          ],
        };
        nextMessage = "Reply recorded.";
      } else if (detail.action === "interview") {
        const keepTerminalStatus = ["offer", "rejected", "withdrawn"].includes(
          currentTracker.status,
        );
        nextTracker = {
          status: keepTerminalStatus ? currentTracker.status : "interview",
          events: [
            ...currentTracker.events,
            createEvent("interview_invited", today),
          ],
        };
        nextMessage = "Interview invitation recorded.";
      } else {
        const appliedEvent = [...currentTracker.events]
          .sort((first, second) => first.date.localeCompare(second.date))
          .find((item) => item.type === "applied");
        if (!appliedEvent) {
          setMessage("Add an application date before recording no reply.");
          return;
        }

        const ageInDays = daysBetween(appliedEvent.date, today);
        if (ageInDays < 30) {
          setMessage(
            `This action becomes available in ${30 - ageInDays} ${30 - ageInDays === 1 ? "day" : "days"}.`,
          );
          return;
        }
        if (currentTracker.events.some((item) => item.type === "no_reply_30")) {
          setMessage("No reply after 30 days is already recorded.");
          return;
        }
        nextTracker = {
          ...currentTracker,
          events: [...currentTracker.events, createEvent("no_reply_30", today)],
        };
        nextMessage = "No reply after 30 days recorded.";
      }

      try {
        window.localStorage.setItem(storageKey, JSON.stringify(nextTracker));
        setTracker(nextTracker);
        setStatusDraft(nextTracker.status);
        notifyApplicationStatusChanged(userId, job.id);
        setMessage(nextMessage);
      } catch {
        setMessage("Could not save this update in your browser.");
      }
    }

    window.addEventListener(applicationQuickActionEvent, handleQuickAction);
    return () =>
      window.removeEventListener(
        applicationQuickActionEvent,
        handleQuickAction,
      );
  }, [job.id, job.sourcePlatform, storageKey, userId]);

  if (!tracker) {
    return (
      <div className="border-l-2 border-brandgray-250 pl-5">
        <h3 className="text-base font-semibold text-brandgray-900">
          Have you applied for this role?
        </h3>
        <p className="mt-1 max-w-xl leading-6 text-brandgray-600">
          Start a private timeline and help improve anonymous hiring insights.
        </p>
        <Button className="mt-5" onClick={startApplication}>
          <CheckLineIcon aria-hidden="true" width="17" height="17" />I applied
        </Button>
        <PrivacyNote />
      </div>
    );
  }

  const sortedEvents = [...tracker.events].sort((first, second) =>
    first.date.localeCompare(second.date),
  );
  const appliedEvent = sortedEvents.find((event) => event.type === "applied");
  const lastEvent = sortedEvents.at(-1);
  const currentStatus =
    statusOptions.find((option) => option.value === tracker.status) ??
    statusOptions[0];
  const CurrentStatusIcon = currentStatus.icon;

  return (
    <div>
      <div className="flex flex-col gap-5 border-b border-brandgray-250 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span
              className={`inline-flex items-center gap-1.5  text-2xl font-semibold ${currentStatus.selectedClasses}`}
            >
              <CurrentStatusIcon aria-hidden="true" width="15" height="15" />
              {statusLabel(tracker.status)} stage
            </span>
            {appliedEvent && (
              <span className="text-sm text-brandgray-600">
                Applied {formatDate(appliedEvent.date)}
              </span>
            )}
            {lastEvent && (
              <span className="text-sm text-brandgray-600">
                Last activity {formatDate(lastEvent.date)}
              </span>
            )}
          </div>
          <PrivacyNote />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setStatusDraft(tracker.status);
              setEventDate(localDateValue());
              setNote("");
              setOpenForm(openForm === "status" ? null : "status");
            }}
          >
            Update status
          </Button>
        </div>
      </div>

      <StatusProgress
        status={tracker.status}
        events={sortedEvents}
        hoveredEventType={hoveredEventType}
        onHover={setHoveredEventType}
      />

      {openForm === "status" && (
        <ResponsiveModal
          title="Update status"
          onClose={() => setOpenForm(null)}
        >
          <EntryForm
            title="Update status"
            date={eventDate}
            note={note}
            presentation="dialog"
            onDateChange={setEventDate}
            onNoteChange={setNote}
            onCancel={() => setOpenForm(null)}
            onSubmit={submitStatus}
          >
            <StatusRadioGrid value={statusDraft} onChange={setStatusDraft} />
          </EntryForm>
        </ResponsiveModal>
      )}

      {openForm === "activity" && (
        <ResponsiveModal title="Add activity" onClose={() => setOpenForm(null)}>
          <EntryForm
            title="Add activity"
            date={eventDate}
            note={note}
            presentation="dialog"
            onDateChange={setEventDate}
            onNoteChange={setNote}
            onCancel={() => setOpenForm(null)}
            onSubmit={submitActivity}
          >
            <ActivityRadioGrid
              value={activityType}
              onChange={(value) =>
                setActivityType(value as ApplicationEventType)
              }
            />
          </EntryForm>
        </ResponsiveModal>
      )}

      <div className="pt-6">
        <div className="flex justify-between w-full">
          <h3 className="font-semibold text-brandgray-900">Your timeline</h3>
          <Button
            size="sm"
            disabled={!!openForm}
            onClick={() => {
              setEventDate(localDateValue());
              setNote("");
              setOpenForm(openForm === "activity" ? null : "activity");
            }}
          >
            <PlusLineIcon aria-hidden="true" width="17" height="17" />
            Add activity
          </Button>
        </div>
        {sortedEvents.length === 0 ? (
          <p className="mt-3 text-brandgray-550">No activity recorded yet.</p>
        ) : (
          <ol className="mt-4 max-w-3xl border-t border-brandgray-250">
            {sortedEvents.map((event) => (
              <li
                key={event.id}
                onMouseEnter={() => setHoveredEventType(event.type)}
                onMouseLeave={() => setHoveredEventType(null)}
                onFocusCapture={() => setHoveredEventType(event.type)}
                onBlurCapture={() => setHoveredEventType(null)}
                className={`flex w-full gap-3 border-b border-brandgray-200 px-2 py-4 transition-colors ${
                  hoveredEventType === event.type
                    ? "bg-brandgray-150"
                    : "hover:bg-brandgray-50"
                }`}
              >
                <time className="text-sm font-medium text-brandgray-550">
                  {formatDate(event.date)}
                </time>

                {editingId === event.id ? (
                  <form
                    onSubmit={saveEditedEvent}
                    className="col-span-2 grid gap-3 sm:grid-cols-[10rem_1fr_auto]"
                  >
                    <Input
                      type="date"
                      required
                      value={editDate}
                      onChange={(changeEvent) =>
                        setEditDate(changeEvent.target.value)
                      }
                      variant="compact"
                      aria-label="Event date"
                    />
                    <Input
                      value={editNote}
                      onChange={(changeEvent) =>
                        setEditNote(changeEvent.target.value)
                      }
                      placeholder="Private note (optional)"
                      variant="compact"
                      aria-label="Private note"
                    />
                    <div className="flex gap-2">
                      <Button type="submit" size="sm">
                        Save
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium flex-1 text-brandgray-900">
                        {eventLabels[event.type]}
                        {event.type === "rejected" && appliedEvent && (
                          <span className="font-normal text-brandgray-550">
                            {` · ${daysBetween(appliedEvent.date, event.date)} days after applying`}
                          </span>
                        )}
                      </p>
                      {event.type === "applied" && event.source && (
                        <div className="mt-1 flex flex-wrap items-center gap-1 text-sm text-brandgray-550">
                          <span>Applied through</span>
                          <JobSourceBadge source={event.source} />
                        </div>
                      )}
                      {event.note && (
                        <p className="mt-1 text-sm leading-5 text-brandgray-600">
                          {event.note}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-0 items-start gap-1">
                      <IconButton
                        label={`Edit ${eventLabels[event.type]}`}
                        title="Edit event"
                        onClick={() => beginEdit(event)}
                      >
                        <EditPenLineIcon
                          aria-hidden="true"
                          width="20"
                          height="20"
                        />
                      </IconButton>
                      <IconButton
                        label={`Remove ${eventLabels[event.type]}`}
                        title="Remove event"
                        danger
                        onClick={() => removeEvent(event.id)}
                      >
                        <TrashLineIcon
                          aria-hidden="true"
                          width="20"
                          height="20"
                        />
                      </IconButton>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>

      <p
        className="mt-4 text-xs text-brandgray-550"
        role="status"
        aria-live="polite"
      >
        {message}
      </p>
    </div>
  );
}

function StatusProgress({
  status,
  events,
  hoveredEventType,
  onHover,
}: {
  status: ApplicationStatus;
  events: ApplicationEvent[];
  hoveredEventType: ApplicationEventType | null;
  onHover: (eventType: ApplicationEventType | null) => void;
}) {
  const terminalStatuses: ApplicationStatus[] = [
    "offer",
    "rejected",
    "withdrawn",
  ];
  const isTerminal = terminalStatuses.includes(status);
  const outcome = isTerminal
    ? statusOptions.find((option) => option.value === status)!
    : {
        value: "offer" as ApplicationStatus,
        label: "Outcome",
        icon: FlagLineIcon,
        selectedClasses: "",
        iconClasses: "bg-brandgray-600 text-white",
      };
  const progressStages = [
    statusOptions.find((option) => option.value === "saved")!,
    statusOptions.find((option) => option.value === "applied")!,
    statusOptions.find((option) => option.value === "in_review")!,
    statusOptions.find((option) => option.value === "interview")!,
    outcome,
  ];
  const currentIndex = isTerminal
    ? 4
    : Math.max(
        0,
        progressStages.findIndex((stage) => stage.value === status),
      );

  return (
    <div className="job-type-scrollbar overflow-x-auto border-b border-brandgray-250 py-6">
      <div
        className="relative min-w-[36rem] px-4"
        aria-label="Application progress"
      >
        <div className="absolute left-[10%] right-[10%] top-[1.125rem] h-1 bg-brandgray-250">
          <span
            className="block h-full bg-brand-500 transition-[width] duration-300"
            style={{ width: `${currentIndex * 25}%` }}
          />
        </div>
        <ol className="relative grid grid-cols-5">
          {progressStages.map((stage, index) => {
            const StageIcon = stage.icon;
            const isReached = index <= currentIndex;
            const isCurrent = index === currentIndex;
            const stageEventType = statusEventTypes[stage.value];
            const stageEvent = [...events]
              .reverse()
              .find((event) => event.type === stageEventType);
            const isLinked = hoveredEventType === stageEventType;

            return (
              <li
                key={`${stage.value}-${stage.label}`}
                className={`flex flex-col items-center rounded-md px-2 py-1 text-center transition-colors ${
                  isLinked ? "bg-brand-100" : ""
                }`}
                aria-current={isCurrent ? "step" : undefined}
                onMouseEnter={() => onHover(stageEvent ? stageEventType : null)}
                onMouseLeave={() => onHover(null)}
              >
                <span
                  className={`grid size-9 place-items-center rounded-full border-2 border-white shadow-[0_0_0_1px_var(--color-brandgray-300)] transition-transform ${
                    isReached
                      ? stage.iconClasses
                      : "bg-brandgray-150 text-brandgray-450"
                  } ${isLinked ? "scale-110 ring-2 ring-brand-900/20" : ""}`}
                >
                  <StageIcon aria-hidden="true" width="17" height="17" />
                </span>
                <span
                  className={`mt-2 text-xs font-semibold ${
                    isCurrent
                      ? "text-brand-950"
                      : isReached
                        ? "text-brandgray-700"
                        : "text-brandgray-450"
                  }`}
                >
                  {stage.label}
                </span>
                <span className="mt-0.5 text-[11px] text-brandgray-500">
                  {stageEvent ? formatDate(stageEvent.date) : "—"}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

function StatusRadioGrid({
  value,
  onChange,
}: {
  value: ApplicationStatus;
  onChange: (value: ApplicationStatus) => void;
}) {
  return (
    <fieldset className="sm:col-span-2">
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {statusOptions.map((option) => {
          return (
            <RadioCard
              key={option.value}
              name="applicationStatus"
              value={option.value}
              label={option.label}
              icon={option.icon}
              checked={value === option.value}
              onChange={onChange}
              selectedClasses={option.selectedClasses}
              selectedIconClasses="text-current"
              checkClasses="text-current"
              focusClasses="focus-within:outline-brand-900"
            />
          );
        })}
      </div>
    </fieldset>
  );
}

function ActivityRadioGrid({
  value,
  onChange,
}: {
  value: ApplicationEventType;
  onChange: (value: ApplicationEventType) => void;
}) {
  return (
    <fieldset className="sm:col-span-2">
      <legend className="mb-2 font-semibold text-brandgray-900">
        Activity
      </legend>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {activityOptions.map((option) => {
          return (
            <RadioCard
              key={option.value}
              name="activityType"
              value={option.value}
              label={option.label}
              icon={option.icon}
              checked={value === option.value}
              onChange={onChange}
            />
          );
        })}
      </div>
    </fieldset>
  );
}

function EntryForm({
  title,
  date,
  note,
  onDateChange,
  onNoteChange,
  onCancel,
  onSubmit,
  children,
  presentation = "inline",
}: {
  title: string;
  date: string;
  note: string;
  onDateChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onCancel: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  presentation?: "inline" | "dialog";
}) {
  const isDialog = presentation === "dialog";

  return (
    <form
      onSubmit={onSubmit}
      className={
        isDialog
          ? "bg-white px-4 py-5 sm:px-6 sm:py-6"
          : "border-b border-brandgray-250 bg-white px-4 py-5 sm:px-5"
      }
    >
      {!isDialog && (
        <h3 className="font-semibold text-brandgray-900">{title}</h3>
      )}
      <div className={`${isDialog ? "" : "mt-4"} grid gap-4 sm:grid-cols-2`}>
        {children}
        <label className="block">
          <Label asSpan className="mb-2">
            Date
          </Label>
          <span className="relative block">
            <CalendarLineIcon
              aria-hidden="true"
              width="17"
              height="17"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brandgray-600"
            />
            <Input
              type="date"
              required
              value={date}
              max={localDateValue()}
              onChange={(event) => onDateChange(event.target.value)}
              className="pl-10"
            />
          </span>
        </label>
      </div>
      <label className="mt-4 block">
        <Label asSpan optional className="mb-2">
          Private note
        </Label>
        <textarea
          rows={2}
          value={note}
          onChange={(event) => onNoteChange(event.target.value)}
          placeholder="Add context you may want later"
          className="block w-full resize-y rounded-md border border-brandgray-300 bg-white px-3.5 py-3 leading-6 text-brandgray-900 outline-none placeholder:text-brandgray-450 focus:border-brand-700 focus:ring-3 focus:ring-brand-700/10"
        />
      </label>
      <div className="mt-4 flex gap-2">
        <Button type="submit" size="sm">
          Save
        </Button>
        <Button type="button" size="sm" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function IconButton({
  label,
  title,
  danger = false,
  onClick,
  children,
}: {
  label: string;
  title: string;
  danger?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`grid size-8 place-items-center rounded-md text-brandgray-600 transition focus-visible:outline-2 ${
        danger
          ? "hover:bg-red-50 hover:text-red-600 focus-visible:outline-red-600"
          : "hover:bg-brandgray-150 hover:text-brand-900 focus-visible:outline-brand-900"
      }`}
      aria-label={label}
      title={title}
    >
      {children}
    </button>
  );
}

function PrivacyNote() {
  return (
    <p className="mt-3 max-w-2xl text-xs leading-5 text-brandgray-500">
      Your dates and notes are private and currently saved only on this device.
      Anonymous event totals will contribute to offer insights after account
      sync is enabled.
    </p>
  );
}

export default function ApplicationActivity({ job }: { job: JobOffer }) {
  const { user, isAuthLoading } = useAuth();
  const location = useLocation();

  return (
    <section
      id="your-application"
      className="scroll-mt-4 border-b border-brandgray-250 bg-lime-50"
    >
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <ApplicationsLineIcon
            aria-hidden="true"
            width="18"
            height="18"
            className="text-brandgray-700"
          />
          <h2 className="font-semibold ">Your application</h2>
        </div>

        <div className="mt-6">
          {isAuthLoading ? (
            <div className="space-y-3" aria-label="Loading your application">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="h-11 animate-pulse bg-brandgray-100"
                />
              ))}
            </div>
          ) : user ? (
            <TrackerForm key={job.id} job={job} userId={user.id} />
          ) : (
            <div className="border-l-2 border-brandgray-250 pl-5">
              <span className="grid size-9 place-items-center rounded-md bg-brand-100 text-brand-900">
                <LockLineIcon aria-hidden="true" width="18" height="18" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-brandgray-900">
                Track your application
              </h3>
              <p className="mt-1 max-w-md leading-6 text-brandgray-600">
                Log in to keep a private status and dated activity timeline for
                this offer.
              </p>
              <Link
                to="/login"
                state={{ from: location.pathname }}
                className="mt-4 inline-flex h-9 items-center justify-center rounded-md bg-lime-300 px-3.5 font-semibold text-brand-900 transition hover:bg-lime-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-900"
              >
                Log in to track
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
