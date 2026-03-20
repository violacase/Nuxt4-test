// server/routes/auth/github.get.ts
// GitHub OAuth — two handlers:
//   GET /auth/github          → redirect to GitHub
//   GET /auth/github/callback → exchange code, upsert user, set session
import { defineEventHandler, getCookie, setCookie, getQuery, sendRedirect } from 'h3'
import { GitHub, generateState } from 'arctic'
import { db } from '../../db/index.js'
import { users, oauthAccounts } from '../../db/schema/users.js'
import { eq, and } from 'drizzle-orm'
import { getSession } from '../../lib/session.js'

const github = new GitHub(
  process.env.NUXT_OAUTH_GITHUB_CLIENT_ID ?? '',
  process.env.NUXT_OAUTH_GITHUB_CLIENT_SECRET ?? '',
  process.env.GITHUB_CALLBACK_URL ?? 'http://localhost:3332/auth/github/callback',
)

// ── Step 1: redirect to GitHub ────────────────────────────────
export const githubHandler = defineEventHandler(async (event) => {
  const state = generateState()
  const url = github.createAuthorizationURL(state, ['user:email'])

  setCookie(event, 'github_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // 10 minutes
    path: '/',
  })

  return sendRedirect(event, url.toString())
})

// ── Step 2: handle callback ───────────────────────────────────
export const githubCallbackHandler = defineEventHandler(async (event) => {
  const query = getQuery(event)
  const code = query.code as string
  const state = query.state as string
  const storedState = getCookie(event, 'github_state')

  if (!code || !state || state !== storedState) {
    return sendRedirect(event, '/login?error=oauth')
  }

  try {
    const tokens = await github.validateAuthorizationCode(code)
    const accessToken = tokens.accessToken()

    // Fetch GitHub user profile
    const githubUserRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    })
    const githubUser = (await githubUserRes.json()) as {
      id: number
      login: string
      name: string | null
      email: string | null
      avatar_url: string
    }

    // Fetch primary verified email if not in public profile
    let email = githubUser.email
    if (!email) {
      const emailsRes = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      })
      const emails = (await emailsRes.json()) as Array<{
        email: string
        primary: boolean
        verified: boolean
      }>
      const primary = emails.find((e) => e.primary && e.verified)
      email = primary?.email ?? null
    }

    if (!email) {
      return sendRedirect(event, '/login?error=oauth')
    }

    const providerUserId = String(githubUser.id)
    const name = githubUser.name ?? githubUser.login
    const avatarUrl = githubUser.avatar_url ?? null

    // 1. Look up existing OAuth account
    const existingAccount = await db
      .select()
      .from(oauthAccounts)
      .where(
        and(eq(oauthAccounts.provider, 'github'), eq(oauthAccounts.providerUserId, providerUserId)),
      )
      .limit(1)

    let userId: string

    if (existingAccount[0]) {
      // OAuth account found — update user profile and reuse
      userId = existingAccount[0].userId
      await db
        .update(users)
        .set({ name, avatarUrl, updatedAt: new Date() })
        .where(eq(users.id, userId))
    } else {
      // No OAuth account — look up by email
      const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1)

      if (existingUser[0]) {
        // Link OAuth account to existing user
        userId = existingUser[0].id
        await db.insert(oauthAccounts).values({
          provider: 'github',
          providerUserId,
          userId,
          email,
        })
        await db
          .update(users)
          .set({ name, avatarUrl, updatedAt: new Date() })
          .where(eq(users.id, userId))
      } else {
        // New user — create user + OAuth account in a transaction
        const result = await db.transaction(async (tx) => {
          const [newUser] = await tx.insert(users).values({ email, name, avatarUrl }).returning()
          await tx.insert(oauthAccounts).values({
            provider: 'github',
            providerUserId,
            userId: newUser!.id,
            email,
          })
          return newUser!
        })
        userId = result.id
      }
    }

    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1)

    const session = await getSession(event)
    session.user = {
      id: user!.id,
      email: user!.email,
      name: user!.name,
      avatarUrl: user!.avatarUrl,
      role: user!.role,
      emailVerified: user!.emailVerified,
    }
    await session.save()

    return sendRedirect(event, '/')
  } catch (e) {
    console.error('GitHub OAuth error:', e)
    return sendRedirect(event, '/login?error=oauth')
  }
})
