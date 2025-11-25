import { Home, Briefcase, FolderGit2, FileText, User, Github, Linkedin, Mail, X } from 'lucide-react'
import { useState } from 'react'

interface BottomNavProps {
  onNavigate?: (section: string) => void
}

export default function BottomNav({ onNavigate }: BottomNavProps) {
  const [activeTab, setActiveTab] = useState('home')
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false)
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false)

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
    setIsResumeModalOpen(false)
  }

  const handleExternalLink = (url: string) => {
    window.open(url, '_blank')
  }

  const navItems = [
    { icon: Home, label: 'Home', section: 'top', type: 'navigation' },
    { icon: Briefcase, label: 'Experience', section: 'experience', type: 'navigation' },
    { icon: FolderGit2, label: 'Projects', section: 'projects', type: 'navigation' },
    { icon: FileText, label: 'Resume', section: 'resume', type: 'action' },
    { icon: User, label: 'Connect', section: 'connect', type: 'action' },
  ]

  return (
    <>
      {/* Main Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black md:hidden z-50">
        <div className="flex items-center justify-around px-2 pt-2 pb-safe">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                if (item.type === 'action') {
                  if (item.section === 'resume') {
                    setIsResumeModalOpen(true)
                  } else if (item.section === 'connect') {
                    setIsConnectModalOpen(true)
                  }
                  setActiveTab(item.label.toLowerCase())
                } else {
                  handleNavigate(item.section, item.label)
                }
              }}
              className="flex flex-col items-center justify-center flex-1 py-2 bg-transparent transition-all"
            >
              <item.icon 
                className={`w-[26px] h-[26px] transition-colors ${
                  activeTab === item.label.toLowerCase() ? 'text-white' : 'text-gray-500'
                }`}
                strokeWidth={activeTab === item.label.toLowerCase() ? 2.5 : 2}
              />
              <span 
                className={`text-[10px] mt-1 font-medium transition-colors ${
                  activeTab === item.label.toLowerCase() ? 'text-white' : 'text-gray-500'
                }`}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* Resume Selection Modal */}
      {isResumeModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] md:hidden">
          <div className="absolute bottom-0 left-0 right-0 bg-[#0A0A0A] rounded-t-3xl animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <h2 className="text-xl font-bold text-white">Select Resume</h2>
              <button
                onClick={() => setIsResumeModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Resume Options */}
            <div className="px-4 pb-8">
              <button
                onClick={() => handleResumeClick('Computer Science')}
                className="w-full bg-[#1A1A1A] hover:bg-[#252525] text-left px-6 py-4 rounded-xl mb-3 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#00C805]/10 rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-[#00C805]" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-base">Software Engineering</div>
                    <div className="text-gray-400 text-sm">Technical & Engineering roles</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleResumeClick('Finance')}
                className="w-full bg-[#1A1A1A] hover:bg-[#252525] text-left px-6 py-4 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#FFB800]/10 rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-[#FFB800]" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-base">Finance</div>
                    <div className="text-gray-400 text-sm">Financial & Quantitative roles</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Connect Modal */}
      {isConnectModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] md:hidden">
          <div className="absolute bottom-0 left-0 right-0 bg-[#0A0A0A] rounded-t-3xl animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <h2 className="text-xl font-bold text-white">Let's Connect</h2>
              <button
                onClick={() => setIsConnectModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Connect Options */}
            <div className="px-4 pb-8">
              <button
                onClick={() => {
                  handleExternalLink('https://github.com/vp-27')
                  setIsConnectModalOpen(false)
                }}
                className="w-full bg-[#1A1A1A] hover:bg-[#252525] text-left px-6 py-4 rounded-xl mb-3 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center">
                    <Github className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-base">GitHub</div>
                    <div className="text-gray-400 text-sm">@vp-27 • View my code</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  handleExternalLink('https://www.linkedin.com/in/vandan-patel-vp/')
                  setIsConnectModalOpen(false)
                }}
                className="w-full bg-[#1A1A1A] hover:bg-[#252525] text-left px-6 py-4 rounded-xl mb-3 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <Linkedin className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-base">LinkedIn</div>
                    <div className="text-gray-400 text-sm">Professional network</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  handleExternalLink('mailto:vrp77@scarletmail.rutgers.edu')
                  setIsConnectModalOpen(false)
                }}
                className="w-full bg-[#1A1A1A] hover:bg-[#252525] text-left px-6 py-4 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-base">Email</div>
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
