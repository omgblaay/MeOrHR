import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { loadProfileCountry } from "../lib/applicationSync";
import { profileUpdatedEvent } from "../lib/profile";

export default function ProfileCountryRequirement() {
  const { user, isAuthLoading } = useAuth();
  const location = useLocation();
  const [countryCode, setCountryCode] = useState<string | null | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!user) return;

    let isCurrent = true;
    const loadCountry = () => {
      void loadProfileCountry(user.id).then((country) => {
        if (isCurrent) setCountryCode(country);
      });
    };

    loadCountry();
    window.addEventListener(profileUpdatedEvent, loadCountry);
    return () => {
      isCurrent = false;
      window.removeEventListener(profileUpdatedEvent, loadCountry);
    };
  }, [user]);

  if (
    isAuthLoading ||
    !user ||
    countryCode !== null ||
    location.pathname === "/settings"
  ) {
    return null;
  }

  return (
    <Navigate
      to="/settings"
      replace
      state={{ from: `${location.pathname}${location.search}` }}
    />
  );
}
