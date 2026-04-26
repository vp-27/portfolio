import { useState, useEffect, useRef } from 'react'
import RotatingText, { type RotatingTextRef } from './RotatingText'
import type { PortfolioData, ChartDataPoint } from '../types'

interface PortfolioHeaderProps {
  portfolio: PortfolioData
  hoveredPoint?: ChartDataPoint | null
}

export default function PortfolioHeader({ portfolio, hoveredPoint }: PortfolioHeaderProps) {
  const isPositive = portfolio.todayReturn >= 0
  const rotatingTextRef = useRef<RotatingTextRef>(null)
  const [currentText, setCurrentText] = useState<string>("Vandan's Timeline")

  // Update text when hoveredPoint changes
  useEffect(() => {
    if (hoveredPoint?.label) {
      setCurrentText(hoveredPoint.label)
    } else {
      setCurrentText("Vandan's Timeline")
    }
  }, [hoveredPoint])

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

      {/* Category Descriptor */}
      <div className={`flex items-center gap-2 text-sm ${isPositive ? 'text-[#00C805]' : 'text-[#FF5000]'}`}>
        <span className="flex items-center">
          <span className="mr-1">{isPositive ? '▲' : '▼'}</span>
          {hoveredPoint?.category || "Projects Growth"}
        </span>
      </div>

      {/* Time Descriptor */}
      <div className="flex items-center gap-2 text-sm mt-0.5 text-[#00C805]">
        <span className="flex items-center">
          <span className="mr-1">▲</span>
          {hoveredPoint ? hoveredPoint.time : "Career Growth"}
        </span>
      </div>
    </div>
  )
}
