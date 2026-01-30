// Shared types for user data

export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  bio?: string
  level: number
  xp: number
  eloRating: number
  createdAt: string
}

export interface UserStats {
  totalGames: number
  wins: number
  losses: number
  draws: number
  currentStreak: number
  bestStreak: number
  totalPlayTime: number
  classicModeWins: number
  speedModeWins: number
  ultimateModeWins: number
  powerUpModeWins: number
}

export interface Achievement {
  id: string
  type: AchievementType
  unlockedAt: string
}

export type AchievementType =
  | 'FIRST_WIN'
  | 'PERFECT_WEEK'
  | 'SPEED_DEMON'
  | 'ULTIMATE_MASTER'
  | 'SOCIAL_BUTTERFLY'
  | 'VETERAN'
  | 'CENTURION'
  | 'UNSTOPPABLE'
  | 'PERFECTIONIST'
  | 'COMEBACK_KING'

export interface AchievementMetadata {
  type: AchievementType
  name: string
  description: string
  icon: string
  requirement: string
}

export const ACHIEVEMENTS: Record<AchievementType, AchievementMetadata> = {
  FIRST_WIN: {
    type: 'FIRST_WIN',
    name: 'First Victory',
    description: 'Win your first game',
    icon: '🏆',
    requirement: 'Win 1 game',
  },
  PERFECT_WEEK: {
    type: 'PERFECT_WEEK',
    name: 'Perfect Week',
    description: 'Win 7 games in a row',
    icon: '📅',
    requirement: 'Win streak of 7',
  },
  SPEED_DEMON: {
    type: 'SPEED_DEMON',
    name: 'Speed Demon',
    description: 'Master of speed mode',
    icon: '⚡',
    requirement: 'Win 10 speed mode games',
  },
  ULTIMATE_MASTER: {
    type: 'ULTIMATE_MASTER',
    name: 'Ultimate Master',
    description: 'Conquer ultimate tic-tac-toe',
    icon: '🎯',
    requirement: 'Win 5 ultimate mode games',
  },
  SOCIAL_BUTTERFLY: {
    type: 'SOCIAL_BUTTERFLY',
    name: 'Social Butterfly',
    description: 'Make lots of friends',
    icon: '🦋',
    requirement: 'Add 10 friends',
  },
  VETERAN: {
    type: 'VETERAN',
    name: 'Veteran',
    description: 'A seasoned player',
    icon: '⭐',
    requirement: 'Play 100 games',
  },
  CENTURION: {
    type: 'CENTURION',
    name: 'Centurion',
    description: 'A hundred victories',
    icon: '💯',
    requirement: 'Win 100 games',
  },
  UNSTOPPABLE: {
    type: 'UNSTOPPABLE',
    name: 'Unstoppable',
    description: 'Incredible win streak',
    icon: '🔥',
    requirement: 'Win streak of 20',
  },
  PERFECTIONIST: {
    type: 'PERFECTIONIST',
    name: 'Perfectionist',
    description: 'Flawless record',
    icon: '✨',
    requirement: 'Win 50 games with 90%+ win rate',
  },
  COMEBACK_KING: {
    type: 'COMEBACK_KING',
    name: 'Comeback King',
    description: 'Recover from a losing streak',
    icon: '👑',
    requirement: 'Win 5 games after losing 5',
  },
}

export interface Friend {
  id: string
  userId: string
  username: string
  avatar?: string
  status: 'PENDING' | 'ACCEPTED' | 'BLOCKED'
  createdAt: string
}

export interface LeaderboardEntry {
  rank: number
  userId: string
  username: string
  avatar?: string
  eloRating: number
  wins: number
  totalGames: number
  winRate: number
}
