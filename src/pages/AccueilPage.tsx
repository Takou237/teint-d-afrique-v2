import { Link } from 'react-router'
import { useGammes } from '@/hooks/useGammes'
import { usePageContent } from '@/hooks/usePageContent'
import { useContentImage } from '@/hooks/useContentImage'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { useLang, useT } from '@/context/LanguageContext'
import HeroSlider from '@/components/home/HeroSlider'
import Reveal from '@/components/home/Reveal'
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  DropIcon,
  HeartIcon,
  LeafIcon,
  PinIcon,
  ShieldIcon,
  SparkleIcon,
  SunIcon,
} from '@/components/BrandIcons'
import { orderUrl, generalUrl } from '@/lib/whatsapp'
import fondatriceImg from '@/assets/fondatrice.webp'
import ingredientsImg from '@/assets/hero/ingredients.webp'
import ingredientsSm from '@/assets/hero/ingredients-sm.webp'
import savonUnifie from '@/assets/products/savon-unifie.webp'
import lotionUnifiee from '@/assets/products/lotion-unifiee.webp'
import cremeUnifiee from '@/assets/products/creme-unifiee.webp'
import laitUnifie from '@/assets/products/lait-unifie.webp'

const EN: Record<string, string> = {
  'Cosmétiques naturels · Douala, Cameroun': 'Natural cosmetics · Douala, Cameroon',
  'Découvrir la gamme': 'Discover the range',
  'Tous nos soins': 'All our care',
  '4 soins': '4 products',
  'Savon · Lotion · Crème · Lait': 'Soap · Lotion · Cream · Milk',
  'Diapositive précédente': 'Previous slide',
  'Diapositive suivante': 'Next slide',
  'Choisir la diapositive': 'Choose slide',

  '100% Naturel': '100% Natural',
  "Des formules d'origine naturelle, sans compromis.": 'Naturally derived formulas, with no compromise.',
  '100% Camerounais': '100% Cameroonian',
  'Imaginée et formulée à Douala.': 'Imagined and formulated in Douala.',
  'Pour toutes les peaux': 'For every skin',
  'Noires, métissées et albinos.': 'Black, mixed-race and albino.',
  'Qualité garantie': 'Guaranteed quality',
  'Des soins doux, testés et sûrs.': 'Gentle, tested and safe care.',

  '#AUTHENTIQUE': '#AUTHENTIC',
  '100% NATUREL': '100% NATURAL',
  '#PLURIELLE': '#PLURAL',
  'FORMULÉ EN AFRIQUE': 'MADE IN AFRICA',
  '#INCLUSIVE': '#INCLUSIVE',
  'SANS ÉCLAIRCISSEMENT': 'NO LIGHTENING',
  '#NATURELLE': '#NATURAL',
  'DOUALA · CAMEROUN': 'DOUALA · CAMEROON',

  'Nos catégories': 'Our categories',
  'Des soins pour': 'Care for',
  'chaque besoin.': 'every need.',
  'Quatre gestes, quatre textures, une même exigence : révéler votre peau sans jamais la transformer.':
    'Four gestures, four textures, one standard: reveal your skin without ever transforming it.',
  'Voir toutes les gammes': 'See all ranges',
  Savons: 'Soaps',
  Lotions: 'Lotions',
  'Crèmes de visage': 'Face creams',
  'Laits corps': 'Body milks',
  'Le premier geste': 'The first gesture',
  'Préparer et tonifier': 'Prepare and tone',
  'Concentrer les actifs': 'Concentrate the actives',
  'Nourrir en profondeur': 'Deeply nourish',
  '4 gammes': '4 ranges',
  'Découvrir': 'Discover',
  'Savon naturel Teint d’Afrique': 'Natural soap by Teint d’Afrique',
  'Lotion naturelle Teint d’Afrique': 'Natural lotion by Teint d’Afrique',
  'Crème de visage naturelle Teint d’Afrique': 'Natural face cream by Teint d’Afrique',
  'Lait corps naturel Teint d’Afrique': 'Natural body milk by Teint d’Afrique',

  'La marque': 'The brand',
  'La beauté': 'Beauty',
  'au naturel.': 'au naturel.',
  'Fondatrice & Créatrice': 'Founder & Creator',
  'Minette Kamdem-Jambong, fondatrice de Teint d’Afrique Cosmétiques':
    'Minette Kamdem-Jambong, founder of Teint d’Afrique Cosmétiques',
  'Ingrédients botaniques Teint d’Afrique : karité, curcuma, mangue, aloe vera et avocat':
    'Botanical ingredients from Teint d’Afrique: shea, turmeric, mango, aloe vera and avocado',
  "Nous croyons que chaque carnation est une beauté à part entière. Nos soins révèlent, nourrissent et célèbrent la peau noire — sans jamais chercher à l'altérer.":
    "We believe every complexion is beauty in its own right. Our care reveals, nourishes and celebrates black skin — without ever seeking to alter it.",
  'Notre histoire': 'Our story',
  'Les ingrédients': 'The ingredients',
  'Le meilleur': 'The best',
  'de la nature.': 'of nature.',
  "Aloe vera, karité, curcuma, miel, mangue… des actifs botaniques sourcés en Afrique, choisis pour leur efficacité et leur douceur.":
    'Aloe vera, shea, turmeric, honey, mango… botanical actives sourced in Africa, chosen for their efficacy and gentleness.',
  'Notre expertise': 'Our expertise',

  'Les incontournables': 'The essentials',
  'Nos soins signature': 'Our signature care',
  'Quatre formules, quatre gammes, une même promesse : des soins naturels qui révèlent votre peau.':
    'Four formulas, four ranges, one promise: natural care that reveals your skin.',
  'Tous les soins': 'All our care',
  Commander: 'Order',
  'Réponse sur WhatsApp': 'Reply on WhatsApp',
  'Voir le soin': 'See the product',

  'Le rituel': 'The ritual',
  'Quatre gestes,': 'Four gestures,',
  'une peau lumineuse.': 'luminous skin.',
  'Chaque gamme décline ce rituel en quatre soins complémentaires, du nettoyage à la nutrition.':
    'Each range translates this ritual into four complementary products, from cleansing to nutrition.',
  Nettoyer: 'Cleanse',
  Tonifier: 'Tone',
  Unifier: 'Even out',
  Nourrir: 'Nourish',
  'Le savon retire les impuretés sans agresser la peau.': 'Soap removes impurities without stripping the skin.',
  'La lotion prépare et tonifie, pour que les actifs pénètrent mieux.':
    'Lotion prepares and tones, so the actives penetrate better.',
  'La crème concentre les actifs ciblés de votre gamme.': 'Cream concentrates the targeted actives of your range.',
  'Le lait enveloppe le corps d’une nutrition durable.': 'Body milk wraps the body in lasting nutrition.',
  'Trouver mon rituel': 'Find my ritual',

  'Notre promesse': 'Our promise',
  'Une beauté qui ne se change pas.': 'Beauty that is not changed.',
  'Elle se révèle.': 'It is revealed.',
  'Nous célébrons chaque carnation dans sa beauté naturelle et singulière.':
    'We celebrate every complexion in its natural, singular beauty.',
  'Sans éclaircissement': 'No lightening',
  "Aucun actif n'altère la couleur naturelle de votre peau. Jamais.":
    'No active alters the natural colour of your skin. Ever.',
  'Formulé en Afrique': 'Formulated in Africa',
  'Des actifs botaniques sourcés localement, pensés pour nos climats.':
    'Botanical actives sourced locally, designed for our climates.',
  'Pour toutes les carnations': 'For every complexion',
  'Peaux noires, métissées et albinos, célébrées à parts égales.':
    'Black, mixed-race and albino skin, celebrated equally.',

  'Le rituel continue': 'The ritual continues',
  'Votre peau': 'Your skin',
  "vaut de l'or.": 'is worth gold.',
  'Prenez soin de vous, avec des soins pensés pour votre peau et votre climat.':
    'Take care of yourself, with care designed for your skin and your climate.',
  'Commander sur WhatsApp': 'Order on WhatsApp',
  'Découvrir les gammes': 'Discover the ranges',
}

