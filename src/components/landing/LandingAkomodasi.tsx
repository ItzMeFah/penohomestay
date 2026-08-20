import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Home } from 'lucide-react';
import { CoffeeBean } from '../CoffeeDecoration';
import { CMSHomepage } from '@/src/types';
import { CurrencyType, convertAndFormatPrice } from '@/src/utils/storage';
import { LanguageType } from '@/src/utils/lang';

interface LandingAkomodasiProps {
  homepageData: CMSHomepage;
  currency?: CurrencyType;
  lang?: LanguageType;
  setSelectedVillaId?: (id: string) => void;
  onNavigate?: (page: 'home' | 'booking' | 'supabase' | 'admin', sectionId?: string) => void;
}

export const LandingAkomodasi: React.FC<LandingAkomodasiProps> = ({
  homepageData,
  currency = 'IDR',
  lang = 'ID',
  setSelectedVillaId,
  onNavigate
}) => {
  const villas = homepageData?.villas || [];
  if (villas.length === 0) return null;

  const handleBookRoom = (villaId: string) => {
    if (setSelectedVillaId) {
      setSelectedVillaId(villaId);
    }
    if (onNavigate) {
      onNavigate('booking');
    } else {
      window.location.href = '/home/book';
    }
  };

  return (
    <section id="villa-showcase" className="py-24 px-6 md:px-12 bg-cream/10 border-t border-sand/20 relative overflow-hidden">
      {/* Decorative coffee bean background */}
      <CoffeeBean className="top-20 left-[8%] w-8 h-8 text-coffee/10" delay={0.5} duration={6} yOffset={25} rotateSpeed={120} />
      <CoffeeBean className="bottom-20 right-[8%] w-10 h-10 text-coffee/10" delay={2} duration={8} yOffset={30} rotateSpeed={-150} />

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-green-soft text-xs uppercase tracking-wider font-semibold block">
            {lang === 'ID' ? 'Pilihan Kamar' : 'Room Types'}
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-green-deep tracking-tight">
            {lang === 'ID' ? 'Akomodasi Peno Homestay' : 'Accommodations'}
          </h2>
          <p className="font-sans text-xs md:text-sm text-text-mid font-light leading-relaxed">
            {lang === 'ID' 
              ? 'Pilihan kamar nyaman dengan suasana asri di tengah perkebunan kopi Gombengsari.' 
              : 'Comfortable rooms surrounded by the natural serenity of Gombengsari coffee plantation.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center items-stretch">
          {villas.map((villa, idx) => (
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
                    alt={`Kamar ${villa.title} Peno Homestay Banyuwangi dengan pemandangan kebun kopi`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-green-deep/5 flex items-center justify-center">
                    <Home className="w-12 h-12 text-green-soft/40" />
                  </div>
                )}
                
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-green-deep flex items-center gap-1.5 shadow-sm z-10">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{lang === 'ID' ? 'Tersedia' : 'Available'}</span>
                </div>

                <div className="absolute bottom-4 left-4 flex gap-1.5 z-10">
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
                    onClick={() => handleBookRoom(villa.id)}
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
  );
};
