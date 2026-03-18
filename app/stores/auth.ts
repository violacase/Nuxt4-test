// stores/auth.ts

export interface SessionUser {
  id: string
  email: string
  name: string
  avatarUrl: string | null
  role: 'admin' | 'member' | 'guest'
  emailVerified: boolean
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<SessionUser | null>(null)
  const loggedIn = computed(() => user.value !== null)
  const initialized = ref(false)

  async function fetchSession() {
    try {
      const res = await fetch('/api/auth/me')
      user.value = res.ok ? (await res.json() as { user: SessionUser }).user : null
    } catch {
      user.value = null
    } finally {
      initialized.value = true
    }
  }

  return { user, loggedIn, initialized, fetchSession }
})
