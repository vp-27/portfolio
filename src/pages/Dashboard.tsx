import { useState, useMemo, useRef } from 'react'
import TopNav from '../components/TopNav'
import PortfolioHeader from '../components/PortfolioHeader'
import PortfolioChart from '../components/PortfolioChart'
import AboutAndSkills from '../components/AboutAndSkills'
import BuyingPower from '../components/BuyingPower'
import BottomNav from '../components/BottomNav'
import PortfolioSections from '../components/PortfolioSections'
import InterestsSection from '../components/InterestsSection'
import AIAnswerCard from '../components/AIAnswerCard'
import RobinhoodAILoader from '../components/RobinhoodAILoader'
import FluidBlobTransition, { type BlobFlightData } from '../components/FluidBlobTransition'
import { processAIQueryAsync, type AIQueryResult } from '../utils/aiAssistant'
import { portfolioSummary, filterTimelineData, skillCategories, professionalExperiences, portfolioProjects, portfolioEducation } from '../data/portfolioData'
import type { ChartDataPoint } from '../types'

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('ALL')
  const [highlightedItem, setHighlightedItem] = useState<{ type: 'experience' | 'project' | 'education'; id: string } | null>(null)
  const [hoveredPoint, setHoveredPoint] = useState<ChartDataPoint | null>(null)
  const [hoveredCardMilestone, setHoveredCardMilestone] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isContactHighlighted, setIsContactHighlighted] = useState(false)
  const [isAILoading, setIsAILoading] = useState(false)
  const [aiResult, setAIResult] = useState<AIQueryResult | null>(null)
  const [blobFlight, setBlobFlight] = useState<BlobFlightData | null>(null)
  const aiTimerRef = useRef<number | null>(null)

  // Milestone to Experience/Project mapping
  const milestoneMap = useMemo(() => ({
    'Algo Trading Bot': { type: 'project' as const, id: '1' },
    'Shark Tank Top 6': { type: 'project' as const, id: '5' },
    'GrindSheet': { type: 'project' as const, id: '3' },
    'Moweb Technologies': { type: 'experience' as const, id: '2' },
    'SEBS Data Analyst': { type: 'experience' as const, id: '1' },
    'Edgar Agent': { type: 'project' as const, id: '7' },
    'GALE Engine': { type: 'project' as const, id: 'gale' },
    'Started Rutgers': { type: 'education' as const, id: '1' },
    'Amazon SCOT': { type: 'experience' as const, id: 'amazon1' },
  }), [])

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
    return chartData.find(pt => pt.label === hoveredCardMilestone) || null
  }, [hoveredCardMilestone, chartData])

  const activeHoveredPoint = hoveredPoint || cardHoveredPoint

  const handleItemHover = (type: 'experience' | 'project' | 'education', id: string | null) => {
    if (!id) {
      setHoveredCardMilestone(null)
      return
    }
    const entry = Object.entries(milestoneMap).find(
      ([_, val]) => val.type === type && val.id === id
    )
    if (entry) {
      setHoveredCardMilestone(entry[0])
    } else {
      setHoveredCardMilestone(null)
    }
  }

  const handleChartPointHover = (point: ChartDataPoint | null) => {
    setHoveredPoint(point)
  }

  // Get description for current time range
  // Handle navigation to sections
  const handleNavigate = (section: string) => {
    console.log('Navigating to section:', section)

    if (section === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      // Find the first matching section
      const sectionElement = document.querySelector(`[data-section="${section}"]`)
      console.log('Selected section element:', sectionElement)

      if (sectionElement) {
        // Trigger highlight for contact section
        if (section === 'contact') {
          setIsContactHighlighted(true)
          setTimeout(() => setIsContactHighlighted(false), 2500)
        }

        // Check if we're on mobile (no top nav) or desktop
        const isMobile = window.innerWidth < 768
        const yOffset = isMobile ? -20 : -70 // Less offset on mobile, more on desktop for fixed header
        const elementTop = (sectionElement as HTMLElement).getBoundingClientRect().top
        const pageOffset = window.pageYOffset
        const y = elementTop + pageOffset + yOffset

        window.scrollTo({ top: y, behavior: 'smooth' })
      } else {
        console.log('No section element found!')
      }
    }, 50)
  }

  // Execute AI processing on Enter key or Chip click
  const handleAISubmit = (queryToSubmit?: string) => {
    const q = queryToSubmit || searchQuery
    if (!q) return

    if (aiTimerRef.current) {
      clearTimeout(aiTimerRef.current)
    }

    setSearchQuery(q)
    setIsAILoading(true)
    setAIResult(null)

    // Robinhood V-Shape Dot Matrix Loader plays for ~1.1s
    aiTimerRef.current = window.setTimeout(async () => {
      const res = await processAIQueryAsync(q)
      setAIResult(res)
      setIsAILoading(false)

      if (res.milestoneLabel) {
        const mapping = milestoneMap[res.milestoneLabel as keyof typeof milestoneMap]
        if (mapping) {
          setHighlightedItem(mapping)
          setHoveredCardMilestone(res.milestoneLabel)
          setTimeout(() => {
            setHighlightedItem((curr) => (curr?.id === mapping.id ? null : curr))
          }, 2000)
        }
      } else if (res.targetType === 'resume_cs') {
        window.open('/resumes/Vandan_Patel_CS.pdf', '_blank')
      } else if (res.targetType === 'resume_finance') {
        window.open('/resumes/Vandan_Patel_Finance.pdf', '_blank')
      } else if (res.targetType === 'contact') {
        setIsContactHighlighted(true)
        setTimeout(() => setIsContactHighlighted(false), 3500)
      }
    }, 1100)
  }

  // Handle live search typing
  const handleSearch = (query: string) => {
    if (!query) {
      setSearchQuery('')
      setAIResult(null)
      setIsAILoading(false)
      setHighlightedItem(null)
      setHoveredCardMilestone(null)
      setHoveredPoint(null)
      return
    }

    setSearchQuery(query)

    // If query was cleared or shortened, reset AI answer card so page list shows live results
    if (aiResult && !query.toLowerCase().includes(aiResult.answer.slice(0, 10).toLowerCase())) {
      setAIResult(null)
    }
  }

  // Handle clicking a skill chip (toggle selection if active, otherwise set filter)
  const handleSkillClick = (skillName: string) => {
    if (!skillName || (searchQuery && searchQuery.toLowerCase() === skillName.toLowerCase())) {
      handleSearch('')
    } else {
      handleSearch(skillName)
      if (window.innerWidth < 768) {
        window.dispatchEvent(new CustomEvent('open-mobile-search', { detail: { query: skillName } }))
      }
    }
  }

  // Scroll to element using exact page offset with header clearance
  const scrollToElement = (type: 'experience' | 'project' | 'education', id: string) => {
    const selector = type === 'experience'
      ? `[data-experience-id="${id}"]`
      : type === 'project'
      ? `[data-project-id="${id}"]`
      : `[data-education-id="${id}"], [data-section="education"]`

    const targetElement = document.querySelector(selector) as HTMLElement | null
    if (targetElement) {
      const isMobile = window.innerWidth < 768
      const headerOffset = isMobile ? 65 : 85
      const elementRect = targetElement.getBoundingClientRect()
      const targetY = window.pageYOffset + elementRect.top - headerOffset
      window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' })
    }
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
      const selector = mapping.type === 'experience'
        ? `[data-experience-id="${mapping.id}"]`
        : mapping.type === 'project'
        ? `[data-project-id="${mapping.id}"]`
        : `[data-education-id="${mapping.id}"]`

      const isMobile = window.innerWidth < 768
      const startX = origin?.x ?? (window.innerWidth / 2)
      const startY = origin?.y ?? (isMobile ? 220 : 250)

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
      <TopNav onNavigate={handleNavigate} onSearch={handleSearch} onAISubmit={handleAISubmit} searchQuery={searchQuery} />

      <div className="md:pt-14 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto md:px-4">
          <div className="lg:grid lg:grid-cols-[1fr,400px] lg:gap-6">
            <div>
              <div className="md:px-4">
                <PortfolioHeader portfolio={portfolioSummary} hoveredPoint={activeHoveredPoint} />
              </div>
              <div>
                <PortfolioChart
                  data={chartData}
                  isPositive={portfolioSummary.todayReturn >= 0}
                  onPointClick={handleChartPointClick}
                  onPointHover={handleChartPointHover}
                  onScrubEnd={handleScrubEnd}
                  hoveredMilestoneLabel={hoveredCardMilestone}
                />
              </div>
              <div className="px-4 md:px-4">
                <div className="flex items-center gap-1 py-2 text-xs pb-3 border-b border-[#2D2D2D]">
                  {['1D', '1W', '1M', '3M', 'YTD', '1Y', 'ALL'].map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-2.5 py-1 rounded-lg font-bold ${timeRange === range
                        ? 'bg-[#00C805] text-black'
                        : 'bg-transparent text-gray-400 hover:text-white hover:bg-[#1A1A1A]'
                        } transition-colors`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              <div className="px-4 md:px-4">
                {isAILoading ? (
                  <RobinhoodAILoader />
                ) : aiResult ? (
                  <AIAnswerCard
                    query={searchQuery}
                    result={aiResult}
                    onChipClick={(chip) => handleAISubmit(chip)}
                    onAskCustom={() => {
                      setAIResult(null)
                      setSearchQuery('')
                      window.dispatchEvent(new CustomEvent('open-mobile-search'))
                      setTimeout(() => {
                        const input = document.querySelector('input[type="text"]') as HTMLInputElement
                        if (input) {
                          input.focus()
                          input.select()
                        }
                      }, 100)
                    }}
                    onJumpToMilestone={(lbl, origin) => navigateToItem(lbl || aiResult.milestoneLabel || '', origin)}
                    onClose={() => {
                      setAIResult(null)
                      setHighlightedItem(null)
                      setHoveredCardMilestone(null)
                      setHoveredPoint(null)
                    }}
                  />
                ) : (
                  <BuyingPower
                    activeMilestone={activeHoveredPoint?.label || null}
                    onJumpToMilestone={(label, origin) => navigateToItem(label, origin)}
                  />
                )}
              </div>

              {/* About Me (with integrated Contact links) - Shown on mobile right under Buying Power */}
              <div className="lg:hidden px-4 md:px-4 mt-4 mb-6" data-section="about">
                <AboutAndSkills 
                  skillCategories={skillCategories} 
                  searchQuery={searchQuery} 
                  hasAIResult={!!aiResult}
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
                  hasAIResult={!!aiResult}
                  onItemHover={handleItemHover}
                  onClearHighlight={() => setHighlightedItem(null)}
                />
              </div>

              {/* Interests Section - Desktop placement (below education in left column) */}
              <div className="hidden lg:block px-4 md:px-4 mt-10">
                <InterestsSection />
              </div>
            </div>

            {/* Right Sidebar - Sticky on desktop */}
              <div className="hidden lg:block lg:pr-4">
                <div className="lg:sticky lg:top-[70px] max-h-[calc(100vh-70px)] overflow-y-auto no-scrollbar pb-8">
                  <AboutAndSkills 
                    skillCategories={skillCategories} 
                    searchQuery={searchQuery} 
                    hasAIResult={!!aiResult}
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
              hasAIResult={!!aiResult}
              showOnlySkills={true} 
              onSkillClick={handleSkillClick} 
              isContactHighlighted={isContactHighlighted}
            />
          </div>

          {/* Interests Section (Mobile Only, Bottom) */}
          <div className="lg:hidden px-4 mt-4 mb-12">
            <InterestsSection />
          </div>
        </div>
      </div>
      <BottomNav searchQuery={searchQuery} onSearch={handleSearch} onAISubmit={handleAISubmit} />
    </div>
  )
}
