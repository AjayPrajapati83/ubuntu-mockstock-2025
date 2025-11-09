'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Newspaper, Plus, RefreshCw, Trash2, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { decodeNewsHint, type NewsItem } from '@/lib/news-generator'

export default function AdminNewsPage() {
  const router = useRouter()
  const [news, setNews] = useState<NewsItem[]>([])
  const [showHints, setShowHints] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    // Check admin authentication
    const isAuth = localStorage.getItem('adminAuth')
    if (!isAuth) {
      router.push('/admin/login')
      return
    }
    
    fetchNews()
  }, [router])

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news?includeImpact=true&limit=20')
      if (response.ok) {
        const data = await response.json()
        setNews(data)
      }
    } catch (error) {
      console.error('Failed to fetch news:', error)
    }
  }

  const generateNews = async (count: number = 3) => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate', count })
      })
      
      if (response.ok) {
        const data = await response.json()
        alert(`Generated ${data.news.length} news items!`)
        fetchNews()
      }
    } catch (error) {
      console.error('Failed to generate news:', error)
      alert('Failed to generate news')
    } finally {
      setIsGenerating(false)
    }
  }

  const clearAllNews = async () => {
    if (!confirm('Are you sure you want to clear all news?')) return
    
    try {
      const response = await fetch('/api/news', { method: 'DELETE' })
      if (response.ok) {
        alert('All news cleared')
        fetchNews()
      }
    } catch (error) {
      console.error('Failed to clear news:', error)
    }
  }

  return (
    <div className="min-h-screen text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-ubuntu-aubergine/95 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 bg-ubuntu-orange rounded-lg flex items-center justify-center">
                <Newspaper className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">News Management</h1>
                <p className="text-sm text-gray-400">Generate and manage market news</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowHints(!showHints)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
            >
              {showHints ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showHints ? 'Hide' : 'Show'} Hints
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Controls */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <button
            onClick={() => generateNews(1)}
            disabled={isGenerating}
            className="px-6 py-4 bg-ubuntu-orange hover:bg-ubuntu-dark-orange rounded-xl transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
            Generate 1 News
          </button>
          
          <button
            onClick={() => generateNews(3)}
            disabled={isGenerating}
            className="px-6 py-4 bg-green-600 hover:bg-green-700 rounded-xl transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
            Generate 3 News
          </button>
          
          <button
            onClick={() => generateNews(5)}
            disabled={isGenerating}
            className="px-6 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
            Generate 5 News
          </button>
          
          <button
            onClick={clearAllNews}
            className="px-6 py-4 bg-red-600 hover:bg-red-700 rounded-xl transition-all font-semibold flex items-center justify-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            Clear All
          </button>
        </div>

        {/* News Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-2xl p-6"
        >
          <h2 className="text-2xl font-bold mb-6">Current News Feed</h2>
          
          {news.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Newspaper className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No news items yet. Generate some news to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {news.map((item) => (
                <div key={item.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-start gap-3">
                    <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                      item.impact === 'positive' ? 'bg-green-500' :
                      item.impact === 'negative' ? 'bg-red-500' :
                      'bg-gray-500'
                    }`} />
                    
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-400 mb-2">{item.content}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                        {item.affectedStocks.length > 0 && (
                          <span className="px-2 py-1 bg-white/10 rounded">
                            Affects: {item.affectedStocks.join(', ')}
                          </span>
                        )}
                      </div>
                      
                      {showHints && (
                        <div className="mt-3 p-3 bg-ubuntu-orange/20 rounded-lg border border-ubuntu-orange/30">
                          <p className="text-sm font-mono">{decodeNewsHint(item)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 glass-effect rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold mb-3">How It Works</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• <strong>Generate News:</strong> Creates realistic market news with cryptic hints about stock movements</li>
            <li>• <strong>Cryptic Hints:</strong> News doesn't directly say "buy" or "sell" - participants must read between the lines</li>
            <li>• <strong>Price Impact:</strong> News gradually affects stock prices over time (not instant)</li>
            <li>• <strong>Show Hints:</strong> Toggle to see the decoded trading recommendations (admin only)</li>
            <li>• <strong>Strategic Gameplay:</strong> Smart participants who analyze news carefully will make better trades</li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}
