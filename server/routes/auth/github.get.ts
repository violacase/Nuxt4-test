// server/routes/auth/github.get.ts
// GitHub OAuth callback — auto-triggered at /auth/github
// Configure in .env: NUXT_OAUTH_GITHUB_CLIENT_ID, NUXT_OAUTH_GITHUB_CLIENT_SECRET
//
// To add another provider (e.g. Google), copy this file to google.get.ts
// and replace defineOAuthGitHubEventHandler with defineOAuthGoogleEventHandler.
// Each provider gets its own route file in nuxt-auth-utils@0.5+.

import type { H3Event } from 'h3'
import { db } from '../../db'
import { users } from '../../db/schema/users'
import { eq } from 'drizzle-orm'

export default defineOAuthGitHubEventHandler({
  config: {
    emailRequired: true,
  },

  async onSuccess(event: H3Event, { user: githubUser }) {
    const email = (githubUser.email ?? '') as string
    const name = (githubUser.name ?? githubUser.login) as string
    const avatarUrl = (githubUser.avatar_url ?? null) as string | null
    const providerId = String(githubUser.id)

    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1)

    let user = existing[0]

    if (!user) {
      const result = await db
        .insert(users)
        .values({ email, name, avatarUrl, provider: 'github', providerId })
        .returning()
      user = result[0]!
    } else {
      const result = await db
        .update(users)
        .set({ name, avatarUrl, updatedAt: new Date() })
        .where(eq(users.id, user.id))
        .returning()
      user = result[0]!
    }

    await setUserSession(event, {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        role: user.role,
      },
    })

    return sendRedirect(event, '/')
  },

  onError(event: H3Event, error) {
    console.error('GitHub OAuth error:', error)
    return sendRedirect(event, '/login?error=oauth')
  },
})
