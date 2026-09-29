import type { Lang, Localized } from '@/i18n'
import laitUnifie from '@/assets/products/lait-unifie.webp'
import laitRepare from '@/assets/products/lait-repare.webp'
import laitHydrate from '@/assets/products/lait-hydrate.webp'
import laitNourri from '@/assets/products/lait-nourri.webp'
import cremeUnifiee from '@/assets/products/creme-unifiee.webp'
import cremeReparee from '@/assets/products/creme-reparee.webp'
import cremeHydratee from '@/assets/products/creme-hydratee.webp'
import cremeNourrie from '@/assets/products/creme-nourrie.webp'
import lotionUnifiee from '@/assets/products/lotion-unifiee.webp'
import lotionReparee from '@/assets/products/lotion-reparee.webp'
import lotionHydratee from '@/assets/products/lotion-hydratee.webp'
import lotionNourrie from '@/assets/products/lotion-nourrie.webp'

export type GammeId = 'eclat' | 'reparation' | 'hydratation' | 'nutrition'

export interface Product {
  type: string
  poids: string
  symbol: string
  description: string
  image: string
}

export interface Gamme {
  id: GammeId
  nom: string
  tagline: string
  ingredients: string
  color: string
  colorLight: string
  colorDark: string
  description: string
  ingredientsDetail: string
  image: string
  products: Product[]
}

interface LocalizedProduct {
  type: Localized
  poids: string
  symbol: string
  description: Localized
  image: string
}

interface LocalizedGamme {
  id: GammeId
  nom: Localized
  tagline: Localized
  ingredients: Localized
  color: string
  colorLight: string
  colorDark: string
  description: Localized
  ingredientsDetail: Localized
  image: string
  products: LocalizedProduct[]
}

