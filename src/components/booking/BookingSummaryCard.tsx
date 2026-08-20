import React from 'react';
import { Calendar, Info } from 'lucide-react';
import { LanguageType, translations } from '../../utils/lang';
import { CurrencyType, convertAndFormatPrice } from '../../utils/storage';

interface BookingSummaryCardProps {
  lang: LanguageType;
  currency: CurrencyType;
  onChangeCurrency: (c: CurrencyType) => void;
  pricePerNight: number;
  selectStart: Date | null;
  selectEnd: Date | null;
  setSelectStart: (d: Date | null) => void;
  setSelectEnd: (d: Date | null) => void;
  setHoveredDate: (d: Date | null) => void;
  nights: number;
  totalCost: number;
}

export const BookingSummaryCard: React.FC<BookingSummaryCardProps> = ({
  lang,
  currency,
  onChangeCurrency,
  pricePerNight,
  selectStart,
  selectEnd,
  setSelectStart,
  setSelectEnd,
  setHoveredDate,
  nights,
  totalCost
}) => {
  const t = translations[lang];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Pricing & Stay Summary Card */}
      <div className="lg:col-span-8 w-full">
        <div className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-100 pb-5">
            <div className="space-y-1">
              <span className="text-xs text-text-mid font-medium">{lang === 'ID' ? 'Tarif Kamar' : 'Room Rate'}</span>
              <div className="flex items-baseline space-x-2">
                <span className="font-serif text-3xl font-bold text-green-deep">{convertAndFormatPrice(pricePerNight, 'IDR')}</span>
                <span className="font-sans text-sm text-text-mid font-light">/ {lang === 'ID' ? 'malam' : 'night'}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-green-50 px-3 py-1.5 rounded-xl border border-green-100">
              <span className="text-xs font-sans font-semibold text-green-deep">IDR (Rupiah)</span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-serif font-bold text-green-deep text-lg flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-green-soft" />
              <span>{lang === 'ID' ? 'Rincian Masa Menginap' : 'Stay Summary Details'}</span>
            </h4>

            {selectStart ? (
              <div className="space-y-3 font-sans text-sm bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-text-mid font-medium">Tanggal Check-In</span>
                  <span className="font-semibold text-green-deep">
                    {selectStart.toLocaleDateString(lang === 'ID' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-text-mid font-medium">Tanggal Check-Out</span>
                  <span className="font-semibold text-green-deep">
                    {selectEnd ? selectEnd.toLocaleDateString(lang === 'ID' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : (lang === 'ID' ? "Silakan pilih tanggal check-out pada kalender..." : "Choose check-out date from calendar...")}
                  </span>
                </div>
                {selectEnd && (
                  <>
                    <div className="flex justify-between py-1.5 border-b border-gray-100">
                      <span className="text-text-mid font-medium">{lang === 'ID' ? 'Durasi Tinggal' : 'Duration of Stay'}</span>
                      <span className="font-semibold text-green-deep">{nights} {lang === 'ID' ? 'malam' : 'nights'}</span>
                    </div>
                    <div className="flex justify-between py-2 text-base font-semibold pt-4">
                      <span className="text-text-dark font-bold">{lang === 'ID' ? 'Estimasi Tarif Keseluruhan' : 'Total Stay Rate'}</span>
                      <span className="font-serif font-bold text-green-deep text-2xl">{convertAndFormatPrice(totalCost, currency)}</span>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="bg-cream/20 p-6 rounded-2xl border border-dashed border-sand/40 text-center py-8 text-text-mid text-sm font-sans font-light leading-relaxed">
                {lang === 'ID' 
                  ? 'Silakan klik tanggal check-in terlebih dahulu pada kalender di atas untuk mulai memproses estimasi.'
                  : 'Please select a check-in date on the calendar above to start calculating the stay estimate.'}
              </div>
            )}
          </div>

          {selectStart && selectEnd ? (
            <button
              onClick={() => {
                const formElem = document.getElementById('booking-form');
                if (formElem) formElem.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full bg-green-deep hover:bg-green-mid text-cream font-sans font-semibold py-4 rounded-xl shadow-md transition-all hover:-translate-y-0.5"
            >
              {t.bookFillData}
            </button>
          ) : selectStart ? (
            <div className="w-full bg-green-deep/5 text-center py-3.5 rounded-xl font-sans text-sm font-medium text-green-deep animate-pulse">
              {t.bookSelectRange}
            </div>
          ) : null}

          {selectStart && (
            <button
              onClick={() => {
                setSelectStart(null);
                setSelectEnd(null);
                setHoveredDate(null);
              }}
              className="w-full text-center text-xs font-sans text-rose-500 hover:text-rose-700 transition-colors font-semibold"
            >
              {lang === 'ID' ? 'Batal & Atur Ulang Kalender' : 'Cancel & Reset Selection'}
            </button>
          )}
        </div>
      </div>

      {/* Right Column: Advisory / Terms Information Block */}
      <div className="lg:col-span-4 w-full">
        <div className="bg-[#f4f8f5] border border-green-100 rounded-3xl p-6 md:p-8 space-y-4">
          <div className="flex items-center space-x-2.5 text-green-deep pb-2 border-b border-green-100/50">
            <Info className="w-5 h-5 flex-shrink-0 text-green-soft" />
            <h5 className="font-serif font-bold text-base">{t.bookTerms}</h5>
          </div>
          <ul className="space-y-3 font-sans text-xs text-text-mid font-light leading-relaxed">
            <li className="flex items-start"><span className="text-green-soft mr-2 font-bold">•</span><span>{t.bookTerms1}</span></li>
            <li className="flex items-start"><span className="text-green-soft mr-2 font-bold">•</span><span>{t.bookTerms2}</span></li>
            <li className="flex items-start"><span className="text-green-soft mr-2 font-bold">•</span><span>{t.bookTerms3}</span></li>
            <li className="flex items-start"><span className="text-green-soft mr-2 font-bold">•</span><span>{t.bookTerms4}</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
};
