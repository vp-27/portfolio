import test from 'node:test'
import assert from 'node:assert/strict'
import { moduleUrl } from '../../tests/load-typescript.mjs'

const { processAIQuery, processAIQueryAsync, isNaturalLanguageQuery } = await import(
  moduleUrl(new URL('./aiAssistant.ts', import.meta.url))
)

test('project and experience queries retain their card targets and public links', () => {
  for (const [query, type, id, milestone] of [
    ['Tell me about Amazon SCOT', 'experience', 'amazon1', 'Amazon SCOT'],
    ['Tell me about SEBS', 'experience', '1', 'SEBS Data Analyst'],
    ['Moweb', 'experience', '2', 'Moweb Technologies'],
    ['GALE', 'project', 'gale', 'GALE Engine'],
    ['Edgar Agent', 'project', '7', 'Edgar Agent'],
    ['GrindSheet', 'project', '3', 'GrindSheet'],
    ['Algo Trading', 'project', '1', 'Algo Trading Bot'],
    ['PerkPal', 'project', '5', 'Shark Tank Top 6'],
  ]) {
    const result = processAIQuery(query)
    assert.equal(result.targetType, type)
    assert.equal(result.targetId, id)
    assert.equal(result.milestoneLabel, milestone)
    assert.equal(result.source, 'portfolio')
    assert.ok(result.answer.length)
  }
  assert.ok(
    processAIQuery('GALE').actionLinks.some((link) => link.url === 'https://vtch-game.vercel.app/'),
  )
})

test('resume requests produce explicit links rather than opening popups', () => {
  assert.equal(processAIQuery('CS resume').actionUrl, '/resumes/Vandan_Patel_CS.pdf')
  assert.equal(processAIQuery('Finance resume').actionUrl, '/resumes/Vandan_Patel_Finance.pdf')
  assert.equal(processAIQuery('resume').actionLinks.length, 2)
  assert.equal(processAIQuery('Contact Vandan').targetType, 'contact')
})

test('education includes all three degrees and certifications use published records', () => {
  const answer = processAIQuery('Education').answer
  for (const degree of ['Computer Science', 'Finance', 'Data Science'])
    assert.ok(answer.includes(degree))
  const certifications = processAIQuery('certifications').answer
  assert.ok(certifications.includes('Bloomberg Market Concepts'))
  assert.ok(!certifications.includes('Series 65'))
})

test('unknown questions do not substitute an invented personal answer', () => {
  assert.match(
    processAIQuery('What is his favorite breakfast?').answer,
    /don’t have a published answer/,
  )
  assert.equal(isNaturalLanguageQuery('Financial Statement Analysis'), false)
  assert.equal(isNaturalLanguageQuery('What are his skills?'), true)
})

test('a superseded or cleared request cannot complete after cancellation', async () => {
  const before = new AbortController()
  before.abort()
  await assert.rejects(processAIQueryAsync('GALE', before.signal), { name: 'AbortError' })
  const during = new AbortController()
  const pending = processAIQueryAsync('Amazon', during.signal)
  during.abort()
  await assert.rejects(pending, { name: 'AbortError' })
  assert.equal((await processAIQueryAsync('GALE')).source, 'portfolio')
})

const { searchPortfolio } = await import(
  moduleUrl(new URL('./portfolioSearch.ts', import.meta.url))
)

test('live and submitted Python searches share the same five ranked matches', () => {
  const live = searchPortfolio('Python ')
  assert.equal(live.experiences.length, 2)
  assert.equal(live.projects.length, 3)
  assert.equal(live.targets.length, 5)
  assert.equal(searchPortfolio('Pyth').targets.length, 5)
  assert.deepEqual(processAIQuery('Python').matchingTargets, live.targets)
  assert.deepEqual(searchPortfolio('What has he built with Python?').targets, live.targets)
  assert.deepEqual(processAIQuery('What has he built with Python?').matchingTargets, live.targets)
  assert.ok(processAIQuery('Python').suggestedChips.every((chip) => !chip.includes('GALE')))
})

test('specific aliases retain relevant cards while informational requests keep the portfolio available', () => {
  assert.deepEqual(
    searchPortfolio('Tell me about GALE').projects.map((project) => project.id),
    ['gale'],
  )
  assert.deepEqual(
    searchPortfolio('Algo Trading').projects.map((project) => project.id),
    ['1'],
  )
  assert.equal(searchPortfolio('CS resume').active, false)
  assert.equal(searchPortfolio('Contact Vandan').active, false)
  assert.equal(searchPortfolio('What projects has he built?').active, false)
  assert.equal(searchPortfolio('  ').active, false)
  assert.equal(searchPortfolio('zz-no-match').targets.length, 0)
  assert.deepEqual(processAIQuery('zz-no-match').matchingTargets, [])
})

