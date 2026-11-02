import { useLang, useT } from '@/context/LanguageContext'
import { generalUrl } from '@/lib/whatsapp'

const EN: Record<string, string> = {
  Vlogs: 'Vlogs',
  'Nos Vlogs arrivent bientôt': 'Our Vlogs are coming soon',
  'Conseils beauté, routines de soin, tutoriels et coulisses de la marque — nos vlogs seront bientôt disponibles. Restez connectées et suivez-nous sur les réseaux sociaux pour ne rien manquer.':
    "Beauty tips, skincare routines, tutorials and behind the scenes of the brand — our vlogs will soon be available. Stay connected and follow us on social media so you don't miss a thing.",
}

export default function VlogsPage() {
  const t = useT(EN)
  const { lang } = useLang()

  return (
    <div style={{ fontFamily: 'Outfit, system-ui, sans-serif' }}>
      <div className="bg-[#3B1705] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[#C97B1A] tracking-[0.35em] text-[10px] uppercase mb-4 flex items-center gap-3">
            <span className="w-8 h-px bg-[#C97B1A]" />
            Teint d'Afrique Cosmétiques
          </p>
          <h1 className="text-[#FAF6EF] leading-tight" style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
            {t('Vlogs')}
          </h1>
        </div>
      </div>

      <section className="py-28 md:py-36">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex w-20 h-20 items-center justify-center bg-[#3B1705]/6 mb-8 mx-auto">
            <span className="text-[#C97B1A] text-4xl" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>▶</span>
          </div>
          <h2 className="text-[#3B1705] text-3xl md:text-4xl mb-5" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
            {t('Nos Vlogs arrivent bientôt')}
          </h2>
          <p className="text-[#2A1006]/55 max-w-lg mx-auto leading-relaxed">
            {t('Conseils beauté, routines de soin, tutoriels et coulisses de la marque — nos vlogs seront bientôt disponibles. Restez connectées et suivez-nous sur les réseaux sociaux pour ne rien manquer.')}
          </p>
          <div className="flex justify-center gap-4 mt-10">
            {[
              { label: 'Facebook', abbr: 'fb', href: '#' },
              { label: 'Instagram', abbr: 'ig', href: '#' },
            ].map(s => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="w-12 h-12 border border-[#3B1705]/20 flex items-center justify-center text-[#3B1705] text-[11px] tracking-widest uppercase hover:bg-[#3B1705] hover:text-white transition-all"
              >
                {s.abbr}
              </a>
            ))}
            <a
              href={generalUrl(lang)}
              className="w-12 h-12 flex items-center justify-center text-white text-[11px] tracking-widest uppercase"
              style={{ background: '#25D366' }}
            >
              wa
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
