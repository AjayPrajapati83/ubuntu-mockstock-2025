'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { UserCircle, Users, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ParticipantJoinPage() {
  const router = useRouter()
  const [teamName, setTeamName] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [registeredTeams, setRegisteredTeams] = useState<string[]>([])

  useEffect(() => {
    // Check if team is already locked (logged in before)
    const isLocked = localStorage.getItem('teamLocked')
    const existingTeam = localStorage.getItem('teamName')
    
    if (isLocked === 'true' && existingTeam) {
      // Team already logged in, redirect to dashboard
      router.push('/dashboard')
      return
    }
    
    // Fetch registered teams from API
    fetchRegisteredTeams()
  }, [router])

  const fetchRegisteredTeams = async () => {
    try {
      // Fetch only active teams (game must be started)
      const response = await fetch('/api/teams/registered?activeOnly=true')
      if (response.ok) {
        const data = await response.json()
        setRegisteredTeams(data.teams || [])
      }
    } catch (error) {
      console.error('Failed to fetch teams:', error)
    }
  }

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const trimmedName = teamName.trim()

    if (!trimmedName) {
      setError('Please enter a team name')
      setIsLoading(false)
      return
    }

    try {
      // 1. Check if game is active and team is registered
      const teamsResponse = await fetch('/api/teams/registered?activeOnly=true')
      if (!teamsResponse.ok) {
        setError('Failed to verify team registration')
        setIsLoading(false)
        return
      }

      const teamsData = await teamsResponse.json()
      
      // Check if game is active
      if (!teamsData.gameIsActive) {
        setError('Game has not started yet. Please wait for admin to start the game.')
        setIsLoading(false)
        return
      }

      // Check if team is in the active teams list
      const activeTeams = teamsData.teams || []
      if (activeTeams.length === 0) {
        setError('No teams have been registered yet. Please contact admin.')
        setIsLoading(false)
        return
      }

      if (!activeTeams.includes(trimmedName)) {
        setError('Team name not found or not activated. Please check with admin for valid team names.')
        setIsLoading(false)
        return
      }

      // 2. Check if team already has an active session
      const deviceId = localStorage.getItem('deviceId') || `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('deviceId', deviceId)

      const sessionCheckResponse = await fetch(`/api/teams/sessions?teamName=${encodeURIComponent(trimmedName)}`)
      if (!sessionCheckResponse.ok) {
        setError('Failed to verify session')
        setIsLoading(false)
        return
      }

      const sessionData = await sessionCheckResponse.json()
      
      if (sessionData.hasActiveSession && !sessionData.isCurrentSession) {
        setError('This team is already logged in on another device. Each team can only have one active session.')
        setIsLoading(false)
        return
      }

      // 3. Create new session
      const createSessionResponse = await fetch('/api/teams/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamName: trimmedName, deviceId })
      })

      if (!createSessionResponse.ok) {
        const errorData = await createSessionResponse.json()
        setError(errorData.error || 'Failed to create session')
        setIsLoading(false)
        return
      }

      const sessionResult = await createSessionResponse.json()

      // 4. Store session info and redirect
      localStorage.setItem('teamName', trimmedName)
      localStorage.setItem('sessionId', sessionResult.session.sessionId)
      localStorage.setItem('loginTime', sessionResult.session.loginTime)
      
      // Mark that this team has logged in (prevent switching)
      localStorage.setItem('teamLocked', 'true')
      
      router.push('/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      setError('An error occurred during login. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen text-white flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-ubuntu-aubergine via-ubuntu-purple to-ubuntu-aubergine"></div>
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-ubuntu-purple/30 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo/Header */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-ubuntu-purple to-ubuntu-light-aubergine rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-ubuntu-purple/50">
            <UserCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2">
            Join the <span className="gradient-text">Competition</span>
          </h1>
          <p className="text-gray-400">Enter your team name to start trading</p>
        </motion.div>

        {/* Join Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-effect rounded-3xl p-8"
        >
          <form onSubmit={handleJoin} className="space-y-6">
            {/* Team Name */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Team Name
              </label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter your team name"
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ubuntu-purple transition-all"
                  required
                  autoFocus
                />
              </div>
              <p className="mt-2 text-xs text-gray-400">
                {registeredTeams.length > 0 
                  ? 'Use the team name provided by admin' 
                  : 'Choose any unique team name'}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-200">{error}</p>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-4 bg-gradient-to-r from-ubuntu-purple to-ubuntu-light-aubergine hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all font-semibold text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-2xl hover:shadow-ubuntu-purple/50"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Joining...
                </>
              ) : (
                <>
                  Start Trading
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Registered Teams (if any) */}
          {registeredTeams.length > 0 && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-xs text-gray-400 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Registered Teams ({registeredTeams.length})
              </p>
              <div className="max-h-32 overflow-y-auto space-y-2">
                {registeredTeams.map((team, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 bg-white/5 rounded-lg text-sm text-gray-300 hover:bg-white/10 transition-colors cursor-pointer"
                    onClick={() => setTeamName(team)}
                  >
                    {team}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Game Info */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-ubuntu-orange">₹1L</div>
                <div className="text-xs text-gray-400">Starting Cash</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-ubuntu-orange">5</div>
                <div className="text-xs text-gray-400">Rounds</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-ubuntu-orange">10+</div>
                <div className="text-xs text-gray-400">Stocks</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={() => router.push('/')}
          className="mt-6 w-full px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-center"
        >
          Back to Home
        </motion.button>
      </motion.div>
    </div>
  )
}
