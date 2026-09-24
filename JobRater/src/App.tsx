import { useMemo, useState } from 'react'
import AdjustmentsLineIcon from '@iconify-react/majesticons/adjustments-line'
import ApplicationsLineIcon from '@iconify-react/majesticons/applications-line'
import BriefcaseIcon from '@iconify-react/majesticons/briefcase'
import BriefcaseLineIcon from '@iconify-react/majesticons/briefcase-line'
import CheckLineIcon from '@iconify-react/majesticons/check-line'
import ClockLineIcon from '@iconify-react/majesticons/clock-line'
import ExternalLinkLineIcon from '@iconify-react/majesticons/external-link-line'
import LocationMarkerLineIcon from '@iconify-react/majesticons/location-marker-line'
import SearchLineIcon from '@iconify-react/majesticons/search-line'
import UsersLineIcon from '@iconify-react/majesticons/users-line'
import Button from './components/Button'
import { ToggleGroup, ToggleGroupItem } from './components/ToggleGroup'

type JobStatus = 'all' | 'remote' | 'applied' | 'responded'

type JobOffer = {
  id: number
  title: string
  company: string
  initials: string
  logoColor: string
  location: string
  workplace: 'Remote' | 'Hybrid' | 'On-site'
  type: 'Full-time' | 'Contract'
  salary: string
  tags: string[]
  posted: string
  applicants: number
  responseRate: number
  applied: boolean
  responded: boolean
}

const jobOffers: JobOffer[] = [
  {
    id: 1,
    title: 'Senior Frontend Engineer',
    company: 'Northstar Labs',
    initials: 'NL',
    logoColor: 'bg-[#173f35]',
    location: 'Berlin, Germany',
    workplace: 'Hybrid',
    type: 'Full-time',
    salary: 'EUR 75k-95k',
    tags: ['React', 'TypeScript', 'Design systems'],
    posted: '2h ago',
    applicants: 38,
    responseRate: 42,
    applied: true,
    responded: true,
  },
  {
    id: 2,
    title: 'Product Designer',
    company: 'Luma Health',
    initials: 'LH',
    logoColor: 'bg-[#e85d3f]',
    location: 'Europe',
    workplace: 'Remote',
    type: 'Full-time',
    salary: 'EUR 62k-78k',
    tags: ['Figma', 'Research', 'SaaS'],
    posted: '5h ago',
    applicants: 24,
    responseRate: 58,
    applied: false,
    responded: false,
  },
  {
    id: 3,
    title: 'Backend Engineer',
    company: 'Grain Technologies',
    initials: 'GT',
    logoColor: 'bg-[#3568d4]',
    location: 'Amsterdam, Netherlands',
    workplace: 'Hybrid',
    type: 'Full-time',
    salary: 'EUR 80k-105k',
    tags: ['Node.js', 'PostgreSQL', 'AWS'],
    posted: '1d ago',
    applicants: 51,
    responseRate: 31,
    applied: true,
    responded: false,
  },
  {
    id: 4,
    title: 'Product Manager, Growth',
    company: 'Orbit Money',
    initials: 'OM',
    logoColor: 'bg-[#efad28]',
    location: 'London, United Kingdom',
    workplace: 'On-site',
    type: 'Full-time',
    salary: 'GBP 72k-90k',
    tags: ['Fintech', 'Growth', 'Analytics'],
    posted: '1d ago',
    applicants: 67,
    responseRate: 27,
    applied: false,
    responded: false,
  },
  {
    id: 5,
    title: 'Full-stack Developer',
    company: 'Common Ground',
    initials: 'CG',
    logoColor: 'bg-[#7652a8]',
    location: 'Worldwide',
    workplace: 'Remote',
    type: 'Contract',
    salary: 'USD 75-95/hr',
    tags: ['Next.js', 'Supabase', 'Tailwind'],
    posted: '2d ago',
    applicants: 43,
    responseRate: 49,
    applied: true,
    responded: true,
  },
  {
    id: 6,
    title: 'Data Analyst',
    company: 'Tandem Climate',
    initials: 'TC',
    logoColor: 'bg-[#278b83]',
    location: 'Copenhagen, Denmark',
    workplace: 'Hybrid',
    type: 'Full-time',
    salary: 'DKK 520k-640k',
    tags: ['SQL', 'Python', 'Looker'],
    posted: '3d ago',
    applicants: 29,
    responseRate: 45,
    applied: false,
    responded: false,
  },
]

const filters: { value: JobStatus; label: string }[] = [
  { value: 'all', label: 'All offers' },
  { value: 'remote', label: 'Remote' },
  { value: 'applied', label: 'Applied' },
  { value: 'responded', label: 'Got a response' },
]

