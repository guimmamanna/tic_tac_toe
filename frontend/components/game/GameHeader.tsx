'use client'

import { motion } from 'framer-motion'
import { Trophy, Star, Zap } from 'lucide-react'

interface GameHeaderProps {
  player1Name: string
  player2Name: string
  player1Score?: number
  player2Score?: number
  currentTurn?: 'X' | 'O'
}

export function GameHeader({
  player1Name,
  player2Name,
  player1Score = 0,
  player2Score = 0,
  currentTurn
}: GameHeaderProps) {
  return (
    <div className="w-full max-w-[500px] mx-auto mb-6">
      <div className="grid grid-cols-2 gap-4">
        {/* Player 1 */}
        <motion.div
          className={`glass p-4 rounded-xl transition-all duration-300 ${
            currentTurn === 'X' ? 'border-2 border-cyberpunk-primary shadow-lg shadow-cyberpunk-primary/30' : ''
          }`}
          animate={currentTurn === 'X' ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Player X</div>
              <div className="text-xl font-bold text-cyberpunk-primary">{player1Name}</div>
            </div>
            <div className="text-3xl font-bold">{player1Score}</div>
          </div>
          {currentTurn === 'X' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-xs text-cyberpunk-primary flex items-center gap-1"
            >
              <Zap className="w-3 h-3" />
              Your turn
            </motion.div>
          )}
        </motion.div>

        {/* Player 2 */}
        <motion.div
          className={`glass p-4 rounded-xl transition-all duration-300 ${
            currentTurn === 'O' ? 'border-2 border-cyberpunk-secondary shadow-lg shadow-cyberpunk-secondary/30' : ''
          }`}
          animate={currentTurn === 'O' ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Player O</div>
              <div className="text-xl font-bold text-cyberpunk-secondary">{player2Name}</div>
            </div>
            <div className="text-3xl font-bold">{player2Score}</div>
          </div>
          {currentTurn === 'O' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-xs text-cyberpunk-secondary flex items-center gap-1"
            >
              <Zap className="w-3 h-3" />
              Opponent&apos;s turn
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
