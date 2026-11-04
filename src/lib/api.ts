import type { Lang, Localized } from '@/i18n'
import { apiUrl, mapAssetUrls } from './config'

/** Client public de l'API (lecture seule) : gammes, contenu des pages, réglages. */

export interface ApiProductDetails {
  nom: Localized
  promesses: { fr: string[]; en: string[] }
  actifs: Localized
  proprietes: Localized
  ingredients: Localized
  modeEmploi: Localized
  precautions: Localized
}

export interface ApiProduct {
  id: number
  gammeId: string
  type: Localized
  poids: string
  symbol: string
  description: Localized
  details: ApiProductDetails | null
  imageId: number | null
  image: string | null
  position: number
}

export interface ApiGamme {
  id: string
  nom: Localized
  tagline: Localized
  ingredients: Localized
  color: string
  colorLight: string
  colorDark: string
  description: Localized
  ingredientsDetail: Localized
  heroLead: Localized
  heroAccent: Localized
  heroCopy: Localized
  heroAlt: Localized
  imageId: number | null
  image: string | null
  mainImageId: number | null
  mainImage: string | null
  heroImageId: number | null
  heroImage: string | null
  heroImageSmallId: number | null
  heroImageSmall: string | null
  position: number
  products: ApiProduct[]
}

export interface ContentBlock {
  page: string
  blockKey: string
  blockType: 'text' | 'richtext' | 'image'
  value: string
  valueFr: string
  valueEn: string
  imageUrlFr: string | null
  imageUrlEn: string | null
}

export interface Settings {
  site_name: string
  tagline_fr: string
  tagline_en: string
  email: string
  phone: string
  whatsapp_number: string
  address_fr: string
  address_en: string
  hours_fr: string
  hours_en: string
  instagram_url: string
  facebook_url: string
  tiktok_url: string
  youtube_url: string
}

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(apiUrl(path), { credentials: 'include' })
  const body = await res.json().catch(() => null)
  if (!res.ok || !body?.success) {
    throw new Error(body?.error ?? `api_error_${res.status}`)
  }
  return mapAssetUrls(body.data) as T
}

export function fetchGammes(): Promise<ApiGamme[]> {
  return apiGet<ApiGamme[]>('/api/gammes/list.php')
}

export function fetchContent(page: string, lang: Lang = 'fr'): Promise<ContentBlock[]> {
  return apiGet<ContentBlock[]>(
    `/api/content/list.php?page=${encodeURIComponent(page)}&lang=${encodeURIComponent(lang)}`
  )
}

export function fetchSettings(): Promise<Settings> {
  return apiGet<Settings>('/api/settings/list.php')
}

export function submitContactMessage(payload: {
  name: string
  email: string
  phone: string
  message: string
}): Promise<{ id: number }> {
  return fetch(apiUrl('/api/contact/submit.php'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then(async res => {
      const body = await res.json().catch(() => null)
      if (!res.ok || !body?.success) {
        throw new Error(body?.error ?? `api_error_${res.status}`)
      }
      return body.data as { id: number }
    })
}
