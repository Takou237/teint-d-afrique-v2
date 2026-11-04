/**
 * Client de l'API du panneau d'admin.
 * Le jeton CSRF est gardé en mémoire (jamais en localStorage) et rejoué
 * sur chaque requête de modification via le header X-CSRF-Token.
 */
import { apiUrl, mapAssetUrls } from '@/lib/config'
import type { Lang } from '@/i18n'

export type Localized = { fr: string; en: string }

export interface ProductDetails {
  nom: Localized
  promesses: { fr: string[]; en: string[] }
  actifs: Localized
  proprietes: Localized
  ingredients: Localized
  modeEmploi: Localized
  precautions: Localized
}

export interface Product {
  id: number
  gammeId: string
  type: Localized
  poids: string
  symbol: string
  description: Localized
  details: ProductDetails | null
  imageId: number | null
  image: string | null
  position: number
}

export interface Gamme {
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
  products: Product[]
}

export interface GammeUpdateFields {
  nom?: Localized
  tagline?: Localized
  ingredients?: Localized
  color?: string
  colorLight?: string
  colorDark?: string
  description?: Localized
  ingredientsDetail?: Localized
  heroLead?: Localized
  heroAccent?: Localized
  heroCopy?: Localized
  heroAlt?: Localized
  imageId?: number | null
  mainImageId?: number | null
  heroImageId?: number | null
  heroImageSmallId?: number | null
}

export interface ProduitCreateFields {
  type: Localized
  poids: string
  symbol: string
  description: Localized
  details?: ProductDetails | null
  imageId?: number | null
}

export interface ProduitUpdateFields {
  type?: Localized
  poids?: string
  symbol?: string
  description?: Localized
  details?: ProductDetails | null
  imageId?: number | null
}

export interface ContentBlock {
  page: string
  blockKey: string
  blockType: 'text' | 'richtext' | 'image'
  value: string
  valueFr: string
  valueEn: string
  imageIdFr: number | null
  imageIdEn: number | null
  imageUrlFr: string | null
  imageUrlEn: string | null
}

