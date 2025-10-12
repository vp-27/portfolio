import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Calendar, ChevronDown } from 'lucide-react'
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
        bg-[#1C1C1C] rounded-lg overflow-hidden cursor-pointer
        transition-all duration-300 ease-out
        border border-transparent
        hover:border-gray-700 hover:bg-[#232323]
        ${isHighlighted ? 'ring-2 ring-[#00C805]' : ''}
      `}
    >
      {/* Collapsed Header - Always Visible */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-white text-base">{experience.position}</h3>
              {isCurrent && (
                <span className="px-2 py-0.5 text-[10px] font-medium bg-[#00C805] text-black rounded">
                  ACTIVE
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400">{experience.company}</p>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-gray-500 ml-2"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </div>
        
        {/* Metadata Row */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{experience.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{experience.startDate} – {experience.endDate}</span>
          </div>
        </div>

        {/* Subtle expansion hint line */}
        {!isExpanded && (
          <div className="mt-3 pt-3 border-t border-gray-800">
            <p className="text-xs text-gray-600">Tap to view details</p>
          </div>
        )}
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 border-t border-gray-800">
              <div className="space-y-3">
                {experience.bullets.map((bullet, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex gap-3 text-sm text-gray-300 leading-relaxed"
                  >
                    <span className="text-[#00C805] mt-1 flex-shrink-0">▸</span>
                    <span>{bullet}</span>
                  </motion.div>
                ))}
              </div>
              
              {/* Bottom action hint */}
              <div className="mt-4 pt-3 border-t border-gray-800">
                <p className="text-xs text-gray-600">Tap to collapse</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
