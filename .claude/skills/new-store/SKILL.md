---
name: new-store
description: "Scaffold a new Pinia store. Use when the user asks to create a store, state management, or shared reactive state for a domain (e.g. users, posts, cart)."
---

# Skill: New Store

## Rules
- Always use setup store syntax — never options syntax
- Store ID matches filename in kebab-case: `defineStore('my-domain', ...)`
- State: `ref()` for primitives and arrays, `reactive()` only for nested objects
- Getters: `computed()`
- Actions: `async function` with try/catch
- If using GQL, import types from `~/types/gql` — never redefine them
- Place in `stores/` directory

## Template

```ts
// stores/[domain].ts
import { defineStore } from 'pinia'
// import type { MyType } from '~/types/gql'

export const use[Domain]Store = defineStore('[domain]', () => {
  // ─── State ────────────────────────────────────────────────
  const items = ref<MyType[]>([])
  const selected = ref<MyType | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // ─── Getters ──────────────────────────────────────────────
  const count = computed(() => items.value.length)
  const hasItems = computed(() => items.value.length > 0)

  // ─── Actions ──────────────────────────────────────────────
  async function fetchItems() {
    isLoading.value = true
    error.value = null
    try {
      // const { data } = await useAsyncQuery(...)
      // items.value = data.value?.items ?? []
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    } finally {
      isLoading.value = false
    }
  }

  function reset() {
    items.value = []
    selected.value = null
    error.value = null
  }

  return {
    // State
    items,
    selected,
    isLoading,
    error,
    // Getters
    count,
    hasItems,
    // Actions
    fetchItems,
    reset,
  }
})
```

## Steps

1. Ask: what domain is this store for? What data does it hold?
2. Determine if it needs GQL integration (import types from `~/types/gql`)
3. Generate the store following the template above
4. Always include `isLoading`, `error`, and `reset()`
