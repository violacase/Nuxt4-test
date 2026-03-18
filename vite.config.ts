import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
        '@vueuse/core',
        {
          'vue-i18n': ['useI18n'],
          '@unhead/vue': ['useHead', 'useSeoMeta'],
        },
      ],
      dirs: ['./app/composables', './app/stores'],
      dts: './app/types/auto-imports.d.ts',
    }),
    Components({
      dirs: ['./app/components'],
      dts: './app/types/components.d.ts',
    }),
  ],
  root: '.',
  build: { outDir: 'dist' },
  resolve: {
    alias: {
      '~': resolve(__dirname, 'app'),
      '~~': resolve(__dirname, '.'),
      '@': resolve(__dirname, 'app'),
    },
  },
  server: {
    port: 3333,
    proxy: {
      '/api': 'http://localhost:3332',
      '/auth': 'http://localhost:3332',
    },
  },
})
