import { professionalExperiences, portfolioProjects, skillCategories } from '../data/portfolioData'
import { careerMilestones } from '../data/timeline'
import type { Experience, Project } from '../types'

export interface PortfolioSearchTarget {
  type: 'experience' | 'project'
  id: string
  label: string
  milestoneLabel?: string
}

export const normalizeSearch = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
const contains = (text: string, phrase: string) =>
  ` ${normalizeSearch(text)} `.includes(` ${normalizeSearch(phrase)} `)

export function isNaturalLanguageQuery(query: string): boolean {
  const trimmed = query.trim().toLowerCase()
  return (
    trimmed.endsWith('?') ||
    /^(what|why|how|who|where|when|tell me|does he|is he|show me|can he|explain|describe|compare|list|about|view|open|contact|get)\b/.test(
      trimmed,
    )
  )
}

// One routing vocabulary for typing, submitted answers, and suggested result links.
const entityAliases: { type: 'experience' | 'project'; id: string; aliases: string[] }[] = [
  {
    type: 'project',
    id: 'gale',
    aliases: ['gale', 'gamified algorithmic', 'algorithm practice', 'leetcode', 'coding platform'],
  },
  {
    type: 'project',
    id: '7',
    aliases: ['edgar', 'sec', 'sec filings', '10 k', 'filings', 'filing'],
  },
  {
    type: 'project',
    id: '3',
    aliases: ['grindsheet', 'grind sheet', 'workout tracker', 'fitness tracker'],
  },
  {
    type: 'project',
    id: '1',
    aliases: [
      'algorithmic stock trading',
      'algo trading',
      'algorithmic trading',
      'trading bot',
      'algo trading bot',
    ],
  },
  { type: 'project', id: '5', aliases: ['perkpal', 'perk pal', 'shark tank', 'perkopoly'] },
  { type: 'experience', id: 'amazon1', aliases: ['amazon', 'amazon scot', 'scot'] },
  { type: 'experience', id: '1', aliases: ['sebs', 'rutgers sebs', 'facilities planning'] },
  { type: 'experience', id: '2', aliases: ['moweb'] },
]

const skillTerms = Array.from(
  new Set([
    ...skillCategories.flatMap((category) =>
      category.skills.flatMap((skill) => [
        skill.name,
        ...skill.name.split(/[/(]/).map((part) => part.replace(/\)/g, '').trim()),
      ]),
    ),
    ...portfolioProjects.flatMap((project) => project.technologies || []),
    ...professionalExperiences.flatMap((experience) => experience.technologies || []),
  ]),
)
  .filter((term) => normalizeSearch(term).length > 1)
  .sort((a, b) => b.length - a.length)

const queryWords = new Set(
  `a an the and or to of for in on at by with from me i you your he his him they their vandan patel what why how who where when which is are was were do does did can could has have had tell show explain describe compare versus vs between list find search about using use uses used built build builds worked work projects project experience experiences skills skill tools tool technologies technology tech stack please all any both know more related portfolio languages language frameworks framework technical financial platforms databases s t`.split(
    ' ',
  ),
)

export function matchesSearchTerm(text: string, term: string): boolean {
  if (contains(text, term)) return true
  // Complete known skills match whole words (Java must not become JavaScript).
  // Unknown final fragments still support incremental typing, e.g. "Pyth".
  return (
    term.length >= 3 &&
    !skillTerms.some((skill) => normalizeSearch(skill) === term) &&
    !term.includes(' ') &&
    normalizeSearch(text)
      .split(' ')
      .some((word) => word.startsWith(term))
  )
}

