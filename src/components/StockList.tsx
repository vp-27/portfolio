import { Plus } from 'lucide-react'
import type { Stock } from '../types'
import StockItem from './StockItem'

interface StockListProps {
  stocks: Stock[]
}

export default function StockList({ stocks }: StockListProps) {
  return (
    <div className="bg-black rounded-lg border border-gray-900">
      {/* Header with tabs */}
      <div className="flex items-center border-b border-gray-900">
        <button className="flex-1 py-3 bg-transparent text-white border-b-2 border-white font-medium">
          Stocks
        </button>
        <button className="flex-1 py-3 bg-transparent text-gray-500 hover:text-white transition-colors">
          Lists
        </button>
        <button className="px-4 bg-transparent text-gray-400 hover:text-white transition-colors" aria-label="Add stock">
          <Plus className="w-5 h-5" />
        </button>
      </div>
      
      {/* Stock Items */}
      <div>
        {stocks.map((stock) => (
          <StockItem key={stock.id} stock={stock} />
        ))}
      </div>
    </div>
  )
}
