import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import ProjectCard from '../components/ProjectCard'
import { portfolioProjects } from '../data/portfolioData'

export default function ProjectsPage() {
  const navigate = useNavigate()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  return (
    <div className="min-h-screen bg-black text-white pb-28 md:pb-12">
      {/* Header */}
      <div className="sticky top-0 md:top-14 bg-black/95 backdrop-blur-sm z-10">
        <div className="relative flex items-center justify-center px-4 py-4 max-w-2xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="absolute left-4 p-1 hover:bg-[#1A1A1A] rounded-full transition-colors"
            aria-label="Back to timeline"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Projects</h1>
        </div>
      </div>

      {/* Projects List */}
      <div className="px-4 py-2 space-y-3 max-w-2xl mx-auto">
        {portfolioProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            isExpanded={expandedId === project.id}
            onToggle={() => setExpandedId((curr) => (curr === project.id ? null : project.id))}
            disableLayoutAnimation
          />
        ))}
      </div>

      {/* Bottom Navigation */}
    </div>
  )
}
