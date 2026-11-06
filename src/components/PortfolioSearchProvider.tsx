import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PortfolioSearchContext } from '../context/portfolioSearch'
import { processAIQueryAsync, type AIQueryResult } from '../utils/aiAssistant'
import { scrollToVisibleElement } from '../utils/navigation'
import { getChartSearchPreview } from '../utils/chartSearch'
import {
  playSearchPresentation,
  searchTravelDuration,
  type SearchPhase,
} from '../utils/searchPresentation'

export default function PortfolioSearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<AIQueryResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingPhase, setLoadingPhase] = useState<SearchPhase>('idle')
  const [submissionId, setSubmissionId] = useState(0)
  const request = useRef<AbortController | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => () => request.current?.abort(), [])

  const updateQuery = useCallback((next: string) => {
    request.current?.abort()
    setQuery(next)
    setResult(null)
    setIsLoading(false)
    setLoadingPhase('idle')
    setSubmissionId(0)
  }, [])

  const clearSearch = useCallback(() => updateQuery(''), [updateQuery])

  // Standalone pages are browsing views. Never display a stale Home filter over
  // their unfiltered content; entering a new search deliberately returns Home.
  useEffect(() => {
    if (location.pathname !== '/') clearSearch()
  }, [location.pathname, clearSearch])

  useEffect(() => {
    if (!submissionId || location.pathname !== '/') return
    const frame = requestAnimationFrame(() => {
      if (!request.current?.signal.aborted) scrollToVisibleElement('[data-section="timeline"]')
    })
    return () => cancelAnimationFrame(frame)
  }, [submissionId, location.pathname])

  const submitQuery = useCallback(
    (input?: string) => {
      const next = (input ?? query).trim()
      if (!next) return
      request.current?.abort()
      const controller = new AbortController()
      request.current = controller
      setQuery(next)
      setResult(null)
      setIsLoading(true)
      const matches = getChartSearchPreview(next).milestoneLabels.length
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      setLoadingPhase(searchTravelDuration(matches, reducedMotion) ? 'travel' : 'wave')
      setSubmissionId((previous) => previous + 1)
      if (location.pathname !== '/') navigate('/')

      const answer = processAIQueryAsync(next, controller.signal).catch(
        (): AIQueryResult => ({
          answer:
            'That answer is unavailable. You can still browse the projects, experience, and resumes below.',
          milestoneLabel: null,
          targetType: null,
          targetId: null,
          suggestedChips: ['Show me projects', 'Contact Vandan'],
          source: 'portfolio',
        }),
      )
      const presentation = playSearchPresentation({
        matches,
        signal: controller.signal,
        reducedMotion,
        onWave: () => setLoadingPhase('wave'),
      })
      void Promise.all([answer, presentation])
        .then(([response]) => {
          if (!controller.signal.aborted) setResult(response)
        })
        .catch(() => {
          /* Editing, clearing, or navigating cancels the presentation. */
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setIsLoading(false)
            setLoadingPhase('idle')
          }
        })
    },
    [query, location.pathname, navigate],
  )

  return (
    <PortfolioSearchContext.Provider
      value={{
        query,
        result,
        isLoading,
        loadingPhase,
        submissionId,
        updateQuery,
        submitQuery,
        clearSearch,
      }}
    >
      {children}
    </PortfolioSearchContext.Provider>
  )
}
