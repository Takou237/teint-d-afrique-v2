import { useEffect, useState } from 'react'
import {
  apiErrorMessage,
  deleteContactMessage,
  fetchContactMessages,
  setContactMessageRead,
  type ContactMessage,
  type ContactMessagePage,
} from '@/admin/api'
import { Banner, Button, TextInput, useConfirm } from '@/admin/components/ui'

const PER_PAGE = 20

export default function MessagesPage() {
  const [data, setData] = useState<ContactMessagePage | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [search, setSearch] = useState('')
  // Recherche réellement appliquée (la saisie n'est envoyée qu'à la validation du formulaire).
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [reloadToken, setReloadToken] = useState(0)
  const [actionError, setActionError] = useState<string | null>(null)
  const [confirm, confirmModal] = useConfirm()

  function reload() {
    setReloadToken(token => token + 1)
  }

  useEffect(() => {
    let cancelled = false
    setLoadError(null)
    fetchContactMessages({ q: query, filter, page, perPage: PER_PAGE })
      .then(result => {
        if (cancelled) return
        setData(result)
        // Page vidée par une suppression ou un changement de filtre : on revient en arrière.
        if (result.items.length === 0 && result.total > 0 && page > 1) {
          setPage(Math.max(1, Math.ceil(result.total / PER_PAGE)))
        }
      })
      .catch(() => {
        if (!cancelled) setLoadError('Impossible de charger les messages.')
      })
    return () => {
      cancelled = true
    }
  }, [query, filter, page, reloadToken])

  async function toggleRead(message: ContactMessage) {
    const isRead = !(message.isRead === true || message.isRead === 1)
    setActionError(null)
    try {
      await setContactMessageRead(message.id, isRead)
      reload()
    } catch (err) {
      setActionError(apiErrorMessage(err))
    }
  }

  async function handleDelete(message: ContactMessage) {
    const ok = await confirm({
      title: 'Supprimer le message ?',
      message: (
        <>
          Le message de <strong>« {message.name} »</strong> sera supprimé. Cette action est définitive.
        </>
      ),
      confirmLabel: 'Supprimer le message',
    })
    if (!ok) return
    setActionError(null)
    try {
      await deleteContactMessage(message.id)
      reload()
    } catch (err) {
      setActionError(apiErrorMessage(err))
    }
  }

  const items = data?.items ?? []
  const total = data?.total ?? 0
  const unreadCount = data?.unread ?? 0
  const pageCount = Math.max(1, Math.ceil(total / PER_PAGE))
  const firstShown = total === 0 ? 0 : (page - 1) * PER_PAGE + 1
  const lastShown = Math.min(page * PER_PAGE, total)

  return (
    <div className="space-y-6">
      {confirmModal}
      {actionError && <Banner kind="error">{actionError}</Banner>}

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-2">
          {(['all', 'unread'] as const).map(f => (
            <button
              key={f}
              onClick={() => {
                setFilter(f)
                setPage(1)
              }}
              className={`px-4 py-2 text-[11px] tracking-[0.15em] uppercase border transition-colors ${
                filter === f
                  ? 'border-[#3B1705] bg-[#3B1705] text-[#FAF6EF]'
                  : 'border-[#3B1705]/20 text-[#3B1705] hover:bg-[#3B1705]/5'
              }`}
            >
              {f === 'all' ? 'Tous' : `Non lus (${unreadCount})`}
            </button>
          ))}
        </div>
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
            placeholder="Nom, email, contenu…"
            className="!w-64"
            aria-label="Rechercher dans les messages"
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
      </div>

      {loadError && <Banner kind="error">{loadError}</Banner>}
      {!loadError && data === null && <p className="text-sm text-[#3B1705]/50">Chargement...</p>}
      {data !== null && items.length === 0 && (
        <p className="text-sm text-[#3B1705]/50">
          {query !== ''
            ? 'Aucun message ne correspond à cette recherche.'
            : filter === 'unread'
              ? 'Aucun message non lu.'
              : 'Aucun message reçu pour le moment.'}
        </p>
      )}

      <div className="space-y-4">
        {items.map(message => {
          const isUnread = !(message.isRead === true || message.isRead === 1)
          return (
            <div
              key={message.id}
              className={`bg-white border p-5 space-y-3 ${
                isUnread ? 'border-[#C97B1A]/50 border-l-4 border-l-[#C97B1A]' : 'border-[#3B1705]/10'
              }`}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-medium text-[#3B1705]">
                    {message.name}
                    {isUnread && (
                      <span className="ml-2 text-[9px] tracking-[0.15em] uppercase text-[#C97B1A]">
                        Nouveau
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-[#3B1705]/50 mt-0.5">
                    <a href={`mailto:${message.email}`} className="hover:text-[#C97B1A]">
                      {message.email}
                    </a>
                    {message.phone && <span> · {message.phone}</span>}
                    {' · '}
                    {new Date(message.createdAt.replace(' ', 'T')).toLocaleString('fr-FR')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => toggleRead(message)}>
                    {isUnread ? 'Marquer lu' : 'Marquer non lu'}
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(message)}>
                    Supprimer
                  </Button>
                </div>
              </div>
              <p className="text-sm text-[#2A1006]/80 leading-relaxed whitespace-pre-wrap">
                {message.message}
              </p>
            </div>
          )
        })}
      </div>

      {total > PER_PAGE && (
        <div className="flex items-center justify-between gap-4 flex-wrap border-t border-[#3B1705]/10 pt-4">
          <p className="text-xs text-[#3B1705]/50">
            {firstShown}–{lastShown} sur {total} message{total > 1 ? 's' : ''}
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
