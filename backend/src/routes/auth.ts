/**
 * Authentication routes
 */

import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { generateToken } from '../middleware/auth'

const router = Router()

// Mock user storage (replace with Prisma in production)
const users: Map<string, {
  id: string
  username: string
  email: string
  passwordHash: string
}> = new Map()

/**
 * Register new user
 */
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    // Check if user exists
    for (const user of users.values()) {
      if (user.email === email) {
        return res.status(400).json({ error: 'Email already registered' })
      }
      if (user.username === username) {
        return res.status(400).json({ error: 'Username already taken' })
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user
    const userId = `user-${Date.now()}`
    const user = {
      id: userId,
      username,
      email,
      passwordHash,
    }

    users.set(userId, user)

    // Generate token
    const token = generateToken({
      userId: user.id,
      username: user.username,
      email: user.email,
    })

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ error: 'Registration failed' })
  }
})

/**
 * Login user
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Find user
    let user: any = null
    for (const u of users.values()) {
      if (u.email === email) {
        user = u
        break
      }
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash)

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      username: user.username,
      email: user.email,
    })

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Login failed' })
  }
})

/**
 * Get current user (demo endpoint)
 */
router.get('/me', (req, res) => {
  // This would use the authenticateToken middleware in production
  res.json({
    id: 'demo-user',
    username: 'DemoPlayer',
    email: 'demo@example.com',
  })
})

export default router
