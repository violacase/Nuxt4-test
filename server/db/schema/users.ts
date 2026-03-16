// server/db/schema/users.ts
import { pgTable, uuid, text, timestamp, pgEnum } from 'drizzle-orm/pg-core'

export const userRoleEnum = pgEnum('user_role', ['admin', 'member', 'guest'])

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),

  // OAuth identity
  provider: text('provider').notNull(),         // 'github' | 'google' etc.
  providerId: text('provider_id').notNull(),     // ID from OAuth provider

  // Profile
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),

  // Role
  role: userRoleEnum('role').default('member').notNull(),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ─── Inferred Types — use these everywhere, never redefine ───
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
