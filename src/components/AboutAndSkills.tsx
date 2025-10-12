import { useState } from 'react'
import { ChevronUp, ChevronDown, Plus, MapPin } from 'lucide-react'
import type { SkillCategory } from '../types'
import SkillItem from './SkillItem'

interface AboutAndSkillsProps {
  skillCategories: SkillCategory[]
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

export default function AboutAndSkills({ skillCategories }: AboutAndSkillsProps) {
  const [expandedLists, setExpandedLists] = useState<Set<string>>(new Set())

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
      <div className="hidden lg:block bg-black rounded-lg border border-[#2D2D2D]">
        {/* About Me Section */}
        <div className="border-b border-[#2D2D2D]">
          <div className="flex items-center border-b border-[#2D2D2D]">
            <div className="flex-1 py-3 px-4 text-white font-medium text-left">
              About Me
            </div>
          </div>
          
          <div className="p-4 space-y-4">
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

        {/* Skills Section */}
        <div>
          <div className="flex items-center justify-between border-b border-[#2D2D2D] px-4 py-3">
            <span className="text-white font-medium">Skills</span>
            <button className="bg-transparent text-gray-400 hover:text-white transition-colors" aria-label="Add skill">
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          <div>
            {skillCategories.map((category) => {
              const isExpanded = expandedLists.has(category.id)
              
              return (
                <div key={category.id}>
                  <button
                    onClick={() => toggleList(category.id)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-transparent hover:bg-[#1A1A1A] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-lg">
                        {skillEmojis[category.icon] || '📦'}
                      </div>
                      <span className="text-white">{category.name}</span>
                    </div>
                    <div className="text-gray-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>
                  
                  {isExpanded && category.skills.length > 0 && (
                    <div className="bg-black">
                      {category.skills.map((skill) => (
                        <SkillItem key={skill.id} skill={skill} />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Mobile: Separate cards */}
      <div className="lg:hidden space-y-6">
        {/* About Me Card */}
        <div>
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

        {/* Skills Card */}
        <div>
          <h2 className="text-xl font-medium mb-3 text-left">Skills</h2>
          <div className="bg-[#0D0D0D] rounded-lg border border-[#2D2D2D] overflow-hidden">
            {skillCategories.map((category) => {
              const isExpanded = expandedLists.has(category.id)
              
              return (
                <div key={category.id}>
                  <button
                    onClick={() => toggleList(category.id)}
                    className="w-full flex items-center justify-between px-4 py-4 bg-transparent hover:bg-[#1A1A1A] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-[#2D2D2D] rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                        {skillEmojis[category.icon] || '📦'}
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-white text-base font-normal">{category.name}</span>
                        <span className="text-gray-500 text-sm">{category.skills.length} {category.skills.length === 1 ? 'item' : 'items'}</span>
                      </div>
                    </div>
                    <div className="text-gray-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>
                  
                  {isExpanded && category.skills.length > 0 && (
                    <div className="bg-black">
                      {category.skills.map((skill) => (
                        <SkillItem key={skill.id} skill={skill} />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
