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
      // Find the visible About Me section (desktop or mobile)
      const aboutSections = document.querySelectorAll('[data-section="about"]')
      let visibleSection: Element | null = null
      
      // Find the visible one (not display:none or hidden by responsive classes)
      for (let i = 0; i < aboutSections.length; i++) {
        const section = aboutSections[i]
        const rect = section.getBoundingClientRect()
        // Check if element is visible (has dimensions)
        if (rect.height > 0 && rect.width > 0) {
          visibleSection = section
          break
        }
      }
      
      if (visibleSection) {
        const rect = visibleSection.getBoundingClientRect()
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
    const offset = index * 8 // 8px offset per card (reduced for tighter stack)
    const scale = 1 - (index * 0.015) // Slightly scale down each card (reduced for subtler effect)
    
    return {
      top: aboutMePosition.top + offset,
      left: aboutMePosition.left,
      width: aboutMePosition.width || 'calc(100% - 32px)',
      scale,
      rotate: '0deg', // No rotation - stack straight down
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
          <div className="space-y-3">
            {exp.bullets.slice(0, 2).map((bullet, idx) => (
              <p key={idx} className="text-sm text-gray-300 leading-relaxed pl-3 border-l-2 border-[#FF5000]/30">
                {bullet}
              </p>
            ))}
          </div>
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
          <div className="space-y-3">
            {project.bullets.slice(0, 2).map((bullet, idx) => (
              <p key={idx} className="text-sm text-gray-300 leading-relaxed pl-3 border-l-2 border-[#00C805]/30">
                {bullet}
              </p>
            ))}
          </div>
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
    <div>
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
