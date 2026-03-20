<script setup lang="ts">
import { AlertCircle, Users } from 'lucide-vue-next'
import { cn } from '~/lib/utils'
import { UserRole } from '~/types/gql'
import { useUsers } from '~/composables/useUsers'

const { users, isLoading, error } = useUsers()

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric' }).format(
    new Date(iso),
  )
}

const roleBadgeClass: Record<UserRole, string> = {
  [UserRole.Admin]: 'bg-primary/10 text-primary',
  [UserRole.Member]: 'bg-muted text-muted-foreground',
  [UserRole.Guest]: 'bg-accent text-foreground/60',
}
</script>

<template>
  <div class="border border-border rounded-md bg-card overflow-hidden">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-border flex items-center justify-between">
      <div>
        <p class="text-xs font-medium uppercase tracking-widest text-muted-foreground">Directory</p>
        <h3 class="mt-0.5 text-xl font-medium text-foreground">Users</h3>
      </div>
      <span
        v-if="!isLoading && !error"
        class="text-xs font-medium text-muted-foreground tabular-nums"
      >
        {{ users.length }} {{ users.length === 1 ? 'user' : 'users' }}
      </span>
    </div>

    <!-- Loading skeleton -->
    <div v-if="isLoading" class="divide-y divide-border">
      <div
        v-for="i in 4"
        :key="i"
        class="flex items-center gap-4 px-6 py-4"
      >
        <div class="size-8 rounded-full bg-muted animate-pulse shrink-0" />
        <div class="flex-1 space-y-2">
          <div class="h-3 w-32 rounded-sm bg-muted animate-pulse" />
          <div class="h-3 w-48 rounded-sm bg-muted animate-pulse" />
        </div>
        <div class="h-5 w-16 rounded-sm bg-muted animate-pulse" />
        <div class="h-3 w-24 rounded-sm bg-muted animate-pulse" />
      </div>
    </div>

    <!-- Error state -->
    <div
      v-else-if="error"
      class="flex flex-col items-center gap-3 px-6 py-12 text-center"
    >
      <AlertCircle class="size-5 text-destructive" />
      <p class="text-sm text-destructive">Failed to load users.</p>
      <p class="text-xs text-muted-foreground">{{ error }}</p>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="users.length === 0"
      class="flex flex-col items-center gap-3 px-6 py-12 text-center"
    >
      <Users class="size-5 text-muted-foreground" />
      <p class="text-sm text-muted-foreground">No users found.</p>
    </div>

    <!-- Table -->
    <table v-else class="w-full text-sm">
      <thead>
        <tr class="border-b border-border bg-background">
          <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground">
            User
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground hidden md:table-cell">
            Email
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Role
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground hidden lg:table-cell">
            Joined
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-border">
        <tr
          v-for="user in users"
          :key="user.id"
          class="hover:bg-background transition-colors duration-150"
        >
          <!-- Avatar + Name -->
          <td class="px-6 py-3">
            <div class="flex items-center gap-3">
              <div class="size-8 rounded-full overflow-hidden shrink-0 bg-muted flex items-center justify-center">
                <img
                  v-if="user.avatarUrl"
                  :src="user.avatarUrl"
                  :alt="user.name"
                  class="size-full object-cover"
                />
                <span
                  v-else
                  class="text-xs font-medium text-muted-foreground select-none"
                >
                  {{ initials(user.name) }}
                </span>
              </div>
              <span class="font-medium text-foreground truncate max-w-[180px]">{{ user.name }}</span>
            </div>
          </td>

          <!-- Email -->
          <td class="px-6 py-3 text-muted-foreground hidden md:table-cell">
            <span class="truncate block max-w-[220px]">{{ user.email }}</span>
          </td>

          <!-- Role badge -->
          <td class="px-6 py-3">
            <span
              :class="cn(
                'inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium capitalize',
                roleBadgeClass[user.role],
              )"
            >
              {{ user.role }}
            </span>
          </td>

          <!-- Joined date -->
          <td class="px-6 py-3 text-muted-foreground hidden lg:table-cell tabular-nums">
            {{ formatDate(user.createdAt) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
