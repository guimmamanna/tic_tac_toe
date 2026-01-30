/**
 * Theme system for Epic Tic-Tac-Toe
 */

export interface Theme {
  id: string
  name: string
  description: string
  colors: {
    bg: string
    primary: string
    secondary: string
    accent: string
    dark: string
  }
}

export const themes: Theme[] = [
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    description: 'Futuristic with neon accents',
    colors: {
      bg: '#0a0f1a',
      primary: '#12f7d6',
      secondary: '#ff2a6d',
      accent: '#ffd541',
      dark: '#050810',
    },
  },
  {
    id: 'dark-minimal',
    name: 'Dark Minimal',
    description: 'Clean and professional',
    colors: {
      bg: '#1a1a1a',
      primary: '#ffffff',
      secondary: '#888888',
      accent: '#4a4a4a',
      dark: '#0d0d0d',
    },
  },
  {
    id: 'light-pastel',
    name: 'Light Pastel',
    description: 'Soft and friendly',
    colors: {
      bg: '#f5f5f5',
      primary: '#6b7fff',
      secondary: '#ff6b9d',
      accent: '#ffd93d',
      dark: '#2d3748',
    },
  },
  {
    id: 'retro-arcade',
    name: 'Retro Arcade',
    description: 'Nostalgic gaming vibes',
    colors: {
      bg: '#1a0033',
      primary: '#ff00ff',
      secondary: '#00ffff',
      accent: '#ffff00',
      dark: '#0d0019',
    },
  },
  {
    id: 'nature',
    name: 'Nature',
    description: 'Calm and earthy',
    colors: {
      bg: '#1a2e1a',
      primary: '#4ade80',
      secondary: '#f59e0b',
      accent: '#84cc16',
      dark: '#0f1f0f',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean Blue',
    description: 'Deep sea vibes',
    colors: {
      bg: '#0a1929',
      primary: '#00b4d8',
      secondary: '#0077b6',
      accent: '#90e0ef',
      dark: '#051016',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm and vibrant',
    colors: {
      bg: '#2d1b1a',
      primary: '#ff6b35',
      secondary: '#f7931e',
      accent: '#feca57',
      dark: '#1a0f0e',
    },
  },
  {
    id: 'matrix',
    name: 'Matrix',
    description: 'Classic hacker aesthetic',
    colors: {
      bg: '#000000',
      primary: '#00ff00',
      secondary: '#00cc00',
      accent: '#00ff41',
      dark: '#001100',
    },
  },
]

export function getTheme(id: string): Theme {
  return themes.find(t => t.id === id) || themes[0]
}

export function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return

  const root = document.documentElement

  root.style.setProperty('--cyberpunk-bg', theme.colors.bg)
  root.style.setProperty('--cyberpunk-primary', theme.colors.primary)
  root.style.setProperty('--cyberpunk-secondary', theme.colors.secondary)
  root.style.setProperty('--cyberpunk-accent', theme.colors.accent)
  root.style.setProperty('--cyberpunk-dark', theme.colors.dark)

  // Store in localStorage
  localStorage.setItem('epic-tictactoe-theme', theme.id)
}

export function loadTheme(): Theme {
  if (typeof window === 'undefined') return themes[0]

  const savedThemeId = localStorage.getItem('epic-tictactoe-theme')
  return savedThemeId ? getTheme(savedThemeId) : themes[0]
}
