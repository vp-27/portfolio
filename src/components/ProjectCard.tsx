import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
      onClick={() => setIsExpanded(!isExpanded)}
      animate={{
        height: 'auto'
      }}
      transition={{ 
        duration: 0.4,
        ease: [0.4, 0.0, 0.2, 1]
      }}
      className={`
        bg-[#1C1C1E] rounded-2xl overflow-hidden cursor-pointer
        border border-[#2C2C2E]
        hover:bg-[#232326] hover:shadow-xl hover:border-[#3A3A3C]
        ${isHighlighted ? 'ring-2 ring-[#00C805] border-[#00C805]' : ''}
        flex flex-col
        relative
      `}
    >
      <AnimatePresence mode="wait" initial={false}>
        {/* Collapsed State - Horizontal Layout */}
        {!isExpanded ? (
          <motion.div 
            key="collapsed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="p-5 flex flex-col"
          >
            {/* Top Row: Logo + Title/Duration */}
            <div className="flex gap-5 mb-4">
              {/* Project Logo - Left Side */}
              {project.logoUrl && (
                <div className="flex-shrink-0 w-28 h-28 flex items-center justify-center">
                  <img 
                    src={project.logoUrl} 
                    alt={`${project.name} logo`}
                    className="w-[140%] h-[140%] object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              )}
              
              {/* Title, Duration, and Arrow - Right Side */}
              <div className="flex-1 flex items-start justify-between min-w-0">
                <div className="flex-1 min-w-0 mr-4">
                  <h3 className="font-bold text-white text-[20px] mb-1.5 leading-tight">{project.name}</h3>
                  <p className="text-xs text-gray-500 font-medium mb-2">{project.duration}</p>
                  <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">{project.subtitle}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1" />
              </div>
            </div>

            {/* Technologies and Buttons Row */}
            <div className="flex items-center justify-between gap-4">
              {/* Technologies as badges */}
              <div className="flex flex-wrap gap-2 flex-1">
                {project.technologies && project.technologies.slice(0, 5).map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-[11px] font-semibold rounded-full bg-[#2C2C2E] text-gray-300"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies && project.technologies.length > 5 && (
                  <span className="px-3 py-1 text-[11px] font-semibold text-gray-500 rounded-full bg-[#2C2C2E]">
                    +{project.technologies.length - 5}
                  </span>
                )}
              </div>

              {/* Action Buttons - Right Side */}
              <div className="flex gap-2 flex-shrink-0">
                {project.liveUrl && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(project.liveUrl, '_blank')
                    }}
                    style={{
                      backgroundColor: accentColor,
                      color: accentColor === '#00C805' ? '#000' : '#fff'
                    }}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-lg transition-all active:scale-95 hover:opacity-90 whitespace-nowrap"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Visit Site
                  </button>
                )}
                {project.githubUrl && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(project.githubUrl, '_blank')
                    }}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#2C2C2E] hover:bg-[#3A3A3C] text-white text-xs font-semibold rounded-lg transition-all active:scale-95 whitespace-nowrap"
                  >
                    <Github className="w-3.5 h-3.5" />
                    View Code
                  </button>
                )}
              </div>
            </div>
          </motion.div>
      ) : (
        /* Expanded State - Full Details View */
        <motion.div 
          key="expanded"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="p-6"
        >
          {/* Header with Title and Chevron */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-[22px] mb-1.5 leading-tight">{project.name}</h3>
              <p className="text-xs text-gray-500 font-medium mb-2">{project.duration}</p>
              <p className="text-sm text-gray-400 leading-relaxed">{project.subtitle}</p>
            </div>
            
            {/* Chevron - Rotated to indicate collapse */}
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.4, ease: [0.4, 0.0, 0.2, 1] }}
              className="text-gray-500 flex-shrink-0 ml-3"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.div>
          </div>

          {/* Large Project Image - Hero Image */}
          {project.imageUrl && (
            <motion.div 
              initial={false}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
              className="mb-5 rounded-xl overflow-hidden bg-[#0A0A0A] border-[3px]"
              style={{ borderColor: accentColor }}
            >
              <img 
                src={project.imageUrl} 
                alt={project.name}
                className="w-full h-52 object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </motion.div>
          )}

          {/* Detailed Achievement Bullets */}
          <div className="mb-5">
            <h4 className="text-sm font-semibold text-white mb-3">Key Achievements</h4>
            <div className="space-y-3">
              {project.bullets.map((bullet, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04, duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }}
                  className="flex gap-3 text-sm text-gray-300 leading-relaxed"
                >
                  <span className="text-[#00C805] mt-0.5 flex-shrink-0 text-xs">▸</span>
                  <span>{bullet}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* All Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="mb-5">
              <h4 className="text-sm font-semibold text-white mb-3">Technologies Used</h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 text-[11px] font-semibold rounded-full bg-[#2C2C2E] text-gray-300 hover:bg-[#3A3A3C] transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons - Bottom */}
          <div className="flex gap-2 pt-3 border-t border-[#2C2C2E]">
            {project.liveUrl && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(project.liveUrl, '_blank')
                }}
                style={{
                  backgroundColor: accentColor,
                  color: accentColor === '#00C805' ? '#000' : '#fff'
                }}
                className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg transition-all active:scale-95 flex-1 hover:opacity-90"
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
        </motion.div>
      )}
      </AnimatePresence>
    </motion.div>
  )
}
