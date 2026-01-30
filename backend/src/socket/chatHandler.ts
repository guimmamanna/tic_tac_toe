/**
 * Socket.io chat handlers for in-game communication
 */

import { Server, Socket } from 'socket.io'

interface ChatMessage {
  id: string
  userId: string
  username: string
  message: string
  timestamp: number
  type: 'TEXT' | 'EMOJI' | 'SYSTEM'
}

export function registerChatHandlers(io: Server, socket: Socket) {
  console.log(`💬 Chat handlers registered for socket: ${socket.id}`)

  // Send a chat message
  socket.on('chat:send', (message: string) => {
    // Get the rooms this socket is in
    const rooms = Array.from(socket.rooms).filter(room => room !== socket.id)

    if (rooms.length === 0) {
      return
    }

    const chatMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      userId: socket.id,
      username: `Player ${socket.id.substring(0, 6)}`, // Would be actual username in production
      message: message.substring(0, 200), // Limit message length
      timestamp: Date.now(),
      type: 'TEXT',
    }

    // Broadcast to all players in the room
    rooms.forEach(room => {
      io.to(room).emit('chat:message', chatMessage)
    })
  })

  // Send an emoji reaction
  socket.on('chat:emoji', (emoji: string) => {
    const rooms = Array.from(socket.rooms).filter(room => room !== socket.id)

    if (rooms.length === 0) {
      return
    }

    const chatMessage: ChatMessage = {
      id: `emoji-${Date.now()}`,
      userId: socket.id,
      username: `Player ${socket.id.substring(0, 6)}`,
      message: emoji,
      timestamp: Date.now(),
      type: 'EMOJI',
    }

    rooms.forEach(room => {
      io.to(room).emit('chat:message', chatMessage)
    })
  })
}
