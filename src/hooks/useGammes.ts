import { useEffect, useMemo, useState } from 'react'
import { getGammes, type Gamme, type ProductDetails } from '@/data'
import type { ApiGamme, ApiProductDetails } from '@/lib/api'
import { fetchGammes } from '@/lib/api'
import type { Lang, Localized } from '@/i18n'

/**
 * Charge les gammes depuis l'API du panneau d'admin ; si l'API est indisponible ou renvoie
 * une liste vide, on garde le contenu statique de secours (src/data.ts).
 */

function pick(value: Localized | null | undefined, lang: Lang): string {
  if (!value) return ''
  return value[lang] ?? value.fr ?? ''
}

function placeholderImage(g: Pick<Gamme, 'nom' | 'colorLight' | 'colorDark'>): string {
  const nom = g.nom.replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><rect width="800" height="600" fill="${g.colorLight}"/><text x="400" y="300" text-anchor="middle" dominant-baseline="middle" font-family="Georgia, serif" font-size="64" letter-spacing="8" fill="${g.colorDark}">${nom}</text></svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

/** Image par défaut d'une gamme (visuel statique du site, sinon aplat coloré). */
export function defaultGammeImage(g: Pick<Gamme, 'id' | 'nom' | 'colorLight' | 'colorDark'>): string {
  const statique = getGammes('fr').find(s => s.id === g.id)
  return statique?.mainImage ?? placeholderImage(g)
}

function mapDetails(details: ApiProductDetails | null, lang: Lang): ProductDetails | undefined {
  if (!details) return undefined
  return {
    nom: pick(details.nom, lang),
    promesses: details.promesses?.[lang] ?? details.promesses?.fr ?? [],
    actifs: pick(details.actifs, lang),
    proprietes: pick(details.proprietes, lang),
    ingredients: pick(details.ingredients, lang),
    modeEmploi: pick(details.modeEmploi, lang),
    precautions: pick(details.precautions, lang),
  }
}

function mapApiGamme(g: ApiGamme, lang: Lang): Gamme {
  const statique = getGammes(lang).find(s => s.id === g.id)
  const fallback = statique?.mainImage ?? placeholderImage({
    nom: pick(g.nom, lang) || g.id,
    colorLight: g.colorLight,
    colorDark: g.colorDark,
  })

  return {
    id: g.id as Gamme['id'],
    nom: pick(g.nom, lang),
    tagline: pick(g.tagline, lang),
    ingredients: pick(g.ingredients, lang),
    color: g.color,
    colorLight: g.colorLight,
    colorDark: g.colorDark,
    description: pick(g.description, lang),
    ingredientsDetail: pick(g.ingredientsDetail, lang),
    image: g.image ?? fallback,
    mainImage: g.mainImage ?? fallback,
    heroImage: g.heroImage ?? statique?.heroImage ?? fallback,
    heroImageSmall: g.heroImageSmall ?? statique?.heroImageSmall ?? fallback,
    heroLead: pick(g.heroLead, lang),
    heroAccent: pick(g.heroAccent, lang),
    heroCopy: pick(g.heroCopy, lang),
    heroAlt: pick(g.heroAlt, lang),
    products: g.products.map((p, index) => {
      const statiqueProduit = statique?.products[index]
      return {
        type: pick(p.type, lang),
        poids: p.poids,
        symbol: p.symbol,
        description: pick(p.description, lang),
        image: p.image ?? statiqueProduit?.image ?? fallback,
        details: mapDetails(p.details, lang),
      }
    }),
  }
}

export function useGammes(lang: Lang): Gamme[] {
  const staticGammes = useMemo(() => getGammes(lang), [lang])
  const [apiGammes, setApiGammes] = useState<ApiGamme[] | null>(null)

  useEffect(() => {
    let cancelled = false

    fetchGammes()
      .then(data => {
        if (!cancelled) setApiGammes(data)
      })
      .catch(() => {
        // API indisponible : on reste sur les données statiques.
      })

    return () => {
      cancelled = true
    }
  }, [])

  return useMemo(() => {
    if (!apiGammes || apiGammes.length === 0) return staticGammes
    return apiGammes.map(g => mapApiGamme(g, lang))
  }, [apiGammes, lang, staticGammes])
}
