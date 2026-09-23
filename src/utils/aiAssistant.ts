import { professionalExperiences, portfolioProjects, portfolioEducation, skillCategories, portfolioInterests, portfolioStocks } from '../data/portfolioData'

export interface ActionLink {
  label: string
  url: string
}

export interface AIQueryResult {
  answer: string
  milestoneLabel: string | null
  milestoneLabels?: string[]
  targetType: 'experience' | 'project' | 'education' | 'skills' | 'contact' | 'resume_cs' | 'resume_finance' | null
  targetId: string | null
  actionUrl?: string
  actionLabel?: string
  actionLinks?: ActionLink[]
  suggestedChips: string[]
}

const defaultChips = [
  'Tell me about Amazon SCOT',
  'Tell me about GALE',
  'Why CS and Finance?',
  'View CS Resume',
  'View Finance Resume'
]

/**
 * Dynamically constructs complete site context directly from portfolioData.ts single source of truth.
 * Covers About Me, Experiences, Projects (with live & GitHub URLs), Education, Skills, Interests, and Watchlist Items.
 */
function getDynamicSiteContext(): string {
  const bio = "Vandan Patel: Computer Science, Finance, and Data Science student at Rutgers Honors College (GPA 3.96, Phi Beta Kappa, Expected Graduation: May 2027). Financial Analyst Intern at Amazon SCOT (Supply Chain Optimization Technologies, Bellevue WA). Quantitative builder creating FinTech tools, agentic platforms, trading bots, and data pipelines."
  const contact = "Direct Contact & Social Links: Email: vrp77@scarletmail.rutgers.edu, LinkedIn: https://linkedin.com/in/vandan-patel-vp, GitHub: https://github.com/vp-27"
  
  const stocks = portfolioStocks.map(s => `${s.name} (${s.symbol}): Impact/Return ${s.totalReturnPercent}%`).join('\n')
  const exps = professionalExperiences.map(e => `${e.company} (${e.position}, ${e.startDate}-${e.endDate}): ${e.bullets.join('; ')}`).join('\n')
  
  const projs = portfolioProjects.map(p => {
    const links: string[] = []
    if (p.liveUrl) links.push(`Live Demo: ${p.liveUrl}`)
    if (p.githubUrl) links.push(`GitHub Code: ${p.githubUrl}`)
    const linkStr = links.length > 0 ? ` [${links.join(' | ')}]` : ''
    return `${p.name} (${p.subtitle})${linkStr}: ${p.bullets.join('; ')}`
  }).join('\n')

  const edu = portfolioEducation.map(ed => {
    const certs = ed.certifications && ed.certifications.length > 0
      ? ` | Certifications: ${ed.certifications.map(c => `${c.name} (${c.issuer})`).join(', ')}`
      : ''
    return `${ed.institution} (${ed.degrees.join(', ')}, Expected Graduation: ${ed.graduationDate}, Location: ${ed.location}, GPA ${ed.gpa}): Honors: ${ed.honors.join('; ')}${certs}`
  }).join('\n')
  const skills = skillCategories.map(cat => `${cat.name}: ${cat.skills.map(s => s.name).join(', ')}`).join('\n')
  const interests = portfolioInterests.map(i => `${i.name} (${i.category})`).join(', ')

  return `About Me:\n${bio}\n\nContact Details:\n${contact}\n\nRobinhood Watchlist Items & Impact Percentages:\n${stocks}\n\nProfessional Experiences:\n${exps}\n\nProjects:\n${projs}\n\nEducation & Honors:\n${edu}\n\nTechnical, Financial & Tool Skills:\n${skills}\n\nBeyond the Terminal (Interests & Hobbies):\n${interests}`
}

export function isNaturalLanguageQuery(query: string): boolean {
  const trimmed = query.trim().toLowerCase()
  if (!trimmed) return false
  if (trimmed.endsWith('?')) return true
  
  const nlPrefixes = [
    'what', 'why', 'how', 'who', 'where', 'when',
    'tell me', 'does he', 'is he', 'show me', 'can he',
    'explain', 'describe', 'list', 'about', 'view', 'open',
    'contact', 'get'
  ]

  return nlPrefixes.some(prefix => trimmed.startsWith(prefix)) || trimmed.split(' ').length >= 3
}

