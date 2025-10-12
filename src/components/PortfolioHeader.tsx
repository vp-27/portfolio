import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import type { PortfolioData } from '../types'

interface PortfolioHeaderProps {
  portfolio: PortfolioData
}

export default function PortfolioHeader({ portfolio }: PortfolioHeaderProps) {
  const isPositive = portfolio.todayReturn >= 0
  const [showTimeline, setShowTimeline] = useState(false)

  useEffect(() => {
    // Show the dollar amount first, then transition to Timeline after 2 seconds
    const timer = setTimeout(() => {
      setShowTimeline(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="px-4 pt-4 pb-2">
      {/* Account Type and Earn Button */}
      <div className="flex items-center justify-between mb-4">
        <button className="flex items-center gap-1 bg-transparent text-white hover:text-gray-300 transition-colors">
          <span className="text-sm">Individual</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        <button className="px-3 py-1.5 bg-[#C4F000] text-black rounded-full text-xs font-medium hover:bg-[#b3e000] transition-colors">
          Earn $5
        </button>
      </div>

      {/* Portfolio Value - Changed to Timeline with animation */}
      <div className="mb-2">
        <h1 className="text-3xl font-normal text-left transition-all duration-500">
          {showTimeline ? (
            'Timeline'
          ) : (
            `$${portfolio.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          )}
        </h1>
      </div>

      {/* Today's Return - Career Momentum */}
      <div className={`flex items-center gap-2 text-sm ${isPositive ? 'text-[#00C805]' : 'text-[#FF5000]'}`}>
        <span className="flex items-center">
          <span className="mr-1">{isPositive ? '▲' : '▼'}</span>
          {Math.abs(portfolio.todayReturnPercent).toFixed(2)}% Growth
        </span>
        <span className="text-gray-400">Recent</span>
      </div>

      {/* Total Career Growth */}
      <div className="flex items-center gap-2 text-sm mt-0.5 text-[#00C805]">
        <span className="flex items-center">
          <span className="mr-1">▲</span>
          {portfolio.totalReturnPercent.toFixed(2)}% Overall
        </span>
        <span className="text-gray-400">Career Growth</span>
      </div>
    </div>
  )
}
