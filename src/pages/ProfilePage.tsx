import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { ChevronLeft, ChevronRight, FileText, Mail } from 'lucide-react'
import BottomNav from '../components/BottomNav'

// Brand icons
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

export default function ProfilePage() {
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-sm z-10">
        <div className="relative flex items-center justify-center px-4 py-4">
          <button 
            onClick={() => navigate(-1)}
            className="absolute left-4 p-1 hover:bg-[#1A1A1A] rounded-full transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Profile</h1>
        </div>
      </div>

      <div className="px-4 py-4 space-y-6">
        {/* Profile Avatar & Name */}
        <div className="flex flex-col items-center pt-2 pb-4">
          <img 
            src="/images/pfp_theme transparent.png" 
            alt="Vandan Patel" 
            className="w-24 h-auto rounded-full mb-3 object-contain"
          />
          <h2 className="text-xl font-semibold text-white">Vandan Patel</h2>
        </div>

        {/* Resume Section */}
        <div>
          <p className="text-gray-500 text-xs font-medium uppercase tracking-wide px-1 pb-2">Resume</p>
          <div className="bg-[#1C1C1E] rounded-xl overflow-hidden">
            <button
              onClick={() => handleResumeClick('Computer Science')}
              className="w-full flex items-center justify-between px-4 py-4 hover:bg-[#252525] transition-colors border-b border-[#2C2C2E]"
            >
              <div className="flex items-center gap-3.5">
                <FileText className="w-6 h-6 text-[#00C805]" />
                <span className="text-white text-base">Software Engineering</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </button>

            <button
              onClick={() => handleResumeClick('Finance')}
              className="w-full flex items-center justify-between px-4 py-4 hover:bg-[#252525] transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <FileText className="w-6 h-6 text-[#C9A227]" />
                <span className="text-white text-base">Finance</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Connect Section */}
        <div>
          <p className="text-gray-500 text-xs font-medium uppercase tracking-wide px-1 pb-2">Connect</p>
          <div className="bg-[#1C1C1E] rounded-xl overflow-hidden">
            <button
              onClick={() => handleExternalLink('https://github.com/vp-27')}
              className="w-full flex items-center justify-between px-4 py-4 hover:bg-[#252525] transition-colors border-b border-[#2C2C2E]"
            >
              <div className="flex items-center gap-3.5">
                <GithubIcon className="w-6 h-6 text-white" />
                <span className="text-white text-base">GitHub</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </button>

            <button
              onClick={() => handleExternalLink('https://www.linkedin.com/in/vandan-patel-vp/')}
              className="w-full flex items-center justify-between px-4 py-4 hover:bg-[#252525] transition-colors border-b border-[#2C2C2E]"
            >
              <div className="flex items-center gap-3.5">
                <LinkedinIcon className="w-6 h-6 text-[#0A66C2]" />
                <span className="text-white text-base">LinkedIn</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </button>

            <button
              onClick={() => handleExternalLink('mailto:vrp77@scarletmail.rutgers.edu')}
              className="w-full flex items-center justify-between px-4 py-4 hover:bg-[#252525] transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <Mail className="w-6 h-6 text-gray-400" />
                <span className="text-white text-base">Email</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
