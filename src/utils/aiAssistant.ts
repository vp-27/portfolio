import {
  professionalExperiences,
  portfolioProjects,
  portfolioEducation,
  skillCategories,
  portfolioInterests,
} from '../data/portfolioData'
import { profile, resumes } from '../data/profile'
import type { Experience, Project } from '../types'
import {
  searchPortfolio,
  isNaturalLanguageQuery,
  type PortfolioSearchTarget,
} from './portfolioSearch'
export { isNaturalLanguageQuery } from './portfolioSearch'

export interface ActionLink {
  label: string
  url: string
}

export interface AIQueryResult {
  answer: string
  source?: 'portfolio' | 'ai'
  aiUnavailable?: boolean
  milestoneLabel: string | null
  milestoneLabels?: string[]
  targetType:
    | 'experience'
    | 'project'
    | 'education'
    | 'skills'
    | 'contact'
    | 'resume_cs'
    | 'resume_finance'
    | null
  targetId: string | null
  actionUrl?: string
  actionLabel?: string
  actionLinks?: ActionLink[]
  suggestedChips: string[]
  matchingTargets?: PortfolioSearchTarget[]
}

const csResume = { label: 'Open CS Resume (PDF)', url: resumes[0].url }
const financeResume = { label: 'Open Finance Resume (PDF)', url: resumes[1].url }
const contactLinks: ActionLink[] = [
  { label: 'Send Email', url: `mailto:${profile.email}` },
  { label: 'LinkedIn Profile', url: profile.linkedin },
  { label: 'GitHub Profile', url: profile.github },
]
const defaultChips = ['Tell me about Amazon SCOT', 'Tell me about GALE', 'Why CS & Finance?']

const normalize = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
const containsPhrase = (query: string, phrase: string) =>
  ` ${query} `.includes(` ${normalize(phrase)} `)
const matchesAny = (query: string, phrases: string[]) =>
  phrases.some((phrase) => containsPhrase(query, phrase))

function result(answer: string, options: Partial<AIQueryResult> = {}): AIQueryResult {
  return {
    answer,
    source: 'portfolio',
    milestoneLabel: null,
    targetType: null,
    targetId: null,
    suggestedChips: defaultChips,
    ...options,
  }
}

function projectLinks(project: Project): ActionLink[] {
  const links: ActionLink[] = []
  if (project.liveUrl)
    links.push({ label: `Live Demo (${project.name.split(' (')[0]})`, url: project.liveUrl })
  if (project.githubUrl)
    links.push({ label: `GitHub Code (${project.name.split(' (')[0]})`, url: project.githubUrl })
  return links
}

