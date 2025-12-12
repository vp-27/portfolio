import { MousePointerClick } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRef } from 'react'
import ExperienceCard from './ExperienceCard'
import type { Experience, Project } from '../types'

interface BuyingPowerProps {
  experienceData?: Experience | Project | null
  experienceType?: 'experience' | 'project' | null
  onDismiss?: () => void
}

export default function BuyingPower({ experienceData, experienceType, onDismiss }: BuyingPowerProps) {
  const hasExperience = !!(experienceData && experienceType)
  const hasEverShownExperience = useRef(false)
  
  // Track if we've ever shown an experience card (to skip initial animation)
  if (hasExperience) {
    hasEverShownExperience.current = true
  }

  return (
    <div className="py-3 border-b border-[#2D2D2D]">
      <AnimatePresence mode="wait">
        {hasExperience ? (
          <motion.div
            key="experience-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ExperienceCard 
              experience={experienceData} 
              type={experienceType}
              onDismiss={onDismiss}
            />
          </motion.div>
        ) : (
          <motion.div
            key="timeline-hint"
            initial={hasEverShownExperience.current ? { opacity: 0, y: -10 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
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
        )}
      </AnimatePresence>
    </div>
  )
}
