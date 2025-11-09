'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, Users, DollarSign, Clock, TrendingUp, Plus, 
  Play, Pause, StopCircle, Eye, Settings, Trash2, Edit,
  BarChart3, Trophy, LogOut
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { formatCurrency } from '@/lib/utils'

interface Team {
  teamName: string
  cash: number
  totalValue: number
  rank?: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [adminName, setAdminName] = useState('')
  const [isGameActive, setIsGameActive] = useState(false)
  const [currentRound, setCurrentRound] = useState(1)
  const [roundDuration, setRoundDuration] = useState(5) // minutes
  const [teams, setTeams] = useState<Team[]>([])
  const [newTeamName, setNewTeamName] = useState('')
  const [initialCash, setInitialCash] = useState(100000)
  const [showAddTeam, setShowAddTeam] = useState(false)

  useEffect(() => {
    // Check admin authentication
    const isAuth = localStorage.getItem('adminAuth')
    const name = localStorage.getItem('adminName')
    
    if (!isAuth) {
      router.push('/admin/login')
      return
    }
    
    setAdminName(name || 'Admin')
    loadTeams()
  }, [router])

  const loadTeams = async () => {
    // Load teams from localStorage
    const savedTeams = localStorage.getItem('registeredTeams')
    if (savedTeams) {
      const teams = JSON.parse(savedTeams)
      setTeams(teams)
      
      // Sync to API on load
      const teamNames = teams.map((t: Team) => t.teamName)
      try {
        await fetch('/api/teams/registered', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ teams: teamNames })
        })
      } catch (error) {
        console.error('Failed to sync teams on load:', error)
      }
    }
  }

  const saveTeams = async (updatedTeams: Team[]) => {
    localStorage.setItem('registeredTeams', JSON.stringify(updatedTeams))
    
    // Sync team names to API for participant validation
    const teamNames = updatedTeams.map(t => t.teamName)
    localStorage.setItem('teamNames', JSON.stringify(teamNames))
    
    // Update API with registered team names
    try {
      await fetch('/api/teams/registered', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teams: teamNames })
      })
    } catch (error) {
      console.error('Failed to sync teams to API:', error)
    }
    
    setTeams(updatedTeams)
  }

  const handleAddTeam = () => {
    if (!newTeamName.trim()) return

    const newTeam: Team = {
      teamName: newTeamName.trim(),
      cash: initialCash,
      totalValue: initialCash
    }

    const updatedTeams = [...teams, newTeam]
    saveTeams(updatedTeams)
    setNewTeamName('')
    setShowAddTeam(false)
  }

  const handleDeleteTeam = (teamName: string) => {
    if (confirm(`Are you sure you want to delete team "${teamName}"?`)) {
      const updatedTeams = teams.filter(t => t.teamName !== teamName)
      saveTeams(updatedTeams)
    }
  }

  const handleStartGame = () => {
    if (teams.length === 0) {
      alert('Please add at least one team before starting the game')
      return
    }
    setIsGameActive(true)
    localStorage.setItem('gameActive', 'true')
    localStorage.setItem('currentRound', '1')
    localStorage.setItem('roundDuration', roundDuration.toString())
  }

  const handlePauseGame = () => {
    setIsGameActive(false)
    localStorage.setItem('gameActive', 'false')
  }

  const handleEndGame = () => {
    if (confirm('Are you sure you want to end the game? This will freeze all trading.')) {
      setIsGameActive(false)
      localStorage.setItem('gameActive', 'false')
      localStorage.setItem('gameEnded', 'true')
    }
  }

  const handleCalculateResults = () => {
    router.push('/admin/results')
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    localStorage.removeItem('adminName')
    localStorage.removeItem('adminUsername')
    router.push('/')
  }

  const sortedTeams = [...teams].sort((a, b) => b.totalValue - a.totalValue)

  return (
    <div className="min-h-screen text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-ubuntu-aubergine/95 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-ubuntu-orange rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-gray-400">Welcome, {adminName}</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-effect rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-8 h-8 text-ubuntu-orange" />
              <div className="text-sm text-gray-400">Total Teams</div>
            </div>
            <div className="text-3xl font-bold">{teams.length}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-effect rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-8 h-8 text-blue-400" />
              <div className="text-sm text-gray-400">Current Round</div>
            </div>
            <div className="text-3xl font-bold">{currentRound} / 5</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-effect rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-8 h-8 text-green-400" />
              <div className="text-sm text-gray-400">Initial Cash</div>
            </div>
            <div className="text-3xl font-bold">{formatCurrency(initialCash)}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-effect rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-8 h-8 text-purple-400" />
              <div className="text-sm text-gray-400">Game Status</div>
            </div>
            <div className={`text-xl font-bold ${isGameActive ? 'text-green-400' : 'text-gray-400'}`}>
              {isGameActive ? 'Active' : 'Inactive'}
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Game Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Game Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-effect rounded-2xl p-6"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Settings className="w-6 h-6 text-ubuntu-orange" />
                Game Configuration
              </h2>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Initial Cash per Team
                  </label>
                  <input
                    type="number"
                    value={initialCash}
                    onChange={(e) => setInitialCash(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-ubuntu-orange"
                    disabled={isGameActive}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Round Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={roundDuration}
                    onChange={(e) => setRoundDuration(parseInt(e.target.value) || 5)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-ubuntu-orange"
                    disabled={isGameActive}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                {!isGameActive ? (
                  <button
                    onClick={handleStartGame}
                    className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl transition-all font-semibold flex items-center justify-center gap-2"
                  >
                    <Play className="w-5 h-5" />
                    Start Game
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handlePauseGame}
                      className="flex-1 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-xl transition-all font-semibold flex items-center justify-center gap-2"
                    >
                      <Pause className="w-5 h-5" />
                      Pause Game
                    </button>
                    <button
                      onClick={handleEndGame}
                      className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl transition-all font-semibold flex items-center justify-center gap-2"
                    >
                      <StopCircle className="w-5 h-5" />
                      End Game
                    </button>
                  </>
                )}
              </div>
            </motion.div>

            {/* Team Management */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-effect rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Users className="w-6 h-6 text-ubuntu-orange" />
                  Team Management
                </h2>
                <button
                  onClick={() => setShowAddTeam(!showAddTeam)}
                  className="px-4 py-2 bg-ubuntu-orange hover:bg-ubuntu-dark-orange rounded-lg transition-all flex items-center gap-2"
                  disabled={isGameActive}
                >
                  <Plus className="w-4 h-4" />
                  Add Team
                </button>
              </div>

              {/* Add Team Form */}
              {showAddTeam && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-6 p-4 bg-white/5 rounded-xl"
                >
                  <input
                    type="text"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    placeholder="Enter team name"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ubuntu-orange mb-3"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTeam()}
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleAddTeam}
                      className="flex-1 px-4 py-2 bg-ubuntu-orange hover:bg-ubuntu-dark-orange rounded-lg transition-all"
                    >
                      Add Team
                    </button>
                    <button
                      onClick={() => setShowAddTeam(false)}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Teams List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {teams.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No teams added yet. Click "Add Team" to get started.</p>
                  </div>
                ) : (
                  teams.map((team, index) => (
                    <div
                      key={index}
                      className="bg-white/5 rounded-xl p-4 flex items-center justify-between hover:bg-white/10 transition-all"
                    >
                      <div>
                        <div className="font-semibold">{team.teamName}</div>
                        <div className="text-sm text-gray-400">
                          Cash: {formatCurrency(team.cash)}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteTeam(team.teamName)}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-all"
                        disabled={isGameActive}
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          {/* Live Rankings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-effect rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-ubuntu-orange" />
              Live Rankings
            </h2>

            {sortedTeams.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No teams to rank yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedTeams.map((team, index) => (
                  <div
                    key={index}
                    className={`bg-white/5 rounded-xl p-4 ${
                      index === 0 ? 'ring-2 ring-ubuntu-orange' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`text-2xl font-bold ${
                        index === 0 ? 'text-yellow-400' :
                        index === 1 ? 'text-gray-300' :
                        index === 2 ? 'text-orange-400' : 'text-gray-500'
                      }`}>
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{team.teamName}</div>
                        <div className="text-sm text-gray-400">
                          {formatCurrency(team.totalValue)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={handleCalculateResults}
              className="w-full mt-6 px-6 py-3 bg-ubuntu-orange hover:bg-ubuntu-dark-orange rounded-xl transition-all font-semibold flex items-center justify-center gap-2"
            >
              <Eye className="w-5 h-5" />
              View Full Results
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
