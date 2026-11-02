import { Link } from 'react-router'
import { getGammes } from '@/data'
import { useLang, useT } from '@/context/LanguageContext'
import Reveal from '@/components/home/Reveal'
import { ArrowRightIcon, ArrowUpRightIcon, LeafIcon, ShieldIcon, SunIcon } from '@/components/BrandIcons'
import ingredientsImg from '@/assets/hero/ingredients.webp'
import ingredientsSm from '@/assets/hero/ingredients-sm.webp'

const EN: Record<string, string> = {
  Boutique: 'Shop',
  'La boutique': 'The shop',
  "Chaque gamme possède son univers, ses actifs botaniques et ses formules exclusives. 4 produits par gamme, pensés pour les peaux noires et métissées.":
    'Each range has its own universe, botanical actives and exclusive formulas. 4 products per range, designed for black and mixed-race skin.',
  'Quatre univers, seize soins': 'Four universes, sixteen products',
  'Des rituels complets,': 'Complete rituals,',
  'pour chaque peau.': 'for every skin.',
  'Choisissez votre gamme, puis composez votre rituel en quatre gestes : nettoyer, tonifier, unifier, nourrir.':
    'Choose your range, then build your ritual in four steps: cleanse, tone, even out, nourish.',
  '4 produits': '4 products',
  Savon: 'Soap',
  Lotion: 'Lotion',
  Crème: 'Cream',
  Lait: 'Milk',
  'Découvrir la gamme': 'Discover the range',
  'Notre engagement produit': 'Our product commitment',
  '100% naturel, formules uniques,': '100% natural, unique formulas,',
  'adaptées à votre peau.': 'adapted to your skin.',
  'Pour chaque produit, nous relevons le défi de créer des formules uniques et innovantes en utilisant exclusivement des options naturelles. Chaque gamme comprend un savon (180 g), une lotion (100 ml), une crème de visage (100 ml) et un lait corps (500 ml).':
    'For each product, we take on the challenge of creating unique and innovative formulas using exclusively natural options. Each range includes a soap (180 g), a lotion (100 ml), a face cream (100 ml) and a body milk (500 ml).',
  '4 Gammes': '4 Ranges',
  'Éclat Naturel · Réparation · Hydratation · Nutrition':
    'Natural Radiance · Repair · Hydration · Nutrition',
  '16 Produits': '16 Products',
  '4 produits par gamme, formulés exclusivement': '4 products per range, exclusively formulated',
  '100% Naturel': '100% Natural',
  'Ingrédients botaniques de la plus haute qualité': 'Botanical ingredients of the highest quality',
  'Choisir ma gamme': 'Choose my range',
  'Voir les gammes': 'See the ranges',
  'Éclat Naturel': 'Natural Radiance',
  'Réparation': 'Repair',
  'Hydratation': 'Hydration',
  'Nutrition': 'Nutrition',
  Gammes: 'Ranges',
  Produits: 'Products',
  Naturel: 'Natural',
  'Qualité garantie': 'Guaranteed quality',
}

