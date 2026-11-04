<?php
/**
 * Contenu initial du site, repris de src/data.ts (FR + EN).
 * Utilisé uniquement par scripts/seed.php lors de la première installation.
 */

$promesses = [
    'fr' => ["Hydrate intensément", "Nourrit en profondeur", "Adoucit et illumine la peau"],
    'en' => ["Deeply hydrates", "Nourishes in depth", "Softens and brightens the skin"],
];

$modeLotion = [
    'fr' => "Appliquer une à deux pressions sur le visage et le cou parfaitement nettoyés, matin et/ou soir. Répartir uniformément du bout des doigts ou à l'aide d'un coton, en évitant le contour des yeux, jusqu'à absorption complète.",
    'en' => "Apply one to two pumps to a thoroughly cleansed face and neck, morning and/or evening. Spread evenly with fingertips or a cotton pad, avoiding the eye area, until fully absorbed.",
];

$modeCreme = [
    'fr' => "Appliquer matin et/ou soir sur le visage et le cou parfaitement nettoyés et secs. Masser délicatement du centre du visage vers l'extérieur jusqu'à absorption complète. Éviter le contour des yeux.",
    'en' => "Apply morning and/or evening to a thoroughly cleansed and dry face and neck. Gently massage from the center of the face outward until fully absorbed. Avoid the eye area.",
];

$modeCorps = [
    'fr' => "Appliquer sur une peau propre, matin et/ou soir. Masser délicatement par mouvements circulaires jusqu'à absorption complète.",
    'en' => "Apply to clean skin, morning and/or evening. Gently massage in circular motions until fully absorbed.",
];

$precautionsVisage = [
    'fr' => "Éviter tout contact avec les yeux. En cas d'irritation, cesser l'utilisation. Conserver dans un endroit frais et sec, à l'abri de la lumière directe.",
    'en' => "Avoid contact with eyes. If irritation occurs, discontinue use. Store in a cool, dry place away from direct light.",
];

$precautionsCorps = [
    'fr' => "Éviter tout contact avec les yeux. Conserver dans un endroit frais et sec, à l'abri de la lumière directe.",
    'en' => "Avoid contact with eyes. Store in a cool, dry place away from direct light.",
];

$ingredientsCarotteCurcuma = [
    'fr' => "Eau, extrait de carotte, extrait de curcuma, alcool cétylique, benzoate de sodium, parfum, vitamines A, E et D.",
    'en' => "Water, carrot extract, turmeric extract, cetyl alcohol, sodium benzoate, fragrance, vitamins A, E and D.",
];

$ingredientsCollagene = [
    'fr' => "Eau, collagène marin, alcool cétylique, benzoate de sodium, parfum, vitamines A, E et D.",
    'en' => "Water, marine collagen, cetyl alcohol, sodium benzoate, fragrance, vitamins A, E and D.",
];

$ingredientsKariteAloe = [
    'fr' => "Eau, beurre de karité, gel d'aloe vera, alcool cétylique, benzoate de sodium, parfum, vitamines A, E et D.",
    'en' => "Water, shea butter, aloe vera gel, cetyl alcohol, sodium benzoate, fragrance, vitamins A, E and D.",
];

$ingredientsMangueMiel = [
    'fr' => "Eau, beurre de mangue, miel, alcool cétylique, benzoate de sodium, parfum, vitamines A, E et D.",
    'en' => "Water, mango butter, honey, cetyl alcohol, sodium benzoate, fragrance, vitamins A, E and D.",
];

$details = static function (array $nom, array $actifs, array $proprietes, array $ingredients, array $modeEmploi, array $precautions) use ($promesses): array {
    return [
        'nom' => $nom,
        'promesses' => $promesses,
        'actifs' => $actifs,
        'proprietes' => $proprietes,
        'ingredients' => $ingredients,
        'modeEmploi' => $modeEmploi,
        'precautions' => $precautions,
    ];
};

