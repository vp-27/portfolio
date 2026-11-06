export type SearchPhase = 'idle' | 'travel' | 'wave'

export function searchEnergyPath(
  origin: { x: number; y: number },
  destination: { x: number; y: number; entryY: number },
): string {
  // Stay vertical behind the controls, then converge only inside the wave.
  return `M ${origin.x} ${origin.y} V ${destination.entryY} Q ${origin.x} ${destination.y} ${destination.x} ${destination.y}`
}

// Match the chart's 580ms traces and 40ms stagger before forming the wave.
export function searchTravelDuration(matches: number, reducedMotion = false): number {
  return matches > 0 && !reducedMotion ? 580 + (matches - 1) * 40 : 0
}

function waitForPresentation(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const cancelled = () => new DOMException('Search presentation cancelled', 'AbortError')
    if (signal.aborted) {
      reject(cancelled())
      return
    }
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', cancel)
      resolve()
    }, ms)
    const cancel = () => {
      clearTimeout(timer)
      signal.removeEventListener('abort', cancel)
      reject(cancelled())
    }
    signal.addEventListener('abort', cancel, { once: true })
  })
}

export async function playSearchPresentation({
  matches,
  signal,
  onWave,
  reducedMotion = false,
}: {
  matches: number
  signal: AbortSignal
  onWave: () => void
  reducedMotion?: boolean
}): Promise<void> {
  const travel = searchTravelDuration(matches, reducedMotion)
  if (travel) await waitForPresentation(travel, signal)
  if (signal.aborted) throw new DOMException('Search presentation cancelled', 'AbortError')
  onWave()
  // Allow the 180ms entrance, then a 700ms hold. A slow answer can
  // keep the wave running longer; the provider starts the actual request at once.
  await waitForPresentation(700 + (reducedMotion ? 0 : 180), signal)
}
