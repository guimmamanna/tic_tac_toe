'use client'

import { motion } from 'framer-motion'
import { X, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Board, Player } from '../../shared/types/game'

interface GameBoardProps {
  board: Board
  onCellClick: (index: number) => void
  disabled?: boolean
  winningLine?: number[]
  currentPlayer?: Player
}

export function GameBoard({
  board,
  onCellClick,
  disabled = false,
  winningLine = [],
  currentPlayer
}: GameBoardProps) {
  return (
    <div className="w-full max-w-[500px] mx-auto">
      <div className="grid grid-cols-3 gap-3 p-4 bg-cyberpunk-dark/50 rounded-2xl border border-cyberpunk-primary/20">
        {board.map((cell, index) => (
          <Cell
            key={index}
            value={cell}
            onClick={() => onCellClick(index)}
            disabled={disabled || cell !== ''}
            isWinning={winningLine.includes(index)}
            index={index}
          />
        ))}
      </div>

      {currentPlayer && !disabled && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-6 text-xl font-orbitron"
        >
          <span className="text-gray-400">Current turn: </span>
          <span className={cn(
            "font-bold",
            currentPlayer === 'X' ? 'text-cyberpunk-primary' : 'text-cyberpunk-secondary'
          )}>
            Player {currentPlayer}
          </span>
        </motion.div>
      )}
    </div>
  )
}

interface CellProps {
  value: string
  onClick: () => void
  disabled: boolean
  isWinning: boolean
  index: number
}

function Cell({ value, onClick, disabled, isWinning }: CellProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      className={cn(
        "aspect-square rounded-xl flex items-center justify-center",
        "border-2 transition-all duration-300",
        "bg-gradient-to-br from-cyberpunk-dark to-cyberpunk-dark/80",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:border-cyberpunk-primary",
        isWinning
          ? "border-cyberpunk-accent shadow-lg shadow-cyberpunk-accent/50 animate-pulse-glow"
          : "border-gray-700",
        !value && !disabled && "hover:bg-cyberpunk-primary/5"
      )}
    >
      {value === 'X' && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <X className="w-16 h-16 text-cyberpunk-primary" strokeWidth={3} />
        </motion.div>
      )}

      {value === 'O' && (
        <motion.div
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <Circle className="w-16 h-16 text-cyberpunk-secondary" strokeWidth={3} />
        </motion.div>
      )}
    </motion.button>
  )
}
