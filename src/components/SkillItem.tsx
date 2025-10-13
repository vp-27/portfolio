import type { Skill } from '../types'

interface SkillItemProps {
  skill: Skill
  categoryIcon?: string
}

// Color mapping based on skill type
const getSkillColor = (skillName: string, categoryIcon?: string) => {
  // Financial/Business skills - Green (Robinhood green)
  const financialSkills = [
    'Financial Modeling', 'Valuation', 'DCF', 'Risk Management', 
    'Financial Statement Analysis', 'Algorithmic Trading', 'Portfolio Analytics',
    'Bloomberg Terminal', 'Excel', 'Microsoft Excel', 'Power Automate', 'SharePoint',
    'Alpaca API'
  ]
  
  // Programming/Technical skills - Orange/Red (Robinhood orange)
  const technicalSkills = [
    'Python', 'SQL', 'JavaScript', 'TypeScript', 'JavaScript/TypeScript',
    'React', 'Flask', 'dbt-core', 'Git', 'GitHub', 'Git/GitHub'
  ]
  
  // Check if skill matches financial category
  if (categoryIcon === 'financial' || 
      financialSkills.some(fs => skillName.toLowerCase().includes(fs.toLowerCase()))) {
    return 'text-[#00C805]' // Green for financial
  } 
  
  // Check if skill matches technical category  
  if (categoryIcon === 'technical' || 
      technicalSkills.some(ts => skillName.toLowerCase().includes(ts.toLowerCase()))) {
    return 'text-[#FF5000]' // Orange/Red for technical
  }
  
  // Tools and soft skills remain white/gray
  return 'text-gray-300' // Softer white for other categories
}

export default function SkillItem({ skill, categoryIcon }: SkillItemProps) {
  const colorClass = getSkillColor(skill.name, categoryIcon)
  
  return (
    <div className="px-4 hover:bg-[#1A1A1A] transition-colors">
      <div className="py-3 border-b border-[#2D2D2D]">
        <span className={`text-sm font-medium text-left block ${colorClass}`}>{skill.name}</span>
      </div>
    </div>
  )
}
