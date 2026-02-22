// Chat API - Uses OpenRouter directly
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { cookies } from 'next/headers'

// Check if user is authenticated (either admin or regular user)
async function getAuthenticatedUser() {
  const cookieStore = await cookies()
  
  // Check admin auth
  const adminToken = cookieStore.get('admin_token')?.value
  if (adminToken) {
    const adminSession = await db.adminSession.findUnique({
      where: { token: adminToken }
    })
    if (adminSession && adminSession.expiresAt > new Date()) {
      return { type: 'admin', name: 'const.js', avatar: null }
    }
  }
  
  // Check user auth
  const userToken = cookieStore.get('user_token')?.value
  if (userToken) {
    const userSession = await db.userSession.findUnique({
      where: { token: userToken }
    })
    if (userSession && userSession.expiresAt > new Date()) {
      return { type: 'user', name: userSession.name, avatar: userSession.avatar }
    }
  }
  
  return null
}

// Sanitize message input
function sanitizeMessage(msg: string): string {
  return msg.slice(0, 2000).trim() // Limit to 2000 chars
}

// Get the site URL for OpenRouter referer
function getSiteUrl(): string {
  // Check various environment variables for production URL
  const vercelUrl = process.env.VERCEL_URL
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  const host = process.env.HOST
  
  if (vercelUrl) return `https://${vercelUrl}`
  if (siteUrl) return siteUrl
  if (host) return host
  
  // Fallback for development
  return 'http://localhost:3000'
}

// POST - Send message to AI via OpenRouter
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Please login to chat' },
        { status: 401 }
      )
    }
    
    const { message, history = [] } = await request.json()
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }
    
    // Sanitize and validate message
    const sanitizedMessage = sanitizeMessage(message)
    if (!sanitizedMessage) {
      return NextResponse.json(
        { error: 'Message cannot be empty' },
        { status: 400 }
      )
    }
    
    // Get AI settings from database
    const settings = await db.siteSettings.findUnique({
      where: { id: 'site_settings' }
    })
    
    if (!settings?.openrouterApiKey) {
      return NextResponse.json(
        { error: 'AI chat is not configured. Admin needs to add an OpenRouter API key in settings.' },
        { status: 503 }
      )
    }
    
    // Get model from settings
    const model = settings.openrouterModel || 'openai/gpt-4o-mini'
    
    // Build system prompt
    const systemPrompt = settings.aiPersona || `Your name is Const.js. Real name Adithyan M.P. You are 17, from Thrissur Kerala India. Born June 2008. Instagram: const.rb Discord: const.js. You code, watch anime, play games.

You MUST:
- Always remember your name is Const.js/Adithyan when asked
- Use lowercase always
- Say "bruh" normally (not "brugah" or weird variations)
- Keep responses very short, like 1 sentence
- Be chill, slightly bored/annoyed vibe
- Use "idk" "fr" "wtf" "dude" "like" casually
- Put "?" after confused statements: "huh ?" "wait what ?"

NEVER:
- Use emojis
- Say "hey there" "what's up" "how are you"
- Use exclamation marks (almost never)
- Act confused about who you are
- Write long responses
- Be overly helpful or friendly

Example good responses:
User: "who are you"
You: "im const.js bruh"
User: "hello"  
You: "yo"
User: "whats up"
You: "nothin much"
User: "can you help me"
You: "idk maybe, with what"`
    
    // Build messages array for OpenRouter
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt }
    ]
    
    // Add conversation history (limit to last 10 messages to control costs)
    if (Array.isArray(history)) {
      const limitedHistory = history.slice(-10)
      for (const msg of limitedHistory) {
        if (msg.role === 'user' || msg.role === 'assistant') {
          // Sanitize history messages too
          const sanitizedContent = sanitizeMessage(msg.content || '')
          if (sanitizedContent) {
            messages.push({ role: msg.role, content: sanitizedContent })
          }
        }
      }
    }
    
    // Add current message
    messages.push({ role: 'user', content: sanitizedMessage })
    
    // Call OpenRouter API directly
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${settings.openrouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': getSiteUrl(),
        'X-Title': 'Const.js MySpace Profile'
      },
      body: JSON.stringify({
        model: model,
        messages: messages
      })
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      // Log error without exposing API key
      console.error('OpenRouter error:', JSON.stringify({
        status: response.status,
        message: errorData.error?.message,
        code: errorData.error?.code
      }))
      
      // Handle specific OpenRouter errors
      const errorMessage = errorData.error?.message || 'Failed to get response from AI'
      const rawError = errorData.error?.metadata?.raw || ''
      
      // Rate limit
      if (response.status === 429 || errorMessage.includes('rate-limited')) {
        return NextResponse.json(
          { error: 'Model is rate limited. Try a different model (like gpt-4o-mini) or wait a minute.' },
          { status: 429 }
        )
      }
      
      // Data policy error
      if (errorMessage.includes('data policy') || errorMessage.includes('Zero data retention')) {
        return NextResponse.json(
          { error: 'Model doesn\'t support your privacy settings. Go to openrouter.ai/settings/privacy or try gpt-4o-mini.' },
          { status: 400 }
        )
      }
      
      // Provider error with details
      if (rawError) {
        return NextResponse.json(
          { error: rawError },
          { status: response.status }
        )
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    const aiResponse = data.choices?.[0]?.message?.content
    
    if (!aiResponse) {
      return NextResponse.json(
        { error: 'No response from AI' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      response: aiResponse,
      user: {
        name: user.name,
        avatar: user.avatar
      }
    })
    
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Failed to get response from AI. Please try again.' },
      { status: 500 }
    )
  }
}
