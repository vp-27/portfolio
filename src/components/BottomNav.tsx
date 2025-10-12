import { Home, Search, LineChart, TrendingUp, User } from 'lucide-react'
import { useState } from 'react'

interface BottomNavProps {
  onNavigate?: (section: string) => void
}

export default function BottomNav({ onNavigate }: BottomNavProps) {
  const [activeTab, setActiveTab] = useState('home')

  const handleNavigate = (section: string, label: string) => {
    setActiveTab(label.toLowerCase())
    if (onNavigate) {
      onNavigate(section)
    }
  }

  const navItems = [
    { icon: Home, label: 'Home', section: 'top' },
    { icon: Search, label: 'Search', section: 'skills' },
    { icon: LineChart, label: 'Projects', section: 'projects' },
    { icon: TrendingUp, label: 'Experience', section: 'experience' },
    { icon: User, label: 'About', section: 'about' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-900 md:hidden z-50">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => handleNavigate(item.section, item.label)}
            className={`flex flex-col items-center justify-center flex-1 h-full bg-transparent ${
              activeTab === item.label.toLowerCase() ? 'text-white' : 'text-gray-500'
            }`}
          >
            <item.icon className="w-6 h-6 mb-1" />
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
