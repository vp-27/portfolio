import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Calendar, Code, X } from 'lucide-react'
import type { Experience, Project } from '../types'

interface ExperienceCardProps {
  experience: Experience | Project | null
  type: 'experience' | 'project' | null
  onDismiss?: () => void
}

export default function ExperienceCard({ experience, type, onDismiss }: ExperienceCardProps) {
  const hasContent = experience && type

  const renderContent = () => {
    if (!hasContent) {
      return (
        <div className="flex items-center justify-center h-full">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#E8A03D] text-lg font-medium"
          >
            Try hovering over the chart!
          </motion.p>
        </div>
      )
    }

    if (type === 'experience') {
      const exp = experience as Experience
      return (
        <motion.div
          key={exp.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-[#E8A03D] text-lg">{exp.position}</h3>
              <p className="text-sm text-gray-400 mt-1">{exp.company}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>{exp.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{exp.startDate} – {exp.endDate}</span>
            </div>
          </div>
          <ul className="space-y-2.5 text-sm text-gray-300">
            {exp.bullets.slice(0, 2).map((bullet, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-[#E8A03D] mt-1.5">•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )
    } else {
      const proj = experience as Project
      return (
        <motion.div
          key={proj.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-[#E8A03D] text-lg">{proj.name}</h3>
              <p className="text-sm text-gray-400 mt-1">{proj.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
            <Calendar className="w-3.5 h-3.5" />
            <span>{proj.duration}</span>
          </div>
          <ul className="space-y-2.5 text-sm text-gray-300 mb-4">
            {proj.bullets.slice(0, 2).map((bullet, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-[#E8A03D] mt-1.5">•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
          {proj.technologies && proj.technologies.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap mt-3">
              <Code className="w-3.5 h-3.5 text-gray-500" />
              {proj.technologies.slice(0, 4).map((tech, idx) => (
                <span key={idx} className="text-xs text-black font-semibold bg-[#00C805] px-2.5 py-1 rounded">
                  {tech}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      )
    }
  }

  return (
    <motion.div 
      className="bg-[#2B2D2E] rounded-lg shadow-lg border border-[#3A3C3D] overflow-hidden relative"
      initial={{ height: 'auto', opacity: 1 }}
      animate={{ 
        height: hasContent ? 'auto' : '80px',
        paddingTop: hasContent ? '24px' : '16px',
        paddingBottom: hasContent ? '24px' : '16px',
        paddingLeft: '24px',
        paddingRight: '24px',
        opacity: 1
      }}
      transition={{ 
        duration: 0.4,
        ease: [0.4, 0.0, 0.2, 1]
      }}
    >
      {/* X button - only show when there's content */}
      {hasContent && onDismiss && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onDismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
          aria-label="Dismiss"
        >
          <X className="w-5 h-5" />
        </motion.button>
      )}
      
      <AnimatePresence mode="wait">
        {renderContent()}
      </AnimatePresence>
    </motion.div>
  )
}
