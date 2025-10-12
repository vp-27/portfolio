import { useState, useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import RotatingText, { type RotatingTextRef } from './RotatingText'
import type { PortfolioData } from '../types'

interface PortfolioHeaderProps {
  portfolio: PortfolioData
  hoveredLabel?: string | null
}

export default function PortfolioHeader({ portfolio, hoveredLabel }: PortfolioHeaderProps) {
  const isPositive = portfolio.todayReturn >= 0
  const rotatingTextRef = useRef<RotatingTextRef>(null)
  const [currentText, setCurrentText] = useState<string>(
    `$${portfolio.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  )
  const [hasTransitioned, setHasTransitioned] = useState(false)

  // Initial transition from dollar amount to Timeline after 2 seconds
  useEffect(() => {
    if (!hasTransitioned) {
      const timer = setTimeout(() => {
        setCurrentText("Vandan's Timeline")
        setHasTransitioned(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [hasTransitioned])

  // Update text when hoveredLabel changes (only if we've already transitioned to Timeline)
  useEffect(() => {
    if (hasTransitioned) {
      if (hoveredLabel) {
        setCurrentText(hoveredLabel)
      } else {
        setCurrentText("Vandan's Timeline")
      }
    }
  }, [hoveredLabel, hasTransitioned])

  return (
    <div className="pt-4 pb-2 px-4 md:px-0">
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

      {/* Portfolio Value - Rotating Text Animation */}
      <div className="mb-2">
        <RotatingText
          ref={rotatingTextRef}
          texts={[currentText]}
          mainClassName="text-3xl font-normal text-left"
          splitLevelClassName="overflow-hidden"
          staggerFrom="first"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          staggerDuration={0.015}
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
          rotationInterval={2500}
          auto={false}
        />
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
