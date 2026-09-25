import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import AppHeader from "./components/AppHeader";
import AddOfferPage from "./AddOfferPage";
import EditOfferPage from "./EditOfferPage";
import ExploreOffersPage from "./ExploreOffersPage";
import AppFooter from "./components/AppFooter";
import Button from "./components/Button";
import HomeHero, { AboutJobRater } from "./components/HomeIntro";
import PageMetadata from "./components/PageMetadata";
import { supabase } from "./lib/supabase";
import {
  offerFlagChangedEvent,
  type OfferFlagChangedDetail,
} from "./lib/offerFlags";
import JobCard from "./JobCard";
import JobOfferPage from "./JobOfferPage";
import LoginPage from "./LoginPage";
import LegalPage from "./LegalPage";
import MyOffersPage from "./MyOffersPage";
import SettingsPage from "./SettingsPage";
import ApplicationBoardPage from "./ApplicationBoardPage";
import {
  type JobCategory,
  type JobOffer,
  type JobOfferSource,
  type JobSource,
} from "./types/job";

type JobOfferRow = {
  id: number;
  created_by: string | null;
  created_at: string;
  title: string;
  company: string;
  company_logo_url: string | null;
  category: JobCategory;
  location: string;
  workplace: JobOffer["workplace"];
  employment_type: JobOffer["type"];
  salary: string | null;
  tags: string[];
  source_url: string | null;
  source_platform: JobSource;
  published_at: string | null;
  updated_at: string;
  applicants: number;
  confirmed_applicants: number;
  replied_applicants: number;
  next_interview_applicants: number;
  applicants_older_than_30_days?: number;
  no_reply_after_30_days_applicants?: number;
  median_days_to_reply?: number | null;
  median_days_reply_to_interview?: number | null;
  contacted_hr_applicants: number;
  linkedin_connection_applicants: number;
  additional_email_applicants: number;
  response_rate: number;
  applied: boolean;
  responded: boolean;
  job_offer_sources: JobOfferSourceRow[];
  job_offer_flags: JobOfferFlagRow[];
};

type JobOfferFlagRow = {
  flag: "talent_pool" | "gone";
};

type JobOfferSourceRow = {
  id: number;
  platform: JobSource;
  url: string;
  published_at: string | null;
  first_seen_at: string;
  last_seen_at: string;
  closed_at: string | null;
  click_count: number;
};

const logoColors = [
  "var(--color-brand-900)",
  "var(--color-orange-500)",
  "var(--color-blue-500)",
  "var(--color-purple-400)",
  "var(--color-teal-500)",
  "var(--color-amber-800)",
];

