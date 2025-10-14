import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Plus, MapPin } from 'lucide-react'
import type { SkillCategory } from '../types'
import SkillItem from './SkillItem'

interface AboutAndSkillsProps {
  skillCategories: SkillCategory[]
  searchQuery?: string
  showOnlyAbout?: boolean
  showOnlySkills?: boolean
}

interface AboutMeData {
  name: string
  title: string
  location: string
  bio: string
}

const aboutData: AboutMeData = {
  name: 'Vandan Patel',
  title: 'Finance & Computer Science @ Rutgers Business School',
  location: 'Secaucus, NJ',
  bio: 'Finance and Computer Science student with experience in algorithmic trading, financial modeling, and full-stack development. Passionate about bridging quantitative finance with modern technology to build scalable solutions.',
}

// Emoji mapping for skill categories
const skillEmojis: Record<string, string> = {
  'technical': '💻',
  'financial': '📈',
  'tools': '🛠️',
  'soft': '🤝',
}

export default function AboutAndSkills({ skillCategories, searchQuery = '', showOnlyAbout = false, showOnlySkills = false }: AboutAndSkillsProps) {
  const [expandedLists, setExpandedLists] = useState<Set<string>>(new Set())

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
            <div>
              <h3 className="text-xl font-medium mb-2 text-white">{aboutData.name}</h3>
              <p className="text-sm text-gray-300 leading-relaxed">{aboutData.title}</p>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-400 pt-2">
              <MapPin className="w-4 h-4" />
              <span>{aboutData.location}</span>
            </div>

            <div className="pt-2 border-t border-[#2D2D2D]">
              <p className="text-sm text-gray-300 leading-relaxed">
                {aboutData.bio}
              </p>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div>
          <div className="flex items-center justify-between border-b border-[#2D2D2D] px-4 py-3">
            <span className="text-white font-bold">Skills</span>
            <button className="bg-transparent text-gray-400 hover:text-white transition-colors" aria-label="Add skill">
              <Plus className="w-5 h-5" />
            </button>
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
                    className="w-full flex items-center justify-between px-4 py-3 bg-transparent hover:bg-[#1A1A1A] transition-colors"
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
                        {category.skills.map((skill, idx) => (
                          <motion.div
                            key={skill.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.02 }}
                          >
                            <SkillItem skill={skill} categoryIcon={category.icon} />
                          </motion.div>
                        ))}
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
            <h2 className="text-xl font-medium mb-3 text-left">About Me</h2>
            <div className="bg-[#0D0D0D] rounded-lg p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-medium mb-1">{aboutData.name}</h3>
                  <p className="text-sm text-gray-400">{aboutData.title}</p>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{aboutData.location}</span>
                </div>

                <p className="text-sm text-gray-400 leading-relaxed">
                  {aboutData.bio}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Skills Card */}
        {!showOnlyAbout && (
          <div data-section="skills">
            <h2 className="text-xl font-medium mb-3 text-left">Skills</h2>
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
                    className="w-full flex items-center justify-between px-4 py-4 bg-transparent hover:bg-[#1A1A1A] transition-colors"
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
                        {category.skills.map((skill, idx) => (
                          <motion.div
                            key={skill.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.02 }}
                          >
                            <SkillItem skill={skill} categoryIcon={category.icon} />
                          </motion.div>
                        ))}
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
