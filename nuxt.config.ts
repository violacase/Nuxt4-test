import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',

  devtools: { enabled: true },

  // ─── Dev Server ─────────────────────────────────────────────
  devServer: {
    port: 3332,
  },

  // ─── Nitro (Node.js VPS deployment) ────────────────────────
  nitro: {
    preset: 'node-server',
  },

  // ─── Modules ────────────────────────────────────────────────
  modules: ['shadcn-nuxt', '@pinia/nuxt', '@nuxtjs/i18n', 'nuxt-auth-utils', '@vueuse/nuxt'],

  // ─── shadcn-vue ─────────────────────────────────────────────
  shadcn: {
    prefix: '',
    componentDir: '@/components/ui',
  },

  // ─── CSS ────────────────────────────────────────────────────
  css: ['~/assets/css/main.css'],

  // ─── Vite ───────────────────────────────────────────────────
  vite: {
    plugins: [tailwindcss()],
  },

  // ─── TypeScript ─────────────────────────────────────────────
  typescript: {
    strict: true,
    typeCheck: false, // run manually via `npm run typecheck`
  },

  // ─── i18n ───────────────────────────────────────────────────
  i18n: {
    locales: [
      { code: 'en', language: 'en-US', file: 'en.json', name: 'English' },
      { code: 'nl', language: 'nl-NL', file: 'nl.json', name: 'Nederlands' },
    ],
    defaultLocale: 'en',
    langDir: 'locales/',
    strategy: 'prefix_except_default',
  },

  // ─── Pinia ──────────────────────────────────────────────────
  pinia: {
    storesDirs: ['stores/**'],
  },

  // ─── Runtime Config ─────────────────────────────────────────
  runtimeConfig: {
    // Private — server-side only
    databaseUrl: process.env.DATABASE_URL,
    // Public — exposed to client
    public: {
      appName: process.env.NUXT_PUBLIC_APP_NAME ?? 'My App',
    },
  },

  // ─── Auto-imports ───────────────────────────────────────────
  imports: {
    dirs: ['composables/**'],
  },
})
