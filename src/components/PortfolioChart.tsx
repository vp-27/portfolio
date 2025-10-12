import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts'
import type { ChartDataPoint } from '../types'

interface PortfolioChartProps {
  data: ChartDataPoint[]
  isPositive: boolean
}

export default function PortfolioChart({ data, isPositive }: PortfolioChartProps) {
  const strokeColor = isPositive ? '#00C805' : '#FF5000'
  const fillColor = isPositive ? 'rgba(0, 200, 5, 0.1)' : 'rgba(255, 80, 0, 0.1)'

  return (
    <div className="w-full h-48 md:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis domain={['dataMin', 'dataMax']} hide />
          <Area
            type="monotone"
            dataKey="value"
            stroke={strokeColor}
            strokeWidth={2}
            fill="url(#colorValue)"
            animationDuration={300}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
