import { ChevronLeft } from 'lucide-react';
import { LanguageType, translations } from '../utils/lang';

interface FooterProps {
  settings: any;
  lang: LanguageType;
  onNavigate: (page: 'home' | 'booking' | 'supabase' | 'admin', sectionId?: string) => void;
}

export function Footer({ settings, lang, onNavigate }: FooterProps) {
  const t = translations[lang];

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
              referrerPolicy="no-referrer"
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
              <button onClick={() => onNavigate('home', 'keunggulan')} className="hover:text-sand transition-colors cursor-pointer">{t.navExperience}</button>
            </li>
            <li>
              <button onClick={() => onNavigate('home', 'galeri')} className="hover:text-sand transition-colors cursor-pointer">{t.navGallery}</button>
            </li>
            <li>
              <button onClick={() => onNavigate('home', 'ulasan')} className="hover:text-sand transition-colors cursor-pointer">{t.navTestimonials}</button>
            </li>
            <li>
              <button onClick={() => onNavigate('booking', 'info')} className="hover:text-sand transition-colors cursor-pointer">{t.infoLabel}</button>
            </li>
          </ul>
        </div>

        {/* Right Contact Details */}
        <div className="md:col-span-4 space-y-6">
          <h4 className="font-serif text-lg font-bold text-sand font-semibold">{t.footerContact}</h4>
          <ul className="space-y-3 font-sans text-sm text-cream/75 font-light leading-relaxed">
            <li className="flex items-start space-x-2">
              <span className="font-semibold text-sand">{t.footerAddress}:</span>
              <span>{settings.address}</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="font-semibold text-sand">WhatsApp:</span>
              <a href={settings.whatsappUrl} className="hover:text-sand hover:underline">{settings.whatsappNumber}</a>
            </li>
            <li>
              <a 
                href={settings.mapsUrl} 
                target="_blank" 
                referrerPolicy="no-referrer"
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-sand hover:text-cream border-b border-dashed border-sand/40 pb-0.5"
              >
                <span>{t.footerMapsBtn} &rarr;</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-cream/50 font-sans font-light relative z-10 gap-4">
        <div>&copy; {new Date().getFullYear()} {settings.homestayName}. All rights reserved.</div>
      </div>
    </footer>
  );
}