export function processAIQuery(query: string): AIQueryResult {
  const q = query.toLowerCase().trim()

  // 1. CS Resume Direct Action Shortcut
  if (q.includes('cs resume') || q.includes('computer science resume') || q.includes('swe resume') || q.includes('tech resume')) {
    return {
      answer: "Vandan's Computer Science Resume highlights his software engineering experience (React, TypeScript, Python, FastAPI, SQL, dbt-core), AI agent platform engineering at Amazon SCOT, custom pub/sub algorithms (GALE), and SEC 10-K API tools.",
      milestoneLabel: null,
      targetType: 'resume_cs',
      targetId: null,
      actionUrl: '/resumes/Vandan_Patel_CS.pdf',
      actionLabel: 'Open CS Resume (PDF)',
      suggestedChips: ['View Finance Resume', 'Tell me about Amazon SCOT', 'What projects has he built?']
    }
  }

  // 2. Finance Resume Direct Action Shortcut
  if (q.includes('finance resume') || q.includes('quant resume') || q.includes('banking resume')) {
    return {
      answer: "Vandan's Finance Resume details his financial analysis & P&L liquidation variance attribution at Amazon SCOT, SEC 10-K extraction API, algorithmic trading bot, and investment analysis competitions (Bender Trust LIBOR).",
      milestoneLabel: null,
      targetType: 'resume_finance',
      targetId: null,
      actionUrl: '/resumes/Vandan_Patel_Finance.pdf',
      actionLabel: 'Open Finance Resume (PDF)',
      suggestedChips: ['View CS Resume', 'Tell me about Algo Trading Bot', 'Why CS and Finance?']
    }
  }

  // 3. Direct Contact Links Shortcut (Email, LinkedIn, GitHub)
  if (q.includes('contact') || q.includes('email') || q.includes('linkedin') || q.includes('github') || q.includes('reach') || q.includes('touch') || q.includes('message') || q.includes('hire')) {
    const actionLinks: ActionLink[] = []

    if (q.includes('linkedin')) {
      actionLinks.push({ label: 'LinkedIn Profile', url: 'https://linkedin.com/in/vandan-patel-vp' })
    }
    if (q.includes('github')) {
      actionLinks.push({ label: 'GitHub Repository', url: 'https://github.com/vp-27' })
    }
    if (q.includes('email') || q.includes('contact') || q.includes('reach') || q.includes('touch')) {
      actionLinks.push({ label: 'Send Email to Vandan', url: 'mailto:vrp77@scarletmail.rutgers.edu' })
    }
    if (actionLinks.length === 0) {
      actionLinks.push(
        { label: 'Send Email', url: 'mailto:vrp77@scarletmail.rutgers.edu' },
        { label: 'LinkedIn Profile', url: 'https://linkedin.com/in/vandan-patel-vp' },
        { label: 'GitHub Profile', url: 'https://github.com/vp-27' }
      )
    }

    return {
      answer: "You can connect with Vandan via email at vrp77@scarletmail.rutgers.edu, view his professional network on LinkedIn, or inspect his open-source software projects on GitHub.",
      milestoneLabel: null,
      targetType: 'contact',
      targetId: null,
      actionLinks,
      suggestedChips: ['View CS Resume', 'View Finance Resume', 'Tell me about Amazon SCOT']
    }
  }

  // Fallback for processAIQuery: returns empty answer to signify that async Gemini AI should generate the full response
  return {
    answer: '',
    milestoneLabel: null,
    targetType: null,
    targetId: null,
    suggestedChips: defaultChips
  }
}

/**
 * Intelligent Dynamic Persona Synthesizer for open-ended queries (Offline Fallback Engine)
 * Grounded directly in portfolioData.ts: supports all projects, experiences, education, and skills.
 */
