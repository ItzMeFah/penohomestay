import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar } from 'lucide-react';
import { CMSHomepage } from '../../types';
import { LanguageType, translations } from '../../utils/lang';

interface LandingHeroProps {
  homepageData: CMSHomepage;
  settings: any;
  slideshowImages: string[];
  currentSlide: number;
  lang: LanguageType;
  onNavigate: (page: 'home' | 'booking' | 'supabase' | 'admin', sectionId?: string) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  homepageData,
  settings,
  slideshowImages,
  currentSlide,
  lang,
  onNavigate
}) => {
  const t = translations[lang];

  return (
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
            animate={{ opacity: (settings.heroOverlayOpacity ?? 28) / 100, scale: 1 }}
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
            ) : homepageData.hero?.imageUrl ? (
              <img
                src={homepageData.hero.imageUrl}
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
  );
};
