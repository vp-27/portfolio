import { useState, useMemo } from 'react'
import TopNav from '../components/TopNav'
import PortfolioHeader from '../components/PortfolioHeader'
import PortfolioChart from '../components/PortfolioChart'
import AboutAndSkills from '../components/AboutAndSkills'
import BuyingPower from '../components/BuyingPower'
import BottomNav from '../components/BottomNav'
import PortfolioSections from '../components/PortfolioSections'
import InterestsSection from '../components/InterestsSection'
import { portfolioSummary, filterTimelineData, skillCategories, professionalExperiences, portfolioProjects, portfolioEducation } from '../data/portfolioData'
import type { ChartDataPoint } from '../types'

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('ALL')
  const [highlightedItem, setHighlightedItem] = useState<{ type: 'experience' | 'project' | 'education'; id: string } | null>(null)
  const [hoveredPoint, setHoveredPoint] = useState<ChartDataPoint | null>(null)
  const [hoveredCardMilestone, setHoveredCardMilestone] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isContactHighlighted, setIsContactHighlighted] = useState(false)

  // Milestone to Experience/Project mapping
  const milestoneMap = useMemo(() => ({
    'OroGenie Platform': { type: 'project' as const, id: '2' },
    'Algo Trading Bot': { type: 'project' as const, id: '1' },
    'Shark Tank Top 6': { type: 'project' as const, id: '5' },
    'GrindSheet': { type: 'project' as const, id: '3' },
    'Sunny Insurance': { type: 'project' as const, id: '4' },
    'Moweb Data Team': { type: 'experience' as const, id: '2' },
    'SEBS Data Analyst': { type: 'experience' as const, id: '1' },
    'Edgar Agent': { type: 'project' as const, id: '7' },
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

  // Handle search
  const handleSearch = (query: string) => {
    if (searchQuery === query) {
      setSearchQuery('')
    } else {
      setSearchQuery(query)
      if (query && window.innerWidth >= 768) {
        // Automatically scroll to skills section when searching (Desktop only)
        setTimeout(() => {
          handleNavigate('skills')
        }, 100)
      }
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
  const scrollToElement = (type: 'experience' | 'project' | 'education', id: string) => {
    const selector = type === 'experience'
      ? `[data-experience-id="${id}"]`
      : type === 'project'
      ? `[data-project-id="${id}"]`
      : `[data-section="education"]`

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

  // Common navigation logic for clicks and scrubs
  const navigateToItem = (label: string) => {
    if (!label) return

    const mapping = milestoneMap[label as keyof typeof milestoneMap]
    if (mapping) {
      // Set highlighted item to trigger glow animation
      setHighlightedItem(mapping)

      // Scroll to the element
      setTimeout(() => {
        scrollToElement(mapping.type, mapping.id)
      }, 50)

      // Clear highlight after animation completes
      setTimeout(() => {
        setHighlightedItem(null)
      }, 9000)
    }
  }

  const handleChartPointClick = (point: ChartDataPoint) => {
    if (point.label) {
      navigateToItem(point.label)
    }
  }

  const handleScrubEnd = () => {
    if (window.innerWidth < 768) {
      return
    }

    // If we have a hovered label when interaction ends (lifts finger), navigate to it
    if (hoveredPoint?.label) {
      navigateToItem(hoveredPoint.label)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <TopNav onNavigate={handleNavigate} onSearch={handleSearch} searchQuery={searchQuery} />

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
                <BuyingPower />
              </div>

              {/* About Me (with integrated Contact links) - Shown on mobile right under Buying Power */}
              <div className="lg:hidden px-4 md:px-4 mt-4 mb-6" data-section="about">
                <AboutAndSkills 
                  skillCategories={skillCategories} 
                  searchQuery={searchQuery} 
                  showOnlyAbout={true} 
                  onSkillClick={handleSearch} 
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
                    onSkillClick={handleSearch} 
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
              onSkillClick={handleSearch} 
              isContactHighlighted={isContactHighlighted}
            />
          </div>

          {/* Interests Section (Mobile Only, Bottom) */}
          <div className="lg:hidden px-4 mt-4 mb-12">
            <InterestsSection />
          </div>
        </div>
      </div>
      <BottomNav searchQuery={searchQuery} onSearch={handleSearch} />
    </div>
  )
}
