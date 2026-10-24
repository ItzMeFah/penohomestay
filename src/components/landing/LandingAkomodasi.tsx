import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Home, Users, Coffee } from 'lucide-react';
import { CoffeeBean } from '../CoffeeDecoration';
import { Booking, CMSHomepage } from '../../types';
import { CurrencyType, convertAndFormatPrice } from '../../utils/storage';
import { LanguageType, translateVilla } from '../../utils/lang';
import { getRoomCurrentOccupancy } from '../../utils/bookingStatus';

interface LandingAkomodasiProps {
  homepageData: CMSHomepage;
  bookings?: Booking[];
  currency: CurrencyType;
  lang: LanguageType;
  setSelectedVillaId?: (id: string) => void;
  onNavigate: (page: 'home' | 'booking' | 'supabase' | 'admin' | 'backoffice', sectionId?: string) => void;
}

export const LandingAkomodasi: React.FC<LandingAkomodasiProps> = ({
  homepageData,
  bookings = [],
  currency,
  lang,
  setSelectedVillaId,
  onNavigate
}) => {
  const villas = homepageData.villas || [];
  if (villas.length === 0) return null;

  return (
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
          {villas.map((villa, idx) => {
            const tVilla = translateVilla(villa, lang);
            const occupancy = getRoomCurrentOccupancy(villa.id, bookings);

            return (
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
                    alt={tVilla.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                  />
                ) : (
                  <div className="w-full h-full bg-green-deep/5 flex items-center justify-center">
                    <Home className="w-12 h-12 text-green-soft/40" />
                  </div>
                )}
                
                {/* Dynamic Room Occupancy Badge */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 shadow-sm backdrop-blur-sm ${
                  occupancy.isOccupied
                    ? 'bg-indigo-600 text-white border border-indigo-500 ring-2 ring-indigo-300'
                    : occupancy.isBookedFuture
                      ? 'bg-rose-500 text-white border border-rose-600'
                      : 'bg-white/95 text-green-deep border border-emerald-150'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    occupancy.isOccupied ? 'bg-white animate-pulse' : occupancy.isBookedFuture ? 'bg-white' : 'bg-emerald-500'
                  }`} />
                  <span>{lang === 'ID' ? occupancy.displayBadge.textId : occupancy.displayBadge.textEn}</span>
                </div>

                <div className="absolute bottom-3.5 left-3.5 flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 bg-green-deep/90 backdrop-blur-md text-cream text-[11px] font-sans font-medium px-3 py-1 rounded-full border border-white/15 shadow-sm">
                    <Users className="w-3.5 h-3.5 text-sand" />
                    <span>{tVilla.capacityLabel}</span>
                  </span>
                  {villa.includeBreakfast && (
                    <span className="inline-flex items-center gap-1.5 bg-[#3a2818]/90 backdrop-blur-md text-cream text-[11px] font-sans font-medium px-3 py-1 rounded-full border border-sand/30 shadow-sm">
                      <Coffee className="w-3.5 h-3.5 text-sand" />
                      <span>{lang === 'ID' ? 'Termasuk Sarapan' : 'Breakfast Included'}</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-serif text-lg font-bold text-green-deep leading-snug line-clamp-2 group-hover:text-green-soft transition-colors duration-300">
                    {tVilla.title}
                  </h3>
                  <p className="font-sans text-xs text-text-mid font-light leading-relaxed line-clamp-3">
                    {tVilla.description}
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
            );
          })}
        </div>
      </div>
    </section>
  );
};
