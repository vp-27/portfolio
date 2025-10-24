import { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Github, ChevronRight } from 'lucide-react'
import type { Project } from '../types'

interface ProjectCardProps {
  project: Project
  isHighlighted?: boolean
}

export default function ProjectCard({ project, isHighlighted }: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Generate consistent random color based on project id
  const getAccentColor = (id: string) => {
    // Use project id to consistently generate same color
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return hash % 2 === 0 ? '#00C805' : '#FF5000' // Green or Orange/Red
  }
  
  const accentColor = getAccentColor(project.id)

  return (
    <motion.div
      layout
      onClick={() => setIsExpanded(!isExpanded)}
      transition={{ 
        layout: { duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }
      }}
      className={`
        bg-[#1C1C1E] rounded-2xl overflow-hidden cursor-pointer
        transition-all duration-200 ease-out
        border border-transparent
        hover:bg-[#232326] hover:shadow-lg
        ${isHighlighted ? 'ring-2 ring-[#00C805] border-[#00C805]' : ''}
        h-full flex flex-col
        relative
      `}
    >
      {/* Collapsed State - Robinhood Card Style */}
      {!isExpanded ? (
        <div className="p-5 flex flex-col h-full">
          {/* Title and Duration with Arrow */}
          <div className="mb-3 flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-white text-xl mb-1">{project.name}</h3>
              <p className="text-sm text-gray-500">{project.duration}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0 ml-2" />
          </div>

          {/* Project Image Preview - Only show if image exists */}
          {project.imageUrl && (
            <div 
              className="mb-4 rounded-lg overflow-hidden bg-[#0A0A0A] h-24 flex items-center justify-center border-2"
              style={{ borderColor: accentColor }}
            >
              <img 
                src={project.imageUrl} 
                alt={project.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if image fails to load
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
          )}

          {/* Dotted line separator */}
          <div className="border-b border-dotted border-gray-700 mb-4"></div>

          {/* Technologies as badges */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.technologies && project.technologies.slice(0, 3).map((tech, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 text-[11px] font-medium rounded-full bg-[#2C2C2E] text-white"
              >
                {tech}
              </span>
            ))}
            {project.technologies && project.technologies.length > 3 && (
              <span className="px-3 py-1.5 text-[11px] font-medium text-gray-500 rounded-full bg-[#2C2C2E]">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>

          {/* Bottom section with subtitle */}
          <div className="mt-auto">
            <p className="text-sm text-gray-400 line-clamp-2">{project.subtitle}</p>
          </div>
        </div>
      ) : (
        /* Expanded State */
        <div className="p-6 flex-1">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white text-xl mb-1.5">{project.name}</h3>
              <p className="text-sm text-gray-400">{project.subtitle}</p>
            </div>
            
            {/* Date Range and Chevron - Right Aligned */}
            <div className="flex items-center gap-2 flex-shrink-0 ml-3">
              <div className="text-right">
                <p className="text-xs text-gray-400 whitespace-nowrap">
                  {project.duration}
                </p>
              </div>
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.15, ease: [0.4, 0.0, 0.2, 1] }}
                className="text-gray-500"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.div>
            </div>
          </div>

          {/* Large Project Image - Only show if image exists */}
          {project.imageUrl && (
            <motion.div 
              initial={false}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
              className="mb-4 rounded-lg overflow-hidden bg-[#0A0A0A] border-2"
              style={{ borderColor: accentColor }}
            >
              <img 
                src={project.imageUrl} 
                alt={project.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 mb-4">
            {project.liveUrl && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(project.liveUrl, '_blank')
                }}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#00C805] hover:bg-[#00D806] text-black text-sm font-semibold rounded-lg transition-all active:scale-95 flex-1"
              >
                <ExternalLink className="w-4 h-4" />
                Visit Site
              </button>
            )}
            {project.githubUrl && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(project.githubUrl, '_blank')
                }}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#2C2C2E] hover:bg-[#3A3A3C] text-white text-sm font-semibold rounded-lg transition-all active:scale-95 flex-1"
              >
                <Github className="w-4 h-4" />
                View Code
              </button>
            )}
          </div>

          {/* Bullet points */}
          <div className="space-y-3 mb-4">
            {project.bullets.map((bullet, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.03, duration: 0.15, ease: [0.4, 0.0, 0.2, 1] }}
                className="flex gap-3 text-sm text-gray-300 leading-relaxed"
              >
                <span className="text-[#00C805] mt-0.5 flex-shrink-0 text-xs">▸</span>
                <span>{bullet}</span>
              </motion.div>
            ))}
          </div>

          {/* All Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 text-[11px] font-medium rounded-full bg-[#2C2C2E] text-white hover:bg-[#3A3A3C] transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}
