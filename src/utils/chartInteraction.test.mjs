import test from 'node:test'
import assert from 'node:assert/strict'
import { moduleUrl } from '../../tests/load-typescript.mjs'
const { shouldPreviewMilestone } = await import(
  moduleUrl(new URL('./chartInteraction.ts', import.meta.url))
)

test('touch first previews, second tap visits, and a different or late tap previews again', () => {
  assert.equal(shouldPreviewMilestone(12, null, 1000, true, false), true)
  const firstTap = { timestamp: 12, tappedAt: 1000 }
  assert.equal(shouldPreviewMilestone(12, firstTap, 1500, true, false), false)
  assert.equal(shouldPreviewMilestone(12, firstTap, 2100, true, false), true)
  assert.equal(shouldPreviewMilestone(13, firstTap, 1500, true, false), true)
})

test('mouse and keyboard activate directly even after a touch preview', () => {
  assert.equal(shouldPreviewMilestone(12, null, 1000, false, false), false)
  assert.equal(shouldPreviewMilestone(12, null, 1000, true, true), false)
})
