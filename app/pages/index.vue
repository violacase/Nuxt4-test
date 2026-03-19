<script setup lang="ts">
import { ArrowRight, CircleCheck, CircleX } from 'lucide-vue-next'

const { t } = useI18n()

useHead({ title: 'Vue3-test — Full-stack scaffold' })

const health = ref<{ db: boolean } | null>(null)
onMounted(async () => {
  const res = await fetch('/api/health')
  if (res.ok) health.value = (await res.json()) as { db: boolean }
})

const stack = [
  'Vue 3',
  'GraphQL Yoga',
  'Drizzle ORM',
  'Tailwind v4',
  'Pinia',
  'reka-ui',
  'TypeScript',
]
</script>

<template>
  <!-- ── Hero ───────────────────────────────────────────────── -->
  <div class="flex flex-1 flex-col items-center justify-center px-6 py-24">
    <div class="max-w-2xl text-center">
      <!-- Eyebrow -->
      <p class="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {{ t('landing.eyebrow') }}
      </p>

      <!-- Headline -->
      <h1 class="mt-6 font-serif text-5xl leading-[1.1] tracking-tight text-foreground">
        {{ t('landing.headline') }}<br /><em>{{ t('landing.headlineEm') }}</em>
      </h1>

      <!-- Subtitle -->
      <p class="mx-auto mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
        {{ t('landing.subtitle') }}
      </p>

      <!-- CTA -->
      <div class="mt-10 flex items-center justify-center">
        <a
          href="https://github.com/violacase/Vue3-test"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-6 text-base text-primary-foreground transition-colors duration-150 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring/30"
        >
          {{ t('landing.cta') }}
          <ArrowRight class="size-4" />
        </a>
      </div>
    </div>

    <!-- DB status -->
    <div
      class="mt-12 flex items-center gap-2 rounded-sm border px-4 py-2 text-sm transition-colors duration-150"
      :class="
        health?.db
          ? 'border-success/30 bg-success-subtle text-success'
          : 'border-destructive/30 bg-danger-subtle text-destructive'
      "
    >
      <CircleCheck v-if="health?.db" class="size-4 shrink-0" />
      <CircleX v-else class="size-4 shrink-0" />
      <span class="font-mono">
        {{ health?.db ? t('landing.dbConnected') : t('landing.dbUnreachable') }}
      </span>
    </div>

    <!-- Stack chips -->
    <div class="mt-8 flex flex-wrap items-center justify-center gap-2">
      <span
        v-for="tech in stack"
        :key="tech"
        class="rounded-sm border border-border bg-card px-3 py-1 font-mono text-xs text-muted-foreground"
      >
        {{ tech }}
      </span>
    </div>
  </div>

  <!-- ── Footer ─────────────────────────────────────────────── -->
  <footer class="border-t border-border">
    <div class="mx-auto flex h-12 max-w-7xl items-center justify-between px-6">
      <p class="text-xs text-muted-foreground">{{ t('landing.footer') }}</p>
      <p class="text-xs text-muted-foreground">violacase</p>
    </div>
  </footer>
</template>
