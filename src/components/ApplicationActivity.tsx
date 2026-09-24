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
  useState,
  type ComponentType,
  type FormEvent,
  type ReactNode,
} from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import type { JobOffer } from "../types/job";
import Button from "./Button";
import JobSourceBadge from "./JobSourceBadge";

type ApplicationStatus =
  | "saved"
  | "applied"
  | "in_review"
  | "interview"
  | "offer"
  | "rejected"
  | "withdrawn";

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
    selectedClasses: "border-[#69736d] bg-[#f0f2f0] text-[#414a45]",
    iconClasses: "bg-[#69736d] text-white",
  },
  {
    value: "applied",
    label: "Applied",
    icon: ApplicationsLineIcon,
    selectedClasses: "border-[#3568d4] bg-[#f2f6ff] text-[#244f9f]",
    iconClasses: "bg-[#3568d4] text-white",
  },
  {
    value: "in_review",
    label: "In review",
    icon: ClockLineIcon,
    selectedClasses: "border-[#ad7217] bg-[#fff8e8] text-[#80500b]",
    iconClasses: "bg-[#ad7217] text-white",
  },
  {
    value: "interview",
    label: "Interview",
    icon: UserGroupLineIcon,
    selectedClasses: "border-[#79529a] bg-[#f8f1fc] text-[#633f80]",
    iconClasses: "bg-[#79529a] text-white",
  },
  {
    value: "offer",
    label: "Offer",
    icon: CheckCircleLineIcon,
    selectedClasses: "border-[#278b63] bg-[#edf8f2] text-[#1f704f]",
    iconClasses: "bg-[#278b63] text-white",
  },
  {
    value: "rejected",
    label: "Rejected",
    icon: CloseCircleLineIcon,
    selectedClasses: "border-[#b34a42] bg-[#fff3f1] text-[#913a34]",
    iconClasses: "bg-[#b34a42] text-white",
  },
  {
    value: "withdrawn",
    label: "Withdrawn",
    icon: DoorExitLineIcon,
    selectedClasses: "border-[#606a72] bg-[#f1f3f4] text-[#465058]",
    iconClasses: "bg-[#606a72] text-white",
  },
];

