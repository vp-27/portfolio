import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowDown, ExternalLink } from 'lucide-react'
import type { AIQueryResult } from '../utils/aiAssistant'
import { searchPortfolio, describeListedSkills } from '../utils/portfolioSearch'
import SearchDotWave from './SearchDotWave'
import type { SearchPhase } from '../utils/searchPresentation'

interface PortfolioSearchPanelProps {
  query: string
  result: AIQueryResult | null
  isLoading: boolean
  loadingPhase?: SearchPhase
  onSubmit: (query: string) => void
  onJump: (label: string, origin: { x: number; y: number }) => void
}

export default function PortfolioSearchPanel({
  query,
  result,
  isLoading,
  loadingPhase = isLoading ? 'wave' : 'idle',
  onSubmit,
  onJump,
}: PortfolioSearchPanelProps) {
  const reducedMotion = useReducedMotion()
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
    ? matches.skills.length
      ? describeListedSkills(matches.skills)
      : 'No matching projects or experience. Try another term, or press Enter to explore this topic.'
    : 'Press Enter to explore this topic.'
  // The chart owns the query, total count, clear action, and search identity.
  // Before submission the named matches are enough; reveal prose on Enter.
  const answer = isLoading ? null : result?.answer || (targets.length ? null : summary)

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
      {/* Reserve the same space from travel through answer. The wave is the
          transition; completing it must not float the text or lift the links. */}
      {(isLoading || answer) && (
        <div
          aria-live="polite"
          aria-busy={isLoading}
          className={isLoading || result ? 'min-h-[76px] flex items-center' : ''}
        >
          <span className="sr-only">{isLoading ? 'Searching portfolio…' : ''}</span>
          {isLoading ? (
            <div data-search-wave className="h-[76px] w-full">
              {loadingPhase === 'wave' && (
                <motion.div
                  initial={reducedMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: reducedMotion ? 0 : 0.18 }}
                >
                  <SearchDotWave />
                </motion.div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-line py-3">
              {answer}
            </p>
          )}
        </div>
      )}

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