const CATEGORIES = [
  {
    label: 'Savons',
    sub: 'Le premier geste',
    img: savonUnifie,
    alt: 'Savon naturel Teint d’Afrique',
    to: '/nos-produits/types#savon',
  },
  {
    label: 'Lotions',
    sub: 'Préparer et tonifier',
    img: lotionUnifiee,
    alt: 'Lotion naturelle Teint d’Afrique',
    to: '/nos-produits/types#lotion',
  },
  {
    label: 'Crèmes de visage',
    sub: 'Concentrer les actifs',
    img: cremeUnifiee,
    alt: 'Crème de visage naturelle Teint d’Afrique',
    to: '/nos-produits/types#creme',
  },
  {
    label: 'Laits corps',
    sub: 'Nourrir en profondeur',
    img: laitUnifie,
    alt: 'Lait corps naturel Teint d’Afrique',
    to: '/nos-produits/types#lait',
  },
]

const RITUAL = [
  {
    n: '01',
    label: 'Nettoyer',
    copy: 'Le savon retire les impuretés sans agresser la peau.',
    product: 0,
  },
  {
    n: '02',
    label: 'Tonifier',
    copy: 'La lotion prépare et tonifie, pour que les actifs pénètrent mieux.',
    product: 1,
  },
  {
    n: '03',
    label: 'Unifier',
    copy: 'La crème concentre les actifs ciblés de votre gamme.',
    product: 2,
  },
  {
    n: '04',
    label: 'Nourrir',
    copy: 'Le lait enveloppe le corps d’une nutrition durable.',
    product: 3,
  },
]

function SectionLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p
      className={`flex items-center gap-3 text-[9px] uppercase tracking-[0.32em] md:text-[10px] ${
        light ? 'text-[#C9971A]' : 'text-[#A85E0F]'
      }`}
    >
      <span className={`h-px w-7 ${light ? 'bg-[#C9971A]' : 'bg-[#A85E0F]'}`} />
      {children}
    </p>
  )
}

function DisplayHeading({
  children,
  className = '',
  light = false,
}: {
  children: React.ReactNode
  className?: string
  light?: boolean
}) {
  return (
    <h2
      className={`leading-[0.95] ${light ? 'text-[#FAF6EF]' : 'text-[#2A1006]'} ${className}`}
      style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
    >
      {children}
    </h2>
  )
}

export default function AccueilPage() {
  const { lang } = useLang()
  const t = useT(EN)
  const GAMMES = useGammes(lang)
  const settings = useSiteSettings()
  const c = usePageContent('accueil', lang, {
    categories_lead: {
      fr: 'Quatre gestes, quatre textures, une même exigence : révéler votre peau sans jamais la transformer.',
      en: 'Four gestures, four textures, one standard: reveal your skin without ever transforming it.',
    },
    brand_lead: {
      fr: "Nous croyons que chaque carnation est une beauté à part entière. Nos soins révèlent, nourrissent et célèbrent la peau noire — sans jamais chercher à l'altérer.",
      en: 'We believe every complexion is beauty in its own right. Our care reveals, nourishes and celebrates black skin — without ever seeking to alter it.',
    },
    ingredients_lead: {
      fr: 'Aloe vera, karité, curcuma, miel, mangue… des actifs botaniques sourcés en Afrique, choisis pour leur efficacité et leur douceur.',
      en: 'Aloe vera, shea, turmeric, honey, mango… botanical actives sourced in Africa, chosen for their efficacy and gentleness.',
    },
    signature_lead: {
      fr: 'Quatre formules, quatre gammes, une même promesse : des soins naturels qui révèlent votre peau.',
      en: 'Four formulas, four ranges, one promise: natural care that reveals your skin.',
    },
    ritual_lead: {
      fr: 'Chaque gamme décline ce rituel en quatre soins complémentaires, du nettoyage à la nutrition.',
      en: 'Each range translates this ritual into four complementary products, from cleansing to nutrition.',
    },
    promise_lead: {
      fr: 'Nous célébrons chaque carnation dans sa beauté naturelle et singulière.',
      en: 'We celebrate every complexion in its natural, singular beauty.',
    },
    cta_lead: {
      fr: 'Prenez soin de vous, avec des soins pensés pour votre peau et votre climat.',
      en: 'Take care of yourself, with care designed for your skin and your climate.',
    },
    marquee_1: { fr: '#AUTHENTIQUE', en: '#AUTHENTIC' },
    marquee_2: { fr: '100% NATUREL', en: '100% NATURAL' },
    marquee_3: { fr: '#PLURIELLE', en: '#PLURAL' },
    marquee_4: { fr: 'FORMULÉ EN AFRIQUE', en: 'FORMULATED IN AFRICA' },
    marquee_5: { fr: '#INCLUSIVE', en: '#INCLUSIVE' },
    marquee_6: { fr: 'SANS ÉCLAIRCISSEMENT', en: 'NO LIGHTENING' },
    marquee_7: { fr: '#NATURELLE', en: '#NATURAL' },
    marquee_8: { fr: 'DOUALA · CAMEROUN', en: 'DOUALA · CAMEROON' },
    trust_1_title: { fr: '100% Naturel', en: '100% Natural' },
    trust_1_copy: {
      fr: "Des formules d'origine naturelle, sans compromis.",
      en: 'Naturally derived formulas, with no compromise.',
    },
    trust_2_title: { fr: '100% Camerounais', en: '100% Cameroonian' },
    trust_2_copy: { fr: 'Imaginée et formulée à Douala.', en: 'Imagined and formulated in Douala.' },
    trust_3_title: { fr: 'Pour toutes les peaux', en: 'For every skin' },
    trust_3_copy: { fr: 'Noires, métissées et albinos.', en: 'Black, mixed-race and albino.' },
    trust_4_title: { fr: 'Qualité garantie', en: 'Guaranteed quality' },
    trust_4_copy: { fr: 'Des soins doux, testés et sûrs.', en: 'Gentle, tested and safe care.' },
    categories_label: { fr: 'Nos catégories', en: 'Our categories' },
    categories_title_1: { fr: 'Des soins pour', en: 'Care for' },
    categories_title_2: { fr: 'chaque besoin.', en: 'every need.' },
    categories_cta: { fr: 'Voir toutes les gammes', en: 'See all ranges' },
    categories_count: { fr: '4 gammes', en: '4 ranges' },
    brand_label: { fr: 'La marque', en: 'The brand' },
    brand_title_1: { fr: 'La beauté', en: 'Beauty' },
    brand_title_2: { fr: 'au naturel.', en: 'au naturel.' },
    brand_cta: { fr: 'Notre histoire', en: 'Our story' },
    founder_name: { fr: 'Minette Kamdem-Jambong', en: 'Minette Kamdem-Jambong' },
    founder_role: { fr: 'Fondatrice & Créatrice', en: 'Founder & Creator' },
    founder_alt: {
      fr: 'Minette Kamdem-Jambong, fondatrice de Teint d’Afrique Cosmétiques',
      en: 'Minette Kamdem-Jambong, founder of Teint d’Afrique Cosmétiques',
    },
    ingredients_label: { fr: 'Les ingrédients', en: 'The ingredients' },
    ingredients_title_1: { fr: 'Le meilleur', en: 'The best' },
    ingredients_title_2: { fr: 'de la nature.', en: 'of nature.' },
    ingredients_cta: { fr: 'Notre expertise', en: 'Our expertise' },
    ingredients_alt: {
      fr: 'Ingrédients botaniques Teint d’Afrique : karité, curcuma, mangue, aloe vera et avocat',
      en: 'Botanical ingredients from Teint d’Afrique: shea, turmeric, mango, aloe vera and avocado',
    },
    signature_label: { fr: 'Les incontournables', en: 'The essentials' },
    signature_title: { fr: 'Nos soins signature', en: 'Our signature care' },
    signature_cta: { fr: 'Tous les soins', en: 'All our care' },
    order_cta: { fr: 'Commander', en: 'Order' },
    ritual_label: { fr: 'Le rituel', en: 'The ritual' },
    ritual_title_1: { fr: 'Quatre gestes,', en: 'Four gestures,' },
    ritual_title_2: { fr: 'une peau lumineuse.', en: 'luminous skin.' },
    ritual_note: {
      fr: '4 gammes · 4 soins · Savon · Lotion · Crème · Lait',
      en: '4 ranges · 4 products · Soap · Lotion · Cream · Milk',
    },
    ritual_cta: { fr: 'Trouver mon rituel', en: 'Find my ritual' },
    promise_label: { fr: 'Notre promesse', en: 'Our promise' },
    promise_title_1: { fr: 'Une beauté qui ne se change pas.', en: 'Beauty that is not changed.' },
    promise_title_2: { fr: 'Elle se révèle.', en: 'It is revealed.' },
    promise_1_title: { fr: 'Sans éclaircissement', en: 'No lightening' },
    promise_1_copy: {
      fr: "Aucun actif n'altère la couleur naturelle de votre peau. Jamais.",
      en: 'No active alters the natural colour of your skin. Ever.',
    },
    promise_2_title: { fr: 'Formulé en Afrique', en: 'Formulated in Africa' },
    promise_2_copy: {
      fr: 'Des actifs botaniques sourcés localement, pensés pour nos climats.',
      en: 'Botanical actives sourced locally, designed for our climates.',
    },
    promise_3_title: { fr: 'Pour toutes les carnations', en: 'For every complexion' },
    promise_3_copy: {
      fr: 'Peaux noires, métissées et albinos, célébrées à parts égales.',
      en: 'Black, mixed-race and albino skin, celebrated equally.',
    },
    cta_label: { fr: 'Le rituel continue', en: 'The ritual continues' },
    cta_title_1: { fr: 'Votre peau', en: 'Your skin' },
    cta_title_2: { fr: "vaut de l'or.", en: 'is worth gold.' },
    cta_primary: { fr: 'Commander sur WhatsApp', en: 'Order on WhatsApp' },
    cta_secondary: { fr: 'Découvrir les gammes', en: 'Discover the ranges' },
  })
  const fondatriceUrl = useContentImage('accueil', lang, 'fondatrice_image', fondatriceImg)

  const spotlight = [
    { gamme: GAMMES[0], product: GAMMES[0].products[2] },
    { gamme: GAMMES[1], product: GAMMES[1].products[2] },
    { gamme: GAMMES[2], product: GAMMES[2].products[1] },
    { gamme: GAMMES[3], product: GAMMES[3].products[3] },
  ]

  const trustItems = [
    { icon: LeafIcon, title: c.trust_1_title, copy: c.trust_1_copy },
    { icon: PinIcon, title: c.trust_2_title, copy: c.trust_2_copy },
    { icon: HeartIcon, title: c.trust_3_title, copy: c.trust_3_copy },
    { icon: ShieldIcon, title: c.trust_4_title, copy: c.trust_4_copy },
  ]

  const marqueeItems = [
    c.marquee_1,
    c.marquee_2,
    c.marquee_3,
    c.marquee_4,
    c.marquee_5,
    c.marquee_6,
    c.marquee_7,
    c.marquee_8,
  ]

  const promises = [
    { icon: ShieldIcon, title: c.promise_1_title, copy: c.promise_1_copy },
    { icon: LeafIcon, title: c.promise_2_title, copy: c.promise_2_copy },
    { icon: HeartIcon, title: c.promise_3_title, copy: c.promise_3_copy },
  ]

  return (
    <div>
      <HeroSlider slides={GAMMES} />

      {/* ── Trust strip ── */}
      <section className="border-y border-[#2A1006]/10 bg-[#FFFCF6]">
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 md:px-6 lg:grid-cols-4 lg:px-10">
          {trustItems.map((item, i) => {
            const Icon = item.icon
            return (
              <div
                key={item.title}
                className={`flex items-start gap-3 px-4 py-5 sm:gap-4 sm:px-7 sm:py-8 md:border-[#2A1006]/10 ${
                  i % 2 === 1 ? 'border-l' : ''
                } ${i > 1 ? 'border-t lg:border-t-0' : ''} ${i > 0 ? 'lg:border-l' : ''}`}
              >
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-[#C9971A]/35 text-[#A85E0F] sm:h-10 sm:w-10">
                  <Icon size={18} />
                </span>
                <div className="min-w-0">
                  <p
                    className="break-words text-[14px] leading-tight text-[#2A1006] sm:text-[17px]"
                    style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                  >
                    {item.title}
                  </p>
                  <p className="mt-1.5 text-[11px] leading-snug text-[#2A1006]/55 sm:text-[12px]">
                    {item.copy}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Moving brand strip ── */}
      <div className="marquee overflow-hidden border-b border-[#2A1006]/10 bg-[#2A1006] py-3 text-[#FAF6EF]">
        <p className="sr-only">
          {marqueeItems.join(' · ')}
        </p>
        <div className="marquee-track flex w-max items-center" aria-hidden="true">
          {[0, 1].map(group => (
            <div key={group} className="flex shrink-0 items-center">
              {marqueeItems.map(item => (
                <span key={`${group}-${item}`} className="flex items-center">
                  <span className="px-5 text-[9px] uppercase tracking-[0.3em] text-[#FAF6EF]/70 md:px-8 md:text-[10px]">
                    {item}
                  </span>
                  <SparkleIcon size={10} className="text-[#C9971A]" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Categories ── */}
      <section className="bg-[#FAF6EF] py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16">
          <Reveal>
            <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
              <div>
                <SectionLabel>{c.categories_label}</SectionLabel>
                <DisplayHeading className="mt-4 text-[clamp(2.4rem,5vw,4rem)]">
                  {c.categories_title_1}
                  <br />
                  <em className="text-[#A85E0F]">{c.categories_title_2}</em>
                </DisplayHeading>
                <p className="mt-5 max-w-lg text-[14px] leading-relaxed text-[#2A1006]/60 md:text-[15px]">
                  {c.categories_lead}
                </p>
              </div>
              <Link
                to="/nos-produits/les-gammes"
                className="group inline-flex items-center gap-3 self-start border border-[#2A1006]/25 px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-[#2A1006] transition-colors hover:border-[#2A1006] hover:bg-[#2A1006] hover:text-[#FAF6EF] md:self-auto"
              >
                {c.categories_cta}
                <ArrowUpRightIcon size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </Reveal>

          <div className="mt-10 grid grid-cols-2 gap-3 md:mt-14 md:gap-5 lg:grid-cols-4">
            {CATEGORIES.map((cat, i) => (
              <Reveal key={cat.label} delay={i * 70} className="h-full">
                <Link
                  to={cat.to}
                  className="group flex h-full min-h-[250px] flex-col overflow-hidden bg-[#F2E8DA] p-4 transition-colors duration-500 hover:bg-[#EBDFCF] sm:min-h-[300px] sm:p-6 md:min-h-[360px]"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#2A1006]/40">
                      0{i + 1}
                    </span>
                    <span className="rounded-full border border-[#2A1006]/15 px-2 py-0.5 text-[8px] uppercase tracking-[0.14em] text-[#2A1006]/55">
                      {c.categories_count}
                    </span>
                  </div>

                  <div className="flex flex-1 items-center justify-center py-2">
                    <img
                      src={cat.img}
                      alt={t(cat.alt)}
                      loading="lazy"
                      className="h-32 w-auto scale-105 object-contain mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-[1.12] sm:h-40 md:h-52"
                    />
                  </div>

                  <div className="flex items-end justify-between gap-2">
                    <div>
                      <p
                        className="text-[17px] leading-tight text-[#2A1006] sm:text-[21px]"
                        style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                      >
                        {t(cat.label)}
                      </p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[#2A1006]/50">
                        {t(cat.sub)}
                      </p>
                    </div>
                    <span className="mb-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-[#2A1006]/20 text-[#2A1006] transition-all duration-300 group-hover:border-[#A85E0F] group-hover:bg-[#A85E0F] group-hover:text-[#FAF6EF]">
                      <ArrowUpRightIcon size={13} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Editorial duo ── */}
      <section className="grid lg:grid-cols-2">
        <article className="relative overflow-hidden bg-[#2A1006]">
          <div className="grid md:grid-cols-[1.05fr_0.95fr]">
            <div className="order-2 flex flex-col justify-center p-7 md:order-1 md:p-10 lg:p-12">
              <SectionLabel light>{c.brand_label}</SectionLabel>
              <DisplayHeading light className="mt-4 text-[clamp(2.4rem,4.5vw,3.8rem)]">
                {c.brand_title_1}
                <br />
                <em className="text-[#C9971A]">{c.brand_title_2}</em>
              </DisplayHeading>
              <p className="mt-5 max-w-sm text-[13px] leading-relaxed text-[#FAF6EF]/70 md:text-[14px]">
                {c.brand_lead}
              </p>
              <Link
                to="/la-marque/histoire"
                className="group mt-7 inline-flex w-fit items-center gap-3 border border-[#FAF6EF]/35 px-5 py-3 text-[9px] uppercase tracking-[0.2em] text-[#FAF6EF] transition-colors hover:border-[#C9971A] hover:bg-[#C9971A] hover:text-[#2A1006] md:text-[10px]"
              >
                {c.brand_cta}
                <ArrowRightIcon size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="relative order-1 h-72 md:order-2 md:h-auto md:min-h-[520px]">
              <img
                src={fondatriceUrl}
                alt={c.founder_alt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover object-[58%_30%] md:object-[58%_18%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2A1006] via-[#2A1006]/10 to-transparent md:bg-gradient-to-r md:from-[#2A1006] md:via-[#2A1006]/20 md:to-transparent" />
              <div className="absolute inset-x-5 bottom-5 md:inset-x-6 md:bottom-6">
                <p
                  className="text-[17px] leading-tight text-[#FAF6EF] md:text-[19px]"
                  style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                >
                  {c.founder_name}
                </p>
                <p className="mt-1 text-[8px] uppercase tracking-[0.22em] text-[#C9971A] md:text-[9px]">
                  {c.founder_role}
                </p>
              </div>
            </div>
          </div>
        </article>

        <article className="relative min-h-[440px] overflow-hidden bg-[#EFE4D3] md:min-h-[520px]">
          <img
            src={ingredientsImg}
            srcSet={`${ingredientsSm} 900w, ${ingredientsImg} 1536w`}
            sizes="(min-width: 1024px) 50vw, 100vw"
            alt={c.ingredients_alt}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-[62%_center] transition-transform duration-[1400ms] ease-out hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6EF] via-[#FAF6EF]/95 to-[#FAF6EF]/70 lg:via-[#FAF6EF]/85 lg:to-transparent" />
          <div className="relative z-10 flex min-h-[440px] flex-col justify-end p-7 md:min-h-[520px] md:p-12 lg:justify-center">
            <SectionLabel>{c.ingredients_label}</SectionLabel>
            <DisplayHeading className="mt-4 text-[clamp(2.4rem,4.5vw,3.8rem)]">
              {c.ingredients_title_1}
              <br />
              <em className="text-[#A85E0F]">{c.ingredients_title_2}</em>
            </DisplayHeading>
            <p className="mt-5 max-w-sm text-[13px] leading-relaxed text-[#2A1006]/65 md:text-[14px]">
              {c.ingredients_lead}
            </p>
            <Link
              to="/notre-expertise"
              className="group mt-7 inline-flex w-fit items-center gap-3 border border-[#2A1006]/30 px-5 py-3 text-[9px] uppercase tracking-[0.2em] text-[#2A1006] transition-colors hover:border-[#2A1006] hover:bg-[#2A1006] hover:text-[#FAF6EF] md:text-[10px]"
            >
              {c.ingredients_cta}
              <ArrowRightIcon size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </article>
      </section>

      {/* ── Signature products ── */}
      <section className="relative overflow-hidden bg-[#2A1006] py-20 text-[#FAF6EF] md:py-28">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-8 top-2 select-none text-[24vw] leading-none text-[#FAF6EF]/[0.035]"
          style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
        >
          SOINS
        </span>
        <div className="relative mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16">
          <Reveal>
            <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
              <div>
                <SectionLabel light>{c.signature_label}</SectionLabel>
                <DisplayHeading light className="mt-4 text-[clamp(2.4rem,5vw,4rem)]">
                  {c.signature_title}
                </DisplayHeading>
                <p className="mt-5 max-w-xl text-[14px] leading-relaxed text-[#FAF6EF]/55 md:text-[15px]">
                  {c.signature_lead}
                </p>
              </div>
              <Link
                to="/nos-produits/les-gammes"
                className="group inline-flex items-center gap-3 self-start border border-[#FAF6EF]/25 px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-[#FAF6EF] transition-colors hover:border-[#C9971A] hover:bg-[#C9971A] hover:text-[#2A1006] md:self-auto"
              >
                {c.signature_cta}
                <ArrowUpRightIcon size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </Reveal>

          <div className="-mx-6 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-3 md:mx-0 md:mt-14 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4">
            {spotlight.map(({ gamme, product }, i) => (
              <article
                key={`${gamme.id}-${product.type}`}
                className="group flex min-w-[80%] snap-start flex-col bg-[#FAF6EF] text-[#2A1006] sm:min-w-[55%] md:min-w-0"
              >
                <div className="h-1 w-full" style={{ background: gamme.color }} />
                <Link
                  to={`/nos-produits/${gamme.id}`}
                  className="relative flex h-52 items-center justify-center overflow-hidden px-8 pt-4 md:h-56"
                  style={{ background: gamme.colorLight }}
                  aria-label={`${product.details?.nom ?? product.type} — ${gamme.nom}`}
                >
                  <img
                    src={product.image}
                    alt={`${product.details?.nom ?? product.type} — ${gamme.nom}`}
                    loading="lazy"
                    className="h-full w-auto object-contain mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  />
                  <span className="absolute right-3 top-3 text-[9px] uppercase tracking-[0.18em]" style={{ color: gamme.colorDark }}>
                    0{i + 1}
                  </span>
                </Link>

                <div className="flex flex-1 flex-col p-5 md:p-6">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: gamme.color }} />
                    <p className="text-[9px] uppercase tracking-[0.18em]" style={{ color: gamme.colorDark }}>
                      {gamme.nom}
                    </p>
                  </div>
                  <Link to={`/nos-produits/${gamme.id}`} className="mt-2 block">
                    <h3
                      className="text-[20px] leading-tight text-[#2A1006] transition-colors group-hover:text-[#A85E0F] md:text-[22px]"
                      style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                    >
                      {product.details?.nom ?? product.type}
                    </h3>
                  </Link>
                  <p className="mt-1.5 text-[11px] uppercase tracking-[0.12em] text-[#2A1006]/45">
                    {product.type} · {product.poids}
                  </p>

                  <div className="flex-1" />
                  <a
                    href={orderUrl(lang, { type: product.type, poids: product.poids }, gamme, settings.whatsapp_number)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 flex items-center justify-between border border-[#2A1006]/20 px-4 py-3 text-[9px] uppercase tracking-[0.18em] text-[#2A1006] transition-colors hover:border-[#2A1006] hover:bg-[#2A1006] hover:text-[#FAF6EF]"
                  >
                    {c.order_cta}
                    <span className="flex items-center gap-1 text-[8px] tracking-[0.08em] text-[#2A1006]/40">
                      WhatsApp
                      <ArrowUpRightIcon size={12} />
                    </span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ritual ── */}
      <section className="bg-[#FAF6EF] py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16">
          <Reveal>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <SectionLabel>{c.ritual_label}</SectionLabel>
                <DisplayHeading className="mt-4 text-[clamp(2.4rem,5vw,4rem)]">
                  {c.ritual_title_1}
                  <br />
                  <em className="text-[#A85E0F]">{c.ritual_title_2}</em>
                </DisplayHeading>
              </div>
              <p className="max-w-sm text-[13px] leading-relaxed text-[#2A1006]/60 md:text-[14px]">
                {c.ritual_lead}
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 md:mt-14 md:grid-cols-4 md:gap-6">
            {RITUAL.map((step, i) => {
              const product = GAMMES[0].products[step.product]
              return (
                <Reveal key={step.n} delay={i * 70}>
                  <div className="group border-t border-[#2A1006]/15 pt-5 transition-colors hover:border-[#A85E0F]">
                    <div className="flex items-start justify-between">
                      <span
                        className="text-[28px] leading-none text-[#A85E0F]/35 transition-colors group-hover:text-[#A85E0F] md:text-[34px]"
                        style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                      >
                        {step.n}
                      </span>
                      <div
                        className="flex h-20 w-20 items-center justify-center rounded-full md:h-24 md:w-24"
                        style={{ background: GAMMES[0].colorLight }}
                      >
                        <img
                          src={product.image}
                          alt={`${product.type} — ${GAMMES[0].nom}`}
                          loading="lazy"
                          className="h-full w-full scale-110 object-contain p-2 mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.16]"
                        />
                      </div>
                    </div>
                    <p
                      className="mt-4 text-[19px] leading-tight text-[#2A1006] md:text-[22px]"
                      style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                    >
                      {t(step.label)}
                    </p>
                    <p className="mt-2 text-[11px] leading-relaxed text-[#2A1006]/55 md:text-[12px]">
                      {t(step.copy)}
                    </p>
                    <p className="mt-2 text-[9px] uppercase tracking-[0.14em] text-[#2A1006]/35">
                      {product.poids}
                    </p>
                  </div>
                </Reveal>
              )
            })}
          </div>

          <Reveal>
            <div className="mt-10 flex flex-col items-start gap-4 border-t border-[#2A1006]/10 pt-7 sm:flex-row sm:items-center sm:justify-between md:mt-14">
              <p className="flex items-center gap-2.5 text-[11px] text-[#2A1006]/50">
                <DropIcon size={15} className="text-[#A85E0F]" />
                {c.ritual_note}
              </p>
              <Link
                to="/nos-produits/vos-besoins"
                className="group inline-flex items-center gap-3 bg-[#2A1006] px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-[#FAF6EF] transition-colors hover:bg-[#A85E0F]"
              >
                {c.ritual_cta}
                <ArrowRightIcon size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Promise ── */}
      <section className="relative overflow-hidden bg-[#2A1006] py-20 text-[#FAF6EF] md:py-28">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              'radial-gradient(70% 60% at 78% 0%, rgba(201,151,26,0.16) 0%, rgba(201,151,26,0) 60%)',
          }}
        />
        <div className="relative mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16">
          <Reveal>
            <div className="max-w-2xl">
              <SectionLabel light>{c.promise_label}</SectionLabel>
              <DisplayHeading light className="mt-4 text-[clamp(2.4rem,5vw,4rem)]">
                {c.promise_title_1}
                <br />
                <em className="text-[#C9971A]">{c.promise_title_2}</em>
              </DisplayHeading>
              <p className="mt-5 text-[14px] leading-relaxed text-[#FAF6EF]/55">
                « {c.promise_lead} »
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-4 md:mt-14 md:grid-cols-3 md:gap-5">
            {promises.map((item, i) => {
              const Icon = item.icon
              return (
                <Reveal key={item.title} delay={i * 70} className="h-full">
                  <div className="h-full border border-[#FAF6EF]/20 bg-[#FAF6EF]/[0.06] p-6 transition-colors hover:border-[#C9971A]/60 md:p-8">
                    <div className="flex items-center justify-between">
                      <Icon size={24} className="text-[#C9971A]" />
                      <span className="text-[9px] uppercase tracking-[0.2em] text-[#FAF6EF]/35">0{i + 1}</span>
                    </div>
                    <h3
                      className="mt-7 text-[21px] leading-tight text-[#FAF6EF] md:text-[23px]"
                      style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                    >
                      {item.title}
                    </h3>
                    <p className="mt-3 text-[12px] leading-relaxed text-[#FAF6EF]/60">{item.copy}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <section className="relative min-h-[440px] overflow-hidden md:min-h-[540px]">
        <img
          src={ingredientsImg}
          srcSet={`${ingredientsSm} 900w, ${ingredientsImg} 1536w`}
          sizes="100vw"
          alt=""
          loading="lazy"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#2A1006]/65" />
        <div className="relative z-10 mx-auto flex min-h-[440px] max-w-3xl flex-col items-center justify-center px-6 py-20 text-center md:min-h-[540px]">
          <p className="flex items-center gap-3 text-[9px] uppercase tracking-[0.3em] text-[#E7C783] md:text-[10px]">
            <SunIcon size={14} />
            {c.cta_label}
          </p>
          <h2
            className="mt-5 text-[clamp(2.5rem,7vw,5.6rem)] leading-[0.92] text-[#FAF6EF]"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            {c.cta_title_1}
            <br />
            <em className="text-[#E7C783]">{c.cta_title_2}</em>
          </h2>
          <p className="mt-5 max-w-md text-[13px] leading-relaxed text-[#FAF6EF]/70 md:text-[15px]">
            {c.cta_lead}
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <a
              href={generalUrl(lang, settings.whatsapp_number)}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 bg-[#FAF6EF] px-6 py-3.5 text-[10px] uppercase tracking-[0.2em] text-[#2A1006] transition-colors hover:bg-[#C9971A] md:px-7 md:py-4"
            >
              {c.cta_primary}
              <ArrowUpRightIcon size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <Link
              to="/nos-produits/les-gammes"
              className="inline-flex items-center gap-2 border border-[#FAF6EF]/35 px-5 py-3.5 text-[10px] uppercase tracking-[0.2em] text-[#FAF6EF] transition-colors hover:border-[#FAF6EF] hover:bg-[#FAF6EF]/10 md:px-6 md:py-4"
            >
              {c.cta_secondary}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
