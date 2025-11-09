import { NextResponse } from 'next/server'

// In-memory storage for registered teams (replace with database in production)
let registeredTeams: string[] = []

// GET: Get list of registered team names
export async function GET() {
  return NextResponse.json({ teams: registeredTeams })
}

// POST: Update registered teams (called by admin)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { teams } = body
    
    if (Array.isArray(teams)) {
      registeredTeams = teams
      return NextResponse.json({ success: true, teams: registeredTeams })
    }
    
    return NextResponse.json({ error: 'Invalid teams data' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update teams' }, { status: 500 })
  }
}
