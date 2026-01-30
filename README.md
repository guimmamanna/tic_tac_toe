# Epic Tic-Tac-Toe 🎮

A modern, feature-rich online multiplayer tic-tac-toe game with stunning visuals, multiple game modes, and competitive features.

## ✨ Features

### 🎮 Game Modes
- **Classic Mode** - Traditional 3x3 tic-tac-toe
- **Speed Mode** - Race against the clock with 10-second turns
- **Ultimate Tic-Tac-Toe** - 3x3 grid of tic-tac-toe boards
- **Power-Up Mode** - Use special abilities to gain an advantage
- **AI Mode** - Practice against intelligent bot opponents

### 👥 Multiplayer
- **Private Rooms** - Create and share room codes with friends
- **Quick Match** - Auto-matchmaking with players of similar skill
- **Real-time Sync** - Instant move updates via WebSockets
- **Reconnection** - Automatically rejoin if disconnected
- **Spectator Mode** - Watch ongoing games
- **Tournament Mode** - Competitive bracket-style competitions

### 🎨 User Experience
- **Stunning Animations** - Smooth transitions and effects using Framer Motion
- **Confetti Celebrations** - Victory effects that feel rewarding
- **Multiple Themes** - Cyberpunk Neon, Dark Minimal, Light Pastel, Retro Arcade, and more
- **Sound System** - Immersive audio with volume controls
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **PWA Support** - Install as a progressive web app

### 📊 Progression & Stats
- **ELO Rating System** - Competitive skill-based ranking
- **Global Leaderboard** - Compete with players worldwide
- **Detailed Statistics** - Track wins, losses, streaks, and more
- **Achievement System** - Unlock 30+ unique achievements
- **Level & XP System** - Progress and unlock rewards
- **Game Replays** - Watch and analyze past matches

### 💬 Social Features
- **Friend System** - Add friends and invite them to games
- **In-Game Chat** - Communicate during matches
- **Emoji Reactions** - Quick emotional responses
- **User Profiles** - Customizable avatars and bios
- **Friend Leaderboards** - Compare stats with friends

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Real-time**: Socket.io Client
- **UI Components**: Radix UI
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Real-time**: Socket.io
- **Database**: PostgreSQL 16
- **ORM**: Prisma
- **Cache**: Redis 7
- **Authentication**: JWT

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL (production-ready)
- **Cache/Sessions**: Redis
- **Version Control**: Git

## 📁 Project Structure

```
tic-tac-toe/
├── frontend/                 # Next.js application
│   ├── app/                  # Next.js 14 app router
│   ├── components/          # React components
│   ├── lib/                # Utilities and helpers
│   ├── hooks/              # Custom React hooks
│   ├── store/              # Zustand stores
│   └── public/             # Static assets
├── backend/                 # Node.js server
│   ├── src/                # Source code
│   └── prisma/             # Database schema
├── shared/                  # Shared types
└── docker-compose.yml      # Database services
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ and npm
- Docker and Docker Compose
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd tic_tac_toe
```

2. **Start database services**
```bash
docker-compose up -d
```

3. **Set up backend**
```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate dev
npx prisma generate
```

4. **Set up frontend**
```bash
cd ../frontend
npm install
```

### Running the Application

1. **Start backend** (in `backend` directory):
```bash
npm run dev
```
Backend runs on `http://localhost:3001`

2. **Start frontend** (in `frontend` directory):
```bash
npm run dev
```
Frontend runs on `http://localhost:3000`

3. **Open browser** at `http://localhost:3000`

## 🎮 How to Play

- **Quick Match**: Click "Quick Match" for instant matchmaking
- **Private Room**: Create a room and share the code with friends
- **VS AI**: Practice against computer opponents with adjustable difficulty

## 🏆 Achievements

Unlock achievements by completing challenges:
- 🏆 First Victory - Win your first game
- 📅 Perfect Week - Win 7 games in a row
- ⚡ Speed Demon - Win 10 speed mode games
- 🎯 Ultimate Master - Win 5 ultimate mode games
- And 25+ more!

## 🎨 Themes

Choose from 8 beautiful themes:
- **Cyberpunk Neon** - Futuristic with neon accents (default)
- **Dark Minimal** - Clean and professional
- **Light Pastel** - Soft and friendly
- **Retro Arcade** - Nostalgic gaming vibes
- **Nature** - Calm and earthy
- **Ocean Blue** - Deep sea vibes
- **Sunset** - Warm and vibrant
- **Matrix** - Classic hacker aesthetic

Click the theme button in the nav to switch!

## 🚀 Deployment

Ready to deploy to production! See [DEPLOYMENT.md](DEPLOYMENT.md) for complete guide.

### Quick Deploy to Vercel

1. Push to GitHub
2. Import to Vercel
3. Set environment variables
4. Deploy!

Frontend deploys automatically. Backend can be deployed to Render/Railway/Heroku.

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License

## 🙏 Acknowledgments

- Original Streamlit version for inspiration
- Next.js, Socket.io, and Prisma teams
- All contributors and players!

---

**Built with ❤️ using Next.js, React, and Socket.io**
