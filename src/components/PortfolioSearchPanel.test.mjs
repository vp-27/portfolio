import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { moduleUrl } from '../../tests/load-typescript.mjs'

const { default: PortfolioSearchPanel } = await import(
  moduleUrl(new URL('./PortfolioSearchPanel.tsx', import.meta.url))
)
const { processAIQuery } = await import(
  moduleUrl(new URL('../utils/aiAssistant.ts', import.meta.url))
)
const render = (result = null, isLoading = false, query = 'Python', loadingPhase) =>
  renderToStaticMarkup(
    createElement(PortfolioSearchPanel, {
      query,
      result,
      isLoading,
      loadingPhase,
      onSubmit() {},
      onJump() {},
    }),
  )
const targets = (markup) =>
  [...markup.matchAll(/<button[^>]*>(.*?)<\/button>/gs)]
    .map((match) => match[1].replace(/<[^>]+>/g, ''))
    .filter((label) => !label.includes('Python') && label !== '')

test('typing, pending, and submitted searches preserve the same matching-entry controls', () => {
  const typing = render()
  const pending = render(null, true)
  const answered = render(processAIQuery('Python'))
  assert.deepEqual(targets(typing), targets(pending))
  assert.deepEqual(targets(typing), targets(answered))
  assert.equal(targets(answered).length, 6)
  for (const markup of [typing, pending, answered]) {
    assert.ok(markup.includes('aria-label="Portfolio search results"'))
    assert.ok(!markup.includes('aria-label="Clear search"'))
    assert.ok(!markup.includes('>Search</span>'))
    assert.ok(!markup.includes('Edit search:'))
  }
  assert.ok(!typing.includes('matching projects &amp; experiences'))
  assert.ok(answered.includes('4 projects and 2 experiences match your search.'))
})

test('provider availability does not change the product identity or expose backend status', () => {
  const answer = processAIQuery('Python')
  const local = render(answer)
  const fallback = render({ ...answer, aiUnavailable: true })
  const generated = render({ ...answer, source: 'ai' })
  assert.equal(local, fallback)
  assert.equal(local, generated)
  assert.ok(!local.includes('Live AI unavailable'))
  assert.ok(!local.includes('Portfolio Guide'))
  assert.ok(!local.includes('Portfolio Assistant'))
})

test('a listed skill without a case study is recognized while typing and after submission', () => {
  for (const query of ['Java', 'Docker', 'Valuation (DCF, Comps)']) {
    const typing = render(null, false, query)
    const answered = render(processAIQuery(query), false, query)
    for (const markup of [typing, answered]) {
      assert.ok(markup.includes('Listed skill:'))
      assert.ok(!markup.includes('No matching'))
      assert.ok(!markup.includes('Matching entries'))
    }
    assert.ok(answered.includes('/resumes/'))
  }
})

test('one wave replaces the tiny indicator and appears only after the chart travel phase', () => {
  const travel = render(null, true, 'Python', 'travel')
  assert.ok(!travel.includes('class="search-dot-wave"'))
  assert.ok(travel.includes('data-search-wave'), 'reserve the wave landing during travel')
  for (const query of ['Python', 'zz-no-match']) {
    const wave = render(null, true, query, 'wave')
    assert.equal((wave.match(/class="search-dot-wave"/g) || []).length, 1)
    assert.ok(!wave.includes('class="search-wave"'))
    assert.ok(!wave.includes('Press Enter'))
  }
})

test('the answer replaces the wave in the same space without a floating or collapsing transition', () => {
  const pending = render(null, true, 'Python', 'wave')
  const answered = render(processAIQuery('Python'))
  for (const markup of [pending, answered]) assert.ok(markup.includes('min-h-[76px]'))
  assert.ok(!answered.includes('transform:'))
  assert.ok(!answered.includes('class="search-dot-wave"'))
  assert.ok(answered.includes('4 projects and 2 experiences match your search.'))
})
