import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ExternalLink, Github } from 'lucide-react'
import BottomNav from '../components/BottomNav'
import { mockProjects } from '../data/mockData'

export default function ProjectsPage() {
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const getAccentColor = (id: string) => {
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return hash % 2 === 0 ? '#00C805' : '#FF5000'
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

      {/* Projects List */}
      <div className="px-4 py-4">
        <div className="space-y-4">
          {mockProjects.map((project, index) => {
            const accentColor = getAccentColor(project.id)
            
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1C1C1E] rounded-xl p-5"
              >
                {/* Header with Logo */}
                <div className="flex gap-4 mb-4">
                  {project.logoUrl && (
                    <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center">
                      <img 
                        src={project.logoUrl} 
                        alt={`${project.name} logo`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h2 className="font-bold text-white text-lg mb-1">{project.name}</h2>
                    <p className="text-xs text-gray-500 mb-1">{project.duration}</p>
                    <p className="text-sm text-gray-400">{project.subtitle}</p>
                  </div>
                </div>

                {/* Project Image if exists */}
                {project.imageUrl && (
                  <div 
                    className="mb-4 rounded-lg overflow-hidden border-2"
                    style={{ borderColor: accentColor }}
                  >
                    <img 
                      src={project.imageUrl} 
                      alt={project.name}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                )}

                {/* Bullets */}
                <div className="space-y-2.5 mb-4">
                  {project.bullets.map((bullet, idx) => (
                    <div
                      key={idx}
                      className="flex gap-3 text-sm text-gray-300 leading-relaxed"
                    >
                      <span className="text-[#00C805] mt-0.5 flex-shrink-0 text-xs">▸</span>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>

                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 text-[11px] font-semibold rounded-full bg-[#2C2C2E] text-gray-300"
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
                      onClick={() => window.open(project.liveUrl, '_blank')}
                      style={{
                        backgroundColor: accentColor,
                        color: accentColor === '#00C805' ? '#000' : '#fff'
                      }}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-lg transition-all active:scale-95 flex-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Visit Site
                    </button>
                  )}
                  {project.githubUrl && (
                    <button
                      onClick={() => window.open(project.githubUrl, '_blank')}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#2C2C2E] hover:bg-[#3A3A3C] text-white text-xs font-semibold rounded-lg transition-all active:scale-95 flex-1"
                    >
                      <Github className="w-3.5 h-3.5" />
                      View Code
                    </button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
