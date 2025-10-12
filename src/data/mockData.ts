import type { Stock, PortfolioData, ChartDataPoint } from '../types'

export const mockStocks: Stock[] = [
  {
    id: '1',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    shares: 10,
    averageCost: 150.00,
    currentPrice: 178.50,
    marketValue: 1785.00,
    todayReturn: 25.50,
    todayReturnPercent: 1.45,
    totalReturn: 285.00,
    totalReturnPercent: 19.00,
  },
  {
    id: '2',
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    shares: 5,
    averageCost: 220.00,
    currentPrice: 242.80,
    marketValue: 1214.00,
    todayReturn: -18.20,
    todayReturnPercent: -1.48,
    totalReturn: 114.00,
    totalReturnPercent: 10.36,
  },
  {
    id: '3',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    shares: 8,
    averageCost: 410.00,
    currentPrice: 468.35,
    marketValue: 3746.80,
    todayReturn: 42.00,
    todayReturnPercent: 1.13,
    totalReturn: 466.80,
    totalReturnPercent: 14.23,
  },
  {
    id: '4',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    shares: 12,
    averageCost: 310.00,
    currentPrice: 378.91,
    marketValue: 4546.92,
    todayReturn: 32.16,
    todayReturnPercent: 0.71,
    totalReturn: 826.92,
    totalReturnPercent: 22.20,
  },
  {
    id: '5',
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    shares: 15,
    averageCost: 128.00,
    currentPrice: 142.53,
    marketValue: 2137.95,
    todayReturn: -10.50,
    todayReturnPercent: -0.49,
    totalReturn: 217.95,
    totalReturnPercent: 11.35,
  },
]

export const mockPortfolio: PortfolioData = {
  totalValue: 13430.67,
  buyingPower: 2845.32,
  todayReturn: 71.96,
  todayReturnPercent: 0.54,
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
