import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import prettierConfig from '@vue/eslint-config-prettier'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },
  {
    name: 'app/files-to-ignore',
    ignores: [
      '**/dist/**',
      '**/.nuxt/**',
      '**/.output/**',
      '**/node_modules/**',
      'app/types/gql.ts', // auto-generated — never lint
    ],
  },
  pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,
  prettierConfig,
  {
    rules: {
      // Vue
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],
      'vue/define-macros-order': ['error', {
        order: ['defineOptions', 'defineProps', 'defineEmits', 'defineSlots'],
      }],
      'vue/no-unused-vars': 'error',
      'vue/no-v-html': 'warn', // warn not error — intentional v-html for Quill content

      // TypeScript
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-import-type-side-effects': 'error',

      // General
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
)
