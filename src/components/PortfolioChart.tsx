import { Area, AreaChart, ResponsiveContainer, YAxis, Tooltip } from 'recharts'
import { useRef, useCallback, useEffect, useState } from 'react'
import type { ChartDataPoint } from '../types'

interface PortfolioChartProps {
  data: ChartDataPoint[]
  isPositive: boolean
  onPointClick?: (point: ChartDataPoint) => void
  onPointHover?: (point: ChartDataPoint | null) => void
  onScrubEnd?: () => void
}

export default function PortfolioChart({ data, isPositive, onPointClick, onPointHover, onScrubEnd }: PortfolioChartProps) {
  const strokeColor = isPositive ? '#00C805' : '#FF5000'
  const chartRef = useRef<HTMLDivElement>(null)
  const [snappedIndex, setSnappedIndex] = useState<number | null>(null)
  const [armedMilestoneIndex, setArmedMilestoneIndex] = useState<number | null>(null)
  const touchTapTimeRef = useRef(0)
  const armResetTimerRef = useRef<number | null>(null)

  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)

  // Snap threshold - distance in pixels to trigger snapping
  // Use larger threshold on touch devices for better UX
  const snapThreshold = typeof window !== 'undefined' && 'ontouchstart' in window ? 20 : 10

  // Find the nearest milestone within snap threshold
  const findNearestMilestone = useCallback((event: any, chartData: any): ChartDataPoint | null => {
    if (!event || !chartData || !chartData.chartX || !chartData.chartY) {
      return null
    }

    const { chartX } = chartData
    const milestones = data.filter(point => point.label)

    if (milestones.length === 0) return null

    let nearestPoint = null
    let minDistance = snapThreshold

    // Calculate distances to all milestone points
    milestones.forEach((milestone) => {
      // Approximate the x position based on data distribution
      const dataIndex = data.findIndex(p => p === milestone)
      const chartWidth = chartRef.current?.offsetWidth || 1
      const xPosition = (dataIndex / (data.length - 1)) * chartWidth

      // Simple distance calculation (primarily horizontal for timeline)
      const distance = Math.abs(chartX - xPosition)

      if (distance < minDistance) {
        minDistance = distance
        nearestPoint = milestone
      }
    })

    return nearestPoint
  }, [data, snapThreshold])

  const handleMouseMove = (chartData: any, event: any) => {
    if (chartData && chartData.activePayload && chartData.activePayload.length > 0) {
      const activePoint = chartData.activePayload[0].payload

      // Check if we should snap to a nearby milestone
      const nearestMilestone = findNearestMilestone(event, chartData)

      if (nearestMilestone && onPointHover) {
        // Snap to the nearest milestone instead of the current point
        onPointHover(nearestMilestone)
        // Update snapped index for cursor positioning
        const milestoneIndex = data.findIndex(p => p === nearestMilestone)
        setSnappedIndex(milestoneIndex)
      } else if (activePoint.label && onPointHover) {
        // Use the active point if it has a label
        onPointHover(activePoint)
        const pointIndex = data.findIndex(p => p === activePoint)
        setSnappedIndex(pointIndex)
      } else {
        if (onPointHover) {
          onPointHover(activePoint)
        }
        setSnappedIndex(null)
      }
    }
  }

  const handleMouseLeave = () => {
    if (onPointHover) {
      onPointHover(null)
    }
    setSnappedIndex(null)
  }

  useEffect(() => {
    return () => {
      if (armResetTimerRef.current !== null) {
        window.clearTimeout(armResetTimerRef.current)
      }
    }
  }, [])

  const handleInteractionEnd = () => {
    if (onScrubEnd) {
      onScrubEnd()
    }
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload
      return (
        <div className="bg-transparent">
          <p className="text-white text-xs font-medium">{point.time}</p>
        </div>
      )
    }
    return null
  }

  // Custom cursor that snaps to milestone positions
  const CustomCursor = (props: any) => {
    const { points, height } = props

    // Always render the cursor when hovering
    if (!points || points.length === 0) return null

    let xPosition = points[0].x // Default to mouse position

    // If we have a snapped index, override with the snapped position
    if (snappedIndex !== null) {
      const totalPoints = data.length
      const chartWidth = chartRef.current?.offsetWidth || 1

      // Calculate x position based on the snapped index
      // Account for chart margins
      const marginLeft = 10
      const marginRight = 10
      const availableWidth = chartWidth - marginLeft - marginRight
      xPosition = marginLeft + (snappedIndex / (totalPoints - 1)) * availableWidth
    }

    return (
      <line
        x1={xPosition}
        y1={0}
        x2={xPosition}
        y2={height}
        stroke={strokeColor}
        strokeWidth={1}
        strokeDasharray="none"
      />
    )
  }

  const CustomDot = (props: any) => {
    const { cx, cy, payload, index } = props
    // Only show dots for points with labels (milestones)
    if (payload.label) {
      // Highlight when this dot is the currently hovered/snapped milestone
      const isHovered = snappedIndex === index
      const isArmed = armedMilestoneIndex === index
      const dotColor = isArmed || isHovered ? '#C9A227' : strokeColor
      const dotRadius = isArmed ? 11 : isHovered ? 6 : 4
      const strokeWidth = isArmed ? 3 : isHovered ? 2 : 1.5
      return (
        <circle
          cx={cx}
          cy={cy}
          r={dotRadius}
          fill={dotColor}
          stroke="#000"
          strokeWidth={strokeWidth}
          className="cursor-pointer hover:r-6 transition-all duration-150"
        />
      )
    }
    return null
  }

  const handleClick = (chartData: any, event: any) => {
    if (chartData && chartData.activePayload && chartData.activePayload.length > 0) {
      const activePoint = chartData.activePayload[0].payload

      // Apply same snapping logic for clicks
      const nearestMilestone = findNearestMilestone(event, chartData)

      const selectedPoint = nearestMilestone ?? (activePoint.label ? activePoint : null)
      if (!selectedPoint || !onPointClick) {
        return
      }

      const selectedIndex = data.findIndex((point) => point.time === selectedPoint.time && point.value === selectedPoint.value)
      if (selectedIndex < 0) {
        return
      }

      if (!isTouchDevice) {
        onPointClick(selectedPoint)
        return
      }

      const now = Date.now()
      const isSecondTapSameMilestone = armedMilestoneIndex === selectedIndex && (now - touchTapTimeRef.current) < 900

      if (isSecondTapSameMilestone) {
        setArmedMilestoneIndex(null)
        touchTapTimeRef.current = 0
        if (armResetTimerRef.current !== null) {
          window.clearTimeout(armResetTimerRef.current)
          armResetTimerRef.current = null
        }
        onPointClick(selectedPoint)
        return
      }

      setArmedMilestoneIndex(selectedIndex)
      setSnappedIndex(selectedIndex)
      if (onPointHover) {
        onPointHover(selectedPoint)
      }
      touchTapTimeRef.current = now

      if (armResetTimerRef.current !== null) {
        window.clearTimeout(armResetTimerRef.current)
      }
      armResetTimerRef.current = window.setTimeout(() => {
        setArmedMilestoneIndex((current) => (current === selectedIndex ? null : current))
      }, 1200)
    }
  }

  const handleTouchStart = () => {
    if (armResetTimerRef.current !== null) {
      window.clearTimeout(armResetTimerRef.current)
      armResetTimerRef.current = null
    }
  }

  const handleTouchEnd = () => {
    if (!isTouchDevice) {
      handleInteractionEnd()
    }
  }

  return (
    <div
      ref={chartRef}
      className="w-full h-64 md:h-64 cursor-pointer"
      style={{ touchAction: 'pan-y' }}
      onMouseUp={handleInteractionEnd}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
          onClick={handleClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis domain={['dataMin', 'dataMax']} hide />
          <Tooltip
            content={<CustomTooltip />}
            cursor={<CustomCursor />}
            position={{ y: 0 }}
            offset={10}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={strokeColor}
            strokeWidth={2}
            fill="url(#colorValue)"
            animationDuration={0}
            isAnimationActive={false}
            dot={<CustomDot />}
            activeDot={(props: any) => {
              // Gold when hovering over a milestone, otherwise green
              const isHovered = snappedIndex !== null && props.payload.label
              const isArmed = armedMilestoneIndex !== null && props.payload.label
              const dotColor = isHovered ? '#C9A227' : strokeColor

              // Hide active dot when we're snapped to a milestone
              // This prevents showing two dots (one at mouse, one at milestone)
              const opacity = snappedIndex !== null || isArmed ? 0 : 1

              return (
                <circle
                  cx={props.cx}
                  cy={props.cy}
                  r={6}
                  fill={dotColor}
                  stroke="#000"
                  strokeWidth={2}
                  opacity={opacity}
                />
              )
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
