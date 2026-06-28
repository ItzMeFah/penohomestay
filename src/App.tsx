import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, MessageSquare, Calendar, ChevronLeft } from 'lucide-react';
import { 
  initDefaultData, 
  getHomepage, 
  getGallery, 
  getBookings, 
  getBlockedDates, 
  getNotifications, 
  getSettings, 
  saveHomepage, 
  saveGallery, 
  saveBookings, 
  saveBlockedDates, 
  saveNotifications, 
  saveSettings,
  listenToBroadcast,
  broadcastChange,
  CurrencyType,
  convertAndFormatPrice,
  safeStorage,
  fetchAllFromSupabase,
  subscribeToSupabaseRealtime
} from './utils/storage';
import { CMSHomepage, GalleryItem, Booking, AdminNotification } from './types';
import { LandingPage } from './components/LandingPage';
import { BookingEngine } from './components/BookingEngine';
import { AdminPanel } from './components/AdminPanel';
import { SupabasePlaybook } from './components/SupabasePlaybook';
import { RouteLoader } from './components/RouteLoader';
import { translations, LanguageType } from './utils/lang';

// Parse current page route robustly across pathnames and hashes
function parseCurrentRoute(): string {
  const path = window.location.pathname;
  const hash = window.location.hash;

  // 1. If starts with /admin, always treat as admin!
  if (path.startsWith('/admin') || hash.startsWith('#/admin') || hash === '#admin') {
    return '/admin';
  }

  // 1.5 Check supabase routes
  if (path === '/supabase' || hash.startsWith('#/supabase') || hash === '#/supabase' || hash === '#supabase') {
    return '/supabase';
  }

  // 2. Check book routes
  if (path === '/home/book' || path === '/book' || hash.startsWith('#/home/book') || hash === '#/book' || hash === '#book') {
    return '/home/book';
  }

  // 3. Check home routes
  if (path === '/home' || path === '/' || path === '' || hash.startsWith('#/home') || hash === '#home') {
    return '/home';
  }

  // Fallback
  return '/home';
}

interface LanguageSelectorProps {
  lang: LanguageType;
  setLang: (l: LanguageType) => void;
  compact?: boolean;
}

