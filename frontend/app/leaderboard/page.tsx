'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Medal, Award, Home, TrendingUp, Crown } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface LeaderboardEntry {
  rank: number
  username: string
  avatar?: string
  eloRating: number
  wins: number
  totalGames: number
  winRate: number
}

export default function LeaderboardPage() {
  const router = useRouter()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for demo
    const mockData: LeaderboardEntry[] = [
      { rank: 1, username: 'ProGamer', eloRating: 2150, wins: 156, totalGames: 180, winRate: 86.7 },
      { rank: 2, username: 'TicTacMaster', eloRating: 2080, wins: 143, totalGames: 170, winRate: 84.1 },
      { rank: 3, username: 'StrategyKing', eloRating: 2050, wins: 138, totalGames: 165, winRate: 83.6 },
      { rank: 4, username: 'QuickWin', eloRating: 1980, wins: 125, totalGames: 155, winRate: 80.6 },
      { rank: 5, username: 'NeonPlayer', eloRating: 1920, wins: 118, totalGames: 150, winRate: 78.7 },
      { rank: 6, username: 'CyberChamp', eloRating: 1880, wins: 110, totalGames: 145, winRate: 75.9 },
      { rank: 7, username: 'TacticalMove', eloRating: 1850, wins: 105, totalGames: 140, winRate: 75.0 },
      { rank: 8, username: 'BoardGenius', eloRating: 1820, wins: 98, totalGames: 135, winRate: 72.6 },
      { rank: 9, username: 'SwiftVictory', eloRating: 1790, wins: 92, totalGames: 130, winRate: 70.8 },
      { rank: 10, username: 'GridMaster', eloRating: 1760, wins: 88, totalGames: 125, winRate: 70.4 },
    ]

    setTimeout(() => {
      setLeaderboard(mockData)
      setLoading(false)
    }, 500)
  }, [])

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-300" />
    if (rank === 3) return <Award className="w-6 h-6 text-orange-400" />
    return <span className="text-lg font-bold text-gray-400">#{rank}</span>
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'border-yellow-400/50 bg-yellow-400/5'
    if (rank === 2) return 'border-gray-300/50 bg-gray-300/5'
    if (rank === 3) return 'border-orange-400/50 bg-orange-400/5'
    return 'border-gray-700'
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyberpunk-primary to-cyberpunk-accent">
              Global Leaderboard
            </h1>
            <p className="text-gray-400">Top players worldwide</p>
          </div>

          <button
            onClick={() => router.push('/')}
            className="btn-outline flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            Home
          </button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyberpunk-primary to-teal-400 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-cyberpunk-dark" />
              </div>
              <div>
                <div className="text-2xl font-bold">10,234</div>
                <div className="text-sm text-gray-400">Total Players</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyberpunk-secondary to-pink-500 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">52,891</div>
                <div className="text-sm text-gray-400">Games Played</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyberpunk-accent to-yellow-500 flex items-center justify-center">
                <Crown className="w-6 h-6 text-cyberpunk-dark" />
              </div>
              <div>
                <div className="text-2xl font-bold">2,150</div>
                <div className="text-sm text-gray-400">Top ELO Rating</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-cyberpunk-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading leaderboard...</p>
            </div>
          ) : (
            leaderboard.map((entry, index) => (
              <motion.div
                key={entry.rank}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`glass p-4 rounded-xl border-2 ${getRankColor(entry.rank)} hover:border-cyberpunk-primary/50 transition-all duration-300`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="flex-shrink-0 w-12 flex items-center justify-center">
                    {getRankIcon(entry.rank)}
                  </div>

                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyberpunk-primary to-cyberpunk-secondary flex items-center justify-center text-xl font-bold">
                      {entry.username[0]}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="font-bold text-lg">{entry.username}</div>
                    <div className="text-sm text-gray-400">
                      {entry.wins} wins • {entry.totalGames} games • {entry.winRate.toFixed(1)}% win rate
                    </div>
                  </div>

                  {/* ELO */}
                  <div className="text-right">
                    <div className="text-2xl font-bold text-cyberpunk-primary">{entry.eloRating}</div>
                    <div className="text-xs text-gray-400">ELO</div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  )
}
