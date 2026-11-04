import type { Lang } from '@/i18n'
import { useContent } from '@/hooks/useContent'

type LocalizedFallback<Keys extends string> = Record<Keys, Record<Lang, string>>

/**
 * Variante de useContent dont le repli est déjà localisé : chaque page fournit
 * le texte FR et EN, et le hook renvoie la valeur dans la langue active.
 */
export function usePageContent<Keys extends string>(
  page: string,
  lang: Lang,
  fallback: LocalizedFallback<Keys>
): Record<Keys, string> {
  const localized = {} as Record<Keys, string>
  for (const key of Object.keys(fallback) as Keys[]) {
    localized[key] = fallback[key][lang]
  }
  return useContent(page, lang, localized)
}
