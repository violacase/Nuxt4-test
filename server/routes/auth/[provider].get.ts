// server/routes/auth/[provider].get.ts
// Handles OAuth callback for all providers configured in .env
// Supported: github, google (add more in nuxt.config.ts runtimeConfig)
import { db } from '../../db'
import { users } from '../../db/schema/users'
import { eq } from 'drizzle-orm'

export default oauthEventHandler({
  // Called after successful OAuth — upsert user and set session
  async onSuccess(event, { user: oauthUser, tokens: _tokens }) {
    // Normalize provider data
    const email = oauthUser.email as string
    const name = (oauthUser.name ?? oauthUser.login ?? email) as string
    const avatarUrl = (oauthUser.avatar_url ?? oauthUser.picture ?? null) as string | null
    const provider = (event.context.oauth?.provider ?? 'unknown') as string
    const providerId = String(oauthUser.id ?? oauthUser.sub)

    // Upsert user
    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1)

    let user = existing[0]

    if (!user) {
      const result = await db
        .insert(users)
        .values({ email, name, avatarUrl, provider, providerId })
        .returning()
      user = result[0]
    } else {
      const result = await db
        .update(users)
        .set({ name, avatarUrl, updatedAt: new Date() })
        .where(eq(users.id, user.id))
        .returning()
      user = result[0]
    }

    // Set encrypted session
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

  onError(event, error) {
    console.error('OAuth error:', error)
    return sendRedirect(event, '/login?error=oauth')
  },
})
