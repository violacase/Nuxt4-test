<script setup lang="ts">
import { Eye, EyeOff, Loader2, AlertCircle, Moon, Sun } from 'lucide-vue-next'
import { cn } from '~/lib/utils'

const { loginWithPassword, loginWith } = useAuth()
const { t } = useI18n()
const settings = useSettingsStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const error = ref('')
const loading = ref(false)

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    await loginWithPassword(email.value, password.value)
    await router.push('/')
  } catch (e: unknown) {
    error.value = (e as { data?: { message?: string } })?.data?.message ?? t('auth.error.generic')
  } finally {
    loading.value = false
  }
}

const oauthError = computed(() => route.query.error === 'oauth')
</script>

<template>
  <div class="flex min-h-screen flex-col bg-background">
    <!-- Top bar -->
    <div class="flex h-14 shrink-0 items-center justify-between px-6">
      <RouterLink
        to="/"
        class="font-mono text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
      >
        Vue3-test
      </RouterLink>
      <button
        class="flex h-8 items-center gap-2 rounded-md px-3 text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
        :aria-label="settings.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
        @click="settings.toggleTheme()"
      >
        <Sun v-if="settings.theme === 'dark'" class="size-4" />
        <Moon v-else class="size-4" />
      </button>
    </div>

    <!-- Form area -->
    <main class="flex flex-1 flex-col items-center justify-center px-4 pb-16">
      <!-- Title -->
      <div class="mb-8 w-full max-w-sm text-center">
        <h1 class="font-serif text-3xl text-foreground">
          {{ t('auth.login.title') }}
        </h1>
        <p class="mt-2 text-sm text-muted-foreground">
          {{ t('auth.login.subtitle') }}
        </p>
      </div>

      <!-- Card -->
      <div
        class="w-full max-w-sm overflow-hidden rounded-md border border-border bg-card shadow-[--shadow-sm]"
      >
        <!-- OAuth error banner (top of card) -->
        <Transition
          enter-active-class="transition-all duration-200"
          enter-from-class="opacity-0 -translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
        >
          <div
            v-if="oauthError"
            class="flex items-center gap-2 border-b border-destructive/20 bg-danger-subtle px-4 py-3 text-sm text-destructive"
          >
            <AlertCircle class="size-4 shrink-0" />
            {{ t('auth.error.oauth') }}
          </div>
        </Transition>

        <div class="p-8">
          <form class="space-y-4" @submit.prevent="onSubmit">
            <!-- Email -->
            <div class="flex flex-col gap-2">
              <label for="email" class="text-sm text-foreground">
                {{ t('auth.fields.email') }}
              </label>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                autocomplete="email"
                :placeholder="t('auth.fields.emailPlaceholder')"
                :class="
                  cn(
                    'h-9 w-full rounded-sm border border-input bg-card px-3 text-sm text-foreground',
                    'placeholder:text-muted-foreground',
                    'transition-colors duration-150',
                    'focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring/30',
                  )
                "
              />
            </div>

            <!-- Password -->
            <div class="flex flex-col gap-2">
              <label for="password" class="text-sm text-foreground">
                {{ t('auth.fields.password') }}
              </label>
              <div class="relative">
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  autocomplete="current-password"
                  :placeholder="t('auth.fields.passwordPlaceholder')"
                  :class="
                    cn(
                      'h-9 w-full rounded-sm border border-input bg-card px-3 pr-10 text-sm text-foreground',
                      'placeholder:text-muted-foreground',
                      'transition-colors duration-150',
                      'focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring/30',
                    )
                  "
                />
                <button
                  type="button"
                  class="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-muted-foreground transition-colors duration-150 hover:text-foreground focus:outline-none"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
                  tabindex="-1"
                  @click="showPassword = !showPassword"
                >
                  <EyeOff v-if="showPassword" class="size-4" />
                  <Eye v-else class="size-4" />
                </button>
              </div>
            </div>

            <!-- Error message -->
            <Transition
              enter-active-class="transition-all duration-200"
              enter-from-class="opacity-0 -translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
            >
              <div
                v-if="error"
                class="flex items-center gap-2 rounded-sm border border-destructive/20 bg-danger-subtle px-3 py-2 text-sm text-destructive"
              >
                <AlertCircle class="size-4 shrink-0" />
                {{ error }}
              </div>
            </Transition>

            <!-- Submit -->
            <button
              type="submit"
              :disabled="loading"
              :class="
                cn(
                  'flex h-9 w-full items-center justify-center gap-2 rounded-md',
                  'bg-primary text-sm text-primary-foreground',
                  'transition-colors duration-150 hover:bg-primary/90',
                  'focus:outline-none focus:ring-2 focus:ring-ring/30',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                )
              "
            >
              <Loader2 v-if="loading" class="size-4 animate-spin" />
              {{ loading ? t('auth.login.submitting') : t('auth.login.submit') }}
            </button>
          </form>

          <!-- Divider -->
          <div class="my-6 flex items-center gap-3">
            <div class="h-px flex-1 bg-border" />
            <span class="text-xs text-muted-foreground">{{ t('auth.or') }}</span>
            <div class="h-px flex-1 bg-border" />
          </div>

          <!-- GitHub OAuth -->
          <button
            type="button"
            :class="
              cn(
                'flex h-9 w-full items-center justify-center gap-2 rounded-md',
                'border border-border bg-card text-sm text-foreground',
                'transition-colors duration-150 hover:bg-accent',
                'focus:outline-none focus:ring-2 focus:ring-ring/30',
              )
            "
            @click="loginWith('github')"
          >
            <svg class="size-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z"
              />
            </svg>
            {{ t('auth.login.github') }}
          </button>
        </div>
      </div>

      <!-- Register link -->
      <p class="mt-6 text-center text-sm text-muted-foreground">
        {{ t('auth.login.noAccount') }}
        <RouterLink
          to="/register"
          class="text-primary underline-offset-4 transition-colors duration-150 hover:underline"
        >
          {{ t('auth.login.registerLink') }}
        </RouterLink>
      </p>
    </main>
  </div>
</template>
