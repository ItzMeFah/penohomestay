import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CalendarRange } from 'lucide-react';
import { CMSHomepage } from '../../../types';
import { convertAndFormatPrice } from '../../../utils/storage';

interface OfflineBookingModalProps {
  showAddOfflineModal: boolean;
  onClose: () => void;
  homepageData: CMSHomepage;
  offlineSelectedVillaId: string;
  setOfflineSelectedVillaId: (val: string) => void;
  offlineGuestName: string;
  setOfflineGuestName: (val: string) => void;
  offlineGuestWa: string;
  setOfflineGuestWa: (val: string) => void;
  offlineGuestEmail: string;
  setOfflineGuestEmail: (val: string) => void;
  offlineCheckIn: string;
  setOfflineCheckIn: (val: string) => void;
  offlineCheckOut: string;
  setOfflineCheckOut: (val: string) => void;
  offlineGuestCount: number;
  setOfflineGuestCount: (val: number) => void;
  offlinePriceIdr: number;
  setOfflinePriceIdr: (val: number) => void;
  offlineNotes: string;
  setOfflineNotes: (val: string) => void;
  handleSaveOfflineBooking: (e: React.FormEvent) => void;
}

const calculateNights = (inDate: string, outDate: string): number => {
  if (!inDate || !outDate) return 1;
  const diff = new Date(outDate).getTime() - new Date(inDate).getTime();
  const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return nights > 0 ? nights : 1;
};

