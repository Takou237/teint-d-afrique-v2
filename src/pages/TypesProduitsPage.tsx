import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import ingredientsImg from '@/assets/hero/ingredients.webp'
import ingredientsSm from '@/assets/hero/ingredients-sm.webp'
import { useGammes } from '@/hooks/useGammes'
import { usePageContent } from '@/hooks/usePageContent'
import { useContentImage } from '@/hooks/useContentImage'
import { useLang, useT } from '@/context/LanguageContext'
import lotionUnifiee from '@/assets/products/lotion-unifiee.webp'
import lotionReparee from '@/assets/products/lotion-reparee.webp'
import lotionHydratee from '@/assets/products/lotion-hydratee.webp'
import lotionNourrie from '@/assets/products/lotion-nourrie.webp'
import cremeUnifiee from '@/assets/products/creme-unifiee.webp'
import cremeReparee from '@/assets/products/creme-reparee.webp'
import cremeHydratee from '@/assets/products/creme-hydratee.webp'
import cremeNourrie from '@/assets/products/creme-nourrie.webp'
import laitUnifie from '@/assets/products/lait-unifie.webp'
import laitRepare from '@/assets/products/lait-repare.webp'
import laitHydrate from '@/assets/products/lait-hydrate.webp'
import laitNourri from '@/assets/products/lait-nourri.webp'
import savonUnifie from '@/assets/products/savon-unifie.webp'
import savonRepare from '@/assets/products/savon-repare.webp'
import savonHydrate from '@/assets/products/savon-hydrate.webp'
import savonNourri from '@/assets/products/savon-nourri.webp'

interface Slide {
  img: string
  label: string
}

interface TypeItem {
  id: string
  type: string
  poids: string
  symbol: string
  description: string
  benefices: string[]
  slides: Slide[]
}

const TYPES: TypeItem[] = [
  {
    id: 'savon',
    type: 'Savon',
    poids: '180 g',
    symbol: '◼',
    description: "Premier geste de soin, le savon nettoie en douceur tout en déposant les actifs botaniques de chaque gamme sur la peau. Formulé sans agents agressifs, il respecte le film hydrolipidique naturel et prépare la peau à absorber les soins suivants.",
    benefices: ['Nettoyage doux et profond', 'Dépôt des actifs naturels', 'Respect du pH de la peau', 'Adapté à toutes les carnations'],
    slides: [
      { img: savonUnifie, label: 'Peau Unifiée' },
      { img: savonRepare, label: 'Peau Réparée' },
      { img: savonHydrate, label: 'Peau Hydratée' },
      { img: savonNourri, label: 'Peau Nourrie' },
    ],
  },
  {
    id: 'lotion',
    type: 'Lotion',
    poids: '100 ml',
    symbol: '◻',
    description: "Légère et pénétrante, la lotion prépare et tonifie la peau, renforce l'hydratation et maximise l'efficacité des soins suivants. À utiliser matin et soir pour une synergie optimale avec les autres produits de la gamme.",
    benefices: ["Tonification et préparation de la peau", "Hydratation légère de 12h", 'Synergie avec la gamme', 'Texture non grasse'],
    slides: [
      { img: lotionUnifiee, label: 'Peau Unifiée' },
      { img: lotionReparee, label: 'Peau Réparée' },
      { img: lotionHydratee, label: 'Peau Hydratée' },
      { img: lotionNourrie, label: 'Peau Nourrie' },
    ],
  },
  {
    id: 'creme',
    type: 'Crème de Visage',
    poids: '100 ml',
    symbol: '◇',
    description: "Formule concentrée dédiée au visage, la crème cible les besoins spécifiques de chaque gamme. Texture fondante et non grasse, elle s'adapte à la finesse de la peau du visage pour délivrer les actifs en profondeur et révéler l'éclat naturel.",
    benefices: ['Formule concentrée en actifs', 'Action ciblée sur le visage', 'Texture fondante et fine', 'Résultats visibles en 4 semaines'],
    slides: [
      { img: cremeUnifiee, label: 'Peau Unifiée' },
      { img: cremeReparee, label: 'Peau Réparée' },
      { img: cremeHydratee, label: 'Peau Hydratée' },
      { img: cremeNourrie, label: 'Peau Nourrie' },
    ],
  },
  {
    id: 'lait',
    type: 'Lait Corps',
    poids: '500 ml',
    symbol: '○',
    description: "Généreux et onctueux, le lait corps est le soin quotidien incontournable. Sa texture légère s'absorbe rapidement pour envelopper la peau d'une couche nourrissante et protectrice, du matin au soir. Le geste beauté qui transforme la peau en douceur.",
    benefices: ['Texture légère et non grasse', 'Absorption rapide', 'Nutrition longue durée', 'Parfum délicat et naturel'],
    slides: [
      { img: laitUnifie, label: 'Peau Unifiée' },
      { img: laitRepare, label: 'Peau Réparée' },
      { img: laitHydrate, label: 'Peau Hydratée' },
      { img: laitNourri, label: 'Peau Nourrie' },
    ],
  },
]

