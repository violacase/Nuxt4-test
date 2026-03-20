<script setup lang="ts">
import {
  Home,
  Layers,
  Box,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  User,
} from 'lucide-vue-next'
import { cn } from '~/lib/utils'

const route = useRoute()
const { user, loggedIn, logout } = useAuth()
const settings = useSettingsStore()

// isCollapsed is the inverse of the store's sidebarOpen
const isCollapsed = computed(() => !settings.sidebarOpen)

const navItems = [
  { label: 'Dashboard', href: '/', icon: Home },
  { label: 'Showcase', href: '/showcase', icon: Layers },
  { label: 'Components', href: '/components', icon: Box },
  { label: 'Settings', href: '/settings', icon: Settings },
]

function isActive(href: string) {
  if (href === '/') return route.path === '/'
  return route.path.startsWith(href)
}
</script>

<template>
  <aside
    :class="
      cn(
        'group/sidebar flex flex-col bg-card border-r border-border',
        'transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
        'overflow-hidden shrink-0 sticky top-14 h-[calc(100vh-3.5rem)]',
      )
    "
    style="width: var(--sidebar-width, 15rem)"
  >
    <!-- Header -->
    <div
      :class="
        cn(
          'flex h-14 items-center border-b border-border',
          isCollapsed ? 'justify-center px-0' : 'justify-between px-4',
        )
      "
    >
      <!-- Brand -->
      <RouterLink
        v-if="!isCollapsed"
        to="/"
        class="flex items-center gap-2 min-w-0 focus:outline-none focus:ring-2 focus:ring-ring/30 rounded-sm"
      >
        <div class="w-6 h-6 rounded-sm bg-primary flex items-center justify-center shrink-0">
          <span class="text-xs font-medium text-primary-foreground">N</span>
        </div>
        <span class="text-sm font-medium text-foreground truncate">Vue3-test</span>
      </RouterLink>

      <!-- Collapse toggle -->
      <button
        :class="
          cn(
            'flex items-center justify-center rounded-md transition-colors duration-150',
            'text-muted-foreground hover:text-foreground hover:bg-accent',
            'focus:outline-none focus:ring-2 focus:ring-ring/30',
            isCollapsed ? 'w-9 h-9' : 'w-8 h-8',
          )
        "
        :aria-label="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        @click="settings.toggleSidebar()"
      >
        <PanelLeftClose v-if="!isCollapsed" :size="18" />
        <PanelLeftOpen v-else :size="18" />
      </button>
    </div>

    <!-- Nav -->
    <nav class="flex-1 overflow-y-auto overflow-x-hidden py-3">
      <ul class="flex flex-col gap-0.5 px-2">
        <li v-for="item in navItems" :key="item.href">
          <RouterLink
            :to="item.href"
            :class="
              cn(
                'group/item relative flex h-9 items-center gap-3 rounded-md px-2.5',
                'text-sm transition-colors duration-150',
                'focus:outline-none focus:ring-2 focus:ring-ring/30',
                isActive(item.href)
                  ? 'bg-accent text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent',
              )
            "
          >
            <!-- Active indicator bar -->
            <span
              v-if="isActive(item.href)"
              class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-full"
            />

            <component
              :is="item.icon"
              :size="18"
              class="shrink-0"
              :class="isActive(item.href) ? 'text-primary' : ''"
            />

            <!-- Label — hidden when collapsed -->
            <span
              :class="
                cn(
                  'truncate transition-[opacity,transform] duration-200',
                  isCollapsed
                    ? 'opacity-0 -translate-x-1 pointer-events-none w-0'
                    : 'opacity-100 translate-x-0',
                )
              "
            >
              {{ item.label }}
            </span>

            <!-- Tooltip when collapsed -->
            <div
              v-if="isCollapsed"
              class="pointer-events-none absolute left-full ml-2 z-50 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-background shadow-[--shadow-lg] opacity-0 group-hover/item:opacity-100 transition-opacity duration-150"
            >
              {{ item.label }}
            </div>
          </RouterLink>
        </li>
      </ul>
    </nav>

    <!-- Divider -->
    <div class="border-t border-border" />

    <!-- User section -->
    <div :class="cn('flex items-center gap-3 px-2 py-3', isCollapsed ? 'flex-col' : 'flex-row')">
      <!-- Avatar -->
      <div
        class="relative w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0"
      >
        <User :size="16" class="text-primary" />
        <span
          v-if="loggedIn"
          class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success border-2 border-card"
        />
      </div>

      <!-- Name + logout — hidden when collapsed -->
      <div
        :class="
          cn(
            'flex flex-1 items-center justify-between min-w-0',
            'transition-[opacity,width] duration-200',
            isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100',
          )
        "
      >
        <div class="min-w-0">
          <p class="text-sm font-medium text-foreground truncate">
            {{ user?.name ?? 'Guest' }}
          </p>
          <p class="text-xs text-muted-foreground truncate">
            {{ user?.email ?? 'Not signed in' }}
          </p>
        </div>

        <button
          v-if="loggedIn"
          class="ml-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-danger-subtle transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring/30"
          aria-label="Sign out"
          @click="logout"
        >
          <LogOut :size="15" />
        </button>
      </div>

      <!-- Logout tooltip when collapsed -->
      <div v-if="isCollapsed && loggedIn" class="relative group/logout">
        <button
          class="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-danger-subtle transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring/30"
          aria-label="Sign out"
          @click="logout"
        >
          <LogOut :size="15" />
        </button>
        <div
          class="pointer-events-none absolute left-full ml-2 bottom-0 z-50 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-background shadow-[--shadow-lg] opacity-0 group-hover/logout:opacity-100 transition-opacity duration-150"
        >
          Sign out
        </div>
      </div>
    </div>
  </aside>
</template>
