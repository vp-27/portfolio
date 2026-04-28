import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import BottomNav from '../components/BottomNav'
import { portfolioEducation, portfolioCertifications } from '../data/portfolioData'

export default function EducationPage() {
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-sm z-10">
        <div className="relative flex items-center justify-center px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-4 p-1 hover:bg-[#1A1A1A] rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Education</h1>
        </div>
      </div>

      <div className="px-4 py-4 space-y-8">
        {/* Education Section */}
        <div>
          <h2 className="text-lg font-medium mb-4 text-gray-400">Degrees</h2>
          <div className="space-y-4">
            {portfolioEducation.map((edu, index) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1E2124] rounded-xl p-5 cursor-default hover:bg-[#2A2D31]"
              >
                {/* Header with GPA */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-white text-lg">{edu.institution}</h3>
                  <div className="text-right flex-shrink-0 ml-4">
                    <div className="text-[10px] text-gray-500 mb-0.5">GPA</div>
                    <div className="text-xl font-bold text-[#00C805]">{edu.gpa}</div>
                  </div>
                </div>

                {/* Degrees */}
                <div className="space-y-1.5 mb-3">
                  {edu.degrees.map((degree, idx) => (
                    <p key={idx} className="text-sm text-gray-300 leading-relaxed">{degree}</p>
                  ))}
                </div>

                {/* Location and Date - Pill style with icon circles */}
                <div className="flex items-center gap-2 text-xs mb-4 flex-wrap">
                  <div className="inline-flex items-center gap-2 px-1 pr-3 py-1 rounded-full bg-[#2A2A2D] border border-[#3A3A3C]">
                    <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center">
                      <img src="/images/tags/location.png" alt="" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-gray-300">{edu.location}</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-1 pr-3 py-1 rounded-full bg-[#2A2A2D] border border-[#3A3A3C]">
                    <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center">
                      <img src="/images/tags/calendar.png" alt="" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-gray-300">{edu.graduationDate}</span>
                  </div>
                </div>

                {/* Honors */}
                {edu.honors && edu.honors.length > 0 && (
                  <div className="pt-3 border-t border-[#2C2C2E]">
                    <div className="mb-2">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Honors & Recognition</span>
                    </div>
                    <div className="space-y-2">
                      {edu.honors.map((honor, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="text-[#00C805] mt-0.5 flex-shrink-0 text-xs">▸</span>
                          <span className="text-sm text-gray-300 leading-relaxed">{honor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Certifications Section */}
        <div>
          <h2 className="text-lg font-medium mb-4 text-gray-400">Certifications</h2>
          <div className="space-y-3">
            {portfolioCertifications.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="bg-[#1E2124] rounded-xl p-4 cursor-default hover:bg-[#2A2D31]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-white">{cert.name}</h3>
                    <p className="text-sm text-gray-400 mt-0.5">{cert.issuer}</p>
                  </div>
                  {cert.date && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 flex-shrink-0">
                      <div className="w-4 h-4 rounded-full overflow-hidden flex items-center justify-center">
                        <img src="/images/tags/calendar.png" alt="" className="w-full h-full object-cover" />
                      </div>
                      <span>{cert.date}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
