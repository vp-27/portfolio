import { useState, useMemo } from 'react'
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
  const [searchQuery, setSearchQuery] = useState('')

  // Filter chart data based on selected time range
  const chartData = useMemo(() => {
    return filterTimelineData(timeRange)
  }, [timeRange])

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

  const handleChartPointClick = (point: ChartDataPoint) => {
    // Map chart milestones to experiences/projects
    const milestoneMap: Record<string, string> = {
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
      const searchTerm = milestoneMap[point.label]
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
                  onPointHover={setHoveredLabel}
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
                
                <div data-section="skills">
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
