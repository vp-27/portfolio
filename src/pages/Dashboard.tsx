import { useState, useMemo, useRef } from 'react'
import TopNav from '../components/TopNav'
import PortfolioHeader from '../components/PortfolioHeader'
import PortfolioChart from '../components/PortfolioChart'
import AboutAndSkills from '../components/AboutAndSkills'
import BuyingPower from '../components/BuyingPower'
import BottomNav from '../components/BottomNav'
import PortfolioSections from '../components/PortfolioSections'
import { mockPortfolio, filterTimelineData, mockSkillCategories, mockExperiences, mockProjects, mockEducation, mockCertifications } from '../data/mockData'
import type { ChartDataPoint } from '../types'

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('ALL')
  const [highlightedItem, setHighlightedItem] = useState<string | null>(null)
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null)
  const [activeLabel, setActiveLabel] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const lastHoveredLabel = useRef<string | null>(null)

  // Milestone to Experience/Project mapping
  const milestoneMap = useMemo(() => ({
    'Bender Trust': { type: 'project' as const, id: '6' },
    'OroGenie': { type: 'project' as const, id: '2' },
    'Kaktus Financial Ops': { type: 'experience' as const, id: '3' },
    'Algo Trading Bot': { type: 'project' as const, id: '1' },
    'Shark Tank Top 6': { type: 'project' as const, id: '5' },
    'GrindSheet': { type: 'project' as const, id: '3' },
    'Sunny Insurance': { type: 'project' as const, id: '4' },
    'Moweb Data Team': { type: 'experience' as const, id: '2' },
    'SEBS Data Analyst': { type: 'experience' as const, id: '1' },
  }), [])

  // Filter chart data based on selected time range
  const chartData = useMemo(() => {
    return filterTimelineData(timeRange)
  }, [timeRange])

  const handleChartPointHover = (label: string | null) => {
    setHoveredLabel(label)

    // Update active label when hovering over milestones
    if (label && label !== lastHoveredLabel.current) {
      lastHoveredLabel.current = label
      setActiveLabel(label) // Set the active label to persist
    } else if (!label) {
      // Reset when not hovering
      lastHoveredLabel.current = null
    }
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
      // Find all matching sections and get the visible one
      const allSectionElements = document.querySelectorAll(`[data-section="${section}"]`)
      console.log('Found sections:', allSectionElements.length)

      // Helper function to check if element or any ancestor is hidden
      const isElementVisible = (element: Element): boolean => {
        let current: Element | null = element
        while (current && current !== document.body) {
          const computed = window.getComputedStyle(current)
          if (computed.display === 'none') {
            return false
          }
          current = current.parentElement
        }
        return true
      }

      // Find the visible section (not hidden by Tailwind classes)
      let sectionElement: Element | null = null
      allSectionElements.forEach((el) => {
        if (isElementVisible(el)) {
          sectionElement = el
          console.log('Found visible section')
        }
      })

      console.log('Selected section element:', sectionElement)

      if (sectionElement) {
        // Check if we're on mobile (no top nav) or desktop
        const isMobile = window.innerWidth < 768
        const yOffset = isMobile ? -20 : -70 // Less offset on mobile, more on desktop for fixed header
        const elementTop = (sectionElement as HTMLElement).getBoundingClientRect().top
        const pageOffset = window.pageYOffset
        const y = elementTop + pageOffset + yOffset

        console.log('Mobile:', isMobile)
        console.log('Section:', section)
        console.log('Element top:', elementTop)
        console.log('Page offset:', pageOffset)
        console.log('Y offset:', yOffset)
        console.log('Scrolling to Y:', y)

        window.scrollTo({ top: y, behavior: 'smooth' })
      } else {
        console.log('No visible section element found!')
      }
    }, 50)
  }

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query) {
      // Automatically scroll to skills section when searching
      setTimeout(() => {
        handleNavigate('skills')
      }, 100)
    }
  }

  // Helper to check if element is visible (not hidden by responsive classes)
  const isElementVisible = (element: Element): boolean => {
    let current: Element | null = element
    while (current && current !== document.body) {
      const computed = window.getComputedStyle(current)
      if (computed.display === 'none') {
        return false
      }
      current = current.parentElement
    }
    return true
  }

  // Scroll to element by data attribute
  const scrollToElement = (type: 'experience' | 'project', id: string) => {
    const selector = type === 'experience'
      ? `[data-experience-id="${id}"]`
      : `[data-project-id="${id}"]`

    const allElements = document.querySelectorAll(selector)

    // Find the visible element (in case there are duplicates for mobile/desktop)
    let targetElement: Element | null = null
    allElements.forEach((el) => {
      if (isElementVisible(el)) {
        targetElement = el
      }
    })

    if (targetElement) {
      const isMobile = window.innerWidth < 768
      const yOffset = isMobile ? -80 : -100 // Account for header
      const elementTop = (targetElement as HTMLElement).getBoundingClientRect().top
      const pageOffset = window.pageYOffset
      const y = elementTop + pageOffset + yOffset

      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  const handleChartPointClick = (point: ChartDataPoint) => {
    if (point.label) {
      // Map chart milestones to search terms for highlighting
      const milestoneMapForHighlight: Record<string, string> = {
        'Bender Trust': 'Bender',
        'OroGenie': 'OroGenie',
        'Kaktus Financial Ops': 'Kaktus',
        'Algo Trading Bot': 'Algorithmic',
        'Shark Tank Top 6': 'Shark Tank',
        'GrindSheet': 'GrindSheet',
        'Sunny Insurance': 'Sunny',
        'Moweb Data Team': 'Moweb',
        'SEBS Data Analyst': 'Rutgers',
      }

      const searchTerm = milestoneMapForHighlight[point.label]
      if (searchTerm) {
        // Set highlighted item to trigger gold glow animation
        setHighlightedItem(searchTerm)

        // Get the mapping for this milestone
        const mapping = milestoneMap[point.label as keyof typeof milestoneMap]
        if (mapping) {
          // Scroll to the element
          setTimeout(() => {
            scrollToElement(mapping.type, mapping.id)
          }, 50)

          // Clear highlight after animation completes
          setTimeout(() => {
            setHighlightedItem(null)
          }, 2000)
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <TopNav onNavigate={handleNavigate} onSearch={handleSearch} />

      <div className="md:pt-14 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto md:px-4">
          <div className="lg:grid lg:grid-cols-[1fr,400px] lg:gap-6">
            <div>
              <div className="md:px-4">
                <PortfolioHeader portfolio={mockPortfolio} hoveredLabel={hoveredLabel} activeLabel={activeLabel} />
              </div>
              <div>
                <PortfolioChart
                  data={chartData}
                  isPositive={mockPortfolio.todayReturn >= 0}
                  onPointClick={handleChartPointClick}
                  onPointHover={handleChartPointHover}
                  activeLabel={activeLabel}
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
                <BuyingPower />
              </div>

              {/* About Me - Shown on mobile right under Experience Card */}
              <div className="lg:hidden px-4 md:px-4 mt-4 mb-6" data-section="about">
                <AboutAndSkills skillCategories={mockSkillCategories} searchQuery={searchQuery} showOnlyAbout={true} />
              </div>

              {/* Portfolio Sections - Experience, Projects, Education, Certifications */}
              <div className="px-4 md:px-4">
                <PortfolioSections
                  experiences={mockExperiences}
                  projects={mockProjects}
                  education={mockEducation}
                  certifications={mockCertifications}
                  highlightedItem={highlightedItem}
                  searchQuery={searchQuery}
                />
              </div>
            </div>

            {/* Right Sidebar - Sticky on desktop */}
            <div className="hidden lg:block lg:pr-4">
              <div className="lg:sticky lg:top-[70px] lg:max-h-[calc(100vh-90px)] lg:overflow-y-auto lg:scrollbar-hide">
                <AboutAndSkills skillCategories={mockSkillCategories} searchQuery={searchQuery} />
              </div>
            </div>
          </div>

          {/* Mobile Layout - Skills at bottom */}
          <div className="lg:hidden px-4 mt-8 mb-6" data-section="skills">
            <AboutAndSkills skillCategories={mockSkillCategories} searchQuery={searchQuery} showOnlySkills={true} />
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
