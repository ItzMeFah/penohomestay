import { AnimatePresence, motion } from 'motion/react';
import { MessageSquare, ChevronLeft } from 'lucide-react';
import { LanguageType, translations } from '../utils/lang';

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
  settings: any;
  lang: LanguageType;
  setLang: (l: LanguageType) => void;
  activeSection: string;
  showLangTooltip: boolean;
  isScrolled: boolean;
  onNavigate: (page: 'home' | 'booking' | 'supabase' | 'admin', sectionId?: string) => void;
}

export function Navbar({
  settings,
  lang,
  setLang,
  activeSection,
  showLangTooltip,
  isScrolled,
  onNavigate
}: NavbarProps) {
  const t = translations[lang];

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 px-4 py-3 md:px-12 flex flex-col md:flex-row md:items-center md:justify-between ${
        isScrolled || window.location.pathname === '/home/book'
          ? 'bg-green-deep/90 backdrop-blur-md shadow-xl border-b border-green-soft/20' 
          : 'bg-green-deep/40 backdrop-blur-sm border-b border-white/5'
      } no-print`}
    >
      <div className="flex items-center justify-between w-full md:w-auto">
        <button
          onClick={() => onNavigate('home')}
          className="font-serif text-cream text-lg sm:text-xl md:text-2xl font-bold tracking-wide cursor-pointer outline-none flex items-center space-x-3 group text-left"
        >
          <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-white shadow-md border border-sand/30 overflow-visible transition-transform duration-300 group-hover:scale-105 z-10 mr-1.5 flex-shrink-0">
            <div className="absolute w-[80px] h-[80px] -inset-[13px] pointer-events-none select-none z-0 animate-coffee-pulse-slow">
              <svg viewBox="0 0 120 120" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="coffeeSplash" cx="50%" cy="50%" r="50%" fx="35%" fy="35%">
                    <stop offset="0%" stopColor="#bf8554" />
                    <stop offset="65%" stopColor="#7a4b27" />
                    <stop offset="90%" stopColor="#4f2f16" />
                    <stop offset="100%" stopColor="#2e1909" />
                  </radialGradient>
                </defs>
                
                <path 
                  d="M60 22C68 21, 75 25, 83 26C89 27, 93 23, 97 29C101 35, 96 42, 100 49C104 56, 107 63, 104 71C101 79, 94 82, 91 90C88 98, 80 97, 73 101C66 105, 59 104, 51 103C43 102, 35 106, 29 100C23 94, 28 86, 23 79C18 72, 11 67, 13 59C15 51, 23 48, 25 40C27 32, 24 25, 31 19C38 13, 44 21, 52 22C55 22.5, 57 22, 60 22Z" 
                  fill="url(#coffeeSplash)" 
                  opacity="0.92"
                />

                <circle cx="94" cy="18" r="3.2" fill="#7a4b27" />
                <circle cx="94" cy="18" r="1.5" fill="#bf8554" />
                
                <circle cx="112" cy="46" r="2.5" fill="#4f2f16" />
                <circle cx="108" cy="51" r="1.5" fill="#bf8554" />
                
                <circle cx="104" cy="85" r="4" fill="#2e1909" />
                <circle cx="104" cy="85" r="1.8" fill="#7a4b27" />
                
                <circle cx="65" cy="111" r="3.5" fill="#7a4b27" />
                <circle cx="20" cy="98" r="2.8" fill="#4f2f16" />
                
                <circle cx="8" cy="62" r="3.5" fill="#7a4b27" />
                <circle cx="8" cy="62" r="1.5" fill="#bf8554" />

                <circle cx="12" cy="28" r="3" fill="#2e1909" />
                <circle cx="42" cy="10" r="2.5" fill="#bf8554" />
              </svg>
            </div>

            <div className="absolute -inset-[14px] pointer-events-none select-none z-20 animate-coffee-spin-slow">
              <div className="absolute top-1 right-1 w-4 h-4 transform -rotate-12 animate-float-gentle">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                  <path 
                    d="M19.5 8.5c-1.5-3-5-4.5-8-4-3 .5-6 3.5-7 6.5s.5 6 3.5 7.5 7 1 9-2c1.5-2.5 4-5 2.5-8z" 
                    fill="#42250f" 
                  />
                  <path 
                    d="M6 12.5c2-1 4.5-1.5 6-.5s2 3 4.5 3" 
                    stroke="#ebdfc8" 
                    strokeWidth="1.6" 
                    strokeLinecap="round" 
                  />
                </svg>
              </div>

              <div className="absolute bottom-1.5 left-0.5 w-3.5 h-3.5 transform rotate-[110deg] animate-float-gentle" style={{ animationDelay: '2.5s' }}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                  <path 
                    d="M19.5 8.5c-1.5-3-5-4.5-8-4-3 .5-6 3.5-7 6.5s.5 6 3.5 7.5 7 1 9-2c1.5-2.5 4-5 2.5-8z" 
                    fill="#331b0a" 
                  />
                  <path 
                    d="M6 12.5c2-1 4.5-1.5 6-.5s2 3 4.5 3" 
                    stroke="#ebdfc8" 
                    strokeWidth="1.6" 
                    strokeLinecap="round" 
                  />
                </svg>
              </div>
            </div>

            <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-white z-10 relative shadow-inner">
              <img 
                src="https://njgsafkwldootsupwjsb.supabase.co/storage/v1/object/public/avatars/421966157_3180688145419564_5828608585761882436_n.jpg" 
                alt="Peno Homestay Logo" 
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
          onClick={() => onNavigate('home', 'keunggulan')} 
          className={`text-xs md:text-sm font-semibold tracking-wider whitespace-nowrap transition-all cursor-pointer hover:text-sand hover:-translate-y-0.5 pb-1 border-b-2 ${
            activeSection === 'keunggulan' ? 'text-sand border-sand font-bold' : 'text-cream/90 border-transparent'
          }`}
        >
          {t.navExperience}
        </button>
        <button 
          onClick={() => onNavigate('home', 'galeri')} 
          className={`text-xs md:text-sm font-semibold tracking-wider whitespace-nowrap transition-all cursor-pointer hover:text-sand hover:-translate-y-0.5 pb-1 border-b-2 ${
            activeSection === 'galeri' ? 'text-sand border-sand font-bold' : 'text-cream/90 border-transparent'
          }`}
        >
          {t.navGallery}
        </button>

        <button
          onClick={() => onNavigate('booking')}
          className={`font-sans text-xs md:text-sm font-extrabold tracking-wider transition-all uppercase whitespace-nowrap pb-1 border-b-2 ${
            activeSection === 'booking' ? 'text-sand border-sand' : 'text-cream/90 hover:text-sand border-transparent'
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
            referrerPolicy="no-referrer"
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
