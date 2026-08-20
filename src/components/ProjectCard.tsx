import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Github, ChevronDown } from 'lucide-react'
import type { Project } from '../types'

interface ProjectCardProps {
  project: Project
  isHighlighted?: boolean
  isHovered?: boolean
  isExpanded?: boolean
  onToggle?: () => void
  disableLayoutAnimation?: boolean
  onHover?: (isHovered: boolean) => void
}

export default function ProjectCard({
  project,
  isHighlighted,
  isHovered = false,
  isExpanded: controlledExpanded,
  onToggle,
  disableLayoutAnimation = false,
  onHover,
}: ProjectCardProps) {
  const [localExpanded, setLocalExpanded] = useState(false)
  const [showGlow, setShowGlow] = useState(false)
  const hasLinks = project.liveUrl || project.githubUrl

  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : localExpanded

  const handleCardClick = () => {
    if (isExpanded) {
      setShowGlow(false)
    }
    if (onToggle) {
      onToggle()
    } else {
      setLocalExpanded(!localExpanded)
    }
  }

  // Auto-expand and show gold glow when highlighted
  useEffect(() => {
    if (isHighlighted) {
      if (controlledExpanded === undefined) {
        setLocalExpanded(true)
      }
      setShowGlow(true)
      // Crisp 700ms gold glow pulse
      const timer = setTimeout(() => {
        setShowGlow(false)
      }, 700)
      return () => clearTimeout(timer)
    } else {
      setShowGlow(false)
    }
  }, [isHighlighted])

  return (
    <motion.div
      layout={!disableLayoutAnimation}
      transition={disableLayoutAnimation ? undefined : { layout: { type: 'tween', ease: 'easeOut', duration: 0.22 } }}
      data-project-id={project.id}
      onClick={handleCardClick}
      onMouseEnter={() => {
        if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
          onHover?.(true)
        }
      }}
      onMouseLeave={() => {
        if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
          onHover?.(false)
        }
      }}
      className="bg-[#1E2124] rounded-2xl overflow-hidden cursor-pointer transition-colors duration-200 hover:bg-[#2A2D31] relative"
      style={{
        boxShadow: showGlow || isHovered
          ? '0 0 25px rgba(201, 162, 39, 0.5), inset 0 0 25px rgba(201, 162, 39, 0.1)'
          : 'none',
        border: showGlow || isHovered ? '1px solid rgba(201, 162, 39, 0.4)' : '1px solid transparent',
      }}
    >
      {/* Gold glow overlay */}
      {(showGlow || isHovered) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 rounded-2xl pointer-events-none z-0"
          style={{
            background: 'linear-gradient(135deg, rgba(201, 162, 39, 0.12) 0%, rgba(201, 162, 39, 0.03) 100%)',
          }}
        />
      )}

      {/* Card Header - Always Visible */}
      <div className="p-4 md:p-5 relative z-10">
        <div className="flex items-center gap-3 md:gap-4">
          {/* Left side: Title, Subtitle, Tags */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white text-[17px] md:text-[19px] leading-tight mb-1.5">
              {project.name}
            </h3>
            <p className="text-[13px] md:text-sm text-gray-400 mb-3.5 leading-relaxed">
              {project.subtitle}
            </p>

            {/* Tech Tags Row */}
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {project.technologies && project.technologies.length > 0 && (
                <>
                  {project.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="tech-chip"
                    >
                      {tech}
                    </span>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Right side: Large Logo */}
          <div className="flex-shrink-0 w-[105px] h-[105px] sm:w-[120px] sm:h-[120px] md:w-[135px] md:h-[135px] flex items-center justify-center">
            {project.logoUrl ? (
              <img
                src={project.logoUrl}
                alt={`${project.name} logo`}
                className="w-full h-full object-contain drop-shadow-md"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : (
              <div className="w-full h-full rounded-2xl bg-[#00C805]/20 flex items-center justify-center">
                <span className="text-4xl md:text-5xl font-bold text-[#00C805]">
                  {project.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Row: More (Left) + Buttons (Right) */}
        <div className="flex items-center justify-between mt-3.5 pt-1">
          {/* Expand indicator */}
          <div className="flex items-center gap-1.5 text-gray-400 hover:text-white text-[13px] font-medium transition-colors">
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
            <span>{isExpanded ? 'Less' : 'More'}</span>
          </div>

          {/* Buttons - Only show when collapsed (expanded view has full width buttons) */}
          {!isExpanded && hasLinks && (
            <div className="flex items-center gap-2">
              {project.githubUrl && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(project.githubUrl, '_blank')
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#2C3036] hover:bg-[#383E47] border border-[#444A56] text-white text-[11px] font-semibold transition-colors active:scale-95 shadow-sm"
                >
                  <Github className="w-3.5 h-3.5" />
                  Code
                </button>
              )}
              {project.liveUrl && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(project.liveUrl, '_blank')
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#00C805] hover:bg-[#00E676] text-black text-[11px] font-bold transition-colors active:scale-95"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Visit
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden relative z-10"
          >
            <div className="px-4 md:px-5 pb-4 md:pb-5">
              {/* Duration */}
              <p className="text-xs text-gray-500 mb-3">{project.duration}</p>

              {/* Project Image if exists - capped height for vertical screenshots */}
              {project.imageUrl && (
                <div className="mb-4 rounded-xl overflow-hidden border border-[#2C2C2E] max-h-[300px] md:max-h-[400px] flex items-center justify-center bg-black">
                  <img
                    src={project.imageUrl}
                    alt={project.name}
                    className="w-auto max-w-full h-auto max-h-[300px] md:max-h-[400px] object-contain"
                  />
                </div>
              )}

              {/* Bullets */}
              <div className="space-y-3 mb-4">
                {project.bullets.map((bullet, idx) => (
                  <p
                    key={idx}
                    className="text-sm text-gray-300 leading-relaxed pl-3 border-l-2 border-[#00C805]/30"
                  >
                    {bullet}
                  </p>
                ))}
              </div>

              {/* Action Buttons - Full width in expanded */}
              <div className="flex gap-2.5 pt-3.5 border-t border-[#2C2C2E]">
                {project.githubUrl && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(project.githubUrl, '_blank')
                    }}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#2C3036] hover:bg-[#383E47] border border-[#444A56] text-white text-xs font-semibold rounded-full transition-all active:scale-95 flex-1"
                  >
                    <Github className="w-4 h-4" />
                    View Code
                  </button>
                )}
                {project.liveUrl && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(project.liveUrl, '_blank')
                    }}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#00C805] hover:bg-[#00E676] text-black text-xs font-bold rounded-full transition-all active:scale-95 flex-1"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Visit Site
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
