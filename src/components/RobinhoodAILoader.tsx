import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface RobinhoodAILoaderProps {
  onComplete?: () => void
}

export default function RobinhoodAILoader({ onComplete }: RobinhoodAILoaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let startTime = performance.now()
    const duration = 1100 // Synchronized 1.1s loading duration

    const render = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)

      const width = canvas.width
      const height = canvas.height
      ctx.clearRect(0, 0, width, height)

      // Grid parameters for horizontal output banner
      const cols = 36
      const rows = 8
      const cellW = width / cols
      const cellH = height / rows

      const apexX = width / 2
      const apexY = height / 2

      // Outward V-expansion wave:
      // Starts at center (0) and expands outward to maxDist as progress goes 0 -> 1
      const maxDist = Math.sqrt((width / 2) * (width / 2) + height * height)
      const currentFront = progress * (maxDist + 30)

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = (c + 0.5) * cellW
          const y = (r + 0.5) * cellH

          // Inverted V outward distance formula
          const dx = Math.abs(x - apexX)
          const dy = Math.abs(y - apexY)
          const dist = dx * 0.75 + dy * 0.5

          const distFromFront = Math.abs(dist - currentFront)
          const isInsideWave = dist <= currentFront

          let dotRadius = 2.0
          let alpha = 0.1
          let color = '#222222'

          if (distFromFront < 20) {
            // Bright glowing outward V-wavefront!
            const intensity = 1 - distFromFront / 20
            dotRadius = 2.0 + intensity * 3.5
            alpha = 0.3 + intensity * 0.7
            color = intensity > 0.5 ? '#00FF66' : '#00C805'
          } else if (isInsideWave) {
            // Illuminated dots behind the expanding wave
            dotRadius = 2.4
            alpha = 0.35
            color = '#00C805'
          }

          ctx.beginPath()
          ctx.arc(x, y, dotRadius, 0, Math.PI * 2)
          ctx.fillStyle = color === '#222222' ? `rgba(255, 255, 255, ${alpha})` : color
          ctx.globalAlpha = alpha
          ctx.fill()
          ctx.globalAlpha = 1.0
        }
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(render)
      } else {
        if (onComplete) onComplete()
      }
    }

    // Handle resizing canvas
    const handleResize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth
        canvas.height = canvas.parentElement.clientHeight || 76
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    animationFrameId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [onComplete])

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative w-full h-[76px] my-2 bg-black rounded-xl overflow-hidden border border-[#00C805]/40 shadow-[0_0_20px_rgba(0,200,5,0.25)]"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </motion.div>
  )
}
