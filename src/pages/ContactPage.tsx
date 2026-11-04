import { useState } from 'react'
import { useLang, useT } from '@/context/LanguageContext'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import { usePageContent } from '@/hooks/usePageContent'
import { generalUrl } from '@/lib/whatsapp'
import { submitContactMessage } from '@/lib/api'

const EN: Record<string, string> = {
  Contact: 'Contact',
  'Nous sommes à votre écoute. Écrivez-nous, retrouvez-nous sur les réseaux sociaux, ou venez nous rendre visite à Douala.':
    "We're here to listen. Write to us, find us on social media, or come and visit us in Douala.",
  '01 — Nous Contacter': '01 — Contact Us',
  'Parlons de votre beauté.': "Let's talk about your beauty.",
  Adresse: 'Address',
  'Douala, Cameroun': 'Douala, Cameroon',
  'Nous écrire sur WhatsApp': 'Write to us on WhatsApp',
  'Réseaux Sociaux': 'Social Media',
  'Message envoyé !': 'Message sent!',
  'Merci de nous avoir contactés. Nous vous répondrons dans les plus brefs délais.':
    'Thank you for contacting us. We will get back to you as soon as possible.',
  'Nouveau message': 'New message',
  'Envoyez-nous un message': 'Send us a message',
  'Nom complet': 'Full name',
  'Votre nom': 'Your name',
  Téléphone: 'Phone',
  Message: 'Message',
  'Votre message, votre demande...': 'Your message, your request...',
  'Envoyer le Message': 'Send Message',
  '02 — Localisation': '02 — Location',
  'Où nous trouver.': 'Where to find us.',
  "Teint d'Afrique Cosmétiques — Douala, Cameroun":
    "Teint d'Afrique Cosmétiques — Douala, Cameroon",
  Ville: 'City',
  Pays: 'Country',
  Cameroun: 'Cameroon',
  'Voir en plein écran →': 'View full screen →',
  '03 — Nos Distributeurs': '03 — Our Distributors',
  'Réseau de distribution.': 'Distribution network.',
  'À propos': 'About',
  "Nos produits sont actuellement disponibles à Douala. Notre réseau de distributeurs s'étendra progressivement au Cameroun et dans la sous-région. Contactez-nous pour en savoir plus ou pour devenir distributeur.":
    'Our products are currently available in Douala. Our distributor network will gradually expand across Cameroon and the sub-region. Contact us to learn more or to become a distributor.',
  'Devenir distributeur →': 'Become a distributor →',

  'Nos partenaires': 'Our partners',
  'Beauté naturelle': 'Natural beauty',
  'Distribution Cameroun': 'Distribution Cameroon',
  'Soins africains': 'African skincare',
  'E-commerce Afrique': 'E-commerce Africa',
  'Vous souhaitez distribuer nos produits ?': 'Would you like to distribute our products?',
  'Contactez-nous': 'Contact us',
}