return [
    'settings' => [
        'site_name' => "Teint d'Afrique Cosmétiques",
        'tagline_fr' => "Des soins naturels qui révèlent votre éclat",
        'tagline_en' => "Natural care that reveals your glow",
        'email' => 'contact@teintdafrique.com',
        'phone' => '',
        'whatsapp_number' => '237000000000',
        'address_fr' => 'Douala, Cameroun',
        'address_en' => 'Douala, Cameroon',
        'hours_fr' => 'Lun – Sam : 8h – 18h',
        'hours_en' => 'Mon – Sat: 8am – 6pm',
        'instagram_url' => '',
        'facebook_url' => '',
        'tiktok_url' => '',
        'youtube_url' => '',
    ],
    'content' => [
        'accueil' => [
            [
                'key' => 'categories_lead',
                'type' => 'text',
                'fr' => 'Quatre gestes, quatre textures, une même exigence : révéler votre peau sans jamais la transformer.',
                'en' => 'Four gestures, four textures, one standard: reveal your skin without ever transforming it.',
            ],
            [
                'key' => 'brand_lead',
                'type' => 'text',
                'fr' => "Nous croyons que chaque carnation est une beauté à part entière. Nos soins révèlent, nourrissent et célèbrent la peau noire — sans jamais chercher à l'altérer.",
                'en' => 'We believe every complexion is beauty in its own right. Our care reveals, nourishes and celebrates black skin — without ever seeking to alter it.',
            ],
            [
                'key' => 'ingredients_lead',
                'type' => 'text',
                'fr' => 'Aloe vera, karité, curcuma, miel, mangue… des actifs botaniques sourcés en Afrique, choisis pour leur efficacité et leur douceur.',
                'en' => 'Aloe vera, shea, turmeric, honey, mango… botanical actives sourced in Africa, chosen for their efficacy and gentleness.',
            ],
            [
                'key' => 'signature_lead',
                'type' => 'text',
                'fr' => 'Quatre formules, quatre gammes, une même promesse : des soins naturels qui révèlent votre peau.',
                'en' => 'Four formulas, four ranges, one promise: natural care that reveals your skin.',
            ],
            [
                'key' => 'ritual_lead',
                'type' => 'text',
                'fr' => 'Chaque gamme décline ce rituel en quatre soins complémentaires, du nettoyage à la nutrition.',
                'en' => 'Each range translates this ritual into four complementary products, from cleansing to nutrition.',
            ],
            [
                'key' => 'promise_lead',
                'type' => 'text',
                'fr' => 'Nous célébrons chaque carnation dans sa beauté naturelle et singulière.',
                'en' => 'We celebrate every complexion in its natural, singular beauty.',
            ],
            [
                'key' => 'cta_lead',
                'type' => 'text',
                'fr' => 'Prenez soin de vous, avec des soins pensés pour votre peau et votre climat.',
                'en' => 'Take care of yourself, with care designed for your skin and your climate.',
            ],
            ['key' => 'trust_1_title', 'type' => 'text', 'fr' => '100% Naturel', 'en' => '100% Natural'],
            ['key' => 'trust_1_copy', 'type' => 'text', 'fr' => "Des formules d'origine naturelle, sans compromis.", 'en' => 'Naturally derived formulas, with no compromise.'],
            ['key' => 'trust_2_title', 'type' => 'text', 'fr' => '100% Camerounais', 'en' => '100% Cameroonian'],
            ['key' => 'trust_2_copy', 'type' => 'text', 'fr' => 'Imaginée et formulée à Douala.', 'en' => 'Imagined and formulated in Douala.'],
            ['key' => 'trust_3_title', 'type' => 'text', 'fr' => 'Pour toutes les peaux', 'en' => 'For every skin'],
            ['key' => 'trust_3_copy', 'type' => 'text', 'fr' => 'Noires, métissées et albinos.', 'en' => 'Black, mixed-race and albino.'],
            ['key' => 'trust_4_title', 'type' => 'text', 'fr' => 'Qualité garantie', 'en' => 'Guaranteed quality'],
            ['key' => 'trust_4_copy', 'type' => 'text', 'fr' => 'Des soins doux, testés et sûrs.', 'en' => 'Gentle, tested and safe care.'],
            ['key' => 'categories_label', 'type' => 'text', 'fr' => 'Nos catégories', 'en' => 'Our categories'],
            ['key' => 'categories_title_1', 'type' => 'text', 'fr' => 'Des soins pour', 'en' => 'Care for'],
            ['key' => 'categories_title_2', 'type' => 'text', 'fr' => 'chaque besoin.', 'en' => 'every need.'],
            ['key' => 'categories_cta', 'type' => 'text', 'fr' => 'Voir toutes les gammes', 'en' => 'See all ranges'],
            ['key' => 'categories_count', 'type' => 'text', 'fr' => '4 gammes', 'en' => '4 ranges'],
            ['key' => 'brand_label', 'type' => 'text', 'fr' => 'La marque', 'en' => 'The brand'],
            ['key' => 'brand_title_1', 'type' => 'text', 'fr' => 'La beauté', 'en' => 'Beauty'],
            ['key' => 'brand_title_2', 'type' => 'text', 'fr' => 'au naturel.', 'en' => 'au naturel.'],
            ['key' => 'brand_cta', 'type' => 'text', 'fr' => 'Notre histoire', 'en' => 'Our story'],
            ['key' => 'founder_name', 'type' => 'text', 'fr' => 'Minette Kamdem-Jambong', 'en' => 'Minette Kamdem-Jambong'],
            ['key' => 'founder_role', 'type' => 'text', 'fr' => 'Fondatrice & Créatrice', 'en' => 'Founder & Creator'],
            ['key' => 'founder_alt', 'type' => 'text', 'fr' => 'Minette Kamdem-Jambong, fondatrice de Teint d’Afrique Cosmétiques', 'en' => 'Minette Kamdem-Jambong, founder of Teint d’Afrique Cosmétiques'],
            ['key' => 'ingredients_label', 'type' => 'text', 'fr' => 'Les ingrédients', 'en' => 'The ingredients'],
            ['key' => 'ingredients_title_1', 'type' => 'text', 'fr' => 'Le meilleur', 'en' => 'The best'],
            ['key' => 'ingredients_title_2', 'type' => 'text', 'fr' => 'de la nature.', 'en' => 'of nature.'],
            ['key' => 'ingredients_cta', 'type' => 'text', 'fr' => 'Notre expertise', 'en' => 'Our expertise'],
            ['key' => 'ingredients_alt', 'type' => 'text', 'fr' => 'Ingrédients botaniques Teint d’Afrique : karité, curcuma, mangue, aloe vera et avocat', 'en' => 'Botanical ingredients from Teint d’Afrique: shea, turmeric, mango, aloe vera and avocado'],
            ['key' => 'signature_label', 'type' => 'text', 'fr' => 'Les incontournables', 'en' => 'The essentials'],
            ['key' => 'signature_title', 'type' => 'text', 'fr' => 'Nos soins signature', 'en' => 'Our signature care'],
            ['key' => 'signature_cta', 'type' => 'text', 'fr' => 'Tous les soins', 'en' => 'All our care'],
            ['key' => 'order_cta', 'type' => 'text', 'fr' => 'Commander', 'en' => 'Order'],
            ['key' => 'ritual_label', 'type' => 'text', 'fr' => 'Le rituel', 'en' => 'The ritual'],
            ['key' => 'ritual_title_1', 'type' => 'text', 'fr' => 'Quatre gestes,', 'en' => 'Four gestures,'],
            ['key' => 'ritual_title_2', 'type' => 'text', 'fr' => 'une peau lumineuse.', 'en' => 'luminous skin.'],
            ['key' => 'ritual_note', 'type' => 'text', 'fr' => '4 gammes · 4 soins · Savon · Lotion · Crème · Lait', 'en' => '4 ranges · 4 products · Soap · Lotion · Cream · Milk'],
            ['key' => 'ritual_cta', 'type' => 'text', 'fr' => 'Trouver mon rituel', 'en' => 'Find my ritual'],
            ['key' => 'promise_label', 'type' => 'text', 'fr' => 'Notre promesse', 'en' => 'Our promise'],
            ['key' => 'promise_title_1', 'type' => 'text', 'fr' => 'Une beauté qui ne se change pas.', 'en' => 'Beauty that is not changed.'],
            ['key' => 'promise_title_2', 'type' => 'text', 'fr' => 'Elle se révèle.', 'en' => 'It is revealed.'],
            ['key' => 'promise_1_title', 'type' => 'text', 'fr' => 'Sans éclaircissement', 'en' => 'No lightening'],
            ['key' => 'promise_1_copy', 'type' => 'text', 'fr' => "Aucun actif n'altère la couleur naturelle de votre peau. Jamais.", 'en' => 'No active alters the natural colour of your skin. Ever.'],
            ['key' => 'promise_2_title', 'type' => 'text', 'fr' => 'Formulé en Afrique', 'en' => 'Formulated in Africa'],
            ['key' => 'promise_2_copy', 'type' => 'text', 'fr' => 'Des actifs botaniques sourcés localement, pensés pour nos climats.', 'en' => 'Botanical actives sourced locally, designed for our climates.'],
            ['key' => 'promise_3_title', 'type' => 'text', 'fr' => 'Pour toutes les carnations', 'en' => 'For every complexion'],
            ['key' => 'promise_3_copy', 'type' => 'text', 'fr' => 'Peaux noires, métissées et albinos, célébrées à parts égales.', 'en' => 'Black, mixed-race and albino skin, celebrated equally.'],
            ['key' => 'cta_label', 'type' => 'text', 'fr' => 'Le rituel continue', 'en' => 'The ritual continues'],
            ['key' => 'cta_title_1', 'type' => 'text', 'fr' => 'Votre peau', 'en' => 'Your skin'],
            ['key' => 'cta_title_2', 'type' => 'text', 'fr' => "vaut de l'or.", 'en' => 'is worth gold.'],
            ['key' => 'cta_primary', 'type' => 'text', 'fr' => 'Commander sur WhatsApp', 'en' => 'Order on WhatsApp'],
            ['key' => 'cta_secondary', 'type' => 'text', 'fr' => 'Découvrir les gammes', 'en' => 'Discover the ranges'],
            ['key' => 'marquee_1', 'type' => 'text', 'fr' => '#AUTHENTIQUE', 'en' => '#AUTHENTIC'],
            ['key' => 'marquee_2', 'type' => 'text', 'fr' => '100% NATUREL', 'en' => '100% NATURAL'],
            ['key' => 'marquee_3', 'type' => 'text', 'fr' => '#PLURIELLE', 'en' => '#PLURAL'],
            ['key' => 'marquee_4', 'type' => 'text', 'fr' => 'FORMULÉ EN AFRIQUE', 'en' => 'FORMULATED IN AFRICA'],
            ['key' => 'marquee_5', 'type' => 'text', 'fr' => '#INCLUSIVE', 'en' => '#INCLUSIVE'],
            ['key' => 'marquee_6', 'type' => 'text', 'fr' => 'SANS ÉCLAIRCISSEMENT', 'en' => 'NO LIGHTENING'],
            ['key' => 'marquee_7', 'type' => 'text', 'fr' => '#NATURELLE', 'en' => '#NATURAL'],
            ['key' => 'marquee_8', 'type' => 'text', 'fr' => 'DOUALA · CAMEROUN', 'en' => 'DOUALA · CAMEROON'],
            [
                'key' => 'fondatrice_image',
                'type' => 'image',
                'fr' => '',
                'en' => '',
            ],
        ],
        'boutique' => [
            ['key' => 'title', 'type' => 'text', 'fr' => 'Boutique', 'en' => 'Shop'],
            ['key' => 'lead', 'type' => 'text', 'fr' => 'Chaque gamme possède son univers, ses actifs botaniques et ses formules exclusives. 4 produits par gamme, pensés pour les peaux noires et métissées.', 'en' => 'Each range has its own universe, botanical actives and exclusive formulas. 4 products per range, designed for black and mixed-race skin.'],
            ['key' => 'product_count', 'type' => 'text', 'fr' => '4 produits', 'en' => '4 products'],
            ['key' => 'card_cta', 'type' => 'text', 'fr' => 'Découvrir la gamme →', 'en' => 'Discover the range →'],
            ['key' => 'promise_label', 'type' => 'text', 'fr' => 'Notre engagement produit', 'en' => 'Our product commitment'],
            ['key' => 'promise_title_1', 'type' => 'text', 'fr' => '100% naturel, formules uniques,', 'en' => '100% natural, unique formulas,'],
            ['key' => 'promise_title_2', 'type' => 'text', 'fr' => 'adaptées à votre peau.', 'en' => 'adapted to your skin.'],
            ['key' => 'promise_text', 'type' => 'text', 'fr' => 'Pour chaque produit, nous relevons le défi de créer des formules uniques et innovantes en utilisant exclusivement des options naturelles. Chaque gamme comprend un savon (180 g), une lotion (100 ml), une crème de visage (100 ml) et un lait corps (500 ml).', 'en' => 'For each product, we take on the challenge of creating unique and innovative formulas using exclusively natural options. Each range includes a soap (180 g), a lotion (100 ml), a face cream (100 ml) and a body milk (500 ml).'],
            ['key' => 'stat_1_label', 'type' => 'text', 'fr' => '4 Gammes', 'en' => '4 Ranges'],
            ['key' => 'stat_1_desc', 'type' => 'text', 'fr' => 'Éclat Naturel · Réparation · Hydratation · Nutrition', 'en' => 'Natural Radiance · Repair · Hydration · Nutrition'],
            ['key' => 'stat_2_label', 'type' => 'text', 'fr' => '16 Produits', 'en' => '16 Products'],
            ['key' => 'stat_2_desc', 'type' => 'text', 'fr' => '4 produits par gamme, formulés exclusivement', 'en' => '4 products per range, exclusively formulated'],
            ['key' => 'stat_3_label', 'type' => 'text', 'fr' => '100% Naturel', 'en' => '100% Natural'],
            ['key' => 'stat_3_desc', 'type' => 'text', 'fr' => 'Ingrédients botaniques de la plus haute qualité', 'en' => 'Botanical ingredients of the highest quality'],
        ],
        'fondatrice' => [
            [
                'key' => 'title',
                'type' => 'text',
                'fr' => 'Notre Fondatrice',
                'en' => 'Our Founder',
            ],
            [
                'key' => 'role',
                'type' => 'text',
                'fr' => 'Fondatrice & Créatrice — #TeintdAfriqueCosmetiques',
                'en' => 'Founder & Creator — #TeintdAfriqueCosmetiques',
            ],
            ['key' => 'image', 'type' => 'image', 'fr' => '', 'en' => ''],
        ],
        'vision' => [
            [
                'key' => 'title',
                'type' => 'text',
                'fr' => 'Notre Vision de la Beauté Africaine',
                'en' => 'Our Vision of African Beauty',
            ],
            [
                'key' => 'lead',
                'type' => 'text',
                'fr' => "La femme africaine est magnifique, et il est temps qu'elle le sache.",
                'en' => "The African woman is magnificent, and it's time she knew it.",
            ],
            ['key' => 'image', 'type' => 'image', 'fr' => '', 'en' => ''],
        ],
        'engagements' => [
            [
                'key' => 'title',
                'type' => 'text',
                'fr' => 'Nos Engagements',
                'en' => 'Our Commitments',
            ],
            [
                'key' => 'lead',
                'type' => 'text',
                'fr' => "Notre peau n'a pas besoin de changer de couleur pour être belle. Elle mérite d'être comprise, respectée et sublimée.",
                'en' => 'Our skin does not need to change colour to be beautiful. It deserves to be understood, respected and enhanced.',
            ],
            ['key' => 'image', 'type' => 'image', 'fr' => '', 'en' => ''],
        ],
        'valeurs' => [
            [
                'key' => 'title',
                'type' => 'text',
                'fr' => 'Nos Valeurs et Ambitions',
                'en' => 'Our Values and Ambitions',
            ],
            [
                'key' => 'lead',
                'type' => 'text',
                'fr' => 'Être soi, sans compromis.',
                'en' => 'Be yourself, without compromise.',
            ],
        ],
        'expertise' => [
            [
                'key' => 'title',
                'type' => 'text',
                'fr' => 'Notre Expertise',
                'en' => 'Our Expertise',
            ],
            [
                'key' => 'lead',
                'type' => 'text',
                'fr' => 'Experts de la beauté de la peau noire, métissée et albinos.',
                'en' => 'Experts in the beauty of black, mixed-race and albino skin.',
            ],
            ['key' => 'image', 'type' => 'image', 'fr' => '', 'en' => ''],
        ],
        'nos-produits' => [
            [
                'key' => 'title',
                'type' => 'text',
                'fr' => 'Quatre univers, seize soins',
                'en' => 'Four universes, sixteen products',
            ],
            [
                'key' => 'lead',
                'type' => 'text',
                'fr' => 'Chaque gamme possède son univers, ses actifs botaniques et ses formules exclusives. 4 produits par gamme, pensés pour les peaux noires et métissées.',
                'en' => 'Each range has its own universe, botanical actives and exclusive formulas. 4 products per range, designed for black and mixed-race skin.',
            ],
            [
                'key' => 'intro',
                'type' => 'text',
                'fr' => 'Choisissez votre gamme, puis composez votre rituel en quatre gestes : nettoyer, tonifier, unifier, nourrir.',
                'en' => 'Choose your range, then build your ritual in four steps: cleanse, tone, even out, nourish.',
            ],
            ['key' => 'shop_label', 'type' => 'text', 'fr' => 'La boutique', 'en' => 'The shop'],
            ['key' => 'view_gammes', 'type' => 'text', 'fr' => 'Voir les gammes', 'en' => 'See the ranges'],
            ['key' => 'stat_chip_gammes', 'type' => 'text', 'fr' => '4 Gammes', 'en' => '4 Ranges'],
            ['key' => 'stat_chip_produits', 'type' => 'text', 'fr' => '16 Produits', 'en' => '16 Products'],
            ['key' => 'rituels_title_1', 'type' => 'text', 'fr' => 'Des rituels complets,', 'en' => 'Complete rituals,'],
            ['key' => 'rituels_title_2', 'type' => 'text', 'fr' => 'pour chaque peau.', 'en' => 'for every skin.'],
            ['key' => 'card_cta', 'type' => 'text', 'fr' => 'Découvrir la gamme', 'en' => 'Discover the range'],
            ['key' => 'promise_label', 'type' => 'text', 'fr' => 'Notre engagement produit', 'en' => 'Our product commitment'],
            ['key' => 'promise_title_1', 'type' => 'text', 'fr' => '100% naturel, formules uniques,', 'en' => '100% natural, unique formulas,'],
            ['key' => 'promise_title_2', 'type' => 'text', 'fr' => 'adaptées à votre peau.', 'en' => 'adapted to your skin.'],
            ['key' => 'promise_text', 'type' => 'text', 'fr' => 'Pour chaque produit, nous relevons le défi de créer des formules uniques et innovantes en utilisant exclusivement des options naturelles. Chaque gamme comprend un savon (180 g), une lotion (100 ml), une crème de visage (100 ml) et un lait corps (500 ml).', 'en' => 'For each product, we take on the challenge of creating unique and innovative formulas using exclusively natural options. Each range includes a soap (180 g), a lotion (100 ml), a face cream (100 ml) and a body milk (500 ml).'],
            ['key' => 'stats_1_label', 'type' => 'text', 'fr' => 'Gammes', 'en' => 'Ranges'],
            ['key' => 'stats_1_desc', 'type' => 'text', 'fr' => 'Éclat Naturel · Réparation · Hydratation · Nutrition', 'en' => 'Natural Radiance · Repair · Hydration · Nutrition'],
            ['key' => 'stats_2_label', 'type' => 'text', 'fr' => 'Produits', 'en' => 'Products'],
            ['key' => 'stats_2_desc', 'type' => 'text', 'fr' => '4 produits par gamme, formulés exclusivement', 'en' => '4 products per range, exclusively formulated'],
            ['key' => 'stats_3_label', 'type' => 'text', 'fr' => 'Naturel', 'en' => 'Natural'],
            ['key' => 'stats_3_desc', 'type' => 'text', 'fr' => 'Ingrédients botaniques de la plus haute qualité', 'en' => 'Botanical ingredients of the highest quality'],
            ['key' => 'quality_badge', 'type' => 'text', 'fr' => 'Qualité garantie', 'en' => 'Guaranteed quality'],
            ['key' => 'image', 'type' => 'image', 'fr' => '', 'en' => ''],
        ],
        'gamme' => [
            ['key' => 'discover_four', 'type' => 'text', 'fr' => 'Découvrir les 4 soins', 'en' => 'Discover the 4 products'],
            ['key' => 'order_range', 'type' => 'text', 'fr' => 'Commander la gamme', 'en' => 'Order the range'],
            ['key' => 'four_products', 'type' => 'text', 'fr' => '4 soins', 'en' => '4 products'],
            ['key' => 'product_types', 'type' => 'text', 'fr' => 'Savon · Lotion · Crème · Lait', 'en' => 'Soap · Lotion · Cream · Milk'],
            ['key' => 'range_label', 'type' => 'text', 'fr' => 'La gamme', 'en' => 'The range'],
            ['key' => 'key_actives', 'type' => 'text', 'fr' => 'Actifs Clés', 'en' => 'Key actives'],
            ['key' => 'four_products_label', 'type' => 'text', 'fr' => 'Les 4 soins', 'en' => 'The 4 products'],
            ['key' => 'ritual_note', 'type' => 'text', 'fr' => 'Du nettoyage à la nutrition, chaque soin prépare le suivant.', 'en' => 'From cleansing to nutrition, each product prepares the next.'],
            ['key' => 'ritual_label', 'type' => 'text', 'fr' => 'Le rituel', 'en' => 'The ritual'],
            ['key' => 'ritual_title_1', 'type' => 'text', 'fr' => 'Quatre soins,', 'en' => 'Four products,'],
            ['key' => 'ritual_title_2', 'type' => 'text', 'fr' => 'un seul rituel.', 'en' => 'one ritual.'],
            ['key' => 'other_label', 'type' => 'text', 'fr' => "Explorer d'autres gammes", 'en' => 'Explore other ranges'],
            ['key' => 'other_title', 'type' => 'text', 'fr' => 'Compléter le rituel', 'en' => 'Complete the ritual'],
            ['key' => 'all_ranges', 'type' => 'text', 'fr' => 'Toutes les gammes', 'en' => 'All ranges'],
            ['key' => 'not_found', 'type' => 'text', 'fr' => 'Gamme introuvable', 'en' => 'Range not found'],
            ['key' => 'back_shop', 'type' => 'text', 'fr' => '← Retour à la boutique', 'en' => '← Back to the shop'],
        ],
        'types' => [
            [
                'key' => 'title',
                'type' => 'text',
                'fr' => 'Types de Produits',
                'en' => 'Product Types',
            ],
            [
                'key' => 'lead',
                'type' => 'text',
                'fr' => '4 types de produits, déclinés dans chacune de nos 4 gammes — soit 16 références formulées pour les peaux noires, métissées et albinos.',
                'en' => '4 product types, available in each of our 4 ranges — 16 references formulated for black, mixed-race and albino skin.',
            ],
            ['key' => 'image', 'type' => 'image', 'fr' => '', 'en' => ''],
        ],
        'vos-besoins' => [
            [
                'key' => 'title',
                'type' => 'text',
                'fr' => 'Vos Besoins',
                'en' => 'Your Needs',
            ],
            [
                'key' => 'lead',
                'type' => 'text',
                'fr' => 'Identifiez le besoin de votre peau et découvrez la gamme faite pour vous.',
                'en' => "Identify your skin's needs and discover the range made for you.",
            ],
        ],
        'vlogs' => [
            [
                'key' => 'title',
                'type' => 'text',
                'fr' => 'Vlogs',
                'en' => 'Vlogs',
            ],
            [
                'key' => 'coming_soon',
                'type' => 'text',
                'fr' => 'Nos Vlogs arrivent bientôt',
                'en' => 'Our Vlogs are coming soon',
            ],
            [
                'key' => 'lead',
                'type' => 'text',
                'fr' => 'Conseils beauté, routines de soin, tutoriels et coulisses de la marque — nos vlogs seront bientôt disponibles. Restez connectées et suivez-nous sur les réseaux sociaux pour ne rien manquer.',
                'en' => "Beauty tips, skincare routines, tutorials and behind the scenes of the brand — our vlogs will soon be available. Stay connected and follow us on social media so you don't miss a thing.",
            ],
        ],
        'contact' => [
            [
                'key' => 'title',
                'type' => 'text',
                'fr' => 'Contact',
                'en' => 'Contact',
            ],
            [
                'key' => 'lead',
                'type' => 'text',
                'fr' => "Nous sommes à votre écoute. Écrivez-nous, retrouvez-nous sur les réseaux sociaux, ou venez nous rendre visite à Douala.",
                'en' => "We're here to listen. Write to us, find us on social media, or come and visit us in Douala.",
            ],
            [
                'key' => 'intro',
                'type' => 'text',
                'fr' => 'Parlons de votre beauté.',
                'en' => "Let's talk about your beauty.",
            ],
            ['key' => 'contact_section_label', 'type' => 'text', 'fr' => '01 — Nous Contacter', 'en' => '01 — Contact Us'],
            ['key' => 'address_label', 'type' => 'text', 'fr' => 'Adresse', 'en' => 'Address'],
            ['key' => 'email_label', 'type' => 'text', 'fr' => 'Email', 'en' => 'Email'],
            ['key' => 'whatsapp_label', 'type' => 'text', 'fr' => 'WhatsApp', 'en' => 'WhatsApp'],
            ['key' => 'whatsapp_cta', 'type' => 'text', 'fr' => 'Nous écrire sur WhatsApp', 'en' => 'Write to us on WhatsApp'],
            ['key' => 'social_label', 'type' => 'text', 'fr' => 'Réseaux Sociaux', 'en' => 'Social Media'],
            ['key' => 'sent_title', 'type' => 'text', 'fr' => 'Message envoyé !', 'en' => 'Message sent!'],
            ['key' => 'sent_text', 'type' => 'text', 'fr' => 'Merci de nous avoir contactés. Nous vous répondrons dans les plus brefs délais.', 'en' => 'Thank you for contacting us. We will get back to you as soon as possible.'],
            ['key' => 'new_message', 'type' => 'text', 'fr' => 'Nouveau message', 'en' => 'New message'],
            ['key' => 'form_title', 'type' => 'text', 'fr' => 'Envoyez-nous un message', 'en' => 'Send us a message'],
            ['key' => 'name_label', 'type' => 'text', 'fr' => 'Nom complet', 'en' => 'Full name'],
            ['key' => 'name_placeholder', 'type' => 'text', 'fr' => 'Votre nom', 'en' => 'Your name'],
            ['key' => 'phone_label', 'type' => 'text', 'fr' => 'Téléphone', 'en' => 'Phone'],
            ['key' => 'message_label', 'type' => 'text', 'fr' => 'Message', 'en' => 'Message'],
            ['key' => 'message_placeholder', 'type' => 'text', 'fr' => 'Votre message, votre demande...', 'en' => 'Your message, your request...'],
            ['key' => 'submit', 'type' => 'text', 'fr' => 'Envoyer le Message', 'en' => 'Send Message'],
            ['key' => 'location_section_label', 'type' => 'text', 'fr' => '02 — Localisation', 'en' => '02 — Location'],
            ['key' => 'location_title', 'type' => 'text', 'fr' => 'Où nous trouver.', 'en' => 'Where to find us.'],
            ['key' => 'city_label', 'type' => 'text', 'fr' => 'Ville', 'en' => 'City'],
            ['key' => 'country_label', 'type' => 'text', 'fr' => 'Pays', 'en' => 'Country'],
            ['key' => 'city_value', 'type' => 'text', 'fr' => 'Douala', 'en' => 'Douala'],
            ['key' => 'country_value', 'type' => 'text', 'fr' => 'Cameroun', 'en' => 'Cameroon'],
            ['key' => 'map_title', 'type' => 'text', 'fr' => "Teint d'Afrique Cosmétiques — Douala, Cameroun", 'en' => "Teint d'Afrique Cosmétiques — Douala, Cameroon"],
            ['key' => 'fullscreen', 'type' => 'text', 'fr' => 'Voir en plein écran ↗', 'en' => 'View full screen ↗'],
            ['key' => 'distributors_section_label', 'type' => 'text', 'fr' => '03 — Nos Distributeurs', 'en' => '03 — Our Distributors'],
            ['key' => 'distributors_title', 'type' => 'text', 'fr' => 'Réseau de distribution.', 'en' => 'Distribution network.'],
            ['key' => 'about_label', 'type' => 'text', 'fr' => 'À propos', 'en' => 'About'],
            ['key' => 'distributors_text', 'type' => 'text', 'fr' => "Nos produits sont actuellement disponibles à Douala. Notre réseau de distributeurs s'étendra progressivement au Cameroun et dans la sous-région. Contactez-nous pour en savoir plus ou pour devenir distributeur.", 'en' => 'Our products are currently available in Douala. Our distributor network will gradually expand across Cameroon and the sub-region. Contact us to learn more or to become a distributor.'],
            ['key' => 'become_distributor', 'type' => 'text', 'fr' => 'Devenir distributeur ↗', 'en' => 'Become a distributor ↗'],
            ['key' => 'partners_label', 'type' => 'text', 'fr' => 'Nos partenaires', 'en' => 'Our partners'],
            ['key' => 'contact_prompt', 'type' => 'text', 'fr' => 'Vous souhaitez distribuer nos produits ?', 'en' => 'Would you like to distribute our products?'],
            ['key' => 'contact_link', 'type' => 'text', 'fr' => 'Contactez-nous', 'en' => 'Contact us'],
        ],
        'localisation' => [
            [
                'key' => 'title',
                'type' => 'text',
                'fr' => 'Localisation',
                'en' => 'Location',
            ],
            [
                'key' => 'lead',
                'type' => 'text',
                'fr' => "Teint d'Afrique Cosmétiques est à Douala.",
                'en' => "Teint d'Afrique Cosmétiques is in Douala.",
            ],
            ['key' => 'image', 'type' => 'image', 'fr' => '', 'en' => ''],
        ],
        'distributeurs' => [
            [
                'key' => 'title',
                'type' => 'text',
                'fr' => 'Nos Distributeurs',
                'en' => 'Our Distributors',
            ],
            [
                'key' => 'lead',
                'type' => 'text',
                'fr' => 'Réseau de distribution en cours de déploiement',
                'en' => 'Distribution network currently being rolled out',
            ],
            [
                'key' => 'intro',
                'type' => 'text',
                'fr' => "Nos produits sont actuellement disponibles à Douala. Notre réseau de distributeurs s'étendra progressivement au Cameroun et dans la sous-région. Contactez-nous pour en savoir plus ou pour devenir distributeur.",
                'en' => 'Our products are currently available in Douala. Our distributor network will gradually expand across Cameroon and the sub-region. Contact us to learn more or to become a distributor.',
            ],
            ['key' => 'become_distributor', 'type' => 'text', 'fr' => 'Devenir distributeur ↗', 'en' => 'Become a distributor ↗'],
        ],
        'produit' => [
            ['key' => 'close', 'type' => 'text', 'fr' => 'Fermer', 'en' => 'Close'],
            ['key' => 'key_actives', 'type' => 'text', 'fr' => 'Actifs clés', 'en' => 'Key Actives'],
            ['key' => 'properties', 'type' => 'text', 'fr' => 'Propriétés', 'en' => 'Properties'],
            ['key' => 'directions', 'type' => 'text', 'fr' => "Mode d'emploi", 'en' => 'Directions for use'],
            ['key' => 'ingredients', 'type' => 'text', 'fr' => 'Ingrédients', 'en' => 'Ingredients'],
            ['key' => 'precautions', 'type' => 'text', 'fr' => 'Précautions', 'en' => 'Precautions'],
            ['key' => 'claim', 'type' => 'text', 'fr' => 'Peaux noires = Belles peaux', 'en' => 'Black Skins = Beautiful Skins'],
        ],
        'global' => [
            ['key' => 'logo', 'type' => 'image', 'fr' => '', 'en' => ''],
        ],
    ],
    'gammes' => [
        [
            'id' => 'eclat',
            'nom' => ['fr' => 'ÉCLAT NATUREL', 'en' => 'NATURAL RADIANCE'],
            'tagline' => ['fr' => 'Révélez votre luminosité naturelle', 'en' => 'Reveal your natural glow'],
            'ingredients' => ['fr' => 'Curcuma & Carotte', 'en' => 'Turmeric & Carrot'],
            'color' => '#C9971A',
            'colorLight' => '#FDF4DA',
            'colorDark' => '#7A5600',
            'description' => [
                'fr' => "La gamme ÉCLAT NATUREL puise dans la puissance ancestrale du curcuma et de la carotte pour révéler l'éclat naturel de votre peau. Ces actifs dorés, utilisés depuis des siècles dans nos traditions africaines, unifient le teint, atténuent les imperfections et offrent une luminosité incomparable — sans jamais altérer votre couleur naturelle.",
                'en' => "The NATURAL RADIANCE range draws on the ancestral power of turmeric and carrot to reveal your skin's natural glow. These golden actives, used for centuries in our African traditions, even out the complexion, fade imperfections and deliver incomparable luminosity — without ever altering your natural colour.",
            ],
            'ingredientsDetail' => [
                'fr' => "Curcuma — puissant antioxydant, éclairant naturel reconnu depuis des siècles dans les traditions africaines et asiatiques. Carotte — riche en bêta-carotène, elle nourrit, unifie et illumine le teint en profondeur.",
                'en' => "Turmeric — a powerful antioxidant and natural brightener recognised for centuries in African and Asian traditions. Carrot — rich in beta-carotene, it nourishes, evens out and deeply illuminates the complexion.",
            ],
            'heroLead' => ['fr' => 'Votre peau', 'en' => 'Your skin'],
            'heroAccent' => ['fr' => "vaut de l'or.", 'en' => 'is worth gold.'],
            'heroCopy' => [
                'fr' => "Des soins naturels, efficaces et respectueux de votre peau, pour révéler toute sa beauté — sans jamais changer sa couleur.",
                'en' => "Natural, effective care that respects your skin, revealing all its beauty — without ever changing its colour.",
            ],
            'heroAlt' => [
                'fr' => "Portrait d'une femme au teint lumineux dans une lumière dorée, entourée de curcuma et de carotte.",
                'en' => "Portrait of a woman with luminous skin in golden light, surrounded by turmeric and carrot.",
            ],
            'products' => [
                [
                    'type' => ['fr' => 'Savon', 'en' => 'Soap'],
                    'poids' => '180 g',
                    'symbol' => '◼',
                    'description' => [
                        'fr' => "Savon purifiant enrichi aux extraits de curcuma et de carotte. Nettoie en douceur tout en déposant les actifs éclairants dès le premier contact. Unifie progressivement le teint et laisse la peau lumineuse.",
                        'en' => "Purifying soap enriched with turmeric and carrot extracts. Gently cleanses while depositing brightening actives from the very first contact. Gradually evens out the complexion and leaves skin luminous.",
                    ],
                ],
                [
                    'type' => ['fr' => 'Lotion', 'en' => 'Lotion'],
                    'poids' => '100 ml',
                    'symbol' => '◻',
                    'description' => [
                        'fr' => "TEINT UNIFIÉ. Lotion légère aux extraits de carotte et curcuma. S'absorbe rapidement pour illuminer et unifier le teint au quotidien. À utiliser après le nettoyage pour une synergie éclat naturel optimale.",
                        'en' => "UNIFIED COMPLEXION. Light lotion with carrot and turmeric extracts. Absorbs quickly to brighten and even out the complexion every day. Use after cleansing for an optimal natural glow synergy.",
                    ],
                    'details' => $details(
                        ['fr' => 'Lotion Visage Unifiante', 'en' => 'Even-Tone Face Lotion'],
                        ['fr' => 'Extrait de Carotte & Curcuma', 'en' => 'Carrot Extract & Turmeric'],
                        [
                            'fr' => "Cette lotion légère agit en douceur sur le grain de peau du visage : elle unifie le teint, nourrit intensément et révèle un éclat naturel et homogène. Sa formule enrichie en extraits de carotte et de curcuma est spécialement conçue pour sublimer les teints ternes ou marqués par des irrégularités.",
                            'en' => "This lightweight lotion gently works on facial skin texture: it evens the complexion, deeply nourishes and reveals a natural, uniform glow. Its formula, enriched with carrot and turmeric extracts, is specially designed to enhance dull complexions or skin marked by uneven tone.",
                        ],
                        $ingredientsCarotteCurcuma,
                        $modeLotion,
                        $precautionsVisage
                    ),
                ],
                [
                    'type' => ['fr' => 'Crème de Visage', 'en' => 'Face Cream'],
                    'poids' => '100 ml',
                    'symbol' => '◇',
                    'description' => [
                        'fr' => "Crème éclat naturel concentrée au curcuma. Formule ciblée qui atténue les taches, unifie le teint et révèle la luminosité naturelle de la peau. Texture fondante, non grasse, idéale pour l'usage quotidien matin et soir.",
                        'en' => "Natural glow cream concentrated with turmeric. A targeted formula that fades dark spots, evens out the complexion and reveals the skin's natural luminosity. Melting, non-greasy texture, ideal for daily morning and evening use.",
                    ],
                    'details' => $details(
                        ['fr' => 'Crème Visage Unifiante', 'en' => 'Even-Tone Face Cream'],
                        ['fr' => 'Extrait de Carotte & Curcuma', 'en' => 'Carrot Extract & Turmeric'],
                        [
                            'fr' => "Cette crème agit en douceur sur le grain de peau du visage : elle unifie le teint, nourrit intensément et révèle un éclat naturel et homogène. Sa formule enrichie en extraits de carotte et de curcuma est spécialement conçue pour sublimer les teints ternes ou marqués par des irrégularités.",
                            'en' => "This cream gently works on facial skin texture: it evens the complexion, deeply nourishes and reveals a natural, uniform glow. Its formula, enriched with carrot and turmeric extracts, is specially designed to enhance dull complexions or skin marked by uneven tone.",
                        ],
                        $ingredientsCarotteCurcuma,
                        $modeCreme,
                        $precautionsVisage
                    ),
                ],
                [
                    'type' => ['fr' => 'Lait Corps', 'en' => 'Body Milk'],
                    'poids' => '500 ml',
                    'symbol' => '○',
                    'description' => [
                        'fr' => "Lait corps éclat naturel enrichi aux extraits de carotte et curcuma. S'absorbe rapidement pour nourrir et illuminer la peau du corps tout en l'unifiant progressivement. Le geste beauté incontournable pour une peau rayonnante.",
                        'en' => "Natural glow body milk enriched with carrot and turmeric extracts. Absorbs quickly to nourish and illuminate the skin of the body while gradually evening it out. The essential beauty ritual for radiant skin.",
                    ],
                    'details' => $details(
                        ['fr' => 'Lotion Corps Unifiante', 'en' => 'Even-Tone Body Lotion'],
                        ['fr' => 'Extrait de Carotte & Curcuma', 'en' => 'Carrot Extract & Turmeric'],
                        [
                            'fr' => "Cette lotion pour le corps agit en douceur sur le grain de peau : elle unifie le teint, nourrit en profondeur et révèle un éclat naturel et homogène. Sa formule enrichie en extraits de carotte et de curcuma est spécialement conçue pour sublimer les peaux ternes ou marquées par un teint irrégulier.",
                            'en' => "This body lotion gently works on skin texture: it evens out the complexion, deeply nourishes and reveals a natural, uniform glow. Its formula, enriched with carrot extract and turmeric extract, is specially designed to enhance dull skin or skin marked by uneven tone.",
                        ],
                        $ingredientsCarotteCurcuma,
                        $modeCorps,
                        $precautionsCorps
                    ),
                ],
            ],
        ],
        [
            'id' => 'reparation',
            'nom' => ['fr' => 'RÉPARATION', 'en' => 'REPAIR'],
            'tagline' => ['fr' => 'Régénérez et restaurez votre peau', 'en' => 'Regenerate and restore your skin'],
            'ingredients' => ['fr' => 'Huile de Marula & Collagène Marin', 'en' => 'Marula Oil & Marine Collagen'],
            'color' => '#2F9E5F',
            'colorLight' => '#E6F5EC',
            'colorDark' => '#1B5E3A',
            'description' => [
                'fr' => "La gamme RÉPARATION associe la précieuse huile de Marula — surnommée « l'or liquide de l'Afrique australe » — au collagène marin pour régénérer en profondeur les peaux abîmées, fatiguées ou agressées. Une alliance de luxe naturel et de science moderne, formulée exclusivement pour la beauté africaine.",
                'en' => "The REPAIR range combines precious Marula oil — nicknamed “the liquid gold of Southern Africa” — with marine collagen to deeply regenerate damaged, tired or stressed skin. A blend of natural luxury and modern science, formulated exclusively for African beauty.",
            ],
            'ingredientsDetail' => [
                'fr' => "Huile de Marula — pénètre sans résidu gras, régénère et protège contre les agressions extérieures. Collagène Marin — renforce l'élasticité cutanée, réduit les ridules et améliore le rebond de la peau.",
                'en' => "Marula Oil — penetrates without a greasy residue, regenerates and protects against external aggressions. Marine Collagen — strengthens skin elasticity, reduces fine lines and improves skin bounce.",
            ],
            'heroLead' => ['fr' => 'Réparer,', 'en' => 'Repair,'],
            'heroAccent' => ['fr' => 'puis rayonner.', 'en' => 'then glow.'],
            'heroCopy' => [
                'fr' => "L'huile de marula et le collagène marin restaurent la barrière cutanée et redonnent du rebond aux peaux fragilisées.",
                'en' => "Marula oil and marine collagen restore the skin barrier and bring bounce back to weakened skin.",
            ],
            'heroAlt' => [
                'fr' => "Portrait d'une femme au foulard vert, les yeux fermés, dans une lumière végétale apaisante.",
                'en' => "Portrait of a woman in a green headwrap, eyes closed, in soothing botanical light.",
            ],
            'products' => [
                [
                    'type' => ['fr' => 'Savon', 'en' => 'Soap'],
                    'poids' => '180 g',
                    'symbol' => '◼',
                    'description' => [
                        'fr' => "Savon réparateur à l'huile de Marula. Élimine les impuretés tout en déposant les actifs régénérants dès le nettoyage. Idéal pour les peaux abîmées, il initie le processus de restauration cutanée dès la première utilisation.",
                        'en' => "Repairing soap with Marula oil. Removes impurities while depositing regenerating actives from cleansing. Ideal for damaged skin, it starts the skin restoration process from first use.",
                    ],
                ],
                [
                    'type' => ['fr' => 'Lotion', 'en' => 'Lotion'],
                    'poids' => '100 ml',
                    'symbol' => '◻',
                    'description' => [
                        'fr' => "Lotion régénérante post-soin à l'huile de Marula. Légère et pénétrante, elle restaure la barrière cutanée et prépare la peau à recevoir les soins suivants. Utiliser après le nettoyage pour une synergie réparatrice optimale.",
                        'en' => "Regenerating post-care lotion with Marula oil. Light and fast-absorbing, it restores the skin barrier and prepares the skin for the following care steps. Use after cleansing for an optimal repairing synergy.",
                    ],
                    'details' => $details(
                        ['fr' => 'Lotion Visage Réparatrice', 'en' => 'Repairing Face Lotion'],
                        ['fr' => 'Collagène Marin & Moringa', 'en' => 'Marine Collagen & Moringa'],
                        [
                            'fr' => "Cette lotion légère agit en profondeur sur les imperfections cutanées du visage : elle apaise, nourrit et répare la peau en douceur. Sa formule enrichie en collagène marin et en moringa est spécialement conçue pour restaurer le confort et l'éclat des peaux du visage fragilisées.",
                            'en' => "This lightweight lotion works deeply on facial skin imperfections: it soothes, nourishes and gently repairs the skin. Its formula, enriched with marine collagen and moringa, is specially designed to restore comfort and radiance to weakened facial skin.",
                        ],
                        $ingredientsCollagene,
                        $modeLotion,
                        $precautionsVisage
                    ),
                ],
                [
                    'type' => ['fr' => 'Crème de Visage', 'en' => 'Face Cream'],
                    'poids' => '100 ml',
                    'symbol' => '◇',
                    'description' => [
                        'fr' => "Crème régénérante au Marula et Collagène Marin. Formule concentrée qui comble les ridules, raffermit les contours et restitue l'éclat naturel des peaux fatiguées ou stressées. Résultats visibles dès 4 semaines.",
                        'en' => "Regenerating cream with Marula and Marine Collagen. A concentrated formula that plumps fine lines, firms contours and restores the natural glow of tired or stressed skin. Visible results in 4 weeks.",
                    ],
                    'details' => $details(
                        ['fr' => 'Crème Visage Réparatrice', 'en' => 'Repairing Face Cream'],
                        ['fr' => 'Collagène Marin & Moringa', 'en' => 'Marine Collagen & Moringa'],
                        [
                            'fr' => "Cette crème agit en profondeur sur les imperfections cutanées du visage : elle apaise, nourrit et répare la peau en douceur. Sa formule enrichie en collagène marin et en moringa est spécialement conçue pour restaurer le confort et l'éclat des peaux du visage fragilisées.",
                            'en' => "This cream works deeply on facial skin imperfections: it soothes, nourishes and gently repairs the skin. Its formula, enriched with marine collagen and moringa, is specially designed to restore comfort and radiance to weakened facial skin.",
                        ],
                        $ingredientsCollagene,
                        $modeCreme,
                        $precautionsVisage
                    ),
                ],
                [
                    'type' => ['fr' => 'Lait Corps', 'en' => 'Body Milk'],
                    'poids' => '500 ml',
                    'symbol' => '○',
                    'description' => [
                        'fr' => "Lait corps réparateur onctueux à l'huile de Marula. Restaure durablement le film hydrolipidique, améliore l'élasticité et renforce la résistance de la peau. Une sensation de confort immédiat et de peau régénérée.",
                        'en' => "Rich repairing body milk with Marula oil. Lastingly restores the hydrolipidic film, improves elasticity and strengthens the skin's resistance. An immediate feeling of comfort and regenerated skin.",
                    ],
                    'details' => $details(
                        ['fr' => 'Lotion Corps Réparatrice', 'en' => 'Repairing Body Lotion'],
                        ['fr' => 'Collagène Marin & Moringa', 'en' => 'Marine Collagen & Moringa'],
                        [
                            'fr' => "Cette lotion pour le corps agit en profondeur sur les imperfections cutanées, apaise et répare la peau en douceur. Sa formule enrichie en collagène marin et en moringa est spécialement conçue pour restaurer l'éclat et le confort des peaux fragiles ou abîmées.",
                            'en' => "This body lotion works deeply on skin imperfections, soothing and gently repairing the skin. Its formula, enriched with marine collagen and moringa, is specially designed to restore radiance and comfort to fragile or damaged skin.",
                        ],
                        $ingredientsCollagene,
                        $modeCorps,
                        $precautionsCorps
                    ),
                ],
            ],
        ],
        [
            'id' => 'hydratation',
            'nom' => ['fr' => 'HYDRATATION', 'en' => 'HYDRATION'],
            'tagline' => ['fr' => 'Désaltérez votre peau en profondeur', 'en' => 'Deeply quench your skin'],
            'ingredients' => ['fr' => 'Aloe Vera & Concombre', 'en' => 'Aloe Vera & Cucumber'],
            'color' => '#5E8FC7',
            'colorLight' => '#EAF2FB',
            'colorDark' => '#2E5E95',
            'description' => [
                'fr' => "La gamme HYDRATATION allie la légèreté rafraîchissante du concombre à la puissance hydratante de l'aloe vera. Ensemble, ils forment un bouclier d'hydratation qui retient l'eau, apaise les irritations et laisse la peau fraîche, souple et lumineuse tout au long de la journée — quelle que soit la chaleur tropicale.",
                'en' => "The HYDRATION range blends the refreshing lightness of cucumber with the moisturising power of aloe vera. Together they form a hydration shield that retains water, soothes irritation and leaves skin fresh, supple and luminous all day long — whatever the tropical heat.",
            ],
            'ingredientsDetail' => [
                'fr' => "Aloe Vera — hydratation profonde, apaisement immédiat, propriétés cicatrisantes et anti-inflammatoires naturelles. Concombre — effet fraîcheur instantané, réduit les gonflements et illumine le teint sans agresser.",
                'en' => "Aloe Vera — deep hydration, immediate soothing, natural healing and anti-inflammatory properties. Cucumber — instant fresh effect, reduces puffiness and illuminates the complexion without harshness.",
            ],
            'heroLead' => ['fr' => 'Une peau', 'en' => 'Skin that is'],
            'heroAccent' => ['fr' => 'désaltérée.', 'en' => 'deeply quenched.'],
            'heroCopy' => [
                'fr' => "L'aloe vera et le concombre forment un bouclier d'hydratation qui tient tête à la chaleur tropicale.",
                'en' => "Aloe vera and cucumber form a hydration shield that stands up to tropical heat.",
            ],
            'heroAlt' => [
                'fr' => "Portrait d'une femme à la peau fraîche et lumineuse, entourée d'aloe vera et de concombre.",
                'en' => "Portrait of a woman with fresh, luminous skin, surrounded by aloe vera and cucumber.",
            ],
            'products' => [
                [
                    'type' => ['fr' => 'Savon', 'en' => 'Soap'],
                    'poids' => '180 g',
                    'symbol' => '◼',
                    'description' => [
                        'fr' => "Savon fraîcheur à l'aloe vera et au concombre. Nettoie en douceur et laisse une sensation de fraîcheur immédiate. Idéal pour les peaux sensibles ou les climats chauds, il prépare la peau à absorber les soins hydratants suivants.",
                        'en' => "Fresh soap with aloe vera and cucumber. Gently cleanses and leaves an immediate feeling of freshness. Ideal for sensitive skin or hot climates, it prepares the skin to absorb the following hydrating care.",
                    ],
                ],
                [
                    'type' => ['fr' => 'Lotion', 'en' => 'Lotion'],
                    'poids' => '100 ml',
                    'symbol' => '◻',
                    'description' => [
                        'fr' => "Lotion hydratante légère à l'aloe vera. Formule aquatique qui sature la peau en eau et lui apporte tonus et légèreté. À utiliser matin et soir pour maintenir le niveau d'hydratation optimal de la peau.",
                        'en' => "Light hydrating lotion with aloe vera. An aquatic formula that saturates the skin with water and brings tone and lightness. Use morning and evening to maintain the skin's optimal hydration level.",
                    ],
                    'details' => $details(
                        ['fr' => 'Lotion Visage Hydratante', 'en' => 'Hydrating Face Lotion'],
                        ['fr' => 'Beurre de Karité & Aloe Vera', 'en' => 'Shea Butter & Aloe Vera'],
                        [
                            'fr' => "Cette lotion légère offre une hydratation intense et durable au visage : elle nourrit, apaise et adoucit la peau en profondeur. Sa formule enrichie en beurre de karité et en aloe vera est spécialement conçue pour restaurer le confort des peaux du visage sèches ou déshydratées.",
                            'en' => "This lightweight lotion provides intense, long-lasting hydration to the face: it deeply nourishes, soothes and softens the skin. Its formula, enriched with shea butter and aloe vera, is specially designed to restore comfort to dry or dehydrated facial skin.",
                        ],
                        $ingredientsKariteAloe,
                        $modeLotion,
                        $precautionsVisage
                    ),
                ],
                [
                    'type' => ['fr' => 'Crème de Visage', 'en' => 'Face Cream'],
                    'poids' => '100 ml',
                    'symbol' => '◇',
                    'description' => [
                        'fr' => "Crème hydratante au concombre. Texture gel-crème fraîche qui fond sur la peau pour une hydratation intense de 24h sans effet gras. Apaise les rougeurs, resserre les pores et illumine le teint progressivement.",
                        'en' => "Hydrating cucumber cream. A fresh gel-cream texture that melts into the skin for intense 24h hydration with no greasy effect. Soothes redness, tightens pores and gradually illuminates the complexion.",
                    ],
                ],
                [
                    'type' => ['fr' => 'Lait Corps', 'en' => 'Body Milk'],
                    'poids' => '500 ml',
                    'symbol' => '○',
                    'description' => [
                        'fr' => "Lait corps hydratant non gras enrichi en aloe vera et concombre. Formule légère et fraîche qui s'absorbe rapidement pour une peau douce, désaltérée et lumineuse. Parfait pour les peaux mixtes en climat chaud.",
                        'en' => "Non-greasy hydrating body milk enriched with aloe vera and cucumber. A light, fresh formula that absorbs quickly for soft, quenched and luminous skin. Perfect for combination skin in hot climates.",
                    ],
                    'details' => $details(
                        ['fr' => 'Lotion Corps Hydratante', 'en' => 'Hydrating Body Lotion'],
                        ['fr' => 'Beurre de Karité & Aloe Vera', 'en' => 'Shea Butter & Aloe Vera'],
                        [
                            'fr' => "Cette lotion pour le corps offre une hydratation intense et durable : elle nourrit, apaise et adoucit la peau en profondeur. Sa formule enrichie en beurre de karité et en aloe vera est spécialement conçue pour restaurer le confort des peaux sèches ou déshydratées.",
                            'en' => "This body lotion provides intense, long-lasting hydration: it nourishes, soothes and deeply softens the skin. Its formula, enriched with shea butter and aloe vera, is specially designed to restore comfort to dry or dehydrated skin.",
                        ],
                        $ingredientsKariteAloe,
                        $modeCorps,
                        $precautionsCorps
                    ),
                ],
            ],
        ],
        [
            'id' => 'nutrition',
            'nom' => ['fr' => 'NUTRITION', 'en' => 'NUTRITION'],
            'tagline' => ['fr' => 'Nourrissez chaque cellule de votre peau', 'en' => 'Nourish every cell of your skin'],
            'ingredients' => ['fr' => "Beurre de Mangue & Huile d'Avocat", 'en' => 'Mango Butter & Avocado Oil'],
            'color' => '#B48B72',
            'colorLight' => '#F6EDE7',
            'colorDark' => '#6F4A36',
            'description' => [
                'fr' => "La gamme NUTRITION célèbre les trésors nourriciers de la nature tropicale : le beurre de mangue, riche en vitamines A et E, s'allie à l'huile d'avocat pour pénétrer en profondeur et nourrir intensément les peaux les plus sèches. Un soin de fond qui transforme durablement la texture et l'éclat de votre peau.",
                'en' => "The NUTRITION range celebrates the nourishing treasures of tropical nature: mango butter, rich in vitamins A and E, joins forces with avocado oil to penetrate deeply and intensely nourish even the driest skin. A deep treatment that lastingly transforms the texture and glow of your skin.",
            ],
            'ingredientsDetail' => [
                'fr' => "Beurre de Mangue — ultra-nourrissant, concentré en vitamines A et E, laisse la peau soyeuse et rayonnante. Huile d'Avocat — pénètre en profondeur, régénère et assouplit durablement les peaux les plus sèches.",
                'en' => "Mango Butter — ultra-nourishing, concentrated in vitamins A and E, leaves skin silky and radiant. Avocado Oil — penetrates deeply, regenerates and lastingly softens the driest skin.",
            ],
            'heroLead' => ['fr' => 'Nourrir pour', 'en' => 'Nourish to'],
            'heroAccent' => ['fr' => 'mieux briller.', 'en' => 'glow brighter.'],
            'heroCopy' => [
                'fr' => "Le beurre de mangue et l'huile d'avocat enveloppent les peaux sèches d'une douceur durable.",
                'en' => "Mango butter and avocado oil wrap dry skin in lasting softness.",
            ],
            'heroAlt' => [
                'fr' => "Portrait d'une femme au teint chaleureux, dans une lumière ambrée, entourée de mangue et d'avocat.",
                'en' => "Portrait of a woman with warm-toned skin in amber light, surrounded by mango and avocado.",
            ],
            'products' => [
                [
                    'type' => ['fr' => 'Savon', 'en' => 'Soap'],
                    'poids' => '180 g',
                    'symbol' => '◼',
                    'description' => [
                        'fr' => "Savon nourrissant au beurre de mangue. Transforme le moment du soin en une expérience sensorielle riche tout en enveloppant la peau d'une douceur incomparable. Idéal pour les peaux sèches qui ont besoin de nutrition dès le nettoyage.",
                        'en' => "Nourishing soap with mango butter. Turns the care ritual into a rich sensory experience while wrapping the skin in incomparable softness. Ideal for dry skin that needs nutrition from cleansing.",
                    ],
                ],
                [
                    'type' => ['fr' => 'Lotion', 'en' => 'Lotion'],
                    'poids' => '100 ml',
                    'symbol' => '◻',
                    'description' => [
                        'fr' => "Lotion nutritive corps au beurre de mangue et huile d'avocat. Légère mais intensément nourrissante, elle prépare et complète l'action de la crème pour une nutrition continue et un éclat durable tout au long de la journée.",
                        'en' => "Nourishing body lotion with mango butter and avocado oil. Light yet intensely nourishing, it prepares and complements the cream's action for continuous nutrition and lasting glow throughout the day.",
                    ],
                    'details' => $details(
                        ['fr' => 'Lotion Visage Nourrissante', 'en' => 'Nourishing Face Lotion'],
                        ['fr' => 'Beurre de Mangue & Miel', 'en' => 'Mango Butter & Honey'],
                        [
                            'fr' => "Cette lotion légère nourrit intensément la peau du visage et lui redonne souplesse et confort. Sa formule enrichie en beurre de mangue et en miel est spécialement conçue pour restaurer l'éclat et la douceur des peaux du visage sèches ou fatiguées.",
                            'en' => "This lightweight lotion deeply nourishes facial skin and restores suppleness and comfort. Its formula, enriched with mango butter and honey, is specially designed to restore radiance and softness to dry or tired facial skin.",
                        ],
                        $ingredientsMangueMiel,
                        $modeLotion,
                        $precautionsVisage
                    ),
                ],
                [
                    'type' => ['fr' => 'Crème de Visage', 'en' => 'Face Cream'],
                    'poids' => '100 ml',
                    'symbol' => '◇',
                    'description' => [
                        'fr' => "PEAU NOURRIE. Crème visage au beurre de mangue et miel. Nourrit en profondeur, régénère les cellules et laisse la peau souple, lisse et rayonnante. Formule riche idéale pour les peaux sèches à très sèches.",
                        'en' => "NOURISHED SKIN. Face cream with mango butter and honey. Deeply nourishes, regenerates cells and leaves skin supple, smooth and radiant. A rich formula ideal for dry to very dry skin.",
                    ],
                ],
                [
                    'type' => ['fr' => 'Lait Corps', 'en' => 'Body Milk'],
                    'poids' => '500 ml',
                    'symbol' => '○',
                    'description' => [
                        'fr' => "Lait corps nutrition fondant et généreux au beurre de mangue. Enveloppe la peau d'une couche nourrissante et protectrice qui agit en profondeur pour une douceur durable. Texture onctueuse qui s'absorbe sans laisser de film.",
                        'en' => "Melting, generous nutrition body milk with mango butter. Wraps the skin in a nourishing, protective layer that works deep down for lasting softness. A creamy texture that absorbs without leaving a film.",
                    ],
                    'details' => $details(
                        ['fr' => 'Lotion Corps Nourrissante', 'en' => 'Nourishing Body Lotion'],
                        ['fr' => 'Beurre de Mangue & Miel', 'en' => 'Mango Butter & Honey'],
                        [
                            'fr' => "Cette lotion pour le corps nourrit intensément la peau et lui redonne douceur et confort. Sa formule enrichie en beurre de mangue et en miel est spécialement conçue pour restaurer l'éclat et la douceur des peaux sèches ou fatiguées.",
                            'en' => "This body lotion deeply nourishes the skin, restoring softness and comfort. Its formula, enriched with mango butter and honey, is specially designed to restore radiance and softness to dry or tired skin.",
                        ],
                        $ingredientsMangueMiel,
                        $modeCorps,
                        $precautionsCorps
                    ),
                ],
            ],
        ],
    ],
];
