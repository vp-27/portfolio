import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, ExternalLink, Github, ChevronRight } from 'lucide-react'
import type { Project } from '../types'

interface ProjectCardProps {
  project: Project
  isHighlighted?: boolean
}

export default function ProjectCard({ project, isHighlighted }: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

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
        h-full flex flex-col
      `}
    >
      {/* Card Header */}
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-lg mb-1.5 truncate">{project.name}</h3>
            <p className="text-sm text-gray-400 line-clamp-2">{project.subtitle}</p>
          </div>
          
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-gray-500 ml-3 flex-shrink-0"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.div>
        </div>
        
        {/* Duration */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
          <Calendar className="w-3.5 h-3.5 text-[#00C805]" />
          <span>{project.duration}</span>
        </div>

        {/* Technologies */}
        {!isExpanded && project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {project.technologies.slice(0, 3).map((tech, idx) => {
              // Color code technologies
              const isFinancial = ['Bloomberg Terminal', 'Alpaca API', 'Yahoo Finance', 'Webull API'].includes(tech)
              const isProgramming = ['Python', 'TypeScript', 'JavaScript', 'React', 'Flask', 'SQL', 'Node.js'].includes(tech)
              
              let badgeColor = 'bg-[#2A2A2A] text-gray-400 border-gray-700' // default
              if (isFinancial) {
                badgeColor = 'bg-[#00C805]/10 text-[#00C805] border-[#00C805]/30' // green for financial
              } else if (isProgramming) {
                badgeColor = 'bg-[#FF5000]/10 text-[#FF5000] border-[#FF5000]/30' // orange/red for programming
              }
              
              return (
                <span
                  key={idx}
                  className={`px-2 py-1 text-[10px] font-medium rounded border ${badgeColor}`}
                >
                  {tech}
                </span>
              )
            })}
            {project.technologies.length > 3 && (
              <span className="px-2 py-1 text-[10px] font-medium text-gray-500">
                +{project.technologies.length - 3}
              </span>
            )}
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
            transition={{ duration: 0.25, ease: [0.4, 0.0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-gray-800">
              {/* Bullet points */}
              <div className="space-y-3 mt-4 mb-4">
                {project.bullets.slice(0, 2).map((bullet, idx) => (
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

              {/* All Technologies */}
              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.technologies.map((tech, idx) => {
                    // Color code technologies
                    const isFinancial = ['Bloomberg Terminal', 'Alpaca API', 'Yahoo Finance', 'Webull API'].includes(tech)
                    const isProgramming = ['Python', 'TypeScript', 'JavaScript', 'React', 'Flask', 'SQL', 'Node.js', 'dbt-core'].includes(tech)
                    
                    let badgeColor = 'bg-[#2A2A2A] text-gray-400 border-gray-700' // default
                    if (isFinancial) {
                      badgeColor = 'bg-[#00C805]/10 text-[#00C805] border-[#00C805]/30' // green for financial
                    } else if (isProgramming) {
                      badgeColor = 'bg-[#FF5000]/10 text-[#FF5000] border-[#FF5000]/30' // orange/red for programming
                    }
                    
                    return (
                      <span
                        key={idx}
                        className={`px-2 py-1 text-[10px] font-medium rounded border ${badgeColor}`}
                      >
                        {tech}
                      </span>
                    )
                  })}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-3 border-t border-gray-800">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    // Add visit link logic here
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#00C805]/10 hover:bg-[#00C805]/20 text-[#00C805] border border-[#00C805]/30 hover:border-[#00C805]/50 text-xs font-medium rounded transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Visit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    // Add code link logic here
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#FF5000]/10 hover:bg-[#FF5000]/20 text-[#FF5000] border border-[#FF5000]/30 hover:border-[#FF5000]/50 text-xs font-medium rounded transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  Code
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