export function getSearchIntent(query: string) {
  const normalized = normalizeSearch(query)
  const mode: 'all' | 'any' = /\bor\b/.test(normalized) ? 'any' : 'all'
  const inactive = {
    active: false,
    terms: [] as string[],
    entities: [] as typeof entityAliases,
    mode,
  }
  if (!normalized) return inactive
  // Contact/resume/education requests remain informational, even when they name a discipline.
  if (
    /\b(resume|resumes|cv|contact|email|education|degree|degrees|gpa|graduation|certifications|certification)\b/.test(
      normalized,
    )
  ) {
    return inactive
  }
  const entities = entityAliases.filter((entity) =>
    entity.aliases.some((alias) => contains(normalized, alias)),
  )
  if (
    !entities.length &&
    (/\b(github|linkedin|interests|hobbies|rutgers|honors|majors|major|certified)\b/.test(
      normalized,
    ) ||
      /^(why cs|why finance|cs and finance|cs finance)\b/.test(normalized) ||
      /^(who is|who are|hello|hi|about you|about vandan)\b/.test(normalized))
  )
    return inactive

  // Remove routing names and conversational filler, not unknown subject words.
  // Thus "React Native" retains Native instead of silently becoming React.
  let remaining = ` ${normalized} `
  const phrases = entities
    .flatMap((entity) => entity.aliases)
    .map(normalizeSearch)
    .sort((a, b) => b.length - a.length)
  for (const phrase of phrases) remaining = remaining.replaceAll(` ${phrase} `, ' ')
  const terms: string[] = []
  for (const skill of skillTerms) {
    const term = normalizeSearch(skill)
    if (contains(remaining, term)) {
      terms.push(term)
      remaining = remaining.replaceAll(` ${term} `, ' ')
    }
  }
  terms.push(
    ...remaining
      .trim()
      .split(/\s+/)
      .filter((word) => word && !queryWords.has(word)),
  )
  const uniqueTerms = [...new Set(terms)]
  if (!uniqueTerms.length && !entities.length) return inactive
  return { active: true, terms: uniqueTerms, entities, mode }
}

export function searchPortfolio(
  query: string,
  experiences: Experience[] = professionalExperiences,
  projects: Project[] = portfolioProjects,
) {
  const intent = getSearchIntent(query)
  const score = (item: Experience | Project, type: 'experience' | 'project') => {
    if (!intent.active) return 1
    const entityMatch = intent.entities.some(
      (entity) => entity.type === type && entity.id === item.id,
    )
    if (intent.entities.length && intent.mode === 'all' && !entityMatch) return 0
    const title = 'company' in item ? `${item.company} ${item.position}` : item.name
    const technologies = item.technologies?.join(' ') || ''
    const body =
      'company' in item ? item.bullets.join(' ') : `${item.subtitle} ${item.bullets.join(' ')}`
    const scores = intent.terms.map(
      (term) =>
        (matchesSearchTerm(title, term) ? 8 : 0) +
        (matchesSearchTerm(technologies, term) ? 4 : 0) +
        (matchesSearchTerm(body, term) ? 1 : 0),
    )
    // Multiple terms mean AND by default; an explicit "or" requests a union.
    if (intent.mode === 'all' && scores.some((value) => value === 0)) return 0
    return scores.reduce((total, value) => total + value, entityMatch ? 100 : 0)
  }
  const rank = <T extends Experience | Project>(items: T[], type: 'experience' | 'project'): T[] =>
    items
      .map((item, index) => ({ item, index, score: score(item, type) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || a.index - b.index)
      .map((entry) => entry.item)
  const matchedExperiences = rank(experiences, 'experience')
  const matchedProjects = rank(projects, 'project')
  const target = (
    item: Experience | Project,
    type: 'experience' | 'project',
  ): PortfolioSearchTarget => ({
    type,
    id: item.id,
    label: 'company' in item ? item.company.split(' |')[0] : item.name.split(' (')[0],
    milestoneLabel: careerMilestones.find(
      (milestone) => milestone.type === type && milestone.id === item.id,
    )?.label,
  })
  return {
    ...intent,
    experiences: matchedExperiences,
    projects: matchedProjects,
    targets: [
      ...matchedExperiences.map((item) => target(item, 'experience')),
      ...matchedProjects.map((item) => target(item, 'project')),
    ],
  }
}
