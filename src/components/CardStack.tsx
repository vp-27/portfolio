import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Calendar } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Experience, Project } from '../types'

interface StackedCard {
  id: string
  type: 'experience' | 'project'
  data: Experience | Project
  order: number
}

interface CardStackProps {
  cards: StackedCard[]
  onDismiss: (id: string) => void
}

export default function CardStack({ cards, onDismiss }: CardStackProps) {
  const [aboutMePosition, setAboutMePosition] = useState({ top: 0, left: 0, width: 0 })

  // Calculate position of About Me section
  useEffect(() => {
    const updatePosition = () => {
      const aboutSection = document.querySelector('[data-section="about"]')
      if (aboutSection) {
        const rect = aboutSection.getBoundingClientRect()
        setAboutMePosition({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width
        })
      }
    }

    updatePosition()
    // Update more frequently to ensure accurate positioning
    const interval = setInterval(updatePosition, 100)
    window.addEventListener('scroll', updatePosition)
    window.addEventListener('resize', updatePosition)

    return () => {
      clearInterval(interval)
      window.removeEventListener('scroll', updatePosition)
      window.removeEventListener('resize', updatePosition)
    }
  }, [cards])

  // Calculate offset for stacked effect
  const getCardStyle = (card: StackedCard, index: number) => {
    const offset = index * 12 // 12px offset per card
    const scale = 1 - (index * 0.02) // Slightly scale down each card
    const rotation = index * 0.5 // Very subtle rotation
    
    return {
      top: aboutMePosition.top + offset,
      left: aboutMePosition.left,
      width: aboutMePosition.width || 'calc(100% - 32px)',
      scale,
      rotate: `${rotation}deg`,
      zIndex: 50 + card.order // Use card.order so most recent is on top
    }
  }

  const renderCardContent = (card: StackedCard) => {
    if (card.type === 'experience') {
      const exp = card.data as Experience
      return (
        <>
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 pr-8">
              <h3 className="font-medium text-white">{exp.position}</h3>
              <p className="text-sm text-[#FF5000]">{exp.company}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{exp.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{exp.startDate} – {exp.endDate}</span>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-gray-300">
            {exp.bullets.slice(0, 2).map((bullet, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-[#FF5000] mt-1">•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </>
      )
    } else {
      const project = card.data as Project
      return (
        <>
          <div className="mb-2">
            <h3 className="font-medium text-white">{project.name}</h3>
            <p className="text-sm text-gray-400">{project.subtitle}</p>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
            <Calendar className="w-3 h-3" />
            <span>{project.duration}</span>
          </div>
          <ul className="space-y-2 text-sm text-gray-300">
            {project.bullets.slice(0, 2).map((bullet, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-[#00C805] mt-1">•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
          {project.technologies && (
            <div className="flex flex-wrap gap-2 mt-3">
              {project.technologies.slice(0, 4).map((tech, idx) => (
                <span key={idx} className="text-xs bg-[#1A1A1A] px-2 py-1 rounded text-gray-400">
                  {tech}
                </span>
              ))}
            </div>
          )}
        </>
      )
    }
  }

  return (
    <div className="lg:hidden">
      <AnimatePresence>
        {cards.map((card, index) => {
          const style = getCardStyle(card, index)
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0.8, y: -50 }}
              animate={{ 
                opacity: 1, 
                scale: style.scale, 
                y: 0,
                rotate: style.rotate
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.8, 
                x: 100,
                transition: { duration: 0.2 }
              }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                delay: index * 0.05
              }}
              className="absolute pointer-events-auto"
              style={{
                position: 'absolute',
                top: `${style.top}px`,
                left: `${style.left}px`,
                width: typeof style.width === 'number' ? `${style.width}px` : style.width,
                zIndex: style.zIndex
              }}
            >
                <div className="bg-[#0D0D0D] rounded-lg p-6 shadow-2xl border border-[#1A1A1A] relative">
                  {/* Dismiss Button */}
                  <button
                    onClick={() => onDismiss(card.id)}
                    className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#1A1A1A] flex items-center justify-center hover:bg-[#2A2A2A] transition-colors z-10"
                    aria-label="Dismiss card"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>

                  {/* Card Content */}
                  {renderCardContent(card)}
                  
                  {/* Stack Indicator */}
                  {index === 0 && cards.length > 1 && (
                    <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                      {cards.length} stacked
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
    </div>
  )
}
