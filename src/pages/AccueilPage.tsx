import { Link } from 'react-router'
import { getGammes } from '@/data'
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
  const GAMMES = getGammes(lang)

  const spotlight = [
    { gamme: GAMMES[0], product: GAMMES[0].products[2] },
    { gamme: GAMMES[1], product: GAMMES[1].products[2] },
    { gamme: GAMMES[2], product: GAMMES[2].products[1] },
    { gamme: GAMMES[3], product: GAMMES[3].products[3] },
  ]

  const trustItems = [
    {
      icon: LeafIcon,
      title: '100% Naturel',
      copy: "Des formules d'origine naturelle, sans compromis.",
    },
    {
      icon: PinIcon,
      title: '100% Camerounais',
      copy: 'Imaginée et formulée à Douala.',
    },
    {
      icon: HeartIcon,
      title: 'Pour toutes les peaux',
      copy: 'Noires, métissées et albinos.',
    },
    {
      icon: ShieldIcon,
      title: 'Qualité garantie',
      copy: 'Des soins doux, testés et sûrs.',
    },
  ]

  const marqueeItems = [
    '#AUTHENTIQUE',
    '100% NATUREL',
    '#PLURIELLE',
    'FORMULÉ EN AFRIQUE',
    '#INCLUSIVE',
    'SANS ÉCLAIRCISSEMENT',
    '#NATURELLE',
    'DOUALA · CAMEROUN',
  ]

  const promises = [
    {
      icon: ShieldIcon,
      title: 'Sans éclaircissement',
      copy: "Aucun actif n'altère la couleur naturelle de votre peau. Jamais.",
    },
    {
      icon: LeafIcon,
      title: 'Formulé en Afrique',
      copy: 'Des actifs botaniques sourcés localement, pensés pour nos climats.',
    },
    {
      icon: HeartIcon,
      title: 'Pour toutes les carnations',
      copy: 'Peaux noires, métissées et albinos, célébrées à parts égales.',
    },
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
                    {t(item.title)}
                  </p>
                  <p className="mt-1.5 text-[11px] leading-snug text-[#2A1006]/55 sm:text-[12px]">
                    {t(item.copy)}
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
          {t('#AUTHENTIQUE')} · {t('100% NATUREL')} · {t('#PLURIELLE')} · {t('FORMULÉ EN AFRIQUE')}
        </p>
        <div className="marquee-track flex w-max items-center" aria-hidden="true">
          {[0, 1].map(group => (
            <div key={group} className="flex shrink-0 items-center">
              {marqueeItems.map(item => (
                <span key={`${group}-${item}`} className="flex items-center">
                  <span className="px-5 text-[9px] uppercase tracking-[0.3em] text-[#FAF6EF]/70 md:px-8 md:text-[10px]">
                    {t(item)}
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
                <SectionLabel>{t('Nos catégories')}</SectionLabel>
                <DisplayHeading className="mt-4 text-[clamp(2.4rem,5vw,4rem)]">
                  {t('Des soins pour')}
                  <br />
                  <em className="text-[#A85E0F]">{t('chaque besoin.')}</em>
                </DisplayHeading>
                <p className="mt-5 max-w-lg text-[14px] leading-relaxed text-[#2A1006]/60 md:text-[15px]">
                  {t(
                    'Quatre gestes, quatre textures, une même exigence : révéler votre peau sans jamais la transformer.'
                  )}
                </p>
              </div>
              <Link
                to="/nos-produits/les-gammes"
                className="group inline-flex items-center gap-3 self-start border border-[#2A1006]/25 px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-[#2A1006] transition-colors hover:border-[#2A1006] hover:bg-[#2A1006] hover:text-[#FAF6EF] md:self-auto"
              >
                {t('Voir toutes les gammes')}
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
                      {t('4 gammes')}
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
              <SectionLabel light>{t('La marque')}</SectionLabel>
              <DisplayHeading light className="mt-4 text-[clamp(2.4rem,4.5vw,3.8rem)]">
                {t('La beauté')}
                <br />
                <em className="text-[#C9971A]">{t('au naturel.')}</em>
              </DisplayHeading>
              <p className="mt-5 max-w-sm text-[13px] leading-relaxed text-[#FAF6EF]/70 md:text-[14px]">
                {t(
                  "Nous croyons que chaque carnation est une beauté à part entière. Nos soins révèlent, nourrissent et célèbrent la peau noire — sans jamais chercher à l'altérer."
                )}
              </p>
              <Link
                to="/la-marque/histoire"
                className="group mt-7 inline-flex w-fit items-center gap-3 border border-[#FAF6EF]/35 px-5 py-3 text-[9px] uppercase tracking-[0.2em] text-[#FAF6EF] transition-colors hover:border-[#C9971A] hover:bg-[#C9971A] hover:text-[#2A1006] md:text-[10px]"
              >
                {t('Notre histoire')}
                <ArrowRightIcon size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="relative order-1 h-72 md:order-2 md:h-auto md:min-h-[520px]">
              <img
                src={fondatriceImg}
                alt={t('Minette Kamdem-Jambong, fondatrice de Teint d’Afrique Cosmétiques')}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover object-[58%_30%] md:object-[58%_18%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2A1006] via-[#2A1006]/10 to-transparent md:bg-gradient-to-r md:from-[#2A1006] md:via-[#2A1006]/20 md:to-transparent" />
              <div className="absolute inset-x-5 bottom-5 md:inset-x-6 md:bottom-6">
                <p
                  className="text-[17px] leading-tight text-[#FAF6EF] md:text-[19px]"
                  style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                >
                  Minette Kamdem-Jambong
                </p>
                <p className="mt-1 text-[8px] uppercase tracking-[0.22em] text-[#C9971A] md:text-[9px]">
                  {t('Fondatrice & Créatrice')}
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
            alt={t('Ingrédients botaniques Teint d’Afrique : karité, curcuma, mangue, aloe vera et avocat')}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-[62%_center] transition-transform duration-[1400ms] ease-out hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6EF] via-[#FAF6EF]/95 to-[#FAF6EF]/70 lg:via-[#FAF6EF]/85 lg:to-transparent" />
          <div className="relative z-10 flex min-h-[440px] flex-col justify-end p-7 md:min-h-[520px] md:p-12 lg:justify-center">
            <SectionLabel>{t('Les ingrédients')}</SectionLabel>
            <DisplayHeading className="mt-4 text-[clamp(2.4rem,4.5vw,3.8rem)]">
              {t('Le meilleur')}
              <br />
              <em className="text-[#A85E0F]">{t('de la nature.')}</em>
            </DisplayHeading>
            <p className="mt-5 max-w-sm text-[13px] leading-relaxed text-[#2A1006]/65 md:text-[14px]">
              {t(
                'Aloe vera, karité, curcuma, miel, mangue… des actifs botaniques sourcés en Afrique, choisis pour leur efficacité et leur douceur.'
              )}
            </p>
            <Link
              to="/notre-expertise"
              className="group mt-7 inline-flex w-fit items-center gap-3 border border-[#2A1006]/30 px-5 py-3 text-[9px] uppercase tracking-[0.2em] text-[#2A1006] transition-colors hover:border-[#2A1006] hover:bg-[#2A1006] hover:text-[#FAF6EF] md:text-[10px]"
            >
              {t('Notre expertise')}
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
                <SectionLabel light>{t('Les incontournables')}</SectionLabel>
                <DisplayHeading light className="mt-4 text-[clamp(2.4rem,5vw,4rem)]">
                  {t('Nos soins signature')}
                </DisplayHeading>
                <p className="mt-5 max-w-xl text-[14px] leading-relaxed text-[#FAF6EF]/55 md:text-[15px]">
                  {t(
                    'Quatre formules, quatre gammes, une même promesse : des soins naturels qui révèlent votre peau.'
                  )}
                </p>
              </div>
              <Link
                to="/nos-produits/les-gammes"
                className="group inline-flex items-center gap-3 self-start border border-[#FAF6EF]/25 px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-[#FAF6EF] transition-colors hover:border-[#C9971A] hover:bg-[#C9971A] hover:text-[#2A1006] md:self-auto"
              >
                {t('Tous les soins')}
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
                    href={orderUrl(lang, { type: product.type, poids: product.poids }, gamme)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 flex items-center justify-between border border-[#2A1006]/20 px-4 py-3 text-[9px] uppercase tracking-[0.18em] text-[#2A1006] transition-colors hover:border-[#2A1006] hover:bg-[#2A1006] hover:text-[#FAF6EF]"
                  >
                    {t('Commander')}
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
                <SectionLabel>{t('Le rituel')}</SectionLabel>
                <DisplayHeading className="mt-4 text-[clamp(2.4rem,5vw,4rem)]">
                  {t('Quatre gestes,')}
                  <br />
                  <em className="text-[#A85E0F]">{t('une peau lumineuse.')}</em>
                </DisplayHeading>
              </div>
              <p className="max-w-sm text-[13px] leading-relaxed text-[#2A1006]/60 md:text-[14px]">
                {t(
                  'Chaque gamme décline ce rituel en quatre soins complémentaires, du nettoyage à la nutrition.'
                )}
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
                {t('4 gammes')} · {t('4 soins')} · {t('Savon · Lotion · Crème · Lait')}
              </p>
              <Link
                to="/nos-produits/vos-besoins"
                className="group inline-flex items-center gap-3 bg-[#2A1006] px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-[#FAF6EF] transition-colors hover:bg-[#A85E0F]"
              >
                {t('Trouver mon rituel')}
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
              <SectionLabel light>{t('Notre promesse')}</SectionLabel>
              <DisplayHeading light className="mt-4 text-[clamp(2.4rem,5vw,4rem)]">
                {t('Une beauté qui ne se change pas.')}
                <br />
                <em className="text-[#C9971A]">{t('Elle se révèle.')}</em>
              </DisplayHeading>
              <p className="mt-5 text-[14px] leading-relaxed text-[#FAF6EF]/55">
                « {t('Nous célébrons chaque carnation dans sa beauté naturelle et singulière.')} »
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
                      {t(item.title)}
                    </h3>
                    <p className="mt-3 text-[12px] leading-relaxed text-[#FAF6EF]/60">{t(item.copy)}</p>
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
            {t('Le rituel continue')}
          </p>
          <h2
            className="mt-5 text-[clamp(2.5rem,7vw,5.6rem)] leading-[0.92] text-[#FAF6EF]"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            {t('Votre peau')}
            <br />
            <em className="text-[#E7C783]">{t("vaut de l'or.")}</em>
          </h2>
          <p className="mt-5 max-w-md text-[13px] leading-relaxed text-[#FAF6EF]/70 md:text-[15px]">
            {t('Prenez soin de vous, avec des soins pensés pour votre peau et votre climat.')}
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <a
              href={generalUrl(lang)}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 bg-[#FAF6EF] px-6 py-3.5 text-[10px] uppercase tracking-[0.2em] text-[#2A1006] transition-colors hover:bg-[#C9971A] md:px-7 md:py-4"
            >
              {t('Commander sur WhatsApp')}
              <ArrowUpRightIcon size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <Link
              to="/nos-produits/les-gammes"
              className="inline-flex items-center gap-2 border border-[#FAF6EF]/35 px-5 py-3.5 text-[10px] uppercase tracking-[0.2em] text-[#FAF6EF] transition-colors hover:border-[#FAF6EF] hover:bg-[#FAF6EF]/10 md:px-6 md:py-4"
            >
              {t('Découvrir les gammes')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
