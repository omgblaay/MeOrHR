import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppHeader from "./components/AppHeader";
import Button from "./components/Button";
import JobTypeScroller from "./components/JobTypeScroller";
import SearchInput from "./components/Search";
import { supabase } from "./lib/supabase";
import JobCard from "./JobCard";
import JobOfferPage from "./JobOfferPage";
import LoginPage from "./LoginPage";
import {
  jobCategories,
  type JobCategory,
  type JobOffer,
  type JobOfferSource,
  type JobSource,
} from "./types/job";

type JobCategoryFilter = "all" | JobCategory;

type JobOfferRow = {
  id: number;
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
  offer_applicants?: number;
  median_days_to_reply?: number | null;
  median_days_reply_to_interview?: number | null;
  median_days_interview_to_offer?: number | null;
  contacted_hr_applicants: number;
  linkedin_connection_applicants: number;
  additional_email_applicants: number;
  response_rate: number;
  applied: boolean;
  responded: boolean;
  job_offer_sources: JobOfferSourceRow[];
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
  "#173f35",
  "#e85d3f",
  "#3568d4",
  "#a15c9c",
  "#278b83",
  "#8b6239",
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

  return {
    id: row.id,
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
    posted: formatPostedAt(row.published_at),
    updated: formatPostedAt(row.updated_at),
    confirmedApplicants: row.confirmed_applicants ?? row.applicants,
    sourceClicks: sources.reduce(
      (total, source) => total + source.clickCount,
      0,
    ),
    repliedApplicants: row.replied_applicants ?? 0,
    nextInterviewApplicants: row.next_interview_applicants ?? 0,
    offerApplicants:
      row.offer_applicants ?? Math.floor((row.next_interview_applicants ?? 0) / 4),
    medianDaysToReply:
      row.median_days_to_reply ?? (row.replied_applicants > 0 ? 6 : null),
    medianDaysReplyToInterview:
      row.median_days_reply_to_interview ??
      (row.next_interview_applicants > 0 ? 5 : null),
    medianDaysInterviewToOffer:
      row.median_days_interview_to_offer ??
      (row.next_interview_applicants > 0 ? 4 : null),
    contactedHrApplicants: row.contacted_hr_applicants ?? 0,
    linkedinConnectionApplicants: row.linkedin_connection_applicants ?? 0,
    additionalEmailApplicants: row.additional_email_applicants ?? 0,
    responseRate: row.response_rate,
    applied: row.applied,
    responded: row.responded,
  };
}

const categoryFilters: { value: JobCategoryFilter; label: string }[] = [
  { value: "all", label: "All" },
  ...jobCategories.map((category) => ({ value: category, label: category })),
];

function App() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<JobCategoryFilter>("all");
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
        .select("*, job_offer_sources(*)")
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

  const filteredJobs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return jobOffers.filter((job) => {
      const matchesSearch =
        !normalizedQuery ||
        [
          job.title,
          job.company,
          job.location,
          job.workplace,
          job.category,
          job.type,
          ...job.tags,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      const matchesFilter =
        activeCategory === "all" || job.category === activeCategory;

      return matchesSearch && matchesFilter;
    });
  }, [activeCategory, jobOffers, query]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="min-h-screen">
            <AppHeader />

            <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-6xl border-x border-[#dfe3dd] bg-white py-9 sm:py-12">
              <section
                aria-label="Search and filter jobs"
                className="mb-6 px-4 sm:px-6 lg:px-8"
              >
                <SearchInput query={query} setQuery={setQuery} />
                <JobTypeScroller
                  options={categoryFilters}
                  value={activeCategory}
                  onValueChange={(category) =>
                    setActiveCategory(category as JobCategoryFilter)
                  }
                />
              </section>

              <div className="flex items-center justify-between border-b border-[#dfe3dd] px-4 pb-3 sm:px-6 lg:px-8">
                <p className=" font-semibold text-[#27322c]">
                  {isLoading
                    ? "Loading offers..."
                    : `${filteredJobs.length} ${filteredJobs.length === 1 ? "offer" : "offers"}`}
                </p>
                <p className="text-xs text-[#7a847e]">Newest first</p>
              </div>

              {isLoading ? (
                <div aria-label="Loading job offers">
                  {[0, 1, 2].map((placeholder) => (
                    <div
                      key={placeholder}
                      className="h-52 animate-pulse border-b border-[#e4e8e3] bg-[#f5f7f4]"
                    />
                  ))}
                </div>
              ) : loadError ? (
                <div className="border-b border-[#dfe3dd] py-16 text-center">
                  <h2 className="text-base font-semibold text-[#28332d]">
                    Couldn&apos;t load offers
                  </h2>
                  <p className="mx-auto mt-1 max-w-md  text-[#707b74]">
                    {loadError}
                  </p>
                  <Button
                    className="mt-5"
                    onClick={() => setReloadToken((token) => token + 1)}
                  >
                    Try again
                  </Button>
                </div>
              ) : filteredJobs.length > 0 ? (
                <div>
                  {filteredJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              ) : (
                <div className="border-b border-[#dfe3dd] py-16 text-center">
                  <h2 className="text-base font-semibold text-[#28332d]">
                    No matching offers
                  </h2>
                  <p className="mt-1  text-[#707b74]">
                    Try another search or filter.
                  </p>
                </div>
              )}
            </main>
          </div>
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
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
