import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import AlphabetReelText from './AlphabetReelText'
import type { ChartDataPoint } from '../types'
import type { ChartSearchPreview } from '../utils/chartSearch'
import { X } from 'lucide-react'

interface PortfolioHeaderProps {
  hoveredPoint?: ChartDataPoint | null
  search?: ChartSearchPreview
  onClearSearch?: () => void
}

export default function PortfolioHeader({
  hoveredPoint,
  search,
  onClearSearch,
}: PortfolioHeaderProps) {
  const reducedMotion = useReducedMotion()
  const [lastMilestone, setLastMilestone] = useState<ChartDataPoint | null>(null)
  const [settledTitle, setSettledTitle] = useState(search?.title || '')
  useEffect(() => {
    if (!search?.active) {
      setSettledTitle('')
      return
    }
    const timer = window.setTimeout(() => setSettledTitle(search.title), 220)
    return () => window.clearTimeout(timer)
  }, [search?.active, search?.title])
  // Unlabeled chart points keep the last milestone's heading. A null point
  // ends the hover session, so leaving or changing ranges clears it immediately.
  const milestone = hoveredPoint?.label ? hoveredPoint : hoveredPoint ? lastMilestone : null
  if (milestone !== lastMilestone) setLastMilestone(milestone)
  const searching = search?.active
  const currentText =
    searching && settledTitle ? settledTitle : milestone?.label || "Vandan's Timeline"

  return (
    <div className="pt-4 pb-2 px-4 md:px-0">
      <div className="flex items-start gap-3">
        <h1
          aria-label={currentText}
          className={`flex-1 min-w-0 mb-2 min-h-9 font-normal ${searching && search.query.length > 22 ? 'text-[clamp(1.125rem,5.2vw,1.5rem)]' : 'overflow-hidden text-[clamp(1.65rem,7.7vw,1.875rem)]'}`}
        >
          {reducedMotion ? currentText : <AlphabetReelText text={currentText} wrap={searching} />}
        </h1>
        {searching && (
          <button
            type="button"
            onClick={onClearSearch}
            aria-label="Clear timeline search"
            className="timeline-search-clear shrink-0 p-2 -mr-1 text-gray-400 hover:text-white md:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {searching ? (
        <div className="min-h-5 text-sm leading-5" aria-live="polite">
          <p className="flex items-center gap-2 text-[#c9a227]">
            <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" aria-hidden="true" />
            {search.summary}
          </p>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  )
}
