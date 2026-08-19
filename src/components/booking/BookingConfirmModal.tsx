import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { LanguageType } from '../../utils/lang';
import { CurrencyType, convertAndFormatPrice } from '../../utils/storage';

interface BookingConfirmModalProps {
  lang: LanguageType;
  isConfirmModalOpen: boolean;
  setIsConfirmModalOpen: (v: boolean) => void;
  confirmSubmit: () => void;
  guestName: string;
  guestEmail: string;
  guestWa: string;
  guestCount: number;
  selectStart: Date;
  selectEnd: Date;
  nights: number;
  totalCost: number;
  currency: CurrencyType;
}

export const BookingConfirmModal: React.FC<BookingConfirmModalProps> = ({
  lang,
  isConfirmModalOpen,
  setIsConfirmModalOpen,
  confirmSubmit,
  guestName,
  guestEmail,
  guestWa,
  guestCount,
  selectStart,
  selectEnd,
  nights,
  totalCost,
  currency
}) => {
  return (
    <AnimatePresence>
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl border border-sand/30 p-8 max-w-lg w-full shadow-2xl relative space-y-6"
          >
            <button 
              onClick={() => setIsConfirmModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-cream/40 hover:bg-cream hover:text-rose-500 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 text-center md:text-left">
              <h3 className="font-serif text-2xl font-bold text-green-deep">
                {lang === 'ID' ? 'Konfirmasi Pemesanan' : 'Confirm Booking'}
              </h3>
              <p className="font-sans text-sm text-text-mid font-light">
                {lang === 'ID' 
                  ? 'Silakan periksa kembali detail pemesanan Anda sebelum melakukan konfirmasi akhir.' 
                  : 'Please double check your booking details before making the final confirmation.'}
              </p>
            </div>

            {/* Summary card inside modal */}
            <div className="bg-cream/40 rounded-2xl p-5 border border-sand/20 space-y-4">
              <div className="grid grid-cols-2 gap-y-2 text-sm font-sans">
                <span className="text-text-mid">{lang === 'ID' ? 'Nama Tamu' : 'Guest Name'}</span>
                <span className="text-right font-medium text-green-deep">{guestName}</span>

                <span className="text-text-mid">Email</span>
                <span className="text-right font-medium text-green-deep truncate">{guestEmail}</span>

                <span className="text-text-mid">WhatsApp</span>
                <span className="text-right font-medium text-green-deep">{guestWa}</span>

                <span className="text-text-mid">{lang === 'ID' ? 'Jumlah Tamu' : 'Guests Count'}</span>
                <span className="text-right font-medium text-green-deep">{guestCount} {lang === 'ID' ? 'orang' : 'guests'}</span>

                <div className="col-span-2 border-t border-sand/15 my-2" />

                <span className="text-text-mid">{lang === 'ID' ? 'Tanggal Check-In' : 'Check-In Date'}</span>
                <span className="text-right font-medium text-green-deep">
                  {selectStart.toLocaleDateString(lang === 'ID' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>

                <span className="text-text-mid">{lang === 'ID' ? 'Tanggal Check-Out' : 'Check-Out Date'}</span>
                <span className="text-right font-medium text-green-deep">
                  {selectEnd.toLocaleDateString(lang === 'ID' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>

                <span className="text-text-mid">{lang === 'ID' ? 'Durasi Menginap' : 'Duration of Stay'}</span>
                <span className="text-right font-semibold text-green-deep">{nights} {lang === 'ID' ? 'malam' : 'nights'}</span>

                <div className="col-span-2 border-t border-sand/15 my-2" />

                <span className="text-text-dark font-semibold">{lang === 'ID' ? 'Total Tarif (Estimasi)' : 'Total Rate (Estimate)'}</span>
                <span className="text-right font-serif text-xl font-bold text-green-deep">{convertAndFormatPrice(totalCost, currency)}</span>
              </div>
            </div>

            {/* Action buttons inside modal */}
            <div className="flex flex-col md:flex-row gap-4 pt-2">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="w-full bg-cream hover:bg-sand/30 border border-sand/40 hover:border-sand text-green-deep py-3.5 rounded-full font-sans font-semibold transition-all text-sm"
              >
                {lang === 'ID' ? 'Perbaiki Data' : 'Edit Details'}
              </button>
              <button
                onClick={confirmSubmit}
                className="w-full bg-green-deep hover:bg-green-mid text-cream py-3.5 rounded-full font-sans font-semibold transition-transform hover:-translate-y-0.5 active:scale-95 text-sm"
              >
                {lang === 'ID' ? 'Konfirmasi Pemesanan' : 'Confirm Booking'}
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
