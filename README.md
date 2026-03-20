# Vue 3 + H3 Scaffold

A production-ready full-stack scaffold with an end-to-end type chain from Postgres through to Vue components, and a complete authentication system (email/password + GitHub OAuth).

## Using this template

### 1 — Create your repo

Click **Use this template → Create a new repository** on GitHub, then clone your new repo locally.

### 2 — Run the setup script

```bash
bash setup.sh
```

The script is interactive and handles everything in one pass:

| Step | What happens |
|---|---|
| Preflight | Confirms you're in the right directory and Node ≥ 22 is installed |
| Project slug | Sets `package.json` `name`; used as default DB name |
| Display name | Written to `.env` as `NUXT_PUBLIC_APP_NAME` |
| Database URL | PostgreSQL connection string — defaults to `localhost:5432/<slug>` |
| Session password | Auto-generated (32 random bytes, base64url) |
| GitHub OAuth | Optional — press Enter to skip |
| Google OAuth | Optional — press Enter to skip |
| Confirm | Shows a summary; nothing is written until you confirm |
| Write files | Creates `.env`, updates `package.json`, writes `.claude/mcp.json` |
| `npm install` | Optional — runs immediately or skip and do it later |
| DB migration | Optional — runs `db:generate` + `db:migrate` if Postgres is reachable |

### 3 — Start developing

```bash
npm run dev          # Vite (port 5173) + H3 server (port 3333) + codegen watch
```

### Claude Code (optional)

`.claude/settings.json` and all skills are included in the template — Claude Code is ready to use immediately after cloning. The setup script also writes `.claude/mcp.json` with your DB URL so the Postgres MCP server connects automatically.

If you need to rotate the MCP connection later, edit `.claude/mcp.json` directly (it is gitignored).

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | Vue 3 + Vite SPA |
| Server | H3 standalone (separate process, port 3333) |
| GraphQL | GraphQL Yoga at `/api/graphql` |
| ORM | Drizzle ORM + postgres.js |
| Database | PostgreSQL |
| UI | reka-ui + shadcn-vue + Tailwind CSS v4 |
| State | Pinia + VueUse |
| i18n | vue-i18n v11 (EN + NL) |
| Auth | iron-session — email/password (bcryptjs) + GitHub OAuth |
| Type safety | GraphQL Code Generator + strict TypeScript |
| Linting | ESLint + Prettier |

## E2E Type Chain

```
Postgres → Drizzle schema → GraphQL schema → Codegen → Vue components
```

Never write manual types for DB entities or GQL responses — they are always derived automatically.

## Authentication

Two methods are supported and can be used on the same account:

### Email / Password
- Register at `/register` — name, email, password (min 8 chars)
- Login at `/login`
- Passwords hashed with bcryptjs (cost 12)

### GitHub OAuth
1. Create a GitHub OAuth App at `github.com/settings/developers`
   - **Homepage URL:** `http://localhost:5173`
   - **Callback URL:** `http://localhost:3333/auth/github`
2. Add credentials to `.env`:
   ```
   NUXT_OAUTH_GITHUB_CLIENT_ID=...
   NUXT_OAUTH_GITHUB_CLIENT_SECRET=...
   ```
3. Restart `npm run dev`

Both methods share the same `users` table. OAuth identities are stored in `oauth_accounts` (composite PK on `provider` + `provider_user_id`), linked to users by FK. A user who signs up via email can later link a GitHub account and vice versa.

## Common Commands

```bash
npm run dev              # Vite + H3 server + codegen watch (all in one)
npm run build            # lint → codegen → typecheck → build
npm run preview          # Preview production build

npm run codegen          # Generate GQL types (requires running dev server)
npm run codegen:ci       # Generate GQL types from schema.graphql (no server needed)
npm run codegen:schema   # Regenerate schema.graphql from live server
npm run codegen:watch    # Run codegen in watch mode

npm run db:setup         # db:generate + db:migrate
npm run db:generate      # Generate Drizzle migration from schema changes
npm run db:migrate       # Run pending migrations
npm run db:studio        # Open Drizzle Studio

npm run lint             # Lint + auto-fix
npm run lint:check       # Lint without fixing (used in CI)
npm run typecheck        # Run vue-tsc type check
```

## Project Structure

