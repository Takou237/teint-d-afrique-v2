import { Link } from 'react-router'
import { getGammes } from '@/data'
import { useLang, useT } from '@/context/LanguageContext'

const EN = {
  'Pourquoi Teint d\'Afrique': 'Why Teint d\'Afrique',
  'Nos Propositions de Valeur': 'Our Value Propositions',
  'Une marque 100% camerounaise': 'A 100% Cameroonian brand',
  "Au service des peaux noires, métissées et albinos. Formulée en Afrique, pour l'Afrique.":
    'At the service of black, mixed-race and albino skin. Formulated in Africa, for Africa.',
  'Ingrédients 100% africains': '100% African ingredients',
  "Aloe vera, curcuma, carotte, citron, miel, beurre de karité, coco, pomme de terre, bave d'escargot, peaux de plantain.":
    'Aloe vera, turmeric, carrot, lemon, honey, shea butter, coconut, potato, snail slime, plantain skins.',
  'La femme africaine est magnifique': 'The African woman is magnificent',
  "Et il est temps qu'elle le sache. Nous célébrons chaque carnation dans sa beauté naturelle et singulière.":
    "And it's time she knew it. We celebrate every complexion in its natural, singular beauty.",
  'Nous sublimons et réparons': 'We enhance and repair',
  "Nous sublimons les peaux noires, et réparons celles qui ont été abîmées par les produits décapants.":
    'We enhance black skin and repair skin damaged by lightening products.',
  'Cosmétiques Naturels · Douala, Cameroun': 'Natural Cosmetics · Douala, Cameroon',
  'Une marque 100% camerounaise de cosmétiques naturels, au service des peaux noires, métissées et albinos — sans jamais chercher à changer leur couleur.':
    'A 100% Cameroonian natural cosmetics brand, at the service of black, mixed-race and albino skin — never seeking to change its colour.',
  'Découvrir nos produits': 'Discover our products',
  'Notre histoire': 'Our story',
  Défiler: 'Scroll',
  '#AUTHENTIQUE': '#AUTHENTIC',
  '#PLURIELLE': '#PLURAL',
  '#INCLUSIVE': '#INCLUSIVE',
  '#NATURELLE': '#NATURAL',
  'La marque': 'The brand',
  'Une femme, une conviction,': 'A woman, a conviction,',
  'une marque.': 'a brand.',
  'Minette Jambong-Kamdem, fondatrice de Teint d\'Afrique Cosmétiques':
    'Minette Jambong-Kamdem, founder of Teint d\'Afrique Cosmétiques',
  'Fondatrice & Créatrice': 'Founder & Creator',
  'Créatrice de la marque ': 'Creator of the brand ',
  ', épouse et mère, ': ', wife and mother, ',
  " est une Femme Camerounaise qui rêve de restaurer l'identité et l'image de la femme africaine en s'impliquant activement sur les sujets tels que l'Acceptation de soi, la Dignité africaine et la Diversité Culturelle.":
    " is a Cameroonian woman who dreams of restoring the identity and image of African women by actively engaging on subjects such as self-acceptance, African dignity and cultural diversity.",
  "Femme de caractère, fervente défenseur de la peau noire et farouche opposante à la dénaturation de la peau noire, Minette est, avant tout, une femme dévouée qui déborde d'ambition pour la génération féminine actuelle et celles à venir.":
    'A woman of character, a fervent defender of black skin and a fierce opponent of its alteration, Minette is above all a devoted woman overflowing with ambition for today\'s generation of women and those to come.',
  'Notre Fondatrice': 'Our Founder',
  'Notre Histoire →': 'Our Story →',
  'Nos Produits': 'Our Products',
  'Nos Gammes de Soins': 'Our Skincare Ranges',
  'Voir toutes les gammes →': 'See all ranges →',
  '3 produits': '3 products',
  'Crème · 100ml': 'Cream · 100ml',
  'Lait · 500ml': 'Milk · 500ml',
  'Découvrir la gamme →': 'Discover the range →',
}

const PROPOSITIONS = [
  {
    titre: "Une marque 100% camerounaise",
    texte: "Au service des peaux noires, métissées et albinos. Formulée en Afrique, pour l'Afrique.",
    icon: '◆',
  },
  {
    titre: "Ingrédients 100% africains",
    texte: "Aloe vera, curcuma, carotte, citron, miel, beurre de karité, coco, pomme de terre, bave d'escargot, peaux de plantain.",
    icon: '◈',
  },
  {
    titre: "La femme africaine est magnifique",
    texte: "Et il est temps qu'elle le sache. Nous célébrons chaque carnation dans sa beauté naturelle et singulière.",
    icon: '◉',
  },
  {
    titre: "Nous sublimons et réparons",
    texte: "Nous sublimons les peaux noires, et réparons celles qui ont été abîmées par les produits décapants.",
    icon: '◎',
  },
]

