# Nuxt Starter Kit — Reference Guide
*March 2026 · Kit version: v4*

---

## 1. Introduction

This document is the authoritative reference for the Claude Code starter kit for Nuxt 4 full-stack projects. It describes every architectural decision, the complete technology stack, the five-layer Claude Code intelligence setup, and the rules that govern how code is generated from this scaffold.

The goal: allow Claude Code to understand, extend, and scaffold code in a consistent style from the very first prompt — with zero manual type writing, zero drift between layers, and every major architectural and visual decision documented and enforced.

The kit includes a full frontend design system, making Claude Code capable of producing visually intentional, production-grade UI — not just structurally correct scaffolding.

---

## 2. Key Decisions Made

### 2.1 Framework — Nuxt 4 (one repo)

**Nuxt 4** was chosen. The critical Nuxt 4 change is that `app/` is now the `srcDir` — all Vue app code (components, pages, stores, composables, layouts, locales, assets) lives under `app/`. The `server/` directory stays at the project root. The `~` alias resolves to `app/`; `~~` resolves to the project root.

Nuxt's Nitro server allows the frontend and backend to live in a single repository, creating an end-to-end TypeScript type chain with no shared-package glue.

### 2.2 Data Layer — Drizzle ORM + GraphQL Yoga

Drizzle ORM was selected over Prisma for its TypeScript-first schema-as-code approach and its lightweight runtime footprint, which suits Nitro deployments. GraphQL Yoga was selected over Apollo Server and Mercurius because it runs natively as a single Nuxt server route with no framework coupling.

### 2.3 End-to-End Type Safety

The most important architectural principle is the unbroken type chain:

```
Postgres (port 5432)
  → Drizzle schema        [server/db/schema/*.ts]
    → GraphQL schema      [server/graphql/schema/*.ts]
      → GraphQL Codegen   [auto-generates app/types/gql.ts]
        → Vue components  [fully typed queries + mutations]
```

GraphQL Code Generator runs in watch mode during development, automatically regenerating `app/types/gql.ts` whenever a schema file or `.graphql` operation file changes. No manual type writing at any layer.

### 2.4 UI — shadcn-vue + reka-ui + Tailwind CSS v4

**shadcn-vue** is used as the component system, built on **reka-ui** primitives. This gives the best of both worlds: pre-built, production-quality components that can be fully customised — with no inherited visual opinions locked behind an npm package.

shadcn-vue works by copying component source into `app/components/ui/` via the CLI (`npx shadcn-vue@latest add button`). You own every line.

**Tailwind v4** integrates as a Vite plugin (`@tailwindcss/vite`) with no `tailwind.config.js` file. All design tokens are CSS custom properties in `app/assets/css/main.css`. The `@theme inline` directive maps them to Tailwind semantic utility classes (`bg-background`, `text-foreground`, `border-border`, etc.).

**The `cn()` helper** at `app/lib/utils.ts` merges Tailwind classes conditionally using `clsx` + `tailwind-merge`. Every component uses it.

### 2.5 User Settings — Pinia + useLocalStorage

After evaluating three patterns (single composable, separate composables per concern, and Pinia synced to localStorage), the Pinia approach was selected. It provides Vue DevTools support, a single central `reset()` action, and consistent patterns with the rest of the state layer, while VueUse's `useLocalStorage` handles SSR hydration automatically. All keys are namespaced with `settings:` to avoid localStorage collisions.

### 2.6 Rich Text — @vueup/vue-quill

Quill is required for rich text editing across articles, comments, and form fields. `@vueup/vue-quill` was chosen over raw Quill for its native Vue 3 v-model support and correct handling of the SSR constraint (Quill requires the DOM and must always be wrapped in `<ClientOnly>`). Content is stored as an HTML string in Postgres `text` columns. Server-side sanitisation with `sanitize-html` is mandated before any HTML is stored.

### 2.7 Authentication — nuxt-auth-utils (OAuth)

OAuth-based login via `nuxt-auth-utils` was selected. The OAuth callback route upserts users into the `users` table on first login, then sets an encrypted server-side session. GitHub and Google are pre-configured; additional providers require only new environment variables.

