<script setup lang="ts">
import { CircleCheck, CircleX } from 'lucide-vue-next'

const { t } = useI18n()

const health = ref<{ db: boolean } | null>(null)
onMounted(async () => {
  const res = await fetch('/api/health')
  if (res.ok) health.value = (await res.json()) as { db: boolean }
})
</script>

<template>
  <footer class="border-t border-border">
    <div class="mx-auto flex h-12 max-w-full items-center justify-between px-6">
      <p class="text-xs text-muted-foreground">{{ t('landing.footer') }}</p>
      <div
        class="flex items-center gap-1.5 text-xs"
        :class="health?.db ? 'text-success' : 'text-destructive'"
      >
        <CircleCheck v-if="health?.db" class="size-3.5 shrink-0" />
        <CircleX v-else class="size-3.5 shrink-0" />
        <span class="font-mono">{{
          health?.db ? t('landing.dbConnected') : t('landing.dbUnreachable')
        }}</span>
      </div>
    </div>
  </footer>
</template>
