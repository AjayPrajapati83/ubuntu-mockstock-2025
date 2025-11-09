import { NextResponse } from 'next/server'

// News feed storage
const newsItems: Array<{
  id: string
  timestamp: Date
  title: string
  content: string
  impact: 'positive' | 'negative' | 'neutral'
  affectedStocks: string[]
}> = [
  {
    id: '1',
    timestamp: new Date(),
    title: 'Market Opens Strong',
    content: 'All sectors showing positive momentum',
    impact: 'positive',
    affectedStocks: []
  }
]

// GET: Get news feed
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '10')
  
  // Return latest news items
  return NextResponse.json(
    newsItems
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit)
  )
}

// POST: Add news item (admin only)
export async function POST(request: Request) {
  const body = await request.json()
  const { title, content, impact, affectedStocks } = body
  
  if (!title || !content) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  
  const newsItem = {
    id: `news_${Date.now()}`,
    timestamp: new Date(),
    title,
    content,
    impact: impact || 'neutral',
    affectedStocks: affectedStocks || []
  }
  
  newsItems.unshift(newsItem)
  
  return NextResponse.json(newsItem)
}
