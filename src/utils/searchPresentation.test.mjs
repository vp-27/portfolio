import test from 'node:test'
import assert from 'node:assert/strict'
import { moduleUrl } from '../../tests/load-typescript.mjs'

const { playSearchPresentation, searchTravelDuration, searchEnergyPath } = await import(
  moduleUrl(new URL('./searchPresentation.ts', import.meta.url))
)
const flush = async () => {
  for (let index = 0; index < 5; index++) await Promise.resolve()
}

test('a fast answer waits for the gold traces, wave entrance, and a 700ms hold', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const controller = new AbortController()
  t.after(() => controller.abort())
  let wave = false
  let published = false
  const presentation = playSearchPresentation({
    matches: 6,
    signal: controller.signal,
    onWave: () => {
      wave = true
    },
  })
  const done = Promise.all([Promise.resolve('answer'), presentation]).then(() => {
    published = true
  })
  assert.equal(searchTravelDuration(6), 780)
  t.mock.timers.tick(779)
  await flush()
  assert.equal(wave, false)
  assert.equal(published, false)
  t.mock.timers.tick(1)
  await flush()
  assert.equal(wave, true)
  t.mock.timers.tick(879)
  await flush()
  assert.equal(published, false)
  t.mock.timers.tick(1)
  await done
  assert.equal(published, true)
})

test('a query without chart matches starts with the wave and keeps the same minimum visibility', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const controller = new AbortController()
  t.after(() => controller.abort())
  let wave = false
  let finished = false
  const done = playSearchPresentation({
    matches: 0,
    signal: controller.signal,
    onWave: () => {
      wave = true
    },
  }).then(() => {
    finished = true
  })
  assert.equal(searchTravelDuration(0), 0)
  assert.equal(wave, true)
  t.mock.timers.tick(879)
  await flush()
  assert.equal(finished, false)
  t.mock.timers.tick(1)
  await done
  assert.equal(finished, true)
})

test('a slow response keeps the wave active until the answer is available', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const controller = new AbortController()
  t.after(() => controller.abort())
  let resolveAnswer
  const answer = new Promise((resolve) => {
    resolveAnswer = resolve
  })
  let published = false
  const presentation = playSearchPresentation({
    matches: 0,
    signal: controller.signal,
    onWave() {},
  })
  const done = Promise.all([answer, presentation]).then(() => {
    published = true
  })
  t.mock.timers.tick(5000)
  await flush()
  assert.equal(published, false)
  resolveAnswer('answer')
  await done
  assert.equal(published, true)
})

test('clearing or editing during either phase cancels the wait and cannot publish an old answer', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  for (const matches of [6, 0]) {
    const controller = new AbortController()
    let published = false
    let waveCount = 0
    const presentation = playSearchPresentation({
      matches,
      signal: controller.signal,
      onWave: () => {
        waveCount++
      },
    })
    const done = Promise.all([Promise.resolve('old answer'), presentation]).then(() => {
      published = true
    })
    const rejected = assert.rejects(done, { name: 'AbortError' })
    controller.abort()
    t.mock.timers.tick(10000)
    await rejected
    assert.equal(published, false)
    assert.equal(waveCount, matches ? 0 : 1)
  }
})

test('reduced motion skips the traces and holds the static wave for 700ms', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const controller = new AbortController()
  t.after(() => controller.abort())
  let wave = false
  let finished = false
  const done = playSearchPresentation({
    matches: 6,
    signal: controller.signal,
    reducedMotion: true,
    onWave: () => {
      wave = true
    },
  }).then(() => {
    finished = true
  })
  assert.equal(searchTravelDuration(6, true), 0)
  assert.equal(wave, true)
  t.mock.timers.tick(699)
  await flush()
  assert.equal(finished, false)
  t.mock.timers.tick(1)
  await done
  assert.equal(finished, true)
})

test('energy stays vertical behind both control rows and converges only inside the wave', () => {
  for (const width of [320, 390, 900]) {
    const controlsEnd = 360
    const destination = { x: width / 2, entryY: controlsEnd + 12, y: controlsEnd + 50 }
    for (const x of [width * 0.1, width * 0.9]) {
      const origin = { x, y: 120 }
      const path = searchEnergyPath(origin, destination)
      const values = path.match(/[\d.]+/g).map(Number)
      assert.deepEqual(values.slice(0, 3), [origin.x, origin.y, destination.entryY])
      assert.ok(values[2] > controlsEnd, 'the path must reach past the controls before bending')
      assert.deepEqual(values.slice(-2), [destination.x, destination.y])
      const [controlX, controlY, endX, endY] = values.slice(3)
      for (let step = 0; step <= 20; step++) {
        const t = step / 20
        const curveY =
          (1 - t) ** 2 * destination.entryY + 2 * (1 - t) * t * controlY + t ** 2 * endY
        const curveX = (1 - t) ** 2 * origin.x + 2 * (1 - t) * t * controlX + t ** 2 * endX
        assert.ok(curveY >= destination.entryY && curveY <= destination.y)
        assert.ok(curveX >= Math.min(x, endX) - 1e-8 && curveX <= Math.max(x, endX) + 1e-8)
      }
    }
  }
})
