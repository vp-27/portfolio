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
      <div data-section="experience">
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
      <div data-section="projects">
        <h2 className="text-xl font-medium mb-3 text-left">Projects</h2>
        <div className="border-b border-gray-800 mb-4"></div>
        {filteredProjects.length === 0 && searchQuery ? (
          <p className="text-sm text-gray-400 text-center py-4">No projects match your search</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
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
              {/* Header with institution name and GPA */}
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-white text-lg">{edu.institution}</h3>
                <div className="text-right">
                  <div className="text-xs text-gray-500 mb-0.5">GPA</div>
                  <div className="text-lg font-bold text-[#00C805]">{edu.gpa}</div>
                </div>
              </div>
              
              {/* Degrees */}
              <div className="space-y-1.5 mb-3">
                {edu.degrees.map((degree, idx) => (
                  <p key={idx} className="text-sm text-gray-400 leading-relaxed font-medium">{degree}</p>
                ))}
              </div>
              
              {/* Location and Date */}
              <div className="flex items-center gap-4 text-xs mb-3">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#FF5000]" />
                  <span className="text-[#FF5000]">{edu.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#FF5000]" />
                  <span className="text-[#FF5000]">{edu.graduationDate}</span>
                </div>
              </div>
              
              {/* Honors */}
              {edu.honors && edu.honors.length > 0 && (
                <div className="pt-3 border-t border-gray-800">
                  <div className="mb-2">
                    <span className="text-sm font-semibold text-white">Honors & Recognition</span>
                  </div>
                  <div className="space-y-2">
                    {edu.honors.map((honor, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-[#00C805] mt-1 flex-shrink-0 text-xs">▸</span>
                        <span className="text-sm text-gray-300 leading-relaxed">{honor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                  <Calendar className="w-3 h-3 text-[#00C805]" />
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
