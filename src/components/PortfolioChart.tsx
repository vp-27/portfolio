import { Area, AreaChart, ResponsiveContainer, YAxis, Tooltip } from 'recharts'
import type { ChartDataPoint } from '../types'

interface PortfolioChartProps {
  data: ChartDataPoint[]
  isPositive: boolean
  onPointClick?: (point: ChartDataPoint) => void
  onPointHover?: (label: string | null) => void
  activeLabel?: string | null
}

export default function PortfolioChart({ data, isPositive, onPointClick, onPointHover, activeLabel }: PortfolioChartProps) {
  const strokeColor = isPositive ? '#00C805' : '#FF5000'

  const handleMouseMove = (data: any) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const point = data.activePayload[0].payload
      if (point.label && onPointHover) {
        onPointHover(point.label)
      }
    }
  }

  const handleMouseLeave = () => {
    if (onPointHover) {
      onPointHover(null)
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

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props
    // Only show dots for points with labels (milestones)
    if (payload.label) {
      const isActive = activeLabel === payload.label
      const dotColor = isActive ? '#E8A03D' : strokeColor
      const dotRadius = isActive ? 6 : 4
      const strokeWidth = isActive ? 2 : 1.5
      return (
        <circle
          cx={cx}
          cy={cy}
          r={dotRadius}
          fill={dotColor}
          stroke="#000"
          strokeWidth={strokeWidth}
          className="cursor-pointer hover:r-6 transition-all"
        />
      )
    }
    return null
  }

  const handleClick = (data: any) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const point = data.activePayload[0].payload
      if (point.label && onPointClick) {
        onPointClick(point)
      }
    }
  }

  return (
    <div className="w-full h-64 md:h-64 cursor-pointer">
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
            cursor={{ stroke: strokeColor, strokeWidth: 1 }} 
            position={{ y: 0 }}
            offset={10}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={strokeColor}
            strokeWidth={2}
            fill="url(#colorValue)"
            animationDuration={500}
            isAnimationActive={true}
            dot={<CustomDot />}
            activeDot={(props: any) => {
              const isActive = activeLabel === props.payload.label
              const dotColor = isActive ? '#E8A03D' : strokeColor
              return (
                <circle
                  cx={props.cx}
                  cy={props.cy}
                  r={6}
                  fill={dotColor}
                  stroke="#000"
                  strokeWidth={2}
                />
              )
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
