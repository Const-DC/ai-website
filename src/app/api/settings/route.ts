// Site Settings API - GET and PUT (admin only)
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { cookies } from 'next/headers'

// Helper to check admin auth
async function checkAdminAuth() {
  const cookieStore = await cookies()
  const adminToken = cookieStore.get('admin_token')?.value
  
  if (!adminToken) return false
  
  const session = await db.adminSession.findUnique({
    where: { token: adminToken }
  })
  
  return session && session.expiresAt > new Date()
}

// Sensitive fields that should never be returned in GET
const SENSITIVE_FIELDS = ['openrouterApiKey'] as const

// Validate and sanitize input
function validateInput(body: Record<string, unknown>): { valid: boolean; error?: string } {
  // Validate URLs
  const urlFields = ['profilePic', 'musicAlbumArt', 'aboutMeImage', 'meetImage', 'backgroundImage', 'introGif']
  for (const field of urlFields) {
    if (body[field] && typeof body[field] === 'string') {
      try {
        const url = new URL(body[field] as string)
        if (url.protocol !== 'https:' && url.protocol !== 'http:') {
          return { valid: false, error: `Invalid URL for ${field}` }
        }
      } catch {
        return { valid: false, error: `Invalid URL format for ${field}` }
      }
    }
  }
  
  // Validate color fields
  const colorFields = ['primaryColor', 'secondaryColor', 'accentColor', 'textColor']
  for (const field of colorFields) {
    if (body[field] && typeof body[field] === 'string') {
      const color = body[field] as string
      if (!/^#[0-9a-fA-F]{6}$/.test(color) && !color.startsWith('rgb')) {
        return { valid: false, error: `Invalid color format for ${field}` }
      }
    }
  }
  
  // Validate text lengths
  const maxLengths: Record<string, number> = {
    profileName: 100,
    profileMood: 100,
    profileBio: 500,
    musicTitle: 200,
    musicArtist: 200,
    aboutMeText: 2000,
    aiPersona: 5000,
    openrouterModel: 100
  }
  
  for (const [field, maxLen] of Object.entries(maxLengths)) {
    if (body[field] && typeof body[field] === 'string' && (body[field] as string).length > maxLen) {
      return { valid: false, error: `${field} is too long (max ${maxLen} characters)` }
    }
  }
  
  return { valid: true }
}

// GET site settings (public - hides sensitive fields)
export async function GET() {
  try {
    let settings = await db.siteSettings.findUnique({
      where: { id: 'site_settings' }
    })
    
    // Create default settings if not exist
    if (!settings) {
      settings = await db.siteSettings.create({
        data: { id: 'site_settings' }
      })
    }
    
    // Remove sensitive fields before returning
    const publicSettings = { ...settings }
    for (const field of SENSITIVE_FIELDS) {
      if (field in publicSettings) {
        // Show if key exists but not the actual key
        publicSettings[field] = publicSettings[field] ? '••••••••' : ''
      }
    }
    
    return NextResponse.json({ settings: publicSettings })
  } catch (error) {
    console.error('Get settings error:', error)
    return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 })
  }
}

// PUT update site settings (admin only)
export async function PUT(request: NextRequest) {
  try {
    const isAdmin = await checkAdminAuth()
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    
    // Validate input
    const validation = validateInput(body)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }
    
    // Extract YouTube ID from URL if provided
    if (body.musicYoutubeUrl) {
      const youtubeMatch = body.musicYoutubeUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
      if (youtubeMatch) {
        body.musicYoutubeId = youtubeMatch[1]
      }
      delete body.musicYoutubeUrl
    }
    
    // Fields that are allowed to be updated
    const allowedFields = [
      'profileName', 'profilePic', 'profileMood', 'profileBio',
      'musicTitle', 'musicArtist', 'musicAlbumArt', 'musicYoutubeId',
      'aboutMeImage', 'aboutMeText', 'meetImage',
      'backgroundImage', 'introGif',
      'primaryColor', 'secondaryColor', 'accentColor', 'textColor', 'bgColor',
      'openrouterApiKey', 'openrouterModel', 'aiPersona'
    ]
    
    const updateData: Record<string, unknown> = {}
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        updateData[key] = body[key]
      }
    }
    
    // Update settings
    const settings = await db.siteSettings.upsert({
      where: { id: 'site_settings' },
      update: updateData,
      create: { id: 'site_settings', ...updateData }
    })
    
    // Remove sensitive fields in response
    const publicSettings = { ...settings }
    for (const field of SENSITIVE_FIELDS) {
      if (field in publicSettings) {
        publicSettings[field] = publicSettings[field] ? '••••••••' : ''
      }
    }
    
    return NextResponse.json({ success: true, settings: publicSettings })
  } catch (error) {
    console.error('Update settings error:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
