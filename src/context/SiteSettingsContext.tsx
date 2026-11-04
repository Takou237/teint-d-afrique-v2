import { createContext, useContext } from 'react'
import type { Settings } from '@/lib/api'
import { useSettings } from '@/hooks/useSettings'

const SiteSettingsContext = createContext<Settings | null>(null)

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const settings = useSettings()
  return <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>
}

export function useSiteSettings(): Settings {
  const settings = useContext(SiteSettingsContext)
  if (!settings) {
    throw new Error('useSiteSettings doit être utilisé dans <SiteSettingsProvider>')
  }
  return settings
}
