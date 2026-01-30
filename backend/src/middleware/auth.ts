/**
 * Authentication middleware using JWT
 */

import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key'

export interface AuthRequest extends Request {
  userId?: string
  user?: {
    id: string
    username: string
    email: string
  }
}

export interface JWTPayload {
  userId: string
  username: string
  email: string
}

/**
 * Generate JWT token
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
  })
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

/**
 * Authentication middleware
 */
export function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }

  const payload = verifyToken(token)

  if (!payload) {
    return res.status(403).json({ error: 'Invalid or expired token' })
  }

  req.userId = payload.userId
  req.user = {
    id: payload.userId,
    username: payload.username,
    email: payload.email,
  }

  next()
}

/**
 * Optional authentication middleware
 */
export function optionalAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token) {
    const payload = verifyToken(token)
    if (payload) {
      req.userId = payload.userId
      req.user = {
        id: payload.userId,
        username: payload.username,
        email: payload.email,
      }
    }
  }

  next()
}
