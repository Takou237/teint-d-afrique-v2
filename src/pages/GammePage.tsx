import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { getGammes, type Gamme, type Product } from '@/data'
import { useLang, useT } from '@/context/LanguageContext'
import ProductModal from '@/components/ProductModal'
import WhatsAppOrderButton from '@/components/WhatsAppOrderButton'

const EN: Record<string, string> = {
  'Actifs clés': 'Key Actives',
  'Voir plus →': 'See more →',
  "Boutique · Teint d'Afrique Cosmétiques": "Shop · Teint d'Afrique Cosmétiques",
  '← Toutes les gammes': '← All ranges',
  'Actifs Clés': 'Key Actives',
  'Actifs botaniques': 'Botanical actives',
  Gamme: 'Range',
  'Les 4 Produits': 'The 4 Products',
  "Explorer d'autres gammes": 'Explore other ranges',
  'Gamme introuvable': 'Range not found',
  '← Retour à la boutique': '← Back to the shop',
  "← Retour à l'accueil": '← Back to home',
}

function ProductCard({
  product,
  gamme,
  onOpen,
}: {
  product: Product
  gamme: Gamme
  onOpen: () => void
}) {
  const t = useT(EN)
  const details = product.details
  const openable = Boolean(details)

  return (
    <div
      className={`bg-white overflow-hidden hover:shadow-lg transition-shadow group flex flex-col ${openable ? 'cursor-pointer' : ''}`}
      style={{ borderTop: `3px solid ${gamme.color}` }}
      onClick={openable ? onOpen : undefined}
      onKeyDown={openable ? e => {
        if (e.target !== e.currentTarget) return
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen()
        }
      } : undefined}
      role={openable ? 'button' : undefined}
      tabIndex={openable ? 0 : undefined}
    >
      {/* Product shot */}
      <div
        className="relative h-52 overflow-hidden"
        style={{ background: gamme.colorLight }}
      >
        <img
          src={product.image}
          alt={`${gamme.nom} — ${details ? details.nom : product.type}`}
          className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none"
          style={{ background: `linear-gradient(to top, ${gamme.colorLight}, transparent)` }} />
      </div>

      {/* Card body */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h3
              className="text-xl mb-0.5"
              style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
                color: gamme.colorDark,
              }}
            >
              {details ? details.nom : product.type}
            </h3>
            <span
              className="text-[9px] tracking-[0.25em] uppercase"
              style={{ color: gamme.color }}
            >
              {details ? `${product.type} · ${product.poids}` : product.poids}
            </span>
          </div>
          <span className="text-3xl mt-1 flex-shrink-0" style={{ color: gamme.color }}>
            {product.symbol}
          </span>
        </div>

        {details ? (
          <>
            <ul className="space-y-2 mb-5">
              {details.promesses.map(p => (
                <li key={p} className="flex items-start gap-2 text-[12px] text-[#2A1006]/65">
                  <span className="text-[#C97B1A] mt-0.5 flex-shrink-0">✓</span>
                  {p}
                </li>
              ))}
            </ul>
            <div
              className="p-4 border-l-4 mb-5"
              style={{ borderColor: gamme.color, background: `${gamme.color}15` }}
            >
              <p className="text-[9px] tracking-[0.3em] uppercase mb-1" style={{ color: gamme.colorDark }}>
                {t('Actifs clés')}
              </p>
              <p className="text-[12px] leading-relaxed" style={{ color: gamme.colorDark }}>
                {details.actifs}
              </p>
            </div>
            <div className="flex-1" />
            <div
              className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-medium group-hover:gap-3 transition-all"
              style={{ color: gamme.color }}
            >
              {t('Voir plus →')}
            </div>
          </>
        ) : (
          <p className="text-[13px] text-[#2A1006]/65 leading-relaxed flex-1">{product.description}</p>
        )}

        <div onClick={e => e.stopPropagation()}>
          <WhatsAppOrderButton product={product} gamme={gamme} />
        </div>
      </div>
    </div>
  )
}

