import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  // Point at the running dev server GraphQL schema
  schema: 'http://localhost:3332/api/graphql',

  // Scan all .graphql operation files in composables/
  documents: ['app/composables/**/*.graphql'],
  ignoreNoDocuments: true,

  generates: {
    // Single output file — never edit manually
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

  // Watch mode config
  watch: true,
  watchConfig: {
    usePolling: false,
  },

  hooks: {
    afterAllFileWrite: ['prettier --write'],
  },
}

export default config
