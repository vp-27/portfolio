import { motion, AnimatePresence } from 'framer-motion'
import { useRef, useEffect } from 'react'
import type { Experience, Project } from '../types'
import StackedCards from './StackedCards'

interface ExperienceCardProps {
  experience: Experience | Project | null
  type: 'experience' | 'project' | null
  onDismiss?: () => void
}

// Robinhood Gold inspired colors
const GOLD = '#FFD700'
const GOLD_MUTED = 'rgba(255, 215, 0, 0.6)'
const CARD_BG = '#1C1C1E'
const CARD_BORDER = 'rgba(255, 215, 0, 0.1)'

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
        <div className="flex flex-col items-center justify-center h-full min-h-[80px] md:min-h-[100px] gap-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-8 h-8 rounded-full border border-[rgba(255,215,0,0.3)] flex items-center justify-center"
          >
            <div className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[rgba(255,215,0,0.7)] text-sm font-medium tracking-wide"
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
            <h3 className="font-semibold text-white text-lg tracking-tight">{expData.position}</h3>
            <div className="flex items-center gap-2">
              <span className="text-[#FFD700] font-medium text-sm">{expData.company}</span>
              <span className="text-gray-600">·</span>
              <span className="text-gray-500 text-sm">{expData.location}</span>
            </div>
          </div>
          
          {/* Date badge */}
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-[rgba(255,215,0,0.08)] border border-[rgba(255,215,0,0.15)]">
            <span className="text-xs text-[rgba(255,215,0,0.9)] font-medium tracking-wide">
              {expData.startDate} — {expData.endDate}
            </span>
          </div>
          
          {/* Bullets - cleaner Robinhood style */}
          <div className="space-y-3 pt-1">
            {expData.bullets.slice(0, 2).map((bullet, idx) => (
              <p key={idx} className="text-sm text-gray-400 leading-relaxed pl-3 border-l-2 border-[rgba(255,215,0,0.2)]">
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
            <h3 className="font-semibold text-white text-lg tracking-tight">{proj.name}</h3>
            <p className="text-gray-500 text-sm">{proj.subtitle}</p>
          </div>
          
          {/* Date badge */}
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-[rgba(255,215,0,0.08)] border border-[rgba(255,215,0,0.15)]">
            <span className="text-xs text-[rgba(255,215,0,0.9)] font-medium tracking-wide">
              {proj.duration}
            </span>
          </div>
          
          {/* Bullets - cleaner Robinhood style */}
          <div className="space-y-3 pt-1">
            {proj.bullets.slice(0, 2).map((bullet, idx) => (
              <p key={idx} className="text-sm text-gray-400 leading-relaxed pl-3 border-l-2 border-[rgba(255,215,0,0.2)]">
                {bullet}
              </p>
            ))}
          </div>
          
          {/* Technologies - Robinhood minimal pill style */}
          {proj.technologies && proj.technologies.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-2">
              {proj.technologies.slice(0, 4).map((tech, idx) => (
                <span 
                  key={idx} 
                  className="text-xs text-[#00C805] font-medium bg-[rgba(0,200,5,0.1)] px-2.5 py-1 rounded-full border border-[rgba(0,200,5,0.2)]"
                >
                  {tech}
                </span>
              ))}
              {proj.technologies.length > 4 && (
                <span className="text-xs text-gray-500">+{proj.technologies.length - 4}</span>
              )}
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

  // Create the main card element - Robinhood premium card style
  const createCardElement = (includeButton = true, additionalClasses = '', contentData?: { experience: Experience | Project | null, type: 'experience' | 'project' | null }) => {
    const cardExp = contentData?.experience ?? experience
    const cardType = contentData?.type ?? type
    const cardHasContent = cardExp && cardType
    
    return (
      <div
        className={`relative rounded-2xl overflow-hidden ${
          cardHasContent ? 'p-6 md:p-7' : 'py-4 md:py-6 px-6'
        } ${additionalClasses}`}
        style={{
          background: 'linear-gradient(145deg, #1E1E20 0%, #141416 100%)',
          border: '1px solid rgba(255, 215, 0, 0.08)',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.02) inset'
        }}
      >
        {/* Subtle gold gradient overlay for premium feel */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at top right, #FFD700, transparent 70%)'
          }}
        />
        
        {/* Dismiss button - more subtle, Robinhood style */}
        {cardHasContent && onDismiss && includeButton && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={onDismiss}
            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] flex items-center justify-center transition-all duration-200 group"
            aria-label="Dismiss"
          >
            <svg 
              className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-300 transition-colors" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        )}
        
        <div className="relative z-10">
          {renderCardContent(cardExp, cardType)}
        </div>
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
  
  // Subtle depth variants for stacked effect
  const backgroundCard1 = createCardElement(false, 'opacity-60', backgroundContentData)
  const backgroundCard2 = createCardElement(false, 'opacity-40', backgroundContentData)
  const backgroundCard3 = createCardElement(false, 'opacity-20', backgroundContentData)

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
