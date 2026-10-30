import { useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import AlphabetReelText from './AlphabetReelText'
import type { ChartDataPoint } from '../types'

interface PortfolioHeaderProps {
  hoveredPoint?: ChartDataPoint | null
}

export default function PortfolioHeader({ hoveredPoint }: PortfolioHeaderProps) {
  const reducedMotion = useReducedMotion()
  const [lastMilestone, setLastMilestone] = useState<ChartDataPoint | null>(null)
  // Unlabeled chart points keep the last milestone's heading. A null point
  // ends the hover session, so leaving or changing ranges clears it immediately.
  const milestone = hoveredPoint?.label ? hoveredPoint : hoveredPoint ? lastMilestone : null
  if (milestone !== lastMilestone) setLastMilestone(milestone)
  const currentText = milestone?.label || "Vandan's Timeline"

  return (
    <div className="pt-4 pb-2 px-4 md:px-0">
      <h1
        aria-label={currentText}
        className="mb-2 min-h-9 overflow-hidden text-[clamp(1.65rem,7.7vw,1.875rem)] font-normal"
      >
        {reducedMotion ? (
          currentText
        ) : (
          <AlphabetReelText text={currentText} />
        )}
      </h1>

      {/* Category Descriptor */}
      <div className="flex items-center gap-2 text-sm text-rh-green">
        <span className="flex items-center">
          <span className="mr-1">▲</span>
          {milestone?.category || 'Projects Growth'}
        </span>
      </div>

      {/* Time Descriptor */}
      <div className="flex items-center gap-2 text-sm mt-0.5 text-[#00C805]">
        <span className="flex items-center">
          <span className="mr-1">▲</span>
          {hoveredPoint ? hoveredPoint.time : 'Career Growth'}
        </span>
      </div>
    </div>
  )
}
