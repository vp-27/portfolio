import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Mail, ExternalLink } from 'lucide-react'
import type { SkillCategory } from '../types'
import SkillItem from './SkillItem'

interface AboutAndSkillsProps {
  skillCategories: SkillCategory[]
  searchQuery?: string
  showOnlyAbout?: boolean
  showOnlySkills?: boolean
  showOnlyContact?: boolean
  onSkillClick?: (skillName: string) => void
  isContactHighlighted?: boolean
}

interface AboutMeData {
  name: string
  title: string
  location: string
  bio: string
  avatar: string
}

const aboutData: AboutMeData = {
  name: 'Vandan Patel',
  title: 'CS, Finance & Data Science @ Rutgers Honors College',
  location: 'New York Metro Area',
  bio: "I design and build solutions at the intersection of finance, data science, and technology. I’m the type of builder who will gladly go the extra mile today to build a tool that saves ten minutes tomorrow. My background lets me zoom out to understand system dynamics, and zoom in to execute the details using React, TypeScript, and Python. Ultimately, I care about shipping the best possible solution, letting the problem dictate the tools rather than the other way around.",
  avatar: '/images/pfp_theme transparent.png'
}

// Emoji mapping for skill categories
const skillEmojis: Record<string, string> = {
  'technical': '💻',
  'financial': '📈',
  'tools': '🛠️',
  'soft': '🤝',
}

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
)

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

