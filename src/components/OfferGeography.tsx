import LocationMarkerLineIcon from "@iconify-react/majesticons/location-marker-line";
import UsersLineIcon from "@iconify-react/majesticons/users-line";
import { countryName, hiringRegionLabel } from "../lib/countries";
import type { JobOffer } from "../types/job";
import CountryFlag from "./CountryFlag";

export function HiringReach({
  job,
  compact = false,
}: {
  job: JobOffer;
  compact?: boolean;
}) {
  const visibleRegions = compact
    ? job.hiringRegions.slice(0, 2)
    : job.hiringRegions;
  const visibleCountries = compact
    ? job.hiringCountryCodes.slice(0, Math.max(0, 3 - visibleRegions.length))
    : job.hiringCountryCodes;
  const hiddenCount =
    job.hiringRegions.length +
    job.hiringCountryCodes.length -
    visibleRegions.length -
    visibleCountries.length;

  if (job.hiringRegions.length === 0 && job.hiringCountryCodes.length === 0) {
    return null;
  }

  return (
    <div className="flex min-w-0 flex-wrap items-center gap-1.5">
      <span className="inline-flex items-center gap-1.5 text-brandgray-550">
        <LocationMarkerLineIcon aria-hidden="true" width="15" height="15" />
        Hiring in
      </span>
      {visibleRegions.map((region) => (
        <span
          key={region}
          className="rounded-md bg-brandgray-100 px-2 py-1 text-xs font-semibold text-brandgray-750"
        >
          {hiringRegionLabel(region)}
        </span>
      ))}
      {visibleCountries.map((code) => (
        <span
          key={code}
          className="inline-flex items-center gap-1.5 rounded-md bg-brandgray-100 px-2 py-1 text-xs font-semibold text-brandgray-750"
        >
          <CountryFlag countryCode={code} />
          {countryName(code)}
        </span>
      ))}
      {hiddenCount > 0 && (
        <span className="text-xs font-semibold text-brandgray-500">
          +{hiddenCount}
        </span>
      )}
    </div>
  );
}

export function ApplicantCountryPreview({
  job,
  compact = false,
}: {
  job: JobOffer;
  compact?: boolean;
}) {
  if (job.applicantCountries.length === 0) return null;

  const countries = compact
    ? job.applicantCountries.slice(0, 3)
    : job.applicantCountries;
  const hiddenCount = job.applicantCountries.length - countries.length;

  return (
    <div className={compact ? "px-3 py-4 sm:px-5 lg:px-6" : "py-5"}>
      <span className="flex items-center gap-1.5 text-xs font-medium text-brandgray-550">
        <UsersLineIcon aria-hidden="true" width="15" height="15" />
        Applicants from
      </span>
      <div className="mt-2 flex flex-wrap gap-2">
        {countries.map((country) => (
          <span
            key={country.countryCode}
            className="inline-flex items-center gap-1.5 text-sm text-brandgray-700"
            title={`${country.applicantCount} ${country.applicantCount === 1 ? "applicant" : "applicants"} from ${countryName(country.countryCode)}`}
          >
            <CountryFlag countryCode={country.countryCode} />
            <strong className="font-semibold text-brandgray-900">
              {country.percentage}%
            </strong>
            {!compact && (
              <span>
                {countryName(country.countryCode)} ({country.applicantCount})
              </span>
            )}
          </span>
        ))}
        {hiddenCount > 0 && (
          <span className="text-xs font-semibold text-brandgray-500">
            +{hiddenCount} countries
          </span>
        )}
      </div>
    </div>
  );
}
