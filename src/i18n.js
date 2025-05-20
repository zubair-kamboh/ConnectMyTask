import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './locales/en/translation.json'
import ur from './locales/ur/translation.json'
import hi from './locales/hi/translation.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    resources: {
      en: { translation: en },
      ur: { translation: ur },
      hi: { translation: hi },
    },
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