export default function NosProduitsPage() {
  const { lang } = useLang()
  const t = useT(EN)
  const GAMMES = getGammes(lang)

  return (
    <div>
      {/* ── Shop hero ── */}
      <section className="relative overflow-hidden bg-[#2A1006] text-[#FAF6EF]">
        <div className="absolute inset-0 md:hidden">
          <img src={ingredientsSm} alt="" className="h-full w-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2A1006] via-[#2A1006]/70 to-[#2A1006]/40" />
        </div>
        <div className="absolute inset-y-0 right-0 hidden w-[46%] md:block">
          <img
            src={ingredientsImg}
            srcSet={`${ingredientsSm} 900w, ${ingredientsImg} 1536w`}
            sizes="46vw"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2A1006] via-[#2A1006]/35 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-24 lg:px-16">
          <p className="flex items-center gap-3 text-[9px] uppercase tracking-[0.3em] text-[#C9971A] md:text-[10px]">
            <span className="h-px w-8 bg-[#C9971A]" />
            {t('La boutique')}
          </p>
          <h1
            className="mt-4 max-w-2xl text-[clamp(2.8rem,6vw,5rem)] leading-[0.95]"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            {t('Quatre univers, seize soins')}
          </h1>
          <p className="mt-5 max-w-xl text-[14px] leading-relaxed text-[#FAF6EF]/60 md:text-[15px]">
            {t(
              'Chaque gamme possède son univers, ses actifs botaniques et ses formules exclusives. 4 produits par gamme, pensés pour les peaux noires et métissées.'
            )}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#gammes"
              className="group inline-flex items-center gap-3 bg-[#FAF6EF] px-6 py-3.5 text-[10px] uppercase tracking-[0.2em] text-[#2A1006] transition-colors hover:bg-[#C9971A]"
            >
              {t('Voir les gammes')}
              <ArrowRightIcon size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <div className="flex items-center gap-4 text-[9px] uppercase tracking-[0.16em] text-[#FAF6EF]/45">
              <span className="flex items-center gap-1.5">
                <SunIcon size={13} className="text-[#C9971A]" /> {t('4 Gammes')}
              </span>
              <span className="h-3 w-px bg-[#FAF6EF]/15" />
              <span>{t('16 Produits')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Ranges ── */}
      <section id="gammes" className="scroll-mt-28 bg-[#FAF6EF] py-16 md:py-24">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16">
          <Reveal>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="flex items-center gap-3 text-[9px] uppercase tracking-[0.3em] text-[#A85E0F] md:text-[10px]">
                  <span className="h-px w-7 bg-[#A85E0F]" />
                  {t('La boutique')}
                </p>
                <h2
                  className="mt-4 text-[clamp(2.3rem,4.8vw,3.8rem)] leading-[0.98] text-[#2A1006]"
                  style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                >
                  {t('Des rituels complets,')}
                  <br />
                  <em className="text-[#A85E0F]">{t('pour chaque peau.')}</em>
                </h2>
              </div>
              <p className="max-w-sm text-[12px] leading-relaxed text-[#2A1006]/55 md:text-[13px]">
                {t(
                  'Choisissez votre gamme, puis composez votre rituel en quatre gestes : nettoyer, tonifier, unifier, nourrir.'
                )}
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-5 md:mt-14 md:grid-cols-2">
            {GAMMES.map((gamme, i) => (
              <Reveal key={gamme.id} delay={i * 60} className="h-full">
                <Link
                  to={`/nos-produits/${gamme.id}`}
                  className="group flex h-full flex-col overflow-hidden bg-[#FFFCF6] transition-shadow duration-300 hover:shadow-[0_30px_70px_-40px_rgba(42,16,6,0.5)]"
                >
                  <div className="h-1 w-full" style={{ background: gamme.color }} />
                  <div className="relative h-56 overflow-hidden md:h-64">
                    <img
                      src={gamme.heroImage}
                      srcSet={`${gamme.heroImageSmall} 900w, ${gamme.heroImage} 1536w`}
                      sizes="(min-width: 768px) 50vw, 100vw"
                      alt={gamme.heroAlt}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover object-[64%_28%] transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(180deg, rgba(42,16,6,0) 28%, rgba(42,16,6,0.55) 62%, rgba(42,16,6,0.92) 100%)',
                      }}
                    />
                    <span className="absolute left-5 top-4 text-[9px] uppercase tracking-[0.22em] text-[#FAF6EF]/60">
                      0{i + 1}
                    </span>
                    <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
                      <div>
                        <p
                          className="text-[30px] leading-none text-[#FAF6EF] md:text-[36px]"
                          style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                        >
                          {gamme.nom}
                        </p>
                        <p className="mt-1.5 text-[9px] uppercase tracking-[0.18em] text-[#FAF6EF]/65">
                          {gamme.ingredients}
                        </p>
                      </div>
                      <span className="mb-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-[#FAF6EF]/35 text-[#FAF6EF] transition-all duration-300 group-hover:border-[#FAF6EF] group-hover:bg-[#FAF6EF] group-hover:text-[#2A1006]">
                        <ArrowUpRightIcon size={14} />
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5 md:p-7">
                    <p
                      className="text-[17px] italic leading-snug md:text-[19px]"
                      style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: gamme.colorDark }}
                    >
                      {gamme.tagline}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {['Savon', 'Lotion', 'Crème', 'Lait'].map(type => (
                        <span
                          key={type}
                          className="border px-2.5 py-1 text-[8px] uppercase tracking-[0.12em]"
                          style={{ borderColor: `${gamme.color}55`, color: gamme.colorDark }}
                        >
                          {t(type)}
                        </span>
                      ))}
                    </div>

                    <div className="flex-1" />
                    <div
                      className="mt-5 flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] font-medium transition-all group-hover:gap-3 md:text-[10px]"
                      style={{ color: gamme.colorDark }}
                    >
                      {t('Découvrir la gamme')}
                      <ArrowRightIcon size={13} />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Promise ── */}
      <section className="bg-[#F3EADC] py-16 md:py-24">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16">
          <div className="grid gap-10 bg-[#2A1006] p-8 text-[#FAF6EF] md:grid-cols-12 md:gap-12 md:p-12 lg:p-16">
            <div className="md:col-span-7">
              <p className="flex items-center gap-3 text-[9px] uppercase tracking-[0.3em] text-[#C9971A]">
                <LeafIcon size={14} />
                {t('Notre engagement produit')}
              </p>
              <h2
                className="mt-4 text-[clamp(1.9rem,3.4vw,2.9rem)] leading-[1]"
                style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
              >
                {t('100% naturel, formules uniques,')}
                <br />
                <em className="text-[#C9971A]">{t('adaptées à votre peau.')}</em>
              </h2>
              <p className="mt-5 max-w-xl text-[13px] leading-relaxed text-[#FAF6EF]/60">
                {t(
                  'Pour chaque produit, nous relevons le défi de créer des formules uniques et innovantes en utilisant exclusivement des options naturelles. Chaque gamme comprend un savon (180 g), une lotion (100 ml), une crème de visage (100 ml) et un lait corps (500 ml).'
                )}
              </p>
            </div>
            <div className="flex flex-col justify-center gap-5 md:col-span-5">
              {[
                { n: '4', label: 'Gammes', desc: 'Éclat Naturel · Réparation · Hydratation · Nutrition' },
                { n: '16', label: 'Produits', desc: '4 produits par gamme, formulés exclusivement' },
                { n: '100%', label: 'Naturel', desc: 'Ingrédients botaniques de la plus haute qualité' },
              ].map(stat => (
                <div key={stat.label} className="flex items-start gap-5 border-l border-[#C9971A]/50 pl-5">
                  <span
                    className="min-w-[3.6rem] text-[2rem] leading-none text-[#FAF6EF] md:text-[2.4rem]"
                    style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                  >
                    {stat.n}
                  </span>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#FAF6EF]">{stat.label}</p>
                    <p className="mt-1 text-[10px] leading-snug text-[#FAF6EF]/45">{t(stat.desc)}</p>
                  </div>
                </div>
              ))}
              <div className="mt-2 flex items-center gap-2 text-[9px] uppercase tracking-[0.18em] text-[#C9971A]">
                <ShieldIcon size={13} />
                {t('Qualité garantie')}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
