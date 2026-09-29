import { useT } from '@/context/LanguageContext'

const EN: Record<string, string> = {
  'Nos Distributeurs': 'Our Distributors',
  'Réseau de distribution en cours de déploiement':
    'Distribution network currently being rolled out',
  "Nos produits sont actuellement disponibles à Douala. Notre réseau de distributeurs s'étendra progressivement au Cameroun et dans la sous-région. Contactez-nous pour en savoir plus ou pour devenir distributeur.":
    'Our products are currently available in Douala. Our distributor network will gradually expand across Cameroon and the sub-region. Contact us to learn more or to become a distributor.',
  'Devenir distributeur →': 'Become a distributor →',
}

export default function DistributeursPage() {
  const t = useT(EN)

  return (
    <div style={{ fontFamily: 'Outfit, system-ui, sans-serif' }}>
      <div className="bg-[#3B1705] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[#C97B1A] tracking-[0.35em] text-[10px] uppercase mb-4 flex items-center gap-3">
            <span className="w-8 h-px bg-[#C97B1A]" />
            Contact · Teint d'Afrique Cosmétiques
          </p>
          <h1 className="text-[#FAF6EF] leading-tight" style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
            {t('Nos Distributeurs')}
          </h1>
        </div>
      </div>

      <section className="py-28 md:py-36">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex w-20 h-20 items-center justify-center mb-8 mx-auto" style={{ background: '#3B170508' }}>
            <span className="text-[#C97B1A] text-3xl">◈</span>
          </div>
          <h2 className="text-[#3B1705] text-3xl md:text-4xl mb-5" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
            {t('Réseau de distribution en cours de déploiement')}
          </h2>
          <p className="text-[#2A1006]/55 max-w-lg mx-auto leading-relaxed mb-10">
            {t("Nos produits sont actuellement disponibles à Douala. Notre réseau de distributeurs s'étendra progressivement au Cameroun et dans la sous-région. Contactez-nous pour en savoir plus ou pour devenir distributeur.")}
          </p>
          <a
            href="mailto:contact@teintdafrique.com"
            className="inline-flex items-center gap-2 bg-[#3B1705] text-[#FAF6EF] px-8 py-4 text-[11px] tracking-[0.25em] uppercase hover:bg-[#C97B1A] transition-colors"
          >
            {t('Devenir distributeur →')}
          </a>
        </div>
      </section>
    </div>
  )
}