export interface ContactMessage {
  id: number
  name: string
  email: string
  phone: string
  message: string
  isRead: 0 | 1 | boolean
  createdAt: string
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

export interface MediaItem {
  id: number
  url: string
  originalName: string
  mimeType: string
  sizeBytes: number
  altText: string
  createdAt: string
}

export class ApiError extends Error {
  constructor(
    public code: string,
    public status: number
  ) {
    super(code)
  }
}

/** Messages lisibles pour les codes d'erreur renvoyés par l'API. */
const ERROR_MESSAGES: Record<string, string> = {
  unauthorized: 'Session expirée, reconnectez-vous.',
  invalid_csrf_token: 'Session expirée, rechargez la page puis réessayez.',
  invalid_json_body: 'Requête invalide.',
  internal_error: 'Erreur du serveur, réessayez dans un instant.',
  not_found: 'Élément introuvable, rechargez la page.',
  invalid_page: 'Page inconnue.',
  invalid_block_key: 'Clé de bloc invalide.',
  invalid_block_type: 'Type de bloc invalide.',
  media_in_use:
    "Cette image est encore utilisée par une gamme, un produit ou une page : retirez-la de son emplacement avant de la supprimer.",
  last_gamme: 'Impossible de supprimer la dernière gamme du site.',
  invalid_gamme_id: 'Gamme inconnue.',
  media_not_found: "L'image choisie n'existe plus dans la médiathèque.",
  empty_value: 'Un champ obligatoire est vide (FR et EN sont requis).',
  invalid_localized_value: 'Texte incomplet (FR et EN sont requis).',
  invalid_list: 'Liste invalide.',
  invalid_details: 'Fiche détaillée invalide.',
  invalid_id: 'Identifiant invalide.',
  missing_id: 'Identifiant manquant.',
  invalid_name: 'Nom invalide.',
  too_many_attempts: 'Trop de tentatives. Réessayez dans quelques minutes.',
  weak_password: 'Le mot de passe doit contenir au moins 12 caractères.',
  password_too_long: 'Le mot de passe est trop long (200 caractères maximum).',
  password_unchanged: "Le nouveau mot de passe doit être différent de l'actuel.",
  invalid_current_password: 'Mot de passe actuel incorrect.',
  invalid_token:
    'Ce lien a expiré ou a déjà servi. Demandez un nouveau lien depuis la page de connexion.',
  email_failed:
    "L'email n'a pas pu être envoyé : vérifiez la configuration email du serveur (api/config.php).",
  nothing_to_publish: 'Aucune modification en attente sur cette page.',
  cannot_delete_self: 'Vous ne pouvez pas supprimer votre propre compte.',
  last_admin: 'Impossible de supprimer le dernier compte administrateur.',
  email_already_used: 'Un compte utilise déjà cette adresse email.',
}

/** Traduit une erreur d'API en message affichable (code technique conservé en dernier recours). */
export function apiErrorMessage(err: unknown, fallback = 'Une erreur est survenue, réessayez.'): string {
  if (!(err instanceof ApiError)) return fallback
  const base = err.code.split(':')[0]
  return ERROR_MESSAGES[err.code] ?? ERROR_MESSAGES[base] ?? `Une erreur est survenue (${err.code}).`
}

let csrfToken: string | null = null
let unauthorizedHandler: (() => void) | null = null

/**
 * Enregistre un rappel appelé quand l'API répond `unauthorized` (session expirée).
 * Renvoie la fonction de désinscription.
 */
export function onUnauthorized(handler: () => void): () => void {
  unauthorizedHandler = handler
  return () => {
    if (unauthorizedHandler === handler) unauthorizedHandler = null
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const isFormData = options.body instanceof FormData
  const res = await fetch(apiUrl(path), {
    ...options,
    credentials: 'include',
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
      ...options.headers,
    },
  })
  const body = await res.json().catch(() => null)
  if (body?.error === 'unauthorized' && !path.startsWith('/api/auth/login.php')) {
    csrfToken = null
    unauthorizedHandler?.()
  }
  if (!res.ok || !body?.success) {
    throw new ApiError(body?.error ?? `api_error_${res.status}`, res.status)
  }
  return mapAssetUrls(body.data) as T
}

// --- Authentification ---

export async function checkSession(): Promise<boolean> {
  const data = await request<{ authenticated: boolean; csrfToken?: string }>('/api/auth/session.php')
  if (data.authenticated && data.csrfToken) {
    csrfToken = data.csrfToken
  }
  return data.authenticated
}

export async function login(email: string, password: string): Promise<void> {
  const data = await request<{ csrfToken: string }>('/api/auth/login.php', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  csrfToken = data.csrfToken
}

export async function logout(): Promise<void> {
  await request('/api/auth/logout.php', { method: 'POST' })
  csrfToken = null
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await request('/api/auth/password.php', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  })
}

/** Envoie un lien de réinitialisation (même réponse si l'adresse n'existe pas). */
export async function requestPasswordReset(email: string): Promise<void> {
  await request('/api/auth/request-reset.php', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

/** Applique un nouveau mot de passe à partir du jeton reçu par email. */
export async function resetPassword(token: string, password: string): Promise<void> {
  await request('/api/auth/reset.php', {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  })
}

// --- Comptes administrateurs ---

export interface AdminAccount {
  id: number
  email: string
  createdAt: string
  lastLoginAt: string | null
  isSelf: boolean
}

export function fetchAdmins(): Promise<AdminAccount[]> {
  return request<AdminAccount[]>('/api/admins/list.php')
}

export function createAdmin(email: string, password: string): Promise<{ id: number; email: string }> {
  return request('/api/admins/create.php', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function deleteAdmin(id: number): Promise<void> {
  return request('/api/admins/delete.php', {
    method: 'POST',
    body: JSON.stringify({ id }),
  })
}

// --- Gammes & produits ---

export function fetchGammes(): Promise<Gamme[]> {
  return request<Gamme[]>('/api/gammes/list.php')
}

export function updateGamme(id: string, fields: GammeUpdateFields): Promise<Gamme> {
  return request<Gamme>('/api/gammes/update.php', {
    method: 'POST',
    body: JSON.stringify({ id, ...fields }),
  })
}

export function updateProduit(id: number, fields: ProduitUpdateFields): Promise<Product> {
  return request<Product>('/api/produits/update.php', {
    method: 'POST',
    body: JSON.stringify({ id, ...fields }),
  })
}

export function createProduit(gammeId: string, fields: ProduitCreateFields): Promise<Product> {
  return request<Product>('/api/produits/create.php', {
    method: 'POST',
    body: JSON.stringify({ gammeId, ...fields }),
  })
}

export function deleteProduit(id: number): Promise<void> {
  return request('/api/produits/delete.php', {
    method: 'POST',
    body: JSON.stringify({ id }),
  })
}

/** Crée une gamme en fin de liste ; l'id est dérivé du nom français côté serveur. */
export function createGamme(nom: Localized): Promise<Gamme> {
  return request<Gamme>('/api/gammes/create.php', {
    method: 'POST',
    body: JSON.stringify({ nom }),
  })
}

export function deleteGamme(id: string): Promise<void> {
  return request('/api/gammes/delete.php', {
    method: 'POST',
    body: JSON.stringify({ id }),
  })
}

export function reorderGammes(ids: string[]): Promise<Gamme[]> {
  return request<Gamme[]>('/api/gammes/reorder.php', {
    method: 'POST',
    body: JSON.stringify({ order: ids }),
  })
}

export function reorderProduits(gammeId: string, ids: number[]): Promise<Gamme | null> {
  return request<Gamme | null>('/api/produits/reorder.php', {
    method: 'POST',
    body: JSON.stringify({ gammeId, order: ids }),
  })
}

// --- Contenu de pages ---

export function fetchContent(page: string, lang: Lang = 'fr'): Promise<ContentBlock[]> {
  return request<ContentBlock[]>(
    `/api/content/list.php?page=${encodeURIComponent(page)}&lang=${encodeURIComponent(lang)}`
  )
}

/**
 * Enregistre un bloc **en brouillon** : le site public n'est pas modifié tant que
 * `publishContent()` n'a pas été appelé pour la page.
 */
export function updateContent(
  page: string,
  blockKey: string,
  valueFr: string,
  valueEn: string,
  blockType: 'text' | 'richtext' | 'image' = 'text'
): Promise<ContentBlock> {
  return request<ContentBlock>('/api/content/update.php', {
    method: 'POST',
    body: JSON.stringify({ page, blockKey, blockType, valueFr, valueEn }),
  })
}

/**
 * Modifications enregistrées mais pas encore publiées.
 * Sans argument : toutes les pages (compteur de la navigation).
 */
export function fetchContentDrafts(page?: string): Promise<ContentBlock[]> {
  return request<ContentBlock[]>(
    page ? `/api/content/drafts.php?page=${encodeURIComponent(page)}` : '/api/content/drafts.php'
  )
}

/** Publie tous les brouillons d'une page (le site public est mis à jour). */
export function publishContent(page: string): Promise<{ published: number }> {
  return request('/api/content/publish.php', {
    method: 'POST',
    body: JSON.stringify({ page }),
  })
}

/** Abandonne le brouillon d'un bloc : le contenu publié redevient la référence. */
export function discardContentDraft(page: string, blockKey: string): Promise<void> {
  return request('/api/content/discard.php', {
    method: 'POST',
    body: JSON.stringify({ page, blockKey }),
  })
}

export function deleteContentBlock(page: string, blockKey: string): Promise<void> {
  return request('/api/content/delete.php', {
    method: 'POST',
    body: JSON.stringify({ page, blockKey }),
  })
}

// --- Réglages (coordonnées & réseaux sociaux) ---

export function fetchSettings(): Promise<Settings> {
  return request<Settings>('/api/settings/list.php')
}

export function updateSetting(key: keyof Settings, value: string): Promise<Settings> {
  return request<Settings>('/api/settings/update.php', {
    method: 'POST',
    body: JSON.stringify({ key, value }),
  })
}

// --- Messages de contact ---

/** Réponse paginée générique des listes (messages, médiathèque). */
export interface Paged<T> {
  items: T[]
  total: number
  page: number
  perPage: number
}

export interface ContactMessagePage extends Paged<ContactMessage> {
  /** Nombre de messages non lus dans toute la base (indépendant du filtre). */
  unread: number
}

export interface ListParams {
  q?: string
  page?: number
  perPage?: number
}

function queryString(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === '') continue
    search.set(key, String(value))
  }
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

export function fetchContactMessages(
  params: ListParams & { filter?: 'all' | 'unread' } = {}
): Promise<ContactMessagePage> {
  return request<ContactMessagePage>(
    '/api/contact/list.php' +
      queryString({
        q: params.q?.trim(),
        filter: params.filter === 'unread' ? 'unread' : undefined,
        page: params.page,
        perPage: params.perPage,
      })
  )
}

export function setContactMessageRead(id: number, isRead: boolean): Promise<void> {
  return request('/api/contact/manage.php', {
    method: 'POST',
    body: JSON.stringify({ id, isRead }),
  })
}

export function deleteContactMessage(id: number): Promise<void> {
  return request('/api/contact/manage.php', {
    method: 'POST',
    body: JSON.stringify({ id, delete: true }),
  })
}

// --- Médiathèque ---

export function fetchMedia(params: ListParams = {}): Promise<Paged<MediaItem>> {
  return request<Paged<MediaItem>>(
    '/api/media/list.php' +
      queryString({ q: params.q?.trim(), page: params.page, perPage: params.perPage })
  )
}

export function uploadMedia(file: File, altText: string): Promise<{ id: number; url: string }> {
  const form = new FormData()
  form.append('file', file)
  form.append('altText', altText)
  return request('/api/media/upload.php', { method: 'POST', body: form })
}

export function updateMediaAlt(id: number, altText: string): Promise<{ id: number; altText: string }> {
  return request('/api/media/update.php', {
    method: 'POST',
    body: JSON.stringify({ id, altText }),
  })
}

export function deleteMedia(id: number): Promise<void> {
  return request('/api/media/delete.php', {
    method: 'POST',
    body: JSON.stringify({ id }),
  })
}
