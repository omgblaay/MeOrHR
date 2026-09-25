import ApplicationsLineIcon from "@iconify-react/majesticons/applications-line";
import BookmarkLineIcon from "@iconify-react/majesticons/bookmark-line";
import CheckCircleLineIcon from "@iconify-react/majesticons/check-circle-line";
import ClockLineIcon from "@iconify-react/majesticons/clock-line";
import CloseCircleLineIcon from "@iconify-react/majesticons/close-circle-line";
import DoorExitLineIcon from "@iconify-react/majesticons/door-exit-line";
import LocationMarkerLineIcon from "@iconify-react/majesticons/location-marker-line";
import UserGroupLineIcon from "@iconify-react/majesticons/user-group-line";
// import ViewGridLineIcon from "@iconify-react/majesticons/view-grid-line";
// import ViewListLineIcon from "@iconify-react/majesticons/view-list-line";
import { useEffect, useState, type ComponentType, type DragEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "./auth/useAuth";
import JobCard from "./JobCard";
import RadioGroup from "./components/RadioGroup";
import AppFooter from "./components/AppFooter";
import AppHeader from "./components/AppHeader";
import JobCategoryIcon from "./components/JobCategoryIcon";
import Select from "./components/Select";
import {
  applicationStatuses,
  applicationStatusChangedEvent,
  applicationStatusLabels,
  readApplicationLastActivity,
  readApplicationStatus,
  updateApplicationStatus,
  type ApplicationStatus,
} from "./lib/applicationStatus";
import type { JobOffer } from "./types/job";

type StatusIcon = ComponentType<{
  "aria-hidden"?: boolean | "true" | "false";
  width?: string;
  height?: string;
}>;

const statusStyle: Record<
  ApplicationStatus,
  { icon: StatusIcon; column: string; iconClass: string }
> = {
  saved: {
    icon: BookmarkLineIcon,
    column: "border-brandgray-300 bg-brandgray-100",
    iconClass: "bg-brandgray-600 text-white",
  },
  applied: {
    icon: ApplicationsLineIcon,
    column: "border-blue-200 bg-blue-50",
    iconClass: "bg-blue-500 text-white",
  },
  in_review: {
    icon: ClockLineIcon,
    column: "border-amber-200 bg-amber-100",
    iconClass: "bg-amber-500 text-white",
  },
  interview: {
    icon: UserGroupLineIcon,
    column: "border-purple-200 bg-purple-100",
    iconClass: "bg-purple-500 text-white",
  },
  offer: {
    icon: CheckCircleLineIcon,
    column: "border-brand-200 bg-brand-50",
    iconClass: "bg-brand-500 text-white",
  },
  rejected: {
    icon: CloseCircleLineIcon,
    column: "border-red-200 bg-red-50",
    iconClass: "bg-red-500 text-white",
  },
  withdrawn: {
    icon: DoorExitLineIcon,
    column: "border-brandgray-300 bg-brandgray-100",
    iconClass: "bg-brandgray-600 text-white",
  },
};

type ApplicationBoardPageProps = {
  jobOffers: JobOffer[];
  isLoading: boolean;
};

type TrackedOffer = {
  job: JobOffer;
  status: ApplicationStatus;
  lastActivity: string | null;
};

type BoardView = "Board" | "List";

export default function ApplicationBoardPage({
  jobOffers,
  isLoading,
}: ApplicationBoardPageProps) {
  const { user, isAuthLoading } = useAuth();
  const [, setRevision] = useState(0);
  const [view, setView] = useState<BoardView>("Board");
  const [draggedJobId, setDraggedJobId] = useState<number | null>(null);
  const [activeDropStatus, setActiveDropStatus] =
    useState<ApplicationStatus | null>(null);

  useEffect(() => {
    const refresh = () => setRevision((revision) => revision + 1);
    window.addEventListener(applicationStatusChangedEvent, refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener(applicationStatusChangedEvent, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const trackedOffers: TrackedOffer[] = user
    ? jobOffers.flatMap((job) => {
        const status = readApplicationStatus(user.id, job.id);
        return status
          ? [
              {
                job,
                status,
                lastActivity: readApplicationLastActivity(user.id, job.id),
              },
            ]
          : [];
      })
    : [];

  if (isAuthLoading) {
    return (
      <div className="min-h-screen">
        <AppHeader />
        <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-[90rem] animate-pulse border-x border-brandgray-250 bg-brandgray-50" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: "/applications" }} />;
  }

  function moveOffer(jobId: number, status: ApplicationStatus) {
    if (!user) return;
    updateApplicationStatus(user.id, jobId, status);
    setDraggedJobId(null);
    setActiveDropStatus(null);
    setRevision((revision) => revision + 1);
  }

  function handleDrop(event: DragEvent, status: ApplicationStatus) {
    event.preventDefault();
    const jobId = Number(event.dataTransfer.getData("text/job-id"));
    if (Number.isFinite(jobId)) moveOffer(jobId, status);
  }

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-[90rem] border-x border-brandgray-250 bg-white">
        <header className="border-b border-brandgray-250 bg-brandgray-50 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-brand-500">
                Your applications
              </p>
              <h1 className="mt-1 text-2xl font-semibold text-brand-950 sm:text-3xl">
                Application board
              </h1>
              <p className="mt-2 max-w-2xl leading-6 text-brandgray-600">
                Keep every tracked offer in view and move it as your application
                progresses.
              </p>

              <RadioGroup
                name="workplace"
                value={view}
                options={["Board", "List"]}
                onChange={(opt) => setView(String(opt) as BoardView)}
                className="max-w-64"
              />
            </div>
            <div className="flex items-end gap-5">
              <p className="border-l-2 border-brand-500 pl-3 text-sm text-brandgray-600">
                <strong className="block text-xl text-brandgray-900">
                  {trackedOffers.length}
                </strong>
                tracked {trackedOffers.length === 1 ? "offer" : "offers"}
              </p>

              {/* <ViewButton
                  active={view === "board"}
                  icon={ViewGridLineIcon}
                  label="Board"
                  onClick={() => setView("board")}
                />
                <ViewButton
                  active={view === "list"}
                  icon={ViewListLineIcon}
                  label="List"
                  onClick={() => setView("list")}
                /> */}
            </div>
          </div>
        </header>

        {!isLoading && trackedOffers.length === 0 && (
          <div className="border-b border-brandgray-250 bg-amber-100 px-4 py-4 text-sm text-amber-900 sm:px-6 lg:px-8">
            Your board is empty. Open an offer and choose <strong>Saved</strong>{" "}
            or <strong>I applied</strong> to add it here.
          </div>
        )}

        {view === "Board" ? (
          <section
            aria-label="Application status board"
            className="overflow-hidden"
          >
            <div className="job-type-scrollbar overflow-x-auto p-4 sm:p-6 lg:p-8">
              <div className="grid min-w-[119rem] grid-cols-7 gap-3">
                {applicationStatuses.map((status) => {
                  const style = statusStyle[status];
                  const Icon = style.icon;
                  const applications = trackedOffers.filter(
                    (application) => application.status === status,
                  );
                  const isActiveDrop = activeDropStatus === status;

                  return (
                    <section
                      key={status}
                      onDragOver={(event) => {
                        event.preventDefault();
                        setActiveDropStatus(status);
                      }}
                      onDragLeave={(event) => {
                        if (
                          !event.currentTarget.contains(
                            event.relatedTarget as Node,
                          )
                        ) {
                          setActiveDropStatus(null);
                        }
                      }}
                      onDrop={(event) => handleDrop(event, status)}
                      className={`min-h-[30rem] border transition ${style.column} ${
                        isActiveDrop
                          ? "ring-2 ring-brand-900 ring-offset-2"
                          : ""
                      }`}
                    >
                      <header className="flex h-14 items-center gap-2 border-b border-inherit px-3">
                        <span
                          className={`grid size-7 place-items-center rounded-md ${style.iconClass}`}
                        >
                          <Icon aria-hidden="true" width="15" height="15" />
                        </span>
                        <h2 className="font-semibold text-brandgray-900">
                          {applicationStatusLabels[status]}
                        </h2>
                        <span className="ml-auto text-sm font-semibold text-brandgray-550">
                          {applications.length}
                        </span>
                      </header>

                      <div className="space-y-2 p-2">
                        {isLoading ? (
                          <div className="h-36 animate-pulse border border-brandgray-250 bg-white/70" />
                        ) : applications.length > 0 ? (
                          applications.map(({ job, lastActivity }) => (
                            <article
                              key={job.id}
                              draggable
                              onDragStart={(event) => {
                                event.dataTransfer.setData(
                                  "text/job-id",
                                  String(job.id),
                                );
                                event.dataTransfer.effectAllowed = "move";
                                setDraggedJobId(job.id);
                              }}
                              onDragEnd={() => {
                                setDraggedJobId(null);
                                setActiveDropStatus(null);
                              }}
                              className={`border border-brandgray-250 bg-white p-3 shadow-[0_1px_2px_rgba(22,34,27,0.05)] transition ${
                                draggedJobId === job.id ? "opacity-45" : ""
                              }`}
                            >
                              <div className="flex items-start gap-2.5">
                                <span
                                  className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-md text-xs font-semibold text-white"
                                  style={{ backgroundColor: job.logoColor }}
                                >
                                  {job.companyLogoUrl ? (
                                    <img
                                      src={job.companyLogoUrl}
                                      alt=""
                                      className="size-full bg-white object-contain"
                                    />
                                  ) : (
                                    job.initials
                                  )}
                                </span>
                                <div className="min-w-0">
                                  <p className="truncate text-xs font-medium text-brandgray-500">
                                    {job.company}
                                  </p>
                                  <Link
                                    to={`/jobs/${job.id}`}
                                    className="mt-0.5 block font-semibold leading-5 text-brandgray-900 hover:text-brand-650"
                                  >
                                    {job.title}
                                  </Link>
                                </div>
                              </div>

                              <div className="mt-3 flex items-center gap-1.5 text-xs text-brandgray-550">
                                <LocationMarkerLineIcon
                                  aria-hidden="true"
                                  width="14"
                                  height="14"
                                />
                                <span className="truncate">{job.location}</span>
                              </div>
                              <div className="mt-2 flex items-center gap-2 text-xs text-brandgray-550">
                                <JobCategoryIcon
                                  category={job.category}
                                  size={14}
                                  className="size-5"
                                />
                                <span>{job.category}</span>
                                <span aria-hidden="true">·</span>
                                <span>{job.workplace}</span>
                              </div>

                              <label className="mt-3 block border-t border-brandgray-150 pt-3 text-xs font-semibold text-brandgray-600">
                                Move to
                                <Select
                                  variant="compact"
                                  value={status}
                                  onChange={(event) =>
                                    moveOffer(
                                      job.id,
                                      event.target.value as ApplicationStatus,
                                    )
                                  }
                                  className="mt-1.5"
                                >
                                  {applicationStatuses.map((option) => (
                                    <option key={option} value={option}>
                                      {applicationStatusLabels[option]}
                                    </option>
                                  ))}
                                </Select>
                              </label>

                              {lastActivity && (
                                <p className="mt-2 text-xs text-brandgray-450">
                                  Last activity {formatBoardDate(lastActivity)}
                                </p>
                              )}
                            </article>
                          ))
                        ) : (
                          <p className="px-2 py-5 text-center text-xs text-brandgray-450">
                            Drop an offer here
                          </p>
                        )}
                      </div>
                    </section>
                  );
                })}
              </div>
            </div>
          </section>
        ) : (
          <ApplicationList
            trackedOffers={trackedOffers}
            isLoading={isLoading}
          />
        )}
      </main>
      <AppFooter />
    </div>
  );
}

// function ViewButton({
//   active,
//   icon: Icon,
//   label,
//   onClick,
// }: {
//   active: boolean;
//   icon: StatusIcon;
//   label: string;
//   onClick: () => void;
// }) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       aria-pressed={active}
//       className={`inline-flex h-9 items-center gap-1.5 rounded-sm px-3 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-900 ${
//         active
//           ? "bg-brand-900 text-white"
//           : "text-brandgray-600 hover:bg-brandgray-100 hover:text-brandgray-900"
//       }`}
//     >
//       <Icon aria-hidden="true" width="16" height="16" />
//       {label}
//     </button>
//   );
// }

function ApplicationList({
  trackedOffers,
  isLoading,
}: {
  trackedOffers: TrackedOffer[];
  isLoading: boolean;
}) {
  return (
    <section
      aria-label="Applications grouped by status"
      className="px-4 py-5 sm:px-6 sm:py-7 lg:px-8"
    >
      {isLoading ? (
        <div className="h-40 animate-pulse border border-brandgray-250 bg-brandgray-50" />
      ) : (
        <div className="space-y-7">
          {applicationStatuses.map((status) => {
            const applications = trackedOffers.filter(
              (application) => application.status === status,
            );
            if (applications.length === 0) return null;

            const style = statusStyle[status];
            const Icon = style.icon;

            return (
              <section key={status} aria-labelledby={`list-${status}`}>
                <header className="flex h-11 items-center gap-2 border-b border-brandgray-300">
                  <Icon aria-hidden="true" width="15" height="15" />
                  <h2
                    id={`list-${status}`}
                    className="font-semibold text-brandgray-900"
                  >
                    {applicationStatusLabels[status]}
                  </h2>
                  <span className="text-sm font-semibold text-brandgray-450">
                    {applications.length}
                  </span>
                </header>

                <div className="divide-y divide-brandgray-200">
                  {applications.map(({ job, lastActivity }) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      variant="small"
                      lastActivity={lastActivity}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </section>
  );
}

function formatBoardDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
  }).format(new Date(`${value}T12:00:00`));
}
