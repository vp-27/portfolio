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
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        bg-[#1C1C1E] rounded-2xl overflow-hidden cursor-pointer
        transition-all duration-300 ease-out
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
          {/* Title and Subtitle */}
          <div className="mb-3">
            <h3 className="font-bold text-white text-xl mb-1">{project.name}</h3>
            <p className="text-sm text-gray-500">{project.duration}</p>
          </div>

          {/* Project Image Preview */}
          {project.imageUrl ? (
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
          ) : (
            // Placeholder with gradient when no image
            <div 
              className="mb-4 rounded-lg h-24 flex items-center justify-center relative overflow-hidden border-2"
              style={{ borderColor: accentColor }}
            >
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}33 0%, transparent 100%)`
                }}
              />
              <svg className="w-12 h-12 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
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
            {/* Click indicator */}
            <div className="flex items-center gap-1 mt-3 text-xs text-gray-500">
              <span>Tap to expand</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      ) : (
        /* Expanded State */
        <div className="p-5 flex-1">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white text-lg mb-1.5">{project.name}</h3>
              <p className="text-sm text-gray-400 line-clamp-2">{project.subtitle}</p>
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
                transition={{ duration: 0.2 }}
                className="text-gray-500"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mb-3">
            {project.liveUrl && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(project.liveUrl, '_blank')
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00C805]/10 hover:bg-[#00C805]/20 text-[#00C805] border border-[#00C805]/30 hover:border-[#00C805]/50 text-xs font-medium rounded transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Visit
              </button>
            )}
            {project.githubUrl && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(project.githubUrl, '_blank')
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FF5000]/10 hover:bg-[#FF5000]/20 text-[#FF5000] border border-[#FF5000]/30 hover:border-[#FF5000]/50 text-xs font-medium rounded transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                Code
              </button>
            )}
          </div>

          {/* Bullet points */}
          <div className="space-y-3 mb-4">
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
