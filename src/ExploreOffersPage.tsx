import { useMemo, useState } from "react";
import AppFooter from "./components/AppFooter";
import AppHeader from "./components/AppHeader";
import Button from "./components/Button";
import JobTypeScroller from "./components/JobTypeScroller";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectEmpty,
  MultiSelectInput,
  MultiSelectItem,
  MultiSelectList,
  MultiSelectTrigger,
  MultiSelectValue,
} from "./components/motion/multi-select";
import Pagination, { type PageSize } from "./components/Pagination";
import RadioGroup from "./components/RadioGroup";
import SearchInput from "./components/Search";
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
  const [availability, setAvailability] = useState<AvailabilityFilter>("all");
  const [selectedRoleLevels, setSelectedRoleLevels] = useState<RoleLevel[]>([]);
  const [selectedCompanyCountries, setSelectedCompanyCountries] = useState<
    string[]
  >([]);
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
        selectedRoleLevels.length === 0 ||
        (job.roleLevel !== null && selectedRoleLevels.includes(job.roleLevel));
      const matchesCompanyCountry =
        selectedCompanyCountries.length === 0 ||
        (job.companyCountryCode !== null &&
          selectedCompanyCountries.includes(job.companyCountryCode));

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
    jobOffers,
    query,
    selectedCompanyCountries,
    selectedRoleLevels,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredOffers.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const firstOfferIndex = (currentPage - 1) * pageSize;
  const visibleOffers = filteredOffers.slice(
    firstOfferIndex,
    firstOfferIndex + pageSize,
  );

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
          <div className="mb-4 grid gap-3 md:grid-cols-[minmax(5rem,1fr)_20rem_20rem] md:items-end">
            <SearchInput
              query={query}
              setQuery={(nextQuery) => {
                setQuery(nextQuery);
                setPage(1);
              }}
            />
            <MultiSelect
              value={selectedRoleLevels}
              onValueChange={(values) => {
                setSelectedRoleLevels(values as RoleLevel[]);
                setPage(1);
              }}
            >
              <MultiSelectTrigger className="min-w-0 border-brandgray-300 bg-white text-brandgray-900 hover:border-brandgray-450 focus-within:ring-brand-700/10">
                <MultiSelectValue placeholder="All levels" />
                <MultiSelectInput aria-label="Search role levels" />
              </MultiSelectTrigger>
              <MultiSelectContent>
                <MultiSelectList ariaLabel="Role levels">
                  {roleLevels.map((level) => (
                    <MultiSelectItem
                      key={level}
                      value={level}
                      textValue={level}
                    >
                      {level}
                    </MultiSelectItem>
                  ))}
                  <MultiSelectEmpty>No levels found.</MultiSelectEmpty>
                </MultiSelectList>
              </MultiSelectContent>
            </MultiSelect>

            <MultiSelect
              value={selectedCompanyCountries}
              onValueChange={(values) => {
                setSelectedCompanyCountries(values);
                setPage(1);
              }}
            >
              <MultiSelectTrigger className="min-w-0 border-brandgray-300 bg-white text-brandgray-900 hover:border-brandgray-450 focus-within:ring-brand-700/10">
                <MultiSelectValue placeholder="All countries" />
                <MultiSelectInput aria-label="Search company countries" />
              </MultiSelectTrigger>
              <MultiSelectContent>
                <MultiSelectList ariaLabel="Company countries">
                  {companyCountries.map((country) => (
                    <MultiSelectItem
                      key={country.code}
                      value={country.code}
                      textValue={country.label}
                    >
                      {country.label}
                    </MultiSelectItem>
                  ))}
                  <MultiSelectEmpty>No countries found.</MultiSelectEmpty>
                </MultiSelectList>
              </MultiSelectContent>
            </MultiSelect>
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
            <div className="w-64">
              <RadioGroup
                name="offer-availability"
                value={
                  availability === "all"
                    ? "All"
                    : availability === "active"
                      ? "Active"
                      : "Gone"
                }
                options={["All", "Active", "Gone"]}
                onChange={(option) => {
                  setAvailability(option.toLowerCase() as AvailabilityFilter);
                  setPage(1);
                }}
              />
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
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(nextPageSize) => {
              setPageSize(nextPageSize);
              setPage(1);
            }}
          />
        )}
      </main>
      <AppFooter />
    </div>
  );
}
a;
