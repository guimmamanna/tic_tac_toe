/**
 * AI Service - Tic-Tac-Toe AI opponent logic
 * Migrated from Python Streamlit version with minimax algorithm
 */

import type { Board, CellValue, Player } from '../../shared/types/game'

const WIN_LINES = [
  [0, 1, 2], // Rows
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6], // Columns
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8], // Diagonals
  [2, 4, 6],
]

export class AIService {
  /**
   * Get available moves on the board
   */
  private getAvailableMoves(board: Board): number[] {
    return board
      .map((cell, index) => (cell === '' ? index : -1))
      .filter(index => index !== -1)
  }

  /**
   * Check for a winner
   * Returns 'X', 'O', 'draw', or null
   */
  private checkWinner(board: Board): CellValue | 'draw' | null {
    // Check for winning lines
    for (const [a, b, c] of WIN_LINES) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a] as CellValue
      }
    }

    // Check for draw
    if (board.every(cell => cell !== '')) {
      return 'draw'
    }

    return null
  }

  /**
   * Find a winning move for the given player
   */
  private findWinningMove(board: Board, player: Player): number | null {
    for (const [a, b, c] of WIN_LINES) {
      const line = [board[a], board[b], board[c]]

      // If the line has 2 of the player's marks and 1 empty space
      if (line.filter(cell => cell === player).length === 2 &&
          line.filter(cell => cell === '').length === 1) {
        if (board[a] === '') return a
        if (board[b] === '') return b
        if (board[c] === '') return c
      }
    }

    return null
  }

  /**
   * Weighted random move - prefers center and corners
   */
  private weightedRandomMove(board: Board): number {
    const availableMoves = this.getAvailableMoves(board)

    if (availableMoves.length === 0) {
      return -1
    }

    // Assign weights: center = 3, corners = 2, edges = 1
    const weights: number[] = []

    for (const move of availableMoves) {
      if (move === 4) {
        weights.push(3) // Center
      } else if ([0, 2, 6, 8].includes(move)) {
        weights.push(2) // Corners
      } else {
        weights.push(1) // Edges
      }
    }

    // Weighted random selection
    const totalWeight = weights.reduce((sum, w) => sum + w, 0)
    let random = Math.random() * totalWeight

    for (let i = 0; i < availableMoves.length; i++) {
      random -= weights[i]
      if (random <= 0) {
        return availableMoves[i]
      }
    }

    return availableMoves[availableMoves.length - 1]
  }

  /**
   * Minimax algorithm for perfect play
   * Returns [score, bestMove]
   */
  private minimax(
    board: Board,
    isMaximizing: boolean,
    aiPlayer: Player,
    humanPlayer: Player
  ): [number, number | null] {
    const winner = this.checkWinner(board)

    // Terminal states
    if (winner === aiPlayer) return [1, null]
    if (winner === humanPlayer) return [-1, null]
    if (winner === 'draw') return [0, null]

    if (isMaximizing) {
      let bestScore = -Infinity
      let bestMove: number | null = null

      for (const move of this.getAvailableMoves(board)) {
        const newBoard = [...board]
        newBoard[move] = aiPlayer
        const [score] = this.minimax(newBoard, false, aiPlayer, humanPlayer)

        if (score > bestScore) {
          bestScore = score
          bestMove = move
        }
      }

      return [bestScore, bestMove]
    } else {
      let bestScore = Infinity
      let bestMove: number | null = null

      for (const move of this.getAvailableMoves(board)) {
        const newBoard = [...board]
        newBoard[move] = humanPlayer
        const [score] = this.minimax(newBoard, true, aiPlayer, humanPlayer)

        if (score < bestScore) {
          bestScore = score
          bestMove = move
        }
      }

      return [bestScore, bestMove]
    }
  }

  /**
   * Get AI move based on difficulty (0-100)
   *
   * - Low difficulty (0-30): Mostly random, makes mistakes
   * - Medium difficulty (31-69): Strategic but not perfect
   * - High difficulty (70-100): Uses minimax for optimal play
   */
  public getAIMove(
    board: Board,
    difficulty: number,
    aiPlayer: Player = 'O',
    humanPlayer: Player = 'X'
  ): number {
    const availableMoves = this.getAvailableMoves(board)

    if (availableMoves.length === 0) {
      return -1
    }

    const skill = difficulty / 100

    // Random chance to make a "human-like" mistake
    if (Math.random() > skill) {
      return this.weightedRandomMove(board)
    }

    // Medium difficulty: Look for wins and blocks, but don't use minimax
    if (skill < 0.7) {
      // Try to win if possible
      const winMove = this.findWinningMove(board, aiPlayer)
      if (winMove !== null) {
        return winMove
      }

      // Block opponent's winning move
      const blockMove = this.findWinningMove(board, humanPlayer)
      if (blockMove !== null) {
        return blockMove
      }

      // Otherwise make a weighted random move
      return this.weightedRandomMove(board)
    }

    // High difficulty: Use minimax for perfect play
    const [, move] = this.minimax(board, true, aiPlayer, humanPlayer)

    return move !== null ? move : this.weightedRandomMove(board)
  }

  /**
   * Get a random AI player name (for fun)
   */
  public getRandomAIName(): string {
    const names = [
      'Claude',
      'ChatGPT',
      'Gemini',
      'Llama',
      'Mistral',
      'Grok',
      'Phi',
      'Perplexity',
      'Bard',
      'Codex',
    ]

    return names[Math.floor(Math.random() * names.length)]
  }

  /**
   * Analyze a move and provide feedback
   * Returns optimal move and whether the played move was optimal
   */
  public analyzeMove(
    board: Board,
    playerMove: number,
    player: Player,
    opponent: Player
  ): { isOptimal: boolean; optimalMove: number; evaluation: string } {
    const [, optimalMove] = this.minimax(
      board,
      player === 'X',
      'O',
      'X'
    )

    const isOptimal = playerMove === optimalMove

    let evaluation = 'Good move!'

    if (!isOptimal && optimalMove !== null) {
      const winningMove = this.findWinningMove(board, opponent)

      if (winningMove === playerMove) {
        evaluation = 'Excellent defensive play!'
      } else if (winningMove !== null) {
        evaluation = 'Missed a blocking opportunity'
      } else {
        evaluation = 'Could have been better'
      }
    } else if (isOptimal) {
      const winningMove = this.findWinningMove(board, player)
      if (winningMove === playerMove) {
        evaluation = 'Brilliant winning move!'
      } else {
        evaluation = 'Perfect strategic move!'
      }
    }

    return {
      isOptimal,
      optimalMove: optimalMove ?? -1,
      evaluation,
    }
  }
}

export const aiService = new AIService()
