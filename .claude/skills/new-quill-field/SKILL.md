---
name: new-quill-field
description: "Scaffold a Quill rich text editor component. Use when the user asks to create a rich text editor, WYSIWYG field, content editor, or any Quill-based input."
---

# Skill: New Quill Field

## Rules
- ALWAYS wrap in `<ClientOnly>` — Quill requires the DOM, SSR will break
- Always provide a `#fallback` slot with a skeleton placeholder
- Use `content-type="html"` — content is stored as HTML string in Postgres
- Always sanitize HTML server-side before storing (remind user to use `sanitize-html`)
- Use `v-model:content` not `v-model`
- Expose as a form-compatible component with `v-model` support via `defineModel`
- Place in `components/editor/`

## Component Template

```vue
<!-- components/editor/RichTextField.vue -->
<script setup lang="ts">
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

interface Props {
  placeholder?: string
  readOnly?: boolean
  toolbar?: 'minimal' | 'full' | 'custom'
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  readOnly: false,
  toolbar: 'full',
})

// Two-way binding via defineModel
const content = defineModel<string>({ default: '' })

const toolbarOptions = {
  minimal: [
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['clean'],
  ],
  full: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['link', 'image'],
    ['clean'],
  ],
  custom: [], // override via slot or prop if needed
}

const quillOptions = computed(() => ({
  placeholder: props.placeholder,
  readOnly: props.readOnly,
  modules: {
    toolbar: toolbarOptions[props.toolbar],
  },
}))
</script>

<template>
  <div class="rich-text-field">
    <ClientOnly>
      <QuillEditor
        v-model:content="content"
        content-type="html"
        :options="quillOptions"
        class="min-h-[200px] rounded-md border border-input bg-background"
      />
      <template #fallback>
        <div class="h-[200px] animate-pulse rounded-md border border-input bg-muted" />
      </template>
    </ClientOnly>
  </div>
</template>
```

## Usage in a Form

```vue
<RichTextField
  v-model="form.content"
  placeholder="Write your article..."
  toolbar="full"
/>
```

## Server-side Sanitization (ALWAYS add this to resolvers)

```ts
// In your GraphQL mutation resolver before saving to DB:
import sanitizeHtml from 'sanitize-html'

const cleanContent = sanitizeHtml(input.content, {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'h3']),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    img: ['src', 'alt', 'title'],
  },
})
```

## Steps

1. Generate the `components/editor/RichTextField.vue` component
2. Remind the user to install: `npm install @vueup/vue-quill sanitize-html @types/sanitize-html`
3. Remind the user: ALWAYS sanitize in the server resolver before storing to Postgres
4. If image upload is needed, ask about image storage strategy (local, S3, etc.)
