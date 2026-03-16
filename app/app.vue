<!-- app.vue -->
<script setup lang="ts">
const settingsStore = useSettingsStore()

// Apply dark mode class to <html> based on settings store
useHead({
  htmlAttrs: {
    class: computed(() => settingsStore.theme === 'dark' ? 'dark' : ''),
    lang: computed(() => settingsStore.locale),
  },
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
