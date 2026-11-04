import { useEffect, useRef, useState } from 'react'
import {
  ApiError,
  deleteMedia,
  fetchMedia,
  updateMediaAlt,
  uploadMedia,
  type MediaItem,
  type Paged,
} from '@/admin/api'
import { Banner, Button, Field, TextInput, useConfirm } from '@/admin/components/ui'

const PER_PAGE = 24

const ERROR_MESSAGES: Record<string, string> = {
  missing_file: 'Choisissez une image.',
  file_too_large: 'Image trop lourde (5 Mo maximum).',
  unsupported_image_type: 'Format non supporté (jpeg, png, webp ou gif uniquement).',
  invalid_image: "Le fichier n'est pas une image valide.",
  upload_failed: "L'envoi a échoué, réessayez.",
  media_in_use:
    'Cette image est utilisée par une gamme, un produit ou une page : retirez-la de son emplacement avant de la supprimer.',
}

export default function MediaPage() {
  const [data, setData] = useState<Paged<MediaItem> | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [altText, setAltText] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [reloadToken, setReloadToken] = useState(0)
  // Image dont le texte alternatif est en cours d'édition, et brouillon associé.
  const [editingId, setEditingId] = useState<number | null>(null)
  const [altDraft, setAltDraft] = useState('')
  const [altSaving, setAltSaving] = useState(false)
  const [altError, setAltError] = useState<string | null>(null)
  const [confirm, confirmModal] = useConfirm()
  const fileInputRef = useRef<HTMLInputElement>(null)

  function reload() {
    setReloadToken(token => token + 1)
  }

  useEffect(() => {
    let cancelled = false
    setLoadError(null)
    fetchMedia({ q: query, page, perPage: PER_PAGE })
      .then(result => {
        if (cancelled) return
        setData(result)
        if (result.items.length === 0 && result.total > 0 && page > 1) {
          setPage(Math.max(1, Math.ceil(result.total / PER_PAGE)))
        }
      })
      .catch(() => {
        if (!cancelled) setLoadError('Impossible de charger la médiathèque.')
      })
    return () => {
      cancelled = true
    }
  }, [query, page, reloadToken])

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    const file = fileInputRef.current?.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadError(null)
    try {
      await uploadMedia(file, altText)
      setAltText('')
      if (fileInputRef.current) fileInputRef.current.value = ''
      // Nouvelle image en tête de liste : on revient en première page sans recherche.
      setSearch('')
      setQuery('')
      setPage(1)
      reload()
    } catch (err) {
      const code = err instanceof ApiError ? err.code : 'erreur_inconnue'
      setUploadError(ERROR_MESSAGES[code] ?? "Une erreur est survenue, réessayez.")
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(item: MediaItem) {
    const ok = await confirm({
      title: "Supprimer l'image ?",
      message: (
        <>
          L'image <strong>« {item.originalName} »</strong> sera supprimée du serveur. Cette action est
          définitive.
        </>
      ),
      confirmLabel: "Supprimer l'image",
    })
    if (!ok) return
    setDeleteError(null)
    try {
      await deleteMedia(item.id)
      reload()
    } catch (err) {
      const code = err instanceof ApiError ? err.code : 'erreur_inconnue'
      setDeleteError(ERROR_MESSAGES[code] ?? 'Impossible de supprimer cette image.')
    }
  }

  function startAltEdit(item: MediaItem) {
    setEditingId(item.id)
    setAltDraft(item.altText)
    setAltError(null)
  }

  async function saveAlt(item: MediaItem) {
    setAltSaving(true)
    setAltError(null)
    try {
      const updated = await updateMediaAlt(item.id, altDraft.trim())
      setData(prev =>
        prev
          ? {
              ...prev,
              items: prev.items.map(m => (m.id === item.id ? { ...m, altText: updated.altText } : m)),
            }
          : prev
      )
      setEditingId(null)
    } catch {
      setAltError("Le texte alternatif n'a pas pu être enregistré.")
    } finally {
      setAltSaving(false)
    }
  }

  const items = data?.items ?? []
  const total = data?.total ?? 0
  const pageCount = Math.max(1, Math.ceil(total / PER_PAGE))
  const firstShown = total === 0 ? 0 : (page - 1) * PER_PAGE + 1
  const lastShown = Math.min(page * PER_PAGE, total)

  return (
    <div className="space-y-8">
      {confirmModal}
      {deleteError && <Banner kind="error">{deleteError}</Banner>}
      <form onSubmit={handleUpload} className="bg-white border border-[#3B1705]/10 p-6 space-y-4">
        <h2 className="text-xl" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
          Ajouter une image
        </h2>
        <div className="grid md:grid-cols-2 gap-4 items-end">
          <Field label="Fichier (jpeg, png, webp, gif — 5 Mo max)">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              required
              className="block w-full text-sm"
            />
          </Field>
          <Field label="Texte alternatif (accessibilité)">
            <TextInput value={altText} onChange={e => setAltText(e.target.value)} placeholder="Description de l'image" />
          </Field>
        </div>
        {uploadError && <Banner kind="error">{uploadError}</Banner>}
        <Button type="submit" disabled={uploading}>
          {uploading ? 'Envoi...' : 'Téléverser'}
        </Button>
      </form>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <form
          onSubmit={e => {
            e.preventDefault()
            setQuery(search.trim())
            setPage(1)
          }}
          className="flex gap-2 items-center"
        >
          <TextInput
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Nom de fichier ou texte alternatif…"
            className="!w-72"
            aria-label="Rechercher dans la médiathèque"
          />
          <Button type="submit" variant="secondary">
            Rechercher
          </Button>
          {query !== '' && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setSearch('')
                setQuery('')
                setPage(1)
              }}
            >
              Effacer
            </Button>
          )}
        </form>
        {total > 0 && (
          <p className="text-xs text-[#3B1705]/50">
            {total} image{total > 1 ? 's' : ''}
          </p>
        )}
      </div>

      {loadError && <Banner kind="error">{loadError}</Banner>}
      {!loadError && data === null && <p className="text-sm text-[#3B1705]/50">Chargement...</p>}
      {data !== null && items.length === 0 && (
        <p className="text-sm text-[#3B1705]/50">
          {query !== ''
            ? 'Aucune image ne correspond à cette recherche.'
            : "Aucune image dans la médiathèque pour l'instant."}
        </p>
      )}

      {items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-white border border-[#3B1705]/10 overflow-hidden flex flex-col">
              <img src={item.url} alt={item.altText} className="w-full h-32 object-cover" />
              <div className="p-3 space-y-2 flex-1 flex flex-col">
                <p className="text-xs text-[#3B1705] truncate" title={item.originalName}>
                  {item.originalName}
                </p>
                <p className="text-[10px] text-[#3B1705]/40">{(item.sizeBytes / 1024).toFixed(0)} Ko</p>

                {editingId === item.id ? (
                  <div className="space-y-1.5">
                    <TextInput
                      value={altDraft}
                      onChange={e => setAltDraft(e.target.value)}
                      placeholder="Décrivez l'image"
                      maxLength={255}
                      autoFocus
                      className="!text-xs"
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          saveAlt(item)
                        }
                        if (e.key === 'Escape') setEditingId(null)
                      }}
                    />
                    <div className="flex gap-1.5">
                      <Button
                        variant="secondary"
                        className="!px-2 !py-1 flex-1"
                        disabled={altSaving}
                        onClick={() => saveAlt(item)}
                      >
                        {altSaving ? '...' : 'OK'}
                      </Button>
                      <Button
                        variant="secondary"
                        className="!px-2 !py-1"
                        onClick={() => setEditingId(null)}
                        disabled={altSaving}
                      >
                        Annuler
                      </Button>
                    </div>
                    {altError && <p className="text-[10px] text-red-700">{altError}</p>}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => startAltEdit(item)}
                    className="text-left text-[10px] text-[#3B1705]/55 hover:text-[#C97B1A] underline decoration-dotted"
                    title="Modifier le texte alternatif"
                  >
                    {item.altText ? `Alt : ${item.altText}` : '+ Ajouter un texte alternatif'}
                  </button>
                )}

                <div className="mt-auto pt-1">
                  <Button variant="danger" onClick={() => handleDelete(item)} className="w-full">
                    Supprimer
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {total > PER_PAGE && (
        <div className="flex items-center justify-between gap-4 flex-wrap border-t border-[#3B1705]/10 pt-4">
          <p className="text-xs text-[#3B1705]/50">
            {firstShown}–{lastShown} sur {total}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="secondary" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
              Précédent
            </Button>
            <span className="text-xs text-[#3B1705]/60">
              Page {page} / {pageCount}
            </span>
            <Button variant="secondary" disabled={page >= pageCount} onClick={() => setPage(p => p + 1)}>
              Suivant
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
