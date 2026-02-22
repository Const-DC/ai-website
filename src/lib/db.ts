import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { neonConfig, Pool } from '@neondatabase/serverless'

// Vercel Serverless Functions run in Node.js which has no native WebSocket.
// We must polyfill it for @neondatabase/serverless to work.
// On Edge Runtime (if you ever use it), remove this block — WebSocket is native there.
if (typeof WebSocket === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  neonConfig.webSocketConstructor = require('ws')
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      '❌ DATABASE_URL is not set. Add it to your .env file or Vercel environment variables.'
    )
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaNeon(pool)

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

// Singleton — reuse the same client across hot-reloads in dev
export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}
