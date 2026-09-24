import BriefcaseIcon from "@iconify-react/majesticons/briefcase";
import LogoutLineIcon from "@iconify-react/majesticons/logout-line";
import UserLineIcon from "@iconify-react/majesticons/user-line";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../auth/useAuth";
import Button from "./Button";

export default function AppHeader() {
  const { user, isAuthLoading, signOut } = useAuth();
  const location = useLocation();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);

    try {
      await signOut();
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <header className="border-b border-[#dfe3dd]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between border-x border-[#dfe3dd] bg-white px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-2.5 text-lg font-semibold text-[#173f35]"
        >
          <span className="grid size-9 place-items-center rounded-md bg-[#173f35] text-white">
            <BriefcaseIcon aria-hidden="true" width="19" height="19" />
          </span>
          JobRater
        </Link>
        <div className="flex items-center gap-2">
          {isAuthLoading ? (
            <span
              className="h-9 w-20 animate-pulse rounded-md bg-[#edf0ec]"
              aria-label="Loading account"
            />
          ) : user ? (
            <>
              <span className="hidden max-w-44 truncate  font-medium text-[#526058] sm:inline">
                {user.email}
              </span>
              <Button variant="primary" size="sm">
                Add an offer
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSignOut}
                disabled={isSigningOut}
                title="Log out"
              >
                <LogoutLineIcon aria-hidden="true" width="17" height="17" />
                <span className="hidden sm:inline">
                  {isSigningOut ? "Logging out..." : "Log out"}
                </span>
              </Button>
            </>
          ) : (
            <Link
              to="/login"
              state={{ from: location.pathname }}
              className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-md border border-[#cfd5cf] bg-white px-3.5  font-semibold text-[#465149] transition hover:border-[#8f9b93] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#173f35]"
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
