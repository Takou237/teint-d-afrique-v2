export default function LocalisationPage() {
  return (
    <div style={{ fontFamily: 'Outfit, system-ui, sans-serif' }}>
      <div className="bg-[#3B1705] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[#C97B1A] tracking-[0.35em] text-[10px] uppercase mb-4 flex items-center gap-3">
            <span className="w-8 h-px bg-[#C97B1A]" />
            Contact · Teint d'Afrique Cosmétiques
          </p>
          <h1 className="text-[#FAF6EF] leading-tight" style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
            Localisation
          </h1>
        </div>
      </div>

      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <p className="text-[#C97B1A] tracking-[0.3em] text-[10px] uppercase mb-6 flex items-center gap-3">
                <span className="w-6 h-px bg-[#C97B1A]" />
                Où nous trouver
              </p>
              <h2 className="text-[#3B1705] text-3xl md:text-4xl mb-8" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                Teint d'Afrique Cosmétiques<br />est à Douala.
              </h2>
              <div className="space-y-6 text-[15px]">
                {[
                  { label: 'Ville', value: 'Douala' },
                  { label: 'Pays', value: 'Cameroun' },
                  { label: 'Continent', value: 'Afrique Centrale' },
                  { label: 'Email', value: 'contact@teintdafrique.com', href: 'mailto:contact@teintdafrique.com' },
                ].map(item => (
                  <div key={item.label} className="flex gap-4 items-start">
                    <div className="w-24 flex-shrink-0 text-[9px] tracking-[0.25em] uppercase text-[#C97B1A] pt-0.5">{item.label}</div>
                    {item.href ? (
                      <a href={item.href} className="text-[#3B1705] font-medium hover:text-[#C97B1A] transition-colors">{item.value}</a>
                    ) : (
                      <p className="text-[#3B1705] font-medium">{item.value}</p>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-10 p-6 bg-[#3B1705]">
                <p className="text-[#C97B1A] text-[9px] tracking-[0.3em] uppercase mb-3">Nous contacter</p>
                <p className="text-[#FAF6EF]/70 text-sm leading-relaxed mb-4">
                  Pour toute demande d'information ou de commande, contactez-nous directement par
                  email ou via WhatsApp.
                </p>
                <a
                  href="https://wa.me/237000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 text-white text-[11px] tracking-[0.15em] uppercase hover:opacity-85 transition-opacity"
                  style={{ background: '#25D366' }}
                >
                  WhatsApp →
                </a>
              </div>
            </div>

            <div>
              <div
                className="w-full h-80 flex items-center justify-center border border-[#3B1705]/10"
                style={{ background: '#3B170508' }}
              >
                <div className="text-center">
                  <div className="text-[#C97B1A] text-5xl mb-4" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>◈</div>
                  <p className="text-[#3B1705] text-2xl" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>Douala</p>
                  <p className="text-[#2A1006]/50 text-sm mt-1">Cameroun</p>
                </div>
              </div>
              <img
                src="https://images.unsplash.com/photo-1527203561188-dae1bc1a417f?w=700&h=300&fit=crop&auto=format"
                alt="Teint d'Afrique Cosmétiques"
                className="w-full h-40 object-cover mt-4"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
