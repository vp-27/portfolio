import { Search, X } from 'lucide-react'
import type { Skill } from '../types'

interface SkillItemProps {
  skill: Skill
  categoryIcon?: string
  onClick?: () => void
  isActive?: boolean
}

export default function SkillItem({ skill, onClick, isActive }: SkillItemProps) {
  return (
    <button 
      onClick={onClick}
      className="w-full px-4 hover:bg-[#1A1A1A] transition-colors focus:outline-none group block"
    >
      <div className="py-3 border-b border-[#2D2D2D] flex items-center justify-between">
        <span className="text-sm font-medium text-left text-white">{skill.name}</span>
        
        {/* Robinhood style chip */}
        <div className={`
          flex items-center justify-center w-12 h-6 rounded-[4px] transition-all duration-200
          ${isActive 
            ? 'bg-[#FF5000] text-white border border-transparent' // Active: Red/Orange
            : 'bg-transparent border border-[#00C805] text-[#00C805] group-hover:bg-[#00C805] group-hover:text-black' // Resting: Transparent + Border -> Hover: Filled
          }
        `}>
          {isActive ? <X className="w-3.5 h-3.5 stroke-[3]" /> : <Search className="w-3.5 h-3.5 stroke-[3]" />}
        </div>
      </div>
    </button>
  )
}
