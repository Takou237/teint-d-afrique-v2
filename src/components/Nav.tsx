import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router'
import logo from '@/imports/TDA_LogoExe_CMJN.png'
import { useGammes } from '@/hooks/useGammes'
import { useContentImage } from '@/hooks/useContentImage'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { generalUrl } from '@/lib/whatsapp'
import { useLang, useT } from '@/context/LanguageContext'

const EN = {
  Accueil: 'Home',
  'La marque': 'The Brand',
  'Notre Histoire': 'Our Story',
  'Notre Fondatrice': 'Our Founder',
  'Notre Vision de la Beauté Africaine': 'Our Vision of African Beauty',
  'Nos Engagements': 'Our Commitments',
  'Nos Valeurs et Ambitions': 'Our Values & Ambitions',
  'Nos produits': 'Our Products',
  'Les Gammes': 'The Ranges',
  "Vue d'ensemble": 'Overview',
  'Types de Produits': 'Product Types',
  'Savon · Lotion · Crème · Lait': 'Soap · Lotion · Cream · Milk',
  'Vos Besoins': 'Your Needs',
  'Trouver votre soin': 'Find your care',
  'Notre Expertise': 'Our Expertise',
  Vlogs: 'Vlogs',
  Contact: 'Contact',
  Langue: 'Language',
  'Cosmétiques naturels · Douala, Cameroun': 'Natural cosmetics · Douala, Cameroon',
  "Formulé en Afrique, pour l'Afrique": 'Formulated in Africa, for Africa',
  'Commander sur WhatsApp': 'Order on WhatsApp',
  'Ouvrir le menu': 'Open menu',
  'Fermer le menu': 'Close menu',
  'Éclat Naturel': 'Natural Radiance',
  Réparation: 'Repair',
  Hydratation: 'Hydration',
  Nutrition: 'Nutrition',
  'Curcuma & Carotte': 'Turmeric & Carrot',
  'Huile de Marula & Collagène Marin': 'Marula Oil & Marine Collagen',
  'Aloe Vera & Concombre': 'Aloe Vera & Cucumber',
  "Beurre de Mangue & Huile d'Avocat": 'Mango Butter & Avocado Oil',
}

interface DropdownItem {
  label: string
  to: string
  sub?: string
}

interface NavGroup {
  label: string
  to?: string
  items?: DropdownItem[]
}

const NAV: NavGroup[] = [
  { label: 'Accueil', to: '/' },
  {
    label: 'La marque',
    items: [
      { label: 'Notre Histoire', to: '/la-marque/histoire' },
      { label: 'Notre Fondatrice', to: '/la-marque/fondatrice' },
      { label: 'Notre Vision de la Beauté Africaine', to: '/la-marque/vision' },
      { label: 'Nos Engagements', to: '/la-marque/engagements' },
      { label: 'Nos Valeurs et Ambitions', to: '/la-marque/valeurs' },
    ],
  },
  {
    label: 'Nos produits',
    items: [
      { label: 'Les Gammes', to: '/nos-produits/les-gammes', sub: 'Vue d\'ensemble' },
      { label: 'Éclat Naturel', to: '/nos-produits/eclat', sub: 'Curcuma & Carotte' },
      { label: 'Réparation', to: '/nos-produits/reparation', sub: 'Huile de Marula & Collagène Marin' },
      { label: 'Hydratation', to: '/nos-produits/hydratation', sub: 'Aloe Vera & Concombre' },
      { label: 'Nutrition', to: '/nos-produits/nutrition', sub: 'Beurre de Mangue & Huile d\'Avocat' },
      { label: 'Types de Produits', to: '/nos-produits/types', sub: 'Savon · Lotion · Crème · Lait' },
      { label: 'Vos Besoins', to: '/nos-produits/vos-besoins', sub: 'Trouver votre soin' },
    ],
  },
  { label: 'Notre Expertise', to: '/notre-expertise' },
  { label: 'Vlogs', to: '/vlogs' },
  { label: 'Contact', to: '/contact' },
]

