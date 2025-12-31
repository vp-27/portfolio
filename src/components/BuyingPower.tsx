import { MousePointerClick } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function BuyingPower() {
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
    <div className="py-3 border-b border-[#2D2D2D]">
      <motion.div
        initial={hasSeenTimelineHint ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full flex items-center justify-between py-2 px-2"
      >
        <div className="flex items-center gap-2">
          <span className="text-white text-sm">Timeline</span>
          <MousePointerClick className="w-4 h-4 text-gray-500" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white font-medium text-sm">Tap milestones to explore</span>
        </div>
      </motion.div>
    </div>
  )
}
