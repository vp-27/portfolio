import { createContext, useContext } from 'react'
import type { AIQueryResult } from '../utils/aiAssistant'

export interface PortfolioSearchState {
  query: string
  result: AIQueryResult | null
  isLoading: boolean
  updateQuery: (query: string) => void
  submitQuery: (query?: string) => void
  clearSearch: () => void
}

export const PortfolioSearchContext = createContext<PortfolioSearchState | null>(null)

export function usePortfolioSearch() {
  const context = useContext(PortfolioSearchContext)
  if (!context) throw new Error('Portfolio search requires its provider')
  return context
}
