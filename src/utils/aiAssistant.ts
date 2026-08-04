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
  'What trading bots has he built?',
  'Why CS and Finance?',
  'View CS Resume',
  'View Finance Resume'
]

/**
 * Dynamically constructs complete site context directly from portfolioData.ts single source of truth.
 * Covers About Me, Experiences, Projects (with live & GitHub URLs), Education, Skills, Interests, and Watchlist Items.
 */
function getDynamicSiteContext(): string {
  const bio = "Vandan Patel: Computer Science, Finance, and Data Science student at Rutgers Honors College (GPA 3.95). Incoming Operations Analyst Intern at Amazon SCOT (Supply Chain Optimization Technologies, Bellevue WA, Summer 2026). Quantitative builder creating FinTech tools, trading bots, and data pipelines."
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

  const edu = portfolioEducation.map(ed => `${ed.institution} (${ed.degrees.join(', ')}, GPA ${ed.gpa}): ${ed.honors.join('; ')}`).join('\n')
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
      answer: "Vandan's Computer Science Resume highlights his software engineering experience (React, TypeScript, Python, C++, SQL), algorithms, data engineering, and scalable web apps.",
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
      answer: "Vandan's Finance Resume details his quantitative modeling, financial analysis, algorithmic trading bot, gemstone valuation platform (OroGenie), and SCOT operations background.",
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
 * Intelligent Dynamic Persona Synthesizer for open-ended queries
 */
function synthesizePersonaAnswer(query: string): AIQueryResult {
  const q = query.toLowerCase()

  if (q.includes('quant') || q.includes('math') || q.includes('calculus') || q.includes('model') || q.includes('alpha')) {
    return {
      answer: "Vandan approaches quantitative modeling by combining technical market indicators (MACD, Bollinger Bands, RMA) with automated software execution. He leverages Python and data science frameworks to backtest market hypotheses and optimize risk-adjusted strategies.",
      milestoneLabel: 'Algo Trading Bot',
      targetType: 'project',
      targetId: '1',
      suggestedChips: ['Tell me about Algo Trading Bot', 'View Finance Resume', 'Tell me about Amazon SCOT']
    }
  }

  if (q.includes('code') || q.includes('developer') || q.includes('tech') || q.includes('build') || q.includes('stack')) {
    return {
      answer: "Vandan is a builder who designs tools that automate complex workflows. His core technical stack includes React, TypeScript, Python, SQL, C++, and Docker, emphasizing high-performance UX and clean system architecture.",
      milestoneLabel: null,
      targetType: 'skills',
      targetId: null,
      suggestedChips: ['View CS Resume', 'Tell me about Moweb', 'What projects has he built?']
    }
  }

  if (q.includes('hire') || q.includes('role') || q.includes('intern') || q.includes('future') || q.includes('career') || q.includes('job')) {
    return {
      answer: "Vandan is an incoming Operations Analyst Intern at Amazon SCOT (Supply Chain Optimization Technologies) for Summer 2026. He is positioning for high-impact roles across Software Engineering (SWE), Quantitative Analytics, and FinTech.",
      milestoneLabel: 'Amazon SCOT',
      targetType: 'experience',
      targetId: 'amazon1',
      suggestedChips: ['Contact Vandan', 'View CS Resume', 'View Finance Resume']
    }
  }

  return {
    answer: `Vandan Patel is a CS, Finance & Data Science student at Rutgers Honors College (Incoming Operations Analyst @ Amazon SCOT). He specializes in quantitative tools, full-stack software development, and financial market platforms.`,
    milestoneLabel: null,
    targetType: null,
    targetId: null,
    suggestedChips: defaultChips
  }
}

/**
 * Generate context-aware follow-up chips based on AI response content
 */
function generateDynamicChips(query: string, text: string): string[] {
  const combined = (query + ' ' + text).toLowerCase()

  if (combined.includes('amazon') || combined.includes('scot') || combined.includes('supply chain')) {
    return ['What tech stack does he use?', 'Tell me about Algo Trading Bot', 'View CS Resume']
  }
  if (combined.includes('trading') || combined.includes('quant') || combined.includes('bot')) {
    return ['Show OroGenie Platform', 'View Finance Resume', 'Tell me about Amazon SCOT']
  }
  if (combined.includes('orogenie') || combined.includes('gemstone') || combined.includes('shark tank')) {
    return ['Tell me about GrindSheet', 'View CS Resume', 'Contact Vandan']
  }
  if (combined.includes('rutgers') || combined.includes('education') || combined.includes('gpa')) {
    return ['Tell me about Amazon SCOT', 'What programming languages does he use?', 'View Finance Resume']
  }

  return ['Tell me about Amazon SCOT', 'View CS Resume', 'View Finance Resume']
}

/**
 * Async AI query processor:
 * Checks grounded local matches first. If no specific portfolio match is found,
 * it queries the Google Gemini API (gemini-flash-lite-latest) with dynamic site context.
 * It extracts matching milestone labels (or multiple if applicable) & generates dynamic follow-up chips!
 */
export async function processAIQueryAsync(query: string): Promise<AIQueryResult> {
  const localRes = processAIQuery(query)

  // If local matcher returned a specific grounded milestone, resume, or contact action, use it immediately!
  if (localRes.milestoneLabel || localRes.actionUrl || (localRes.targetType && localRes.targetType !== 'skills')) {
    return localRes
  }

  const apiKey = (import.meta.env.VITE_GEMINI_API_KEY as string) || ''

  // Query Google Gemini API (gemini-flash-lite-latest) with 2.5s safety timeout
  if (apiKey) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2500)

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${apiKey}`, {
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

          // Detect ALL relevant milestone labels mentioned in answer or query (using precise matching)
          const foundLabels: string[] = []

          if (lowerAnswer.includes('amazon') || lowerQuery.includes('amazon') || lowerAnswer.includes('scot')) {
            foundLabels.push('Amazon SCOT')
          }
          if (lowerQuery.includes('trading bot') || lowerQuery.includes('algo trading') || lowerAnswer.includes('alpaca api') || lowerAnswer.includes('algorithmic trading bot')) {
            foundLabels.push('Algo Trading Bot')
          }
          if (lowerAnswer.includes('orogenie') || lowerQuery.includes('orogenie') || lowerAnswer.includes('gemstone valuation')) {
            foundLabels.push('OroGenie Platform')
          }
          if (lowerAnswer.includes('perkpal') || lowerQuery.includes('perkpal') || lowerQuery.includes('shark tank')) {
            foundLabels.push('Shark Tank Top 6')
          }
          if (lowerAnswer.includes('grindsheet') || lowerQuery.includes('grindsheet')) {
            foundLabels.push('GrindSheet')
          }
          if (lowerAnswer.includes('sunny insurance') || lowerQuery.includes('sunny')) {
            foundLabels.push('Sunny Insurance')
          }
          if (lowerAnswer.includes('edgar agent') || lowerQuery.includes('edgar')) {
            foundLabels.push('Edgar Agent')
          }
          if (lowerAnswer.includes('moweb') || lowerQuery.includes('moweb')) {
            foundLabels.push('Moweb Data Team')
          }
          if (lowerAnswer.includes('sebs data analyst') || lowerQuery.includes('sebs')) {
            foundLabels.push('SEBS Data Analyst')
          }
          if (lowerQuery.includes('education') || lowerQuery.includes('rutgers') || lowerQuery.includes('gpa') || lowerQuery.includes('degree') || lowerAnswer.includes('started rutgers')) {
            foundLabels.push('Started Rutgers')
          }

          const uniqueLabels = Array.from(new Set(foundLabels))

          // Extract ALL action links mentioned in query or response (LinkedIn, GitHub, Email, Resumes, Project Demos)
          const actionLinks: ActionLink[] = []

          // Dynamic project action links (Live Demos & GitHub Repos with explicit project keyword matching)
          const projectKeywordMap: { id: string; keywords: string[]; label: string }[] = [
            { id: '7', keywords: ['edgar', 'edgar agent', '10-k'], label: 'Edgar Agent' },
            { id: '1', keywords: ['algo trading', 'algorithmic trading', 'trading bot', 'alpaca'], label: 'Algo Trading' },
            { id: '3', keywords: ['grindsheet'], label: 'GrindSheet' },
            { id: '4', keywords: ['sunny', 'insurance co-pilot', 'insurance copilot'], label: 'Sunny Insurance' },
            { id: '5', keywords: ['perkpal', 'shark tank', 'perkopoly'], label: 'PerkPal' },
            { id: '2', keywords: ['orogenie', 'gemstone'], label: 'OroGenie' },
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

          // Dynamic resume action links (Triggers ONLY when query or answer explicitly pertains to resumes)
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

          // Sanitize follow-up chips to exclude action-link commands so chips stay 100% question-focused
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
      }
    } catch {
      // Fallback to persona synthesizer if network/timeout occurs
    }
  }

  return synthesizePersonaAnswer(query)
}
