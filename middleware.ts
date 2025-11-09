import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware for security and request handling
 * Runs before every request to API routes
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 1. Admin Route Protection
  if (pathname.startsWith('/api/admin') || 
      pathname.includes('/calculate') ||
      pathname.startsWith('/api/game/state') && request.method === 'POST' ||
      pathname.startsWith('/api/stocks/prices') && request.method === 'POST' ||
      pathname.startsWith('/api/news') && request.method === 'POST') {
    
    const adminSecret = request.headers.get('x-admin-secret')
    const expectedSecret = process.env.ADMIN_SECRET || 'ubuntu2025_admin_secret'
    
    if (adminSecret !== expectedSecret) {
      return NextResponse.json(
        { 
          error: 'Unauthorized. Admin access required.',
          code: 'ADMIN_AUTH_FAILED'
        },
        { status: 401 }
      )
    }
  }
  
  // 2. Rate Limiting Headers
  const response = NextResponse.next()
  
  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Add CORS headers for API routes
  if (pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, x-admin-secret')
  }
  
  return response
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    '/api/:path*',
    '/admin/:path*'
  ]
}
