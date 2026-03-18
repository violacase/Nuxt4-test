// server/api/graphql.ts
// Single GraphQL endpoint — all queries and mutations go through here
import { defineEventHandler, toWebRequest, sendWebResponse } from 'h3'
import { createYoga } from 'graphql-yoga'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { typeDefs } from '../graphql/schema/index.js'
import { resolvers } from '../graphql/resolvers/index.js'

const schema = makeExecutableSchema({ typeDefs, resolvers })

const yoga = createYoga({
  schema,
  // Pass H3 event to resolver context for session access
  context: ({ request }) => {
    return { event: (request as unknown as { event: unknown }).event }
  },
  // GraphQL Playground in dev
  graphiql: process.env.NODE_ENV === 'development',
  batching: false,
})

export default defineEventHandler(async (event) => {
  // Attach H3 event to request so context function can access it
  const request = toWebRequest(event)
  ;(request as unknown as { event: typeof event }).event = event

  const response = await yoga.handleRequest(request, {})
  return sendWebResponse(event, response)
})
