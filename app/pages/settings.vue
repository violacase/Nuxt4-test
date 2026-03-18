<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="p-6 max-w-lg">
    <div class="flex flex-col gap-6">
      <!-- Theme -->
      <div class="rounded-md border border-border bg-card p-4">
        <p class="text-sm font-medium text-foreground">{{ t('settings.theme') }}</p>
        <div class="mt-2 flex gap-2">
          <span class="rounded-sm border border-border px-3 py-1 text-sm text-muted-foreground">
            {{ t('settings.theme_light') }}
          </span>
          <span class="rounded-sm border border-border px-3 py-1 text-sm text-muted-foreground">
            {{ t('settings.theme_dark') }}
          </span>
        </div>
      </div>

      <!-- Language -->
      <div class="rounded-md border border-border bg-card p-4">
        <p class="text-sm font-medium text-foreground">{{ t('settings.language') }}</p>
        <p class="mt-1 text-sm text-muted-foreground">English</p>
      </div>

      <!-- Layout -->
      <div class="rounded-md border border-border bg-card p-4">
        <p class="text-sm font-medium text-foreground">{{ t('settings.layout') }}</p>
        <div class="mt-2 flex gap-2">
          <span class="rounded-sm border border-border px-3 py-1 text-sm text-muted-foreground">
            {{ t('settings.layout_compact') }}
          </span>
          <span class="rounded-sm border border-border px-3 py-1 text-sm text-muted-foreground">
            {{ t('settings.layout_comfortable') }}
          </span>
        </div>
      </div>

      <!-- Reset -->
      <button
        class="w-fit rounded-md border border-border bg-card px-4 py-2 text-sm text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring/30"
        disabled
      >
        {{ t('settings.reset') }}
      </button>
    </div>
  </div>
</template>
