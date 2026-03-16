// composables/useAuth.ts
// Wraps nuxt-auth-utils session with typed user access

interface SessionUser {
  id: string
  email: string
  name: string
  avatarUrl: string | null
  role: 'admin' | 'member' | 'guest'
}

export function useAuth() {
  const { loggedIn, user, session, fetch: refreshSession, clear } = useUserSession()

  const typedUser = computed(() => user.value as SessionUser | null)

  const isAdmin = computed(() => typedUser.value?.role === 'admin')
  const isMember = computed(() => typedUser.value?.role === 'member')

  async function logout() {
    await clear()
    await navigateTo('/login')
  }

  function loginWith(provider: 'github' | 'google') {
    navigateTo(`/auth/${provider}`, { external: true })
  }

  return {
    loggedIn,
    user: typedUser,
    session,
    isAdmin,
    isMember,
    logout,
    loginWith,
    refreshSession,
  }
}
