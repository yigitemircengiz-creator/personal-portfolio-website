'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { TRANSLATIONS, Language } from '@/lib/translations'

type LanguageContextType = {
  lang: Language
  setLang: (lang: Language) => void
  t: typeof TRANSLATIONS['eng']
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('eng')

  const value = {
    lang,
    setLang,
    t: TRANSLATIONS[lang]
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
