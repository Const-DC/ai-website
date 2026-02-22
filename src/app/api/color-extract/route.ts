// Color Extraction API - Extracts dominant color from an image URL
import { NextRequest, NextResponse } from 'next/server'

interface ColorResult {
  hex: string
  rgb: { r: number; g: number; b: number }
}

// Block internal/private IP ranges to prevent SSRF
function isBlockedIP(hostname: string): boolean {
  const blockedRanges = [
    /^localhost$/i,
    /^127\./,
    /^10\./,
    /^192\.168\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    /^0\.0\.0\.0$/,
    /^169\.254\./, // AWS metadata
    /^::1$/, // IPv6 localhost
    /^fc00:/i, // IPv6 private
    /^fe80:/i, // IPv6 link-local
  ]
  
  return blockedRanges.some(regex => regex.test(hostname))
}

// Validate URL is safe for fetching
function isValidImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    
    // Only allow HTTPS
    if (parsed.protocol !== 'https:') {
      return false
    }
    
    // Block internal IPs
    if (isBlockedIP(parsed.hostname)) {
      return false
    }
    
    // Block suspicious ports
    const port = parsed.port || (parsed.protocol === 'https:' ? '443' : '80')
    const blockedPorts = ['22', '23', '25', '21', '3306', '5432', '6379', '27017', '9200', '11211']
    if (blockedPorts.includes(port)) {
      return false
    }
    
    // Only allow image hosting domains or common CDNs
    const allowedDomains = [
      // Image hosting
      'tenor.com', 'media.tenor.com',
      'imgur.com', 'i.imgur.com',
      'giphy.com', 'media.giphy.com',
      'pinimg.com', 'i.pinimg.com',
      'tumblr.com', '64.media.tumblr.com',
      'reddit.com', 'i.redd.it',
      // CDNs
      'cloudinary.com', 'res.cloudinary.com',
      'amazonaws.com',
      'cloudfront.net',
      'cdn.',
      // General
      '.jpg', '.jpeg', '.png', '.gif', '.webp'
    ]
    
    const hostname = parsed.hostname.toLowerCase()
    const isAllowed = allowedDomains.some(domain => 
      hostname.includes(domain) || hostname.endsWith(domain.replace('.', ''))
    )
    
    // Also check path for image extension
    const path = parsed.pathname.toLowerCase()
    const hasImageExt = /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(path)
    
    return isAllowed || hasImageExt
  } catch {
    return false
  }
}

// Simple color extraction using canvas-like logic
async function extractDominantColor(imageUrl: string): Promise<ColorResult | null> {
  try {
    // Limit fetch size to prevent memory issues
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000) // 5 second timeout
    
    const response = await fetch(imageUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ColorExtractor/1.0)'
      }
    })
    clearTimeout(timeout)
    
    if (!response.ok) return null
    
    // Check content length (limit to 5MB)
    const contentLength = response.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > 5 * 1024 * 1024) {
      return null
    }
    
    const arrayBuffer = await response.arrayBuffer()
    
    // Limit buffer size
    if (arrayBuffer.byteLength > 5 * 1024 * 1024) {
      return null
    }
    
    const buffer = Buffer.from(arrayBuffer)
    const bytes = new Uint8Array(buffer)
    
    let r = 0, g = 0, b = 0, count = 0
    const sampleRate = Math.max(1, Math.floor(bytes.length / 10000))
    
    // Start after potential header
    const startOffset = Math.min(1000, bytes.length - 100)
    
    for (let i = startOffset; i < bytes.length - 3; i += sampleRate) {
      const pixelR = bytes[i]
      const pixelG = bytes[i + 1]
      const pixelB = bytes[i + 2]
      
      const brightness = (pixelR + pixelG + pixelB) / 3
      
      // Skip very dark and very light pixels
      if (brightness > 30 && brightness < 225) {
        r += pixelR
        g += pixelG
        b += pixelB
        count++
      }
    }
    
    if (count === 0) return null
    
    r = Math.round(r / count)
    g = Math.round(g / count)
    b = Math.round(b / count)
    
    // Slightly darken for better border appearance
    r = Math.round(r * 0.7)
    g = Math.round(g * 0.7)
    b = Math.round(b * 0.7)
    
    const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
    
    return { hex, rgb: { r, g, b } }
  } catch (error) {
    console.error('Color extraction error:', error)
    return null
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const imageUrl = searchParams.get('url')
  
  if (!imageUrl) {
    return NextResponse.json({ error: 'Image URL required' }, { status: 400 })
  }
  
  // Validate URL to prevent SSRF
  if (!isValidImageUrl(imageUrl)) {
    return NextResponse.json({ 
      hex: '#1a0a2e', 
      rgb: { r: 26, g: 10, b: 46 },
      fallback: true 
    })
  }
  
  try {
    const color = await extractDominantColor(imageUrl)
    
    if (!color) {
      return NextResponse.json({ 
        hex: '#1a0a2e', 
        rgb: { r: 26, g: 10, b: 46 },
        fallback: true 
      })
    }
    
    // Cache for 1 hour
    return NextResponse.json(color, {
      headers: {
        'Cache-Control': 'public, max-age=3600'
      }
    })
  } catch (error) {
    console.error('Color extraction error:', error)
    return NextResponse.json({ 
      hex: '#1a0a2e', 
      rgb: { r: 26, g: 10, b: 46 },
      fallback: true 
    })
  }
}
