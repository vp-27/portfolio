import type { Skill } from '../types'

interface SkillItemProps {
  skill: Skill
  categoryIcon?: string
}

export default function SkillItem({ skill }: SkillItemProps) {
  return (
    <div className="px-4 hover:bg-[#1A1A1A] transition-colors">
      <div className="py-3 border-b border-[#2D2D2D]">
        <span className="text-sm font-medium text-left block text-white">{skill.name}</span>
      </div>
    </div>
  )
}
