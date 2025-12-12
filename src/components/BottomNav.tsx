import { BriefcaseIcon, FolderIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'

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

// Heroicon-style icons for social links (outline to match modal aesthetic)
const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
)

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const MailIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
  </svg>
)

const DocumentIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" clipRule="evenodd" />
    <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
  </svg>
)

interface BottomNavProps {
  onNavigate?: (section: string) => void
}

export default function BottomNav({ onNavigate }: BottomNavProps) {
  const [activeTab, setActiveTab] = useState('home')
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  const handleNavigate = (section: string, label: string) => {
    setActiveTab(label.toLowerCase())
    if (onNavigate) {
      onNavigate(section)
    }
  }

  const handleResumeClick = (resumeType: string) => {
    const resumePaths: Record<string, string> = {
      'Computer Science': '/resumes/Vandan_Patel_CS.pdf',
      'Finance': '/resumes/Vandan_Patel_Finance.pdf',
    }
    window.open(resumePaths[resumeType], '_blank')
  }

  const handleExternalLink = (url: string) => {
    window.open(url, '_blank')
  }

  const navItems = [
    { icon: ChartIcon, label: 'Home', section: 'top', type: 'navigation', isCustom: true },
    { icon: BriefcaseIcon, label: 'Experience', section: 'experience', type: 'navigation', isCustom: false },
    { icon: FolderIcon, label: 'Projects', section: 'projects', type: 'navigation', isCustom: false },
    { icon: UserIcon, label: 'Profile', section: 'profile', type: 'action', isCustom: false },
  ]

  return (
    <>
      {/* Main Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black md:hidden z-50">
        <div className="flex items-center justify-around px-4 py-2 pb-safe">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                if (item.type === 'action') {
                  setIsProfileModalOpen(true)
                  setActiveTab(item.label.toLowerCase())
                } else {
                  handleNavigate(item.section, item.label)
                }
              }}
              className="flex items-center justify-center p-3 bg-transparent transition-all"
            >
              {item.isCustom ? (
                <item.icon 
                  className={`w-7 h-7 transition-colors ${
                    activeTab === item.label.toLowerCase() ? 'text-white' : 'text-gray-500'
                  }`}
                  strokeWidth={activeTab === item.label.toLowerCase() ? 2.5 : 2}
                />
              ) : (
                <item.icon 
                  className={`w-7 h-7 transition-colors ${
                    activeTab === item.label.toLowerCase() ? 'text-white' : 'text-gray-500'
                  }`}
                />
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Unified Profile Modal */}
      {isProfileModalOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] md:hidden"
          onClick={() => setIsProfileModalOpen(false)}
        >
          <div 
            className="absolute bottom-0 left-0 right-0 bg-[#0A0A0A] rounded-t-3xl animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <h2 className="text-xl font-bold text-white">Profile</h2>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Resume Section */}
            <div className="px-4 pb-4">
              <p className="text-gray-400 text-sm px-2 pb-3">Resume</p>
              <button
                onClick={() => handleResumeClick('Computer Science')}
                className="w-full bg-[#1A1A1A] hover:bg-[#252525] text-left px-5 py-4 rounded-xl mb-2 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-[#00C805]/10 rounded-full flex items-center justify-center">
                    <DocumentIcon className="w-5 h-5 text-[#00C805]" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-[15px]">Software Engineering</div>
                    <div className="text-gray-400 text-sm">Technical & Engineering roles</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleResumeClick('Finance')}
                className="w-full bg-[#1A1A1A] hover:bg-[#252525] text-left px-5 py-4 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-[#FFB800]/10 rounded-full flex items-center justify-center">
                    <DocumentIcon className="w-5 h-5 text-[#FFB800]" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-[15px]">Finance</div>
                    <div className="text-gray-400 text-sm">Financial & Quantitative roles</div>
                  </div>
                </div>
              </button>
            </div>

            {/* Connect Section */}
            <div className="px-4 pb-8">
              <p className="text-gray-400 text-sm px-2 pb-3">Connect</p>
              <button
                onClick={() => {
                  handleExternalLink('https://github.com/vp-27')
                  setIsProfileModalOpen(false)
                }}
                className="w-full bg-[#1A1A1A] hover:bg-[#252525] text-left px-5 py-4 rounded-xl mb-2 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-purple-500/10 rounded-full flex items-center justify-center">
                    <GithubIcon className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-[15px]">GitHub</div>
                    <div className="text-gray-400 text-sm">@vp-27 • View my code</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  handleExternalLink('https://www.linkedin.com/in/vandan-patel-vp/')
                  setIsProfileModalOpen(false)
                }}
                className="w-full bg-[#1A1A1A] hover:bg-[#252525] text-left px-5 py-4 rounded-xl mb-2 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <LinkedinIcon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-[15px]">LinkedIn</div>
                    <div className="text-gray-400 text-sm">Professional network</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  handleExternalLink('mailto:vrp77@scarletmail.rutgers.edu')
                  setIsProfileModalOpen(false)
                }}
                className="w-full bg-[#1A1A1A] hover:bg-[#252525] text-left px-5 py-4 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-green-500/10 rounded-full flex items-center justify-center">
                    <MailIcon className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-[15px]">Email</div>
                    <div className="text-gray-400 text-sm">vrp77@scarletmail.rutgers.edu</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