function Dropdown({ items, onClose }: { items: DropdownItem[]; onClose: () => void }) {
  const { lang } = useLang()
  const t = useT(EN)
  const GAMMES = useGammes(lang)
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 max-h-[calc(100svh-9rem)] overflow-y-auto bg-white shadow-xl border border-[#3B1705]/8 py-2 min-w-[240px] z-50">
      {items.map((item, i) => {
        const isGamme = GAMMES.some(g => item.to.includes(g.id))
        const gamme = isGamme ? GAMMES.find(g => item.to.includes(g.id)) : null
        return (
          <Link
            key={i}
            to={item.to}
            onClick={onClose}
            className="flex items-start gap-3 px-5 py-3 hover:bg-[#FAF6EF] transition-colors group"
          >
            {gamme ? (
              <img
                src={gamme.heroImage}
                alt=""
                loading="lazy"
                className="h-9 w-9 flex-shrink-0 rounded-full object-cover"
              />
            ) : (
              <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-[#3B1705]/20 transition-colors group-hover:bg-[#C9971A]" />
            )}
            <div>
              <p
                className="text-[11px] tracking-[0.1em] uppercase font-medium"
                style={{ color: gamme ? gamme.colorDark : '#3B1705' }}
              >
                {t(item.label)}
              </p>
              {item.sub && (
                <p className="text-[10px] text-[#2A1006]/40 mt-0.5">{t(item.sub)}</p>
              )}
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navRef = useRef<HTMLDivElement>(null)
  const { lang, setLang } = useLang()
  const t = useT(EN)
  const GAMMES = useGammes(lang)
  const settings = useSiteSettings()
  const logoUrl = useContentImage('global', lang, 'logo', logo)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setOpenDropdown(null)
    setMobileExpanded(null)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close overlays on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null)
        setMenuOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  // Lock the page behind the full-height mobile menu
  useEffect(() => {
    if (!menuOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [menuOpen])

  const isActive = (group: NavGroup) => {
    if (group.to) return location.pathname === group.to
    return group.items?.some(item => location.pathname.startsWith(item.to.split('/').slice(0, 2).join('/')))
  }

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#FAF6EF]/96 shadow-[0_10px_30px_-24px_rgba(42,16,6,0.5)] backdrop-blur-md' : 'bg-[#FAF6EF]'
      }`}
    >
      {/* Announcement bar — retracts on scroll */}
      <div
        className={`overflow-hidden bg-[#2A1006] text-[#FAF6EF] transition-all duration-300 ${
          scrolled ? 'max-h-0 opacity-0' : 'max-h-9 opacity-100'
        }`}
      >
        <div className="mx-auto flex h-8 max-w-[1440px] items-center justify-between gap-3 overflow-hidden px-4 md:px-6 lg:px-10">
          <p className="flex items-center gap-2 whitespace-nowrap text-[8px] uppercase tracking-[0.16em] text-[#FAF6EF]/60 md:text-[9px] md:tracking-[0.2em]">
            <span className="h-1 w-1 rounded-full bg-[#C9971A]" />
            <span className="hidden sm:inline">{t('Cosmétiques naturels · Douala, Cameroun')}</span>
            <span className="sm:hidden">Douala, Cameroun</span>
          </p>
          <p className="hidden whitespace-nowrap text-[8px] uppercase tracking-[0.22em] text-[#FAF6EF]/35 sm:block md:text-[9px]">
            {t("Formulé en Afrique, pour l'Afrique")}
          </p>
          <a
            href={generalUrl(lang, settings.whatsapp_number)}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 whitespace-nowrap text-[8px] uppercase tracking-[0.14em] text-[#E7C783] transition-colors hover:text-[#FAF6EF] md:text-[9px] md:tracking-[0.18em]"
          >
            <span className="hidden sm:inline">{t('Commander sur WhatsApp')}</span>
            <span className="sm:hidden">WhatsApp</span>
            <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
          </a>
        </div>
      </div>

      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 md:h-18 md:px-6 lg:px-10">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img
            src={logoUrl}
            alt="Teint d'Afrique Cosmétiques"
            className="h-7 object-contain mix-blend-multiply md:h-9"
          />
        </Link>

        {/* Desktop nav */}
        <div
          className="hidden items-center gap-0.5 lg:flex"
          style={{ fontFamily: 'Outfit, system-ui, sans-serif' }}
        >
          {NAV.map(group => (
            <div key={group.label} className="relative">
              {group.to && !group.items ? (
                <Link
                  to={group.to}
                  className={`relative px-3 py-2 text-[10px] uppercase tracking-[0.15em] font-medium transition-colors after:absolute after:bottom-1 after:left-3 after:right-3 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100 ${
                    isActive(group)
                      ? 'text-[#A85E0F] after:scale-x-100'
                      : 'text-[#3B1705] hover:text-[#A85E0F]'
                  }`}
                >
                  {t(group.label)}
                </Link>
              ) : (
                <button
                  onClick={() => setOpenDropdown(openDropdown === group.label ? null : group.label)}
                  aria-expanded={openDropdown === group.label}
                  aria-haspopup="true"
                  className={`relative flex items-center gap-1 px-3 py-2 text-[10px] uppercase tracking-[0.15em] font-medium transition-colors after:absolute after:bottom-1 after:left-3 after:right-3 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100 ${
                    isActive(group)
                      ? 'text-[#A85E0F] after:scale-x-100'
                      : 'text-[#3B1705] hover:text-[#A85E0F]'
                  }`}
                >
                  {t(group.label)}
                  <svg
                    width="9"
                    height="5"
                    viewBox="0 0 10 6"
                    fill="none"
                    className={`mt-px transition-transform duration-200 ${openDropdown === group.label ? 'rotate-180' : ''}`}
                  >
                    <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              )}
              {group.items && openDropdown === group.label && (
                <Dropdown items={group.items} onClose={() => setOpenDropdown(null)} />
              )}
            </div>
          ))}
        </div>

        {/* Language switcher + hamburger */}
        <div className="flex items-center gap-3">
          <div
            className="hidden lg:flex items-center border border-[#3B1705]/25 overflow-hidden"
            style={{ fontFamily: 'Outfit, system-ui, sans-serif' }}
          >
            <button
              onClick={() => setLang('fr')}
              className={`px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase font-medium transition-colors ${
                lang === 'fr'
                  ? 'bg-[#3B1705] text-[#FAF6EF]'
                  : 'text-[#3B1705] hover:bg-[#3B1705]/8'
              }`}
            >
              FR
            </button>
            <div className="w-px h-4 bg-[#3B1705]/20" />
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase font-medium transition-colors ${
                lang === 'en'
                  ? 'bg-[#3B1705] text-[#FAF6EF]'
                  : 'text-[#3B1705] hover:bg-[#3B1705]/8'
              }`}
            >
              EN
            </button>
          </div>
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="lg:hidden w-10 h-10 flex flex-col justify-center gap-[5px] items-center"
            aria-label={menuOpen ? t('Fermer le menu') : t('Ouvrir le menu')}
            aria-expanded={menuOpen}
          >
            <span className={`block w-6 h-0.5 bg-[#3B1705] origin-center transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block w-6 h-0.5 bg-[#3B1705] transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-[#3B1705] origin-center transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className={`${scrolled ? 'h-[calc(100svh-4rem)]' : 'h-[calc(100svh-6rem)]'} overflow-y-auto overscroll-contain border-t border-[#3B1705]/10 bg-[#FAF6EF] shadow-[0_30px_60px_-20px_rgba(42,16,6,0.45)] lg:hidden`}
          style={{ fontFamily: 'Outfit, system-ui, sans-serif' }}
        >
          <div className="px-5 py-4 flex flex-col divide-y divide-[#3B1705]/8">
            {NAV.map(group => (
              <div key={group.label}>
                {group.to && !group.items ? (
                  <Link
                    to={group.to}
                    className="flex items-center py-3.5 text-[11px] tracking-[0.2em] uppercase font-medium text-[#3B1705]"
                  >
                    {t(group.label)}
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() => setMobileExpanded(mobileExpanded === group.label ? null : group.label)}
                      className="w-full flex items-center justify-between py-3.5 text-[11px] tracking-[0.2em] uppercase font-medium text-[#3B1705]"
                    >
                      {t(group.label)}
                      <svg
                        width="10"
                        height="6"
                        viewBox="0 0 10 6"
                        fill="none"
                        className={`transition-transform duration-200 ${mobileExpanded === group.label ? 'rotate-180' : ''}`}
                      >
                        <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </button>
                    {mobileExpanded === group.label && (
                      <div className="pb-3 flex flex-col gap-1 pl-3">
                        {group.items?.map(item => {
                          const gamme = GAMMES.find(g => item.to.includes(g.id))
                          return (
                            <Link
                              key={item.to}
                              to={item.to}
                              className="flex items-center gap-3 py-2 text-[11px] text-[#3B1705]/70 hover:text-[#A85E0F] transition-colors"
                            >
                              {gamme ? (
                                <img
                                  src={gamme.heroImage}
                                  alt=""
                                  loading="lazy"
                                  className="h-7 w-7 flex-shrink-0 rounded-full object-cover"
                                />
                              ) : (
                                <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#A85E0F]/40" />
                              )}
                              {t(item.label)}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
            {/* Mobile language switcher */}
            <div className="pt-4 pb-2 flex items-center gap-2">
              <span className="text-[9px] tracking-[0.25em] uppercase text-[#3B1705]/40 mr-1">{t('Langue')}</span>
              {(['fr', 'en'] as const).map(l => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase font-medium border transition-colors ${
                    lang === l
                      ? 'bg-[#3B1705] text-[#FAF6EF] border-[#3B1705]'
                      : 'border-[#3B1705]/25 text-[#3B1705]'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <a
              href={generalUrl(lang, settings.whatsapp_number)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center justify-between bg-[#25D366] px-4 py-3.5 text-[10px] uppercase tracking-[0.18em] text-white"
            >
              {t('Commander sur WhatsApp')}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
