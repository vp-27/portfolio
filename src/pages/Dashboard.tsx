import { useState, useMemo, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useReducedMotion } from 'framer-motion'
import { usePortfolioSearch } from '../context/portfolioSearch'
import { scrollToVisibleElement } from '../utils/navigation'
import { searchPortfolio } from '../utils/portfolioSearch'
import PortfolioHeader from '../components/PortfolioHeader'
import PortfolioChart from '../components/PortfolioChart'
import AboutAndSkills from '../components/AboutAndSkills'
import BuyingPower from '../components/BuyingPower'
import PortfolioSections from '../components/PortfolioSections'
import InterestsSection from '../components/InterestsSection'
import PortfolioSearchPanel from '../components/PortfolioSearchPanel'
import FluidBlobTransition, { type BlobFlightData } from '../components/FluidBlobTransition'
import {
  filterTimelineData,
  skillCategories,
  professionalExperiences,
  portfolioProjects,
  portfolioEducation,
  careerMilestones,
  timelineRanges,
} from '../data/portfolioData'
import type { ChartDataPoint } from '../types'

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('ALL')
  const [highlightedItem, setHighlightedItem] = useState<{
    type: 'experience' | 'project' | 'education'
    id: string
  } | null>(null)
  const [hoveredPoint, setHoveredPoint] = useState<ChartDataPoint | null>(null)
  const [hoveredCardMilestone, setHoveredCardMilestone] = useState<string | null>(null)
  const {
    query: searchQuery,
    result: aiResult,
    isLoading: isAILoading,
    updateQuery: handleSearch,
    submitQuery: handleAISubmit,
    clearSearch,
  } = usePortfolioSearch()
  const [isContactHighlighted, setIsContactHighlighted] = useState(false)
  const [blobFlight, setBlobFlight] = useState<BlobFlightData | null>(null)
  const location = useLocation()
  const reducedMotion = useReducedMotion()
  const isFiltering = searchPortfolio(searchQuery).active
  const milestoneMap = useMemo(
    () => Object.fromEntries(careerMilestones.map(({ label, type, id }) => [label, { type, id }])),
    [],
  )

  useEffect(() => {
    const section = location.hash.slice(1)
    const frame = requestAnimationFrame(() => {
      if (section) scrollToVisibleElement(`[data-section="${CSS.escape(section)}"]`)
      else {
        window.scrollTo({ top: 0, behavior: 'instant' })
        document
          .querySelectorAll<HTMLElement>('[data-sidebar-scroll]')
          .forEach((sidebar) => sidebar.scrollTo({ top: 0, behavior: 'instant' }))
      }
    })
    let timer: number | undefined
    if (section === 'contact') {
      setIsContactHighlighted(true)
      timer = window.setTimeout(() => setIsContactHighlighted(false), 2500)
    }
    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(timer)
    }
  }, [location.key, location.hash])

  useEffect(() => {
    if (!aiResult) {
      setHighlightedItem(null)
      setHoveredCardMilestone(null)
      setHoveredPoint(null)
      return
    }
    const mapping = aiResult.milestoneLabel ? milestoneMap[aiResult.milestoneLabel] : null
    if (mapping && !aiResult.matchingTargets?.length) {
      setTimeRange('ALL')
      setHighlightedItem(mapping)
      setHoveredCardMilestone(aiResult.milestoneLabel)
    }
    if (aiResult.targetType === 'contact') setIsContactHighlighted(true)
    const timer = window.setTimeout(() => {
      setHighlightedItem(null)
      setIsContactHighlighted(false)
    }, 2500)
    return () => {
      window.clearTimeout(timer)
    }
  }, [aiResult, milestoneMap])

  // Filter chart data based on selected time range
  const chartData = useMemo(() => {
    return filterTimelineData(timeRange)
  }, [timeRange])

  const hoveredChartItem = useMemo(() => {
    if (!hoveredPoint?.label) return null
    return milestoneMap[hoveredPoint.label as keyof typeof milestoneMap] || null
  }, [hoveredPoint, milestoneMap])

  const cardHoveredPoint = useMemo(() => {
    if (!hoveredCardMilestone) return null
    return chartData.find((pt) => pt.label === hoveredCardMilestone) || null
  }, [hoveredCardMilestone, chartData])

  const activeHoveredPoint = hoveredPoint || cardHoveredPoint

  const handleItemHover = (type: 'experience' | 'project' | 'education', id: string | null) => {
    if (!id) {
      setHoveredCardMilestone(null)
      return
    }
    const entry = Object.entries(milestoneMap).find(([, val]) => val.type === type && val.id === id)
    if (entry) {
      setHoveredCardMilestone(entry[0])
    } else {
      setHoveredCardMilestone(null)
    }
  }

  const handleChartPointHover = (point: ChartDataPoint | null) => {
    setHoveredPoint(point)
  }

  // Handle clicking a skill chip (toggle selection if active, otherwise set filter)
  const handleSkillClick = (skillName: string) => {
    if (!skillName || (searchQuery && searchQuery.toLowerCase() === skillName.toLowerCase())) {
      handleSearch('')
    } else {
      handleSearch(skillName)
      if (window.innerWidth < 768) {
        window.dispatchEvent(
          new CustomEvent('open-mobile-search', { detail: { query: skillName } }),
        )
      }
    }
  }

  // Scroll to element using exact page offset with header clearance
  const scrollToElement = (type: 'experience' | 'project' | 'education', id: string) => {
    const selector =
      type === 'experience'
        ? `[data-experience-id="${id}"]`
        : type === 'project'
          ? `[data-project-id="${id}"]`
          : `[data-education-id="${id}"], [data-section="education"]`

    scrollToVisibleElement(selector)
  }

  const lastNavTimeRef = useRef<number>(0)

  // Common navigation logic for clicks and scrubs
  const navigateToItem = (label: string, origin?: { x: number; y: number }) => {
    if (!label) return

    const now = Date.now()
    if (now - lastNavTimeRef.current < 750) {
      return
    }
    lastNavTimeRef.current = now

    // Clear sticky hover states
    setHoveredPoint(null)
    setHoveredCardMilestone(null)

    const mapping = milestoneMap[label as keyof typeof milestoneMap]
    if (mapping) {
      const selector =
        mapping.type === 'experience'
          ? `[data-experience-id="${mapping.id}"]`
          : mapping.type === 'project'
            ? `[data-project-id="${mapping.id}"]`
            : `[data-education-id="${mapping.id}"]`

      if (!document.querySelector(selector)?.getClientRects().length) clearSearch()

      const isMobile = window.innerWidth < 768
      const startX = origin?.x ?? window.innerWidth / 2
      const startY = origin?.y ?? (isMobile ? 220 : 250)

      if (reducedMotion) {
        requestAnimationFrame(() => {
          scrollToElement(mapping.type, mapping.id)
          document.querySelector<HTMLElement>(`${selector} button`)?.focus({ preventScroll: true })
        })
        setHighlightedItem(mapping)
        return
      }

      // Launch flying gold blob transition
      setBlobFlight({
        id: `${now}-${label}`,
        startX,
        startY,
        targetSelector: selector,
        label,
      })

      // Kick off synchronized smooth scroll
      setTimeout(() => {
        scrollToElement(mapping.type, mapping.id)
      }, 30)
    }
  }

  const handleBlobImpact = (flightData: BlobFlightData) => {
    const mapping = milestoneMap[flightData.label as keyof typeof milestoneMap]
    if (mapping) {
      // Trigger card expansion and pulse
      setHighlightedItem(mapping)
      document
        .querySelector<HTMLElement>(`${flightData.targetSelector} button`)
        ?.focus({ preventScroll: true })

      // Clear highlight state cleanly after expansion without locking hover
      setTimeout(() => {
        setHighlightedItem((curr) => (curr?.id === mapping.id ? null : curr))
      }, 2000)
    }
  }

  const handleChartPointClick = (point: ChartDataPoint, origin?: { x: number; y: number }) => {
    if (point.label) {
      navigateToItem(point.label, origin)
    }
  }

  const handleScrubEnd = () => {
    // Only scrub visual state, do not trigger automatic jumps on mouse leave
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      <FluidBlobTransition
        flight={blobFlight}
        onImpact={handleBlobImpact}
        onComplete={() => setBlobFlight(null)}
      />

      <div className="md:pt-14 pb-28 md:pb-8">
        <div className="max-w-[1440px] mx-auto md:px-4">
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr),360px] xl:grid-cols-[minmax(0,1fr),380px] lg:gap-8 xl:gap-10">
            <div>
              <div className="md:px-4">
                <PortfolioHeader hoveredPoint={activeHoveredPoint} />
              </div>
              <div>
                <PortfolioChart
                  data={chartData}
                  isPositive={true}
                  onPointClick={handleChartPointClick}
                  onPointHover={handleChartPointHover}
                  onScrubEnd={handleScrubEnd}
                  hoveredMilestoneLabel={hoveredCardMilestone}
                />
              </div>
              <div className="px-4 md:px-4">
                <div
                  className="timeline-ranges flex items-center gap-1 py-2 text-xs pb-3 border-b border-[#2D2D2D]"
                  role="group"
                  aria-label="Timeline range"
                >
                  {timelineRanges.map((range) => (
                    <button
                      key={range}
                      onClick={() => {
                        setTimeRange(range)
                        setHoveredPoint(null)
                        setHoveredCardMilestone(null)
                      }}
                      aria-pressed={timeRange === range}
                      aria-label={
                        range === 'ALL'
                          ? 'All career milestones'
                          : `Past ${range} of the career timeline`
                      }
                      className={`px-2.5 py-1 rounded-lg font-bold ${
                        timeRange === range
                          ? 'bg-[#00C805] text-black'
                          : 'bg-transparent text-[#00C805] hover:bg-[#00C805]/10'
                      } transition-colors`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              <div className="px-4 md:px-4">
                {searchQuery.trim() ? (
                  <PortfolioSearchPanel
                    query={searchQuery}
                    result={aiResult}
                    isLoading={isAILoading}
                    onSubmit={handleAISubmit}
                    onEdit={() => {
                      if (window.innerWidth < 768) {
                        window.dispatchEvent(new CustomEvent('open-mobile-search'))
                      } else {
                        const input =
                          document.querySelector<HTMLInputElement>('input[type="search"]')
                        input?.focus()
                        input?.select()
                      }
                    }}
                    onJump={navigateToItem}
                    onClear={clearSearch}
                  />
                ) : (
                  <BuyingPower
                    activeMilestone={activeHoveredPoint?.label || null}
                    onJumpToMilestone={(label, origin) => navigateToItem(label, origin)}
                  />
                )}
              </div>

              {/* About Me (with integrated Contact links) - Shown on mobile right under Buying Power */}
              <div
                hidden={isFiltering}
                className="lg:hidden px-4 md:px-4 mt-4 mb-6"
                data-section="about"
              >
                <AboutAndSkills
                  skillCategories={skillCategories}
                  searchQuery={searchQuery}
                  showOnlyAbout={true}
                  onSkillClick={handleSkillClick}
                  isContactHighlighted={isContactHighlighted}
                />
              </div>

              {/* Portfolio Sections - Experience, Projects, Education, Certifications */}
              <div className="px-4 md:px-4">
                <PortfolioSections
                  experiences={professionalExperiences}
                  projects={portfolioProjects}
                  education={portfolioEducation}
                  highlightedItem={highlightedItem}
                  hoveredItem={hoveredChartItem}
                  searchQuery={searchQuery}
                  onItemHover={handleItemHover}
                  onClearHighlight={() => setHighlightedItem(null)}
                />
              </div>

              {/* Interests Section - Desktop placement (below education in left column) */}
              <div className={isFiltering ? 'hidden' : 'hidden lg:block px-4 md:px-4 mt-10'}>
                <InterestsSection />
              </div>
            </div>

            {/* Right Sidebar - Sticky on desktop */}
            <div className="hidden lg:block lg:pr-4">
              <div
                className="lg:sticky lg:top-[70px] max-h-[calc(100vh-86px)] overflow-y-auto sidebar-scroll pb-8"
                data-sidebar-scroll="true"
              >
                <AboutAndSkills
                  skillCategories={skillCategories}
                  searchQuery={searchQuery}
                  onSkillClick={handleSkillClick}
                  isContactHighlighted={isContactHighlighted}
                />
              </div>
            </div>
          </div>

          {/* Skills Section (Mobile Only, Bottom) */}
          <div className="lg:hidden px-4 mt-8 mb-6" data-section="skills">
            <AboutAndSkills
              skillCategories={skillCategories}
              searchQuery={searchQuery}
              showOnlySkills={true}
              onSkillClick={handleSkillClick}
              isContactHighlighted={isContactHighlighted}
            />
          </div>

          {/* Interests Section (Mobile Only, Bottom) */}
          <div hidden={isFiltering} className="lg:hidden px-4 mt-4 mb-12">
            <InterestsSection />
          </div>
        </div>
      </div>
    </div>
  )
}
