<script setup lang="ts">
import { ref, computed } from 'vue'
import { cn } from '~/lib/utils'
import { ChevronDown, Star, AlertCircle, Check, Clock, MapPin, Mail } from 'lucide-vue-next'

const isDialogOpen = ref(false)
const selectedTab = ref('buttons')
const switchEnabled = ref(false)
const checkboxChecked = ref(false)
const inputValue = ref('')
const selectedCombo = ref('')
const sliderValue = ref(50)
const selectedRadio = ref('option1')
const ratings = ref([false, false, false, false, false])
const selectedCheckboxes = ref<string[]>([])
const currentPage = ref(1)
const isDrawerOpen = ref(false)
const expandedAccordions = ref<Record<string, boolean>>({})

const accordionItems = [
  {
    id: 'item1',
    title: 'What is Reka UI?',
    content:
      'Reka UI is an unstyled, accessible component library built on top of Radix UI primitives. It provides the building blocks for your design system.',
  },
  {
    id: 'item2',
    title: 'How do I customize components?',
    content:
      'Components are fully customizable through Tailwind CSS classes. Use the cn() utility to merge conditional classes while handling Tailwind conflicts.',
  },
  {
    id: 'item3',
    title: 'Is it accessible?',
    content:
      'Yes. All components follow WAI-ARIA standards and are fully keyboard navigable with proper focus management and semantic HTML.',
  },
]

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Components', href: '/components' },
  { label: 'Showcase', href: '/showcase' },
]

const tableData = [
  { name: 'Component', type: 'Interactive', status: 'Complete', updated: 'Today' },
  { name: 'Button', type: 'Action', status: 'Complete', updated: '2 days ago' },
  { name: 'Input', type: 'Form', status: 'Complete', updated: '1 week ago' },
  { name: 'Dialog', type: 'Overlay', status: 'In Progress', updated: '3 days ago' },
  { name: 'Dropdown', type: 'Navigation', status: 'Planned', updated: 'N/A' },
]

const ratingStars = computed(() => ratings.value.filter((r) => r).length)
</script>

