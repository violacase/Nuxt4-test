// server/api/auth/me.get.ts
import { defineEventHandler, createError } from 'h3'
import { getSession } from '../../lib/session.js'

export default defineEventHandler(async (event) => {
  const session = await getSession(event)
  if (!session.user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }
  return { user: session.user }
})
