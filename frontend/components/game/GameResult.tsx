'use client'

import { motion } from 'framer-motion'
import { Trophy, Home, RotateCcw, X as XIcon } from 'lucide-react'
import type { Player } from '../../shared/types/game'

interface GameResultProps {
  winner: Player | 'draw'
  onRestart: () => void
  onHome: () => void
}

export function GameResult({ winner, onRestart, onHome }: GameResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="glass p-8 rounded-2xl max-w-md w-full text-center border-2 border-cyberpunk-primary/30"
      >
        {winner === 'draw' ? (
          <>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 3 }}
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center"
            >
              <XIcon className="w-12 h-12 text-gray-300" />
            </motion.div>

            <h2 className="text-4xl font-bold mb-2">It&apos;s a Draw!</h2>
            <p className="text-gray-400 mb-8">Well played by both sides</p>
          </>
        ) : (
          <>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 1, ease: 'easeInOut' }}
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyberpunk-primary to-teal-400 flex items-center justify-center"
            >
              <Trophy className="w-12 h-12 text-cyberpunk-dark" />
            </motion.div>

            <motion.h2
              className="text-5xl font-bold mb-2"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: 2 }}
            >
              Player {winner} Wins!
            </motion.h2>

            <p className="text-gray-400 mb-8">Congratulations on your victory!</p>
          </>
        )}

        <div className="flex gap-4">
          <button onClick={onRestart} className="btn-primary flex-1 flex items-center justify-center gap-2">
            <RotateCcw className="w-5 h-5" />
            Play Again
          </button>

          <button onClick={onHome} className="btn-outline flex-1 flex items-center justify-center gap-2">
            <Home className="w-5 h-5" />
            Home
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