```
/
├── app/                        ← Vue SPA (~ alias)
│   ├── assets/css/             ← Tailwind entry point (main.css)
│   ├── components/
│   │   ├── ui/                 ← shadcn-vue components
│   │   └── UserMenu.vue        ← Avatar dropdown (user name, role, logout)
│   ├── composables/
│   │   └── useAuth.ts          ← login, register, logout, OAuth
│   ├── i18n/index.ts           ← vue-i18n setup
│   ├── pages/
│   │   ├── index.vue
│   │   ├── login.vue
│   │   └── register.vue
│   ├── router/index.ts         ← vue-router setup
│   ├── stores/
│   │   └── auth.ts             ← auth Pinia store (useAuthStore)
│   └── types/gql.ts            ← AUTO-GENERATED — never edit
├── i18n/
│   └── locales/                ← en.json, nl.json
├── server/                     ← H3 server (~~ alias)
│   ├── api/auth/
│   │   ├── login.post.ts       ← POST /api/auth/login
│   │   ├── register.post.ts    ← POST /api/auth/register
│   │   └── logout.post.ts      ← POST /api/auth/logout
│   ├── routes/auth/
│   │   └── github.get.ts       ← GitHub OAuth callback
│   ├── lib/session.ts          ← iron-session wrapper (getSession, requireSession)
│   ├── graphql/
│   │   ├── schema/             ← GraphQL type definitions
│   │   └── resolvers/          ← Resolvers (one file per domain)
│   └── db/
│       ├── schema/
│       │   └── users.ts        ← users + oauth_accounts tables
│       └── migrations/         ← Generated by drizzle-kit
├── schema.graphql              ← Committed SDL — keep updated via codegen:schema
├── codegen.ts                  ← Dev codegen config
├── codegen.ci.ts               ← CI codegen config (reads schema.graphql)
└── codegen.schema.ts           ← Regenerates schema.graphql
```

## Database Schema

### `users`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | auto-generated |
| `email` | text unique | |
| `name` | text | |
| `avatar_url` | text nullable | |
| `email_verified` | boolean | default false |
| `password_hash` | text nullable | null for OAuth-only users |
| `role` | enum | admin / member / guest (default: member) |
| `created_at` / `updated_at` | timestamp | |

### `oauth_accounts`
| Column | Type | Notes |
|---|---|---|
| `provider` + `provider_user_id` | composite PK | e.g. `github` + `12345` |
| `user_id` | uuid FK → users.id | cascade delete |
| `email` | text nullable | email from provider |
| `access_token` / `refresh_token` | text nullable | |
| `expires_at` | timestamp nullable | |

## Adding a Feature

1. **Drizzle schema** — add/modify a table in `server/db/schema/`
2. `npm run db:setup`
3. **GraphQL schema** — add types/queries/mutations in `server/graphql/schema/`
4. **Resolvers** — implement in `server/graphql/resolvers/`
5. With dev server running: `npm run codegen:schema` → commit `schema.graphql`
6. **GQL operation** — add `.graphql` file in `app/composables/` → types auto-generated
7. **Vue component / page** — use fully typed composable

## Claude Code Skills

| Skill | Use when |
|---|---|
| `/new-migration` | Add a database table or column |
| `/new-resolver` | Create a GraphQL query or mutation |
| `/new-gql-operation` | Write a GQL operation for a Vue component |
| `/new-component` | Scaffold a structural Vue component |
| `/design-component` | Scaffold a visually designed component or page |
| `/new-store` | Create a Pinia store |
| `/new-settings-store` | Create a settings store persisted to localStorage |
| `/new-composable` | Create a reusable composable |

## Environment Variables

Copy `.env.example` to `.env` and fill in the values (or run `bash setup.sh`):

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NUXT_SESSION_PASSWORD` | Min 32 chars — encrypts session cookies (iron-session) |
| `NUXT_OAUTH_GITHUB_CLIENT_ID` | GitHub OAuth app client ID |
| `NUXT_OAUTH_GITHUB_CLIENT_SECRET` | GitHub OAuth app client secret |
| `NUXT_PUBLIC_APP_NAME` | Public app name |
| `PORT` | H3 server port (default 3333) |

## Deployment (PM2 + Nginx)

Before deploying, replace the placeholders in `ecosystem.config.cjs`, `nginx/nuxt-scaffold.conf`, and `systemd/nuxt-scaffold.service` with your actual project name, path, and Unix user — or re-run `bash setup.sh` on the server.

```bash
# Build
npm run build

# Start with PM2
pm2 start ecosystem.config.cjs
pm2 save && pm2 startup
```

For GitHub OAuth in production, create a separate OAuth App with your production domain as the callback URL.

## License

MIT
