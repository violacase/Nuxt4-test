import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',

  // Schema files — all domain schemas in one directory
  schema: './server/db/schema/*.ts',

  // Generated migrations output
  out: './server/db/migrations',

  dbCredentials: {
    url: process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/postgres',
  },

  // Verbose migration output
  verbose: true,

  // Safety check — prevents accidental destructive migrations
  strict: true,
})
