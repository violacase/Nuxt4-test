// server/graphql/schema/index.ts
// Merges all GraphQL type definitions into a single schema string
// Add an import + spread for every new schema file you create

import { userTypeDefs } from './users'
// import { postTypeDefs } from './posts'

export const typeDefs = /* GraphQL */ `
  scalar DateTime
  scalar UUID
  scalar JSON

  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }

  ${userTypeDefs}
`
