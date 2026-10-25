import { useState, useEffect, useRef } from 'react'
import { BriefcaseBusiness, Folder, UserRound, Search, X, TrendingUp, ArrowUp } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { searchPortfolio } from '../utils/portfolioSearch'

interface BottomNavProps {
  searchQuery?: string
  onSearch?: (query: string) => void
  onAISubmit?: (query?: string) => void
}

export default function BottomNav({ searchQuery = '', onSearch, onAISubmit }: BottomNavProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchTriggerRef = useRef<HTMLButtonElement>(null)
  const matches = searchPortfolio(searchQuery)

  const closeSearch = () => {
    setIsSearchOpen(false)
    searchTriggerRef.current?.focus()
  }

  useEffect(() => {
    const handleOpenSearch = (event: Event) => {
      const query = (event as CustomEvent<{ query?: string }>).detail?.query
      if (query !== undefined) onSearch?.(query)
      if (location.pathname !== '/') navigate('/')
      setIsSearchOpen(true)
    }
    window.addEventListener('open-mobile-search', handleOpenSearch)
    return () => window.removeEventListener('open-mobile-search', handleOpenSearch)
  }, [onSearch, location.pathname, navigate])

  useEffect(() => {
    if (!isSearchOpen) return
    const frame = requestAnimationFrame(() => searchInputRef.current?.focus())
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSearchOpen(false)
        searchTriggerRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isSearchOpen])

  const submit = (query: string) => {
    if (!query.trim()) return
    onAISubmit?.(query)
    closeSearch()
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const navItems = [
    { path: '/', label: 'Timeline', Icon: TrendingUp },
    { path: '/experience', label: 'Experience', Icon: BriefcaseBusiness },
    { path: 'search', label: 'Search', Icon: Search },
    { path: '/projects', label: 'Projects', Icon: Folder },
    { path: '/profile', label: 'Profile', Icon: UserRound },
  ]

  const selectedPath =
    isSearchOpen || (location.pathname === '/' && searchQuery.trim()) ? 'search' : location.pathname

  return (
    <>
      <AnimatePresence>
        {isSearchOpen && (
          <motion.section
            id="mobile-search"
            aria-label="Search portfolio"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.16 }}
            className="fixed top-3 left-3 right-3 z-[60] bg-[#151719]/95 backdrop-blur-xl border border-[#353a3e] rounded-2xl p-3 shadow-2xl md:hidden"
          >
            <form
              onSubmit={(event) => {
                event.preventDefault()
                submit(searchQuery)
              }}
              className="mobile-search-field flex items-center gap-2 rounded-xl border border-[#353a3e] bg-[#1e2225] px-3 py-1"
            >
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="search"
                maxLength={500}
                aria-label="Search or ask about Vandan"
                placeholder="Search or ask about Vandan…"
                value={searchQuery}
                onChange={(event) => onSearch?.(event.target.value)}
                className="min-w-0 flex-1 rounded-md bg-transparent py-2 text-base text-white placeholder-gray-400"
              />
              {searchQuery && (
                <button
                  type="submit"
                  aria-label="Search portfolio"
                  className="shrink-0 w-9 h-9 rounded-full bg-rh-green text-black flex items-center justify-center"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  if (searchQuery) {
                    onSearch?.('')
                    searchInputRef.current?.focus()
                  } else closeSearch()
                }}
                aria-label={searchQuery ? 'Clear search' : 'Close search'}
                className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full text-gray-300 hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
            <p className="text-xs text-gray-400 mt-1 mb-2">
              Projects, experience, or a question about Vandan.
            </p>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {(searchQuery.trim()
                ? matches.active
                  ? matches.targets.map((target) => target.label)
                  : []
                : ['Amazon SCOT', 'GALE', 'Why CS & Finance?', 'Rutgers', 'Python']
              ).map((chip) => (
                <button
                  key={chip}
                  onClick={() => submit(chip)}
                  className="shrink-0 text-xs px-3 py-2 rounded-full border border-[#353a3e] text-gray-200 hover:border-rh-green"
                >
                  {chip}
                </button>
              ))}
              {searchQuery.trim() && matches.active && matches.targets.length === 0 && (
                <p className="text-xs text-gray-400 py-1">
                  No matching entries. Press Enter to explore this topic.
                </p>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
      <nav aria-label="Main navigation" className="mobile-dock md:hidden">
        {navItems.map(({ path, label, Icon }) => {
          const active = selectedPath === path
          return (
            <button
              key={path}
              ref={path === 'search' ? searchTriggerRef : undefined}
              aria-label={label}
              aria-current={active && path !== 'search' ? 'page' : undefined}
              aria-expanded={path === 'search' ? isSearchOpen : undefined}
              aria-controls={path === 'search' ? 'mobile-search' : undefined}
              onClick={() => {
                if (path === 'search') {
                  if (isSearchOpen) closeSearch()
                  else {
                    if (location.pathname !== '/') navigate('/')
                    setIsSearchOpen(true)
                  }
                } else {
                  setIsSearchOpen(false)
                  onSearch?.('')
                  navigate(path)
                  window.scrollTo({ top: 0, behavior: 'instant' })
                }
              }}
              className={`relative flex min-w-0 flex-1 flex-col items-center justify-center min-h-12 py-3 rounded-full transition-colors ${active ? 'text-white' : 'text-[#aeb9bf] hover:text-white'}`}
            >
              {active && (
                <motion.span
                  layoutId="mobile-glass-selection"
                  className="glass-selection absolute inset-0 rounded-full"
                  transition={{ type: 'spring', stiffness: 420, damping: 34, mass: 0.8 }}
                />
              )}
              <Icon className="relative z-10 w-[25px] h-[25px]" strokeWidth={active ? 2.5 : 2} />
            </button>
          )
        })}
      </nav>
    </>
  )
}