test('multiple terms require every term unless the visitor explicitly asks for either', () => {
  const both = searchPortfolio('Python and SQL')
  assert.deepEqual(both.projects, [])
  assert.deepEqual(
    both.experiences.map((item) => item.id),
    ['2'],
  )
  assert.deepEqual(processAIQuery('Python and SQL').matchingTargets, both.targets)
  assert.match(processAIQuery('Python and SQL').answer, /all your search terms/)
  assert.equal(searchPortfolio('Python or SQL').targets.length, 5)
  assert.deepEqual(searchPortfolio('SQL Python').targets, both.targets)
  assert.equal(searchPortfolio('Python or GALE').targets.length, 6)
  assert.equal(searchPortfolio('Python and GALE').targets.length, 0)
})

test('unrecognized modifiers survive and short aliases do not match unrelated word fragments', () => {
  assert.equal(searchPortfolio('React Native').targets.length, 0)
  assert.equal(searchPortfolio('What has he built with React Native?').targets.length, 0)
  assert.equal(searchPortfolio('React').projects[0].id, '5')
  assert.deepEqual(
    searchPortfolio('SEC').projects.map((item) => item.id),
    ['7'],
  )
  assert.equal(searchPortfolio('SEC').experiences.length, 0)
  assert.equal(searchPortfolio('Java').targets.length, 0)
})

test('multi-entity answers describe every selected entry and share the same targets as typing', () => {
  for (const query of ['Tell me about Amazon and GALE', 'Compare Amazon and GALE']) {
    const answer = processAIQuery(query)
    assert.match(answer.answer, /Amazon/)
    assert.match(answer.answer, /GALE/)
    assert.equal(answer.matchingTargets.length, 2)
    assert.deepEqual(answer.matchingTargets, searchPortfolio(query).targets)
  }
})

test('generic skills and project questions remain informational rather than accidental empty filters', () => {
  for (const query of [
    'What are his technical skills?',
    'What are his tools and platforms?',
    'What projects has he built?',
  ]) {
    assert.equal(searchPortfolio(query).active, false)
    assert.ok(processAIQuery(query).answer.length)
  }
})

test('live AI supplies prose while trusted links and result routing remain local', async () => {
  const query = 'Tell me about Amazon and GALE'
  const answer = await processAIQueryAsync(query, undefined, async (url, options) => {
    assert.equal(url, '/api/portfolio-assistant')
    assert.equal(options.method, 'POST')
    assert.deepEqual(JSON.parse(options.body), { query })
    assert.deepEqual(options.headers, { 'Content-Type': 'application/json' })
    return Response.json({
      answer: 'Amazon is experience; GALE is a project.',
      targetId: 'untrusted',
    })
  })
  assert.equal(answer.source, 'ai')
  assert.equal(answer.answer, 'Amazon is experience; GALE is a project.')
  assert.deepEqual(answer.matchingTargets, searchPortfolio(query).targets)
  assert.notEqual(answer.targetId, 'untrusted')
  await processAIQueryAsync('Python', undefined, async () =>
    assert.fail('Keywords must not incur a model call'),
  )
})

test('unconfigured, failed, malformed, and empty AI responses retain useful local answers', async () => {
  const query = 'Tell me about GALE'
  for (const request of [
    async () => new Response(null, { status: 503 }),
    async () => {
      throw new Error('unavailable')
    },
    async () => new Response('not json'),
    async () => Response.json({ answer: '  ' }),
    async () => Response.json({ answer: 'x'.repeat(6001) }),
  ]) {
    const answer = await processAIQueryAsync(query, undefined, request)
    assert.equal(answer.source, 'portfolio')
    assert.equal(answer.aiUnavailable, true)
    assert.equal(answer.answer, processAIQuery(query).answer)
    assert.deepEqual(answer.matchingTargets, searchPortfolio(query).targets)
  }
})

test('clearing a question cancels the provider request instead of showing a stale answer', async () => {
  const controller = new AbortController()
  let start
  const started = new Promise((resolve) => {
    start = resolve
  })
  const pending = processAIQueryAsync(
    'Tell me about GALE',
    controller.signal,
    async (_url, options) =>
      new Promise((_resolve, reject) => {
        options.signal.addEventListener(
          'abort',
          () => reject(new DOMException('Cancelled', 'AbortError')),
          { once: true },
        )
        start()
      }),
  )
  await started
  controller.abort()
  await assert.rejects(pending, { name: 'AbortError' })
})