### 2.8 TypeScript Strictness — Balanced

A "balanced strict" tsconfig was defined: `strict: true` is enabled, but `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` are disabled. These two settings cause the most friction in typical application code without proportional safety benefit. `noUnusedLocals` and `noUnusedParameters` are enabled.

### 2.9 Frontend Design System

A dedicated `design-system.md` was added to the project root. This is not a style guide document — it is a machine-readable design contract that Claude Code reads before generating any component or page. The aesthetic direction is **professional, structured, refined, minimal**. The system defines fonts, color tokens, spacing scale, shape rules, shadow usage, and motion philosophy in explicit, prohibitive terms that prevent Claude from defaulting to generic AI aesthetics.

---

## 3. The Five-Layer Claude Code Setup

The starter kit is organised into five layers that together give Claude Code complete project intelligence before a single line of application code is written.

| # | Layer | Role |
|---|---|---|
| 1 | `CLAUDE.md` | The project brain — auto-loaded every session. Contains stack, folder conventions, naming rules, patterns for every layer, design system reference, and strict do/do-not rules. |
| 2 | `.claude/settings.json` | Pre-approves safe bash operations (nuxi, drizzle-kit, codegen, lint) so Claude does not pause to ask permission for routine tasks. |
| 3 | `.claude/mcp.json` | Connects Claude Code to the local Postgres instance on port 5432 via the MCP Postgres server. Gives Claude live schema awareness without copy-pasting table definitions. |
| 4 | `.claude/skills/` | Ten slash-command skills that scaffold code in the exact project style — covering structure, data, and visual design. |
| 5 | Folder scaffold | ~48 base files covering the full stack — config, server routes, resolvers, stores, composables, components, design tokens, locales, and setup script. |

---

## 4. Full Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Nuxt 4 — full-stack, one repo, `app/` as srcDir |
| **GraphQL** | GraphQL Yoga + GraphQL Code Generator |
| **ORM** | Drizzle ORM + postgres.js |
| **Database** | PostgreSQL on `localhost:5432` |
| **UI** | shadcn-vue (new-york style) + reka-ui + Tailwind CSS v4 |
| **CSS** | Tailwind v4 via `@tailwindcss/vite` — no config file — `@theme inline` + OKLCH tokens |
| **Component Utility** | `cn()` in `app/lib/utils.ts` — clsx + tailwind-merge |
| **Rich Text** | @vueup/vue-quill (client-only, SSR-safe) |
| **State** | Pinia v3 + @pinia/nuxt (setup store syntax) |
| **User Settings** | Pinia store + VueUse `useLocalStorage` |
| **i18n** | @nuxtjs/i18n v10 (EN + NL out of the box) |
| **Auth** | nuxt-auth-utils (OAuth — GitHub, Google) |
| **Type Safety** | GraphQL Codegen (watch mode) + balanced strict tsconfig |
| **Linting** | ESLint v9 flat config + typescript-eslint + Prettier |
| **Design System** | `design-system.md` + CSS custom properties (warm stone palette, OKLCH) |
| **Fonts** | DM Serif Display (`font-serif`) + DM Sans (`font-sans`) + JetBrains Mono (`font-mono`) |
| **Icons** | lucide-vue-next |
| **Deployment** | Node.js VPS — Nitro `node-server` preset |

---

## 5. Design System

### 5.1 Philosophy

The design system follows one core principle: **precision over decoration**. Every element earns its place. Whitespace is structural, not accidental. Color communicates hierarchy, not decoration. Motion is purposeful — it explains, confirms, guides — never purely ornamental.

The aesthetic direction: **professional · structured · refined · minimal**.

### 5.2 Typography

| Role | Tailwind class | Font | When to use |
|---|---|---|---|
| Display / Headings | `font-serif` | DM Serif Display | Page titles, section headings, hero text |
| UI / Body | `font-sans` | DM Sans | Everything else — labels, body copy, buttons, nav |
| Monospace | `font-mono` | JetBrains Mono | Code, IDs, technical values |

Font families are defined in `@theme inline` in `app/assets/css/main.css`, overriding Tailwind's defaults.

