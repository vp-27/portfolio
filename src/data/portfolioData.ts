import type { Stock, PortfolioData, ChartDataPoint, Skill, SkillCategory, Experience, Project, Education, Interest } from '../types'

// Helper function to format date from YYYY-MM to "Mon YYYY"
const formatDate = (dateStr: string): string => {
  const [year, month] = dateStr.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1)
  const monthName = date.toLocaleDateString('en-US', { month: 'short' })
  return `${monthName} ${year}`
}

export const portfolioStocks: Stock[] = [
  {
    id: 'amazon1',
    symbol: 'AMZN',
    name: 'Amazon SCOT - Financial Analyst Intern',
    shares: 10,
    averageCost: 150.00,
    currentPrice: 285.00,
    marketValue: 2850.00,
    todayReturn: 45.00,
    todayReturnPercent: 1.61,
    totalReturn: 1350.00,
    totalReturnPercent: 90.00, // 5,700x speedup, 99.86% fidelity
  },
  {
    id: 'gale',
    symbol: 'GALE',
    name: 'GALE - Gamified Learning Engine',
    shares: 25,
    averageCost: 30.00,
    currentPrice: 58.00,
    marketValue: 1450.00,
    todayReturn: 24.50,
    todayReturnPercent: 1.72,
    totalReturn: 700.00,
    totalReturnPercent: 93.33, // 18 algorithm categories, multi-model LLM
  },
  {
    id: '7',
    symbol: 'EDGAR',
    name: 'Edgar Agent - SEC 10-K API',
    shares: 40,
    averageCost: 15.00,
    currentPrice: 34.00,
    marketValue: 1360.00,
    todayReturn: 19.20,
    todayReturnPercent: 1.43,
    totalReturn: 760.00,
    totalReturnPercent: 126.67, // sub-second RAG latency
  },
  {
    id: '1',
    symbol: 'SEBS',
    name: 'Rutgers SEBS - Data Analyst',
    shares: 4,
    averageCost: 25.00,
    currentPrice: 60.00,
    marketValue: 240.00,
    todayReturn: 12.00,
    todayReturnPercent: 5.26,
    totalReturn: 140.00,
    totalReturnPercent: 140.00, // 60% licensing cost reduction
  },
  {
    id: '2',
    symbol: 'MOWEB',
    name: 'Moweb Technologies - SWE / Data Intern',
    shares: 2,
    averageCost: 45.00,
    currentPrice: 85.00,
    marketValue: 170.00,
    todayReturn: 8.00,
    todayReturnPercent: 4.94,
    totalReturn: 80.00,
    totalReturnPercent: 88.89, // 40% query latency cut
  },
  {
    id: '3',
    symbol: 'GRIND',
    name: 'GrindSheet - SwiftUI HealthKit Tracker',
    shares: 15,
    averageCost: 20.00,
    currentPrice: 40.00,
    marketValue: 600.00,
    todayReturn: 12.00,
    todayReturnPercent: 2.04,
    totalReturn: 300.00,
    totalReturnPercent: 100.00, // HealthKit 10+ metrics sync
  },
  {
    id: 'algo',
    symbol: 'ALGOBOT',
    name: 'Algorithmic Stock Trading Bot',
    shares: 100,
    averageCost: 9.00,
    currentPrice: 11.80,
    marketValue: 1180.00,
    todayReturn: 18.00,
    todayReturnPercent: 1.55,
    totalReturn: 280.00,
    totalReturnPercent: 31.11, // Sharpe 1.7, 10% paper return
  },
  {
    id: '5',
    symbol: 'SHARK',
    name: 'Rutgers Shark Tank - PerkPal',
    shares: 3,
    averageCost: 70.00,
    currentPrice: 105.00,
    marketValue: 315.00,
    todayReturn: 6.30,
    todayReturnPercent: 2.04,
    totalReturn: 105.00,
    totalReturnPercent: 50.00, // Top 6 finish
  },
]

export const portfolioSummary: PortfolioData = {
  totalValue: 8165.00,
  todayReturn: 145.00,
  todayReturnPercent: 1.81,
  totalReturn: 3715.00,
  totalReturnPercent: 83.48,
}

