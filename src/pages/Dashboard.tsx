import { useState, useMemo, useRef } from 'react'
import TopNav from '../components/TopNav'
import PortfolioHeader from '../components/PortfolioHeader'
import PortfolioChart from '../components/PortfolioChart'
import AboutAndSkills from '../components/AboutAndSkills'
import BuyingPower from '../components/BuyingPower'
import BottomNav from '../components/BottomNav'
import PortfolioSections from '../components/PortfolioSections'
import ExperienceCard from '../components/ExperienceCard'
import { mockPortfolio, filterTimelineData, mockSkillCategories, mockExperiences, mockProjects, mockEducation, mockCertifications } from '../data/mockData'
import type { ChartDataPoint, Experience, Project } from '../types'

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('ALL')
  const [highlightedItem, setHighlightedItem] = useState<string | null>(null)
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const lastHoveredLabel = useRef<string | null>(null)
  const [lastHoveredExperience, setLastHoveredExperience] = useState<{
    data: Experience | Project | null
    type: 'experience' | 'project' | null
  }>({ data: null, type: null })

  // Handle dismissing the experience card
  const handleDismissExperienceCard = () => {
    setLastHoveredExperience({ data: null, type: null })
    lastHoveredLabel.current = null
  }

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
    
    // Update last hovered experience when hovering over milestones
    if (label && label !== lastHoveredLabel.current) {
      lastHoveredLabel.current = label
      const mapping = milestoneMap[label as keyof typeof milestoneMap]
      
      if (mapping) {
        const data = mapping.type === 'experience' 
          ? mockExperiences.find(exp => exp.id === mapping.id)
          : mockProjects.find(proj => proj.id === mapping.id)
        
        if (data) {
          setLastHoveredExperience({ data, type: mapping.type })
        }
      }
    } else if (!label) {
      // Reset when not hovering
      lastHoveredLabel.current = null
    }
  }

  // Get description for current time range
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
    const milestoneMapForHighlight: Record<string, string> = {
      'Bender Trust': 'Bender',
      'OroGenie': 'OroGenie',
      'Kaktus Financial Ops': 'Kaktus',
      'Algo Trading Bot': 'Algorithmic',
      'Shark Tank Top 6': 'Shark Tank',
      'GrindSheet': 'GrindSheet',
      'Sunny Insurance': 'Sunny',
      'Moweb Data Team': 'Moweb',
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
              <div className="flex items-center gap-1 py-2 text-xs px-4">
                {['1D', '1W', '1M', '3M', 'YTD', '1Y', 'ALL'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-2.5 py-1 rounded font-bold ${
                      timeRange === range
                        ? 'bg-[#00C805] text-black'
                        : 'bg-transparent text-gray-400 hover:text-white hover:bg-[#1A1A1A]'
                    } transition-colors`}
                  >
                    {range}
                  </button>
                ))}
              </div>
              
              <div className="px-4 md:px-4">
                <BuyingPower />
              </div>
              
              {/* Experience Card - Shown above About Me */}
              <div className="px-4 md:px-4 mb-6 mt-6">
                <ExperienceCard 
                  experience={lastHoveredExperience.data} 
                  type={lastHoveredExperience.type}
                  onDismiss={handleDismissExperienceCard}
                />
              </div>
              
              {/* About Me - Shown on mobile right under Experience Card */}
              <div className="lg:hidden px-4 md:px-4 mb-6" data-section="about">
                <AboutAndSkills skillCategories={mockSkillCategories} searchQuery={searchQuery} />
              </div>
              
              {/* Portfolio Sections - Hidden on mobile, shown on desktop in left column */}
              <div className="hidden lg:block px-4 md:px-4" data-section="experience">
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
                <div className="lg:hidden px-4 mb-6" data-section="projects">
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
