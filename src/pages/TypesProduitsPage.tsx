import { Link } from 'react-router'
import { getGammes } from '@/data'
import { useLang, useT } from '@/context/LanguageContext'
import lotionUnifiee from '@/assets/products/lotion-unifiee.webp'
import cremeUnifiee from '@/assets/products/creme-unifiee.webp'
import laitUnifie from '@/assets/products/lait-unifie.webp'

const TYPES = [
  {
    type: 'Lotion',
    poids: '100 ml',
    symbol: '◻',
    description: "Légère et pénétrante, la lotion prépare et tonifie la peau, renforce l'hydratation et maximise l'efficacité des soins suivants. À utiliser matin et soir pour une synergie optimale avec les autres produits de la gamme.",
    benefices: ["Tonification et préparation de la peau", "Hydratation légère de 12h", 'Synergie avec la gamme', 'Texture non grasse'],
    img: lotionUnifiee,
  },
  {
    type: 'Crème de Visage',
    poids: '100 ml',
    symbol: '◇',
    description: "Formule concentrée dédiée au visage, la crème cible les besoins spécifiques de chaque gamme. Texture fondante et non grasse, elle s'adapte à la finesse de la peau du visage pour délivrer les actifs en profondeur et révéler l'éclat naturel.",
    benefices: ['Formule concentrée en actifs', 'Action ciblée sur le visage', 'Texture fondante et fine', 'Résultats visibles en 4 semaines'],
    img: cremeUnifiee,
  },
  {
    type: 'Lait Corps',
    poids: '500 ml',
    symbol: '○',
    description: "Généreux et onctueux, le lait corps est le soin quotidien incontournable. Sa texture légère s'absorbe rapidement pour envelopper la peau d'une couche nourrissante et protectrice, du matin au soir. Le geste beauté qui transforme la peau en douceur.",
    benefices: ['Texture légère et non grasse', 'Absorption rapide', 'Nutrition longue durée', 'Parfum délicat et naturel'],
    img: laitUnifie,
  },
]

const EN: Record<string, string> = {
  "Nos Produits · Teint d'Afrique Cosmétiques": "Our Products · Teint d'Afrique Cosmétiques",
  'Types de Produits': 'Product Types',
  '3 types de produits, déclinés dans chacune de nos 4 gammes — soit 12 références formulées pour les peaux noires, métissées et albinos.':
    '3 product types, available in each of our 4 ranges — 12 references formulated for black, mixed-race and albino skin.',
  Lotion: 'Lotion',
  'Crème de Visage': 'Face Cream',
  'Lait Corps': 'Body Milk',
  'par flacon': 'per bottle',
  "Légère et pénétrante, la lotion prépare et tonifie la peau, renforce l'hydratation et maximise l'efficacité des soins suivants. À utiliser matin et soir pour une synergie optimale avec les autres produits de la gamme.":
    'Light and fast-absorbing, the lotion prepares and tones the skin, boosts hydration and maximises the effectiveness of the following care steps. Use morning and evening for optimal synergy with the other products in the range.',
  'Tonification et préparation de la peau': 'Toning and preparing the skin',
  'Hydratation légère de 12h': 'Light 12-hour hydration',
  'Synergie avec la gamme': 'Synergy with the range',
  'Texture non grasse': 'Non-greasy texture',
  "Formule concentrée dédiée au visage, la crème cible les besoins spécifiques de chaque gamme. Texture fondante et non grasse, elle s'adapte à la finesse de la peau du visage pour délivrer les actifs en profondeur et révéler l'éclat naturel.":
    'A concentrated formula dedicated to the face, the cream targets the specific needs of each range. Its melting, non-greasy texture adapts to the fineness of facial skin to deliver actives deep down and reveal natural radiance.',
  'Formule concentrée en actifs': 'Formula concentrated in actives',
  'Action ciblée sur le visage': 'Targeted action on the face',
  'Texture fondante et fine': 'Melting, fine texture',
  'Résultats visibles en 4 semaines': 'Visible results in 4 weeks',
  "Généreux et onctueux, le lait corps est le soin quotidien incontournable. Sa texture légère s'absorbe rapidement pour envelopper la peau d'une couche nourrissante et protectrice, du matin au soir. Le geste beauté qui transforme la peau en douceur.":
    'Generous and creamy, the body milk is the essential daily care. Its light texture absorbs quickly to wrap the skin in a nourishing, protective layer, from morning to night. The beauty ritual that gently transforms the skin.',
  'Texture légère et non grasse': 'Light, non-greasy texture',
  'Absorption rapide': 'Fast absorption',
  'Nutrition longue durée': 'Long-lasting nutrition',
  'Parfum délicat et naturel': 'Delicate, natural fragrance',
}

export default function TypesProduitsPage() {
  const { lang } = useLang()
  const t = useT(EN)
  const GAMMES = getGammes(lang)
  return (
    <div style={{ fontFamily: 'Outfit, system-ui, sans-serif' }}>
      <div className="bg-[#3B1705] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[#C97B1A] tracking-[0.35em] text-[10px] uppercase mb-4 flex items-center gap-3">
            <span className="w-8 h-px bg-[#C97B1A]" />
            {t("Nos Produits · Teint d'Afrique Cosmétiques")}
          </p>
          <h1 className="text-[#FAF6EF] leading-tight mb-4" style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
            {t('Types de Produits')}
          </h1>
          <p className="text-[#FAF6EF]/60 max-w-lg">
            {t('3 types de produits, déclinés dans chacune de nos 4 gammes — soit 12 références formulées pour les peaux noires, métissées et albinos.')}
          </p>
        </div>
      </div>

      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          {TYPES.map((tp, i) => (
            <div key={tp.type} className={`grid md:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'md:grid-flow-col-dense' : ''}`}>
              <div className={i % 2 === 1 ? 'md:order-2' : ''}>
                <div className="flex items-center gap-4 mb-5">
                  <span className="text-3xl text-[#C97B1A]">{tp.symbol}</span>
                  <div>
                    <h2 className="text-3xl text-[#3B1705]" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>{t(tp.type)}</h2>
                    <span className="text-[9px] tracking-[0.25em] uppercase text-[#C97B1A]">{tp.poids} {t('par flacon')}</span>
                  </div>
                </div>
                <p className="text-[#2A1006]/75 leading-relaxed text-[15px] mb-6">{t(tp.description)}</p>
                <div className="grid grid-cols-2 gap-2">
                  {tp.benefices.map(b => (
                    <div key={b} className="flex items-start gap-2 text-[12px] text-[#2A1006]/65">
                      <span className="text-[#C97B1A] mt-0.5 flex-shrink-0">✓</span>
                      {t(b)}
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap gap-2">
                  {GAMMES.map(g => (
                    <Link
                      key={g.id}
                      to={`/nos-produits/${g.id}`}
                      className="text-[10px] tracking-[0.1em] uppercase px-3 py-1.5 border hover:border-current transition-colors"
                      style={{ color: g.colorDark, borderColor: g.color + '40' }}
                    >
                      {t(tp.type)} {g.nom}
                    </Link>
                  ))}
                </div>
              </div>
              <div className={i % 2 === 1 ? 'md:order-1' : ''}>
                <div className="bg-[#FAF6EF] p-8">
                  <img src={tp.img} alt={t(tp.type)} className="w-full h-72 object-contain" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
