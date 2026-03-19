<script setup lang="ts">
import { Eye, EyeOff, Loader2, AlertCircle, Moon, Sun } from 'lucide-vue-next'
import { cn } from '~/lib/utils'

const { register } = useAuth()
const { t } = useI18n()
const settings = useSettingsStore()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const error = ref('')
const loading = ref(false)

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    await register(name.value, email.value, password.value)
    await router.push('/')
  } catch (e: unknown) {
    error.value = (e as { data?: { message?: string } })?.data?.message ?? t('auth.error.generic')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen flex-col bg-background">
    <!-- Top bar -->
    <div class="flex h-14 shrink-0 items-center justify-between px-6">
      <NuxtLink
        to="/"
        class="font-mono text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
      >
        Vue3-test
      </NuxtLink>
      <button
        class="flex h-8 items-center gap-2 rounded-md px-3 text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
        :aria-label="settings.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
        @click="settings.toggleTheme()"
      >
        <ClientOnly>
          <Sun v-if="settings.theme === 'dark'" class="size-4" />
          <Moon v-else class="size-4" />
          <template #fallback><Moon class="size-4" /></template>
        </ClientOnly>
      </button>
    </div>

    <!-- Form area -->
    <main class="flex flex-1 flex-col items-center justify-center px-4 pb-16">
      <!-- Title -->
      <div class="mb-8 w-full max-w-sm text-center">
        <h1 class="font-serif text-3xl text-foreground">
          {{ t('auth.register.title') }}
        </h1>
        <p class="mt-2 text-sm text-muted-foreground">
          {{ t('auth.register.subtitle') }}
        </p>
      </div>

      <!-- Card -->
      <div class="w-full max-w-sm rounded-md border border-border bg-card shadow-[--shadow-sm]">
        <div class="p-8">
          <form class="space-y-4" @submit.prevent="onSubmit">
            <!-- Name -->
            <div class="flex flex-col gap-2">
              <label for="name" class="text-sm text-foreground">
                {{ t('auth.fields.name') }}
              </label>
              <input
                id="name"
                v-model="name"
                type="text"
                required
                autocomplete="name"
                :placeholder="t('auth.fields.namePlaceholder')"
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
                  minlength="8"
                  autocomplete="new-password"
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
              <p class="text-xs text-muted-foreground">{{ t('auth.fields.passwordHint') }}</p>
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
              {{ loading ? t('auth.register.submitting') : t('auth.register.submit') }}
            </button>
          </form>
        </div>
      </div>

      <!-- Login link -->
      <p class="mt-6 text-center text-sm text-muted-foreground">
        {{ t('auth.register.hasAccount') }}
        <NuxtLink
          to="/login"
          class="text-primary underline-offset-4 transition-colors duration-150 hover:underline"
        >
          {{ t('auth.register.loginLink') }}
        </NuxtLink>
      </p>
    </main>
  </div>
</template>
