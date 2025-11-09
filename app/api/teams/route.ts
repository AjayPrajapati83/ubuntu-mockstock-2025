import { NextResponse } from 'next/server'

// In-memory storage (replace with Vercel Postgres in production)
// Structure: { teamName: { portfolio, transactions, lastUpdate } }
const teams = new Map<string, {
  teamName: string
  cash: number
  holdings: Array<{
    stockId: string
    symbol: string
    quantity: number
    avgPrice: number
  }>
  totalValue: number
  createdAt: Date
  lastUpdate: Date
}>()

// GET: Retrieve team data
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const teamName = searchParams.get('teamName')
  
  if (teamName) {
    const team = teams.get(teamName)
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 })
    }
    return NextResponse.json(team)
  }
  
  // Return all teams (for admin)
  return NextResponse.json(Array.from(teams.values()))
}

// POST: Create or update team
export async function POST(request: Request) {
  const body = await request.json()
  const { teamName, cash, holdings, totalValue } = body
  
  if (!teamName) {
    return NextResponse.json({ error: 'Team name required' }, { status: 400 })
  }
  
  const existingTeam = teams.get(teamName)
  
  if (existingTeam) {
    // Update existing team
    teams.set(teamName, {
      ...existingTeam,
      cash: cash ?? existingTeam.cash,
      holdings: holdings ?? existingTeam.holdings,
      totalValue: totalValue ?? existingTeam.totalValue,
      lastUpdate: new Date()
    })
  } else {
    // Create new team
    teams.set(teamName, {
      teamName,
      cash: cash ?? 100000,
      holdings: holdings ?? [],
      totalValue: totalValue ?? 100000,
      createdAt: new Date(),
      lastUpdate: new Date()
    })
  }
  
  return NextResponse.json(teams.get(teamName))
}

// DELETE: Remove team (admin only)
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const teamName = searchParams.get('teamName')
  
  if (!teamName) {
    return NextResponse.json({ error: 'Team name required' }, { status: 400 })
  }
  
  teams.delete(teamName)
  return NextResponse.json({ success: true })
}
