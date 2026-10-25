import { motion, useReducedMotion } from 'framer-motion'
import type { ChartDataPoint } from '../types'

interface PortfolioHeaderProps {
  hoveredPoint?: ChartDataPoint | null
}

export default function PortfolioHeader({ hoveredPoint }: PortfolioHeaderProps) {
  const reducedMotion = useReducedMotion()
  const currentText = hoveredPoint?.label || "Vandan's Timeline"

  return (
    <div className="pt-4 pb-2 px-4 md:px-0">
      <h1 className="mb-2 min-h-9 overflow-hidden text-[clamp(1.65rem,7.7vw,1.875rem)] font-normal">
        <motion.span
          key={currentText}
          className="block"
          initial={reducedMotion ? false : { y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.14 }}
        >
          {currentText}
        </motion.span>
      </h1>

      {/* Category Descriptor */}
      <div className="flex items-center gap-2 text-sm text-rh-green">
        <span className="flex items-center">
          <span className="mr-1">▲</span>
          {hoveredPoint?.category || 'Projects Growth'}
        </span>
      </div>

      {/* Time Descriptor */}
      <div className="flex items-center gap-2 text-sm mt-0.5 text-[#00C805]">
        <span className="flex items-center">
          <span className="mr-1">▲</span>
          {hoveredPoint ? hoveredPoint.time : 'Career Growth'}
        </span>
      </div>
    </div>
  )
}
