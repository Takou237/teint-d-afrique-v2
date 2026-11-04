import { useState } from 'react'
import { apiErrorMessage, resetPassword } from '@/admin/api'
import { Banner, Button, Field, TextInput } from '@/admin/components/ui'

const ERROR_MESSAGES: Record<string, string> = {
  invalid_token:
    'Ce lien a expiré ou a déjà servi. Demandez un nouveau lien depuis la page de connexion.',
  weak_password: 'Le mot de passe doit contenir au moins 12 caractères.',
  password_too_long: 'Le mot de passe est trop long (200 caractères maximum).',
  invalid_json_body: 'Requête invalide.',
}

/**
 * Écran affiché quand l'URL contient ?reset=<jeton> (lien reçu par email).
 * Le jeton n'est jamais conservé ailleurs que dans l'URL, puis retiré après usage.
 */
export default function ResetPasswordPage({
  token,
  onDone,
}: {
  token: string
  onDone: (message: string) => void
}) {
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirmation) {
      setError('Les deux mots de passe ne sont pas identiques.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await resetPassword(token, password)
      onDone('Mot de passe modifié. Connectez-vous avec votre nouveau mot de passe.')
    } catch (err) {
      const code = (err as { code?: string }).code ?? ''
      setError(ERROR_MESSAGES[code] ?? apiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#FAF6EF]">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white border border-[#3B1705]/10 p-8">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#C97B1A] mb-2">
          Teint d'Afrique Cosmétiques
        </p>
        <h1 className="text-2xl mb-2" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
          Nouveau mot de passe
        </h1>
        <p className="text-sm text-[#3B1705]/60 mb-6">Choisissez un mot de passe de 12 caractères minimum.</p>

        <div className="space-y-4">
          <Field label="Nouveau mot de passe">
            <TextInput
              type="password"
              autoComplete="new-password"
              required
              minLength={12}
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </Field>
          <Field label="Confirmation">
            <TextInput
              type="password"
              autoComplete="new-password"
              required
              minLength={12}
              value={confirmation}
              onChange={e => setConfirmation(e.target.value)}
            />
          </Field>

          {error && <Banner kind="error">{error}</Banner>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Enregistrement...' : 'Enregistrer le mot de passe'}
          </Button>
        </div>
      </form>
    </div>
  )
}
