import { useState } from 'react'
import { Link, useParams } from 'react-router'
import type { Gamme, Product } from '@/data'
import { useGammes } from '@/hooks/useGammes'
import { usePageContent } from '@/hooks/usePageContent'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { useLang, useT } from '@/context/LanguageContext'
import ProductModal from '@/components/ProductModal'
import WhatsAppOrderButton from '@/components/WhatsAppOrderButton'
import Reveal from '@/components/home/Reveal'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  DropIcon,
  LeafIcon,
} from '@/components/BrandIcons'
import { rangeUrl } from '@/lib/whatsapp'

const EN: Record<string, string> = {
  'Actifs clés': 'Key actives',
  'Voir plus': 'See more',
  "Boutique · Teint d'Afrique Cosmétiques": "Shop · Teint d'Afrique Cosmétiques",
  '← Toutes les gammes': '← All ranges',
  'Toutes les gammes': 'All ranges',
  'Actifs Clés': 'Key actives',
  'Actifs botaniques': 'Botanical actives',
  Gamme: 'Range',
  'La gamme': 'The range',
  'Les 4 soins': 'The 4 products',
  'Quatre soins,': 'Four products,',
  'un seul rituel.': 'one ritual.',
  'Du nettoyage à la nutrition, chaque soin prépare le suivant.':
    'From cleansing to nutrition, each product prepares the next.',
  'Les 4 produits': 'The 4 products',
  'Les 4 gestes': 'The 4 steps',
  'Le rituel': 'The ritual',
  'Commander la gamme': 'Order the range',
  'Découvrir les 4 soins': 'Discover the 4 products',
  '4 soins': '4 products',
  '4 produits': '4 products',
  'Savon · Lotion · Crème · Lait': 'Soap · Lotion · Cream · Milk',
  'Compléter le rituel': 'Complete the ritual',
  "Explorer d'autres gammes": 'Explore other ranges',
  'Gamme introuvable': 'Range not found',
  '← Retour à la boutique': '← Back to the shop',
  "← Retour à l'accueil": '← Back to home',
  'Retour aux gammes': 'Back to ranges',
  'Voir les détails de': 'See details for',
  'Découvrir la gamme': 'Discover the range',
  'Boutique': 'Shop',
  'Accueil': 'Home',
  'Éclat Naturel': 'Natural Radiance',
  'Réparation': 'Repair',
  'Hydratation': 'Hydration',
  'Nutrition': 'Nutrition',
  'Nettoyer': 'Cleanse',
  'Tonifier': 'Tone',
  'Unifier': 'Even out',
  'Nourrir': 'Nourish',
}

const STEPS = [
  { label: 'Nettoyer' },
  { label: 'Tonifier' },
  { label: 'Unifier' },
  { label: 'Nourrir' },
]

