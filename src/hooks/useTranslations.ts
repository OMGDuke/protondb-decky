import { useState } from 'react'
import languages from '../lib/translations'

function getCurrentLanguage(): keyof typeof languages {
  const lang = window.LocalizationManager
    .m_rgLocalesToUse[0] as keyof typeof languages
  return languages[lang] ? lang : 'en'
}

function useTranslations() {
  const [lang] = useState(getCurrentLanguage())
  return function (key: keyof (typeof languages)['en']): string {
    const stringTranslation = languages[lang]?.[key]
    return stringTranslation?.length ? stringTranslation : languages.en?.[key]
  }
}

export default useTranslations
