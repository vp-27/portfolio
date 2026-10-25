import { useState, useEffect, useId } from 'react'
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
  const detailsId = useId()
  const isExpanded = controlledExpanded ?? localExpanded

  useEffect(() => {
    if (!isHighlighted) {
      setShowGlow(false)
      return
    }
    if (controlledExpanded === undefined) setLocalExpanded(true)
    setShowGlow(true)
    const timer = window.setTimeout(() => setShowGlow(false), 700)
    return () => window.clearTimeout(timer)
  }, [isHighlighted, controlledExpanded])

  const toggle = () => {
    setShowGlow(false)
    if (onToggle) onToggle()
    else setLocalExpanded((value) => !value)
  }

  return (
    <motion.article
      layout={!disableLayoutAnimation}
      transition={
        disableLayoutAnimation
          ? undefined
          : { layout: { type: 'tween', ease: 'easeOut', duration: 0.22 } }
      }
      data-project-id={project.id}
      onClick={(event) => {
        const target = event.target as HTMLElement
        if (target.closest('a, button') || window.getSelection()?.toString()) return
        toggle()
      }}
      onMouseEnter={() => {
        if (window.matchMedia('(hover: hover)').matches) onHover?.(true)
      }}
      onMouseLeave={() => onHover?.(false)}
      className={`project-card cursor-pointer ${showGlow || isHovered ? 'milestone-highlight' : ''}`}
    >
      {(showGlow || isHovered) && (
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 rounded-2xl pointer-events-none z-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(201, 162, 39, 0.12) 0%, rgba(201, 162, 39, 0.03) 100%)',
          }}
        />
      )}
      <div className="p-4 md:p-5 relative z-10">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white text-[17px] md:text-[19px] leading-tight mb-1.5">
              <button
                type="button"
                onClick={toggle}
                aria-expanded={isExpanded}
                aria-controls={detailsId}
                className="text-left rounded-md"
              >
                {project.name}
              </button>
            </h3>
            <p className="text-[13px] md:text-sm text-[#a5afb5] mb-3.5 leading-relaxed">
              {project.subtitle}
            </p>
            {!!project.technologies?.length && (
              <div className="flex items-center gap-2 flex-wrap mb-1" aria-label="Technologies">
                {project.technologies.map((tech) => (
                  <span key={tech} className="tech-chip max-w-full whitespace-normal">
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div
            className="shrink-0 w-[105px] h-[105px] sm:w-[120px] sm:h-[120px] md:w-[135px] md:h-[135px] flex items-center justify-center"
            aria-hidden="true"
          >
            {project.logoUrl ? (
              <img
                src={project.logoUrl}
                alt=""
                loading="lazy"
                width="135"
                height="135"
                className="w-full h-full object-contain drop-shadow-md"
              />
            ) : (
              <span className="text-4xl md:text-5xl font-bold text-rh-green">
                {project.name.charAt(0)}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 mt-3">
          <button
            type="button"
            onClick={toggle}
            aria-expanded={isExpanded}
            aria-controls={detailsId}
            aria-label={`${isExpanded ? 'Collapse' : 'Read more about'} ${project.name}`}
            className="flex items-center gap-1.5 min-h-10 text-sm text-[#a5afb5] hover:text-white rounded-md"
          >
            <motion.span animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-4 h-4" />
            </motion.span>
            {isExpanded ? 'Less' : 'More'}
          </button>
          {!isExpanded && (
            <div className="flex gap-2">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${project.name} code on GitHub`}
                  className="action-secondary py-1.5 text-[11px] min-h-0 active:scale-95 transition-all shadow-sm"
                >
                  <Github className="w-3.5 h-3.5" />
                  Code
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${project.name}`}
                  className="action-primary py-1.5 text-[11px] min-h-0 active:scale-95 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Visit
                </a>
              )}
            </div>
          )}
        </div>
      </div>
      <div id={detailsId} className="relative z-10">
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              className="overflow-hidden"
            >
              <div className="px-4 md:px-5 pb-4 md:pb-5">
                <p className="text-xs text-[#a5afb5] mb-3">{project.duration}</p>
                {project.imageUrl && (
                  <div className="mb-4 rounded-xl overflow-hidden border border-[#343b3f] bg-black flex items-center justify-center">
                    <img
                      src={project.imageUrl}
                      alt={`${project.name} project preview`}
                      loading="lazy"
                      className="w-auto max-w-full h-auto max-h-[300px] md:max-h-[400px] object-contain"
                    />
                  </div>
                )}
                <ul className="space-y-3 text-sm text-gray-300 leading-relaxed">
                  {project.bullets.map((bullet) => (
                    <li key={bullet} className="pl-3 border-l-2 border-rh-green/30">
                      {bullet}
                    </li>
                  ))}
                </ul>
                {(project.githubUrl || project.liveUrl) && (
                  <div className="flex gap-2.5 pt-4 mt-4 border-t border-[#343b3f]">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-secondary flex-1 py-2.5 active:scale-95 transition-all"
                      >
                        <Github className="w-4 h-4" />
                        View Code
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-primary flex-1 py-2.5 active:scale-95 transition-all"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Visit Site
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  )
}
