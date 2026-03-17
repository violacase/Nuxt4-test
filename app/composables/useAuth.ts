// composables/useAuth.ts
// Wraps nuxt-auth-utils session with typed user access

interface SessionUser {
  id: string
  email: string
  name: string
  avatarUrl: string | null
  role: 'admin' | 'member' | 'guest'
  emailVerified: boolean
}

export function useAuth() {
  const { loggedIn, user, session, fetch: refreshSession, clear } = useUserSession()

  const typedUser = computed(() => user.value as SessionUser | null)

  const isAdmin = computed(() => typedUser.value?.role === 'admin')
  const isMember = computed(() => typedUser.value?.role === 'member')

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' })
    await clear()
    await navigateTo('/login')
  }

  function loginWith(provider: 'github' | 'google') {
    navigateTo(`/auth/${provider}`, { external: true })
  }

  async function loginWithPassword(email: string, password: string) {
    await $fetch('/api/auth/login', { method: 'POST', body: { email, password } })
    await refreshSession()
  }

  async function register(name: string, email: string, password: string) {
    await $fetch('/api/auth/register', { method: 'POST', body: { name, email, password } })
    await refreshSession()
  }

  return {
    loggedIn,
    user: typedUser,
    session,
    isAdmin,
    isMember,
    logout,
    loginWith,
    loginWithPassword,
    register,
    refreshSession,
  }
}
