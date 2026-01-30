// Shared types for game logic

export type CellValue = 'X' | 'O' | ''
export type Board = CellValue[]
export type GameMode = 'CLASSIC' | 'SPEED' | 'ULTIMATE' | 'POWERUP' | 'AI'
export type GameStatus = 'WAITING' | 'ACTIVE' | 'FINISHED' | 'ABANDONED'
export type Player = 'X' | 'O'

export interface Move {
  position: number
  player: Player
  timestamp: number
}

export interface GameState {
  id: string
  roomCode?: string
  mode: GameMode
  status: GameStatus
  board: Board
  currentTurn: Player
  winner?: Player | 'draw'
  player1Id?: string
  player2Id?: string
  moves: Move[]
  createdAt: string
  timeLimit?: number  // For speed mode (in seconds)
  powerUps?: PowerUp[] // For power-up mode
}

export interface PowerUp {
  type: 'BLOCK' | 'EXTRA_TURN' | 'SWAP'
  player: Player
  used: boolean
}

export interface GameResult {
  winner: Player | 'draw' | null
  winningLine?: number[] // Indices of winning cells
}

// Socket events
export interface ServerToClientEvents {
  'game:state': (state: GameState) => void
  'game:move': (move: Move) => void
  'game:end': (result: GameResult) => void
  'game:error': (error: string) => void
  'room:joined': (roomCode: string) => void
  'room:playerJoined': (playerId: string) => void
  'room:playerLeft': (playerId: string) => void
  'chat:message': (message: ChatMessage) => void
  'matchmaking:found': (gameId: string) => void
}

export interface ClientToServerEvents {
  'game:join': (roomCode: string) => void
  'game:create': (mode: GameMode) => void
  'game:move': (position: number) => void
  'game:usePowerUp': (powerUp: PowerUp['type']) => void
  'game:rematch': () => void
  'matchmaking:join': () => void
  'matchmaking:leave': () => void
  'chat:send': (message: string) => void
}

export interface ChatMessage {
  id: string
  userId: string
  username: string
  message: string
  timestamp: number
  type: 'TEXT' | 'EMOJI' | 'SYSTEM'
}

// Win detection
export const WIN_LINES = [
  [0, 1, 2], // Row 1
  [3, 4, 5], // Row 2
  [6, 7, 8], // Row 3
  [0, 3, 6], // Col 1
  [1, 4, 7], // Col 2
  [2, 5, 8], // Col 3
  [0, 4, 8], // Diagonal 1
  [2, 4, 6], // Diagonal 2
]
