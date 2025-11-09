// Intelligent News Generator with Cryptic Stock Hints
// Generates realistic news that subtly hints at stock movements

export interface NewsItem {
  id: string
  timestamp: Date
  title: string
  content: string
  impact: 'positive' | 'negative' | 'neutral'
  affectedStocks: string[] // Stock symbols that will be affected
  priceImpact: number // Percentage change hint (-20 to +20)
}

interface StockInfo {
  symbol: string
  name: string
  sector: string
}

const stockDatabase: StockInfo[] = [
  { symbol: 'TECH', name: 'TechCorp', sector: 'Technology' },
  { symbol: 'BANK', name: 'BankCo', sector: 'Banking' },
  { symbol: 'AUTO', name: 'AutoInc', sector: 'Automobile' },
  { symbol: 'PHARM', name: 'PharmaCo', sector: 'Pharmaceutical' },
  { symbol: 'ENRG', name: 'EnergyCo', sector: 'Energy' },
]

// News templates with cryptic hints
const newsTemplates = {
  positive: [
    {
      title: "Breaking: {company} Announces Major Breakthrough",
      content: "Industry insiders report {company} has achieved a significant milestone in {sector} innovation. Market analysts are closely watching this development.",
      impact: 15
    },
    {
      title: "{sector} Sector Shows Promising Growth Indicators",
      content: "Recent data suggests companies in the {sector} sector, particularly {company}, are positioned for strong performance. Experts recommend monitoring this space.",
      impact: 12
    },
    {
      title: "Government Policy Boost for {sector} Industry",
      content: "New regulatory framework expected to benefit major players like {company}. Industry veterans predict positive momentum in coming sessions.",
      impact: 18
    },
    {
      title: "{company} Secures Strategic Partnership",
      content: "Unconfirmed reports suggest {company} is finalizing a major collaboration. {sector} sector watchers are optimistic about potential synergies.",
      impact: 14
    },
    {
      title: "Analyst Upgrade Rumors Swirl Around {sector} Stocks",
      content: "Market whispers indicate leading {sector} firms, including {company}, may see rating improvements. Smart money appears to be positioning accordingly.",
      impact: 10
    },
    {
      title: "{company} R&D Team Makes Unexpected Discovery",
      content: "Sources close to {company} hint at a breakthrough that could revolutionize the {sector} industry. Details remain under wraps but excitement is building.",
      impact: 16
    },
    {
      title: "Export Orders Surge for {sector} Manufacturers",
      content: "International demand for {sector} products is climbing. {company} reportedly receiving significant overseas interest, according to trade sources.",
      impact: 13
    },
    {
      title: "Institutional Investors Eye {sector} Opportunities",
      content: "Large funds are reportedly accumulating positions in select {sector} companies. {company} appears on multiple watchlists, per market intelligence.",
      impact: 11
    }
  ],
  negative: [
    {
      title: "Regulatory Concerns Cloud {sector} Outlook",
      content: "New compliance requirements may impact {sector} companies. {company} faces potential headwinds as industry adapts to changing landscape.",
      impact: -12
    },
    {
      title: "{company} Faces Supply Chain Disruptions",
      content: "Sources indicate {company} experiencing logistical challenges. {sector} sector analysts advising caution as situation develops.",
      impact: -15
    },
    {
      title: "Market Correction Hits {sector} Stocks Hard",
      content: "Profit-booking observed in {sector} segment. {company} among those seeing pressure as investors reassess valuations.",
      impact: -14
    },
    {
      title: "Competitive Pressure Mounts in {sector} Space",
      content: "New entrants disrupting traditional {sector} players. {company} may need to adjust strategy, warn industry observers.",
      impact: -10
    },
    {
      title: "{company} Quarterly Results Miss Expectations",
      content: "Preliminary indicators suggest {company} may report below consensus. {sector} sector sentiment turning cautious ahead of announcements.",
      impact: -16
    },
    {
      title: "Raw Material Costs Squeeze {sector} Margins",
      content: "Rising input prices affecting {sector} profitability. {company} particularly exposed to commodity price volatility, analysts note.",
      impact: -13
    },
    {
      title: "Labor Unrest Threatens {sector} Production",
      content: "Worker negotiations at major {sector} firms including {company} reaching critical stage. Operations could face disruptions if talks fail.",
      impact: -11
    },
    {
      title: "Foreign Exchange Headwinds Impact {company}",
      content: "Currency fluctuations creating challenges for export-heavy {sector} companies. {company}'s international revenue stream under pressure.",
      impact: -14
    }
  ],
  neutral: [
    {
      title: "{sector} Industry Awaits Policy Clarity",
      content: "{company} and peers in holding pattern as stakeholders await government decision. Market taking wait-and-see approach.",
      impact: 0
    },
    {
      title: "Mixed Signals from {sector} Sector",
      content: "Conflicting indicators make {company} outlook uncertain. Traders advised to monitor developments before taking positions.",
      impact: 0
    },
    {
      title: "{company} Maintains Steady Course",
      content: "No major catalysts on horizon for {sector} leader {company}. Analysts suggest patience as company executes existing strategy.",
      impact: 0
    }
  ],
  marketWide: [
    {
      title: "Global Markets Show Volatility",
      content: "International indices fluctuating on mixed economic data. Domestic stocks including major names across sectors experiencing choppy trading.",
      impact: 0
    },
    {
      title: "Investor Sentiment Remains Cautious",
      content: "Market participants adopting defensive stance amid uncertainty. Blue-chip stocks seeing selective interest from risk-averse traders.",
      impact: 0
    },
    {
      title: "Trading Volume Spikes Across Sectors",
      content: "Unusual activity observed in multiple segments. Analysts scrambling to identify catalysts behind sudden surge in market participation.",
      impact: 0
    }
  ]
}

