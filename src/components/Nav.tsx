import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router'
import logo from '@/imports/TDA_LogoExe_CMJN.png'
import { getGammes } from '@/data'
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
  const GAMMES = getGammes(lang)
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white shadow-xl border border-[#3B1705]/8 py-2 min-w-[240px] z-50">
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
            {gamme && (
              <span className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ background: gamme.color }} />
            )}
            {!gamme && (
              <span className="w-2 h-2 rounded-full mt-1 flex-shrink-0 bg-[#3B1705]/20 group-hover:bg-[#C97B1A] transition-colors" />
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
  const GAMMES = getGammes(lang)

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

  const isActive = (group: NavGroup) => {
    if (group.to) return location.pathname === group.to
    return group.items?.some(item => location.pathname.startsWith(item.to.split('/').slice(0, 2).join('/')))
  }

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#FAF6EF]/96 backdrop-blur-sm shadow-sm' : 'bg-[#FAF6EF]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-6 flex items-center justify-between h-16 md:h-18">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img
            src={logo}
            alt="Teint d'Afrique Cosmétiques"
            className="h-7 md:h-9 object-contain mix-blend-multiply"
          />
        </Link>

        {/* Desktop nav */}
        <div
          className="hidden lg:flex items-center gap-1"
          style={{ fontFamily: 'Outfit, system-ui, sans-serif' }}
        >
          {NAV.map(group => (
            <div key={group.label} className="relative">
              {group.to && !group.items ? (
                <Link
                  to={group.to}
                  className={`px-3 py-2 text-[10px] tracking-[0.15em] uppercase font-medium transition-colors ${
                    isActive(group) ? 'text-[#C97B1A]' : 'text-[#3B1705] hover:text-[#C97B1A]'
                  }`}
                >
                  {t(group.label)}
                </Link>
              ) : (
                <button
                  onClick={() => setOpenDropdown(openDropdown === group.label ? null : group.label)}
                  className={`flex items-center gap-1 px-3 py-2 text-[10px] tracking-[0.15em] uppercase font-medium transition-colors ${
                    isActive(group) ? 'text-[#C97B1A]' : 'text-[#3B1705] hover:text-[#C97B1A]'
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
            aria-label="Menu"
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
          className="lg:hidden bg-[#FAF6EF] border-t border-[#3B1705]/10 max-h-[80vh] overflow-y-auto"
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
                              className="flex items-center gap-2.5 py-2 text-[11px] text-[#3B1705]/70 hover:text-[#C97B1A] transition-colors"
                            >
                              {gamme
                                ? <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: gamme.color }} />
                                : <span className="w-1.5 h-1.5 rounded-full bg-[#C97B1A]/40 flex-shrink-0" />
                              }
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
          </div>
        </div>
      )}
    </nav>
  )
}
