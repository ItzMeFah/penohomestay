import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, Shield, Compass, Home, ChevronDown, ChevronUp, Sparkles, 
  Trees, Coffee, Footprints, Sprout, Droplets 
} from 'lucide-react';
import { CMSHomepage } from '../../types';
import { LanguageType, translations } from '../../utils/lang';
import { CurrencyType, convertAndFormatPrice } from '../../utils/storage';

interface BookingGuidelinesProps {
  homepageData: CMSHomepage;
  currency: CurrencyType;
  lang: LanguageType;
}

export const BookingGuidelines: React.FC<BookingGuidelinesProps> = ({
  homepageData,
  currency,
  lang
}) => {
  const [activeInfoTab, setActiveInfoTab] = useState<'amenities' | 'itinerary'>('itinerary');
  const [expandedItinerary, setExpandedItinerary] = useState<number | null>(0);

  const getFacilityText = (text: string) => {
    if (lang === 'ID') return text;
    const f = text.toLowerCase();
    if (f.includes('kopi') || f.includes('teh')) return "Complimentary estate tea & coffee (unlimited)";
    if (f.includes('sarapan')) return "Authentic Indonesian breakfast included";
    if (f.includes('kasur') || f.includes('king') || f.includes('spring')) return "Comfortable king-size spring beds";
    if (f.includes('wifi') || f.includes('internet')) return "High-speed Wi-Fi internet access";
    if (f.includes('mandi') || f.includes('air hangat')) return "Clean bathroom with hot shower";
    if (f.includes('parkir')) return "Spacious, secure free parking area";
    return text;
  };

  const itineraryItems = [
    {
      id: 0,
      title: lang === 'ID' ? 'Staycation Kebun Kopi' : 'Coffee Plantation Stay',
      subtitle: lang === 'ID' ? 'Suasana asri dan sejuk' : 'Tranquil retreat',
      desc: lang === 'ID' 
        ? 'Menginap dengan pemandangan langsung kebun kopi yang sejuk dan asri di kaki Gunung Ijen.'
        : 'Stay surrounded by green coffee plantations with cool fresh mountain air.',
      icon: Trees,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-100'
    },
    {
      id: 1,
      title: lang === 'ID' ? 'Edukasi Kopi (Coffee Tour)' : 'Coffee Tour Experience',
      subtitle: lang === 'ID' ? 'Budidaya & pengolahan kopi' : 'Farm to cup tour',
      desc: lang === 'ID' 
        ? 'Pelajari proses kopi dari kebun hingga seduhan bersama petani lokal, serta mencicipi seduhan kopi segar.'
        : 'Learn traditional coffee farming and roasting firsthand from local growers with fresh tastings.',
      bullets: lang === 'ID' ? [
        'Budidaya & petik kopi',
        'Mengenal jenis kopi lokal',
        'Proses sangrai tradisional',
        'Icip seduhan kopi segar'
      ] : [
        'Coffee planting & harvesting',
        'Local bean varieties',
        'Traditional roasting process',
        'Fresh coffee tasting'
      ],
      icon: Coffee,
      color: 'text-amber-800 bg-amber-50 border-amber-100'
    },
    {
      id: 2,
      title: lang === 'ID' ? 'Jelajah Desa Gombengsari' : 'Village & Local Life Tour',
      subtitle: lang === 'ID' ? 'Aktivitas warga pedesaan' : 'Local community stroll',
      desc: lang === 'ID'
        ? 'Melihat kehidupan sehari-hari warga desa, ternak kambing etawa, dan kehangatan tradisi lokal.'
        : 'Experience local village life, dairy goat farming, and genuine community hospitality.',
      icon: Footprints,
      color: 'text-stone-700 bg-stone-50 border-stone-100'
    },
    {
      id: 3,
      title: lang === 'ID' ? 'Persawahan & Alam' : 'Rice Fields & Nature',
      subtitle: lang === 'ID' ? 'Pemandangan terasering hijau' : 'Scenic countryside views',
      desc: lang === 'ID'
        ? 'Jalan santai menikmati hamparan sawah dan udara segar khas pedesaan.'
        : 'Walk through green terraced fields and enjoy crisp countryside air.',
      icon: Sprout,
      color: 'text-green-700 bg-green-50 border-green-100'
    },
    {
      id: 4,
      title: lang === 'ID' ? 'Air Terjun Alami' : 'Hidden Waterfall Visit',
      subtitle: lang === 'ID' ? 'Aliran air jernih dan segar' : 'Refreshing mountain streams',
      desc: lang === 'ID'
        ? 'Kunjungan ke air terjun tersembunyi dengan air pegunungan yang jernih dan menyegarkan.'
        : 'Visit hidden clear spring waterfalls for a refreshing natural escape.',
      icon: Droplets,
      color: 'text-blue-700 bg-blue-50 border-blue-100'
    }
  ];

  return (
    <div id="info" className="bg-white border border-sand/30 rounded-3xl p-6 md:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-start scroll-mt-24">
      <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
        <h2 className="font-serif text-xl md:text-2xl font-bold text-green-deep tracking-tight">
          {lang === 'ID' ? 'Fasilitas & Aturan Menginap' : 'Amenities & Stay Guidelines'}
        </h2>
        <p className="font-sans text-xs text-text-mid font-light leading-relaxed">
          {lang === 'ID' 
            ? 'Waktu check-in, check-out, dan informasi tarif menginap di Peno Homestay.' 
            : 'Check-in, check-out times and accommodation rates at Peno Homestay.'}
        </p>

        <div className="space-y-2.5 divide-y divide-sand/20">
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center space-x-3">
              <Clock className="w-4 h-4 text-green-soft" />
              <span className="font-sans text-xs font-medium text-text-dark">
                {lang === 'ID' ? 'Check-In' : 'Check-In'}
              </span>
            </div>
            <span className="font-sans text-xs font-semibold text-green-deep">{homepageData.info.checkin} WIB</span>
          </div>
          <div className="flex items-center justify-between py-1 pt-2">
            <div className="flex items-center space-x-3">
              <Clock className="w-4 h-4 text-green-soft" />
              <span className="font-sans text-xs font-medium text-text-dark">
                {lang === 'ID' ? 'Check-Out' : 'Check-Out'}
              </span>
            </div>
            <span className="font-sans text-xs font-semibold text-green-deep">{homepageData.info.checkout} WIB</span>
          </div>
          <div className="flex items-center justify-between py-1 pt-2">
            <div className="flex items-center space-x-3">
              <Shield className="w-4 h-4 text-green-soft" />
              <span className="font-sans text-xs font-medium text-text-dark">
                {lang === 'ID' ? 'Tarif per Malam' : 'Nightly Rate'}
              </span>
            </div>
            <span className="font-sans text-xs font-semibold text-green-deep">
              {lang === 'ID' ? 'Mulai ' : 'From '}{convertAndFormatPrice(homepageData.info.price_from, currency)}
            </span>
          </div>
        </div>
      </div>

      <div className="lg:col-span-7 space-y-5">
        {/* Classy Minimalist Tab Buttons */}
        <div className="flex space-x-2 border-b border-sand/15 pb-2">
          <button
            type="button"
            onClick={() => setActiveInfoTab('itinerary')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
              activeInfoTab === 'itinerary'
                ? 'bg-green-deep text-cream shadow-sm'
                : 'bg-cream/40 text-text-dark hover:bg-cream/80'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{lang === 'ID' ? 'Aktivitas & Tour' : 'Activities & Tours'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveInfoTab('amenities')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
              activeInfoTab === 'amenities'
                ? 'bg-green-deep text-cream shadow-sm'
                : 'bg-cream/40 text-text-dark hover:bg-cream/80'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>{lang === 'ID' ? 'Fasilitas' : 'Amenities'}</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="min-h-[260px]">
          {activeInfoTab === 'itinerary' ? (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="space-y-2.5">
                {itineraryItems.map((item) => {
                  const IconComponent = item.icon;
                  const isExpanded = expandedItinerary === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`border rounded-2xl transition-all overflow-hidden bg-white ${
                        isExpanded ? 'border-green-soft/30 shadow-xs' : 'border-gray-150/60'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedItinerary(isExpanded ? null : item.id)}
                        className="w-full flex items-center justify-between p-3 text-left focus:outline-none transition-colors cursor-pointer hover:bg-gray-50/40"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 ${item.color}`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-serif font-bold text-xs text-green-deep">{item.title}</h4>
                            <p className="font-sans text-[10px] text-gray-500 mt-0.5">{item.subtitle}</p>
                          </div>
                        </div>
                        <div className="shrink-0 text-gray-400 pl-2">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </button>
                      
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-3.5 pb-4 pt-1 border-t border-gray-50 bg-gray-50/10 space-y-2.5">
                              <p className="font-sans text-xs text-text-mid font-light leading-relaxed">
                                {item.desc}
                              </p>
                              {item.bullets && (
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 pl-1">
                                  {item.bullets.map((b, bIdx) => (
                                    <li key={bIdx} className="flex items-start space-x-2 font-sans text-xs text-text-dark font-light">
                                      <span className="text-amber-500 text-xs leading-none mt-0.5">•</span>
                                      <span>{b}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              <div className="bg-cream/30 border border-sand/20 p-3 rounded-2xl flex items-center space-x-3 mt-1.5">
                <Sparkles className="w-4 h-4 text-green-soft shrink-0" />
                <p className="font-sans text-xs text-text-mid">
                  {lang === 'ID' 
                    ? 'Healing & santai • Wisata Kopi • Liburan Keluarga • Akses Kawah Ijen' 
                    : 'Relaxation • Coffee Tour • Family Vacation • Mount Ijen Access'}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-cream/20 p-5 rounded-3xl border border-sand/20 space-y-4"
            >
              <h4 className="font-serif text-sm font-bold text-green-deep flex items-center space-x-2">
                <Home className="w-4 h-4 text-green-soft" />
                <span>{lang === 'ID' ? 'Fasilitas Menginap' : 'Homestay Amenities'}</span>
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {homepageData.info.facilities.map((fac, idx) => (
                  <li key={idx} className="flex items-center space-x-2.5 font-sans text-xs text-text-dark font-light bg-white/70 p-2.5 rounded-xl border border-sand/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-soft shrink-0" />
                    <span className="leading-snug">{getFacilityText(fac)}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
