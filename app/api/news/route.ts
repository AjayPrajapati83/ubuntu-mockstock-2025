import { NextResponse } from 'next/server'
import { generateNewsWithHint, generateNewsRound, type NewsItem } from '@/lib/news-generator'

// News feed storage with price impact
const newsItems: NewsItem[] = []

// Initialize with some starting news
if (newsItems.length === 0) {
  const initialNews = generateNewsRound(3)
  newsItems.push(...initialNews)
}

// GET: Get news feed
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '10')
  const includeImpact = searchParams.get('includeImpact') === 'true' // For admin view
  
  // Return latest news items
  const latestNews = newsItems
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit)
  
  // Remove price impact data for participants (keep hints cryptic)
  if (!includeImpact) {
    return NextResponse.json(
      latestNews.map(({ priceImpact, ...news }) => news)
    )
  }
  
  return NextResponse.json(latestNews)
}

// POST: Generate new news (can be triggered by admin or automatically)
export async function POST(request: Request) {
  const body = await request.json()
  const { action, targetStock, impact, count } = body
  
  if (action === 'generate') {
    // Generate new news items
    const newNews = count 
      ? generateNewsRound(count)
      : [generateNewsWithHint(targetStock, impact)]
    
    newsItems.unshift(...newNews)
    
    // Keep only last 50 news items
    if (newsItems.length > 50) {
      newsItems.splice(50)
    }
    
    return NextResponse.json({ 
      success: true, 
      news: newNews,
      message: `Generated ${newNews.length} news item(s)`
    })
  }
  
  // Manual news creation (admin)
  const { title, content, impact: manualImpact, affectedStocks, priceImpact } = body
  
  if (!title || !content) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  
  const newsItem: NewsItem = {
    id: `news_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
    title,
    content,
    impact: manualImpact || 'neutral',
    affectedStocks: affectedStocks || [],
    priceImpact: priceImpact || 0
  }
  
  newsItems.unshift(newsItem)
  
  return NextResponse.json(newsItem)
}

// DELETE: Clear all news (admin only)
export async function DELETE() {
  newsItems.length = 0
  return NextResponse.json({ success: true, message: 'All news cleared' })
}
