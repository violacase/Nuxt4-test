<!-- app.vue -->
<script setup lang="ts">
const settingsStore = useSettingsStore()

useHead({
  // Blocking inline script runs before paint — prevents dark mode FOUC
  script: [
    {
      innerHTML: `(function(){var t=localStorage.getItem('settings:theme');if(t==='dark')document.documentElement.classList.add('dark')})()`,
      tagPosition: 'head',
    },
  ],
  htmlAttrs: {
    lang: computed(() => settingsStore.locale),
  },
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
