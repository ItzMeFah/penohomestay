import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MessageSquare } from 'lucide-react';
import { LanguageType, translations } from '@/src/utils/lang';
import { safeStorage } from '@/src/utils/storage';

interface LanguageSelectorProps {
  lang: LanguageType;
  setLang: (l: LanguageType) => void;
  compact?: boolean;
}

export function LanguageSelector({ lang, setLang, compact = false }: LanguageSelectorProps) {
  const isEnglish = lang === 'EN';

  return (
    <div className={`flex items-center space-x-2 no-print rounded-2xl border border-white/15 select-none transition-all ${
      compact ? 'bg-white/10 px-2 py-1' : 'bg-green-soft/20 px-3 py-1.5'
    }`}>
      <span className={`text-[10px] md:text-xs font-black font-sans tracking-wide transition-all duration-300 ${!isEnglish ? 'text-sand scale-105' : 'text-cream/40'}`}>ID</span>
      
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          id="switch-bahasa" 
          checked={isEnglish}
          onChange={(e) => {
            const nextLang = e.target.checked ? 'EN' : 'ID';
            setLang(nextLang);
          }}
          className="sr-only peer" 
        />
        <div className="w-9 h-5 bg-green-deep/90 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-sand after:rounded-full after:h-4 after:w-4 after:transition-all border border-green-soft/40 peer-checked:bg-green-soft"></div>
      </label>
      
      <span className={`text-[10px] md:text-xs font-black font-sans tracking-wide transition-all duration-300 ${isEnglish ? 'text-sand scale-105' : 'text-cream/40'}`}>EN</span>
    </div>
  );
}

interface NavbarProps {
  settings?: any;
  lang?: LanguageType;
  setLang?: (l: LanguageType) => void;
  activeSection?: string;
  showLangTooltip?: boolean;
  isScrolled?: boolean;
  onNavigate?: (page: 'home' | 'booking' | 'supabase' | 'admin', sectionId?: string) => void;
}