function synthesizePersonaAnswer(query: string): AIQueryResult {
  const q = query.toLowerCase().trim()

  // 1. Amazon SCOT
  if (q.includes('amazon') || q.includes('scot') || q.includes('headless excel') || q.includes('excel compute') || q.includes('liquidation')) {
    return {
      answer: "At Amazon SCOT (Supply Chain Optimization Technologies in Bellevue, WA), Vandan built a headless Excel compute engine with a custom formula evaluator & dependency graph exposed via MCP, achieving 99.86% output fidelity and a 5,700× speedup. He also prototyped an org-wide knowledgebase with a directory crawler and 2 MCP servers.",
      milestoneLabel: 'Amazon SCOT',
      targetType: 'experience',
      targetId: 'amazon1',
      actionLinks: [
        { label: 'Open CS Resume (PDF)', url: '/resumes/Vandan_Patel_CS.pdf' },
        { label: 'Open Finance Resume (PDF)', url: '/resumes/Vandan_Patel_Finance.pdf' },
        { label: 'LinkedIn Profile', url: 'https://linkedin.com/in/vandan-patel-vp' }
      ],
      suggestedChips: ['What tech stack did he use at Amazon?', 'Tell me about GALE', 'View CS Resume']
    }
  }

  // 2. GALE Engine
  if (q.includes('gale') || q.includes('gamified') || q.includes('multiplayer') || q.includes('leetcode') || q.includes('elo rating') || q.includes('coding platform')) {
    return {
      answer: "GALE (Gamified Algorithmic Learning Engine) is Vandan's real-time multiplayer coding platform featuring custom WebSockets pub/sub, a Redis state store, an Elo rating system, and isolated dual sandbox runners (Node/Python) achieving sub-50ms message latency across concurrent sessions.",
      milestoneLabel: 'GALE Engine',
      targetType: 'project',
      targetId: 'gale',
      actionLinks: [
        { label: 'Live Demo (GALE Engine)', url: 'https://gale-engine.vercel.app' },
        { label: 'GitHub Code (GALE Engine)', url: 'https://github.com/vp-27/gale' }
      ],
      suggestedChips: ['Tell me about Edgar Agent', 'View CS Resume', 'Tell me about Amazon SCOT']
    }
  }

  // 3. Edgar Agent - SEC 10-K API
  if (q.includes('edgar') || q.includes('sec') || q.includes('10-k') || q.includes('10k') || q.includes('filing') || q.includes('quote-sign-extract') || q.includes('pay-per-request')) {
    return {
      answer: "Edgar Agent is a pay-per-request API for SEC 10-K filings with cryptographic signature verification, quote-sign-extract access gating, and schema-constrained LLM extraction built with Python, FastAPI, MCP, and SEC EDGAR data.",
      milestoneLabel: 'Edgar Agent',
      targetType: 'project',
      targetId: '7',
      actionLinks: [
        { label: 'Live Demo (Edgar Agent)', url: 'https://edgar-agent.vercel.app' },
        { label: 'GitHub Code (Edgar Agent)', url: 'https://github.com/vp-27/edgar-agent' }
      ],
      suggestedChips: ['Tell me about Algo Trading Bot', 'View CS Resume', 'Tell me about Amazon SCOT']
    }
  }

  // 4. Algorithmic Trading Bot
  if (q.includes('algo') || q.includes('trading') || q.includes('alpaca') || q.includes('mean-reversion') || q.includes('quant') || q.includes('alpha') || q.includes('backtest')) {
    return {
      answer: "Vandan engineered automated mean-reversion and momentum algorithmic trading strategies integrated with Alpaca API, incorporating real-time market data streaming, automated position sizing, and risk-adjusted portfolio backtesting in Python.",
      milestoneLabel: 'Algo Trading Bot',
      targetType: 'project',
      targetId: '1',
      actionLinks: [
        { label: 'GitHub Code (Algo Trading)', url: 'https://github.com/vp-27/algo-trading' },
        { label: 'Open Finance Resume (PDF)', url: '/resumes/Vandan_Patel_Finance.pdf' }
      ],
      suggestedChips: ['Why CS and Finance?', 'Tell me about Edgar Agent', 'View Finance Resume']
    }
  }

  // 5. GrindSheet - iOS Fitness App
  if (q.includes('grindsheet') || q.includes('fitness') || q.includes('ios') || q.includes('swiftui') || q.includes('healthkit') || q.includes('workout') || q.includes('gym')) {
    return {
      answer: "GrindSheet is a native iOS fitness logging app architected with SwiftUI, custom CoreData synchronization, and Apple HealthKit integration, achieving 99.8% crash-free sessions across beta testers.",
      milestoneLabel: 'GrindSheet',
      targetType: 'project',
      targetId: '3',
      actionLinks: [
        { label: 'Live Demo (GrindSheet)', url: 'https://grindsheet.app' },
        { label: 'GitHub Code (GrindSheet)', url: 'https://github.com/vp-27/grindsheet' }
      ],
      suggestedChips: ['Tell me about GALE', 'View CS Resume', 'Tell me about Amazon SCOT']
    }
  }

  // 6. PerkPal - Shark Tank Top 6
  if (q.includes('perkpal') || q.includes('shark tank') || q.includes('perkopoly') || q.includes('pitch') || q.includes('perks')) {
    return {
      answer: "PerkPal (formerly Perkopoly) is an employee perks and gamified workplace engagement platform that Vandan co-founded and pitched, placing in the top 6 out of 100+ teams in the Rutgers Shark Tank competition.",
      milestoneLabel: 'Shark Tank Top 6',
      targetType: 'project',
      targetId: '5',
      actionLinks: [
        { label: 'Live Demo (PerkPal)', url: 'https://perkpal.app' }
      ],
      suggestedChips: ['Tell me about GALE', 'View CS Resume', 'Tell me about Amazon SCOT']
    }
  }

  // 7. Moweb Technologies
  if (q.includes('moweb') || q.includes('microservice') || q.includes('postgresql') || q.includes('ci/cd') || q.includes('p95')) {
    return {
      answer: "At Moweb Technologies, Vandan served as a Software Engineer Intern architecting scalable RESTful microservices with Node.js and PostgreSQL, optimizing database indexes to reduce p95 latency by 34%, and implementing CI/CD pipelines via Docker.",
      milestoneLabel: 'Moweb Technologies',
      targetType: 'experience',
      targetId: '2',
      actionLinks: [
        { label: 'Open CS Resume (PDF)', url: '/resumes/Vandan_Patel_CS.pdf' },
        { label: 'LinkedIn Profile', url: 'https://linkedin.com/in/vandan-patel-vp' }
      ],
      suggestedChips: ['Tell me about Amazon SCOT', 'What projects has he built?', 'View CS Resume']
    }
  }

  // 8. Rutgers SEBS Data Analyst
  if (q.includes('sebs') || q.includes('data analyst') || q.includes('tableau') || q.includes('grant') || q.includes('research data')) {
    return {
      answer: "As a Data Analyst at Rutgers SEBS (School of Environmental and Biological Sciences), Vandan developed automated Python pipelines for cleaning and aggregating multi-source research datasets, designing interactive Tableau dashboards for faculty grant reporting.",
      milestoneLabel: 'SEBS Data Analyst',
      targetType: 'experience',
      targetId: '1',
      actionLinks: [
        { label: 'Open CS Resume (PDF)', url: '/resumes/Vandan_Patel_CS.pdf' },
        { label: 'LinkedIn Profile', url: 'https://linkedin.com/in/vandan-patel-vp' }
      ],
      suggestedChips: ['Tell me about Amazon SCOT', 'Tell me about Algo Trading Bot', 'View CS Resume']
    }
  }

  // 9. Education / Rutgers / GPA / Honors
  if (q.includes('rutgers') || q.includes('gpa') || q.includes('degree') || q.includes('education') || q.includes('college') || q.includes('major') || q.includes('graduat') || q.includes('phi beta kappa') || q.includes('honors')) {
    return {
      answer: "Vandan Patel is pursuing a triple major in Computer Science (B.S.), Finance (B.S.), and Data Science (B.A.) at Rutgers Honors College (GPA 3.96, Dean's List every semester, Phi Beta Kappa) with an expected graduation date of May 2027.",
      milestoneLabel: 'Started Rutgers',
      targetType: 'education',
      targetId: '1',
      actionLinks: [
        { label: 'Open CS Resume (PDF)', url: '/resumes/Vandan_Patel_CS.pdf' },
        { label: 'Open Finance Resume (PDF)', url: '/resumes/Vandan_Patel_Finance.pdf' }
      ],
      suggestedChips: ['View CS Resume', 'View Finance Resume', 'Tell me about Amazon SCOT']
    }
  }

  // 10. Certifications
  if (q.includes('certif') || q.includes('bloomberg') || q.includes('bmc') || q.includes('bff') || q.includes('aws') || q.includes('series 65')) {
    return {
      answer: "Vandan holds Bloomberg Market Concepts (BMC) and Bloomberg Finance Fundamentals (BFF) certifications. He is also currently in progress for AWS Certified Cloud Practitioner and preparing for the Series 65 exam.",
      milestoneLabel: 'Started Rutgers',
      targetType: 'education',
      targetId: '1',
      actionLinks: [
        { label: 'Open Finance Resume (PDF)', url: '/resumes/Vandan_Patel_Finance.pdf' }
      ],
      suggestedChips: ['Tell me about Algo Trading Bot', 'View CS Resume', 'Tell me about Amazon SCOT']
    }
  }

  // 11. Technical Skills / Languages / Stack / MCP
  if (q.includes('code') || q.includes('developer') || q.includes('tech') || q.includes('build') || q.includes('stack') || q.includes('language') || q.includes('skills') || q.includes('mcp') || q.includes('framework')) {
    return {
      answer: "Vandan's technical stack spans Python, Java, JavaScript/TypeScript, React, Next.js, Node.js, FastAPI, SwiftUI, WebSockets, Redis, and Model Context Protocol (MCP). For data engineering and cloud, he works with PostgreSQL, Supabase, Snowflake, dbt-core, and Docker.",
      milestoneLabel: null,
      targetType: 'skills',
      targetId: null,
      actionLinks: [
        { label: 'Open CS Resume (PDF)', url: '/resumes/Vandan_Patel_CS.pdf' },
        { label: 'GitHub Profile', url: 'https://github.com/vp-27' }
      ],
      suggestedChips: ['Tell me about GALE', 'Tell me about Edgar Agent', 'View CS Resume']
    }
  }

  // 12. Why CS & Finance?
  if (q.includes('why cs') || q.includes('why finance') || q.includes('cs and finance') || q.includes('both') || q.includes('intersection')) {
    return {
      answer: "Vandan bridges software engineering and quantitative finance—combining low-latency distributed systems, automated data extraction, and agentic AI architectures to solve complex financial automation, risk modeling, and market execution challenges.",
      milestoneLabel: null,
      targetType: null,
      targetId: null,
      actionLinks: [
        { label: 'Open CS Resume (PDF)', url: '/resumes/Vandan_Patel_CS.pdf' },
        { label: 'Open Finance Resume (PDF)', url: '/resumes/Vandan_Patel_Finance.pdf' }
      ],
      suggestedChips: ['Tell me about Amazon SCOT', 'Tell me about Algo Trading Bot', 'View CS Resume']
    }
  }

  // 13. Career / Hiring / Roles
  if (q.includes('hire') || q.includes('role') || q.includes('intern') || q.includes('future') || q.includes('career') || q.includes('job')) {
    return {
      answer: "Vandan is a Financial Analyst Intern at Amazon SCOT for Summer 2026. He is positioning for high-impact roles across Software Engineering (SWE), Quantitative Analytics, and FinTech where strong system architecture and financial acumen meet.",
      milestoneLabel: 'Amazon SCOT',
      targetType: 'experience',
      targetId: 'amazon1',
      actionLinks: [
        { label: 'Open CS Resume (PDF)', url: '/resumes/Vandan_Patel_CS.pdf' },
        { label: 'Open Finance Resume (PDF)', url: '/resumes/Vandan_Patel_Finance.pdf' },
        { label: 'Send Email to Vandan', url: 'mailto:vrp77@scarletmail.rutgers.edu' }
      ],
      suggestedChips: ['Contact Vandan', 'View CS Resume', 'View Finance Resume']
    }
  }

  // 14. Dynamic Project / Experience Finder across portfolioData
  for (const proj of portfolioProjects) {
    const projNameMatch = q.includes(proj.name.toLowerCase()) || (proj.technologies && proj.technologies.some(t => q.includes(t.toLowerCase())))
    if (projNameMatch) {
      const links: ActionLink[] = []
      if (proj.liveUrl) links.push({ label: `Live Demo (${proj.name})`, url: proj.liveUrl })
      if (proj.githubUrl) links.push({ label: `GitHub Code (${proj.name})`, url: proj.githubUrl })
      const techList = proj.technologies && proj.technologies.length > 0 ? ` Built using ${proj.technologies.join(', ')}.` : ''
      return {
        answer: `${proj.name}: ${proj.subtitle} Key highlights: ${proj.bullets[0]}${techList}`,
        milestoneLabel: proj.name.includes('GALE') ? 'GALE Engine' : proj.name.includes('Edgar') ? 'Edgar Agent' : proj.name.includes('Trading') ? 'Algo Trading Bot' : proj.name.includes('GrindSheet') ? 'GrindSheet' : null,
        targetType: 'project',
        targetId: proj.id,
        actionLinks: links.length > 0 ? links : undefined,
        suggestedChips: ['Tell me about Amazon SCOT', 'View CS Resume', 'Tell me about GALE']
      }
    }
  }

  // Default intelligent portfolio persona overview
  return {
    answer: "Vandan Patel is a CS, Finance & Data Science student at Rutgers Honors College (GPA 3.96, Phi Beta Kappa, graduating May 2027) and Financial Analyst Intern at Amazon SCOT. He builds high-performance quantitative tools, agentic AI platforms, and real-time distributed software.",
    milestoneLabel: null,
    targetType: null,
    targetId: null,
    actionLinks: [
      { label: 'Open CS Resume (PDF)', url: '/resumes/Vandan_Patel_CS.pdf' },
      { label: 'Open Finance Resume (PDF)', url: '/resumes/Vandan_Patel_Finance.pdf' },
      { label: 'LinkedIn Profile', url: 'https://linkedin.com/in/vandan-patel-vp' }
    ],
    suggestedChips: defaultChips
  }
}

