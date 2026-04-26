import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Github, Linkedin, Mail } from 'lucide-react'
import type { SkillCategory } from '../types'
import SkillItem from './SkillItem'

interface AboutAndSkillsProps {
  skillCategories: SkillCategory[]
  searchQuery?: string
  showOnlyAbout?: boolean
  showOnlySkills?: boolean
  onSkillClick?: (skillName: string) => void
}

interface AboutMeData {
  name: string
  title: string
  location: string
  bio: string
}

const aboutData: AboutMeData = {
  name: 'Vandan Patel',
  title: 'CS, Finance & Data Science @ Rutgers Honors College',
  location: 'New York Metro Area',
  bio: "I build software that bridges the gap between complex business logic and intuitive product design. I’m the type of engineer who will gladly go the extra mile today to build a tool that saves ten minutes tomorrow. My background lets me zoom out to understand system dynamics, and zoom in to execute the details using React, TypeScript, and Python. Ultimately, I care about shipping the best possible solution, letting the problem dictate the tools rather than the other way around.",
}

// Emoji mapping for skill categories
const skillEmojis: Record<string, string> = {
  'technical': '💻',
  'financial': '📈',
  'tools': '🛠️',
  'soft': '🤝',
}

export default function AboutAndSkills({ skillCategories, searchQuery = '', showOnlyAbout = false, showOnlySkills = false, onSkillClick }: AboutAndSkillsProps) {
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

  return (
    <>
      {/* Desktop: Combined container */}
      <div className="hidden lg:block bg-black rounded-lg border border-[#2D2D2D]" data-section="about">
        {/* About Me Section */}
        <div className="border-b border-[#2D2D2D]">
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
                <div className="inline-flex items-center gap-2 px-1 pr-3 py-1 rounded-full bg-[#1C1C1E] border border-[#3A3A3C] text-xs mt-2">
                  <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center">
                    <img src="/images/tags/location.png" alt="" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-gray-300">{aboutData.location}</span>
                </div>
                
                {/* Social Links */}
                <div className="flex items-center gap-4 mt-4">
                  <button 
                    onClick={() => window.open('https://github.com/vp-27', '_blank')}
                    className="bg-[#1C1C1E] p-2 rounded-full border border-[#3A3A3C] text-gray-400 hover:text-white hover:bg-[#2A2A2D] transition-colors" 
                  >
                    <Github className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => window.open('https://www.linkedin.com/in/vandan-patel-vp/', '_blank')}
                    className="bg-[#1C1C1E] p-2 rounded-full border border-[#3A3A3C] text-gray-400 hover:text-white hover:bg-[#2A2A2D] transition-colors" 
                  >
                    <Linkedin className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => window.open('mailto:vrp77@scarletmail.rutgers.edu', '_blank')}
                    className="bg-[#1C1C1E] p-2 rounded-full border border-[#3A3A3C] text-gray-400 hover:text-white hover:bg-[#2A2A2D] transition-colors" 
                  >
                    <Mail className="w-4 h-4" />
                  </button>
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

        {/* Skills Section */}
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
                        className="w-full flex items-center justify-between px-4 py-3 bg-transparent hover:bg-[#1A1A1A] transition-colors focus:outline-none"
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
                            className="overflow-hidden bg-black"
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
      </div>

      {/* Mobile: Separate cards */}
      <div className="lg:hidden space-y-6">
        {/* About Me Card */}
        {!showOnlySkills && (
          <div data-section="about">
            <h2 className="text-2xl font-medium mb-3 text-left">About Me</h2>
            <div className="bg-[#0D0D0D] rounded-lg p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-base font-medium mb-1">{aboutData.name}</h3>
                    <p className="text-sm text-gray-400">{aboutData.title}</p>
                    <div className="inline-flex items-center gap-2 px-1 pr-3 py-1 rounded-full bg-[#1C1C1E] border border-[#3A3A3C] text-xs mt-2">
                      <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center">
                        <img src="/images/tags/location.png" alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-gray-300">{aboutData.location}</span>
                    </div>
                    
                    {/* Social Links */}
                    <div className="flex items-center gap-3 mt-3">
                      <button 
                        onClick={() => window.open('https://github.com/vp-27', '_blank')}
                        className="bg-[#1C1C1E] p-2 rounded-full border border-[#3A3A3C] text-gray-400 hover:text-white hover:bg-[#2A2A2D] transition-colors" 
                      >
                        <Github className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => window.open('https://www.linkedin.com/in/vandan-patel-vp/', '_blank')}
                        className="bg-[#1C1C1E] p-2 rounded-full border border-[#3A3A3C] text-gray-400 hover:text-white hover:bg-[#2A2A2D] transition-colors" 
                      >
                        <Linkedin className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => window.open('mailto:vrp77@scarletmail.rutgers.edu', '_blank')}
                        className="bg-[#1C1C1E] p-2 rounded-full border border-[#3A3A3C] text-gray-400 hover:text-white hover:bg-[#2A2A2D] transition-colors" 
                      >
                        <Mail className="w-4 h-4" />
                      </button>
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
              </div>
            </div>
          </div>
        )}

        {/* Skills Card */}
        {!showOnlyAbout && (
          <div data-section="skills">
            <h2 className="text-2xl font-medium mb-3 text-left">Skills</h2>
            <div className="bg-[#0D0D0D] rounded-lg border border-[#2D2D2D] overflow-hidden">
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
                          className="w-full flex items-center justify-between px-4 py-4 bg-transparent hover:bg-[#1A1A1A] transition-colors focus:outline-none"
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
                              className="overflow-hidden bg-black"
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
    </>
  )
}
