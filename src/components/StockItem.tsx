import { ChevronRight } from 'lucide-react'
import type { Stock } from '../types'

interface StockItemProps {
  stock: Stock
}

export default function StockItem({ stock }: StockItemProps) {
  const isPositive = stock.todayReturn >= 0

  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-900 cursor-pointer transition-colors border-b border-gray-900">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-base md:text-lg">{stock.symbol}</h3>
          <span className="text-xs text-gray-500">{stock.shares} {stock.shares === 1 ? 'Share' : 'Shares'}</span>
        </div>
        <p className="text-sm text-gray-400">{stock.name}</p>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="font-semibold text-base md:text-lg">
            ${stock.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`text-sm ${isPositive ? 'text-[#00C805]' : 'text-[#FF5000]'}`}>
            {isPositive ? '+' : ''}${Math.abs(stock.todayReturn).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            <span className="ml-1">
              ({isPositive ? '+' : ''}{stock.todayReturnPercent.toFixed(2)}%)
            </span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-500" />
      </div>
    </div>
  )
}
