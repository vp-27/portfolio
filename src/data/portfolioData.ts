import type { Skill, SkillCategory, Experience, Project, Education, Interest } from '../types/index.js'

export { careerMilestones, filterTimelineData, timelineRanges } from './timeline.js'

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
  { id: 'ts12', name: 'MLX / Local LLMs', proficiency: 88, yearsOfExperience: 1, category: 'technical' },
  { id: 'ts13', name: 'LoRA & LLM Fine-Tuning', proficiency: 86, yearsOfExperience: 1, category: 'technical' },

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
    id: 'llm-eval',
    name: 'LLM Fine-Tuning & Inference Evaluation',
    subtitle: 'Built a Python/MLX pipeline to evaluate LoRA adaptation economics, KV-prefix caching, and validation quality gates for Qwen3 8B.',
    duration: 'Sep 2026 – Present',
    bullets: [
      'Built Python/MLX pipeline to test when LoRA fine-tuning could cost less than repeatedly supplying task instructions',
      'Fine-tuned Qwen3 8B; rejected faster setup after scoring 79/96 on synthetic validation versus 96/96 for the baseline',
      'Reduced mean Qwen3 8B latency by 18% (6.99s to 5.73s) via KV-prefix caching, preserving validation accuracy',
    ],
    technologies: ['Python', 'MLX', 'Qwen3', 'LoRA', 'KV Caching'],
    logoUrl: '/images/logoImages/mlexperimentClear.png',
  },
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
    liveUrl: 'https://vtch-game.vercel.app/',
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
    githubUrl: 'https://github.com/vp-27/PerkPal',
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
