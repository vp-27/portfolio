export interface AIQueryResult {
  answer: string
  milestoneLabel: string | null
  targetType: 'experience' | 'project' | 'education' | 'skills' | 'contact' | 'resume_cs' | 'resume_finance' | null
  targetId: string | null
  actionUrl?: string
  actionLabel?: string
  suggestedChips: string[]
}

const defaultChips = [
  'Tell me about Amazon SCOT',
  'What trading bots has he built?',
  'Why CS and Finance?',
  'View CS Resume',
  'View Finance Resume'
]

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

  // 1. Resumes
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

  if (q.includes('finance resume') || q.includes('quant resume') || q.includes('banking resume') || (q.includes('resume') && !q.includes('cs'))) {
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

  // 2. Amazon SCOT / Supply Chain
  if (q.includes('amazon') || q.includes('scot') || q.includes('supply chain') || q.includes('operations analyst')) {
    return {
      answer: "Vandan is an incoming Operations Analyst Intern at Amazon | Supply Chain Optimization Technologies (SCOT) for Summer 2026. He works on optimizing large-scale logistics and inventory dynamics at the intersection of tech and data science.",
      milestoneLabel: 'Amazon SCOT',
      targetType: 'experience',
      targetId: 'amazon1',
      suggestedChips: ['What tech stack does he use?', 'Tell me about Algo Trading Bot', 'View Finance Resume']
    }
  }

  // 3. Algo Trading Bot / Quant / Trading
  if (q.includes('trading') || q.includes('algo') || q.includes('bot') || q.includes('quant') || q.includes('stock') || q.includes('crypto')) {
    return {
      answer: "Vandan built an Algorithmic Trading Bot utilizing Python, backtesting frameworks, and technical indicators (RMA, MACD, Bollinger Bands) to execute automated market strategy testing.",
      milestoneLabel: 'Algo Trading Bot',
      targetType: 'project',
      targetId: '1',
      suggestedChips: ['Show OroGenie Platform', 'What are his financial skills?', 'Tell me about Amazon SCOT']
    }
  }

  // 4. OroGenie / FinTech / Gemstone
  if (q.includes('orogenie') || q.includes('gemstone') || q.includes('pricing') || q.includes('shark tank')) {
    return {
      answer: "OroGenie is a FinTech gemstone valuation and market insights platform built by Vandan, which placed in the Top 6 at Rutgers Shark Tank pitch competitions.",
      milestoneLabel: 'OroGenie Platform',
      targetType: 'project',
      targetId: '2',
      suggestedChips: ['Tell me about GrindSheet', 'What CS tools does he know?', 'Where did he intern?']
    }
  }

  // 5. GrindSheet
  if (q.includes('grindsheet') || q.includes('habit') || q.includes('workout') || q.includes('productivity')) {
    return {
      answer: "GrindSheet is an automated workout, habit tracking, and productivity dashboard built by Vandan in React and TypeScript.",
      milestoneLabel: 'GrindSheet',
      targetType: 'project',
      targetId: '3',
      suggestedChips: ['Tell me about OroGenie Platform', 'Tell me about Sunny Insurance', 'View CS Resume']
    }
  }

  // 6. Sunny Insurance
  if (q.includes('sunny') || q.includes('insurance')) {
    return {
      answer: "Sunny Insurance is a web application developed by Vandan for policy management, automated quote estimations, and customer workflows.",
      milestoneLabel: 'Sunny Insurance',
      targetType: 'project',
      targetId: '4',
      suggestedChips: ['Tell me about GrindSheet', 'Tell me about Amazon SCOT', 'View Skills']
    }
  }

  // 7. Edgar Agent
  if (q.includes('edgar') || q.includes('sec') || q.includes('10-k') || q.includes('filing')) {
    return {
      answer: "Edgar Agent is an AI-powered financial filing analyzer built by Vandan that parses SEC EDGAR filings for key investment metrics.",
      milestoneLabel: 'Edgar Agent',
      targetType: 'project',
      targetId: '7',
      suggestedChips: ['Tell me about Algo Trading Bot', 'View Finance Resume', 'Contact Vandan']
    }
  }

  // 8. Rutgers / Education / Honors College
  if (q.includes('rutgers') || q.includes('education') || q.includes('gpa') || q.includes('college') || q.includes('degree') || q.includes('major') || q.includes('courses')) {
    return {
      answer: "Vandan attends Rutgers University - New Brunswick (Honors College), pursuing a triple focus in Computer Science, Finance, and Data Science.",
      milestoneLabel: 'Started Rutgers',
      targetType: 'education',
      targetId: '1',
      suggestedChips: ['What are his technical skills?', 'Tell me about Moweb', 'View CS Resume']
    }
  }

  // 6. Moweb Technologies
  if (q.includes('moweb') || q.includes('software engineering intern') || q.includes('swe intern')) {
    return {
      answer: "Vandan worked as a Software Engineering Intern at Moweb Technologies, developing responsive web interfaces, optimizing API workflows, and working with React & TypeScript.",
      milestoneLabel: 'Moweb Data Team',
      targetType: 'experience',
      targetId: '2',
      suggestedChips: ['Tell me about SEBS Data Analyst', 'What projects has he built?', 'Contact Vandan']
    }
  }

  // 7. SEBS Data Analyst
  if (q.includes('sebs') || q.includes('data analyst') || q.includes('environmental')) {
    return {
      answer: "At Rutgers SEBS, Vandan worked as a Data Analyst Intern automating data processing pipelines, handling statistical modeling, and visualizing datasets.",
      milestoneLabel: 'SEBS Data Analyst',
      targetType: 'experience',
      targetId: '1',
      suggestedChips: ['What programming languages does he use?', 'Tell me about Amazon SCOT', 'View Skills']
    }
  }

  // 8. Why CS & Finance? / Background / Philosophy
  if (q.includes('why') || q.includes('background') || q.includes('philosophy') || q.includes('builder')) {
    return {
      answer: "Vandan works at the intersection of finance, data science, and software engineering. He designs tools that save time tomorrow while understanding macro system dynamics and micro code implementation details.",
      milestoneLabel: null,
      targetType: 'skills',
      targetId: null,
      suggestedChips: ['What technical skills does he have?', 'Tell me about Algo Trading Bot', 'Contact Vandan']
    }
  }

  // 9. Technical Skills / Languages / Frameworks
  if (q.includes('skill') || q.includes('python') || q.includes('react') || q.includes('typescript') || q.includes('sql') || q.includes('c++') || q.includes('stack')) {
    return {
      answer: "Vandan's technical stack includes React, TypeScript, Python, SQL, C++, Git, Docker, and AWS, complemented by strong financial modeling and quantitative analytics skills.",
      milestoneLabel: null,
      targetType: 'skills',
      targetId: null,
      suggestedChips: ['View CS Resume', 'View Finance Resume', 'Tell me about OroGenie']
    }
  }

  // 10. Contact / Socials / LinkedIn / GitHub / Email
  if (q.includes('contact') || q.includes('email') || q.includes('linkedin') || q.includes('github') || q.includes('reach') || q.includes('hire')) {
    return {
      answer: "You can reach Vandan via email at vrp77@scarletmail.rutgers.edu, connect on LinkedIn at linkedin.com/in/vandan-patel-vp, or check out his code at github.com/vp-27.",
      milestoneLabel: null,
      targetType: 'contact',
      targetId: null,
      actionUrl: 'mailto:vrp77@scarletmail.rutgers.edu',
      actionLabel: 'Send Email to Vandan',
      suggestedChips: ['View CS Resume', 'View Finance Resume', 'Tell me about Amazon SCOT']
    }
  }

  // 11. Generic / Open-ended Intelligent Persona Response
  return {
    answer: `Vandan Patel is a CS, Finance & Data Science student at Rutgers Honors College (Incoming Operations Analyst @ Amazon SCOT). He specializes in quantitative tools, full-stack software development, and financial market platforms.`,
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
 * it queries the Google Gemini API (gemini-flash-lite-latest) via VITE_GEMINI_API_KEY.
 * It automatically extracts matching milestone labels & generates dynamic follow-up chips!
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
Vandan is a Computer Science, Finance, and Data Science student at Rutgers Honors College.
He is an incoming Operations Analyst Intern at Amazon SCOT (Supply Chain Optimization Technologies) for Summer 2026.
He builds quantitative trading bots (Python, MACD, Bollinger Bands) and FinTech platforms (OroGenie, Top 6 Rutgers Shark Tank).
Answer the user's question concisely in 2-3 sentences, reflecting Vandan's quantitative and engineering perspective.`
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
            temperature: 0.5,
            maxOutputTokens: 150
          }
        })
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text
        if (aiText && aiText.trim()) {
          const cleanAnswer = aiText.trim()
          const lowerAnswer = cleanAnswer.toLowerCase()
          const lowerQuery = query.toLowerCase()

          let milestoneLabel: string | null = null
          let targetType: 'experience' | 'project' | 'education' | 'skills' | 'contact' | null = null
          let targetId: string | null = null

          if (lowerAnswer.includes('grindsheet') || lowerQuery.includes('grindsheet')) {
            milestoneLabel = 'GrindSheet'
            targetType = 'project'
            targetId = '3'
          } else if (lowerAnswer.includes('sunny') || lowerQuery.includes('sunny')) {
            milestoneLabel = 'Sunny Insurance'
            targetType = 'project'
            targetId = '4'
          } else if (lowerAnswer.includes('edgar') || lowerQuery.includes('edgar')) {
            milestoneLabel = 'Edgar Agent'
            targetType = 'project'
            targetId = '7'
          } else if (lowerAnswer.includes('amazon') || lowerQuery.includes('amazon') || lowerAnswer.includes('scot')) {
            milestoneLabel = 'Amazon SCOT'
            targetType = 'experience'
            targetId = 'amazon1'
          } else if (lowerAnswer.includes('trading') || lowerAnswer.includes('quant') || lowerAnswer.includes('algo')) {
            milestoneLabel = 'Algo Trading Bot'
            targetType = 'project'
            targetId = '1'
          } else if (lowerAnswer.includes('orogenie') || lowerAnswer.includes('gemstone') || lowerAnswer.includes('shark tank')) {
            milestoneLabel = 'OroGenie Platform'
            targetType = 'project'
            targetId = '2'
          } else if (lowerAnswer.includes('moweb')) {
            milestoneLabel = 'Moweb Data Team'
            targetType = 'experience'
            targetId = '2'
          } else if (lowerAnswer.includes('sebs')) {
            milestoneLabel = 'SEBS Data Analyst'
            targetType = 'experience'
            targetId = '1'
          } else if (lowerAnswer.includes('rutgers')) {
            milestoneLabel = 'Started Rutgers'
            targetType = 'education'
            targetId = '1'
          }

          return {
            answer: cleanAnswer,
            milestoneLabel,
            targetType,
            targetId,
            suggestedChips: generateDynamicChips(query, cleanAnswer)
          }
        }
      }
    } catch {
      // Fallback to persona synthesizer if network/timeout occurs
    }
  }

  return synthesizePersonaAnswer(query)
}
