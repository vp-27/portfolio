import type { PortfolioData } from '../types'

interface PortfolioHeaderProps {
  portfolio: PortfolioData
}

export default function PortfolioHeader({ portfolio }: PortfolioHeaderProps) {
  const isPositive = portfolio.todayReturn >= 0

  return (
    <div className="px-4 pt-6 pb-2">
      <div className="mb-1">
        <h1 className="text-3xl md:text-4xl font-semibold">
          ${portfolio.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h1>
      </div>
      <div className={`flex items-center gap-2 text-sm md:text-base ${isPositive ? 'text-[#00C805]' : 'text-[#FF5000]'}`}>
        <span className="font-medium">
          {isPositive ? '+' : ''}${Math.abs(portfolio.todayReturn).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <span>
          ({isPositive ? '+' : ''}{portfolio.todayReturnPercent.toFixed(2)}%)
        </span>
        <span className="text-gray-400">Today</span>
      </div>
    </div>
  )
}
