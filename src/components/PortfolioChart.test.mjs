import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { moduleUrl } from '../../tests/load-typescript.mjs'
import { readFileSync } from 'node:fs'

const { default: PortfolioChart } = await import(
  moduleUrl(new URL('./PortfolioChart.tsx', import.meta.url))
)
const { default: PortfolioHeader } = await import(
  moduleUrl(new URL('./PortfolioHeader.tsx', import.meta.url))
)
const { default: BuyingPower } = await import(
  moduleUrl(new URL('./BuyingPower.tsx', import.meta.url))
)
const { getChartSearchPreview } = await import(
  moduleUrl(new URL('../utils/chartSearch.ts', import.meta.url))
)
const { searchPortfolio } = await import(
  moduleUrl(new URL('../utils/portfolioSearch.ts', import.meta.url))
)
const { filterTimelineData } = await import(
  moduleUrl(new URL('../data/timeline.ts', import.meta.url))
)
const data = filterTimelineData('ALL', new Date('2026-11-05T12:00:00Z'))
const render = (query = '', extra = {}) =>
  renderToStaticMarkup(
    createElement(PortfolioChart, {
      data,
      isPositive: true,
      search: getChartSearchPreview(query),
      ...extra,
    }),
  )
const curve = (markup) => markup.match(/<polyline[^>]*points="([^"]+)"/)[1]
const renderRow = (query, extra = {}) =>
  renderToStaticMarkup(
    createElement(BuyingPower, {
      search: getChartSearchPreview(query),
      ...extra,
    }),
  )

test('chart search uses the exact same milestone targets as portfolio search', () => {
  for (const query of ['Python', 'SQL', 'React', 'PostgreSQL & Supabase', 'Tell me about GALE']) {
    assert.deepEqual(
      getChartSearchPreview(query).milestoneLabels,
      searchPortfolio(query)
        .targets.map((target) => target.milestoneLabel)
        .filter(Boolean),
      query,
    )
  }
  assert.equal(getChartSearchPreview('Python').milestoneLabels.length, 6)
})

test('search preserves the stock curve and exposes only real matches as navigable milestones', () => {
  const normal = render()
  const searching = render('Python')
  assert.equal(curve(normal), curve(searching))
  assert.equal((normal.match(/role="button"/g) || []).length, 10)
  assert.equal((searching.match(/role="button"/g) || []).length, 6)
  assert.equal((searching.match(/class="timeline-search-guide"/g) || []).length, 6)
  const row = renderRow('Python')
  assert.ok(row.includes('Select a gold milestone to visit'))
  assert.ok(row.includes('Search results'))
  assert.ok(row.includes('aria-label="Search deeper: Python"'))
  assert.ok(!row.includes('Explore career milestones'))
  assert.ok(!searching.includes('aria-label="Search deeper: Python"'))
  assert.equal(curve(render()), curve(normal))
})

test('a selected match has an actual Visit control, including for touch and keyboard readers', () => {
  const searching = renderRow('Python', { activeMilestone: 'Amazon SCOT' })
  assert.ok(searching.includes('<button type="button"'))
  assert.ok(searching.includes('aria-label="Visit Amazon SCOT"'))
  const unrelated = renderRow('Python', { activeMilestone: 'Started Rutgers' })
  assert.ok(!unrelated.includes('aria-label="Visit Started Rutgers"'))
})

test('unsupported examples and informational questions never highlight unrelated milestones', () => {
  for (const query of ['Java', 'Docker', 'zz-no-match', 'Contact Vandan']) {
    assert.deepEqual(getChartSearchPreview(query).milestoneLabels, [], query)
    const searching = render(query)
    assert.equal((searching.match(/role="button"/g) || []).length, 0, query)
    assert.ok(!searching.includes('Select a gold milestone to visit'), query)
  }
  assert.equal(getChartSearchPreview('Java').summary, '0 search results')
  assert.equal(getChartSearchPreview('').active, false)
})

test('long questions and unmatched searches remain the actual chart heading', () => {
  const query = 'How does Vandan combine finance and software engineering in his projects?'
  const search = getChartSearchPreview(query)
  assert.equal(search.title, query)
  const header = renderToStaticMarkup(createElement(PortfolioHeader, { search }))
  assert.ok(header.includes(`aria-label="${query}"`))
  assert.ok(!header.includes('Portfolio Search'))
  assert.ok(header.includes(query))
  assert.equal(getChartSearchPreview('Python').title, 'Python')
  assert.equal(
    getChartSearchPreview('Something with no portfolio matches').title,
    'Something with no portfolio matches',
  )
})

test('submission adds one handoff trace per match without altering the underlying curve', () => {
  const typing = render('Python')
  const submitted = render('Python', { submissionId: 1, loadingPhase: 'travel' })
  assert.ok(!typing.includes('class="timeline-search-beam"'))
  assert.equal((submitted.match(/class="timeline-search-beam"/g) || []).length, 6)
  assert.equal(curve(typing), curve(submitted))
})

test('each gold trace is one forward-moving pulse, with no repeated segment entering the line', () => {
  const submitted = render('Python', { submissionId: 1, loadingPhase: 'travel' })
  const beams = [...submitted.matchAll(/<path[^>]*class="timeline-search-beam"[^>]*>/g)]
  assert.equal(beams.length, 6)
  const css = readFileSync(new URL('../index.css', import.meta.url), 'utf8')
  const frames = css.match(/@keyframes timeline-search-beam\s*\{([\s\S]*?)\n\}/)[1]
  const [startOffset, endOffset] = [...frames.matchAll(/stroke-dashoffset:\s*([\d.-]+)/g)].map(
    (match) => Number(match[1]),
  )
  for (const [beam] of beams) {
    const [dash, gap] = beam
      .match(/stroke-dasharray="([^"]+)"/)[1]
      .split(/\s+/)
      .map(Number)
    const period = dash + gap
    const segmentsAt = (offset) => {
      const visible = []
      const repeats = Math.ceil((1 + Math.abs(offset)) / period) + 1
      for (let repeat = -repeats; repeat <= repeats; repeat++) {
        const start = repeat * period - offset
        const end = start + dash
        if (Math.min(1, end) - Math.max(0, start) > 1e-8)
          visible.push([Math.max(0, start), Math.min(1, end)])
      }
      return visible
    }
    assert.equal(segmentsAt(startOffset).length, 0, 'no segment starts at the far end')
    assert.equal(segmentsAt(endOffset).length, 0, 'no second segment enters after the pulse leaves')
    let previousCenter = -1
    for (let frame = 0; frame <= 200; frame++) {
      const offset = startOffset + ((endOffset - startOffset) * frame) / 200
      const segments = segmentsAt(offset)
      assert.ok(segments.length <= 1, `duplicate pulse at offset ${offset}`)
      if (segments.length) {
        const center = (segments[0][0] + segments[0][1]) / 2
        assert.ok(center >= previousCenter, 'pulse must keep moving toward the bottom')
        previousCenter = center
      }
    }
  }
})
