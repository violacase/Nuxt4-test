---
name: new-settings-store
description: "Scaffold a Pinia store that persists to localStorage using VueUse useLocalStorage. Use when the user asks to store user preferences, UI settings, theme, layout, or any setting that should survive page reload."
---

# Skill: New Settings Store

## Rules
- Always use `useLocalStorage` from `@vueuse/core` — never `localStorage.setItem` directly
- Keys MUST be namespaced: `settings:[key]` — e.g. `settings:theme`
- Always provide sensible defaults as the second argument to `useLocalStorage`
- Always include a `reset()` action that restores all defaults
- Store is SSR-safe — `useLocalStorage` handles hydration automatically in Nuxt
- If adding to the existing `stores/settings.ts`, extend it — don't create a duplicate

## Base Settings Store

```ts
// stores/settings.ts
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useSettingsStore = defineStore('settings', () => {
  // ─── Persisted Settings ───────────────────────────────────
  const theme = useLocalStorage<'light' | 'dark'>('settings:theme', 'light')
  const locale = useLocalStorage<string>('settings:locale', 'en')
  const layout = useLocalStorage<'compact' | 'comfortable'>('settings:layout', 'comfortable')
  const sidebarOpen = useLocalStorage<boolean>('settings:sidebarOpen', true)

  // Add new settings following the same pattern:
  // const mySetting = useLocalStorage<Type>('settings:mySetting', defaultValue)

  // ─── Actions ──────────────────────────────────────────────
  function reset() {
    theme.value = 'light'
    locale.value = 'en'
    layout.value = 'comfortable'
    sidebarOpen.value = true
  }

  return {
    theme,
    locale,
    layout,
    sidebarOpen,
    reset,
  }
})
```

## Adding a New Setting

When asked to add a setting:
1. Determine the type (string union, boolean, number, string)
2. Choose a namespaced key: `settings:[descriptiveName]`
3. Choose a sensible default
4. Add to the store and to the `reset()` function
5. Add the corresponding i18n label to `/locales/en.json` if it's user-facing

## Example: Adding a font size setting

```ts
const fontSize = useLocalStorage<'sm' | 'md' | 'lg'>('settings:fontSize', 'md')

// In reset():
fontSize.value = 'md'
```

## Steps

1. Ask: what setting needs to be persisted?
2. Determine if it belongs in the existing `stores/settings.ts` or needs its own store
3. Generate or extend following the template above
4. Always include the key in `reset()`
