import type { ChartDataPoint } from '../types/index.js'

export interface CareerMilestone {
  date: string
  value: number
  label: string
  category: string
  type: 'project' | 'experience' | 'education'
  id: string
}

// Values provide an illustrative visual chronology, not a performance score or return.
// Keep the card target beside its date so the chart and navigation cannot drift apart.
const milestoneDefinitions: readonly Omit<CareerMilestone, 'value'>[] = [
  {
    date: '2023-09-01',
    label: 'Started Rutgers',
    category: 'Education',
    type: 'education',
    id: '1',
  },
  {
    date: '2024-11-01',
    label: 'Algo Trading Bot',
    category: 'Project',
    type: 'project',
    id: '1',
  },
  {
    date: '2025-03-01',
    label: 'Shark Tank Top 6',
    category: 'Competition',
    type: 'project',
    id: '5',
  },
  {
    date: '2025-05-01',
    label: 'GrindSheet',
    category: 'Project',
    type: 'project',
    id: '3',
  },
  {
    date: '2025-07-01',
    label: 'Moweb Technologies',
    category: 'Internship',
    type: 'experience',
    id: '2',
  },
  {
    date: '2025-09-01',
    label: 'SEBS Data Analyst',
    category: 'Internship',
    type: 'experience',
    id: '1',
  },
  {
    date: '2025-12-01',
    label: 'Edgar Agent',
    category: 'Project',
    type: 'project',
    id: '7',
  },
  {
    date: '2026-04-01',
    label: 'GALE Engine',
    category: 'Project',
    type: 'project',
    id: 'gale',
  },
  {
    date: '2026-05-01',
    label: 'Amazon SCOT',
    category: 'Internship',
    type: 'experience',
    id: 'amazon1',
  },
  {
    date: '2026-09-01',
    label: 'LLM Eval Harness',
    category: 'Project',
    type: 'project',
    id: 'llm-eval',
  },
]

// Visual storytelling weights: each project is a modest lift; an internship is a
// larger career spike. These shape the stock-chart metaphor, not financial returns.
const milestoneWeights = { education: 30, project: 16, experience: 36 } as const
let cumulativeGrowth = 0
export const careerMilestones: readonly CareerMilestone[] = milestoneDefinitions.map(
  (milestone) => {
    cumulativeGrowth += milestoneWeights[milestone.type]
    return { ...milestone, value: cumulativeGrowth }
  },
)

export const timelineRanges = ['1D', '1W', '1M', '3M', 'YTD', '1Y', 'ALL'] as const
export type TimelineRange = (typeof timelineRanges)[number]

const DAY = 24 * 60 * 60 * 1000
const datedMilestones = careerMilestones.map((milestone) => ({
  ...milestone,
  timestamp: Date.parse(`${milestone.date}T00:00:00Z`),
}))
const firstTimestamp = datedMilestones[0].timestamp
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

// A seeded, multi-scale price texture preserves the stock-chart metaphor. It is
// illustrative movement, not a claim about returns or newly completed work.
function randomAt(index: number, seed: number): number {
  let value = Math.imul(index ^ seed, 0x45d9f3b)
  value = Math.imul(value ^ (value >>> 16), 0x45d9f3b)
  return (((value ^ (value >>> 16)) >>> 0) / 0xffffffff) * 2 - 1
}

function marketNoise(timestamp: number, scale: number, seed: number): number {
  const position = timestamp / scale
  const index = Math.floor(position)
  const fraction = position - index
  return randomAt(index, seed) * (1 - fraction) + randomAt(index + 1, seed) * fraction
}

function pointAt(timestamp: number): ChartDataPoint {
  const nextIndex = datedMilestones.findIndex((milestone) => milestone.timestamp > timestamp)
  const previous =
    datedMilestones[nextIndex === -1 ? datedMilestones.length - 1 : Math.max(0, nextIndex - 1)]
  const milestone = datedMilestones.find((item) => item.timestamp === timestamp)
  let value = previous.value

  if (nextIndex > 0) {
    const next = datedMilestones[nextIndex]
    const progress = (timestamp - previous.timestamp) / (next.timestamp - previous.timestamp)
    // Internships ramp sharply into their larger step; projects rise more gently.
    const growth = next.type === 'experience' ? Math.pow(progress, 2.2) : progress
    const pullback = Math.sin(progress * Math.PI * 3) * Math.sin(progress * Math.PI) * 0.24
    value += (next.value - previous.value) * (growth + pullback)
  }

  const distanceToMilestone = Math.min(
    ...datedMilestones.map((item) => Math.abs(timestamp - item.timestamp)),
  )
  const envelope = Math.min(1, distanceToMilestone / (3 * DAY))
  const texture =
    marketNoise(timestamp, 90 * DAY, 11) * 4.0 +
    marketNoise(timestamp, 30 * DAY, 17) * 4.0 +
    marketNoise(timestamp, 7 * DAY, 29) * 2.4 +
    marketNoise(timestamp, DAY, 43) * 1.5 +
    marketNoise(timestamp, 2 * 60 * 60 * 1000, 71) * 0.65 +
    marketNoise(timestamp, 5 * 60 * 1000, 97) * 0.16
  value += texture * envelope

  return {
    timestamp,
    time: dateFormatter.format(timestamp),
    value,
    ...(milestone ? { label: milestone.label, category: milestone.category } : {}),
  }
}

function subtractMonths(date: Date, months: number): number {
  const shifted = new Date(date)
  const day = shifted.getUTCDate()
  shifted.setUTCDate(1)
  shifted.setUTCMonth(shifted.getUTCMonth() - months)
  const lastDay = new Date(
    Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth() + 1, 0),
  ).getUTCDate()
  shifted.setUTCDate(Math.min(day, lastDay))
  return shifted.getTime()
}

export function filterTimelineData(range: string, now = new Date()): ChartDataPoint[] {
  const requestedEnd = Number.isFinite(now.getTime()) ? now.getTime() : Date.now()
  // Even an early preview has a finite, two-point line rather than invalid chart data.
  const end = Math.max(firstTimestamp + 1, requestedEnd)
  let start = firstTimestamp

  switch (range) {
    case '1D':
      start = end - DAY
      break
    case '1W':
      start = end - 7 * DAY
      break
    case '1M':
      start = subtractMonths(new Date(end), 1)
      break
    case '3M':
      start = subtractMonths(new Date(end), 3)
      break
    case 'YTD':
      start = Date.UTC(new Date(end).getUTCFullYear(), 0, 1)
      break
    case '1Y':
      start = subtractMonths(new Date(end), 12)
      break
  }

  start = Math.max(firstTimestamp, Math.min(start, end - 1))
  const timestamps = new Set([start, end])
  // Use a denser view for short ranges; every date still uses the same seeded function.
  const minute = 60 * 1000
  const step =
    [5 * minute, 30 * minute, 2 * 60 * minute, 6 * 60 * minute, DAY, 3 * DAY].find(
      (candidate) => (end - start) / candidate <= 500,
    ) ?? 3 * DAY
  const firstStep = Math.ceil((start - firstTimestamp) / step)
  for (let timestamp = firstTimestamp + firstStep * step; timestamp < end; timestamp += step) {
    timestamps.add(timestamp)
  }
  for (const milestone of datedMilestones) {
    if (milestone.timestamp >= start && milestone.timestamp <= end)
      timestamps.add(milestone.timestamp)
  }

  return [...timestamps].sort((a, b) => a - b).map(pointAt)
}
