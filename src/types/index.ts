export interface Stock {
  id: string
  symbol: string
  name: string
  shares: number
  averageCost: number
  currentPrice: number
  marketValue: number
  todayReturn: number
  todayReturnPercent: number
  totalReturn: number
  totalReturnPercent: number
}

export interface PortfolioData {
  totalValue: number
  buyingPower: number
  todayReturn: number
  todayReturnPercent: number
  totalReturn: number
  totalReturnPercent: number
}

export interface ChartDataPoint {
  time: string
  value: number
}
