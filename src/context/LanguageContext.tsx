import { createContext, useContext, useEffect, useState } from 'react'
import type { Lang } from '@/i18n'

const LanguageContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: 'fr',
  setLang: () => {},
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'fr'
    return window.localStorage.getItem('lang') === 'en' ? 'en' : 'fr'
  })

  const setLang = (l: Lang) => {
    setLangState(l)
    if (typeof window !== 'undefined') window.localStorage.setItem('lang', l)
  }

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  return <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>
}

export function useLang() {
  return useContext(LanguageContext)
}

/**
 * Returns a translator for a colocated dictionary of French source
 * strings mapped to their English translations:
 *
 *   const EN = { 'Notre Histoire': 'Our Story' }
 *   const t = useT(EN)
 *
 * Missing entries fall back to the French source text.
 */
export function useT(dict: Record<string, string> = {}) {
  const { lang } = useLang()
  return (source: string) => (lang === 'en' ? dict[source] ?? source : source)
}
