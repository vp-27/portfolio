import type { Skill } from '../types'

interface SkillItemProps {
  skill: Skill
}

export default function SkillItem({ skill }: SkillItemProps) {
  return (
    <div className="px-4 hover:bg-[#1A1A1A] transition-colors">
      <div className="py-3 border-b border-[#2D2D2D]">
        <span className="text-white text-sm font-medium text-left block">{skill.name}</span>
      </div>
    </div>
  )
}
