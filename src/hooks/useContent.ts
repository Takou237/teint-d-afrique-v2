import { useEffect, useState } from 'react'
import type { Lang } from '@/i18n'
import { fetchContent } from '@/lib/api'

/**
 * Charge les blocs de contenu éditables d'une page depuis l'API, avec repli sur le texte
 * `fallback` (texte actuel des pages) si l'API est indisponible ou ne renvoie rien.
 * Réservé aux blocs de texte simple (pas de HTML).
 */
export function useContent<Keys extends string>(
  page: string,
  lang: Lang,
  fallback: Record<Keys, string>
): Record<Keys, string> {
  const [blocks, setBlocks] = useState<Record<Keys, string>>(fallback)

  useEffect(() => {
    let cancelled = false
    setBlocks(fallback)

    fetchContent(page, lang)
      .then(data => {
        if (cancelled || data.length === 0) return
        setBlocks(prev => {
          const next = { ...prev }
          for (const block of data) {
            if (block.blockKey in next && block.blockType !== 'image') {
              next[block.blockKey as Keys] = block.value
            }
          }
          return next
        })
      })
      .catch(() => {
        // API indisponible : on reste sur le texte statique.
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fallback est un littéral stable
  }, [page, lang])

  return blocks
}
