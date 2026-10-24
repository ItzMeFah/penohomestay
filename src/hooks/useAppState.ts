import { useState, useEffect } from 'react';
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
  safeStorage,
  fetchAllFromSupabase,
  subscribeToSupabaseRealtime
} from '../utils/storage';
import { CMSHomepage, GalleryItem, Booking, AdminNotification } from '../types';
import { LanguageType } from '../utils/lang';

function parseCurrentRoute(): string {
  const path = window.location.pathname;
  const hash = window.location.hash;

  if (path.startsWith('/backoffice') || hash.startsWith('#/backoffice') || hash === '#backoffice') {
    return '/backoffice';
  }

  // Graceful redirect for previous /admin bookmarks
  if (path.startsWith('/admin') || hash.startsWith('#/admin') || hash === '#admin') {
    if (typeof window !== 'undefined' && window.history) {
      window.history.replaceState(null, '', '/backoffice');
    }
    return '/backoffice';
  }

  if (path === '/supabase' || hash.startsWith('#/supabase') || hash === '#/supabase' || hash === '#supabase') {
    return '/supabase';
  }

  if (path === '/home/book' || path === '/book' || hash.startsWith('#/home/book') || hash === '#/book' || hash === '#book') {
    return '/home/book';
  }

  if (path === '/home' || path === '/' || path === '' || hash.startsWith('#/home') || hash === '#home') {
    return '/home';
  }

  return '/home';
}

export function useAppState() {
  const [route, setRoute] = useState<string>(() => parseCurrentRoute());

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
  const [selectedVillaId, setSelectedVillaId] = useState<string>("");

  // Global Language State
  const [lang, setLang] = useState<LanguageType>(() => {
    try {
      const match = document.cookie.match(/googtrans=([^;]+)/);
      if (match) {
        const val = decodeURIComponent(match[1]);
        if (val.endsWith('/en')) return 'EN';
        if (val.endsWith('/id')) return 'ID';
      }
    } catch (e) {}
    return (safeStorage.getItem("peno_lang") as LanguageType) || "ID";
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

  // Sync state dengan Google Translate Combo Box ketika termuat
  useEffect(() => {
    let attempts = 0;
    const interval = setInterval(() => {
      const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
      if (combo) {
        const targetVal = lang === 'EN' ? 'en' : 'id';
        if (combo.value !== targetVal) {
          combo.value = targetVal;
          combo.dispatchEvent(new Event('change'));
        }
        clearInterval(interval);
      }
      attempts++;
      if (attempts > 30) {
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [lang]);

  // Global Currency State
  const [currency, setCurrency] = useState<CurrencyType>(() => {
    return (safeStorage.getItem("peno_currency") as CurrencyType) || "IDR";
  });

  const handleSetCurrency = (newCurrency: CurrencyType) => {
    setCurrency(newCurrency);
    safeStorage.setItem("peno_currency", newCurrency);
  };

  // Initialize and load default values once on mount
  useEffect(() => {
    initDefaultData();
    setHomepageData(getHomepage());
    setGalleryData(getGallery());
    setBookings(getBookings());
    setBlockedDates(getBlockedDates());
    setNotifications(getNotifications());
    setSettings(getSettings());
  }, []);

  // Load and sync live data from Supabase
  useEffect(() => {
    const initSync = async () => {
      await fetchAllFromSupabase();
      setBookings(getBookings());
      setBlockedDates(getBlockedDates());
      setHomepageData(getHomepage());
      setGalleryData(getGallery());
      setNotifications(getNotifications());
      setSettings(getSettings());
    };
    
    initSync();

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
        setHomepageData(getHomepage());
      } else if (type === 'notifications') {
        setNotifications(data);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
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

    const handleRouteUpdate = () => {
      const nextRoute = parseCurrentRoute();
      const needsLoader = nextRoute === '/home/book' || nextRoute.startsWith('/backoffice') || nextRoute.startsWith('/admin');
      
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

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const path = window.location.pathname;
      if (path === '/home' || path === '/' || path === '') {
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
      } else if (path === '/home/book' || path === '/book') {
        setActiveSection('booking');
      }
    };
    window.addEventListener('scroll', handleScroll);

    const bc = listenToBroadcast({
      cms_updated: () => {
        setHomepageData(getHomepage());
        setGalleryData(getGallery());
      },
      dates_updated: () => {
        setBlockedDates(getBlockedDates());
      },
      booking_new: () => {
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
    setHomepageData(getHomepage());
  };

  const handleUpdateBookings = (data: Booking[]) => {
    saveBookings(data);
    setBookings(data);
    broadcastChange("booking_new", data);
  };

  const handleUpdateNotifications = (data: AdminNotification[]) => {
    saveNotifications(data);
    setNotifications(data);
  };

  const handleSubmitBooking = (bookingData: Omit<Booking, 'id' | 'created_at' | 'status' | 'total_eur'>) => {
    const villas = homepageData.villas || [];
    const selectedVilla = villas.find(v => v.id === bookingData.villa_id);
    const pricePerNight = selectedVilla ? selectedVilla.pricePerPax : (settings.pricePerNight || 140);

    const newBooking: Booking = {
      ...bookingData,
      id: "PNO-" + Date.now().toString().slice(-8),
      created_at: new Date().toISOString(),
      status: 'pending',
      total_eur: bookingData.nights * pricePerNight
    };

    const updatedBookings = [newBooking, ...bookings];
    saveBookings(updatedBookings);
    setBookings(updatedBookings);

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

    broadcastChange("booking_new", newBooking);

    return newBooking;
  };

  const navigateToPage = (page: 'home' | 'booking' | 'supabase' | 'admin' | 'backoffice', sectionId?: string) => {
    setMobileMenuOpen(false);
    
    const targetPath = page === 'home' ? '/home' : page === 'booking' ? '/home/book' : (page === 'admin' || page === 'backoffice') ? '/backoffice' : '/supabase';
    
    const changeRoute = () => {
      if (window.location.pathname !== targetPath) {
        window.history.pushState(null, '', targetPath);
      }
      
      if (sectionId) {
        window.location.hash = `#${sectionId}`;
      } else {
        if (window.location.hash) {
          window.history.replaceState(null, '', targetPath);
        }
      }
      
      setRoute(targetPath);

      if (sectionId) {
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

    const needsLoader = targetPath === '/home/book' || targetPath.startsWith('/backoffice') || targetPath.startsWith('/admin');

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

  return {
    route,
    homepageData,
    galleryData,
    bookings,
    blockedDates,
    notifications,
    settings,
    isScrolled,
    mobileMenuOpen,
    setMobileMenuOpen,
    isRouteLoading,
    activeSection,
    selectedVillaId,
    setSelectedVillaId,
    lang,
    setLang: handleSetLang,
    showLangTooltip,
    currency,
    setCurrency: handleSetCurrency,
    handleUpdateHomepage,
    handleUpdateGallery,
    handleUpdateBlockedDates,
    handleUpdateSettings,
    handleUpdateBookings,
    handleUpdateNotifications,
    handleSubmitBooking,
    navigateToPage
  };
}
