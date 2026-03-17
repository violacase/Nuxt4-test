// server/api/auth/login.post.ts
import bcrypt from 'bcryptjs'
import { db } from '../../db'
import { users } from '../../db/schema/users'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email: string; password: string }>(event)

  if (!body.email || !body.password) {
    throw createError({ statusCode: 400, message: 'email and password are required' })
  }

  const result = await db.select().from(users).where(eq(users.email, body.email)).limit(1)
  const user = result[0]

  // Generic 401 — don't leak whether the email exists
  if (!user || !user.passwordHash) {
    throw createError({ statusCode: 401, message: 'Invalid credentials' })
  }

  const valid = await bcrypt.compare(body.password, user.passwordHash)
  if (!valid) {
    throw createError({ statusCode: 401, message: 'Invalid credentials' })
  }

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
