import { Link } from 'react-router'
import { GAMMES } from '@/data'

const TYPES = [
  {
    type: 'Savon',
    poids: '180 g',
    symbol: '◼',
    description: "Premier geste de soin, le savon nettoie en douceur tout en déposant les actifs botaniques de chaque gamme sur la peau. Formulé sans agents agressifs, il respecte le film hydrolipidique naturel et prépare la peau à absorber les soins suivants.",
    benefices: ['Nettoyage doux et profond', 'Dépôt des actifs naturels', 'Respect du pH de la peau', 'Adapté à toutes les carnations'],
    img: 'https://images.unsplash.com/photo-1615485500834-bc10199bc727?w=600&h=400&fit=crop&auto=format',
  },
  {
    type: 'Lotion',
    poids: '100 ml',
    symbol: '◻',
    description: "Légère et pénétrante, la lotion complète l'action du savon. Elle prépare et tonifie la peau, renforce l'hydratation et maximise l'efficacité des soins suivants. À utiliser matin et soir pour une synergie optimale avec les autres produits de la gamme.",
    benefices: ["Tonification et préparation de la peau", "Hydratation légère de 12h", 'Synergie avec la gamme', 'Texture non grasse'],
    img: 'https://images.unsplash.com/photo-1684912950118-28ca40b6ef9d?w=600&h=400&fit=crop&auto=format',
  },
  {
    type: 'Crème de Visage',
    poids: '100 ml',
    symbol: '◇',
    description: "Formule concentrée dédiée au visage, la crème cible les besoins spécifiques de chaque gamme. Texture fondante et non grasse, elle s'adapte à la finesse de la peau du visage pour délivrer les actifs en profondeur et révéler l'éclat naturel.",
    benefices: ['Formule concentrée en actifs', 'Action ciblée sur le visage', 'Texture fondante et fine', 'Résultats visibles en 4 semaines'],
    img: 'https://images.unsplash.com/photo-1677254374578-32d933797c2a?w=600&h=400&fit=crop&auto=format',
  },
  {
    type: 'Lait Corps',
    poids: '500 ml',
    symbol: '○',
    description: "Généreux et onctueux, le lait corps est le soin quotidien incontournable. Sa texture légère s'absorbe rapidement pour envelopper la peau d'une couche nourrisante et protectrice, du matin au soir. Le geste beauté qui transforme la peau en douceur.",
    benefices: ['Texture légère et non grasse', 'Absorption rapide', 'Nutrition longue durée', 'Parfum délicat et naturel'],
    img: 'https://images.unsplash.com/photo-1559305486-2a6564f26a85?w=600&h=400&fit=crop&auto=format',
  },
]

export default function TypesProduitsPage() {
  return (
    <div style={{ fontFamily: 'Outfit, system-ui, sans-serif' }}>
      <div className="bg-[#3B1705] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[#C97B1A] tracking-[0.35em] text-[10px] uppercase mb-4 flex items-center gap-3">
            <span className="w-8 h-px bg-[#C97B1A]" />
            Nos Produits · Teint d'Afrique Cosmétiques
          </p>
          <h1 className="text-[#FAF6EF] leading-tight mb-4" style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
            Types de Produits
          </h1>
          <p className="text-[#FAF6EF]/60 max-w-lg">
            4 types de produits, déclinés dans chacune de nos 4 gammes — soit 16 références
            formulées pour les peaux noires, métissées et albinos.
          </p>
        </div>
      </div>

      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          {TYPES.map((t, i) => (
            <div key={t.type} className={`grid md:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'md:grid-flow-col-dense' : ''}`}>
              <div className={i % 2 === 1 ? 'md:order-2' : ''}>
                <div className="flex items-center gap-4 mb-5">
                  <span className="text-3xl text-[#C97B1A]">{t.symbol}</span>
                  <div>
                    <h2 className="text-3xl text-[#3B1705]" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>{t.type}</h2>
                    <span className="text-[9px] tracking-[0.25em] uppercase text-[#C97B1A]">{t.poids} par flacon</span>
                  </div>
                </div>
                <p className="text-[#2A1006]/75 leading-relaxed text-[15px] mb-6">{t.description}</p>
                <div className="grid grid-cols-2 gap-2">
                  {t.benefices.map(b => (
                    <div key={b} className="flex items-start gap-2 text-[12px] text-[#2A1006]/65">
                      <span className="text-[#C97B1A] mt-0.5 flex-shrink-0">✓</span>
                      {b}
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap gap-2">
                  {GAMMES.map(g => (
                    <Link
                      key={g.id}
                      to={`/nos-produits/${g.id}`}
                      className="text-[10px] tracking-[0.1em] uppercase px-3 py-1.5 border hover:border-current transition-colors"
                      style={{ color: g.colorDark, borderColor: g.color + '40' }}
                    >
                      {t.type} {g.nom}
                    </Link>
                  ))}
                </div>
              </div>
              <div className={i % 2 === 1 ? 'md:order-1' : ''}>
                <img src={t.img} alt={t.type} className="w-full h-64 object-cover" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
