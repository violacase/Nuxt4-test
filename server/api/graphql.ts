// server/api/graphql.ts
// Single GraphQL endpoint — all queries and mutations go through here
import { createYoga } from 'graphql-yoga'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { typeDefs } from '../graphql/schema'
import { resolvers } from '../graphql/resolvers'

const schema = makeExecutableSchema({ typeDefs, resolvers })

const yoga = createYoga({
  schema,
  // Pass H3 event to resolver context for session access
  context: ({ request }) => {
    // H3Event is attached by the Nitro adapter
    return { event: (request as unknown as { event: unknown }).event }
  },
  // GraphQL Playground in dev
  graphiql: process.env.NODE_ENV === 'development',
  // Disable batching for simplicity — enable if needed
  batching: false,
})

export default defineEventHandler(async (event) => {
  // Attach H3 event to request for context access
  const request = toWebRequest(event)
  ;(request as unknown as { event: typeof event }).event = event

  const response = await yoga.handleRequest(request, {})
  return sendWebResponse(event, response)
})