function App() {
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<JobStatus>('all')

  const filteredJobs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return jobOffers.filter((job) => {
      const matchesSearch =
        !normalizedQuery ||
        [job.title, job.company, job.location, ...job.tags]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery)

      const matchesFilter =
        activeFilter === 'all' ||
        (activeFilter === 'remote' && job.workplace === 'Remote') ||
        (activeFilter === 'applied' && job.applied) ||
        (activeFilter === 'responded' && job.responded)

      return matchesSearch && matchesFilter
    })
  }, [activeFilter, query])

  return (
    <div className="min-h-screen">
      <header className="border-b border-[#dfe3dd] bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#" className="flex items-center gap-2.5 text-lg font-semibold text-[#173f35]">
            <span className="grid size-9 place-items-center rounded-md bg-[#173f35] text-white">
              <BriefcaseIcon aria-hidden="true" width="19" height="19" />
            </span>
            JobRater
          </a>
          <Button variant="primary">
            Add an offer
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-9 sm:px-6 sm:py-12 lg:px-8">

        <section aria-label="Search and filter jobs" className="mb-6">
          <div className="relative mb-4">
            <SearchLineIcon
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6a756e]"
              width="20"
              height="20"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by role, company, location or skill"
              className="h-13 w-full rounded-md border border-[#cfd5cf] bg-white pl-12 pr-4 text-sm text-[#1c201d] outline-none transition placeholder:text-[#8a938d] focus:border-[#2b6558] focus:ring-3 focus:ring-[#2b6558]/10"
            />
          </div>

          <div
            className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="group"
            aria-label="Job filters"
          >
            <Button variant='secondary'>
              <AdjustmentsLineIcon aria-hidden="true" width="17" height="17" />
              Filters
            </Button>
            <ToggleGroup
              value={activeFilter}
              onValueChange={(activeFilter) => setActiveFilter(activeFilter as JobStatus)}
              aria-label="Filter job offers"
            >
              {filters.map((filter) => (
                <ToggleGroupItem key={filter.value} value={filter.value}>
                  {filter.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </section>

        <div className="mb-3 flex items-center justify-between border-b border-[#dfe3dd] pb-3">
          <p className="text-sm font-semibold text-[#27322c]">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'offer' : 'offers'}
          </p>
          <p className="text-xs text-[#7a847e]">Newest first</p>
        </div>

        {filteredJobs.length > 0 ? (
          <div className="space-y-3">
            {filteredJobs.map((job) => (
              <article
                key={job.id}
                className="group rounded-lg border border-[#dfe3dd] bg-white p-4 transition hover:border-[#abb6ae] hover:shadow-[0_8px_24px_rgba(23,63,53,0.07)] sm:p-5"
              >
                <div className="flex gap-3.5 sm:gap-5">
                  <div
                    className={`grid size-11 shrink-0 place-items-center rounded-md text-xs font-bold text-white sm:size-12 ${job.logoColor}`}
                    aria-hidden="true"
                  >
                    {job.initials}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="truncate text-base font-semibold text-[#18201c] sm:text-lg">
                          {job.title}
                        </h2>
                        <p className="mt-0.5 flex items-center gap-1.5 text-sm text-[#566159]">
                          <BriefcaseLineIcon aria-hidden="true" width="14" height="14" />
                          {job.company}
                        </p>
                      </div>
                      <Button
                        variant="icon"
                        size="icon"
                        aria-label={`Open ${job.title} at ${job.company}`}
                        title="Open offer"
                      >
                        <ExternalLinkLineIcon aria-hidden="true" width="17" height="17" />
                      </Button>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#667069] sm:text-sm">
                      <span className="flex items-center gap-1.5">
                        <LocationMarkerLineIcon aria-hidden="true" width="15" height="15" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <ApplicationsLineIcon aria-hidden="true" width="15" height="15" />
                        {job.workplace} · {job.type}
                      </span>
                      <span className="font-medium text-[#32453d]">{job.salary}</span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {job.tags.map((tag) => (
                        <span key={tag} className="rounded bg-[#f0f3ef] px-2.5 py-1 text-xs text-[#526058]">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 flex flex-col gap-3 border-t border-[#edf0ec] pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#657168]">
                        <span className="flex items-center gap-1.5">
                          <UsersLineIcon aria-hidden="true" width="15" height="15" />
                          {job.applicants} applied
                        </span>
                        <span className="flex items-center gap-1.5">
                          <CheckLineIcon
                            aria-hidden="true"
                            width="15"
                            height="15"
                            className="text-[#278b63]"
                          />
                          {job.responseRate}% response rate
                        </span>
                      </div>
                      <span className="flex items-center gap-1.5 text-xs text-[#858e88]">
                        <ClockLineIcon aria-hidden="true" width="14" height="14" />
                        {job.posted}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="border-b border-[#dfe3dd] py-16 text-center">
            <SearchLineIcon
              aria-hidden="true"
              className="mx-auto mb-3 text-[#89938d]"
              width="28"
              height="28"
            />
            <h2 className="text-base font-semibold text-[#28332d]">No matching offers</h2>
            <p className="mt-1 text-sm text-[#707b74]">Try another search or filter.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
