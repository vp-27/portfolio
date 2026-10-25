import { useState, useRef, useEffect } from 'react'
import { Search, FileText, ChevronDown, X } from 'lucide-react'
import { resumes } from '../data/profile'

interface TopNavProps {
  onNavigate?: (section: string) => void
  onSearch?: (query: string) => void
  onAISubmit?: (query?: string) => void
  searchQuery?: string
}

export default function TopNav({
  onNavigate,
  onSearch,
  onAISubmit,
  searchQuery = '',
}: TopNavProps) {
  const [isResumeDropdownOpen, setIsResumeDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const isMac = typeof window !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent)

  const handleNavigate = (section: string) => {
    if (onNavigate) {
      onNavigate(section)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(e.target.value)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onAISubmit) {
      onAISubmit(searchQuery)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsResumeDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Global Cmd+K / Ctrl+K and '/' shortcut to focus search
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'
      const target = e.target as HTMLElement | null
      const isInput =
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      const isSlash = e.key === '/' && !isInput

      if (isCmdK || isSlash) {
        e.preventDefault()
        if (window.innerWidth >= 768 && searchInputRef.current) {
          searchInputRef.current.focus()
          searchInputRef.current.select()
        } else {
          window.dispatchEvent(
            new CustomEvent('open-mobile-search', { detail: { query: searchQuery } }),
          )
        }
      } else if (e.key === 'Escape') {
        setIsResumeDropdownOpen(false)
        searchInputRef.current?.blur()
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [searchQuery])

  return (
    <nav
      aria-label="Desktop navigation"
      className="hidden md:flex fixed top-0 left-0 right-0 bg-black border-b border-gray-900 z-50"
    >
      <div className="max-w-[1440px] mx-auto md:px-4 w-full">
        <div className="flex items-center justify-between h-14 md:pr-4">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => handleNavigate('top')}
              className="flex items-center justify-center hover:opacity-80 transition-opacity"
              aria-label="Home"
            >
              <img src="/images/vp-logo.png" alt="VP Logo" className="w-10 h-10" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xs md:max-w-sm lg:max-w-md mx-3 lg:mx-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                ref={searchInputRef}
                type="search"
                maxLength={500}
                aria-label="Search or ask about Vandan"
                title="Search projects, experience, or ask a question about Vandan"
                placeholder="Search or ask anything..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                className="w-full bg-[#1A1A1A] text-white placeholder-gray-400 pl-10 pr-14 py-2 rounded-md text-[16px] md:text-sm focus:outline-none focus:ring-1 focus:ring-gray-700"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => onSearch?.('')}
                  className="absolute right-2.5 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2 hidden lg:flex items-center pointer-events-none select-none">
                  <kbd className="px-1.5 py-0.5 text-[10px] font-medium text-gray-400 bg-[#262626] border border-gray-800 rounded">
                    {isMac ? '⌘K' : 'Ctrl K'}
                  </kbd>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-3 lg:gap-6 md:mr-2 lg:mr-8">
            <div className="relative" ref={dropdownRef}>
              <button
                aria-expanded={isResumeDropdownOpen}
                aria-controls="resume-links"
                onClick={() => setIsResumeDropdownOpen(!isResumeDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 bg-[#C4F000] text-black rounded-full text-xs lg:text-sm font-medium hover:bg-[#b3e000] transition-colors"
              >
                <FileText className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                Resume
                <ChevronDown className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
              </button>

              {/* Dropdown Menu */}
              {isResumeDropdownOpen && (
                <div
                  id="resume-links"
                  className="absolute top-full mt-2 right-0 bg-[#1A1A1A] border border-gray-800 rounded-lg shadow-xl min-w-[200px] overflow-hidden z-50"
                >
                  {resumes.map((resume) => (
                    <a
                      key={resume.url}
                      href={resume.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsResumeDropdownOpen(false)}
                      className="block px-4 py-3 text-sm hover:bg-[#2A2A2A] border-b border-gray-800 last:border-0"
                    >
                      <div className="font-medium">{resume.label}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{resume.description}</div>
                    </a>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => handleNavigate('experience')}
              className="bg-transparent text-white text-xs lg:text-sm font-bold hover:text-rh-green transition-colors"
            >
              Experience
            </button>
            <button
              onClick={() => handleNavigate('projects')}
              className="bg-transparent text-white text-xs lg:text-sm font-bold hover:text-rh-green transition-colors"
            >
              Projects
            </button>
            <button
              onClick={() => handleNavigate('education')}
              className="bg-transparent text-white text-xs lg:text-sm font-bold hover:text-rh-green transition-colors"
            >
              Education
            </button>
            <button
              onClick={() => handleNavigate('contact')}
              className="bg-transparent text-white text-xs lg:text-sm font-bold hover:text-rh-green transition-colors"
            >
              Contact
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
