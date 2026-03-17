<!-- app.vue -->
<script setup lang="ts">
const settingsStore = useSettingsStore()
const { locale } = useI18n()

// Keep settings.locale in sync with the active i18n locale (e.g. when navigating to /nl/ directly)
watch(
  locale,
  (val) => {
    settingsStore.locale = val
  },
  { immediate: true },
)

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