function ProductCard({
  product,
  gamme,
  step,
  onOpen,
}: {
  product: Product
  gamme: Gamme
  step: number
  onOpen: () => void
}) {
  const t = useT(EN)
  const details = product.details
  const openable = Boolean(details)
  const title = details?.nom ?? product.type

  return (
    <article
      className={`group flex h-full flex-col bg-[#FAF6EF] transition-all duration-300 hover:shadow-[0_26px_60px_-36px_rgba(42,16,6,0.45)] ${
        openable ? 'cursor-pointer' : ''
      }`}
      style={{ borderTop: `2px solid ${gamme.color}` }}
      onClick={openable ? onOpen : undefined}
      onKeyDown={
        openable
          ? event => {
              if (event.target !== event.currentTarget) return
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onOpen()
              }
            }
          : undefined
      }
      role={openable ? 'button' : undefined}
      tabIndex={openable ? 0 : undefined}
      aria-label={openable ? `${t('Voir les détails de')} ${title}` : undefined}
    >
      <div className="relative h-48 overflow-hidden sm:h-56" style={{ background: gamme.colorLight }}>
        <span
          className="absolute left-4 top-3 z-10 text-[26px] leading-none opacity-25"
          style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: gamme.colorDark }}
        >
          0{step + 1}
        </span>
        <img
          src={product.image}
          alt={`${title} — ${gamme.nom}`}
          loading="lazy"
          className="h-full w-full object-contain p-6 mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <span
          className="absolute bottom-3 left-4 bg-[#FAF6EF]/90 px-2.5 py-1 text-[8px] uppercase tracking-[0.18em] backdrop-blur-sm"
          style={{ color: gamme.colorDark }}
        >
          {t(STEPS[step]?.label ?? 'Le rituel')}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[8px] uppercase tracking-[0.22em]" style={{ color: gamme.colorDark }}>
          {gamme.nom}
        </p>
        <h3
          className="mt-2 text-[21px] leading-tight text-[#2A1006]"
          style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
        >
          {title}
        </h3>
        <p className="mt-1.5 text-[10px] uppercase tracking-[0.14em] text-[#2A1006]/40">
          {product.type} · {product.poids}
        </p>

        {details ? (
          <>
            <ul className="mt-4 space-y-1.5">
              {details.promesses.map(promise => (
                <li key={promise} className="flex items-start gap-2 text-[11px] leading-snug text-[#2A1006]/60">
                  <LeafIcon size={11} className="mt-0.5 flex-shrink-0" style={{ color: gamme.color }} />
                  {promise}
                </li>
              ))}
            </ul>
            <div
              className="mt-4 border-l-2 p-3.5"
              style={{ borderColor: gamme.color, background: `${gamme.color}12` }}
            >
              <p className="text-[8px] uppercase tracking-[0.2em] text-[#2A1006]/40">
                {t('Actifs clés')}
              </p>
              <p className="mt-1.5 text-[11px] leading-relaxed" style={{ color: gamme.colorDark }}>
                {details.actifs}
              </p>
            </div>
            <div className="flex-1" />
            <div
              className="mt-4 flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] font-medium transition-all group-hover:gap-3"
              style={{ color: gamme.colorDark }}
            >
              {t('Voir plus')}
              <ArrowRightIcon size={12} />
            </div>
          </>
        ) : (
          <>
            <p className="mt-4 flex-1 text-[12px] leading-relaxed text-[#2A1006]/60">
              {product.description}
            </p>
          </>
        )}
      </div>

      <div className="px-5 pb-5" onClick={event => event.stopPropagation()}>
        <WhatsAppOrderButton product={product} gamme={gamme} className="mt-0" />
      </div>
    </article>
  )
}

function SectionLabel({ children, color = '#A85E0F' }: { children: React.ReactNode; color?: string }) {
  return (
    <p className="flex items-center gap-3 text-[9px] uppercase tracking-[0.3em] md:text-[10px]" style={{ color }}>
      <span className="h-px w-7" style={{ background: color }} />
      {children}
    </p>
  )
}

