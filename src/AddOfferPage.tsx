import ArrowLeftLineIcon from "@iconify-react/majesticons/arrow-left-line";
import BriefcaseLineIcon from "@iconify-react/majesticons/briefcase-line";
import CodeLineIcon from "@iconify-react/majesticons/code-line";
import ExternalLinkLineIcon from "@iconify-react/majesticons/external-link-line";
import EditPenLineIcon from "@iconify-react/majesticons/edit-pen-4-line";
import GlobeLineIcon from "@iconify-react/majesticons/globe-line";
import LocationMarkerLineIcon from "@iconify-react/majesticons/location-marker-line";
import PlusLineIcon from "@iconify-react/majesticons/plus-line";
import TagLineIcon from "@iconify-react/majesticons/tag-line";
import { useState, type FormEvent, type ReactNode } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./auth/useAuth";
import AppHeader from "./components/AppHeader";
import AppFooter from "./components/AppFooter";
import Button from "./components/Button";
import CountryFlag from "./components/CountryFlag";
import CountrySelect from "./components/CountrySelect";
import Input from "./components/Input";
import JobCategoryIcon from "./components/JobCategoryIcon";
import Label from "./components/Label";
import Select from "./components/Select";
import RadioGroup from "./components/RadioGroup";
import {
  countryName,
  hiringRegions,
  type HiringRegion,
} from "./lib/countries";
import { importJobOffer } from "./lib/jobOfferImport";
import { supabase } from "./lib/supabase";
import {
  jobCategories,
  jobSources,
  roleLevels,
  type JobCategory,
  type JobOffer,
  type JobSource,
  type RoleLevel,
} from "./types/job";

const sourceLabels: Record<JobSource, string> = {
  linkedin: "LinkedIn",
  indeed: "Indeed",
  stepstone: "StepStone",
  justjoinit: "Just Join IT",
  nofluffjobs: "No Fluff Jobs",
  pracuj: "Pracuj.pl",
  glassdoor: "Glassdoor",
  xing: "XING",
  welcome_to_the_jungle: "Welcome to the Jungle",
  wellfound: "Wellfound",
  eures: "EURES",
  company_career_page: "Company career page",
  other: "Other",
};

function localDateValue() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
}

function dateInputValue(value: string | null | undefined) {
  if (!value) return localDateValue();

  const date = new Date(value);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
}

type AddOfferPageProps = {
  onOfferSaved: () => void;
  offer?: JobOffer;
};

