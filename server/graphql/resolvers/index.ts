// server/graphql/resolvers/index.ts
// Merges all resolvers — add new resolver imports here as you create them
import { userResolvers } from './users'
// import { postResolvers } from './posts'

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    // ...postResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    // ...postResolvers.Mutation,
  },
}
