import { professionalExperiences, portfolioProjects, portfolioEducation, skillCategories } from '../data/portfolioData'

export interface AIQueryResult {
  answer: string
  milestoneLabel: string | null
  targetType: 'experience' | 'project' | 'education' | 'skills' | 'contact' | null
  targetId: string | null
  suggestedChips: string[]
}

const defaultChips = [
  'Tell me about Amazon SCOT',
  'What trading bots has he built?',
  'Why CS and Finance?',
  'What technical skills does he have?'
]

export function isNaturalLanguageQuery(query: string): boolean {
  const trimmed = query.trim().toLowerCase()
  if (!trimmed) return false
  if (trimmed.endsWith('?')) return true
  
  const nlPrefixes = [
    'what', 'why', 'how', 'who', 'where', 'when',
    'tell me', 'does he', 'is he', 'show me', 'can he',
    'explain', 'describe', 'list', 'about'
  ]

  return nlPrefixes.some(prefix => trimmed.startsWith(prefix)) || trimmed.split(' ').length >= 4
}

export function processAIQuery(query: string): AIQueryResult {
  const q = query.toLowerCase().trim()

  // 1. Amazon SCOT / Supply Chain
  if (q.includes('amazon') || q.includes('scot') || q.includes('supply chain') || q.includes('operations analyst')) {
    return {
      answer: "Vandan is an incoming Operations Analyst Intern at Amazon | Supply Chain Optimization Technologies (SCOT) for Summer 2026. He works on optimizing large-scale logistics and inventory dynamics at the intersection of tech and data science.",
      milestoneLabel: 'Amazon SCOT',
      targetType: 'experience',
      targetId: 'amazon1',
      suggestedChips: ['What tech stack does he use?', 'Tell me about Algo Trading Bot', 'View his Finance Resume']
    }
  }

  // 2. Algo Trading Bot / Quant / Trading
  if (q.includes('trading') || q.includes('algo') || q.includes('bot') || q.includes('quant') || q.includes('stock') || q.includes('crypto')) {
    return {
      answer: "Vandan built an Algorithmic Trading Bot utilizing Python, backtesting algorithms, and technical indicators (RMA, MACD, Bollinger Bands) to execute automated market strategy testing.",
      milestoneLabel: 'Algo Trading Bot',
      targetType: 'project',
      targetId: '1',
      suggestedChips: ['Show OroGenie Platform', 'What are his financial skills?', 'Tell me about Amazon SCOT']
    }
  }

  // 3. OroGenie / FinTech / Gemstone
  if (q.includes('orogenie') || q.includes('gemstone') || q.includes('pricing') || q.includes('shark tank')) {
    return {
      answer: "OroGenie is a FinTech gemstone valuation and market insights platform built by Vandan, which placed in the Top 6 at Rutgers Shark Tank pitch competitions.",
      milestoneLabel: 'OroGenie Platform',
      targetType: 'project',
      targetId: '2',
      suggestedChips: ['Tell me about GrindSheet', 'What CS tools does he know?', 'Where did he intern?']
    }
  }

  // 4. Rutgers / Education / Honors College
  if (q.includes('rutgers') || q.includes('education') || q.includes('gpa') || q.includes('college') || q.includes('degree') || q.includes('major')) {
    return {
      answer: "Vandan attends Rutgers University - New Brunswick (Honors College), pursuing a triple focus in Computer Science, Finance, and Data Science.",
      milestoneLabel: 'Started Rutgers',
      targetType: 'education',
      targetId: '1',
      suggestedChips: ['What are his technical skills?', 'Tell me about Moweb', 'View CS Resume']
    }
  }

  // 5. Moweb Technologies
  if (q.includes('moweb') || q.includes('software engineering intern') || q.includes('swe intern')) {
    return {
      answer: "Vandan worked as a Software Engineering Intern at Moweb Technologies, developing responsive web interfaces, optimizing API workflows, and working with React & TypeScript.",
      milestoneLabel: 'Moweb Data Team',
      targetType: 'experience',
      targetId: '2',
      suggestedChips: ['Tell me about SEBS Data Analyst', 'What projects has he built?', 'Contact Vandan']
    }
  }

  // 6. SEBS Data Analyst
  if (q.includes('sebs') || q.includes('data analyst') || q.includes('environmental')) {
    return {
      answer: "At Rutgers SEBS, Vandan worked as a Data Analyst Intern automating data processing pipelines, handling statistical modeling, and visualizing datasets.",
      milestoneLabel: 'SEBS Data Analyst',
      targetType: 'experience',
      targetId: '1',
      suggestedChips: ['What programming languages does he use?', 'Tell me about Amazon SCOT', 'View Skills']
    }
  }

  // 7. Why CS & Finance? / Background
  if (q.includes('why') || q.includes('background') || q.includes('finance') || q.includes('cs') || q.includes('data science') || q.includes('philosophy')) {
    return {
      answer: "Vandan works at the intersection of finance, data science, and software engineering. He designs tools that save time tomorrow while understanding macro system dynamics and micro code implementation details.",
      milestoneLabel: null,
      targetType: 'skills',
      targetId: null,
      suggestedChips: ['What technical skills does he have?', 'Tell me about Algo Trading Bot', 'Contact Vandan']
    }
  }

  // 8. Technical Skills / Stack
  if (q.includes('skill') || q.includes('python') || q.includes('react') || q.includes('typescript') || q.includes('sql') || q.includes('c++')) {
    return {
      answer: "Vandan's technical stack includes React, TypeScript, Python, SQL, C++, Git, Docker, and AWS, complemented by strong financial modeling and quantitative analytics skills.",
      milestoneLabel: null,
      targetType: 'skills',
      targetId: null,
      suggestedChips: ['View CS Resume', 'View Finance Resume', 'Tell me about OroGenie']
    }
  }

  // 9. Contact / Socials / LinkedIn / GitHub / Email
  if (q.includes('contact') || q.includes('email') || q.includes('linkedin') || q.includes('github') || q.includes('reach') || q.includes('hire')) {
    return {
      answer: "You can reach Vandan via email at vrp77@scarletmail.rutgers.edu, connect on LinkedIn at linkedin.com/in/vandan-patel-vp, or check out his code at github.com/vp-27.",
      milestoneLabel: null,
      targetType: 'contact',
      targetId: null,
      suggestedChips: ['View CS Resume', 'View Finance Resume', 'Tell me about Amazon SCOT']
    }
  }

  // Generic AI Fallback Answer based on keyword matches
  return {
    answer: `Based on your search "${query}", Vandan Patel is a CS, Finance & Data Science student at Rutgers Honors College with experience at Amazon SCOT, Moweb Technologies, and SEBS, building quantitative trading bots and FinTech applications.`,
    milestoneLabel: null,
    targetType: null,
    targetId: null,
    suggestedChips: defaultChips
  }
}
