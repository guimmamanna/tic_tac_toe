import { io, Socket } from 'socket.io-client'
import type { ServerToClientEvents, ClientToServerEvents } from '../shared/types/game'

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null

/**
 * Initialize Socket.io connection
 */
export function initSocket(): Socket<ServerToClientEvents, ClientToServerEvents> {
  if (socket) {
    return socket
  }

  const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'

  socket = io(SOCKET_URL, {
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  })

  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket?.id)
  })

  socket.on('disconnect', (reason) => {
    console.log('❌ Socket disconnected:', reason)
  })

  socket.on('connect_error', (error) => {
    console.error('🔴 Socket connection error:', error)
  })

  return socket
}

/**
 * Get the current socket instance
 */
export function getSocket(): Socket<ServerToClientEvents, ClientToServerEvents> | null {
  return socket
}

/**
 * Disconnect socket
 */
export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
