import { motion, AnimatePresence } from 'framer-motion'
import type { ReactNode } from 'react'

interface StackedCardData {
  id: string
  content: ReactNode
}

interface StackedCardsProps {
  cards: StackedCardData[]
  className?: string
  isInitial?: boolean
}

export default function StackedCards({
  cards,
  className = '',
  isInitial = false
}: StackedCardsProps) {
  // Separate the top card from background cards
  const topCard = cards[cards.length - 1]
  const backgroundCards = cards.slice(0, -1)

  return (
    <div className={`relative ${className}`}>
      {/* Background cards - absolutely positioned to peek from below */}
      {backgroundCards.map((card, index) => {
        const offset = backgroundCards.length - index

        return (
          <div 
            key={card.id} 
            className="absolute left-0 right-0 top-0 pointer-events-none"
          >
            <motion.div
              animate={{
                rotateZ: 0,
                scale: 1 - offset * 0.03,
                y: offset * 8, // Positive Y to peek from bottom
                x: 0,
                transformOrigin: 'top center',
                zIndex: index,
                opacity: isInitial ? 0 : 1 - offset * 0.05 // Reduced opacity difference to prevent shadow stacking
              }}
              initial={false}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20
              }}
            >
              {card.content}
            </motion.div>
          </div>
        )
      })}

      {/* Top card - in normal document flow with animation */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={topCard?.id}
          initial={{ y: 100, opacity: 0, scale: 1 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ 
            y: 8, // Sink to position of first background card
            opacity: 1, // Keep fully opaque - becomes the background card
            scale: 0.97, // Match first background card scale
            transition: {
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1]
            }
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
          className="relative z-10"
        >
          {topCard && topCard.content}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
