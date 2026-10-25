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
const render = (result = null, isLoading = false) =>
  renderToStaticMarkup(
    createElement(PortfolioSearchPanel, {
      query: 'Python',
      result,
      isLoading,
      onSubmit() {},
      onEdit() {},
      onJump() {},
      onClear() {},
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
  assert.equal(targets(answered).length, 5)
  for (const markup of [typing, pending, answered]) {
    assert.ok(markup.includes('aria-label="Portfolio search results"'))
    assert.ok(markup.includes('aria-label="Clear search"'))
    assert.ok(markup.includes('>Search</span>'))
  }
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
