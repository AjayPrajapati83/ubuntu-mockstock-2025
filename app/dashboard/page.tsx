'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TrendingUp, TrendingDown, Clock, Newspaper, 
  Wallet, BarChart3, ArrowUpRight, ArrowDownRight,
  ShoppingCart, DollarSign, Activity, RefreshCw
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { formatCurrency, formatNumber } from '@/lib/utils'
import type { Stock, Portfolio, NewsItem, GameState } from '@/lib/types'

export default function DashboardPage() {
  const router = useRouter()
  const [teamName, setTeamName] = useState('')
  const [gameState, setGameState] = useState<GameState>({
    isActive: true,
    currentRound: 1,
    totalRounds: 5,
    roundEndTime: new Date(Date.now() + 5 * 60 * 1000),
    resultsPublished: false
  })
  
  const [portfolio, setPortfolio] = useState<Portfolio>({
    teamName: '',
    cash: 100000,
    holdings: [],
    totalValue: 100000
  })

  const [stocks, setStocks] = useState<Stock[]>([
    { id: '1', symbol: 'TECH', name: 'TechCorp', price: 1500, previousPrice: 1500, change: 0, changePercent: 0 },
    { id: '2', symbol: 'BANK', name: 'BankCo', price: 2000, previousPrice: 2000, change: 0, changePercent: 0 },
    { id: '3', symbol: 'AUTO', name: 'AutoInc', price: 1200, previousPrice: 1200, change: 0, changePercent: 0 },
    { id: '4', symbol: 'PHARM', name: 'PharmaCo', price: 1800, previousPrice: 1800, change: 0, changePercent: 0 },
    { id: '5', symbol: 'ENRG', name: 'EnergyCo', price: 1000, previousPrice: 1000, change: 0, changePercent: 0 },
  ])

  const [news, setNews] = useState<NewsItem[]>([
    {
      id: '1',
      timestamp: new Date(),
      title: 'Market Opens Strong',
      content: 'All sectors showing positive momentum',
      impact: 'positive',
      affectedStocks: []
    }
  ])

  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy')
  const [quantity, setQuantity] = useState(1)
  const [showTradeModal, setShowTradeModal] = useState(false)

  useEffect(() => {
    const name = localStorage.getItem('teamName')
    if (!name) {
      router.push('/')
      return
    }
    setTeamName(name)
    setPortfolio(prev => ({ ...prev, teamName: name }))

    // Simulate price updates
    const interval = setInterval(() => {
      setStocks(prev => prev.map(stock => {
        const change = (Math.random() - 0.5) * 100
        const newPrice = Math.max(stock.price + change, 100)
        return {
          ...stock,
          previousPrice: stock.price,
          price: newPrice,
          change: newPrice - stock.previousPrice,
          changePercent: ((newPrice - stock.previousPrice) / stock.previousPrice) * 100
        }
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [router])

  const handleTrade = (stock: Stock, type: 'buy' | 'sell') => {
    setSelectedStock(stock)
    setTradeType(type)
    setQuantity(1)
    setShowTradeModal(true)
  }

  const executeTrade = () => {
    if (!selectedStock) return

    if (tradeType === 'buy') {
      const totalCost = selectedStock.price * quantity
      if (totalCost > portfolio.cash) {
        alert('Insufficient funds!')
        return
      }

      setPortfolio(prev => {
        const existingHolding = prev.holdings.find(h => h.stockId === selectedStock.id)
        const newHoldings = existingHolding
          ? prev.holdings.map(h => 
              h.stockId === selectedStock.id
                ? {
                    ...h,
                    quantity: h.quantity + quantity,
                    avgPrice: (h.avgPrice * h.quantity + selectedStock.price * quantity) / (h.quantity + quantity),
                    currentPrice: selectedStock.price,
                    totalValue: (h.quantity + quantity) * selectedStock.price,
                    profitLoss: ((h.quantity + quantity) * selectedStock.price) - ((h.avgPrice * h.quantity + selectedStock.price * quantity)),
                    profitLossPercent: (((h.quantity + quantity) * selectedStock.price) - ((h.avgPrice * h.quantity + selectedStock.price * quantity))) / ((h.avgPrice * h.quantity + selectedStock.price * quantity)) * 100
                  }
                : h
            )
          : [
              ...prev.holdings,
              {
                stockId: selectedStock.id,
                symbol: selectedStock.symbol,
                quantity,
                avgPrice: selectedStock.price,
                currentPrice: selectedStock.price,
                totalValue: selectedStock.price * quantity,
                profitLoss: 0,
                profitLossPercent: 0
              }
            ]

        const newCash = prev.cash - totalCost
        const holdingsValue = newHoldings.reduce((sum, h) => sum + h.totalValue, 0)
        
        return {
          ...prev,
          cash: newCash,
          holdings: newHoldings,
          totalValue: newCash + holdingsValue
        }
      })
    } else {
      const holding = portfolio.holdings.find(h => h.stockId === selectedStock.id)
      if (!holding || holding.quantity < quantity) {
        alert('Insufficient shares!')
        return
      }

      setPortfolio(prev => {
        const totalRevenue = selectedStock.price * quantity
        const newHoldings = prev.holdings
          .map(h => 
            h.stockId === selectedStock.id
              ? { ...h, quantity: h.quantity - quantity }
              : h
          )
          .filter(h => h.quantity > 0)

        const newCash = prev.cash + totalRevenue
        const holdingsValue = newHoldings.reduce((sum, h) => sum + h.totalValue, 0)

        return {
          ...prev,
          cash: newCash,
          holdings: newHoldings,
          totalValue: newCash + holdingsValue
        }
      })
    }

    setShowTradeModal(false)
  }

  const timeRemaining = gameState.roundEndTime 
    ? Math.max(0, Math.floor((gameState.roundEndTime.getTime() - Date.now()) / 1000))
    : 0

  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60

  return (
    <div className="min-h-screen text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-ubuntu-aubergine/95 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold gradient-text">Mock Stock</h1>
              <p className="text-sm text-gray-400">Team: {teamName}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="glass-effect px-4 py-2 rounded-xl">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-ubuntu-orange" />
                  <span className="font-mono font-bold">
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                  </span>
                </div>
                <div className="text-xs text-gray-400">Round {gameState.currentRound}/{gameState.totalRounds}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Portfolio Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-3 gap-4 mb-6"
        >
          <div className="glass-effect rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-ubuntu-orange/20 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-ubuntu-orange" />
              </div>
              <div className="text-sm text-gray-400">Total Value</div>
            </div>
            <div className="text-3xl font-bold">{formatCurrency(portfolio.totalValue)}</div>
            <div className="text-sm text-gray-400 mt-1">
              P/L: {formatCurrency(portfolio.totalValue - 100000)}
            </div>
          </div>

          <div className="glass-effect rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-sm text-gray-400">Cash Balance</div>
            </div>
            <div className="text-3xl font-bold">{formatCurrency(portfolio.cash)}</div>
          </div>

          <div className="glass-effect rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-sm text-gray-400">Holdings Value</div>
            </div>
            <div className="text-3xl font-bold">
              {formatCurrency(portfolio.holdings.reduce((sum, h) => sum + h.totalValue, 0))}
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Trading Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Market Stocks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-effect rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-ubuntu-orange" />
                  Live Market
                </h2>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {stocks.map((stock) => (
                  <motion.div
                    key={stock.id}
                    layout
                    className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-bold text-lg">{stock.symbol}</div>
                        <div className="text-sm text-gray-400">{stock.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-xl">{formatCurrency(stock.price)}</div>
                        <div className={`text-sm flex items-center gap-1 justify-end ${
                          stock.change >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {stock.change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                          {stock.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleTrade(stock, 'buy')}
                        className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-sm font-semibold"
                      >
                        Buy
                      </button>
                      <button
                        onClick={() => handleTrade(stock, 'sell')}
                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm font-semibold"
                        disabled={!portfolio.holdings.find(h => h.stockId === stock.id)}
                      >
                        Sell
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Your Holdings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-effect rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-ubuntu-orange" />
                Your Holdings
              </h2>

              {portfolio.holdings.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No holdings yet. Start trading!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {portfolio.holdings.map((holding) => (
                    <div key={holding.stockId} className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-bold">{holding.symbol}</div>
                          <div className="text-sm text-gray-400">
                            {holding.quantity} shares @ {formatCurrency(holding.avgPrice)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{formatCurrency(holding.totalValue)}</div>
                          <div className={`text-sm ${
                            holding.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {holding.profitLoss >= 0 ? '+' : ''}{formatCurrency(holding.profitLoss)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* News Feed */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-effect rounded-2xl p-6 h-fit sticky top-24"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-ubuntu-orange" />
              Market News
            </h2>

            <div className="space-y-4">
              {news.map((item) => (
                <div key={item.id} className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-start gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      item.impact === 'positive' ? 'bg-green-400' :
                      item.impact === 'negative' ? 'bg-red-400' : 'bg-gray-400'
                    }`} />
                    <div className="flex-1">
                      <div className="font-semibold text-sm mb-1">{item.title}</div>
                      <div className="text-xs text-gray-400">{item.content}</div>
                      <div className="text-xs text-gray-500 mt-2">
                        {new Date(item.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Trade Modal */}
      <AnimatePresence>
        {showTradeModal && selectedStock && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowTradeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-effect rounded-3xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold mb-6">
                {tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedStock.symbol}
              </h3>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Current Price</label>
                  <div className="text-2xl font-bold">{formatCurrency(selectedStock.price)}</div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-ubuntu-orange"
                  />
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Total Amount</span>
                    <span className="font-bold">{formatCurrency(selectedStock.price * quantity)}</span>
                  </div>
                  {tradeType === 'buy' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Available Cash</span>
                      <span>{formatCurrency(portfolio.cash)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowTradeModal(false)}
                  className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={executeTrade}
                  className={`flex-1 px-6 py-3 rounded-xl transition-all font-semibold ${
                    tradeType === 'buy'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  Confirm {tradeType === 'buy' ? 'Buy' : 'Sell'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
