import { useEffect } from 'react'
import type { Gamme, Product } from '@/data'
import { usePageContent } from '@/hooks/usePageContent'
import { useLang } from '@/context/LanguageContext'
import WhatsAppOrderButton from './WhatsAppOrderButton'

export default function ProductModal({
  product,
  gamme,
  onClose,
}: {
  product: Product
  gamme: Gamme
  onClose: () => void
}) {
  const { lang } = useLang()
  const c = usePageContent('produit', lang, {
    close: { fr: 'Fermer', en: 'Close' },
    key_actives: { fr: 'Actifs clés', en: 'Key Actives' },
    properties: { fr: 'Propriétés', en: 'Properties' },
    directions: { fr: "Mode d'emploi", en: 'Directions for use' },
    ingredients: { fr: 'Ingrédients', en: 'Ingredients' },
    precautions: { fr: 'Précautions', en: 'Precautions' },
    claim: { fr: 'Peaux noires = Belles peaux', en: 'Black Skins = Beautiful Skins' },
  })
  const details = product.details
  const has = (value?: string) => Boolean(value?.trim())
  const hasDetails =
    has(details?.proprietes) ||
    has(details?.modeEmploi) ||
    has(details?.ingredients) ||
    has(details?.precautions)

  useEffect(() => {
    if (!details) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [details, onClose])

  if (!details) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6 bg-[#2A1006]/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={details.nom}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#FAF6EF] shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label={c.close}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center border border-[#3B1705]/10 bg-[#FAF6EF]/90 text-[#3B1705] transition-colors hover:bg-white"
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Header: image + intro */}
        <div className="grid md:grid-cols-2">
          <div
            className="relative min-h-[260px] md:min-h-full"
            style={{ background: gamme.colorLight }}
          >
            <img
              src={product.image}
              alt={`${gamme.nom} — ${details.nom}`}
              className="absolute inset-0 w-full h-full object-contain p-8 mix-blend-multiply md:p-12"
            />
          </div>
          <div className="p-7 md:p-10 flex flex-col">
            <p className="text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: gamme.colorDark }}>
              {gamme.nom}
            </p>
            <p className="text-[9px] tracking-[0.25em] uppercase text-[#2A1006]/45 mb-4">
              {product.type} · {product.poids}
            </p>
            <h2
              className="text-3xl md:text-4xl leading-tight mb-6"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: gamme.colorDark }}
            >
              {details.nom}
            </h2>

            {details.promesses.length > 0 && (
              <ul className="space-y-2.5 mb-6">
                {details.promesses.map(p => (
                  <li key={p} className="flex items-start gap-3 text-[13px] text-[#2A1006]/75">
                    <span className="mt-0.5 flex-shrink-0 text-[#A85E0F]">✓</span>
                    {p}
                  </li>
                ))}
              </ul>
            )}

            {has(details.actifs) && (
              <div
                className="p-4 border-l-4 mb-7"
                style={{ borderColor: gamme.color, background: `${gamme.color}15` }}
              >
                <p className="text-[9px] tracking-[0.3em] uppercase mb-1.5" style={{ color: gamme.colorDark }}>
                  {c.key_actives}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: gamme.colorDark }}>
                  {details.actifs}
                </p>
              </div>
            )}

            <WhatsAppOrderButton product={product} gamme={gamme} className="mt-auto" />
          </div>
        </div>

        {/* Details */}
        {hasDetails && (
          <div className="border-t border-[#3B1705]/8 grid md:grid-cols-2">
            <div className="p-7 md:p-10 space-y-8 md:border-r border-[#3B1705]/8">
              {has(details.proprietes) && (
                <section>
                  <h3 className="text-[10px] tracking-[0.3em] uppercase mb-3" style={{ color: gamme.colorDark }}>
                    {c.properties}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-[#2A1006]/70">{details.proprietes}</p>
                </section>
              )}
              {has(details.modeEmploi) && (
                <section>
                  <h3 className="text-[10px] tracking-[0.3em] uppercase mb-3" style={{ color: gamme.colorDark }}>
                    {c.directions}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-[#2A1006]/70">{details.modeEmploi}</p>
                </section>
              )}
            </div>
            <div className="p-7 md:p-10 space-y-8">
              {has(details.ingredients) && (
                <section>
                  <h3 className="text-[10px] tracking-[0.3em] uppercase mb-3" style={{ color: gamme.colorDark }}>
                    {c.ingredients}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-[#2A1006]/70">{details.ingredients}</p>
                </section>
              )}
              {has(details.precautions) && (
                <section>
                  <h3 className="text-[10px] tracking-[0.3em] uppercase mb-3" style={{ color: gamme.colorDark }}>
                    {c.precautions}
                  </h3>
                  <p className="text-[12px] leading-relaxed text-[#2A1006]/55">{details.precautions}</p>
                </section>
              )}
              <p className="border-t border-[#3B1705]/8 pt-3 text-[10px] uppercase tracking-[0.2em] text-[#A85E0F]">
                {c.claim}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
