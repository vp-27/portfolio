import { Link } from 'react-router-dom'
import { MapPin, Calendar, ChevronRight } from 'lucide-react'
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
    <div className="mt-10 space-y-8">
      {/* Professional Experience Section */}
      <div data-section="experience">
        <div className="flex items-center">
          <h2 className="text-2xl lg:text-xl font-medium text-left">Professional Experience</h2>
          <Link to="/experience" className="lg:hidden flex items-center">
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
        </div>
        <div className="hidden lg:block border-b border-[#2D2D2D] mt-2 mb-1" />
        <div className="lg:hidden mb-3" />
        {filteredExperiences.length === 0 && searchQuery ? (
          <p className="text-sm text-gray-400 text-center py-4">No experiences match your search</p>
        ) : (
          <div>
            {filteredExperiences.map((exp, index) => {
              const isHighlighted = !!(highlightedItem && exp.company.includes(highlightedItem))
              return (
                <ExperienceItem
                  key={exp.id}
                  experience={exp}
                  isHighlighted={isHighlighted}
                  isLast={index === filteredExperiences.length - 1}
                />
              )
            })}
          </div>
        )}
      </div>

      {/* Projects Section */}
      <div data-section="projects">
        <div className="flex items-center">
          <h2 className="text-2xl lg:text-xl font-medium text-left">Projects</h2>
          <Link to="/projects" className="lg:hidden flex items-center">
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
        </div>
        <div className="hidden lg:block border-b border-[#2D2D2D] mt-2 mb-3" />
        <div className="lg:hidden mb-3" />
        {filteredProjects.length === 0 && searchQuery ? (
          <p className="text-sm text-gray-400 text-center py-4">No projects match your search</p>
        ) : (
          <div className="space-y-3">
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
        <div className="flex items-center">
          <h2 className="text-2xl lg:text-xl font-medium text-left">Education</h2>
          <Link to="/education" className="lg:hidden flex items-center">
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
        </div>
        <div className="hidden lg:block border-b border-[#2D2D2D] mt-2 mb-1" />
        <div className="lg:hidden mb-3" />
        <div>
          {education.map((edu, index) => (
            <div
              key={edu.id}
              className={`bg-transparent py-4 cursor-default ${index === education.length - 1 ? '' : 'border-b border-[#1E1E1E] lg:border-[#222]'}`}
            >
              {/* Header with institution name and GPA */}
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-white text-base">{edu.institution}</h3>
                <div className="text-right flex-shrink-0 ml-4">
                  <div className="text-[10px] text-gray-500 mb-0.5">GPA</div>
                  <div className="text-base font-bold text-[#00C805]">{edu.gpa}</div>
                </div>
              </div>

              {/* Degrees */}
              <div className="space-y-1 mb-2">
                {edu.degrees.map((degree, idx) => (
                  <p key={idx} className="text-sm text-gray-400 leading-relaxed">{degree}</p>
                ))}
              </div>

              {/* Location and Date */}
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-[#FF5000]" />
                  <span className="text-[#FF5000]">{edu.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-[#FF5000]" />
                  <span className="text-[#FF5000]">{edu.graduationDate}</span>
                </div>
              </div>

              {/* Honors */}
              {edu.honors && edu.honors.length > 0 && (
                <div className="pt-3 mt-3">
                  <div className="mb-2">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Honors & Recognition</span>
                  </div>
                  <div className="space-y-1.5">
                    {edu.honors.map((honor, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-[#00C805] mt-0.5 flex-shrink-0 text-[10px]">▸</span>
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
        <div className="flex items-center">
          <h2 className="text-2xl lg:text-xl font-medium text-left">Certifications</h2>
          <Link to="/education" className="lg:hidden flex items-center">
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
        </div>
        <div className="hidden lg:block border-b border-[#2D2D2D] mt-2 mb-1" />
        <div className="lg:hidden mb-3" />
        <div>
          {certifications.map((cert, index) => (
            <div
              key={cert.id}
              className={`bg-transparent py-3 cursor-default ${index === certifications.length - 1 ? '' : 'border-b border-[#1E1E1E] lg:border-[#222]'}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-white text-sm">{cert.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{cert.issuer}</p>
                </div>
                {cert.date && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
                    <Calendar className="w-3 h-3 text-[#00C805]" />
                    <span>{cert.date}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
