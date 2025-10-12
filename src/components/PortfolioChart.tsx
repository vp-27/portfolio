import { Area, AreaChart, ResponsiveContainer, YAxis, Tooltip } from 'recharts'
import type { ChartDataPoint } from '../types'

interface PortfolioChartProps {
  data: ChartDataPoint[]
  isPositive: boolean
  onPointClick?: (point: ChartDataPoint) => void
}

export default function PortfolioChart({ data, isPositive, onPointClick }: PortfolioChartProps) {
  const strokeColor = isPositive ? '#00C805' : '#FF5000'

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload
      if (point.label) {
        return (
          <div className="bg-[#1A1A1A] border border-[#2D2D2D] rounded px-3 py-2">
            <p className="text-white text-sm font-medium">{point.label}</p>
            <p className="text-gray-400 text-xs">{point.time}</p>
          </div>
        )
      }
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
    <div className="w-full h-48 md:h-64 cursor-pointer">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart 
          data={data} 
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          onClick={handleClick}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis domain={['dataMin', 'dataMax']} hide />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: strokeColor, strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={strokeColor}
            strokeWidth={2}
            fill="url(#colorValue)"
            animationDuration={500}
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
