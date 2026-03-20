// composables/useAuth.ts
import type { SessionUser } from '../stores/auth'

export function useAuth() {
  const auth = useAuthStore()
  const router = useRouter()

  const isAdmin = computed(() => auth.user?.role === 'admin')
  const isMember = computed(() => auth.user?.role === 'member')

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    auth.user = null
    await router.push('/login')
  }

  function loginWith(provider: 'github' | 'google') {
    window.location.href = `/auth/${provider}`
  }

  async function loginWithPassword(email: string, password: string) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) {
      const data = (await res.json()) as { message?: string }
      throw { data: { message: data.message } }
    }
    await auth.fetchSession()
  }

  async function register(name: string, email: string, password: string) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    if (!res.ok) {
      const data = (await res.json()) as { message?: string }
      throw { data: { message: data.message } }
    }
    await auth.fetchSession()
  }

  return {
    loggedIn: computed(() => auth.loggedIn),
    user: computed<SessionUser | null>(() => auth.user),
    isAdmin,
    isMember,
    logout,
    loginWith,
    loginWithPassword,
    register,
    refreshSession: () => auth.fetchSession(),
  }
}
