import type { Stock, PortfolioData, ChartDataPoint, Skill, SkillCategory, Experience, Project, Education, Certification } from '../types'

// Helper function to format date from YYYY-MM to "Mon YYYY"
const formatDate = (dateStr: string): string => {
  const [year, month] = dateStr.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1)
  const monthName = date.toLocaleDateString('en-US', { month: 'short' })
  return `${monthName} ${year}`
}


export const mockStocks: Stock[] = [
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
    totalReturnPercent: 140.00, // 60% cost reduction
  },
  {
    id: '2',
    symbol: 'MOWEB',
    name: 'Moweb Technologies - Data Team',
    shares: 2,
    averageCost: 45.00,
    currentPrice: 85.00,
    marketValue: 170.00,
    todayReturn: 8.00,
    todayReturnPercent: 4.94,
    totalReturn: 80.00,
    totalReturnPercent: 88.89, // 40% time reduction
  },
  {
    id: '3',
    symbol: 'KAKTUS',
    name: 'Kaktus Sportswear - Finance',
    shares: 2,
    averageCost: 50.00,
    currentPrice: 62.50,
    marketValue: 125.00,
    todayReturn: 3.50,
    todayReturnPercent: 2.88,
    totalReturn: 25.00,
    totalReturnPercent: 25.00, // 25% time reduction
  },
  {
    id: '4',
    symbol: 'ALGOBOT',
    name: 'Algorithmic Trading Bot',
    shares: 100,
    averageCost: 9.00,
    currentPrice: 9.90,
    marketValue: 990.00,
    todayReturn: 17.00,
    todayReturnPercent: 1.75,
    totalReturn: 90.00,
    totalReturnPercent: 10.00, // 10% returns
  },
  {
    id: '5',
    symbol: 'OROGEN',
    name: 'OroGenie - Trading Platform',
    shares: 500,
    averageCost: 1.00,
    currentPrice: 1.20,
    marketValue: 600.00,
    todayReturn: 10.00,
    todayReturnPercent: 1.69,
    totalReturn: 100.00,
    totalReturnPercent: 20.00, // 500+ transactions
  },
  {
    id: '6',
    symbol: 'SHARK',
    name: 'Rutgers Shark Tank - PerkPal',
    shares: 3,
    averageCost: 70.00,
    currentPrice: 100.00,
    marketValue: 300.00,
    todayReturn: 6.00,
    todayReturnPercent: 2.04,
    totalReturn: 90.00,
    totalReturnPercent: 42.86, // Top 6 finish
  },
  {
    id: '7',
    symbol: 'GRIND',
    name: 'GrindSheet - Fitness PWA',
    shares: 15,
    averageCost: 20.00,
    currentPrice: 32.00,
    marketValue: 480.00,
    todayReturn: 9.60,
    todayReturnPercent: 2.04,
    totalReturn: 180.00,
    totalReturnPercent: 60.00, // 60% input time reduction
  },
  {
    id: '8',
    symbol: 'SUNNY',
    name: 'Sunny - Insurance Co-Pilot',
    shares: 43,
    averageCost: 10.00,
    currentPrice: 11.00,
    marketValue: 473.00,
    todayReturn: 8.46,
    todayReturnPercent: 1.82,
    totalReturn: 43.00,
    totalReturnPercent: 10.00, // 43 data points
  },
  {
    id: '9',
    symbol: 'BENDER',
    name: 'Bender Trust - LIBOR Analysis',
    shares: 5,
    averageCost: 40.00,
    currentPrice: 45.00,
    marketValue: 225.00,
    todayReturn: 3.75,
    todayReturnPercent: 1.69,
    totalReturn: 25.00,
    totalReturnPercent: 12.50, // 5-year projections
  },
  {
    id: '10',
    symbol: 'TKD',
    name: 'Jang Star Taekwondo - Instructor',
    shares: 30,
    averageCost: 10.00,
    currentPrice: 13.00,
    marketValue: 390.00,
    todayReturn: 5.85,
    todayReturnPercent: 1.52,
    totalReturn: 90.00,
    totalReturnPercent: 30.00, // 30% acquisition increase
  },
]

