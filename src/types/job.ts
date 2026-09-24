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
  'Support',
  'ERP',
  'Architecture',
  'Other',
] as const

export type JobCategory = (typeof jobCategories)[number]

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

export type JobOffer = {
  id: number
  title: string
  company: string
  companyLogoUrl: string | null
  initials: string
  logoColor: string
  location: string
  workplace: 'Remote' | 'Hybrid' | 'On-site'
  category: JobCategory
  type: 'Full-time' | 'Contract'
  salary: string | null
  tags: string[]
  sourceUrl: string | null
  sourcePlatform: JobSource
  sources: JobOfferSource[]
  posted: string
  updated: string
  confirmedApplicants: number
  sourceClicks: number
  repliedApplicants: number
  nextInterviewApplicants: number
  offerApplicants: number
  medianDaysToReply: number | null
  medianDaysReplyToInterview: number | null
  medianDaysInterviewToOffer: number | null
  contactedHrApplicants: number
  linkedinConnectionApplicants: number
  additionalEmailApplicants: number
  responseRate: number
  applied: boolean
  responded: boolean
}
