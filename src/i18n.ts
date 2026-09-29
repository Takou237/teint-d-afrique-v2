export type Lang = 'fr' | 'en'

export type Localized = {
  fr: string
  en: string
}

export function tr(value: Localized, lang: Lang): string {
  return value[lang]
}