Key rules:
- `font-serif` is never used below `text-xl` (1.25rem)
- `font-sans` never uses `font-bold` or weight above 500 — it reads as shouting
- Italics in DM Serif Display are beautiful — use them for emphasis in headings
- Letter-spacing: `tracking-tight` on display sizes, `tracking-widest` on all-caps labels

### 5.3 Color Tokens

Colors use **shadcn-vue's semantic token naming**. The system has three layers:

```
:root / .dark      → raw OKLCH values     (e.g. --background: oklch(0.989 0.003 75))
@theme inline      → Tailwind mapping     (e.g. --color-background: var(--background))
Component classes  → Tailwind utilities   (e.g. bg-background, text-foreground)
```

**Critical rule:** `text-primary` / `bg-primary` is the **action color** (blue buttons, links). It is **not** the body text color. Body text = `text-foreground`.

#### Light Mode

| CSS token | Tailwind class | Value | Usage |
|---|---|---|---|
| `--background` | `bg-background` | `#FAFAF9` (warm off-white) | Page background |
| `--foreground` | `text-foreground` | `#1C1917` (near-black) | Primary text, headings |
| `--card` | `bg-card` | `#FFFFFF` | Cards, panels, raised surfaces |
| `--card-foreground` | `text-card-foreground` | same as foreground | Text on cards |
| `--border` | `border-border` | `#E5E3DF` | Dividers, outlines |
| `--input` | `border-input` | `#E5E3DF` | Input borders |
| `--muted` | `bg-muted` | subtle warm bg | Muted area backgrounds |
| `--muted-foreground` | `text-muted-foreground` | `#9C9890` | Placeholder, meta, disabled text |
| `--primary` | `bg-primary` / `text-primary` | `#2563EB` (blue) | Interactive elements — buttons, links |
| `--primary-foreground` | `text-primary-foreground` | white | Text on primary backgrounds |
| `--secondary` | `bg-secondary` | subtle warm bg | Secondary button background |
| `--secondary-foreground` | `text-secondary-foreground` | dark | Text on secondary bg |
| `--accent` | `bg-accent` | subtle warm bg | Hover state backgrounds |
| `--accent-foreground` | `text-accent-foreground` | dark | Text on accent bg |
| `--destructive` | `bg-destructive` / `text-destructive` | `#DC2626` | Errors, danger actions |
| `--ring` | `ring-ring` | blue | Focus rings (use `ring-ring/30`) |
| `--success` | `text-success` | `#16A34A` | Success states (custom token) |
| `--success-subtle` | `bg-success-subtle` | `#F0FDF4` | Success background (custom token) |
| `--warning` | `text-warning` | `#D97706` | Warning states (custom token) |
| `--warning-subtle` | `bg-warning-subtle` | `#FFFBEB` | Warning background (custom token) |
| `--danger-subtle` | `bg-danger-subtle` | `#FEF2F2` | Danger background (custom token) |

