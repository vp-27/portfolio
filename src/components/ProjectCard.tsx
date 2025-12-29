import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Github, ChevronRight } from 'lucide-react'
import type { Project } from '../types'

interface ProjectCardProps {
  project: Project
  isHighlighted?: boolean
}

// Color palette for icon backgrounds - vibrant Robinhood-style
const iconColors = [
  '#00C805', // Green
  '#FF5000', // Orange
  '#FFD600', // Yellow
  '#00B0FF', // Blue
  '#FF6B6B', // Coral
  '#9C27B0', // Purple
]

// Get consistent color based on project id
const getIconColor = (id: string) => {
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return iconColors[hash % iconColors.length]
}

export default function ProjectCard({ project, isHighlighted }: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const iconColor = getIconColor(project.id)

  // Determine if we have external links
  const hasLinks = project.liveUrl || project.githubUrl

  return (
    <div
      className={`
        py-3 border-b border-[#2C2C2E] last:border-b-0
        ${isHighlighted ? 'bg-[#1A1A1A] -mx-2 px-2 rounded-xl' : ''}
      `}
    >
      {/* List Row - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 md:gap-4 text-left hover:bg-[#1A1A1A] rounded-xl transition-colors p-2 -m-2"
      >
        {/* Icon Container with Colorful Background - Larger logo */}
        <div
          className="flex-shrink-0 w-[60px] h-[60px] md:w-[72px] md:h-[72px] rounded-xl flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: iconColor }}
        >
          {project.logoUrl ? (
            <img
              src={project.logoUrl}
              alt={`${project.name} logo`}
              className="w-[140%] h-[140%] object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <span className="text-2xl font-bold text-black/70">
              {project.name.charAt(0)}
            </span>
          )}
        </div>

        {/* Content: Title, Subtitle, and Tags */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-[15px] md:text-[17px] leading-tight mb-0.5">
            {project.name}
          </h3>
          <p className="text-[13px] md:text-sm text-gray-500 line-clamp-1 mb-2">
            {project.subtitle}
          </p>

          {/* Robinhood-style Tech Tags - Shown in collapsed view */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.slice(0, 3).map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-[10px] md:text-[11px] font-semibold rounded-full bg-[#2A2A2D] text-gray-300"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 3 && (
                <span className="px-2 py-1 text-[10px] md:text-[11px] font-medium text-gray-500">
                  +{project.technologies.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right side: Link indicator + Chevron */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Quick link indicator - shows there are external links */}
          {hasLinks && !isExpanded && (
            <div className="hidden sm:flex items-center gap-1.5">
              {project.liveUrl && (
                <span
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(project.liveUrl, '_blank')
                  }}
                  className="p-1.5 rounded-lg bg-[#2A2A2D] hover:bg-[#3A3A3C] transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                </span>
              )}
              {project.githubUrl && (
                <span
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(project.githubUrl, '_blank')
                  }}
                  className="p-1.5 rounded-lg bg-[#2A2A2D] hover:bg-[#3A3A3C] transition-colors"
                >
                  <Github className="w-3.5 h-3.5 text-gray-400" />
                </span>
              )}
            </div>
          )}

          {/* Chevron Indicator */}
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-5 h-5 text-gray-500" />
          </motion.div>
        </div>
      </button>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-4 pl-[72px] md:pl-[88px] pr-2">
              {/* Duration */}
              <p className="text-xs text-gray-500 mb-3">{project.duration}</p>

              {/* Project Image if exists */}
              {project.imageUrl && (
                <div
                  className="mb-4 rounded-lg overflow-hidden border-2"
                  style={{ borderColor: iconColor }}
                >
                  <img
                    src={project.imageUrl}
                    alt={project.name}
                    className="w-full h-auto object-contain"
                  />
                </div>
              )}

              {/* Bullets */}
              <div className="space-y-3 mb-4">
                {project.bullets.map((bullet, idx) => (
                  <p
                    key={idx}
                    className="text-sm text-gray-300 leading-relaxed pl-3 border-l-2"
                    style={{ borderColor: `${iconColor}40` }}
                  >
                    {bullet}
                  </p>
                ))}
              </div>

              {/* All Technologies */}
              {project.technologies && project.technologies.length > 3 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 text-[11px] font-semibold rounded-full bg-[#2A2A2D] text-gray-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-3 border-t border-[#2C2C2E]">
                {project.liveUrl && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(project.liveUrl, '_blank')
                    }}
                    style={{
                      backgroundColor: iconColor,
                      color: ['#FFD600', '#00C805'].includes(iconColor) ? '#000' : '#fff'
                    }}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-lg transition-all active:scale-95 flex-1"
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
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#2A2A2D] hover:bg-[#3A3A3C] text-white text-xs font-semibold rounded-lg transition-all active:scale-95 flex-1"
                  >
                    <Github className="w-3.5 h-3.5" />
                    View Code
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
