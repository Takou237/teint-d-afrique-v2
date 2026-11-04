import type { ReactNode } from 'react'
import { Button } from './ui'

export type Tab = 'tableau' | 'gammes' | 'contenu' | 'messages' | 'medias' | 'reglages' | 'comptes'

const TABS: { id: Tab; label: string }[] = [
  { id: 'tableau', label: 'Tableau de bord' },
  { id: 'gammes', label: 'Gammes & produits' },
  { id: 'contenu', label: 'Pages' },
  { id: 'messages', label: 'Messages' },
  { id: 'medias', label: 'Médiathèque' },
  { id: 'reglages', label: 'Réglages' },
  { id: 'comptes', label: 'Comptes' },
]

export default function Layout({
  active,
  onTabChange,
  onLogout,
  unreadMessages = 0,
  pendingDrafts = 0,
  children,
}: {
  active: Tab
  onTabChange: (tab: Tab) => void
  onLogout: () => void
  unreadMessages?: number
  /** Blocs modifiés mais pas encore publiés, toutes pages confondues. */
  pendingDrafts?: number
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#FAF6EF]">
      <header className="bg-[#3B1705] text-[#FAF6EF]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#C97B1A]">Teint d'Afrique Cosmétiques</p>
            <p className="text-lg" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
              Panneau d'administration
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="text-[11px] tracking-[0.15em] uppercase text-[#FAF6EF]/60 hover:text-[#FAF6EF] underline"
            >
              Voir le site
            </a>
            <Button
              variant="secondary"
              className="!border-[#FAF6EF]/30 !text-[#FAF6EF] hover:!bg-[#FAF6EF]/10"
              onClick={onLogout}
            >
              Déconnexion
            </Button>
          </div>
        </div>
        <nav className="max-w-6xl mx-auto px-6 flex gap-1 border-t border-[#FAF6EF]/10 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-3 text-[11px] tracking-[0.15em] uppercase transition-colors border-b-2 whitespace-nowrap ${
                active === tab.id
                  ? 'border-[#C97B1A] text-[#FAF6EF]'
                  : 'border-transparent text-[#FAF6EF]/50 hover:text-[#FAF6EF]/80'
              }`}
            >
              {tab.label}
              {tab.id === 'contenu' && pendingDrafts > 0 && (
                <span
                  className="ml-1.5 inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full border border-[#C97B1A] text-[#C97B1A] text-[9px] leading-none align-middle"
                  aria-label={`${pendingDrafts} brouillon${pendingDrafts > 1 ? 's' : ''} non publié${pendingDrafts > 1 ? 's' : ''}`}
                >
                  {pendingDrafts}
                </span>
              )}
              {tab.id === 'messages' && unreadMessages > 0 && (
                <span
                  className="ml-1.5 inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-[#C97B1A] text-[#FAF6EF] text-[9px] leading-none align-middle"
                  aria-label={`${unreadMessages} message${unreadMessages > 1 ? 's' : ''} non lu${unreadMessages > 1 ? 's' : ''}`}
                >
                  {unreadMessages}
                </span>
              )}
            </button>
          ))}
        </nav>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-10">{children}</main>
    </div>
  )
}
