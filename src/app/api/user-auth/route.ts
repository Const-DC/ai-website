import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { cookies } from 'next/headers'
import crypto from 'crypto'

// Sanitize string input - remove HTML and limit length
function sanitizeInput(str: string, maxLength: number = 100): string {
  return str
    .slice(0, maxLength)
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>]/g, '') // Remove remaining brackets
    .trim()
}

// Validate URL is safe
function isValidImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    // Only allow https
    if (parsed.protocol !== 'https:') return false
    // Block internal IPs
    const hostname = parsed.hostname
    if (hostname === 'localhost' || 
        hostname.startsWith('127.') || 
        hostname.startsWith('10.') ||
        hostname.startsWith('192.168.') ||
        hostname.startsWith('172.') ||
        hostname === '0.0.0.0' ||
        hostname.includes('169.254')) {
      return false
    }
    // Check for image extension in path
    const validExtensions = ['.gif', '.jpg', '.jpeg', '.png', '.webp', '.bmp']
    const path = parsed.pathname.toLowerCase()
    return validExtensions.some(ext => path.endsWith(ext))
  } catch {
    return false
  }
}

// User login with name + image URL
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    let { name, avatar } = body

    if (!name || !avatar) {
      return NextResponse.json(
        { success: false, error: 'Name and avatar are required' },
        { status: 400 }
      )
    }

    // Sanitize inputs
    name = sanitizeInput(name, 50)
    avatar = sanitizeInput(avatar, 500)

    // Validate avatar URL
    if (!isValidImageUrl(avatar)) {
      return NextResponse.json(
        { success: false, error: 'Avatar must be a valid HTTPS image URL (gif, jpg, png, webp)' },
        { status: 400 }
      )
    }

    // Create session token
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    await db.userSession.create({
      data: {
        token,
        name,
        avatar,
        expiresAt
      }
    })

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set('user_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: expiresAt,
      path: '/'
    })

    return NextResponse.json({ success: true, user: { name, avatar } })
  } catch (error) {
    console.error('User auth error:', error)
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}

// Check user session
export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('user_token')?.value

    if (!token) {
      return NextResponse.json({ authenticated: false, user: null })
    }

    const session = await db.userSession.findUnique({
      where: { token }
    })

    if (!session || session.expiresAt < new Date()) {
      if (session) {
        await db.userSession.delete({ where: { token } }).catch(() => {})
      }
      return NextResponse.json({ authenticated: false, user: null })
    }

    return NextResponse.json({ 
      authenticated: true, 
      user: { name: session.name, avatar: session.avatar }
    })
  } catch (error) {
    console.error('User session check error:', error)
    return NextResponse.json({ authenticated: false, user: null })
  }
}

// Logout
export async function DELETE() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('user_token')?.value

    if (token) {
      await db.userSession.deleteMany({
        where: { token }
      }).catch(() => {})
    }

    cookieStore.delete('user_token')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('User logout error:', error)
    return NextResponse.json({ success: true })
  }
}
