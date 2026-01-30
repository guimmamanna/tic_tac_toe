'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Home, User, Trophy, Star, Zap, Award,
  TrendingUp, Calendar, Clock, Target
} from 'lucide-react'
import { ACHIEVEMENTS } from '../../shared/types/user'

export default function ProfilePage() {
  const router = useRouter()

  // Mock user data
  const user = {
    id: 'user-1',
    username: 'EpicGamer',
    email: 'gamer@example.com',
    avatar: undefined,
    level: 12,
    xp: 4500,
    xpForNextLevel: 5000,
    eloRating: 1850,
  }

  const stats = {
    totalGames: 145,
    wins: 98,
    losses: 39,
    draws: 8,
    winRate: 67.6,
    currentStreak: 5,
    bestStreak: 12,
    totalPlayTime: 18000, // seconds
    classicModeWins: 56,
    speedModeWins: 25,
    ultimateModeWins: 12,
    powerUpModeWins: 5,
  }

  const unlockedAchievements = [
    'FIRST_WIN',
    'VETERAN',
    'SPEED_DEMON',
  ]

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyberpunk-primary to-cyberpunk-accent">
            Player Profile
          </h1>
          <button
            onClick={() => router.push('/')}
            className="btn-outline flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            Home
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="space-y-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyberpunk-primary to-cyberpunk-secondary flex items-center justify-center text-4xl font-bold mb-4">
                  {user.username[0]}
                </div>
                <h2 className="text-2xl font-bold mb-1">{user.username}</h2>
                <p className="text-gray-400 text-sm mb-4">{user.email}</p>

                {/* Level */}
                <div className="w-full bg-cyberpunk-dark rounded-full h-3 mb-2">
                  <div
                    className="bg-gradient-to-r from-cyberpunk-primary to-cyberpunk-accent h-3 rounded-full transition-all"
                    style={{ width: `${(user.xp / user.xpForNextLevel) * 100}%` }}
                  />
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-cyberpunk-accent" />
                  <span>Level {user.level}</span>
                  <span className="text-gray-400">({user.xp}/{user.xpForNextLevel} XP)</span>
                </div>
              </div>
            </motion.div>

            {/* ELO Rating */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-400 mb-1">ELO Rating</div>
                  <div className="text-4xl font-bold text-cyberpunk-primary">{user.eloRating}</div>
                </div>
                <TrendingUp className="w-12 h-12 text-cyberpunk-primary" />
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyberpunk-accent" />
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Win Rate</span>
                  <span className="font-bold text-cyberpunk-primary">{stats.winRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Current Streak</span>
                  <span className="font-bold">{stats.currentStreak} wins</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Best Streak</span>
                  <span className="font-bold text-cyberpunk-accent">{stats.bestStreak} wins</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Middle Column - Statistics */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-cyberpunk-primary" />
                Game Statistics
              </h3>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">{stats.wins}</div>
                  <div className="text-sm text-gray-400">Wins</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400">{stats.losses}</div>
                  <div className="text-sm text-gray-400">Losses</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">{stats.draws}</div>
                  <div className="text-sm text-gray-400">Draws</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Games</span>
                  <span className="font-bold">{stats.totalGames}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Play Time</span>
                  <span className="font-bold">{Math.floor(stats.totalPlayTime / 3600)}h {Math.floor((stats.totalPlayTime % 3600) / 60)}m</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-cyberpunk-secondary" />
                Mode Statistics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Classic Wins</span>
                  <span className="font-bold">{stats.classicModeWins}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Speed Wins</span>
                  <span className="font-bold">{stats.speedModeWins}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Ultimate Wins</span>
                  <span className="font-bold">{stats.ultimateModeWins}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Power-Up Wins</span>
                  <span className="font-bold">{stats.powerUpModeWins}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Achievements */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-cyberpunk-accent" />
                Achievements ({unlockedAchievements.length}/{Object.keys(ACHIEVEMENTS).length})
              </h3>

              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {Object.values(ACHIEVEMENTS).map((achievement) => {
                  const isUnlocked = unlockedAchievements.includes(achievement.type)

                  return (
                    <div
                      key={achievement.type}
                      className={`p-3 rounded-lg transition-all ${
                        isUnlocked
                          ? 'bg-cyberpunk-primary/10 border-2 border-cyberpunk-primary/30'
                          : 'bg-cyberpunk-dark/50 opacity-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <div className="font-bold">{achievement.name}</div>
                          <div className="text-sm text-gray-400">{achievement.description}</div>
                          <div className="text-xs text-gray-500 mt-1">{achievement.requirement}</div>
                        </div>
                        {isUnlocked && (
                          <div className="text-cyberpunk-primary">✓</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
