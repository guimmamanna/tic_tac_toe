'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, MessageCircle, Minimize2 } from 'lucide-react'
import { getSocket } from '@/lib/socket'

interface Message {
  id: string
  username: string
  message: string
  timestamp: number
  type: 'TEXT' | 'EMOJI' | 'SYSTEM'
}

export function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    socket.on('chat:message', (msg: Message) => {
      setMessages(prev => [...prev, msg])
    })

    return () => {
      socket.off('chat:message')
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!input.trim()) return

    const socket = getSocket()
    socket?.emit('chat:send', input)

    setInput('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (isMinimized) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsMinimized(false)}
        className="glass p-4 rounded-full shadow-lg border-2 border-cyberpunk-primary/30"
      >
        <MessageCircle className="w-6 h-6 text-cyberpunk-primary" />
      </motion.button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl border border-cyberpunk-primary/20 overflow-hidden shadow-2xl"
    >
      {/* Header */}
      <div className="bg-cyberpunk-dark/80 px-4 py-3 flex items-center justify-between border-b border-cyberpunk-primary/20">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-cyberpunk-primary" />
          <span className="font-bold">Chat</span>
        </div>
        <button
          onClick={() => setIsMinimized(true)}
          className="p-1 hover:bg-cyberpunk-primary/10 rounded transition-colors"
        >
          <Minimize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="h-64 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className={`${
                msg.type === 'SYSTEM'
                  ? 'text-center text-xs text-gray-500 italic'
                  : 'bg-cyberpunk-dark/50 p-2 rounded-lg'
              }`}
            >
              {msg.type !== 'SYSTEM' && (
                <>
                  <div className="text-xs text-cyberpunk-primary font-bold mb-1">
                    {msg.username}
                  </div>
                  <div className="text-sm">{msg.message}</div>
                </>
              )}
              {msg.type === 'SYSTEM' && msg.message}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-cyberpunk-primary/20 p-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 input text-sm"
            maxLength={200}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