export default function GammePage() {
  const { gammeId } = useParams<{ gammeId: string }>()
  const { lang } = useLang()
  const t = useT(EN)
  const GAMMES = getGammes(lang)
  const [selected, setSelected] = useState<Product | null>(null)
  const gamme = GAMMES.find(g => g.id === gammeId)

  if (!gamme) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#3B1705] text-2xl mb-4"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
            {t('Gamme introuvable')}
          </p>
          <Link to="/boutique" className="text-[#C97B1A] text-sm underline">
            {t('← Retour à la boutique')}
          </Link>
        </div>
      </div>
    )
  }

  const otherGammes = GAMMES.filter(g => g.id !== gamme.id)

  return (
    <div style={{ fontFamily: 'Outfit, system-ui, sans-serif' }}>
      {/* ── GAMME HERO ── */}
      <div
        className="py-16 md:py-20"
        style={{ background: gamme.color }}
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-white/60 text-[9px] tracking-[0.35em] uppercase mb-3">
              {t("Boutique · Teint d'Afrique Cosmétiques")}
            </p>
            <h1
              className="text-white leading-none mb-3"
              style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
                fontSize: 'clamp(3rem, 8vw, 6rem)',
              }}
            >
              {gamme.nom}
            </h1>
            <p className="text-white/80 text-base tracking-wide italic"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
              {gamme.tagline}
            </p>
            <p className="text-white/60 text-[11px] tracking-[0.2em] uppercase mt-3">
              {gamme.ingredients}
            </p>
          </div>
          <Link
            to="/boutique"
            className="self-start md:self-auto flex items-center gap-2 text-white/70 hover:text-white text-[11px] tracking-[0.2em] uppercase transition-colors border border-white/25 px-5 py-2.5 hover:bg-white/10 flex-shrink-0"
          >
            {t('← Toutes les gammes')}
          </Link>
        </div>
      </div>

      {/* ── DESCRIPTION + ACTIFS ── */}
      <section className="py-16 md:py-20" style={{ background: gamme.colorLight }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div>
              <p className="leading-relaxed text-[#2A1006]/80 text-[15px] mb-8">
                {gamme.description}
              </p>
              <div
                className="p-6 border-l-4"
                style={{ borderColor: gamme.color, background: `${gamme.color}15` }}
              >
                <p
                  className="text-[9px] tracking-[0.3em] uppercase mb-3"
                  style={{ color: gamme.colorDark }}
                >
                  {t('Actifs Clés')}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: gamme.colorDark }}>
                  {gamme.ingredientsDetail}
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src={gamme.image}
                alt={`${t('Actifs botaniques')} — ${gamme.nom}`}
                className="w-full h-72 md:h-80 object-cover"
              />
              <div
                className="absolute bottom-4 right-4 px-4 py-2 text-white text-[9px] tracking-[0.2em] uppercase"
                style={{ background: gamme.color }}
              >
                {gamme.ingredients}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section className="py-16 md:py-20 bg-[#FAF6EF]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between gap-6 mb-10">
            <div>
              <p
                className="text-[9px] tracking-[0.3em] uppercase mb-2"
                style={{ color: gamme.color }}
              >
                {t('Gamme')} {gamme.nom}
              </p>
              <h2
                className="text-3xl md:text-4xl"
                style={{
                  fontFamily: "'DM Serif Display', Georgia, serif",
                  color: gamme.colorDark,
                }}
              >
                {t('Les 4 Produits')}
              </h2>
            </div>
            <div className="flex gap-2 flex-wrap justify-end">
              {gamme.products.map(p => (
                <span
                  key={p.type}
                  className="text-[10px] tracking-[0.1em] uppercase px-3 py-1 border"
                  style={{ color: gamme.colorDark, borderColor: gamme.color + '50' }}
                >
                  {p.type}
                </span>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {gamme.products.map(product => (
              <ProductCard
                key={product.type}
                product={product}
                gamme={gamme}
                onOpen={() => setSelected(product)}
              />
            ))}
          </div>
        </div>
      </section>

      {selected && (
        <ProductModal
          product={selected}
          gamme={gamme}
          onClose={() => setSelected(null)}
        />
      )}

      {/* ── OTHER GAMMES ── */}
      <section className="py-16 md:py-20" style={{ background: gamme.colorLight }}>
        <div className="max-w-7xl mx-auto px-6">
          <p
            className="text-[9px] tracking-[0.3em] uppercase mb-8"
            style={{ color: gamme.colorDark }}
          >
            {t("Explorer d'autres gammes")}
          </p>
          <div className="grid sm:grid-cols-3 gap-5">
            {otherGammes.map(g => (
              <Link
                key={g.id}
                to={`/boutique/${g.id}`}
                className="group flex items-center gap-4 p-5 bg-white border border-[#3B1705]/8 hover:shadow-md transition-all"
              >
                <div className="relative h-16 w-16 overflow-hidden flex-shrink-0">
                  <img
                    src={g.image}
                    alt={`${t('Gamme')} ${g.nom}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div
                    className="absolute inset-0 opacity-60"
                    style={{ background: g.color }}
                  />
                  <p
                    className="absolute inset-0 flex items-center justify-center text-white text-[10px] tracking-wider font-bold"
                    style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: '11px' }}
                  >
                    {g.nom}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm text-[#3B1705] truncate">{g.tagline}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: g.color }}>{g.ingredients}</p>
                </div>
                <span className="ml-auto text-[#3B1705]/30 group-hover:text-[#C97B1A] group-hover:translate-x-1 transition-all flex-shrink-0">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
