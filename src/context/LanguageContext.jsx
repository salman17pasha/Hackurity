import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { translations, SUPPORTED_LANGUAGES } from '../i18n/translations'

const LanguageContext = createContext(null)

const STORAGE_KEY = 'govchain_sentinel_language'

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) {
          return saved
        }
      }
    } catch {
      // Fallback
    }
    return 'en'
  })

  const setLanguage = useCallback((langCode) => {
    if (!SUPPORTED_LANGUAGES.some(l => l.code === langCode)) return
    setLanguageState(langCode)
    try {
      localStorage.setItem(STORAGE_KEY, langCode)
      // Also update html lang attribute for accessibility
      document.documentElement.setAttribute('lang', langCode)
    } catch {
      // ignore localStorage quota/disabled errors
    }
  }, [])

  // Update html lang attribute on mount or change
  useEffect(() => {
    try {
      document.documentElement.setAttribute('lang', language)
    } catch {
      // ignore
    }
  }, [language])

  // Translate helper function
  const t = useCallback((key, params = {}) => {
    const langDict = translations[language] || translations.en
    let str = langDict[key]

    // Fallback to English if key missing in chosen language
    if (str === undefined) {
      str = translations.en[key]
    }

    // Fallback to key itself if still undefined
    if (str === undefined) {
      return key
    }

    // Support parameter interpolation e.g. {block}, {count}, {name}
    if (params && typeof params === 'object') {
      Object.keys(params).forEach(pKey => {
        str = str.replace(new RegExp(`\\{${pKey}\\}`, 'g'), params[pKey])
      })
    }

    return str
  }, [language])

  const currentLanguageMeta = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0]

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t,
      languages: SUPPORTED_LANGUAGES,
      currentLanguageMeta
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
