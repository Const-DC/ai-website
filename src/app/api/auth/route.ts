import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { cookies } from 'next/headers'
import crypto from 'crypto'

// Admin password from environment variable - set ADMIN_PASSWORD in your .env file
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'constjs2024admin!'

// Timing-safe string comparison to prevent timing attacks
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    if (!password || !timingSafeEqual(password, ADMIN_PASSWORD)) {
      // Add small delay to slow down brute force attempts
      await new Promise(resolve => setTimeout(resolve, 100))
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      )
    }

    // Create session token
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    await db.adminSession.create({
      data: {
        token,
        expiresAt
      }
    })

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: expiresAt,
      path: '/'
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')?.value

    if (token) {
      await db.adminSession.deleteMany({
        where: { token }
      }).catch(() => {})
    }

    cookieStore.delete('admin_token')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ success: true })
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')?.value

    if (!token) {
      return NextResponse.json({ authenticated: false })
    }

    const session = await db.adminSession.findUnique({
      where: { token }
    })

    if (!session || session.expiresAt < new Date()) {
      if (session) {
        await db.adminSession.delete({ where: { token } }).catch(() => {})
      }
      return NextResponse.json({ authenticated: false })
    }

    return NextResponse.json({ authenticated: true })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json({ authenticated: false })
  }
}
