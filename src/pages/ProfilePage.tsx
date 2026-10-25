import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { ChevronLeft, ChevronRight, FileText, Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '../components/BrandIcons'
import { profile, resumes } from '../data/profile'

export default function ProfilePage() {
  const navigate = useNavigate()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])
  const contacts = [
    { label: 'GitHub', url: profile.github, Icon: GithubIcon, brand: 'github' },
    { label: 'LinkedIn', url: profile.linkedin, Icon: LinkedinIcon, brand: 'linkedin' },
    { label: 'Email', url: `mailto:${profile.email}`, Icon: Mail, brand: 'email' },
  ]
  return (
    <div className="min-h-screen bg-black text-white pb-28 md:pb-12">
      <div className="sticky top-0 md:top-14 bg-black/95 backdrop-blur-sm z-10">
        <div className="relative flex items-center justify-center px-4 py-4 max-w-2xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="absolute left-4 p-2 rounded-full hover:bg-[#1A1A1A]"
            aria-label="Back to timeline"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Profile</h1>
        </div>
      </div>
      <div className="px-4 py-4 space-y-6 max-w-2xl mx-auto">
        <div className="flex flex-col items-center pt-2 pb-4">
          <img
            src={profile.avatar}
            alt=""
            className="w-24 h-auto rounded-full mb-3 object-contain"
          />
          <h2 className="text-xl font-semibold">{profile.name}</h2>
        </div>
        <section aria-label="Resumes">
          <h2 className="text-gray-400 text-xs font-medium uppercase tracking-wide px-1 pb-2">
            Resume
          </h2>
          <div className="bg-[#1E2124] rounded-xl overflow-hidden">
            {resumes.map((resume, index) => (
              <a
                key={resume.url}
                href={resume.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3.5 px-4 py-4 hover:bg-[#2A2D31] transition-colors"
              >
                <FileText
                  className={`w-6 h-6 shrink-0 ${index === 0 ? 'text-rh-green' : 'text-[#c9a227]'}`}
                />
                <span className="flex-1 text-base">{resume.label}</span>
                <ChevronRight className="w-5 h-5 text-gray-500" />
              </a>
            ))}
          </div>
        </section>
        <section aria-label="Contact links">
          <h2 className="text-gray-400 text-xs font-medium uppercase tracking-wide px-1 pb-2">
            Connect
          </h2>
          <div className="bg-[#1E2124] rounded-xl overflow-hidden">
            {contacts.map(({ label, url, Icon, brand }) => (
              <a
                key={label}
                href={url}
                data-brand={brand}
                target={label === 'Email' ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3.5 px-4 py-4 hover:bg-[#2A2D31] transition-colors"
              >
                <Icon
                  className={`w-6 h-6 shrink-0 ${brand === 'github' ? 'text-white' : brand === 'linkedin' ? 'text-[#0a66c2]' : 'text-gray-400'}`}
                />
                <span className="flex-1 text-base">{label}</span>
                <ChevronRight className="w-5 h-5 text-gray-500" />
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
