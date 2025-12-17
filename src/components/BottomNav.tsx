import { BriefcaseIcon, FolderIcon, UserIcon } from '@heroicons/react/24/solid'
import { useNavigate, useLocation } from 'react-router-dom'

// Custom Robinhood-style chart icon for home/portfolio
const ChartIcon = ({ className, strokeWidth = 2 }: { className?: string; strokeWidth?: number }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth={strokeWidth}
    strokeLinecap="square"
    strokeLinejoin="miter"
  >
    {/* Robinhood-style upward trend chart */}
    <polyline points="3 17 9 11 13 15 21 7" />
    <polyline points="17 7 21 7 21 11" />
  </svg>
)

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { icon: ChartIcon, label: 'Home', path: '/', isCustom: true },
    { icon: BriefcaseIcon, label: 'Experience', path: '/experience', isCustom: false },
    { icon: FolderIcon, label: 'Projects', path: '/projects', isCustom: false },
    { icon: UserIcon, label: 'Profile', path: '/profile', isCustom: false },
  ]

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname === path
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black md:hidden z-50">
      <div className="flex items-center justify-around px-4 py-2 pb-safe">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => {
              navigate(item.path)
              window.scrollTo(0, 0)
            }}
            className="flex items-center justify-center p-3 bg-transparent transition-all"
          >
            {item.isCustom ? (
              <item.icon 
                className={`w-7 h-7 transition-colors ${
                  isActive(item.path) ? 'text-white' : 'text-gray-500'
                }`}
                strokeWidth={isActive(item.path) ? 2.5 : 2}
              />
            ) : (
              <item.icon 
                className={`w-7 h-7 transition-colors ${
                  isActive(item.path) ? 'text-white' : 'text-gray-500'
                }`}
              />
            )}
          </button>
        ))}
      </div>
    </nav>
  )
}
