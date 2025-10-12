import { MapPin } from 'lucide-react'

interface AboutMeData {
  name: string
  title: string
  location: string
  bio: string
}

const aboutData: AboutMeData = {
  name: 'Your Name',
  title: 'Full Stack Developer & Financial Analyst',
  location: 'San Francisco, CA',
  bio: 'Passionate developer with expertise in building scalable applications and analyzing financial markets. Focused on creating elegant solutions that bridge technology and finance.',
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
