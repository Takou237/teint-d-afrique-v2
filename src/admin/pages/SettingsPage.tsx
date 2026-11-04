import { useEffect, useState } from 'react'
import { ApiError, apiErrorMessage, changePassword, fetchSettings, updateSetting, type Settings } from '@/admin/api'
import { Banner, Button, Field, TextArea, TextInput } from '@/admin/components/ui'

type SettingKey = keyof Settings

const SECTIONS: {
  title: string
  description?: string
  fields: { key: SettingKey; label: string; placeholder: string; multiline?: boolean }[]
}[] = [
  {
    title: 'Identité du site',
    fields: [
      { key: 'site_name', label: 'Nom du site', placeholder: "Teint d'Afrique Cosmétiques" },
      { key: 'tagline_fr', label: 'Accroche (FR)', placeholder: 'La beauté des peaux noires, révélée.' },
      { key: 'tagline_en', label: 'Accroche (EN)', placeholder: 'Revealing the beauty of black skin.' },
    ],
  },
  {
    title: 'Coordonnées',
    fields: [
      { key: 'email', label: 'Email', placeholder: 'contact@teintdafrique.com' },
      { key: 'phone', label: 'Téléphone', placeholder: '+237 6XX XXX XXX' },
      {
        key: 'whatsapp_number',
        label: 'Numéro WhatsApp (chiffres uniquement)',
        placeholder: '2376XXXXXXXX',
      },
      {
        key: 'address_fr',
        label: 'Adresse (FR)',
        placeholder: 'Douala, Cameroun',
        multiline: true,
      },
      {
        key: 'address_en',
        label: 'Adresse (EN)',
        placeholder: 'Douala, Cameroon',
        multiline: true,
      },
      { key: 'hours_fr', label: 'Horaires (FR)', placeholder: 'Lun – Sam : 9h – 18h' },
      { key: 'hours_en', label: 'Horaires (EN)', placeholder: 'Mon – Sat: 9am – 6pm' },
    ],
  },
  {
    title: 'Réseaux sociaux',
    description: 'Laissez vide pour masquer l’icône correspondante sur le site.',
    fields: [
      { key: 'instagram_url', label: 'Instagram', placeholder: 'https://instagram.com/...' },
      { key: 'facebook_url', label: 'Facebook', placeholder: 'https://facebook.com/...' },
      { key: 'tiktok_url', label: 'TikTok', placeholder: 'https://tiktok.com/@...' },
      { key: 'youtube_url', label: 'YouTube', placeholder: 'https://youtube.com/@...' },
    ],
  },
]

const PASSWORD_ERRORS: Record<string, string> = {
  invalid_current_password: 'Le mot de passe actuel est incorrect.',
  weak_password: 'Le nouveau mot de passe doit contenir au moins 12 caractères.',
  password_too_long: 'Le nouveau mot de passe est trop long (200 caractères maximum).',
  password_unchanged: "Le nouveau mot de passe doit être différent de l'actuel.",
  missing_password: 'Remplissez les trois champs.',
  invalid_csrf_token: 'Session expirée, reconnectez-vous.',
  unauthorized: 'Session expirée, reconnectez-vous.',
}

const ERROR_MESSAGES: Record<string, string> = {
  invalid_url: 'URL invalide (elle doit commencer par https://).',
  invalid_email: 'Adresse email invalide.',
  invalid_whatsapp_number: 'Le numéro WhatsApp doit contenir uniquement des chiffres.',
  invalid_setting_key: 'Réglage inconnu.',
  invalid_setting_value: 'Valeur invalide.',
  setting_value_too_long: 'Valeur trop longue (500 caractères maximum).',
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    fetchSettings()
      .then(setSettings)
      .catch(() => setLoadError('Impossible de charger les coordonnées.'))
  }, [])

  function handleUpdated(updated: Settings) {
    setSettings(updated)
  }

  if (loadError) return <Banner kind="error">{loadError}</Banner>
  if (!settings) return <p className="text-sm text-[#3B1705]/50">Chargement...</p>

  return (
    <div className="space-y-6 max-w-3xl">
      {SECTIONS.map(section => (
        <section key={section.title} className="bg-white border border-[#3B1705]/10 p-6 space-y-5">
          <div>
            <h2 className="text-xl" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
              {section.title}
            </h2>
            {section.description && <p className="text-xs text-[#3B1705]/45 mt-1">{section.description}</p>}
          </div>
          {section.fields.map(field => (
            <SettingField
              key={field.key}
              field={field}
              value={settings[field.key] ?? ''}
              onUpdated={handleUpdated}
            />
          ))}
        </section>
      ))}
      <PasswordSection />

      <p className="text-[11px] text-[#3B1705]/40">
        Les modifications sont visibles immédiatement sur le site après rechargement de la page.
      </p>
    </div>
  )
}

