import { Link } from 'react-router'
import paBadge from '@/imports/PA_StatementEXE_CMJN.jpg'
import { useT } from '@/context/LanguageContext'

const EN = {
  BEAUTÉ: 'BEAUTY',
  'Notre engagement': 'Our commitment',
  "Nous croyons que chaque teint est une beauté à part entière. Teint d'Afrique Cosmétiques s'engage à formuler des soins qui révèlent, nourrissent et célèbrent la peau noire — sans jamais chercher à l'altérer. Parce que ":
    "We believe every complexion is beauty in its own right. Teint d'Afrique Cosmétiques is committed to formulating care that reveals, nourishes and celebrates black skin — without ever seeking to alter it. Because ",
  'Voir nos soins →': 'See our care →',
  'Notre histoire': 'Our story',
  'Gammes exclusives': 'Exclusive ranges',
  'Produits naturels': 'Natural products',
  'Ingrédients naturels': 'Natural ingredients',
}

export default function BlackSkinsBanner() {
  const t = useT(EN)
  return (
    <div
      className="relative overflow-hidden border-t border-[#C9971A]/25"
      style={{ background: '#2A1006' }}
    >
      {/* Decorative background text */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none"
        aria-hidden="true"
      >
        <span
          className="font-bold leading-none whitespace-nowrap text-[#FAF6EF]/[0.04]"
          style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: 'clamp(6rem, 18vw, 18rem)',
          }}
        >
          {t('BEAUTÉ')}
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">

          {/* Badge */}
          <div className="flex-shrink-0">
            <div className="flex h-36 w-36 items-center justify-center rounded-full bg-[#FAF6EF] p-3 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.8)] md:h-44 md:w-44 md:p-4">
              <img
                src={paBadge}
                alt="Black Skins = Beautiful Skins"
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          {/* Text */}
          <div className="text-center md:text-left">
            <p
              className="text-[#C9971A] text-[10px] tracking-[0.4em] uppercase mb-4"
              style={{ fontFamily: 'Outfit, system-ui, sans-serif' }}
            >
              {t('Notre engagement')}
            </p>
            <h2
              className="text-[#FAF6EF] leading-tight mb-5 whitespace-nowrap"
              style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
                fontSize: 'clamp(1.2rem, 4.5vw, 3.5rem)',
              }}
            >
              Black Skins = Beautiful Skins
            </h2>
            <p
              className="text-[#FAF6EF]/65 leading-relaxed max-w-2xl mb-8"
              style={{ fontFamily: 'Outfit, system-ui, sans-serif', fontSize: '15px' }}
            >
              {t("Nous croyons que chaque teint est une beauté à part entière. Teint d'Afrique Cosmétiques s'engage à formuler des soins qui révèlent, nourrissent et célèbrent la peau noire — sans jamais chercher à l'altérer. Parce que ")}
              <strong className="text-[#FAF6EF]">#VOTRE_PEAU_VAUT_DE_LOR</strong>.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link
                to="/boutique"
                className="bg-[#C9971A] text-[#2A1006] px-7 py-3.5 text-[11px] tracking-[0.2em] uppercase hover:bg-[#FAF6EF] transition-colors"
                style={{ fontFamily: 'Outfit, system-ui, sans-serif' }}
              >
                {t('Voir nos soins →')}
              </Link>
              <Link
                to="/histoire"
                className="border border-[#FAF6EF]/35 text-[#FAF6EF] px-7 py-3.5 text-[11px] tracking-[0.2em] uppercase hover:bg-[#FAF6EF]/10 transition-colors"
                style={{ fontFamily: 'Outfit, system-ui, sans-serif' }}
              >
                {t('Notre histoire')}
              </Link>
            </div>
          </div>

          {/* Stats — desktop only */}
          <div className="hidden lg:flex flex-col gap-5 flex-shrink-0 ml-auto">
            {[
              { n: '4', label: 'Gammes exclusives' },
              { n: '16', label: 'Produits naturels' },
              { n: '100%', label: 'Ingrédients naturels' },
            ].map(s => (
              <div key={s.label} className="text-center bg-[#FAF6EF]/[0.06] px-6 py-4">
                <div
                  className="text-[#FAF6EF] text-3xl leading-none"
                  style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                >
                  {s.n}
                </div>
                <div
                  className="text-[#FAF6EF]/50 text-[10px] tracking-[0.15em] uppercase mt-1"
                  style={{ fontFamily: 'Outfit, system-ui, sans-serif' }}
                >
                  {t(s.label)}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
