---
name: new-gql-operation
description: "Scaffold a GraphQL operation file (.graphql) and trigger codegen. Use when the user asks to write a GraphQL query, mutation, or subscription for use in a Vue component or composable."
---

# Skill: New GQL Operation

## Rules
- Operation files use `.graphql` extension
- Place alongside the composable that uses them: `composables/usePost.graphql`
- Operation name must be unique across the whole codebase (codegen requirement)
- After creating/editing: run `npm run codegen` to regenerate `~/types/gql.ts`
- Import the document in the composable: `import MyDocument from './myComposable.graphql'`
- Use fragments for reused field sets

## Query Template

```graphql
# composables/use[Type].graphql
query Get[Type]($id: ID!) {
  get[Type](id: $id) {
    id
    # ... fields
    createdAt
    updatedAt
  }
}

query List[Type]s($limit: Int, $offset: Int) {
  list[Type]s(limit: $limit, offset: $offset) {
    id
    # ... fields
  }
}
```

## Mutation Template

```graphql
# composables/use[Type]Mutations.graphql
mutation Create[Type]($input: Create[Type]Input!) {
  create[Type](input: $input) {
    id
    # ... fields
  }
}

mutation Update[Type]($id: ID!, $input: Update[Type]Input!) {
  update[Type](id: $id, input: $input) {
    id
    # ... fields
  }
}

mutation Delete[Type]($id: ID!) {
  delete[Type](id: $id)
}
```

## Fragment Template (for reuse)

```graphql
fragment [Type]Fields on [Type] {
  id
  name
  createdAt
  updatedAt
}

query Get[Type]($id: ID!) {
  get[Type](id: $id) {
    ...[Type]Fields
  }
}
```

## Usage in Composable After Codegen

```ts
// composables/use[Type].ts
import type { Get[Type]Query, Get[Type]QueryVariables } from '~/types/gql'
import Get[Type]Document from './use[Type].graphql'

export function use[Type](id: MaybeRef<string>) {
  const { data, pending, error, refresh } = useAsyncQuery<Get[Type]Query>(
    Get[Type]Document,
    computed(() => ({ id: unref(id) }) satisfies Get[Type]QueryVariables)
  )

  return {
    [type]: computed(() => data.value?.get[Type] ?? null),
    isLoading: pending,
    error,
    refresh,
  }
}
```

## Steps

1. Ask: what entity, what operations (query/mutation/both)?
2. Check `server/graphql/schema/` to see available fields
3. Generate the `.graphql` file alongside the composable
4. Run: `npm run codegen`
5. Import the generated types in the composable
