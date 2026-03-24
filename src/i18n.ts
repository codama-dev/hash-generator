import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import de from './locales/de.json'
import en from './locales/en.json'
import es from './locales/es.json'
import he from './locales/he.json'

const resources = {
  en: { translation: en },
  de: { translation: de },
  es: { translation: es },
  he: { translation: he },
}

const supportedLngs = ['en', 'de', 'es', 'he'] as const

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs: [...supportedLngs],
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  })

// Set document direction for RTL languages (e.g. Hebrew)
function setDocumentDirection(lng: string) {
  if (typeof document !== 'undefined') {
    document.documentElement.dir = lng === 'he' ? 'rtl' : 'ltr'
    document.documentElement.lang = lng
  }
}
i18n.on('languageChanged', setDocumentDirection)
setDocumentDirection(i18n.language)

export default i18n
