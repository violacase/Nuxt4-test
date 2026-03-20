// server/main.ts — standalone H3 server (replaces Nitro)
import { createApp, createRouter, toNodeListener, fromNodeMiddleware } from 'h3'
import { createServer } from 'node:http'

import healthHandler from './api/health.get.js'
import loginHandler from './api/auth/login.post.js'
import registerHandler from './api/auth/register.post.js'
import logoutHandler from './api/auth/logout.post.js'
import meHandler from './api/auth/me.get.js'
import passwordHandler from './api/auth/password.patch.js'
import { githubHandler, githubCallbackHandler } from './routes/auth/github.get.js'
import graphqlHandler from './api/graphql.js'

const app = createApp()
const router = createRouter()

// ── API routes ────────────────────────────────────────────────
router.get('/api/health', healthHandler)
router.post('/api/auth/login', loginHandler)
router.post('/api/auth/register', registerHandler)
router.post('/api/auth/logout', logoutHandler)
router.get('/api/auth/me', meHandler)
router.patch('/api/auth/password', passwordHandler)

// ── OAuth routes ─────────────────────────────────────────────
router.get('/auth/github', githubHandler)
router.get('/auth/github/callback', githubCallbackHandler)

// ── GraphQL (GET for playground, POST for queries) ────────────
router.get('/api/graphql', graphqlHandler)
router.post('/api/graphql', graphqlHandler)

app.use(router)

// ── Static files (production only) ───────────────────────────
if (process.env.NODE_ENV === 'production') {
  const { default: sirv } = await import('sirv')
  app.use(fromNodeMiddleware(sirv('dist', { single: true })))
}

// ── Start server ──────────────────────────────────────────────
const port = Number(process.env.PORT ?? 3332)
createServer(toNodeListener(app)).listen(port, () => {
  console.warn(`H3 server running on http://localhost:${port}`)
})