<template>
  <div class="bg-background">
    <!-- Hero Section -->
    <section class="border-b border-border bg-card">
      <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div class="space-y-4">
          <p class="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Component Library
          </p>
          <h1 class="font-serif text-4xl tracking-tight text-foreground">Reka UI Showcase</h1>
          <p class="max-w-2xl text-base leading-relaxed text-muted-foreground">
            A curated demonstration of reka-ui components integrated with our design system. Each
            section showcases a component category with variants and interactive states.
          </p>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">
      <!-- Buttons Section -->
      <section class="space-y-6">
        <div class="border-b border-border pb-4">
          <p class="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Interactive Elements
          </p>
          <h2 class="mt-2 font-serif text-3xl text-foreground">Buttons</h2>
        </div>

        <div class="space-y-8">
          <!-- Solid Variant -->
          <div class="space-y-3">
            <p class="text-sm font-medium text-foreground">Solid Variant</p>
            <p class="text-sm text-muted-foreground">Primary action — use one per view</p>
            <div class="flex flex-wrap gap-3">
              <button
                class="bg-primary text-primary-foreground rounded-md h-9 px-4 text-sm hover:bg-primary/90 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                Create
              </button>
              <button
                class="bg-destructive text-destructive-foreground rounded-md h-9 px-4 text-sm hover:bg-destructive/90 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                Delete
              </button>
              <button
                class="bg-primary text-primary-foreground rounded-md h-9 px-4 text-sm hover:bg-primary/90 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring/30 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled
              >
                Disabled
              </button>
            </div>
          </div>

          <!-- Outline Variant -->
          <div class="space-y-3">
            <p class="text-sm font-medium text-foreground">Outline Variant</p>
            <p class="text-sm text-muted-foreground">Secondary action</p>
            <div class="flex flex-wrap gap-3">
              <button
                class="border border-border bg-transparent text-foreground rounded-md h-9 px-4 text-sm hover:bg-accent transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                Cancel
              </button>
              <button
                class="border border-border bg-transparent text-foreground rounded-md h-9 px-4 text-sm hover:bg-accent transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                Settings
              </button>
              <button
                class="border border-border bg-transparent text-foreground rounded-md h-9 px-4 text-sm hover:bg-accent transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring/30 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled
              >
                Disabled
              </button>
            </div>
          </div>

          <!-- Ghost Variant -->
          <div class="space-y-3">
            <p class="text-sm font-medium text-foreground">Ghost Variant</p>
            <p class="text-sm text-muted-foreground">Tertiary action, navigation</p>
            <div class="flex flex-wrap gap-3">
              <button
                class="text-muted-foreground rounded-md h-9 px-4 text-sm hover:text-foreground hover:bg-accent transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                Learn More
              </button>
              <button
                class="text-muted-foreground rounded-md h-9 px-4 text-sm hover:text-foreground hover:bg-accent transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                Skip
              </button>
            </div>
          </div>

          <!-- Button Sizes -->
          <div class="space-y-3">
            <p class="text-sm font-medium text-foreground">Sizes</p>
            <div class="flex flex-wrap gap-3 items-center">
              <button
                class="bg-primary text-primary-foreground rounded-md h-8 px-3 text-xs hover:bg-primary/90 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                Small
              </button>
              <button
                class="bg-primary text-primary-foreground rounded-md h-9 px-4 text-sm hover:bg-primary/90 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                Medium
              </button>
              <button
                class="bg-primary text-primary-foreground rounded-md h-11 px-6 text-base hover:bg-primary/90 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                Large
              </button>
            </div>
          </div>
        </div>

        <!-- Dialog Trigger -->
        <div class="space-y-3">
          <p class="text-sm font-medium text-foreground">Dialog Example</p>
          <button
            class="bg-primary text-primary-foreground rounded-md h-9 px-4 text-sm hover:bg-primary/90 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring/30"
            @click="isDialogOpen = true"
          >
            Open Dialog
          </button>
        </div>
      </section>

      <!-- Badges Section -->
      <section class="space-y-6">
        <div class="border-b border-border pb-4">
          <p class="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Status & Labels
          </p>
          <h2 class="mt-2 font-serif text-3xl text-foreground">Badges</h2>
        </div>

        <div class="space-y-6">
          <div class="space-y-3">
            <p class="text-sm font-medium text-foreground">Default Badges</p>
            <div class="flex flex-wrap gap-2">
              <span
                class="inline-flex items-center rounded-sm bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary border border-primary/20"
              >
                Featured
              </span>
              <span
                class="inline-flex items-center rounded-sm bg-success-subtle px-2.5 py-0.5 text-xs font-medium text-success border border-success/20"
              >
                Verified
              </span>
              <span
                class="inline-flex items-center rounded-sm bg-warning-subtle px-2.5 py-0.5 text-xs font-medium text-warning border border-warning/20"
              >
                Pending
              </span>
              <span
                class="inline-flex items-center rounded-sm bg-danger-subtle px-2.5 py-0.5 text-xs font-medium text-destructive border border-destructive/20"
              >
                Draft
              </span>
            </div>
          </div>

          <div class="space-y-3">
            <p class="text-sm font-medium text-foreground">Outline Badges</p>
            <div class="flex flex-wrap gap-2">
              <span
                class="inline-flex items-center rounded-sm border border-primary px-2.5 py-0.5 text-xs font-medium text-primary bg-transparent"
              >
                React
              </span>
              <span
                class="inline-flex items-center rounded-sm border border-foreground px-2.5 py-0.5 text-xs font-medium text-foreground bg-transparent"
              >
                Vue
              </span>
              <span
                class="inline-flex items-center rounded-sm border border-muted-foreground px-2.5 py-0.5 text-xs font-medium text-muted-foreground bg-transparent"
              >
                TypeScript
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Cards Section -->
      <section class="space-y-6">
        <div class="border-b border-border pb-4">
          <p class="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Containers
          </p>
          <h2 class="mt-2 font-serif text-3xl text-foreground">Cards</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Basic Card -->
          <div
            class="border border-border rounded-md bg-card p-6 shadow-[--shadow-sm] hover:shadow-[--shadow-md] transition-shadow duration-150 cursor-pointer"
          >
            <p class="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Card Title
            </p>
            <p class="mt-2 font-serif text-xl text-foreground">Interactive Card</p>
            <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
              This card demonstrates hover elevation and proper border usage. Hover over it to see
              the shadow transition.
            </p>
          </div>

          <!-- Stat Card -->
          <div class="border border-border rounded-md bg-card p-6 shadow-[--shadow-sm]">
            <p class="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Components
            </p>
            <p class="mt-2 font-serif text-3xl leading-none text-foreground">12</p>
            <p class="mt-2 text-sm text-success">+3 this month</p>
          </div>

          <!-- Card with Content -->
          <div class="border border-border rounded-md bg-card p-6 shadow-[--shadow-sm]">
            <div class="space-y-4">
              <h3 class="text-xl font-medium text-foreground">Feature Highlight</h3>
              <p class="text-sm leading-relaxed text-muted-foreground">
                Cards are the primary container for grouped content. Always include a border, never
                rely on shadow alone.
              </p>
              <div class="flex gap-2 pt-2">
                <span
                  class="inline-flex items-center rounded-sm bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary border border-primary/20"
                >
                  Design
                </span>
                <span
                  class="inline-flex items-center rounded-sm border border-border px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                >
                  System
                </span>
              </div>
            </div>
          </div>

          <!-- Empty State Card -->
          <div class="border border-border rounded-md bg-card p-6 shadow-[--shadow-sm] text-center">
            <p class="text-xl font-medium text-muted-foreground">No items</p>
            <p class="mt-2 text-sm text-muted-foreground">
              This card demonstrates empty state presentation
            </p>
          </div>
        </div>
      </section>

      <!-- Form Elements Section -->
      <section class="space-y-6">
        <div class="border-b border-border pb-4">
          <p class="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            User Input
          </p>
          <h2 class="mt-2 font-serif text-3xl text-foreground">Form Elements</h2>
        </div>

        <div class="space-y-8 max-w-md">
          <!-- Input -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground"> Text Input </label>
            <input
              v-model="inputValue"
              type="text"
              placeholder="Enter some text..."
              class="h-9 w-full rounded-sm border border-input bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring/30 transition-colors duration-150"
            />
          </div>

          <!-- Input with Error -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground"> Email (Error State) </label>
            <input
              type="email"
              placeholder="you@example.com"
              class="h-9 w-full rounded-sm border border-destructive bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring/30 transition-colors duration-150"
            />
            <p class="text-xs text-destructive">Please enter a valid email address</p>
          </div>

          <!-- Input Disabled -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-muted-foreground"> Disabled Input </label>
            <input
              type="text"
              value="Cannot edit"
              disabled
              class="h-9 w-full rounded-sm border border-input bg-card px-3 text-sm text-muted-foreground opacity-50 cursor-not-allowed"
            />
          </div>

          <!-- Switch -->
          <div class="space-y-3 pt-4 border-t border-border">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-foreground"> Enable Notifications </label>
              <button
                :class="
                  cn(
                    'relative inline-flex h-6 w-11 rounded-full transition-colors duration-150',
                    switchEnabled ? 'bg-primary' : 'bg-border',
                  )
                "
                role="switch"
                :aria-checked="switchEnabled"
                @click="switchEnabled = !switchEnabled"
              >
                <span
                  :class="
                    cn(
                      'inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-150',
                      switchEnabled ? 'translate-x-5' : 'translate-x-0.5',
                    )
                  "
                />
              </button>
            </div>
            <p class="text-xs text-muted-foreground">
              {{ switchEnabled ? 'Enabled' : 'Disabled' }}
            </p>
          </div>

          <!-- Checkbox -->
          <div class="space-y-3 pt-4 border-t border-border">
            <label class="flex items-center gap-3 cursor-pointer">
              <input
                v-model="checkboxChecked"
                type="checkbox"
                class="w-4 h-4 rounded-sm border border-input bg-card checked:bg-primary checked:border-primary focus:ring-2 focus:ring-ring/30 transition-colors duration-150 cursor-pointer"
              />
              <span class="text-sm font-medium text-foreground"> I agree to the terms </span>
            </label>
          </div>
        </div>
      </section>

      <!-- Tabs Section -->
      <section class="space-y-6">
        <div class="border-b border-border pb-4">
          <p class="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Navigation
          </p>
          <h2 class="mt-2 font-serif text-3xl text-foreground">Tabs</h2>
        </div>

        <div class="space-y-6">
          <!-- Tab Navigation -->
          <div class="border-b border-border">
            <div class="flex gap-8">
              <button
                :class="
                  cn(
                    'py-3 px-1 text-sm font-medium border-b-2 transition-colors duration-150',
                    selectedTab === 'overview'
                      ? 'border-primary text-foreground'
                      : 'border-transparent text-muted-foreground hover:text-foreground',
                  )
                "
                @click="selectedTab = 'overview'"
              >
                Overview
              </button>
              <button
                :class="
                  cn(
                    'py-3 px-1 text-sm font-medium border-b-2 transition-colors duration-150',
                    selectedTab === 'details'
                      ? 'border-primary text-foreground'
                      : 'border-transparent text-muted-foreground hover:text-foreground',
                  )
                "
                @click="selectedTab = 'details'"
              >
                Details
              </button>
              <button
                :class="
                  cn(
                    'py-3 px-1 text-sm font-medium border-b-2 transition-colors duration-150',
                    selectedTab === 'settings'
                      ? 'border-primary text-foreground'
                      : 'border-transparent text-muted-foreground hover:text-foreground',
                  )
                "
                @click="selectedTab = 'settings'"
              >
                Settings
              </button>
            </div>
          </div>

          <!-- Tab Content -->
          <div class="min-h-40 space-y-4">
            <template v-if="selectedTab === 'overview'">
              <h3 class="text-xl font-medium text-foreground">Overview</h3>
              <p class="text-sm leading-relaxed text-muted-foreground">
                This tab demonstrates a simple tab navigation pattern with underline indicator. The
                active tab shows primary color while inactive tabs use muted-foreground.
              </p>
            </template>

            <template v-if="selectedTab === 'details'">
              <h3 class="text-xl font-medium text-foreground">Details</h3>
              <p class="text-sm leading-relaxed text-muted-foreground">
                Tab content changes based on selection. Use tabs to organize related content into
                separate views without leaving the page.
              </p>
            </template>

            <template v-if="selectedTab === 'settings'">
              <h3 class="text-xl font-medium text-foreground">Settings</h3>
              <p class="text-sm leading-relaxed text-muted-foreground">
                Keep tab content focused and concise. Avoid nesting too many tabs or making content
                too long for a single tab panel.
              </p>
            </template>
          </div>
        </div>
      </section>

      <!-- Message States Section -->
      <section class="space-y-6">
        <div class="border-b border-border pb-4">
          <p class="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Feedback
          </p>
          <h2 class="mt-2 font-serif text-3xl text-foreground">Message States</h2>
        </div>

        <div class="space-y-4">
          <div class="border border-success/20 rounded-md bg-success-subtle p-4">
            <p class="text-sm font-medium text-success">Success</p>
            <p class="mt-1 text-sm text-success/80">Your changes have been saved successfully.</p>
          </div>

          <div class="border border-warning/20 rounded-md bg-warning-subtle p-4">
            <p class="text-sm font-medium text-warning">Warning</p>
            <p class="mt-1 text-sm text-warning/80">
              This action may have unintended consequences.
            </p>
          </div>

          <div class="border border-destructive/20 rounded-md bg-danger-subtle p-4">
            <p class="text-sm font-medium text-destructive">Error</p>
            <p class="mt-1 text-sm text-destructive/80">Something went wrong. Please try again.</p>
          </div>

          <div class="border border-border rounded-md bg-card p-4">
            <p class="text-sm font-medium text-foreground">Info</p>
            <p class="mt-1 text-sm text-muted-foreground">
              This is an informational message for the user.
            </p>
          </div>
        </div>
      </section>

      <!-- Accordion Section -->
      <section class="space-y-6">
        <div class="border-b border-border pb-4">
          <p class="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Content Organization
          </p>
          <h2 class="mt-2 font-serif text-3xl text-foreground">Accordion</h2>
        </div>

        <div class="space-y-2 max-w-2xl">
          <div
            v-for="item in accordionItems"
            :key="item.id"
            class="border border-border rounded-md overflow-hidden"
          >
            <button
              class="w-full flex items-center justify-between p-4 hover:bg-accent transition-colors duration-150 text-left"
              @click="expandedAccordions[item.id] = !expandedAccordions[item.id]"
            >
              <span class="font-medium text-foreground">
                {{ item.title }}
              </span>
              <ChevronDown
                :size="20"
                class="text-muted-foreground transition-transform duration-200"
                :class="expandedAccordions[item.id] && 'rotate-180'"
              />
            </button>
            <div
              v-if="expandedAccordions[item.id]"
              class="border-t border-border px-4 py-3 bg-card/50"
            >
              <p class="text-sm text-muted-foreground">
                {{ item.content }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Combobox/Select Section -->
      <section class="space-y-6">
        <div class="border-b border-border pb-4">
          <p class="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Selection Controls
          </p>
          <h2 class="mt-2 font-serif text-3xl text-foreground">Combobox & Select</h2>
        </div>

        <div class="space-y-6 max-w-md">
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground"> Choose Framework </label>
            <div class="relative">
              <button
                class="w-full h-9 px-3 rounded-sm border border-input bg-card flex items-center justify-between text-sm text-foreground hover:bg-accent transition-colors duration-150 focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
              >
                <span>{{ selectedCombo || 'Select framework...' }}</span>
                <ChevronDown :size="16" class="text-muted-foreground" />
              </button>
            </div>
          </div>

          <div class="space-y-3 pt-4 border-t border-border">
            <label class="text-sm font-medium text-foreground"> Radio Group </label>
            <div class="space-y-2">
              <label
                v-for="option in ['option1', 'option2', 'option3']"
                :key="option"
                class="flex items-center gap-3 cursor-pointer"
              >
                <input
                  v-model="selectedRadio"
                  :value="option"
                  type="radio"
                  class="w-4 h-4 rounded-full border border-input bg-card checked:border-primary checked:ring-2 checked:ring-primary/30 focus:ring-2 focus:ring-ring/30 transition-colors duration-150 cursor-pointer"
                />
                <span class="text-sm text-foreground"> Option {{ option.slice(-1) }} </span>
              </label>
            </div>
          </div>

          <div class="space-y-3 pt-4 border-t border-border">
            <label class="text-sm font-medium text-foreground"> Checkbox Group </label>
            <div class="space-y-2">
              <label
                v-for="option in ['React', 'Vue', 'Angular']"
                :key="option"
                class="flex items-center gap-3 cursor-pointer"
              >
                <input
                  :checked="selectedCheckboxes.includes(option)"
                  type="checkbox"
                  class="w-4 h-4 rounded-sm border border-input bg-card checked:bg-primary checked:border-primary focus:ring-2 focus:ring-ring/30 transition-colors duration-150 cursor-pointer"
                  @change="
                    (e) => {
                      const target = e.target as HTMLInputElement
                      if (target.checked) {
                        selectedCheckboxes.push(option)
                      } else {
                        selectedCheckboxes = selectedCheckboxes.filter((x) => x !== option)
                      }
                    }
                  "
                />
                <span class="text-sm text-foreground">
                  {{ option }}
                </span>
              </label>
            </div>
          </div>
        </div>
      </section>

      <!-- Slider Section -->
      <section class="space-y-6">
        <div class="border-b border-border pb-4">
          <p class="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Input Ranges
          </p>
          <h2 class="mt-2 font-serif text-3xl text-foreground">Slider & Range Input</h2>
        </div>

        <div class="space-y-8 max-w-md">
          <div class="space-y-3">
            <label class="text-sm font-medium text-foreground"> Volume: {{ sliderValue }}% </label>
            <input
              v-model.number="sliderValue"
              type="range"
              min="0"
              max="100"
              class="w-full h-2 bg-border rounded-full appearance-none cursor-pointer accent-primary transition-colors duration-150"
            />
          </div>

          <div class="space-y-3">
            <label class="text-sm font-medium text-foreground"> Disabled Slider </label>
            <input
              type="range"
              min="0"
              max="100"
              value="50"
              disabled
              class="w-full h-2 bg-border rounded-full appearance-none cursor-not-allowed opacity-50"
            />
          </div>
        </div>
      </section>

      <!-- Star Rating Section -->
      <section class="space-y-6">
        <div class="border-b border-border pb-4">
          <p class="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            User Feedback
          </p>
          <h2 class="mt-2 font-serif text-3xl text-foreground">Star Rating</h2>
        </div>

        <div class="space-y-6">
          <div class="space-y-3">
            <label class="text-sm font-medium text-foreground">
              Rate this component ({{ ratingStars }} / 5)
            </label>
            <div class="flex gap-2">
              <button
                v-for="i in 5"
                :key="i"
                class="p-1 rounded-sm transition-colors duration-150 hover:text-warning focus:outline-none focus:ring-2 focus:ring-ring/30"
                @click="ratings[i - 1] = !ratings[i - 1]"
              >
                <Star
                  :size="24"
                  :fill="ratings[i - 1] ? 'currentColor' : 'none'"
                  :class="ratings[i - 1] ? 'text-warning' : 'text-muted-foreground'"
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Breadcrumbs Section -->
      <section class="space-y-6">
        <div class="border-b border-border pb-4">
          <p class="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Navigation Paths
          </p>
          <h2 class="mt-2 font-serif text-3xl text-foreground">Breadcrumbs</h2>
        </div>

        <div class="space-y-4">
          <nav class="flex items-center gap-2 text-sm">
            <a
              v-for="(crumb, idx) in breadcrumbs"
              :key="idx"
              :href="crumb.href"
              class="text-primary hover:text-primary/80 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring/30 rounded-sm px-2 py-1"
            >
              {{ crumb.label }}
            </a>
            <template v-for="idx in breadcrumbs.length - 1" :key="`sep-${idx}`">
              <span class="text-muted-foreground">/</span>
            </template>
          </nav>

          <nav class="flex items-center gap-1 text-sm">
            <span v-for="(crumb, idx) in breadcrumbs" :key="idx" class="flex items-center gap-1">
              <a
                :href="crumb.href"
                class="text-primary hover:text-primary/80 transition-colors duration-150"
              >
                {{ crumb.label }}
              </a>
              <span v-if="idx < breadcrumbs.length - 1" class="text-muted-foreground">&gt;</span>
            </span>
          </nav>
        </div>
      </section>

      <!-- Pagination Section -->
      <section class="space-y-6">
        <div class="border-b border-border pb-4">
          <p class="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Content Navigation
          </p>
          <h2 class="mt-2 font-serif text-3xl text-foreground">Pagination</h2>
        </div>

        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <button
              :disabled="currentPage === 1"
              class="h-9 px-3 border border-border rounded-md text-sm font-medium text-foreground bg-card hover:bg-accent transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring/30"
              @click="currentPage = Math.max(1, currentPage - 1)"
            >
              Previous
            </button>

            <div class="flex gap-2">
              <button
                v-for="page in 5"
                :key="page"
                :class="
                  cn(
                    'h-9 w-9 rounded-md text-sm font-medium transition-colors duration-150',
                    'focus:outline-none focus:ring-2 focus:ring-ring/30',
                    currentPage === page
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-border bg-card text-foreground hover:bg-accent',
                  )
                "
                @click="currentPage = page"
              >
                {{ page }}
              </button>
            </div>

            <button
              :disabled="currentPage === 5"
              class="h-9 px-3 border border-border rounded-md text-sm font-medium text-foreground bg-card hover:bg-accent transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring/30"
              @click="currentPage = Math.min(5, currentPage + 1)"
            >
              Next
            </button>
          </div>

          <p class="text-sm text-muted-foreground text-center">Page {{ currentPage }} of 5</p>
        </div>
      </section>

      <!-- Progress Section -->
      <section class="space-y-6">
        <div class="border-b border-border pb-4">
          <p class="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Status Indicators
          </p>
          <h2 class="mt-2 font-serif text-3xl text-foreground">Progress & Loading</h2>
        </div>

        <div class="space-y-8">
          <div class="space-y-3">
            <label class="text-sm font-medium text-foreground"> Progress Bar - 65% </label>
            <div class="h-2 bg-border rounded-full overflow-hidden">
              <div class="h-full w-2/3 bg-primary transition-all duration-500 rounded-full" />
            </div>
          </div>

          <div class="space-y-3">
            <label class="text-sm font-medium text-foreground"> Progress Bar - 100% </label>
            <div class="h-2 bg-border rounded-full overflow-hidden">
              <div class="h-full w-full bg-success transition-all duration-500 rounded-full" />
            </div>
          </div>

          <div class="space-y-3">
            <label class="text-sm font-medium text-foreground"> Skeleton Loading </label>
            <div class="space-y-3">
              <div class="h-4 bg-muted rounded-sm animate-pulse" />
              <div class="h-4 bg-muted rounded-sm animate-pulse w-5/6" />
              <div class="h-4 bg-muted rounded-sm animate-pulse w-4/6" />
            </div>
          </div>

          <div class="space-y-3">
            <label class="text-sm font-medium text-foreground"> Circular Progress </label>
            <div class="flex gap-6">
              <div class="relative w-16 h-16">
                <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    class="text-border"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-dasharray="212"
                    stroke-dashoffset="75"
                    class="text-primary transition-all duration-500"
                  />
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-sm font-medium text-foreground">65%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Alert Dialog Section -->
      <section class="space-y-6">
        <div class="border-b border-border pb-4">
          <p class="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Critical Actions
          </p>
          <h2 class="mt-2 font-serif text-3xl text-foreground">Alert Dialog</h2>
        </div>

        <div class="border-2 border-destructive/30 rounded-md bg-danger-subtle p-6 space-y-4">
          <div class="flex gap-3">
            <AlertCircle :size="20" class="text-destructive flex-shrink-0 mt-0.5" />
            <div class="space-y-2 flex-1">
              <h3 class="text-sm font-medium text-destructive">Confirm Deletion</h3>
              <p class="text-sm text-destructive/80">
                This action cannot be undone. All data will be permanently deleted.
              </p>
            </div>
          </div>
          <div class="flex gap-3 pt-4">
            <button
              class="border border-destructive/20 bg-transparent text-destructive rounded-md h-9 px-4 text-sm hover:bg-destructive/10 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring/30"
            >
              Cancel
            </button>
            <button
              class="bg-destructive text-destructive-foreground rounded-md h-9 px-4 text-sm hover:bg-destructive/90 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring/30"
            >
              Delete
            </button>
          </div>
        </div>
      </section>

      <!-- Avatar Section -->
      <section class="space-y-6">
        <div class="border-b border-border pb-4">
          <p class="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            User Representation
          </p>
          <h2 class="mt-2 font-serif text-3xl text-foreground">Avatars</h2>
        </div>

        <div class="space-y-6">
          <div class="space-y-3">
            <label class="text-sm font-medium text-foreground">Avatar Sizes</label>
            <div class="flex items-center gap-6">
              <div
                class="w-8 h-8 rounded-full bg-primary/10 border border-primary flex items-center justify-center text-xs font-medium text-primary"
              >
                AB
              </div>
              <div
                class="w-10 h-10 rounded-full bg-primary/10 border border-primary flex items-center justify-center text-sm font-medium text-primary"
              >
                CD
              </div>
              <div
                class="w-12 h-12 rounded-full bg-primary/10 border border-primary flex items-center justify-center text-base font-medium text-primary"
              >
                EF
              </div>
              <div
                class="w-16 h-16 rounded-full bg-primary/10 border border-primary flex items-center justify-center text-lg font-medium text-primary"
              >
                GH
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <label class="text-sm font-medium text-foreground">Avatar Group</label>
            <div class="flex -space-x-2">
              <div
                v-for="i in 4"
                :key="i"
                class="w-10 h-10 rounded-full bg-primary/10 border-2 border-card flex items-center justify-center text-sm font-medium text-primary"
              >
                {{ String.fromCharCode(64 + i) }}
              </div>
              <div
                class="w-10 h-10 rounded-full bg-muted border-2 border-card flex items-center justify-center text-sm font-medium text-muted-foreground"
              >
                +2
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Data Table Section -->
      <section class="space-y-6">
        <div class="border-b border-border pb-4">
          <p class="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Data Display
          </p>
          <h2 class="mt-2 font-serif text-3xl text-foreground">Data Table</h2>
        </div>

        <div class="border border-border rounded-md overflow-hidden">
          <table class="w-full text-sm">
            <thead class="border-b border-border bg-muted/50">
              <tr>
                <th class="px-6 py-3 text-left font-medium text-foreground">Name</th>
                <th class="px-6 py-3 text-left font-medium text-foreground">Type</th>
                <th class="px-6 py-3 text-left font-medium text-foreground">Status</th>
                <th class="px-6 py-3 text-left font-medium text-foreground">Updated</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr
                v-for="row in tableData"
                :key="row.name"
                class="hover:bg-accent/30 transition-colors duration-150"
              >
                <td class="px-6 py-4 text-foreground font-medium">{{ row.name }}</td>
                <td class="px-6 py-4 text-muted-foreground">{{ row.type }}</td>
                <td class="px-6 py-4">
                  <span
                    :class="
                      cn(
                        'inline-flex items-center rounded-sm px-2.5 py-0.5 text-xs font-medium border',
                        row.status === 'Complete' &&
                          'bg-success-subtle text-success border-success/20',
                        row.status === 'In Progress' &&
                          'bg-warning-subtle text-warning border-warning/20',
                        row.status === 'Planned' && 'bg-muted text-muted-foreground border-border',
                      )
                    "
                  >
                    {{ row.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-muted-foreground">{{ row.updated }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Popover Section -->
      <section class="space-y-6">
        <div class="border-b border-border pb-4">
          <p class="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Floating UI
          </p>
          <h2 class="mt-2 font-serif text-3xl text-foreground">Popover & Tooltip</h2>
        </div>

        <div class="space-y-6">
          <div class="relative inline-block">
            <button
              class="bg-primary text-primary-foreground rounded-md h-9 px-4 text-sm hover:bg-primary/90 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring/30 group"
            >
              Hover for Tooltip
              <div
                class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-foreground text-background text-xs rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap shadow-[--shadow-lg]"
              >
                This is a tooltip
              </div>
            </button>
          </div>

          <div class="relative inline-block">
            <button
              class="border border-border bg-card text-foreground rounded-md h-9 px-4 text-sm hover:bg-accent transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring/30"
            >
              Click for Popover
            </button>
            <div
              class="absolute top-full left-0 mt-2 w-56 border border-border rounded-md bg-card p-4 shadow-[--shadow-lg] space-y-3 hidden group-hover:block"
            >
              <h3 class="font-medium text-foreground">Popover Title</h3>
              <p class="text-sm text-muted-foreground">
                This is a popover with additional content and actions.
              </p>
              <button
                class="text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-150"
              >
                Learn More →
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Icon & Badge Combinations -->
      <section class="space-y-6">
        <div class="border-b border-border pb-4">
          <p class="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Component Combinations
          </p>
          <h2 class="mt-2 font-serif text-3xl text-foreground">Icon + Badge Patterns</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Icon Button -->
          <div class="space-y-3">
            <label class="text-sm font-medium text-foreground">Icon Button</label>
            <div class="flex gap-2">
              <button
                class="w-9 h-9 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                <Mail :size="18" />
              </button>
              <button
                class="w-9 h-9 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                <Clock :size="18" />
              </button>
              <button
                class="w-9 h-9 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                <MapPin :size="18" />
              </button>
            </div>
          </div>

          <!-- Button with Icon -->
          <div class="space-y-3">
            <label class="text-sm font-medium text-foreground">Button with Icon</label>
            <div class="flex gap-2">
              <button
                class="bg-primary text-primary-foreground rounded-md h-9 px-4 text-sm flex items-center gap-2 hover:bg-primary/90 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                <Check :size="16" />
                Confirm
              </button>
              <button
                class="border border-border bg-card text-foreground rounded-md h-9 px-4 text-sm flex items-center gap-2 hover:bg-accent transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring/30"
              >
                <Clock :size="16" />
                Schedule
              </button>
            </div>
          </div>

          <!-- Badge with Icon -->
          <div class="space-y-3">
            <label class="text-sm font-medium text-foreground">Badge Variants</label>
            <div class="flex flex-wrap gap-2">
              <span
                class="inline-flex items-center rounded-sm bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary border border-primary/20 gap-1"
              >
                <Check :size="14" />
                Verified
              </span>
              <span
                class="inline-flex items-center rounded-sm bg-success-subtle px-2.5 py-0.5 text-xs font-medium text-success border border-success/20 gap-1"
              >
                <Check :size="14" />
                Active
              </span>
            </div>
          </div>

          <!-- Badge with Notification -->
          <div class="space-y-3">
            <label class="text-sm font-medium text-foreground">Badge with Notification</label>
            <div class="flex gap-4">
              <div class="relative inline-block">
                <button
                  class="w-10 h-10 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-150"
                >
                  <Mail :size="20" />
                </button>
                <span
                  class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-white text-xs font-medium flex items-center justify-center"
                >
                  3
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Dropdown Menu Section -->
      <section class="space-y-6">
        <div class="border-b border-border pb-4">
          <p class="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Context Actions
          </p>
          <h2 class="mt-2 font-serif text-3xl text-foreground">Dropdown Menu</h2>
        </div>

        <div class="space-y-4">
          <div class="relative inline-block group">
            <button
              class="border border-border bg-card text-foreground rounded-md h-9 px-4 text-sm hover:bg-accent transition-colors duration-150 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-ring/30"
            >
              Actions
              <ChevronDown :size="16" />
            </button>
            <div
              class="absolute left-0 mt-1 w-48 bg-card border border-border rounded-md shadow-[--shadow-lg] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 divide-y divide-border overflow-hidden z-10"
            >
              <button
                class="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors duration-150"
              >
                Edit
              </button>
              <button
                class="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors duration-150"
              >
                Duplicate
              </button>
              <button
                class="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors duration-150"
              >
                Share
              </button>
              <button
                class="block w-full text-left px-4 py-2 text-sm text-destructive hover:bg-danger-subtle transition-colors duration-150"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Drawer/Sidebar Section -->
      <section class="space-y-6">
        <div class="border-b border-border pb-4">
          <p class="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Slide Panels
          </p>
          <h2 class="mt-2 font-serif text-3xl text-foreground">Drawer & Sidebar</h2>
        </div>

        <button
          class="bg-primary text-primary-foreground rounded-md h-9 px-4 text-sm hover:bg-primary/90 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring/30"
          @click="isDrawerOpen = true"
        >
          Open Drawer
        </button>
      </section>

      <!-- Code Block Section -->
      <section class="space-y-6">
        <div class="border-b border-border pb-4">
          <p class="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Development
          </p>
          <h2 class="mt-2 font-serif text-3xl text-foreground">Code Block</h2>
        </div>

        <div
          class="border border-border rounded-md bg-foreground/95 p-6 overflow-x-auto font-mono text-sm"
        >
          <pre class="text-background"><code>&lt;button class="bg-primary text-primary-foreground
           rounded-md h-9 px-4 text-sm
           hover:bg-primary/90 transition-colors duration-150"&gt;
  Click Me
&lt;/button&gt;</code></pre>
        </div>
      </section>

      <!-- Stepper/Wizard Section -->
      <section class="space-y-6">
        <div class="border-b border-border pb-4">
          <p class="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Process Flows
          </p>
          <h2 class="mt-2 font-serif text-3xl text-foreground">Stepper & Wizard</h2>
        </div>

        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <div v-for="step in 4" :key="step" class="flex flex-col items-center flex-1">
              <div
                :class="
                  cn(
                    'w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors duration-150',
                    step <= 2
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-border bg-card text-foreground',
                  )
                "
              >
                <template v-if="step < 2">
                  <Check :size="20" />
                </template>
                <template v-else>
                  {{ step }}
                </template>
              </div>
              <p class="mt-2 text-xs font-medium text-muted-foreground">Step {{ step }}</p>
              <div
                v-if="step < 4"
                :class="
                  cn(
                    'absolute left-1/2 -translate-x-1/2 w-1/3 h-1 mt-5 transition-all duration-150',
                    step < 2 ? 'bg-primary' : 'bg-border',
                  )
                "
              />
            </div>
          </div>

          <div class="border-t border-border pt-6 space-y-2">
            <h3 class="text-sm font-medium text-foreground">Step 2: Enter Details</h3>
            <p class="text-sm text-muted-foreground">
              Fill in the required information to continue
            </p>
          </div>
        </div>
      </section>

      <!-- Timeline Section -->
      <section class="space-y-6">
        <div class="border-b border-border pb-4">
          <p class="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Sequential Events
          </p>
          <h2 class="mt-2 font-serif text-3xl text-foreground">Timeline</h2>
        </div>

        <div class="space-y-6 max-w-2xl">
          <div
            v-for="(event, idx) in [
              { title: 'Account Created', time: '2 days ago' },
              { title: 'Email Verified', time: '2 days ago' },
              { title: 'Profile Completed', time: '1 day ago' },
              { title: 'First Purchase', time: '6 hours ago' },
            ]"
            :key="idx"
            class="flex gap-6 pb-6"
            :class="idx < 3 && 'border-b border-border'"
          >
            <div class="relative">
              <div
                :class="
                  cn(
                    'w-6 h-6 rounded-full border-2 transition-colors duration-150',
                    idx < 3 ? 'border-primary bg-primary' : 'border-border bg-muted',
                  )
                "
              />
              <div
                v-if="idx < 3"
                class="absolute top-6 left-1/2 -translate-x-1/2 w-0.5 h-12 bg-primary"
              />
            </div>
            <div class="pt-1">
              <p class="font-medium text-foreground">{{ event.title }}</p>
              <p class="text-sm text-muted-foreground">{{ event.time }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Tags Input Section -->
      <section class="space-y-6">
        <div class="border-b border-border pb-4">
          <p class="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Bulk Input
          </p>
          <h2 class="mt-2 font-serif text-3xl text-foreground">Tags Input</h2>
        </div>

        <div class="max-w-md space-y-3">
          <label class="text-sm font-medium text-foreground"> Add Tags (Press Enter) </label>
          <div
            class="border border-input rounded-sm bg-card p-3 flex flex-wrap gap-2 items-center focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/30 transition-colors duration-150"
          >
            <span
              v-for="tag in ['React', 'Vue', 'TypeScript']"
              :key="tag"
              class="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-sm px-2.5 py-0.5 text-xs font-medium"
            >
              {{ tag }}
              <button class="text-primary/70 hover:text-primary transition-colors duration-150">
                ×
              </button>
            </span>
            <input
              type="text"
              placeholder="Add more..."
              class="flex-1 min-w-24 text-sm text-foreground placeholder:text-muted-foreground bg-transparent outline-none"
            />
          </div>
        </div>
      </section>
    </div>

    <!-- Dialog -->
    <div
      v-if="isDialogOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div class="w-full max-w-md border border-border rounded-lg bg-card p-6 shadow-[--shadow-lg]">
        <h2 class="font-serif text-xl text-foreground">Dialog Example</h2>
        <p class="mt-3 text-sm text-muted-foreground">
          This is a simple modal dialog demonstrating proper layering and focus management. Click
          outside or on the close button to dismiss.
        </p>
        <div class="mt-6 flex gap-3 justify-end">
          <button
            class="border border-border bg-transparent text-foreground rounded-md h-9 px-4 text-sm hover:bg-accent transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring/30"
            @click="isDialogOpen = false"
          >
            Cancel
          </button>
          <button
            class="bg-primary text-primary-foreground rounded-md h-9 px-4 text-sm hover:bg-primary/90 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring/30"
            @click="isDialogOpen = false"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>

    <!-- Drawer -->
    <div v-if="isDrawerOpen" class="fixed inset-0 z-50">
      <div class="absolute inset-0 bg-black/50" @click="isDrawerOpen = false" />
      <div
        class="absolute top-0 left-0 h-full w-64 bg-card border-r border-border shadow-[--shadow-lg] animate-in slide-in-from-left-full duration-300 flex flex-col"
      >
        <div class="p-6 border-b border-border flex items-center justify-between">
          <h2 class="font-serif text-xl text-foreground">Drawer Panel</h2>
          <button
            class="text-muted-foreground hover:text-foreground transition-colors duration-150"
            @click="isDrawerOpen = false"
          >
            ✕
          </button>
        </div>
        <div class="flex-1 p-6 space-y-4">
          <button
            class="w-full text-left px-4 py-2 rounded-md text-sm text-foreground hover:bg-accent transition-colors duration-150"
          >
            Dashboard
          </button>
          <button
            class="w-full text-left px-4 py-2 rounded-md text-sm text-foreground hover:bg-accent transition-colors duration-150"
          >
            Components
          </button>
          <button
            class="w-full text-left px-4 py-2 rounded-md text-sm text-foreground hover:bg-accent transition-colors duration-150"
          >
            Settings
          </button>
        </div>
        <div class="border-t border-border p-6">
          <button
            class="w-full bg-primary text-primary-foreground rounded-md h-9 text-sm font-medium hover:bg-primary/90 transition-colors duration-150"
            @click="isDrawerOpen = false"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
