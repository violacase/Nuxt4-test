// server/graphql/schema/users.ts
export const userTypeDefs = /* GraphQL */ `
  enum UserRole {
    admin
    member
    guest
  }

  type User {
    id: UUID!
    email: String!
    name: String!
    avatarUrl: String
    role: UserRole!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input UpdateUserInput {
    name: String
    avatarUrl: String
  }

  extend type Query {
    me: User
    getUser(id: UUID!): User
    listUsers: [User!]!
  }

  extend type Mutation {
    updateUser(id: UUID!, input: UpdateUserInput!): User!
    deleteUser(id: UUID!): Boolean!
  }
`
