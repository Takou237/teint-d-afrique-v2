import { useEffect } from 'react'
import type { Gamme, Product } from '@/data'
import { useT } from '@/context/LanguageContext'
import WhatsAppOrderButton from './WhatsAppOrderButton'

const EN: Record<string, string> = {
  'Actifs clés': 'Key Actives',
  Propriétés: 'Properties',
  "Mode d'emploi": 'Directions for use',
  Ingrédients: 'Ingredients',
  Précautions: 'Precautions',
  Fermer: 'Close',
  'Peaux noires = Belles peaux': 'Black Skins = Beautiful Skins',
}

export default function ProductModal({
  product,
  gamme,
  onClose,
}: {
  product: Product
  gamme: Gamme
  onClose: () => void
}) {
  const t = useT(EN)
  const details = product.details

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
        className="relative bg-white w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label={t('Fermer')}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-white/85 hover:bg-white text-[#3B1705] border border-[#3B1705]/10 transition-colors"
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
              className="absolute inset-0 w-full h-full object-contain p-8 md:p-12"
            />
          </div>
          <div className="p-7 md:p-10 flex flex-col">
            <p className="text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: gamme.color }}>
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

            <ul className="space-y-2.5 mb-6">
              {details.promesses.map(p => (
                <li key={p} className="flex items-start gap-3 text-[13px] text-[#2A1006]/75">
                  <span className="text-[#C97B1A] mt-0.5 flex-shrink-0">✓</span>
                  {p}
                </li>
              ))}
            </ul>

            <div
              className="p-4 border-l-4 mb-7"
              style={{ borderColor: gamme.color, background: `${gamme.color}15` }}
            >
              <p className="text-[9px] tracking-[0.3em] uppercase mb-1.5" style={{ color: gamme.colorDark }}>
                {t('Actifs clés')}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: gamme.colorDark }}>
                {details.actifs}
              </p>
            </div>

            <WhatsAppOrderButton product={product} gamme={gamme} className="mt-auto" />
          </div>
        </div>

        {/* Details */}
        <div className="border-t border-[#3B1705]/8 grid md:grid-cols-2">
          <div className="p-7 md:p-10 space-y-8 md:border-r border-[#3B1705]/8">
            <section>
              <h3 className="text-[10px] tracking-[0.3em] uppercase mb-3" style={{ color: gamme.color }}>
                {t('Propriétés')}
              </h3>
              <p className="text-[13px] leading-relaxed text-[#2A1006]/70">{details.proprietes}</p>
            </section>
            <section>
              <h3 className="text-[10px] tracking-[0.3em] uppercase mb-3" style={{ color: gamme.color }}>
                {t("Mode d'emploi")}
              </h3>
              <p className="text-[13px] leading-relaxed text-[#2A1006]/70">{details.modeEmploi}</p>
            </section>
          </div>
          <div className="p-7 md:p-10 space-y-8">
            <section>
              <h3 className="text-[10px] tracking-[0.3em] uppercase mb-3" style={{ color: gamme.color }}>
                {t('Ingrédients')}
              </h3>
              <p className="text-[13px] leading-relaxed text-[#2A1006]/70">{details.ingredients}</p>
            </section>
            <section>
              <h3 className="text-[10px] tracking-[0.3em] uppercase mb-3" style={{ color: gamme.color }}>
                {t('Précautions')}
              </h3>
              <p className="text-[12px] leading-relaxed text-[#2A1006]/55">{details.precautions}</p>
            </section>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#C97B1A] pt-3 border-t border-[#3B1705]/8">
              {t('Peaux noires = Belles peaux')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
