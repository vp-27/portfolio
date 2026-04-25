import { motion, AnimatePresence } from 'framer-motion'
import { useRef, useEffect } from 'react'
import type { Experience, Project } from '../types'
import StackedCards from './StackedCards'

interface ExperienceCardProps {
  experience: Experience | Project | null
  type: 'experience' | 'project' | null
  onDismiss?: () => void
}

export default function ExperienceCard({ experience, type, onDismiss }: ExperienceCardProps) {
  const hasContent = !!(experience && type)
  
  // Track if we've ever had content before (for first hover detection)
  const hadContentBefore = useRef(false)
  
  // Use ref to track previous content synchronously
  const previousContentRef = useRef<{
    experience: Experience | Project | null
    type: 'experience' | 'project' | null
  }>({ experience: null, type: null })
  
  // Store current as previous BEFORE render
  // If this is the first time showing content, previous should be placeholder
  const previousContent = hadContentBefore.current 
    ? previousContentRef.current 
    : { experience: null, type: null }
  
  // Update ref after render for next time
  useEffect(() => {
    if (hasContent) {
      hadContentBefore.current = true
    }
    previousContentRef.current = { experience, type }
  })

  const renderCardContent = (exp?: Experience | Project | null, cardType?: 'experience' | 'project' | null) => {
    const contentToRender = exp ?? experience
    const typeToRender = cardType ?? type
    const hasContentToRender = contentToRender && typeToRender
    
    if (!hasContentToRender) {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[80px] md:min-h-[100px] gap-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-10 h-10 rounded-full bg-[#1C1C1E] flex items-center justify-center"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#00C805] animate-pulse" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 text-sm font-medium"
          >
            Hover to explore
          </motion.p>
        </div>
      )
    }

    if (typeToRender === 'experience') {
      const expData = contentToRender as Experience
      return (
        <div className="space-y-4">
          {/* Header */}
          <div className="space-y-1">
            <h3 className="font-semibold text-[#FFD700] text-lg tracking-tight">{expData.position}</h3>
            <p className="text-[#00C805] font-medium text-sm">{expData.company}</p>
          </div>
          
          {/* Meta row */}
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>{expData.location}</span>
            <span className="text-gray-600">•</span>
            <span>{expData.startDate} – {expData.endDate}</span>
          </div>
          
          {/* Bullets */}
          <div className="space-y-3">
            {expData.bullets.slice(0, 2).map((bullet, idx) => (
              <p key={idx} className="text-sm text-gray-300 leading-relaxed pl-3 border-l-2 border-[#FFD700]/30">
                {bullet}
              </p>
            ))}
          </div>
        </div>
      )
    } else {
      const proj = contentToRender as Project
      return (
        <div className="space-y-4">
          {/* Header */}
          <div className="space-y-1">
            <h3 className="font-semibold text-[#FFD700] text-lg tracking-tight">{proj.name}</h3>
            <p className="text-gray-500 text-sm">{proj.subtitle}</p>
          </div>
          
          {/* Duration */}
          <div className="text-xs text-gray-500">
            {proj.duration}
          </div>
          
          {/* Bullets */}
          <div className="space-y-3">
            {proj.bullets.slice(0, 2).map((bullet, idx) => (
              <p key={idx} className="text-sm text-gray-300 leading-relaxed pl-3 border-l-2 border-[#FFD700]/30">
                {bullet}
              </p>
            ))}
          </div>
          
          {/* Technologies - Robinhood pill style */}
          {proj.technologies && proj.technologies.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-1">
              {proj.technologies.map((tech, idx) => (
                <span 
                  key={idx} 
                  className="px-3 py-1 text-[11px] font-semibold rounded-full bg-[#2C2C2E] text-gray-300 whitespace-nowrap"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      )
    }
  }

  // Create unique key for AnimatePresence to detect changes
  const contentKey = hasContent 
    ? `${type}-${(experience as any)?.id}` 
    : 'placeholder'

  // Create the main card element - Robinhood card style
  const createCardElement = (includeButton = true, additionalClasses = '', contentData?: { experience: Experience | Project | null, type: 'experience' | 'project' | null }) => {
    const cardExp = contentData?.experience ?? experience
    const cardType = contentData?.type ?? type
    const cardHasContent = cardExp && cardType
    
    return (
      <div
        className={`relative rounded-2xl overflow-hidden bg-[#1C1C1E] ${
          cardHasContent ? 'p-5 md:p-6' : 'py-4 md:py-6 px-5'
        } ${additionalClasses}`}
        style={{
          boxShadow: '0 2px 16px rgba(0, 0, 0, 0.3)'
        }}
      >
        {/* Dismiss button - Robinhood style */}
        {cardHasContent && onDismiss && includeButton && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={onDismiss}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 transition-colors"
            aria-label="Dismiss"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        )}
        
        {renderCardContent(cardExp, cardType)}
      </div>
    )
  }

  const mainCardElement = (
    <motion.div
      key={contentKey}
      initial={{ y: 80, opacity: 0, scale: 0.98 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: -60, opacity: 0, scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 35,
        opacity: { duration: 0.25 }
      }}
    >
      {createCardElement(true, '')}
    </motion.div>
  )

  // Create background cards with PREVIOUS content (outgoing)
  // Show previous content in background during transitions
  // If dismissing (going to placeholder), show placeholder in background too
  const backgroundContentData = hasContent ? previousContent : { experience: null, type: null }
  
  // Subtle depth variants for stacked effect - matching Robinhood dark grays
  const backgroundCard1 = createCardElement(false, '!bg-[#1A1A1C]', backgroundContentData)
  const backgroundCard2 = createCardElement(false, '!bg-[#18181A]', backgroundContentData)
  const backgroundCard3 = createCardElement(false, '!bg-[#161618]', backgroundContentData)

  const stackedCardsData = [
    { id: 'bg-3', content: backgroundCard3 },
    { id: 'bg-2', content: backgroundCard2 },
    { id: 'bg-1', content: backgroundCard1 },
    { 
      id: contentKey, 
      content: (
        <AnimatePresence mode="wait">
          {mainCardElement}
        </AnimatePresence>
      ) 
    }
  ]

  return (
    <StackedCards 
      cards={stackedCardsData}
      className="w-full"
      isInitial={!hadContentBefore.current && hasContent}
    />
  )
}
