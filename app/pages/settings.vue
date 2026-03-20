<script setup lang="ts">
import { Check } from 'lucide-vue-next'

const { t, locale } = useI18n()
const settings = useSettingsStore()
const auth = useAuthStore()

useHead({ title: computed(() => `${t('settings.title')} — Vue3-test`) })

// ── Password change form ────────────────────────────────────────
const pwForm = reactive({ current: '', next: '', confirm: '' })
const pwError = ref('')
const pwSuccess = ref(false)
const pwSaving = ref(false)

async function changePassword() {
  pwError.value = ''
  pwSuccess.value = false

  if (pwForm.next !== pwForm.confirm) {
    pwError.value = t('settings.password_mismatch')
    return
  }

  pwSaving.value = true
  try {
    const res = await fetch('/api/auth/password', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }),
    })
    const data = (await res.json()) as { message?: string }
    if (!res.ok) {
      pwError.value = data.message ?? t('common.error')
    } else {
      pwSuccess.value = true
      pwForm.current = ''
      pwForm.next = ''
      pwForm.confirm = ''
    }
  } catch {
    pwError.value = t('common.error')
  } finally {
    pwSaving.value = false
  }
}

// ── Language helper ─────────────────────────────────────────────
function setLocale(code: string) {
  locale.value = code as 'en' | 'nl'
  settings.locale = code
}
</script>

<template>
  <div class="p-6 max-w-4xl">
    <h1 class="font-serif text-3xl text-foreground">{{ t('settings.title') }}</h1>

    <div class="mt-8 flex flex-col gap-6">
      <!-- ── Appearance ─────────────────────────────────────────── -->
      <div class="rounded-md border border-border bg-card p-6">
        <p class="text-sm font-medium text-foreground">{{ t('settings.theme') }}</p>
        <div class="mt-3 flex gap-2">
          <button
            class="h-8 rounded-sm border px-3 text-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring/30"
            :class="
              settings.theme === 'light'
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-transparent text-foreground hover:bg-accent'
            "
            @click="settings.theme = 'light'"
          >
            {{ t('settings.theme_light') }}
          </button>
          <button
            class="h-8 rounded-sm border px-3 text-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring/30"
            :class="
              settings.theme === 'dark'
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-transparent text-foreground hover:bg-accent'
            "
            @click="settings.theme = 'dark'"
          >
            {{ t('settings.theme_dark') }}
          </button>
        </div>

        <hr class="border-t border-border my-4" />

        <p class="text-sm font-medium text-foreground">{{ t('settings.layout') }}</p>
        <div class="mt-3 flex gap-2">
          <button
            class="h-8 rounded-sm border px-3 text-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring/30"
            :class="
              settings.layout === 'comfortable'
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-transparent text-foreground hover:bg-accent'
            "
            @click="settings.layout = 'comfortable'"
          >
            {{ t('settings.layout_comfortable') }}
          </button>
          <button
            class="h-8 rounded-sm border px-3 text-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring/30"
            :class="
              settings.layout === 'compact'
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-transparent text-foreground hover:bg-accent'
            "
            @click="settings.layout = 'compact'"
          >
            {{ t('settings.layout_compact') }}
          </button>
        </div>
      </div>

      <!-- ── Language ───────────────────────────────────────────── -->
      <div class="rounded-md border border-border bg-card p-6">
        <p class="text-sm font-medium text-foreground">{{ t('settings.language') }}</p>
        <div class="mt-3 flex gap-2">
          <button
            class="h-8 rounded-sm border px-3 text-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring/30"
            :class="
              locale === 'en'
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-transparent text-foreground hover:bg-accent'
            "
            @click="setLocale('en')"
          >
            English
          </button>
          <button
            class="h-8 rounded-sm border px-3 text-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring/30"
            :class="
              locale === 'nl'
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-transparent text-foreground hover:bg-accent'
            "
            @click="setLocale('nl')"
          >
            Nederlands
          </button>
        </div>
      </div>

      <!-- ── Account ────────────────────────────────────────────── -->
      <div class="rounded-md border border-border bg-card p-6">
        <p class="text-sm font-medium text-foreground">{{ t('settings.account') }}</p>

        <dl class="mt-3 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
          <dt class="text-muted-foreground">{{ t('settings.account_name') }}</dt>
          <dd class="text-foreground">{{ auth.user?.name }}</dd>
          <dt class="text-muted-foreground">{{ t('settings.account_email') }}</dt>
          <dd class="font-mono text-foreground">{{ auth.user?.email }}</dd>
          <dt class="text-muted-foreground">{{ t('settings.account_role') }}</dt>
          <dd class="text-foreground capitalize">{{ auth.user?.role }}</dd>
        </dl>

        <hr class="border-t border-border my-4" />

        <!-- Change password -->
        <p class="text-sm font-medium text-foreground">{{ t('settings.password_section') }}</p>

        <form class="mt-3 flex flex-col gap-3" @submit.prevent="changePassword">
          <div class="flex flex-col gap-1">
            <label class="text-xs text-muted-foreground">{{
              t('settings.password_current')
            }}</label>
            <input
              v-model="pwForm.current"
              type="password"
              autocomplete="current-password"
              required
              class="h-9 w-full rounded-sm border border-input bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring/30 transition-colors duration-150"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-xs text-muted-foreground">{{ t('settings.password_new') }}</label>
            <input
              v-model="pwForm.next"
              type="password"
              autocomplete="new-password"
              required
              minlength="8"
              class="h-9 w-full rounded-sm border border-input bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring/30 transition-colors duration-150"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-xs text-muted-foreground">{{
              t('settings.password_confirm')
            }}</label>
            <input
              v-model="pwForm.confirm"
              type="password"
              autocomplete="new-password"
              required
              minlength="8"
              class="h-9 w-full rounded-sm border border-input bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring/30 transition-colors duration-150"
              :class="pwForm.confirm && pwForm.next !== pwForm.confirm ? 'border-destructive' : ''"
            />
          </div>

          <p v-if="pwError" class="text-xs text-destructive">{{ pwError }}</p>

          <div class="flex items-center gap-3">
            <button
              type="submit"
              :disabled="pwSaving"
              class="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm text-primary-foreground transition-colors duration-150 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring/30 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {{ pwSaving ? t('settings.password_saving') : t('settings.password_save') }}
            </button>
            <span
              v-if="pwSuccess"
              class="flex items-center gap-1 text-xs text-success transition-opacity duration-200"
            >
              <Check class="size-3.5" />
              {{ t('settings.password_success') }}
            </span>
          </div>
        </form>
      </div>

      <!-- ── Reset ──────────────────────────────────────────────── -->
      <div>
        <button
          class="h-9 rounded-md border border-border bg-transparent px-4 text-sm text-muted-foreground transition-colors duration-150 hover:border-destructive/40 hover:text-destructive focus:outline-none focus:ring-2 focus:ring-ring/30"
          @click="settings.reset()"
        >
          {{ t('settings.reset') }}
        </button>
      </div>

      <!-- ── Users ───────────────────────────────────────────────── -->
      <UserTable />
    </div>
  </div>
</template>
