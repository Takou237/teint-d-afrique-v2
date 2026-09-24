import { createBrowserRouter } from 'react-router'
import Layout from '@/components/Layout'
import AccueilPage from '@/pages/AccueilPage'
import NotreFondatricePage from '@/pages/NotreFondatricePage'
import HistoirePage from '@/pages/HistoirePage'
import VisionBeautePage from '@/pages/VisionBeautePage'
import EngagementsPage from '@/pages/EngagementsPage'
import ValeursPage from '@/pages/ValeursPage'
import NosProduitsPage from '@/pages/NosProduitsPage'
import TypesProduitsPage from '@/pages/TypesProduitsPage'
import VosBesoinsPage from '@/pages/VosBesoinsPage'
import GammePage from '@/pages/GammePage'
import ExpertisePage from '@/pages/ExpertisePage'
import VlogsPage from '@/pages/VlogsPage'
import ContactPage from '@/pages/ContactPage'
import LocalisationPage from '@/pages/LocalisationPage'
import DistributeursPage from '@/pages/DistributeursPage'

function NotFound() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 px-6">
      <p className="text-[#3B1705] text-5xl" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
        404
      </p>
      <p className="text-[#2A1006]/60">Page introuvable</p>
      <a href="/" className="text-[#C97B1A] text-[11px] tracking-[0.2em] uppercase underline">
        Retour à l'accueil
      </a>
    </div>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: AccueilPage },

      // ── La marque ──
      { path: 'la-marque/histoire', Component: HistoirePage },
      { path: 'la-marque/fondatrice', Component: NotreFondatricePage },
      { path: 'la-marque/vision', Component: VisionBeautePage },
      { path: 'la-marque/engagements', Component: EngagementsPage },
      { path: 'la-marque/valeurs', Component: ValeursPage },

      // ── Nos produits ──
      { path: 'nos-produits', Component: NosProduitsPage },
      { path: 'nos-produits/les-gammes', Component: NosProduitsPage },
      { path: 'nos-produits/types', Component: TypesProduitsPage },
      { path: 'nos-produits/vos-besoins', Component: VosBesoinsPage },
      { path: 'nos-produits/:gammeId', Component: GammePage },

      // ── Notre expertise ──
      { path: 'notre-expertise', Component: ExpertisePage },

      // ── Vlogs ──
      { path: 'vlogs', Component: VlogsPage },

      // ── Contact ──
      { path: 'contact', Component: ContactPage },
      { path: 'contact/localisation', Component: LocalisationPage },
      { path: 'contact/distributeurs', Component: DistributeursPage },

      // Legacy redirects for old links
      { path: 'presentation', Component: NotreFondatricePage },
      { path: 'histoire', Component: HistoirePage },
      { path: 'boutique', Component: NosProduitsPage },
      { path: 'boutique/:gammeId', Component: GammePage },

      { path: '*', Component: NotFound },
    ],
  },
])
