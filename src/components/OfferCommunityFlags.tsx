import ClockLineIcon from "@iconify-react/majesticons/clock-line";
import CloseCircleLineIcon from "@iconify-react/majesticons/close-circle-line";
import UsersLineIcon from "@iconify-react/majesticons/users-line";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import {
  notifyOfferFlagChanged,
  type JobOfferFlag,
} from "../lib/offerFlags";
import { supabase } from "../lib/supabase";
import type { JobOffer } from "../types/job";

const talentPoolAgeDays = 45;

export default function OfferCommunityFlags({ job }: { job: JobOffer }) {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [currentTime] = useState(() => Date.now());
  const [selectedFlags, setSelectedFlags] = useState<JobOfferFlag[]>([]);
  const [talentPoolReports, setTalentPoolReports] = useState(
    job.talentPoolReports,
  );
  const [goneReports, setGoneReports] = useState(job.goneReports);
  const [updatingFlag, setUpdatingFlag] = useState<JobOfferFlag | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!user) return;

    let isCurrent = true;
    supabase
      .from("job_offer_flags")
      .select("flag")
      .eq("job_offer_id", job.id)
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (!isCurrent) return;
        setSelectedFlags(
          (data ?? []).map((item) => item.flag as JobOfferFlag),
        );
      });

    return () => {
      isCurrent = false;
    };
  }, [job.id, user]);

  const daysOnline = job.publishedAt
    ? Math.max(
        0,
        Math.floor(
          (currentTime - new Date(job.publishedAt).getTime()) / 86_400_000,
        ),
      )
    : 0;
  const mightBeTalentPool =
    talentPoolReports === 0 && daysOnline >= talentPoolAgeDays;
  const isGone = job.isGone || goneReports > 0;

  async function toggleFlag(flag: JobOfferFlag) {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    const isSelected = selectedFlags.includes(flag);
    setUpdatingFlag(flag);
    setErrorMessage("");

    const { error } = isSelected
      ? await supabase
          .from("job_offer_flags")
          .delete()
          .eq("job_offer_id", job.id)
          .eq("user_id", user.id)
          .eq("flag", flag)
      : await supabase.from("job_offer_flags").insert({
          job_offer_id: job.id,
          user_id: user.id,
          flag,
        });

    setUpdatingFlag(null);
    if (error) {
      setErrorMessage(error.message);
      return;
    }

    const selected = !isSelected;
    setSelectedFlags((current) =>
      selected
        ? [...current, flag]
        : current.filter((currentFlag) => currentFlag !== flag),
    );
    if (flag === "talent_pool") {
      setTalentPoolReports((count) => Math.max(0, count + (selected ? 1 : -1)));
    } else {
      setGoneReports((count) => Math.max(0, count + (selected ? 1 : -1)));
    }
    notifyOfferFlagChanged({ jobId: job.id, flag, selected });
  }

  return (
    <section
      className={`border-b border-brandgray-250 px-4 py-4 sm:px-6 lg:px-8 ${
        isGone
          ? "bg-red-50"
          : talentPoolReports > 0 || mightBeTalentPool
            ? "bg-amber-50"
            : "bg-brandgray-50"
      }`}
      aria-label="Community listing status"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          {isGone && (
            <FlagMessage
              icon={CloseCircleLineIcon}
              title="This offer may be gone"
              detail={
                goneReports > 0
                  ? `${goneReports} ${goneReports === 1 ? "person has" : "people have"} marked it as unavailable.`
                  : "Its known sources are closed."
              }
              color="text-red-700"
            />
          )}
          {talentPoolReports > 0 && (
            <FlagMessage
              icon={UsersLineIcon}
              title="This may be a talent-pool listing"
              detail={`${talentPoolReports} ${talentPoolReports === 1 ? "person has" : "people have"} marked it as talent pool only.`}
              color="text-amber-900"
            />
          )}
          {mightBeTalentPool && (
            <FlagMessage
              icon={ClockLineIcon}
              title="This might be a talent-pool listing"
              detail={`It has been online for ${daysOnline} days. Listings older than ${talentPoolAgeDays} days get this caution.`}
              color="text-amber-900"
            />
          )}
          {!isGone && talentPoolReports === 0 && !mightBeTalentPool && (
            <p className="text-sm text-brandgray-600">
              Help the community keep this listing accurate.
            </p>
          )}
          {errorMessage && (
            <p className="text-sm text-red-700" role="alert">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <FlagButton
            pressed={selectedFlags.includes("talent_pool")}
            disabled={updatingFlag !== null}
            onClick={() => toggleFlag("talent_pool")}
          >
            <UsersLineIcon aria-hidden="true" width="16" height="16" />
            Talent pool only
          </FlagButton>
          <FlagButton
            pressed={selectedFlags.includes("gone")}
            disabled={updatingFlag !== null}
            onClick={() => toggleFlag("gone")}
          >
            <CloseCircleLineIcon aria-hidden="true" width="16" height="16" />
            Offer is gone
          </FlagButton>
        </div>
      </div>
    </section>
  );
}

function FlagMessage({
  icon: Icon,
  title,
  detail,
  color,
}: {
  icon: typeof ClockLineIcon;
  title: string;
  detail: string;
  color: string;
}) {
  return (
    <div className={`flex items-start gap-2 ${color}`}>
      <Icon aria-hidden="true" width="18" height="18" className="mt-0.5 shrink-0" />
      <p className="text-sm">
        <strong className="font-semibold">{title}.</strong>{" "}
        <span className="text-brandgray-650">{detail}</span>
      </p>
    </div>
  );
}

function FlagButton({
  pressed,
  disabled,
  onClick,
  children,
}: {
  pressed: boolean;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-900 disabled:cursor-wait disabled:opacity-60 ${
        pressed
          ? "border-brand-900 bg-brand-900 text-white"
          : "border-brandgray-300 bg-white text-brandgray-700 hover:border-brandgray-450 hover:text-brandgray-900"
      }`}
    >
      {children}
    </button>
  );
}
