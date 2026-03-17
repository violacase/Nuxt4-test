<script setup lang="ts">
import { LogOut } from 'lucide-vue-next'
import { onClickOutside } from '@vueuse/core'
import { cn } from '~/lib/utils'

const { user, logout } = useAuth()
const { t } = useI18n()

const open = ref(false)
const menuRef = ref<HTMLElement | null>(null)

onClickOutside(menuRef, () => { open.value = false })

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}

const initials = computed(() => {
  if (!user.value?.name) return '?'
  return user.value.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
})

async function handleLogout() {
  open.value = false
  await logout()
}
</script>

<template>
  <div ref="menuRef" class="relative" @keydown="handleKeydown">
    <!-- Avatar button -->
    <button
      :class="cn(
        'flex size-8 items-center justify-center rounded-md',
        'border border-border bg-muted',
        'font-mono text-xs text-foreground',
        'transition-colors duration-150 hover:bg-accent',
        'focus:outline-none focus:ring-2 focus:ring-ring/30',
        open && 'bg-accent',
      )"
      :aria-label="t('auth.userMenu.open')"
      :aria-expanded="open"
      :aria-haspopup="true"
      @click="open = !open"
    >
      <template v-if="user?.avatarUrl">
        <img
          :src="user.avatarUrl"
          :alt="user.name"
          class="size-full rounded-md object-cover"
        />
      </template>
      <template v-else>
        {{ initials }}
      </template>
    </button>

    <!-- Dropdown -->
    <Transition
      enter-active-class="transition-all duration-150 ease-out"
      enter-from-class="opacity-0 scale-95 translate-y-1"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition-all duration-100 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 translate-y-1"
    >
      <div
        v-if="open"
        class="absolute right-0 top-full z-50 mt-1 w-52 origin-top-right rounded-md border border-border bg-card shadow-[--shadow-lg]"
        role="menu"
      >
        <!-- User info -->
        <div class="border-b border-border px-4 py-3">
          <p class="truncate text-sm text-foreground">{{ user?.name }}</p>
          <p class="mt-0.5 truncate font-mono text-xs text-muted-foreground">
            {{ user?.email }}
          </p>
          <span
            class="mt-2 inline-block rounded-sm border border-border px-2 py-0.5 font-mono text-xs text-muted-foreground"
          >
            {{ user?.role }}
          </span>
        </div>

        <!-- Actions -->
        <div class="py-1">
          <button
            :class="cn(
              'flex w-full items-center gap-2 px-4 py-2',
              'text-sm text-muted-foreground',
              'transition-colors duration-150 hover:bg-accent hover:text-foreground',
              'focus:bg-accent focus:text-foreground focus:outline-none',
            )"
            role="menuitem"
            @click="handleLogout"
          >
            <LogOut class="size-4" />
            {{ t('auth.logout') }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>
