export interface Stock {
  id: string
  symbol: string
  name: string
  shares: number
  averageCost: number
  currentPrice: number
  marketValue: number
  todayReturn: number
  todayReturnPercent: number
  totalReturn: number
  totalReturnPercent: number
}

export interface PortfolioData {
  totalValue: number
  buyingPower: number
  todayReturn: number
  todayReturnPercent: number
  totalReturn: number
  totalReturnPercent: number
}

export interface ChartDataPoint {
  time: string
  value: number
  label?: string
  experienceId?: string
}

export interface Skill {
  id: string
  name: string
  proficiency: number // 0-100
  yearsOfExperience?: number
  category: string
}

export interface SkillCategory {
  id: string
  name: string
  icon: 'technical' | 'financial' | 'soft' | 'language' | 'tools'
  skills: Skill[]
}

export interface Experience {
  id: string
  company: string
  position: string
  location: string
  startDate: string
  endDate: string
  bullets: string[]
}

export interface Project {
  id: string
  name: string
  subtitle: string
  duration: string
  bullets: string[]
  technologies?: string[]
  liveUrl?: string
  githubUrl?: string
  imageUrl?: string
  logoUrl?: string
  isMobileApp?: boolean
}

export interface Education {
  id: string
  institution: string
  degrees: string[]
  location: string
  graduationDate: string
  gpa: string
  honors: string[]
}

export interface Certification {
  id: string
  name: string
  issuer: string
  date?: string
}
