import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../pages/index.vue'),
    },
    {
      path: '/login',
      component: () => import('../pages/login.vue'),
      meta: { layout: false },
    },
    {
      path: '/register',
      component: () => import('../pages/register.vue'),
      meta: { layout: false },
    },
    {
      path: '/showcase',
      component: () => import('../pages/showcase.vue'),
    },
    {
      path: '/components',
      component: () => import('../pages/components.vue'),
    },
    {
      path: '/settings',
      component: () => import('../pages/settings.vue'),
    },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  // Ensure session is initialized before making auth decisions
  if (!auth.initialized) {
    await auth.fetchSession()
  }
  if (to.meta.requiresAuth === true && !auth.loggedIn) return '/login'
})
