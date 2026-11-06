import { MousePointerClick, ArrowDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { ChartSearchPreview } from '../utils/chartSearch'

interface BuyingPowerProps {
  activeMilestone?: string | null
  onJumpToMilestone?: (label: string, origin?: { x: number; y: number }) => void
  search?: ChartSearchPreview
  onSearchSubmit?: () => void
  isSearching?: boolean
}

export default function BuyingPower({
  activeMilestone,
  onJumpToMilestone,
  search,
  onSearchSubmit,
  isSearching = false,
}: BuyingPowerProps) {
  const [hasSeenTimelineHint, setHasSeenTimelineHint] = useState(() => {
    return typeof sessionStorage !== 'undefined' && sessionStorage.getItem('bpTimelineSeen') === '1'
  })

  // Persist that we've shown the timeline hint so the entrance animation runs only once per session
  useEffect(() => {
    if (!hasSeenTimelineHint) {
      sessionStorage.setItem('bpTimelineSeen', '1')
      setHasSeenTimelineHint(true)
    }
  }, [hasSeenTimelineHint])

  if (search?.active) {
    const selected =
      activeMilestone && search.milestoneLabels.includes(activeMilestone) ? activeMilestone : null
    return (
      <div id="timeline-search-controls" className="relative py-2.5 border-b border-[#2d2d2d]">
        <div className="flex min-h-9 items-center justify-between gap-3 px-2">
          {selected ? (
            <button
              type="button"
              className="min-w-0 flex items-center gap-2 text-xs text-[#c9a227] text-left hover:text-[#e5bf45]"
              onClick={(event) => {
                const rect = event.currentTarget.getBoundingClientRect()
                onJumpToMilestone?.(selected, {
                  x: rect.x + rect.width / 2,
                  y: rect.y + rect.height / 2,
                })
              }}
              aria-label={`Visit ${selected}`}
            >
              <span className="truncate">{selected}</span>
              <span className="shrink-0 font-semibold inline-flex items-center gap-1">
                Visit <ArrowDown className="w-3 h-3" />
              </span>
            </button>
          ) : (
            <p
              className="min-w-0 flex items-center gap-2 text-sm text-white"
              title={search.milestoneLabels.length ? 'Select a gold milestone to visit' : undefined}
            >
              <span>Search results</span>
              <MousePointerClick className="w-4 h-4 shrink-0 text-[#c9a227]" aria-hidden="true" />
              {!!search.milestoneLabels.length && (
                <span className="sr-only">Select a gold milestone to visit.</span>
              )}
            </p>
          )}
          <button
            type="button"
            onClick={onSearchSubmit}
            disabled={isSearching}
            aria-label={`Search deeper: ${search.query}`}
            className="shrink-0 flex items-center gap-1.5 py-2 text-xs font-medium text-rh-green hover:text-[#16dc18] disabled:opacity-50"
          >
            {isSearching ? (
              'Searching…'
            ) : (
              <>
                Search deeper
                <span aria-hidden="true">↵</span>
              </>
            )}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      title="Illustrative chronology of career milestones; the vertical scale is symbolic."
      className="py-2.5 border-b border-[#2D2D2D]"
    >
      <motion.div
        initial={hasSeenTimelineHint ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full"
      >
        {/* Desktop View: Completely static, zero jumping/bouncing */}
        <div className="hidden md:flex w-full items-center justify-between py-1 px-2">
          <div className="flex items-center gap-2">
            <span className="text-white text-sm">Career timeline</span>
            <MousePointerClick className="w-4 h-4 text-gray-500" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white font-medium text-sm">Explore career milestones</span>
          </div>
        </div>

        {/* Mobile View: Dynamic with active milestone and tap-friendly Visit button */}
        <div className="flex md:hidden w-full items-center justify-between min-h-[36px] px-2">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <span className="text-white text-sm font-medium shrink-0">Timeline</span>
            {activeMilestone ? (
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-gray-500 text-xs shrink-0">•</span>
                <span className="text-[#C9A227] text-xs font-semibold truncate">
                  {activeMilestone}
                </span>
              </div>
            ) : (
              <MousePointerClick className="w-4 h-4 text-gray-500 shrink-0" />
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {activeMilestone ? (
              <button
                type="button"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const origin = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
                  onJumpToMilestone?.(activeMilestone, origin)
                }}
                className="flex items-center gap-1.5 px-3 py-1 bg-[#C9A227] active:bg-[#d8ae2c] active:scale-95 text-black font-bold text-xs rounded-full transition-all shadow-md shadow-[#C9A227]/20"
              >
                <span>Visit</span>
                <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            ) : (
              <span className="text-gray-400 font-medium text-xs">Explore career milestones</span>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