/**
 * Generate context-aware follow-up chips based on AI response content
 */
function generateDynamicChips(query: string, text: string): string[] {
  const combined = (query + ' ' + text).toLowerCase()

  if (combined.includes('amazon') || combined.includes('scot') || combined.includes('supply chain')) {
    return ['What tech stack does he use?', 'Tell me about GALE', 'View CS Resume']
  }
  if (combined.includes('trading') || combined.includes('quant') || combined.includes('bot')) {
    return ['Tell me about Edgar Agent', 'View Finance Resume', 'Tell me about Amazon SCOT']
  }
  if (combined.includes('gale') || combined.includes('edgar') || combined.includes('shark tank')) {
    return ['Tell me about GrindSheet', 'View CS Resume', 'Contact Vandan']
  }
  if (combined.includes('rutgers') || combined.includes('education') || combined.includes('gpa') || combined.includes('graduat')) {
    return ['Tell me about Amazon SCOT', 'What programming languages does he use?', 'View Finance Resume']
  }

  return ['Tell me about Amazon SCOT', 'View CS Resume', 'View Finance Resume']
}

/**
 * Async AI query processor:
 * 1. Checks grounded local matches first.
 * 2. Tries Google Gemini API (gemini-flash-latest).
 * 3. Tries Gemma fallback (gemma-4-26b-a4b-it).
 * 4. Falls back gracefully to comprehensive offline persona synthesizer.
 */
