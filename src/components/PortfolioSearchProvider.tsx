import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PortfolioSearchContext } from '../context/portfolioSearch'
import { processAIQueryAsync, type AIQueryResult } from '../utils/aiAssistant'
import { scrollToVisibleElement } from '../utils/navigation'

export default function PortfolioSearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<AIQueryResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const request = useRef<AbortController | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => () => request.current?.abort(), [])

  const updateQuery = useCallback((next: string) => {
    request.current?.abort()
    setQuery(next)
    setResult(null)
    setIsLoading(false)
  }, [])

  const clearSearch = useCallback(() => updateQuery(''), [updateQuery])

  // Standalone pages are browsing views. Never display a stale Home filter over
  // their unfiltered content; entering a new search deliberately returns Home.
  useEffect(() => {
    if (location.pathname !== '/') clearSearch()
  }, [location.pathname, clearSearch])

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
      if (location.pathname !== '/') navigate('/')
      // Enter moves to the existing search surface once; answer arrival does not
      // scroll again or interrupt a visitor who has started exploring a match.
      requestAnimationFrame(() => {
        if (!controller.signal.aborted) scrollToVisibleElement('[data-section="search-answer"]')
      })

      void processAIQueryAsync(next, controller.signal)
        .then((answer) => {
          if (!controller.signal.aborted) setResult(answer)
        })
        .catch(() => {
          if (!controller.signal.aborted)
            setResult({
              answer:
                'That answer is unavailable. You can still browse the projects, experience, and resumes below.',
              milestoneLabel: null,
              targetType: null,
              targetId: null,
              suggestedChips: ['Show me projects', 'Contact Vandan'],
              source: 'portfolio',
            })
        })
        .finally(() => {
          if (!controller.signal.aborted) setIsLoading(false)
        })
    },
    [query, location.pathname, navigate],
  )

  return (
    <PortfolioSearchContext.Provider
      value={{ query, result, isLoading, updateQuery, submitQuery, clearSearch }}
    >
      {children}
    </PortfolioSearchContext.Provider>
  )
}
