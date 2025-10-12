import { Briefcase, FolderGit2, GraduationCap, Award } from 'lucide-react'

interface PortfolioSection {
  id: string
  title: string
  description: string
  icon: 'experience' | 'projects' | 'education' | 'certifications'
  action: string
}

const sections: PortfolioSection[] = [
  {
    id: '1',
    title: 'Professional Experience',
    description: 'Explore my career journey and the companies I\'ve worked with.',
    icon: 'experience',
    action: 'View Experience',
  },
  {
    id: '2',
    title: 'Projects',
    description: 'Check out my portfolio of projects and applications I\'ve built.',
    icon: 'projects',
    action: 'Browse Projects',
  },
  {
    id: '3',
    title: 'Education',
    description: 'Learn about my academic background and continuous learning journey.',
    icon: 'education',
    action: 'View Education',
  },
  {
    id: '4',
    title: 'Certifications',
    description: 'View my professional certifications and achievements.',
    icon: 'certifications',
    action: 'See Certifications',
  },
]

export default function PortfolioSections() {
  const getIcon = (iconType: 'experience' | 'projects' | 'education' | 'certifications') => {
    switch (iconType) {
      case 'experience':
        return <Briefcase className="w-8 h-8" />
      case 'projects':
        return <FolderGit2 className="w-8 h-8" />
      case 'education':
        return <GraduationCap className="w-8 h-8" />
      case 'certifications':
        return <Award className="w-8 h-8" />
    }
  }

  return (
    <div className="mt-8 px-4 space-y-4">
      {sections.map((section) => (
        <div
          key={section.id}
          className="bg-[#0D0D0D] rounded-lg p-6 border border-gray-900 hover:border-gray-700 transition-colors cursor-pointer"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#FF5000] rounded-full flex items-center justify-center flex-shrink-0">
              <div className="text-black">
                {getIcon(section.icon)}
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-medium mb-2">{section.title}</h2>
              <p className="text-sm text-gray-400 mb-4">
                {section.description}
              </p>
              <button className="bg-transparent text-[#FF5000] text-sm font-medium hover:text-[#ff6620] transition-colors">
                {section.action}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
