import { Router, Request, Response } from 'express'
import { aiService } from '../services/aiService'
import type { Board, Player } from '../../../shared/types/game'

const router = Router()

/**
 * POST /api/ai/move
 * Get AI move for the current board state
 */
router.post('/move', (req: Request, res: Response) => {
  try {
    const { board, difficulty, aiPlayer, humanPlayer } = req.body

    // Validate input
    if (!board || !Array.isArray(board) || board.length !== 9) {
      return res.status(400).json({ error: 'Invalid board' })
    }

    const difficultyValue = typeof difficulty === 'number' ? difficulty : 60
    const ai = (aiPlayer as Player) || 'O'
    const human = (humanPlayer as Player) || 'X'

    // Get AI move
    const move = aiService.getAIMove(board as Board, difficultyValue, ai, human)

    if (move === -1) {
      return res.status(400).json({ error: 'No valid moves available' })
    }

    res.json({ move, difficulty: difficultyValue })
  } catch (error) {
    console.error('AI move error:', error)
    res.status(500).json({ error: 'Failed to calculate AI move' })
  }
})

/**
 * POST /api/ai/analyze
 * Analyze a player's move
 */
router.post('/analyze', (req: Request, res: Response) => {
  try {
    const { board, move, player, opponent } = req.body

    if (!board || !Array.isArray(board) || board.length !== 9) {
      return res.status(400).json({ error: 'Invalid board' })
    }

    if (typeof move !== 'number' || move < 0 || move > 8) {
      return res.status(400).json({ error: 'Invalid move' })
    }

    const analysis = aiService.analyzeMove(
      board as Board,
      move,
      (player as Player) || 'X',
      (opponent as Player) || 'O'
    )

    res.json(analysis)
  } catch (error) {
    console.error('AI analysis error:', error)
    res.status(500).json({ error: 'Failed to analyze move' })
  }
})

export default router
