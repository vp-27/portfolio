import { useState } from 'react'
import TopNav from '../components/TopNav'
import PortfolioHeader from '../components/PortfolioHeader'
import PortfolioChart from '../components/PortfolioChart'
import StockList from '../components/StockList'
import BuyingPower from '../components/BuyingPower'
import BottomNav from '../components/BottomNav'
import Lists from '../components/Lists'
import { mockPortfolio, mockStocks, mockChartData } from '../data/mockData'

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('1D')

  const mockLists = [
    { id: '1', name: 'Options Watchlist', icon: 'eye' as const },
    { id: '2', name: 'Potato', icon: 'potato' as const },
  ]

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
                        : 'text-gray-400 hover:text-white hover:bg-[#1A1A1A]'
                    } transition-colors`}
                  >
                    {range}
                  </button>
                ))}
                <button className="ml-auto p-1 text-gray-400 hover:text-white" aria-label="Chart settings">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
              <BuyingPower portfolio={mockPortfolio} />
              <div className="hidden lg:block mt-8 px-4">
                <h2 className="text-xl font-medium mb-4">Get more out of Robinhood</h2>
                <div className="bg-[#0D0D0D] rounded-lg p-6 border border-gray-900">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#00C805] rounded-full flex items-center justify-center flex-shrink-0">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-black">
                        <path d="M12 2L2 7v10c0 5.5 3.8 10.7 10 12 6.2-1.3 10-6.5 10-12V7l-10-5z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium mb-2">Joint accounts</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        Manage your family's investments where you already manage your own.
                      </p>
                      <button className="text-[#FF5000] text-sm font-medium hover:text-[#ff6620] transition-colors">
                        Get started
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:pr-4 mt-6 lg:mt-0">
              <div className="px-4 lg:px-0 lg:pt-4">
                <StockList stocks={mockStocks} />
                <Lists lists={mockLists} stocks={mockStocks} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
