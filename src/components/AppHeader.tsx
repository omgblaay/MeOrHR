import BriefcaseIcon from "@iconify-react/majesticons/briefcase";
import ApplicationsLineIcon from "@iconify-react/majesticons/applications-line";
import ChevronDownLineIcon from "@iconify-react/majesticons/chevron-down-line";
import LogoutLineIcon from "@iconify-react/majesticons/logout-line";
import PlusLineIcon from "@iconify-react/majesticons/plus-line";
import SettingsCogLineIcon from "@iconify-react/majesticons/settings-cog-line";
import UserLineIcon from "@iconify-react/majesticons/user-line";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../auth/useAuth";
import {
  profileInitials,
  profileUpdatedEvent,
  type UserProfile,
} from "../lib/profile";
import { supabase } from "../lib/supabase";

export default function AppHeader() {
  const { user, isAuthLoading, signOut } = useAuth();
  const location = useLocation();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    let isCurrent = true;
    const loadProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, nickname, avatar_url, bio")
        .eq("id", user.id)
        .maybeSingle<UserProfile>();

      if (isCurrent) setProfile(data ?? null);
    };

    loadProfile();
    window.addEventListener(profileUpdatedEvent, loadProfile);

    return () => {
      isCurrent = false;
      window.removeEventListener(profileUpdatedEvent, loadProfile);
    };
  }, [user]);

  useEffect(() => {
    if (!isAccountMenuOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !accountMenuRef.current?.contains(event.target)
      ) {
        setIsAccountMenuOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsAccountMenuOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isAccountMenuOpen]);

  async function handleSignOut() {
    setIsAccountMenuOpen(false);
    setIsSigningOut(true);

    try {
      await signOut();
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <header className="border-b border-brandgray-250">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between border-x border-brandgray-250 bg-white px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-2.5 text-lg font-semibold text-brand-900"
        >
          <span className="grid size-9 place-items-center rounded-md bg-brand-900 text-white">
            <BriefcaseIcon aria-hidden="true" width="19" height="19" />
          </span>
          JobRater
        </Link>
        <div className="flex items-center gap-2">
          {isAuthLoading ? (
            <span
              className="h-9 w-20 animate-pulse rounded-md bg-brandgray-150"
              aria-label="Loading account"
            />
          ) : user ? (
            <>
              <Link
                to="/applications"
                title="Application board"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-brandgray-300 bg-white px-2.5 py-2 font-semibold text-brandgray-750 transition hover:border-brandgray-450 hover:text-brand-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-900"
              >
                <ApplicationsLineIcon
                  aria-hidden="true"
                  width="17"
                  height="17"
                />
                <span className="hidden lg:inline">My board</span>
              </Link>
              <Link
                to="/offers/new"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-lime-300 px-3.5 py-2 font-semibold text-brand-900 transition hover:bg-lime-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-900"
              >
                <PlusLineIcon aria-hidden="true" width="17" height="17" />
                Add an offer
              </Link>
              <div ref={accountMenuRef} className="relative">
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={isAccountMenuOpen}
                  aria-label="Open account menu"
                  onClick={() => setIsAccountMenuOpen((isOpen) => !isOpen)}
                  className="flex h-10 min-w-0 cursor-pointer items-center gap-1.5 rounded-md border border-brandgray-300 bg-white p-1 pr-2 text-brandgray-700 transition hover:border-brandgray-450 hover:text-brand-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-900"
                >
                  <span className="relative grid size-7 shrink-0 place-items-center overflow-hidden rounded-full bg-brand-900 text-xs font-semibold text-white">
                    {profileInitials(
                      profile?.nickname || user.email?.split("@")[0] || "U",
                    )}
                    {profile?.avatar_url && (
                      <img
                        src={profile.avatar_url}
                        alt=""
                        className="absolute inset-0 size-full object-cover"
                        onError={(event) => {
                          event.currentTarget.hidden = true;
                        }}
                      />
                    )}
                  </span>
                  <ChevronDownLineIcon
                    aria-hidden="true"
                    width="15"
                    height="15"
                    className={`transition-transform ${
                      isAccountMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isAccountMenuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-64 border border-brandgray-300 bg-white p-1.5 shadow-[0_12px_30px_rgba(24,32,28,0.16)]"
                  >
                    <div className="border-b border-brandgray-200 px-3 py-2.5">
                      <p className="truncate font-semibold text-brandgray-900">
                        {profile?.nickname || user.email?.split("@")[0]}
                      </p>
                      <p className="mt-0.5 truncate text-sm text-brandgray-500">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      to="/settings"
                      role="menuitem"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="mt-1 flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 font-medium text-brandgray-750 transition hover:bg-brandgray-100 hover:text-brand-900 focus-visible:outline-2 focus-visible:outline-brand-900"
                    >
                      <SettingsCogLineIcon
                        aria-hidden="true"
                        width="18"
                        height="18"
                      />
                      Profile settings
                    </Link>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                      className="flex w-full cursor-pointer items-center gap-2.5 rounded-md px-3 py-2.5 text-left font-medium text-red-700 transition hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-700 disabled:pointer-events-none disabled:opacity-50"
                    >
                      <LogoutLineIcon
                        aria-hidden="true"
                        width="18"
                        height="18"
                      />
                      {isSigningOut ? "Logging out..." : "Log out"}
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              to="/login"
              state={{ from: location.pathname }}
              className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-md border border-brandgray-300 bg-white px-3.5  font-semibold text-brandgray-750 transition hover:border-brandgray-450 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-900"
            >
              <UserLineIcon aria-hidden="true" width="17" height="17" />
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
