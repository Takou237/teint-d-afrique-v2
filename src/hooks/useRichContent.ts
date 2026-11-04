import { useEffect, useState } from 'react'
import type { Lang } from '@/i18n'
import { fetchContent } from '@/lib/api'

type Dangerous = { __html: string }

export type RichContent<Keys extends string> = Record<Keys, Dangerous>

function toDangerous<Keys extends string>(fallback: Record<Keys, string>): RichContent<Keys> {
  const out = {} as RichContent<Keys>
  for (const key of Object.keys(fallback) as Keys[]) {
    out[key] = { __html: fallback[key] }
  }
  return out
}

/**
 * Comme useContent, mais pour les blocs de type "richtext".
 * Le HTML est sanitisé côté serveur (liste blanche de balises).
 */
export function useRichContent<Keys extends string>(
  page: string,
  lang: Lang,
  fallback: Record<Keys, string>
): RichContent<Keys> {
  const [content, setContent] = useState<RichContent<Keys>>(() => toDangerous(fallback))

  useEffect(() => {
    let cancelled = false
    setContent(toDangerous(fallback))

    fetchContent(page, lang)
      .then(data => {
        if (cancelled || data.length === 0) return
        setContent(prev => {
          const next = { ...prev }
          for (const block of data) {
            if (block.blockKey in next && block.blockType === 'richtext') {
              next[block.blockKey as Keys] = { __html: block.value }
            }
          }
          return next
        })
      })
      .catch(() => {
        // API indisponible : on reste sur le HTML statique.
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fallback est un littéral stable
  }, [page, lang])

  return content
}
