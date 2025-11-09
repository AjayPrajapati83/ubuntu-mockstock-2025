'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Lock, User, ArrowRight, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { validateAdminCredentials, getAdminName } from '@/lib/admin-auth'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate loading for better UX
    await new Promise(resolve => setTimeout(resolve, 800))

    if (validateAdminCredentials(username, password)) {
      const adminName = getAdminName(username)
      localStorage.setItem('adminAuth', 'true')
      localStorage.setItem('adminName', adminName || username)
      localStorage.setItem('adminUsername', username)
      router.push('/admin/dashboard')
    } else {
      setError('Invalid credentials. Please check your username and password.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen text-white flex items-center justify-center p-4">
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
          <div className="w-20 h-20 bg-ubuntu-orange rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-ubuntu-orange/50">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2">
            <span className="gradient-text">Admin</span> Access
          </h1>
          <p className="text-gray-400">Mock Stock Ubuntu 2025</p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-effect rounded-3xl p-8"
        >
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ubuntu-orange transition-all"
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ubuntu-orange transition-all"
                  required
                />
              </div>
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
              className="w-full px-6 py-4 bg-ubuntu-orange hover:bg-ubuntu-dark-orange disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl transition-all font-semibold text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-2xl hover:shadow-ubuntu-orange/50"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Authorized Users */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-gray-400 text-center mb-3">Authorized Admins</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Ajay', 'Pratham', 'Shree'].map((name) => (
                <span
                  key={name}
                  className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-300"
                >
                  {name}
                </span>
              ))}
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