export async function processAIQueryAsync(query: string): Promise<AIQueryResult> {
  const localRes = processAIQuery(query)

  // If local matcher returned a specific grounded milestone, resume, or contact action, use it immediately!
  if (localRes.milestoneLabel || localRes.actionUrl || (localRes.targetType && localRes.targetType !== 'skills')) {
    return localRes
  }

  const apiKey = (import.meta?.env?.VITE_GEMINI_API_KEY as string) || ''

  if (apiKey) {
    // 1. Primary: Try gemini-flash-latest
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3500)

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        signal: controller.signal,
        body: JSON.stringify({
          system_instruction: {
            parts: [
              {
                text: `You are Vortex AI, the personal portfolio intelligence assistant for Vandan Patel. 
Use the following live website context to answer questions accurately with specific metrics, facts, and technologies:
${getDynamicSiteContext()}

Instructions:
1. Answer the user's question concisely in 2-3 sentences.
2. Use exact numbers, metrics, and technical facts from Vandan's website context whenever relevant.
3. Be professional, quantitative, and direct.
4. Provide 3 creative, engaging, and highly relevant follow-up questions that a recruiter or visitor would want to ask next based on your answer.
5. Return your response strictly as valid JSON with keys: "answer" (string) and "suggestedChips" (array of 3 question strings).`
              }
            ]
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: query }]
            }
          ],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 250,
            response_mime_type: 'application/json'
          }
        })
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        const rawAiText = data.candidates?.[0]?.content?.parts?.[0]?.text
        if (rawAiText && rawAiText.trim()) {
          const parsedRes = formatAIResponse(query, rawAiText)
          if (parsedRes) return parsedRes
        }
      }
    } catch {
      // Proceed to Gemma fallback
    }

    // 2. Secondary API Fallback: Try Gemma
    try {
      const gemmaController = new AbortController()
      const gemmaTimeout = setTimeout(() => gemmaController.abort(), 3000)

      const gemmaResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemma-4-26b-a4b-it:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        signal: gemmaController.signal,
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{
                text: `You are Vortex AI for Vandan Patel (Rutgers Honors College 3.96 GPA, Amazon SCOT Financial Analyst Intern).
Using this context:
${getDynamicSiteContext()}

Answer this query directly in 2 sentences with key facts: "${query}"`
              }]
            }
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 300
          }
        })
      })

      clearTimeout(gemmaTimeout)

      if (gemmaResponse.ok) {
        const gData = await gemmaResponse.json()
        const parts = gData.candidates?.[0]?.content?.parts || []
        // Extract candidate text that is not internal thinking
        const textPart = parts.find((p: { text?: string; thought?: boolean }) => !p.thought && p.text?.trim()) || parts[parts.length - 1]
        const rawGemmaText = textPart?.text
        if (rawGemmaText && rawGemmaText.trim()) {
          const parsedGemma = formatAIResponse(query, rawGemmaText.trim())
          if (parsedGemma) return parsedGemma
        }
      }
    } catch {
      // Fallback to local synthesizer
    }
  }

  // 3. Ultimate Fallback: Comprehensive local synthesizer
  return synthesizePersonaAnswer(query)
}

