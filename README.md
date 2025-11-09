# 🎯 Mock Stock - Ubuntu 2025

A modern, animated stock trading competition game built with Next.js 15, featuring blind trading mechanics and dramatic leaderboard reveals.

## ✨ Features

- **🎨 Modern UI**: Beautiful animations with Framer Motion
- **📱 Fully Responsive**: Optimized for mobile and desktop
- **🎭 Blind Trading**: Participants can't see others' performance during the game
- **🏆 Grand Reveal**: Dramatic leaderboard animation at the end
- **⚡ Real-time Updates**: Live stock prices and news feed
- **🎯 Ubuntu Themed**: Custom color scheme matching Ubuntu branding

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
MockStock/
├── app/
│   ├── page.tsx              # Landing page
│   ├── dashboard/
│   │   └── page.tsx          # Trading dashboard (blind mode)
│   ├── results/
│   │   └── page.tsx          # Results reveal page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── lib/
│   ├── types.ts              # TypeScript types
│   └── utils.ts              # Utility functions
├── public/                   # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🎮 Game Flow

### 1. Landing Page
- Event branding and rules
- Team name registration
- "Start Trading" CTA

### 2. Participant Dashboard (Blind Trading)
- **Your Portfolio**: Private view of your holdings
- **Cash Balance**: Available funds for trading
- **Live Market**: Real-time stock prices with news
- **Trading Interface**: Buy/Sell stocks
- **NO Leaderboard**: Complete information blackout

### 3. Trading Rounds
- Multiple rounds with news events
- Stock prices update based on news
- Pure strategy-based decisions
- No visibility of other participants

### 4. Results Calculation
- Server-side processing
- Calculate final portfolio values
- Sort by performance
- Generate rankings

### 5. Grand Reveal
- Animated loading screen
- "Ready to Reveal" moment
- Dramatic leaderboard animation
- Podium view for top 3
- Personal rank highlight
- Shareable results

## 🎨 Design Features

### Color Scheme
- **Ubuntu Orange**: `#E95420` - Primary actions
- **Ubuntu Purple**: `#772953` - Accents
- **Ubuntu Aubergine**: `#2C001E` - Background

### Animations
- Smooth page transitions
- Hover effects on cards
- Loading states
- Confetti celebration
- Scale and fade animations

### Components
- Glass-morphism effects
- Gradient text
- Responsive grid layouts
- Modal dialogs
- Toast notifications

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for configuration:

```env
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_GAME_DURATION=300000
```

### Game Settings
Modify game parameters in the dashboard:

```typescript
const gameState = {
  isActive: true,
  currentRound: 1,
  totalRounds: 5,
  roundEndTime: new Date(Date.now() + 5 * 60 * 1000),
  resultsPublished: false
}
```

## 📱 Mobile Optimization

- Touch-friendly buttons
- Responsive typography
- Optimized animations
- Smooth scrolling
- Mobile-first design

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Import your repository
   - Deploy automatically

### Build for Production

```bash
npm run build
npm start
```

## 🎯 Game Rules

1. Each team starts with **₹1,00,000** virtual cash
2. Trade stocks based on real-time news and market updates
3. **No visibility** of other teams' performance during the game
4. Final rankings revealed only after game completion
5. Team with **highest portfolio value** wins

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📊 API Routes (To Be Implemented)

```typescript
// Example API structure
/api/game/start        // Start a new game
/api/game/state        // Get current game state
/api/stocks/prices     // Get stock prices
/api/stocks/news       // Get market news
/api/trade/buy         // Execute buy order
/api/trade/sell        // Execute sell order
/api/leaderboard       // Get final rankings
```

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [TypeScript](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

This is a college fest project. For contributions:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is created for Ubuntu 2025 College Fest.

## 🎉 Credits

- **Event**: Ubuntu 2025 College Fest
- **Design**: Ubuntu Brand Guidelines
- **Icons**: Lucide React
- **Animations**: Framer Motion

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Contact the organizing team

---

**Made with ❤️ for Ubuntu 2025**
