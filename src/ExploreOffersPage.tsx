import ChevronLeftLineIcon from "@iconify-react/majesticons/chevron-left-line";
import ChevronRightLineIcon from "@iconify-react/majesticons/chevron-right-line";
import { useMemo, useState } from "react";
import AppFooter from "./components/AppFooter";
import AppHeader from "./components/AppHeader";
import Button from "./components/Button";
import JobTypeScroller from "./components/JobTypeScroller";
import Label from "./components/Label";
import SearchInput from "./components/Search";
import Select from "./components/Select";
import JobCard from "./JobCard";
import { countryName } from "./lib/countries";
import {
  jobCategories,
  roleLevels,
  type JobCategory,
  type JobOffer,
  type RoleLevel,
} from "./types/job";

type JobCategoryFilter = "all" | JobCategory;
type RoleLevelFilter = "all" | RoleLevel;
type PageSize = 5 | 10 | 25;
type AvailabilityFilter = "all" | "active" | "gone";

const categoryFilters: { value: JobCategoryFilter; label: string }[] = [
  { value: "all", label: "All" },
  ...jobCategories.map((category) => ({ value: category, label: category })),
];

export default function ExploreOffersPage({
  jobOffers,
  isLoading,
  loadError,
  onRetry,
}: {
  jobOffers: JobOffer[];
  isLoading: boolean;
  loadError: string | null;
  onRetry: () => void;
}) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<JobCategoryFilter>("all");
  const [pageSize, setPageSize] = useState<PageSize>(5);
  const [availability, setAvailability] =
    useState<AvailabilityFilter>("all");
  const [roleLevel, setRoleLevel] = useState<RoleLevelFilter>("all");
  const [companyCountryCode, setCompanyCountryCode] = useState("");
  const [page, setPage] = useState(1);

  const companyCountries = useMemo(
    () =>
      [
        ...new Set(
          jobOffers
            .map((job) => job.companyCountryCode)
            .filter((code): code is string => Boolean(code)),
        ),
      ]
        .map((code) => ({ code, label: countryName(code) }))
        .sort((first, second) => first.label.localeCompare(second.label)),
    [jobOffers],
  );

  const filteredOffers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return jobOffers.filter((job) => {
      const matchesSearch =
        !normalizedQuery ||
        [
          job.title,
          job.company,
          job.companyCountryCode,
          job.companyCountryCode ? countryName(job.companyCountryCode) : null,
          job.location,
          job.workplace,
          job.category,
          job.roleLevel,
          job.type,
          ...job.tags,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesCategory =
        activeCategory === "all" || job.category === activeCategory;
      const matchesAvailability =
        availability === "all" ||
        (availability === "gone" ? job.isGone : !job.isGone);
      const matchesRoleLevel =
        roleLevel === "all" || job.roleLevel === roleLevel;
      const matchesCompanyCountry =
        !companyCountryCode ||
        job.companyCountryCode === companyCountryCode;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesAvailability &&
        matchesRoleLevel &&
        matchesCompanyCountry
      );
    });
  }, [
    activeCategory,
    availability,
    companyCountryCode,
    jobOffers,
    query,
    roleLevel,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredOffers.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const firstOfferIndex = (currentPage - 1) * pageSize;
  const visibleOffers = filteredOffers.slice(
    firstOfferIndex,
    firstOfferIndex + pageSize,
  );

  function changePage(nextPage: number) {
    setPage(Math.min(totalPages, Math.max(1, nextPage)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-[90rem] border-x border-brandgray-250 bg-white">
        <header className="border-b border-brandgray-250 bg-brandgray-50 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <p className="text-sm font-semibold text-brand-500">Job offers</p>
          <h1 className="mt-1 text-2xl font-semibold text-brand-950 sm:text-3xl">
            Explore opportunities
          </h1>
          <p className="mt-2 max-w-2xl leading-6 text-brandgray-600">
            Search community-posted roles and compare hiring signals before you
            apply.
          </p>
        </header>

        <section
          aria-label="Search and filter jobs"
          className="px-4 pb-6 pt-7 sm:px-6 lg:px-8"
        >
          <div className="mb-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_12rem_16rem] md:items-end">
            <SearchInput
              query={query}
              setQuery={(nextQuery) => {
                setQuery(nextQuery);
                setPage(1);
              }}
            />
            <div>
              <Label htmlFor="role-level-filter" className="mb-1 text-xs">
                Role level
              </Label>
              <Select
                id="role-level-filter"
                value={roleLevel}
                onChange={(event) => {
                  setRoleLevel(event.target.value as RoleLevelFilter);
                  setPage(1);
                }}
              >
                <option value="all">All levels</option>
                {roleLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="company-country-filter" className="mb-1 text-xs">
                Company country
              </Label>
              <Select
                id="company-country-filter"
                value={companyCountryCode}
                onChange={(event) => {
                  setCompanyCountryCode(event.target.value);
                  setPage(1);
                }}
              >
                <option value="">All countries</option>
                {companyCountries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <JobTypeScroller
            options={categoryFilters}
            value={activeCategory}
            onValueChange={(category) => {
              setActiveCategory(category as JobCategoryFilter);
              setPage(1);
            }}
          />
        </section>

        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-brandgray-250 px-4 pb-4 sm:px-6 lg:px-8">
          <div>
            <p className="font-semibold text-brandgray-900">
              {isLoading
                ? "Loading offers..."
                : `${filteredOffers.length} ${filteredOffers.length === 1 ? "offer" : "offers"}`}
            </p>
            {!isLoading && filteredOffers.length > 0 && (
              <p className="mt-1 text-xs text-brandgray-500">
                Showing {firstOfferIndex + 1}-
                {Math.min(firstOfferIndex + pageSize, filteredOffers.length)}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <div className="w-36">
              <Label htmlFor="offer-availability" className="mb-1 text-xs">
                Status
              </Label>
              <Select
                id="offer-availability"
                variant="compact"
                value={availability}
                onChange={(event) => {
                  setAvailability(event.target.value as AvailabilityFilter);
                  setPage(1);
                }}
              >
                <option value="all">All offers</option>
                <option value="active">Active</option>
                <option value="gone">Gone</option>
              </Select>
            </div>
            <div className="w-28">
              <Label htmlFor="offers-per-page" className="mb-1 text-xs">
                Per page
              </Label>
              <Select
                id="offers-per-page"
                variant="compact"
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value) as PageSize);
                  setPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </Select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div aria-label="Loading job offers">
            {Array.from({ length: pageSize }, (_, index) => (
              <div
                key={index}
                className="h-52 animate-pulse border-b border-brandgray-200 bg-brandgray-50"
              />
            ))}
          </div>
        ) : loadError ? (
          <div className="border-b border-brandgray-250 py-16 text-center">
            <h2 className="font-semibold text-brandgray-900">
              Couldn&apos;t load offers
            </h2>
            <p className="mx-auto mt-1 max-w-md text-brandgray-550">
              {loadError}
            </p>
            <Button className="mt-5" onClick={onRetry}>
              Try again
            </Button>
          </div>
        ) : visibleOffers.length > 0 ? (
          <div>
            {visibleOffers.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="border-b border-brandgray-250 py-16 text-center">
            <h2 className="font-semibold text-brandgray-900">
              No matching offers
            </h2>
            <p className="mt-1 text-brandgray-550">
              Try another search or adjust the filters.
            </p>
          </div>
        )}

        {!isLoading && !loadError && filteredOffers.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={changePage}
          />
        )}
      </main>
      <AppFooter />
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <nav
      aria-label="Job offers pagination"
      className="flex items-center justify-between gap-4 px-4 py-6 sm:px-6 lg:px-8"
    >
      <Button
        variant="secondary"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeftLineIcon aria-hidden="true" width="17" height="17" />
        Previous
      </Button>
      <div className="flex items-center gap-1" aria-label="Pages">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? "page" : undefined}
              aria-label={`Page ${page}`}
              className={`grid size-9 place-items-center rounded-md text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-900 ${
                page === currentPage
                  ? "bg-brand-900 text-white"
                  : "text-brandgray-600 hover:bg-brandgray-100 hover:text-brandgray-900"
              }`}
            >
              {page}
            </button>
          ),
        )}
      </div>
      <Button
        variant="secondary"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
        <ChevronRightLineIcon aria-hidden="true" width="17" height="17" />
      </Button>
    </nav>
  );
}
