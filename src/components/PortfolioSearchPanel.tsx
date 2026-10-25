import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Search, X, ArrowRight, ArrowDown, ExternalLink } from 'lucide-react'
import type { AIQueryResult } from '../utils/aiAssistant'
import { searchPortfolio } from '../utils/portfolioSearch'

interface PortfolioSearchPanelProps {
  query: string
  result: AIQueryResult | null
  isLoading: boolean
  onSubmit: (query: string) => void
  onEdit: () => void
  onJump: (label: string, origin: { x: number; y: number }) => void
  onClear: () => void
}

export default function PortfolioSearchPanel({
  query,
  result,
  isLoading,
  onSubmit,
  onEdit,
  onJump,
  onClear,
}: PortfolioSearchPanelProps) {
  const reducedMotion = useReducedMotion()
  const [showProgress, setShowProgress] = useState(false)
  const matches = searchPortfolio(query)
  const targets = result?.matchingTargets ?? (matches.active ? matches.targets : [])
  const links = result?.actionLinks?.length
    ? result.actionLinks
    : result?.actionUrl
      ? [{ label: result.actionLabel || 'Open link', url: result.actionUrl }]
      : []
  const milestones = result?.milestoneLabels?.length
    ? result.milestoneLabels
    : result?.milestoneLabel
      ? [result.milestoneLabel]
      : []
  const summary = matches.active
    ? matches.targets.length
      ? `${matches.targets.length} matching projects & experiences.`
      : 'No matching projects or experience. Try another term, or press Enter to explore this topic.'
    : 'Press Enter to explore this topic.'

  useEffect(() => {
    // Fast local answers should never flash a loader or wait for an artificial timer.
    setShowProgress(false)
    if (!isLoading) return
    const timer = setTimeout(() => setShowProgress(true), 180)
    return () => clearTimeout(timer)
  }, [isLoading, query])

  const jump = (label: string, element: HTMLButtonElement) => {
    const rect = element.getBoundingClientRect()
    onJump(label, { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 })
  }

  return (
    <section
      data-section="search-answer"
      aria-label="Portfolio search results"
      className="py-3 px-1 border-b border-[#2d2d2d] text-left"
    >
      <div className="flex items-center gap-2 mb-3">
        <span
          className="flex w-4 h-4 shrink-0 items-center justify-center text-rh-green"
          aria-hidden="true"
        >
          {showProgress ? (
            <span className="search-wave">
              {Array.from({ length: 9 }, (_, index) => (
                <span
                  key={index}
                  style={{ animationDelay: `${(index % 3) * 100 + Math.floor(index / 3) * 70}ms` }}
                />
              ))}
            </span>
          ) : (
            <Search className="w-4 h-4" />
          )}
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider text-rh-green">Search</span>
        <button
          type="button"
          onClick={onEdit}
          title={query}
          aria-label={`Edit search: ${query}`}
          className="min-w-0 truncate text-xs text-gray-400 text-left hover:text-white"
        >
          &ldquo;{query}&rdquo;
        </button>
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="ml-auto shrink-0 p-2 text-gray-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* One persistent surface: only the prose changes from live matches to an answer.
          Model/local provenance stays internal; neither path claims to be a person. */}
      <div aria-live="polite" aria-busy={isLoading}>
        <span className="sr-only">{showProgress ? 'Searching portfolio…' : ''}</span>
        <AnimatePresence initial={false} mode="wait">
          <motion.p
            key={result ? 'answer' : 'matches'}
            initial={reducedMotion ? false : { opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.12 }}
            className="text-sm text-gray-200 leading-relaxed whitespace-pre-line mb-3"
          >
            {result?.answer || summary}
          </motion.p>
        </AnimatePresence>
      </div>

      {links.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-rh-green/40 text-xs text-rh-green hover:bg-rh-green hover:text-black transition-colors"
            >
              {link.label}
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ))}
        </div>
      )}

      {targets.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2" aria-label="Matching entries">
          {targets.map((target) => (
            <button
              key={`${target.type}-${target.id}`}
              type="button"
              onClick={(event) =>
                target.milestoneLabel && jump(target.milestoneLabel, event.currentTarget)
              }
              className="milestone-link inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium"
            >
              {target.label}
              <ArrowDown className="w-3 h-3" />
            </button>
          ))}
        </div>
      )}
      {!targets.length && milestones.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {milestones.map((label) => (
            <button
              key={label}
              type="button"
              onClick={(event) => jump(label, event.currentTarget)}
              className="milestone-link inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs"
            >
              Visit {label}
              <ArrowDown className="w-3 h-3" />
            </button>
          ))}
        </div>
      )}
      {result && !targets.length && result.suggestedChips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {result.suggestedChips.slice(0, 3).map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => onSubmit(chip)}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-full border border-[#3e4247] text-xs text-gray-300 hover:text-rh-green hover:border-rh-green transition-colors"
            >
              {chip}
              <ArrowRight className="w-3 h-3" />
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
