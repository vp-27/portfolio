export interface ArmedMilestone {
  timestamp: number
  tappedAt: number
}

export function shouldPreviewMilestone(
  timestamp: number,
  previous: ArmedMilestone | null,
  now: number,
  touchInput: boolean,
  keyboard: boolean,
): boolean {
  return (
    touchInput &&
    !keyboard &&
    (!previous || previous.timestamp !== timestamp || now - previous.tappedAt > 900)
  )
}
