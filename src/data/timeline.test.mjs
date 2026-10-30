import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import ts from 'typescript'

const source = await readFile(new URL('./timeline.ts', import.meta.url), 'utf8')
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
})
const { careerMilestones, filterTimelineData, timelineRanges } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
)
const now = new Date('2026-10-24T23:00:00Z')

test('day and week ranges use distinct real durations and preserve their exact endpoints', () => {
  const day = filterTimelineData('1D', now)
  const week = filterTimelineData('1W', now)
  assert.equal(day[0].timestamp, Date.parse('2026-10-23T23:00:00Z'))
  assert.equal(week[0].timestamp, Date.parse('2026-10-17T23:00:00Z'))
  assert.equal(day.at(-1).timestamp, now.getTime())
  assert.equal(week.at(-1).timestamp, now.getTime())
})

test('calendar ranges clamp month ends correctly, including leap years', () => {
  const month = filterTimelineData('1M', new Date('2026-10-31T12:30:00Z'))
  assert.equal(month[0].timestamp, Date.parse('2026-09-30T12:30:00Z'))
  const leapMonth = filterTimelineData('1M', new Date('2024-03-31T12:30:00Z'))
  assert.equal(leapMonth[0].timestamp, Date.parse('2024-02-29T12:30:00Z'))
  assert.equal(filterTimelineData('YTD', now)[0].timestamp, Date.parse('2026-01-01T00:00:00Z'))
})

test('switching ranges and returning never regenerates chart history', () => {
  const all = filterTimelineData('ALL', now)
  const year = filterTimelineData('1Y', now)
  const shared = new Map(all.map((point) => [point.timestamp, point.value]))
  assert.deepEqual(filterTimelineData('ALL', now), all)
  for (const point of year) {
    if (shared.has(point.timestamp)) assert.equal(point.value, shared.get(point.timestamp))
  }
})

test('recent periods retain repeatable stock texture without invented milestone labels', () => {
  for (const range of ['1D', '1W', '1M']) {
    const data = filterTimelineData(range, now)
    assert.ok(data.length >= 2)
    assert.ok(new Set(data.map((point) => point.value)).size > 20)
    assert.deepEqual(data, filterTimelineData(range, now))
    assert.ok(data.some((point, index) => index > 0 && point.value < data[index - 1].value))
    assert.ok(data.every((point) => !point.label))
  }
  const data3M = filterTimelineData('3M', now)
  assert.ok(data3M.length >= 2)
  assert.ok(new Set(data3M.map((point) => point.value)).size > 20)
  assert.deepEqual(data3M, filterTimelineData('3M', now))
  assert.ok(data3M.some((point, index) => index > 0 && point.value < data3M[index - 1].value))
  assert.ok(
    data3M.every((point) => !point.label || careerMilestones.some((m) => m.label === point.label)),
  )
})

test('all milestones retain their dates and navigation targets exactly once', () => {
  const points = filterTimelineData('ALL', now)
  assert.equal(points.filter((point) => point.label).length, careerMilestones.length)
  for (const milestone of careerMilestones) {
    const matches = points.filter((point) => point.label === milestone.label)
    assert.equal(matches.length, 1)
    assert.equal(matches[0].timestamp, Date.parse(`${milestone.date}T00:00:00Z`))
    assert.equal(matches[0].value, milestone.value)
    assert.ok(milestone.id)
    assert.ok(['project', 'experience', 'education'].includes(milestone.type))
  }
})

test('every range returns finite ordered data without future milestones', () => {
  const historicalNow = new Date('2025-08-15T12:00:00Z')
  for (const range of timelineRanges) {
    const points = filterTimelineData(range, historicalNow)
    assert.ok(points.length >= 2)
    assert.equal(points.at(-1).timestamp, historicalNow.getTime())
    for (let i = 0; i < points.length; i++) {
      assert.ok(Number.isFinite(points[i].value))
      assert.ok(points[i].timestamp <= historicalNow.getTime())
      if (i > 0) assert.ok(points[i].timestamp > points[i - 1].timestamp)
    }
    assert.ok(!points.some((point) => point.label === 'Amazon SCOT'))
  }
})

test('internship milestones create larger visual steps than project milestones', () => {
  const steps = careerMilestones
    .slice(1)
    .map((milestone, index) => ({
      type: milestone.type,
      rise: milestone.value - careerMilestones[index].value,
    }))
  const projectSteps = steps.filter((step) => step.type === 'project').map((step) => step.rise)
  const internshipSteps = steps
    .filter((step) => step.type === 'experience')
    .map((step) => step.rise)
  assert.ok(Math.min(...internshipSteps) > Math.max(...projectSteps))
})

test('decorative volatility never falls below the latest completed milestone', () => {
  // Include short views just after every event as well as the full history:
  // these catch dips that a coarse ALL view could miss.
  const dates = [
    now,
    ...careerMilestones.map((milestone) =>
      new Date(Date.parse(`${milestone.date}T00:00:00Z`) + 7 * 24 * 60 * 60 * 1000),
    ),
  ]
  for (const date of dates) {
    for (const range of timelineRanges) {
      for (const point of filterTimelineData(range, date)) {
        const previous = careerMilestones.findLast(
          (milestone) => Date.parse(`${milestone.date}T00:00:00Z`) <= point.timestamp,
        )
        assert.ok(previous)
        assert.ok(point.value >= previous.value, `${point.time} fell below ${previous.label}`)
      }
    }
  }
})
