import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Calendar, Code, X } from 'lucide-react'
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
        <div className="flex items-center justify-center h-full min-h-[60px] md:min-h-[80px]">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#C9A227] text-base md:text-lg font-medium"
          >
            Select a milestone above
          </motion.p>
        </div>
      )
    }

    if (typeToRender === 'experience') {
      const expData = contentToRender as Experience
      return (
        <div>
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-[#C9A227] text-lg">{expData.position}</h3>
              <p className="text-sm text-gray-400 mt-1">{expData.company}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>{expData.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{expData.startDate} – {expData.endDate}</span>
            </div>
          </div>
          <ul className="space-y-2.5 text-sm text-gray-300">
            {expData.bullets.slice(0, 2).map((bullet, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-[#C9A227] mt-1.5">•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      )
    } else {
      const proj = contentToRender as Project
      return (
        <div>
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-[#C9A227] text-lg">{proj.name}</h3>
              <p className="text-sm text-gray-400 mt-1">{proj.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
            <Calendar className="w-3.5 h-3.5" />
            <span>{proj.duration}</span>
          </div>
          <ul className="space-y-2.5 text-sm text-gray-300 mb-4">
            {proj.bullets.slice(0, 2).map((bullet, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-[#C9A227] mt-1.5">•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
          {proj.technologies && proj.technologies.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap mt-3">
              <Code className="w-3.5 h-3.5 text-gray-500" />
              {proj.technologies.slice(0, 4).map((tech, idx) => (
                <span key={idx} className="text-xs text-black font-semibold bg-[#00C805] px-2.5 py-1 rounded">
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

  // Create the main card element
  const createCardElement = (includeButton = true, additionalClasses = '', contentData?: { experience: Experience | Project | null, type: 'experience' | 'project' | null }) => {
    const cardExp = contentData?.experience ?? experience
    const cardType = contentData?.type ?? type
    const cardHasContent = cardExp && cardType
    
    return (
      <div
        className={`bg-[#2B2D2E] rounded-lg shadow-2xl border border-[#3A3C3D] overflow-hidden relative px-6 ${
          cardHasContent ? 'py-6 min-h-0' : 'py-3 md:py-4 min-h-[60px] md:min-h-[80px]'
        } ${additionalClasses}`}
      >
        {/* X button - only show when there's content and on main card */}
        {cardHasContent && onDismiss && includeButton && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            onClick={onDismiss}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </motion.button>
        )}
        
        {renderCardContent(cardExp, cardType)}
      </div>
    )
  }

  const mainCardElement = (
    <motion.div
      key={contentKey}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        opacity: { duration: 0.2 }
      }}
    >
      {createCardElement(true, '')}
    </motion.div>
  )

  // Create background cards with PREVIOUS content (outgoing)
  // Show previous content in background during transitions
  // If dismissing (going to placeholder), show placeholder in background too
  const backgroundContentData = hasContent ? previousContent : { experience: null, type: null }
  
  const backgroundCard1 = createCardElement(false, '', backgroundContentData)
  const backgroundCard2 = createCardElement(false, 'bg-[#2A2C2D]', backgroundContentData)
  const backgroundCard3 = createCardElement(false, 'bg-[#282A2B]', backgroundContentData)

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
