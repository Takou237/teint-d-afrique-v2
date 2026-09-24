export default function VisionBeautePage() {
  return (
    <div style={{ fontFamily: 'Outfit, system-ui, sans-serif' }}>
      <div className="bg-[#3B1705] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[#C97B1A] tracking-[0.35em] text-[10px] uppercase mb-4 flex items-center gap-3">
            <span className="w-8 h-px bg-[#C97B1A]" />
            La marque · Teint d'Afrique Cosmétiques
          </p>
          <h1 className="text-[#FAF6EF] leading-tight" style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
            Notre Vision de la Beauté Africaine
          </h1>
        </div>
      </div>

      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div className="space-y-6 text-[#2A1006]/80 leading-relaxed text-[15px]">
              <p className="text-[#3B1705] text-xl leading-relaxed" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                La femme africaine est magnifique, et il est temps qu'elle le sache.
              </p>
              <p>
                Pendant trop longtemps, les standards de beauté imposés ont conduit des milliers de
                femmes africaines à douter de leur propre image — à vouloir effacer ce qui les rend
                uniques. Chez Teint d'Afrique Cosmétiques, nous refusons cette réalité.
              </p>
              <p>
                Notre vision est celle d'une beauté africaine pleinement assumée, célébrée et
                sublimée. Une beauté qui n'a pas besoin de changer de couleur pour être reconnue,
                admirée, aimée. Une beauté ancrée dans nos racines, nourrie de nos richesses
                naturelles.
              </p>
              <blockquote className="pl-5 border-l-2 border-[#C97B1A] my-8">
                <p className="text-[#3B1705] text-lg italic" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                  "Nous sublimons les peaux noires, et réparons celles qui ont été abîmées notamment
                  par les produits décapants."
                </p>
              </blockquote>
              <p>
                Nos produits sont formulés pour toutes les peaux noires, métissées et albinos — dans
                leur diversité, leur singularité, leur beauté. Chaque soin est pensé pour révéler
                l'éclat naturel de chaque femme, sans jamais en altérer la couleur.
              </p>
              <p>
                Car la beauté africaine ne se définit pas par un idéal unique. Elle se vit dans la
                diversité des carnations, dans la richesse des teintes, dans la fierté d'une peau
                saine, nourrie et bien entretenue.
              </p>
            </div>

            <div className="space-y-6">
              <img
                src="https://images.unsplash.com/photo-1543366749-4dad497ea0a0?w=700&h=500&fit=crop&auto=format"
                alt="Beauté africaine naturelle"
                className="w-full h-72 object-cover"
              />
              <div className="grid grid-cols-2 gap-4">
                {[
                  { titre: 'Peaux noires', desc: 'Soins adaptés aux besoins spécifiques de la peau noire, rich en mélanine.' },
                  { titre: 'Peaux métissées', desc: 'Formules qui répondent à la diversité et à la singularité des peaux métissées.' },
                  { titre: 'Peaux albinos', desc: 'Protection et soin pour les peaux hypersensibles aux rayonnements.' },
                  { titre: 'Toutes carnations', desc: 'Une beauté plurielle, inclusive, qui célèbre chaque femme dans son unicité.' },
                ].map(v => (
                  <div key={v.titre} className="p-4 border border-[#3B1705]/10 hover:border-[#C97B1A]/40 transition-colors">
                    <div className="text-[#C97B1A] text-sm font-medium mb-1" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                      {v.titre}
                    </div>
                    <div className="text-[#2A1006]/55 text-[12px] leading-relaxed">{v.desc}</div>
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
