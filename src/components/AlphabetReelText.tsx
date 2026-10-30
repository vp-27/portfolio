import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'framer-motion'

const alphabet = Array.from(" '’&-0123456789abcdefghijklmnopqrstuvwxyz")
const rowHeight = 1.3

function letterPosition(character: string): number {
  return Math.max(0, alphabet.indexOf(character.toLowerCase()))
}

function LetterReel({
  character,
  initialCharacter,
}: {
  character: string
  initialCharacter: string
}) {
  const measure = useRef<HTMLSpanElement>(null)
  const [width, setWidth] = useState<number | undefined>(initialCharacter ? undefined : 0)
  const position = useMotionValue(letterPosition(initialCharacter))
  const y = useTransform(position, (value) => `${-value * rowHeight}em`)
  const target = letterPosition(character)
  const uppercase = /[A-Z]/.test(character)

  useLayoutEffect(() => {
    if (!measure.current) return
    const element = measure.current
    const updateWidth = () => setWidth(character ? element.getBoundingClientRect().width : 0)
    updateWidth()
    const observer = new ResizeObserver(updateWidth)
    observer.observe(element)
    return () => observer.disconnect()
  }, [character])

  useEffect(() => {
    // Animate the actual alphabet position. Retarget from the current position
    // during a fast scrub, without queuing outgoing letters or resetting a reel.
    const distance = Math.abs(target - position.get())
    const animation = animate(position, target, {
      duration: 0.6 + Math.min(distance, 20) * 0.0072,
      ease: [0.25, 0.1, 0.25, 1],
    })
    return () => animation.stop()
  }, [position, target])

  return (
    <motion.span
      className="relative inline-block shrink-0 overflow-hidden align-top"
      style={{ height: `${rowHeight}em` }}
      initial={false}
      animate={{ width }}
      transition={{ duration: 0.488, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <span ref={measure} className="invisible inline-block whitespace-pre">
        {character || '\u00a0'}
      </span>
      <motion.span className="absolute inset-x-0 top-0" style={{ y }}>
        {alphabet.map((letter, index) => (
          <span
            key={index}
            className="block whitespace-pre"
            style={{ height: `${rowHeight}em`, lineHeight: `${rowHeight}em` }}
          >
            {index === 0 && target === 0
              ? character || '\u00a0'
              : uppercase ? letter.toUpperCase() : letter}
          </span>
        ))}
      </motion.span>
    </motion.span>
  )
}

export default function AlphabetReelText({ text }: { text: string }) {
  const [initialText] = useState(text)
  const [slots, setSlots] = useState(text.length)
  // Keep existing reels mounted when a shorter title arrives so they can roll
  // to blank and collapse, then be reused on the next hover.
  if (text.length > slots) setSlots(text.length)

  return (
    <span aria-hidden="true" className="inline-flex align-top" style={{ lineHeight: rowHeight }}>
      {Array.from({ length: slots }, (_, index) => (
        <LetterReel
          key={index}
          character={text[index] || ''}
          initialCharacter={initialText[index] || ''}
        />
      ))}
    </span>
  )
}