// Generate career timeline chart data
const generateCareerTimelineData = (): ChartDataPoint[] => {
  const data: ChartDataPoint[] = []

  const milestones = [
    { date: '2023-09', value: 30, label: 'Started Rutgers', type: 'start', category: 'Education' },
    { date: '2023-12', value: 34, label: null, type: 'learning' },
    { date: '2024-05', value: 40, label: null, type: 'learning' },
    { date: '2024-11', value: 65, label: 'Algo Trading Bot', type: 'project', category: 'Project' },
    { date: '2025-03', value: 82, label: 'Shark Tank Top 6', type: 'competition', category: 'Competition' },
    { date: '2025-05', value: 98, label: 'GrindSheet', type: 'project', category: 'Project' },
    { date: '2025-07', value: 125, label: 'Moweb Technologies', type: 'internship', category: 'Internship' },
    { date: '2025-09', value: 145, label: 'SEBS Data Analyst', type: 'internship', category: 'Internship' },
    { date: '2025-12', value: 168, label: 'Edgar Agent', type: 'project', category: 'Project' },
    { date: '2026-04', value: 190, label: 'GALE Engine', type: 'project', category: 'Project' },
    { date: '2026-05', value: 220, label: 'Amazon SCOT', type: 'internship', category: 'Internship' },
  ]

  for (let i = 0; i < milestones.length - 1; i++) {
    const current = milestones[i]
    const next = milestones[i + 1]
    const steps = 14
    const valueDiff = next.value - current.value

    if (i === 0 || current.label) {
      data.push({
        time: formatDate(current.date),
        value: current.value,
        label: current.label || undefined,
        category: (current as any).category || undefined
      })
    }

    for (let j = 1; j < steps; j++) {
      const progress = j / steps
      const baseValue = current.value + valueDiff * progress
      let value = baseValue

      if (next.type === 'internship') {
        if (progress < 0.7) {
          const steadyGrowth = progress * Math.abs(valueDiff) * 0.2
          const noise = (Math.random() - 0.5) * 1.8
          value = current.value + steadyGrowth + noise
        } else {
          const spike = Math.pow((progress - 0.7) / 0.3, 2.8)
          const totalRise = Math.abs(valueDiff)
          value = current.value + (totalRise * 0.2) + (totalRise * 0.8 * spike) + (Math.random() - 0.3) * 1.5
        }
      } else if (next.type === 'sustain') {
        const flatFluctuation = Math.sin(progress * Math.PI * 4) * Math.abs(valueDiff) * 0.4
        const noise = (Math.random() - 0.5) * 1.5
        value = baseValue + flatFluctuation + noise
      } else if (next.type === 'project') {
        const growth = Math.sin(progress * Math.PI) * Math.abs(valueDiff) * 0.2
        const noise = (Math.random() - 0.5) * 2.0
        value = baseValue + growth + noise
      } else if (next.type === 'competition') {
        if (progress < 0.65) {
          const steady = Math.sin(progress * Math.PI * 1.2) * Math.abs(valueDiff) * 0.18
          const noise = (Math.random() - 0.5) * 1.8
          value = baseValue + steady + noise
        } else {
          const boost = Math.pow((progress - 0.65) / 0.35, 2.2)
          value = current.value + Math.abs(valueDiff) * 0.3 + (Math.abs(valueDiff) * 0.7 * boost) + (Math.random() - 0.35) * 1.5
        }
      } else if (next.type === 'learning') {
        const learning = Math.sin(progress * Math.PI) * Math.abs(valueDiff) * 0.18
        const noise = (Math.random() - 0.5) * 1.8
        value = baseValue + learning + noise
      } else {
        const wave = Math.sin(progress * Math.PI * 1.5) * Math.abs(valueDiff) * 0.18
        const noise = (Math.random() - 0.5) * 1.8
        value = baseValue + wave + noise
      }

      if (Math.random() < 0.11 && j > 2 && j < steps - 2) {
        value -= (Math.random() * 2.0 + 0.3)
      }

      if (Math.random() < 0.09 && j > 2 && j < steps - 2) {
        value += (Math.random() * 2.0 + 0.3)
      }

      data.push({
        time: formatDate(current.date),
        value: Math.max(current.value - 2, Math.min(next.value + 1, value)),
        label: undefined
      })
    }
  }

  const lastMilestone = milestones[milestones.length - 1]
  data.push({
    time: formatDate(lastMilestone.date),
    value: lastMilestone.value,
    label: lastMilestone.label || undefined,
    category: (lastMilestone as any).category || undefined
  })

  const [lastYear, lastMonth] = lastMilestone.date.split('-').map(Number)
  const lastMilestoneDate = new Date(lastYear, lastMonth - 1)
  const currentDate = new Date(2026, 7)

  if (currentDate > lastMilestoneDate) {
    const monthsDiff = (currentDate.getFullYear() - lastMilestoneDate.getFullYear()) * 12 +
      (currentDate.getMonth() - lastMilestoneDate.getMonth())

    const steps = 14
    for (let month = 1; month <= monthsDiff; month++) {
      const nextDate = new Date(lastMilestoneDate)
      nextDate.setMonth(lastMilestoneDate.getMonth() + month)
      const dateStr = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}`

      for (let j = 1; j <= steps; j++) {
        const progress = j / steps
        const smallGrowth = 0.3 * progress
        const fluctuation = Math.sin(progress * Math.PI * 3) * 1.5
        const noise = (Math.random() - 0.5) * 1.8
        const value = lastMilestone.value + smallGrowth + fluctuation + noise

        data.push({
          time: formatDate(dateStr),
          value: Math.max(lastMilestone.value - 2, Math.min(lastMilestone.value + 3, value)),
          label: undefined
        })
      }
    }
  }

  return data
}

export const filterTimelineData = (range: string): ChartDataPoint[] => {
  const allData = generateCareerTimelineData()
  const baseDate = new Date(2026, 7, 1)

  let startDate: Date

  switch (range) {
    case '1D':
      startDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1)
      break
    case '1W':
      startDate = new Date(baseDate.getFullYear(), baseDate.getMonth() - 1, 1)
      break
    case '1M':
      startDate = new Date(baseDate.getFullYear(), baseDate.getMonth() - 1, 1)
      break
    case '3M':
      startDate = new Date(baseDate.getFullYear(), baseDate.getMonth() - 3, 1)
      break
    case 'YTD':
      startDate = new Date(baseDate.getFullYear(), 0, 1)
      break
    case '1Y':
      startDate = new Date(baseDate.getFullYear() - 1, baseDate.getMonth(), 1)
      break
    case 'ALL':
    default:
      return allData
  }

  const monthMap: { [key: string]: number } = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  }

  const filteredData = allData.filter(point => {
    const [monthStr, yearStr] = point.time.split(' ')
    const pointDate = new Date(parseInt(yearStr), monthMap[monthStr] || 0, 1)
    return pointDate >= startDate
  })

  const MIN_POINTS = 2
  if (filteredData.length < MIN_POINTS) {
    const pointsNeeded = MIN_POINTS - filteredData.length
    const earliestFilteredIndex = allData.findIndex(point => point === filteredData[0])

    if (earliestFilteredIndex > 0) {
      const pointsToAdd = allData.slice(
        Math.max(0, earliestFilteredIndex - pointsNeeded),
        earliestFilteredIndex
      )
      return [...pointsToAdd, ...filteredData]
    }
  }

  return filteredData
}

// Skills Data for Portfolio Website
export const portfolioSkills: Skill[] = [
  // Technical Skills
  { id: 'ts1', name: 'Python', proficiency: 95, yearsOfExperience: 3, category: 'technical' },
  { id: 'ts2', name: 'SQL', proficiency: 92, yearsOfExperience: 3, category: 'technical' },
  { id: 'ts3', name: 'JavaScript/TypeScript', proficiency: 90, yearsOfExperience: 2, category: 'technical' },
  { id: 'ts4', name: 'Java', proficiency: 85, yearsOfExperience: 2, category: 'technical' },
  { id: 'ts5', name: 'FastAPI', proficiency: 90, yearsOfExperience: 2, category: 'technical' },
  { id: 'ts6', name: 'Flask', proficiency: 85, yearsOfExperience: 2, category: 'technical' },
  { id: 'ts7', name: 'React', proficiency: 92, yearsOfExperience: 2, category: 'technical' },
  { id: 'ts8', name: 'Node.js / Vite', proficiency: 88, yearsOfExperience: 2, category: 'technical' },
  { id: 'ts9', name: 'MCP (Model Context Protocol)', proficiency: 92, yearsOfExperience: 1, category: 'technical' },
  { id: 'ts10', name: 'OpenAI / Anthropic APIs', proficiency: 90, yearsOfExperience: 2, category: 'technical' },
  { id: 'ts11', name: 'AWS Bedrock', proficiency: 84, yearsOfExperience: 1, category: 'technical' },

  // Financial Skills
  { id: 'fs1', name: 'Financial Modeling', proficiency: 95, yearsOfExperience: 2, category: 'financial' },
  { id: 'fs2', name: 'Valuation (DCF, Comps)', proficiency: 90, yearsOfExperience: 2, category: 'financial' },
  { id: 'fs3', name: 'Financial Statement Analysis', proficiency: 92, yearsOfExperience: 2, category: 'financial' },
  { id: 'fs4', name: 'P&L Variance Attribution', proficiency: 94, yearsOfExperience: 1, category: 'financial' },
  { id: 'fs5', name: 'Risk Management', proficiency: 88, yearsOfExperience: 2, category: 'financial' },
  { id: 'fs6', name: 'Algorithmic Trading', proficiency: 90, yearsOfExperience: 2, category: 'financial' },

  // Tools & Platforms
  { id: 'tl1', name: 'dbt-core', proficiency: 88, yearsOfExperience: 1, category: 'tools' },
  { id: 'tl2', name: 'Snowflake', proficiency: 86, yearsOfExperience: 1, category: 'tools' },
  { id: 'tl3', name: 'PostgreSQL & Supabase', proficiency: 88, yearsOfExperience: 2, category: 'tools' },
  { id: 'tl4', name: 'Docker', proficiency: 82, yearsOfExperience: 1, category: 'tools' },
  { id: 'tl5', name: 'AWS (EC2, S3)', proficiency: 84, yearsOfExperience: 1, category: 'tools' },
  { id: 'tl6', name: 'Git & CI/CD', proficiency: 90, yearsOfExperience: 3, category: 'tools' },
  { id: 'tl7', name: 'Bloomberg Terminal', proficiency: 88, yearsOfExperience: 2, category: 'tools' },
  { id: 'tl8', name: 'Microsoft Suite (Excel, PPT)', proficiency: 96, yearsOfExperience: 3, category: 'tools' },
  { id: 'tl9', name: 'Claude Code', proficiency: 92, yearsOfExperience: 1, category: 'tools' },

  // Product & Leadership
  { id: 'ss1', name: 'System Architecture', proficiency: 90, yearsOfExperience: 2, category: 'soft' },
  { id: 'ss2', name: 'Cross-Functional Leadership', proficiency: 92, yearsOfExperience: 2, category: 'soft' },
  { id: 'ss3', name: 'Stakeholder Management', proficiency: 88, yearsOfExperience: 2, category: 'soft' },
  { id: 'ss4', name: 'Agent Orchestration', proficiency: 90, yearsOfExperience: 1, category: 'soft' },
  { id: 'ss5', name: 'ETL Pipeline Design', proficiency: 88, yearsOfExperience: 1, category: 'soft' },
]

export const skillCategories: SkillCategory[] = [
  {
    id: 'cat1',
    name: 'Technical Skills',
    icon: 'technical',
    skills: portfolioSkills.filter(s => s.category === 'technical'),
  },
  {
    id: 'cat2',
    name: 'Financial Skills',
    icon: 'financial',
    skills: portfolioSkills.filter(s => s.category === 'financial'),
  },
  {
    id: 'cat3',
    name: 'Tools & Platforms',
    icon: 'tools',
    skills: portfolioSkills.filter(s => s.category === 'tools'),
  },
  {
    id: 'cat4',
    name: 'Product & Leadership',
    icon: 'soft',
    skills: portfolioSkills.filter(s => s.category === 'soft'),
  },
]

// Professional Experience Data
export const professionalExperiences: Experience[] = [
  {
    id: 'amazon1',
    company: 'Amazon | Supply Chain Optimization Technologies (SCOT)',
    position: 'Financial Analyst Intern',
    location: 'Bellevue, WA',
    startDate: 'May 2026',
    endDate: 'Aug 2026',
    logoUrl: '/images/experience_images/amazon.png',
    bullets: [
      'Built P&L variance attribution decomposing volatile $15M+/month liquidation costs into algorithmic vs manual drivers, explaining MoM/YoY swings and establishing the first tie-out to published close totals.',
      'Identified 31% of volume executing outside the controlled system and a multimillion-dollar definition gap driving unreconciled variance through an audit of 12K+ records, with findings adopted into senior leadership\'s close narrative.',
      'Rebuilt a session auto-titling feature for Amazon\'s internal AI agent platform (30,000+ users) behind a two-layer fail-closed gate after a security review found revoked users could bypass usage limits.',
      'Reworked an auto-triggered chat flow into an opt-in starter experience, preventing unnecessary runs for users restarting after crashes, uncovering five latent bugs and adding regression tests that reproduced failures in the original implementation.',
      'Built headless Excel compute engine with a custom formula evaluator and dependency graph, exposing workbook data through MCP for rapid LLM access while achieving 99.86% output fidelity and a 5,700× speedup on its primary aggregation workload.',
      'Represented a finance team in director-sponsored cross-team knowledgebase initiative as primary technical contributor; prototyped an org-wide knowledge system with directory crawler, REST API, and two MCP servers, narrowing to a single-team pilot after identifying team-specific data requirements.',
      'Redesigned the UI and information architecture of an internal AI platform without a dedicated design team, implementing and documenting a substantially restructured experience that its creators requested to evaluate for broader adoption.',
      'Developed monthly forecast for backlog of inventory flagged for liquidation, establishing a first forward-looking view where none existed, back-tested over a 24-month window with documented error metrics.'
    ],
    technologies: ['Financial Modeling', 'Variance Attribution', 'Agentic AI', 'MCP', 'Headless Excel Engine', 'Python', 'System Architecture'],
    brandColor: '#FF9900',
  },
  {
    id: '1',
    company: 'Rutgers SEBS, Infrastructure & Facilities Planning',
    position: 'Data Analyst Intern',
    location: 'New Brunswick, NJ',
    startDate: 'Sep 2025',
    endDate: 'Dec 2025',
    logoUrl: '/images/experience_images/rutgers.png',
    bullets: [
      'Engineered automated verification workflow for 300+ building portfolio, eliminating 40+ hours of annual manual work and enabling a shift from an annual to semi-annual audit cycle.',
      'Designed real-time tracking dashboard with automated stakeholder notifications, re-architecting workflow to native SharePoint, cutting licensing costs 60% and verification cycle 35% with zero loss in reliability.',
    ],
    technologies: ['Power Automate', 'SharePoint', 'Data Validation', 'Process Automation'],
    brandColor: '#CC0033',
  },
  {
    id: '2',
    company: 'Moweb Technologies',
    position: 'Software Engineering / Data Engineer Intern',
    location: 'Secaucus, NJ',
    startDate: 'Jul 2025',
    endDate: 'Aug 2025',
    logoUrl: '/images/experience_images/moweb.png',
    bullets: [
      'Developed ETL workflows in dbt-core and SQL, fixing null conflicts and reducing pipeline failures from 20+ weekly to <1.',
      'Re-architected data infrastructure from MySQL to Snowflake, cutting query latency by 40% through optimized data models.',
      'Delivered optimized financial metric extraction for client reporting, reducing processing times by 40% for real-time analysis, and directed LLM integration across team workflows, designing workshops that decreased manual reconciliation time by 30%.',
    ],
    technologies: ['Python', 'dbt-core', 'Snowflake', 'SQL', 'LLM Integration'],
    brandColor: '#0066CC',
  },
]

// Projects Data
export const portfolioProjects: Project[] = [
  {
    id: 'gale',
    name: 'GALE (Gamified Algorithmic Learning Engine)',
    subtitle: 'Launched a dependency-free algorithm-practice platform in vanilla JavaScript with custom pub/sub state store and multi-model LLM grading pipeline.',
    duration: 'Apr 2026 – Present',
    bullets: [
      'Launched dependency-free algorithm-practice platform in vanilla JavaScript with a custom pub/sub state store and Elo-based adaptive difficulty across 18 algorithmic categories',
      'Engineered a multi-model LLM grading pipeline with regex-based fast paths and automatic model fallback, plus an adversarial audit system for contested answers',
    ],
    technologies: ['Vanilla JavaScript', 'Gemini API', 'Pub/Sub State Store', 'Elo Engine', 'LLMs'],
    logoUrl: '/images/logoImages/galeClear.png',
  },
  {
    id: '7',
    name: 'Edgar Agent',
    subtitle: 'Designed a pay-per-request API for SEC 10-K filings with cryptographic signature verification and schema-constrained LLM extraction.',
    duration: 'Dec 2025 – Jan 2026',
    bullets: [
      'Designed a pay-per-request API for SEC 10-K data with cryptographic signature verification, implementing a quote-sign-extract flow for gated access',
      'Built a schema-constrained LLM extraction pipeline using targeted text windows over full-document RAG, preserving financial table structure while extracting structured data from SEC filings',
      'Implemented 1-hour in-memory cache, reducing repeat-query latency from 30 seconds to sub-second; abstracted core platform into MCP server enabling on-demand access to full filing universe for institutional research',
    ],
    technologies: ['Python', 'FastAPI', 'MCP', 'LLMs', 'SEC EDGAR'],
    logoUrl: '/images/logoImages/edgarAgentClear.png',
  },
  {
    id: '3',
    name: 'GrindSheet',
    subtitle: 'Built a SwiftUI fitness tracker integrating HealthKit across 10+ metrics with Supabase authentication and cross-device sync.',
    duration: 'May 2025 – Sep 2025',
    bullets: [
      'Built a SwiftUI fitness tracker integrating HealthKit across 10+ metrics with Supabase authentication and cross-device sync',
      'Implemented de-duplication using logs as the source of truth and Apple Watch workouts only when no matching logs existed',
    ],
    technologies: ['Swift', 'SwiftUI', 'HealthKit', 'Supabase', 'Apple Watch'],
    githubUrl: 'https://github.com/vp-27/grindsheet',
    logoUrl: '/images/logoImages/grindsheetClear.png',
    isMobileApp: true,
  },
  {
    id: '1',
    name: 'Algorithmic Stock Trading',
    subtitle: 'Constructed a Python Alpaca trading bot executing 100+ transactions via volatility and price action signals with dynamic position sizing.',
    duration: 'Nov 2024 – Jul 2025',
    bullets: [
      'Constructed Python Alpaca trading bot executing 100+ transactions via volatility and price action signals with dynamic sizing and stop-loss sustaining 10% paper return and Sharpe 1.7 while minimizing daily volatility',
      'Synthesized trade signals by analyzing historical volatility trends and intraday price action, backtested daily across 100+ simulations',
    ],
    technologies: ['Python', 'Alpaca API', 'Pandas', 'NumPy', 'Risk Analytics'],
    imageUrl: '/images/algostocktrading.png',
    logoUrl: '/images/logoImages/algoStockTradingClear.png',
  },
  {
    id: '5',
    name: 'Rutgers Shark Tank – "PerkPal"',
    subtitle: 'Led cross-functional team of 3 to top-6 finish in university-wide competition, building live React rewards platform with Selenium automation.',
    duration: 'Mar 2025',
    bullets: [
      'Led a cross-functional team of 3 to a top-6 finish among 30+ competing teams, defining the product\'s technical architecture and business case identifying $2.4B+ opportunity in fragmented loyalty programs',
      'Developed a live React rewards-aggregation platform with Selenium automation and presented the solution to an investor panel',
    ],
    technologies: ['React', 'Selenium', 'Python', 'Financial Modeling'],
    liveUrl: 'https://perkpal.vercel.app/',
    githubUrl: 'https://github.com/vp-27/perkopoly',
    imageUrl: '/images/perkpal.png',
    logoUrl: '/images/logoImages/perkPalClear.png',
  },
]

// Education Data
export const portfolioEducation: Education[] = [
  {
    id: '1',
    institution: 'Rutgers University–New Brunswick / Rutgers Business School',
    degrees: [
      'B.S. Computer Science | B.S. Finance | B.A. Data Science',
    ],
    location: 'New Brunswick, NJ',
    graduationDate: 'May 2027',
    gpa: '3.96',
    honors: [
      'Rutgers Honors College',
      'Dean\'s List (All Semesters)',
      'Phi Beta Kappa (Junior Year)',
    ],
    certifications: [
      {
        id: '1',
        name: 'Data Build Tool Fundamentals',
        issuer: 'dbt Labs',
      },
      {
        id: '2',
        name: 'Bloomberg Market Concepts',
        issuer: 'Bloomberg',
      },
    ]
  },
]

// Interests/Hobbies Data
export const portfolioInterests: Interest[] = [
  {
    id: '1',
    name: 'Quantitative Finance Club',
    category: 'Activity',
    icon: '📈',
  },
  {
    id: '2',
    name: 'Rutgers Mobile App Development Club',
    category: 'Activity',
    icon: '📱',
  },
  {
    id: '3',
    name: 'Rutgers Gujarati Student Association',
    category: 'Activity',
    icon: '🤝',
  },
  {
    id: '4',
    name: 'Options Trading',
    category: 'Interest',
    icon: '📊',
  },
  {
    id: '5',
    name: 'Mountain Biking',
    category: 'Interest',
    icon: '🚴',
  },
  {
    id: '6',
    name: 'Cars',
    category: 'Interest',
    icon: '🏎️',
  },
  {
    id: '7',
    name: 'Poker',
    category: 'Interest',
    icon: '♠️',
  },
  {
    id: '8',
    name: 'Legos',
    category: 'Interest',
    icon: '🧱',
  },
]
