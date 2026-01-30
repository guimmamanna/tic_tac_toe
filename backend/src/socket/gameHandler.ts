/**
 * Socket.io game handlers for real-time multiplayer
 */

import { Server, Socket } from 'socket.io'
import { gameService } from '../services/gameService'
import { aiService } from '../services/aiService'
import type { Board, Player, GameMode } from '../../../shared/types/game'

interface GameRoom {
  id: string
  roomCode: string
  mode: GameMode
  board: Board
  currentTurn: Player
  player1Id: string
  player2Id?: string
  player1SocketId: string
  player2SocketId?: string
  status: 'waiting' | 'active' | 'finished'
  winner?: Player | 'draw'
  winningLine?: number[]
  createdAt: number
}

const activeGames = new Map<string, GameRoom>()
const matchmakingQueue: string[] = []

export function registerGameHandlers(io: Server, socket: Socket) {
  console.log(`🎮 Game handlers registered for socket: ${socket.id}`)

  // Create a new game room
  socket.on('game:create', (mode: GameMode) => {
    const roomCode = gameService.generateRoomCode()
    const gameRoom: GameRoom = {
      id: `game-${Date.now()}`,
      roomCode,
      mode,
      board: gameService.createBoard(),
      currentTurn: 'X',
      player1Id: socket.id,
      player1SocketId: socket.id,
      status: mode === 'AI' ? 'active' : 'waiting',
      createdAt: Date.now(),
    }

    activeGames.set(roomCode, gameRoom)
    socket.join(roomCode)

    socket.emit('room:joined', roomCode)
    socket.emit('game:state', {
      id: gameRoom.id,
      roomCode,
      mode,
      status: gameRoom.status,
      board: gameRoom.board,
      currentTurn: gameRoom.currentTurn,
      player1Id: gameRoom.player1Id,
      player2Id: gameRoom.player2Id,
      moves: [],
      createdAt: new Date(gameRoom.createdAt).toISOString(),
    })

    console.log(`✅ Room created: ${roomCode} by ${socket.id}`)
  })

  // Join an existing game room
  socket.on('game:join', (roomCode: string) => {
    const gameRoom = activeGames.get(roomCode)

    if (!gameRoom) {
      socket.emit('game:error', 'Room not found')
      return
    }

    if (gameRoom.player2Id) {
      socket.emit('game:error', 'Room is full')
      return
    }

    gameRoom.player2Id = socket.id
    gameRoom.player2SocketId = socket.id
    gameRoom.status = 'active'

    socket.join(roomCode)

    // Notify both players
    io.to(roomCode).emit('room:playerJoined', socket.id)
    io.to(roomCode).emit('game:state', {
      id: gameRoom.id,
      roomCode,
      mode: gameRoom.mode,
      status: gameRoom.status,
      board: gameRoom.board,
      currentTurn: gameRoom.currentTurn,
      player1Id: gameRoom.player1Id,
      player2Id: gameRoom.player2Id,
      moves: [],
      createdAt: new Date(gameRoom.createdAt).toISOString(),
    })

    console.log(`✅ Player ${socket.id} joined room: ${roomCode}`)
  })

  // Make a move
  socket.on('game:move', (position: number) => {
    // Find the game room for this socket
    let gameRoom: GameRoom | undefined
    let roomCode: string = ''

    for (const [code, room] of activeGames.entries()) {
      if (room.player1SocketId === socket.id || room.player2SocketId === socket.id) {
        gameRoom = room
        roomCode = code
        break
      }
    }

    if (!gameRoom) {
      socket.emit('game:error', 'Game not found')
      return
    }

    if (gameRoom.status !== 'active') {
      socket.emit('game:error', 'Game is not active')
      return
    }

    // Validate it's the player's turn
    const isPlayer1 = socket.id === gameRoom.player1SocketId
    const isPlayer2 = socket.id === gameRoom.player2SocketId
    const expectedPlayer: Player = gameRoom.currentTurn

    if ((expectedPlayer === 'X' && !isPlayer1) || (expectedPlayer === 'O' && !isPlayer2)) {
      socket.emit('game:error', 'Not your turn')
      return
    }

    // Make the move
    try {
      gameRoom.board = gameService.makeMove(gameRoom.board, position, gameRoom.currentTurn)

      // Check for game end
      const result = gameService.checkGameResult(gameRoom.board)

      if (result.winner) {
        gameRoom.status = 'finished'
        gameRoom.winner = result.winner
        gameRoom.winningLine = result.winningLine

        io.to(roomCode).emit('game:end', {
          winner: result.winner,
          winningLine: result.winningLine,
        })

        // Clean up game after 1 minute
        setTimeout(() => {
          activeGames.delete(roomCode)
        }, 60000)
      } else {
        // Switch turns
        gameRoom.currentTurn = gameService.getNextPlayer(gameRoom.currentTurn)
      }

      // Broadcast the move to all players in the room
      io.to(roomCode).emit('game:move', {
        position,
        player: expectedPlayer,
        timestamp: Date.now(),
      })

      io.to(roomCode).emit('game:state', {
        id: gameRoom.id,
        roomCode,
        mode: gameRoom.mode,
        status: gameRoom.status,
        board: gameRoom.board,
        currentTurn: gameRoom.currentTurn,
        player1Id: gameRoom.player1Id,
        player2Id: gameRoom.player2Id,
        winner: gameRoom.winner,
        moves: [],
        createdAt: new Date(gameRoom.createdAt).toISOString(),
      })
    } catch (error) {
      socket.emit('game:error', 'Invalid move')
    }
  })

  // Join matchmaking
  socket.on('matchmaking:join', () => {
    if (matchmakingQueue.includes(socket.id)) {
      return
    }

    matchmakingQueue.push(socket.id)

    // Try to match with another player
    if (matchmakingQueue.length >= 2) {
      const player1Id = matchmakingQueue.shift()!
      const player2Id = matchmakingQueue.shift()!

      const roomCode = gameService.generateRoomCode()
      const gameRoom: GameRoom = {
        id: `game-${Date.now()}`,
        roomCode,
        mode: 'CLASSIC',
        board: gameService.createBoard(),
        currentTurn: 'X',
        player1Id,
        player2Id,
        player1SocketId: player1Id,
        player2SocketId: player2Id,
        status: 'active',
        createdAt: Date.now(),
      }

      activeGames.set(roomCode, gameRoom)

      const player1Socket = io.sockets.sockets.get(player1Id)
      const player2Socket = io.sockets.sockets.get(player2Id)

      player1Socket?.join(roomCode)
      player2Socket?.join(roomCode)

      io.to(player1Id).emit('matchmaking:found', roomCode)
      io.to(player2Id).emit('matchmaking:found', roomCode)

      io.to(roomCode).emit('game:state', {
        id: gameRoom.id,
        roomCode,
        mode: gameRoom.mode,
        status: gameRoom.status,
        board: gameRoom.board,
        currentTurn: gameRoom.currentTurn,
        player1Id: gameRoom.player1Id,
        player2Id: gameRoom.player2Id,
        moves: [],
        createdAt: new Date(gameRoom.createdAt).toISOString(),
      })

      console.log(`✅ Match found: ${player1Id} vs ${player2Id} in room ${roomCode}`)
    }
  })

  // Leave matchmaking
  socket.on('matchmaking:leave', () => {
    const index = matchmakingQueue.indexOf(socket.id)
    if (index > -1) {
      matchmakingQueue.splice(index, 1)
    }
  })

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`👋 Socket disconnected: ${socket.id}`)

    // Remove from matchmaking queue
    const queueIndex = matchmakingQueue.indexOf(socket.id)
    if (queueIndex > -1) {
      matchmakingQueue.splice(queueIndex, 1)
    }

    // Find and handle any active games
    for (const [roomCode, gameRoom] of activeGames.entries()) {
      if (gameRoom.player1SocketId === socket.id || gameRoom.player2SocketId === socket.id) {
        // Notify other player
        socket.to(roomCode).emit('room:playerLeft', socket.id)

        // If game is active, mark as abandoned
        if (gameRoom.status === 'active') {
          gameRoom.status = 'finished'
          socket.to(roomCode).emit('game:error', 'Opponent disconnected')
        }

        // Clean up game after 1 minute
        setTimeout(() => {
          activeGames.delete(roomCode)
        }, 60000)
      }
    }
  })
}
