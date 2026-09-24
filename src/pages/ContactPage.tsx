import { useState } from 'react'

export default function ContactPage() {
  const [sent, setSent] = useState(false)

  return (
    <div style={{ fontFamily: 'Outfit, system-ui, sans-serif' }}>
      {/* ── PAGE BANNER ── */}
      <div className="bg-[#3B1705] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[#C97B1A] tracking-[0.35em] text-[10px] uppercase mb-4 flex items-center gap-3">
            <span className="w-8 h-px bg-[#C97B1A]" />
            Teint d'Afrique Cosmétiques
          </p>
          <h1
            className="text-[#FAF6EF] leading-tight mb-4"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
          >
            Contact
          </h1>
          <p className="text-[#FAF6EF]/60 max-w-md">
            Nous sommes à votre écoute. Écrivez-nous, retrouvez-nous sur les réseaux sociaux, ou
            venez nous rendre visite à Douala.
          </p>
        </div>
      </div>

      {/* ── SECTION 1 : NOUS CONTACTER ── */}
      <section className="py-20 md:py-28" id="nous-contacter">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[#C97B1A] tracking-[0.35em] text-[10px] uppercase mb-3 flex items-center gap-3">
            <span className="w-8 h-px bg-[#C97B1A]" />
            01 — Nous Contacter
          </p>
          <h2
            className="text-[#3B1705] mb-14"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            Parlons de votre beauté.
          </h2>

          <div className="grid md:grid-cols-2 gap-16">
            {/* Info */}
            <div>
              <div className="space-y-8 mb-12">
                {[
                  { label: 'Adresse', icon: '◈', text: 'Douala, Cameroun', href: undefined },
                  { label: 'Email', icon: '◉', text: 'contact@teintdafrique.com', href: 'mailto:contact@teintdafrique.com' },
                  { label: 'WhatsApp', icon: '◎', text: 'Nous écrire sur WhatsApp', href: 'https://wa.me/237000000000' },
                ].map(item => (
                  <div key={item.label} className="flex gap-5 items-start">
                    <div className="w-11 h-11 flex items-center justify-center flex-shrink-0 text-[#C97B1A] text-xl" style={{ background: '#3B170508' }}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[9px] tracking-[0.3em] uppercase text-[#C97B1A] mb-1">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} target={item.href.startsWith('https') ? '_blank' : undefined} rel="noopener noreferrer" className="text-[#3B1705] font-medium hover:text-[#C97B1A] transition-colors">
                          {item.text}
                        </a>
                      ) : (
                        <p className="text-[#3B1705] font-medium">{item.text}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-[9px] tracking-[0.3em] uppercase text-[#C97B1A] mb-5">Réseaux Sociaux</p>
                <div className="flex gap-3">
                  <a href="#" aria-label="Facebook" className="w-11 h-11 border border-[#3B1705]/20 flex items-center justify-center text-[#3B1705] text-[11px] uppercase tracking-widest hover:bg-[#3B1705] hover:text-white hover:border-[#3B1705] transition-all">fb</a>
                  <a href="#" aria-label="Instagram" className="w-11 h-11 border border-[#3B1705]/20 flex items-center justify-center text-[#3B1705] text-[11px] uppercase tracking-widest hover:bg-[#3B1705] hover:text-white hover:border-[#3B1705] transition-all">ig</a>
                  <a href="https://wa.me/237000000000" aria-label="WhatsApp" className="w-11 h-11 flex items-center justify-center text-white text-[11px] uppercase tracking-widest hover:opacity-85 transition-opacity" style={{ background: '#25D366' }}>wa</a>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-[#3B1705] p-8 md:p-10">
              {sent ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-6 py-16">
                  <div className="text-[#C97B1A] text-5xl" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>✓</div>
                  <h3 className="text-[#FAF6EF] text-2xl" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>Message envoyé !</h3>
                  <p className="text-[#FAF6EF]/60 text-sm leading-relaxed max-w-xs">Merci de nous avoir contactés. Nous vous répondrons dans les plus brefs délais.</p>
                  <button onClick={() => setSent(false)} className="mt-4 border border-[#FAF6EF]/20 text-[#FAF6EF]/70 px-6 py-2.5 text-[11px] tracking-[0.2em] uppercase hover:bg-[#FAF6EF]/10 transition-colors">Nouveau message</button>
                </div>
              ) : (
                <>
                  <h3 className="text-[#FAF6EF] text-2xl mb-8" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>Envoyez-nous un message</h3>
                  <form className="space-y-5" onSubmit={e => { e.preventDefault(); setSent(true) }}>
                    {[
                      { label: 'Nom complet', type: 'text', placeholder: 'Votre nom', required: true },
                      { label: 'Email', type: 'email', placeholder: 'votre@email.com', required: true },
                      { label: 'Téléphone', type: 'tel', placeholder: '+237 6XX XXX XXX', required: false },
                    ].map(f => (
                      <div key={f.label}>
                        <label className="text-[9px] tracking-[0.3em] uppercase text-[#FAF6EF]/55 block mb-2">
                          {f.label} {f.required && <span className="text-[#C97B1A]">*</span>}
                        </label>
                        <input type={f.type} placeholder={f.placeholder} required={f.required} className="w-full bg-[#FAF6EF]/8 border border-[#FAF6EF]/18 text-[#FAF6EF] placeholder:text-[#FAF6EF]/28 px-4 py-3 text-sm focus:outline-none focus:border-[#C97B1A] transition-colors" />
                      </div>
                    ))}
                    <div>
                      <label className="text-[9px] tracking-[0.3em] uppercase text-[#FAF6EF]/55 block mb-2">Message <span className="text-[#C97B1A]">*</span></label>
                      <textarea rows={5} placeholder="Votre message, votre demande..." required className="w-full bg-[#FAF6EF]/8 border border-[#FAF6EF]/18 text-[#FAF6EF] placeholder:text-[#FAF6EF]/28 px-4 py-3 text-sm focus:outline-none focus:border-[#C97B1A] transition-colors resize-none" />
                    </div>
                    <button type="submit" className="w-full bg-[#C97B1A] text-white py-4 text-[11px] tracking-[0.25em] uppercase hover:bg-[#A85E0F] transition-colors">Envoyer le Message</button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-px bg-[#3B1705]/10" />
      </div>

      {/* ── SECTION 2 : LOCALISATION ── */}
      <section className="py-20 md:py-28" id="localisation">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[#C97B1A] tracking-[0.35em] text-[10px] uppercase mb-3 flex items-center gap-3">
            <span className="w-8 h-px bg-[#C97B1A]" />
            02 — Localisation
          </p>
          <h2
            className="text-[#3B1705] mb-14"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            Où nous trouver.
          </h2>

          <div className="w-full overflow-hidden border border-[#3B1705]/10" style={{ height: '420px' }}>
            <iframe
              title="Teint d'Afrique Cosmétiques — Douala, Cameroun"
              src="https://www.openstreetmap.org/export/embed.html?bbox=9.6%2C4.0%2C9.8%2C4.1&layer=mapnik&marker=4.05%2C9.7"
              width="100%"
              height="100%"
              style={{ border: 0, display: 'block' }}
              loading="lazy"
              allowFullScreen
            />
          </div>
          <div className="mt-4 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6">
              {[
                { label: 'Ville', value: 'Douala' },
                { label: 'Pays', value: 'Cameroun' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className="text-[9px] tracking-[0.2em] uppercase text-[#C97B1A]">{item.label}</span>
                  <span className="text-[#3B1705] font-medium text-sm">{item.value}</span>
                </div>
              ))}
            </div>
            <a
              href="https://www.openstreetmap.org/?mlat=4.05&mlon=9.7#map=13/4.05/9.7"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[9px] tracking-[0.2em] uppercase text-[#C97B1A] hover:text-[#3B1705] transition-colors"
            >
              Voir en plein écran →
            </a>
          </div>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-px bg-[#3B1705]/10" />
      </div>

      {/* ── SECTION 3 : NOS DISTRIBUTEURS ── */}
      <section className="py-20 md:py-28" id="distributeurs">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[#C97B1A] tracking-[0.35em] text-[10px] uppercase mb-3 flex items-center gap-3">
            <span className="w-8 h-px bg-[#C97B1A]" />
            03 — Nos Distributeurs
          </p>
          <h2
            className="text-[#3B1705] mb-6"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            Réseau de distribution.
          </h2>
          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Left: info + CTA */}
            <div>
              <p className="text-[9px] tracking-[0.3em] uppercase text-[#C97B1A] mb-4 flex items-center gap-2">
                <span className="w-5 h-px bg-[#C97B1A]" />
                À propos
              </p>
              <p className="text-[#2A1006]/60 leading-relaxed mb-10">
                Nos produits sont actuellement disponibles à Douala. Notre réseau de distributeurs
                s'étendra progressivement au Cameroun et dans la sous-région. Contactez-nous pour
                en savoir plus ou pour devenir distributeur.
              </p>
              <a
                href="mailto:contact@teintdafrique.com"
                className="inline-flex items-center gap-2 bg-[#3B1705] text-[#FAF6EF] px-8 py-4 text-[11px] tracking-[0.25em] uppercase hover:bg-[#C97B1A] transition-colors"
              >
                Devenir distributeur →
              </a>
            </div>

            {/* Right: partner logos */}
            <div>
              <p className="text-[9px] tracking-[0.3em] uppercase text-[#C97B1A] mb-4 flex items-center gap-2">
                <span className="w-5 h-px bg-[#C97B1A]" />
                Nos partenaires
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'BeautyAfrik', tagline: 'Beauté naturelle', color: '#8B3A0A', bg: '#8B3A0A12' },
                  { name: 'Cosmétic CM', tagline: 'Distribution Cameroun', color: '#2A6B4A', bg: '#2A6B4A12' },
                  { name: 'NaturalGlow', tagline: 'Soins africains', color: '#C97B1A', bg: '#C97B1A12' },
                  { name: 'AfroShop', tagline: 'E-commerce Afrique', color: '#4A2A6B', bg: '#4A2A6B12' },
                ].map(partner => (
                  <div
                    key={partner.name}
                    className="p-5 flex flex-col justify-between border transition-all hover:shadow-md group"
                    style={{ background: partner.bg, borderColor: partner.color + '20' }}
                  >
                    <div
                      className="text-lg font-semibold mb-1 leading-tight"
                      style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: partner.color }}
                    >
                      {partner.name}
                    </div>
                    <p className="text-[10px] tracking-[0.1em] uppercase" style={{ color: partner.color + 'aa' }}>
                      {partner.tagline}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-[#2A1006]/35 mt-5 leading-relaxed">
                Vous souhaitez distribuer nos produits ?{' '}
                <a href="mailto:contact@teintdafrique.com" className="text-[#C97B1A] hover:underline">
                  Contactez-nous
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
