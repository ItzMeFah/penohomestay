import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryItem } from '../../types';
import { LanguageType, translations } from '../../utils/lang';
import { GalleryIllustration } from '../GalleryIllustration';

interface LandingGaleriProps {
  galleryData: GalleryItem[];
  lang: LanguageType;
}

export const LandingGaleri: React.FC<LandingGaleriProps> = ({ galleryData, lang }) => {
  const t = translations[lang];
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

  return (
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
              const originalIndex = sortedGallery.findIndex(g => g.id === item.id);
              
              const getGalleryLabel = (label: string) => {
                if (lang === 'ID') return label;
                const l = label.toLowerCase();
                if (l.includes('kebun kopi')) return "Coffee Plantation";
                if (l.includes('kamar utama')) return "Comfort Bedroom";
                if (l.includes('kamar standar')) return "Standard Bedroom";
                if (l.includes('sungai')) return "Crystal River Walk";
                if (l.includes('sarapan')) return "Authentic Breakfast";
                if (l.includes('tur') || l.includes('alam') || l.includes('ijen')) return "Nature & Plantation Walk";
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
        {lightboxIndex !== null && sortedGallery[lightboxIndex] && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4">
            <button 
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 text-cream/70 hover:text-cream bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300 backdrop-blur-sm z-50"
            >
              <X className="w-6 h-6" />
            </button>
            
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
                    sortedGallery[lightboxIndex].label.toLowerCase().includes('tur') || sortedGallery[lightboxIndex].label.toLowerCase().includes('alam') || sortedGallery[lightboxIndex].label.toLowerCase().includes('ijen') ? 'Nature & Plantation Walk' :
                    sortedGallery[lightboxIndex].label.toLowerCase().includes('kambing') || sortedGallery[lightboxIndex].label.toLowerCase().includes('etawa') ? 'Etawa Dairy Goats' : sortedGallery[lightboxIndex].label}
              </h3>
            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
