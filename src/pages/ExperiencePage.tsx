import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, MapPin } from 'lucide-react'
import BottomNav from '../components/BottomNav'
import { mockExperiences } from '../data/mockData'

export default function ExperiencePage() {
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
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
          <h1 className="text-lg font-semibold">Professional Experience</h1>
        </div>
      </div>

      {/* Experience List */}
      <div className="px-4 py-4">
        <div className="space-y-4">
          {mockExperiences.map((exp, index) => {
            const isCurrent = exp.endDate.toLowerCase() === 'present'
            
            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1C1C1E] rounded-xl p-5"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="font-semibold text-white text-lg">{exp.company}</h2>
                      {isCurrent && (
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#00C805] text-black rounded-sm">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{exp.position}</p>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    {exp.startDate} – {exp.endDate}
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-xs mb-4">
                  <MapPin className="w-3.5 h-3.5 text-[#FF5000]" />
                  <span className="text-[#FF5000]">{exp.location}</span>
                </div>

                {/* Bullets */}
                <div className="space-y-2.5">
                  {exp.bullets.map((bullet, idx) => (
                    <div
                      key={idx}
                      className="flex gap-3 text-sm text-gray-300 leading-relaxed"
                    >
                      <span className="text-[#00C805] mt-0.5 flex-shrink-0 text-xs">▸</span>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
