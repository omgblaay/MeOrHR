export const jobCategories = [
  'AI/ML',
  'JavaScript',
  'HTML',
  'PHP',
  'Ruby',
  'Python',
  'Java',
  '.NET',
  'Scala',
  'C',
  'Mobile',
  'Testing',
  'DevOps',
  'Admin',
  'UX/UI',
  'PM',
  'Game',
  'Analytics',
  'Security',
  'Data',
  'Go',
  'Webflow',
  'Framer',
  'Support',
  'ERP',
  'Architecture',
  'Other',
] as const

export type JobCategory = (typeof jobCategories)[number]

export const roleLevels = [
  'Intern',
  'Junior',
  'Mid',
  'Senior',
  'Lead',
  'Principal',
  'Manager',
  'Director',
] as const

export type RoleLevel = (typeof roleLevels)[number]

export const jobSources = [
  'linkedin',
  'indeed',
  'stepstone',
  'justjoinit',
  'nofluffjobs',
  'pracuj',
  'glassdoor',
  'xing',
  'welcome_to_the_jungle',
  'wellfound',
  'eures',
  'company_career_page',
  'other',
] as const

export type JobSource = (typeof jobSources)[number]

export type JobOfferSource = {
  id: number
  platform: JobSource
  url: string
  publishedAt: string | null
  firstSeenAt: string
  lastSeenAt: string
  closedAt: string | null
  clickCount: number
}

export type ApplicantCountry = {
  countryCode: string
  applicantCount: number
  percentage: number
}

export type JobOffer = {
  id: number
  createdBy: string | null
  createdAt: string
  title: string
  company: string
  companyCountryCode: string | null
  companyLogoUrl: string | null
  initials: string
  logoColor: string
  location: string
  hiringRegions: string[]
  hiringCountryCodes: string[]
  workplace: 'Remote' | 'Hybrid' | 'On-site'
  category: JobCategory
  roleLevel: RoleLevel | null
  type: 'Full-time' | 'Contract'
  salary: string | null
  tags: string[]
  description: string
  sourceUrl: string | null
  sourcePlatform: JobSource
  sources: JobOfferSource[]
  publishedAt: string | null
  posted: string
  updated: string
  confirmedApplicants: number
  applicantCountries: ApplicantCountry[]
  sourceClicks: number
  repliedApplicants: number
  nextInterviewApplicants: number
  applicantsOlderThan30Days: number
  noReplyAfter30DaysApplicants: number
  medianDaysToReply: number | null
  medianDaysReplyToInterview: number | null
  talentPoolReports: number
  goneReports: number
  isGone: boolean
  contactedHrApplicants: number
  linkedinConnectionApplicants: number
  additionalEmailApplicants: number
  responseRate: number
  applied: boolean
  responded: boolean
}