function relevantHighlights(query: string, bullets: string[], fallback: string): string {
  const stopWords = new Set([
    'what',
    'where',
    'when',
    'which',
    'does',
    'about',
    'tell',
    'with',
    'from',
    'have',
    'that',
    'this',
    'vandan',
    'patel',
    'built',
    'build',
    'worked',
    'work',
    'projects',
    'experience',
  ])
  const terms = query.split(' ').filter((term) => term.length > 3 && !stopWords.has(term))
  const ranked = bullets
    .map((text, index) => ({
      text,
      index,
      score: terms.filter((term) => containsPhrase(normalize(text), term)).length,
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
  return ranked[0]?.score
    ? ranked
        .slice(0, 2)
        .filter((item) => item.score > 0)
        .map((item) => item.text)
        .join(' ')
    : fallback
}

function describeExperience(
  query: string,
  experience: Experience,
  milestone: string | null,
): AIQueryResult {
  const wantsStack = matchesAny(query, [
    'tech stack',
    'technologies',
    'technology',
    'tools',
    'languages',
    'skills',
  ])
  const detail = wantsStack
    ? `Published technologies: ${(experience.technologies || []).join(', ')}.`
    : relevantHighlights(query, experience.bullets, experience.bullets.slice(0, 2).join(' '))
  return result(
    `${experience.company} — ${experience.position}, ${experience.startDate}–${experience.endDate}. ${detail}`,
    {
      milestoneLabel: milestone,
      targetType: 'experience',
      targetId: experience.id,
      actionLinks: [csResume, financeResume],
      suggestedChips: [
        'What projects has he built?',
        'What are his technical skills?',
        'Contact Vandan',
      ],
    },
  )
}

function describeProject(query: string, project: Project, milestone: string | null): AIQueryResult {
  const wantsStack = matchesAny(query, [
    'tech stack',
    'technologies',
    'technology',
    'tools',
    'languages',
    'skills',
  ])
  const detail = wantsStack
    ? `Published technologies: ${(project.technologies || []).join(', ')}.`
    : relevantHighlights(query, project.bullets, project.subtitle)
  return result(`${project.name}: ${detail}`, {
    milestoneLabel: milestone,
    targetType: 'project',
    targetId: project.id,
    actionLinks: projectLinks(project),
    suggestedChips: ['What projects has he built?', 'Tell me about Amazon SCOT', 'Contact Vandan'],
  })
}

/**
 * Portfolio answers are deterministic and grounded in the same data as the page.
 * The local fallback uses only published records. Optional model generation is
 * requested through our server endpoint; provider credentials stay server-side.
 */
function processPortfolioAnswer(query: string): AIQueryResult {
  const q = normalize(query)
  const wantsResume = matchesAny(q, ['resume', 'resumes', 'cv'])
  if (wantsResume) {
    if (matchesAny(q, ['cs', 'computer science', 'swe', 'software', 'technical', 'tech'])) {
      return result(
        'Open Vandan’s published software engineering resume using the PDF link below.',
        {
          targetType: 'resume_cs',
          actionUrl: csResume.url,
          actionLabel: csResume.label,
          suggestedChips: ['View Finance Resume', 'Tell me about GALE', 'Contact Vandan'],
        },
      )
    }
    if (matchesAny(q, ['finance', 'financial', 'quant', 'banking'])) {
      return result('Open Vandan’s published finance resume using the PDF link below.', {
        targetType: 'resume_finance',
        actionUrl: financeResume.url,
        actionLabel: financeResume.label,
        suggestedChips: ['View CS Resume', 'Tell me about Algo Trading Bot', 'Contact Vandan'],
      })
    }
    return result(
      'Vandan has separate software engineering and finance resumes. Choose the relevant PDF below.',
      {
        actionLinks: [csResume, financeResume],
      },
    )
  }

  if (
    matchesAny(q, [
      'contact',
      'email',
      'linkedin',
      'github',
      'reach',
      'get in touch',
      'message',
      'hire',
    ])
  ) {
    const links = q.includes('github')
      ? [contactLinks[2]]
      : q.includes('linkedin')
        ? [contactLinks[1]]
        : q.includes('email')
          ? [contactLinks[0]]
          : contactLinks
    return result(
      'You can contact Vandan by email, connect on LinkedIn, or explore his public work on GitHub.',
      {
        targetType: 'contact',
        actionLinks: links,
        suggestedChips: ['View CS Resume', 'View Finance Resume', 'Tell me about Amazon SCOT'],
      },
    )
  }

  if (
    matchesAny(q, [
      'why cs',
      'why finance',
      'cs and finance',
      'cs finance',
      'intersection',
      'three majors',
      'triple major',
    ])
  ) {
    return result(
      'Vandan studies Computer Science, Finance, and Data Science. His published work connects these areas through financial analysis and automation at Amazon SCOT, a SEC filing API, and algorithmic trading software.',
      {
        actionLinks: [csResume, financeResume],
      },
    )
  }

  const education = portfolioEducation[0]
  if (
    education &&
    matchesAny(q, ['certification', 'certifications', 'certified', 'bloomberg', 'bmc'])
  ) {
    const certifications = education.certifications
      ?.map((cert) => `${cert.name} (${cert.issuer})`)
      .join('; ')
    return result(`Published certifications: ${certifications || 'none listed yet'}.`, {
      targetType: 'education',
      targetId: education.id,
      milestoneLabel: 'Started Rutgers',
      suggestedChips: [
        'Tell me about his education',
        'View Finance Resume',
        'What are his technical skills?',
      ],
    })
  }

  if (
    education &&
    matchesAny(q, [
      'rutgers',
      'gpa',
      'education',
      'college',
      'university',
      'degree',
      'degrees',
      'major',
      'majors',
      'graduation',
      'graduate',
      'graduating',
      'honors',
      'phi beta kappa',
    ])
  ) {
    return result(
      `${education.institution}: ${education.degrees.join('; ')}. Expected graduation: ${education.graduationDate}; GPA: ${education.gpa}. Honors: ${education.honors.join(', ')}.`,
      {
        targetType: 'education',
        targetId: education.id,
        milestoneLabel: 'Started Rutgers',
        actionLinks: [csResume, financeResume],
        suggestedChips: [
          'What projects has he built?',
          'Tell me about Amazon SCOT',
          'What certifications does he have?',
        ],
      },
    )
  }

  if (matchesAny(q, ['projects', 'project', 'portfolio', 'built', 'builds', 'building'])) {
    return result(
      `Published projects include ${portfolioProjects.map((item) => item.name.split(' (')[0]).join(', ')}. Select a project below to explore its implementation and links.`,
      {
        targetType: 'project',
        actionLinks: [{ label: 'Explore Projects', url: '/projects' }],
        suggestedChips: [
          'Tell me about GALE',
          'Tell me about Edgar Agent',
          'Tell me about GrindSheet',
        ],
      },
    )
  }

  if (
    matchesAny(q, [
      'experience',
      'work',
      'worked',
      'intern',
      'internship',
      'internships',
      'career',
      'job',
      'roles',
    ])
  ) {
    return result(
      professionalExperiences
        .map((item) => `${item.company}: ${item.position} (${item.startDate}–${item.endDate}).`)
        .join(' '),
      {
        targetType: 'experience',
        actionLinks: [csResume, financeResume],
        suggestedChips: ['Tell me about Amazon SCOT', 'Tell me about SEBS', 'Tell me about Moweb'],
      },
    )
  }

  if (
    matchesAny(q, [
      'interests',
      'hobbies',
      'outside work',
      'activities',
      'free time',
      'mountain biking',
      'cars',
      'poker',
      'legos',
    ])
  ) {
    return result(
      `Published activities and interests: ${portfolioInterests.map((item) => item.name).join(', ')}.`,
      {
        suggestedChips: ['Why CS & Finance?', 'What projects has he built?', 'Contact Vandan'],
      },
    )
  }

  const matchingSkills = skillCategories
    .flatMap((category) => category.skills)
    .filter((skill) =>
      skill.name.split(/[/(]/).some((name) => name.trim() && containsPhrase(q, name.trim())),
    )
  if (
    matchingSkills.length > 0 ||
    matchesAny(q, [
      'skills',
      'stack',
      'languages',
      'language',
      'framework',
      'frameworks',
      'tools',
      'technology',
      'technologies',
      'technical',
      'financial skills',
    ])
  ) {
    const selectedCategories = matchesAny(q, ['financial', 'finance', 'valuation', 'risk'])
      ? skillCategories.filter((category) => category.icon === 'financial')
      : matchesAny(q, ['tools', 'platforms', 'databases', 'cloud'])
        ? skillCategories.filter((category) => category.icon === 'tools')
        : skillCategories.filter((category) => category.icon === 'technical')
    const skillNames =
      matchingSkills.length > 0
        ? matchingSkills.map((skill) => skill.name)
        : selectedCategories.flatMap((category) => category.skills.map((skill) => skill.name))
    const relevantProjects = portfolioProjects.filter((item) =>
      item.technologies?.some((tech) =>
        skillNames.some(
          (skill) =>
            normalize(skill).includes(normalize(tech)) ||
            normalize(tech).includes(normalize(skill)),
        ),
      ),
    )
    return result(
      `Published skills: ${skillNames.join(', ')}.${relevantProjects.length > 0 ? ` Related projects: ${relevantProjects.map((item) => item.name.split(' (')[0]).join(', ')}.` : ''}`,
      {
        targetType: 'skills',
        suggestedChips: ['Tell me about GALE', 'Tell me about Edgar Agent', 'View CS Resume'],
      },
    )
  }

  if (
    !q ||
    matchesAny(q, ['who is vandan', 'about vandan', 'about you', 'who are you', 'hello', 'hi'])
  ) {
    return result(
      'Vandan Patel is a Computer Science, Finance, and Data Science student at Rutgers Honors College. Explore his published projects, experience, education, and skills using the topics below.',
      {
        actionLinks: [csResume, financeResume],
      },
    )
  }

  return result(
    'I don’t have a published answer to that specific question. I can help you explore Vandan’s projects, experience, education, and skills, or you can contact him directly.',
    {
      actionLinks: [contactLinks[0]],
    },
  )
}

// Answer context and visible results use exactly the same search intent and ranking.
export function processAIQuery(query: string): AIQueryResult {
  const matches = searchPortfolio(query)
  if (!matches.active) return processPortfolioAnswer(query)

  const count = `${matches.projects.length} ${matches.projects.length === 1 ? 'project' : 'projects'} and ${matches.experiences.length} ${matches.experiences.length === 1 ? 'experience' : 'experiences'}`
  const summary = matches.targets.length
    ? `${count} match ${matches.terms.length > 1 ? (matches.mode === 'all' ? 'all' : 'any of') + ' your search terms' : 'your search'}.`
    : `${isNaturalLanguageQuery(query) ? 'I don’t have a published answer to that specific question. ' : ''}No published projects or experience match “${query.trim()}”. Try another term, or ask a question about the portfolio.`

  if (
    matches.entities.length &&
    matches.targets.length &&
    (!matches.terms.length || matches.targets.length === 1)
  ) {
    const descriptions = matches.targets.map((target) => {
      const milestone = target.milestoneLabel ?? null
      if (target.type === 'project') {
        return describeProject(
          normalize(query),
          matches.projects.find((item) => item.id === target.id)!,
          milestone,
        )
      }
      return describeExperience(
        normalize(query),
        matches.experiences.find((item) => item.id === target.id)!,
        milestone,
      )
    })
    if (descriptions.length === 1) return { ...descriptions[0], matchingTargets: matches.targets }
    // Every selected entity gets a description; never route the narrative to only the first.
    return result(descriptions.map((description) => description.answer).join('\n\n'), {
      matchingTargets: matches.targets,
      milestoneLabels: matches.targets.flatMap((target) =>
        target.milestoneLabel ? [target.milestoneLabel] : [],
      ),
      suggestedChips: [],
    })
  }
  return result(summary, { matchingTargets: matches.targets, suggestedChips: [] })
}

export async function processAIQueryAsync(
  query: string,
  signal?: AbortSignal,
  request: typeof fetch = fetch,
): Promise<AIQueryResult> {
  const throwIfAborted = () => {
    if (signal?.aborted) throw new DOMException('Portfolio query cancelled', 'AbortError')
  }
  throwIfAborted()
  await Promise.resolve()
  throwIfAborted()
  const fallback = processAIQuery(query)
  // Keyword searches are immediate and deterministic; questions may use the live model.
  if (!isNaturalLanguageQuery(query)) return fallback

  const controller = new AbortController()
  const cancel = () => controller.abort()
  signal?.addEventListener('abort', cancel, { once: true })
  const timeout = setTimeout(cancel, 12_000)
  try {
    const response = await request('/api/portfolio-assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query.trim() }),
      signal: controller.signal,
    })
    throwIfAborted()
    if (!response.ok) return { ...fallback, aiUnavailable: true }
    const data: unknown = await response.json()
    throwIfAborted()
    if (
      !data ||
      typeof data !== 'object' ||
      !('answer' in data) ||
      typeof data.answer !== 'string' ||
      !data.answer.trim() ||
      data.answer.length > 6000
    ) {
      return { ...fallback, aiUnavailable: true }
    }
    // The server supplies prose only; routing and trusted public links stay local.
    return { ...fallback, answer: data.answer.trim(), source: 'ai' }
  } catch {
    throwIfAborted()
    return { ...fallback, aiUnavailable: true }
  } finally {
    clearTimeout(timeout)
    signal?.removeEventListener('abort', cancel)
  }
}