export default function AboutAndSkills({ 
  skillCategories, 
  searchQuery = '', 
  showOnlyAbout = false, 
  showOnlySkills = false, 
  showOnlyContact = false,
  onSkillClick, 
  isContactHighlighted = false 
}: AboutAndSkillsProps) {
  const [expandedLists, setExpandedLists] = useState<Set<string>>(new Set())
  const [isHovered, setIsHovered] = useState(false)

  // Filter skills based on search query
  const filteredSkillCategories = skillCategories.map(category => ({
    ...category,
    skills: category.skills.filter(skill =>
      !searchQuery || skill.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.skills.length > 0)

  const toggleList = (listId: string) => {
    const newExpanded = new Set(expandedLists)
    if (newExpanded.has(listId)) {
      newExpanded.delete(listId)
    } else {
      newExpanded.add(listId)
    }
    setExpandedLists(newExpanded)
  }

  // Desktop Combined View
  const isDesktopOnly = !showOnlyAbout && !showOnlySkills && !showOnlyContact

  return (
    <>
      {/* Desktop: Combined container */}
      <div className="hidden lg:block bg-black rounded-lg border border-[#2D2D2D]">
        {/* About Me Section */}
        {(isDesktopOnly || showOnlyAbout) && (
          <div className="border-b border-[#2D2D2D]" data-section="about">
            <div className="flex items-center border-b border-[#2D2D2D]">
              <div className="flex-1 py-3 px-4 text-white font-bold text-left">
                About Me
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-medium mb-2 text-white">{aboutData.name}</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">{aboutData.title}</p>
                  <div className="inline-flex items-center gap-2 px-1 pr-3 py-1 rounded-full bg-[#1E2124] border border-[#3A3A3C] text-xs mt-2">
                    <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center">
                      <img src="/images/tags/location.png" alt="" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-gray-300">{aboutData.location}</span>
                  </div>
                </div>

                {/* Profile Picture with hover effect */}
                <div
                  className="relative w-32 h-32 cursor-pointer flex-shrink-0 overflow-visible"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <img
                    src="/images/pfp_theme%20transparent.png"
                    alt="Vandan Patel - Themed"
                    className={`absolute -top-4 -right-4 w-40 h-40 object-contain transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
                  />
                  <img
                    src="/images/pfp_original.jpg"
                    alt="Vandan Patel - Original"
                    className={`absolute top-0 right-0 w-32 h-32 object-cover rounded-full transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#2D2D2D]">
                <p className="text-sm text-gray-300 leading-relaxed">
                  {aboutData.bio}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Contact Me Section */}
        {(isDesktopOnly || showOnlyContact) && (
          <div 
            className={`border-b border-[#2D2D2D] transition-colors duration-500 ${isContactHighlighted ? 'bg-[#FFD700]/5' : ''}`} 
            data-section="contact"
          >
            <div className={`px-4 py-3 border-b border-[#2D2D2D] flex items-center justify-between ${isContactHighlighted ? 'border-[#FFD700]/50' : ''}`}>
              <span className={`font-bold transition-colors ${isContactHighlighted ? 'text-[#FFD700]' : 'text-white'}`}>Contact Me</span>
            </div>
            <div>
              <button 
                onClick={() => window.open('https://github.com/vp-27', '_blank')}
                className="w-full flex items-center justify-between px-4 py-3 bg-transparent hover:bg-[#2A2D31] transition-colors focus:outline-none group border-b border-[#2D2D2D]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-12 bg-[#1A1A1A] rounded-md flex items-center justify-center text-lg">
                    <GithubIcon className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-white font-semibold">GitHub</span>
                </div>
                <div className="text-gray-500 group-hover:text-[#00C805] transition-colors">
                  <ExternalLink className="w-5 h-5" />
                </div>
              </button>
              <button 
                onClick={() => window.open('https://www.linkedin.com/in/vandan-patel-vp/', '_blank')}
                className="w-full flex items-center justify-between px-4 py-3 bg-transparent hover:bg-[#2A2D31] transition-colors focus:outline-none group border-b border-[#2D2D2D]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-12 bg-[#1A1A1A] rounded-md flex items-center justify-center text-lg">
                    <LinkedinIcon className="w-6 h-6 text-gray-400 group-hover:text-[#0A66C2] transition-colors" />
                  </div>
                  <span className="text-white font-semibold">LinkedIn</span>
                </div>
                <div className="text-gray-500 group-hover:text-[#00C805] transition-colors">
                  <ExternalLink className="w-5 h-5" />
                </div>
              </button>
              <button 
                onClick={() => window.open('mailto:vrp77@scarletmail.rutgers.edu', '_blank')}
                className="w-full flex items-center justify-between px-4 py-3 bg-transparent hover:bg-[#2A2D31] transition-colors focus:outline-none group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-12 bg-[#1A1A1A] rounded-md flex items-center justify-center text-lg">
                    <Mail className="w-6 h-6 text-gray-400 group-hover:text-[#EA4335] transition-colors" />
                  </div>
                  <span className="text-white font-semibold">Email</span>
                </div>
                <div className="text-gray-500 group-hover:text-[#00C805] transition-colors">
                  <ExternalLink className="w-5 h-5" />
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Skills Section */}
        {(isDesktopOnly || showOnlySkills) && (
          <div>
            <div className="flex items-center border-b border-[#2D2D2D] px-4 py-3">
              <span className="text-white font-bold">Skills</span>
            </div>

            <div>
              {filteredSkillCategories.length === 0 && searchQuery ? (
                <p className="text-sm text-gray-400 text-center py-4 px-4">No skills match your search</p>
              ) : (
                <>
                  {filteredSkillCategories.map((category) => {
                    const isExpanded = expandedLists.has(category.id)

                    return (
                      <motion.div key={category.id} layout>
                        <button
                          onClick={() => toggleList(category.id)}
                          className="w-full flex items-center justify-between px-4 py-3 bg-transparent hover:bg-[#2A2D31] transition-colors focus:outline-none"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-12 bg-[#1A1A1A] rounded-md flex items-center justify-center text-lg">
                              {skillEmojis[category.icon] || '📦'}
                            </div>
                            <span className="text-white font-semibold">{category.name}</span>
                          </div>
                          <motion.div
                            animate={{ rotate: isExpanded ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-gray-400"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </motion.div>
                        </button>

                        <AnimatePresence>
                          {isExpanded && category.skills.length > 0 && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: [0.4, 0.0, 0.2, 1] }}
                              className="overflow-hidden bg-transparent"
                            >
                              <div>
                                {category.skills.map((skill) => (
                                  <SkillItem 
                                    key={skill.id} 
                                    skill={skill} 
                                    categoryIcon={category.icon} 
                                    onClick={() => onSkillClick?.(skill.name)}
                                    isActive={searchQuery === skill.name}
                                  />
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )
                  })}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile: Separate cards */}
      <div className="lg:hidden space-y-6">
        {/* About Me Card */}
        {showOnlyAbout && (
          <div data-section="about">
            <h2 className="text-2xl font-medium mb-3 text-left">About Me</h2>
            <div className="bg-[#1E2124] rounded-lg p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-base font-medium mb-1">{aboutData.name}</h3>
                    <p className="text-sm text-gray-400">{aboutData.title}</p>
                    <div className="inline-flex items-center gap-2 px-1 pr-3 py-1 rounded-full bg-[#1E2124] border border-[#3A3A3C] text-xs mt-2">
                      <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center">
                        <img src="/images/tags/location.png" alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-gray-300">{aboutData.location}</span>
                    </div>
                  </div>

                  {/* Profile Picture with hover effect */}
                  <div
                    className="relative w-28 h-28 cursor-pointer flex-shrink-0 overflow-visible"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <img
                      src="/images/pfp_theme%20transparent.png"
                      alt="Vandan Patel - Themed"
                      className={`absolute -top-3 -right-3 w-36 h-36 object-contain transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
                    />
                    <img
                      src="/images/pfp_original.jpg"
                      alt="Vandan Patel - Original"
                      className={`absolute top-0 right-0 w-28 h-28 object-cover rounded-full transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {aboutData.bio}
                  </p>
                </div>

                {/* Integrated Contact Row for Mobile */}
                <div className="flex items-center gap-2 pt-4 border-t border-[#2C2C2E]" data-section="contact">
                  <button
                    onClick={() => window.open('https://github.com/vp-27', '_blank')}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-[#1A1A1A] hover:bg-[#2A2A2A] active:bg-[#333333] border border-[#2D2D2D] rounded-xl text-xs font-medium text-white transition-colors"
                  >
                    <GithubIcon className="w-4 h-4 text-gray-300" />
                    <span>GitHub</span>
                  </button>
                  <button
                    onClick={() => window.open('https://www.linkedin.com/in/vandan-patel-vp/', '_blank')}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-[#1A1A1A] hover:bg-[#2A2A2A] active:bg-[#333333] border border-[#2D2D2D] rounded-xl text-xs font-medium text-white transition-colors"
                  >
                    <LinkedinIcon className="w-4 h-4 text-[#0A66C2]" />
                    <span>LinkedIn</span>
                  </button>
                  <button
                    onClick={() => window.open('mailto:vrp77@scarletmail.rutgers.edu', '_blank')}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-[#1A1A1A] hover:bg-[#2A2A2A] active:bg-[#333333] border border-[#2D2D2D] rounded-xl text-xs font-medium text-white transition-colors"
                  >
                    <Mail className="w-4 h-4 text-[#EA4335]" />
                    <span>Email</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Skills Card */}
        {showOnlySkills && (
          <div data-section="skills">
            <h2 className="text-2xl font-medium mb-3 text-left">Skills</h2>
            <div className="bg-[#1E2124] rounded-lg border border-[#2D2D2D] overflow-hidden">
              {filteredSkillCategories.length === 0 && searchQuery ? (
                <p className="text-sm text-gray-400 text-center py-4 px-4">No skills match your search</p>
              ) : (
                <>
                  {filteredSkillCategories.map((category) => {
                    const isExpanded = expandedLists.has(category.id)

                    return (
                      <motion.div key={category.id} layout>
                        <button
                          onClick={() => toggleList(category.id)}
                          className="w-full flex items-center justify-between px-4 py-4 bg-transparent hover:bg-[#2A2D31] transition-colors focus:outline-none"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-16 bg-[#1A1A1A] rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                              {skillEmojis[category.icon] || '📦'}
                            </div>
                            <div className="flex flex-col items-start">
                              <span className="text-white text-base font-semibold">{category.name}</span>
                              <span className="text-gray-500 text-sm">{category.skills.length} {category.skills.length === 1 ? 'item' : 'items'}</span>
                            </div>
                          </div>
                          <motion.div
                            animate={{ rotate: isExpanded ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-gray-400"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </motion.div>
                        </button>

                        <AnimatePresence>
                          {isExpanded && category.skills.length > 0 && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: [0.4, 0.0, 0.2, 1] }}
                              className="overflow-hidden bg-transparent"
                            >
                              <div>
                                {category.skills.map((skill) => (
                                  <SkillItem 
                                    key={skill.id} 
                                    skill={skill} 
                                    categoryIcon={category.icon} 
                                    onClick={() => onSkillClick?.(skill.name)}
                                    isActive={searchQuery === skill.name}
                                  />
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )
                  })}
                </>
              )}
            </div>
          </div>
        )}

        {/* Contact Me Card */}
        {showOnlyContact && (
          <div data-section="contact">
            <h2 className="text-2xl font-medium mb-3 text-left">Contact Me</h2>
            <div className="bg-[#1E2124] rounded-lg border border-[#2D2D2D] overflow-hidden">
              <div 
                className={`transition-colors duration-500 ${isContactHighlighted ? 'bg-[#FFD700]/5' : ''}`} 
              >
                <div className="bg-transparent">
                  <button 
                    onClick={() => window.open('https://github.com/vp-27', '_blank')}
                    className="w-full px-6 py-4 flex items-center justify-between active:bg-[#1A1A1A] transition-colors border-b border-[#2D2D2D]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-16 bg-[#1A1A1A] rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                        <GithubIcon className="w-8 h-8 text-gray-400" />
                      </div>
                      <span className="text-white font-semibold">GitHub</span>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-500" />
                  </button>
                  <button 
                    onClick={() => window.open('https://www.linkedin.com/in/vandan-patel-vp/', '_blank')}
                    className="w-full px-6 py-4 flex items-center justify-between active:bg-[#1A1A1A] transition-colors border-b border-[#2D2D2D]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-16 bg-[#1A1A1A] rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                        <LinkedinIcon className="w-8 h-8 text-[#0A66C2]" />
                      </div>
                      <span className="text-white font-semibold">LinkedIn</span>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-500" />
                  </button>
                  <button 
                    onClick={() => window.open('mailto:vrp77@scarletmail.rutgers.edu', '_blank')}
                    className="w-full px-6 py-4 flex items-center justify-between active:bg-[#1A1A1A] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-16 bg-[#1A1A1A] rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                        <Mail className="w-8 h-8 text-[#EA4335]" />
                      </div>
                      <span className="text-white font-semibold">Email</span>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
