import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { LanguageType, translations } from '@/src/utils/lang';

interface FooterProps {
  settings?: any;
  lang?: LanguageType;
  onNavigate?: (page: 'home' | 'booking' | 'supabase' | 'admin', sectionId?: string) => void;
}

export function Footer({ settings: propSettings, lang = 'ID', onNavigate }: FooterProps) {
  const t = translations[lang] || translations.ID;

  const settings = propSettings || {
    homestayName: 'Peno Homestay Banyuwangi',
    instagramUrl: 'https://instagram.com/penohomestay',
    address: 'Jl. Samarinda, Lingkungan Lerek RT 02 RW 01, Gombengsari, Kalipuro, Banyuwangi, Jawa Timur 68411',
    whatsappUrl: 'https://wa.me/6281233800631?text=Halo%20Pak%20Peno,%20saya%20tertarik%20menginap%20di%20Peno%20Homestay',
    whatsappNumber: '+62 812-3380-0631',
    mapsUrl: 'https://maps.google.com/?q=Peno+Homestay+Banyuwangi'
  };

  const handleNavClick = (targetPage: 'home' | 'booking', sectionId?: string) => {
    if (onNavigate) {
      onNavigate(targetPage, sectionId);
      return;
    }

    if (sectionId) {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-green-deep text-cream pt-20 pb-10 border-t border-green-soft/20 relative overflow-hidden no-print">
      <div className="absolute top-0 right-0 w-80 h-80 bg-green-soft/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-coffee/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-white/10 pb-16 relative z-10">
        {/* Left Bio */}
        <div className="md:col-span-5 space-y-6">
          <h3 className="font-serif text-2xl font-bold tracking-tight text-cream">{settings.homestayName}</h3>
          <p className="font-sans text-sm text-cream/70 font-light leading-relaxed max-w-sm">
            {t.footerDesc}
          </p>
          <div className="flex items-center space-x-4">
            <a 
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-cream rounded-full transition-all"
              title="Follow kami di Instagram"
            >
              <ChevronLeft className="w-4 h-4 rotate-180" />
            </a>
          </div>
        </div>

        {/* Middle Nav Links */}
        <div className="md:col-span-3 space-y-6">
          <h4 className="font-serif text-lg font-bold text-sand">{t.footerNav}</h4>
          <ul className="space-y-3 font-sans text-sm text-cream/75 font-light">
            <li>
              <button onClick={() => handleNavClick('home', 'keunggulan')} className="hover:text-sand transition-colors cursor-pointer text-left">
                {t.navExperience}
              </button>
            </li>
            <li>
              <button onClick={() => handleNavClick('home', 'galeri')} className="hover:text-sand transition-colors cursor-pointer text-left">
                {t.navGallery}
              </button>
            </li>
            <li>
              <button onClick={() => handleNavClick('home', 'ulasan')} className="hover:text-sand transition-colors cursor-pointer text-left">
                {t.navTestimonials}
              </button>
            </li>
            <li>
              <button onClick={() => handleNavClick('booking')} className="hover:text-sand transition-colors cursor-pointer text-left">
                {t.infoLabel}
              </button>
            </li>
            <li>
              <button onClick={() => handleNavClick('home', 'hero')} className="hover:text-sand transition-colors cursor-pointer text-left">
                {t.heroSubtitle}
              </button>
            </li>
          </ul>
        </div>

        {/* Right Contact/Address */}
        <div className="md:col-span-4 space-y-6">
          <h4 className="font-serif text-lg font-bold text-sand">{t.footerContact}</h4>
          <div className="space-y-3 font-sans text-sm text-cream/75 font-light">
            <p className="leading-relaxed">
              <strong className="font-semibold text-cream block mb-1">{t.footerAddress}:</strong>
              {settings.address}
            </p>
            <p>
              <strong className="font-semibold text-cream block mb-1">WhatsApp:</strong>
              <a href={settings.whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-sand transition-colors underline decoration-sand/40">
                {settings.whatsappNumber}
              </a>
            </p>
            <div className="pt-2">
              <a 
                href={settings.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-xs font-bold text-green-deep bg-sand hover:bg-sand-dark px-4 py-2.5 rounded-full transition-all shadow-md"
              >
                <span>{t.footerMapsBtn}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-cream/40 font-light space-y-4 md:space-y-0">
        <p>© {new Date().getFullYear()} {settings.homestayName}. All rights reserved.</p>
        <p className="flex items-center space-x-1">
          <span>Gombengsari, Kalipuro, Banyuwangi</span>
        </p>
      </div>
    </footer>
  );
}
