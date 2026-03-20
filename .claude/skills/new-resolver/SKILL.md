---
name: new-resolver
description: "Scaffold a new GraphQL Yoga resolver with Drizzle ORM query. Use when the user asks to create a GraphQL query, mutation, resolver, or any server-side data operation."
---

# Skill: New Resolver

## Rules
- Resolvers live in `server/graphql/resolvers/[domain].ts`
- Types are inferred from Drizzle — never redefined manually
- Always protect with `requireUserSession(event)` unless explicitly public
- Always use Drizzle `returning()` after insert/update instead of a second select
- Handle errors with typed throws
- Export a resolver map object, imported and merged in `server/api/graphql.ts`

## Resolver Template

```ts
// server/graphql/resolvers/[domain].ts
import { db } from '../db'
import { [table] } from '../db/schema/[domain]'
import { eq, desc } from 'drizzle-orm'
import type { [Type], New[Type] } from '../db/schema/[domain]'
import type { H3Event } from 'h3'

interface Context {
  event: H3Event
  user?: { id: string }
}

export const [domain]Resolvers = {
  Query: {
    get[Type]: async (_: unknown, { id }: { id: string }, ctx: Context): Promise<[Type]> => {
      await requireUserSession(ctx.event)
      const result = await db
        .select()
        .from([table])
        .where(eq([table].id, id))
        .limit(1)
      if (!result[0]) throw new Error('[Type] not found')
      return result[0]
    },

    list[Type]s: async (_: unknown, _args: unknown, ctx: Context): Promise<[Type][]> => {
      await requireUserSession(ctx.event)
      return db.select().from([table]).orderBy(desc([table].createdAt))
    },
  },

  Mutation: {
    create[Type]: async (
      _: unknown,
      { input }: { input: New[Type] },
      ctx: Context
    ): Promise<[Type]> => {
      await requireUserSession(ctx.event)
      const result = await db.insert([table]).values(input).returning()
      return result[0]
    },

    update[Type]: async (
      _: unknown,
      { id, input }: { id: string; input: Partial<New[Type]> },
      ctx: Context
    ): Promise<[Type]> => {
      await requireUserSession(ctx.event)
      const result = await db
        .update([table])
        .set({ ...input, updatedAt: new Date() })
        .where(eq([table].id, id))
        .returning()
      if (!result[0]) throw new Error('[Type] not found')
      return result[0]
    },

    delete[Type]: async (
      _: unknown,
      { id }: { id: string },
      ctx: Context
    ): Promise<boolean> => {
      await requireUserSession(ctx.event)
      const result = await db.delete([table]).where(eq([table].id, id)).returning()
      return result.length > 0
    },
  },
}
```

## Steps

1. Ask: what domain/entity? What operations are needed (CRUD or specific)?
2. Check `server/db/schema/` for the existing Drizzle table definition
3. Generate resolver following the template
4. Remind: also add corresponding GraphQL type definitions in `server/graphql/schema/`
5. Remind: merge resolver into the root resolver in `server/api/graphql.ts`
6. Remind: run `npm run codegen` to regenerate types
