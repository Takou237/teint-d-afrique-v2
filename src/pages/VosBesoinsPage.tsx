import { Link } from 'react-router'
import { useGammes } from '@/hooks/useGammes'
import { usePageContent } from '@/hooks/usePageContent'
import { useLang, useT } from '@/context/LanguageContext'

const BESOINS = [
  {
    besoin: 'Peau terne, teint inégal',
    solution: 'Gamme ÉCLAT NATUREL',
    gammeId: 'eclat',
    description: "Votre peau manque de luminosité ? Le curcuma et la carotte vont unifier et illuminer votre teint naturellement.",
    recommande: ['Lotion ÉCLAT NATUREL — TEINT UNIFIÉ', 'Crème de Visage ÉCLAT NATUREL', 'Lait Corps ÉCLAT NATUREL'],
  },
  {
    besoin: 'Peau abîmée, fatiguée ou stressée',
    solution: 'Gamme RÉPARATION',
    gammeId: 'reparation',
    description: "Votre peau a subi des agressions ou des produits décapants ? L'huile de Marula et le Collagène Marin vont la régénérer.",
    recommande: ['Lotion RÉPARATION', 'Crème de Visage RÉPARATION', 'Lait Corps RÉPARATION'],
  },
  {
    besoin: 'Peau déshydratée, manque de fraîcheur',
    solution: 'Gamme HYDRATATION',
    gammeId: 'hydratation',
    description: "Votre peau tiraille ou manque de souplesse ? L'aloe vera et le concombre vont la désaltérer et la rafraîchir en profondeur.",
    recommande: ['Lotion HYDRATATION', 'Crème de Visage HYDRATATION', 'Lait Corps HYDRATATION'],
  },
  {
    besoin: 'Peau très sèche, rugueuse',
    solution: 'Gamme NUTRITION',
    gammeId: 'nutrition',
    description: "Votre peau est sèche et a besoin d'une nutrition intense ? Le beurre de mangue et l'avocat vont la nourrir en profondeur.",
    recommande: ['Lotion NUTRITION', 'Crème de Visage NUTRITION — PEAU NOURRIE', 'Lait Corps NUTRITION'],
  },
]

const EN: Record<string, string> = {
  "Nos Produits · Teint d'Afrique Cosmétiques": "Our Products · Teint d'Afrique Cosmétiques",
  'Vos Besoins': 'Your Needs',
  'Identifiez le besoin de votre peau et découvrez la gamme faite pour vous.':
    "Identify your skin's needs and discover the range made for you.",
  'Mon besoin': 'My need',
  'Solution :': 'Solution:',
  'Peau terne, teint inégal': 'Dull skin, uneven complexion',
  'Gamme ÉCLAT NATUREL': 'NATURAL RADIANCE Range',
  "Votre peau manque de luminosité ? Le curcuma et la carotte vont unifier et illuminer votre teint naturellement.":
    'Does your skin lack radiance? Turmeric and carrot will even out and illuminate your complexion naturally.',
  'Lotion ÉCLAT NATUREL — TEINT UNIFIÉ': 'NATURAL RADIANCE Lotion — UNIFIED COMPLEXION',
  'Crème de Visage ÉCLAT NATUREL': 'NATURAL RADIANCE Face Cream',
  'Lait Corps ÉCLAT NATUREL': 'NATURAL RADIANCE Body Milk',
  'Peau abîmée, fatiguée ou stressée': 'Damaged, tired or stressed skin',
  'Gamme RÉPARATION': 'REPAIR Range',
  "Votre peau a subi des agressions ou des produits décapants ? L'huile de Marula et le Collagène Marin vont la régénérer.":
    'Has your skin suffered aggressions or harsh stripping products? Marula oil and Marine Collagen will regenerate it.',
  'Lotion RÉPARATION': 'REPAIR Lotion',
  'Crème de Visage RÉPARATION': 'REPAIR Face Cream',
  'Lait Corps RÉPARATION': 'REPAIR Body Milk',
  'Peau déshydratée, manque de fraîcheur': 'Dehydrated skin, lacking freshness',
  'Gamme HYDRATATION': 'HYDRATION Range',
  "Votre peau tiraille ou manque de souplesse ? L'aloe vera et le concombre vont la désaltérer et la rafraîchir en profondeur.":
    'Does your skin feel tight or lack suppleness? Aloe vera and cucumber will quench and deeply refresh it.',
  'Lotion HYDRATATION': 'HYDRATION Lotion',
  'Crème de Visage HYDRATATION': 'HYDRATION Face Cream',
  'Lait Corps HYDRATATION': 'HYDRATION Body Milk',
  'Peau très sèche, rugueuse': 'Very dry, rough skin',
  'Gamme NUTRITION': 'NUTRITION Range',
  "Votre peau est sèche et a besoin d'une nutrition intense ? Le beurre de mangue et l'avocat vont la nourrir en profondeur.":
    'Is your skin dry and in need of intense nutrition? Mango butter and avocado will nourish it deeply.',
  'Lotion NUTRITION': 'NUTRITION Lotion',
  'Crème de Visage NUTRITION — PEAU NOURRIE': 'NUTRITION Face Cream — NOURISHED SKIN',
  'Lait Corps NUTRITION': 'NUTRITION Body Milk',
}