function PasswordSection() {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    if (next.length < 12) {
      setError(PASSWORD_ERRORS.weak_password)
      return
    }
    if (next !== confirmation) {
      setError('Les deux nouveaux mots de passe ne correspondent pas.')
      return
    }

    setSaving(true)
    try {
      await changePassword(current, next)
      setCurrent('')
      setNext('')
      setConfirmation('')
      setSuccess(true)
    } catch (err) {
      const code = err instanceof ApiError ? err.code : 'erreur_inconnue'
      setError(PASSWORD_ERRORS[code] ?? apiErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="bg-white border border-[#3B1705]/10 p-6 space-y-5">
      <div>
        <h2 className="text-xl" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
          Mon compte
        </h2>
        <p className="text-xs text-[#3B1705]/45 mt-1">
          Changez le mot de passe de connexion au panneau. 12 caractères minimum ; vous restez connecté après
          l'enregistrement.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
        <Field label="Mot de passe actuel">
          <TextInput
            type="password"
            autoComplete="current-password"
            required
            value={current}
            onChange={e => {
              setCurrent(e.target.value)
              setSuccess(false)
            }}
          />
        </Field>
        <Field label="Nouveau mot de passe">
          <TextInput
            type="password"
            autoComplete="new-password"
            required
            value={next}
            onChange={e => {
              setNext(e.target.value)
              setSuccess(false)
            }}
          />
        </Field>
        <Field label="Confirmer le nouveau mot de passe">
          <TextInput
            type="password"
            autoComplete="new-password"
            required
            value={confirmation}
            onChange={e => {
              setConfirmation(e.target.value)
              setSuccess(false)
            }}
          />
        </Field>
        {error && <p className="text-xs text-red-700">{error}</p>}
        {success && <p className="text-xs text-emerald-700">Mot de passe mis à jour.</p>}
        <Button type="submit" disabled={saving || !current || !next || !confirmation}>
          {saving ? 'Enregistrement...' : 'Changer le mot de passe'}
        </Button>
      </form>
    </section>
  )
}

function SettingField({
  field,
  value,
  onUpdated,
}: {
  field: { key: SettingKey; label: string; placeholder: string; multiline?: boolean }
  value: string
  onUpdated: (settings: Settings) => void
}) {
  const [current, setCurrent] = useState(value)
  const [saved, setSaved] = useState(value)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    setCurrent(value)
    setSaved(value)
  }, [value])

  async function handleSave() {
    setSaving(true)
    setError(null)
    setSuccess(false)

    if (field.key === 'whatsapp_number' && current.trim() !== '' && !/^\d{6,15}$/.test(current.trim())) {
      setError(ERROR_MESSAGES.invalid_whatsapp_number)
      setSaving(false)
      return
    }

    try {
      const updated = await updateSetting(field.key, current.trim())
      setSaved(current.trim())
      setSuccess(true)
      onUpdated(updated)
    } catch (err) {
      const code = err instanceof ApiError ? err.code : 'erreur_inconnue'
      setError(ERROR_MESSAGES[code] ?? apiErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const Control = field.multiline ? TextArea : TextInput

  return (
    <div className="flex gap-3 items-end">
      <div className="flex-1">
        <Field label={field.label}>
          <Control
            value={current}
            placeholder={field.placeholder}
            rows={field.multiline ? 2 : undefined}
            inputMode={field.key === 'whatsapp_number' ? 'numeric' : undefined}
            onChange={e => {
              setCurrent(e.target.value)
              setSuccess(false)
              setError(null)
            }}
          />
        </Field>
        {error && <p className="text-xs text-red-700 mt-1">{error}</p>}
        {success && <p className="text-xs text-emerald-700 mt-1">Enregistré.</p>}
      </div>
      <Button variant="secondary" onClick={handleSave} disabled={saving || current.trim() === saved}>
        {saving ? '...' : 'Enregistrer'}
      </Button>
    </div>
  )
}
