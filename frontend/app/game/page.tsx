'use client'

import { Suspense, useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { GameBoard } from '@/components/game/GameBoard'
import { GameHeader } from '@/components/game/GameHeader'
import { GameResult } from '@/components/game/GameResult'
import { ChatBox } from '@/components/game/ChatBox'
import { initSocket, getSocket } from '@/lib/socket'
import { playSound } from '@/lib/utils'
import type { Board, Player, GameState } from '../../shared/types/game'
import { Home, Copy, Check } from 'lucide-react'
import toast from 'react-hot-toast'

function GameContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const mode = searchParams.get('mode') || 'ai'

  const [board, setBoard] = useState<Board>(Array(9).fill('') as Board)
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X')
  const [gameStatus, setGameStatus] = useState<'waiting' | 'playing' | 'finished'>('playing')
  const [winner, setWinner] = useState<Player | 'draw' | null>(null)
  const [winningLine, setWinningLine] = useState<number[]>([])
  const [roomCode, setRoomCode] = useState<string>('')
  const [aiDifficulty, setAiDifficulty] = useState(60)
  const [copied, setCopied] = useState(false)

  // Initialize socket for multiplayer modes
  useEffect(() => {
    if (mode !== 'ai') {
      const socket = initSocket()

      socket.on('game:state', handleGameState)
      socket.on('game:move', handleOpponentMove)
      socket.on('game:end', handleGameEnd)
      socket.on('room:joined', handleRoomJoined)

      return () => {
        socket.off('game:state', handleGameState)
        socket.off('game:move', handleOpponentMove)
        socket.off('game:end', handleGameEnd)
        socket.off('room:joined', handleRoomJoined)
      }
    }
  }, [mode])

  const handleGameState = (state: GameState) => {
    setBoard(state.board)
    setCurrentPlayer(state.currentTurn)
    setGameStatus(state.status === 'ACTIVE' ? 'playing' : state.status === 'FINISHED' ? 'finished' : 'waiting')
  }

  const handleOpponentMove = (move: any) => {
    playSound('move', 0.3)
  }

  const handleGameEnd = (result: any) => {
    setWinner(result.winner)
    setWinningLine(result.winningLine || [])
    setGameStatus('finished')

    if (result.winner && result.winner !== 'draw') {
      celebrateWin()
      playSound('win', 0.5)
    } else if (result.winner === 'draw') {
      playSound('draw', 0.4)
    }
  }

  const handleRoomJoined = (code: string) => {
    setRoomCode(code)
    toast.success(`Joined room: ${code}`)
  }

  const celebrateWin = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#12f7d6', '#ff2a6d', '#ffd541']
    })

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#12f7d6', '#ff2a6d', '#ffd541']
      })
    }, 200)

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#12f7d6', '#ff2a6d', '#ffd541']
      })
    }, 400)
  }

  const checkWinner = (board: Board): { winner: Player | 'draw' | null; line: number[] } => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ]

    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a] as Player, line: [a, b, c] }
      }
    }

    if (board.every(cell => cell !== '')) {
      return { winner: 'draw', line: [] }
    }

    return { winner: null, line: [] }
  }

  const makeAIMove = useCallback(async (currentBoard: Board) => {
    try {
      // Call backend AI service
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      const response = await fetch(`${apiUrl}/api/ai/move`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          board: currentBoard,
          difficulty: aiDifficulty,
          aiPlayer: 'O',
          humanPlayer: 'X'
        })
      })

      if (!response.ok) {
        throw new Error('AI service unavailable')
      }

      const { move: selectedMove } = await response.json()

      setTimeout(() => {
        const newBoard = [...currentBoard]
        newBoard[selectedMove] = 'O'
        setBoard(newBoard as Board)
        playSound('move', 0.3)

        const result = checkWinner(newBoard as Board)
        if (result.winner) {
          setWinner(result.winner)
          setWinningLine(result.line)
          setGameStatus('finished')
          if (result.winner !== 'draw') {
            celebrateWin()
            playSound('win', 0.5)
          }
        } else {
          setCurrentPlayer('X')
        }
      }, 500)
    } catch (error) {
      console.error('AI move error:', error)
      toast.error('AI service unavailable - using fallback AI')

      // Fallback to simple AI if backend is unavailable
      const availableMoves = currentBoard
        .map((cell, index) => cell === '' ? index : -1)
        .filter(index => index !== -1)

      if (availableMoves.length > 0) {
        const selectedMove = availableMoves[Math.floor(Math.random() * availableMoves.length)]

        setTimeout(() => {
          const newBoard = [...currentBoard]
          newBoard[selectedMove] = 'O'
          setBoard(newBoard as Board)
          playSound('move', 0.3)

          const result = checkWinner(newBoard as Board)
          if (result.winner) {
            setWinner(result.winner)
            setWinningLine(result.line)
            setGameStatus('finished')
            if (result.winner !== 'draw') {
              celebrateWin()
              playSound('win', 0.5)
            }
          } else {
            setCurrentPlayer('X')
          }
        }, 500)
      }
    }
  }, [aiDifficulty])

  const handleCellClick = (index: number) => {
    if (gameStatus !== 'playing' || board[index] !== '' || currentPlayer !== 'X') {
      return
    }

    const newBoard = [...board]
    newBoard[index] = 'X'
    setBoard(newBoard as Board)
    playSound('move', 0.3)

    const result = checkWinner(newBoard as Board)
    if (result.winner) {
      setWinner(result.winner)
      setWinningLine(result.line)
      setGameStatus('finished')
      if (result.winner === 'X') {
        celebrateWin()
        playSound('win', 0.5)
      } else if (result.winner === 'draw') {
        playSound('draw', 0.4)
      }
      return
    }

    if (mode === 'ai') {
      setCurrentPlayer('O')
      makeAIMove(newBoard as Board)
    } else {
      // Send move via socket for multiplayer
      const socket = getSocket()
      socket?.emit('game:move', index)
      setCurrentPlayer('O')
    }
  }

  const handleRestart = () => {
    setBoard(Array(9).fill('') as Board)
    setCurrentPlayer('X')
    setGameStatus('playing')
    setWinner(null)
    setWinningLine([])
  }

  const handleCopyRoomCode = async () => {
    if (roomCode) {
      await navigator.clipboard.writeText(roomCode)
      setCopied(true)
      toast.success('Room code copied!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyberpunk-primary rounded-full opacity-50"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl mb-6 flex items-center justify-between"
      >
        <button
          onClick={() => router.push('/')}
          className="btn-outline flex items-center gap-2 px-4 py-2"
        >
          <Home className="w-5 h-5" />
          Home
        </button>

        {roomCode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <span className="text-sm text-gray-400">Room Code:</span>
            <span className="font-mono font-bold text-cyberpunk-primary">{roomCode}</span>
            <button
              onClick={handleCopyRoomCode}
              className="p-1 hover:bg-cyberpunk-primary/10 rounded transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </motion.div>
        )}

        <div className="text-sm text-gray-400">
          Mode: <span className="text-cyberpunk-primary font-bold capitalize">{mode}</span>
        </div>
      </motion.div>

      {/* Main game area */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-4xl"
      >
        <GameBoard
          board={board}
          onCellClick={handleCellClick}
          disabled={gameStatus !== 'playing'}
          winningLine={winningLine}
          currentPlayer={currentPlayer}
        />
      </motion.div>

      {/* Game result modal */}
      <AnimatePresence>
        {gameStatus === 'finished' && winner && (
          <GameResult
            winner={winner}
            onRestart={handleRestart}
            onHome={() => router.push('/')}
          />
        )}
      </AnimatePresence>

      {/* AI Difficulty slider (only for AI mode) */}
      {mode === 'ai' && gameStatus === 'playing' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 glass p-4 rounded-lg max-w-md w-full"
        >
          <label className="block text-sm text-gray-400 mb-2">
            AI Difficulty: <span className="text-cyberpunk-primary font-bold">{aiDifficulty}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={aiDifficulty}
            onChange={(e) => setAiDifficulty(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyberpunk-primary"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Easy</span>
            <span>Medium</span>
            <span>Hard</span>
            <span>Expert</span>
          </div>
        </motion.div>
      )}

      {/* Chat box for multiplayer */}
      {mode !== 'ai' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed right-4 bottom-4 w-80"
        >
          <ChatBox />
        </motion.div>
      )}
    </div>
  )
}

export default function GamePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyberpunk-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading game...</p>
        </div>
      </div>
    }>
      <GameContent />
    </Suspense>
  )
}
