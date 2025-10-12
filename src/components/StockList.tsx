import type { Stock } from '../types'
import StockItem from './StockItem'

interface StockListProps {
  stocks: Stock[]
}

export default function StockList({ stocks }: StockListProps) {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold px-4 mb-3">Stocks</h2>
      <div className="bg-black">
        {stocks.map((stock) => (
          <StockItem key={stock.id} stock={stock} />
        ))}
      </div>
    </div>
  )
}
