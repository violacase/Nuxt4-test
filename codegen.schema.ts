import type { CodegenConfig } from '@graphql-codegen/cli'

// Run this locally after changing any server/graphql/schema/*.ts file:
//   npm run codegen:schema
// Then commit the updated schema.graphql alongside your schema changes.
// Requires the dev server to be running: npm run dev

const config: CodegenConfig = {
  schema: 'http://localhost:3000/api/graphql',

  generates: {
    './schema.graphql': {
      plugins: ['schema-ast'],
      config: {
        includeDirectives: true,
      },
    },
  },
}

export default config
