import React, { useState, useMemo, useEffect } from 'react';
import { CMSHomepage, GalleryItem } from '../types';
import { CurrencyType } from '../utils/storage';
import { LanguageType, translations } from '../utils/lang';

// Import newly refactored modular components
import { LandingHero } from '../components/landing/LandingHero';
import { LandingAbout } from '../components/landing/LandingAbout';
import { LandingTours } from '../components/landing/LandingTours';
import { LandingAkomodasi } from '../components/landing/LandingAkomodasi';
import { LandingKeunggulan } from '../components/landing/LandingKeunggulan';
import { LandingGaleri } from '../components/landing/LandingGaleri';
import { LandingUlasan } from '../components/landing/LandingUlasan';

interface LandingPageProps {
  homepageData: CMSHomepage;
  galleryData: GalleryItem[];
  settings: any;
  onNavigate: (page: 'home' | 'booking' | 'supabase' | 'admin', sectionId?: string) => void;
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
  const [currentSlide, setCurrentSlide] = useState(0);

  const slideshowImages = useMemo(() => {
    const gallerySlides = [...galleryData]
      .filter(item => item.showInSlideshow !== false && item.url && item.url.trim().length > 0)
      .sort((a, b) => a.order - b.order)
      .map(item => item.url);

    if (homepageData.hero?.imageUrl && !gallerySlides.includes(homepageData.hero.imageUrl)) {
      return [homepageData.hero.imageUrl, ...gallerySlides];
    }
    return gallerySlides;
  }, [galleryData, homepageData.hero?.imageUrl]);

  // Slideshow interval timer (6 seconds interval for elegant crossfading transition)
  useEffect(() => {
    if (slideshowImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slideshowImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slideshowImages]);

  return (
    <div className="bg-cream min-h-screen text-text-dark selection:bg-green-soft selection:text-cream">
      {/* 1. HERO SECTION */}
      <LandingHero
        homepageData={homepageData}
        settings={settings}
        slideshowImages={slideshowImages}
        currentSlide={currentSlide}
        lang={lang}
        onNavigate={onNavigate}
      />

      {/* 2. TENTANG KAMI & HOST BIOGRAPHY */}
      <LandingAbout
        homepageData={homepageData}
        lang={lang}
      />

      {/* 3. EXPERIENCE PACKAGES / TOUR PACKAGES */}
      <LandingTours
        homepageData={homepageData}
        lang={lang}
      />

      {/* 4. EXCLUSIVE ACCOMMODATION (VILLAS & ROOMS) */}
      <LandingAkomodasi
        homepageData={homepageData}
        currency={currency}
        lang={lang}
        setSelectedVillaId={setSelectedVillaId}
        onNavigate={onNavigate}
      />

      {/* 5. KEUNGGULAN (BENEFITS) */}
      <LandingKeunggulan
        homepageData={homepageData}
        lang={lang}
      />

      {/* 6. PHOTO GALLERY SECTION */}
      <LandingGaleri
        galleryData={galleryData}
        lang={lang}
      />

      {/* 7. GUEST REVIEWS */}
      <LandingUlasan
        homepageData={homepageData}
        lang={lang}
      />
    </div>
  );
};
