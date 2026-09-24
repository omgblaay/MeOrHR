import ArrowLeftLineIcon from '@iconify-react/majesticons/arrow-left-line'
import ApplicationsLineIcon from '@iconify-react/majesticons/applications-line'
import BriefcaseLineIcon from '@iconify-react/majesticons/briefcase-line'
import CheckCircleLineIcon from '@iconify-react/majesticons/check-circle-line'
import ClockLineIcon from '@iconify-react/majesticons/clock-line'
import ExternalLinkLineIcon from '@iconify-react/majesticons/external-link-line'
import LocationMarkerLineIcon from '@iconify-react/majesticons/location-marker-line'
import UsersLineIcon from '@iconify-react/majesticons/users-line'
import { Link, useParams } from 'react-router-dom'
import AppHeader from './components/AppHeader'
import Button from './components/Button'
import ResponseBar from './components/ResponseBar'
import Tag from './components/Tag'
import type { JobOffer } from './types/job'

type JobOfferPageProps = {
  jobOffers: JobOffer[]
  isLoading: boolean
  loadError: string | null
  onRetry: () => void
}

export default function JobOfferPage({ jobOffers, isLoading, loadError, onRetry }: JobOfferPageProps) {
  const { jobId } = useParams()
  const job = jobOffers.find((offer) => offer.id === Number(jobId))

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-6xl border-x border-[#dfe3dd] bg-white">
        <div className="border-b border-[#dfe3dd] px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#526058] transition hover:text-[#173f35] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#173f35]"
          >
            <ArrowLeftLineIcon aria-hidden="true" width="18" height="18" />
            Back to offers
          </Link>
        </div>

        {isLoading ? (
          <div className="animate-pulse px-4 py-10 sm:px-6 lg:px-8" aria-label="Loading job offer">
            <div className="h-8 w-2/3 bg-[#edf0ec]" />
            <div className="mt-5 h-4 w-1/3 bg-[#edf0ec]" />
            <div className="mt-10 h-40 border-y border-[#edf0ec] bg-[#f7f9f6]" />
          </div>
        ) : loadError ? (
          <div className="px-4 py-20 text-center sm:px-6 lg:px-8">
            <h1 className="text-xl font-semibold text-[#18201c]">Couldn&apos;t load this offer</h1>
            <p className="mx-auto mt-2 max-w-lg text-sm text-[#707b74]">{loadError}</p>
            <Button className="mt-6" onClick={onRetry}>Try again</Button>
          </div>
        ) : !job ? (
          <div className="px-4 py-20 text-center sm:px-6 lg:px-8">
            <h1 className="text-xl font-semibold text-[#18201c]">Offer not found</h1>
            <p className="mt-2 text-sm text-[#707b74]">This offer may have been removed or the link is incorrect.</p>
            <Link to="/" className="mt-6 inline-flex text-sm font-semibold text-[#173f35] underline underline-offset-4">
              Browse all offers
            </Link>
          </div>
        ) : (
          <>
            <section className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 gap-4 sm:gap-5">
                  <div
                    className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-md text-sm font-bold text-white sm:size-16"
                    style={{ backgroundColor: job.logoColor }}
                    aria-hidden="true"
                  >
                    {job.companyLogoUrl ? (
                      <img className="size-full object-cover" src={job.companyLogoUrl} alt="" />
                    ) : (
                      job.initials
                    )}
                  </div>
                  <div className="min-w-0">
                    <Tag>{job.category}</Tag>
                    <h1 className="mt-3 text-2xl font-semibold text-[#18201c] sm:text-3xl">{job.title}</h1>
                    <p className="mt-2 flex items-center gap-2 text-sm text-[#566159]">
                      <BriefcaseLineIcon aria-hidden="true" width="16" height="16" />
                      {job.company}
                    </p>
                  </div>
                </div>

                {job.sourceUrl ? (
                  <a
                    href={job.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-[#eaff6a] px-4 text-sm font-semibold text-[#173f35] transition hover:bg-[#def258]"
                  >
                    View original offer
                    <ExternalLinkLineIcon aria-hidden="true" width="17" height="17" />
                  </a>
                ) : (
                  <Button disabled>Source unavailable</Button>
                )}
              </div>
            </section>

            <section className="grid border-y border-[#dfe3dd] lg:grid-cols-[minmax(0,1fr)_20rem]">
              <div className="px-4 py-8 sm:px-6 lg:border-r lg:border-[#dfe3dd] lg:px-8">
                <h2 className="text-sm font-semibold uppercase text-[#667069]">Offer details</h2>
                <dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                  <div>
                    <dt className="flex items-center gap-2 text-xs text-[#7a847e]">
                      <LocationMarkerLineIcon aria-hidden="true" width="15" height="15" /> Location
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-[#27322c]">{job.location}</dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-2 text-xs text-[#7a847e]">
                      <ApplicationsLineIcon aria-hidden="true" width="15" height="15" /> Work arrangement
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-[#27322c]">{job.workplace} · {job.type}</dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-2 text-xs text-[#7a847e]">
                      <ClockLineIcon aria-hidden="true" width="15" height="15" /> Published
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-[#27322c]">{job.posted}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#7a847e]">Compensation</dt>
                    <dd className="mt-1 text-sm font-semibold text-[#27322c]">{job.salary ?? 'Not disclosed'}</dd>
                  </div>
                </dl>

                <h2 className="mt-10 text-sm font-semibold uppercase text-[#667069]">Skills</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.tags.map((tag) => <Tag key={tag} tag={tag} />)}
                </div>
              </div>

              <aside className="border-t border-[#dfe3dd] px-4 py-8 sm:px-6 lg:border-t-0 lg:px-6">
                <h2 className="text-sm font-semibold uppercase text-[#667069]">Application signals</h2>
                <div className="mt-5 border-b border-[#edf0ec] pb-5">
                  <p className="flex items-center gap-2 text-sm text-[#526058]">
                    <UsersLineIcon aria-hidden="true" width="17" height="17" />
                    {job.applicants} applicants
                  </p>
                </div>
                <div className="border-b border-[#edf0ec] py-5">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-[#526058]">Response rate</span>
                    <strong className="text-[#27322c]">{job.responseRate}%</strong>
                  </div>
                  <div className="mt-3">
                    <ResponseBar responseRate={job.responseRate} className="w-full" />
                  </div>
                </div>
                <div className="pt-5">
                  <p className="flex items-center gap-2 text-sm font-semibold text-[#27322c]">
                    <CheckCircleLineIcon aria-hidden="true" width="17" height="17" className="text-[#35a36f]" />
                    {job.responded ? 'Response received' : job.applied ? 'Application sent' : 'Not applied yet'}
                  </p>
                  <p className="mt-1 text-xs text-[#7a847e]">
                    {job.responded
                      ? 'The company has responded to your application.'
                      : job.applied
                        ? 'Waiting for a response from the company.'
                        : 'This offer has not been added to your applications.'}
                  </p>
                </div>
              </aside>
            </section>
          </>
        )}
      </main>
    </div>
  )
}