export default function AccueilPage() {
  const { lang } = useLang()
  const t = useT(EN)
  const GAMMES = getGammes(lang)

  return (
    <div style={{ fontFamily: 'Outfit, system-ui, sans-serif' }}>

      {/* ── HERO ── */}
      <section className="relative min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-4.5rem)] flex items-center overflow-hidden bg-white">
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-5 gap-12 items-center w-full">
          <div className="md:col-span-3">
            <p className="text-[#C97B1A] tracking-[0.35em] text-[10px] uppercase mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-[#C97B1A]" />
              {t('Cosmétiques Naturels · Douala, Cameroun')}
            </p>
            <h1
              className="text-[#3B1705] leading-[0.88] mb-8"
              style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
                fontSize: 'clamp(3rem, 8vw, 7rem)',
              }}
            >
              {lang === 'en' ? (
                <>YOUR SKIN<br /><span style={{ color: '#C97B1A' }}>IS WORTH</span><br />GOLD.</>
              ) : (
                <>VOTRE PEAU<br /><span style={{ color: '#C97B1A' }}>VAUT</span><br />DE L'OR.</>
              )}
            </h1>
            <p className="text-[#2A1006]/70 text-base md:text-lg leading-relaxed mb-10 max-w-lg">
              {t('Une marque 100% camerounaise de cosmétiques naturels, au service des peaux noires, métissées et albinos — sans jamais chercher à changer leur couleur.')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/nos-produits"
                className="bg-[#C97B1A] text-white px-8 py-4 text-[11px] tracking-[0.25em] uppercase hover:bg-[#A85E0F] transition-colors"
              >
                {t('Découvrir nos produits')}
              </Link>
              <Link
                to="/la-marque/histoire"
                className="border border-[#3B1705]/25 text-[#3B1705] px-8 py-4 text-[11px] tracking-[0.25em] uppercase hover:bg-[#3B1705]/5 transition-colors"
              >
                {t('Notre histoire')}
              </Link>
            </div>
          </div>
          {/* Gamme teasers */}
          <div className="md:col-span-2 hidden md:flex flex-col gap-3">
            {GAMMES.map(g => (
              <Link
                key={g.id}
                to={`/nos-produits/${g.id}`}
                className="flex items-center gap-4 px-5 py-3 bg-[#FAF6EF] border border-[#3B1705]/10 hover:border-[#C97B1A]/40 hover:shadow-sm transition-all group"
              >
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: g.color }} />
                <div>
                  <div className="text-[10px] tracking-[0.2em] uppercase" style={{ color: g.color }}>
                    {g.nom}
                  </div>
                  <div className="text-[#2A1006]/55 text-[11px]">{g.ingredients}</div>
                </div>
                <span className="ml-auto text-[#3B1705]/30 group-hover:text-[#C97B1A] group-hover:translate-x-1 transition-all text-sm">→</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#2A1006]/40">
          <span className="text-[9px] tracking-[0.3em] uppercase">{t('Défiler')}</span>
          <div className="w-px h-10 bg-[#3B1705]/20 animate-pulse" />
        </div>
      </section>

      {/* ── VALUES STRIP ── */}
      <div className="bg-[#3B1705] py-4 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-6 flex justify-center gap-6 md:gap-14 text-[9px] tracking-[0.35em] uppercase whitespace-nowrap">
          {['#AUTHENTIQUE', '#PLURIELLE', '#INCLUSIVE', '#NATURELLE'].map((v, i) => (
            <span key={v} className={i % 2 === 0 ? 'text-[#FAF6EF]/70' : 'text-[#C97B1A]'}>
              {t(v)}
            </span>
          ))}
        </div>
      </div>

      {/* ── PROPOSITIONS DE VALEUR ── */}
      <section className="py-20 md:py-28 bg-[#FAF6EF]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[#C97B1A] tracking-[0.3em] text-[10px] uppercase mb-4 flex items-center justify-center gap-3">
              <span className="w-6 h-px bg-[#C97B1A]" />
              {t("Pourquoi Teint d'Afrique")}
              <span className="w-6 h-px bg-[#C97B1A]" />
            </p>
            <h2
              className="text-[#3B1705] leading-tight"
              style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
                fontSize: 'clamp(2rem, 4vw, 3rem)',
              }}
            >
              {t('Nos Propositions de Valeur')}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-[#3B1705]/8">
            {PROPOSITIONS.map((p, i) => (
              <div
                key={p.titre}
                className={`p-7 hover:bg-[#3B1705]/3 transition-colors ${i < 3 ? 'border-r border-[#3B1705]/8' : ''}`}
              >
                <div className="text-[#C97B1A] text-2xl mb-4">{p.icon}</div>
                <h3
                  className="text-[#3B1705] text-lg mb-3 leading-tight"
                  style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                >
                  {t(p.titre)}
                </h3>
                <p className="text-[#2A1006]/60 text-[13px] leading-relaxed">{t(p.texte)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRÉSENTATION FONDATRICE ── */}
      <section className="py-20 md:py-28" style={{ background: '#3B170506' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 border border-[#C97B1A]/25 pointer-events-none" />
              <img
                src="https://images.unsplash.com/photo-1632765866070-3fadf25d3d5b?w=700&h=850&fit=crop&auto=format"
                alt={t("Minette Jambong-Kamdem, fondatrice de Teint d'Afrique Cosmétiques")}
                className="w-full h-[420px] object-cover object-top"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#2A1006]/65 to-transparent px-5 py-6">
                <p className="text-white text-xl" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                  Minette Jambong-Kamdem
                </p>
                <p className="text-[#C97B1A] text-[9px] tracking-[0.3em] uppercase mt-1">
                  {t('Fondatrice & Créatrice')}
                </p>
              </div>
            </div>
            <div>
              <p className="text-[#C97B1A] tracking-[0.3em] text-[10px] uppercase mb-4 flex items-center gap-3">
                <span className="w-6 h-px bg-[#C97B1A]" />
                {t('La marque')}
              </p>
              <h2
                className="text-[#3B1705] leading-tight mb-7"
                style={{
                  fontFamily: "'DM Serif Display', Georgia, serif",
                  fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                }}
              >
                {t('Une femme, une conviction,')}<br />{t('une marque.')}
              </h2>
              <p className="text-[#2A1006]/75 leading-relaxed text-[15px] mb-5">
                {t('Créatrice de la marque ')}<strong className="text-[#3B1705]">#TeintdAfriqueCosmetiques</strong>
                {t(', épouse et mère, ')}<strong className="text-[#3B1705]">Minette Jambong-Kamdem</strong>
                {t(" est une Femme Camerounaise qui rêve de restaurer l'identité et l'image de la femme africaine en s'impliquant activement sur les sujets tels que l'Acceptation de soi, la Dignité africaine et la Diversité Culturelle.")}
              </p>
              <p className="text-[#2A1006]/75 leading-relaxed text-[15px] mb-8">
                {t("Femme de caractère, fervente défenseur de la peau noire et farouche opposante à la dénaturation de la peau noire, Minette est, avant tout, une femme dévouée qui déborde d'ambition pour la génération féminine actuelle et celles à venir.")}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/la-marque/fondatrice"
                  className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-[#C97B1A] border border-[#C97B1A]/40 px-6 py-3 hover:bg-[#C97B1A] hover:text-white transition-all group"
                >
                  {t('Notre Fondatrice')}
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <Link
                  to="/la-marque/histoire"
                  className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-[#3B1705] border border-[#3B1705]/30 px-6 py-3 hover:bg-[#3B1705] hover:text-white transition-all group"
                >
                  {t('Notre Histoire →')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── NOS PRODUITS ── */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <p className="text-[#C97B1A] tracking-[0.3em] text-[10px] uppercase mb-4 flex items-center gap-3">
                <span className="w-6 h-px bg-[#C97B1A]" />
                {t('Nos Produits')}
              </p>
              <h2
                className="text-[#3B1705] leading-tight"
                style={{
                  fontFamily: "'DM Serif Display', Georgia, serif",
                  fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                }}
              >
                {t('Nos Gammes de Soins')}
              </h2>
            </div>
            <Link
              to="/nos-produits"
              className="self-start md:self-auto text-[11px] tracking-[0.2em] uppercase text-[#C97B1A] border border-[#C97B1A]/40 px-5 py-2.5 hover:bg-[#C97B1A] hover:text-white transition-all whitespace-nowrap"
            >
              {t('Voir toutes les gammes →')}
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {GAMMES.map(g => (
              <Link
                key={g.id}
                to={`/nos-produits/${g.id}`}
                className="group block overflow-hidden border border-[#3B1705]/8 bg-white hover:shadow-lg transition-shadow"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={g.image}
                    alt={`${g.nom} — ${g.ingredients}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(135deg, ${g.color}CC 0%, transparent 60%)` }}
                  />
                  <div className="absolute top-5 left-5">
                    <p className="text-white text-4xl" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                      {g.nom}
                    </p>
                    <p className="text-white/70 text-[10px] tracking-[0.25em] uppercase mt-1">{g.ingredients}</p>
                  </div>
                  <div
                    className="absolute bottom-4 right-4 px-3 py-1 text-white text-[9px] tracking-[0.2em] uppercase"
                    style={{ background: g.color }}
                  >
                    {t('3 produits')}
                  </div>
                </div>
                <div className="p-6" style={{ background: g.colorLight }}>
                  <p className="text-base mb-3 italic" style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: g.colorDark }}>
                    {g.tagline}
                  </p>
                  <p className="text-[13px] leading-relaxed mb-5" style={{ color: g.colorDark + 'CC' }}>
                    {g.description.slice(0, 180)}…
                  </p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {['Lotion · 100ml', 'Crème · 100ml', 'Lait · 500ml'].map(p => (
                      <span key={p} className="text-[10px] tracking-[0.1em] px-3 py-1 border" style={{ color: g.colorDark, borderColor: g.color + '50' }}>
                        {t(p)}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase font-medium group-hover:gap-3 transition-all" style={{ color: g.color }}>
                    {t('Découvrir la gamme →')}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
