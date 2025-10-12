import { useState } from 'react'
import PortfolioHeader from '../components/PortfolioHeader'
import PortfolioChart from '../components/PortfolioChart'
import StockList from '../components/StockList'
import BuyingPower from '../components/BuyingPower'
import BottomNav from '../components/BottomNav'
import { mockPortfolio, mockStocks, mockChartData } from '../data/mockData'

export default function Dashboard() {
  const [timeRange] = useState('1D')

  return (
    <div className="min-h-screen bg-black pb-20 md:pb-8">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        {/* Portfolio Value */}
        <PortfolioHeader portfolio={mockPortfolio} />

        {/* Chart */}
        <div className="px-4">
          <PortfolioChart 
            data={mockChartData} 
            isPositive={mockPortfolio.todayReturn >= 0}
          />
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center justify-around px-4 py-4 text-sm">
          {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map((range) => (
            <button
              key={range}
              className={`px-3 py-1 rounded ${
                timeRange === range
                  ? 'bg-[#00C805] text-black font-semibold'
                  : 'text-gray-400 hover:text-white'
              } transition-colors`}
            >
              {range}
            </button>
          ))}
        </div>

        {/* Buying Power */}
        <BuyingPower portfolio={mockPortfolio} />

        {/* Stock List */}
        <StockList stocks={mockStocks} />

        {/* Additional Info Section */}
        <div className="mt-6 px-4 pb-8">
          <div className="bg-gray-900 rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-3">Portfolio Diversity</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Return</span>
                <span className="text-[#00C805]">
                  +${mockPortfolio.totalReturn.toLocaleString('en-US', { minimumFractionDigits: 2 })} 
                  ({mockPortfolio.totalReturnPercent.toFixed(2)}%)
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Invested</span>
                <span className="text-white">
                  ${(mockPortfolio.totalValue - mockPortfolio.totalReturn).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation (Mobile Only) */}
      <BottomNav />
    </div>
  )
}
