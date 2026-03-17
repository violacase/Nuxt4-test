// plugins/theme.client.ts
// Keeps the <html> class in sync when the user toggles theme at runtime.
// The initial class is set by the inline <head> script in app.vue (prevents FOUC).
export default defineNuxtPlugin(() => {
  const settings = useSettingsStore()

  watch(
    () => settings.theme,
    (theme) => document.documentElement.classList.toggle('dark', theme === 'dark'),
  )
})
