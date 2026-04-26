import type { Skill } from '../types'

interface SkillItemProps {
  skill: Skill
  categoryIcon?: string
}

export default function SkillItem({ skill }: SkillItemProps) {
  return (
    <div className="inline-flex items-center px-3 py-1.5 bg-[#1A1A1A] border border-[#2D2D2D] rounded-full hover:bg-[#2A2A2A] hover:border-[#3D3D3D] transition-colors cursor-default">
      <span className="text-sm font-medium text-white">{skill.name}</span>
    </div>
  )
}
