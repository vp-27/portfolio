import { motion } from 'framer-motion'
import { Sparkles, X, ArrowRight, ArrowDown, ExternalLink } from 'lucide-react'
import type { AIQueryResult } from '../utils/aiAssistant'

interface AIAnswerCardProps {
  query: string
  result: AIQueryResult
  onChipClick: (chip: string) => void
  onAskCustom?: () => void
  onJumpToMilestone?: () => void
  onClose: () => void
}

export default function AIAnswerCard({ query, result, onChipClick, onAskCustom, onJumpToMilestone, onClose }: AIAnswerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.2 }}
      className="py-3 px-1 border-b border-[#2D2D2D] bg-transparent text-left w-full"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-2 mb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#00C805]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#00C805]">
            Vortex AI
          </span>
          <span className="text-xs text-gray-500 italic">
            &ldquo;{query}&rdquo;
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-white transition-colors"
          aria-label="Close AI Answer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* AI Answer Text */}
      <p className="text-sm text-gray-200 leading-relaxed font-normal mb-3">
        {result.answer}
      </p>

      {/* Direct Action Link (e.g. Open Resume PDF, Email Vandan) */}
      {result.actionUrl && (
        <div className="mb-3">
          <a
            href={result.actionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00C805]/10 hover:bg-[#00C805]/20 border border-[#00C805]/40 text-xs text-[#00C805] font-semibold transition-colors"
          >
            <span>{result.actionLabel || 'Open Link'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Action / Highlighted Status Badge with 1-Tap Jump */}
      {result.milestoneLabel && (
        <button
          onClick={onJumpToMilestone}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A227]/10 hover:bg-[#C9A227]/20 border border-[#C9A227]/40 text-xs text-[#C9A227] font-semibold mb-3 transition-colors cursor-pointer"
        >
          <span>Highlighted: {result.milestoneLabel}</span>
          <ArrowDown className="w-3 h-3 text-[#C9A227]" />
        </button>
      )}

      {/* Suggested Follow-up Chips */}
      {result.suggestedChips && result.suggestedChips.length > 0 && (
        <div className="mt-1">
          <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold block mb-1.5">
            Follow-up questions:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {result.suggestedChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => onChipClick(chip)}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#1E2124] hover:bg-[#2A2D31] active:bg-[#333333] border border-[#2D2D2D] text-xs text-gray-300 transition-colors"
              >
                <span>{chip}</span>
                <ArrowRight className="w-3 h-3 text-gray-500" />
              </button>
            ))}
            <button
              onClick={() => {
                if (onAskCustom) {
                  onAskCustom()
                } else {
                  const input = document.querySelector('input[type="text"]') as HTMLInputElement
                  if (input) {
                    input.focus()
                    input.select()
                  }
                }
              }}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#00C805]/10 hover:bg-[#00C805]/20 border border-[#00C805]/40 text-xs text-[#00C805] font-medium transition-colors"
            >
              <span>Type custom question...</span>
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}
