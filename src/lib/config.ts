/**
 * Configuration réseau du front.
 *
 * En développement, Vite proxifie /api et /uploads vers le serveur PHP local (voir vite.config.ts).
 * En production, si le front (Vercel) et l'API PHP sont hébergés séparément, définir
 * VITE_API_URL avec l'origine du backend, sans slash final :
 *   VITE_API_URL=https://api.teintdafrique.com
 */

const apiBase = (import.meta.env.VITE_API_URL as string | undefined) ?? ''
/** Sans slash final, pour pouvoir concaténer avec des chemins commençant par "/". */
export const API_BASE = apiBase.replace(/\/+$/, '')

export function isAbsoluteUrl(url: string): boolean {
  return /^[a-z][a-z0-9+.-]*:\/\//i.test(url) || url.startsWith('//')
}

/** Préfixe un chemin d'API (/api/...) avec l'origine distante si elle est définie. */
export function apiUrl(path: string): string {
  if (!API_BASE) return path
  return API_BASE + (path.startsWith('/') ? path : `/${path}`)
}

/** Résout une URL d'image renvoyée par le backend : absolue = inchangée, sinon préfixée. */
export function resolveAssetUrl(url: string | null | undefined): string | null {
  if (!url) return null
  return isAbsoluteUrl(url) ? url : apiUrl(url)
}

/**
 * Parcourt récursivement la donnée JSON renvoyée par le backend et préfixe toute
 * chaîne commençant par /uploads/ (URLs de médias) avec l'origine distante.
 */
export function mapAssetUrls<T>(data: T): T {
  if (typeof data === 'string') {
    return (data.startsWith('/uploads/') ? apiUrl(data) : data) as T
  }
  if (Array.isArray(data)) {
    return data.map(mapAssetUrls) as T
  }
  if (data !== null && typeof data === 'object') {
    const out: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      out[key] = mapAssetUrls(value)
    }
    return out as T
  }
  return data
}