function LanguageSelector({ lang, setLang, compact = false }: LanguageSelectorProps) {
  if (compact) {
    return (
      <div className="flex items-center space-x-1 bg-white/10 p-0.5 rounded-full border border-white/10 no-print">
        {(['ID', 'EN'] as LanguageType[]).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`px-2 py-1 rounded-full text-[10px] font-extrabold transition-all cursor-pointer ${
              lang === l
                ? 'bg-sand text-green-deep shadow-sm scale-105'
                : 'text-cream/80 hover:text-cream hover:bg-white/5'
            }`}
          >
            {l}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center bg-green-soft/30 p-1 rounded-full border border-green-soft/20 no-print">
      {(['ID', 'EN'] as LanguageType[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wider transition-all cursor-pointer ${
            lang === l
              ? 'bg-sand text-green-deep shadow-md scale-105'
              : 'text-cream/90 hover:text-cream hover:bg-white/5'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export default function App() {
  // Routing state based on Location Pathname & Hash
  const [route, setRoute] = useState<string>(() => {
    return parseCurrentRoute();
  });

  // Load and manage database/storage states
  const [homepageData, setHomepageData] = useState<CMSHomepage>(getHomepage());
  const [galleryData, setGalleryData] = useState<GalleryItem[]>(getGallery());
  const [bookings, setBookings] = useState<Booking[]>(getBookings());
  const [blockedDates, setBlockedDates] = useState<string[]>(getBlockedDates());
  const [notifications, setNotifications] = useState<AdminNotification[]>(getNotifications());
  const [settings, setSettings] = useState(getSettings());

  // Global UI elements
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Global Language State
  const [lang, setLang] = useState<LanguageType>(() => {
    return (safeStorage.getItem("peno_lang") as LanguageType) || "EN";
  });

  // Dual language notice tooltip (visible for 5 seconds)
  const [showLangTooltip, setShowLangTooltip] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLangTooltip(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleSetLang = (newLang: LanguageType) => {
    setLang(newLang);
    safeStorage.setItem("peno_lang", newLang);
  };

  // Global Currency State
  const [currency, setCurrency] = useState<CurrencyType>(() => {
    return (safeStorage.getItem("peno_currency") as CurrencyType) || "EUR";
  });

  const handleSetCurrency = (newCurrency: CurrencyType) => {
    setCurrency(newCurrency);
    safeStorage.setItem("peno_currency", newCurrency);
  };

  // Initialize and load default values once on mount
  useEffect(() => {
    initDefaultData();
    
    // Refresh state after initialization
    setHomepageData(getHomepage());
    
    // Migration: Move uploaded header photos from gallery to header only
    const rawGallery = getGallery();
    let migrated = false;
    const updatedGallery = rawGallery.map(item => {
      // If it is an uploaded photo (has a url) AND is shown in the header slideshow (showInSlideshow is true or undefined)
      // AND is currently also enabled for the gallery, we move it out of the gallery so it's ONLY in the header.
      if (item.url && item.url.trim().length > 0 && item.showInSlideshow !== false && item.showInGallery !== false) {
        migrated = true;
        return {
          ...item,
          showInGallery: false,
          showInSlideshow: true
        };
      }
      return item;
    });

    if (migrated) {
      saveGallery(updatedGallery);
      setGalleryData(updatedGallery);
    } else {
      setGalleryData(rawGallery);
    }
    setBookings(getBookings());
    setBlockedDates(getBlockedDates());
    setNotifications(getNotifications());
    setSettings(getSettings());
  }, []);

  // Load and sync live data from Supabase
  useEffect(() => {
    const initSync = async () => {
      // 1. Initial pull
      await fetchAllFromSupabase();
      
      // 2. Refresh states
      setBookings(getBookings());
      setBlockedDates(getBlockedDates());
      setHomepageData(getHomepage());
      setGalleryData(getGallery());
      setNotifications(getNotifications());
      setSettings(getSettings());
    };
    
    initSync();

    // 3. Realtime subscribe
    const unsubscribe = subscribeToSupabaseRealtime((type, data) => {
      if (type === 'bookings') {
        setBookings(data);
      } else if (type === 'blocked_dates') {
        setBlockedDates(data);
      } else if (type === 'homepage') {
        setHomepageData(data);
      } else if (type === 'gallery') {
        setGalleryData(data);
      } else if (type === 'settings') {
        setSettings(data);
        // Sync standard price if settings changed
        const cms = getHomepage();
        setHomepageData(cms);
      } else if (type === 'notifications') {
        setNotifications(data);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Redirect to '/home' if route is not valid
    const initialRoute = parseCurrentRoute();
    if (initialRoute === '/home' && window.location.pathname !== '/home' && !window.location.hash) {
      window.history.replaceState(null, '', '/home');
    }
    setRoute(initialRoute);
    if (initialRoute === '/home/book') {
      setActiveSection('booking');
    } else {
      setActiveSection('hero');
    }

    // Monitor Pathname & Hash Route Changes
    const handleRouteUpdate = () => {
      const nextRoute = parseCurrentRoute();
      const needsLoader = nextRoute === '/home/book' || nextRoute.startsWith('/admin');
      
      if (needsLoader) {
        setIsRouteLoading(true);
        setTimeout(() => {
          setRoute(nextRoute);
          if (nextRoute === '/home/book') {
            setActiveSection('booking');
          }
          setTimeout(() => setIsRouteLoading(false), 500);
        }, 300);
      } else {
        setRoute(nextRoute);
        if (nextRoute === '/home') {
          // Reset to scroll spy detection immediately
          const sections = ['hero', 'keunggulan', 'galeri', 'ulasan'];
          const scrollPosition = window.scrollY + 200;
          let currentSection = 'hero';
          for (const sectionId of sections) {
            const el = document.getElementById(sectionId);
            if (el) {
              const top = el.offsetTop;
              if (scrollPosition >= top) {
                currentSection = sectionId;
              }
            }
          }
          setActiveSection(currentSection);
        }
      }
    };
    window.addEventListener('popstate', handleRouteUpdate);
    window.addEventListener('hashchange', handleRouteUpdate);

    // Monitor Scroll for Navbar Glassmorphism and Scroll Spy
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const path = window.location.pathname;
      if (path === '/home' || path === '/' || path === '') {
        const sections = ['hero', 'keunggulan', 'galeri', 'ulasan'];
        const scrollPosition = window.scrollY + 200; // offset for the navbar

        let currentSection = 'hero';
        for (const sectionId of sections) {
          const el = document.getElementById(sectionId);
          if (el) {
            const top = el.offsetTop;
            if (scrollPosition >= top) {
              currentSection = sectionId;
            }
          }
        }
        setActiveSection(currentSection);
      } else if (path === '/home/book' || path === '/book') {
        setActiveSection('booking');
      }
    };
    window.addEventListener('scroll', handleScroll);

    // Subscribing to Real-time Sync Broadcast Channel
    const bc = listenToBroadcast({
      cms_updated: (data) => {
        setHomepageData(getHomepage());
        setGalleryData(getGallery());
      },
      dates_updated: (data) => {
        setBlockedDates(getBlockedDates());
      },
      booking_new: (data) => {
        setBookings(getBookings());
        setNotifications(getNotifications());
      }
    });

    return () => {
      window.removeEventListener('popstate', handleRouteUpdate);
      window.removeEventListener('hashchange', handleRouteUpdate);
      window.removeEventListener('scroll', handleScroll);
      if (bc) bc.close();
    };
  }, []);

  // Update callbacks that save state and broadcast
  const handleUpdateHomepage = (data: CMSHomepage) => {
    saveHomepage(data);
    setHomepageData(data);
  };

  const handleUpdateGallery = (data: GalleryItem[]) => {
    saveGallery(data);
    setGalleryData(data);
  };

  const handleUpdateBlockedDates = (data: string[]) => {
    saveBlockedDates(data);
    setBlockedDates(data);
  };

  const handleUpdateSettings = (data: any) => {
    saveSettings(data);
    setSettings(data);
    setHomepageData(getHomepage()); // Pricing sync
  };

  const handleUpdateBookings = (data: Booking[]) => {
    saveBookings(data);
    setBookings(data);
    // Broadcast for multi-tab sync
    broadcastChange("booking_new", data);
  };

  const handleUpdateNotifications = (data: AdminNotification[]) => {
    saveNotifications(data);
    setNotifications(data);
  };

  // Submit Booking handler from engine page
  const handleSubmitBooking = (bookingData: Omit<Booking, 'id' | 'created_at' | 'status' | 'total_eur'>) => {
    const newBooking: Booking = {
      ...bookingData,
      id: "PNO-" + Date.now().toString().slice(-8),
      created_at: new Date().toISOString(),
      status: 'pending',
      total_eur: bookingData.nights * (settings.pricePerNight || 140)
    };

    // 1. Add to bookings
    const updatedBookings = [newBooking, ...bookings];
    saveBookings(updatedBookings);
    setBookings(updatedBookings);

    // 2. Add to notifications
    const newNotif: AdminNotification = {
      id: Date.now(),
      read: false,
      type: 'new_booking',
      booking: newBooking,
      time: new Date().toISOString()
    };
    const updatedNotifs = [newNotif, ...notifications];
    saveNotifications(updatedNotifs);
    setNotifications(updatedNotifs);

    // 3. Broadcast to other tabs
    broadcastChange("booking_new", newBooking);

    return newBooking;
  };

  // Safe page navigation using pathnames and handling hashes gracefully
  const navigateToPage = (page: 'home' | 'booking' | 'supabase' | 'admin', sectionId?: string) => {
    setMobileMenuOpen(false);
    
    const targetPath = page === 'home' ? '/home' : page === 'booking' ? '/home/book' : page === 'admin' ? '/admin' : '/supabase';
    
    const changeRoute = () => {
      // Only push if the pathname or hash is different
      if (window.location.pathname !== targetPath) {
        window.history.pushState(null, '', targetPath);
      }
      
      // Clean up or set hash
      if (sectionId) {
        window.location.hash = `#${sectionId}`;
      } else {
        // Clear hash cleanly
        if (window.location.hash) {
          window.history.replaceState(null, '', targetPath);
        }
      }
      
      setRoute(targetPath);

      if (sectionId) {
        // Allow DOM to render if we just switched pages
        const delay = window.location.pathname !== targetPath ? 150 : 0;
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, delay);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const needsLoader = targetPath === '/home/book' || targetPath.startsWith('/admin');

    if (route !== targetPath) {
      if (needsLoader) {
        setIsRouteLoading(true);
        setTimeout(() => {
          changeRoute();
          setTimeout(() => {
            setIsRouteLoading(false);
          }, 500);
        }, 400);
      } else {
        changeRoute();
      }
    } else {
      changeRoute();
    }
  };

  // Is current view admin panel?
  const isAdminView = route.startsWith('/admin');
  const t = translations[lang];

  return (
    <div className="font-sans min-h-screen text-text-dark bg-cream/40">
      <AnimatePresence>
        {isRouteLoading && <RouteLoader />}
      </AnimatePresence>
      
      {/* 1. PUBLIC HEADER NAVBAR (Omit on Admin views) */}
      {!isAdminView && (
        <nav
          id="navbar"
          className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 px-4 py-3 md:px-12 flex flex-col md:flex-row md:items-center md:justify-between ${
            isScrolled || route === '/home/book'
              ? 'bg-green-deep/90 backdrop-blur-md shadow-xl border-b border-green-soft/20' 
              : 'bg-green-deep/40 backdrop-blur-sm border-b border-white/5'
          } no-print`}
        >
          <div className="flex items-center justify-between w-full md:w-auto">
            {/* Logo link */}
            <button
              onClick={() => navigateToPage('home')}
              className="font-serif text-cream text-lg sm:text-xl md:text-2xl font-bold tracking-wide cursor-pointer outline-none flex items-center space-x-3 group text-left"
            >
              {/* Circular logo badge with animated coffee splash rings & floating coffee beans */}
              <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-white shadow-md border border-sand/30 overflow-visible transition-transform duration-300 group-hover:scale-105 z-10 mr-1.5 flex-shrink-0">
                {/* Organic Coffee Splash Ring Wrapper - pulsing/scaling slowly */}
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
                    
                    {/* Organic circular splash contour */}
                    <path 
                      d="M60 22C68 21, 75 25, 83 26C89 27, 93 23, 97 29C101 35, 96 42, 100 49C104 56, 107 63, 104 71C101 79, 94 82, 91 90C88 98, 80 97, 73 101C66 105, 59 104, 51 103C43 102, 35 106, 29 100C23 94, 28 86, 23 79C18 72, 11 67, 13 59C15 51, 23 48, 25 40C27 32, 24 25, 31 19C38 13, 44 21, 52 22C55 22.5, 57 22, 60 22Z" 
                      fill="url(#coffeeSplash)" 
                      opacity="0.92"
                    />

                    {/* Fine splash droplets spraying outward */}
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

                {/* Slow orbiting layer for Coffee Beans */}
                <div className="absolute -inset-[14px] pointer-events-none select-none z-20 animate-coffee-spin-slow">
                  {/* Floating Coffee Bean 1 */}
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

                  {/* Floating Coffee Bean 2 */}
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

                {/* The central white circular badge masking the real logo */}
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

            {/* Right elements for mobile (Language selector & compact Book button) */}
            <div className="flex items-center space-x-2 md:hidden">
              <div className="relative">
                <LanguageSelector lang={lang} setLang={handleSetLang} compact={true} />
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
                      {/* Arrow pointing UP */}
                      <div className="absolute top-0 -mt-1 right-5 w-2 h-2 bg-sand transform rotate-45 border-l border-t border-sand-dark/15" />
                      <span className="relative z-10">Switch language here! 🌐</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Nav Links row directly visible on all screen sizes, scrollable on extremely small viewports */}
          <div className="flex items-center justify-start md:justify-end space-x-5 md:space-x-8 mt-3 md:mt-0 overflow-x-auto md:overflow-visible no-scrollbar scroll-smooth py-1 -mx-4 px-4 md:mx-0 md:px-0">
            <button 
              onClick={() => navigateToPage('home', 'keunggulan')} 
              className={`text-xs md:text-sm font-semibold tracking-wider whitespace-nowrap transition-all cursor-pointer hover:text-sand hover:-translate-y-0.5 pb-1 border-b-2 ${
                activeSection === 'keunggulan' ? 'text-sand border-sand font-bold' : 'text-cream/90 border-transparent'
              }`}
            >
              {t.navExperience}
            </button>
            <button 
              onClick={() => navigateToPage('home', 'galeri')} 
              className={`text-xs md:text-sm font-semibold tracking-wider whitespace-nowrap transition-all cursor-pointer hover:text-sand hover:-translate-y-0.5 pb-1 border-b-2 ${
                activeSection === 'galeri' ? 'text-sand border-sand font-bold' : 'text-cream/90 border-transparent'
              }`}
            >
              {t.navGallery}
            </button>

            <button
              onClick={() => navigateToPage('booking')}
              className={`font-sans text-xs md:text-sm font-extrabold tracking-wider transition-all uppercase whitespace-nowrap pb-1 border-b-2 ${
                activeSection === 'booking' ? 'text-sand border-sand' : 'text-cream/90 hover:text-sand border-transparent'
              }`}
            >
              {t.navBook}
            </button>

            {/* Language Selector on Desktop */}
            <div className="hidden md:block relative">
              <LanguageSelector lang={lang} setLang={handleSetLang} compact={false} />
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
                    {/* Speech bubble arrow pointing UP to the button */}
                    <div className="absolute top-0 -mt-1.5 right-6 w-3 h-3 bg-sand transform rotate-45 border-l border-t border-sand-dark/15" />
                    <span className="relative z-10">Switch language here! 🌐</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Contact Us button on Desktop */}
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
      )}

      {/* 2. CORE CLIENT-SIDE Hash Router SWITCH */}
      <div className="min-h-screen">
        {route === '/home' && (
          <LandingPage
            homepageData={homepageData}
            galleryData={galleryData}
            settings={settings}
            onNavigate={navigateToPage}
            currency={currency}
            lang={lang}
          />
        )}

        {route === '/home/book' && (
          <BookingEngine
            settings={settings}
            bookings={bookings}
            blockedDates={blockedDates}
            onSubmitBooking={handleSubmitBooking}
            onNavigate={navigateToPage}
            currency={currency}
            onChangeCurrency={handleSetCurrency}
            lang={lang}
            homepageData={homepageData}
          />
        )}

        {route === '/supabase' && (
          <div className="pt-28 pb-16 px-4 md:px-12 max-w-7xl mx-auto">
            <SupabasePlaybook />
          </div>
        )}

        {route.startsWith('/admin') && (
          <AdminPanel
            bookings={bookings}
            blockedDates={blockedDates}
            homepageData={homepageData}
            galleryData={galleryData}
            settings={settings}
            notifications={notifications}
            onUpdateBookings={handleUpdateBookings}
            onUpdateBlockedDates={handleUpdateBlockedDates}
            onUpdateHomepage={handleUpdateHomepage}
            onUpdateGallery={handleUpdateGallery}
            onUpdateSettings={handleUpdateSettings}
            onUpdateNotifications={handleUpdateNotifications}
          />
        )}
      </div>

      {/* 4. PUBLIC FOOTER (Omit on Admin views) */}
      {!isAdminView && (
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
                  <button onClick={() => navigateToPage('home', 'keunggulan')} className="hover:text-sand transition-colors cursor-pointer">{t.navExperience}</button>
                </li>
                <li>
                  <button onClick={() => navigateToPage('home', 'galeri')} className="hover:text-sand transition-colors cursor-pointer">{t.navGallery}</button>
                </li>
                <li>
                  <button onClick={() => navigateToPage('home', 'ulasan')} className="hover:text-sand transition-colors cursor-pointer">{t.navTestimonials}</button>
                </li>
                <li>
                  <button onClick={() => navigateToPage('booking', 'info')} className="hover:text-sand transition-colors cursor-pointer">{t.infoLabel}</button>
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
            <div className="flex space-x-6 items-center">
              <a 
                href="/supabase" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  navigateToPage('supabase');
                }} 
                className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors flex items-center space-x-1"
              >
                <span>⚡ Supabase Hub</span>
              </a>

              <span className="text-white/10 select-none">|</span>

              <a 
                href="/admin" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  navigateToPage('admin');
                }} 
                className="hover:text-sand transition-colors"
              >
                Portal Admin
              </a>
            </div>
          </div>
        </footer>
      )}

    </div>
  );
}
