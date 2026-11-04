import { useLang, useT } from '@/context/LanguageContext'
import { usePageContent } from '@/hooks/usePageContent'
import { useContentImage } from '@/hooks/useContentImage'
import fondatriceImg from '@/assets/fondatrice.webp'

const EN: Record<string, string> = {
  'Notre Fondatrice': 'Our Founder',
  "Minette Kamdem-Jambong, fondatrice de Teint d'Afrique Cosmétiques":
    "Minette Kamdem-Jambong, founder of Teint d'Afrique Cosmétiques",
  'Fondatrice & Créatrice — #TeintdAfriqueCosmetiques':
    'Founder & Creator — #TeintdAfriqueCosmetiques',
  'Créatrice de la marque ': 'Creator of the brand ',
  ', épouse et mère, ': ', wife and mother, ',
  " est une Femme Camerounaise qui rêve de restaurer l'identité et l'image de la femme africaine en s'impliquant activement sur les sujets tels que l'Acceptation de soi, la Dignité africaine et la Diversité Culturelle.":
    " is a Cameroonian woman who dreams of restoring the identity and image of African women by actively engaging on subjects such as self-acceptance, African dignity and cultural diversity.",
  "Femme de caractère, fervente défenseur de la peau noire et farouche opposante à la dénaturation de la peau noire, Minette est, avant tout, une femme dévouée qui déborde d'ambition pour la génération féminine actuelle et celles à venir.":
    "A woman of character, a fervent defender of black skin and a fierce opponent of its alteration, Minette is above all a devoted woman overflowing with ambition for today's generation of women and those to come.",
  "Diplômée de l'École Supérieure de Commerce de Paris (ISC Paris Business School) où elle a obtenu un Master avant de décrocher un MBA en Stratégie digitale à l'Institut Européen du Digital, Minette a appris la cosmétologie sur le terrain, au contact de ses clientes. Elle s'entoure aujourd'hui de consultants chimistes pour élaborer ses formules.":
    "A graduate of the École Supérieure de Commerce de Paris (ISC Paris Business School), where she earned a Master's degree before obtaining an MBA in Digital Strategy from the Institut Européen du Digital, Minette learned cosmetology in the field, working directly with her clients. Today she surrounds herself with chemist consultants to develop her formulas.",
  "Aujourd'hui, à travers ": 'Today, through ',
  ", elle souhaite cristalliser son ambition, son rêve. Un rêve né d'un constat, mieux d'une frustration. Car elle a constaté que bon nombre de produits cosmétiques existants et destinés à la peau noire conduisent à l'éclaircissement forcé de celle-ci et par ricochet, à sa dégradation.":
    ', she wants to crystallise her ambition, her dream. A dream born from an observation — or rather a frustration. For she noticed that many existing cosmetic products intended for black skin lead to its forced lightening and, by extension, its degradation.',
  '« La blancheur a été érigée en norme universelle de progrès. »':
    '“Whiteness was erected as the universal standard of progress.”',
  'Pour Minette, nous devons conserver notre authenticité quelle que soit notre carnation comme le dit le slogan de la marque, ':
    'For Minette, we must preserve our authenticity whatever our complexion, as the brand slogan says, ',
  ". Après maintes réflexions, elle décide, il y a 3 ans, d'agir pour opérer une déconstruction. La mission de ":
    '. After much reflection, she decided, 3 years ago, to act and bring about a deconstruction. The mission of ',
  ' consiste justement à changer les mentalités et contribuer à la révolution en marche de la beauté noire.':
    ' is precisely to change mindsets and contribute to the ongoing revolution of black beauty.',
  ", est la marque de produits cosmétiques naturels qui s'engage à respecter votre couleur de peau et à ennoblir votre beauté grâce à des ingrédients botaniques et végétaux de la plus haute qualité et à des prix défiants toute concurrence ! Ses produits naturels sont adaptés pour tous les types de peau.":
    ', is the natural cosmetics brand committed to respecting your skin colour and ennobling your beauty with the highest quality botanical and plant ingredients and at prices that defy all competition! Its natural products are suitable for all skin types.',
  'Pour chaque produit, nous relevons le défi de créer des formules uniques et innovantes en utilisant exclusivement des options naturelles. En trois mots, ':
    'For each product, we take on the challenge of creating unique and innovative formulas using exclusively natural options. In three words, ',
  ' se veut être une marque ': ' aims to be a brand that is ',
  ' et ': ' and ',
  'Parcours académique': 'Academic background',
  "Master — École Supérieure de Commerce de Paris":
    "Master's — École Supérieure de Commerce de Paris",
  'MBA en Stratégie Digitale': 'MBA in Digital Strategy',
  'Diplômée 2026 — Parcours entrepreneurial': 'Graduated 2026 — Entrepreneurial program',
  Authentique: 'Authentic',
  'Formules uniques, 100% naturelles': 'Unique formulas, 100% natural',
  Plurielle: 'Plural',
  'Pour tous les types de peau noire': 'For all types of black skin',
  Inclusive: 'Inclusive',
  'Prix accessibles, beauté pour toutes': 'Affordable prices, beauty for all',
}