const EN: Record<string, string> = {
  "Nos Produits · Teint d'Afrique Cosmétiques": "Our Products · Teint d'Afrique Cosmétiques",
  'Types de Produits': 'Product Types',
  '4 types de produits, déclinés dans chacune de nos 4 gammes — soit 16 références formulées pour les peaux noires, métissées et albinos.':
    '4 product types, available in each of our 4 ranges — 16 references formulated for black, mixed-race and albino skin.',
  Savon: 'Soap',
  "Premier geste de soin, le savon nettoie en douceur tout en déposant les actifs botaniques de chaque gamme sur la peau. Formulé sans agents agressifs, il respecte le film hydrolipidique naturel et prépare la peau à absorber les soins suivants.":
    'The first step of your routine, the soap gently cleanses while depositing the botanical actives of each range onto the skin. Formulated without harsh agents, it respects the natural hydrolipidic film and prepares the skin to absorb the following care.',
  'Nettoyage doux et profond': 'Gentle, deep cleansing',
  'Dépôt des actifs naturels': 'Deposits natural actives',
  'Respect du pH de la peau': "Respects the skin's pH",
  'Adapté à toutes les carnations': 'Suitable for all complexions',
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
  'Peau Unifiée': 'Unified Skin',
  'Peau Réparée': 'Repaired Skin',
  'Peau Hydratée': 'Hydrated Skin',
  'Peau Nourrie': 'Nourished Skin',
}

function TypeRow({ item, reverse }: { item: TypeItem; reverse: boolean }) {
  const { lang } = useLang()
  const t = useT(EN)
  const GAMMES = useGammes(lang)
  const [slide, setSlide] = useState(0)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => {
      setSlide(s => (s + 1) % item.slides.length)
    }, 4500)
    return () => clearInterval(id)
  }, [item.slides.length, reduced])

  const current = item.slides[slide]

  return (
    <div className={`grid md:grid-cols-2 gap-12 items-center ${reverse ? 'md:grid-flow-col-dense' : ''}`}>
      <div className={reverse ? 'md:order-2' : ''}>
        <div className="flex items-center gap-4 mb-5">
          <span className="text-3xl text-[#A85E0F]">{item.symbol}</span>
          <div>
            <h2 className="text-3xl text-[#2A1006]" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
              {t(item.type)}{' '}
              <span className="text-[#A85E0F]">| {t(current.label)}</span>
            </h2>
            <span className="text-[9px] tracking-[0.25em] uppercase text-[#A85E0F]">{item.poids} {t('par flacon')}</span>
          </div>
        </div>
        <p className="text-[#2A1006]/75 leading-relaxed text-[15px] mb-6">{t(item.description)}</p>
        <div className="grid grid-cols-2 gap-2">
          {item.benefices.map(b => (
            <div key={b} className="flex items-start gap-2 text-[12px] text-[#2A1006]/65">
              <span className="text-[#A85E0F] mt-0.5 flex-shrink-0">✓</span>
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
              {t(item.type)} {g.nom}
            </Link>
          ))}
        </div>
      </div>
      <div className={reverse ? 'md:order-1' : ''}>
        <div className="bg-[#FAF6EF] p-8">
          <div className="relative h-72 overflow-hidden">
            <div
              className="flex h-full transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${slide * 100}%)` }}
            >
              {item.slides.map(s => (
                <div key={s.img} className="w-full h-full flex-shrink-0 flex items-center justify-center">
                  <img
                    src={s.img}
                    alt={`${t(item.type)} — ${t(s.label)}`}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain mix-blend-multiply"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-5">
            {item.slides.map((s, i) => (
              <button
                key={s.img}
                type="button"
                onClick={() => setSlide(i)}
                aria-label={t(s.label)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === slide ? 'w-7 bg-[#A85E0F]' : 'w-1.5 bg-[#2A1006]/20 hover:bg-[#2A1006]/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TypesProduitsPage() {
  const { lang } = useLang()
  const t = useT(EN)
  const c = usePageContent('types', lang, {
    title: { fr: 'Types de Produits', en: 'Product Types' },
    lead: {
      fr: '4 types de produits, déclinés dans chacune de nos 4 gammes — soit 16 références formulées pour les peaux noires, métissées et albinos.',
      en: '4 product types, available in each of our 4 ranges — 16 references formulated for black, mixed-race and albino skin.',
    },
  })
  const heroImage = useContentImage('types', lang, 'image', ingredientsImg)
  return (
    <div style={{ fontFamily: 'Outfit, system-ui, sans-serif' }}>
      <section className="relative overflow-hidden bg-[#2A1006] text-[#FAF6EF]">
        <div className="absolute inset-0 md:hidden">
          <img src={ingredientsSm} alt="" className="h-full w-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2A1006] via-[#2A1006]/70 to-[#2A1006]/40" />
        </div>
        <div className="absolute inset-y-0 right-0 hidden w-[46%] md:block">
          <img
            src={heroImage}
            srcSet={`${ingredientsSm} 900w, ${ingredientsImg} 1536w`}
            sizes="46vw"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2A1006] via-[#2A1006]/40 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-24 lg:px-16">
          <p className="flex items-center gap-3 text-[9px] uppercase tracking-[0.3em] text-[#C9971A] md:text-[10px]">
            <span className="h-px w-8 bg-[#C9971A]" />
            {t("Nos Produits · Teint d'Afrique Cosmétiques")}
          </p>
          <h1
            className="mt-4 max-w-2xl text-[clamp(2.8rem,6vw,5rem)] leading-[0.95]"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            {c.title}
          </h1>
          <p className="mt-5 max-w-xl text-[14px] leading-relaxed text-[#FAF6EF]/60 md:text-[15px]">
            {c.lead}
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {TYPES.map(tp => (
              <a
                key={tp.id}
                href={`#${tp.id}`}
                className="border border-[#FAF6EF]/25 px-4 py-2 text-[9px] uppercase tracking-[0.18em] text-[#FAF6EF]/75 transition-colors hover:border-[#C9971A] hover:bg-[#C9971A] hover:text-[#2A1006]"
              >
                {t(tp.type)}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] space-y-16 px-6 md:px-10 lg:px-16">
          {TYPES.map((tp, i) => (
            <div key={tp.type} id={tp.id} className="scroll-mt-28">
              <TypeRow item={tp} reverse={i % 2 === 1} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
