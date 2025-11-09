'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, Trophy, Clock, Zap, Target, ArrowRight, Sparkles, Shield, UserCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter()
  const [showEntryModal, setShowEntryModal] = useState(false)

  const handleGetStarted = () => {
    setShowEntryModal(true)
  }

  const handleAdminAccess = () => {
    router.push('/admin/login')
  }

  const handleParticipantAccess = () => {
    router.push('/participant/join')
  }

  const features = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Real-Time Trading',
      description: 'Experience live market dynamics with news-driven price movements'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Blind Competition',
      description: 'Trade based on strategy, not by following others'
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: 'Grand Reveal',
      description: 'Dramatic leaderboard reveal at the end'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Multiple Rounds',
      description: 'Strategic trading across multiple market rounds'
    }
  ]

  const rules = [
    'Each team starts with ₹1,00,000 virtual cash',
    'Trade stocks based on real-time news and market updates',
    'No visibility of other teams\' performance during the game',
    'Final rankings revealed only after game completion',
    'Team with highest portfolio value wins'
  ]

  return (
    <div className="min-h-screen text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-ubuntu-aubergine via-ubuntu-purple to-ubuntu-aubergine"></div>
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-ubuntu-orange/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
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

      {/* Hero Section */}
      <section className="relative px-4 py-20 md:py-32">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-ubuntu-orange/20 rounded-full border border-ubuntu-orange/30 mb-6">
              <Sparkles className="w-4 h-4 text-ubuntu-orange" />
              <span className="text-sm font-medium">Ubuntu 2025 College Fest</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="gradient-text">Mock Stock</span>
            <br />
            <span className="text-white">Trading Challenge</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
          >
            Trade stocks, make strategic decisions, and compete for the top spot in the ultimate blind trading competition
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <button
              onClick={handleGetStarted}
              className="group relative px-8 py-4 bg-ubuntu-orange hover:bg-ubuntu-dark-orange text-white text-lg font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-ubuntu-orange/50 transform hover:scale-105"
            >
              <span className="flex items-center gap-2">
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto"
          >
            {[
              { label: 'Starting Cash', value: '₹1L' },
              { label: 'Trading Rounds', value: '5+' },
              { label: 'Live Stocks', value: '10+' },
              { label: 'Prize Pool', value: 'TBA' }
            ].map((stat, index) => (
              <div key={index} className="glass-effect rounded-2xl p-6">
                <div className="text-3xl md:text-4xl font-bold text-ubuntu-orange mb-2">{stat.value}</div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why <span className="gradient-text">Mock Stock?</span>
            </h2>
            <p className="text-xl text-gray-300">Experience the thrill of stock trading with a competitive twist</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-effect rounded-2xl p-6 card-hover"
              >
                <div className="w-16 h-16 bg-ubuntu-orange/20 rounded-xl flex items-center justify-center mb-4 text-ubuntu-orange">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Join & Trade',
                description: 'Enter your team name and start trading with ₹1,00,000 virtual cash',
                icon: <Zap className="w-8 h-8" />
              },
              {
                step: '02',
                title: 'Blind Competition',
                description: 'Make strategic decisions based on news without seeing others\' performance',
                icon: <Target className="w-8 h-8" />
              },
              {
                step: '03',
                title: 'Grand Reveal',
                description: 'After game ends, witness the dramatic leaderboard reveal and celebrate winners',
                icon: <Trophy className="w-8 h-8" />
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                <div className="glass-effect rounded-2xl p-8">
                  <div className="text-6xl font-bold text-ubuntu-orange/20 mb-4">{item.step}</div>
                  <div className="w-16 h-16 bg-ubuntu-orange/20 rounded-xl flex items-center justify-center mb-4 text-ubuntu-orange">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-gray-300">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-ubuntu-orange/50" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Rules Section */}
      <section className="relative px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-effect rounded-3xl p-8 md:p-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              Game <span className="gradient-text">Rules</span>
            </h2>
            <div className="space-y-4">
              {rules.map((rule, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-8 h-8 bg-ubuntu-orange rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>
                  <p className="text-lg text-gray-200">{rule}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-effect rounded-3xl p-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to <span className="gradient-text">Dominate</span> the Market?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join the competition and prove your trading skills
            </p>
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-ubuntu-orange hover:bg-ubuntu-dark-orange text-white text-lg font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-ubuntu-orange/50 transform hover:scale-105"
            >
              Get Started Now
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-4 py-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p>© 2025 Ubuntu College Fest. All rights reserved.</p>
        </div>
      </footer>

      {/* Entry Selection Modal */}
      {showEntryModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowEntryModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="glass-effect rounded-3xl p-8 max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-4xl font-bold mb-3 text-center">
              Choose Your <span className="gradient-text">Access Type</span>
            </h3>
            <p className="text-gray-400 text-center mb-8">Select how you want to participate</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Admin Access */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAdminAccess}
                className="group relative overflow-hidden bg-gradient-to-br from-ubuntu-orange to-ubuntu-dark-orange rounded-2xl p-8 text-left transition-all hover:shadow-2xl hover:shadow-ubuntu-orange/50"
              >
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-2">Admin Panel</h4>
                  <p className="text-white/80 text-sm mb-4">
                    Manage game, create teams, control rounds, and view real-time rankings
                  </p>
                  <div className="flex items-center gap-2 text-white font-semibold">
                    Access Control Panel
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>

              {/* Participant Access */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleParticipantAccess}
                className="group relative overflow-hidden bg-gradient-to-br from-ubuntu-purple to-ubuntu-light-aubergine rounded-2xl p-8 text-left transition-all hover:shadow-2xl hover:shadow-ubuntu-purple/50"
              >
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                    <UserCircle className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-2">Participant</h4>
                  <p className="text-white/80 text-sm mb-4">
                    Join the competition, trade stocks, and compete for the top spot
                  </p>
                  <div className="flex items-center gap-2 text-white font-semibold">
                    Start Trading
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            </div>

            <button
              onClick={() => setShowEntryModal(false)}
              className="mt-6 w-full px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-center"
            >
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
