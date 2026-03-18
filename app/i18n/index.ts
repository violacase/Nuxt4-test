import { createI18n } from 'vue-i18n'
import en from '../../i18n/locales/en.json'
import nl from '../../i18n/locales/nl.json'

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: { en, nl },
})
