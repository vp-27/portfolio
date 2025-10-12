import type { Skill } from '../types'

interface SkillItemProps {
  skill: Skill
}

export default function SkillItem({ skill }: SkillItemProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-900 hover:bg-[#1A1A1A] transition-colors">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-white text-sm font-medium">{skill.name}</span>
          {skill.yearsOfExperience && (
            <span className="text-xs text-gray-500">
              {skill.yearsOfExperience}y exp
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Proficiency bar */}
          <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#FF5000] to-[#FF8040] rounded-full transition-all duration-300"
              style={{ width: `${skill.proficiency}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 font-mono min-w-[35px] text-right">
            {skill.proficiency}%
          </span>
        </div>
      </div>
    </div>
  )
}
