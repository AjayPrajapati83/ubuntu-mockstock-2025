import { NextResponse } from 'next/server'

// This endpoint calculates final rankings
// Called by admin when game ends
export async function POST(request: Request) {
  try {
    // In production, fetch all teams from database
    // For now, we'll simulate the calculation
    
    // 1. Get all teams
    const teamsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/teams`)
    const teams = await teamsResponse.json()
    
    // 2. Calculate final portfolio values
    // (In real implementation, get current stock prices and calculate)
    const leaderboard = teams
      .map((team: any, index: number) => ({
        rank: 0, // Will be assigned after sorting
        teamName: team.teamName,
        portfolioValue: team.totalValue,
        profitLoss: team.totalValue - 100000,
        profitLossPercent: ((team.totalValue - 100000) / 100000) * 100
      }))
      .sort((a: any, b: any) => b.portfolioValue - a.portfolioValue)
      .map((entry: any, index: number) => ({
        ...entry,
        rank: index + 1
      }))
    
    // 3. Store leaderboard results
    // In production, save to database
    
    return NextResponse.json({
      success: true,
      leaderboard,
      calculatedAt: new Date()
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to calculate leaderboard' },
      { status: 500 }
    )
  }
}