export default function GammePage() {
  const { gammeId } = useParams<{ gammeId: string }>()
  const { lang } = useLang()
  const t = useT(EN)
  const GAMMES = useGammes(lang)
  const settings = useSiteSettings()
  const [selected, setSelected] = useState<Product | null>(null)
  const c = usePageContent('gamme', lang, {
    discover_four: { fr: 'Découvrir les 4 soins', en: 'Discover the 4 products' },
    order_range: { fr: 'Commander la gamme', en: 'Order the range' },
    four_products: { fr: '4 soins', en: '4 products' },
    product_types: { fr: 'Savon · Lotion · Crème · Lait', en: 'Soap · Lotion · Cream · Milk' },
    range_label: { fr: 'La gamme', en: 'The range' },
    key_actives: { fr: 'Actifs Clés', en: 'Key actives' },
    four_products_label: { fr: 'Les 4 soins', en: 'The 4 products' },
    ritual_note: {
      fr: 'Du nettoyage à la nutrition, chaque soin prépare le suivant.',
      en: 'From cleansing to nutrition, each product prepares the next.',
    },
    ritual_label: { fr: 'Le rituel', en: 'The ritual' },
    ritual_title_1: { fr: 'Quatre soins,', en: 'Four products,' },
    ritual_title_2: { fr: 'un seul rituel.', en: 'one ritual.' },
    other_label: { fr: "Explorer d'autres gammes", en: 'Explore other ranges' },
    other_title: { fr: 'Compléter le rituel', en: 'Complete the ritual' },
    all_ranges: { fr: 'Toutes les gammes', en: 'All ranges' },
    not_found: { fr: 'Gamme introuvable', en: 'Range not found' },
    back_shop: { fr: '← Retour à la boutique', en: '← Back to the shop' },
  })
  const gamme = GAMMES.find(g => g.id === gammeId)

  if (!gamme) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <p
            className="mb-4 text-2xl text-[#3B1705]"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            {c.not_found}
          </p>
          <Link to="/nos-produits/les-gammes" className="text-sm text-[#A85E0F] underline">
            {c.back_shop}
          </Link>
        </div>
      </div>
    )
  }

  const index = GAMMES.findIndex(g => g.id === gamme.id)
  const otherGammes = GAMMES.filter(g => g.id !== gamme.id)
  const heroCard = gamme.products[2]?.image ?? gamme.mainImage

  return (
    <div>
      {/* ── Gamme hero ── */}
      <section className="relative min-h-[560px] overflow-hidden bg-[#2A1006] md:min-h-[660px]">
        <img
          src={gamme.heroImage}
          srcSet={`${gamme.heroImageSmall} 900w, ${gamme.heroImage} 1536w`}
          sizes="100vw"
          alt={gamme.heroAlt}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[66%_30%]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, #2A1006 0%, rgba(42,16,6,0.96) 28%, rgba(42,16,6,0.72) 50%, rgba(42,16,6,0.24) 72%, rgba(42,16,6,0) 92%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(75% 90% at 78% 28%, ${gamme.color}22 0%, ${gamme.color}00 60%)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2A1006]/95 via-[#2A1006]/55 to-transparent md:hidden" />

        <div className="relative z-10 mx-auto flex min-h-[560px] max-w-[1440px] flex-col justify-end px-6 pb-14 pt-24 md:min-h-[660px] md:justify-center md:px-10 md:pb-20 md:pt-24 lg:px-16">
          <nav className="mb-8 flex items-center gap-2 text-[9px] uppercase tracking-[0.18em] text-[#FAF6EF]/55 md:mb-10 md:text-[10px]">
            <Link to="/" className="transition-colors hover:text-[#FAF6EF]">
              {t('Accueil')}
            </Link>
            <span className="text-[#FAF6EF]/25">/</span>
            <Link to="/nos-produits/les-gammes" className="transition-colors hover:text-[#FAF6EF]">
              {t('Boutique')}
            </Link>
            <span className="text-[#FAF6EF]/25">/</span>
            <span className="text-[#FAF6EF]/85">{gamme.nom}</span>
          </nav>

          <div className="max-w-[42rem]">
            <p className="flex flex-wrap items-center gap-2.5 text-[8px] uppercase tracking-[0.18em] text-[#FAF6EF]/60 sm:text-[9px] sm:tracking-[0.24em] md:text-[10px]">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: gamme.color }} />
              <span className="whitespace-nowrap">
                {t('Gamme')} {String(index + 1).padStart(2, '0')} / 04
              </span>
              <span className="hidden text-[#FAF6EF]/25 sm:inline">·</span>
              <span className="hidden sm:inline">{gamme.ingredients}</span>
            </p>

            <h1
              className="mt-4 text-[clamp(2.2rem,11vw,4.8rem)] leading-[0.9] text-[#FAF6EF] md:mt-5 md:text-[clamp(4rem,7.5vw,7rem)]"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              {gamme.nom}
            </h1>

            <p
              className="mt-4 text-[17px] leading-snug text-[#FAF6EF]/80 md:mt-6 md:text-[21px]"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              {gamme.tagline}
            </p>

            <p className="mt-3 max-w-md text-[12px] leading-relaxed text-[#FAF6EF]/55 md:text-[13px]">
              {gamme.ingredientsDetail.split('.')[0]}.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3 md:mt-9">
              <a
                href="#soins"
                className="group inline-flex items-center gap-3 bg-[#FAF6EF] px-6 py-3.5 text-[10px] uppercase tracking-[0.2em] text-[#2A1006] transition-colors hover:bg-[#C9971A] md:px-7 md:py-4"
              >
                {c.discover_four}
                <ArrowRightIcon size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href={rangeUrl(lang, gamme, settings.whatsapp_number)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-[#FAF6EF]/35 px-5 py-3.5 text-[10px] uppercase tracking-[0.2em] text-[#FAF6EF] transition-colors hover:border-[#FAF6EF] hover:bg-[#FAF6EF]/10 md:px-6 md:py-4"
              >
                  {c.order_range}
                <ArrowUpRightIcon size={13} />
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-24 right-10 z-20 hidden w-[252px] lg:block xl:right-16">
          <div className="border border-[#FAF6EF]/15 bg-[#FAF6EF]/95 p-4 shadow-[0_24px_70px_-30px_rgba(0,0,0,0.55)] backdrop-blur">
            <div className="flex items-center gap-3">
              <div
                className="flex h-16 w-16 flex-shrink-0 items-center justify-center"
                style={{ background: gamme.colorLight }}
              >
                <img
                  src={heroCard}
                  alt={gamme.nom}
                  className="h-full w-full object-contain p-1 mix-blend-multiply"
                />
              </div>
              <div className="min-w-0">
                <p className="text-[8px] uppercase tracking-[0.2em] text-[#2A1006]/45">{c.four_products}</p>
                <p
                  className="mt-0.5 text-[13px] leading-tight text-[#2A1006]"
                  style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                >
                  {gamme.nom}
                </p>
                <p className="mt-0.5 text-[8px] uppercase tracking-[0.12em]" style={{ color: gamme.colorDark }}>
                  {c.product_types}
                </p>
              </div>
            </div>
            <a
              href="#soins"
              className="mt-3 flex items-center justify-between border-t border-[#2A1006]/10 pt-3 text-[8px] uppercase tracking-[0.18em] text-[#2A1006] transition-colors hover:text-[#A85E0F]"
            >
              {c.discover_four}
              <ArrowRightIcon size={12} />
            </a>
          </div>
        </div>
      </section>

      {/* ── Story + actives ── */}
      <section className="bg-[#FAF6EF] py-16 md:py-24">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <SectionLabel color={gamme.colorDark}>{c.range_label}</SectionLabel>
              <h2
                className="mt-4 text-[clamp(2.2rem,4.2vw,3.4rem)] leading-[0.98] text-[#2A1006]"
                style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
              >
                {gamme.tagline}
              </h2>
              <p className="mt-6 max-w-2xl text-[14px] leading-relaxed text-[#2A1006]/70 md:text-[15px]">
                {gamme.description}
              </p>

              <div
                className="mt-8 border-l-2 p-5 md:p-6"
                style={{ borderColor: gamme.color, background: `${gamme.color}10` }}
              >
                <p className="flex items-center gap-2 text-[9px] uppercase tracking-[0.24em] text-[#2A1006]/45">
                  <LeafIcon size={13} style={{ color: gamme.colorDark }} />
                  {c.key_actives}
                </p>
                <p className="mt-3 text-[13px] leading-relaxed" style={{ color: gamme.colorDark }}>
                  {gamme.ingredientsDetail}
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {gamme.products.map(product => (
                  <span
                    key={product.type}
                    className="border px-3 py-1.5 text-[9px] uppercase tracking-[0.12em]"
                    style={{ borderColor: `${gamme.color}55`, color: gamme.colorDark }}
                  >
                    {product.type} · {product.poids}
                  </span>
                ))}
              </div>
            </div>

            <aside className="lg:col-span-5">
              <div className="relative overflow-hidden p-6 md:p-8" style={{ background: gamme.colorLight }}>
                <span
                  className="pointer-events-none absolute -right-2 -top-6 select-none text-[9rem] leading-none opacity-[0.06]"
                  style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: gamme.colorDark }}
                >
                  4
                </span>
                <div className="relative mx-auto flex h-56 w-full items-center justify-center md:h-64">
                  <img
                    src={gamme.mainImage}
                    alt={`${gamme.nom} — ${gamme.ingredients}`}
                    loading="lazy"
                    className="h-full w-auto object-contain mix-blend-multiply"
                  />
                </div>

                <div className="relative mt-5 border-t pt-5" style={{ borderColor: `${gamme.color}35` }}>
                  <p className="text-[9px] uppercase tracking-[0.22em] text-[#2A1006]/40">{c.four_products_label}</p>
                  <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
                    {gamme.products.map(product => (
                      <div key={product.type} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: gamme.color }} />
                        <span className="text-[11px] text-[#2A1006]/70">{product.type}</span>
                        <span className="ml-auto text-[9px] text-[#2A1006]/35">{product.poids}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href={rangeUrl(lang, gamme, settings.whatsapp_number)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative mt-6 flex items-center justify-between px-4 py-3 text-[9px] uppercase tracking-[0.18em] text-[#FAF6EF] transition-opacity hover:opacity-85"
                  style={{ background: gamme.colorDark }}
                >
                {c.order_range}
                  <ArrowUpRightIcon size={13} />
                </a>
              </div>

              <p className="mt-4 flex items-start gap-2 text-[10px] leading-relaxed text-[#2A1006]/40">
                <DropIcon size={13} className="mt-0.5 flex-shrink-0" style={{ color: gamme.colorDark }} />
                {c.ritual_note}
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* ── Products ── */}
      <section id="soins" className="scroll-mt-28 bg-[#F3EADC] py-16 md:py-24">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16">
          <Reveal>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <SectionLabel color={gamme.colorDark}>{c.ritual_label}</SectionLabel>
                <h2
                  className="mt-4 text-[clamp(2.2rem,4.6vw,3.6rem)] leading-[0.98] text-[#2A1006]"
                  style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                >
                  {c.ritual_title_1}
                  <br />
                  <em style={{ color: gamme.colorDark }}>{c.ritual_title_2}</em>
                </h2>
              </div>
              <p className="max-w-sm text-[12px] leading-relaxed text-[#2A1006]/55 md:text-[13px]">
                {c.ritual_note}
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-12 lg:grid-cols-4">
            {gamme.products.map((product, i) => (
              <Reveal key={product.type} delay={i * 60} className="h-full">
                <ProductCard
                  product={product}
                  gamme={gamme}
                  step={i}
                  onOpen={() => setSelected(product)}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {selected && (
        <ProductModal product={selected} gamme={gamme} onClose={() => setSelected(null)} />
      )}

      {/* ── Other gammes ── */}
      <section className="bg-[#FAF6EF] py-16 md:py-24">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16">
          <div className="flex items-end justify-between gap-6">
            <div>
              <SectionLabel color={gamme.colorDark}>{c.other_label}</SectionLabel>
              <h2
                className="mt-4 text-[clamp(2rem,4vw,3rem)] leading-tight text-[#2A1006]"
                style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
              >
                {c.other_title}
              </h2>
            </div>
            <Link
              to="/nos-produits/les-gammes"
              className="group hidden items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-[#2A1006] transition-colors hover:text-[#A85E0F] sm:flex"
            >
              <ArrowLeftIcon size={13} className="transition-transform duration-300 group-hover:-translate-x-1" />
              {c.all_ranges}
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3 md:mt-10">
            {otherGammes.map((other, i) => (
              <Reveal key={other.id} delay={i * 60} className="h-full">
                <Link
                  to={`/nos-produits/${other.id}`}
                  className="group relative block h-60 overflow-hidden md:h-72"
                >
                  <img
                    src={other.heroImage}
                    srcSet={`${other.heroImageSmall} 900w, ${other.heroImage} 1536w`}
                    sizes="(min-width: 768px) 33vw, 100vw"
                    alt={other.heroAlt}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover object-[64%_30%] transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(180deg, ${other.colorDark}10 0%, ${other.colorDark}dd 100%)`,
                    }}
                  />
                  <div className="relative z-10 flex h-full flex-col justify-end p-5 md:p-6">
                    <p className="text-[8px] uppercase tracking-[0.2em] text-[#FAF6EF]/55">
                      0{GAMMES.findIndex(g => g.id === other.id) + 1}
                    </p>
                    <div className="mt-2 flex items-end justify-between gap-3">
                      <div>
                        <p
                          className="text-[26px] leading-none text-[#FAF6EF] md:text-[30px]"
                          style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                        >
                          {other.nom}
                        </p>
                        <p className="mt-1.5 text-[9px] uppercase tracking-[0.14em] text-[#FAF6EF]/60">
                          {other.ingredients}
                        </p>
                      </div>
                      <span className="mb-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-[#FAF6EF]/35 text-[#FAF6EF] transition-all duration-300 group-hover:border-[#FAF6EF] group-hover:bg-[#FAF6EF] group-hover:text-[#2A1006]">
                        <ArrowUpRightIcon size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
