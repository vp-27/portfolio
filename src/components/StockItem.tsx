import MiniSparkline from './MiniSparkline'
import type { Stock } from '../types'

interface StockItemProps {
  stock: Stock
}

export default function StockItem({ stock }: StockItemProps) {
  const isPositive = stock.todayReturn >= 0

  return (
    <div className="flex items-center justify-between px-4 py-3 hover:bg-[#1A1A1A] cursor-pointer transition-colors border-b border-gray-900">
      {/* Left: Symbol and Shares */}
      <div className="flex-shrink-0 w-24">
        <div className="font-medium text-white">{stock.symbol}</div>
        <div className="text-xs text-gray-500">{stock.shares} Share{stock.shares !== 1 ? 's' : ''}</div>
      </div>
      
      {/* Middle: Mini Chart */}
      <div className="flex-shrink-0 mx-4">
        <MiniSparkline trend={isPositive ? 'up' : 'down'} />
      </div>

      {/* Right: Price and Change */}
      <div className="flex-1 text-right">
        <div className="text-white font-medium">
          ${stock.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className={`text-xs ${isPositive ? 'text-[#00C805]' : 'text-[#FF5000]'}`}>
          {isPositive ? '+' : ''}{stock.todayReturnPercent.toFixed(2)}%
        </div>
      </div>
    </div>
  )
}
