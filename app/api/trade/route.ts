import { NextResponse } from 'next/server'

// Transaction log (replace with database in production)
const transactions: Array<{
  id: string
  teamName: string
  stockId: string
  symbol: string
  type: 'buy' | 'sell'
  quantity: number
  price: number
  timestamp: Date
}> = []

// POST: Execute trade
export async function POST(request: Request) {
  const body = await request.json()
  const { teamName, stockId, symbol, type, quantity, price } = body
  
  // Validation
  if (!teamName || !stockId || !type || !quantity || !price) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  
  // Create transaction record
  const transaction = {
    id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    teamName,
    stockId,
    symbol,
    type,
    quantity,
    price,
    timestamp: new Date()
  }
  
  transactions.push(transaction)
  
  return NextResponse.json({ 
    success: true, 
    transaction 
  })
}

// GET: Get transaction history
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const teamName = searchParams.get('teamName')
  
  if (teamName) {
    const teamTransactions = transactions.filter(t => t.teamName === teamName)
    return NextResponse.json(teamTransactions)
  }
  
  // Return all transactions (admin only)
  return NextResponse.json(transactions)
}
