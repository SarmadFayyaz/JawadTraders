'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { TRANSLATIONS, LOCALE_CONFIG, BUSINESS_NAME, type Locale, type Labels } from './constants'

interface LanguageContextValue {
  locale: Locale
  labels: Labels
  businessName: string
  dir: 'rtl' | 'ltr'
  dateLocale: string
  toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('ur')

  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale | null
    if (saved && (saved === 'ur' || saved === 'en')) {
      setLocale(saved)
    }
  }, [])

  useEffect(() => {
    const config = LOCALE_CONFIG[locale]
    document.documentElement.lang = config.htmlLang
    document.documentElement.dir = config.dir
    localStorage.setItem('locale', locale)
  }, [locale])

  const toggleLanguage = useCallback(() => {
    setLocale((prev) => (prev === 'ur' ? 'en' : 'ur'))
  }, [])

  const config = LOCALE_CONFIG[locale]

  return (
    <LanguageContext.Provider
      value={{
        locale,
        labels: TRANSLATIONS[locale],
        businessName: BUSINESS_NAME[locale],
        dir: config.dir,
        dateLocale: config.dateLocale,
        toggleLanguage,
      }}
    >
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
