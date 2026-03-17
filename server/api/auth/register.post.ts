// server/api/auth/register.post.ts
import bcrypt from 'bcryptjs'
import { db } from '../../db'
import { users } from '../../db/schema/users'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email: string; name: string; password: string }>(event)

  if (!body.email || !body.name || !body.password) {
    throw createError({ statusCode: 400, message: 'email, name and password are required' })
  }

  if (body.password.length < 8) {
    throw createError({ statusCode: 400, message: 'Password must be at least 8 characters' })
  }

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, body.email))
    .limit(1)
  if (existing.length > 0) {
    throw createError({ statusCode: 409, message: 'Email already in use' })
  }

  const passwordHash = await bcrypt.hash(body.password, 12)

  const result = await db
    .insert(users)
    .values({
      email: body.email,
      name: body.name,
      passwordHash,
      emailVerified: false,
    })
    .returning()

  const user = result[0]!

  await setUserSession(event, {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      role: user.role,
      emailVerified: user.emailVerified,
    },
  })

  return { ok: true }
})
