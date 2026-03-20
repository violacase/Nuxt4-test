---
name: design-component
description: "Design and scaffold a visually refined Vue component following the project design system. Use when the user asks to design, build, or style a component, page, layout, section, or any UI that needs to look polished — not just structurally correct. This skill combines design thinking with code generation."
---

# Skill: Design Component

This skill produces components that are **visually intentional**, not just structurally correct.
It combines the project design system with frontend-design thinking to generate components
that feel professionally crafted — not default Tailwind.

**Always read `design-system.md` before generating any code.**

---

## Step 1 — Understand Before Building

Before writing a single class, answer these questions (ask the user if unclear):

1. **What is this component?** (card, form, table, nav, modal, page section...)
2. **What does it communicate?** (hierarchy, status, data, action, navigation...)
3. **Who sees it and in what context?** (logged-in dashboard, public landing, settings panel...)
4. **What is the ONE thing the user should notice or do first?**
5. **What reka-ui primitives are involved?** (if any)

---

## Step 2 — Design Intent

State a clear design intent before coding. Example:

> "This is a data card for a dashboard. It should feel like a precise instrument readout —
> clean numerical hierarchy, minimal chrome. The value dominates. Everything else recedes."

This intent drives every class decision. If you cannot state it in one sentence, the design is not clear enough yet.

---

## Step 3 — Design System Checklist

Before generating, verify every decision against `design-system.md`:

- [ ] Typography: `font-serif` for titles, `font-sans` for UI — never mix up
- [ ] Colors: only semantic utilities (`text-foreground`, `bg-card`, `text-primary`) — never `text-blue-500`
- [ ] Spacing: multiples of 4px base unit? No odd spacing values (p-5, p-7)?
- [ ] Shape: `rounded-sm` for inputs, `rounded-md` for cards/buttons — correct?
- [ ] Borders: `border border-border` on cards? No shadow substituting for border?
- [ ] Motion: is motion warranted here? If yes, use correct duration/easing tokens
- [ ] Icons: `lucide-vue-next` only, `size-4` or `size-5`, inheriting text color
- [ ] Focus ring: `focus:ring-2 focus:ring-ring/30`? Hover uses `transition-colors duration-150`?
- [ ] `cn()` used for all conditional class merging?

---

## Step 4 — Generate

Follow the standard component template from `CLAUDE.md`, with design-system-aware classes.

### Tailwind Class Patterns

**Card layout:**
```html
<div class="border border-border rounded-md bg-card p-6
            shadow-[--shadow-sm] hover:shadow-[--shadow-md]
            transition-shadow duration-150">
```

**Typography:**
```html
<!-- Display heading (DM Serif Display) -->
<h1 class="font-serif text-4xl leading-tight tracking-tight text-foreground">

<!-- Section heading -->
<h2 class="font-serif text-3xl text-foreground">

<!-- UI heading / card title -->
<h3 class="text-xl font-medium text-foreground">

<!-- Body copy -->
<p class="text-base leading-relaxed text-muted-foreground">

<!-- All-caps label / eyebrow -->
<span class="text-xs font-medium uppercase tracking-widest text-muted-foreground">
```

**Interactive states:**
```html
<!-- Button — solid -->
<button class="bg-primary text-primary-foreground rounded-md h-9 px-4
               hover:bg-primary/90 transition-colors duration-150
               focus:outline-none focus:ring-2 focus:ring-ring/30
               disabled:opacity-50 disabled:cursor-not-allowed">

<!-- Input -->
<input class="h-9 w-full rounded-sm border border-input bg-card px-3
              text-sm text-foreground placeholder:text-muted-foreground
              focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring/30
              transition-colors duration-150">
```

**Status / semantic colors:**
```html
<span class="text-success">Success message</span>
<span class="text-destructive">Error message</span>
<span class="text-warning">Warning message</span>
<div class="bg-success-subtle border border-success/20 rounded-md p-3">...</div>
```

---

## Component Examples

### Stat Card
```vue
<script setup lang="ts">
import { cn } from '~/lib/utils'

interface Props {
  label: string
  value: string | number
  delta?: number
  deltaLabel?: string
}
defineProps<Props>()
</script>

<template>
  <div class="border border-border rounded-md bg-card p-6
              shadow-[--shadow-sm] hover:shadow-[--shadow-md]
              transition-shadow duration-150">
    <p class="text-xs font-medium uppercase tracking-widest text-muted-foreground">
      {{ label }}
    </p>
    <p class="mt-2 font-serif text-3xl leading-none text-foreground">
      {{ value }}
    </p>
    <p
      v-if="delta !== undefined"
      class="mt-2 text-sm"
      :class="delta >= 0 ? 'text-success' : 'text-destructive'"
    >
      {{ delta >= 0 ? '+' : '' }}{{ delta }}% {{ deltaLabel }}
    </p>
  </div>
</template>
```

### Section Header
```vue
<template>
  <div class="flex items-end justify-between border-b border-border pb-4">
    <div>
      <p class="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {{ eyebrow }}
      </p>
      <h2 class="mt-1 font-serif text-3xl text-foreground">
        {{ title }}
      </h2>
    </div>
    <slot name="action" />
  </div>
</template>
```

---

## Motion Guidelines (Context-Dependent)

**Add motion when it:**
- Confirms an action (success state transition)
- Reveals new content (panel slides in, list item added)
- Guides attention (skeleton pulse while loading)
- Communicates state change (toggle, tab switch)

**Skip motion when:**
- The component is purely static display
- The user needs to interact rapidly (tables, forms with many fields)
- The motion would repeat on every render

**When adding motion, use design system tokens:**
```html
<!-- Hover transition -->
class="transition-colors duration-150"

<!-- Entry animation (use sparingly) -->
class="animate-in fade-in-0 slide-in-from-bottom-2 duration-200"

<!-- Loading pulse -->
class="animate-pulse bg-muted rounded-sm"
```

---

## Quill Rich Text Components

When a design component includes Quill:
- Match toolbar and container border to `border-border`
- Container background: `bg-card`
- Always wrap in `<ClientOnly>` with a skeleton fallback matching the expected editor height

---

## Anti-Patterns — Never Generate These

- `text-blue-500` → use `text-primary`
- `bg-gray-50` → use `bg-background` or `bg-muted`
- `text-[--color-primary]` (old naming) → use `text-foreground`
- `font-[family-name:var(--font-display)]` (old) → use `font-serif`
- `font-bold` on anything larger than `text-sm`
- `rounded-full` on cards, panels, or inputs
- `shadow-lg` without a border
- Purple/violet as a theme color
- Gradient backgrounds on functional UI (cards, buttons, nav)
- More than one `solid` button in the same view
- Hardcoded pixel values in Tailwind (use spacing scale)
- `text-black` or `text-white` directly — use `text-foreground` or `text-primary-foreground`

---

## Full Design Review Checklist

Before delivering the component, review:

1. Does it match the stated design intent?
2. Are all colors semantic Tailwind utilities (`text-foreground`, `bg-card`, etc.)?
3. Is typography using `font-serif` for titles and `font-sans` for UI?
4. Is spacing consistent with the 4px base unit?
5. Does the interactive state (hover/focus) feel responsive but not jumpy?
6. Would this look wrong next to another component built with this design system? (If yes — fix it)
7. Does it respect dark mode via the `.dark` class on `<html>`?
