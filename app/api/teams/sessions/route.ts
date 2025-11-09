import { NextResponse } from 'next/server'

// Team session management
// Tracks which teams are currently logged in and their session info
interface TeamSession {
  teamName: string
  sessionId: string
  loginTime: Date
  lastActivity: Date
  deviceId: string
  isActive: boolean
}

// In-memory storage (replace with Redis/Database in production)
const activeSessions = new Map<string, TeamSession>()

// GET: Check if team has active session
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const teamName = searchParams.get('teamName')
  const sessionId = searchParams.get('sessionId')
  
  if (!teamName) {
    return NextResponse.json({ error: 'Team name required' }, { status: 400 })
  }
  
  const session = activeSessions.get(teamName)
  
  if (!session) {
    return NextResponse.json({ 
      hasActiveSession: false,
      canLogin: true
    })
  }
  
  // Check if this is the same session
  if (sessionId && session.sessionId === sessionId) {
    // Update last activity
    session.lastActivity = new Date()
    activeSessions.set(teamName, session)
    
    return NextResponse.json({
      hasActiveSession: true,
      isCurrentSession: true,
      session: {
        sessionId: session.sessionId,
        loginTime: session.loginTime,
        lastActivity: session.lastActivity
      }
    })
  }
  
  // Different session - check if it's still active (within 30 minutes)
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)
  const isSessionExpired = session.lastActivity < thirtyMinutesAgo
  
  if (isSessionExpired) {
    // Clean up expired session
    activeSessions.delete(teamName)
    return NextResponse.json({
      hasActiveSession: false,
      canLogin: true
    })
  }
  
  return NextResponse.json({
    hasActiveSession: true,
    isCurrentSession: false,
    canLogin: false,
    message: 'This team is already logged in on another device'
  })
}

// POST: Create new session
export async function POST(request: Request) {
  const body = await request.json()
  const { teamName, deviceId } = body
  
  if (!teamName || !deviceId) {
    return NextResponse.json({ error: 'Team name and device ID required' }, { status: 400 })
  }
  
  // Check for existing active session
  const existingSession = activeSessions.get(teamName)
  if (existingSession) {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)
    const isSessionExpired = existingSession.lastActivity < thirtyMinutesAgo
    
    if (!isSessionExpired) {
      return NextResponse.json({ 
        error: 'Team is already logged in on another device',
        hasActiveSession: true
      }, { status: 409 })
    }
  }
  
  // Create new session
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const newSession: TeamSession = {
    teamName,
    sessionId,
    loginTime: new Date(),
    lastActivity: new Date(),
    deviceId,
    isActive: true
  }
  
  activeSessions.set(teamName, newSession)
  
  return NextResponse.json({
    success: true,
    session: {
      sessionId: newSession.sessionId,
      loginTime: newSession.loginTime
    }
  })
}

// DELETE: Logout/end session
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const teamName = searchParams.get('teamName')
  const sessionId = searchParams.get('sessionId')
  
  if (!teamName || !sessionId) {
    return NextResponse.json({ error: 'Team name and session ID required' }, { status: 400 })
  }
  
  const session = activeSessions.get(teamName)
  
  if (!session || session.sessionId !== sessionId) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 404 })
  }
  
  activeSessions.delete(teamName)
  
  return NextResponse.json({ success: true, message: 'Session ended' })
}

// PUT: Update session activity (heartbeat)
export async function PUT(request: Request) {
  const body = await request.json()
  const { teamName, sessionId } = body
  
  if (!teamName || !sessionId) {
    return NextResponse.json({ error: 'Team name and session ID required' }, { status: 400 })
  }
  
  const session = activeSessions.get(teamName)
  
  if (!session || session.sessionId !== sessionId) {
    return NextResponse.json({ error: 'Invalid session', sessionExpired: true }, { status: 401 })
  }
  
  session.lastActivity = new Date()
  activeSessions.set(teamName, session)
  
  return NextResponse.json({ success: true, lastActivity: session.lastActivity })
}
