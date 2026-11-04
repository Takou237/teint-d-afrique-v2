import { useLang, useT } from '@/context/LanguageContext'
import { usePageContent } from '@/hooks/usePageContent'

const EN: Record<string, string> = {
  "La marque · Teint d'Afrique Cosmétiques": "The brand · Teint d'Afrique Cosmétiques",
  'Nos Valeurs et Ambitions': 'Our Values and Ambitions',
  'Être soi, sans compromis.': 'Be yourself, without compromise.',
  "Teint d'Afrique Cosmétiques veut contribuer à changer les standards de beauté qui ont longtemps valorisé une peau plus claire comme idéal. Notre ambition : participer à une évolution des mentalités et à une meilleure acceptation de toutes les carnations.":
    "Teint d'Afrique Cosmétiques wants to help change the beauty standards that for so long held lighter skin up as the ideal. Our ambition: to take part in a shift in mindsets and a greater acceptance of all complexions.",
  Respecter: 'Respect',
  'Votre couleur de peau, votre carnation et votre singularité. Nous ne chercherons jamais à modifier ce qui vous rend unique.':
    'Your skin colour, your complexion and your uniqueness. We will never seek to alter what makes you unique.',
  Sublimer: 'Enhance',
  "Des soins conçus pour prendre soin de la peau et révéler son éclat naturel — sans jamais en altérer la couleur.":
    'Care designed to look after the skin and reveal its natural radiance — without ever altering its colour.',
  Valoriser: 'Champion',
  "Des ingrédients et des ressources issus de la richesse africaine, au service d'une cosmétique d'excellence.":
    "Ingredients and resources drawn from Africa's riches, in the service of exceptional cosmetics.",
  Sensibiliser: 'Raise awareness',
  'Pour faire évoluer le regard sur la peau noire et encourager une beauté libérée de la dépigmentation.':
    'To change how black skin is perceived and encourage beauty freed from depigmentation.',
  'Nos ambitions': 'Our ambitions',
  'Changer les mentalités': 'Change mindsets',
  'Participer à une révolution des standards de beauté qui valorise toutes les carnations africaines.':
    'Take part in a revolution in beauty standards that celebrates all African complexions.',
  "Prouver l'excellence africaine": 'Prove African excellence',
  "Démontrer que l'Afrique peut créer des cosmétiques de niveau international, inspirés de ses ressources.":
    'Demonstrate that Africa can create world-class cosmetics inspired by its resources.',
  'Grandir ensemble': 'Grow together',
  'Construire une marque qui grandit avec ses clientes, portée par une ambition qui dépasse la cosmétique.':
    'Build a brand that grows with its customers, driven by an ambition that goes beyond cosmetics.',
}

const VALEURS = [
  {
    mot: 'Respecter',
    desc: "Votre couleur de peau, votre carnation et votre singularité. Nous ne chercherons jamais à modifier ce qui vous rend unique.",
    color: '#C97B1A',
  },
  {
    mot: 'Sublimer',
    desc: "Des soins conçus pour prendre soin de la peau et révéler son éclat naturel — sans jamais en altérer la couleur.",
    color: '#8B3A52',
  },
  {
    mot: 'Valoriser',
    desc: "Des ingrédients et des ressources issus de la richesse africaine, au service d'une cosmétique d'excellence.",
    color: '#2A7A4F',
  },
  {
    mot: 'Sensibiliser',
    desc: "Pour faire évoluer le regard sur la peau noire et encourager une beauté libérée de la dépigmentation.",
    color: '#6B7C2A',
  },
]

export default function ValeursPage() {
  const { lang } = useLang()
  const t = useT(EN)
  const c = usePageContent('valeurs', lang, {
    title: { fr: 'Nos Valeurs et Ambitions', en: 'Our Values and Ambitions' },
    lead: {
      fr: 'Être soi, sans compromis.',
      en: 'Be yourself, without compromise.',
    },
  })

  return (
    <div style={{ fontFamily: 'Outfit, system-ui, sans-serif' }}>
      <div className="bg-[#3B1705] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[#C97B1A] tracking-[0.35em] text-[10px] uppercase mb-4 flex items-center gap-3">
            <span className="w-8 h-px bg-[#C97B1A]" />
            {t("La marque · Teint d'Afrique Cosmétiques")}
          </p>
          <h1 className="text-[#FAF6EF] leading-tight" style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
            {c.title}
          </h1>
        </div>
      </div>

      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 max-w-3xl">
            <p className="text-[#3B1705] text-xl leading-relaxed mb-6" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
              {c.lead}
            </p>
            <p className="text-[#2A1006]/75 leading-relaxed text-[15px]">
              {t("Teint d'Afrique Cosmétiques veut contribuer à changer les standards de beauté qui ont longtemps valorisé une peau plus claire comme idéal. Notre ambition : participer à une évolution des mentalités et à une meilleure acceptation de toutes les carnations.")}
            </p>
          </div>

          {/* 4 Valeurs */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {VALEURS.map((v, i) => (
              <div key={v.mot} className="flex gap-6 items-start p-8 border border-[#3B1705]/8 hover:shadow-md transition-shadow">
                <div
                  className="w-14 h-14 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0"
                  style={{ background: v.color, fontFamily: "'DM Serif Display', Georgia, serif" }}
                >
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-3xl mb-3" style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: v.color }}>
                    {t(v.mot)}
                  </h3>
                  <p className="text-[#2A1006]/70 leading-relaxed">{t(v.desc)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Ambitions */}
          <div className="bg-[#3B1705] p-10 md:p-14">
            <p className="text-[#C97B1A] text-[9px] tracking-[0.3em] uppercase mb-6">{t('Nos ambitions')}</p>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { titre: 'Changer les mentalités', texte: "Participer à une révolution des standards de beauté qui valorise toutes les carnations africaines." },
                { titre: "Prouver l'excellence africaine", texte: "Démontrer que l'Afrique peut créer des cosmétiques de niveau international, inspirés de ses ressources." },
                { titre: 'Grandir ensemble', texte: "Construire une marque qui grandit avec ses clientes, portée par une ambition qui dépasse la cosmétique." },
              ].map(a => (
                <div key={a.titre}>
                  <h4 className="text-[#FAF6EF] text-xl mb-3" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                    {t(a.titre)}
                  </h4>
                  <p className="text-[#FAF6EF]/60 text-sm leading-relaxed">{t(a.texte)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
