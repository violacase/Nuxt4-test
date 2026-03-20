---
name: new-component
description: "Scaffold a new Vue 3 component using reka-ui primitives and Tailwind CSS. Use when the user asks to create a component, UI element, widget, or any .vue file in the components/ directory."
---

# Skill: New Component

## Rules
- Always use `<script setup lang="ts">` — never Options API
- Props via TypeScript interface + `withDefaults`
- Emits via typed `defineEmits`
- Use reka-ui primitives where applicable (Dialog, Popover, Select, etc.)
- Use `cn()` from `~/lib/utils` for conditional class merging
- Tailwind semantic utilities only — no raw color classes, no inline styles
- Use `useI18n()` for all user-facing strings
- Single root element in template
- Place in `components/ui/` for primitives, `components/` root for domain components

## Template

```vue
<script setup lang="ts">
import { cn } from '~/lib/utils'
// import { SomeRekaComponent } from 'reka-ui'
// import type { MyType } from '~/types/gql'

interface Props {
  // required props first, optional after
  label: string
  variant?: 'default' | 'outline' | 'ghost'
  disabled?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  disabled: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const { t } = useI18n()

// Reactive state
// const isOpen = ref(false)

const classes = computed(() =>
  cn(
    'base classes here',
    props.variant === 'outline' && 'border border-border',
    props.disabled && 'opacity-50 cursor-not-allowed',
    props.class,
  ),
)
</script>

<template>
  <div :class="classes">
    <!-- component content -->
  </div>
</template>
```

## Color Class Reference

| Semantic token     | Tailwind class                    |
|--------------------|-----------------------------------|
| Page background    | `bg-background`                   |
| Card/panel bg      | `bg-card`                         |
| Primary text       | `text-foreground`                 |
| Secondary text     | `text-muted-foreground`           |
| Border             | `border-border`                   |
| Action color (blue)| `bg-primary` / `text-primary`     |
| Text on action bg  | `text-primary-foreground`         |
| Hover bg           | `bg-accent`                       |
| Error/danger       | `text-destructive`                |
| Success            | `text-success`                    |
| Warning            | `text-warning`                    |

## Steps

1. Ask the user: what does this component do, what props does it need, does it use reka-ui?
2. Identify the correct `components/` subdirectory
3. Generate the component following the template above
4. If it uses GraphQL data, import the correct type from `~/types/gql`
5. If it contains user-facing text, use `t('key')` and add key to `app/locales/en.json`
