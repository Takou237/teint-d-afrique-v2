import { useEffect, useState } from 'react'
import { fetchContactMessages, fetchGammes, fetchMedia, type ContactMessage } from '@/admin/api'
import type { Tab } from '@/admin/components/Layout'
import { Banner, Button } from '@/admin/components/ui'

interface Overview {
  unread: number
  messages: number
  gammes: number
  produits: number
  images: number
  latest: ContactMessage[]
}

function formatDate(value: string): string {
  const date = new Date(value.replace(' ', 'T'))
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString('fr-FR')
}

/**
 * Écran d'accueil du panneau : un coup d'œil sur ce qui demande attention
 * (messages non lus) et sur l'état du contenu du site.
 */
export default function DashboardPage({ onNavigate }: { onNavigate: (tab: Tab) => void }) {
  const [overview, setOverview] = useState<Overview | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([fetchContactMessages({ perPage: 5 }), fetchGammes(), fetchMedia({ perPage: 1 })])
      .then(([messages, gammes, media]) => {
        if (cancelled) return
        setOverview({
          unread: messages.unread,
          messages: messages.total,
          latest: messages.items,
          gammes: gammes.length,
          produits: gammes.reduce((sum, gamme) => sum + gamme.products.length, 0),
          images: media.total,
        })
      })
      .catch(() => {
        if (!cancelled) setError("Impossible de charger le tableau de bord.")
      })
    return () => {
      cancelled = true
    }
  }, [])

  const cards: { label: string; value: number; hint: string; tab: Tab }[] = overview
    ? [
        {
          label: 'Messages non lus',
          value: overview.unread,
          hint: `${overview.messages} message${overview.messages > 1 ? 's' : ''} au total`,
          tab: 'messages',
        },
        {
          label: 'Gammes en ligne',
          value: overview.gammes,
          hint: 'Site public et fiches produits',
          tab: 'gammes',
        },
        {
          label: 'Produits',
          value: overview.produits,
          hint: 'Toutes gammes confondues',
          tab: 'gammes',
        },
        {
          label: 'Images',
          value: overview.images,
          hint: 'Médiathèque',
          tab: 'medias',
        },
      ]
    : []

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl text-[#3B1705]" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
          Tableau de bord
        </h1>
        <p className="text-sm text-[#3B1705]/55 mt-2">
          L'état du site en un coup d'œil. Les modifications sont publiées immédiatement.
        </p>
      </div>

      {error && <Banner kind="error">{error}</Banner>}
      {!error && overview === null && <p className="text-sm text-[#3B1705]/50">Chargement...</p>}

      {overview !== null && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map(card => (
              <button
                key={card.label}
                type="button"
                onClick={() => onNavigate(card.tab)}
                className="bg-white border border-[#3B1705]/10 p-5 text-left hover:border-[#C97B1A] transition-colors"
              >
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#3B1705]/45">{card.label}</p>
                <p
                  className="text-4xl text-[#3B1705] mt-2"
                  style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                >
                  {card.value}
                </p>
                <p className="text-[11px] text-[#3B1705]/40 mt-1">{card.hint}</p>
              </button>
            ))}
          </div>

          <section className="space-y-4">
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <h2 className="text-xl text-[#3B1705]" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                Derniers messages
              </h2>
              <Button variant="secondary" onClick={() => onNavigate('messages')}>
                Voir tous les messages
              </Button>
            </div>

            {overview.latest.length === 0 ? (
              <p className="text-sm text-[#3B1705]/50">Aucun message reçu pour le moment.</p>
            ) : (
              <div className="bg-white border border-[#3B1705]/10 divide-y divide-[#3B1705]/10">
                {overview.latest.map(message => {
                  const isUnread = !(message.isRead === true || message.isRead === 1)
                  return (
                    <button
                      key={message.id}
                      type="button"
                      onClick={() => onNavigate('messages')}
                      className="block w-full text-left p-4 hover:bg-[#FAF6EF] transition-colors"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className={`text-sm ${isUnread ? 'font-medium text-[#3B1705]' : 'text-[#3B1705]/75'}`}>
                          {message.name}
                          {isUnread && (
                            <span className="ml-2 text-[9px] tracking-[0.15em] uppercase text-[#C97B1A]">
                              Nouveau
                            </span>
                          )}
                        </p>
                        <p className="text-[11px] text-[#3B1705]/40 shrink-0">{formatDate(message.createdAt)}</p>
                      </div>
                      <p className="text-xs text-[#3B1705]/55 mt-1 line-clamp-2">{message.message}</p>
                    </button>
                  )
                })}
              </div>
            )}
          </section>

          <section className="space-y-3">
            <h2 className="text-xl text-[#3B1705]" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
              Raccourcis
            </h2>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => onNavigate('gammes')}>
                Modifier une gamme
              </Button>
              <Button variant="secondary" onClick={() => onNavigate('contenu')}>
                Modifier une page
              </Button>
              <Button variant="secondary" onClick={() => onNavigate('medias')}>
                Ajouter une image
              </Button>
              <Button variant="secondary" onClick={() => onNavigate('reglages')}>
                Coordonnées et réseaux
              </Button>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