export function Navbar({
  settings: propSettings,
  lang: propLang,
  setLang: propSetLang,
  activeSection: propActiveSection,
  showLangTooltip: propShowLangTooltip,
  isScrolled: propIsScrolled,
  onNavigate
}: NavbarProps) {
  const [localLang, setLocalLang] = useState<LanguageType>(() => {
    if (typeof window !== 'undefined') {
      return (safeStorage.getItem('peno_lang') as LanguageType) || 'ID';
    }
    return 'ID';
  });

  const [localIsScrolled, setLocalIsScrolled] = useState(false);
  const [localShowTooltip, setLocalShowTooltip] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');

  const lang = propLang || localLang;
  const setLang = propSetLang || ((newLang: LanguageType) => {
    setLocalLang(newLang);
    safeStorage.setItem('peno_lang', newLang);
  });

  const settings = propSettings || {
    homestayName: 'Peno Homestay',
    whatsappUrl: 'https://wa.me/6281233800631?text=Halo%20Pak%20Peno,%20saya%20tertarik%20menginap%20di%20Peno%20Homestay',
    whatsappNumber: '+62 812-3380-0631'
  };

  const isScrolled = propIsScrolled !== undefined ? propIsScrolled : localIsScrolled;
  const showLangTooltip = propShowLangTooltip !== undefined ? propShowLangTooltip : localShowTooltip;

  useEffect(() => {
    const handleScroll = () => {
      setLocalIsScrolled(window.scrollY > 50);

      const sections = ['hero', 'keunggulan', 'galeri', 'ulasan'];
      const scrollPosition = window.scrollY + 200;
      let current = 'hero';
      for (const s of sections) {
        const el = document.getElementById(s);
        if (el && scrollPosition >= el.offsetTop) {
          current = s;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLocalShowTooltip(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const t = translations[lang] || translations.ID;
  const isBookingPage = propActiveSection === 'booking';

  const handleNavClick = (targetSection?: string) => {
    if (onNavigate) {
      onNavigate('home', targetSection);
      return;
    }

    if (targetSection) {
      const el = document.getElementById(targetSection);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 px-4 py-3 md:px-12 flex flex-col md:flex-row md:items-center md:justify-between ${
        isScrolled || isBookingPage
          ? 'bg-green-deep/90 backdrop-blur-md shadow-xl border-b border-green-soft/20' 
          : 'bg-green-deep/40 backdrop-blur-sm border-b border-white/5'
      } no-print`}
    >
      <div className="flex items-center justify-between w-full md:w-auto">
        <button
          onClick={() => {
            if (onNavigate) {
              onNavigate('home');
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="font-serif text-cream text-lg sm:text-xl md:text-2xl font-bold tracking-wide cursor-pointer outline-none flex items-center space-x-3 group text-left"
        >
          <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-white shadow-md border border-sand/30 overflow-visible transition-transform duration-300 group-hover:scale-105 z-10 mr-1.5 flex-shrink-0">
            <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-white z-10 relative shadow-inner">
              <img 
                src="https://njgsafkwldootsupwjsb.supabase.co/storage/v1/object/public/avatars/421966157_3180688145419564_5828608585761882436_n.jpg" 
                alt="Logo Peno Homestay Banyuwangi" 
                className="w-full h-full object-contain p-0.5"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <span>{settings.homestayName}</span>
        </button>

        <div className="flex items-center space-x-2 md:hidden">
          <div className="relative">
            <LanguageSelector lang={lang} setLang={setLang} compact={true} />
            <AnimatePresence>
              {showLangTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.9 }}
                  animate={{ 
                    opacity: 1, 
                    y: [0, -4, 0],
                    scale: 1
                  }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ 
                    y: {
                      repeat: Infinity,
                      duration: 2,
                      ease: "easeInOut"
                    },
                    default: { duration: 0.3 }
                  }}
                  className="absolute top-full mt-2.5 right-0 bg-sand text-green-deep text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-lg border border-sand-dark/15 whitespace-nowrap z-50 flex flex-col items-center"
                >
                  <div className="absolute top-0 -mt-1 right-5 w-2 h-2 bg-sand transform rotate-45 border-l border-t border-sand-dark/15" />
                  <span className="relative z-10">Switch language here! 🌐</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-start md:justify-end space-x-5 md:space-x-8 mt-3 md:mt-0 overflow-x-auto md:overflow-visible no-scrollbar scroll-smooth py-1 -mx-4 px-4 md:mx-0 md:px-0">
        <button 
          onClick={() => handleNavClick('keunggulan')} 
          className={`text-xs md:text-sm font-semibold tracking-wider whitespace-nowrap transition-all cursor-pointer hover:text-sand hover:-translate-y-0.5 pb-1 border-b-2 ${
            (propActiveSection || activeSection) === 'keunggulan' && !isBookingPage ? 'text-sand border-sand font-bold' : 'text-cream/90 border-transparent'
          }`}
        >
          {t.navExperience}
        </button>
        <button 
          onClick={() => handleNavClick('galeri')} 
          className={`text-xs md:text-sm font-semibold tracking-wider whitespace-nowrap transition-all cursor-pointer hover:text-sand hover:-translate-y-0.5 pb-1 border-b-2 ${
            (propActiveSection || activeSection) === 'galeri' && !isBookingPage ? 'text-sand border-sand font-bold' : 'text-cream/90 border-transparent'
          }`}
        >
          {t.navGallery}
        </button>

        <button
          onClick={() => {
            if (onNavigate) {
              onNavigate('booking');
            }
          }}
          className={`font-sans text-xs md:text-sm font-extrabold tracking-wider transition-all uppercase whitespace-nowrap pb-1 border-b-2 cursor-pointer ${
            isBookingPage || propActiveSection === 'booking' ? 'text-sand border-sand' : 'text-cream/90 hover:text-sand border-transparent'
          }`}
        >
          {t.navBook}
        </button>

        <div className="hidden md:block relative">
          <LanguageSelector lang={lang} setLang={setLang} compact={false} />
          <AnimatePresence>
            {showLangTooltip && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ 
                  opacity: 1, 
                  y: [0, -6, 0],
                  scale: 1
                }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ 
                  y: {
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut"
                  },
                  default: { duration: 0.3 }
                }}
                className="absolute top-full mt-3 right-0 bg-sand text-green-deep text-xs font-bold px-3 py-2 rounded-xl shadow-lg border border-sand-dark/15 whitespace-nowrap z-50 flex flex-col items-center"
              >
                <div className="absolute top-0 -mt-1.5 right-6 w-3 h-3 bg-sand transform rotate-45 border-l border-t border-sand-dark/15" />
                <span className="relative z-10">Switch language here! 🌐</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="hidden lg:block whitespace-nowrap">
          <a 
            href={settings.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-green-soft hover:bg-green-medium text-cream font-medium px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-xs md:text-sm">{t.navContact}</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
