import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Calendar, ChevronRight } from 'lucide-react'
import type { Experience } from '../types'

interface ExperienceItemProps {
  experience: Experience
  isHighlighted?: boolean
}

export default function ExperienceItem({ experience, isHighlighted }: ExperienceItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Determine if this is a current position
  const isCurrent = experience.endDate.toLowerCase() === 'present'

  return (
    <motion.div
      layout
      onClick={() => setIsExpanded(!isExpanded)}
      className={`
        bg-transparent rounded-lg overflow-hidden cursor-pointer
        transition-all duration-300 ease-out
        border border-gray-800
        hover:border-gray-600 hover:bg-[#0A0A0A]
        ${isHighlighted ? 'ring-1 ring-[#00C805] border-[#00C805]' : ''}
      `}
    >
      {/* Collapsed Header - Always Visible */}
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="font-semibold text-white text-base truncate">{experience.position}</h3>
              {isCurrent && (
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#00C805] text-black rounded-sm flex-shrink-0">
                  ACTIVE
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400 mb-3">{experience.company}</p>
            
            {/* Metadata Row */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{experience.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{experience.startDate} – {experience.endDate}</span>
              </div>
            </div>
          </div>
          
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-gray-500 ml-4 flex-shrink-0"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.div>
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
            <div className="px-5 pb-5 pt-2 border-t border-gray-800">
              <div className="space-y-3.5 mt-4">
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
