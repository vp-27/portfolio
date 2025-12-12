import { useState, useEffect, useRef } from 'react'
import RotatingText, { type RotatingTextRef } from './RotatingText'
import type { PortfolioData } from '../types'

interface PortfolioHeaderProps {
  portfolio: PortfolioData
  hoveredLabel?: string | null
  activeLabel?: string | null
}

export default function PortfolioHeader({ portfolio, hoveredLabel, activeLabel }: PortfolioHeaderProps) {
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
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [hasTransitioned])

  // Update text when hoveredLabel or activeLabel changes (only if we've already transitioned to Timeline)
  // Priority: hoveredLabel > activeLabel > default
  useEffect(() => {
    if (hasTransitioned) {
      if (hoveredLabel) {
        setCurrentText(hoveredLabel)
      } else if (activeLabel) {
        setCurrentText(activeLabel)
      } else {
        setCurrentText("Vandan's Timeline")
      }
    }
  }, [hoveredLabel, activeLabel, hasTransitioned])

  return (
    <div className="pt-4 pb-2 px-4 md:px-0">
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
          staggerDuration={0.005}
          transition={{ type: "spring", damping: 40, stiffness: 500 }}
          rotationInterval={500}
          auto={false}
        />
      </div>

      {/* Projects Growth */}
      <div className={`flex items-center gap-2 text-sm ${isPositive ? 'text-[#00C805]' : 'text-[#FF5000]'}`}>
        <span className="flex items-center">
          <span className="mr-1">{isPositive ? '▲' : '▼'}</span>
          Projects Growth
        </span>
      </div>

      {/* Career Growth */}
      <div className="flex items-center gap-2 text-sm mt-0.5 text-[#00C805]">
        <span className="flex items-center">
          <span className="mr-1">▲</span>
          Career Growth
        </span>
      </div>
    </div>
  )
}