const GAMMES_BASE: LocalizedGamme[] = [
  {
    id: 'eclat',
    nom: { fr: 'ÉCLAT NATUREL', en: 'NATURAL RADIANCE' },
    tagline: { fr: 'Révélez votre luminosité naturelle', en: 'Reveal your natural glow' },
    ingredients: { fr: 'Curcuma & Carotte', en: 'Turmeric & Carrot' },
    color: '#C97B1A',
    colorLight: '#FEF3DC',
    colorDark: '#7A4800',
    description: {
      fr: "La gamme ÉCLAT NATUREL puise dans la puissance ancestrale du curcuma et de la carotte pour révéler l'éclat naturel de votre peau. Ces actifs dorés, utilisés depuis des siècles dans nos traditions africaines, unifient le teint, atténuent les imperfections et offrent une luminosité incomparable — sans jamais altérer votre couleur naturelle.",
      en: "The NATURAL RADIANCE range draws on the ancestral power of turmeric and carrot to reveal your skin's natural glow. These golden actives, used for centuries in our African traditions, even out the complexion, fade imperfections and deliver incomparable luminosity — without ever altering your natural colour.",
    },
    ingredientsDetail: {
      fr: 'Curcuma — puissant antioxydant, éclairant naturel reconnu depuis des siècles dans les traditions africaines et asiatiques. Carotte — riche en bêta-carotène, elle nourrit, unifie et illumine le teint en profondeur.',
      en: "Turmeric — a powerful antioxidant and natural brightener recognised for centuries in African and Asian traditions. Carrot — rich in beta-carotene, it nourishes, evens out and deeply illuminates the complexion.",
    },
    image: 'https://images.unsplash.com/photo-1768729340925-2749ecdc211c?w=800&h=600&fit=crop&auto=format',
    products: [
      {
        type: { fr: 'Lotion', en: 'Lotion' },
        poids: '100 ml',
        symbol: '◻',
        description: {
          fr: 'TEINT UNIFIÉ. Lotion légère aux extraits de carotte et curcuma. S\'absorbe rapidement pour illuminer et unifier le teint au quotidien. À utiliser après le nettoyage pour une synergie éclat naturel optimale.',
          en: 'UNIFIED COMPLEXION. Light lotion with carrot and turmeric extracts. Absorbs quickly to brighten and even out the complexion every day. Use after cleansing for an optimal natural glow synergy.',
        },
        image: lotionUnifiee,
      },
      {
        type: { fr: 'Crème de Visage', en: 'Face Cream' },
        poids: '100 ml',
        symbol: '◇',
        description: {
          fr: 'Crème éclat naturel concentrée au curcuma. Formule ciblée qui atténue les taches, unifie le teint et révèle la luminosité naturelle de la peau. Texture fondante, non grasse, idéale pour l\'usage quotidien matin et soir.',
          en: "Natural glow cream concentrated with turmeric. A targeted formula that fades dark spots, evens out the complexion and reveals the skin's natural luminosity. Melting, non-greasy texture, ideal for daily morning and evening use.",
        },
        image: cremeUnifiee,
      },
      {
        type: { fr: 'Lait Corps', en: 'Body Milk' },
        poids: '500 ml',
        symbol: '○',
        description: {
          fr: 'Lait corps éclat naturel enrichi aux extraits de carotte et curcuma. S\'absorbe rapidement pour nourrir et illuminer la peau du corps tout en l\'unifiant progressivement. Le geste beauté incontournable pour une peau rayonnante.',
          en: 'Natural glow body milk enriched with carrot and turmeric extracts. Absorbs quickly to nourish and illuminate the skin of the body while gradually evening it out. The essential beauty ritual for radiant skin.',
        },
        image: laitUnifie,
      },
    ],
  },
  {
    id: 'reparation',
    nom: { fr: 'RÉPARATION', en: 'REPAIR' },
    tagline: { fr: 'Régénérez et restaurez votre peau', en: 'Regenerate and restore your skin' },
    ingredients: { fr: 'Huile de Marula & Collagène Marin', en: 'Marula Oil & Marine Collagen' },
    color: '#8B3A52',
    colorLight: '#FCF0F3',
    colorDark: '#5A1F32',
    description: {
      fr: "La gamme RÉPARATION associe la précieuse huile de Marula — surnommée « l'or liquide de l'Afrique australe » — au collagène marin pour régénérer en profondeur les peaux abîmées, fatiguées ou agressées. Une alliance de luxe naturel et de science moderne, formulée exclusivement pour la beauté africaine.",
      en: "The REPAIR range combines precious Marula oil — nicknamed “the liquid gold of Southern Africa” — with marine collagen to deeply regenerate damaged, tired or stressed skin. A blend of natural luxury and modern science, formulated exclusively for African beauty.",
    },
    ingredientsDetail: {
      fr: "Huile de Marula — pénètre sans résidu gras, régénère et protège contre les agressions extérieures. Collagène Marin — renforce l'élasticité cutanée, réduit les ridules et améliore le rebond de la peau.",
      en: "Marula Oil — penetrates without a greasy residue, regenerates and protects against external aggressions. Marine Collagen — strengthens skin elasticity, reduces fine lines and improves skin bounce.",
    },
    image: 'https://images.unsplash.com/photo-1646457417431-1257d95a92b8?w=800&h=600&fit=crop&auto=format',
    products: [
      {
        type: { fr: 'Lotion', en: 'Lotion' },
        poids: '100 ml',
        symbol: '◻',
        description: {
          fr: "Lotion régénérante post-soin à l'huile de Marula. Légère et pénétrante, elle restaure la barrière cutanée et prépare la peau à recevoir les soins suivants. Utiliser après le nettoyage pour une synergie réparatrice optimale.",
          en: 'Regenerating post-care lotion with Marula oil. Light and fast-absorbing, it restores the skin barrier and prepares the skin for the following care steps. Use after cleansing for an optimal repairing synergy.',
        },
        image: lotionReparee,
      },
      {
        type: { fr: 'Crème de Visage', en: 'Face Cream' },
        poids: '100 ml',
        symbol: '◇',
        description: {
          fr: "Crème régénérante au Marula et Collagène Marin. Formule concentrée qui comble les ridules, raffermit les contours et restitue l'éclat naturel des peaux fatiguées ou stressées. Résultats visibles dès 4 semaines.",
          en: "Regenerating cream with Marula and Marine Collagen. A concentrated formula that plumps fine lines, firms contours and restores the natural glow of tired or stressed skin. Visible results in 4 weeks.",
        },
        image: cremeReparee,
      },
      {
        type: { fr: 'Lait Corps', en: 'Body Milk' },
        poids: '500 ml',
        symbol: '○',
        description: {
          fr: "Lait corps réparateur onctueux à l'huile de Marula. Restaure durablement le film hydrolipidique, améliore l'élasticité et renforce la résistance de la peau. Une sensation de confort immédiat et de peau régénérée.",
          en: "Rich repairing body milk with Marula oil. Lastingly restores the hydrolipidic film, improves elasticity and strengthens the skin's resistance. An immediate feeling of comfort and regenerated skin.",
        },
        image: laitRepare,
      },
    ],
  },
  {
    id: 'hydratation',
    nom: { fr: 'HYDRATATION', en: 'HYDRATION' },
    tagline: { fr: 'Désaltérez votre peau en profondeur', en: 'Deeply quench your skin' },
    ingredients: { fr: 'Aloe Vera & Concombre', en: 'Aloe Vera & Cucumber' },
    color: '#2A7A4F',
    colorLight: '#E8F5EE',
    colorDark: '#1A4E33',
    description: {
      fr: "La gamme HYDRATATION allie la légèreté rafraîchissante du concombre à la puissance hydratante de l'aloe vera. Ensemble, ils forment un bouclier d'hydratation qui retient l'eau, apaise les irritations et laisse la peau fraîche, souple et lumineuse tout au long de la journée — quelle que soit la chaleur tropicale.",
      en: "The HYDRATION range blends the refreshing lightness of cucumber with the moisturising power of aloe vera. Together they form a hydration shield that retains water, soothes irritation and leaves skin fresh, supple and luminous all day long — whatever the tropical heat.",
    },
    ingredientsDetail: {
      fr: "Aloe Vera — hydratation profonde, apaisement immédiat, propriétés cicatrisantes et anti-inflammatoires naturelles. Concombre — effet fraîcheur instantané, réduit les gonflements et illumine le teint sans agresser.",
      en: "Aloe Vera — deep hydration, immediate soothing, natural healing and anti-inflammatory properties. Cucumber — instant fresh effect, reduces puffiness and illuminates the complexion without harshness.",
    },
    image: 'https://images.unsplash.com/photo-1613143798921-c342c82c32e2?w=800&h=600&fit=crop&auto=format',
    products: [
      {
        type: { fr: 'Lotion', en: 'Lotion' },
        poids: '100 ml',
        symbol: '◻',
        description: {
          fr: "Lotion hydratante légère à l'aloe vera. Formule aquatique qui sature la peau en eau et lui apporte tonus et légèreté. À utiliser matin et soir pour maintenir le niveau d'hydratation optimal de la peau.",
          en: "Light hydrating lotion with aloe vera. An aquatic formula that saturates the skin with water and brings tone and lightness. Use morning and evening to maintain the skin's optimal hydration level.",
        },
        image: lotionHydratee,
      },
      {
        type: { fr: 'Crème de Visage', en: 'Face Cream' },
        poids: '100 ml',
        symbol: '◇',
        description: {
          fr: 'Crème hydratante au concombre. Texture gel-crème fraîche qui fond sur la peau pour une hydratation intense de 24h sans effet gras. Apaise les rougeurs, resserre les pores et illumine le teint progressivement.',
          en: 'Hydrating cucumber cream. A fresh gel-cream texture that melts into the skin for intense 24h hydration with no greasy effect. Soothes redness, tightens pores and gradually illuminates the complexion.',
        },
        image: cremeHydratee,
      },
      {
        type: { fr: 'Lait Corps', en: 'Body Milk' },
        poids: '500 ml',
        symbol: '○',
        description: {
          fr: "Lait corps hydratant non gras enrichi en aloe vera et concombre. Formule légère et fraîche qui s'absorbe rapidement pour une peau douce, désaltérée et lumineuse. Parfait pour les peaux mixtes en climat chaud.",
          en: 'Non-greasy hydrating body milk enriched with aloe vera and cucumber. A light, fresh formula that absorbs quickly for soft, quenched and luminous skin. Perfect for combination skin in hot climates.',
        },
        image: laitHydrate,
      },
    ],
  },
  {
    id: 'nutrition',
    nom: { fr: 'NUTRITION', en: 'NUTRITION' },
    tagline: { fr: 'Nourrissez chaque cellule de votre peau', en: 'Nourish every cell of your skin' },
    ingredients: { fr: "Beurre de Mangue & Huile d'Avocat", en: 'Mango Butter & Avocado Oil' },
    color: '#6B7C2A',
    colorLight: '#F2F5E0',
    colorDark: '#3E4A18',
    description: {
      fr: "La gamme NUTRITION célèbre les trésors nourriciers de la nature tropicale : le beurre de mangue, riche en vitamines A et E, s'allie à l'huile d'avocat pour pénétrer en profondeur et nourrir intensément les peaux les plus sèches. Un soin de fond qui transforme durablement la texture et l'éclat de votre peau.",
      en: 'The NUTRITION range celebrates the nourishing treasures of tropical nature: mango butter, rich in vitamins A and E, joins forces with avocado oil to penetrate deeply and intensely nourish even the driest skin. A deep treatment that lastingly transforms the texture and glow of your skin.',
    },
    ingredientsDetail: {
      fr: "Beurre de Mangue — ultra-nourrissant, concentré en vitamines A et E, laisse la peau soyeuse et rayonnante. Huile d'Avocat — pénètre en profondeur, régénère et assouplit durablement les peaux les plus sèches.",
      en: 'Mango Butter — ultra-nourishing, concentrated in vitamins A and E, leaves skin silky and radiant. Avocado Oil — penetrates deeply, regenerates and lastingly softens the driest skin.',
    },
    image: 'https://images.unsplash.com/photo-1417217601328-d3c66e6f1d48?w=800&h=600&fit=crop&auto=format',
    products: [
      {
        type: { fr: 'Lotion', en: 'Lotion' },
        poids: '100 ml',
        symbol: '◻',
        description: {
          fr: "Lotion nutritive corps au beurre de mangue et huile d'avocat. Légère mais intensément nourrissante, elle prépare et complète l'action de la crème pour une nutrition continue et un éclat durable tout au long de la journée.",
          en: "Nourishing body lotion with mango butter and avocado oil. Light yet intensely nourishing, it prepares and complements the cream's action for continuous nutrition and lasting glow throughout the day.",
        },
        image: lotionNourrie,
      },
      {
        type: { fr: 'Crème de Visage', en: 'Face Cream' },
        poids: '100 ml',
        symbol: '◇',
        description: {
          fr: 'PEAU NOURRIE. Crème visage au beurre de mangue et miel. Nourrit en profondeur, régénère les cellules et laisse la peau souple, lisse et rayonnante. Formule riche idéale pour les peaux sèches à très sèches.',
          en: 'NOURISHED SKIN. Face cream with mango butter and honey. Deeply nourishes, regenerates cells and leaves skin supple, smooth and radiant. A rich formula ideal for dry to very dry skin.',
        },
        image: cremeNourrie,
      },
      {
        type: { fr: 'Lait Corps', en: 'Body Milk' },
        poids: '500 ml',
        symbol: '○',
        description: {
          fr: "Lait corps nutrition fondant et généreux au beurre de mangue. Enveloppe la peau d'une couche nourrissante et protectrice qui agit en profondeur pour une douceur durable. Texture onctueuse qui s'absorbe sans laisser de film.",
          en: 'Melting, generous nutrition body milk with mango butter. Wraps the skin in a nourishing, protective layer that works deep down for lasting softness. A creamy texture that absorbs without leaving a film.',
        },
        image: laitNourri,
      },
    ],
  },
]

export function getGammes(lang: Lang): Gamme[] {
  return GAMMES_BASE.map(g => ({
    id: g.id,
    nom: g.nom[lang],
    tagline: g.tagline[lang],
    ingredients: g.ingredients[lang],
    color: g.color,
    colorLight: g.colorLight,
    colorDark: g.colorDark,
    description: g.description[lang],
    ingredientsDetail: g.ingredientsDetail[lang],
    image: g.image,
    products: g.products.map(p => ({
      type: p.type[lang],
      poids: p.poids,
      symbol: p.symbol,
      description: p.description[lang],
      image: p.image,
    })),
  }))
}
