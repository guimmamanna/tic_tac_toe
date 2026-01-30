import type { Metadata } from 'next'
import { Orbitron, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  title: 'Epic Tic-Tac-Toe | Online Multiplayer Game',
  description: 'Play tic-tac-toe online with friends or against AI. Multiple game modes, stunning animations, and competitive leaderboards.',
  keywords: ['tic-tac-toe', 'online game', 'multiplayer', 'react', 'next.js'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${orbitron.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-cyberpunk-bg min-h-screen">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1f2e',
              color: '#e7f9ff',
              border: '1px solid rgba(18, 247, 214, 0.3)',
            },
          }}
        />
      </body>
    </html>
  )
}
