import { Search, FileText, Github, Linkedin, Mail } from 'lucide-react'

interface TopNavProps {
  onNavigate?: (section: string) => void
  onSearch?: (query: string) => void
}

export default function TopNav({ onNavigate, onSearch }: TopNavProps) {
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

  const handleResumeClick = () => {
    // You can replace this with your actual resume URL
    window.open('/resume.pdf', '_blank')
  }

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
              className="w-8 h-8 bg-[#00C805] rounded-sm flex items-center justify-center hover:bg-[#00b005] transition-colors"
              aria-label="Home"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-black">
                <path d="M12 2L2 7v10c0 5.5 3.8 10.7 10 12 6.2-1.3 10-6.5 10-12V7l-10-5z" />
              </svg>
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
            <button 
              onClick={handleResumeClick}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#C4F000] text-black rounded-full text-sm font-medium hover:bg-[#b3e000] transition-colors"
            >
              <FileText className="w-4 h-4" />
              Resume
            </button>
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
              onClick={() => handleNavigate('skills')}
              className="bg-transparent text-white text-sm hover:text-gray-300 transition-colors"
            >
              Skills
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
              onClick={() => handleExternalLink('https://github.com/yourusername')}
              className="bg-transparent text-gray-400 hover:text-white transition-colors" 
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </button>
            <button 
              onClick={() => handleExternalLink('https://linkedin.com/in/yourusername')}
              className="bg-transparent text-gray-400 hover:text-white transition-colors" 
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </button>
            <button 
              onClick={() => handleExternalLink('mailto:your.email@example.com')}
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
