import { useState } from 'react'
import TopNav from '../components/TopNav'
import PortfolioHeader from '../components/PortfolioHeader'
import PortfolioChart from '../components/PortfolioChart'
import AboutAndSkills from '../components/AboutAndSkills'
import BuyingPower from '../components/BuyingPower'
import BottomNav from '../components/BottomNav'
import PortfolioSections from '../components/PortfolioSections'
import { mockPortfolio, mockChartData, mockSkillCategories } from '../data/mockData'

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('1D')

  return (
    <div className="min-h-screen bg-black text-white">
      <TopNav />
      <div className="pt-14 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="lg:grid lg:grid-cols-[1fr,400px] lg:gap-6">
            <div className="lg:px-4">
              <PortfolioHeader portfolio={mockPortfolio} />
              <div className="px-4">
                <PortfolioChart 
                  data={mockChartData} 
                  isPositive={mockPortfolio.todayReturn >= 0}
                />
              </div>
              <div className="flex items-center gap-1 px-4 py-4 text-xs">
                {['1D', '1W', '1M', '3M', 'YTD', '1Y', 'ALL'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-2.5 py-1 rounded ${
                      timeRange === range
                        ? 'bg-[#FF5000] text-white'
                        : 'bg-transparent text-gray-400 hover:text-white hover:bg-[#1A1A1A]'
                    } transition-colors`}
                  >
                    {range}
                  </button>
                ))}
                <button className="ml-auto p-1 bg-transparent text-gray-400 hover:text-white" aria-label="Chart settings">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
              <BuyingPower portfolio={mockPortfolio} />
              
              {/* Portfolio Sections - Hidden on mobile, shown on desktop in left column */}
              <div className="hidden lg:block px-4">
                <PortfolioSections />
              </div>
            </div>
            
            <div className="lg:pr-4 mt-6 lg:mt-0">
              <div className="px-4 lg:px-0 lg:pt-4">
                {/* Portfolio Sections - Shown on mobile, hidden on desktop */}
                <div className="lg:hidden mb-6">
                  <PortfolioSections />
                </div>
                
                <AboutAndSkills skillCategories={mockSkillCategories} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
