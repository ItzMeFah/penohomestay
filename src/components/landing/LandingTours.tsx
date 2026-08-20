import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone } from 'lucide-react';
import { CMSHomepage } from '@/src/types';
import { LanguageType } from '@/src/utils/lang';

interface LandingToursProps {
  homepageData: CMSHomepage;
  lang?: LanguageType;
}

export const LandingTours: React.FC<LandingToursProps> = ({ homepageData, lang = 'ID' }) => {
  if (!homepageData.tours || homepageData.tours.length === 0) return null;

  return (
    <section className="bg-cream py-24 px-6 md:px-12 overflow-hidden border-b border-sand/30">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-green-soft text-xs uppercase tracking-wider font-semibold block">
            {lang === 'ID' ? 'Paket Wisata' : 'Tour Packages'}
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-green-deep tracking-tight">
            {lang === 'ID' ? 'Jelajahi Alam Banyuwangi' : 'Explore Banyuwangi'}
          </h2>
          <p className="font-sans text-xs md:text-sm text-text-mid font-light leading-relaxed">
            {lang === 'ID' 
              ? 'Pilihan paket wisata dan pemandu lokal untuk melengkapi pengalaman menginap Anda.' 
              : 'Curated tour packages and local guides to enhance your stay experience.'}
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
                      alt={`Foto Paket Wisata ${tour.name} Peno Homestay Banyuwangi`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-green-deep/5 flex items-center justify-center">
                      <MapPin className="w-10 h-10 text-green-soft/40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-60 group-hover:opacity-75 transition-opacity duration-500" />
                  
                  {tour.price && (
                    <div className="absolute bottom-3 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-xl shadow-sm text-[11px] font-bold text-green-deep tracking-wide z-10">
                      {tour.price}
                    </div>
                  )}
                  
                  <div className="absolute top-3 right-4 bg-green-deep/80 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-cream z-10">
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

                  {tour.inclusions && tour.inclusions.length > 0 && (
                    <div className="space-y-1.5">
                      <h4 className="font-sans text-[10px] font-semibold text-green-soft uppercase tracking-wider">
                        {lang === 'ID' ? 'Fasilitas Termasuk:' : 'Inclusions:'}
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

                  <div className="pt-4 border-t border-sand/20">
                    <a 
                      href={`https://wa.me/${tour.contactPhone?.replace(/\D/g,'') || '6281233800631'}?text=Halo%20Peno%20Homestay,%20saya%20tertarik%20dengan%20paket%20wisata%20${encodeURIComponent(tour.name)}.`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-center space-x-2 bg-green-deep hover:bg-green-soft text-cream hover:text-white py-2.5 px-4 rounded-xl transition-all duration-300 font-semibold text-xs shadow-md hover:shadow-lg active:scale-[0.98]"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{lang === 'ID' ? 'Pesan via WhatsApp' : 'Book via WhatsApp'}</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
