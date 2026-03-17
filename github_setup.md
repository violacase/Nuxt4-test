# Session Report — 2026-03-16

## Goal
Run the Nuxt 4 scaffold as a local service (PM2 + Nginx) and publish it as a proper GitHub template with CI.

---

## Phase A — Codegen Infrastructure

Added offline codegen capability so CI doesn't need a running server.

| File | Purpose |
|---|---|
| `schema.graphql` | Committed SDL schema — source of truth for CI |
| `codegen.ci.ts` | Reads `schema.graphql`, outputs `app/types/gql.ts` (no server needed) |
| `codegen.schema.ts` | Reads live dev server, regenerates `schema.graphql` |

**`package.json` changes:**
- Added `codegen:ci` and `codegen:schema` scripts
- Added `@graphql-codegen/schema-ast` devDependency

---

## Phase B — Bug Fixes (Pre-existing)

Running `lint:check` and `typecheck` revealed a cluster of pre-existing issues that had to be fixed before anything could be committed cleanly.

### `tsconfig.json` — Two critical silent failures

**Problem 1:** TypeScript's `exclude` overrides `include` — even for explicitly listed paths (only `files[]` is exempt). The original config had `.nuxt/nuxt.d.ts` in `include` but `.nuxt` in `exclude`, so the auto-import globals were silently dropped.

**Fix:** Moved both `.nuxt/nuxt.d.ts` and `.nuxt/nuxt.node.d.ts` to the `files[]` array.

**Problem 2:** The root `tsconfig.json` defined a `compilerOptions.paths` override with only `~`, `@`, `~~`, `@@` aliases. TypeScript's `extends` does not *merge* `paths` — it replaces. This silently dropped all `#` module aliases (`#auth-utils`, `#app`, `#shared`, etc.) that `.nuxt/tsconfig.json` defines, breaking type inference for every nuxt-auth-utils callback.

**Fix:** Removed the `paths` override entirely. `.nuxt/tsconfig.json` already defines the correct aliases including `~/*` and `@/*`.

**Problem 3:** `vueCompilerOptions.plugins: ["vue-router/volar/sfc-route-blocks"]` in the generated `.nuxt/tsconfig.json` — this path is not exported by `vue-router@4.6+`, causing a noisy runtime warning from `vue-tsc`.

**Fix:** Added `vueCompilerOptions: { plugins: [] }` to the root `tsconfig.json` to clear the broken plugin list.

---

### `nuxt.config.ts` — Pinia stores not auto-imported

`pinia.storesDirs: ['app/stores/**']` is interpreted relative to `rootDir`. With Nuxt 4's `srcDir: 'app/'`, the correct value is `stores/**` (relative to `srcDir`). The old value resolved to a path that didn't exist, so Pinia never picked up `useSettingsStore` etc.

**Fix:** Changed to `storesDirs: ['stores/**']`.

---

### `eslint.config.ts` — False positives on Nuxt convention files

`vue/multi-word-component-names` was firing on `app/pages/index.vue` and `app/layouts/default.vue`, which must use single-word names per Nuxt routing conventions.

**Fix:** Added a scoped override disabling the rule for `pages/**/*.vue` and `layouts/**/*.vue`.

---

### `server/routes/auth/` — Broken OAuth handler

The scaffold used `oauthEventHandler({...})`, a generic handler that was removed in `nuxt-auth-utils@0.5`. The package now requires one route file per provider using `defineOAuth{Provider}EventHandler`.

**Fix:** Deleted `[provider].get.ts`. Created `github.get.ts` using `defineOAuthGitHubEventHandler` with correct types and proper `provider`/`providerId` fields (which are `notNull` in the Drizzle schema).

---

### `server/types/auth.d.ts` — Missing User type augmentation

`nuxt-auth-utils` ships with an empty `User` interface that must be augmented by the app. Without it, `session.user.id` etc. don't type-check.

**Fix:** Created `server/types/auth.d.ts` with a `declare module '#auth-utils'` block declaring the full user shape.

---

## Phase C — Deployment Files

| File | Purpose |
|---|---|
| `ecosystem.config.cjs` | PM2 process config (`.cjs` required because `"type": "module"` in package.json) |
| `nginx/nuxt-scaffold.conf` | Nginx reverse proxy template with `upstream` block, WebSocket support, SSL placeholder |
| `systemd/nuxt-scaffold.service` | Systemd unit file (alternative to PM2) |
| `README.md` | Quick start, stack table, project structure, PM2/Nginx setup, skills reference |
| `LICENSE` | MIT |

---

## Phase D — CI (GitHub Actions)

`.github/workflows/ci.yml` runs on every push/PR to `main`:

```
install → lint:check → codegen:ci → nuxi prepare → typecheck
```

No build step — build requires env vars and 200MB output; lint + typecheck is the right scope for a template.

**Result:** CI passed green on first push in **39 seconds**.

---

## Phase E — GitHub Template

```bash
gh api repos/violacase/nuxt-scaffold --method PATCH --field is_template=true
gh api repos/violacase/nuxt-scaffold/topics --method PUT --field names[]=...
```

- `is_template: true` set on the repo
- Topics: `nuxt`, `vue`, `graphql`, `drizzle-orm`, `tailwindcss`, `typescript`, `scaffold`, `template`

---

## Outstanding

**Phase B (PM2 local service)** was deferred — requires a `.env` with `DATABASE_URL` and `NUXT_SESSION_PASSWORD` before `npm run build` can proceed. Everything else is ready; once `.env` is in place:

```bash
npm run build
pm2 start ecosystem.config.cjs
pm2 save && pm2 startup   # run the printed sudo command
```

Then configure Nginx per `nginx/nuxt-scaffold.conf`.
