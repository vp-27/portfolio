import { ChevronDown, HelpCircle } from 'lucide-react'
import type { PortfolioData } from '../types'

interface BuyingPowerProps {
  portfolio: PortfolioData
}

export default function BuyingPower({ portfolio }: BuyingPowerProps) {
  return (
    <div className="px-4 py-3 border-b border-gray-900">
      <button className="w-full flex items-center justify-between bg-transparent hover:bg-[#1A1A1A] py-2 px-2 -mx-2 rounded transition-colors">
        <div className="flex items-center gap-2">
          <span className="text-white text-sm">Buying power</span>
          <HelpCircle className="w-4 h-4 text-gray-500" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white font-medium">
            ${portfolio.buyingPower.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </div>
      </button>
    </div>
  )
}
