export interface Stock {
  id: string
  symbol: string
  name: string
  price: number
  previousPrice: number
  change: number
  changePercent: number
}

export interface Portfolio {
  teamName: string
  cash: number
  holdings: Holding[]
  totalValue: number
}

export interface Holding {
  stockId: string
  symbol: string
  quantity: number
  avgPrice: number
  currentPrice: number
  totalValue: number
  profitLoss: number
  profitLossPercent: number
}

export interface NewsItem {
  id: string
  timestamp: Date
  title: string
  content: string
  impact: 'positive' | 'negative' | 'neutral'
  affectedStocks: string[]
  priceImpact?: number // Percentage change hint (hidden from participants)
}

export interface GameState {
  isActive: boolean
  currentRound: number
  totalRounds: number
  roundEndTime: Date | null
  resultsPublished: boolean
}

export interface LeaderboardEntry {
  rank: number
  teamName: string
  portfolioValue: number
  profitLoss: number
  profitLossPercent: number
}

export interface Transaction {
  id: string
  teamName: string
  stockId: string
  type: 'buy' | 'sell'
  quantity: number
  price: number
  timestamp: Date
}
