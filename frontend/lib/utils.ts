import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate a random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

/**
 * Format duration in seconds to readable string
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`
  }

  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60

  return `${minutes}m ${secs}s`
}

/**
 * Calculate win rate percentage
 */
export function calculateWinRate(wins: number, totalGames: number): number {
  if (totalGames === 0) return 0
  return Math.round((wins / totalGames) * 100)
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

/**
 * Play sound effect
 */
export function playSound(soundName: string, volume: number = 0.5): void {
  try {
    const audio = new Audio(`/sounds/${soundName}.mp3`)
    audio.volume = volume
    audio.play().catch(err => console.warn('Sound play failed:', err))
  } catch (error) {
    console.warn('Sound not available:', error)
  }
}

/**
 * Get avatar URL or generate initials
 */
export function getAvatarDisplay(username: string, avatarUrl?: string): {
  type: 'image' | 'initials'
  value: string
} {
  if (avatarUrl) {
    return { type: 'image', value: avatarUrl }
  }

  const initials = username
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return { type: 'initials', value: initials || username.slice(0, 2).toUpperCase() }
}
