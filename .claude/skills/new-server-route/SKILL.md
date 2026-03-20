---
name: new-server-route
description: "Scaffold a Nitro server route (REST endpoint). Use when the user asks to create a REST API endpoint, webhook, file upload handler, OAuth callback, or any non-GraphQL server-side route."
---

# Skill: New Server Route

## Rules
- File naming sets HTTP method: `[name].get.ts`, `[name].post.ts`, `[name].delete.ts`
- Place in `server/api/` (accessible at `/api/[name]`) or `server/routes/` (accessible at `/[name]`)
- Always validate input with explicit checks — no raw `body` without validation
- Always protect with `requireUserSession(event)` unless explicitly public
- Use `readBody` for POST/PUT, `getQuery` for GET params, `getRouterParam` for path params
- Return typed objects — Nitro infers the response type

## Template: GET Route

```ts
// server/api/[resource]/index.get.ts
export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const query = getQuery(event)

  // Validate query params
  const page = Number(query.page) || 1
  const limit = Math.min(Number(query.limit) || 20, 100)

  // Your logic here
  const data = await db.select().from(myTable).limit(limit).offset((page - 1) * limit)

  return {
    data,
    pagination: { page, limit },
  }
})
```

## Template: POST Route

```ts
// server/api/[resource]/index.post.ts
export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const body = await readBody(event)

  // Validate body
  if (!body.name) {
    throw createError({ statusCode: 400, statusMessage: 'name is required' })
  }

  const result = await db.insert(myTable).values({
    ...body,
    userId: session.user.id,
  }).returning()

  return result[0]
})
```

## Template: Webhook (Public, no auth)

```ts
// server/api/webhooks/[provider].post.ts
export default defineEventHandler(async (event) => {
  // Verify webhook signature
  const signature = getHeader(event, 'x-signature')
  if (!signature) throw createError({ statusCode: 401 })
  // ... verify signature

  const body = await readBody(event)
  // process webhook
  return { received: true }
})
```

## Template: File Upload

```ts
// server/api/upload.post.ts
export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const files = await readMultipartFormData(event)
  if (!files?.length) throw createError({ statusCode: 400, statusMessage: 'No files' })

  // Process files
  // ...

  return { url: '...' }
})
```

## Steps

1. Ask: what HTTP method, what path, what does it do?
2. Is it public or protected?
3. Generate following the appropriate template
4. If it handles file uploads, ask about storage strategy