const activityOptions: {
  value: ApplicationEventType;
  label: string;
  icon: ActivityIcon;
}[] = [
  { value: "follow_up", label: "Sent a follow-up", icon: MailLineIcon },
  { value: "contacted_hr", label: "Contacted HR", icon: UserLineIcon },
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
  const storageKey = `jobrater:application-progress:${userId}:${job.id}`;
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

  if (!tracker) {
    return (
      <div className="border-l-2 border-[#dfe3dd] pl-5">
        <h3 className="text-base font-semibold text-[#27322c]">
          Have you applied for this role?
        </h3>
        <p className="mt-1 max-w-xl leading-6 text-[#667069]">
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
      <div className="flex flex-col gap-5 border-b border-[#dfe3dd] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span
              className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-sm font-semibold ${currentStatus.selectedClasses}`}
            >
              <CurrentStatusIcon aria-hidden="true" width="15" height="15" />
              {statusLabel(tracker.status)} stage
            </span>
            {appliedEvent && (
              <span className="text-sm text-[#667069]">
                Applied {formatDate(appliedEvent.date)}
              </span>
            )}
            {lastEvent && (
              <span className="text-sm text-[#667069]">
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
          <Button
            size="sm"
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
      </div>

      <StatusProgress
        status={tracker.status}
        events={sortedEvents}
        hoveredEventType={hoveredEventType}
        onHover={setHoveredEventType}
      />

      {openForm === "status" && (
        <EntryForm
          title="Update status"
          date={eventDate}
          note={note}
          onDateChange={setEventDate}
          onNoteChange={setNote}
          onCancel={() => setOpenForm(null)}
          onSubmit={submitStatus}
        >
          <StatusRadioGrid value={statusDraft} onChange={setStatusDraft} />
        </EntryForm>
      )}

      {openForm === "activity" && (
        <EntryForm
          title="Add activity"
          date={eventDate}
          note={note}
          onDateChange={setEventDate}
          onNoteChange={setNote}
          onCancel={() => setOpenForm(null)}
          onSubmit={submitActivity}
        >
          <ActivityRadioGrid
            value={activityType}
            onChange={(value) => setActivityType(value as ApplicationEventType)}
          />
        </EntryForm>
      )}

      <div className="pt-6">
        <h3 className="font-semibold text-[#27322c]">Timeline</h3>
        {sortedEvents.length === 0 ? (
          <p className="mt-3 text-[#707b74]">No activity recorded yet.</p>
        ) : (
          <ol className="mt-4 max-w-3xl border-t border-[#dfe3dd]">
            {sortedEvents.map((event, index) => (
              <li
                key={event.id}
                onMouseEnter={() => setHoveredEventType(event.type)}
                onMouseLeave={() => setHoveredEventType(null)}
                onFocusCapture={() => setHoveredEventType(event.type)}
                onBlurCapture={() => setHoveredEventType(null)}
                className={`grid grid-cols-[4.5rem_1rem_minmax(0,1fr)_auto] gap-3 border-b border-[#e5e9e5] px-2 py-4 transition-colors sm:grid-cols-[6rem_1rem_minmax(0,1fr)_auto] ${
                  hoveredEventType === event.type
                    ? "bg-[#edf2ee]"
                    : "hover:bg-[#f7f9f7]"
                }`}
              >
                <time className="text-sm font-medium text-[#707b74]">
                  {formatDate(event.date)}
                </time>

                <TimelineDot
                  event={event}
                  isLast={index === sortedEvents.length - 1}
                />

                {editingId === event.id ? (
                  <form
                    onSubmit={saveEditedEvent}
                    className="col-span-2 grid gap-3 sm:grid-cols-[10rem_1fr_auto]"
                  >
                    <input
                      type="date"
                      required
                      value={editDate}
                      onChange={(changeEvent) =>
                        setEditDate(changeEvent.target.value)
                      }
                      className="h-10 rounded-md border border-[#cfd5cf] bg-white px-3 text-sm outline-none focus:border-[#2b6558]"
                      aria-label="Event date"
                    />
                    <input
                      value={editNote}
                      onChange={(changeEvent) =>
                        setEditNote(changeEvent.target.value)
                      }
                      placeholder="Private note (optional)"
                      className="h-10 rounded-md border border-[#cfd5cf] bg-white px-3 text-sm outline-none focus:border-[#2b6558]"
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
                    <div className="min-w-0">
                      <p className="font-medium text-[#27322c]">
                        {eventLabels[event.type]}
                        {event.type === "rejected" && appliedEvent && (
                          <span className="font-normal text-[#707b74]">
                            {` · ${daysBetween(appliedEvent.date, event.date)} days after applying`}
                          </span>
                        )}
                      </p>
                      {event.type === "applied" && event.source && (
                        <div className="mt-1 flex flex-wrap items-center gap-1 text-sm text-[#707b74]">
                          <span>Applied through</span>
                          <JobSourceBadge source={event.source} />
                        </div>
                      )}
                      {event.note && (
                        <p className="mt-1 text-sm leading-5 text-[#667069]">
                          {event.note}
                        </p>
                      )}
                    </div>
                    <div className="flex items-start gap-1">
                      <IconButton
                        label={`Edit ${eventLabels[event.type]}`}
                        title="Edit event"
                        onClick={() => beginEdit(event)}
                      >
                        <EditPenLineIcon
                          aria-hidden="true"
                          width="16"
                          height="16"
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
                          width="16"
                          height="16"
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
        className="mt-4 text-xs text-[#707b74]"
        role="status"
        aria-live="polite"
      >
        {message}
      </p>
    </div>
  );
}

function TimelineDot({
  event,
  isLast,
}: {
  event: ApplicationEvent;
  isLast: boolean;
}) {
  const tooltipId = `event-details-${event.id}`;

  return (
    <span className="relative flex self-stretch justify-center">
      {!isLast && (
        <span
          aria-hidden="true"
          className="absolute bottom-[-1.25rem] top-2.5 w-px bg-[#aeb8b1]"
        />
      )}
      <span
        tabIndex={0}
        aria-label={`${eventLabels[event.type]} details`}
        aria-describedby={tooltipId}
        className="group/dot relative z-10 mt-1 block size-3 rounded-full border-2 border-white bg-[#18201c] shadow-[0_0_0_1px_#18201c] outline-none focus-visible:ring-2 focus-visible:ring-[#278b63] focus-visible:ring-offset-2"
      >
        <span
          id={tooltipId}
          role="tooltip"
          className="pointer-events-none absolute left-1/2 top-5 z-30 w-60 -translate-x-1/2 rounded-md bg-[#18201c] px-3 py-2.5 text-left text-xs leading-5 text-white opacity-0 shadow-lg group-hover/dot:opacity-100 group-focus/dot:opacity-100"
        >
          <strong className="block font-semibold">
            {eventLabels[event.type]}
          </strong>
          <span className="block text-[#cbd2cd]">{formatDate(event.date)}</span>
          {event.note && (
            <span className="mt-1 block border-t border-white/20 pt-1.5 text-[#edf1ee]">
              {event.note}
            </span>
          )}
        </span>
      </span>
    </span>
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
        iconClasses: "bg-[#69736d] text-white",
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
    <div className="job-type-scrollbar overflow-x-auto border-b border-[#dfe3dd] py-6">
      <div
        className="relative min-w-[36rem] px-4"
        aria-label="Application progress"
      >
        <div className="absolute left-[10%] right-[10%] top-[1.125rem] h-1 bg-[#e0e4e0]">
          <span
            className="block h-full bg-[#278b63] transition-[width] duration-300"
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
                  isLinked ? "bg-[#e7eee8]" : ""
                }`}
                aria-current={isCurrent ? "step" : undefined}
                onMouseEnter={() => onHover(stageEvent ? stageEventType : null)}
                onMouseLeave={() => onHover(null)}
              >
                <span
                  className={`grid size-9 place-items-center rounded-full border-2 border-white shadow-[0_0_0_1px_#d5dbd6] transition-transform ${
                    isReached
                      ? stage.iconClasses
                      : "bg-[#eef1ee] text-[#8b948e]"
                  } ${isLinked ? "scale-110 ring-2 ring-[#173f35]/20" : ""}`}
                >
                  <StageIcon aria-hidden="true" width="17" height="17" />
                </span>
                <span
                  className={`mt-2 text-xs font-semibold ${
                    isCurrent
                      ? "text-[#18201c]"
                      : isReached
                        ? "text-[#526058]"
                        : "text-[#929a95]"
                  }`}
                >
                  {stage.label}
                </span>
                <span className="mt-0.5 text-[11px] text-[#7a847e]">
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
      <legend className="mb-2 font-semibold text-[#27322c]">
        Current stage
      </legend>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {statusOptions.map((option) => {
          const StatusIcon = option.icon;
          const isSelected = value === option.value;

          return (
            <label
              key={option.value}
              className={`relative flex min-h-22 cursor-pointer flex-col items-start rounded-md border p-3.5 transition focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#173f35] ${
                isSelected
                  ? option.selectedClasses
                  : "border-[#d6dcd6] bg-white text-[#465149] hover:border-[#9eaaa2] hover:bg-[#fafcfa]"
              }`}
            >
              <input
                type="radio"
                name="applicationStatus"
                value={option.value}
                checked={isSelected}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              <span
                className={`grid size-8 place-items-center rounded-md ${
                  isSelected
                    ? option.iconClasses
                    : "bg-[#edf0ec] text-[#526058]"
                }`}
              >
                <StatusIcon aria-hidden="true" width="17" height="17" />
              </span>
              {isSelected && (
                <CheckLineIcon
                  aria-hidden="true"
                  width="17"
                  height="17"
                  className="absolute right-3 top-3"
                />
              )}
              <span className="mt-2 text-sm font-medium">{option.label}</span>
            </label>
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
      <legend className="mb-2 font-semibold text-[#27322c]">Activity</legend>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {activityOptions.map((option) => {
          const ActivityIcon = option.icon;
          const isSelected = value === option.value;

          return (
            <label
              key={option.value}
              className={`relative flex min-h-24 cursor-pointer flex-col items-start rounded-md border p-3.5 transition focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#173f35] ${
                isSelected
                  ? "border-[#173f35] bg-[#edf4f0] text-[#173f35]"
                  : "border-[#d6dcd6] bg-white text-[#465149] hover:border-[#9eaaa2] hover:bg-[#fafcfa]"
              }`}
            >
              <input
                type="radio"
                name="activityType"
                value={option.value}
                checked={isSelected}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              <span
                className={`grid size-8 place-items-center rounded-md ${
                  isSelected
                    ? "bg-[#173f35] text-white"
                    : "bg-[#edf0ec] text-[#526058]"
                }`}
              >
                <ActivityIcon aria-hidden="true" width="17" height="17" />
              </span>
              {isSelected && (
                <CheckLineIcon
                  aria-hidden="true"
                  width="17"
                  height="17"
                  className="absolute right-3 top-3 text-[#278b63]"
                />
              )}
              <span className="mt-3 text-sm font-medium leading-5">
                {option.label}
              </span>
            </label>
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
}: {
  title: string;
  date: string;
  note: string;
  onDateChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onCancel: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="border-b border-[#dfe3dd] bg-[#f8faf8] px-4 py-5 sm:px-5"
    >
      <h3 className="font-semibold text-[#27322c]">{title}</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {children}
        <label className="block">
          <span className="mb-2 block font-semibold text-[#27322c]">Date</span>
          <span className="relative block">
            <CalendarLineIcon
              aria-hidden="true"
              width="17"
              height="17"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#657168]"
            />
            <input
              type="date"
              required
              value={date}
              max={localDateValue()}
              onChange={(event) => onDateChange(event.target.value)}
              className="h-11 w-full rounded-md border border-[#cfd5cf] bg-white pl-10 pr-3 text-[#27322c] outline-none focus:border-[#2b6558] focus:ring-3 focus:ring-[#2b6558]/10"
            />
          </span>
        </label>
      </div>
      <label className="mt-4 block">
        <span className="mb-2 block font-semibold text-[#27322c]">
          Private note{" "}
          <span className="font-normal text-[#7a847e]">(optional)</span>
        </span>
        <textarea
          rows={2}
          value={note}
          onChange={(event) => onNoteChange(event.target.value)}
          placeholder="Add context you may want later"
          className="block w-full resize-y rounded-md border border-[#cfd5cf] bg-white px-3.5 py-3 leading-6 text-[#27322c] outline-none placeholder:text-[#929a95] focus:border-[#2b6558] focus:ring-3 focus:ring-[#2b6558]/10"
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
      className={`grid size-8 place-items-center rounded-md text-[#657168] transition focus-visible:outline-2 ${
        danger
          ? "hover:bg-[#fff0ed] hover:text-[#9d352e] focus-visible:outline-[#9d352e]"
          : "hover:bg-[#edf0ec] hover:text-[#173f35] focus-visible:outline-[#173f35]"
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
    <p className="mt-3 max-w-2xl text-xs leading-5 text-[#7a847e]">
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
    <section className="border-b border-[#dfe3dd]">
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <ApplicationsLineIcon
            aria-hidden="true"
            width="18"
            height="18"
            className="text-[#526058]"
          />
          <h2 className="font-semibold uppercase text-[#667069]">
            Your application
          </h2>
        </div>

        <div className="mt-6">
          {isAuthLoading ? (
            <div className="space-y-3" aria-label="Loading your application">
              {[0, 1, 2].map((item) => (
                <div key={item} className="h-11 animate-pulse bg-[#f1f4f0]" />
              ))}
            </div>
          ) : user ? (
            <TrackerForm key={job.id} job={job} userId={user.id} />
          ) : (
            <div className="border-l-2 border-[#dfe3dd] pl-5">
              <span className="grid size-9 place-items-center rounded-md bg-[#e7eee8] text-[#173f35]">
                <LockLineIcon aria-hidden="true" width="18" height="18" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-[#27322c]">
                Track your application
              </h3>
              <p className="mt-1 max-w-md leading-6 text-[#667069]">
                Log in to keep a private status and dated activity timeline for
                this offer.
              </p>
              <Link
                to="/login"
                state={{ from: location.pathname }}
                className="mt-4 inline-flex h-9 items-center justify-center rounded-md bg-[#eaff6a] px-3.5 font-semibold text-[#173f35] transition hover:bg-[#def258] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#173f35]"
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
