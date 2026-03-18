<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'

// NuxtLink compat shim — delegates to <RouterLink>
defineOptions({ inheritAttrs: false })

const props = defineProps<{
  to: RouteLocationRaw
}>()
</script>

<template>
  <RouterLink :to="props.to" v-bind="$attrs"><slot /></RouterLink>
</template>
