import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import type { Gamme } from '@/data'
import { useT } from '@/context/LanguageContext'
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpRightIcon } from '@/components/BrandIcons'

const EN: Record<string, string> = {
  'Cosmétiques naturels · Douala, Cameroun': 'Natural cosmetics · Douala, Cameroon',
  'Découvrir la gamme': 'Discover the range',
  'Tous nos soins': 'All our care',
  '4 soins': '4 products',
  'Savon · Lotion · Crème · Lait': 'Soap · Lotion · Cream · Milk',
  'Diapositive précédente': 'Previous slide',
  'Diapositive suivante': 'Next slide',
  'Choisir la diapositive': 'Choose slide',
  'Défiler vers le bas': 'Scroll down',
  'Galerie des gammes': 'Range gallery',
}

export default function HeroSlider({ slides }: { slides: Gamme[] }) {
  const t = useT(EN)
  const [index, setIndex] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [reduced, setReduced] = useState(false)
  const touchStart = useRef<number | null>(null)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  const active = slides[index]
  const paused = hovered || focused || hidden || reduced
  const goTo = (next: number) => setIndex((next + slides.length) % slides.length)
  const goNext = () => goTo(index + 1)
  const goPrev = () => goTo(index - 1)

  return (
    <section
      aria-roledescription="carousel"
      aria-label={t('Galerie des gammes')}
      tabIndex={0}
      className="relative overflow-hidden bg-[#FAF6EF]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false)
      }}
      onKeyDown={event => {
        if (event.target instanceof Element && event.target.closest('a')) return
        if (event.key === 'ArrowRight') {
          event.preventDefault()
          goNext()
        }
        if (event.key === 'ArrowLeft') {
          event.preventDefault()
          goPrev()
        }
      }}
      onTouchStart={event => {
        touchStart.current = event.touches[0]?.clientX ?? null
      }}
      onTouchEnd={event => {
        if (touchStart.current === null) return
        const delta = (event.changedTouches[0]?.clientX ?? 0) - touchStart.current
        if (Math.abs(delta) > 50) (delta < 0 ? goNext : goPrev)()
        touchStart.current = null
      }}
    >
      {/* ── Media ── */}
      <div className="relative h-[46svh] min-h-[320px] w-full overflow-hidden md:absolute md:inset-0 md:h-full">
        {slides.map((slide, i) => (
          <img
            key={slide.id}
            src={slide.heroImage}
            srcSet={`${slide.heroImageSmall} 900w, ${slide.heroImage} 1536w`}
            sizes="100vw"
            alt={i === index ? slide.heroAlt : ''}
            aria-hidden={i === index ? undefined : true}
            loading={i === 0 ? 'eager' : 'lazy'}
            fetchPriority={i === 0 ? 'high' : 'auto'}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1100ms] ease-out ${
              i === index ? 'opacity-100' : 'opacity-0'
            } ${i === index ? 'hero-image-active' : ''}`}
            style={{ objectPosition: '66% 34%' }}
          />
        ))}

        {/* Cream veil keeps the type legible without flattening the photograph */}
        <div
          className="pointer-events-none absolute inset-0 hidden md:block"
          style={{
            background:
              'linear-gradient(90deg, #FAF6EF 0%, rgba(250,246,239,0.98) 25%, rgba(250,246,239,0.9) 40%, rgba(250,246,239,0.32) 62%, rgba(250,246,239,0) 82%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 hidden md:block"
          style={{
            background:
              'radial-gradient(90% 80% at 78% 18%, rgba(201,151,26,0.12) 0%, rgba(201,151,26,0) 55%)',
          }}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-[#FAF6EF] md:hidden" />
      </div>

      {/* ── Copy ── */}
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 pb-10 pt-7 md:flex md:h-[calc(100svh-6.5rem)] md:min-h-[660px] md:items-center md:px-10 md:py-16 lg:px-16">
        <div className="w-full md:w-[58%] lg:w-[54%]">
          <p className="flex items-center gap-3 text-[8px] uppercase tracking-[0.24em] text-[#2A1006]/50 sm:text-[9px] sm:tracking-[0.3em] md:text-[10px]">
            <span className="h-px w-8 bg-[#C9971A]" />
            {t('Cosmétiques naturels · Douala, Cameroun')}
          </p>

          <div key={index} className="hero-copy" aria-live="polite">
            <p
              className="mt-6 flex items-center gap-2.5 text-[8px] uppercase tracking-[0.18em] sm:text-[9px] sm:tracking-[0.24em] md:mt-8 md:text-[10px]"
              style={{ color: active.colorDark }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: active.color }} />
              <span className="whitespace-nowrap">
                {String(index + 1).padStart(2, '0')} — {active.nom}
              </span>
              <span className="hidden text-[#2A1006]/25 sm:inline">·</span>
              <span className="hidden text-[#2A1006]/45 sm:inline">{active.ingredients}</span>
            </p>

            <h1
              className="mt-4 text-[clamp(2.6rem,9vw,4.6rem)] leading-[0.9] text-[#2A1006] md:mt-5 md:text-[clamp(3.6rem,5.6vw,6rem)]"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              {active.heroLead}
              <br />
              <em style={{ color: active.colorDark }}>{active.heroAccent}</em>
            </h1>

            <p className="mt-5 max-w-[30rem] text-[14px] leading-relaxed text-[#2A1006]/70 md:mt-7 md:text-[16px]">
              {active.heroCopy}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3 md:mt-9">
              <Link
                to={`/nos-produits/${active.id}`}
                className="group inline-flex items-center gap-3 bg-[#2A1006] px-6 py-3.5 text-[10px] uppercase tracking-[0.22em] text-[#FAF6EF] transition-colors hover:bg-[#C9971A] md:px-7 md:py-4"
              >
                {t('Découvrir la gamme')}
                <ArrowRightIcon size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/nos-produits"
                className="inline-flex items-center gap-2 border border-[#2A1006]/25 px-5 py-3.5 text-[10px] uppercase tracking-[0.22em] text-[#2A1006] transition-colors hover:border-[#2A1006] hover:bg-[#2A1006] hover:text-[#FAF6EF] md:px-6 md:py-4"
              >
                {t('Tous nos soins')}
              </Link>
            </div>
          </div>

          {/* ── Slide controls ── */}
          <div className="mt-9 flex items-end justify-between gap-6 md:mt-14">
            <div className="flex flex-1 items-end gap-4 md:gap-6">
              {slides.map((slide, i) => {
                const isActive = i === index
                return (
                  <button
                    key={slide.id}
                    type="button"
                    aria-label={`${t('Choisir la diapositive')} ${i + 1} : ${slide.nom}`}
                    aria-current={isActive ? 'true' : undefined}
                    onClick={() => goTo(i)}
                    className="group min-w-0 flex-1 text-left md:flex-none"
                  >
                    <span className="relative block h-[2px] w-full overflow-hidden bg-[#2A1006]/15 md:w-16 lg:w-24">
                      {isActive && !reduced && (
                        <span
                          key={`${index}-${paused}`}
                          className="hero-progress absolute inset-y-0 left-0 bg-[#2A1006]"
                          style={{ animationPlayState: paused ? 'paused' : 'running' }}
                          onAnimationEnd={goNext}
                        />
                      )}
                      {isActive && reduced && <span className="absolute inset-0 bg-[#2A1006]" />}
                    </span>
                    <span className="mt-2 flex items-baseline gap-1.5 md:gap-2">
                      <span
                        className="text-[9px] tracking-[0.12em]"
                        style={{ color: isActive ? slide.colorDark : 'rgba(42,16,6,0.35)' }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span
                        className={`hidden truncate text-[9px] uppercase tracking-[0.16em] transition-colors sm:block ${
                          isActive ? 'text-[#2A1006]' : 'text-[#2A1006]/35 group-hover:text-[#2A1006]/65'
                        }`}
                      >
                        {slide.nom}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              <button
                type="button"
                onClick={goPrev}
                aria-label={t('Diapositive précédente')}
                className="flex h-10 w-10 items-center justify-center border border-[#2A1006]/20 text-[#2A1006] transition-colors hover:border-[#2A1006] hover:bg-[#2A1006] hover:text-[#FAF6EF]"
              >
                <ArrowLeftIcon size={16} />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label={t('Diapositive suivante')}
                className="flex h-10 w-10 items-center justify-center border border-[#2A1006]/20 text-[#2A1006] transition-colors hover:border-[#2A1006] hover:bg-[#2A1006] hover:text-[#FAF6EF]"
              >
                <ArrowRightIcon size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Floating product card ── */}
      <div className="absolute bottom-24 right-10 z-20 hidden w-[270px] lg:block xl:bottom-28 xl:right-16">
        <div className="border border-[#2A1006]/10 bg-[#FAF6EF]/95 p-4 shadow-[0_24px_70px_-30px_rgba(42,16,6,0.45)] backdrop-blur">
          <div className="flex items-center gap-4">
            <div
              key={active.id}
              className="hero-product-image flex h-20 w-20 flex-shrink-0 items-center justify-center"
              style={{ background: active.colorLight }}
            >
              <img
                src={active.products[2]?.image ?? active.mainImage}
                alt={`${active.nom} — ${active.ingredients}`}
                className="h-full w-full object-contain p-1.5 mix-blend-multiply"
              />
            </div>
            <div className="min-w-0">
              <p className="text-[8px] uppercase tracking-[0.24em] text-[#2A1006]/45">{t('4 soins')}</p>
              <p
                className="mt-1 text-[15px] leading-tight text-[#2A1006]"
                style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
              >
                {active.nom}
              </p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.14em]" style={{ color: active.colorDark }}>
                {t('Savon · Lotion · Crème · Lait')}
              </p>
            </div>
          </div>
          <Link
            to={`/nos-produits/${active.id}`}
            className="mt-3 flex items-center justify-between border-t border-[#2A1006]/10 pt-3 text-[9px] uppercase tracking-[0.2em] text-[#2A1006] transition-colors hover:text-[#C9971A]"
          >
            {t('Découvrir la gamme')}
            <ArrowUpRightIcon size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
