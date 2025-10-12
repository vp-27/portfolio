import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Calendar, Code } from 'lucide-react'
import type { Experience, Project } from '../types'

interface ExperienceCardProps {
  experience: Experience | Project | null
  type: 'experience' | 'project' | null
}

export default function ExperienceCard({ experience, type }: ExperienceCardProps) {
  const renderContent = () => {
    if (!experience || !type) {
      return (
        <div className="text-center py-8">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#D4AF37] text-lg font-medium"
          >
            Hover over chart to reveal experiences
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
              <h3 className="font-semibold text-[#D4AF37] text-lg">{exp.position}</h3>
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
                <span className="text-[#D4AF37] mt-1.5">•</span>
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
              <h3 className="font-semibold text-[#D4AF37] text-lg">{proj.name}</h3>
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
                <span className="text-[#D4AF37] mt-1.5">•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
          {proj.technologies && proj.technologies.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap mt-3">
              <Code className="w-3.5 h-3.5 text-gray-500" />
              {proj.technologies.slice(0, 4).map((tech, idx) => (
                <span key={idx} className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
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
    <div className="bg-[#2A2A2A] rounded-[20px] p-6 shadow-lg border border-gray-800">
      <AnimatePresence mode="wait">
        {renderContent()}
      </AnimatePresence>
    </div>
  )
}
