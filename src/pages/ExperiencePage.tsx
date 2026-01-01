import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import BottomNav from '../components/BottomNav'
import { mockExperiences } from '../data/mockData'

// Get first letter for icon fallback
const getInitials = (company: string) => {
  return company.charAt(0).toUpperCase()
}

export default function ExperiencePage() {
  const navigate = useNavigate()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-sm z-10">
        <div className="relative flex items-center justify-center px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-4 p-1 hover:bg-[#1A1A1A] rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Professional Experience</h1>
        </div>
      </div>

      {/* Experience List - Gray-tinted Prediction Markets style */}
      <div className="px-4 py-2">
        <div className="divide-y divide-[#2C2C2E]">
          {mockExperiences.map((exp, index) => {
            const isExpanded = expandedId === exp.id
            const isCurrent = exp.endDate.toLowerCase() === 'present'

            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="py-3"
              >
                {/* List Row - Always Visible */}
                <button
                  onClick={() => toggleExpand(exp.id)}
                  className="w-full flex items-center gap-3 text-left hover:bg-[#1A1A1A] rounded-xl transition-colors p-2 -m-2 focus:outline-none"
                >
                  {/* Logo or Fallback Icon */}
                  {exp.logoUrl ? (
                    <div className="flex-shrink-0 w-[72px] h-[72px] flex items-center justify-center">
                      <img
                        src={exp.logoUrl}
                        alt={exp.company}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="flex-shrink-0 w-[72px] h-[72px] rounded-xl border-2 border-[#3A3A3C] bg-[#1C1C1E] flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-400">
                        {getInitials(exp.company)}
                      </span>
                    </div>
                  )}

                  {/* Content: Company, Position, Current badge */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h2 className="font-semibold text-white text-[15px] leading-tight">
                        {exp.company}
                      </h2>
                      {isCurrent && (
                        <span className="px-2 py-0.5 text-[9px] font-semibold bg-[#00C805] text-black rounded-sm flex-shrink-0">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] text-gray-500">
                      {exp.position}
                    </p>
                  </div>

                  {/* Right side: Date + Chevron */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <p className="text-[11px] text-gray-500 whitespace-nowrap hidden sm:block">
                      {exp.startDate} – {exp.endDate}
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
                      <div className="pt-4 pl-[68px] pr-2">
                        {/* Date on mobile */}
                        <p className="text-xs text-gray-500 mb-2 sm:hidden">
                          {exp.startDate} – {exp.endDate}
                        </p>

                        {/* Location info - Pill style with icon circle */}
                        <div className="inline-flex items-center gap-2 px-1 pr-3 py-1 rounded-full bg-[#1C1C1E] border border-[#3A3A3C] text-xs mb-3">
                          <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center">
                            <img src="/images/tags/location.png" alt="" className="w-full h-full object-cover" />
                          </div>
                          <span className="text-gray-300">{exp.location}</span>
                        </div>

                        {/* Bullets */}
                        <div className="space-y-3">
                          {exp.bullets.map((bullet, idx) => (
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
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
