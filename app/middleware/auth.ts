// middleware/auth.ts
// Apply to protected pages with: definePageMeta({ middleware: 'auth' })
export default defineNuxtRouteMiddleware(() => {
  const { loggedIn } = useAuth()
  if (!loggedIn.value) {
    return navigateTo('/login')
  }
})
