import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Only apply to /api/ routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    
    // Allow NextAuth routes to be accessed publicly (login, callback, etc.)
    if (request.nextUrl.pathname.startsWith('/api/auth/')) {
      return NextResponse.next()
    }

    // Check for internal access using Origin or Referer
    const origin = request.headers.get('origin')
    const referer = request.headers.get('referer')
    const host = request.headers.get('host') // e.g. localhost:3000 or my-site.com

    let isInternal = false

    // Check Origin (standard for POST/PUT/DELETE, sometimes GET)
    if (origin) {
      try {
        const originUrl = new URL(origin)
        if (originUrl.host === host) {
          isInternal = true
        }
      } catch (e) {
        // Invalid URL
      }
    } 
    // Check Referer (standard for navigation/GET)
    else if (referer) {
      try {
        const refererUrl = new URL(referer)
        if (refererUrl.host === host) {
          isInternal = true
        }
      } catch (e) {
        // Invalid URL
      }
    }

    // Allow access if a special internal secret is present (useful for server-side scripts or testing)
    // You can set INTERNAL_API_KEY in your .env file
    const internalKey = process.env.INTERNAL_API_KEY
    if (!isInternal && internalKey) {
      const headerKey = request.headers.get('x-internal-api-key')
      if (headerKey === internalKey) {
        isInternal = true
      }
    }

    if (!isInternal) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'Access denied. This API is restricted to internal use only.',
          code: 'INTERNAL_ONLY' 
        }),
        { status: 403, headers: { 'content-type': 'application/json' } }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
