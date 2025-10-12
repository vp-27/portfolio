import { useState, useMemo, useRef, useEffect } from 'react'
import TopNav from '../components/TopNav'
import PortfolioHeader from '../components/PortfolioHeader'
import PortfolioChart from '../components/PortfolioChart'
import AboutAndSkills from '../components/AboutAndSkills'
import BuyingPower from '../components/BuyingPower'
import BottomNav from '../components/BottomNav'
import PortfolioSections from '../components/PortfolioSections'
import CardStack from '../components/CardStack'
import { mockPortfolio, filterTimelineData, mockSkillCategories, mockExperiences, mockProjects, mockEducation, mockCertifications } from '../data/mockData'
import { useCardStack } from '../hooks/useCardStack'
import type { ChartDataPoint } from '../types'

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('ALL')
  const [highlightedItem, setHighlightedItem] = useState<string | null>(null)
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const lastHoveredLabel = useRef<string | null>(null)
  const [cardsEnabled, setCardsEnabled] = useState(false)

  // Enable cards after initial page load + animation time
  useEffect(() => {
    // Wait for About Me section to render and animate
    const timer = setTimeout(() => {
      setCardsEnabled(true)
    }, 800) // Reduced timing - cards activate shortly after text animation
    
    return () => clearTimeout(timer)
  }, [])

  // Milestone to Experience/Project mapping
  const milestoneMap = useMemo(() => ({
    'Bender Trust Project': { type: 'project' as const, id: '6' },
    'OroGenie Project': { type: 'project' as const, id: '2' },
    'Kaktus Internship': { type: 'experience' as const, id: '3' },
    'Algo Trading Project': { type: 'project' as const, id: '1' },
    'Shark Tank Finalist': { type: 'project' as const, id: '5' },
    'GrindSheet Launch': { type: 'project' as const, id: '3' },
    'Sunny Hackathon': { type: 'project' as const, id: '4' },
    'Moweb Internship': { type: 'experience' as const, id: '2' },
    'SEBS Data Analyst': { type: 'experience' as const, id: '1' },
  }), [])

  // Filter chart data based on selected time range
  const chartData = useMemo(() => {
    return filterTimelineData(timeRange)
  }, [timeRange])

  // Card stack hook for mobile
  const { stackedCards, dismissCard, triggerCardFromMilestone } = useCardStack({
    experiences: mockExperiences,
    projects: mockProjects,
    milestoneMap,
    chartData
  })

  // Get description for current time range
  const getTimeRangeDescription = () => {
    switch (timeRange) {
      case '1D':
        return 'Recent Activity'
      case '1W':
        return 'Last Month'
      case '1M':
        return 'Last 3 Months'
      case '3M':
        return 'Last Quarter'
      case 'YTD':
        return 'Year to Date (2025)'
      case '1Y':
        return 'Past Year'
      case 'ALL':
        return 'Full Journey'
      default:
        return "Vandan's Timeline"
    }
  }

  // Handle navigation to sections
  const handleNavigate = (section: string) => {
    if (section === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const sectionElement = document.querySelector(`[data-section="${section}"]`)
    if (sectionElement) {
      const yOffset = -70 // Offset for fixed header
      const y = sectionElement.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
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

  const handleChartPointHover = (label: string | null) => {
    setHoveredLabel(label)
    
    // Only trigger card stacking after initial animation is complete
    if (!cardsEnabled) return
    
    // Trigger card stacking on mobile when hovering over milestones
    // Only trigger if it's a new label (not the same one we're already hovering)
    if (label && label !== lastHoveredLabel.current) {
      lastHoveredLabel.current = label
      triggerCardFromMilestone(label)
    } else if (!label) {
      // Reset when not hovering
      lastHoveredLabel.current = null
    }
  }

  const handleChartPointClick = (point: ChartDataPoint) => {
    // Map chart milestones to experiences/projects
    const milestoneMapForHighlight: Record<string, string> = {
      'Bender Trust Project': 'Bender',
      'OroGenie Project': 'OroGenie',
      'Kaktus Internship': 'Kaktus',
      'Algo Trading Project': 'Algorithmic',
      'Shark Tank Finalist': 'Shark Tank',
      'GrindSheet Launch': 'GrindSheet',
      'Sunny Hackathon': 'Sunny',
      'Moweb Internship': 'Moweb',
      'SEBS Data Analyst': 'SEBS',
    }

    if (point.label) {
      const searchTerm = milestoneMapForHighlight[point.label]
      if (searchTerm) {
        setHighlightedItem(searchTerm)
        // Scroll to the sections with proper alignment
        setTimeout(() => {
          const element = document.querySelector('[data-section="experience"]') || 
                         document.querySelector('[data-section="projects"]')
          if (element) {
            const yOffset = -70 // Offset for fixed header
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
            window.scrollTo({ top: y, behavior: 'smooth' })
          }
        }, 100)
      }
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <TopNav onNavigate={handleNavigate} onSearch={handleSearch} />
      
      {/* Card Stack Overlay - Mobile Only */}
      <CardStack cards={stackedCards} onDismiss={dismissCard} />
      
      <div className="md:pt-14 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto md:px-4">
          <div className="lg:grid lg:grid-cols-[1fr,400px] lg:gap-6">
            <div>
              <div className="md:px-4">
                <PortfolioHeader portfolio={mockPortfolio} hoveredLabel={hoveredLabel} />
              </div>
              <div>
                <PortfolioChart 
                  data={chartData} 
                  isPositive={mockPortfolio.todayReturn >= 0}
                  onPointClick={handleChartPointClick}
                  onPointHover={handleChartPointHover}
                />
              </div>
              <div className="py-2 md:px-4">
                <p className="text-xs text-gray-500 text-center">{getTimeRangeDescription()}</p>
              </div>
              <div className="flex items-center gap-1 py-2 text-xs md:px-4">
                {['1D', '1W', '1M', '3M', 'YTD', '1Y', 'ALL'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-2.5 py-1 rounded ${
                      timeRange === range
                        ? 'bg-[#00C805] text-black'
                        : 'bg-transparent text-gray-400 hover:text-white hover:bg-[#1A1A1A]'
                    } transition-colors`}
                  >
                    {range}
                  </button>
                ))}
              </div>
              
              <div className="md:px-4">
                <BuyingPower portfolio={mockPortfolio} />
              </div>
              
              {/* About Me - Shown on mobile right under Buying Power (GPA line) */}
              <div className="lg:hidden md:px-4 mb-6 mt-6" data-section="about">
                <AboutAndSkills skillCategories={mockSkillCategories} searchQuery={searchQuery} />
              </div>
              
              {/* Portfolio Sections - Hidden on mobile, shown on desktop in left column */}
              <div className="hidden lg:block md:px-4" data-section="experience">
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
            
            <div className="lg:pr-4 mt-6 lg:mt-0">
              <div className="lg:pt-4">
                {/* Portfolio Sections - Shown on mobile, hidden on desktop */}
                <div className="lg:hidden mb-6" data-section="projects">
                  <PortfolioSections 
                    experiences={mockExperiences}
                    projects={mockProjects}
                    education={mockEducation}
                    certifications={mockCertifications}
                    highlightedItem={highlightedItem}
                    searchQuery={searchQuery}
                  />
                </div>
                
                {/* Skills section - Hidden on mobile (moved above), shown on desktop */}
                <div className="hidden lg:block" data-section="skills">
                  <AboutAndSkills skillCategories={mockSkillCategories} searchQuery={searchQuery} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNav onNavigate={handleNavigate} />
    </div>
  )
}
