/**
 * Game Service - Core game logic and state management
 */

import type { Board, CellValue, GameResult, Player } from '../../shared/types/game'

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

export class GameService {
  /**
   * Create a new empty board
   */
  public createBoard(): Board {
    return Array(9).fill('') as Board
  }

  /**
   * Check if a move is valid
   */
  public isValidMove(board: Board, position: number): boolean {
    return position >= 0 && position < 9 && board[position] === ''
  }

  /**
   * Make a move on the board
   */
  public makeMove(board: Board, position: number, player: Player): Board {
    if (!this.isValidMove(board, position)) {
      throw new Error('Invalid move')
    }

    const newBoard = [...board]
    newBoard[position] = player
    return newBoard as Board
  }

  /**
   * Check for a winner and return the result
   */
  public checkGameResult(board: Board): GameResult {
    // Check for winning lines
    for (const [a, b, c] of WIN_LINES) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return {
          winner: board[a] as Player,
          winningLine: [a, b, c],
        }
      }
    }

    // Check for draw
    if (board.every(cell => cell !== '')) {
      return { winner: 'draw' }
    }

    // Game still in progress
    return { winner: null }
  }

  /**
   * Get the next player
   */
  public getNextPlayer(currentPlayer: Player): Player {
    return currentPlayer === 'X' ? 'O' : 'X'
  }

  /**
   * Generate a random room code
   */
  public generateRoomCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  /**
   * Calculate ELO rating change
   * @param winnerRating Current rating of winner
   * @param loserRating Current rating of loser
   * @param isDraw Whether the game was a draw
   * @returns [winnerNewRating, loserNewRating]
   */
  public calculateEloChange(
    winnerRating: number,
    loserRating: number,
    isDraw: boolean = false
  ): [number, number] {
    const K = 32 // K-factor for rating change

    const expectedWinner = 1 / (1 + Math.pow(10, (loserRating - winnerRating) / 400))
    const expectedLoser = 1 / (1 + Math.pow(10, (winnerRating - loserRating) / 400))

    if (isDraw) {
      const winnerChange = Math.round(K * (0.5 - expectedWinner))
      const loserChange = Math.round(K * (0.5 - expectedLoser))

      return [winnerRating + winnerChange, loserRating + loserChange]
    }

    const winnerChange = Math.round(K * (1 - expectedWinner))
    const loserChange = Math.round(K * (0 - expectedLoser))

    return [winnerRating + winnerChange, loserRating + loserChange]
  }

  /**
   * Calculate XP earned for a game
   */
  public calculateXP(result: 'win' | 'loss' | 'draw', gameDuration: number): number {
    const baseXP = {
      win: 100,
      draw: 50,
      loss: 25,
    }

    // Bonus for longer games (more strategic)
    const durationBonus = Math.min(gameDuration / 60, 50) // Max 50 bonus XP

    return Math.round(baseXP[result] + durationBonus)
  }

  /**
   * Check if a level up occurred
   */
  public checkLevelUp(currentXP: number, currentLevel: number): {
    leveledUp: boolean
    newLevel: number
    xpForNextLevel: number
  } {
    const xpForNextLevel = currentLevel * 1000 // 1000 XP per level

    if (currentXP >= xpForNextLevel) {
      return {
        leveledUp: true,
        newLevel: currentLevel + 1,
        xpForNextLevel: (currentLevel + 1) * 1000,
      }
    }

    return {
      leveledUp: false,
      newLevel: currentLevel,
      xpForNextLevel,
    }
  }
}

export const gameService = new GameService()
