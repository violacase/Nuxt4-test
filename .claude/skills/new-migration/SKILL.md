---
name: new-migration
description: "Scaffold a new Drizzle ORM schema file and generate a migration. Use when the user asks to create a database table, add a column, change a schema, or run a migration."
---

# Skill: New Migration

## Rules
- Schema files live in `server/db/schema/[domain].ts`
- Always export inferred types: `type X = typeof table.$inferSelect`
- Table names: `snake_case` plural — e.g. `blog_posts`
- Column names: `snake_case` — e.g. `created_at`
- Always include `id` (uuid), `createdAt`, `updatedAt` unless explicitly not needed
- After editing schema: run `npm run db:generate` then `npm run db:migrate`
- Never edit migration files manually — regenerate instead

## Schema Template

```ts
// server/db/schema/[domain].ts
import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  // jsonb,
  // pgEnum,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Optional: define enums
// export const statusEnum = pgEnum('status', ['draft', 'published', 'archived'])

export const [tableName] = pgTable('[table_name]', {
  id: uuid('id').defaultRandom().primaryKey(),

  // --- your columns here ---
  name: text('name').notNull(),
  description: text('description'),
  isActive: boolean('is_active').default(true).notNull(),

  // --- timestamps (always include) ---
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Relations (add if this table has FK relationships)
// export const [tableName]Relations = relations([tableName], ({ one, many }) => ({
//   author: one(users, { fields: [[tableName].userId], references: [users.id] }),
// }))

// Inferred TypeScript types — use these everywhere, never redefine manually
export type [Type] = typeof [tableName].$inferSelect
export type New[Type] = typeof [tableName].$inferInsert
```

## Common Column Types

```ts
// Text
title: text('title').notNull()
slug: text('slug').notNull().unique()
content: text('content')              // HTML from Quill

// Numbers
order: integer('order').default(0)
price: numeric('price', { precision: 10, scale: 2 })

// Boolean
isPublished: boolean('is_published').default(false).notNull()

// JSON
metadata: jsonb('metadata')

// Foreign key
userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' })

// Enum
status: statusEnum('status').default('draft').notNull()
```

## Steps

1. Ask: what table/entity? What columns? Any foreign keys?
2. Generate the schema file following the template
3. Export the inferred types
4. Run: `npm run db:generate` — review the generated SQL
5. Run: `npm run db:migrate` — apply to the database
6. Remind: if adding to an existing domain, also update `server/db/index.ts` if needed
