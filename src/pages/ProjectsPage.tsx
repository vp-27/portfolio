import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ExternalLink, Github } from 'lucide-react'
import BottomNav from '../components/BottomNav'
import { mockProjects } from '../data/mockData'

export default function ProjectsPage() {
  const navigate = useNavigate()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-sm z-10">
        <div className="relative flex items-center justify-center px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-4 p-1 hover:bg-[#1A1A1A] rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Projects</h1>
        </div>
      </div>

      {/* Projects List - Discover More Card Style */}
      <div className="px-4 py-2 space-y-3">
        {mockProjects.map((project, index) => {
          const isExpanded = expandedId === project.id

          return (
            <motion.div
              layout="position"
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, layout: { type: 'tween', ease: 'easeOut', duration: 0.22 } }}
              onClick={() => toggleExpand(project.id)}
              className="bg-[#1E2124] rounded-2xl overflow-hidden cursor-pointer hover:bg-[#2A2D31] transition-colors"
            >
              {/* Card Header */}
              <div className="p-4">
                <div className="flex items-start gap-4">
                  {/* Left side: Title, Subtitle, Tags */}
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-white text-[17px] leading-tight mb-1">
                      {project.name}
                    </h2>
                    <p className="text-[13px] text-gray-400 mb-3 line-clamp-2">
                      {project.subtitle}
                    </p>

                    {/* Tech Tags */}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {project.technologies.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 text-[10px] font-semibold rounded-full bg-[#2A2A2D] text-gray-300 whitespace-nowrap"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right side: Large Logo */}
                  <div className="flex-shrink-0 w-[80px] h-[80px] flex items-center justify-center">
                    {project.logoUrl ? (
                      <img
                        src={project.logoUrl}
                        alt={`${project.name} logo`}
                        className="w-full h-full object-contain"
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
              </div>

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
                    <div className="px-4 pb-4">
                      {/* Duration */}
                      <p className="text-xs text-gray-500 mb-3">{project.duration}</p>

                      {/* Project Image if exists - capped height for vertical screenshots */}
                      {project.imageUrl && (
                        <div className="mb-4 rounded-xl overflow-hidden border border-[#2C2C2E] max-h-[300px] flex items-center justify-center bg-black">
                          <img
                            src={project.imageUrl}
                            alt={project.name}
                            className="w-auto max-w-full h-auto max-h-[300px] object-contain"
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



                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-3 border-t border-[#2C2C2E]">
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
            </motion.div>
          )
        })}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
