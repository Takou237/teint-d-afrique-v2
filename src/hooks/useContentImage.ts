import { useEffect, useState } from 'react'
import type { Lang } from '@/i18n'
import { fetchContent } from '@/lib/api'

/**
 * Charge un bloc de contenu de type "image" et renvoie l'URL prête à l'emploi.
 * Repli sur `fallback` tant que rien n'est associé ou si l'API est indisponible.
 */
export function useContentImage(page: string, lang: Lang, blockKey: string, fallback: string): string {
  const [url, setUrl] = useState(fallback)

  useEffect(() => {
    let cancelled = false
    setUrl(fallback)

    fetchContent(page, lang)
      .then(data => {
        if (cancelled) return
        const block = data.find(b => b.blockKey === blockKey && b.blockType === 'image')
        if (block?.value) setUrl(block.value)
      })
      .catch(() => {
        // API indisponible : on garde l'image statique.
      })

    return () => {
      cancelled = true
    }
  }, [page, lang, blockKey, fallback])

  return url
}
