<!-- app.vue -->
<script setup lang="ts">
import DefaultLayout from './layouts/default.vue'

const route = useRoute()
const settingsStore = useSettingsStore()
const { locale } = useI18n()

// Initialize i18n locale from settings store (which reads from localStorage)
locale.value = settingsStore.locale

// Keep settings.locale in sync when locale changes programmatically
watch(locale, (val) => {
  settingsStore.locale = val
})

// Keep <html lang="..."> in sync
watch(
  () => settingsStore.locale,
  (val) => {
    document.documentElement.lang = val
  },
  { immediate: true },
)

const isDefaultLayout = computed(() => route.meta.layout !== false)
</script>

<template>
  <DefaultLayout v-if="isDefaultLayout">
    <RouterView />
  </DefaultLayout>
  <RouterView v-else />
</template>
