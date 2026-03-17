// server/routes/auth/github.get.ts
// GitHub OAuth callback — auto-triggered at /auth/github
// Configure in .env: NUXT_OAUTH_GITHUB_CLIENT_ID, NUXT_OAUTH_GITHUB_CLIENT_SECRET
//
// To add another provider (e.g. Google), copy this file to google.get.ts
// and replace defineOAuthGitHubEventHandler with defineOAuthGoogleEventHandler.
// Each provider gets its own route file in nuxt-auth-utils@0.5+.

import type { H3Event } from 'h3'
import { db } from '../../db'
import { users, oauthAccounts } from '../../db/schema/users'
import { eq, and } from 'drizzle-orm'

export default defineOAuthGitHubEventHandler({
  config: {
    emailRequired: true,
  },

  async onSuccess(event: H3Event, { user: githubUser }) {
    const email = (githubUser.email ?? '') as string
    const name = (githubUser.name ?? githubUser.login) as string
    const avatarUrl = (githubUser.avatar_url ?? null) as string | null
    const providerUserId = String(githubUser.id)

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

    await setUserSession(event, {
      user: {
        id: user!.id,
        email: user!.email,
        name: user!.name,
        avatarUrl: user!.avatarUrl,
        role: user!.role,
        emailVerified: user!.emailVerified,
      },
    })

    return sendRedirect(event, '/')
  },

  onError(event: H3Event, error) {
    console.error('GitHub OAuth error:', error)
    return sendRedirect(event, '/login?error=oauth')
  },
})
