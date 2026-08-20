import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Calendar, ChevronDown, ChevronUp, Check, Users, Coffee, ArrowDown } from 'lucide-react';
import { CMSHomepage } from '@/src/types';
import { LanguageType } from '@/src/utils/lang';
import { CurrencyType, convertAndFormatPrice } from '@/src/utils/storage';
import { BookingCalendar } from './BookingCalendar';

interface BookingVillaSelectorProps {
  homepageData: CMSHomepage;
  lang: LanguageType;
  currency: CurrencyType;
  activeVillaId: string;
  setActiveVillaId: (id: string) => void;
  viewYear: number;
  viewMonth: number;
  setViewYear: React.Dispatch<React.SetStateAction<number>>;
  setViewMonth: React.Dispatch<React.SetStateAction<number>>;
  selectStart: Date | null;
  selectEnd: Date | null;
  setSelectStart: (d: Date | null) => void;
  setSelectEnd: (d: Date | null) => void;
  hoveredDate: Date | null;
  setHoveredDate: (d: Date | null) => void;
  unavailableDates: Set<string>;
  onScrollToForm?: () => void;
}

export const BookingVillaSelector: React.FC<BookingVillaSelectorProps> = ({
  homepageData,
  lang,
  currency,
  activeVillaId,
  setActiveVillaId,
  viewYear,
  viewMonth,
  setViewYear,
  setViewMonth,
  selectStart,
  selectEnd,
  setSelectStart,
  setSelectEnd,
  hoveredDate,
  setHoveredDate,
  unavailableDates,
  onScrollToForm
}) => {
  const villas = homepageData?.villas || [];
  const [expandedVillaId, setExpandedVillaId] = useState<string | null>(activeVillaId || (villas[0]?.id || ''));

  const handleVillaClick = (villaId: string) => {
    setActiveVillaId(villaId);
    if (expandedVillaId === villaId) {
      setExpandedVillaId(expandedVillaId === villaId ? null : villaId);
    } else {
      setExpandedVillaId(villaId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="space-y-1.5">
        <div className="flex items-center space-x-2 text-green-deep border-b border-sand/20 pb-2">
          <Home className="w-5 h-5 text-green-soft" />
          <h4 className="font-serif font-bold text-lg md:text-xl">
            {lang === 'ID' ? 'Pilih Kamar & Tanggal' : 'Select Room & Stay Dates'}
          </h4>
        </div>
        <p className="font-sans text-xs text-text-mid font-light leading-relaxed">
          {lang === 'ID' 
            ? 'Pilih tipe kamar untuk melihat kalender ketersediaan dan menentukan tanggal menginap.' 
            : 'Select a room type to view real-time availability calendar and pick dates.'}
        </p>
      </div>
      
      {/* Room Type Cards */}
      <div className="space-y-6">
        {villas.map((villa, idx) => {
          const isSelected = activeVillaId === villa.id;
          const isExpanded = expandedVillaId === villa.id;

          return (
            <div
              key={villa.id}
              className={`rounded-3xl border-2 overflow-hidden transition-all duration-300 bg-white relative shadow-sm hover:shadow-lg ${
                isSelected 
                  ? 'border-green-deep ring-4 ring-green-soft/15 bg-white' 
                  : 'border-gray-150 hover:border-sand/60'
              }`}
            >
              {/* Main Room Card Row */}
              <div
                onClick={() => handleVillaClick(villa.id)}
                className="p-5 flex flex-col md:flex-row items-stretch gap-5 cursor-pointer group"
              >
                {/* Room Image */}
                <div className="w-full md:w-56 h-48 md:h-auto min-h-[160px] relative shrink-0 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                  {villa.imageUrl ? (
                    <img
                      src={villa.imageUrl}
                      alt={`Foto Kamar ${villa.title} Peno Homestay Banyuwangi`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-green-soft/50">
                      <Home className="w-10 h-10 stroke-1" />
                      <span className="text-[10px] mt-1">Gombengsari Room</span>
                    </div>
                  )}

                  {/* Badges on image */}
                  <div className="absolute top-3 left-3 bg-green-deep/90 backdrop-blur-xs text-cream text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-sm z-10">
                    Tipe #{idx + 1}
                  </div>

                  <div className="absolute bottom-3 left-3 flex gap-1.5 flex-wrap z-10">
                    <span className="bg-white/95 text-[10px] font-bold text-text-dark px-2 py-0.5 rounded-lg shadow-xs flex items-center gap-1">
                      <Users className="w-3 h-3 text-green-soft" />
                      {villa.capacity} Pax
                    </span>
                    {villa.includeBreakfast && (
                      <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-xs flex items-center gap-1">
                        <Coffee className="w-3 h-3" />
                        Sarapan
                      </span>
                    )}
                  </div>
                </div>

                {/* Info & Details */}
                <div className="flex-grow flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h5 className="font-serif font-bold text-base md:text-lg text-green-deep group-hover:text-green-soft transition-colors">
                        {villa.title}
                      </h5>
                      {isSelected && (
                        <span className="bg-green-deep text-cream text-[10px] font-bold px-3 py-1 rounded-full shadow-xs flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Dipilih</span>
                        </span>
                      )}
                    </div>

                    <p className="font-sans text-xs text-text-mid font-light leading-relaxed line-clamp-3">
                      {villa.description || 'Villa nyaman bernuansa alam kebun kopi Gombengsari.'}
                    </p>
                  </div>

                  {/* Price & Slide-down Trigger */}
                  <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-col">
                      <span className="font-sans text-[10px] text-gray-400 font-light">Harga Per Malam</span>
                      <span className="font-serif font-bold text-base text-green-soft">
                        {convertAndFormatPrice(villa.pricePerPax, currency)}
                      </span>
                    </div>

                    {/* Interactive Slide Down Trigger Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVillaClick(villa.id);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                        isExpanded
                          ? 'bg-green-deep text-cream'
                          : 'bg-green-soft/10 text-green-deep hover:bg-green-soft/20'
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{isExpanded ? (lang === 'ID' ? 'Tutup Kalender Kamar' : 'Close Calendar') : (lang === 'ID' ? 'Slide Down Kalender Kamar' : 'Slide Down Room Calendar')}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5 animate-bounce" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* SLIDE DOWN / DRAG EXPANDED CALENDAR SECTION */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="overflow-hidden border-t border-sand/30 bg-cream/20 p-5 md:p-6 space-y-5"
                  >
                    {/* Slide Down Drag Indicator Bar */}
                    <div className="flex flex-col items-center justify-center space-y-1.5 pb-2">
                      <div className="w-12 h-1.5 bg-gray-300/80 rounded-full" />
                      <div className="flex items-center gap-1.5 text-xs font-sans font-bold text-green-deep">
                        <ArrowDown className="w-3.5 h-3.5 text-green-soft" />
                        <span>{lang === 'ID' ? `Kalender Ketersediaan: ${villa.title}` : `Availability Calendar: ${villa.title}`}</span>
                      </div>
                    </div>

                    {/* Embedded Room Calendar */}
                    <BookingCalendar
                      lang={lang}
                      viewYear={viewYear}
                      viewMonth={viewMonth}
                      setViewYear={setViewYear}
                      setViewMonth={setViewMonth}
                      selectStart={selectStart}
                      selectEnd={selectEnd}
                      setSelectStart={setSelectStart}
                      setSelectEnd={setSelectEnd}
                      hoveredDate={hoveredDate}
                      setHoveredDate={setHoveredDate}
                      unavailableDates={unavailableDates}
                    />

                    {/* Selected dates indicator bar inside the expanded area */}
                    {selectStart && selectEnd && (
                      <div className="bg-green-deep text-cream p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 shadow-md animate-fade-in">
                        <div className="text-center md:text-left space-y-0.5">
                          <p className="text-[10px] uppercase font-mono text-sand font-bold">Tanggal Menginap Terpilih</p>
                          <p className="text-xs font-serif font-bold">
                            {selectStart.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            {' — '}
                            {selectEnd.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={onScrollToForm}
                          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-cream font-bold text-xs rounded-xl shadow cursor-pointer transition-all active:scale-95 flex items-center gap-2"
                        >
                          <span>Lanjutkan Mengisi Data Tamu</span>
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {villas.length === 0 && (
          <div className="col-span-1 border border-dashed border-sand/40 p-8 rounded-3xl text-center text-text-mid bg-white">
            <Home className="w-8 h-8 text-green-soft/60 mx-auto stroke-1 mb-2" />
            <p className="font-serif font-semibold text-sm text-green-deep">Peno Homestay Standard Room</p>
            <p className="text-xs font-light mt-1 text-gray-400">Hubungi pengelola untuk detail kamar custom.</p>
          </div>
        )}
      </div>
    </div>
  );
};
