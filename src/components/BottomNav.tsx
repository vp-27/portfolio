import { useState } from 'react'
import { BriefcaseIcon, FolderIcon, UserIcon } from '@heroicons/react/24/solid'
import { Search, X } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

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

interface BottomNavProps {
  searchQuery?: string
  onSearch?: (query: string) => void
  onAISubmit?: (query?: string) => void
}

export default function BottomNav({ searchQuery = '', onSearch, onAISubmit }: BottomNavProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [localQuery, setLocalQuery] = useState(searchQuery)

  const handleQueryChange = (val: string) => {
    setLocalQuery(val)
    if (onSearch) {
      onSearch(val)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onAISubmit) {
      onAISubmit(localQuery)
      setIsSearchOpen(false)
    }
  }

  const handleChipClick = (chip: string) => {
    const nextVal = localQuery.toLowerCase() === chip.toLowerCase() ? '' : chip
    handleQueryChange(nextVal)
  }

  const toggleSearch = () => {
    if (location.pathname !== '/' && !isSearchOpen) {
      navigate('/')
    }
    setIsSearchOpen(!isSearchOpen)
  }

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/' && !isSearchOpen
    return location.pathname === path
  }

  return (
    <>
      {/* Floating Search Bar Above Bottom Nav */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed top-3 left-3 right-3 z-50 bg-[#121212]/95 backdrop-blur-md border border-[#2D2D2D] rounded-2xl p-3 shadow-2xl md:hidden"
          >
            <div className="flex items-center gap-2 bg-[#1E1E1E] rounded-xl px-3 py-2.5 border border-[#2A2A2A]">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Search or ask anything..."
                value={localQuery}
                onChange={(e) => handleQueryChange(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent text-white text-[16px] placeholder-gray-500 focus:outline-none"
              />
              {localQuery ? (
                <button
                  onClick={() => handleQueryChange('')}
                  className="p-1 text-gray-400 hover:text-white"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1 text-gray-400 hover:text-white"
                  aria-label="Close search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Skill & AI Tags */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar mt-2.5 pt-1">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mr-1 flex-shrink-0">
                Ask AI / Filter:
              </span>
              {['Amazon SCOT', 'Algo Trading', 'Why CS & Finance?', 'OroGenie', 'Rutgers', 'Python'].map((chip) => {
                const isSelected = localQuery.toLowerCase() === chip.toLowerCase()
                return (
                  <button
                    key={chip}
                    onClick={() => {
                      handleChipClick(chip)
                      if (onAISubmit) onAISubmit(chip)
                      setIsSearchOpen(false)
                    }}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                      isSelected
                        ? 'bg-[#00C805] text-black font-bold'
                        : 'bg-[#1E1E1E] text-gray-300 hover:bg-[#2A2A2A] border border-[#2A2A2A]'
                    }`}
                  >
                    {chip}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Bottom Nav Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-gray-900 md:hidden z-50">
        <div className="flex items-center justify-around px-2 py-1.5 pb-safe">
          {/* Home */}
          <button
            onClick={() => {
              setIsSearchOpen(false)
              navigate('/')
              window.scrollTo(0, 0)
            }}
            className="flex flex-col items-center justify-center p-2.5 bg-transparent transition-all"
            aria-label="Home"
          >
            <ChartIcon
              className={`w-6 h-6 transition-colors ${
                isActive('/') ? 'text-white' : 'text-gray-500'
              }`}
              strokeWidth={isActive('/') ? 2.5 : 2}
            />
          </button>

          {/* Experience */}
          <button
            onClick={() => {
              setIsSearchOpen(false)
              navigate('/experience')
              window.scrollTo(0, 0)
            }}
            className="flex flex-col items-center justify-center p-2.5 bg-transparent transition-all"
            aria-label="Experience"
          >
            <BriefcaseIcon
              className={`w-6 h-6 transition-colors ${
                isActive('/experience') ? 'text-white' : 'text-gray-500'
              }`}
            />
          </button>

          {/* Center Search Button */}
          <button
            onClick={toggleSearch}
            className="flex flex-col items-center justify-center p-2.5 bg-transparent transition-all active:scale-95"
            aria-label="Search"
          >
            <Search 
              className={`w-6 h-6 transition-colors ${
                (isSearchOpen || searchQuery) ? 'text-white' : 'text-gray-500'
              }`}
              strokeWidth={(isSearchOpen || searchQuery) ? 2.8 : 2}
            />
          </button>

          {/* Projects */}
          <button
            onClick={() => {
              setIsSearchOpen(false)
              navigate('/projects')
              window.scrollTo(0, 0)
            }}
            className="flex flex-col items-center justify-center p-2.5 bg-transparent transition-all"
            aria-label="Projects"
          >
            <FolderIcon
              className={`w-6 h-6 transition-colors ${
                isActive('/projects') ? 'text-white' : 'text-gray-500'
              }`}
            />
          </button>

          {/* Profile */}
          <button
            onClick={() => {
              setIsSearchOpen(false)
              navigate('/profile')
              window.scrollTo(0, 0)
            }}
            className="flex flex-col items-center justify-center p-2.5 bg-transparent transition-all"
            aria-label="Profile"
          >
            <UserIcon
              className={`w-6 h-6 transition-colors ${
                isActive('/profile') ? 'text-white' : 'text-gray-500'
              }`}
            />
          </button>
        </div>
      </nav>
    </>
  )
}

