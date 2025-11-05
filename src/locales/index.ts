import en from './en.json'
import { useI18n, createI18n, type ComposerTranslation } from 'vue-i18n'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en },
  fallbackLocale: 'en',
  silentFallbackWarn: true
})

const t: ComposerTranslation<any, 'en', any> = i18n.global.t
const useLocale = useI18n

export { t, i18n, useLocale }
