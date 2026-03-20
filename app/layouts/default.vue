<!-- layouts/default.vue -->
<script setup lang="ts">
const route = useRoute()

// Derive a readable page title from the route path
const pageTitle = computed(() => {
  const seg = route.path.split('/').filter(Boolean)
  if (!seg.length) return 'Dashboard'
  return seg[seg.length - 1].replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
})
</script>

<template>
  <div class="flex min-h-screen flex-col bg-background text-foreground">
    <!-- Global sticky header -->
    <AppHeader />

    <!-- Body: sidebar + content -->
    <div class="flex flex-1">
      <AppSidebar />

      <!-- Main column -->
      <div class="flex min-w-0 flex-1 flex-col">
        <!-- Per-page title bar -->
        <div class="flex h-12 items-center gap-4 border-b border-border px-6">
          <h1 class="font-serif text-lg text-foreground">
            {{ pageTitle }}
          </h1>

          <!-- Header action slot — pages can inject breadcrumbs, buttons, etc. -->
          <div class="ml-auto flex items-center gap-2">
            <slot name="header-actions" />
          </div>
        </div>

        <!-- Page content -->
        <main class="flex-1">
          <slot />
        </main>
      </div>
    </div>
    <AppFooter />
  </div>
</template>
