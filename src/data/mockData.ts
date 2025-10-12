import type { Stock, PortfolioData, ChartDataPoint, Skill, SkillCategory, Experience, Project, Education, Certification } from '../types'

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
  totalValue: 3993.00, // Total "market value" of all experiences
  buyingPower: 394.00, // GPA * 100 = 3.94 * 100
  todayReturn: 84.16,
  todayReturnPercent: 2.15,
  totalReturn: 863.00, // Sum of all total returns
  totalReturnPercent: 27.61, // Weighted average of improvements
}

// Generate career timeline chart data
export const generateCareerTimelineData = (): ChartDataPoint[] => {
  const data: ChartDataPoint[] = []
  
  // Career milestones with dates and momentum scores (0-100)
  const milestones = [
    { date: '2023-09', value: 20, label: 'Started Rutgers' },
    { date: '2024-03', value: 35, label: 'Bender Trust Project' },
    { date: '2024-06', value: 50, label: 'OroGenie Project' },
    { date: '2024-07', value: 70, label: 'Kaktus Internship' },
    { date: '2024-11', value: 75, label: 'Algo Trading Project' },
    { date: '2025-03', value: 85, label: 'Shark Tank Finalist' },
    { date: '2025-05', value: 88, label: 'GrindSheet Launch' },
    { date: '2025-06', value: 90, label: 'Sunny Hackathon' },
    { date: '2025-07', value: 95, label: 'Moweb Internship' },
    { date: '2025-09', value: 100, label: 'SEBS Data Analyst' },
  ]
  
  // Generate smooth curve between milestones
  for (let i = 0; i < milestones.length - 1; i++) {
    const current = milestones[i]
    const next = milestones[i + 1]
    const steps = 10
    
    for (let j = 0; j < steps; j++) {
      const progress = j / steps
      const value = current.value + (next.value - current.value) * progress
      data.push({ 
        time: current.date,
        value: value,
        label: j === 0 ? current.label : undefined
      })
    }
  }
  
  // Add final milestone
  const lastMilestone = milestones[milestones.length - 1]
  data.push({ 
    time: lastMilestone.date,
    value: lastMilestone.value,
    label: lastMilestone.label
  })
  
  return data
}

// Filter timeline data by time range
export const filterTimelineData = (range: string): ChartDataPoint[] => {
  const allData = generateCareerTimelineData()
  
  let startDate: Date
  
  switch (range) {
    case '1D':
      // Last week of activity (treating as recent)
      startDate = new Date('2025-09-01')
      break
    case '1W':
      // Last month
      startDate = new Date('2025-09-01')
      break
    case '1M':
      // Last 3 months
      startDate = new Date('2025-07-01')
      break
    case '3M':
      // Last 3 months
      startDate = new Date('2025-07-01')
      break
    case 'YTD':
      // Year to date (2025)
      startDate = new Date('2025-01-01')
      break
    case '1Y':
      // Last year
      startDate = new Date('2024-10-01')
      break
    case 'ALL':
    default:
      // All time (from college start)
      return allData
  }
  
  // Filter data points based on date
  return allData.filter(point => {
    const pointDate = new Date(point.time + '-01')
    return pointDate >= startDate
  })
}

export const mockChartData = generateCareerTimelineData()

// Keep old function for reference
export const generateMockChartData = (): ChartDataPoint[] => {
  const data: ChartDataPoint[] = []
  const startValue = mockPortfolio.totalValue - mockPortfolio.todayReturn
  const points = 78
  
  for (let i = 0; i <= points; i++) {
    const progress = i / points
    const randomVariation = (Math.random() - 0.5) * 50
    const value = startValue + (mockPortfolio.todayReturn * progress) + randomVariation
    
    const startHour = 9
    const startMinute = 30
    const totalMinutes = startMinute + (i * 5)
    const hour = startHour + Math.floor(totalMinutes / 60)
    const minute = totalMinutes % 60
    const time = `${hour}:${minute.toString().padStart(2, '0')}`
    
    data.push({ time, value })
  }
  
  return data
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
    position: 'Data Analyst Intern',
    location: 'New Brunswick, NJ',
    startDate: 'Sep 2025',
    endDate: 'Present',
    bullets: [
      'Eliminated 40+ hours of annual manual verification across 300+ buildings by engineering Power Automate solution, enabling semi-annual cycles and eliminating data entry errors impacting facility management',
      'Enabled real-time progress tracking via dynamic notifications, improving task completion by 35% and reducing follow-ups',
      'Executed workflow re-architecture cutting software costs 60% by replacing premium connectors with native SharePoint solution while preserving 100% reliability',
    ],
  },
  {
    id: '2',
    company: 'Moweb Technologies',
    position: 'Data Team Intern',
    location: 'Secaucus, NJ',
    startDate: 'Jul 2025',
    endDate: 'Aug 2025',
    bullets: [
      'Developed ETL workflows in dbt-core and SQL, fixing null conflicts and reducing pipeline failures from 20+ weekly to <1',
      'Delivered optimized financial metric extraction for client reporting, reducing processing times by 40% for real-time analysis',
      'Directed LLM integration across team workflows, designing workshops that decreased manual reconciliation time by 30%',
    ],
  },
  {
    id: '3',
    company: 'Kaktus Sportswear',
    position: 'Financial Operations Intern',
    location: 'Carlstadt, NJ',
    startDate: 'Jul 2024',
    endDate: 'Aug 2024',
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
  },
  {
    id: '3',
    name: 'GrindSheet',
    subtitle: 'Fitness Tracking PWA',
    duration: 'May 2025 – Aug 2025',
    bullets: [
      'Launched a fitness PWA after identifying market whitespace for simple, social tracking via competitive analysis of 20+ apps',
      'Decreased user input time 60% through 3-step flow by conducting observational research with 15+ gym-goers, prioritizing speed over comprehensive logging based on behavior patterns',
      'Increased engagement 40% through gamified badges and leaderboards, leveraging behavioral psychology to drive retention',
    ],
    technologies: ['React', 'PWA', 'TypeScript'],
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
    gpa: '3.94',
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
