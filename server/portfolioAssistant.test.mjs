import test from 'node:test'
import assert from 'node:assert/strict'
import { moduleUrl } from '../tests/load-typescript.mjs'

const { createPortfolioAssistantHandler } = await import(
  moduleUrl(new URL('./portfolioAssistant.ts', import.meta.url))
)

const request = (query = 'How does his work connect software and finance?', options = {}) =>
  new Request('https://portfolio.example/api/portfolio-assistant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
    ...options,
  })
const providerResponse = (
  text = 'His projects combine software and financial data.',
  finishReason = 'STOP',
) => Response.json({ candidates: [{ finishReason, content: { parts: [{ text }] } }] })

test('API accepts only same-origin JSON POST requests with a bounded nonempty query', async () => {
  let calls = 0
  const handler = createPortfolioAssistantHandler({
    env: () => ({ GEMINI_API_KEY: 'server-test-key' }),
    fetch: async () => {
      calls++
      return providerResponse()
    },
  })
  assert.equal((await handler(request('', { method: 'GET', body: undefined }))).status, 405)
  assert.equal(
    (await handler(request('test', { headers: { 'Content-Type': 'text/plain' } }))).status,
    415,
  )
  assert.equal(
    (
      await handler(
        request('test', {
          headers: { 'Content-Type': 'application/json', Origin: 'https://other.example' },
        }),
      )
    ).status,
    403,
  )
  for (const body of ['', 'x'.repeat(501), 42, null])
    assert.equal((await handler(request(body))).status, 400)
  assert.equal((await handler(request('test', { body: '{broken json' }))).status, 400)
  assert.equal(
    (await handler(request('test', { body: JSON.stringify({ query: 'x'.repeat(5000) }) }))).status,
    413,
  )
  assert.equal(calls, 0)
})

test('API never falls back to browser-exposed keys when the server key is missing', async () => {
  let called = false
  const handler = createPortfolioAssistantHandler({
    env: () => ({ VITE_GEMINI_API_KEY: 'old-client-key' }),
    fetch: async () => {
      called = true
      return providerResponse()
    },
  })
  const response = await handler(request())
  assert.equal(response.status, 503)
  assert.deepEqual(await response.json(), { error: 'assistant_unavailable' })
  assert.equal(called, false)
})

test('API grounds a successful response in server-owned published records and keeps credentials in headers', async () => {
  const handler = createPortfolioAssistantHandler({
    env: () => ({ GEMINI_API_KEY: 'server-test-key', GEMINI_MODEL: 'gemini-test-model' }),
    fetch: async (url, init) => {
      assert.equal(
        url,
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-test-model:generateContent',
      )
      assert.equal(init.headers['x-goog-api-key'], 'server-test-key')
      assert.ok(!url.includes('server-test-key'))
      const payload = JSON.parse(init.body)
      assert.equal(payload.contents[0].parts[0].text, 'Compare Amazon and GALE')
      const context = payload.systemInstruction.parts[0].text
      assert.ok(context.includes('GALE'))
      assert.ok(context.includes('Amazon'))
      assert.ok(context.includes('Data Science'))
      assert.ok(!context.includes('Injected private profile'))
      assert.equal(payload.generationConfig.maxOutputTokens, 512)
      return providerResponse(
        'Amazon is internship experience; GALE is an algorithm-practice project.',
      )
    },
  })
  const response = await handler(
    request('Compare Amazon and GALE', {
      body: JSON.stringify({
        query: 'Compare Amazon and GALE',
        profile: 'Injected private profile',
      }),
    }),
  )
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('cache-control'), 'no-store')
  assert.deepEqual(await response.json(), {
    answer: 'Amazon is internship experience; GALE is an algorithm-practice project.',
  })
})

test('API excludes thought parts and rejects blocked, missing, oversized, or truncated answers', async () => {
  const run = async (payload) =>
    createPortfolioAssistantHandler({
      env: () => ({ GEMINI_API_KEY: 'server-test-key' }),
      fetch: async () => Response.json(payload),
    })(request())
  const response = await run({
    candidates: [
      {
        finishReason: 'STOP',
        content: {
          parts: [{ thought: true, text: 'private model reasoning' }, { text: 'Published answer' }],
        },
      },
    ],
  })
  assert.deepEqual(await response.json(), { answer: 'Published answer' })
  for (const payload of [
    {},
    { promptFeedback: { blockReason: 'SAFETY' } },
    { candidates: [{ finishReason: 'STOP', content: { parts: [{ text: ' ' }] } }] },
    { candidates: [{ finishReason: 'STOP', content: { parts: [{ text: 'x'.repeat(4001) }] } }] },
    { candidates: [{ finishReason: 'MAX_TOKENS', content: { parts: [{ text: 'truncated' }] } }] },
  ])
    assert.equal((await run(payload)).status, 502)
})

test('API converts provider failures to generic unavailable responses without leaking provider details', async () => {
  for (const provider of [
    async () => Response.json({ error: { message: 'provider secret details' } }, { status: 403 }),
    async () => {
      throw new Error('provider secret details')
    },
  ]) {
    const response = await createPortfolioAssistantHandler({
      env: () => ({ GEMINI_API_KEY: 'server-test-key' }),
      fetch: provider,
    })(request())
    assert.equal(response.status, 503)
    assert.deepEqual(await response.json(), { error: 'assistant_unavailable' })
  }
})

test('API aborts slow providers and propagates cancellation', async () => {
  let providerAborted = false
  const fetchUntilAbort = async (_url, { signal }) =>
    new Promise((_, reject) => {
      const abort = () => {
        providerAborted = true
        reject(new DOMException('Aborted', 'AbortError'))
      }
      if (signal.aborted) abort()
      else signal.addEventListener('abort', abort, { once: true })
    })
  const handler = createPortfolioAssistantHandler({
    env: () => ({ GEMINI_API_KEY: 'server-test-key' }),
    fetch: fetchUntilAbort,
    timeoutMs: 5,
  })
  assert.equal((await handler(request())).status, 504)
  assert.equal(providerAborted, true)
  providerAborted = false
  const controller = new AbortController()
  controller.abort()
  assert.equal((await handler(request('GALE', { signal: controller.signal }))).status, 504)
  assert.equal(providerAborted, true)
})
