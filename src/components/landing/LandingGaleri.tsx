import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryItem } from '@/src/types';
import { LanguageType, translations } from '@/src/utils/lang';
import { GalleryIllustration } from '../GalleryIllustration';

interface LandingGaleriProps {
  galleryData?: GalleryItem[];
  lang?: LanguageType;
}

export const LandingGaleri: React.FC<LandingGaleriProps> = ({ galleryData = [], lang = 'ID' }) => {
  const t = translations[lang] || translations.ID;
  const [galleryFilter, setGalleryFilter] = useState(lang === 'ID' ? 'Semua' : 'All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const sortedGallery = useMemo(() => {
    return [...galleryData]
      .filter(item => item.showInGallery !== false)
      .sort((a, b) => a.order - b.order);
  }, [galleryData]);

  useEffect(() => {
    setGalleryFilter(lang === 'ID' ? 'Semua' : 'All');
  }, [lang]);

  const filteredGallery = useMemo(() => {
    if (galleryFilter === 'Semua' || galleryFilter === 'All') {
      return sortedGallery;
    }
    return sortedGallery.filter(item => {
      const isAkomodasi = (galleryFilter === 'Akomodasi' || galleryFilter === 'Accommodations') && item.category === 'Kamar';
      const isAktivitas = (galleryFilter === 'Aktivitas & Alam' || galleryFilter === 'Activities & Nature') && (item.category === 'Alam' || item.category === 'Aktivitas');
      const isKuliner = (galleryFilter === 'Kuliner' || galleryFilter === 'Culinary') && item.category === 'Kuliner';
      const isDestinasi = (galleryFilter === 'Destinasi' || galleryFilter === 'Destinations') && item.category === 'Sekitar';
      return isAkomodasi || isAktivitas || isKuliner || isDestinasi || item.category === galleryFilter;
    });
  }, [galleryFilter, sortedGallery]);

  const categories = lang === 'ID'
    ? ['Semua', 'Akomodasi', 'Kuliner', 'Aktivitas & Alam', 'Destinasi']
    : ['All', 'Accommodations', 'Culinary', 'Activities & Nature', 'Destinations'];

  const getGalleryCategoryLabel = (category: string) => {
    if (lang === 'ID') return category;
    switch (category) {
      case 'Kamar': return 'Accommodation';
      case 'Alam': return 'Nature';
      case 'Aktivitas': return 'Activity';
      case 'Kuliner': return 'Culinary';
      case 'Sekitar': return 'Destinations';
      default: return category;
    }
  };

  const getGalleryLabel = (label: string) => {
    if (lang === 'ID') return label;
    const lower = (label || '').toLowerCase();
    if (lower.includes('kebun kopi')) return 'Coffee Plantation';
    if (lower.includes('kamar utama')) return 'Comfort Bedroom';
    if (lower.includes('kamar standar')) return 'Standard Bedroom';
    if (lower.includes('sungai')) return 'Crystal River Walk';
    if (lower.includes('sarapan')) return 'Authentic Breakfast';
    if (lower.includes('kawah ijen') || lower.includes('tur')) return 'Mount Ijen Trekking';
    if (lower.includes('kambing') || lower.includes('etawa')) return 'Etawa Dairy Goats';
    return label;
  };

  return (
    <section id="galeri" className="py-24 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3 max-w-lg">
          <span className="text-green-soft text-xs uppercase tracking-wider font-semibold block">
            {lang === 'ID' ? 'Dokumentasi' : t.galLabel}
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-green-deep tracking-tight">
            {lang === 'ID' ? 'Galeri Foto' : t.galTitle}
          </h2>
          <p className="font-sans text-xs md:text-sm text-text-mid font-light leading-relaxed">
            {lang === 'ID' 
              ? 'Suasana kebun kopi, kenyamanan kamar, dan aktivitas di Peno Homestay.' 
              : t.galDesc}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setGalleryFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer ${
                galleryFilter === cat
                  ? 'bg-green-deep text-cream shadow-md'
                  : 'bg-white text-green-deep border border-sand/40 hover:border-green-soft'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <motion.div 
        layout 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {filteredGallery.map((item, idx) => {
            const originalIndex = sortedGallery.findIndex(g => g.id === item.id);
            return (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, delay: (idx % 3) * 0.1, ease: "easeOut" }}
                onClick={() => setLightboxIndex(originalIndex !== -1 ? originalIndex : idx)}
                className="bg-white rounded-2xl border border-sand/20 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
              >
                <div className="aspect-[4/3] w-full relative overflow-hidden bg-cream flex items-center justify-center">
                  {item.url ? (
                    <img 
                      src={item.url} 
                      alt={`Foto ${item.label} Peno Homestay Banyuwangi`} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
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
                  <div className="absolute inset-0 bg-green-deep/75 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 z-10">
                    <span className="text-sand/80 text-xs uppercase tracking-wider mb-1 font-medium">{getGalleryCategoryLabel(item.category)}</span>
                    <h4 className="text-cream font-serif text-lg font-bold flex items-center justify-between">
                      <span>{getGalleryLabel(item.label)}</span>
                      <ArrowRight className="w-4 h-4 text-sand" />
                    </h4>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && sortedGallery[lightboxIndex] && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-8">
            <button 
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 text-cream/70 hover:text-cream bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300 backdrop-blur-sm z-50 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Lightbox Nav: Prev */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                const prevIdx = (lightboxIndex - 1 + sortedGallery.length) % sortedGallery.length;
                setLightboxIndex(prevIdx);
              }}
              className="absolute left-6 text-cream/70 hover:text-cream bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300 backdrop-blur-sm z-50 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Lightbox Nav: Next */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                const nextIdx = (lightboxIndex + 1) % sortedGallery.length;
                setLightboxIndex(nextIdx);
              }}
              className="absolute right-6 text-cream/70 hover:text-cream bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300 backdrop-blur-sm z-50 cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="relative w-full max-w-5xl h-[70vh] flex items-center justify-center select-none">
              {sortedGallery[lightboxIndex].url ? (
                <img 
                  src={sortedGallery[lightboxIndex].url} 
                  alt={`Detail Foto ${sortedGallery[lightboxIndex].label} Peno Homestay`} 
                  className="max-w-full max-h-full object-contain rounded-xl"
                  referrerPolicy="no-referrer"
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
                {getGalleryLabel(sortedGallery[lightboxIndex].label)}
              </h3>
            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
