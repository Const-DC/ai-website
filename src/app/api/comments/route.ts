// Comments API - supports CRUD + Pin functionality
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { cookies } from 'next/headers'

// Helper to check auth (returns isAdmin, user data, or null)
async function checkAuth() {
  const cookieStore = await cookies()
  
  // Check admin session
  const adminToken = cookieStore.get('admin_token')?.value
  if (adminToken) {
    const session = await db.adminSession.findUnique({
      where: { token: adminToken }
    })
    if (session && session.expiresAt > new Date()) {
      return { isAdmin: true, user: null }
    }
  }
  
  // Check user session
  const userToken = cookieStore.get('user_token')?.value
  if (userToken) {
    const session = await db.userSession.findUnique({
      where: { token: userToken }
    })
    if (session && session.expiresAt > new Date()) {
      return { isAdmin: false, user: { name: session.name, avatar: session.avatar } }
    }
  }
  
  return null
}

// Sanitize comment content - escape HTML to prevent XSS
function sanitizeContent(content: string): string {
  return content
    .slice(0, 2000) // Limit length
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
}

// GET comments - pinned first, then by date
export async function GET() {
  try {
    const allComments = await db.comment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100 // Increased limit
    })
    // Sort pinned first
    const comments = allComments.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    return NextResponse.json({ comments })
  } catch (error) {
    console.error('Get comments error:', error)
    return NextResponse.json({ comments: [] })
  }
}

// POST new comment (requires auth)
export async function POST(request: NextRequest) {
  try {
    const auth = await checkAuth()
    
    if (!auth) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { content } = body

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Comment content required' },
        { status: 400 }
      )
    }

    // Sanitize content to prevent XSS
    const sanitizedContent = sanitizeContent(content)
    
    if (!sanitizedContent) {
      return NextResponse.json(
        { success: false, error: 'Comment cannot be empty' },
        { status: 400 }
      )
    }

    const comment = await db.comment.create({
      data: {
        author: auth.isAdmin ? 'const.js' : auth.user!.name,
        content: sanitizedContent,
        avatar: auth.isAdmin 
          ? 'https://i.pinimg.com/736x/c9/f2/8e/c9f28eface6424b8c4284664e83e4f2c.jpg' 
          : auth.user!.avatar,
        isAdmin: auth.isAdmin
      }
    })

    return NextResponse.json({ success: true, comment })
  } catch (error) {
    console.error('Create comment error:', error)
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}

// PATCH - Pin/Unpin comment (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const auth = await checkAuth()
    
    if (!auth || !auth.isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Admin only' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id, pinned } = body

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Missing comment ID' },
        { status: 400 }
      )
    }

    const comment = await db.comment.update({
      where: { id },
      data: { pinned: pinned ?? true }
    })

    return NextResponse.json({ success: true, comment })
  } catch (error) {
    console.error('Pin comment error:', error)
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}

// DELETE comment (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const auth = await checkAuth()
    
    if (!auth || !auth.isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Admin only' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing comment ID' },
        { status: 400 }
      )
    }

    await db.comment.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete comment error:', error)
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}
