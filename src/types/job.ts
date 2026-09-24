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
  posted: string
  applicants: number
  responseRate: number
  applied: boolean
  responded: boolean
}
