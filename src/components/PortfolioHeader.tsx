import { ChevronDown } from 'lucide-react'
import type { PortfolioData } from '../types'

interface PortfolioHeaderProps {
  portfolio: PortfolioData
}

export default function PortfolioHeader({ portfolio }: PortfolioHeaderProps) {
  const isPositive = portfolio.todayReturn >= 0
  const overnightReturn = -10.86
  const overnightPercent = 0.31

  return (
    <div className="px-4 pt-4 pb-2">
      {/* Account Type and Earn Button */}
      <div className="flex items-center justify-between mb-4">
        <button className="flex items-center gap-1 text-white hover:text-gray-300 transition-colors">
          <span className="text-sm">Individual</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        <button className="px-3 py-1.5 bg-[#C4F000] text-black rounded-full text-xs font-medium hover:bg-[#b3e000] transition-colors">
          Earn $5
        </button>
      </div>

      {/* Portfolio Value */}
      <div className="mb-2">
        <h1 className="text-3xl font-normal">
          ${portfolio.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h1>
      </div>

      {/* Today's Return */}
      <div className={`flex items-center gap-2 text-sm ${isPositive ? 'text-[#00C805]' : 'text-[#FF5000]'}`}>
        <span className="flex items-center">
          <span className="mr-1">{isPositive ? '▲' : '▼'}</span>
          ${Math.abs(portfolio.todayReturn).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <span>
          ({isPositive ? '' : ''}{portfolio.todayReturnPercent.toFixed(2)}%)
        </span>
        <span className="text-gray-400">Today</span>
      </div>

      {/* Overnight Return */}
      <div className={`flex items-center gap-2 text-sm mt-0.5 ${overnightReturn >= 0 ? 'text-[#00C805]' : 'text-[#FF5000]'}`}>
        <span className="flex items-center">
          <span className="mr-1">{overnightReturn >= 0 ? '▲' : '▼'}</span>
          ${Math.abs(overnightReturn).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <span>
          ({overnightPercent.toFixed(2)}%)
        </span>
        <span className="text-gray-400">Overnight</span>
      </div>
    </div>
  )
}
