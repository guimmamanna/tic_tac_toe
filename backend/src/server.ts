import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { registerGameHandlers } from './socket/gameHandler'
import { registerChatHandlers } from './socket/chatHandler'

// Load environment variables
dotenv.config()

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  },
})

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime()
  })
})

// API endpoints
app.get('/api/stats', (req, res) => {
  res.json({
    totalPlayers: 10234,
    gamesPlayed: 52891,
    topEloRating: 2150
  })
})

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`)

  // Register all socket handlers
  registerGameHandlers(io, socket)
  registerChatHandlers(io, socket)

  socket.on('disconnect', (reason) => {
    console.log(`❌ Client disconnected: ${socket.id} - Reason: ${reason}`)
  })

  socket.on('error', (error) => {
    console.error(`🔴 Socket error for ${socket.id}:`, error)
  })
})

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

const PORT = process.env.PORT || 3001

httpServer.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🎮 Epic Tic-Tac-Toe Server                         ║
║                                                       ║
║   🚀 Server:      http://localhost:${PORT}              ║
║   📡 Socket.io:   Ready for connections               ║
║   🌍 Environment: ${(process.env.NODE_ENV || 'development').padEnd(17)}        ║
║   ⏱️  Started:     ${new Date().toLocaleString().padEnd(17)}        ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `)
})

export { io }