export const OfflineBookingModal: React.FC<OfflineBookingModalProps> = ({
  showAddOfflineModal,
  onClose,
  homepageData,
  offlineSelectedVillaId,
  setOfflineSelectedVillaId,
  offlineGuestName,
  setOfflineGuestName,
  offlineGuestWa,
  setOfflineGuestWa,
  offlineGuestEmail,
  setOfflineGuestEmail,
  offlineCheckIn,
  setOfflineCheckIn,
  offlineCheckOut,
  setOfflineCheckOut,
  offlineGuestCount,
  setOfflineGuestCount,
  offlinePriceIdr,
  setOfflinePriceIdr,
  offlineNotes,
  setOfflineNotes,
  handleSaveOfflineBooking
}) => {
  return (
    <AnimatePresence>
      {showAddOfflineModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-cream/40 hover:bg-cream hover:text-rose-500 rounded-full transition-colors cursor-pointer flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-gray-150 pb-3">
              <h3 className="font-serif text-xl font-bold text-green-deep flex items-center space-x-2">
                <span className="p-1.5 bg-green-deep/10 rounded-lg text-green-deep">
                  <CalendarRange className="w-5 h-5" />
                </span>
                <span>Tambah Booking Offline</span>
              </h3>
              <p className="text-xs text-gray-400 mt-1">Dipesan & Bayar langsung (Offline). Ketersediaan kalender & laporan keuangan akan langsung ter-sinkronisasi.</p>
            </div>

            <form onSubmit={handleSaveOfflineBooking} className="space-y-4 font-sans text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Villa / Kamar Yang Dipesan <span className="text-rose-500">*</span></label>
                <select
                  value={offlineSelectedVillaId || (homepageData.villas?.[0]?.id || "")}
                  onChange={(e) => setOfflineSelectedVillaId(e.target.value)}
                  className="w-full bg-cream/15 border border-sand/40 hover:border-sand focus:border-green-soft px-3.5 py-2.5 rounded-xl text-sm text-text-dark outline-none focus:ring-1 focus:ring-green-soft transition-all"
                >
                  {(homepageData.villas || []).map((v: any) => (
                    <option key={v.id} value={v.id}>{v.title}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Nama Tamu <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={offlineGuestName}
                  onChange={(e) => setOfflineGuestName(e.target.value)}
                  className="w-full bg-cream/15 border border-sand/40 hover:border-sand focus:border-green-soft px-3.5 py-2.5 rounded-xl text-sm text-text-dark outline-none focus:ring-1 focus:ring-green-soft transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">No WhatsApp / HP <span className="text-rose-500">*</span></label>
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 08123456789"
                    value={offlineGuestWa}
                    onChange={(e) => setOfflineGuestWa(e.target.value)}
                    className="w-full bg-cream/15 border border-sand/40 hover:border-sand focus:border-green-soft px-3.5 py-2.5 rounded-xl text-sm text-text-dark outline-none focus:ring-1 focus:ring-green-soft transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Email (Opsional)</label>
                  <input
                    type="email"
                    placeholder="Contoh: budi@gmail.com"
                    value={offlineGuestEmail}
                    onChange={(e) => setOfflineGuestEmail(e.target.value)}
                    className="w-full bg-cream/15 border border-sand/40 hover:border-sand focus:border-green-soft px-3.5 py-2.5 rounded-xl text-sm text-text-dark outline-none focus:ring-1 focus:ring-green-soft transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Check-In <span className="text-rose-500">*</span></label>
                  <input
                    type="date"
                    required
                    value={offlineCheckIn}
                    onChange={(e) => setOfflineCheckIn(e.target.value)}
                    className="w-full bg-cream/15 border border-sand/40 hover:border-sand focus:border-green-soft px-3.5 py-2.5 rounded-xl text-sm text-text-dark outline-none focus:ring-1 focus:ring-green-soft transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Check-Out <span className="text-rose-500">*</span></label>
                  <input
                    type="date"
                    required
                    value={offlineCheckOut}
                    onChange={(e) => setOfflineCheckOut(e.target.value)}
                    className="w-full bg-cream/15 border border-sand/40 hover:border-sand focus:border-green-soft px-3.5 py-2.5 rounded-xl text-sm text-text-dark outline-none focus:ring-1 focus:ring-green-soft transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Jumlah Tamu</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={offlineGuestCount}
                    onChange={(e) => setOfflineGuestCount(parseInt(e.target.value) || 1)}
                    className="w-full bg-cream/15 border border-sand/40 hover:border-sand focus:border-green-soft px-3.5 py-2.5 rounded-xl text-sm text-text-dark outline-none focus:ring-1 focus:ring-green-soft transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Tarif yang Dibayarkan (Rp)</label>
                  <input
                    type="number"
                    min={0}
                    step={10000}
                    required
                    value={offlinePriceIdr}
                    onChange={(e) => setOfflinePriceIdr(parseInt(e.target.value) || 0)}
                    className="w-full bg-cream/15 border border-sand/40 hover:border-sand focus:border-green-soft px-3.5 py-2.5 rounded-xl text-sm text-text-dark outline-none focus:ring-1 focus:ring-green-soft transition-all font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Catatan Tambahan (Opsional)</label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Dibayar lunas tunai di tempat"
                  value={offlineNotes}
                  onChange={(e) => setOfflineNotes(e.target.value)}
                  className="w-full bg-cream/15 border border-sand/40 hover:border-sand focus:border-green-soft p-3 rounded-xl text-sm text-text-dark outline-none focus:ring-1 focus:ring-green-soft transition-all"
                />
              </div>

              {offlineCheckIn && offlineCheckOut && (
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 space-y-1.5 text-xs text-emerald-800">
                  <div className="flex justify-between">
                    <span className="font-medium">Durasi Menginap:</span>
                    <span className="font-bold">{calculateNights(offlineCheckIn, offlineCheckOut)} malam</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Status Pembayaran:</span>
                    <span className="font-bold uppercase tracking-wider text-emerald-600">Lunas & Terkunci (Paid)</span>
                  </div>
                  <div className="flex justify-between border-t border-emerald-100 pt-1.5 font-bold">
                    <span>Total Masuk Keuangan:</span>
                    <span className="font-mono text-sm">{convertAndFormatPrice(Number((offlinePriceIdr / 17500).toFixed(4)), 'IDR')}</span>
                  </div>
                </div>
              )}

              <div className="flex space-x-3 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition-colors text-center cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-green-deep hover:bg-green-mid text-cream font-semibold rounded-xl text-xs shadow transition-all hover:-translate-y-0.5 active:scale-95 text-center cursor-pointer"
                >
                  Simpan Booking Offline
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
