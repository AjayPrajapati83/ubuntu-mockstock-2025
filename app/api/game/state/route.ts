import { NextResponse } from 'next/server'

// In production, use Vercel KV or PostgreSQL
// This is a simple in-memory store for demo
let gameState = {
  isActive: false,
  currentRound: 0,
  totalRounds: 5,
  roundEndTime: null as Date | null,
  resultsPublished: false,
  startTime: null as Date | null,
  endTime: null as Date | null,
}

export async function GET() {
  return NextResponse.json(gameState)
}

export async function POST(request: Request) {
  const body = await request.json()
  
  // Update game state
  gameState = {
    ...gameState,
    ...body
  }
  
  // Auto-end game when time expires
  if (gameState.roundEndTime && new Date() > new Date(gameState.roundEndTime)) {
    gameState.isActive = false
    gameState.endTime = new Date()
  }
  
  return NextResponse.json(gameState)
}
