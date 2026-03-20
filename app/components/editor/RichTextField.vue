<!-- components/editor/RichTextField.vue -->
<script setup lang="ts">
const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  readOnly: false,
  toolbar: 'full',
  minHeight: '200px',
})

// Dynamic import required — Quill needs the DOM
const QuillEditor = defineAsyncComponent(() =>
  import('@vueup/vue-quill').then((m) => m.QuillEditor),
)

interface Props {
  placeholder?: string
  readOnly?: boolean
  toolbar?: 'minimal' | 'full'
  minHeight?: string
}

// Native v-model support via defineModel
const content = defineModel<string>({ default: '' })

const toolbarOptions = {
  minimal: [
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean'],
  ],
  full: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['link', 'image', 'blockquote', 'code-block'],
    ['clean'],
  ],
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
  <div class="rich-text-field w-full">
    <Suspense>
      <QuillEditor
        v-model:content="content"
        content-type="html"
        :options="quillOptions"
        :style="{ minHeight }"
        class="rounded-md border border-[--color-border] bg-[--color-surface] text-sm"
      />
      <template #fallback>
        <div
          class="animate-pulse rounded-md border border-[--color-border] bg-[--color-canvas]"
          :style="{ minHeight }"
        />
      </template>
    </Suspense>
  </div>
</template>
