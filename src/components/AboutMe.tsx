import { MapPin } from 'lucide-react'

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

export default function AboutMe() {
  return (
    <div className="bg-black rounded-lg border border-gray-900">
      {/* Header with tab */}
      <div className="flex items-center border-b border-gray-900">
        <button className="flex-1 py-3 bg-transparent text-white border-b-2 border-white font-medium">
          About Me
        </button>
      </div>
      
      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Name & Title */}
        <div>
          <h3 className="text-base font-medium mb-1">{aboutData.name}</h3>
          <p className="text-sm text-gray-400">{aboutData.title}</p>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <MapPin className="w-4 h-4" />
          <span>{aboutData.location}</span>
        </div>

        {/* Bio */}
        <p className="text-sm text-gray-400 leading-relaxed">
          {aboutData.bio}
        </p>
      </div>
    </div>
  )
}
