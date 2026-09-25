import ArrowLeftLineIcon from "@iconify-react/majesticons/arrow-left-line";
import BriefcaseLineIcon from "@iconify-react/majesticons/briefcase-line";
import CalendarLineIcon from "@iconify-react/majesticons/calendar-line";
import ExternalLinkLineIcon from "@iconify-react/majesticons/external-link-line";
import LocationMarkerLineIcon from "@iconify-react/majesticons/location-marker-line";
import PlusLineIcon from "@iconify-react/majesticons/plus-line";
import TagLineIcon from "@iconify-react/majesticons/tag-line";
import { useState, type FormEvent, type ReactNode } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./auth/useAuth";
import AppHeader from "./components/AppHeader";
import AppFooter from "./components/AppFooter";
import Button from "./components/Button";
import Input from "./components/Input";
import JobCategoryIcon from "./components/JobCategoryIcon";
import Label from "./components/Label";
import Select from "./components/Select";
import { supabase } from "./lib/supabase";
import {
  jobCategories,
  jobSources,
  type JobCategory,
  type JobSource,
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

type AddOfferPageProps = {
  onOfferCreated: () => void;
};

export default function AddOfferPage({ onOfferCreated }: AddOfferPageProps) {
  const { user, isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [companyLogoUrl, setCompanyLogoUrl] = useState("");
  const [category, setCategory] = useState<JobCategory>("JavaScript");
  const [location, setLocation] = useState("");
  const [workplace, setWorkplace] = useState<"Remote" | "Hybrid" | "On-site">(
    "Remote",
  );
  const [employmentType, setEmploymentType] = useState<
    "Full-time" | "Contract"
  >("Full-time");
  const [salary, setSalary] = useState("");
  const [tags, setTags] = useState("");
  const [sourcePlatform, setSourcePlatform] = useState<JobSource>(
    "company_career_page",
  );
  const [sourceUrl, setSourceUrl] = useState("");
  const [publishedAt, setPublishedAt] = useState(localDateValue());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (isAuthLoading) {
    return (
      <div className="min-h-screen">
        <AppHeader />
        <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-6xl border-x border-brandgray-250 bg-white px-4 py-10 sm:px-6 lg:px-8">
          <div className="h-8 w-52 animate-pulse bg-brandgray-150" />
          <div className="mt-8 h-96 animate-pulse bg-brandgray-50" />
        </main>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: "/offers/new" }} />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
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

    const { data: offer, error: offerError } = await supabase
      .from("job_offers")
      .insert({
        title: title.trim(),
        company: company.trim(),
        company_logo_url: companyLogoUrl.trim() || null,
        category,
        location: location.trim(),
        workplace,
        employment_type: employmentType,
        salary: salary.trim() || null,
        tags: parsedTags,
        source_url: sourceUrl.trim(),
        source_platform: sourcePlatform,
        published_at: publishedTimestamp,
      })
      .select("id")
      .single();

    if (offerError || !offer) {
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
        job_offer_id: offer.id,
        platform: sourcePlatform,
        url: sourceUrl.trim(),
        published_at: publishedTimestamp,
        first_seen_at: now,
        last_seen_at: now,
      });

    if (sourceError) {
      await supabase.from("job_offers").delete().eq("id", offer.id);
      setErrorMessage(
        sourceError.code === "23505"
          ? "This source URL is already attached to an offer."
          : sourceError.message,
      );
      setIsSubmitting(false);
      return;
    }

    onOfferCreated();
    navigate(`/jobs/${offer.id}`);
  }

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-6xl border-x border-brandgray-250 bg-white">
        <div className="border-b border-brandgray-250 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-semibold text-brandgray-700 transition hover:text-brand-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-900"
          >
            <ArrowLeftLineIcon aria-hidden="true" width="18" height="18" />
            Back to offers
          </Link>
        </div>

        <div className="border-b border-brandgray-250 px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-brand-500">New listing</p>
          <h1 className="mt-1 text-2xl font-semibold text-brand-950 sm:text-3xl">
            Add a job offer
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <FormSection
            icon={
              <BriefcaseLineIcon aria-hidden="true" width="19" height="19" />
            }
            title="Role details"
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
              <Field label="Company">
                <Input
                  required
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                  placeholder="Company name"
                />
              </Field>
              <Field label="Location">
                <span className="relative block">
                  <LocationMarkerLineIcon
                    aria-hidden="true"
                    width="17"
                    height="17"
                    className="pointer-events-none absolute left-3.5 top-[1.55rem] text-brandgray-600"
                  />
                  <Input
                    required
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    className="mt-2 pl-10"
                    placeholder="Berlin, Germany"
                  />
                </span>
              </Field>
              <Field label="Category">
                <span className="relative block">
                  <span className="pointer-events-none absolute left-3 top-[1.4rem] z-10">
                    <JobCategoryIcon category={category} size={20} />
                  </span>
                  <Select
                    value={category}
                    onChange={(event) =>
                      setCategory(event.target.value as JobCategory)
                    }
                    className="mt-2 rounded-xl pl-12"
                  >
                    {jobCategories.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                </span>
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
              <Field label="Company logo URL" optional>
                <Input
                  type="url"
                  value={companyLogoUrl}
                  onChange={(event) => setCompanyLogoUrl(event.target.value)}
                  placeholder="https://company.com/logo.png"
                />
              </Field>
            </div>
            <Field label="Technologies" optional>
              <span className="relative block">
                <TagLineIcon
                  aria-hidden="true"
                  width="17"
                  height="17"
                  className="pointer-events-none absolute left-3.5 top-[1.55rem] text-brandgray-600"
                />
                <Input
                  value={tags}
                  onChange={(event) => setTags(event.target.value)}
                  className="mt-2 pl-10"
                  placeholder="React, TypeScript, PostgreSQL"
                />
              </span>
            </Field>
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
                  className="mt-2"
                >
                  {jobSources.map((source) => (
                    <option key={source} value={source}>
                      {sourceLabels[source]}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Publication date">
                <span className="relative block">
                  <CalendarLineIcon
                    aria-hidden="true"
                    width="17"
                    height="17"
                    className="pointer-events-none absolute left-3.5 top-[1.55rem] text-brandgray-600"
                  />
                  <Input
                    type="date"
                    required
                    max={localDateValue()}
                    value={publishedAt}
                    onChange={(event) => setPublishedAt(event.target.value)}
                    className="mt-2 pl-10"
                  />
                </span>
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
                to="/"
                className="inline-flex h-10 items-center justify-center rounded-md border border-brandgray-300 bg-white px-4 font-semibold text-brandgray-750 transition hover:border-brandgray-450 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-900"
              >
                Cancel
              </Link>
              <Button type="submit" disabled={isSubmitting}>
                <PlusLineIcon aria-hidden="true" width="17" height="17" />
                {isSubmitting ? "Adding offer..." : "Add job offer"}
              </Button>
            </div>
          </div>
        </form>
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
      <Label asSpan optional={optional}>
        {label}
      </Label>
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
      <legend className="font-semibold text-brandgray-900">{label}</legend>
      {children}
    </fieldset>
  );
}

function RadioGroup({
  name,
  value,
  options,
  onChange,
}: {
  name: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <span className="mt-2 text-lime-900 flex flex-row verflow-hidden rounded-xl border border-brandgray-100 bg-brandgray-100 p-px">
      {options.map((option) => (
        <label
          key={option}
          className={`relative flex h-10 flex-1 cursor-pointer items-center justify-center px-2 text-center text-sm font-semibold transition rounded-xl ${
            value === option
              ? "z-10 bg-lime-400 "
              : "text-brandgray-700 hover:bg-lime-200 text-gray-400 hover:text-gray-900"
          }`}
        >
          <input
            type="radio"
            name={name}
            value={option}
            checked={value === option}
            onChange={() => onChange(option)}
            className="sr-only"
          />
          {option}
        </label>
      ))}
    </span>
  );
}
