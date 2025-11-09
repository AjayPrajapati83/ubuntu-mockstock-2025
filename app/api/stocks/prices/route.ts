import { NextResponse } from 'next/server'

// Stock prices storage (replace with Redis/Vercel KV for real-time updates)
let stockPrices = [
  { id: '1', symbol: 'TECH', name: 'TechCorp', price: 1500, previousPrice: 1500 },
  { id: '2', symbol: 'BANK', name: 'BankCo', price: 2000, previousPrice: 2000 },
  { id: '3', symbol: 'AUTO', name: 'AutoInc', price: 1200, previousPrice: 1200 },
  { id: '4', symbol: 'PHARM', name: 'PharmaCo', price: 1800, previousPrice: 1800 },
  { id: '5', symbol: 'ENRG', name: 'EnergyCo', price: 1000, previousPrice: 1000 },
]

// GET: Get current stock prices
export async function GET() {
  const stocksWithChange = stockPrices.map(stock => ({
    ...stock,
    change: stock.price - stock.previousPrice,
    changePercent: ((stock.price - stock.previousPrice) / stock.previousPrice) * 100
  }))
  
  return NextResponse.json(stocksWithChange)
}

// POST: Update stock prices (admin/system only)
export async function POST(request: Request) {
  const body = await request.json()
  const { stockId, newPrice } = body
  
  if (!stockId || !newPrice) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  
  const stockIndex = stockPrices.findIndex(s => s.id === stockId)
  
  if (stockIndex === -1) {
    return NextResponse.json({ error: 'Stock not found' }, { status: 404 })
  }
  
  // Update price
  stockPrices[stockIndex].previousPrice = stockPrices[stockIndex].price
  stockPrices[stockIndex].price = newPrice
  
  return NextResponse.json(stockPrices[stockIndex])
}