export default function PresentationPage() {
  const { lang } = useLang()
  const t = useT(EN)
  const c = usePageContent('fondatrice', lang, {
    title: { fr: 'Notre Fondatrice', en: 'Our Founder' },
    role: {
      fr: 'Fondatrice & Créatrice - #TeintdAfriqueCosmetiques',
      en: 'Founder & Creator - #TeintdAfriqueCosmetiques',
    },
  })
  const image = useContentImage('fondatrice', lang, 'image', fondatriceImg)

  return (
    <div style={{ fontFamily: 'Outfit, system-ui, sans-serif' }}>
      {/* ── PAGE BANNER ── */}
      <div className="bg-[#3B1705] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[#C97B1A] tracking-[0.35em] text-[10px] uppercase mb-4 flex items-center gap-3">
            <span className="w-8 h-px bg-[#C97B1A]" />
            Teint d'Afrique Cosmétiques
          </p>
          <h1
            className="text-[#FAF6EF] leading-tight"
            style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            }}
          >
            {c.title}
          </h1>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-start">

            {/* Photo */}
            <div className="relative order-2 md:order-1 md:sticky md:top-28">
              <div className="absolute -top-5 -left-5 w-28 h-28 border border-[#C97B1A]/25 pointer-events-none z-10" />
              <img
                src={image}
                alt={t("Minette Kamdem-Jambong, fondatrice de Teint d'Afrique Cosmétiques")}
                className="w-full h-[500px] md:h-[640px] object-cover object-top"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#2A1006]/70 to-transparent px-6 py-8">
                <p
                  className="text-white text-2xl"
                  style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                >
                  Minette Kamdem-Jambong
                </p>
                <p className="text-[#C97B1A] text-[9px] tracking-[0.3em] uppercase mt-1">
                  {c.role}
                </p>
              </div>
            </div>

            {/* Verbatim text from brief */}
            <div className="order-1 md:order-2 space-y-6 text-[#2A1006]/80 leading-relaxed text-[15px] md:text-base">
              <p>
                {t('Créatrice de la marque ')}
                <strong className="text-[#3B1705]">#TeintdAfriqueCosmetiques</strong>
                {t(', épouse et mère, ')}
                <strong className="text-[#3B1705]">Minette Kamdem-Jambong</strong>
                {t(" est une Femme Camerounaise qui rêve de restaurer l'identité et l'image de la femme africaine en s'impliquant activement sur les sujets tels que l'Acceptation de soi, la Dignité africaine et la Diversité Culturelle.")}
              </p>

              <p>
                {t("Femme de caractère, fervente défenseur de la peau noire et farouche opposante à la dénaturation de la peau noire, Minette est, avant tout, une femme dévouée qui déborde d'ambition pour la génération féminine actuelle et celles à venir.")}
              </p>

              <p>
                {t("Diplômée de l'École Supérieure de Commerce de Paris (ISC Paris Business School) où elle a obtenu un Master avant de décrocher un MBA en Stratégie digitale à l'Institut Européen du Digital, Minette a appris la cosmétologie sur le terrain, au contact de ses clientes. Elle s'entoure aujourd'hui de consultants chimistes pour élaborer ses formules.")}
              </p>

              <p>
                {t("Aujourd'hui, à travers ")}
                <strong className="text-[#3B1705]">#TeintdAfriqueCosmetiques</strong>
                {t(", elle souhaite cristalliser son ambition, son rêve. Un rêve né d'un constat, mieux d'une frustration. Car elle a constaté que bon nombre de produits cosmétiques existants et destinés à la peau noire conduisent à l'éclaircissement forcé de celle-ci et par ricochet, à sa dégradation.")}
              </p>

              <blockquote className="pl-5 border-l-2 border-[#C97B1A] my-8">
                <p
                  className="text-[#3B1705] text-lg italic"
                  style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                >
                  {t('« La blancheur a été érigée en norme universelle de progrès. »')}
                </p>
              </blockquote>

              <p>
                {t('Pour Minette, nous devons conserver notre authenticité quelle que soit notre carnation comme le dit le slogan de la marque, ')}
                <strong className="text-[#C97B1A]">«&nbsp;#VOTRE_PEAU_VAUT_DE_LOR&nbsp;»</strong>
                {t(". Après maintes réflexions, elle décide, il y a 3 ans, d'agir pour opérer une déconstruction. La mission de ")}
                <strong className="text-[#3B1705]">#Teint_dAfrique_Cosmétiques</strong>
                {t(' consiste justement à changer les mentalités et contribuer à la révolution en marche de la beauté noire.')}
              </p>

              <p>
                <strong className="text-[#3B1705]">#Teint_dAfrique_Cosmétiques</strong>
                {t(", est la marque de produits cosmétiques naturels qui s'engage à respecter votre couleur de peau et à ennoblir votre beauté grâce à des ingrédients botaniques et végétaux de la plus haute qualité et à des prix défiants toute concurrence ! Ses produits naturels sont adaptés pour tous les types de peau.")}
              </p>

              <p>
                {t('Pour chaque produit, nous relevons le défi de créer des formules uniques et innovantes en utilisant exclusivement des options naturelles. En trois mots, ')}
                <strong className="text-[#3B1705]">#TeintdAfriqueCosmetiques</strong>
                {t(' se veut être une marque ')}
                <strong className="text-[#C97B1A]">#AUTHENTIQUE</strong>
                {', '}
                <strong className="text-[#C97B1A]">#PLURIELLE</strong>
                {t(' et ')}
                <strong className="text-[#C97B1A]">#INCLUSIVE</strong>.
              </p>

              {/* Credentials */}
              <div className="pt-6 border-t border-[#3B1705]/10">
                <p className="text-[#C97B1A] text-[9px] tracking-[0.3em] uppercase mb-5">
                  {t('Parcours académique')}
                </p>
                <div className="space-y-4">
                  {[
                    {
                      school: 'ISC Paris Business School',
                      degree: "Master — École Supérieure de Commerce de Paris",
                    },
                    {
                      school: "Institut Européen du Digital",
                      degree: "MBA en Stratégie Digitale",
                    },
                    {
                      school: 'Pépite Sorbonne Université',
                      degree: 'Diplômée 2026 — Parcours entrepreneurial',
                    },
                  ].map(c => (
                    <div key={c.school} className="flex gap-4 items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#C97B1A] mt-1.5 flex-shrink-0" />
                      <div>
                        <p className="text-[#3B1705] font-medium text-sm">{c.school}</p>
                        <p className="text-[#2A1006]/55 text-xs">{t(c.degree)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3 pillars */}
              <div className="pt-6 grid grid-cols-3 gap-3">
                {[
                  { label: 'Authentique', desc: 'Formules uniques, 100% naturelles' },
                  { label: 'Plurielle', desc: 'Pour tous les types de peau noire' },
                  { label: 'Inclusive', desc: 'Prix accessibles, beauté pour toutes' },
                ].map(v => (
                  <div key={v.label} className="text-center py-5 px-3" style={{ background: '#3B170508' }}>
                    <div
                      className="text-[#C97B1A] text-base mb-1"
                      style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                    >
                      {t(v.label)}
                    </div>
                    <p className="text-[#2A1006]/50 text-[11px] leading-tight">{t(v.desc)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
