import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageSquare } from 'lucide-react';
import { Booking, CMSHomepage } from '../../../types';
import { convertAndFormatPrice } from '../../../utils/storage';

interface BookingDetailModalProps {
  selectedBookingDetail: Booking | null;
  onClose: () => void;
  homepageData: CMSHomepage;
  handleUpdateBookingStatus: (id: string, status: 'pending' | 'paid' | 'cancelled') => void;
  handleDeleteBooking: (id: string) => void;
  getAdminWhatsAppLink: (b: Booking) => string;
}

export const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  selectedBookingDetail,
  onClose,
  homepageData,
  handleUpdateBookingStatus,
  handleDeleteBooking,
  getAdminWhatsAppLink
}) => {
  return (
    <AnimatePresence>
      {selectedBookingDetail && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl relative space-y-6"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-cream/40 hover:bg-cream hover:text-rose-500 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-gray-100 pb-3">
              <h3 className="font-serif text-2xl font-bold text-green-deep flex items-center space-x-2">
                <span>Rincian Pemesanan</span>
                <span className="text-xs font-mono px-3 py-1 bg-green-soft/10 text-green-deep rounded-full border border-green-soft/20 uppercase font-bold tracking-wider">{selectedBookingDetail.id}</span>
              </h3>
              <p className="text-xs text-gray-400 font-sans mt-1">Dipesan pada: {new Date(selectedBookingDetail.created_at).toLocaleString('id-ID')}</p>
            </div>

            {/* Data fields list */}
            <div className="grid grid-cols-2 gap-y-3 font-sans text-sm border-b border-gray-50 pb-4">
              <span className="text-gray-400">Nama Tamu</span>
              <span className="text-right font-semibold text-text-dark">{selectedBookingDetail.guest_name}</span>

              <span className="text-gray-400">Kamar / Villa</span>
              <span className="text-right font-semibold text-green-deep font-bold">
                {(() => {
                  const matchingVilla = (homepageData.villas || []).find((v: any) => v.id === selectedBookingDetail.villa_id) || homepageData.villas?.[0];
                  return matchingVilla ? matchingVilla.title : "Kamar Utama";
                })()}
              </span>

              <span className="text-gray-400">Email</span>
              <span className="text-right font-semibold text-text-dark truncate">{selectedBookingDetail.guest_email}</span>

              <span className="text-gray-400">WhatsApp</span>
              <span className="text-right font-semibold text-text-dark">{selectedBookingDetail.guest_wa}</span>

              <span className="text-gray-400">Jumlah Tamu</span>
              <span className="text-right font-semibold text-text-dark">{selectedBookingDetail.guest_count} orang</span>

              <span className="text-gray-400">Mulai Check-In</span>
              <span className="text-right font-semibold text-green-deep">
                {new Date(selectedBookingDetail.check_in).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>

              <span className="text-gray-400">Mulai Check-Out</span>
              <span className="text-right font-semibold text-green-deep">
                {new Date(selectedBookingDetail.check_out).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>

              <span className="text-gray-400">Durasi Tinggal</span>
              <span className="text-right font-semibold text-text-dark">{selectedBookingDetail.nights} malam</span>

              <span className="text-gray-400">Estimasi Tagihan</span>
              <span className="text-right font-serif font-bold text-green-deep text-base">{convertAndFormatPrice(selectedBookingDetail.total_eur, 'IDR')}</span>

              <span className="text-gray-400">Status</span>
              <span className="text-right">
                <select
                  value={selectedBookingDetail.status}
                  onChange={(e) => handleUpdateBookingStatus(selectedBookingDetail.id, e.target.value as any)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold border outline-none cursor-pointer transition-all uppercase tracking-wider ${
                    selectedBookingDetail.status === 'paid'
                      ? 'bg-emerald-500 text-white border-emerald-600'
                      : selectedBookingDetail.status === 'cancelled'
                        ? 'bg-rose-500 text-white border-rose-600'
                        : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}
                >
                  <option value="pending" className="bg-white text-gray-700">Pending</option>
                  <option value="paid" className="bg-white text-gray-700">Paid</option>
                  <option value="cancelled" className="bg-white text-gray-700">Cancelled</option>
                </select>
              </span>
            </div>

            {/* Guest Notes box */}
            {selectedBookingDetail.notes && (
              <div className="bg-cream/40 p-4 rounded-xl border border-sand/20 space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-sans">Catatan Permintaan</span>
                <p className="text-xs text-text-mid font-sans font-light leading-relaxed">"{selectedBookingDetail.notes}"</p>
              </div>
            )}

            {/* Modal controls */}
            <div className="flex flex-col gap-3 pt-2">
              <a
                href={getAdminWhatsAppLink(selectedBookingDetail)}
                target="_blank"
                referrerPolicy="no-referrer"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white font-sans font-semibold py-3.5 rounded-full shadow-md text-sm transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-white text-white" />
                <span>Kirim Konfirmasi via WhatsApp</span>
              </a>

              <div className="flex gap-3">
                <button
                  onClick={() => handleDeleteBooking(selectedBookingDetail.id)}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-3.5 rounded-full font-sans font-semibold text-xs transition-colors cursor-pointer"
                >
                  Hapus Permanen
                </button>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
