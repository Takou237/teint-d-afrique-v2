import { RouterProvider } from 'react-router'
import { router } from './routes'
import { LanguageProvider } from './context/LanguageContext'
import { SiteSettingsProvider } from './context/SiteSettingsContext'

export default function App() {
  return (
    <LanguageProvider>
      <SiteSettingsProvider>
        <RouterProvider router={router} />
      </SiteSettingsProvider>
    </LanguageProvider>
  )
}
