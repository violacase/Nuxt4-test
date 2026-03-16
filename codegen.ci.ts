import type { CodegenConfig } from '@graphql-codegen/cli'

// Used in CI — reads the committed schema.graphql instead of a live server.
// Locally: npm run codegen:ci
// CI:      see .github/workflows/ci.yml

const config: CodegenConfig = {
  schema: './schema.graphql',

  documents: ['app/composables/**/*.graphql'],
  ignoreNoDocuments: true,

  generates: {
    './app/types/gql.ts': {
      plugins: ['typescript', 'typescript-operations'],
      config: {
        useTypeImports: true,
        strictScalars: false,
        scalars: {
          UUID: 'string',
          DateTime: 'string',
          JSON: 'Record<string, unknown>',
        },
      },
    },
  },

  hooks: {
    afterAllFileWrite: ['prettier --write'],
  },
}

export default config
