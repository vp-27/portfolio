import { MousePointerClick, ArrowDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface BuyingPowerProps {
  activeMilestone?: string | null
  onJumpToMilestone?: (label: string, origin?: { x: number; y: number }) => void
}

export default function BuyingPower({ activeMilestone, onJumpToMilestone }: BuyingPowerProps) {
  const [hasSeenTimelineHint, setHasSeenTimelineHint] = useState(() => {
    return sessionStorage.getItem('bpTimelineSeen') === '1'
  })

  // Persist that we've shown the timeline hint so the entrance animation runs only once per session
  useEffect(() => {
    if (!hasSeenTimelineHint) {
      sessionStorage.setItem('bpTimelineSeen', '1')
      setHasSeenTimelineHint(true)
    }
  }, [hasSeenTimelineHint])

  return (
    <div className="py-2.5 border-b border-[#2D2D2D]">
      <motion.div
        initial={hasSeenTimelineHint ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full"
      >
        {/* Desktop View: Completely static, zero jumping/bouncing */}
        <div className="hidden md:flex w-full items-center justify-between py-1 px-2">
          <div className="flex items-center gap-2">
            <span className="text-white text-sm">Timeline</span>
            <MousePointerClick className="w-4 h-4 text-gray-500" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white font-medium text-sm">Tap milestones to explore</span>
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
                  onJumpToMilestone && onJumpToMilestone(activeMilestone, origin)
                }}
                className="flex items-center gap-1.5 px-3 py-1 bg-[#C9A227] active:bg-[#d8ae2c] active:scale-95 text-black font-bold text-xs rounded-full transition-all shadow-md shadow-[#C9A227]/20"
              >
                <span>Visit</span>
                <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            ) : (
              <span className="text-gray-400 font-medium text-xs">
                Tap milestones to explore
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}


