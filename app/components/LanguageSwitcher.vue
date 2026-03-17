<script setup lang="ts">
import { Globe } from 'lucide-vue-next'
import { cn } from '~/lib/utils'

const { locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const settings = useSettingsStore()

function switchLocale() {
  const next = locale.value === 'en' ? 'nl' : 'en'
  settings.locale = next
  navigateTo(switchLocalePath(next))
}
</script>

<template>
  <button
    :class="
      cn(
        'flex h-8 items-center gap-2 rounded-md px-3 font-mono text-sm text-muted-foreground',
        'transition-colors duration-150 hover:bg-accent hover:text-foreground',
        'focus:outline-none focus:ring-2 focus:ring-ring/30',
      )
    "
    :aria-label="`Switch to ${locale === 'en' ? 'Dutch' : 'English'}`"
    @click="switchLocale"
  >
    <Globe class="size-4" />
    {{ locale.toUpperCase() }}
  </button>
</template>
