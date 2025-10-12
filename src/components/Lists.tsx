import { useState } from 'react'
import { ChevronUp, ChevronDown, Code2, TrendingUp, Wrench, Users, Plus } from 'lucide-react'
import type { SkillCategory } from '../types'
import SkillItem from './SkillItem'

interface ListsProps {
  skillCategories: SkillCategory[]
}

export default function Lists({ skillCategories }: ListsProps) {
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

  const getIcon = (iconType: 'technical' | 'financial' | 'soft' | 'language' | 'tools') => {
    switch (iconType) {
      case 'technical':
        return <Code2 className="w-5 h-5" />
      case 'financial':
        return <TrendingUp className="w-5 h-5" />
      case 'tools':
        return <Wrench className="w-5 h-5" />
      case 'soft':
        return <Users className="w-5 h-5" />
      default:
        return <Code2 className="w-5 h-5" />
    }
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between px-4 mb-3">
        <h2 className="text-lg font-medium">Skills</h2>
        <button className="bg-transparent text-gray-400 hover:text-white transition-colors" aria-label="Add new skill category">
          <Plus className="w-5 h-5" />
        </button>
      </div>
      
      <div>
        {skillCategories.map((category) => {
          const isExpanded = expandedLists.has(category.id)
          
          return (
            <div key={category.id} className="border-b border-gray-900">
              <button
                onClick={() => toggleList(category.id)}
                className="w-full flex items-center justify-between px-4 py-3 bg-transparent hover:bg-[#1A1A1A] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="text-gray-400">
                    {getIcon(category.icon)}
                  </div>
                  <span className="text-white">{category.name}</span>
                  <span className="text-xs text-gray-500">({category.skills.length})</span>
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
  )
}
