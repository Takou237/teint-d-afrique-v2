import { useEffect, useState } from 'react'
import {
  apiErrorMessage,
  createAdmin,
  deleteAdmin,
  fetchAdmins,
  type AdminAccount,
} from '@/admin/api'
import { Banner, Button, Field, TextInput, useConfirm } from '@/admin/components/ui'

function formatDate(value: string | null): string {
  if (!value) return 'jamais'
  const date = new Date(value.replace(' ', 'T'))
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString('fr-FR')
}

/**
 * Comptes autorisés à se connecter au panneau. Seul un administrateur connecté peut en
 * ajouter ou en retirer ; le dernier compte et le sien sont protégés côté serveur.
 */
export default function AdminsPage() {
  const [accounts, setAccounts] = useState<AdminAccount[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [creating, setCreating] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [confirm, confirmModal] = useConfirm()

  function reload() {
    fetchAdmins()
      .then(setAccounts)
      .catch(() => setLoadError('Impossible de charger les comptes administrateurs.'))
  }

  useEffect(reload, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 12) {
      setFormError('Le mot de passe doit contenir au moins 12 caractères.')
      return
    }
    setCreating(true)
    setFormError(null)
    setSuccess(null)
    try {
      const created = await createAdmin(email.trim(), password)
      setEmail('')
      setPassword('')
      setSuccess(`Compte créé pour ${created.email}. Communiquez-lui son mot de passe par un canal sûr.`)
      reload()
    } catch (err) {
      setFormError(apiErrorMessage(err))
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(account: AdminAccount) {
    const ok = await confirm({
      title: 'Supprimer ce compte ?',
      message: (
        <>
          <strong>{account.email}</strong> ne pourra plus se connecter au panneau. Cette action est définitive.
        </>
      ),
      confirmLabel: 'Supprimer le compte',
    })
    if (!ok) return
    setActionError(null)
    setSuccess(null)
    try {
      await deleteAdmin(account.id)
      setAccounts(prev => (prev ? prev.filter(a => a.id !== account.id) : prev))
    } catch (err) {
      setActionError(apiErrorMessage(err))
    }
  }

  return (
    <div className="space-y-8">
      {confirmModal}

      <form onSubmit={handleCreate} className="bg-white border border-[#3B1705]/10 p-6 space-y-4">
        <div>
          <h2 className="text-xl" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
            Ajouter un administrateur
          </h2>
          <p className="text-sm text-[#3B1705]/55 mt-1">
            Un administrateur peut modifier les gammes, les pages, les réglages et lire les messages.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Email">
            <TextInput
              type="email"
              required
              value={email}
              onChange={e => {
                setEmail(e.target.value)
                setFormError(null)
              }}
              placeholder="prenom@teintdafrique.com"
            />
          </Field>
          <Field label="Mot de passe provisoire (12 caractères minimum)">
            <TextInput
              type="text"
              required
              minLength={12}
              value={password}
              onChange={e => {
                setPassword(e.target.value)
                setFormError(null)
              }}
              placeholder="ex. Atelier2026-Douala"
            />
          </Field>
        </div>
        {formError && <Banner kind="error">{formError}</Banner>}
        {success && <Banner kind="success">{success}</Banner>}
        <Button type="submit" disabled={creating}>
          {creating ? 'Création...' : 'Créer le compte'}
        </Button>
        <p className="text-[11px] text-[#3B1705]/40">
          Le nouveau compte pourra changer ce mot de passe dans Réglages → Mon compte. En cas d'oubli, il
          peut demander un lien de réinitialisation depuis la page de connexion.
        </p>
      </form>

      {actionError && <Banner kind="error">{actionError}</Banner>}
      {loadError && <Banner kind="error">{loadError}</Banner>}
      {!loadError && accounts === null && <p className="text-sm text-[#3B1705]/50">Chargement...</p>}

      {accounts !== null && (
        <div className="bg-white border border-[#3B1705]/10 divide-y divide-[#3B1705]/10">
          {accounts.map(account => (
            <div key={account.id} className="p-5 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-sm text-[#3B1705]">
                  {account.email}
                  {account.isSelf && (
                    <span className="ml-2 text-[9px] tracking-[0.15em] uppercase text-[#C97B1A]">
                      Vous
                    </span>
                  )}
                </p>
                <p className="text-[11px] text-[#3B1705]/45 mt-1">
                  Créé le {formatDate(account.createdAt)} · Dernière connexion : {formatDate(account.lastLoginAt)}
                </p>
              </div>
              <Button
                variant="danger"
                onClick={() => handleDelete(account)}
                disabled={account.isSelf || accounts.length <= 1}
                title={
                  account.isSelf
                    ? 'Vous ne pouvez pas supprimer votre propre compte.'
                    : accounts.length <= 1
                      ? 'Il doit rester au moins un administrateur.'
                      : undefined
                }
              >
                Supprimer
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
