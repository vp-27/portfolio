import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import type { Experience, Project, Education } from '../types'
import ExperienceItem from './ExperienceItem'
import ProjectCard from './ProjectCard'
import { isNaturalLanguageQuery } from '../utils/aiAssistant'

interface PortfolioSectionsProps {
  experiences: Experience[]
  projects: Project[]
  education: Education[]
  highlightedItem?: { type: 'experience' | 'project' | 'education'; id: string } | null
  hoveredItem?: { type: 'experience' | 'project' | 'education'; id: string } | null
  searchQuery?: string
  hasAIResult?: boolean
  onItemHover?: (type: 'experience' | 'project' | 'education', id: string | null) => void
}

export default function PortfolioSections({ experiences, projects, education, highlightedItem, hoveredItem, searchQuery = '', hasAIResult = false, onItemHover }: PortfolioSectionsProps) {
  // Filter function for search
  const matchesSearch = (text: string) => {
    if (!searchQuery) return true
    if (isNaturalLanguageQuery(searchQuery)) return true
    return text.toLowerCase().includes(searchQuery.toLowerCase())
  }

  const matchedExperiences = experiences.filter(exp =>
    matchesSearch(exp.position) ||
    matchesSearch(exp.company) ||
    exp.bullets.some(b => matchesSearch(b))
  )

  const matchedProjects = projects.filter(proj =>
    matchesSearch(proj.name) ||
    matchesSearch(proj.subtitle) ||
    proj.bullets.some(b => matchesSearch(b)) ||
    (proj.technologies && proj.technologies.some(t => matchesSearch(t)))
  )

  // Fallback: If 0 items match the search query across both sections, OR if an AI result is active, show all items
  const noMatchesFound = matchedExperiences.length === 0 && matchedProjects.length === 0
  const shouldShowAll = noMatchesFound || hasAIResult || isNaturalLanguageQuery(searchQuery)

  const filteredExperiences = shouldShowAll ? experiences : matchedExperiences
  const filteredProjects = shouldShowAll ? projects : matchedProjects

  return (
    <div className="mt-10 space-y-8">
      {/* Professional Experience Section */}
      <div data-section="experience">
        <Link to="/experience" className="inline-flex items-center group/header lg:pointer-events-none select-none">
          <h2 className="text-2xl font-medium text-left text-white group-hover/header:text-[#00C805] lg:group-hover/header:text-white transition-colors flex items-center gap-1">
            Professional Experience
            <ChevronRight className="lg:hidden w-5 h-5 text-gray-400 group-hover/header:text-[#00C805] transition-colors mt-0.5" />
          </h2>
        </Link>
        <div className="hidden lg:block border-b border-[#2D2D2D] mt-2 mb-1" />
        <div className="lg:hidden mb-3" />
        {filteredExperiences.length === 0 && searchQuery ? (
          <p className="text-sm text-gray-400 text-center py-4">No experiences match your search</p>
        ) : (
          <div>
            {filteredExperiences.map((exp, index) => {
              const isHighlighted = !!(highlightedItem && highlightedItem.type === 'experience' && exp.id === highlightedItem.id)
              const isHovered = !!(hoveredItem && hoveredItem.type === 'experience' && exp.id === hoveredItem.id)
              return (
                <ExperienceItem
                  key={exp.id}
                  experience={exp}
                  isHighlighted={isHighlighted}
                  isHovered={isHovered}
                  isLast={index === filteredExperiences.length - 1}
                  onHover={(hoverActive) => onItemHover?.('experience', hoverActive ? exp.id : null)}
                />
              )
            })}
          </div>
        )}
      </div>

      {/* Projects Section */}
      <div data-section="projects">
        <Link to="/projects" className="inline-flex items-center group/header lg:pointer-events-none select-none">
          <h2 className="text-2xl font-medium text-left text-white group-hover/header:text-[#00C805] lg:group-hover/header:text-white transition-colors flex items-center gap-1">
            Projects
            <ChevronRight className="lg:hidden w-5 h-5 text-gray-400 group-hover/header:text-[#00C805] transition-colors mt-0.5" />
          </h2>
        </Link>
        <div className="hidden lg:block border-b border-[#2D2D2D] mt-2 mb-3" />
        <div className="lg:hidden mb-3" />
        {filteredProjects.length === 0 && searchQuery ? (
          <p className="text-sm text-gray-400 text-center py-4">No projects match your search</p>
        ) : (
          <div className="space-y-3">
            {filteredProjects.map((project) => {
              const isHighlighted = !!(highlightedItem && highlightedItem.type === 'project' && project.id === highlightedItem.id)
              const isHovered = !!(hoveredItem && hoveredItem.type === 'project' && project.id === hoveredItem.id)
              return (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isHighlighted={isHighlighted}
                  isHovered={isHovered}
                  disableLayoutAnimation
                  onHover={(hoverActive) => onItemHover?.('project', hoverActive ? project.id : null)}
                />
              )
            })}
          </div>
        )}
      </div>

      {/* Education Section */}
      <div data-section="education">
        <Link to="/education" className="inline-flex items-center group/header lg:pointer-events-none select-none">
          <h2 className="text-2xl font-medium text-left text-white group-hover/header:text-[#00C805] lg:group-hover/header:text-white transition-colors flex items-center gap-1">
            Education
            <ChevronRight className="lg:hidden w-5 h-5 text-gray-400 group-hover/header:text-[#00C805] transition-colors mt-0.5" />
          </h2>
        </Link>
        <div className="hidden lg:block border-b border-[#2D2D2D] mt-2 mb-1" />
        <div className="lg:hidden mb-3" />
        <div>
          {education.map((edu, index) => {
            const isEduHighlighted = !!(highlightedItem && highlightedItem.type === 'education' && edu.id === highlightedItem.id)
            const isEduHovered = !!(hoveredItem && hoveredItem.type === 'education' && edu.id === hoveredItem.id)
            const showGlow = isEduHighlighted || isEduHovered

            return (
              <div
                key={edu.id}
                onMouseEnter={() => onItemHover?.('education', edu.id)}
                onMouseLeave={() => onItemHover?.('education', null)}
                className={`
                  py-4 px-2 relative transition-all duration-300
                  ${index === education.length - 1 ? '' : 'border-b border-[#1E1E1E] lg:border-[#222]'}
                `}
                style={{
                  boxShadow: showGlow
                    ? '0 0 20px rgba(201, 162, 39, 0.4), inset 0 0 20px rgba(201, 162, 39, 0.1)'
                    : 'none',
                  borderRadius: showGlow ? '12px' : '0',
                  margin: showGlow ? '0 -8px' : '0',
                  padding: showGlow ? '16px 8px' : undefined,
                }}
              >
                {showGlow && (
                  <div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, rgba(201, 162, 39, 0.15) 0%, rgba(201, 162, 39, 0.05) 100%)',
                      border: '1px solid rgba(201, 162, 39, 0.3)',
                    }}
                  />
                )}
                <div className="relative z-10">
                  {/* Header with institution name and GPA */}
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-white text-base">{edu.institution}</h3>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                      <span className="text-xs text-gray-500 font-medium">GPA</span>
                      <div className="px-2.5 py-1 rounded-lg bg-[#00C805] text-black text-xs font-bold">
                        {edu.gpa}
                      </div>
                    </div>
                  </div>

                  {/* Degrees */}
                  <div className="space-y-1 mb-2">
                    {edu.degrees.map((degree, idx) => (
                      <p key={idx} className="text-sm text-gray-400 leading-relaxed">{degree}</p>
                    ))}
                  </div>

                  {/* Location and Date - Pill style with icon circles */}
                  <div className="flex items-center gap-2 text-xs flex-wrap">
                    <div className="inline-flex items-center gap-2 px-1 pr-3 py-1 rounded-full bg-[#1E2124] border border-[#3A3A3C]">
                      <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center">
                        <img src="/images/tags/location.png" alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-gray-300">{edu.location}</span>
                    </div>
                    <div className="inline-flex items-center gap-2 px-1 pr-3 py-1 rounded-full bg-[#1E2124] border border-[#3A3A3C]">
                      <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center">
                        <img src="/images/tags/calendar.png" alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-gray-300">{edu.graduationDate}</span>
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

                  {/* Certifications (Nested in Education) */}
                  {edu.certifications && edu.certifications.length > 0 && (
                    <div className="pt-3 mt-3">
                      <div className="mb-2">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Certifications</span>
                      </div>
                      <div className="space-y-2">
                        {edu.certifications.map((cert) => (
                          <div key={cert.id} className="flex items-start gap-2">
                            <span className="text-[#00C805] mt-0.5 flex-shrink-0 text-[10px]">▸</span>
                            <div className="flex flex-col">
                              <span className="text-sm text-gray-300 leading-tight">{cert.name}</span>
                              <span className="text-[11px] text-gray-500 mt-0.5">{cert.issuer}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
