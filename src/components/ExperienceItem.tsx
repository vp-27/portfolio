import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, ChevronRight } from 'lucide-react'
import type { Experience } from '../types'

interface ExperienceItemProps {
  experience: Experience
  isHighlighted?: boolean
  isLast?: boolean
}

export default function ExperienceItem({ experience, isHighlighted, isLast = false }: ExperienceItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Determine if this is a current position
  const isCurrent = experience.endDate.toLowerCase() === 'present'

  return (
    <motion.div
      layout
      onClick={() => setIsExpanded(!isExpanded)}
      className={`
        bg-transparent overflow-hidden cursor-pointer
        transition-all duration-200 ease-out
        hover:bg-[#0D0D0D]
        ${!isLast ? 'border-b border-[#1E1E1E] lg:border-[#222]' : ''}
        ${isHighlighted ? 'bg-[#00C805]/10' : ''}
      `}
    >
      {/* Collapsed Header - Always Visible */}
      <div className="px-4 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Company Name - Most Prominent */}
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-semibold text-white text-base">{experience.company}</h3>
              {isCurrent && (
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#00C805] text-black rounded-sm flex-shrink-0">
                  ACTIVE
                </span>
              )}
            </div>
            {/* Position - Secondary, Left-aligned */}
            <p className="text-sm text-gray-400 text-left">{experience.position}</p>
          </div>
          
          {/* Date Range - Right Aligned */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="text-right">
              <p className="text-xs text-gray-400 whitespace-nowrap">
                {experience.startDate} – {experience.endDate}
              </p>
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-gray-500"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0.0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0">
              {/* Location info - Using Robinhood Red */}
              <div className="flex items-center gap-1.5 text-xs mb-3">
                <MapPin className="w-3.5 h-3.5 text-[#FF5000]" />
                <span className="text-[#FF5000]">{experience.location}</span>
              </div>
              
              <div className="space-y-2.5">
                {experience.bullets.map((bullet, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="flex gap-3 text-sm text-gray-300 leading-relaxed"
                  >
                    <span className="text-[#00C805] mt-0.5 flex-shrink-0 text-xs">▸</span>
                    <span>{bullet}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
