import { motion } from 'framer-motion'
import { Sparkles, X, ArrowRight, ArrowDown, ExternalLink } from 'lucide-react'
import type { AIQueryResult } from '../utils/aiAssistant'

interface AIAnswerCardProps {
  query: string
  result: AIQueryResult
  onChipClick: (chip: string) => void
  onAskCustom?: () => void
  onJumpToMilestone?: (label?: string, origin?: { x: number; y: number }) => void
  onClose: () => void
}

export default function AIAnswerCard({ query, result, onChipClick, onAskCustom, onJumpToMilestone, onClose }: AIAnswerCardProps) {
  // Collect all milestone labels (either milestoneLabels array or single milestoneLabel)
  const labelsToRender = result.milestoneLabels && result.milestoneLabels.length > 0
    ? result.milestoneLabels
    : result.milestoneLabel
    ? [result.milestoneLabel]
    : []

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

      {/* Direct Action Links (e.g. Email, LinkedIn, GitHub, Resumes) */}
      {((result.actionLinks && result.actionLinks.length > 0) || result.actionUrl) && (
        <div className="flex flex-wrap gap-2 mb-3">
          {result.actionLinks && result.actionLinks.length > 0 ? (
            result.actionLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00C805]/10 border border-[#00C805] text-xs text-[#00C805] font-semibold hover:bg-[#00C805] hover:text-black hover:border-transparent transition-all duration-200 cursor-pointer shadow-[0_0_8px_rgba(0,200,5,0.15)]"
              >
                <span>{link.label}</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#00C805] group-hover:text-black transition-colors" />
              </a>
            ))
          ) : result.actionUrl ? (
            <a
              href={result.actionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00C805]/10 border border-[#00C805] text-xs text-[#00C805] font-semibold hover:bg-[#00C805] hover:text-black hover:border-transparent transition-all duration-200 cursor-pointer shadow-[0_0_8px_rgba(0,200,5,0.15)]"
            >
              <span>{result.actionLabel || 'Open Link'}</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#00C805] group-hover:text-black transition-colors" />
            </a>
          ) : null}
        </div>
      )}

      {/* Action / Highlighted Status Badges with 1-Tap Jump */}
      {labelsToRender.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {labelsToRender.map((label, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const origin = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
                onJumpToMilestone && onJumpToMilestone(label, origin)
              }}
              className="group inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A227]/10 border border-[#C9A227] text-xs text-[#C9A227] font-semibold hover:bg-[#C9A227] hover:text-black hover:border-transparent transition-all duration-200 cursor-pointer shadow-[0_0_8px_rgba(201,162,39,0.15)]"
            >
              <span>Visit: {label}</span>
              <ArrowDown className="w-3 h-3 text-[#C9A227] group-hover:text-black transition-colors" />
            </button>
          ))}
        </div>
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
                className="group flex items-center gap-1 px-3 py-1 rounded-full bg-[#181B1D] border border-[#3E4247] text-xs text-gray-200 font-normal hover:bg-[#00C805] hover:text-black hover:border-transparent transition-all duration-200 cursor-pointer"
              >
                <span>{chip}</span>
                <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-black transition-colors" />
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
              className="group flex items-center gap-1 px-3 py-1 rounded-full bg-[#00C805]/10 border border-[#00C805] text-xs text-[#00C805] font-semibold hover:bg-[#00C805] hover:text-black hover:border-transparent transition-all duration-200 cursor-pointer shadow-[0_0_8px_rgba(0,200,5,0.15)]"
            >
              <span>Type custom question...</span>
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}
