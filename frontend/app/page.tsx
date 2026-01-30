'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Users, Bot, Trophy, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cyberpunk-primary rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10"
      >
        <motion.div
          className="flex items-center justify-center gap-3 mb-4"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-8 h-8 text-cyberpunk-accent" />
          <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyberpunk-primary via-cyberpunk-accent to-cyberpunk-secondary">
            EPIC
          </h1>
          <Sparkles className="w-8 h-8 text-cyberpunk-accent" />
        </motion.div>

        <h2 className="text-4xl md:text-6xl font-bold mb-4 text-glow">
          TIC-TAC-TOE
        </h2>

        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
          Challenge friends online, master AI opponents, and climb the global leaderboard
        </p>

        {/* Game mode buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
          <Link href="/game?mode=quick">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="card cursor-pointer group"
            >
              <div className="flex flex-col items-center gap-4 p-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyberpunk-primary to-teal-400 flex items-center justify-center group-hover:animate-pulse-glow">
                  <Play className="w-8 h-8 text-cyberpunk-dark" />
                </div>
                <h3 className="text-2xl font-bold">Quick Match</h3>
                <p className="text-gray-400 text-sm">Find an opponent instantly</p>
              </div>
            </motion.div>
          </Link>

          <Link href="/game?mode=private">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="card cursor-pointer group"
            >
              <div className="flex flex-col items-center gap-4 p-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyberpunk-secondary to-pink-500 flex items-center justify-center group-hover:animate-pulse-glow">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Private Room</h3>
                <p className="text-gray-400 text-sm">Play with friends</p>
              </div>
            </motion.div>
          </Link>

          <Link href="/game?mode=ai">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="card cursor-pointer group"
            >
              <div className="flex flex-col items-center gap-4 p-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyberpunk-accent to-yellow-500 flex items-center justify-center group-hover:animate-pulse-glow">
                  <Bot className="w-8 h-8 text-cyberpunk-dark" />
                </div>
                <h3 className="text-2xl font-bold">VS AI</h3>
                <p className="text-gray-400 text-sm">Practice against bot</p>
              </div>
            </motion.div>
          </Link>
        </div>

        {/* Additional links */}
        <div className="flex gap-4 justify-center">
          <Link href="/leaderboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-outline flex items-center gap-2"
            >
              <Trophy className="w-5 h-5" />
              Leaderboard
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 text-center text-gray-500 text-sm"
      >
        <p>Built with Next.js, React, and Socket.io</p>
      </motion.div>
    </div>
  )
}
