import { NextResponse } from 'next/server'

// Team registration with activation status
interface RegisteredTeam {
  teamName: string
  cash: number
  isActive: boolean // Only active teams can login
  createdAt: Date
  activatedAt?: Date
}

// In-memory storage for registered teams (replace with database in production)
let registeredTeams: RegisteredTeam[] = []
let gameIsActive = false

// GET: Get list of registered team names
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const activeOnly = searchParams.get('activeOnly') === 'true'
  
  if (activeOnly) {
    // Return only active teams (when game is running)
    const activeTeams = registeredTeams
      .filter(t => t.isActive)
      .map(t => t.teamName)
    return NextResponse.json({ 
      teams: activeTeams,
      gameIsActive 
    })
  }
  
  // Return all teams (for admin)
  return NextResponse.json({ 
    teams: registeredTeams.map(t => t.teamName),
    fullTeams: registeredTeams,
    gameIsActive 
  })
}

// POST: Update registered teams (called by admin)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { teams, action } = body
    
    // Handle game activation
    if (action === 'activateGame') {
      gameIsActive = true
      // Activate all registered teams
      registeredTeams = registeredTeams.map(team => ({
        ...team,
        isActive: true,
        activatedAt: new Date()
      }))
      return NextResponse.json({ 
        success: true, 
        message: 'Game activated, all teams are now active',
        teams: registeredTeams 
      })
    }
    
    // Handle game deactivation
    if (action === 'deactivateGame') {
      gameIsActive = false
      return NextResponse.json({ 
        success: true, 
        message: 'Game deactivated',
        gameIsActive: false 
      })
    }
    
    // Handle team registration (admin creating teams)
    if (Array.isArray(teams)) {
      // Convert simple team names to full team objects
      registeredTeams = teams.map((team: any) => {
        if (typeof team === 'string') {
          // Simple team name - create new team
          const existing = registeredTeams.find(t => t.teamName === team)
          return existing || {
            teamName: team,
            cash: 100000,
            isActive: false, // Not active until game starts
            createdAt: new Date()
          }
        } else if (team.teamName) {
          // Full team object
          const existing = registeredTeams.find(t => t.teamName === team.teamName)
          return {
            teamName: team.teamName,
            cash: team.cash || 100000,
            isActive: existing?.isActive || false,
            createdAt: existing?.createdAt || new Date(),
            activatedAt: existing?.activatedAt
          }
        }
        return null
      }).filter(Boolean) as RegisteredTeam[]
      
      return NextResponse.json({ 
        success: true, 
        teams: registeredTeams.map(t => t.teamName),
        fullTeams: registeredTeams 
      })
    }
    
    return NextResponse.json({ error: 'Invalid teams data' }, { status: 400 })
  } catch (error) {
    console.error('Team registration error:', error)
    return NextResponse.json({ error: 'Failed to update teams' }, { status: 500 })
  }
}
