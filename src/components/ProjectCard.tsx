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
        duration: 0.2,
        ease: [0.32, 0.72, 0, 1]
      }}
      className={`
        bg-[#1C1C1E] rounded-xl overflow-hidden cursor-pointer
        transition-all duration-200 ease-out
        hover:bg-[#252528]
        ${isHighlighted ? 'ring-1 ring-[#00C805]' : ''}
        flex flex-col
        relative
      `}
    >
      <AnimatePresence mode="wait" initial={false}>
        {/* Collapsed State - Horizontal Layout */}
        {!isExpanded ? (
          <motion.div 
            key="collapsed"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
            className="p-4 md:p-5 flex flex-col"
          >
            {/* Top Row: Logo + Title/Duration */}
            <div className="flex gap-3 md:gap-5 mb-3 md:mb-4">
              {/* Project Logo - Left Side */}
              {project.logoUrl && (
                <div className="flex-shrink-0 w-20 h-20 md:w-28 md:h-28 flex items-center justify-center">
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
                <div className="flex-1 min-w-0 mr-2 md:mr-4">
                  <h3 className="font-bold text-white text-[17px] md:text-[20px] mb-1 md:mb-1.5 leading-tight">{project.name}</h3>
                  <p className="text-[10px] md:text-xs text-gray-500 font-medium mb-1.5 md:mb-2">{project.duration}</p>
                  <p className="text-xs md:text-sm text-gray-400 line-clamp-2 leading-relaxed">{project.subtitle}</p>
                </div>
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-500 flex-shrink-0 mt-0.5 md:mt-1" />
              </div>
            </div>

            {/* Technologies and Buttons - Stack on Mobile, Row on Desktop */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
              {/* Technologies as badges */}
              <div className="flex flex-wrap gap-1.5 md:gap-2 flex-1">
                {project.technologies && project.technologies.slice(0, 5).map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 md:px-3 py-0.5 md:py-1 text-[10px] md:text-[11px] font-semibold rounded-full bg-[#2C2C2E] text-gray-300"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies && project.technologies.length > 5 && (
                  <span className="px-2.5 md:px-3 py-0.5 md:py-1 text-[10px] md:text-[11px] font-semibold text-gray-500 rounded-full bg-[#2C2C2E]">
                    +{project.technologies.length - 5}
                  </span>
                )}
              </div>

              {/* Action Buttons - Full Width on Mobile, Auto on Desktop */}
              <div className="flex gap-2 w-full md:w-auto md:flex-shrink-0">
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
                    className="flex items-center justify-center gap-1.5 md:gap-2 px-4 md:px-5 py-2 md:py-2.5 text-[11px] md:text-xs font-semibold rounded-lg transition-all active:scale-95 hover:opacity-90 whitespace-nowrap flex-1 md:flex-initial"
                  >
                    <ExternalLink className="w-3 h-3 md:w-3.5 md:h-3.5" />
                    <span className="hidden sm:inline">Visit Site</span>
                    <span className="sm:hidden">Visit</span>
                  </button>
                )}
                {project.githubUrl && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(project.githubUrl, '_blank')
                    }}
                    className="flex items-center justify-center gap-1.5 md:gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-[#2C2C2E] hover:bg-[#3A3A3C] text-white text-[11px] md:text-xs font-semibold rounded-lg transition-all active:scale-95 whitespace-nowrap flex-1 md:flex-initial"
                  >
                    <Github className="w-3 h-3 md:w-3.5 md:h-3.5" />
                    <span className="hidden sm:inline">View Code</span>
                    <span className="sm:hidden">Code</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
      ) : (
        /* Expanded State - Full Details View */
        <motion.div 
          key="expanded"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
          className="p-4 md:p-6"
        >
          {/* Header with Title and Chevron */}
          <div className="flex items-start justify-between mb-3 md:mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-[19px] md:text-[22px] mb-1 md:mb-1.5 leading-tight">{project.name}</h3>
              <p className="text-[10px] md:text-xs text-gray-500 font-medium mb-1.5 md:mb-2">{project.duration}</p>
              <p className="text-xs md:text-sm text-gray-400 leading-relaxed">{project.subtitle}</p>
            </div>
            
            {/* Chevron - Rotated to indicate collapse */}
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
              className="text-gray-500 flex-shrink-0 ml-2 md:ml-3"
            >
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
            </motion.div>
          </div>

          {/* Large Project Image - Hero Image */}
          {project.imageUrl && (
            project.isMobileApp ? (
              // Mobile App Layout - Side by Side
              <div className="mb-4 md:mb-5 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Key Achievements - Left Side */}
                <div>
                  <h4 className="text-xs md:text-sm font-semibold text-white mb-2 md:mb-3">Key Achievements</h4>
                  <div className="space-y-3">
                    {project.bullets.map((bullet, idx) => (
                      <motion.p
                        key={idx}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.03, duration: 0.15, ease: [0.32, 0.72, 0, 1] }}
                        className="text-xs md:text-sm text-gray-300 leading-relaxed pl-3 border-l-2 border-[#00C805]/30"
                      >
                        {bullet}
                      </motion.p>
                    ))}
                  </div>
                </div>

                {/* Phone Screenshot - Right Side */}
                <motion.div 
                  initial={false}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
                  className="flex items-center justify-center rounded-xl overflow-hidden bg-transparent border-2 md:border-[3px]"
                  style={{ borderColor: accentColor }}
                >
                  <img 
                    src={project.imageUrl} 
                    alt={project.name}
                    className="w-full h-auto object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </motion.div>
              </div>
            ) : (
              // Desktop App Layout - Full Width Image
              <motion.div 
                initial={false}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
                className="mb-4 md:mb-5 rounded-xl overflow-hidden bg-[#0A0A0A] border-2 md:border-[3px] flex items-center justify-center"
                style={{ borderColor: accentColor }}
              >
                <img 
                  src={project.imageUrl} 
                  alt={project.name}
                  className="w-full h-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </motion.div>
            )
          )}

          {/* Detailed Achievement Bullets - Only for Desktop Apps */}
          {!project.isMobileApp && (
            <div className="mb-4 md:mb-5">
              <h4 className="text-xs md:text-sm font-semibold text-white mb-2 md:mb-3">Key Achievements</h4>
              <div className="space-y-3">
                {project.bullets.map((bullet, idx) => (
                  <motion.p
                    key={idx}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03, duration: 0.15, ease: [0.32, 0.72, 0, 1] }}
                    className="text-xs md:text-sm text-gray-300 leading-relaxed pl-3 border-l-2 border-[#00C805]/30"
                  >
                    {bullet}
                  </motion.p>
                ))}
              </div>
            </div>
          )}

          {/* All Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="mb-4 md:mb-5">
              <h4 className="text-xs md:text-sm font-semibold text-white mb-2 md:mb-3">Technologies Used</h4>
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                {project.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 md:px-3.5 py-1 md:py-1.5 text-[10px] md:text-[11px] font-semibold rounded-full bg-[#2C2C2E] text-gray-300 hover:bg-[#3A3A3C] transition-colors"
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
                className="flex items-center justify-center gap-2 px-5 md:px-6 py-2.5 md:py-3 text-xs md:text-sm font-semibold rounded-lg transition-all active:scale-95 flex-1 hover:opacity-90"
              >
                <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4" />
                Visit Site
              </button>
            )}
            {project.githubUrl && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(project.githubUrl, '_blank')
                }}
                className="flex items-center justify-center gap-2 px-5 md:px-6 py-2.5 md:py-3 bg-[#2C2C2E] hover:bg-[#3A3A3C] text-white text-xs md:text-sm font-semibold rounded-lg transition-all active:scale-95 flex-1"
              >
                <Github className="w-3.5 h-3.5 md:w-4 md:h-4" />
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
