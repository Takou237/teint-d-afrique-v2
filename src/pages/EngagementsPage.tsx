export default function EngagementsPage() {
  return (
    <div style={{ fontFamily: 'Outfit, system-ui, sans-serif' }}>
      <div className="bg-[#3B1705] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[#C97B1A] tracking-[0.35em] text-[10px] uppercase mb-4 flex items-center gap-3">
            <span className="w-8 h-px bg-[#C97B1A]" />
            La marque · Teint d'Afrique Cosmétiques
          </p>
          <h1 className="text-[#FAF6EF] leading-tight" style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
            Nos Engagements
          </h1>
        </div>
      </div>

      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div className="space-y-6 text-[#2A1006]/80 leading-relaxed text-[15px]">
              <p className="text-[#3B1705] text-xl leading-relaxed" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                Notre peau n'a pas besoin de changer de couleur pour être belle. Elle mérite
                d'être comprise, respectée et sublimée.
              </p>
              <p>
                C'est pourquoi nous œuvrons pour que chaque femme puisse aimer sa peau, quelle que
                soit sa carnation, et qu'elle puisse disposer des meilleurs produits pour la
                chouchouter tout en se libérant des dictats de la mode.
              </p>
              <p>
                Par ailleurs, nous valorisons l'Afrique et ses richesses. Nous croyons aux richesses
                de notre continent et à sa capacité à produire des cosmétiques de qualité, inspirés
                de ses ressources, de ses savoir-faire et des besoins de ses populations.
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
                      <p className="text-[#C97B1A] text-[9px] tracking-[0.25em] uppercase mb-1">{e.label}</p>
                      <p className="text-[#3B1705] font-medium mb-1" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>{e.titre}</p>
                      <p className="text-[#2A1006]/60 text-[13px] leading-relaxed">{e.texte}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <img
                src="https://images.unsplash.com/photo-1646457417431-1257d95a92b8?w=700&h=500&fit=crop&auto=format"
                alt="Nos engagements"
                className="w-full h-64 object-cover"
              />
              <div className="p-8 bg-[#3B1705]">
                <p className="text-[#C97B1A] text-[9px] tracking-[0.3em] uppercase mb-4">Notre engagement RSE</p>
                <p className="text-[#FAF6EF] leading-relaxed text-[15px]">
                  Teint d'Afrique Cosmétiques s'inscrit dans une démarche RSE globale : respecter
                  les personnes, valoriser les ressources africaines, et contribuer à une industrie
                  cosmétique plus éthique, plus juste et plus inclusive pour les peaux noires,
                  métissées et albinos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
