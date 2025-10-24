import { useState, useRef, useEffect } from 'react'
import { Search, FileText, Github, Linkedin, Mail, ChevronDown } from 'lucide-react'

interface TopNavProps {
  onNavigate?: (section: string) => void
  onSearch?: (query: string) => void
}

export default function TopNav({ onNavigate, onSearch }: TopNavProps) {
  const [isResumeDropdownOpen, setIsResumeDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  const handleResumeClick = (resumeType: string) => {
    const resumePaths: Record<string, string> = {
      'Computer Science': '/resumes/Vandan_Patel_CS.pdf',
      'Finance': '/resumes/Vandan_Patel_Finance.pdf',
      'Product Management': '/resumes/Vandan_Patel_PM.pdf',
    }
    window.open(resumePaths[resumeType], '_blank')
    setIsResumeDropdownOpen(false)
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

  const handleExternalLink = (url: string) => {
    window.open(url, '_blank')
  }

  return (
    <nav className="hidden md:flex fixed top-0 left-0 right-0 bg-black border-b border-gray-900 z-50">
      <div className="max-w-7xl mx-auto md:px-4 w-full">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => handleNavigate('top')}
              className="flex items-center justify-center hover:opacity-80 transition-opacity"
              aria-label="Home"
            >
              <img 
                src="/images/vp-logo.png" 
                alt="VP Logo" 
                className="w-10 h-10"
              />
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search skills, projects, experiences..."
                onChange={handleSearchChange}
                className="w-full bg-[#1A1A1A] text-white placeholder-gray-500 pl-10 pr-4 py-2 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-700"
              />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsResumeDropdownOpen(!isResumeDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C4F000] text-black rounded-full text-sm font-medium hover:bg-[#b3e000] transition-colors"
              >
                <FileText className="w-4 h-4" />
                Resume
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              
              {/* Dropdown Menu */}
              {isResumeDropdownOpen && (
                <div className="absolute top-full mt-2 right-0 bg-[#1A1A1A] border border-gray-800 rounded-lg shadow-xl min-w-[200px] overflow-hidden z-50">
                  <button
                    onClick={() => handleResumeClick('Computer Science')}
                    className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-[#2A2A2A] transition-colors"
                  >
                    <div className="font-medium">Computer Science</div>
                    <div className="text-xs text-gray-400 mt-0.5">Technical roles</div>
                  </button>
                  <div className="border-t border-gray-800" />
                  <button
                    onClick={() => handleResumeClick('Finance')}
                    className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-[#2A2A2A] transition-colors"
                  >
                    <div className="font-medium">Finance</div>
                    <div className="text-xs text-gray-400 mt-0.5">Financial roles</div>
                  </button>
                  <div className="border-t border-gray-800" />
                  <button
                    onClick={() => handleResumeClick('Product Management')}
                    className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-[#2A2A2A] transition-colors"
                  >
                    <div className="font-medium">Product Management</div>
                    <div className="text-xs text-gray-400 mt-0.5">PM roles</div>
                  </button>
                </div>
              )}
            </div>
            <button 
              onClick={() => handleNavigate('experience')}
              className="bg-transparent text-white text-sm hover:text-gray-300 transition-colors"
            >
              Experience
            </button>
            <button 
              onClick={() => handleNavigate('projects')}
              className="bg-transparent text-white text-sm hover:text-gray-300 transition-colors"
            >
              Projects
            </button>
            <button 
              onClick={() => handleNavigate('education')}
              className="bg-transparent text-white text-sm hover:text-gray-300 transition-colors"
            >
              Education
            </button>
          </div>

          {/* Right Icons - Social Links */}
          <div className="flex items-center gap-4 ml-4">
            <button 
              onClick={() => handleExternalLink('https://github.com/vp-27')}
              className="bg-transparent text-gray-400 hover:text-white transition-colors" 
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </button>
            <button 
              onClick={() => handleExternalLink('https://www.linkedin.com/in/vandan-patel-vp/')}
              className="bg-transparent text-gray-400 hover:text-white transition-colors" 
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </button>
            <button 
              onClick={() => handleExternalLink('mailto:vrp77@scarletmail.rutgers.edu')}
              className="bg-transparent text-gray-400 hover:text-white transition-colors" 
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
