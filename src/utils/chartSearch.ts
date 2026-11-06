import { searchPortfolio } from './portfolioSearch'

export interface ChartSearchPreview {
  active: boolean
  query: string
  title: string
  summary: string
  milestoneLabels: string[]
}

export function getChartSearchPreview(input: string): ChartSearchPreview {
  const query = input.trim()
  const matches = searchPortfolio(query)
  // Share the exact same ranked matches as cards and answers; never infer a
  // milestone from a similarly named skill or a decorative chart sample.
  const milestoneLabels = matches.active
    ? [
        ...new Set(
          matches.targets.flatMap((target) =>
            target.milestoneLabel ? [target.milestoneLabel] : [],
          ),
        ),
      ]
    : []
  const count = milestoneLabels.length
  const summary = `${count} search ${count === 1 ? 'result' : 'results'}`
  return { active: !!query, query, title: query, summary, milestoneLabels }
}