Dark mode overrides all tokens — `--primary` lightens from `#2563EB` to `#3B82F6` (it's on a dark ground).

All color values are in OKLCH for perceptually uniform color transitions.

#### Usage Rules
- `background` is the page. `card` is anything raised from the page (cards, dropdowns, modals).
- `primary` **only** appears on interactive elements: buttons, links, focus rings, active states.
- **Never** use `primary` as a background for large areas.
- **Never** use raw Tailwind color classes (`text-blue-500`, `bg-gray-100`).
- **Never** use the old naming: `--color-canvas`, `--color-surface`, `--color-primary` (as text). Those no longer exist.

### 5.4 Spacing & Shape

- Base unit: `4px`. All spacing is a multiple. Odd Tailwind values (`p-5`, `p-7`) are forbidden.
- Border radius: inputs use `rounded-sm` (4px — precise), buttons/cards use `rounded-md` (8px), modals use `rounded-lg` (12px). `rounded-full` is never used on cards or inputs.
- Borders: `border border-border` — cards always have a border. Shadow alone is not sufficient contrast on `bg-background`.
- Radius values are defined in `@theme inline`, overriding Tailwind's defaults: `rounded-sm` = 4px, `rounded-md` = 8px, `rounded-lg` = 12px, `rounded-xl` = 16px.

### 5.5 Motion

Motion is **context-dependent** — the `/design-component` skill decides per component. Duration tokens range from `75ms` (instant state toggles) to `500ms` (deliberate page-level reveals). Easing uses `cubic-bezier(0.16, 1, 0.3, 1)` as the default — snappy with a slight spring.

Motion tokens (`--duration-*`, `--ease-*`) are CSS custom properties in `:root`. `tw-animate-css` provides the `animate-in`/`animate-out` Tailwind utilities.

**Motion is added for:** hover transitions, focus transitions, panel open/close, skeleton loading, toast entry/exit.
**Motion is not added for:** decorative background animations, elements that animate on every render, anything that loops indefinitely.

### 5.6 Component Rules

- **Buttons:** three variants only — `solid`, `outline`, `ghost`. One `solid` button per view maximum.
- **Cards:** always bordered — `border border-border rounded-md bg-card`. Hover: `hover:shadow-[--shadow-md] transition-shadow duration-150`.
- **Inputs:** `rounded-sm`, label always above (never inside), focus ring: `focus:ring-2 focus:ring-ring/30`.
- **Icons:** `lucide-vue-next` exclusively — `size-4` inline, `size-5` emphasis, `size-6` standalone. Always inherit text color.

---

## 6. Claude Code Skills (10 total)

| Skill | Generates |
|---|---|
| `/new-component` | Structurally correct Vue SFC — reka-ui + shadcn-vue + cn() + typed props |
| `/new-store` | Typed Pinia setup store with loading/error/reset pattern |
| `/new-settings-store` | Pinia store persisted to localStorage via `useLocalStorage` |
| `/new-composable` | Typed `useXxx()` composable with Nuxt auto-import |
| `/new-quill-field` | Client-only Quill editor component with `<ClientOnly>` and skeleton fallback |
| `/new-resolver` | GraphQL Yoga resolver + Drizzle query (full CRUD) |
| `/new-migration` | Drizzle schema file + migration scaffold |
| `/new-server-route` | Nitro REST API route (GET, POST, webhook, file upload templates) |
| `/new-gql-operation` | `.graphql` operation file + triggers codegen |
| `/design-component` | **Design-first** Vue component — reads design system, states intent, produces visually precise output |

### The Difference Between `/new-component` and `/design-component`

| `/new-component` | `/design-component` |
|---|---|
| Structure and logic first | Design intent first |
| Correct TypeScript + cn() patterns | Correct TypeScript + cn() + visual precision |
| Does not consult design system | Reads `design-system.md` before writing a single class |
| Use for data/logic components | Use for anything the user sees and interacts with |

The `/design-component` skill forces a one-sentence **design intent statement** before any code is generated. This prevents default AI drift toward safe, forgettable UI.

---

## 7. File Inventory (~48 files)

### Claude Code Intelligence
| File | Purpose |
|---|---|
| `CLAUDE.md` | Project brain — stack, conventions, patterns, design system reference, rules |
| `.claude/settings.json` | Pre-approved bash operations (auto-allowed in all sessions) |
| `.claude/settings.local.json` | Additional local permissions (web search, npm audit, etc.) |
| `.claude/mcp.json` | MCP Postgres server config — `postgresql://postgres:postgres@localhost:5432/postgres` |
| `.claude/skills/` (10 files) | All slash-command skills |
| `components.json` | shadcn-vue CLI config — style: new-york, css: app/assets/css/main.css, aliases to `@/` |
| `setup.sh` | Interactive project setup script — run once after cloning |

### Configuration
| File | Purpose |
|---|---|
| `nuxt.config.ts` | Nuxt 4 config — modules, shadcn-nuxt, Tailwind Vite plugin, Nitro node-server preset |
| `tsconfig.json` | Balanced strict TypeScript — extends `.nuxt/tsconfig.json` |
| `codegen.ts` | GraphQL Code Generator — watch mode, outputs `app/types/gql.ts` |
| `drizzle.config.ts` | Drizzle ORM — schema glob `server/db/schema/*.ts`, migrations to `server/db/migrations` |
| `eslint.config.ts` | ESLint v9 flat config — Vue + typescript-eslint + Prettier |
| `.prettierrc` | Prettier rules (single quotes, no semi, trailing comma, printWidth 100) |
| `.env.example` | All required environment variables documented |
| `.gitignore` | Excludes `.env`, `node_modules`, `.nuxt`, `types/gql.ts` |
| `package.json` | All dependencies and npm scripts |

### Design System
| File | Purpose |
|---|---|
| `design-system.md` | Full design contract — fonts, colors, spacing, shape, motion, component rules |
| `app/assets/css/main.css` | Tailwind entry + `@theme inline` + OKLCH tokens + dark mode + Quill overrides |

### Application Shell
| File | Purpose |
|---|---|
| `app/app.vue` | Root component — applies `.dark` class and locale to `<html>` via `useHead` |
| `app/layouts/default.vue` | Default layout wrapper |
| `app/middleware/auth.ts` | Route middleware — redirects unauthenticated users to `/login` |
| `app/pages/index.vue` | Homepage scaffold — theme toggle demo, stack status cards |

### Server — Database
| File | Purpose |
|---|---|
| `server/db/index.ts` | Drizzle + postgres.js client singleton (dev hot-reload safe, pooled max 10) |
| `server/db/schema/users.ts` | Users table — UUID pk, OAuth fields, role enum, timestamps + inferred types |
| `server/db/schema/index.ts` | Re-exports all schema tables |

### Server — GraphQL
| File | Purpose |
|---|---|
| `server/api/graphql.ts` | GraphQL Yoga endpoint at `/api/graphql` — schema + resolvers merged, GraphiQL in dev |
| `server/graphql/schema/users.ts` | User type definitions — UserRole enum, User type, UpdateUserInput, queries, mutations |
| `server/graphql/schema/index.ts` | Merges all type definitions — declares DateTime, UUID, JSON scalars |
| `server/graphql/resolvers/users.ts` | User resolvers — `me`, `getUser`, `listUsers`, `updateUser`, `deleteUser` |
| `server/graphql/resolvers/index.ts` | Merges all resolvers into root map |

### Server — Auth
| File | Purpose |
|---|---|
| `server/routes/auth/[provider].get.ts` | OAuth callback — upserts user to DB, sets encrypted session, redirects to `/` |

### Frontend
| File | Purpose |
|---|---|
| `app/lib/utils.ts` | `cn()` helper — clsx + tailwind-merge, used in every component |
| `app/stores/settings.ts` | Pinia settings store — theme, locale, layout, sidebarOpen persisted via localStorage |
| `app/composables/useAuth.ts` | Typed wrapper around nuxt-auth-utils — exposes `SessionUser` interface |
| `app/components/editor/RichTextField.vue` | Client-only Quill editor — `defineModel`, toolbar variants, skeleton fallback |
| `app/types/gql.ts` | Auto-generated GQL types — **never edit manually** |

### Localisation
| File | Purpose |
|---|---|
| `app/locales/en.json` | English translations — nav, auth, settings, common keys |
| `app/locales/nl.json` | Dutch translations |

---

## 8. First Steps, Workflow & Rules

### 8.1 First Steps After Cloning

Run the interactive setup script from the project root:

```bash
bash setup.sh
```

The script asks questions and applies every change automatically:

| Step | What it does |
|---|---|
| Project slug | Sets `name` in `package.json` |
| Display name | Sets `NUXT_PUBLIC_APP_NAME` in `.env` |
| PostgreSQL URL | Writes `DATABASE_URL` in `.env` and syncs `.claude/mcp.json` |
| Session password | Auto-generates a cryptographically random 32-byte base64url string |
| GitHub / Google OAuth | Prompts for Client ID + Secret (optional, press Enter to skip) |
| `npm install` | Installs all dependencies (confirmable) |
| DB migration | Runs `db:generate` + `db:migrate` to create the `users` table (confirmable) |

All steps show a summary before making any changes. Individual steps (npm install, migration) can be skipped if the environment isn't ready yet.

### 8.2 Development Workflow

A single command starts everything needed for development:

```bash
npm run dev
```

This uses `concurrently` to run the Nuxt dev server and `codegen:watch` in parallel in the same terminal, with colour-coded output prefixed by `[nuxt]` and `[codegen]`. Both processes shut down together when you press `Ctrl+C`.

Whenever a Drizzle schema file changes:

```bash
npm run db:setup        # db:generate + db:migrate in one step
# or separately:
npm run db:generate     # Generates SQL migration file
npm run db:migrate      # Applies it to the database
```

To build and run for production:

```bash
npm run build           # lint → codegen → typecheck → nuxt build
npm run preview         # Preview the production build locally
npm run start           # Run the built app (for VPS deployment)
```

### 8.3 Recommended Build Order

1. Define the first real Drizzle schema for the primary domain entity.
2. Write the matching GraphQL type definitions and resolver, then run `npm run codegen`.
3. Use `/design-component` to scaffold the first page — always start with design intent.
4. Build the login page calling `loginWith('github')` or `loginWith('google')` from `useAuth`.
5. Wire up the settings page — theme toggle and locale switcher are already in the settings store.

### 8.4 Adding shadcn-vue Components

Components are added on demand — they are not pre-installed. The CLI copies source into `app/components/ui/`:

```bash
npx shadcn-vue@latest add button
npx shadcn-vue@latest add dialog
npx shadcn-vue@latest add input
```

After adding, the component is yours — edit it freely to match the design system. The `components.json` at the project root tells the CLI where to put files and which aliases to use.

### 8.5 Important Rules to Remember

- `app/types/gql.ts` is auto-generated — never edit manually. Run `npm run codegen` after any schema or `.graphql` change.
- `app/types/gql.ts` is excluded in `.gitignore` as `types/gql.ts` — it is regenerated on each developer machine, never committed.
- All Quill content must be sanitised server-side with `sanitize-html` before storing in Postgres.
- Every server resolver and route must call `requireUserSession(event)` unless explicitly public.
- localStorage keys must always be prefixed with `settings:` to avoid collisions.
- **Color classes:** use shadcn semantic utilities only — `text-foreground`, `bg-background`, `bg-card`, `text-primary`, etc. Never raw Tailwind colors like `text-blue-500`.
- **`text-primary` = the action blue.** `text-foreground` = body text. These are different tokens.
- **Never** create a `tailwind.config.js` — Tailwind v4 is configured entirely in `app/assets/css/main.css`.
- **Always** use `cn()` from `~/lib/utils` for conditional class merging.
- **Prefer** Drizzle `returning()` over a second select after insert/update.

### 8.6 Adding OAuth Providers

The auth route handles all providers via a single `[provider].get.ts` file. To add a new provider:

1. Add credentials to `.env` and `.env.example`.
2. Register the provider in `nuxt.config.ts` under `runtimeConfig`.
3. Add a login button calling `loginWith('provider-name')` in the login page.

No additional server code required — `nuxt-auth-utils` handles the OAuth flow automatically.

### 8.7 Customising the Design System

The design system in `design-system.md` and `app/assets/css/main.css` is intentionally opinionated but fully tweakable.

- **Change fonts:** update `--font-serif`, `--font-sans`, `--font-mono` in the `@theme inline` block of `main.css`, and update the Google Fonts import URL at the top of the file.
- **Change the accent/action color:** update `--primary` in `:root` (light) and `.dark`, then update `--ring` to match. Everything that uses `bg-primary`, `text-primary`, or `ring-ring` inherits automatically.
- **Change the neutral palette:** update the OKLCH values for `--background`, `--foreground`, `--card`, `--border`, etc. in `:root` and `.dark`.
- **Always keep `design-system.md` in sync with `main.css`** — Claude Code reads `design-system.md`, not the CSS file directly. If they drift, Claude will generate incorrect code.

### 8.8 Nuxt 4 Path Aliases

| Alias | Resolves to | Use for |
|---|---|---|
| `~/` | `app/` | All Vue app code — components, stores, composables, lib, types |
| `~~/` | project root | Importing from server context or config files |
| `@/` | `app/` | Equivalent to `~/` — used by shadcn-vue CLI and components.json |
| `@@/` | project root | Equivalent to `~~/` |

---

*March 2026 · Kit version: v4 (Nuxt 4, Tailwind v4, shadcn-vue, OKLCH color tokens)*
