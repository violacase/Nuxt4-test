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
  <div class="flex min-h-screen bg-background text-foreground">
    <AppSidebar />

    <!-- Main column -->
    <div class="flex min-w-0 flex-1 flex-col">
      <!-- Top bar -->
      <header
        class="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-border bg-card/80 px-6 backdrop-blur-sm"
      >
        <h1 class="font-serif text-xl text-foreground">
          {{ pageTitle }}
        </h1>

        <!-- Header action slot — pages can inject breadcrumbs, buttons, etc. -->
        <div class="ml-auto flex items-center gap-2">
          <slot name="header-actions" />
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1">
        <slot />
      </main>
    </div>
  </div>
</template>
