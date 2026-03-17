// server/api/health.get.ts
import { sql } from 'drizzle-orm'
import { db } from '../db'

export default defineEventHandler(async () => {
  try {
    await db.execute(sql`SELECT 1`)
    return { db: true }
  } catch {
    return { db: false }
  }
})
