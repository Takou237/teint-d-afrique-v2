import { useT } from '@/context/LanguageContext'

const EN: Record<string, string> = {
  "La marque · Teint d'Afrique Cosmétiques": "The brand · Teint d'Afrique Cosmétiques",
  'Nos Engagements': 'Our Commitments',
  "Notre peau n'a pas besoin de changer de couleur pour être belle. Elle mérite d'être comprise, respectée et sublimée.":
    'Our skin does not need to change colour to be beautiful. It deserves to be understood, respected and enhanced.',
  "C'est pourquoi nous œuvrons pour que chaque femme puisse aimer sa peau, quelle que soit sa carnation, et qu'elle puisse disposer des meilleurs produits pour la chouchouter tout en se libérant des dictats de la mode.":
    'That is why we work so that every woman can love her skin, whatever her complexion, and can have the best products to pamper it while freeing herself from the dictates of fashion.',
  "Par ailleurs, nous valorisons l'Afrique et ses richesses. Nous croyons aux richesses de notre continent et à sa capacité à produire des cosmétiques de qualité, inspirés de ses ressources, de ses savoir-faire et des besoins de ses populations.":
    "We also champion Africa and its riches. We believe in our continent's wealth and its ability to produce quality cosmetics inspired by its resources, its know-how and the needs of its people.",
  'Engagement n°1': 'Commitment No. 1',
  'Zéro produit éclaircissant': 'Zero lightening products',
  "Aucun de nos produits ne contient d'agents éclaircissants. Nous refusons catégoriquement la dépigmentation sous toutes ses formes.":
    'None of our products contains lightening agents. We categorically refuse depigmentation in all its forms.',
  'Engagement n°2': 'Commitment No. 2',
  '100% ingrédients naturels': '100% natural ingredients',
  "Chaque formule est élaborée exclusivement à partir d'actifs botaniques et végétaux, puisés dans les richesses de notre terre africaine.":
    'Each formula is made exclusively from botanical and plant actives, drawn from the riches of our African land.',
  'Engagement n°3': 'Commitment No. 3',
  'Accessibilité & inclusion': 'Accessibility & inclusion',
  "Des produits d'excellence à des prix défiants toute concurrence, pour que chaque femme puisse prendre soin d'elle dignement.":
    'Excellent products at prices that defy all competition, so that every woman can care for herself with dignity.',
  'Engagement n°4': 'Commitment No. 4',
  'Fierté africaine': 'African pride',
  "Valoriser les ressources et les savoir-faire africains, prouver que l'Afrique peut créer des cosmétiques d'exception.":
    'Championing African resources and know-how, proving that Africa can create exceptional cosmetics.',
  'Nos engagements': 'Our commitments',
  'Notre engagement RSE': 'Our CSR commitment',
  "Teint d'Afrique Cosmétiques s'inscrit dans une démarche RSE globale : respecter les personnes, valoriser les ressources africaines, et contribuer à une industrie cosmétique plus éthique, plus juste et plus inclusive pour les peaux noires, métissées et albinos.":
    "Teint d'Afrique Cosmétiques is committed to a global CSR approach: respecting people, championing African resources, and contributing to a more ethical, fairer and more inclusive cosmetics industry for black, mixed-race and albino skin.",
}

export default function EngagementsPage() {
  const t = useT(EN)

  return (
    <div style={{ fontFamily: 'Outfit, system-ui, sans-serif' }}>
      <div className="bg-[#3B1705] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[#C97B1A] tracking-[0.35em] text-[10px] uppercase mb-4 flex items-center gap-3">
            <span className="w-8 h-px bg-[#C97B1A]" />
            {t("La marque · Teint d'Afrique Cosmétiques")}
          </p>
          <h1 className="text-[#FAF6EF] leading-tight" style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
            {t('Nos Engagements')}
          </h1>
        </div>
      </div>

      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div className="space-y-6 text-[#2A1006]/80 leading-relaxed text-[15px]">
              <p className="text-[#3B1705] text-xl leading-relaxed" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                {t("Notre peau n'a pas besoin de changer de couleur pour être belle. Elle mérite d'être comprise, respectée et sublimée.")}
              </p>
              <p>
                {t("C'est pourquoi nous œuvrons pour que chaque femme puisse aimer sa peau, quelle que soit sa carnation, et qu'elle puisse disposer des meilleurs produits pour la chouchouter tout en se libérant des dictats de la mode.")}
              </p>
              <p>
                {t("Par ailleurs, nous valorisons l'Afrique et ses richesses. Nous croyons aux richesses de notre continent et à sa capacité à produire des cosmétiques de qualité, inspirés de ses ressources, de ses savoir-faire et des besoins de ses populations.")}
              </p>

              <div className="pt-4 space-y-5">
                {[
                  {
                    label: 'Engagement n°1',
                    titre: 'Zéro produit éclaircissant',
                    texte: "Aucun de nos produits ne contient d'agents éclaircissants. Nous refusons catégoriquement la dépigmentation sous toutes ses formes.",
                  },
                  {
                    label: 'Engagement n°2',
                    titre: '100% ingrédients naturels',
                    texte: "Chaque formule est élaborée exclusivement à partir d'actifs botaniques et végétaux, puisés dans les richesses de notre terre africaine.",
                  },
                  {
                    label: 'Engagement n°3',
                    titre: 'Accessibilité & inclusion',
                    texte: "Des produits d'excellence à des prix défiants toute concurrence, pour que chaque femme puisse prendre soin d'elle dignement.",
                  },
                  {
                    label: 'Engagement n°4',
                    titre: 'Fierté africaine',
                    texte: "Valoriser les ressources et les savoir-faire africains, prouver que l'Afrique peut créer des cosmétiques d'exception.",
                  },
                ].map(e => (
                  <div key={e.label} className="flex gap-4">
                    <div className="flex-shrink-0 w-1.5 bg-[#C97B1A] rounded-full mt-1" style={{ minHeight: '4rem' }} />
                    <div>
                      <p className="text-[#C97B1A] text-[9px] tracking-[0.25em] uppercase mb-1">{t(e.label)}</p>
                      <p className="text-[#3B1705] font-medium mb-1" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>{t(e.titre)}</p>
                      <p className="text-[#2A1006]/60 text-[13px] leading-relaxed">{t(e.texte)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <img
                src="https://images.unsplash.com/photo-1646457417431-1257d95a92b8?w=700&h=500&fit=crop&auto=format"
                alt={t('Nos engagements')}
                className="w-full h-64 object-cover"
              />
              <div className="p-8 bg-[#3B1705]">
                <p className="text-[#C97B1A] text-[9px] tracking-[0.3em] uppercase mb-4">{t('Notre engagement RSE')}</p>
                <p className="text-[#FAF6EF] leading-relaxed text-[15px]">
                  {t("Teint d'Afrique Cosmétiques s'inscrit dans une démarche RSE globale : respecter les personnes, valoriser les ressources africaines, et contribuer à une industrie cosmétique plus éthique, plus juste et plus inclusive pour les peaux noires, métissées et albinos.")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