const FORM_ERRORS: Record<string, string> = {
  invalid_name: 'Veuillez indiquer votre nom.',
  invalid_email: 'Veuillez indiquer une adresse email valide.',
  invalid_message: 'Votre message est trop court.',
  rate_limited: 'Trop de messages envoyés. Réessayez dans quelques minutes.',
  api_error: "L'envoi a échoué. Réessayez ou contactez-nous sur WhatsApp.",
}

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const t = useT(EN)
  const { lang } = useLang()
  const settings = useSiteSettings()
  const c = usePageContent('contact', lang, {
    title: { fr: 'Contact', en: 'Contact' },
    lead: {
      fr: 'Nous sommes à votre écoute. Écrivez-nous, retrouvez-nous sur les réseaux sociaux, ou venez nous rendre visite à Douala.',
      en: "We're here to listen. Write to us, find us on social media, or come and visit us in Douala.",
    },
    intro: {
      fr: 'Parlons de votre beauté.',
      en: "Let's talk about your beauty.",
    },
    contact_section_label: { fr: '01 — Nous Contacter', en: '01 — Contact Us' },
    address_label: { fr: 'Adresse', en: 'Address' },
    email_label: { fr: 'Email', en: 'Email' },
    whatsapp_label: { fr: 'WhatsApp', en: 'WhatsApp' },
    whatsapp_cta: { fr: 'Nous écrire sur WhatsApp', en: 'Write to us on WhatsApp' },
    social_label: { fr: 'Réseaux Sociaux', en: 'Social Media' },
    sent_title: { fr: 'Message envoyé !', en: 'Message sent!' },
    sent_text: {
      fr: 'Merci de nous avoir contactés. Nous vous répondrons dans les plus brefs délais.',
      en: 'Thank you for contacting us. We will get back to you as soon as possible.',
    },
    new_message: { fr: 'Nouveau message', en: 'New message' },
    form_title: { fr: 'Envoyez-nous un message', en: 'Send us a message' },
    name_label: { fr: 'Nom complet', en: 'Full name' },
    name_placeholder: { fr: 'Votre nom', en: 'Your name' },
    phone_label: { fr: 'Téléphone', en: 'Phone' },
    message_label: { fr: 'Message', en: 'Message' },
    message_placeholder: { fr: 'Votre message, votre demande...', en: 'Your message, your request...' },
    submit: { fr: 'Envoyer le Message', en: 'Send Message' },
    location_section_label: { fr: '02 — Localisation', en: '02 — Location' },
    location_title: { fr: 'Où nous trouver.', en: 'Where to find us.' },
    city_label: { fr: 'Ville', en: 'City' },
    country_label: { fr: 'Pays', en: 'Country' },
    city_value: { fr: 'Douala', en: 'Douala' },
    country_value: { fr: 'Cameroun', en: 'Cameroon' },
    map_title: {
      fr: "Teint d'Afrique Cosmétiques — Douala, Cameroun",
      en: "Teint d'Afrique Cosmétiques — Douala, Cameroon",
    },
    fullscreen: { fr: 'Voir en plein écran ↗', en: 'View full screen ↗' },
    distributors_section_label: { fr: '03 — Nos Distributeurs', en: '03 — Our Distributors' },
    distributors_title: { fr: 'Réseau de distribution.', en: 'Distribution network.' },
    about_label: { fr: 'À propos', en: 'About' },
    distributors_text: {
      fr: "Nos produits sont actuellement disponibles à Douala. Notre réseau de distributeurs s'étendra progressivement au Cameroun et dans la sous-région. Contactez-nous pour en savoir plus ou pour devenir distributeur.",
      en: 'Our products are currently available in Douala. Our distributor network will gradually expand across Cameroon and the sub-region. Contact us to learn more or to become a distributor.',
    },
    become_distributor: { fr: 'Devenir distributeur ↗', en: 'Become a distributor ↗' },
    partners_label: { fr: 'Nos partenaires', en: 'Our partners' },
    contact_prompt: { fr: 'Vous souhaitez distribuer nos produits ?', en: 'Would you like to distribute our products?' },
    contact_link: { fr: 'Contactez-nous', en: 'Contact us' },
  })
  const address = lang === 'en' ? settings.address_en : settings.address_fr
  const socialLinks = [
    { label: 'Facebook', abbr: 'fb', href: settings.facebook_url },
    { label: 'Instagram', abbr: 'ig', href: settings.instagram_url },
    { label: 'TikTok', abbr: 'tk', href: settings.tiktok_url },
    { label: 'YouTube', abbr: 'yt', href: settings.youtube_url },
  ].filter(link => link.href)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setFormError(null)
    try {
      await submitContactMessage(form)
      setSent(true)
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch (err) {
      const code = err instanceof Error ? err.message : 'api_error'
      setFormError(FORM_ERRORS[code] ?? FORM_ERRORS.api_error)
    } finally {
      setSending(false)
    }
  }

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
            {c.title}
          </h1>
          <p className="text-[#FAF6EF]/60 max-w-md">
            {c.lead}
          </p>
        </div>
      </div>

      {/* ── SECTION 1 : NOUS CONTACTER ── */}
      <section className="py-10 md:py-10" id="nous-contacter">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[#C97B1A] tracking-[0.35em] text-[10px] uppercase mb-3 flex items-center gap-3">
            <span className="w-8 h-px bg-[#C97B1A]" />
            {c.contact_section_label}
          </p>
          <h2
            className="text-[#3B1705] mb-14"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            {c.intro}
          </h2>

          <div className="grid md:grid-cols-2 gap-16">
            {/* Info */}
            <div>
              <div className="space-y-8 mb-12">
                {[
                  { label: c.address_label, icon: '◈', text: address, href: undefined },
                  { label: c.email_label, icon: '◉', text: settings.email, href: `mailto:${settings.email}` },
                  {
                    label: c.whatsapp_label,
                    icon: '✆',
                    text: c.whatsapp_cta,
                    href: generalUrl(lang, settings.whatsapp_number),
                  },
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
                <p className="text-[9px] tracking-[0.3em] uppercase text-[#C97B1A] mb-5">{c.social_label}</p>
                <div className="flex gap-3">
                  {socialLinks.map(link => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      className="w-11 h-11 border border-[#3B1705]/20 flex items-center justify-center text-[#3B1705] text-[11px] uppercase tracking-widest hover:bg-[#3B1705] hover:text-white hover:border-[#3B1705] transition-all"
                    >
                      {link.abbr}
                    </a>
                  ))}
                  <a
                    href={generalUrl(lang, settings.whatsapp_number)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="w-11 h-11 flex items-center justify-center text-white text-[11px] uppercase tracking-widest hover:opacity-85 transition-opacity"
                    style={{ background: '#25D366' }}
                  >
                    wa
                  </a>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-[#3B1705] p-8 md:p-10">
              {sent ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-6 py-16">
                  <div className="text-[#C97B1A] text-5xl" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>✓</div>
                  <h3 className="text-[#FAF6EF] text-2xl" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>{c.sent_title}</h3>
                  <p className="text-[#FAF6EF]/60 text-sm leading-relaxed max-w-xs">{c.sent_text}</p>
                  <button onClick={() => setSent(false)} className="mt-4 border border-[#FAF6EF]/20 text-[#FAF6EF]/70 px-6 py-2.5 text-[11px] tracking-[0.2em] uppercase hover:bg-[#FAF6EF]/10 transition-colors">{c.new_message}</button>
                </div>
              ) : (
                <>
                  <h3 className="text-[#FAF6EF] text-2xl mb-8" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>{c.form_title}</h3>
                  <form className="space-y-5" onSubmit={handleSubmit}>
                    {[
                      { key: 'name' as const, label: c.name_label, type: 'text', placeholder: c.name_placeholder, required: true, autoComplete: 'name' },
                      { key: 'email' as const, label: c.email_label, type: 'email', placeholder: 'votre@email.com', required: true, autoComplete: 'email' },
                      { key: 'phone' as const, label: c.phone_label, type: 'tel', placeholder: '+237 6XX XXX XXX', required: false, autoComplete: 'tel' },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="text-[9px] tracking-[0.3em] uppercase text-[#FAF6EF]/55 block mb-2">
                          {f.label} {f.required && <span className="text-[#C97B1A]">*</span>}
                        </label>
                        <input
                          type={f.type}
                          name={f.key}
                          value={form[f.key]}
                          autoComplete={f.autoComplete}
                          onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                          placeholder={f.placeholder}
                          required={f.required}
                          maxLength={200}
                          className="w-full bg-[#FAF6EF]/8 border border-[#FAF6EF]/18 text-[#FAF6EF] placeholder:text-[#FAF6EF]/28 px-4 py-3 text-sm focus:outline-none focus:border-[#C97B1A] transition-colors"
                        />
                      </div>
                    ))}
                    <div>
                      <label className="text-[9px] tracking-[0.3em] uppercase text-[#FAF6EF]/55 block mb-2">{c.message_label} <span className="text-[#C97B1A]">*</span></label>
                      <textarea
                        name="message"
                        rows={5}
                        value={form.message}
                        onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                        placeholder={c.message_placeholder}
                        required
                        maxLength={5000}
                        className="w-full bg-[#FAF6EF]/8 border border-[#FAF6EF]/18 text-[#FAF6EF] placeholder:text-[#FAF6EF]/28 px-4 py-3 text-sm focus:outline-none focus:border-[#C97B1A] transition-colors resize-none"
                      />
                    </div>
                    {formError && <p className="text-xs text-red-300">{formError}</p>}
                    <button type="submit" disabled={sending} className="w-full bg-[#C97B1A] text-white py-4 text-[11px] tracking-[0.25em] uppercase hover:bg-[#A85E0F] transition-colors disabled:opacity-60">
                      {sending ? '...' : c.submit}
                    </button>
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
      <section className="py-10 md:py-10" id="localisation">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[#C97B1A] tracking-[0.35em] text-[10px] uppercase mb-3 flex items-center gap-3">
            <span className="w-8 h-px bg-[#C97B1A]" />
            {c.location_section_label}
          </p>
          <h2
            className="text-[#3B1705] mb-14"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            {c.location_title}
          </h2>

          <div className="w-full overflow-hidden border border-[#3B1705]/10" style={{ height: '420px' }}>
            <iframe
              title={c.map_title}
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
                { label: c.city_label, value: c.city_value },
                { label: c.country_label, value: c.country_value },
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
              {c.fullscreen}
            </a>
          </div>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-px bg-[#3B1705]/10" />
      </div>

      {/* ── SECTION 3 : NOS DISTRIBUTEURS ── */}
      <section className="py-10 md:py-10" id="distributeurs">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[#C97B1A] tracking-[0.35em] text-[10px] uppercase mb-3 flex items-center gap-3">
            <span className="w-8 h-px bg-[#C97B1A]" />
            {c.distributors_section_label}
          </p>
          <h2
            className="text-[#3B1705] mb-6"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            {c.distributors_title}
          </h2>
          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Left: info + CTA */}
            <div>
              <p className="text-[9px] tracking-[0.3em] uppercase text-[#C97B1A] mb-4 flex items-center gap-2">
                <span className="w-5 h-px bg-[#C97B1A]" />
                {c.about_label}
              </p>
              <p className="text-[#2A1006]/60 leading-relaxed mb-10">
                {c.distributors_text}
              </p>
              <a
                href={`mailto:${settings.email}`}
                className="inline-flex items-center gap-2 bg-[#3B1705] text-[#FAF6EF] px-8 py-4 text-[11px] tracking-[0.25em] uppercase hover:bg-[#C97B1A] transition-colors"
              >
                {c.become_distributor}
              </a>
            </div>

            {/* Right: partner logos */}
            <div>
              <p className="text-[9px] tracking-[0.3em] uppercase text-[#C97B1A] mb-4 flex items-center gap-2">
                <span className="w-5 h-px bg-[#C97B1A]" />
                {c.partners_label}
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
                      {t(partner.tagline)}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-[#2A1006]/35 mt-5 leading-relaxed">
                {c.contact_prompt}{' '}
                <a href={`mailto:${settings.email}`} className="text-[#C97B1A] hover:underline">
                  {c.contact_link}
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
