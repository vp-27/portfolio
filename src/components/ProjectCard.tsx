import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Github, ChevronDown } from 'lucide-react'
import type { Project } from '../types'

interface ProjectCardProps {
  project: Project
  isHighlighted?: boolean
  disableLayoutAnimation?: boolean
}

export default function ProjectCard({ project, isHighlighted, disableLayoutAnimation = false }: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showGlow, setShowGlow] = useState(false)
  const wasHighlighted = useRef(false)
  const hasLinks = project.liveUrl || project.githubUrl

  // Auto-expand and show gold glow when highlighted
  // Auto-collapse when another item becomes highlighted
  useEffect(() => {
    if (isHighlighted) {
      wasHighlighted.current = true
      setIsExpanded(true)
      setShowGlow(true)
      // Remove glow after animation completes
      const timer = setTimeout(() => {
        setShowGlow(false)
      }, 1500)
      return () => clearTimeout(timer)
    } else if (wasHighlighted.current) {
      // This card was previously highlighted but now something else is
      // Collapse it to keep UI clean
      wasHighlighted.current = false
      setIsExpanded(false)
    }
  }, [isHighlighted])

  return (
    <motion.div
      layout={!disableLayoutAnimation}
      transition={disableLayoutAnimation ? undefined : { layout: { type: 'tween', ease: 'easeOut', duration: 0.22 } }}
      data-project-id={project.id}
      onClick={() => setIsExpanded(!isExpanded)}
      className="bg-[#1C1C1E] rounded-2xl overflow-hidden cursor-pointer transition-colors duration-200 hover:bg-[#252528] relative"
      style={{
        boxShadow: showGlow
          ? '0 0 25px rgba(201, 162, 39, 0.5), inset 0 0 25px rgba(201, 162, 39, 0.1)'
          : 'none',
        border: showGlow ? '1px solid rgba(201, 162, 39, 0.4)' : '1px solid transparent',
      }}
    >
      {/* Gold glow overlay */}
      {showGlow && (
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
      <div className="p-3 md:p-4 relative z-10">
        <div className="flex items-center gap-3 md:gap-4">
          {/* Left side: Title, Subtitle, Tags */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white text-[17px] md:text-[19px] leading-tight mb-0.5">
              {project.name}
            </h3>
            <p className="text-[13px] md:text-sm text-gray-400 mb-2 line-clamp-1">
              {project.subtitle}
            </p>

            {/* Tech Tags Row */}
            <div className="flex items-center gap-2 flex-wrap mb-3">
              {project.technologies && project.technologies.length > 0 && (
                <>
                  {project.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 text-[10px] md:text-[11px] font-semibold rounded-full bg-[#2A2A2D] text-gray-300 whitespace-nowrap"
                    >
                      {tech}
                    </span>
                  ))}
                </>
              )}
            </div>


          </div>

          {/* Right side: Large Logo */}
          <div className="flex-shrink-0 w-[90px] h-[90px] md:w-[110px] md:h-[110px] flex items-center justify-center">
            {project.logoUrl ? (
              <img
                src={project.logoUrl}
                alt={`${project.name} logo`}
                className="w-[130%] h-[130%] object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : (
              <div className="w-full h-full rounded-xl bg-[#00C805]/20 flex items-center justify-center">
                <span className="text-3xl font-bold text-[#00C805]">
                  {project.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Row: More (Left) + Buttons (Right) */}
        <div className="flex items-center justify-between mt-3">
          {/* Expand indicator */}
          <div className="flex items-center gap-1 text-gray-400 text-[13px] font-medium">
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
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2A2A2D] hover:bg-[#3A3A3C] text-white text-[10px] font-medium transition-colors active:scale-95"
                >
                  <Github className="w-3 h-3" />
                  Code
                </button>
              )}
              {project.liveUrl && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(project.liveUrl, '_blank')
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00C805] hover:bg-[#00E676] text-black text-[10px] font-bold transition-colors active:scale-95"
                >
                  <ExternalLink className="w-3 h-3" />
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
            <div className="px-3 md:px-4 pb-3 md:pb-4">
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
                  <motion.p
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="text-sm text-gray-300 leading-relaxed pl-3 border-l-2 border-[#00C805]/30"
                  >
                    {bullet}
                  </motion.p>
                ))}
              </div>

              {/* Action Buttons - Full width in expanded */}
              <div className="flex gap-2 pt-3 border-t border-[#2C2C2E]">
                {project.githubUrl && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(project.githubUrl, '_blank')
                    }}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#2A2A2D] hover:bg-[#3A3A3C] text-white text-xs font-semibold rounded-lg transition-all active:scale-95 flex-1"
                  >
                    <Github className="w-3.5 h-3.5" />
                    View Code
                  </button>
                )}
                {project.liveUrl && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(project.liveUrl, '_blank')
                    }}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#00C805] hover:bg-[#00E676] text-black text-xs font-semibold rounded-lg transition-all active:scale-95 flex-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
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
