import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, ChevronRight, Briefcase } from 'lucide-react'
import type { Experience } from '../types'

interface ExperienceItemProps {
  experience: Experience
  isHighlighted?: boolean
  isFirst?: boolean
  isLast?: boolean
}

// Get first letter for icon fallback
const getInitials = (company: string) => {
  return company.charAt(0).toUpperCase()
}

export default function ExperienceItem({ experience, isHighlighted, isFirst = false, isLast = false }: ExperienceItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Determine if this is a current position
  const isCurrent = experience.endDate.toLowerCase() === 'present'

  return (
    <div
      className={`
        py-3 
        ${isLast ? '' : 'border-b border-[#2C2C2E]'}
        ${isHighlighted ? 'bg-[#00C805]/10 -mx-2 px-2 rounded-xl' : ''}
      `}
    >
      {/* List Row - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 md:gap-4 text-left hover:bg-[#1A1A1A] rounded-xl transition-colors p-2 -m-2 focus:outline-none"
      >
        {/* Logo or Fallback Icon */}
        {experience.logoUrl ? (
          <div className="flex-shrink-0 w-[72px] h-[72px] md:w-[80px] md:h-[80px] flex items-center justify-center">
            <img
              src={experience.logoUrl}
              alt={experience.company}
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="flex-shrink-0 w-[72px] h-[72px] md:w-[80px] md:h-[80px] rounded-xl border-2 border-[#3A3A3C] bg-[#1C1C1E] flex items-center justify-center">
            <span className="text-2xl md:text-3xl font-bold text-gray-400">
              {getInitials(experience.company)}
            </span>
          </div>
        )}

        {/* Content: Company, Position, Current badge */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-semibold text-white text-[15px] md:text-[17px] leading-tight">
              {experience.company}
            </h3>
            {isCurrent && (
              <span className="px-2 py-0.5 text-[9px] md:text-[10px] font-semibold bg-[#00C805] text-black rounded-sm flex-shrink-0">
                ACTIVE
              </span>
            )}
          </div>
          <p className="text-[13px] md:text-sm text-gray-500">
            {experience.position}
          </p>
        </div>

        {/* Right side: Date + Chevron */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <p className="text-[11px] md:text-xs text-gray-500 whitespace-nowrap hidden sm:block">
            {experience.startDate} – {experience.endDate}
          </p>
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-5 h-5 text-gray-500" />
          </motion.div>
        </div>
      </button>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-4 pl-[68px] md:pl-[80px] pr-2">
              {/* Date on mobile */}
              <p className="text-xs text-gray-500 mb-2 sm:hidden">
                {experience.startDate} – {experience.endDate}
              </p>

              {/* Location info */}
              <div className="flex items-center gap-1.5 text-xs mb-3">
                <MapPin className="w-3.5 h-3.5 text-[#FF5000]" />
                <span className="text-[#FF5000]">{experience.location}</span>
              </div>

              {/* Bullets */}
              <div className="space-y-3">
                {experience.bullets.map((bullet, idx) => (
                  <motion.p
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="text-sm text-gray-300 leading-relaxed pl-3 border-l-2 border-[#3A3A3C]"
                  >
                    {bullet}
                  </motion.p>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
