// Security utilities for Mock Stock application

import { NextRequest } from 'next/server'

/**
 * Admin Authentication
 * Validates admin secret key from request headers
 */
export function validateAdminAuth(request: NextRequest): boolean {
  const adminSecret = request.headers.get('x-admin-secret')
  const expectedSecret = process.env.ADMIN_SECRET || 'ubuntu2025_admin_secret'
  
  return adminSecret === expectedSecret
}

/**
 * Rate Limiting
 * Prevents spam by limiting requests per time window
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  
  /**
   * Check if request is within rate limit
   * @param identifier - User/team identifier
   * @param maxRequests - Maximum requests allowed
   * @param windowMs - Time window in milliseconds
   */
  checkLimit(identifier: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now()
    const userRequests = this.requests.get(identifier) || []
    
    // Remove old requests outside the time window
    const recentRequests = userRequests.filter(timestamp => now - timestamp < windowMs)
    
    // Check if limit exceeded
    if (recentRequests.length >= maxRequests) {
      return false
    }
    
    // Add current request
    recentRequests.push(now)
    this.requests.set(identifier, recentRequests)
    
    return true
  }
  
  /**
   * Clear rate limit for a user (useful for testing or admin override)
   */
  clearLimit(identifier: string): void {
    this.requests.delete(identifier)
  }
  
  /**
   * Get remaining requests for a user
   */
  getRemainingRequests(identifier: string, maxRequests: number = 10, windowMs: number = 60000): number {
    const now = Date.now()
    const userRequests = this.requests.get(identifier) || []
    const recentRequests = userRequests.filter(timestamp => now - timestamp < windowMs)
    
    return Math.max(0, maxRequests - recentRequests.length)
  }
}

// Global rate limiter instance
export const rateLimiter = new RateLimiter()

/**
 * Trade Validation
 * Ensures trades are valid and prevent cheating
 */
export interface TradeValidationParams {
  teamName: string
  stockId: string
  type: 'buy' | 'sell'
  quantity: number
  price: number
  teamCash: number
  teamHoldings: Array<{ stockId: string; quantity: number }>
  gameIsActive: boolean
}

export function validateTrade(params: TradeValidationParams): { valid: boolean; error?: string } {
  const { teamName, stockId, type, quantity, price, teamCash, gameIsActive } = params
  
  // 1. Check if game is active
  if (!gameIsActive) {
    return { valid: false, error: 'Game is not active. Trading is currently disabled.' }
  }
  
  // 2. Validate basic inputs
  if (!teamName || !stockId || !type) {
    return { valid: false, error: 'Missing required fields' }
  }
  
  if (quantity <= 0) {
    return { valid: false, error: 'Quantity must be greater than 0' }
  }
  
  if (price <= 0) {
    return { valid: false, error: 'Invalid stock price' }
  }
  
  // 3. Only BUY trades allowed (selling disabled)
  if (type !== 'buy') {
    return { valid: false, error: 'Only buying stocks is allowed in this game' }
  }
  
  // 4. Validate BUY trade
  const totalCost = quantity * price
  
  if (totalCost > teamCash) {
    return { 
      valid: false, 
      error: `Insufficient funds. Required: ₹${totalCost.toLocaleString()}, Available: ₹${teamCash.toLocaleString()}` 
    }
  }
  
  return { valid: true }
}

/**
 * Input Sanitization
 * Prevents XSS and injection attacks
 */
export function sanitizeTeamName(teamName: string): string {
  // Remove special characters, allow only alphanumeric, spaces, and basic punctuation
  return teamName
    .trim()
    .replace(/[<>\"']/g, '') // Remove potential XSS characters
    .substring(0, 50) // Limit length
}

/**
 * Request Validation
 * Validates request body structure
 */
export function validateRequestBody(body: any, requiredFields: string[]): { valid: boolean; error?: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Invalid request body' }
  }
  
  for (const field of requiredFields) {
    if (!(field in body) || body[field] === null || body[field] === undefined) {
      return { valid: false, error: `Missing required field: ${field}` }
    }
  }
  
  return { valid: true }
}

/**
 * CORS Headers
 * Configure allowed origins for API requests
 */
export function getCorsHeaders(origin?: string): HeadersInit {
  const allowedOrigins = [
    'http://localhost:3000',
    'https://mock-stock-ubuntu.vercel.app',
    process.env.NEXT_PUBLIC_APP_URL
  ].filter(Boolean)
  
  const isAllowed = origin && allowedOrigins.includes(origin)
  
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0] || '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-admin-secret',
    'Access-Control-Max-Age': '86400',
  }
}

/**
 * Error Response Helper
 * Standardized error responses
 */
export function createErrorResponse(message: string, status: number = 400) {
  return Response.json(
    { 
      error: message,
      timestamp: new Date().toISOString()
    },
    { status }
  )
}

/**
 * Success Response Helper
 * Standardized success responses
 */
export function createSuccessResponse(data: any, status: number = 200) {
  return Response.json(
    {
      success: true,
      data,
      timestamp: new Date().toISOString()
    },
    { status }
  )
}
