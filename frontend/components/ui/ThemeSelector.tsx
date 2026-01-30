'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, Check } from 'lucide-react'
import { themes, applyTheme, loadTheme, type Theme } from '@/lib/themes'

export function ThemeSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0])

  useEffect(() => {
    const theme = loadTheme()
    setCurrentTheme(theme)
    applyTheme(theme)
  }, [])

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme)
    applyTheme(theme)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-outline flex items-center gap-2 px-4 py-2"
      >
        <Palette className="w-5 h-5" />
        Theme
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 glass rounded-xl border border-cyberpunk-primary/20 p-4 z-50"
          >
            <h3 className="font-bold mb-3 text-lg">Choose Theme</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeChange(theme)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    currentTheme.id === theme.id
                      ? 'bg-cyberpunk-primary/20 border-2 border-cyberpunk-primary'
                      : 'bg-cyberpunk-dark/50 border-2 border-transparent hover:border-cyberpunk-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-bold">{theme.name}</div>
                    {currentTheme.id === theme.id && (
                      <Check className="w-5 h-5 text-cyberpunk-primary" />
                    )}
                  </div>
                  <div className="text-sm text-gray-400 mb-2">{theme.description}</div>
                  <div className="flex gap-2">
                    {Object.entries(theme.colors).slice(0, 4).map(([key, color]) => (
                      <div
                        key={key}
                        className="w-6 h-6 rounded-full border-2 border-gray-600"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
