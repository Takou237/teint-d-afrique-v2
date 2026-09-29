import { useT } from '@/context/LanguageContext'

const EN: Record<string, string> = {
  'Notre Expertise': 'Our Expertise',
  'Experts de la beauté de la peau noire, métissée et albinos.':
    'Experts in the beauty of black, mixed-race and albino skin.',
  "Chez Teint d'Afrique Cosmétiques, nous sommes convaincus qu'un bon soin commence par une bonne compréhension de la peau.":
    "At Teint d'Afrique Cosmétiques, we are convinced that good skincare starts with a good understanding of the skin.",
  "Nos formules s'appuient sur des ingrédients naturels et des actifs botaniques et végétaux sélectionnés pour leurs propriétés : aloe vera, curcuma, carotte, citron, miel, beurre de karité, coco, pomme de terre, mais aussi des ingrédients issus de la richesse de notre environnement.":
    'Our formulas are based on natural ingredients and botanical and plant actives selected for their properties: aloe vera, turmeric, carrot, lemon, honey, shea butter, coconut, potato, as well as ingredients drawn from the richness of our environment.',
  "Chaque ingrédient est choisi avec un objectif : répondre à un besoin réel de la peau et contribuer à révéler sa beauté naturelle.":
    'Each ingredient is chosen with a purpose: to meet a real need of the skin and help reveal its natural beauty.',
  "Derrière chaque produit, nous recherchons le juste équilibre entre connaissance des besoins de la peau, choix des ingrédients et formulation de soins adaptés. Nos soins sont adaptés pour tous les types de peau noire, métissée et albinos.":
    "Behind every product, we seek the right balance between understanding the skin's needs, choosing ingredients and formulating suitable care. Our treatments are suitable for all types of black, mixed-race and albino skin.",
  'Pour chaque produit, nous relevons le défi de créer des formules uniques et innovantes en utilisant exclusivement des options naturelles.':
    'For each product, we take on the challenge of creating unique and innovative formulas using exclusively natural options.',
  'Ingrédients botaniques naturels': 'Natural botanical ingredients',
  'Peaux noires': 'Black skin',
  'Peaux métissées': 'Mixed-race skin',
  'Peaux albinos': 'Albino skin',
  'Nos actifs botaniques': 'Our botanical actives',
  'Aloe Vera': 'Aloe Vera',
  Curcuma: 'Turmeric',
  Carotte: 'Carrot',
  Citron: 'Lemon',
  Miel: 'Honey',
  'Beurre de Karité': 'Shea Butter',
  'Noix de Coco': 'Coconut',
  'Pomme de Terre': 'Potato',
  "Bave d'Escargot": 'Snail Slime',
  'Peaux de Plantain': 'Plantain Skins',
  'Hydratation & apaisement': 'Hydration & soothing',
  'Éclat & unification': 'Radiance & evenness',
  'Nutrition & luminosité': 'Nutrition & radiance',
  'Purification naturelle': 'Natural purification',
  'Réparation & douceur': 'Repair & softness',
  'Nutrition intense': 'Intense nutrition',
  'Hydratation & protection': 'Hydration & protection',
  'Éclat & anti-oxydant': 'Radiance & antioxidant',
  'Régénération & anti-âge': 'Regeneration & anti-aging',
  'Protection & nutrition': 'Protection & nutrition',
}

const INGREDIENTS = [
  { nom: 'Aloe Vera', usage: 'Hydratation & apaisement', color: '#2A7A4F' },
  { nom: 'Curcuma', usage: 'Éclat & unification', color: '#C97B1A' },
  { nom: 'Carotte', usage: 'Nutrition & luminosité', color: '#D4600A' },
  { nom: 'Citron', usage: 'Purification naturelle', color: '#8B8B14' },
  { nom: 'Miel', usage: 'Réparation & douceur', color: '#C4960A' },
  { nom: 'Beurre de Karité', usage: 'Nutrition intense', color: '#8B6914' },
  { nom: 'Noix de Coco', usage: 'Hydratation & protection', color: '#5C4A1E' },
  { nom: 'Pomme de Terre', usage: 'Éclat & anti-oxydant', color: '#7A6830' },
  { nom: "Bave d'Escargot", usage: 'Régénération & anti-âge', color: '#6B7C2A' },
  { nom: 'Peaux de Plantain', usage: 'Protection & nutrition', color: '#4A6B1E' },
]