export default function VosBesoinsPage() {
  const { lang } = useLang()
  const t = useT(EN)
  const GAMMES = useGammes(lang)
  const c = usePageContent('vos-besoins', lang, {
    title: { fr: 'Vos Besoins', en: 'Your Needs' },
    lead: {
      fr: 'Identifiez le besoin de votre peau et découvrez la gamme faite pour vous.',
      en: "Identify your skin's needs and discover the range made for you.",
    },
  })
  return (
    <div style={{ fontFamily: 'Outfit, system-ui, sans-serif' }}>
      <div className="bg-[#3B1705] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[#C97B1A] tracking-[0.35em] text-[10px] uppercase mb-4 flex items-center gap-3">
            <span className="w-8 h-px bg-[#C97B1A]" />
            {t("Nos Produits · Teint d'Afrique Cosmétiques")}
          </p>
          <h1 className="text-[#FAF6EF] leading-tight mb-4" style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
            {c.title}
          </h1>
          <p className="text-[#FAF6EF]/60 max-w-lg">
            {c.lead}
          </p>
        </div>
      </div>

      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {BESOINS.map(b => {
              const gamme = GAMMES.find(g => g.id === b.gammeId)!
              return (
                <div key={b.besoin} className="border border-[#3B1705]/8 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6 border-b" style={{ background: gamme.colorLight, borderColor: gamme.color + '30' }}>
                    <p className="text-[9px] tracking-[0.25em] uppercase mb-2" style={{ color: gamme.color }}>
                      {t('Mon besoin')}
                    </p>
                    <h3 className="text-xl text-[#3B1705]" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                      {t(b.besoin)}
                    </h3>
                  </div>
                  <div className="p-6 bg-white">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-2 h-2 rounded-full" style={{ background: gamme.color }} />
                      <p className="text-[11px] tracking-[0.15em] uppercase font-medium" style={{ color: gamme.color }}>
                        {t('Solution :')} {t(b.solution)}
                      </p>
                    </div>
                    <p className="text-[#2A1006]/70 text-sm leading-relaxed mb-5">{t(b.description)}</p>
                    <div className="space-y-2 mb-6">
                      {b.recommande.map(r => (
                        <div key={r} className="flex items-center gap-2 text-[12px] text-[#2A1006]/60">
                          <span className="text-[#C97B1A]">→</span>
                          {t(r)}
                        </div>
                      ))}
                    </div>
                    <Link
                      to={`/nos-produits/${b.gammeId}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-white text-[11px] tracking-[0.15em] uppercase hover:opacity-85 transition-opacity"
                      style={{ background: gamme.color }}
                    >
                      {lang === 'en' ? `View the ${gamme.nom} range →` : `Voir la gamme ${gamme.nom} →`}
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
