<!-- pages/index.vue -->
<script setup lang="ts">
const settings = useSettingsStore()
</script>

<template>
  <main class="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
    <div class="flex flex-col items-center gap-2 text-center">
      <h1 class="font-display text-4xl font-normal text-[--color-text-primary]">Nuxt Scaffold</h1>
      <p class="font-sans text-base text-[--color-text-muted]">
        Stack is wired up. Start building.
      </p>
    </div>

    <div
      class="flex items-center gap-3 rounded-md border border-[--color-border] bg-[--color-surface] px-4 py-3 text-sm text-[--color-text-secondary]"
    >
      <span class="font-mono text-xs text-[--color-text-muted]">theme</span>
      <span class="font-sans font-medium text-[--color-text-primary]">{{ settings.theme }}</span>
      <button
        class="rounded border border-[--color-border] bg-[--color-canvas] px-3 py-1 font-sans text-xs text-[--color-text-secondary] transition-colors hover:bg-[--color-surface-hover]"
        @click="settings.toggleTheme()"
      >
        Toggle dark mode
      </button>
    </div>

    <div class="grid grid-cols-3 gap-4 text-center text-xs text-[--color-text-muted]">
      <div class="rounded border border-[--color-border] bg-[--color-surface] px-4 py-3">
        <div class="font-mono text-[--color-accent]">GraphQL</div>
        <div class="mt-1">/api/graphql</div>
      </div>
      <div class="rounded border border-[--color-border] bg-[--color-surface] px-4 py-3">
        <div class="font-mono text-[--color-accent]">Drizzle</div>
        <div class="mt-1">npm run db:studio</div>
      </div>
      <div class="rounded border border-[--color-border] bg-[--color-surface] px-4 py-3">
        <div class="font-mono text-[--color-accent]">Codegen</div>
        <div class="mt-1">npm run codegen:watch</div>
      </div>
    </div>
  </main>
</template>