export const mockPortfolio: PortfolioData = {
  totalValue: 5202.70, // Total "market value" of all experiences
  buyingPower: 394.00, // GPA * 100 = 3.94 * 100
  todayReturn: 84.16,
  todayReturnPercent: 2.15,
  totalReturn: 863.00, // Sum of all total returns
  totalReturnPercent: 27.61, // Weighted average of improvements
}

// Generate career timeline chart data
const generateCareerTimelineData = (): ChartDataPoint[] => {
  const data: ChartDataPoint[] = []

  // Career milestones - values represent skill/experience PLATEAUS
  // Pattern: Gradual rise → SPIKE UP at achievement → SUSTAIN at new plateau → Continue building
  const milestones = [
    { date: '2023-09', value: 15, label: 'Started Rutgers', type: 'start', category: 'Education' },
    { date: '2023-12', value: 20, label: null, type: 'learning' }, // Fall semester learning
    { date: '2024-01', value: 22, label: null, type: 'learning' }, // Continued learning
    { date: '2024-03', value: 28, label: 'Bender Trust', type: 'competition', category: 'Competition' }, // Competition milestone
    { date: '2024-05', value: 35, label: null, type: 'learning' }, // Spring semester
    { date: '2024-06', value: 42, label: 'OroGenie', type: 'project', category: 'Project' }, // Major project
    { date: '2024-07', value: 70, label: 'Kaktus Financial Ops', type: 'internship', category: 'Internship' }, // LEVEL UP - Floor 2
    { date: '2024-09', value: 71, label: null, type: 'sustain' }, // Sustain Floor 2 (kept skills)
    { date: '2024-11', value: 73, label: 'Algo Trading Bot', type: 'project', category: 'Project' }, // Building on Floor 2
    { date: '2025-01', value: 75, label: null, type: 'learning' }, // Continued growth
    { date: '2025-03', value: 80, label: 'Shark Tank Top 6', type: 'competition', category: 'Competition' }, // Competition boost
    { date: '2025-05', value: 83, label: 'GrindSheet', type: 'project', category: 'Project' }, // Project
    { date: '2025-06', value: 85, label: 'Sunny Insurance', type: 'project', category: 'Hackathon' }, // Hackathon
    { date: '2025-07', value: 95, label: 'Moweb Data Team', type: 'internship', category: 'Internship' }, // LEVEL UP - Floor 3
    { date: '2025-09', value: 100, label: 'SEBS Data Analyst', type: 'internship', category: 'Internship' }, // LEVEL UP - Floor 4 (current)
    { date: '2026-01', value: 105, label: 'Edgar Agent', type: 'project', category: 'Project' }, // New Project
  ]

  // Generate curve with step-change growth pattern
  for (let i = 0; i < milestones.length - 1; i++) {
    const current = milestones[i]
    const next = milestones[i + 1]
    const steps = 14
    const valueDiff = next.value - current.value

    // Add the current milestone point with its dot
    if (i === 0 || current.label) {
      data.push({
        time: formatDate(current.date),
        value: current.value,
        label: current.label || undefined,
        category: (current as any).category || undefined
      })
    }

    // Generate journey TO the next milestone
    for (let j = 1; j < steps; j++) {
      const progress = j / steps
      const baseValue = current.value + valueDiff * progress
      let value = baseValue

      if (next.type === 'internship') {
        // Journey TO internship: steady rise, then SHARP SPIKE UP to new plateau
        if (progress < 0.7) {
          // Pre-internship: steady upward build
          const steadyGrowth = progress * Math.abs(valueDiff) * 0.2
          const noise = (Math.random() - 0.5) * 1.8
          value = current.value + steadyGrowth + noise
        } else {
          // SPIKE UP phase - reaching new floor
          const spike = Math.pow((progress - 0.7) / 0.3, 2.8)
          const totalRise = Math.abs(valueDiff)
          value = current.value + (totalRise * 0.2) + (totalRise * 0.8 * spike) + (Math.random() - 0.3) * 1.5
        }
      } else if (next.type === 'sustain') {
        // SUSTAIN phase: stay at elevated level with small fluctuations
        // This is the plateau after an internship - you MAINTAIN the skills
        const flatFluctuation = Math.sin(progress * Math.PI * 4) * Math.abs(valueDiff) * 0.4
        const noise = (Math.random() - 0.5) * 1.5
        value = baseValue + flatFluctuation + noise
      } else if (next.type === 'project') {
        // Journey TO project: steady upward growth on current plateau
        const growth = Math.sin(progress * Math.PI) * Math.abs(valueDiff) * 0.2
        const noise = (Math.random() - 0.5) * 2.0
        value = baseValue + growth + noise
      } else if (next.type === 'competition') {
        // Journey TO competition: build then boost at result
        if (progress < 0.65) {
          const steady = Math.sin(progress * Math.PI * 1.2) * Math.abs(valueDiff) * 0.18
          const noise = (Math.random() - 0.5) * 1.8
          value = baseValue + steady + noise
        } else {
          // Boost from competition success
          const boost = Math.pow((progress - 0.65) / 0.35, 2.2)
          value = current.value + Math.abs(valueDiff) * 0.3 + (Math.abs(valueDiff) * 0.7 * boost) + (Math.random() - 0.35) * 1.5
        }
      } else if (next.type === 'learning') {
        // Learning phase: steady upward growth (coursework, skills building)
        const learning = Math.sin(progress * Math.PI) * Math.abs(valueDiff) * 0.18
        const noise = (Math.random() - 0.5) * 1.8
        value = baseValue + learning + noise
      } else {
        // Default: moderate steady growth
        const wave = Math.sin(progress * Math.PI * 1.5) * Math.abs(valueDiff) * 0.18
        const noise = (Math.random() - 0.5) * 1.8
        value = baseValue + wave + noise
      }

      // Add small realistic volatility (NOT crashes, just normal fluctuation)
      if (Math.random() < 0.11 && j > 2 && j < steps - 2) {
        value -= (Math.random() * 2.0 + 0.3) // Small dips
      }

      if (Math.random() < 0.09 && j > 2 && j < steps - 2) {
        value += (Math.random() * 2.0 + 0.3) // Small spikes
      }

      data.push({
        time: formatDate(current.date),
        value: Math.max(current.value - 2, Math.min(next.value + 1, value)), // Tight bounds - no big drops
        label: undefined
      })
    }
  }

  // Add final milestone
  const lastMilestone = milestones[milestones.length - 1]
  data.push({
    time: formatDate(lastMilestone.date),
    value: lastMilestone.value,
    label: lastMilestone.label || undefined,
    category: (lastMilestone as any).category || undefined
  })

  // Continue from last milestone to current date (January 2026)
  const [lastYear, lastMonth] = lastMilestone.date.split('-').map(Number)
  const lastMilestoneDate = new Date(lastYear, lastMonth - 1)
  const currentDate = new Date(2026, 0) // January 2026 (month is 0-indexed)

  // Only add continuation if current date is after last milestone
  if (currentDate > lastMilestoneDate) {
    const monthsDiff = (currentDate.getFullYear() - lastMilestoneDate.getFullYear()) * 12 +
      (currentDate.getMonth() - lastMilestoneDate.getMonth())

    // Generate points from last milestone to current date
    const steps = 14 // points per month
    for (let month = 1; month <= monthsDiff; month++) {
      const nextDate = new Date(lastMilestoneDate)
      nextDate.setMonth(lastMilestoneDate.getMonth() + month)
      const dateStr = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}`

      // Generate intermediate points for this month
      for (let j = 1; j <= steps; j++) {
        const progress = j / steps
        // Sustain at current level with small growth and fluctuations
        const smallGrowth = 0.3 * progress // Very small upward trend
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

// Filter timeline data by time range
export const filterTimelineData = (range: string): ChartDataPoint[] => {
  const allData = generateCareerTimelineData()

  let startDate: Date

  switch (range) {
    case '1D':
      // For career timeline with monthly data, show current month only
      startDate = new Date(2025, 9, 1) // October 1, 2025
      break
    case '1W':
      // Show last 2 months for meaningful view
      startDate = new Date(2025, 8, 1) // September 1, 2025
      break
    case '1M':
      // Last 1 month
      startDate = new Date(2025, 8, 1) // September 1, 2025 (1 month back from Oct)
      break
    case '3M':
      // Last 3 months
      startDate = new Date(2025, 6, 1) // July 1, 2025 (3 months back from Oct)
      break
    case 'YTD':
      // Year to date (2025)
      startDate = new Date(2025, 0, 1) // January 1, 2025
      break
    case '1Y':
      // Last year
      startDate = new Date(2024, 9, 1) // October 1, 2024
      break
    case 'ALL':
    default:
      // All time (from college start)
      return allData
  }

  // Filter data points based on date
  // Parse "Mon YYYY" format properly for mobile compatibility
  const monthMap: { [key: string]: number } = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  }

  const filteredData = allData.filter(point => {
    // point.time format is "Mon YYYY" (e.g., "Sep 2023")
    const [monthStr, yearStr] = point.time.split(' ')
    const pointDate = new Date(parseInt(yearStr), monthMap[monthStr] || 0, 1)
    return pointDate >= startDate
  })

  // Reverse fill: if we have fewer than 2 points, add points from before the range
  const MIN_POINTS = 2
  if (filteredData.length < MIN_POINTS) {
    const pointsNeeded = MIN_POINTS - filteredData.length
    const earliestFilteredIndex = allData.findIndex(point => point === filteredData[0])

    if (earliestFilteredIndex > 0) {
      // Add points from before the filtered range
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
export const mockSkills: Skill[] = [
  // Technical Skills
  { id: 'ts1', name: 'Python', proficiency: 95, yearsOfExperience: 3, category: 'technical' },
  { id: 'ts2', name: 'SQL', proficiency: 90, yearsOfExperience: 3, category: 'technical' },
  { id: 'ts3', name: 'JavaScript/TypeScript', proficiency: 88, yearsOfExperience: 2, category: 'technical' },
  { id: 'ts4', name: 'React', proficiency: 90, yearsOfExperience: 2, category: 'technical' },
  { id: 'ts5', name: 'Flask', proficiency: 85, yearsOfExperience: 2, category: 'technical' },
  { id: 'ts6', name: 'dbt-core', proficiency: 82, yearsOfExperience: 1, category: 'technical' },

  // Financial Skills
  { id: 'fs1', name: 'Financial Modeling', proficiency: 92, yearsOfExperience: 2, category: 'financial' },
  { id: 'fs2', name: 'Valuation (DCF)', proficiency: 88, yearsOfExperience: 2, category: 'financial' },
  { id: 'fs3', name: 'Risk Management', proficiency: 85, yearsOfExperience: 2, category: 'financial' },
  { id: 'fs4', name: 'Financial Statement Analysis', proficiency: 90, yearsOfExperience: 2, category: 'financial' },
  { id: 'fs5', name: 'Algorithmic Trading', proficiency: 88, yearsOfExperience: 1, category: 'financial' },
  { id: 'fs6', name: 'Portfolio Analytics', proficiency: 87, yearsOfExperience: 1, category: 'financial' },

  // Tools & Platforms
  { id: 'tl1', name: 'Bloomberg Terminal', proficiency: 85, yearsOfExperience: 2, category: 'tools' },
  { id: 'tl2', name: 'Microsoft Excel', proficiency: 95, yearsOfExperience: 3, category: 'tools' },
  { id: 'tl3', name: 'Power Automate', proficiency: 90, yearsOfExperience: 1, category: 'tools' },
  { id: 'tl4', name: 'SharePoint', proficiency: 85, yearsOfExperience: 1, category: 'tools' },
  { id: 'tl5', name: 'Git/GitHub', proficiency: 88, yearsOfExperience: 2, category: 'tools' },
  { id: 'tl6', name: 'Alpaca API', proficiency: 82, yearsOfExperience: 1, category: 'tools' },

  // Product & Leadership Skills
  { id: 'ss1', name: 'Product Strategy', proficiency: 88, yearsOfExperience: 2, category: 'soft' },
  { id: 'ss2', name: 'User Research', proficiency: 85, yearsOfExperience: 1, category: 'soft' },
  { id: 'ss3', name: 'Cross-Functional Leadership', proficiency: 90, yearsOfExperience: 2, category: 'soft' },
  { id: 'ss4', name: 'Stakeholder Management', proficiency: 87, yearsOfExperience: 2, category: 'soft' },
  { id: 'ss5', name: 'ETL Development', proficiency: 85, yearsOfExperience: 1, category: 'soft' },
  { id: 'ss6', name: 'FastAPI', proficiency: 80, yearsOfExperience: 1, category: 'technical' },
  { id: 'ss7', name: 'Supabase', proficiency: 85, yearsOfExperience: 1, category: 'tools' },
  { id: 'ss8', name: 'TailwindCSS', proficiency: 90, yearsOfExperience: 2, category: 'tools' },
  { id: 'ss9', name: 'MCP', proficiency: 80, yearsOfExperience: 1, category: 'technical' },
]

export const mockSkillCategories: SkillCategory[] = [
  {
    id: 'cat1',
    name: 'Technical Skills',
    icon: 'technical',
    skills: mockSkills.filter(s => s.category === 'technical'),
  },
  {
    id: 'cat2',
    name: 'Financial Skills',
    icon: 'financial',
    skills: mockSkills.filter(s => s.category === 'financial'),
  },
  {
    id: 'cat3',
    name: 'Tools & Platforms',
    icon: 'tools',
    skills: mockSkills.filter(s => s.category === 'tools'),
  },
  {
    id: 'cat4',
    name: 'Product & Leadership',
    icon: 'soft',
    skills: mockSkills.filter(s => s.category === 'soft'),
  },
]

// Professional Experience Data
export const mockExperiences: Experience[] = [
  {
    id: '1',
    company: 'Rutgers School of Environmental and Biological Sciences',
    position: 'Data Analyst Internship',
    location: 'New Brunswick, NJ',
    startDate: 'Sep 2025',
    endDate: 'Dec 2025',
    logoUrl: '/images/experience_images/rutgers.png',
    bullets: [
      'Owned the design and implementation of internal automation systems to eliminate manual verification across 300+ facilities, translating stakeholder workflows into scalable data validation pipelines',
      'Re-architected backend workflows to replace legacy premium connectors with native solutions, reducing software licensing costs by 60% while preserving reliability and auditability',
      'Built real-time progress tracking and automated notification systems to improve transparency and shorten verification cycles by 35%, aligning system behavior with operational needs',
    ],
  },
  {
    id: '2',
    company: 'Moweb Technologies',
    position: 'Software Engineering Internship',
    location: 'Secaucus, NJ',
    startDate: 'Jul 2025',
    endDate: 'Aug 2025',
    logoUrl: '/images/experience_images/moweb.png',
    bullets: [
      'Stabilized production ETL pipelines by introducing robust null-handling and data quality checks in dbt-core, reducing recurring failures from 20+ per week to under one',
      'Refactored data models and optimized Snowflake warehouse usage to reduce query latency by 40% for client-facing analytics workloads',
      'Designed and integrated LLM-powered quality-check automation to assist with data reconciliation, reducing manual validation overhead and improving consistency across reporting datasets',
    ],
  },
  {
    id: '3',
    company: 'Kaktus Sportswear',
    position: 'Financial Operations Internship',
    location: 'Carlstadt, NJ',
    startDate: 'Jul 2024',
    endDate: 'Aug 2024',
    logoUrl: '/images/experience_images/kaktus.png',
    bullets: [
      'Initiated cost structure analysis of shipping and inventory purchases, identifying inefficiencies leading to 15% cost reduction',
      'Implemented month-end close process optimizations by implementing automated financial reconciliation, reducing processing time by 25% while eliminating manual errors and strengthening the accuracy of $300K+ monthly transaction reconciliations',
      'Investigated vendor payment fluctuations to bolster audit readiness and mitigate risks associated with financial discrepancies',
    ],
  },
]

// Projects Data
export const mockProjects: Project[] = [
  {
    id: '7',
    name: 'Edgar Agent',
    subtitle: 'SEC 10-K API & MCP Server',
    duration: 'Jan 2026 – Present',
    bullets: [
      'Architected a pay-per-request API for SEC 10-K filings, returning schema-validated financial data and risk factors via a gated quote/nonce flow with cryptographic signature verification',
      'Engineered an LLM-powered extraction pipeline to transform unstructured EDGAR HTML into structured financials (revenue, net income, fiscal year-end) with validation to prevent malformed outputs',
      'Built an MCP server exposing the service as a tool for autonomous agents, enabling standardized financial data access without manual scraping or bespoke parsers',
    ],
    technologies: ['Python', 'FastAPI', 'x402', 'LLMs', 'MCP'],
    // imageUrl: '/images/edgarAgent.png',
    logoUrl: '/images/logoImages/edgarAgentClear.png',
  },
  {
    id: '1',
    name: 'Algorithmic Stock Trading',
    subtitle: 'Self-Guided, Volatility & Price Action-Based Strategies',
    duration: 'Nov 2024 – Present',
    bullets: [
      'Structured algorithmic trading bot using Python and Alpaca API, back tested daily across 100+ simulations, optimizing execution for risk-adjusted performance and capital efficiency',
      'Strategized risk-adjusted execution through dynamic position sizing and stop-loss optimization, sustaining a consistent 10% return in paper trading while minimizing volatility exposure per day for 5 consecutive days',
      'Synthesized trade signals by analyzing historical volatility trends and intraday price action, achieving a Sharpe ratio of 1.7',
    ],
    technologies: ['Python', 'Alpaca API', 'Pandas', 'NumPy'],
    imageUrl: '/images/algostocktrading.png',
    logoUrl: '/images/logoImages/algoStockTradingClear.png',
  },
  {
    id: '3',
    name: 'GrindSheet',
    subtitle: 'Social Fitness Analytics PWA',
    duration: 'May 2025 – Aug 2025',
    bullets: [
      'Built a consumer-facing fitness analytics product focused on low-friction logging and social motivation, translating UX constraints into scalable application architecture',
      'Designed a multi-factor scoring system to rank workouts and detect personal records, balancing fairness, engagement, and computational efficiency',
      'Implemented real-time synchronization and offline-first behavior using Supabase WebSockets and optimized client-side state management, reducing query overhead by 80%',
    ],
    technologies: ['React', 'TypeScript', 'Supabase', 'TailwindCSS'],
    githubUrl: 'https://github.com/vp-27/grindsheet',
    imageUrl: '/images/grindsheetUsage.png',
    logoUrl: '/images/logoImages/grindsheetClear.png',
    isMobileApp: true,
  },
  {
    id: '4',
    name: 'Sunny – Live Insurance Co-Pilot',
    subtitle: 'Microsoft Hackathon',
    duration: 'Jun 2025',
    bullets: [
      'Pitched a proof-of-concept real-time risk engine to Microsoft judges, processing 6+ live data sources to model dynamic quotes',
      'Designed streaming pipeline with Pathway to analyze 43+ data points, balancing technical feasibility and accuracy',
      'Built an LLM co-pilot on a FastAPI backend to serve personalized recommendations with natural language explanations',
    ],
    technologies: ['FastAPI', 'LLM', 'Pathway', 'Python'],
    liveUrl: 'https://insurance2-u4ew.onrender.com/',
    githubUrl: 'https://github.com/vp-27/insurance2',
    logoUrl: '/images/logoImages/sunnyClear.png',
  },
  {
    id: '5',
    name: 'Rutgers Shark Tank – "PerkPal"',
    subtitle: 'Startup Competition Finalist',
    duration: 'Mar 2025',
    bullets: [
      'Led a cross-functional team of 3 to top 6 finish (from 30+ teams) by effectively balancing business strategy with technical execution',
      'Developed business case for rewards consolidation platform identifying $2.4B+ opportunity in fragmented loyalty programs, while building live proof-of-concept demo in React and Selenium',
      'Presented venture pitch to investor panel, securing finalist recognition for platform\'s scalability and technical innovation',
    ],
    technologies: ['React', 'Selenium', 'Python'],
    liveUrl: 'https://perkpal.vercel.app/',
    githubUrl: 'https://github.com/vp-27/perkopoly',
    imageUrl: '/images/perkpal.png',
    logoUrl: '/images/logoImages/perkPalClear.png',
  },
  {
    id: '2',
    name: 'OroGenie',
    subtitle: 'Market Data Aggregation & Trading Analytics Platform',
    duration: 'Jun 2024 – Aug 2024',
    bullets: [
      'Engineered full-stack financial analytics platform using React and Flask, executing 500+ real-time transactions via WebSocket',
      'Established a distributed data pipeline integrating Yahoo Finance and Webull APIs, enabling real-time market data aggregation',
      'Enhanced SQL-driven portfolio analytics, evaluating performance trends, asset allocation, and risk exposure to support risk-managed trading strategies and quantitative trading analysis',
    ],
    technologies: ['React', 'Flask', 'WebSocket', 'SQL', 'Yahoo Finance API'],
    liveUrl: 'https://orogenie-frontend.onrender.com',
    githubUrl: 'https://github.com/vp-27/orogenie',
    imageUrl: '/images/orogenieShot.png',
    logoUrl: '/images/logoImages/orogenieClear.png',
  },
  {
    id: '6',
    name: 'Bender Trust – LIBOR Analysis',
    subtitle: 'Financial Modeling & Risk Assessment',
    duration: 'Mar 2024 – May 2024',
    bullets: [
      'Developed comprehensive LIBOR transition analysis model projecting 5-year impact on trust portfolios',
      'Built financial projections analyzing interest rate scenarios and their effects on $50M+ asset portfolio',
      'Presented findings to trust committee, informing strategic decisions on interest rate hedge positioning',
    ],
    technologies: ['Excel', 'Financial Modeling', 'Bloomberg Terminal'],
    logoUrl: '/images/logoImages/benderTrustClear.png',
  },
]

// Education Data
export const mockEducation: Education[] = [
  {
    id: '1',
    institution: 'Rutgers Business School',
    degrees: [
      'Bachelor of Science in Finance and Computer Science',
      'Bachelor of Arts in Data Science',
    ],
    location: 'New Brunswick, NJ',
    graduationDate: 'May 2027',
    gpa: '3.95',
    honors: [
      'Rutgers Honors College',
      'Dean\'s List (All Semesters)',
    ],
  },
]

// Certifications Data
export const mockCertifications: Certification[] = [
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
