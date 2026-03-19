// server/api/auth/password.patch.ts
import { defineEventHandler, createError, readBody } from 'h3'
import bcrypt from 'bcryptjs'
import { db } from '../../db/index.js'
import { users } from '../../db/schema/users.js'
import { eq } from 'drizzle-orm'
import { requireSession } from '../../lib/session.js'

export default defineEventHandler(async (event) => {
  const sessionUser = await requireSession(event)
  const body = await readBody<{ currentPassword: string; newPassword: string }>(event)

  if (!body.currentPassword || !body.newPassword) {
    throw createError({ statusCode: 400, message: 'currentPassword and newPassword are required' })
  }

  if (body.newPassword.length < 8) {
    throw createError({ statusCode: 400, message: 'Password must be at least 8 characters' })
  }

  const result = await db.select().from(users).where(eq(users.id, sessionUser.id)).limit(1)
  const user = result[0]

  if (!user) {
    throw createError({ statusCode: 404, message: 'User not found' })
  }

  if (!user.passwordHash) {
    throw createError({ statusCode: 400, message: 'No password set — use GitHub OAuth to sign in' })
  }

  const valid = await bcrypt.compare(body.currentPassword, user.passwordHash)
  if (!valid) {
    throw createError({ statusCode: 401, message: 'Current password is incorrect' })
  }

  const newHash = await bcrypt.hash(body.newPassword, 12)
  await db.update(users).set({ passwordHash: newHash, updatedAt: new Date() }).where(eq(users.id, user.id))

  return { ok: true }
})
