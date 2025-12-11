import { useState } from 'react'
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
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="bg-black rounded-lg border border-gray-900">
      {/* Header with tab */}
      <div className="flex items-center border-b border-gray-900">
        <button className="flex-1 py-3 bg-transparent text-white border-b-2 border-white font-medium">
          About Me
        </button>
      </div>
      
      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Name, Title & Profile Picture */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-xl font-medium mb-2 text-white">{aboutData.name}</h3>
            <p className="text-sm text-gray-300 leading-relaxed">{aboutData.title}</p>
            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-gray-400 pt-2">
              <MapPin className="w-4 h-4" />
              <span>{aboutData.location}</span>
            </div>
          </div>
          
          {/* Profile Picture with hover effect */}
          <div 
            className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-800 cursor-pointer flex-shrink-0 transition-all duration-300 hover:border-green-500"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <img
              src="/images/pfp_theme%20transparent.png"
              alt="Vandan Patel - Themed"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
            />
            <img
              src="/images/pfp_original.jpg"
              alt="Vandan Patel - Original"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
            />
          </div>
        </div>

        {/* Bio */}
        <div className="pt-2 border-t border-gray-900">
          <p className="text-sm text-gray-300 leading-relaxed">
            {aboutData.bio}
          </p>
        </div>
      </div>
    </div>
  )
}
