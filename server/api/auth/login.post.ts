// server/api/auth/login.post.ts
import { defineEventHandler, createError, readBody } from 'h3'
import bcrypt from 'bcryptjs'
import { db } from '../../db/index.js'
import { users } from '../../db/schema/users.js'
import { eq } from 'drizzle-orm'
import { getSession } from '../../lib/session.js'

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

  const session = await getSession(event)
  session.user = {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    role: user.role,
    emailVerified: user.emailVerified,
  }
  await session.save()

  return { ok: true }
})
