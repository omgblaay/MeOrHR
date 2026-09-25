import UserLineIcon from "@iconify-react/majesticons/user-line";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/useAuth";
import { profileInitials, type UserProfile } from "../lib/profile";
import { supabase } from "../lib/supabase";

export default function OfferPublisher({
  createdBy,
  createdAt,
}: {
  createdBy: string | null;
  createdAt: string;
}) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!createdBy) return;

    let isCurrent = true;
    supabase
      .from("profiles")
      .select("id, nickname, avatar_url, bio")
      .eq("id", createdBy)
      .maybeSingle<UserProfile>()
      .then(({ data }) => {
        if (isCurrent) setProfile(data ?? null);
      });

    return () => {
      isCurrent = false;
    };
  }, [createdBy]);

  const publisherName = !createdBy
    ? "JobRater"
    : createdBy === user?.id
      ? profile?.nickname || "You"
      : profile?.nickname || "JobRater member";

  return (
    <section className="flex items-center gap-3 border-b border-brandgray-250 bg-brandgray-50 px-4 py-5 sm:px-6 lg:px-8">
      <span className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-brandgray-200 text-xs font-semibold text-brandgray-700">
        {createdBy ? profileInitials(publisherName) : (
          <UserLineIcon aria-hidden="true" width="17" height="17" />
        )}
        {profile?.avatar_url && (
          <img
            src={profile.avatar_url}
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
        )}
      </span>
      <p className="text-sm text-brandgray-550">
        Published by{" "}
        <strong className="font-semibold text-brandgray-800">
          {publisherName}
        </strong>{" "}
        on {formatPublisherDate(createdAt)}
      </p>
    </section>
  );
}

function formatPublisherDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}
