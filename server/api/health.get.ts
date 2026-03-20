// server/api/health.get.ts
import { defineEventHandler } from 'h3'
import { sql } from 'drizzle-orm'
import { db } from '../db/index.js'

export default defineEventHandler(async () => {
  try {
    await db.execute(sql`SELECT 1`)
    return { db: true }
  } catch {
    return { db: false }
  }
})