export default function ExpertisePage() {
  const t = useT(EN)

  return (
    <div style={{ fontFamily: 'Outfit, system-ui, sans-serif' }}>
      <div className="bg-[#3B1705] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[#C97B1A] tracking-[0.35em] text-[10px] uppercase mb-4 flex items-center gap-3">
            <span className="w-8 h-px bg-[#C97B1A]" />
            Teint d'Afrique Cosmétiques
          </p>
          <h1 className="text-[#FAF6EF] leading-tight" style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
            {t('Notre Expertise')}
          </h1>
          <p className="text-[#FAF6EF]/60 mt-4 max-w-xl">
            {t('Experts de la beauté de la peau noire, métissée et albinos.')}
          </p>
        </div>
      </div>

      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-start mb-20">
            <div className="space-y-5 text-[#2A1006]/80 leading-relaxed text-[15px]">
              <p className="text-[#3B1705] text-xl" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                {t("Chez Teint d'Afrique Cosmétiques, nous sommes convaincus qu'un bon soin commence par une bonne compréhension de la peau.")}
              </p>
              <p>
                {t("Nos formules s'appuient sur des ingrédients naturels et des actifs botaniques et végétaux sélectionnés pour leurs propriétés : aloe vera, curcuma, carotte, citron, miel, beurre de karité, coco, pomme de terre, mais aussi des ingrédients issus de la richesse de notre environnement.")}
              </p>
              <p>
                {t("Chaque ingrédient est choisi avec un objectif : répondre à un besoin réel de la peau et contribuer à révéler sa beauté naturelle.")}
              </p>
              <p>
                {t("Derrière chaque produit, nous recherchons le juste équilibre entre connaissance des besoins de la peau, choix des ingrédients et formulation de soins adaptés. Nos soins sont adaptés pour tous les types de peau noire, métissée et albinos.")}
              </p>
              <blockquote className="pl-5 border-l-2 border-[#C97B1A] my-6">
                <p className="text-[#3B1705] italic" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                  "{t('Pour chaque produit, nous relevons le défi de créer des formules uniques et innovantes en utilisant exclusivement des options naturelles.')}"
                </p>
              </blockquote>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1615485500834-bc10199bc727?w=700&h=500&fit=crop&auto=format"
                alt={t('Ingrédients botaniques naturels')}
                className="w-full h-64 object-cover mb-6"
              />
              <div className="grid grid-cols-3 gap-2">
                {['Peaux noires', 'Peaux métissées', 'Peaux albinos'].map(peau => (
                  <div key={peau} className="bg-[#3B1705] text-[#FAF6EF] text-center py-4 px-2">
                    <p className="text-[11px] tracking-[0.1em]">{t(peau)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ingrédients */}
          <div>
            <p className="text-[#C97B1A] text-[9px] tracking-[0.3em] uppercase mb-6">{t('Nos actifs botaniques')}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {INGREDIENTS.map(ing => (
                <div
                  key={ing.nom}
                  className="p-4 text-center hover:shadow-md transition-shadow"
                  style={{ background: ing.color + '15', borderTop: `2px solid ${ing.color}` }}
                >
                  <p className="font-medium text-sm mb-1" style={{ color: ing.color }}>
                    {t(ing.nom)}
                  </p>
                  <p className="text-[11px] text-[#2A1006]/50 leading-tight">{t(ing.usage)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
