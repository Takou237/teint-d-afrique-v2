import { useEffect, useState } from 'react'
import { fetchSettings, type Settings } from '@/lib/api'
import { setWhatsAppNumber } from '@/lib/whatsapp'

const FALLBACK_SETTINGS: Settings = {
  site_name: "Teint d'Afrique Cosmétiques",
  tagline_fr: "Des soins naturels qui révèlent votre éclat",
  tagline_en: 'Natural care that reveals your glow',
  email: 'contact@teintdafrique.com',
  phone: '',
  whatsapp_number: '237000000000',
  address_fr: 'Douala, Cameroun',
  address_en: 'Douala, Cameroon',
  hours_fr: 'Lun – Sam : 8h – 18h',
  hours_en: 'Mon – Sat: 8am – 6pm',
  instagram_url: '',
  facebook_url: '',
  tiktok_url: '',
  youtube_url: '',
}

/**
 * Charge les coordonnées & réseaux sociaux depuis l'API, avec repli sur les valeurs
 * actuellement codées en dur dans le site si l'API est indisponible.
 */
export function useSettings(): Settings {
  const [settings, setSettings] = useState<Settings>(FALLBACK_SETTINGS)

  useEffect(() => {
    let cancelled = false

    fetchSettings()
      .then(data => {
        if (cancelled) return
        const merged = { ...FALLBACK_SETTINGS, ...data }
        setSettings(merged)
        setWhatsAppNumber(merged.whatsapp_number)
      })
      .catch(() => {
        // API indisponible : on reste sur les coordonnées statiques.
      })

    return () => {
      cancelled = true
    }
  }, [])

  return settings
}
