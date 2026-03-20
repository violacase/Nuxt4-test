# CLAUDE.md

## Stack
Vue 3 + Vite SPA · H3 standalone server · GraphQL Yoga (`/api/graphql`) · Drizzle ORM + postgres.js · reka-ui + shadcn-vue · Tailwind v4 (no config file) · Pinia · iron-session · vue-i18n · GraphQL Codegen

## E2E Type Chain — never break this
`Drizzle schema → GQL schema → Codegen → Vue` — `app/types/gql.ts` is auto-generated, never edit manually. Never write manual types for DB or GQL responses.

## Folder Structure
- `app/` = srcDir (`~` alias). `server/` at project root (`~~` alias).
- Components: `app/components/ui/` (shadcn-vue), `app/components/editor/` (Quill, client-only)
- Stores: `app/stores/` · Composables: `app/composables/` · Pages: `app/pages/`
- Router: `app/router/index.ts` (vue-router, manually configured)
- i18n setup: `app/i18n/index.ts` · Locale files: `i18n/locales/{en,nl}.json`
- DB: `server/db/schema/*.ts` · GQL schema: `server/graphql/schema/` · Resolvers: `server/graphql/resolvers/`
- Session lib: `server/lib/session.ts` (iron-session wrapper)

## Naming
- Components: `PascalCase.vue` · Composables: `useXxx.ts` · Stores/routes/schema/resolvers: `camelCase.ts` / `kebab-case.ts`
- DB tables: `snake_case` plural · columns: `snake_case` · Drizzle vars: `camelCase`
- GQL types: `PascalCase` · queries: `camelCase` · mutations: verb-first `camelCase` · inputs: `PascalCaseInput`

## Rules
- Never use Options API — always `<script setup lang="ts">`
- Never use `any` — use `unknown` and narrow
- Never hardcode connection strings — use `process.env` on the server; Vite auto-imports handle the client
- Never use raw Tailwind colors (`text-blue-500`) — semantic only (`text-foreground`, `bg-card`, etc.)
- Never create `tailwind.config.js` — Tailwind v4 is CSS-only
- Always use `cn()` from `~/lib/utils` for class merging
- Always wrap Quill in `<ClientOnly>`, sanitize HTML before storing (`sanitize-html`)
- Always protect server routes/resolvers with `requireSession(event)`
- Always namespace localStorage keys with `settings:`
- Always run `npm run codegen` after changing a GQL schema file
- Always run `npm run db:generate` after changing a Drizzle schema file
- Prefer Drizzle `returning()` over a second select after insert/update
- Pinia: always setup store syntax, never options syntax
- i18n: always `useI18n()`, never hardcode strings. Escape `@` as `{'@'}` in locale values

## Auth
- Client: `const { user, loggedIn, isAdmin, logout } = useAuth()` — wraps `useAuthStore()`
- Server guard: `await requireSession(event)` — from `~/lib/session`

## Colors (semantic only)
`bg-background` · `bg-card` · `text-foreground` · `text-muted-foreground` · `border-border` · `bg-primary` / `text-primary` (action blue) · `text-primary-foreground` · `bg-accent` · `text-destructive` · `ring-ring/30`

## Design System
**Always read `design-system.md` before generating any component or page.**
- Fonts: `font-serif` headings · `font-sans` UI · `font-mono` code
- Spacing: 4px base, multiples only
- Borders: `border border-border` on all cards
- Radius: `rounded-sm` inputs · `rounded-md` buttons/cards
- Buttons: `solid` / `outline` / `ghost` — one `solid` per view max
- Add shadcn-vue: `npx shadcn-vue@latest add <component>` → `app/components/ui/`
- UI with design: use `/design-component` · Structure only: use `/new-component`

## Commands
```bash
npm run dev          # Vite + H3 + codegen:watch (combined)
npm run build        # lint → codegen → typecheck → build
npm run codegen      # generate GQL types
npm run db:generate  # generate Drizzle migration
npm run db:migrate   # run migrations
npm run db:setup     # generate + migrate
npm run db:studio    # Drizzle Studio
npm run lint         # lint + fix
npm run typecheck    # vue-tsc
```

## Env vars (never commit, keep in .env.example)
`DATABASE_URL` · `NUXT_SESSION_PASSWORD` (min 32 chars, read by iron-session) · `NUXT_OAUTH_GITHUB_CLIENT_ID` · `NUXT_OAUTH_GITHUB_CLIENT_SECRET` · `NUXT_PUBLIC_APP_NAME` · `PORT`
