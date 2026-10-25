import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import ExperienceItem from '../components/ExperienceItem'
import { professionalExperiences } from '../data/portfolioData'

export default function ExperiencePage() {
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
          <h1 className="text-lg font-semibold">Professional Experience</h1>
        </div>
      </div>

      {/* Experience List */}
      <div className="px-4 py-2 max-w-2xl mx-auto">
        <div>
          {professionalExperiences.map((exp, index) => (
            <ExperienceItem
              key={exp.id}
              experience={exp}
              isExpanded={expandedId === exp.id}
              onToggle={() => setExpandedId((curr) => (curr === exp.id ? null : exp.id))}
              isLast={index === professionalExperiences.length - 1}
            />
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
    </div>
  )
}
