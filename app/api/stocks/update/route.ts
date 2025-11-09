import { NextResponse } from 'next/server'

// Stock price storage
interface Stock {
  id: string
  symbol: string
  name: string
  price: number
  previousPrice: number
  change: number
  changePercent: number
}

// In-memory stock prices (synced across all clients)
let stocks: Stock[] = [
  { id: '1', symbol: 'TECH', name: 'TechCorp', price: 1500, previousPrice: 1500, change: 0, changePercent: 0 },
  { id: '2', symbol: 'BANK', name: 'BankCo', price: 2000, previousPrice: 2000, change: 0, changePercent: 0 },
  { id: '3', symbol: 'AUTO', name: 'AutoInc', price: 1200, previousPrice: 1200, change: 0, changePercent: 0 },
  { id: '4', symbol: 'PHARM', name: 'PharmaCo', price: 1800, previousPrice: 1800, change: 0, changePercent: 0 },
  { id: '5', symbol: 'ENRG', name: 'EnergyCo', price: 1000, previousPrice: 1000, change: 0, changePercent: 0 },
]

// Pending news impacts (to be applied gradually)
const pendingImpacts = new Map<string, number>() // symbol -> cumulative impact %

// GET: Get current stock prices
export async function GET() {
  return NextResponse.json(stocks)
}

// POST: Update stock prices (can be triggered by news or random)
export async function POST(request: Request) {
  const body = await request.json()
  const { action, newsImpacts } = body
  
  if (action === 'applyNews' && newsImpacts) {
    // Apply news impacts to stocks
    for (const { symbol, priceImpact } of newsImpacts) {
      const current = pendingImpacts.get(symbol) || 0
      pendingImpacts.set(symbol, current + priceImpact)
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'News impacts queued',
      pendingImpacts: Object.fromEntries(pendingImpacts)
    })
  }
  
  if (action === 'tick') {
    // Update prices with pending impacts + random noise
    stocks = stocks.map(stock => {
      const pendingImpact = pendingImpacts.get(stock.symbol) || 0
      
      // Apply 20% of pending impact per tick (gradual change)
      const impactToApply = pendingImpact * 0.2
      
      // Add random noise (±2%)
      const randomNoise = (Math.random() - 0.5) * 4
      
      // Total change percentage
      const totalChangePercent = impactToApply + randomNoise
      
      // Calculate new price
      const priceChange = stock.price * (totalChangePercent / 100)
      const newPrice = Math.max(stock.price + priceChange, 100) // Minimum price of 100
      
      // Update pending impact
      const remainingImpact = pendingImpact - impactToApply
      if (Math.abs(remainingImpact) < 0.5) {
        pendingImpacts.delete(stock.symbol)
      } else {
        pendingImpacts.set(stock.symbol, remainingImpact)
      }
      
      return {
        ...stock,
        previousPrice: stock.price,
        price: Math.round(newPrice * 100) / 100, // Round to 2 decimals
        change: newPrice - stock.price,
        changePercent: ((newPrice - stock.price) / stock.price) * 100
      }
    })
    
    return NextResponse.json({ 
      success: true, 
      stocks,
      pendingImpacts: Object.fromEntries(pendingImpacts)
    })
  }
  
  // Manual price update (admin)
  const { symbol, newPrice } = body
  if (symbol && newPrice) {
    const stockIndex = stocks.findIndex(s => s.symbol === symbol)
    if (stockIndex !== -1) {
      const stock = stocks[stockIndex]
      stocks[stockIndex] = {
        ...stock,
        previousPrice: stock.price,
        price: newPrice,
        change: newPrice - stock.price,
        changePercent: ((newPrice - stock.price) / stock.price) * 100
      }
      return NextResponse.json(stocks[stockIndex])
    }
  }
  
  return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
}

// PUT: Reset stock prices
export async function PUT() {
  stocks = [
    { id: '1', symbol: 'TECH', name: 'TechCorp', price: 1500, previousPrice: 1500, change: 0, changePercent: 0 },
    { id: '2', symbol: 'BANK', name: 'BankCo', price: 2000, previousPrice: 2000, change: 0, changePercent: 0 },
    { id: '3', symbol: 'AUTO', name: 'AutoInc', price: 1200, previousPrice: 1200, change: 0, changePercent: 0 },
    { id: '4', symbol: 'PHARM', name: 'PharmaCo', price: 1800, previousPrice: 1800, change: 0, changePercent: 0 },
    { id: '5', symbol: 'ENRG', name: 'EnergyCo', price: 1000, previousPrice: 1000, change: 0, changePercent: 0 },
  ]
  pendingImpacts.clear()
  
  return NextResponse.json({ success: true, stocks })
}
