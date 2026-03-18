// server/lib/session.ts
// Replaces nuxt-auth-utils session helpers using iron-session
import { getIronSession, type IronSession } from 'iron-session'
import { createError } from 'h3'
import type { H3Event } from 'h3'

export interface SessionUser {
  id: string
  email: string
  name: string
  avatarUrl: string | null
  role: 'admin' | 'member' | 'guest'
  emailVerified: boolean
}

export interface SessionData {
  user?: SessionUser
}

const sessionOptions = {
  password: process.env.NUXT_SESSION_PASSWORD!,
  cookieName: 'session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
  },
}

export async function getSession(event: H3Event): Promise<IronSession<SessionData>> {
  return getIronSession<SessionData>(event.node.req, event.node.res, sessionOptions)
}

export async function requireSession(event: H3Event): Promise<SessionUser> {
  const session = await getSession(event)
  if (!session.user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }
  return session.user
}
