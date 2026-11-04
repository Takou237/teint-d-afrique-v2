import { useEffect, useState } from 'react'
import { fetchContactMessages, fetchContentDrafts } from '@/admin/api'
import { useAuth } from '@/admin/hooks/useAuth'
import Layout, { type Tab } from '@/admin/components/Layout'
import LoginPage from '@/admin/pages/LoginPage'
import ResetPasswordPage from '@/admin/pages/ResetPasswordPage'
import GammesPage from '@/admin/pages/GammesPage'
import ContentPage from '@/admin/pages/ContentPage'
import MessagesPage from '@/admin/pages/MessagesPage'
import MediaPage from '@/admin/pages/MediaPage'
import SettingsPage from '@/admin/pages/SettingsPage'
import AdminsPage from '@/admin/pages/AdminsPage'
import DashboardPage from '@/admin/pages/DashboardPage'

/**
 * Point d'entrée de l'admin, monté sous /admin dans src/routes.tsx (chargé en lazy).
 * Gère lui-même sa navigation interne (onglets) sans react-router imbriqué.
 */
export default function AdminApp() {
  const { status, expired, login, logout } = useAuth()
  const [tab, setTab] = useState<Tab>('tableau')
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [pendingDrafts, setPendingDrafts] = useState(0)
  // Jeton de réinitialisation reçu par email : le panneau affiche alors l'écran de
  // nouveau mot de passe, même sans session.
  const [resetToken, setResetToken] = useState<string | null>(() =>
    new URLSearchParams(window.location.search).get('reset')
  )
  const [notice, setNotice] = useState<string | null>(null)

  // Compteur de messages non lus affiché dans la navigation ; recalculé à chaque changement d'onglet
  // pour rester à jour après une lecture depuis l'onglet Messages.
  useEffect(() => {
    if (status !== 'authenticated') return
    let cancelled = false
    fetchContactMessages({ perPage: 1 })
      .then(page => {
        if (cancelled) return
        setUnreadMessages(page.unread)
      })
      .catch(() => {
        // Badge indisponible : l'onglet Messages reste utilisable.
      })
    return () => {
      cancelled = true
    }
  }, [status, tab])

  // Compteur de brouillons de contenu en attente, affiché sur l'onglet Pages.
  useEffect(() => {
    if (status !== 'authenticated') return
    let cancelled = false
    fetchContentDrafts()
      .then(drafts => {
        if (!cancelled) setPendingDrafts(drafts.length)
      })
      .catch(() => {
        // Compteur indisponible : l'onglet Pages reste utilisable.
      })
    return () => {
      cancelled = true
    }
  }, [status, tab])

  useEffect(() => {
    const previousTitle = document.title
    document.title = "Admin — Teint d'Afrique Cosmétiques"

    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)

    return () => {
      document.title = previousTitle
      document.head.removeChild(meta)
    }
  }, [])

  if (resetToken) {
    return (
      <ResetPasswordPage
        token={resetToken}
        onDone={message => {
          // Le jeton est consommé : on le retire de l'URL pour qu'un rechargement ne le rejoue pas.
          window.history.replaceState(null, '', window.location.pathname)
          setResetToken(null)
          setNotice(message)
        }}
      />
    )
  }

  if (status === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-[#3B1705]/50">
        Chargement...
      </div>
    )
  }

  if (status === 'anonymous') {
    return (
      <LoginPage
        onLogin={login}
        notice={
          notice ?? (expired ? 'Votre session a expiré. Merci de vous reconnecter.' : undefined)
        }
      />
    )
  }

  return (
    <Layout
      active={tab}
      onTabChange={setTab}
      onLogout={logout}
      unreadMessages={unreadMessages}
      pendingDrafts={pendingDrafts}
    >
      {tab === 'tableau' && <DashboardPage onNavigate={setTab} />}
      {tab === 'gammes' && <GammesPage />}
      {tab === 'contenu' && <ContentPage onDraftsCountChange={setPendingDrafts} />}
      {tab === 'messages' && <MessagesPage />}
      {tab === 'medias' && <MediaPage />}
      {tab === 'reglages' && <SettingsPage />}
      {tab === 'comptes' && <AdminsPage />}
    </Layout>
  )
}
