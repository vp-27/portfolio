import { ChevronRight } from 'lucide-react'
import type { PortfolioData } from '../types'

interface BuyingPowerProps {
  portfolio: PortfolioData
}

export default function BuyingPower({ portfolio }: BuyingPowerProps) {
  return (
    <div className="mt-6 px-4">
      <div className="bg-gray-900 rounded-lg p-4 hover:bg-gray-800 cursor-pointer transition-colors flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">Buying Power</p>
          <p className="text-xl font-semibold">
            ${portfolio.buyingPower.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-500" />
      </div>
    </div>
  )
}
