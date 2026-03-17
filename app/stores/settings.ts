// stores/settings.ts
import { defineStore, skipHydrate } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useSettingsStore = defineStore('settings', () => {
  // ─── Persisted via localStorage ─────────────────────────────
  // skipHydrate: prevents Pinia from serializing these on SSR and overwriting
  // localStorage values with server defaults during client hydration.
  const theme = skipHydrate(useLocalStorage<'light' | 'dark'>('settings:theme', 'light'))
  const locale = skipHydrate(useLocalStorage<string>('settings:locale', 'en'))
  const layout = skipHydrate(
    useLocalStorage<'compact' | 'comfortable'>('settings:layout', 'comfortable'),
  )
  const sidebarOpen = skipHydrate(useLocalStorage<boolean>('settings:sidebarOpen', true))

  // ─── Actions ────────────────────────────────────────────────
  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  function reset() {
    theme.value = 'light'
    locale.value = 'en'
    layout.value = 'comfortable'
    sidebarOpen.value = true
  }

  return {
    // State
    theme,
    locale,
    layout,
    sidebarOpen,
    // Actions
    toggleTheme,
    toggleSidebar,
    reset,
  }
})