export default function AddOfferPage({
  onOfferSaved,
  offer,
}: AddOfferPageProps) {
  const { user, isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const isEditing = Boolean(offer);
  const [title, setTitle] = useState(offer?.title ?? "");
  const [company, setCompany] = useState(offer?.company ?? "");
  const [companyCountryCode, setCompanyCountryCode] = useState(
    offer?.companyCountryCode ?? "",
  );
  const [companyLogoUrl, setCompanyLogoUrl] = useState(
    offer?.companyLogoUrl ?? "",
  );
  const [category, setCategory] = useState<JobCategory>(
    offer?.category ?? "JavaScript",
  );
  const [location, setLocation] = useState(offer?.location ?? "");
  const [selectedHiringRegions, setSelectedHiringRegions] = useState<
    HiringRegion[]
  >((offer?.hiringRegions ?? []) as HiringRegion[]);
  const [hiringCountryCodes, setHiringCountryCodes] = useState<string[]>(
    offer?.hiringCountryCodes ?? [],
  );
  const [workplace, setWorkplace] = useState<"Remote" | "Hybrid" | "On-site">(
    offer?.workplace ?? "Remote",
  );
  const [employmentType, setEmploymentType] = useState<
    "Full-time" | "Contract"
  >(offer?.type ?? "Full-time");
  const [roleLevel, setRoleLevel] = useState<RoleLevel | "">(
    offer?.roleLevel ?? "",
  );
  const [salary, setSalary] = useState(offer?.salary ?? "");
  const [tags, setTags] = useState(offer?.tags.join(", ") ?? "");
  const [description, setDescription] = useState(offer?.description ?? "");
  const [sourcePlatform, setSourcePlatform] = useState<JobSource>(
    offer?.sourcePlatform ?? "company_career_page",
  );
  const [sourceUrl, setSourceUrl] = useState(
    offer?.sources[0]?.url ?? offer?.sourceUrl ?? "",
  );
  const [publishedAt, setPublishedAt] = useState(
    dateInputValue(offer?.sources[0]?.publishedAt ?? offer?.publishedAt),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showEditor, setShowEditor] = useState(isEditing);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [wasImported, setWasImported] = useState(false);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen">
        <AppHeader />
        <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-[90rem] border-x border-brandgray-250 bg-white px-4 py-10 sm:px-6 lg:px-8">
          <div className="h-8 w-52 animate-pulse bg-brandgray-150" />
          <div className="mt-8 h-96 animate-pulse bg-brandgray-50" />
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: offer ? `/jobs/${offer.id}/edit` : "/offers/new" }}
      />
    );
  }

  if (offer && offer.createdBy !== user.id) {
    return <Navigate to={`/jobs/${offer.id}`} replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;

    setErrorMessage("");

    if (selectedHiringRegions.length === 0 && hiringCountryCodes.length === 0) {
      setErrorMessage("Choose at least one hiring region or country.");
      return;
    }

    setIsSubmitting(true);

    const parsedTags = Array.from(
      new Set(
        tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      ),
    );
    const publishedTimestamp = publishedAt
      ? new Date(`${publishedAt}T12:00:00`).toISOString()
      : null;

    const offerFields = {
      title: title.trim(),
      company: company.trim(),
      company_country_code: companyCountryCode,
      company_logo_url: companyLogoUrl.trim() || null,
      category,
      location: location.trim(),
      hiring_regions: selectedHiringRegions,
      hiring_country_codes: hiringCountryCodes,
      workplace,
      employment_type: employmentType,
      role_level: roleLevel || null,
      salary: salary.trim() || null,
      tags: parsedTags,
      description: description.trim(),
      source_url: sourceUrl.trim(),
      source_platform: sourcePlatform,
      published_at: publishedTimestamp,
    };

    if (offer) {
      const { error: offerError } = await supabase
        .from("job_offers")
        .update(offerFields)
        .eq("id", offer.id)
        .eq("created_by", user.id);

      if (offerError) {
        setErrorMessage(
          offerError.code === "23505"
            ? "This source URL is already attached to an offer."
            : offerError.message,
        );
        setIsSubmitting(false);
        return;
      }

      const sourceFields = {
        platform: sourcePlatform,
        url: sourceUrl.trim(),
        published_at: publishedTimestamp,
        last_seen_at: new Date().toISOString(),
      };
      const primarySource = offer.sources[0];
      const { error: sourceError } = primarySource
        ? await supabase
            .from("job_offer_sources")
            .update(sourceFields)
            .eq("id", primarySource.id)
            .eq("job_offer_id", offer.id)
        : await supabase.from("job_offer_sources").insert({
            ...sourceFields,
            job_offer_id: offer.id,
            first_seen_at: new Date().toISOString(),
          });

      if (sourceError) {
        setErrorMessage(
          sourceError.code === "23505"
            ? "This source URL is already attached to an offer."
            : sourceError.message,
        );
        setIsSubmitting(false);
        return;
      }

      onOfferSaved();
      navigate(`/jobs/${offer.id}`);
      return;
    }

    const { data: createdOffer, error: offerError } = await supabase
      .from("job_offers")
      .insert({ ...offerFields, created_by: user.id })
      .select("id")
      .single();

    if (offerError || !createdOffer) {
      setErrorMessage(
        offerError?.code === "23505"
          ? "This source URL is already attached to an offer."
          : offerError?.message || "Could not create the offer.",
      );
      setIsSubmitting(false);
      return;
    }

    const now = new Date().toISOString();
    const { error: sourceError } = await supabase
      .from("job_offer_sources")
      .insert({
        job_offer_id: createdOffer.id,
        platform: sourcePlatform,
        url: sourceUrl.trim(),
        published_at: publishedTimestamp,
        first_seen_at: now,
        last_seen_at: now,
      });

    if (sourceError) {
      await supabase.from("job_offers").delete().eq("id", createdOffer.id);
      setErrorMessage(
        sourceError.code === "23505"
          ? "This source URL is already attached to an offer."
          : sourceError.message,
      );
      setIsSubmitting(false);
      return;
    }

    onOfferSaved();
    navigate(`/jobs/${createdOffer.id}`);
  }

  async function handleImport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFetchError("");
    setIsFetching(true);

    try {
      const imported = await importJobOffer(sourceUrl.trim());
      setTitle(imported.title);
      setCompany(imported.company);
      setCompanyCountryCode(imported.companyCountryCode);
      setCompanyLogoUrl(imported.companyLogoUrl);
      setCategory(imported.category);
      setLocation(imported.location);
      setSelectedHiringRegions(
        imported.hiringRegions.filter((region): region is HiringRegion =>
          hiringRegions.some((option) => option.value === region),
        ),
      );
      setHiringCountryCodes(imported.hiringCountryCodes);
      setWorkplace(imported.workplace);
      setEmploymentType(imported.employmentType);
      setRoleLevel(imported.roleLevel);
      setSalary(imported.salary);
      setTags(imported.tags.join(", "));
      setDescription(imported.description);
      setSourcePlatform(imported.sourcePlatform);
      setSourceUrl(imported.sourceUrl);
      setPublishedAt(imported.publishedAt || localDateValue());
      setWasImported(true);
      setShowEditor(true);
    } catch (error) {
      setFetchError(
        error instanceof Error ? error.message : "Could not fetch this job offer.",
      );
    } finally {
      setIsFetching(false);
    }
  }

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-[90rem] border-x border-brandgray-250 bg-white">
        <div className="border-b border-brandgray-250 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to={offer ? `/jobs/${offer.id}` : "/"}
            className="inline-flex items-center gap-2 font-semibold text-brandgray-700 transition hover:text-brand-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-900"
          >
            <ArrowLeftLineIcon aria-hidden="true" width="18" height="18" />
            {isEditing ? "Back to offer" : "Back to offers"}
          </Link>
        </div>

        <div className="border-b border-brandgray-250 px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-brand-500">
            {isEditing ? "Your listing" : "New listing"}
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-brand-950 sm:text-3xl">
            {isEditing ? "Edit job offer" : "Add a job offer"}
          </h1>
        </div>

        {!showEditor ? (
          <section className="border-b border-brandgray-250 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
            <div className="max-w-3xl">
              <h2 className="text-lg font-semibold text-brandgray-900">
                Import from a job offer URL
              </h2>
              <p className="mt-1 text-brandgray-550">
                We&apos;ll fetch the listing details and let you review everything
                before it is added.
              </p>

              <form onSubmit={handleImport} className="mt-6">
                <FormFieldLabel>Job offer URL</FormFieldLabel>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Input
                    type="url"
                    required
                    autoFocus
                    value={sourceUrl}
                    onChange={(event) => setSourceUrl(event.target.value)}
                    placeholder="https://company.com/careers/job"
                  />
                  <Button
                    type="submit"
                    disabled={isFetching}
                    className="shrink-0"
                  >
                    <ExternalLinkLineIcon
                      aria-hidden="true"
                      width="17"
                      height="17"
                    />
                    {isFetching ? "Fetching offer..." : "Fetch offer"}
                  </Button>
                </div>
                {fetchError && (
                  <p className="mt-3 text-sm text-red-700" role="alert">
                    {fetchError}
                  </p>
                )}
              </form>

              <div className="mt-7 border-t border-brandgray-200 pt-5">
                <button
                  type="button"
                  onClick={() => setShowEditor(true)}
                  className="inline-flex items-center gap-2 font-semibold text-brandgray-700 transition hover:text-brand-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-900"
                >
                  <EditPenLineIcon aria-hidden="true" width="17" height="17" />
                  Add manually instead
                </button>
              </div>
            </div>
          </section>
        ) : (
        <form onSubmit={handleSubmit}>
          {wasImported && (
            <div className="flex flex-col gap-3 border-b border-brandgray-250 bg-brand-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
              <p className="text-sm text-brandgray-700">
                <strong className="font-semibold text-brandgray-900">
                  Offer imported.
                </strong>{" "}
                Review the details below and correct anything that was missed.
              </p>
              <button
                type="button"
                onClick={() => {
                  setWasImported(false);
                  setShowEditor(false);
                }}
                className="self-start text-sm font-semibold text-brand-800 underline underline-offset-4 sm:self-auto"
              >
                Import another URL
              </button>
            </div>
          )}
          <FormSection
            icon={
              <BriefcaseLineIcon aria-hidden="true" width="19" height="19" />
            }
            title="Company information"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Company">
                <Input
                  required
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                  placeholder="Company name"
                />
              </Field>
              <Field label="Company country">
                <span className="relative block">
                  {companyCountryCode && (
                    <span className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2">
                      <CountryFlag countryCode={companyCountryCode} />
                    </span>
                  )}
                  <CountrySelect
                    required
                    value={companyCountryCode}
                    onChange={(event) =>
                      setCompanyCountryCode(event.target.value)
                    }
                    className={companyCountryCode ? "pl-11" : ""}
                  />
                </span>
              </Field>
              <div className="sm:col-span-2">
                <Field label="Company logo URL" optional>
                  <Input
                    type="url"
                    value={companyLogoUrl}
                    onChange={(event) => setCompanyLogoUrl(event.target.value)}
                    placeholder="https://company.com/logo.png"
                  />
                </Field>
              </div>
            </div>
          </FormSection>

          <FormSection
            icon={
              <EditPenLineIcon aria-hidden="true" width="19" height="19" />
            }
            title="Job information"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Job title">
                <Input
                  required
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Senior Frontend Engineer"
                />
              </Field>
              <Field label="Role location">
                <span className="relative block">
                  <LocationMarkerLineIcon
                    aria-hidden="true"
                    width="17"
                    height="17"
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brandgray-600"
                  />
                  <Input
                    required
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    className="pl-10"
                    placeholder="Berlin, Germany"
                  />
                </span>
              </Field>
              <Field label="Category">
                <span className="relative block">
                  <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2">
                    <JobCategoryIcon category={category} size={20} />
                  </span>
                  <Select
                    value={category}
                    onChange={(event) =>
                      setCategory(event.target.value as JobCategory)
                    }
                    className="rounded-xl pl-12"
                  >
                    {jobCategories.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                </span>
              </Field>
              <Field label="Role level" optional>
                <Select
                  value={roleLevel}
                  onChange={(event) =>
                    setRoleLevel(event.target.value as RoleLevel | "")
                  }
                >
                  <option value="">Not specified</option>
                  {roleLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </Select>
              </Field>
              <FieldGroup label="Work model">
                <RadioGroup
                  name="workplace"
                  value={workplace}
                  options={["Remote", "Hybrid", "On-site"]}
                  onChange={(value) => setWorkplace(value as typeof workplace)}
                />
              </FieldGroup>
              <FieldGroup label="Contract">
                <RadioGroup
                  name="employmentType"
                  value={employmentType}
                  options={["Full-time", "Contract"]}
                  onChange={(value) =>
                    setEmploymentType(value as typeof employmentType)
                  }
                />
              </FieldGroup>
              <Field label="Compensation" optional>
                <Input
                  value={salary}
                  onChange={(event) => setSalary(event.target.value)}
                  placeholder="EUR 75k–95k"
                />
              </Field>
            </div>
            <Field label="Description">
              <textarea
                required
                rows={12}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Paste or edit the complete job description"
                className="min-h-64 w-full resize-y rounded-xl border border-brandgray-300 bg-white px-3.5 py-3 leading-6 text-brandgray-900 outline-none transition placeholder:text-brandgray-450 focus:border-brand-700 focus:ring-3 focus:ring-lime-400/10"
              />
            </Field>
          </FormSection>

          <FormSection
            icon={<CodeLineIcon aria-hidden="true" width="19" height="19" />}
            title="Technologies"
          >
            <Field label="Technologies" optional>
              <span className="relative block">
                <TagLineIcon
                  aria-hidden="true"
                  width="17"
                  height="17"
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brandgray-600"
                />
                <Input
                  value={tags}
                  onChange={(event) => setTags(event.target.value)}
                  className="pl-10"
                  placeholder="React, TypeScript, PostgreSQL"
                />
              </span>
            </Field>
          </FormSection>

          <FormSection
            icon={<GlobeLineIcon aria-hidden="true" width="19" height="19" />}
            title="Hiring reach"
          >
            <HiringReachField
              regions={selectedHiringRegions}
              countryCodes={hiringCountryCodes}
              onRegionsChange={setSelectedHiringRegions}
              onCountryCodesChange={setHiringCountryCodes}
            />
          </FormSection>

          <FormSection
            icon={
              <ExternalLinkLineIcon aria-hidden="true" width="19" height="19" />
            }
            title="Original source"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Platform">
                <Select
                  value={sourcePlatform}
                  onChange={(event) =>
                    setSourcePlatform(event.target.value as JobSource)
                  }
                >
                  {jobSources.map((source) => (
                    <option key={source} value={source}>
                      {sourceLabels[source]}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Publication date">
                <Input
                  type="date"
                  required
                  max={localDateValue()}
                  value={publishedAt}
                  onChange={(event) => setPublishedAt(event.target.value)}
                />
              </Field>
            </div>
            <Field label="Offer URL">
              <Input
                type="url"
                required
                value={sourceUrl}
                onChange={(event) => setSourceUrl(event.target.value)}
                placeholder="https://company.com/careers/job"
              />
            </Field>
          </FormSection>

          <div className="flex flex-col-reverse gap-3 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <p className="min-h-5 text-sm text-red-800" role="alert">
              {errorMessage}
            </p>
            <div className="flex gap-2">
              <Link
                to={offer ? `/jobs/${offer.id}` : "/"}
                className="inline-flex h-10 items-center justify-center rounded-md border border-brandgray-300 bg-white px-4 font-semibold text-brandgray-750 transition hover:border-brandgray-450 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-900"
              >
                Cancel
              </Link>
              <Button type="submit" disabled={isSubmitting}>
                {isEditing ? (
                  <EditPenLineIcon aria-hidden="true" width="17" height="17" />
                ) : (
                  <PlusLineIcon aria-hidden="true" width="17" height="17" />
                )}
                {isSubmitting
                  ? isEditing
                    ? "Saving changes..."
                    : "Adding offer..."
                  : isEditing
                    ? "Save changes"
                    : "Add job offer"}
              </Button>
            </div>
          </div>
        </form>
        )}
      </main>
      <AppFooter />
    </div>
  );
}

function FormSection({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="grid border-b border-brandgray-250 lg:grid-cols-[14rem_minmax(0,1fr)]">
      <div className="flex items-center gap-2 border-b border-brandgray-200 bg-brandgray-50 px-4 py-4 text-brandgray-800 sm:px-6 lg:items-start lg:border-b-0 lg:border-r lg:px-8 lg:py-7">
        {icon}
        <h2 className="font-semibold">{title}</h2>
      </div>
      <div className="space-y-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-7">
        {children}
      </div>
    </section>
  );
}

function Field({
  label,
  optional = false,
  children,
}: {
  label: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <FormFieldLabel optional={optional}>
        {label}
      </FormFieldLabel>
      {children}
    </label>
  );
}

function FieldGroup({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <fieldset>
      <FormFieldLabel asLegend>{label}</FormFieldLabel>
      {children}
    </fieldset>
  );
}

function FormFieldLabel({
  children,
  optional = false,
  asLegend = false,
}: {
  children: ReactNode;
  optional?: boolean;
  asLegend?: boolean;
}) {
  if (asLegend) {
    return (
      <legend className="mb-2 font-semibold text-brandgray-900">
        {children}
        {optional && (
          <span className="ml-2 text-sm font-normal text-brandgray-500">
            Optional
          </span>
        )}
      </legend>
    );
  }

  return (
    <Label asSpan optional={optional} className="mb-2">
      {children}
    </Label>
  );
}

function HiringReachField({
  regions,
  countryCodes,
  onRegionsChange,
  onCountryCodesChange,
}: {
  regions: HiringRegion[];
  countryCodes: string[];
  onRegionsChange: (regions: HiringRegion[]) => void;
  onCountryCodesChange: (countryCodes: string[]) => void;
}) {
  function toggleRegion(region: HiringRegion) {
    onRegionsChange(
      regions.includes(region)
        ? regions.filter((current) => current !== region)
        : [...regions, region],
    );
  }

  return (
    <fieldset>
      <legend className="sr-only">Hiring reach</legend>
      <p className="text-sm text-brandgray-550">
        Where can candidates be based for this role?
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {hiringRegions.map((region) => {
          const checked = regions.includes(region.value);
          return (
            <label
              key={region.value}
              className={`flex min-h-10 cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold transition focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand-900 ${
                checked
                  ? "border-brand-700 bg-brand-50 text-brand-900"
                  : "border-brandgray-300 bg-white text-brandgray-700 hover:border-brandgray-450"
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleRegion(region.value)}
                className="size-4 accent-brand-900"
              />
              {region.label}
            </label>
          );
        })}
      </div>

      <label className="mt-4 block max-w-sm">
        <FormFieldLabel optional>
          Add specific countries
        </FormFieldLabel>
        <CountrySelect
          value=""
          onChange={(event) => {
            const code = event.target.value;
            if (code && !countryCodes.includes(code)) {
              onCountryCodesChange([...countryCodes, code]);
            }
          }}
          placeholder="Add an eligible country"
        />
      </label>

      {countryCodes.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {countryCodes.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() =>
                onCountryCodesChange(
                  countryCodes.filter((countryCode) => countryCode !== code),
                )
              }
              className="inline-flex items-center gap-2 rounded-md border border-brandgray-300 bg-white px-2.5 py-1.5 text-sm font-medium text-brandgray-750 transition hover:border-red-300 hover:text-red-700"
              aria-label={`Remove ${countryName(code)}`}
            >
              <CountryFlag countryCode={code} />
              {countryName(code)}
              <span aria-hidden="true">×</span>
            </button>
          ))}
        </div>
      )}
    </fieldset>
  );
}
