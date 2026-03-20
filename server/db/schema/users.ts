// server/db/schema/users.ts
import { pgTable, uuid, text, timestamp, pgEnum, boolean, primaryKey } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const userRoleEnum = pgEnum('user_role', ['admin', 'member', 'guest'])

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),

  // Profile
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),

  // Auth
  emailVerified: boolean('email_verified').default(false).notNull(),
  passwordHash: text('password_hash'), // null for OAuth-only users

  // Role
  role: userRoleEnum('role').default('member').notNull(),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const oauthAccounts = pgTable(
  'oauth_accounts',
  {
    provider: text('provider').notNull(), // 'github' | 'google' etc.
    providerUserId: text('provider_user_id').notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    // Profile from provider
    email: text('email'),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    expiresAt: timestamp('expires_at'),

    // Timestamps
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.provider, t.providerUserId] })],
)

// ─── Relations ───────────────────────────────────────────────
export const usersRelations = relations(users, ({ many }) => ({
  oauthAccounts: many(oauthAccounts),
}))

export const oauthAccountsRelations = relations(oauthAccounts, ({ one }) => ({
  user: one(users, {
    fields: [oauthAccounts.userId],
    references: [users.id],
  }),
}))

// ─── Inferred Types — use these everywhere, never redefine ───
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type OauthAccount = typeof oauthAccounts.$inferSelect
export type NewOauthAccount = typeof oauthAccounts.$inferInsert
