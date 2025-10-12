import type { Stock, PortfolioData, ChartDataPoint } from '../types'

export const mockStocks: Stock[] = [
  {
    id: '1',
    symbol: 'FIAT',
    name: 'Fiat Chrysler Automobiles',
    shares: 30,
    averageCost: 2.22,
    currentPrice: 2.57,
    marketValue: 77.10,
    todayReturn: 0.46,
    todayReturnPercent: 13.76,
    totalReturn: 10.50,
    totalReturnPercent: 15.77,
  },
  {
    id: '2',
    symbol: 'YMAX',
    name: 'YieldMax',
    shares: 80,
    averageCost: 12.84,
    currentPrice: 12.48,
    marketValue: 998.40,
    todayReturn: -47.20,
    todayReturnPercent: -3.66,
    totalReturn: -28.80,
    totalReturnPercent: -2.81,
  },
  {
    id: '3',
    symbol: 'PFSA',
    name: 'PFS Investments',
    shares: 325,
    averageCost: 0.3175,
    currentPrice: 0.3205,
    marketValue: 104.16,
    todayReturn: -3.41,
    todayReturnPercent: -3.26,
    totalReturn: 0.98,
    totalReturnPercent: 0.95,
  },
  {
    id: '4',
    symbol: 'ULTY',
    name: 'YieldMax ULTA Covered',
    shares: 197,
    averageCost: 5.68,
    currentPrice: 5.32,
    marketValue: 1048.04,
    todayReturn: -27.58,
    todayReturnPercent: -2.57,
    totalReturn: -70.92,
    totalReturnPercent: -6.34,
  },
  {
    id: '5',
    symbol: 'MSTY',
    name: 'YieldMax MSTR Covered',
    shares: 91,
    averageCost: 13.21,
    currentPrice: 12.85,
    marketValue: 1169.35,
    todayReturn: -65.26,
    todayReturnPercent: -5.31,
    totalReturn: -32.76,
    totalReturnPercent: -2.73,
  },
  {
    id: '6',
    symbol: 'SPY',
    name: 'SPDR S&P 500 ETF',
    shares: 1,
    averageCost: 654.39,
    currentPrice: 652.15,
    marketValue: 652.15,
    todayReturn: -17.24,
    todayReturnPercent: -2.63,
    totalReturn: -2.24,
    totalReturnPercent: -0.34,
  },
  {
    id: '7',
    symbol: 'NKE',
    name: 'Nike Inc.',
    shares: 10,
    averageCost: 67.89,
    currentPrice: 64.60,
    marketValue: 646.00,
    todayReturn: -32.90,
    todayReturnPercent: -5.06,
    totalReturn: -32.90,
    totalReturnPercent: -4.84,
  },
  {
    id: '8',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    shares: 3,
    averageCost: 252.79,
    currentPrice: 245.38,
    marketValue: 736.14,
    todayReturn: -26.04,
    todayReturnPercent: -3.41,
    totalReturn: -22.23,
    totalReturnPercent: -2.93,
  },
  {
    id: '9',
    symbol: 'SQOQ',
    name: 'SoFi Social ETF',
    shares: 85,
    averageCost: 14.89,
    currentPrice: 16.02,
    marketValue: 1361.70,
    todayReturn: 147.90,
    todayReturnPercent: 10.48,
    totalReturn: 96.05,
    totalReturnPercent: 7.59,
  },
  {
    id: '10',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    shares: 1,
    averageCost: 193.07,
    currentPrice: 183.20,
    marketValue: 183.20,
    todayReturn: -8.94,
    todayReturnPercent: -4.87,
    totalReturn: -9.87,
    totalReturnPercent: -5.11,
  },
  {
    id: '11',
    symbol: 'SOXL',
    name: 'Direxion Daily Semiconductor',
    shares: 15,
    averageCost: 23.29,
    currentPrice: 34.93,
    marketValue: 523.95,
    todayReturn: -38.55,
    todayReturnPercent: -7.31,
    totalReturn: 174.60,
    totalReturnPercent: 50.00,
  },
]

export const mockPortfolio: PortfolioData = {
  totalValue: 100520.28,
  buyingPower: 60.92,
  todayReturn: -85.99,
  todayReturnPercent: -0.65,
  totalReturn: 1910.67,
  totalReturnPercent: 16.58,
}

// Generate mock chart data for the last trading day (6.5 hours)
export const generateMockChartData = (): ChartDataPoint[] => {
  const data: ChartDataPoint[] = []
  const startValue = mockPortfolio.totalValue - mockPortfolio.todayReturn
  const points = 78 // 6.5 hours * 12 points per hour (every 5 minutes)
  
  for (let i = 0; i <= points; i++) {
    const progress = i / points
    // Add some randomness to make it look realistic
    const randomVariation = (Math.random() - 0.5) * 50
    const value = startValue + (mockPortfolio.todayReturn * progress) + randomVariation
    
    // Generate time stamps (9:30 AM to 4:00 PM ET)
    const startHour = 9
    const startMinute = 30
    const totalMinutes = startMinute + (i * 5)
    const hour = startHour + Math.floor(totalMinutes / 60)
    const minute = totalMinutes % 60
    const time = `${hour}:${minute.toString().padStart(2, '0')}`
    
    data.push({ time, value })
  }
  
  return data
}

export const mockChartData = generateMockChartData()
