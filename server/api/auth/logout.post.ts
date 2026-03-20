// server/api/auth/logout.post.ts
import { defineEventHandler } from 'h3'
import { getSession } from '../../lib/session.js'

export default defineEventHandler(async (event) => {
  const session = await getSession(event)
  await session.destroy()
  return { ok: true }
})