/**
 * Helper to process raw LLM output and extract milestone labels, action links, and chips
 */
function formatAIResponse(query: string, rawAiText: string): AIQueryResult | null {
  let cleanAnswer = ''
  let dynamicChips: string[] = []

  try {
    const parsed = JSON.parse(rawAiText)
    cleanAnswer = parsed.answer || ''
    if (Array.isArray(parsed.suggestedChips) && parsed.suggestedChips.length > 0) {
      dynamicChips = parsed.suggestedChips.map((c: string) => String(c).trim()).filter(Boolean)
    }
  } catch {
    cleanAnswer = rawAiText.trim()
  }

  if (!cleanAnswer) {
    cleanAnswer = rawAiText.trim()
  }

  if (dynamicChips.length === 0) {
    dynamicChips = generateDynamicChips(query, cleanAnswer)
  }
  const lowerAnswer = cleanAnswer.toLowerCase()
  const lowerQuery = query.toLowerCase()

  // Detect ALL relevant milestone labels mentioned in answer or query
  const foundLabels: string[] = []

  if (lowerAnswer.includes('amazon') || lowerQuery.includes('amazon') || lowerAnswer.includes('scot')) {
    foundLabels.push('Amazon SCOT')
  }
  if (lowerQuery.includes('trading bot') || lowerQuery.includes('algo trading') || lowerAnswer.includes('alpaca api') || lowerAnswer.includes('algorithmic trading bot')) {
    foundLabels.push('Algo Trading Bot')
  }
  if (lowerAnswer.includes('gale') || lowerQuery.includes('gale') || lowerAnswer.includes('gamified algorithmic')) {
    foundLabels.push('GALE Engine')
  }
  if (lowerAnswer.includes('perkpal') || lowerQuery.includes('perkpal') || lowerQuery.includes('shark tank')) {
    foundLabels.push('Shark Tank Top 6')
  }
  if (lowerAnswer.includes('grindsheet') || lowerQuery.includes('grindsheet')) {
    foundLabels.push('GrindSheet')
  }
  if (lowerAnswer.includes('edgar agent') || lowerQuery.includes('edgar')) {
    foundLabels.push('Edgar Agent')
  }
  if (lowerAnswer.includes('moweb') || lowerQuery.includes('moweb')) {
    foundLabels.push('Moweb Technologies')
  }
  if (lowerAnswer.includes('sebs data analyst') || lowerQuery.includes('sebs')) {
    foundLabels.push('SEBS Data Analyst')
  }
  if (lowerQuery.includes('education') || lowerQuery.includes('rutgers') || lowerQuery.includes('gpa') || lowerQuery.includes('degree') || lowerQuery.includes('graduat') || lowerQuery.includes('grad') || lowerQuery.includes('major') || lowerAnswer.includes('started rutgers') || lowerAnswer.includes('rutgers') || lowerAnswer.includes('may 2027')) {
    foundLabels.push('Started Rutgers')
  }

  const uniqueLabels = Array.from(new Set(foundLabels))
  const actionLinks: ActionLink[] = []

  // Dynamic project action links
  const projectKeywordMap: { id: string; keywords: string[]; label: string }[] = [
    { id: 'gale', keywords: ['gale', 'gamified algorithmic learning engine', 'algorithm practice'], label: 'GALE Engine' },
    { id: '7', keywords: ['edgar', 'edgar agent', '10-k'], label: 'Edgar Agent' },
    { id: '1', keywords: ['algo trading', 'algorithmic trading', 'trading bot', 'alpaca'], label: 'Algo Trading' },
    { id: '3', keywords: ['grindsheet', 'healthkit', 'swiftui'], label: 'GrindSheet' },
    { id: '5', keywords: ['perkpal', 'shark tank', 'perkopoly'], label: 'PerkPal' },
  ]

  projectKeywordMap.forEach(item => {
    const isMatch = item.keywords.some(kw => lowerAnswer.includes(kw) || lowerQuery.includes(kw))
    if (isMatch) {
      const proj = portfolioProjects.find(p => p.id === item.id)
      if (proj) {
        if (proj.liveUrl) {
          actionLinks.push({ label: `Live Demo (${item.label})`, url: proj.liveUrl })
        }
        if (proj.githubUrl) {
          actionLinks.push({ label: `GitHub Code (${item.label})`, url: proj.githubUrl })
        }
      }
    }
  })

  // Dynamic resume action links
  const isCSResumeReq = lowerQuery.includes('cs resume') || lowerQuery.includes('swe resume') || lowerQuery.includes('tech resume') || lowerQuery.includes('cs cv') || lowerAnswer.includes('cs resume')
  const isFinanceResumeReq = lowerQuery.includes('finance resume') || lowerQuery.includes('quant resume') || lowerQuery.includes('banking resume') || lowerQuery.includes('finance cv') || lowerAnswer.includes('finance resume')
  const isGenericResumeReq = lowerQuery.includes('resume') || lowerQuery.includes('cv')

  if (isCSResumeReq || (isGenericResumeReq && !isFinanceResumeReq)) {
    if (!actionLinks.some(l => l.url.includes('Vandan_Patel_CS.pdf'))) {
      actionLinks.push({ label: 'Open CS Resume (PDF)', url: '/resumes/Vandan_Patel_CS.pdf' })
    }
  }
  if (isFinanceResumeReq || (isGenericResumeReq && !isCSResumeReq)) {
    if (!actionLinks.some(l => l.url.includes('Vandan_Patel_Finance.pdf'))) {
      actionLinks.push({ label: 'Open Finance Resume (PDF)', url: '/resumes/Vandan_Patel_Finance.pdf' })
    }
  }

  if (lowerAnswer.includes('linkedin') || lowerQuery.includes('linkedin')) {
    if (!actionLinks.some(l => l.url.includes('linkedin.com'))) {
      actionLinks.push({ label: 'LinkedIn Profile', url: 'https://linkedin.com/in/vandan-patel-vp' })
    }
  }
  if (lowerAnswer.includes('github') || lowerQuery.includes('github')) {
    if (!actionLinks.some(l => l.url === 'https://github.com/vp-27')) {
      actionLinks.push({ label: 'GitHub Profile', url: 'https://github.com/vp-27' })
    }
  }
  if (lowerAnswer.includes('email') || lowerAnswer.includes('mailto') || lowerQuery.includes('email') || lowerQuery.includes('contact') || lowerQuery.includes('reach')) {
    if (!actionLinks.some(l => l.url.includes('mailto:'))) {
      actionLinks.push({ label: 'Send Email to Vandan', url: 'mailto:vrp77@scarletmail.rutgers.edu' })
    }
  }

  const actionPhrases = ['view cs resume', 'view finance resume', 'open cs resume', 'open finance resume', 'contact vandan', 'send email']
  const sanitizedChips = (dynamicChips.length > 0 ? dynamicChips : generateDynamicChips(query, cleanAnswer))
    .filter(chip => !actionPhrases.some(phrase => chip.toLowerCase().includes(phrase)))

  return {
    answer: cleanAnswer,
    milestoneLabel: uniqueLabels.length > 0 ? uniqueLabels[0] : null,
    milestoneLabels: uniqueLabels,
    targetType: uniqueLabels.length > 0 ? 'experience' : null,
    targetId: null,
    actionLinks: actionLinks.length > 0 ? actionLinks : undefined,
    suggestedChips: sanitizedChips
  }
}

