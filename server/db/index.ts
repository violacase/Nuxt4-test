// server/db/index.ts
// Single Postgres connection — imported by all resolvers and server routes
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Prevent multiple connections in dev (hot reload)
const globalForDb = globalThis as unknown as { db: ReturnType<typeof drizzle> }

function createDb() {
  const config = useRuntimeConfig()
  const client = postgres(config.databaseUrl as string, {
    max: 10, // connection pool size
    idle_timeout: 30, // seconds before idle connection is closed
    connect_timeout: 10,
  })
  return drizzle(client, { schema, logger: process.env.NODE_ENV === 'development' })
}

export const db = globalForDb.db ?? createDb()

if (process.env.NODE_ENV === 'development') {
  globalForDb.db = db
}
