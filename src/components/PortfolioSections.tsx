import { MapPin, Calendar } from 'lucide-react'
import type { Experience, Project, Education, Certification } from '../types'
import ExperienceItem from './ExperienceItem'
import ProjectCard from './ProjectCard'

interface PortfolioSectionsProps {
  experiences: Experience[]
  projects: Project[]
  education: Education[]
  certifications: Certification[]
  highlightedItem?: string | null
  searchQuery?: string
}

export default function PortfolioSections({ experiences, projects, education, certifications, highlightedItem, searchQuery = '' }: PortfolioSectionsProps) {
  // Filter function for search
  const matchesSearch = (text: string) => {
    if (!searchQuery) return true
    return text.toLowerCase().includes(searchQuery.toLowerCase())
  }

  const filteredExperiences = experiences.filter(exp => 
    matchesSearch(exp.position) || 
    matchesSearch(exp.company) || 
    exp.bullets.some(b => matchesSearch(b))
  )

  const filteredProjects = projects.filter(proj => 
    matchesSearch(proj.name) || 
    matchesSearch(proj.subtitle) || 
    proj.bullets.some(b => matchesSearch(b)) ||
    (proj.technologies && proj.technologies.some(t => matchesSearch(t)))
  )

  return (
    <div className="mt-8 space-y-6">
      {/* Professional Experience Section */}
      <div>
        <h2 className="text-xl font-medium mb-3 text-left">Professional Experience</h2>
        <div className="border-b border-gray-800 mb-4"></div>
        {filteredExperiences.length === 0 && searchQuery ? (
          <p className="text-sm text-gray-400 text-center py-4">No experiences match your search</p>
        ) : (
          <div className="space-y-3">
            {filteredExperiences.map((exp) => {
              const isHighlighted = !!(highlightedItem && exp.company.includes(highlightedItem))
              return (
                <ExperienceItem 
                  key={exp.id}
                  experience={exp}
                  isHighlighted={isHighlighted}
                />
              )
            })}
          </div>
        )}
      </div>

      {/* Projects Section */}
      <div>
        <h2 className="text-xl font-medium mb-3 text-left">Projects</h2>
        <div className="border-b border-gray-800 mb-4"></div>
        {filteredProjects.length === 0 && searchQuery ? (
          <p className="text-sm text-gray-400 text-center py-4">No projects match your search</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProjects.map((project) => {
              const isHighlighted = !!(highlightedItem && project.name.includes(highlightedItem))
              return (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isHighlighted={isHighlighted}
                />
              )
            })}
          </div>
        )}
      </div>

      {/* Education Section */}
      <div data-section="education">
        <h2 className="text-xl font-medium mb-3 text-left">Education</h2>
        <div className="border-b border-gray-800 mb-4"></div>
        <div className="space-y-3">
          {education.map((edu) => (
            <div key={edu.id} className="bg-transparent border border-gray-800 rounded-lg p-6 hover:border-gray-600 hover:bg-[#0A0A0A] transition-all">
              <h3 className="font-medium text-white mb-2">{edu.institution}</h3>
              {edu.degrees.map((degree, idx) => (
                <p key={idx} className="text-sm text-gray-300 mb-1">{degree}</p>
              ))}
              <div className="flex items-center gap-4 text-xs text-gray-400 mt-2 mb-3">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{edu.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{edu.graduationDate}</span>
                </div>
              </div>
              <p className="text-sm text-gray-300 mb-2">GPA: <span className="text-[#FF5000] font-medium">{edu.gpa}</span></p>
              <div className="text-sm text-gray-300">
                <p className="font-medium mb-1">Honors:</p>
                <ul className="space-y-1">
                  {edu.honors.map((honor, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-[#FF5000]">•</span>
                      <span>{honor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications Section */}
      <div>
        <h2 className="text-xl font-medium mb-3 text-left">Certifications</h2>
        <div className="border-b border-gray-800 mb-4"></div>
        <div className="space-y-3">
          {certifications.map((cert) => (
            <div key={cert.id} className="bg-transparent border border-gray-800 rounded-lg p-6 hover:border-gray-600 hover:bg-[#0A0A0A] transition-all">
              <h3 className="font-medium text-white">{cert.name}</h3>
              <p className="text-sm text-gray-400">{cert.issuer}</p>
              {cert.date && (
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                  <Calendar className="w-3 h-3" />
                  <span>{cert.date}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
