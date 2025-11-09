'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Medal, TrendingUp, Award, Sparkles, Download, Share2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { LeaderboardEntry } from '@/lib/types'

export default function ResultsPage() {
  const [isRevealed, setIsRevealed] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [teamName] = useState(typeof window !== 'undefined' ? localStorage.getItem('teamName') || '' : '')
  
  const [leaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, teamName: 'Alpha Traders', portfolioValue: 150000, profitLoss: 50000, profitLossPercent: 50 },
    { rank: 2, teamName: 'Beta Bulls', portfolioValue: 135000, profitLoss: 35000, profitLossPercent: 35 },
    { rank: 3, teamName: 'Gamma Gains', portfolioValue: 125000, profitLoss: 25000, profitLossPercent: 25 },
    { rank: 4, teamName: 'Delta Dealers', portfolioValue: 115000, profitLoss: 15000, profitLossPercent: 15 },
    { rank: 5, teamName: 'Epsilon Elite', portfolioValue: 110000, profitLoss: 10000, profitLossPercent: 10 },
  ])

  const myRank = leaderboard.findIndex(entry => entry.teamName === teamName) + 1

  useEffect(() => {
    // Simulate admin publishing results
    const timer = setTimeout(() => {
      setIsRevealed(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleReveal = () => {
    setShowLeaderboard(true)
  }

  const getPodiumPosition = (rank: number) => {
    if (rank === 1) return 'order-2 scale-110'
    if (rank === 2) return 'order-1 scale-100'
    if (rank === 3) return 'order-3 scale-95'
    return ''
  }

  const getMedalColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-400'
    if (rank === 2) return 'text-gray-300'
    if (rank === 3) return 'text-orange-400'
    return 'text-gray-500'
  }

  return (
    <div className="min-h-screen text-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {!isRevealed ? (
            // Loading State
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 border-4 border-ubuntu-orange border-t-transparent rounded-full mx-auto mb-6"
              />
              <h2 className="text-3xl font-bold mb-4">Calculating Results...</h2>
              <p className="text-gray-400">Please wait while we process all portfolios</p>
            </motion.div>
          ) : !showLeaderboard ? (
            // Ready to Reveal
            <motion.div
              key="ready"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-20"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-8"
              >
                <Trophy className="w-32 h-32 mx-auto text-ubuntu-orange" />
              </motion.div>
              <h2 className="text-5xl font-bold mb-6 gradient-text">
                Results Are Ready!
              </h2>
              <p className="text-2xl text-gray-300 mb-12">
                The moment of truth has arrived
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReveal}
                className="px-12 py-6 bg-ubuntu-orange hover:bg-ubuntu-dark-orange text-white text-2xl font-bold rounded-full shadow-2xl shadow-ubuntu-orange/50 transition-all"
              >
                <span className="flex items-center gap-3">
                  <Sparkles className="w-8 h-8" />
                  REVEAL LEADERBOARD
                  <Sparkles className="w-8 h-8" />
                </span>
              </motion.button>
            </motion.div>
          ) : (
            // Leaderboard Revealed
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Header */}
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-center mb-12"
              >
                <h1 className="text-5xl md:text-6xl font-bold mb-4">
                  <span className="gradient-text">Final Results</span>
                </h1>
                <p className="text-xl text-gray-300">Mock Stock Ubuntu 2025</p>
              </motion.div>

              {/* Your Rank Highlight */}
              {myRank > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="glass-effect rounded-3xl p-8 mb-12 border-2 border-ubuntu-orange"
                >
                  <div className="text-center">
                    <div className="text-6xl font-bold gradient-text mb-2">#{myRank}</div>
                    <div className="text-2xl font-semibold mb-2">Your Rank</div>
                    <div className="text-gray-400">
                      {leaderboard[myRank - 1]?.portfolioValue && 
                        `Portfolio Value: ${formatCurrency(leaderboard[myRank - 1].portfolioValue)}`
                      }
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Top 3 Podium */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-12"
              >
                <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center gap-3">
                  <Award className="w-8 h-8 text-ubuntu-orange" />
                  Top Performers
                </h2>
                
                <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto items-end">
                  {leaderboard.slice(0, 3).map((entry, index) => (
                    <motion.div
                      key={entry.rank}
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.7 + index * 0.2 }}
                      className={getPodiumPosition(entry.rank)}
                    >
                      <div className="glass-effect rounded-2xl p-6 text-center hover:scale-105 transition-transform">
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                          className="mb-4"
                        >
                          {entry.rank === 1 && <Trophy className="w-16 h-16 mx-auto text-yellow-400" />}
                          {entry.rank === 2 && <Medal className="w-14 h-14 mx-auto text-gray-300" />}
                          {entry.rank === 3 && <Medal className="w-12 h-12 mx-auto text-orange-400" />}
                        </motion.div>
                        
                        <div className={`text-5xl font-bold mb-2 ${getMedalColor(entry.rank)}`}>
                          #{entry.rank}
                        </div>
                        <div className="text-xl font-semibold mb-2">{entry.teamName}</div>
                        <div className="text-2xl font-bold text-ubuntu-orange mb-1">
                          {formatCurrency(entry.portfolioValue)}
                        </div>
                        <div className="text-sm text-green-400">
                          +{formatCurrency(entry.profitLoss)} ({entry.profitLossPercent}%)
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Full Leaderboard */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.3 }}
                className="glass-effect rounded-3xl p-8"
              >
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-ubuntu-orange" />
                  Complete Rankings
                </h2>

                <div className="space-y-3">
                  {leaderboard.map((entry, index) => (
                    <motion.div
                      key={entry.rank}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 1.5 + index * 0.1 }}
                      className={`bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-all ${
                        entry.teamName === teamName ? 'ring-2 ring-ubuntu-orange' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`text-3xl font-bold w-12 ${getMedalColor(entry.rank)}`}>
                            #{entry.rank}
                          </div>
                          <div>
                            <div className="text-xl font-semibold flex items-center gap-2">
                              {entry.teamName}
                              {entry.teamName === teamName && (
                                <span className="px-2 py-1 bg-ubuntu-orange rounded-full text-xs">You</span>
                              )}
                            </div>
                            <div className="text-sm text-gray-400">
                              Profit: {formatCurrency(entry.profitLoss)} ({entry.profitLossPercent}%)
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{formatCurrency(entry.portfolioValue)}</div>
                          <div className="text-sm text-gray-400">Portfolio Value</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Share Section */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 2 }}
                className="mt-12 text-center"
              >
                <div className="flex justify-center gap-4">
                  <button className="px-6 py-3 bg-ubuntu-orange hover:bg-ubuntu-dark-orange rounded-xl transition-all flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Download Certificate
                  </button>
                  <button className="px-6 py-3 glass-effect hover:bg-white/20 rounded-xl transition-all flex items-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Share Results
                  </button>
                </div>
              </motion.div>

              {/* Confetti Effect */}
              <div className="fixed inset-0 pointer-events-none">
                {[...Array(50)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: -100, x: Math.random() * window.innerWidth, opacity: 1 }}
                    animate={{ 
                      y: window.innerHeight + 100,
                      rotate: Math.random() * 360,
                      opacity: 0
                    }}
                    transition={{
                      duration: Math.random() * 3 + 2,
                      delay: Math.random() * 2,
                      repeat: Infinity
                    }}
                    className="absolute w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: ['#E95420', '#772953', '#FFD700', '#C0C0C0'][Math.floor(Math.random() * 4)]
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
