// stores/settings.ts
import { useLocalStorage } from '@vueuse/core'

export const useSettingsStore = defineStore('settings', () => {
  // ─── Persisted via localStorage ─────────────────────────────
  const theme = useLocalStorage<'light' | 'dark'>('settings:theme', 'light')
  const locale = useLocalStorage<string>('settings:locale', 'en')
  const layout = useLocalStorage<'compact' | 'comfortable'>('settings:layout', 'comfortable')
  const sidebarOpen = useLocalStorage<boolean>('settings:sidebarOpen', true)

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