function getInitials(company: string) {
  return company
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getLogoColor(company: string) {
  const colorIndex =
    [...company].reduce(
      (total, character) => total + character.charCodeAt(0),
      0,
    ) % logoColors.length;
  return logoColors[colorIndex];
}

function formatPostedAt(value: string | null) {
  if (!value) return "Recently";

  const elapsedMilliseconds = Math.max(
    0,
    Date.now() - new Date(value).getTime(),
  );
  const elapsedHours = Math.floor(elapsedMilliseconds / 3_600_000);

  if (elapsedHours < 1) return "Just now";
  if (elapsedHours < 24) return `${elapsedHours}h ago`;

  const elapsedDays = Math.floor(elapsedHours / 24);
  return `${elapsedDays}d ago`;
}

function mapJobOffer(row: JobOfferRow): JobOffer {
  const sources: JobOfferSource[] = (row.job_offer_sources ?? []).map(
    (source) => ({
      id: source.id,
      platform: source.platform,
      url: source.url,
      publishedAt: source.published_at,
      firstSeenAt: source.first_seen_at,
      lastSeenAt: source.last_seen_at,
      closedAt: source.closed_at,
      clickCount: source.click_count,
    }),
  );
  const confirmedApplicants = row.confirmed_applicants ?? row.applicants;
  const offerIsOlderThan30Days = Boolean(
    row.published_at &&
      Date.now() - new Date(row.published_at).getTime() >= 30 * 86_400_000,
  );
  const applicantsOlderThan30Days =
    row.applicants_older_than_30_days ??
    (offerIsOlderThan30Days ? confirmedApplicants : 0);
  const talentPoolReports = (row.job_offer_flags ?? []).filter(
    (flag) => flag.flag === "talent_pool",
  ).length;
  const goneReports = (row.job_offer_flags ?? []).filter(
    (flag) => flag.flag === "gone",
  ).length;
  const allSourcesClosed = Boolean(
    sources.length > 0 && sources.every((source) => source.closedAt),
  );

  return {
    id: row.id,
    createdBy: row.created_by ?? null,
    createdAt: row.created_at,
    title: row.title,
    company: row.company,
    companyLogoUrl: row.company_logo_url,
    initials: getInitials(row.company),
    logoColor: getLogoColor(row.company),
    location: row.location,
    workplace: row.workplace,
    category: row.category,
    type: row.employment_type,
    salary: row.salary,
    tags: row.tags,
    sourceUrl: row.source_url,
    sourcePlatform: row.source_platform ?? "other",
    sources,
    publishedAt: row.published_at,
    posted: formatPostedAt(row.published_at),
    updated: formatPostedAt(row.updated_at),
    confirmedApplicants,
    sourceClicks: sources.reduce(
      (total, source) => total + source.clickCount,
      0,
    ),
    repliedApplicants: row.replied_applicants ?? 0,
    nextInterviewApplicants: row.next_interview_applicants ?? 0,
    applicantsOlderThan30Days,
    noReplyAfter30DaysApplicants:
      row.no_reply_after_30_days_applicants ??
      (offerIsOlderThan30Days
        ? Math.max(0, confirmedApplicants - (row.replied_applicants ?? 0))
        : 0),
    medianDaysToReply:
      row.median_days_to_reply ?? (row.replied_applicants > 0 ? 6 : null),
    medianDaysReplyToInterview:
      row.median_days_reply_to_interview ??
      (row.next_interview_applicants > 0 ? 5 : null),
    talentPoolReports,
    goneReports,
    isGone: goneReports > 0 || allSourcesClosed,
    contactedHrApplicants: row.contacted_hr_applicants ?? 0,
    linkedinConnectionApplicants: row.linkedin_connection_applicants ?? 0,
    additionalEmailApplicants: row.additional_email_applicants ?? 0,
    responseRate: row.response_rate,
    applied: row.applied,
    responded: row.responded,
  };
}

function App() {
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let isCurrentRequest = true;

    async function loadJobOffers() {
      setIsLoading(true);
      setLoadError(null);

      const { data, error } = await supabase
        .from("job_offers")
        .select("*, job_offer_sources(*), job_offer_flags(flag)")
        .order("published_at", { ascending: false, nullsFirst: false });

      if (!isCurrentRequest) return;

      if (error) {
        setLoadError(error.message);
        setIsLoading(false);
        return;
      }

      setJobOffers(((data ?? []) as JobOfferRow[]).map(mapJobOffer));
      setIsLoading(false);
    }

    loadJobOffers();

    return () => {
      isCurrentRequest = false;
    };
  }, [reloadToken]);

  useEffect(() => {
    const updateOfferFlags = (event: Event) => {
      const { jobId, flag, selected } = (
        event as CustomEvent<OfferFlagChangedDetail>
      ).detail;

      setJobOffers((offers) =>
        offers.map((offer) => {
          if (offer.id !== jobId) return offer;

          const change = selected ? 1 : -1;
          const talentPoolReports =
            flag === "talent_pool"
              ? Math.max(0, offer.talentPoolReports + change)
              : offer.talentPoolReports;
          const goneReports =
            flag === "gone"
              ? Math.max(0, offer.goneReports + change)
              : offer.goneReports;
          const allSourcesClosed = Boolean(
            offer.sources.length > 0 &&
              offer.sources.every((source) => source.closedAt),
          );

          return {
            ...offer,
            talentPoolReports,
            goneReports,
            isGone: goneReports > 0 || allSourcesClosed,
          };
        }),
      );
    };

    window.addEventListener(offerFlagChangedEvent, updateOfferFlags);
    return () =>
      window.removeEventListener(offerFlagChangedEvent, updateOfferFlags);
  }, []);

  return (
    <>
      <PageMetadata jobOffers={jobOffers} />
      <Routes>
      <Route
        path="/"
        element={
          <div className="min-h-screen">
            <AppHeader />

            <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-[90rem] border-x border-brandgray-250 bg-white">
              <HomeHero jobOffers={jobOffers} isLoading={isLoading} />

              <section
                id="offers"
                aria-labelledby="latest-offers-title"
                className="scroll-mt-4"
              >
                <div className="flex items-end justify-between gap-4 border-b border-brandgray-250 px-4 py-5 sm:px-6 lg:px-8">
                  <div>
                    <p className="text-sm font-semibold text-brand-500">
                      Fresh opportunities
                    </p>
                    <h2
                      id="latest-offers-title"
                      className="mt-1 text-xl font-semibold text-brandgray-900"
                    >
                      Latest job offers
                    </h2>
                  </div>
                  <Link
                    to="/explore"
                    className="shrink-0 font-semibold text-brand-900 underline decoration-brandgray-300 underline-offset-4 transition hover:decoration-brand-900"
                  >
                    Explore all
                  </Link>
                </div>

                {isLoading ? (
                  <div aria-label="Loading latest job offers">
                    {[0, 1, 2].map((placeholder) => (
                      <div
                        key={placeholder}
                        className="h-52 animate-pulse border-b border-brandgray-200 bg-brandgray-50"
                      />
                    ))}
                  </div>
                ) : loadError ? (
                  <div className="border-b border-brandgray-250 py-16 text-center">
                    <h3 className="font-semibold text-brandgray-900">
                      Couldn&apos;t load offers
                    </h3>
                    <p className="mx-auto mt-1 max-w-md text-brandgray-550">
                      {loadError}
                    </p>
                    <Button
                      className="mt-5"
                      onClick={() => setReloadToken((token) => token + 1)}
                    >
                      Try again
                    </Button>
                  </div>
                ) : jobOffers.length > 0 ? (
                  <div>
                    {jobOffers.slice(0, 3).map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>
                ) : (
                  <div className="border-b border-brandgray-250 py-16 text-center">
                    <h3 className="font-semibold text-brandgray-900">
                      No offers yet
                    </h3>
                    <p className="mt-1 text-brandgray-550">
                      Be the first person to add one.
                    </p>
                  </div>
                )}
              </section>

              <AboutJobRater />
            </main>
            <AppFooter />
          </div>
        }
      />
      <Route
        path="/explore"
        element={
          <ExploreOffersPage
            jobOffers={jobOffers}
            isLoading={isLoading}
            loadError={loadError}
            onRetry={() => setReloadToken((token) => token + 1)}
          />
        }
      />
      <Route
        path="/jobs/:jobId"
        element={
          <JobOfferPage
            jobOffers={jobOffers}
            isLoading={isLoading}
            loadError={loadError}
            onRetry={() => setReloadToken((token) => token + 1)}
          />
        }
      />
      <Route
        path="/offers/new"
        element={
          <AddOfferPage
            onOfferSaved={() => {
              setIsLoading(true);
              setReloadToken((token) => token + 1);
            }}
          />
        }
      />
      <Route
        path="/jobs/:jobId/edit"
        element={
          <EditOfferPage
            jobOffers={jobOffers}
            isLoading={isLoading}
            onOfferSaved={() => {
              setIsLoading(true);
              setReloadToken((token) => token + 1);
            }}
          />
        }
      />
      <Route
        path="/my-offers"
        element={
          <MyOffersPage jobOffers={jobOffers} isLoading={isLoading} />
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route
        path="/applications"
        element={
          <ApplicationBoardPage
            jobOffers={jobOffers}
            isLoading={isLoading}
          />
        }
      />
      <Route path="/terms" element={<LegalPage type="terms" />} />
      <Route path="/privacy" element={<LegalPage type="privacy" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
