import { createApp, watch } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@unhead/vue/client'
import App from './app.vue'
import { router } from './router'
import { i18n } from './i18n'
import { useSettingsStore } from './stores/settings'
import { useAuthStore } from './stores/auth'
import './assets/css/main.css'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(i18n)
app.use(createHead())

app.runWithContext(() => {
  const settings = useSettingsStore()
  const auth = useAuthStore()

  // Sync i18n locale with stored locale (from localStorage)
  i18n.global.locale.value = settings.locale as 'en' | 'nl'

  // Fetch auth session on boot (non-blocking)
  void auth.fetchSession()

  // Keep <html class="dark"> in sync with theme setting
  watch(
    () => settings.theme,
    (theme) => document.documentElement.classList.toggle('dark', theme === 'dark'),
    { immediate: true },
  )

  // Keep --sidebar-width CSS variable in sync
  watch(
    () => settings.sidebarOpen,
    (open) => {
      document.documentElement.style.setProperty('--sidebar-width', open ? '15rem' : '3.5rem')
    },
    { immediate: true },
  )
})

app.mount('#app')
