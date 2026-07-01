import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, Coffee, MapPin, Compass, Utensils, Droplets, Heart, 
  Instagram, MessageSquare, Calendar, ChevronLeft, ChevronRight, 
  ExternalLink, Clock, Info, Shield, ArrowRight, Home, Map, X,
  Check, Phone, Trees, Mountain
} from 'lucide-react';
import { CMSHomepage, GalleryItem } from '../types';
import { GalleryIllustration } from './GalleryIllustration';
import { SwayingCoffeeTree, CoffeeBean, CoffeeLeaf } from './CoffeeDecoration';
import { CurrencyType, convertAndFormatPrice } from '../utils/storage';
import { translations, LanguageType } from '../utils/lang';

interface LandingPageProps {
  homepageData: CMSHomepage;
  galleryData: GalleryItem[];
  settings: any;
  onNavigate: (page: 'home' | 'booking', sectionId?: string) => void;
  currency: CurrencyType;
  lang: LanguageType;
  setSelectedVillaId?: (id: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  homepageData,
  galleryData,
  settings,
  onNavigate,
  currency,
  lang,
  setSelectedVillaId
}) => {
  const t = translations[lang];
  const [galleryFilter, setGalleryFilter] = useState(lang === 'ID' ? 'Semua' : 'All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // States & logic for Hero Background 8-Photo Slideshow
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fallback high quality stunning stock photos of Peno Homestay & Banyuwangi atmosphere
  // Filter and sort the gallery items to display
  const sortedGallery = React.useMemo(() => {
    return [...galleryData]
      .filter(item => item.showInGallery !== false)
      .sort((a, b) => a.order - b.order);
  }, [galleryData]);

  const slideshowImages = React.useMemo(() => {
    return [...galleryData]
      .filter(item => item.showInSlideshow !== false && item.url && item.url.trim().length > 0)
      .sort((a, b) => a.order - b.order)
      .map(item => item.url);
  }, [galleryData]);

  // Slideshow interval timer (6 seconds interval for elegant crossfading transition)
  React.useEffect(() => {
    if (slideshowImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slideshowImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slideshowImages]);

  // Sync gallery filter if language changes
  React.useEffect(() => {
    setGalleryFilter(lang === 'ID' ? 'Semua' : 'All');
  }, [lang]);

  // Filter gallery items
  const filteredGallery = galleryFilter === 'Semua' || galleryFilter === 'All'
    ? sortedGallery
    : sortedGallery.filter(item => {
        // Map category aliases if needed
        const isAkomodasi = (galleryFilter === 'Akomodasi' || galleryFilter === 'Accommodations') && item.category === 'Kamar';
        const isAktivitas = (galleryFilter === 'Aktivitas & Alam' || galleryFilter === 'Activities & Nature') && (item.category === 'Alam' || item.category === 'Aktivitas');
        const isKuliner = (galleryFilter === 'Kuliner' || galleryFilter === 'Culinary') && item.category === 'Kuliner';
        const isDestinasi = (galleryFilter === 'Destinasi' || galleryFilter === 'Destinations') && item.category === 'Sekitar';
        return isAkomodasi || isAktivitas || isKuliner || isDestinasi || item.category === galleryFilter;
      });

  const categories = lang === 'ID'
    ? ['Semua', 'Akomodasi', 'Kuliner', 'Aktivitas & Alam', 'Destinasi']
    : ['All', 'Accommodations', 'Culinary', 'Activities & Nature', 'Destinations'];

  // Map icons helper for stats and features
  const renderIcon = (iconName: string, className = "w-6 h-6") => {
    switch (iconName.toLowerCase()) {
      case 'star': return <Star className={`${className} text-sand fill-sand`} />;
      case 'chat':
      case 'message': return <MessageSquare className={className} />;
      case 'euro': return <span className={`${className} font-serif font-bold text-center flex items-center justify-center text-lg`}>€</span>;
      case 'calendar': return <Calendar className={className} />;
      case 'coffee': return <Coffee className={className} />;
      case 'compass': return <Compass className={className} />;
      case 'utensils': return <Utensils className={className} />;
      case 'map-pin': return <MapPin className={className} />;
      case 'droplets': return <Droplets className={className} />;
      case 'heart': return <Heart className={className} />;
      case 'home': return <Home className={className} />;
      case 'map': return <Map className={className} />;
      case 'leaf':
      default: return <Coffee className={className} />;
    }
  };

  const handlePrevLightbox = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(prev => (prev !== null && prev > 0) ? prev - 1 : filteredGallery.length - 1);
  };

  const handleNextLightbox = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(prev => (prev !== null && prev < filteredGallery.length - 1) ? prev + 1 : 0);
  };

  return (
    <div className="bg-cream min-h-screen text-text-dark selection:bg-green-soft selection:text-cream">
      
      {/* 1. HERO SECTION */}
      <section
        id="hero"
        className="relative min-h-screen bg-black flex flex-col justify-center items-center px-6 md:px-12 lg:px-24 overflow-hidden pt-20"
      >
        {/* 📸 Elegant Slideshow Background Backdrop */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: (settings.heroOverlayOpacity ?? 28) / 100, scale: 1 }} // Opacity disesuaikan dari admin
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 1.8, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0 w-full h-full"
            >
              {slideshowImages[currentSlide] ? (
                <img
                  src={slideshowImages[currentSlide]}
                  alt="Peno Homestay Backdrop"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full bg-[#1b3322]" />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute inset-0 bg-black/0 pointer-events-none z-10" />

        {/* Content Wrapper */}
        <div className="max-w-4xl mx-auto text-center relative z-20 flex flex-col items-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-green-soft/20 backdrop-blur-md border border-green-soft/30 px-4 py-2 rounded-full text-sand text-xs md:text-sm font-medium tracking-wide mb-8 shadow-sm"
          >
            <span className="flex items-center text-yellow-400">★</span>
            <span>{lang === 'ID' ? homepageData.hero.badge : t.heroSubtitle}</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-cream mb-6 leading-tight"
            dangerouslySetInnerHTML={{ __html: lang === 'ID' ? homepageData.hero.headline : t.heroTitle }}
          />

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg text-cream/85 font-sans font-light max-w-2xl mb-12 leading-relaxed"
          >
            {lang === 'ID' ? homepageData.hero.subheadline : t.heroDesc}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto"
          >
            <button
              onClick={() => onNavigate('booking')}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-sand hover:bg-cream text-green-deep font-sans font-semibold px-8 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:scale-105 active:scale-95 group"
            >
              <Calendar className="w-5 h-5 transition-transform group-hover:rotate-6" />
              <span>{t.heroCtaBook}</span>
            </button>
            <button
              onClick={() => {
                const galleryElem = document.getElementById('galeri');
                if (galleryElem) galleryElem.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-transparent hover:bg-cream/10 text-cream border-2 border-cream/30 hover:border-cream font-sans font-medium px-8 py-4 rounded-full transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <span>{t.heroCtaExplore}</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. TENTANG KAMI & PESAN PAK PENO */}
      <section id="tentang" className="py-24 px-6 md:px-12 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Left column text */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="lg:col-span-7 space-y-6"
        >
          <div className="flex items-center space-x-2 text-green-soft font-mono text-xs uppercase tracking-widest font-semibold">
            <span>{t.aboutLabel}</span>
            <div className="w-8 h-px bg-green-soft/50" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-green-deep leading-tight">
            {lang === 'ID' ? homepageData.about.title : t.aboutTitle}
          </h2>
          <p className="text-base md:text-lg text-text-mid font-sans font-light leading-relaxed whitespace-pre-line">
            {lang === 'ID' ? homepageData.about.body : `${t.aboutDesc1}\n\n${t.aboutDesc2}`}
          </p>
          
          {/* Highlights grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            {(homepageData.about.highlightItems || []).map((item, idx) => {
              const defaultImages: Record<string, string> = {
                "hl-1": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&h=400&q=80",
                "hl-2": "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&h=400&q=80",
                "hl-3": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=600&h=400&q=80",
                "hl-4": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&h=400&q=80"
              };
              const imgUrl = item.imageUrl || defaultImages[item.id] || "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=600&h=400&q=80";

              // Get dynamic thematic icon based on highlight category or text
              const getHighlightIcon = () => {
                const lowerTitle = (item.title || "").toLowerCase();
                const itemId = item.id || "";
                if (lowerTitle.includes("coffee") || lowerTitle.includes("kopi") || itemId === "hl-1") {
                  return (
                    <svg viewBox="0 0 100 100" fill="currentColor" className="w-3.5 h-3.5 text-sand">
                      <ellipse cx="50" cy="50" rx="42" ry="28" transform="rotate(-30 50 50)" />
                      <path
                        d="M20,62 Q50,35 80,38"
                        stroke="#4a2c11"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </svg>
                  );
                }
                if (lowerTitle.includes("tour") || lowerTitle.includes("tur") || lowerTitle.includes("alam") || lowerTitle.includes("explore") || itemId === "hl-2") {
                  return <Trees className="w-3.5 h-3.5 text-sand" />;
                }
                if (lowerTitle.includes("family") || lowerTitle.includes("keluarga") || lowerTitle.includes("host") || lowerTitle.includes("warm") || itemId === "hl-3") {
                  return <Heart className="w-3.5 h-3.5 fill-sand text-sand" />;
                }
                if (lowerTitle.includes("ijen") || lowerTitle.includes("kawah") || lowerTitle.includes("mount") || lowerTitle.includes("gunung") || itemId === "hl-4") {
                  return <Mountain className="w-3.5 h-3.5 text-sand" />;
                }
                return <Star className="w-3.5 h-3.5 fill-sand text-sand" />;
              };

              return (
                <motion.div
                  key={item.id || idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -60 : 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.8, delay: idx * 0.1, ease: "easeOut" }}
                  className="relative h-48 sm:h-56 lg:h-60 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer border border-sand/20"
                >
                  <img 
                    src={imgUrl} 
                    alt={item.title} 
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Subtle dark gradient overlay for optimal readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 group-hover:from-black/95" />
                  
                  {/* Content floating on top of the image */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 flex flex-col justify-end h-full z-10 text-left">
                    <div className="flex items-center space-x-2.5 mb-1.5">
                      <div className="bg-sand/25 backdrop-blur-md p-1.5 rounded-full text-sand shrink-0 border border-sand/40 flex items-center justify-center">
                        {getHighlightIcon()}
                      </div>
                      <span className="font-sans text-sm sm:text-base font-semibold text-white drop-shadow-sm group-hover:text-sand transition-colors duration-300">
                        {item.title}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-[10px] sm:text-[11px] text-cream/65 font-light tracking-wide line-clamp-2 leading-relaxed transition-all duration-300 group-hover:text-cream/85">
                        {item.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Right column illustration card */}
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          className="lg:col-span-5 relative mt-16 lg:mt-20"
        >
          {/* Decorative background shadow */}
          <div className="absolute inset-0 bg-green-soft rounded-3xl -rotate-3 scale-[1.02] opacity-10 pointer-events-none" />
          
          {/* The card itself - no overflow-hidden so the avatar can pop out! */}
          <div className="bg-green-deep rounded-3xl p-8 pt-20 md:p-10 md:pt-24 shadow-2xl text-cream relative">
            
            {/* Absolute container for the background blur, which is overflow-hidden */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-soft/10 rounded-full blur-2xl" />
            </div>

            {/* Overlapping circular avatar of Pak Peno */}
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-cream shadow-2xl overflow-hidden z-20 bg-cream-dark">
              <img 
                src="https://njgsafkwldootsupwjsb.supabase.co/storage/v1/object/public/avatars/pak%20peno.png" 
                alt="Pak Peno" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* Biography content */}
            <div className="space-y-6 relative z-10 text-center">
              <div className="space-y-1">
                <span className="text-sand font-mono text-[10px] uppercase tracking-widest font-bold">
                  {lang === 'ID' ? 'Kisah Tuan Rumah' : 'Our Host Biography'}
                </span>
                <h3 className="font-serif text-xl md:text-2xl font-bold text-sand">
                  {lang === 'ID' ? 'Pak Peno' : 'Pak Peno'}
                </h3>
                <p className="font-sans text-[10px] text-cream/60">
                  {lang === 'ID' ? 'Petani Kopi & Pemandu Wisata Senior' : 'Coffee Farmer & Senior Local Guide'}
                </p>
              </div>

              <div className="bg-green-soft/10 rounded-2xl p-4 border border-green-soft/20 text-left relative">
                <span className="font-serif text-5xl text-sand/20 absolute -top-3 -left-1 font-extrabold select-none">“</span>
                <p className="font-sans text-xs md:text-sm text-cream/90 font-light leading-relaxed relative z-10 pl-4 italic">
                  {lang === 'ID' 
                    ? '"Peno Homestay bukan sekadar penginapan. Di sini, Anda terlelap dengan wangi cengkeh dan pala, terbangun oleh aroma sangrai kopi tradisional di dapur keluarga kami."' 
                    : t.aboutOwnerDesc}
                </p>
              </div>

              <div className="text-left bg-cream/5 rounded-2xl p-4 border border-cream/5 space-y-2">
                <h4 className="font-serif text-xs font-bold text-sand uppercase tracking-wider flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sand" />
                  <span>{lang === 'ID' ? 'Sekilas Tentang Pak Peno' : 'About Pak Peno'}</span>
                </h4>
                <p className="font-sans text-xs text-cream/80 font-light leading-relaxed">
                  {lang === 'ID' 
                    ? 'Pak Peno adalah generasi petani kopi Gombengsari yang mendedikasikan hidupnya untuk melestarikan kopi rakyat dan membagikan kehangatan budaya lokal kepada wisatawan mancanegara maupun domestik.'
                    : 'Pak Peno is a coffee farmer from Gombengsari who dedicates his life to preserving traditional farming and sharing the authentic warmth of local village culture with guests from all over the world.'}
                </p>
              </div>

              <div className="border-t border-cream/10 pt-4 flex items-center justify-between">
                <div className="flex items-center space-x-3 text-left">
                  <div className="w-9 h-9 rounded-full bg-sand/20 border border-sand/40 flex items-center justify-center font-bold text-sand text-sm">P</div>
                  <div>
                    <div className="font-sans text-xs font-semibold text-cream">
                      {lang === 'ID' ? 'Peno & Keluarga' : 'Peno & Family'}
                    </div>
                    <div className="font-sans text-[10px] text-cream/60">
                      {lang === 'ID' ? 'Tuan Rumah Anda' : 'Your Hosts'}
                    </div>
                  </div>
                </div>
                
                <span className="inline-flex items-center bg-sand/15 px-2.5 py-1 rounded-full text-[9px] font-mono font-bold text-sand uppercase tracking-wider">
                  ★ 4.9 Google Maps
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 5B. TOUR PACKAGES SLIDER */}
      {homepageData.tours && homepageData.tours.length > 0 && (
        <section className="bg-cream py-24 px-6 md:px-12 overflow-hidden border-b border-sand/30">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <span className="text-green-soft font-mono text-xs uppercase tracking-widest font-semibold block">
                {lang === 'ID' ? 'Paket Pengalaman' : 'Experience Packages'}
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-green-deep tracking-tight">
                {lang === 'ID' ? 'Jelajahi Alam Banyuwangi' : 'Explore Banyuwangi Nature'}
              </h2>
              <p className="font-sans text-sm md:text-base text-text-mid font-light leading-relaxed">
                {lang === 'ID' 
                  ? 'Kami menawarkan berbagai paket wisata menarik untuk melengkapi liburan Anda. Nikmati keindahan alam dan budaya lokal bersama pemandu berpengalaman kami.' 
                  : 'We offer various exciting tour packages to complete your holiday. Enjoy the beauty of nature and local culture with our experienced guides.'}
              </p>
            </div>

            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center items-stretch max-w-5xl mx-auto">
                {homepageData.tours.filter(t => t.isActive).map((tour, idx) => (
                  <motion.div
                    key={tour.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="w-full max-w-[360px] mx-auto bg-white/90 backdrop-blur-sm rounded-3xl shadow-sm hover:shadow-xl border border-sand/30 hover:border-green-soft/40 overflow-hidden flex flex-col group hover:-translate-y-2 transition-all duration-500"
                  >
                    <div className="aspect-[16/10] w-full bg-gray-100 relative overflow-hidden flex-shrink-0">
                      {tour.imageUrl ? (
                        <img 
                          src={tour.imageUrl} 
                          alt={tour.name} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                        />
                      ) : (
                        <div className="w-full h-full bg-green-deep/5 flex items-center justify-center">
                          <MapPin className="w-10 h-10 text-green-soft/40" />
                        </div>
                      )}
                      {/* Gentle dark gradient for contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-60 group-hover:opacity-75 transition-opacity duration-500" />
                      
                      {/* Price tag floating at bottom-left */}
                      {tour.price && (
                        <div className="absolute bottom-3 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-xl shadow-sm text-[11px] font-bold text-green-deep tracking-wide">
                          {tour.price}
                        </div>
                      )}
                      
                      {/* Tour tag */}
                      <div className="absolute top-3 right-4 bg-green-deep/80 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-cream">
                        {lang === 'ID' ? 'Tur' : 'Tour'}
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-serif text-base font-bold text-green-deep leading-snug line-clamp-2 group-hover:text-green-soft transition-colors duration-300">
                          {tour.name}
                        </h3>
                        <p className="font-sans text-xs text-text-mid font-light leading-relaxed line-clamp-3">
                          {tour.description}
                        </p>
                      </div>

                      {/* Inclusions as badges */}
                      {tour.inclusions && tour.inclusions.length > 0 && (
                        <div className="space-y-1.5">
                          <h4 className="font-mono text-[9px] font-bold text-green-soft uppercase tracking-wider">
                            {lang === 'ID' ? 'Fasilitas:' : 'Inclusions:'}
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {tour.inclusions.map((inc, i) => (
                              <span 
                                key={i} 
                                className="inline-flex items-center space-x-1 bg-sand/20 border border-sand/40 px-2 py-0.5 rounded-lg text-[10px] text-text-dark font-medium leading-none"
                              >
                                <span className="text-green-soft font-bold">✓</span>
                                <span className="truncate max-w-[125px]">{inc}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Booking Contact Area */}
                      <div className="pt-4 border-t border-sand/20 space-y-3">
                        <a 
                          href={`https://wa.me/${tour.contactPhone.replace(/\D/g,'')}?text=Halo%20Peno%20Homestay,%20saya%20tertarik%20dengan%20paket%20wisata%20${encodeURIComponent(tour.name)}.`}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full flex items-center justify-center space-x-2 bg-green-deep hover:bg-green-soft text-cream hover:text-white py-2.5 px-4 rounded-xl transition-all duration-300 font-semibold text-xs shadow-md hover:shadow-lg active:scale-[0.98]"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{lang === 'ID' ? 'Pesan via WhatsApp' : 'Book via WhatsApp'}</span>
                        </a>
                        
                        <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
                          <span className="flex items-center space-x-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>{tour.contactPhone}</span>
                          </span>
                          {tour.contactSocial && (
                            <span className="hover:text-green-soft transition-colors truncate max-w-[120px]">
                              {tour.contactSocial}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2.5. AKOMODASI EXCLUSIVE (Villas & Room Choices) */}
      {(homepageData.villas || []).length > 0 && (
        <section id="villa-showcase" className="py-24 px-6 md:px-12 bg-cream/10 border-t border-sand/20 relative overflow-hidden">
          {/* Decorative coffee bean background */}
          <CoffeeBean className="top-20 left-[8%] w-8 h-8 text-coffee/10" delay={0.5} duration={6} yOffset={25} rotateSpeed={120} />
          <CoffeeBean className="bottom-20 right-[8%] w-10 h-10 text-coffee/10" delay={2} duration={8} yOffset={30} rotateSpeed={-150} />

          <div className="max-w-6xl mx-auto space-y-16 relative z-10">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <span className="text-green-soft font-mono text-xs uppercase tracking-widest font-semibold block">
                {lang === 'ID' ? 'Pilihan Akomodasi Eksklusif' : 'Exclusive Accommodation Choices'}
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-green-deep tracking-tight">
                {lang === 'ID' ? 'Menginap Nyaman dengan View Alam' : 'Comfortable Stays with Nature Views'}
              </h2>
              <p className="font-sans text-sm md:text-base text-text-mid font-light leading-relaxed">
                {lang === 'ID' 
                  ? 'Kami menyediakan berbagai pilihan villa dan kamar premium dengan fasilitas lengkap, kenyamanan ekstra, serta pemandangan asri perkebunan kopi.' 
                  : 'We offer a collection of premium villas and rooms equipped with modern comforts, extra amenities, and direct views of the beautiful coffee farm.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center items-stretch">
              {homepageData.villas!.map((villa: any, idx) => (
                <motion.div
                  key={villa.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-sand/30 hover:border-green-soft/40 flex flex-col justify-between group hover:-translate-y-2 transition-all duration-500"
                >
                  <div className="aspect-[4/3] w-full bg-gray-50 relative overflow-hidden">
                    {villa.imageUrl ? (
                      <img 
                        src={villa.imageUrl} 
                        alt={villa.title} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                      />
                    ) : (
                      <div className="w-full h-full bg-green-deep/5 flex items-center justify-center">
                        <Home className="w-12 h-12 text-green-soft/40" />
                      </div>
                    )}
                    
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-green-deep flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>{lang === 'ID' ? 'Tersedia' : 'Available'}</span>
                    </div>

                    <div className="absolute bottom-4 left-4 flex gap-1.5">
                      <span className="bg-green-deep text-cream text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
                        👤 Maks {villa.capacity} Pax
                      </span>
                      {villa.includeBreakfast && (
                        <span className="bg-amber-500 text-cream text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
                          🍳 {lang === 'ID' ? 'Sarapan' : 'Breakfast'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-serif text-lg font-bold text-green-deep leading-snug line-clamp-2 group-hover:text-green-soft transition-colors duration-300">
                        {villa.title}
                      </h3>
                      <p className="font-sans text-xs text-text-mid font-light leading-relaxed line-clamp-3">
                        {villa.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-sand/20 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-sans text-[10px] text-gray-400 font-light">{lang === 'ID' ? 'Harga per malam' : 'Rate per night'}</span>
                        <span className="font-serif text-lg font-bold text-green-soft">
                          {convertAndFormatPrice(villa.pricePerPax, currency)}
                        </span>
                      </div>
                      
                      <button 
                        onClick={() => {
                          if (setSelectedVillaId) {
                            setSelectedVillaId(villa.id);
                          }
                          onNavigate('booking');
                        }}
                        className="inline-flex items-center space-x-1 bg-green-deep hover:bg-green-soft text-cream px-4 py-2.5 rounded-xl font-sans font-bold text-xs transition-all shadow cursor-pointer active:scale-95"
                      >
                        <span>{lang === 'ID' ? 'Pesan Kamar' : 'Book Room'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. KEUNGGULAN */}
      <section id="keunggulan" className="bg-white/50 backdrop-blur-sm border-y border-sand/30 py-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-green-soft font-mono text-xs uppercase tracking-widest font-semibold block">
              {lang === 'ID' ? 'Kenapa Memilih Kami' : t.expLabel}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-green-deep tracking-tight">
              {lang === 'ID' ? 'Keunggulan Menginap di Peno' : t.expTitle}
            </h2>
            <p className="font-sans text-sm md:text-base text-text-mid font-light">
              {lang === 'ID' 
                ? 'Rasakan pengalaman menginap otentik dengan beragam fasilitas dan kenyamanan khas keluarga di tengah sejuknya kebun kopi Banyuwangi.' 
                : t.expDesc}
            </p>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {homepageData.features.map((item, idx) => {
              const getFeatureTitle = () => {
                if (lang === 'ID') return item.title;
                const titleLower = item.title.toLowerCase();
                if (titleLower.includes('kopi')) return "Unlimited Estate Coffee";
                if (titleLower.includes('ijen') || titleLower.includes('tur')) return "Mount Ijen Guiding";
                if (titleLower.includes('sarapan') || titleLower.includes('kuliner')) return "Authentic Farm Breakfast";
                if (titleLower.includes('kambing') || titleLower.includes('etawa') || titleLower.includes('susu')) return "Milking Etawa Goats";
                if (titleLower.includes('keluarga') || titleLower.includes('ramah')) return "Local Family Warmth";
                if (titleLower.includes('tenang') || titleLower.includes('damai') || titleLower.includes('udara')) return "Peaceful & Crisp Air";
                return item.title;
              };

              const getFeatureDesc = () => {
                if (lang === 'ID') return item.desc;
                const titleLower = item.title.toLowerCase();
                if (titleLower.includes('kopi')) return "Enjoy unlimited, fresh organic robusta & liberika coffee brewed straight from our farm.";
                if (titleLower.includes('ijen') || titleLower.includes('tur')) return "Get direct, experienced local guiding and equipment preparation for Mount Ijen hiking.";
                if (titleLower.includes('sarapan') || titleLower.includes('kuliner')) return "Wake up to delicious, home-cooked traditional Banyuwangi breakfast made with fresh ingredients.";
                if (titleLower.includes('kambing') || titleLower.includes('etawa') || titleLower.includes('susu')) return "Experience dairy goat farming, feed our local goats, and try milking them yourself.";
                if (titleLower.includes('keluarga') || titleLower.includes('ramah')) return "Be hosted like family with authentic stories, sincere hospitality, and comfortable village living.";
                if (titleLower.includes('tenang') || titleLower.includes('damai') || titleLower.includes('udara')) return "Rejuvenate in a quiet coffee farm far from city noise, with clean mountain air.";
                return item.desc;
              };

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.6, delay: (idx % 3) * 0.1, ease: "easeOut" }}
                  className="bg-white hover:bg-cream/40 border border-sand/20 hover:border-green-soft/20 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col space-y-4 group"
                >
                  <div className="bg-green-deep/5 text-green-soft group-hover:bg-green-soft group-hover:text-cream p-4 rounded-xl w-14 h-14 flex items-center justify-center transition-colors duration-300">
                    {renderIcon(item.icon, "w-6 h-6")}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-green-deep group-hover:text-green-soft transition-colors duration-300">
                    {getFeatureTitle()}
                  </h3>
                  <p className="font-sans text-sm text-text-mid font-light leading-relaxed">
                    {getFeatureDesc()}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>



      {/* 4. GALERI */}
      <section id="galeri" className="py-24 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-lg">
            <span className="text-green-soft font-mono text-xs uppercase tracking-widest font-semibold block">
              {lang === 'ID' ? 'Sudut Keindahan' : t.galLabel}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-green-deep tracking-tight">
              {lang === 'ID' ? 'Galeri Foto Peno' : t.galTitle}
            </h2>
            <p className="font-sans text-sm md:text-base text-text-mid font-light">
              {lang === 'ID' 
                ? 'Tengok sekilas keindahan alam, sudut homestay yang damai, serta hangatnya aktivitas keluarga kami.' 
                : t.galDesc}
            </p>
          </div>

          {/* Filtering buttons */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setGalleryFilter(cat)}
                className={`font-sans text-xs md:text-sm font-medium px-4 py-2 rounded-full border transition-all ${
                  galleryFilter === cat
                    ? 'bg-green-deep border-green-deep text-cream'
                    : 'bg-white border-sand/40 hover:border-green-soft text-text-mid'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery items grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredGallery.length > 0 ? (
              filteredGallery.map((item, idx) => {
                // Find the absolute index in total gallery for Lightbox navigation
                const originalIndex = sortedGallery.findIndex(g => g.id === item.id);
                
                const getGalleryLabel = (label: string) => {
                  if (lang === 'ID') return label;
                  const l = label.toLowerCase();
                  if (l.includes('kebun kopi')) return "Coffee Plantation";
                  if (l.includes('kamar utama')) return "Comfort Bedroom";
                  if (l.includes('kamar standar')) return "Standard Bedroom";
                  if (l.includes('sungai')) return "Crystal River Walk";
                  if (l.includes('sarapan')) return "Authentic Breakfast";
                  if (l.includes('kawah ijen') || l.includes('tur') || l.includes('ijen')) return "Mount Ijen Trekking";
                  if (l.includes('kambing') || l.includes('etawa')) return "Etawa Dairy Goats";
                  return label;
                };

                const getGalleryCategoryLabel = (cat: string) => {
                  if (lang === 'ID') return cat;
                  if (cat === 'Kamar') return "Accommodation";
                  if (cat === 'Alam') return "Nature";
                  if (cat === 'Aktivitas') return "Activities";
                  if (cat === 'Kuliner') return "Culinary";
                  if (cat === 'Sekitar') return "Destinations";
                  return cat;
                };
                
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.6, delay: (idx % 3) * 0.1, ease: "easeOut" }}
                    onClick={() => setLightboxIndex(originalIndex !== -1 ? originalIndex : idx)}
                    className="bg-white rounded-2xl border border-sand/20 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                  >
                    <div className="aspect-[4/3] w-full relative overflow-hidden bg-cream flex items-center justify-center">
                      {item.url ? (
                        <img 
                          src={item.url} 
                          alt={item.label} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        // Interactive Vector Illustration Fallback from GalleryIllustration Component
                        <div className="w-full h-full flex items-center justify-center p-6 group-hover:scale-105 transition-transform duration-500" style={{ backgroundColor: `${item.color}15` }}>
                          <GalleryIllustration 
                            type={
                              item.id === 1 ? 'coffee' : 
                              item.id === 2 ? 'room' : 
                              item.id === 3 ? 'river' : 
                              item.id === 4 ? 'breakfast' : 
                              item.id === 5 ? 'tour' : 'ijen'
                            } 
                            color={item.color} 
                          />
                        </div>
                      )}
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-green-deep/75 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                        <span className="text-sand/70 font-mono text-xs uppercase tracking-widest mb-1">{getGalleryCategoryLabel(item.category)}</span>
                        <h4 className="text-cream font-serif text-lg font-bold flex items-center justify-between">
                          <span>{getGalleryLabel(item.label)}</span>
                          <ArrowRight className="w-4 h-4 text-sand" />
                        </h4>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full py-16 text-center bg-white/40 border border-sand/20 rounded-3xl p-8 space-y-3">
                <p className="font-serif text-lg font-semibold text-green-deep">
                  {lang === 'ID' ? 'Belum Ada Foto Terunggah' : 'No Uploaded Photos Yet'}
                </p>
                <p className="font-sans text-sm text-text-mid max-w-md mx-auto">
                  {lang === 'ID' 
                    ? 'Silakan masuk ke Portal Admin untuk mengunggah foto-foto homestay Anda agar tampil cantik di sini.' 
                    : 'Please log in to the Admin Portal to upload beautiful photos of your homestay to showcase here.'}
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {lightboxIndex !== null && (
            <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4">
              <button 
                onClick={() => setLightboxIndex(null)}
                className="absolute top-6 right-6 text-cream/70 hover:text-cream bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300 backdrop-blur-sm z-50"
              >
                <X className="w-6 h-6" />
              </button>
              
              {/* Left/Right Buttons */}
              <button 
                onClick={() => {
                  const prevIdx = lightboxIndex === 0 ? sortedGallery.length - 1 : lightboxIndex - 1;
                  setLightboxIndex(prevIdx);
                }}
                className="absolute left-6 text-cream/70 hover:text-cream bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300 backdrop-blur-sm z-50"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button 
                onClick={() => {
                  const nextIdx = lightboxIndex === sortedGallery.length - 1 ? 0 : lightboxIndex + 1;
                  setLightboxIndex(nextIdx);
                }}
                className="absolute right-6 text-cream/70 hover:text-cream bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300 backdrop-blur-sm z-50"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <div className="relative max-w-5xl max-h-[80vh] flex items-center justify-center select-none">
                {sortedGallery[lightboxIndex].url ? (
                  <img 
                    src={sortedGallery[lightboxIndex].url} 
                    alt={sortedGallery[lightboxIndex].label} 
                    className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
                  />
                ) : (
                  <div className="w-[60vw] h-[60vh] flex items-center justify-center bg-green-deep/40 rounded-xl p-12">
                    <GalleryIllustration 
                      type={
                        sortedGallery[lightboxIndex].id === 1 ? 'coffee' : 
                        sortedGallery[lightboxIndex].id === 2 ? 'room' : 
                        sortedGallery[lightboxIndex].id === 3 ? 'river' : 
                        sortedGallery[lightboxIndex].id === 4 ? 'breakfast' : 
                        sortedGallery[lightboxIndex].id === 5 ? 'tour' : 'ijen'
                      } 
                      color={sortedGallery[lightboxIndex].color} 
                    />
                  </div>
                )}
              </div>
              
              {/* Lightbox Caption */}
              <div className="mt-6 text-center max-w-xl">
                <span className="text-sand font-mono text-xs uppercase tracking-widest">
                  {lang === 'ID' ? sortedGallery[lightboxIndex].category : 
                    sortedGallery[lightboxIndex].category === 'Kamar' ? 'Accommodation' :
                    sortedGallery[lightboxIndex].category === 'Alam' ? 'Nature' :
                    sortedGallery[lightboxIndex].category === 'Aktivitas' ? 'Activities' :
                    sortedGallery[lightboxIndex].category === 'Kuliner' ? 'Culinary' :
                    sortedGallery[lightboxIndex].category === 'Sekitar' ? 'Destinations' : sortedGallery[lightboxIndex].category}
                </span>
                <h3 className="text-cream font-serif text-2xl font-bold mt-1">
                  {lang === 'ID'
                    ? sortedGallery[lightboxIndex].label
                    : sortedGallery[lightboxIndex].label.toLowerCase().includes('kebun kopi') ? 'Coffee Plantation' :
                      sortedGallery[lightboxIndex].label.toLowerCase().includes('kamar utama') ? 'Comfort Bedroom' :
                      sortedGallery[lightboxIndex].label.toLowerCase().includes('kamar standar') ? 'Standard Bedroom' :
                      sortedGallery[lightboxIndex].label.toLowerCase().includes('sungai') ? 'Crystal River Walk' :
                      sortedGallery[lightboxIndex].label.toLowerCase().includes('sarapan') ? 'Authentic Breakfast' :
                      sortedGallery[lightboxIndex].label.toLowerCase().includes('kawah ijen') || sortedGallery[lightboxIndex].label.toLowerCase().includes('tur') ? 'Mount Ijen Trekking' :
                      sortedGallery[lightboxIndex].label.toLowerCase().includes('kambing') || sortedGallery[lightboxIndex].label.toLowerCase().includes('etawa') ? 'Etawa Dairy Goats' : sortedGallery[lightboxIndex].label}
                </h3>
              </div>
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* 6. ULASAN TAMU */}
      <section id="ulasan" className="bg-green-deep text-cream py-24 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-soft/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-coffee/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto space-y-16 relative z-10">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-sand font-mono text-xs uppercase tracking-widest font-semibold block">
              {lang === 'ID' ? 'Apa Kata Tamu Kami' : t.revLabel}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-cream tracking-tight">
              {lang === 'ID' ? 'Testimoni Asli dari Google' : t.revTitle}
            </h2>
            <div className="flex items-center justify-center space-x-1 text-yellow-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
              <span className="ml-2 font-sans font-semibold text-cream">
                {lang === 'ID' ? '4.9 / 5.0 (90+ ulasan)' : '4.9 / 5.0 (90+ reviews)'}
              </span>
            </div>
          </div>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {homepageData.testimonials.map((test, idx) => {
              const getTestimonialText = (text: string) => {
                if (lang === 'ID') return text;
                const tLower = text.toLowerCase();
                if (tLower.includes('ramah') || tLower.includes('keluarga')) {
                  return "Pak Peno is extremely friendly and knowledgeable! We felt like part of his family. The coffee from his garden is absolutely the best.";
                }
                if (tLower.includes('bersih') || tLower.includes('nyaman') || tLower.includes('kamar')) {
                  return "Comfortable and very clean rooms. The mountain air is incredibly fresh, and having unlimited fresh coffee from the estate is amazing!";
                }
                if (tLower.includes('ijen') || tLower.includes('gunung') || tLower.includes('kawah')) {
                  return "The absolute perfect gateway to Mount Ijen! Pak Peno prepared everything for our hiking tour and showed us real village hospitality.";
                }
                return text;
              };

              return (
                <div 
                  key={idx}
                  className="bg-white/5 border border-white/10 p-8 rounded-3xl shadow-xl flex flex-col justify-between hover:border-sand/40 transition-all duration-300 group"
                >
                  <div className="space-y-6">
                    {/* Stars */}
                    <div className="flex items-center space-x-1 text-yellow-400">
                      {[...Array(test.rating || 5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                    </div>
                    {/* Quote */}
                    <p className="font-serif italic text-cream/90 leading-relaxed text-sm md:text-base">
                      "{getTestimonialText(test.text)}"
                    </p>
                  </div>
                  {/* Author */}
                  <div className="mt-8 border-t border-white/10 pt-4 flex items-center justify-between">
                    <div className="font-sans font-medium text-sand text-sm">{test.author}</div>
                    <div className="bg-green-soft/20 text-cream/70 px-2 py-1 rounded text-xs">Verified Review</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. INFORMASI MENGINAP (TELAH DIPINDAHKAN KE BOOKING ENGINE FOOTER SESUAI REKOMENDASI DAN PERMINTAAN USER) */}

    </div>
  );
};
