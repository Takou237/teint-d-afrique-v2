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
import savonUnifie from '@/assets/products/savon-unifie.webp'
import savonRepare from '@/assets/products/savon-repare.webp'
import savonHydrate from '@/assets/products/savon-hydrate.webp'
import savonNourri from '@/assets/products/savon-nourri.webp'

export type GammeId = 'eclat' | 'reparation' | 'hydratation' | 'nutrition'

export interface ProductDetails {
  nom: string
  promesses: string[]
  actifs: string
  proprietes: string
  ingredients: string
  modeEmploi: string
  precautions: string
}

export interface Product {
  type: string
  poids: string
  symbol: string
  description: string
  image: string
  details?: ProductDetails
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
  mainImage: string
  products: Product[]
}

interface LocalizedProductDetails {
  nom: Localized
  promesses: { fr: string[]; en: string[] }
  actifs: Localized
  proprietes: Localized
  ingredients: Localized
  modeEmploi: Localized
  precautions: Localized
}

interface LocalizedProduct {
  type: Localized
  poids: string
  symbol: string
  description: Localized
  image: string
  details?: LocalizedProductDetails
}

const PROMESSES: { fr: string[]; en: string[] } = {
  fr: ['Hydrate intensément', 'Nourrit en profondeur', 'Adoucit et illumine la peau'],
  en: ['Deeply hydrates', 'Nourishes in depth', 'Softens and brightens the skin'],
}

const MODE_EMPLOI_LOTION: Localized = {
  fr: "Appliquer une à deux pressions sur le visage et le cou parfaitement nettoyés, matin et/ou soir. Répartir uniformément du bout des doigts ou à l'aide d'un coton, en évitant le contour des yeux, jusqu'à absorption complète.",
  en: 'Apply one to two pumps to a thoroughly cleansed face and neck, morning and/or evening. Spread evenly with fingertips or a cotton pad, avoiding the eye area, until fully absorbed.',
}

const MODE_EMPLOI_CREME: Localized = {
  fr: "Appliquer matin et/ou soir sur le visage et le cou parfaitement nettoyés et secs. Masser délicatement du centre du visage vers l'extérieur jusqu'à absorption complète. Éviter le contour des yeux.",
  en: 'Apply morning and/or evening to a thoroughly cleansed and dry face and neck. Gently massage from the center of the face outward until fully absorbed. Avoid the eye area.',
}

const MODE_EMPLOI_CORPS: Localized = {
  fr: "Appliquer sur une peau propre, matin et/ou soir. Masser délicatement par mouvements circulaires jusqu'à absorption complète.",
  en: 'Apply to clean skin, morning and/or evening. Gently massage in circular motions until fully absorbed.',
}

const PRECAUTIONS_VISAGE: Localized = {
  fr: "Éviter tout contact avec les yeux. En cas d'irritation, cesser l'utilisation. Conserver dans un endroit frais et sec, à l'abri de la lumière directe.",
  en: 'Avoid contact with eyes. If irritation occurs, discontinue use. Store in a cool, dry place away from direct light.',
}

const PRECAUTIONS_CORPS: Localized = {
  fr: "Éviter tout contact avec les yeux. Conserver dans un endroit frais et sec, à l'abri de la lumière directe.",
  en: 'Avoid contact with eyes. Store in a cool, dry place away from direct light.',
}

const INGREDIENTS_CAROTTE_CURCUMA: Localized = {
  fr: 'Eau, extrait de carotte, extrait de curcuma, alcool cétylique, benzoate de sodium, parfum, vitamines A, E et D.',
  en: 'Water, carrot extract, turmeric extract, cetyl alcohol, sodium benzoate, fragrance, vitamins A, E and D.',
}

const INGREDIENTS_COLLAGENE: Localized = {
  fr: 'Eau, collagène marin, alcool cétylique, benzoate de sodium, parfum, vitamines A, E et D.',
  en: 'Water, marine collagen, cetyl alcohol, sodium benzoate, fragrance, vitamins A, E and D.',
}

