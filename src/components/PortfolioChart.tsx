import { useEffect, useId, useLayoutEffect, useRef, useState, type PointerEvent } from 'react'
import { shouldPreviewMilestone, type ArmedMilestone } from '../utils/chartInteraction'
import type { ChartDataPoint } from '../types'
import type { ChartSearchPreview } from '../utils/chartSearch'
import { searchEnergyPath, type SearchPhase } from '../utils/searchPresentation'

interface PortfolioChartProps {
  data: ChartDataPoint[]
  isPositive: boolean
  onPointClick?: (point: ChartDataPoint, origin?: { x: number; y: number }) => void
  onPointHover?: (point: ChartDataPoint | null) => void
  onScrubEnd?: () => void
  hoveredMilestoneLabel?: string | null
  search?: ChartSearchPreview
  submissionId?: number
  loadingPhase?: SearchPhase
}

// This timeline needs a single series, not a general-purpose chart runtime.
export default function PortfolioChart({
  data,
  isPositive,
  onPointClick,
  onPointHover,
  onScrubEnd,
  hoveredMilestoneLabel,
  search,
  submissionId = 0,
  loadingPhase = 'idle',
}: PortfolioChartProps) {
  const gradientId = useId().replace(/:/g, '')
  const container = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 800, height: 256 })
  const [activePoint, setActivePoint] = useState<ChartDataPoint | null>(null)
  const [waveDestination, setWaveDestination] = useState<{
    x: number
    y: number
    entryY: number
  } | null>(null)
  const pointerStart = useRef<{ x: number; y: number } | null>(null)
  const dragged = useRef(false)
  const touchInput = useRef(false)
  const armedMilestone = useRef<ArmedMilestone | null>(null)
  const color = isPositive ? '#00c805' : '#ff5000'
  const searching = !!search?.active
  const matchedLabels = new Set(search?.milestoneLabels || [])
  const presenting = loadingPhase !== 'idle'

  useLayoutEffect(() => {
    if (!submissionId || !presenting || !container.current) {
      setWaveDestination(null)
      return
    }
    const chart = container.current
    const wave = chart
      .closest('[data-search-flow]')
      ?.querySelector<HTMLElement>('[data-search-wave]')
    if (!wave) return
    const measure = () => {
      const source = chart.getBoundingClientRect()
      const target = wave.getBoundingClientRect()
      setSize((previous) =>
        previous.width === source.width && previous.height === source.height
          ? previous
          : { width: source.width, height: source.height },
      )
      const next = {
        x: target.left + target.width / 2 - source.left,
        y: target.top + target.height / 2 - source.top,
        entryY: target.top - source.top,
      }
      setWaveDestination((previous) =>
        previous?.x === next.x && previous.y === next.y && previous.entryY === next.entryY
          ? previous
          : next,
      )
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(chart)
    observer.observe(wave)
    return () => observer.disconnect()
  }, [submissionId, presenting])

  useEffect(() => {
    setActivePoint(null)
    armedMilestone.current = null
  }, [search?.query])

  useLayoutEffect(() => {
    if (!container.current) return
    const observer = new ResizeObserver(([entry]) => {
      setSize({ width: entry.contentRect.width, height: entry.contentRect.height })
    })
    observer.observe(container.current)
    return () => observer.disconnect()
  }, [])

  const padding = 10
  const first = data[0]?.timestamp ?? 0
  const duration = Math.max(1, (data.at(-1)?.timestamp ?? 1) - first)
  const minValue = Math.min(...data.map((point) => point.value))
  const maxValue = Math.max(...data.map((point) => point.value))
  const spread = Math.max(6, maxValue - minValue)
  const lowerBound = minValue - spread * 0.04
  const upperBound = maxValue + spread * 0.04
  const x = (point: ChartDataPoint) =>
    padding + ((point.timestamp - first) / duration) * Math.max(1, size.width - padding * 2)
  const y = (point: ChartDataPoint) =>
    size.height -
    padding -
    ((point.value - lowerBound) / (upperBound - lowerBound)) * (size.height - padding * 2)
  const points = data.map((point) => `${x(point).toFixed(2)},${y(point).toFixed(2)}`).join(' ')
  const milestones = data.filter((point) => point.label)
  const matchingMilestones = milestones.filter((point) => matchedLabels.has(point.label!))
  const navigableMilestones = searching ? matchingMilestones : milestones
  const candidate =
    data.find((point) => point.label && point.label === hoveredMilestoneLabel) ??
    (activePoint && data.includes(activePoint) ? activePoint : null)
  const selected = searching
    ? candidate?.label && matchedLabels.has(candidate.label)
      ? candidate
      : null
    : candidate
  const energyFade = Math.min(0.96, size.height / (waveDestination?.y || size.height))

  const pointAt = (clientX: number, touch = false) => {
    const localX = clientX - (container.current?.getBoundingClientRect().left ?? 0)
    const nearestMilestone = navigableMilestones.reduce<ChartDataPoint | null>(
      (nearest, point) =>
        Math.abs(x(point) - localX) < (nearest ? Math.abs(x(nearest) - localX) : touch ? 24 : 12)
          ? point
          : nearest,
      null,
    )
    return (
      nearestMilestone ??
      data.reduce<ChartDataPoint | null>(
        (nearest, point) =>
          !nearest || Math.abs(x(point) - localX) < Math.abs(x(nearest) - localX) ? point : nearest,
        null,
      )
    )
  }

  const select = (point: ChartDataPoint | null) => {
    setActivePoint(point)
    onPointHover?.(point)
  }
  const activate = (
    point: ChartDataPoint | null,
    clientX: number,
    clientY: number,
    keyboard = false,
  ) => {
    if (!point?.label || dragged.current || (searching && !matchedLabels.has(point.label))) return
    const now = Date.now()
    if (
      shouldPreviewMilestone(
        point.timestamp,
        armedMilestone.current,
        now,
        touchInput.current,
        keyboard,
      )
    ) {
      armedMilestone.current = { timestamp: point.timestamp, tappedAt: now }
      select(point)
      return
    }
    armedMilestone.current = null
    onPointClick?.(point, { x: clientX, y: clientY })
  }
  const handlePointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (
      pointerStart.current &&
      Math.hypot(event.clientX - pointerStart.current.x, event.clientY - pointerStart.current.y) > 8
    )
      dragged.current = true
    select(pointAt(event.clientX, event.pointerType === 'touch'))
  }

  return (
    <figure
      className="m-0"
      aria-label="Illustrative career timeline"
      onBlur={(event) => {
        // During search, retain the preview while focus moves past the range
        // selector to the shared timeline row's Visit control.
        if (!searching && !event.currentTarget.contains(event.relatedTarget)) select(null)
      }}
    >
      <div
        ref={container}
        className="w-full h-64 md:h-72 relative"
        style={{ touchAction: 'pan-y' }}
      >
        <svg
          viewBox={`0 0 ${size.width} ${size.height}`}
          width="100%"
          height="100%"
          role="group"
          aria-label="Career milestones. Focus a milestone and press Enter to explore it."
          aria-describedby={searching ? 'timeline-search-controls' : undefined}
          onPointerDown={(event) => {
            touchInput.current = event.pointerType === 'touch'
            pointerStart.current = { x: event.clientX, y: event.clientY }
            dragged.current = false
          }}
          onPointerMove={handlePointerMove}
          onPointerUp={() => {
            pointerStart.current = null
            onScrubEnd?.()
          }}
          onPointerCancel={() => {
            pointerStart.current = null
            dragged.current = true
            select(null)
          }}
          onPointerLeave={(event) => {
            if (!searching && event.pointerType !== 'touch') select(null)
            pointerStart.current = null
          }}
          onClick={(event) =>
            activate(pointAt(event.clientX, touchInput.current), event.clientX, event.clientY)
          }
          className={`overflow-visible ${selected?.label ? 'cursor-pointer' : ''}`}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.24" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id={`${gradientId}-energy`}
              gradientUnits="userSpaceOnUse"
              x1="0"
              x2="0"
              y1="0"
              y2={waveDestination?.y || size.height}
            >
              <stop offset="0" stopColor="#c9a227" stopOpacity="0.95" />
              <stop offset={energyFade} stopColor="#c9a227" stopOpacity="0.7" />
              <stop offset={Math.min(1, energyFade + 0.04)} stopColor="#c9a227" stopOpacity="0.2" />
              <stop offset="1" stopColor="#c9a227" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          {data.length > 0 && (
            <>
              <polygon
                points={`${padding},${size.height} ${points} ${size.width - padding},${size.height}`}
                fill={`url(#${gradientId})`}
              />
              <polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth="1.8"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </>
          )}
          {selected && (
            <g pointerEvents="none">
              <line
                x1={x(selected)}
                x2={x(selected)}
                y1="8"
                y2={size.height - padding}
                stroke={searching ? '#c9a227' : color}
                strokeOpacity="0.7"
                strokeWidth="1"
              />
              {!selected.label && (
                <circle
                  cx={x(selected)}
                  cy={y(selected)}
                  r="4.5"
                  fill={color}
                  stroke="#000"
                  strokeWidth="1.5"
                />
              )}
              {selected.label && !touchInput.current && !searching && (
                <g
                  transform={`translate(${Math.max(6, Math.min(size.width - 52, x(selected) - 23))},${y(selected) < 45 ? y(selected) + 16 : y(selected) - 34})`}
                >
                  <rect width="46" height="20" rx="10" fill="#c9a227" />
                  <text
                    x="23"
                    y="13.5"
                    textAnchor="middle"
                    fill="#000"
                    fontSize="10"
                    fontWeight="700"
                  >
                    VISIT
                  </text>
                </g>
              )}
            </g>
          )}
          {searching && (
            <g pointerEvents="none" key={`search-guides-${submissionId}`}>
              {matchingMilestones.map((point, index) => (
                <g key={point.timestamp}>
                  <line
                    className="timeline-search-guide"
                    x1={x(point)}
                    x2={x(point)}
                    y1="8"
                    y2={size.height - padding}
                    stroke="#c9a227"
                    strokeOpacity="0.25"
                    strokeWidth="1"
                    strokeDasharray="2 5"
                  />
                  {!!submissionId && presenting && (
                    <path
                      className="timeline-search-beam"
                      d={searchEnergyPath(
                        { x: x(point), y: y(point) },
                        waveDestination || {
                          x: x(point),
                          y: size.height - padding,
                          entryY: size.height - padding,
                        },
                      )}
                      fill="none"
                      stroke={`url(#${gradientId}-energy)`}
                      strokeWidth="2"
                      strokeLinecap="round"
                      pathLength="1"
                      // Keep the repeat beyond the entire path and offset sweep,
                      // so only one pulse can enter or leave this guide.
                      strokeDasharray="0.16 2"
                      style={{ animationDelay: `${index * 40}ms` }}
                    />
                  )}
                </g>
              ))}
            </g>
          )}
          {milestones.map((point) => {
            const highlighted = selected === point
            const matched = searching && matchedLabels.has(point.label!)
            const muted = searching && !matched
            return (
              <g
                key={point.timestamp}
                transform={`translate(${x(point)},${y(point)})`}
                role={muted ? undefined : 'button'}
                tabIndex={muted ? -1 : 0}
                aria-hidden={muted || undefined}
                aria-label={`${point.label}, ${point.time}. Explore milestone.`}
                onFocus={() => select(point)}
                onClick={(event) => {
                  event.stopPropagation()
                  activate(point, event.clientX, event.clientY)
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    dragged.current = false
                    const rect = event.currentTarget.getBoundingClientRect()
                    activate(point, rect.x + rect.width / 2, rect.y + rect.height / 2, true)
                  }
                }}
                className={`milestone-dot ${muted ? 'pointer-events-none' : 'cursor-pointer'}`}
                opacity={muted ? 0.2 : 1}
              >
                <circle r="16" fill="transparent" />
                <circle
                  className="milestone-dot-core"
                  r={highlighted ? 6 : matched ? 5 : 4}
                  fill={highlighted || matched ? '#c9a227' : color}
                  stroke="#000"
                  strokeWidth="1.5"
                />
                {(highlighted || matched) && (
                  <circle
                    r={highlighted ? 11 : 9}
                    fill="none"
                    stroke="#c9a227"
                    strokeOpacity={highlighted ? 0.35 : 0.22}
                    strokeWidth={highlighted ? 4 : 2}
                    pointerEvents="none"
                  />
                )}
              </g>
            )
          })}
        </svg>
        {selected && (
          <div
            aria-hidden="true"
            className="absolute top-0 text-xs text-gray-300 bg-black/85 px-2 py-1 rounded pointer-events-none"
            style={{ left: Math.max(8, Math.min(size.width - 125, x(selected) - 50)) }}
          >
            {selected.time}
          </div>
        )}
      </div>
      <figcaption className="sr-only">
        An illustrative stock-style chart of career growth. Price movement is decorative; labeled
        milestones link to projects, education, and experience.
      </figcaption>
    </figure>
  )
}
