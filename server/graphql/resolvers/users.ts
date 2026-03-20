// server/graphql/resolvers/users.ts
import { db } from '../../db/index.js'
import { users } from '../../db/schema/users.js'
import { eq } from 'drizzle-orm'
import type { User } from '../../db/schema/users.js'
import type { H3Event } from 'h3'
import { getSession, requireSession } from '../../lib/session.js'

interface Context {
  event: H3Event
  user?: { id: string }
}

export const userResolvers = {
  Query: {
    me: async (_: unknown, _args: unknown, ctx: Context): Promise<User | null> => {
      const session = await getSession(ctx.event)
      if (!session?.user?.id) return null
      const result = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1)
      return result[0] ?? null
    },

    getUser: async (_: unknown, { id }: { id: string }, ctx: Context): Promise<User | null> => {
      await requireSession(ctx.event)
      const result = await db.select().from(users).where(eq(users.id, id)).limit(1)
      return result[0] ?? null
    },

    listUsers: async (_: unknown, _args: unknown, ctx: Context): Promise<User[]> => {
      await requireSession(ctx.event)
      return db.select().from(users)
    },
  },

  Mutation: {
    updateUser: async (
      _: unknown,
      { id, input }: { id: string; input: Partial<User> },
      ctx: Context,
    ): Promise<User> => {
      await requireSession(ctx.event)
      const result = await db
        .update(users)
        .set({ ...input, updatedAt: new Date() })
        .where(eq(users.id, id))
        .returning()
      if (!result[0]) throw new Error('User not found')
      return result[0]
    },

    deleteUser: async (_: unknown, { id }: { id: string }, ctx: Context): Promise<boolean> => {
      await requireSession(ctx.event)
      const result = await db.delete(users).where(eq(users.id, id)).returning()
      return result.length > 0
    },
  },
}