const INGREDIENTS_KARITE_ALOE: Localized = {
  fr: "Eau, beurre de karité, gel d'aloe vera, alcool cétylique, benzoate de sodium, parfum, vitamines A, E et D.",
  en: 'Water, shea butter, aloe vera gel, cetyl alcohol, sodium benzoate, fragrance, vitamins A, E and D.',
}

const INGREDIENTS_MANGUE_MIEL: Localized = {
  fr: 'Eau, beurre de mangue, miel, alcool cétylique, benzoate de sodium, parfum, vitamines A, E et D.',
  en: 'Water, mango butter, honey, cetyl alcohol, sodium benzoate, fragrance, vitamins A, E and D.',
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
  mainImage: string
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
    mainImage: savonUnifie,
    products: [
      {
        type: { fr: 'Savon', en: 'Soap' },
        poids: '180 g',
        symbol: '◼',
        description: {
          fr: 'Savon purifiant enrichi aux extraits de curcuma et de carotte. Nettoie en douceur tout en déposant les actifs éclairants dès le premier contact. Unifie progressivement le teint et laisse la peau lumineuse.',
          en: 'Purifying soap enriched with turmeric and carrot extracts. Gently cleanses while depositing brightening actives from the very first contact. Gradually evens out the complexion and leaves skin luminous.',
        },
        image: savonUnifie,
      },
      {
        type: { fr: 'Lotion', en: 'Lotion' },
        poids: '100 ml',
        symbol: '◻',
        description: {
          fr: 'TEINT UNIFIÉ. Lotion légère aux extraits de carotte et curcuma. S\'absorbe rapidement pour illuminer et unifier le teint au quotidien. À utiliser après le nettoyage pour une synergie éclat naturel optimale.',
          en: 'UNIFIED COMPLEXION. Light lotion with carrot and turmeric extracts. Absorbs quickly to brighten and even out the complexion every day. Use after cleansing for an optimal natural glow synergy.',
        },
        image: lotionUnifiee,
        details: {
          nom: { fr: 'Lotion Visage Unifiante', en: 'Even-Tone Face Lotion' },
          promesses: PROMESSES,
          actifs: { fr: 'Extrait de Carotte & Curcuma', en: 'Carrot Extract & Turmeric' },
          proprietes: {
            fr: "Cette lotion légère agit en douceur sur le grain de peau du visage : elle unifie le teint, nourrit intensément et révèle un éclat naturel et homogène. Sa formule enrichie en extraits de carotte et de curcuma est spécialement conçue pour sublimer les teints ternes ou marqués par des irrégularités.",
            en: 'This lightweight lotion gently works on facial skin texture: it evens the complexion, deeply nourishes and reveals a natural, uniform glow. Its formula, enriched with carrot and turmeric extracts, is specially designed to enhance dull complexions or skin marked by uneven tone.',
          },
          ingredients: INGREDIENTS_CAROTTE_CURCUMA,
          modeEmploi: MODE_EMPLOI_LOTION,
          precautions: PRECAUTIONS_VISAGE,
        },
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
        details: {
          nom: { fr: 'Crème Visage Unifiante', en: 'Even-Tone Face Cream' },
          promesses: PROMESSES,
          actifs: { fr: 'Extrait de Carotte & Curcuma', en: 'Carrot Extract & Turmeric' },
          proprietes: {
            fr: "Cette crème agit en douceur sur le grain de peau du visage : elle unifie le teint, nourrit intensément et révèle un éclat naturel et homogène. Sa formule enrichie en extraits de carotte et de curcuma est spécialement conçue pour sublimer les teints ternes ou marqués par des irrégularités.",
            en: 'This cream gently works on facial skin texture: it evens the complexion, deeply nourishes and reveals a natural, uniform glow. Its formula, enriched with carrot and turmeric extracts, is specially designed to enhance dull complexions or skin marked by uneven tone.',
          },
          ingredients: INGREDIENTS_CAROTTE_CURCUMA,
          modeEmploi: MODE_EMPLOI_CREME,
          precautions: PRECAUTIONS_VISAGE,
        },
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
        details: {
          nom: { fr: 'Lotion Corps Unifiante', en: 'Even-Tone Body Lotion' },
          promesses: PROMESSES,
          actifs: { fr: 'Extrait de Carotte & Curcuma', en: 'Carrot Extract & Turmeric' },
          proprietes: {
            fr: "Cette lotion pour le corps agit en douceur sur le grain de peau : elle unifie le teint, nourrit en profondeur et révèle un éclat naturel et homogène. Sa formule enrichie en extraits de carotte et de curcuma est spécialement conçue pour sublimer les peaux ternes ou marquées par un teint irrégulier.",
            en: 'This body lotion gently works on skin texture: it evens out the complexion, deeply nourishes and reveals a natural, uniform glow. Its formula, enriched with carrot extract and turmeric extract, is specially designed to enhance dull skin or skin marked by uneven tone.',
          },
          ingredients: INGREDIENTS_CAROTTE_CURCUMA,
          modeEmploi: MODE_EMPLOI_CORPS,
          precautions: PRECAUTIONS_CORPS,
        },
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
    mainImage: lotionReparee,
    products: [
      {
        type: { fr: 'Savon', en: 'Soap' },
        poids: '180 g',
        symbol: '◼',
        description: {
          fr: "Savon réparateur à l'huile de Marula. Élimine les impuretés tout en déposant les actifs régénérants dès le nettoyage. Idéal pour les peaux abîmées, il initie le processus de restauration cutanée dès la première utilisation.",
          en: 'Repairing soap with Marula oil. Removes impurities while depositing regenerating actives from cleansing. Ideal for damaged skin, it starts the skin restoration process from first use.',
        },
        image: savonRepare,
      },
      {
        type: { fr: 'Lotion', en: 'Lotion' },
        poids: '100 ml',
        symbol: '◻',
        description: {
          fr: "Lotion régénérante post-soin à l'huile de Marula. Légère et pénétrante, elle restaure la barrière cutanée et prépare la peau à recevoir les soins suivants. Utiliser après le nettoyage pour une synergie réparatrice optimale.",
          en: 'Regenerating post-care lotion with Marula oil. Light and fast-absorbing, it restores the skin barrier and prepares the skin for the following care steps. Use after cleansing for an optimal repairing synergy.',
        },
        image: lotionReparee,
        details: {
          nom: { fr: 'Lotion Visage Réparatrice', en: 'Repairing Face Lotion' },
          promesses: PROMESSES,
          actifs: { fr: 'Collagène Marin & Moringa', en: 'Marine Collagen & Moringa' },
          proprietes: {
            fr: "Cette lotion légère agit en profondeur sur les imperfections cutanées du visage : elle apaise, nourrit et répare la peau en douceur. Sa formule enrichie en collagène marin et en moringa est spécialement conçue pour restaurer le confort et l'éclat des peaux du visage fragilisées.",
            en: 'This lightweight lotion works deeply on facial skin imperfections: it soothes, nourishes and gently repairs the skin. Its formula, enriched with marine collagen and moringa, is specially designed to restore comfort and radiance to weakened facial skin.',
          },
          ingredients: INGREDIENTS_COLLAGENE,
          modeEmploi: MODE_EMPLOI_LOTION,
          precautions: PRECAUTIONS_VISAGE,
        },
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
        details: {
          nom: { fr: 'Crème Visage Réparatrice', en: 'Repairing Face Cream' },
          promesses: PROMESSES,
          actifs: { fr: 'Collagène Marin & Moringa', en: 'Marine Collagen & Moringa' },
          proprietes: {
            fr: "Cette crème agit en profondeur sur les imperfections cutanées du visage : elle apaise, nourrit et répare la peau en douceur. Sa formule enrichie en collagène marin et en moringa est spécialement conçue pour restaurer le confort et l'éclat des peaux du visage fragilisées.",
            en: 'This cream works deeply on facial skin imperfections: it soothes, nourishes and gently repairs the skin. Its formula, enriched with marine collagen and moringa, is specially designed to restore comfort and radiance to weakened facial skin.',
          },
          ingredients: INGREDIENTS_COLLAGENE,
          modeEmploi: MODE_EMPLOI_CREME,
          precautions: PRECAUTIONS_VISAGE,
        },
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
        details: {
          nom: { fr: 'Lotion Corps Réparatrice', en: 'Repairing Body Lotion' },
          promesses: PROMESSES,
          actifs: { fr: 'Collagène Marin & Moringa', en: 'Marine Collagen & Moringa' },
          proprietes: {
            fr: "Cette lotion pour le corps agit en profondeur sur les imperfections cutanées, apaise et répare la peau en douceur. Sa formule enrichie en collagène marin et en moringa est spécialement conçue pour restaurer l'éclat et le confort des peaux fragiles ou abîmées.",
            en: 'This body lotion works deeply on skin imperfections, soothing and gently repairing the skin. Its formula, enriched with marine collagen and moringa, is specially designed to restore radiance and comfort to fragile or damaged skin.',
          },
          ingredients: INGREDIENTS_COLLAGENE,
          modeEmploi: MODE_EMPLOI_CORPS,
          precautions: PRECAUTIONS_CORPS,
        },
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
    mainImage: cremeHydratee,
    products: [
      {
        type: { fr: 'Savon', en: 'Soap' },
        poids: '180 g',
        symbol: '◼',
        description: {
          fr: "Savon fraîcheur à l'aloe vera et au concombre. Nettoie en douceur et laisse une sensation de fraîcheur immédiate. Idéal pour les peaux sensibles ou les climats chauds, il prépare la peau à absorber les soins hydratants suivants.",
          en: 'Fresh soap with aloe vera and cucumber. Gently cleanses and leaves an immediate feeling of freshness. Ideal for sensitive skin or hot climates, it prepares the skin to absorb the following hydrating care.',
        },
        image: savonHydrate,
      },
      {
        type: { fr: 'Lotion', en: 'Lotion' },
        poids: '100 ml',
        symbol: '◻',
        description: {
          fr: "Lotion hydratante légère à l'aloe vera. Formule aquatique qui sature la peau en eau et lui apporte tonus et légèreté. À utiliser matin et soir pour maintenir le niveau d'hydratation optimal de la peau.",
          en: "Light hydrating lotion with aloe vera. An aquatic formula that saturates the skin with water and brings tone and lightness. Use morning and evening to maintain the skin's optimal hydration level.",
        },
        image: lotionHydratee,
        details: {
          nom: { fr: 'Lotion Visage Hydratante', en: 'Hydrating Face Lotion' },
          promesses: PROMESSES,
          actifs: { fr: 'Beurre de Karité & Aloe Vera', en: 'Shea Butter & Aloe Vera' },
          proprietes: {
            fr: "Cette lotion légère offre une hydratation intense et durable au visage : elle nourrit, apaise et adoucit la peau en profondeur. Sa formule enrichie en beurre de karité et en aloe vera est spécialement conçue pour restaurer le confort des peaux du visage sèches ou déshydratées.",
            en: 'This lightweight lotion provides intense, long-lasting hydration to the face: it deeply nourishes, soothes and softens the skin. Its formula, enriched with shea butter and aloe vera, is specially designed to restore comfort to dry or dehydrated facial skin.',
          },
          ingredients: INGREDIENTS_KARITE_ALOE,
          modeEmploi: MODE_EMPLOI_LOTION,
          precautions: PRECAUTIONS_VISAGE,
        },
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
        details: {
          nom: { fr: 'Lotion Corps Hydratante', en: 'Hydrating Body Lotion' },
          promesses: PROMESSES,
          actifs: { fr: 'Beurre de Karité & Aloe Vera', en: 'Shea Butter & Aloe Vera' },
          proprietes: {
            fr: "Cette lotion pour le corps offre une hydratation intense et durable : elle nourrit, apaise et adoucit la peau en profondeur. Sa formule enrichie en beurre de karité et en aloe vera est spécialement conçue pour restaurer le confort des peaux sèches ou déshydratées.",
            en: 'This body lotion provides intense, long-lasting hydration: it nourishes, soothes and deeply softens the skin. Its formula, enriched with shea butter and aloe vera, is specially designed to restore comfort to dry or dehydrated skin.',
          },
          ingredients: INGREDIENTS_KARITE_ALOE,
          modeEmploi: MODE_EMPLOI_CORPS,
          precautions: PRECAUTIONS_CORPS,
        },
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
    mainImage: laitNourri,
    products: [
      {
        type: { fr: 'Savon', en: 'Soap' },
        poids: '180 g',
        symbol: '◼',
        description: {
          fr: "Savon nourrissant au beurre de mangue. Transforme le moment du soin en une expérience sensorielle riche tout en enveloppant la peau d'une douceur incomparable. Idéal pour les peaux sèches qui ont besoin de nutrition dès le nettoyage.",
          en: 'Nourishing soap with mango butter. Turns the care ritual into a rich sensory experience while wrapping the skin in incomparable softness. Ideal for dry skin that needs nutrition from cleansing.',
        },
        image: savonNourri,
      },
      {
        type: { fr: 'Lotion', en: 'Lotion' },
        poids: '100 ml',
        symbol: '◻',
        description: {
          fr: "Lotion nutritive corps au beurre de mangue et huile d'avocat. Légère mais intensément nourrissante, elle prépare et complète l'action de la crème pour une nutrition continue et un éclat durable tout au long de la journée.",
          en: "Nourishing body lotion with mango butter and avocado oil. Light yet intensely nourishing, it prepares and complements the cream's action for continuous nutrition and lasting glow throughout the day.",
        },
        image: lotionNourrie,
        details: {
          nom: { fr: 'Lotion Visage Nourrissante', en: 'Nourishing Face Lotion' },
          promesses: PROMESSES,
          actifs: { fr: 'Beurre de Mangue & Miel', en: 'Mango Butter & Honey' },
          proprietes: {
            fr: "Cette lotion légère nourrit intensément la peau du visage et lui redonne souplesse et confort. Sa formule enrichie en beurre de mangue et en miel est spécialement conçue pour restaurer l'éclat et la douceur des peaux du visage sèches ou fatiguées.",
            en: 'This lightweight lotion deeply nourishes facial skin and restores suppleness and comfort. Its formula, enriched with mango butter and honey, is specially designed to restore radiance and softness to dry or tired facial skin.',
          },
          ingredients: INGREDIENTS_MANGUE_MIEL,
          modeEmploi: MODE_EMPLOI_LOTION,
          precautions: PRECAUTIONS_VISAGE,
        },
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
        details: {
          nom: { fr: 'Lotion Corps Nourrissante', en: 'Nourishing Body Lotion' },
          promesses: PROMESSES,
          actifs: { fr: 'Beurre de Mangue & Miel', en: 'Mango Butter & Honey' },
          proprietes: {
            fr: "Cette lotion pour le corps nourrit intensément la peau et lui redonne douceur et confort. Sa formule enrichie en beurre de mangue et en miel est spécialement conçue pour restaurer l'éclat et la douceur des peaux sèches ou fatiguées.",
            en: 'This body lotion deeply nourishes the skin, restoring softness and comfort. Its formula, enriched with mango butter and honey, is specially designed to restore radiance and softness to dry or tired skin.',
          },
          ingredients: INGREDIENTS_MANGUE_MIEL,
          modeEmploi: MODE_EMPLOI_CORPS,
          precautions: PRECAUTIONS_CORPS,
        },
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
    mainImage: g.mainImage,
    products: g.products.map(p => ({
      type: p.type[lang],
      poids: p.poids,
      symbol: p.symbol,
      description: p.description[lang],
      image: p.image,
      details: p.details
        ? {
            nom: p.details.nom[lang],
            promesses: p.details.promesses[lang],
            actifs: p.details.actifs[lang],
            proprietes: p.details.proprietes[lang],
            ingredients: p.details.ingredients[lang],
            modeEmploi: p.details.modeEmploi[lang],
            precautions: p.details.precautions[lang],
          }
        : undefined,
    })),
  }))
}
