import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface BlobFlightData {
  id: string
  startX: number
  startY: number
  targetSelector: string
  label: string
}

interface FluidBlobTransitionProps {
  flight: BlobFlightData | null
  onImpact: (flight: BlobFlightData) => void
  onComplete: () => void
}

interface Particle {
  id: number
  angle: number
  distance: number
  size: number
  delay: number
}

interface SparkleTrail {
  x: number
  y: number
  id: number
}

export default function FluidBlobTransition({ flight, onImpact, onComplete }: FluidBlobTransitionProps) {
  const [phase, setPhase] = useState<'idle' | 'flying' | 'impact'>('idle')
  const [blobPos, setBlobPos] = useState<{ x: number; y: number; rotate: number; scale: number; morph: string }>({
    x: 0,
    y: 0,
    rotate: 0,
    scale: 0.8,
    morph: '50% 50% 50% 50%',
  })
  const [impactCenter, setImpactCenter] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [particles, setParticles] = useState<Particle[]>([])
  const [trail, setTrail] = useState<SparkleTrail[]>([])

  const onImpactRef = useRef(onImpact)
  onImpactRef.current = onImpact

  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const processedFlightIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (!flight) {
      setPhase('idle')
      processedFlightIdRef.current = null
      return
    }

    if (processedFlightIdRef.current === flight.id) {
      return
    }
    processedFlightIdRef.current = flight.id

    const startTime = performance.now()
    const DURATION = 460 // ms flight duration
    let rafId: number
    let completeTimeoutId: number
    const trailHistory: SparkleTrail[] = []

    setPhase('flying')

    // Create 10 radial particles for impact shockwave
    const newParticles: Particle[] = Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      angle: (i * (360 / 10) + Math.random() * 15) * (Math.PI / 180),
      distance: 30 + Math.random() * 45,
      size: 3.5 + Math.random() * 3,
      delay: Math.random() * 0.04,
    }))
    setParticles(newParticles)

    const updateFrame = (now: number) => {
      const elapsed = now - startTime
      const t = Math.min(1, elapsed / DURATION)

      // Smooth ease in-out
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

      // Live query for target element's actual viewport position during scroll
      const targetEl = document.querySelector(flight.targetSelector) as HTMLElement | null
      const isMobile = window.innerWidth < 768
      let targetX = window.innerWidth / 2
      let targetY = isMobile ? window.innerHeight * 0.28 : window.innerHeight * 0.32

      if (targetEl) {
        const rect = targetEl.getBoundingClientRect()
        // Anchor to the top-left icon / title area of the card
        targetX = rect.left + (isMobile ? Math.min(rect.width * 0.25, 60) : Math.min(rect.width * 0.2, 75))
        targetY = rect.top + Math.min(rect.height * 0.35, 38)
      }

      // Parabolic Arc: slight gentle rise before converging onto target
      const arc = Math.sin(t * Math.PI) * -35
      const currentX = flight.startX + (targetX - flight.startX) * ease
      const currentY = flight.startY + (targetY - flight.startY) * ease + arc

      // Organic rotation and squish morph
      const rotate = ease * 360
      const scale = t < 0.15 ? 0.6 + t * 3.5 : t > 0.85 ? 1.2 - (t - 0.85) * 1.5 : 1.15

      const morphShapes = [
        '50% 50% 50% 50%',
        '40% 60% 70% 30% / 50% 60% 40% 50%',
        '60% 40% 30% 70% / 60% 30% 70% 40%',
        '45% 55% 60% 40% / 40% 60% 50% 50%',
      ]
      const morphIndex = Math.min(morphShapes.length - 1, Math.floor(t * morphShapes.length))
      const morph = morphShapes[morphIndex]

      setBlobPos({ x: currentX, y: currentY, rotate, scale, morph })

      // Maintain a 4-point fading sparkle trail behind the blob
      trailHistory.push({ x: currentX, y: currentY, id: now })
      if (trailHistory.length > 5) {
        trailHistory.shift()
      }
      setTrail([...trailHistory])

      if (t < 1) {
        rafId = requestAnimationFrame(updateFrame)
      } else {
        // Impact & Shockwave detonation exactly on the card!
        const finalTargetEl = document.querySelector(flight.targetSelector) as HTMLElement | null
        let finalImpactX = targetX
        let finalImpactY = targetY
        if (finalTargetEl) {
          const finalRect = finalTargetEl.getBoundingClientRect()
          finalImpactX = finalRect.left + (isMobile ? Math.min(finalRect.width * 0.25, 60) : Math.min(finalRect.width * 0.2, 75))
          finalImpactY = finalRect.top + Math.min(finalRect.height * 0.35, 38)
        }

        setImpactCenter({ x: finalImpactX, y: finalImpactY })
        setPhase('impact')
        onImpactRef.current(flight)

        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          try {
            navigator.vibrate(15)
          } catch {
            // ignore
          }
        }

        completeTimeoutId = window.setTimeout(() => {
          setPhase('idle')
          onCompleteRef.current()
        }, 420)
      }
    }

    rafId = requestAnimationFrame(updateFrame)

    return () => {
      cancelAnimationFrame(rafId)
      if (completeTimeoutId) clearTimeout(completeTimeoutId)
    }
  }, [flight?.id])

  if (!flight || phase === 'idle') return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <AnimatePresence>
        {phase === 'flying' && (
          <>
            {/* Trailing sparkle particles */}
            {trail.map((point, idx) => {
              const trailOpacity = (idx + 1) / trail.length * 0.6
              const trailScale = (idx + 1) / trail.length * 0.7
              return (
                <div
                  key={`trail-${point.id}-${idx}`}
                  className="absolute w-2.5 h-2.5 rounded-full bg-[#FFF0A0] blur-[0.5px]"
                  style={{
                    transform: `translate(${point.x - 5}px, ${point.y - 5}px) scale(${trailScale})`,
                    opacity: trailOpacity,
                    boxShadow: '0 0 10px #C9A227, 0 0 16px rgba(201, 162, 39, 0.6)',
                    transition: 'opacity 0.1s linear',
                  }}
                />
              )
            })}

            {/* Main Liquid Flying Golden Blob */}
            <div
              className="absolute w-9 h-9 flex items-center justify-center"
              style={{
                transform: `translate(${blobPos.x - 18}px, ${blobPos.y - 18}px) scale(${blobPos.scale}) rotate(${blobPos.rotate}deg)`,
                borderRadius: blobPos.morph,
                transition: 'border-radius 0.15s ease',
              }}
            >
              {/* Inner glowing liquid core */}
              <div
                className="w-full h-full rounded-full bg-gradient-to-tr from-[#A8801A] via-[#E5C158] to-[#FFF0A0]"
                style={{
                  boxShadow:
                    '0 0 20px #C9A227, 0 0 35px rgba(201, 162, 39, 0.8), 0 0 50px rgba(201, 162, 39, 0.4), inset 0 0 8px #FFF9D2',
                }}
              />
              {/* Ambient radial halo */}
              <div
                className="absolute inset-[-8px] rounded-full bg-[#C9A227]/30 blur-md pointer-events-none"
              />
            </div>
          </>
        )}

        {phase === 'impact' && (
          <div
            className="absolute"
            style={{
              left: `${impactCenter.x}px`,
              top: `${impactCenter.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Primary Shockwave Ring */}
            <motion.div
              initial={{ scale: 0.2, opacity: 1, borderWidth: '3px' }}
              animate={{ scale: 4.0, opacity: 0, borderWidth: '1px' }}
              transition={{ duration: 0.38, ease: 'easeOut' }}
              className="absolute -inset-8 rounded-full border border-[#E5C158]"
              style={{
                boxShadow: '0 0 30px #C9A227, inset 0 0 20px rgba(201, 162, 39, 0.5)',
              }}
            />

            {/* Secondary Ripple Wave */}
            <motion.div
              initial={{ scale: 0.1, opacity: 0.85, borderWidth: '2px' }}
              animate={{ scale: 5.5, opacity: 0, borderWidth: '0px' }}
              transition={{ duration: 0.42, delay: 0.04, ease: 'easeOut' }}
              className="absolute -inset-8 rounded-full border border-[#FFF0A0]"
              style={{
                boxShadow: '0 0 40px rgba(201, 162, 39, 0.6)',
              }}
            />

            {/* Central Gold Flash Pulse */}
            <motion.div
              initial={{ scale: 1.3, opacity: 1 }}
              animate={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.24, ease: 'easeIn' }}
              className="w-12 h-12 -ml-6 -mt-6 rounded-full bg-gradient-to-r from-[#E5C158] to-[#FFF9D2]"
              style={{
                boxShadow: '0 0 35px #FFF0A0, 0 0 60px #C9A227',
              }}
            />

            {/* Radial Impact Sparks */}
            {particles.map((p) => {
              const sparkX = Math.cos(p.angle) * p.distance
              const sparkY = Math.sin(p.angle) * p.distance
              return (
                <motion.div
                  key={p.id}
                  initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                  animate={{
                    x: sparkX,
                    y: sparkY,
                    scale: 0,
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.34,
                    delay: p.delay,
                    ease: 'easeOut',
                  }}
                  className="absolute rounded-full bg-[#FFF0A0]"
                  style={{
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    boxShadow: '0 0 8px #E5C158',
                  }}
                />
              )
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
