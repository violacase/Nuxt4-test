<script setup lang="ts">
import { Moon, Sun } from 'lucide-vue-next'

const { t } = useI18n()
const settings = useSettingsStore()
const { loggedIn } = useAuth()
</script>

<template>
  <header class="sticky top-0 z-20 border-b border-border bg-card/80 backdrop-blur-sm">
    <div class="mx-auto flex h-14 max-w-full items-center justify-between px-6">
      <NuxtLink
        to="/"
        class="font-mono text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 rounded-sm"
      >
        Vue3-test
      </NuxtLink>

      <div class="flex items-center gap-1">
        <LanguageSwitcher />

        <button
          class="flex h-8 items-center gap-2 rounded-md px-3 text-sm text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
          :aria-label="settings.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
          @click="settings.toggleTheme()"
        >
          <ClientOnly>
            <Sun v-if="settings.theme === 'dark'" class="size-4" />
            <Moon v-else class="size-4" />
            <template #fallback><Moon class="size-4" /></template>
          </ClientOnly>
        </button>

        <ClientOnly>
          <template v-if="loggedIn">
            <UserMenu />
          </template>
          <template v-else>
            <NuxtLink
              to="/login"
              class="flex h-8 items-center gap-2 rounded-md border border-border px-3 text-sm text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
            >
              {{ t('auth.loginLabel') }}
            </NuxtLink>
          </template>
        </ClientOnly>
      </div>
    </div>
  </header>
</template>
