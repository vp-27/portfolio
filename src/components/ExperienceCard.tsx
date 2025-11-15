import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Calendar, Code, X } from 'lucide-react'
import type { Experience, Project } from '../types'
import styles from './ExperienceCard.module.css'

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
        <div>
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
        </div>
      )
    } else {
      const proj = experience as Project
      return (
        <div>
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
        </div>
      )
    }
  }

  // Create unique key for AnimatePresence to detect changes
  const contentKey = hasContent 
    ? `${type}-${(experience as any)?.id}` 
    : 'placeholder'

  return (
    <div className="relative min-h-[80px]">
      {/* Background stacked cards */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Card 3 - furthest back */}
        <div 
          className={`${styles.stackLayerBase} ${styles.stackLayerBack} bg-[#232425] border border-[#353637] shadow-xl opacity-40`}
        />
        {/* Card 2 - middle */}
        <div 
          className={`${styles.stackLayerBase} ${styles.stackLayerMiddle} bg-[#262728] border border-[#3A3C3D] shadow-xl opacity-70`}
        />
        {/* Card 1 - closest background */}
        <div 
          className={`${styles.stackLayerBase} ${styles.stackLayerFront} bg-[#2B2D2E] border border-[#3A3C3D] shadow-xl opacity-90`}
        />
      </div>

      {/* Main card - on top with swipe animations */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={contentKey}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              opacity: { duration: 0.2 }
            }}
            className={`bg-[#2B2D2E] rounded-lg shadow-2xl border border-[#3A3C3D] overflow-hidden relative px-6 ${
              hasContent ? 'py-6 min-h-0' : 'py-4 min-h-[80px]'
            }`}
          >
            {/* X button - only show when there's content */}
            {hasContent && onDismiss && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                onClick={onDismiss}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
                aria-label="Dismiss"
              >
                <X className="w-5 h-5" />
              </motion.button>
            )}
            
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
