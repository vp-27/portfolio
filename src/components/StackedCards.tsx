import { motion, AnimatePresence } from 'framer-motion'
import type { ReactNode } from 'react'

interface StackedCardData {
  id: string
  content: ReactNode
}

interface StackedCardsProps {
  cards: StackedCardData[]
  className?: string
}

export default function StackedCards({
  cards,
  className = ''
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
                opacity: 1 - offset * 0.1
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
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            opacity: { duration: 0.2 }
          }}
          className="relative z-10"
        >
          {topCard && topCard.content}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