/**
 * Generate a news item with cryptic hints about stock movements
 */
export function generateNewsWithHint(
  targetStock?: string,
  forceImpact?: 'positive' | 'negative' | 'neutral'
): NewsItem {
  // Select random stock if not specified
  const stock = targetStock 
    ? stockDatabase.find(s => s.symbol === targetStock) || stockDatabase[0]
    : stockDatabase[Math.floor(Math.random() * stockDatabase.length)]
  
  // Determine impact type
  let impactType: 'positive' | 'negative' | 'neutral'
  if (forceImpact) {
    impactType = forceImpact
  } else {
    const rand = Math.random()
    if (rand < 0.4) impactType = 'positive'
    else if (rand < 0.8) impactType = 'negative'
    else impactType = 'neutral'
  }
  
  // 20% chance of market-wide news (affects all stocks slightly)
  if (Math.random() < 0.2 && !targetStock) {
    const template = newsTemplates.marketWide[Math.floor(Math.random() * newsTemplates.marketWide.length)]
    return {
      id: `news_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      title: template.title,
      content: template.content,
      impact: 'neutral',
      affectedStocks: stockDatabase.map(s => s.symbol),
      priceImpact: Math.random() * 4 - 2 // -2% to +2%
    }
  }
  
  // Select template based on impact
  const templates = newsTemplates[impactType]
  const template = templates[Math.floor(Math.random() * templates.length)]
  
  // Replace placeholders
  const title = template.title
    .replace('{company}', stock.name)
    .replace('{sector}', stock.sector)
  
  const content = template.content
    .replace(/{company}/g, stock.name)
    .replace(/{sector}/g, stock.sector)
  
  // Add some randomness to impact
  const impactVariation = (Math.random() - 0.5) * 4 // ±2%
  const finalImpact = template.impact + impactVariation
  
  return {
    id: `news_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
    title,
    content,
    impact: impactType,
    affectedStocks: [stock.symbol],
    priceImpact: finalImpact
  }
}

/**
 * Generate multiple news items for a round
 */
export function generateNewsRound(count: number = 3): NewsItem[] {
  const news: NewsItem[] = []
  const usedStocks = new Set<string>()
  
  for (let i = 0; i < count; i++) {
    // Try to avoid repeating stocks in same round
    let stock: string | undefined
    let attempts = 0
    
    while (attempts < 10) {
      const randomStock = stockDatabase[Math.floor(Math.random() * stockDatabase.length)]
      if (!usedStocks.has(randomStock.symbol) || usedStocks.size === stockDatabase.length) {
        stock = randomStock.symbol
        usedStocks.add(stock)
        break
      }
      attempts++
    }
    
    // Add some delay between news items
    setTimeout(() => {}, i * 100)
    
    news.push(generateNewsWithHint(stock))
  }
  
  return news
}

/**
 * Get hint strength from news content
 * Returns a score from 0-10 indicating how strong the hint is
 */
export function getHintStrength(news: NewsItem): number {
  const keywords = {
    strong: ['breakthrough', 'major', 'significant', 'surge', 'soar', 'plunge', 'crash'],
    medium: ['growth', 'increase', 'decrease', 'pressure', 'boost', 'concern'],
    weak: ['may', 'could', 'suggest', 'indicate', 'hint', 'reportedly']
  }
  
  const content = (news.title + ' ' + news.content).toLowerCase()
  
  let score = 5 // Base score
  
  if (keywords.strong.some(word => content.includes(word))) score += 3
  if (keywords.medium.some(word => content.includes(word))) score += 2
  if (keywords.weak.some(word => content.includes(word))) score -= 1
  
  return Math.max(0, Math.min(10, score))
}

/**
 * Decode news to get trading recommendation (for testing/admin view)
 */
export function decodeNewsHint(news: NewsItem): string {
  const stock = news.affectedStocks[0]
  const strength = getHintStrength(news)
  
  if (news.impact === 'positive') {
    return `🟢 BUY ${stock} - Expected gain: ~${news.priceImpact.toFixed(1)}% (Hint strength: ${strength}/10)`
  } else if (news.impact === 'negative') {
    return `🔴 SELL ${stock} - Expected drop: ~${news.priceImpact.toFixed(1)}% (Hint strength: ${strength}/10)`
  } else {
    return `⚪ HOLD ${stock} - Neutral outlook (Hint strength: ${strength}/10)`
  }
}
