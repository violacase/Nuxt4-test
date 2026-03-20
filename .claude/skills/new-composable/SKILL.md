---
name: new-composable
description: "Scaffold a new Nuxt auto-imported composable (useXxx). Use when the user asks to create a composable, reusable logic, a hook, or shared reactive functionality."
---

# Skill: New Composable

## Rules
- Always prefix with `use`: `useMyComposable`
- Filename matches function name: `useMyComposable.ts`
- Place in `composables/` — Nuxt auto-imports everything here
- Return a plain object (not reactive) — let callers destructure
- Handle cleanup in `onUnmounted` if subscribing to events
- For GQL data fetching, use `useAsyncQuery` (from codegen) not raw fetch
- Types come from `~/types/gql` — never redefine

## Template (General)

```ts
// composables/useMyComposable.ts
export function useMyComposable() {
  // State
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Logic
  async function doSomething() {
    isLoading.value = true
    try {
      // ...
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    } finally {
      isLoading.value = false
    }
  }

  // Cleanup (if needed)
  // onUnmounted(() => { ... })

  return {
    isLoading: readonly(isLoading),
    error: readonly(error),
    doSomething,
  }
}
```

## Template (GQL Data Fetching)

```ts
// composables/usePost.ts
import type { GetPostQuery, GetPostQueryVariables } from '~/types/gql'
import GetPostDocument from './usePost.graphql'

export function usePost(id: MaybeRef<string>) {
  const { data, pending, error, refresh } = useAsyncQuery<GetPostQuery>(
    GetPostDocument,
    computed(() => ({ id: unref(id) }) satisfies GetPostQueryVariables)
  )

  const post = computed(() => data.value?.post ?? null)

  return {
    post,
    isLoading: pending,
    error,
    refresh,
  }
}
```

## Steps

1. Ask: what does this composable do? Does it fetch GQL data?
2. If GQL: also generate the matching `.graphql` operation file (use `/new-gql-operation`)
3. Generate following the correct template above
4. If it has side effects (event listeners, intervals), add `onUnmounted` cleanup
