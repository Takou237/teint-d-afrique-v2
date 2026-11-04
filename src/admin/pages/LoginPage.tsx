import { useState } from 'react'
import { ApiError, apiErrorMessage, requestPasswordReset } from '@/admin/api'
import { Banner, Button, Field, TextInput } from '@/admin/components/ui'

const ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: 'Email ou mot de passe incorrect.',
  too_many_attempts: 'Trop de tentatives. Réessayez dans quelques minutes.',
  invalid_json_body: 'Requête invalide.',
  invalid_email: 'Adresse email invalide.',
}

export default function LoginPage({
  onLogin,
  notice,
}: {
  onLogin: (email: string, password: string) => Promise<void>
  notice?: string
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'login' | 'forgot'>('login')
  const [resetSent, setResetSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await onLogin(email, password)
    } catch (err) {
      const code = err instanceof ApiError ? err.code : 'erreur_inconnue'
      setError(ERROR_MESSAGES[code] ?? 'Une erreur est survenue, réessayez.')
    } finally {
      setLoading(false)
    }
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await requestPasswordReset(email)
      setResetSent(true)
    } catch (err) {
      const code = err instanceof ApiError ? err.code : 'erreur_inconnue'
      setError(ERROR_MESSAGES[code] ?? apiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#FAF6EF]">
      <form
        onSubmit={mode === 'login' ? handleSubmit : handleForgot}
        className="w-full max-w-sm bg-white border border-[#3B1705]/10 p-8"
      >
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#C97B1A] mb-2">Teint d'Afrique Cosmétiques</p>
        <h1 className="text-2xl mb-6" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
          {mode === 'login' ? 'Connexion admin' : 'Mot de passe oublié'}
        </h1>

        {notice && (
          <p className="mb-5 border border-[#C97B1A]/40 bg-[#C97B1A]/10 px-4 py-2.5 text-sm text-[#3B1705]">
            {notice}
          </p>
        )}

        <div className="space-y-4">
          <Field label="Email">
            <TextInput
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </Field>

          {mode === 'login' && (
            <Field label="Mot de passe">
              <TextInput
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </Field>
          )}

          {mode === 'forgot' && !resetSent && (
            <p className="text-sm text-[#3B1705]/60 leading-relaxed">
              Indiquez l'adresse de votre compte : vous recevrez un lien valable une heure pour choisir un
              nouveau mot de passe.
            </p>
          )}

          {resetSent && (
            <Banner kind="success">
              Si un compte correspond à cette adresse, un email vient d'être envoyé. Pensez à vérifier les
              courriers indésirables.
            </Banner>
          )}

          {error && <Banner kind="error">{error}</Banner>}

          {!resetSent && (
            <Button type="submit" disabled={loading} className="w-full">
              {mode === 'login'
                ? loading
                  ? 'Connexion...'
                  : 'Se connecter'
                : loading
                  ? 'Envoi...'
                  : 'Envoyer le lien'}
            </Button>
          )}

          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'forgot' : 'login')
              setError(null)
              setResetSent(false)
            }}
            className="block w-full text-center text-[11px] tracking-[0.15em] uppercase text-[#3B1705]/50 hover:text-[#C97B1A] transition-colors"
          >
            {mode === 'login' ? 'Mot de passe oublié ?' : 'Retour à la connexion'}
          </button>
        </div>
      </form>
    </div>
  )
}
