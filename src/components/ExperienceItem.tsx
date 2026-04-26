import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import type { Experience } from '../types'

interface ExperienceItemProps {
  experience: Experience
  isHighlighted?: boolean
  isLast?: boolean
}

// Get first letter for icon fallback
const getInitials = (company: string) => {
  return company.charAt(0).toUpperCase()
}

export default function ExperienceItem({ experience, isHighlighted, isLast = false }: ExperienceItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showGlow, setShowGlow] = useState(false)
  const itemRef = useRef<HTMLDivElement>(null)
  const wasHighlighted = useRef(false)

  // Determine if this is a current position
  const isCurrent = experience.endDate.toLowerCase() === 'present'

  // Auto-expand and show gold glow when highlighted
  // Auto-collapse when another item becomes highlighted
  useEffect(() => {
    if (isHighlighted) {
      wasHighlighted.current = true
      setIsExpanded(true)
      setShowGlow(true)
      // Remove glow after animation completes
      const timer = setTimeout(() => {
        setShowGlow(false)
      }, 1500)
      return () => clearTimeout(timer)
    } else if (wasHighlighted.current) {
      // This card was previously highlighted but now something else is
      // Collapse it to keep UI clean
      wasHighlighted.current = false
      setIsExpanded(false)
    }
  }, [isHighlighted])

  return (
    <div
      ref={itemRef}
      data-experience-id={experience.id}
      className={`
        py-3 relative
        ${isLast ? '' : 'border-b border-[#2C2C2E]'}
        transition-all duration-300
      `}
      style={{
        boxShadow: showGlow
          ? '0 0 20px rgba(201, 162, 39, 0.4), inset 0 0 20px rgba(201, 162, 39, 0.1)'
          : 'none',
        borderRadius: showGlow ? '12px' : '0',
        margin: showGlow ? '0 -8px' : '0',
        padding: showGlow ? '12px 8px' : undefined,
      }}
    >
      {/* Gold glow overlay */}
      {showGlow && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(201, 162, 39, 0.15) 0%, rgba(201, 162, 39, 0.05) 100%)',
            border: '1px solid rgba(201, 162, 39, 0.3)',
          }}
        />
      )}

      {/* List Row - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 md:gap-4 text-left hover:bg-[#1A1A1A] rounded-xl transition-colors p-2 -m-2 focus:outline-none relative z-10"
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
            className="overflow-hidden relative z-10"
          >
            <div className="pt-4 pl-[68px] md:pl-[80px] pr-2">
              {/* Date on mobile */}
              <p className="text-xs text-gray-500 mb-2 sm:hidden">
                {experience.startDate} – {experience.endDate}
              </p>

              {/* Location info - Pill style with icon circle */}
              <div className="inline-flex items-center gap-2 px-1 pr-3 py-1 rounded-full bg-[#1C1C1E] border border-[#3A3A3C] text-xs mb-3">
                <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center">
                  <img src="/images/tags/location.png" alt="" className="w-full h-full object-cover" />
                </div>
                <span className="text-gray-300">{experience.location}</span>
              </div>

              {/* Bullets */}
              <div className="space-y-3">
                {experience.bullets.map((bullet, idx) => (
                  <p
                    key={idx}
                    className="text-sm text-gray-300 leading-relaxed pl-3 border-l-2 border-[#3A3A3C]"
                  >
                    {bullet}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
