import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, MessageSquare, Mail } from 'lucide-react';
import { Booking, CMSHomepage } from '../../types';
import { LanguageType, translations } from '../../utils/lang';
import { CurrencyType, convertAndFormatPrice } from '../../utils/storage';

interface BookingSuccessProps {
  successBooking: Booking;
  homepageData: CMSHomepage;
  currency: CurrencyType;
  lang: LanguageType;
  settings: any;
  onNavigate: (page: 'home' | 'booking') => void;
  handleResetBooking: () => void;
}

export const BookingSuccess: React.FC<BookingSuccessProps> = ({
  successBooking,
  homepageData,
  currency,
  lang,
  settings,
  onNavigate,
  handleResetBooking
}) => {
  const t = translations[lang];

  const selectedVilla = (homepageData.villas || []).find((v: any) => v.id === successBooking.villa_id) || (homepageData.villas?.[0]);

  const getWhatsAppMessage = (b: Booking) => {
    const formattedCheckIn = new Date(b.check_in).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const formattedCheckOut = new Date(b.check_out).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const priceFormatted = convertAndFormatPrice(b.total_eur, currency);

    return `Halo Peno Homestay! 🏡\n\nSaya telah mengisi form pemesanan dengan detail:\n\n📋 ID Pemesanan : ${b.id}\n👤 Nama         : ${b.guest_name}\n📅 Check-in     : ${formattedCheckIn}\n📅 Check-out    : ${formattedCheckOut}\n🌙 Durasi       : ${b.nights} malam\n👥 Jumlah Tamu  : ${b.guest_count} orang\n💶 Total Est.   : ${priceFormatted}\n\nMohon konfirmasi ketersediaan. Terima kasih! 🙏`;
  };

  const getWhatsAppLink = (b: Booking) => {
    const baseWa = settings.whatsappUrl || `https://wa.me/6281233800631`;
    const cleanNumber = baseWa.replace(/https:\/\/wa\.me\//, "").split("?")[0];
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(getWhatsAppMessage(b))}`;
  };

  const getEmailLink = (b: Booking) => {
    const formattedCheckIn = new Date(b.check_in).toLocaleDateString(lang === 'ID' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const formattedCheckOut = new Date(b.check_out).toLocaleDateString(lang === 'ID' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const priceFormatted = convertAndFormatPrice(b.total_eur, currency);

    const subject = `Pemesanan Peno Homestay #${b.id} - ${b.guest_name}`;
    const body = `Halo Peno Homestay! 🏡\n\nSaya telah mengisi form pemesanan dengan detail:\n\n📋 ID Pemesanan : ${b.id}\n👤 Nama         : ${b.guest_name}\n📧 Email        : ${b.guest_email}\n📱 WhatsApp     : ${b.guest_wa}\n📅 Check-in     : ${formattedCheckIn}\n📅 Check-out    : ${formattedCheckOut}\n🌙 Durasi       : ${b.nights} malam\n👥 Jumlah Tamu  : ${b.guest_count} orang\n💶 Total Est.   : ${priceFormatted}\n📝 Catatan      : ${b.notes || '-'}\n\nMohon konfirmasi ketersediaan. Terima kasih! 🙏`;

    return `mailto:Fikcri.me@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto bg-white border border-sand/30 rounded-3xl p-8 md:p-12 text-center shadow-2xl space-y-8"
    >
      <div className="flex justify-center">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto stroke-[1.5]" />
      </div>
      
      <div className="space-y-3">
        <h2 className="font-serif text-3xl font-bold text-green-deep">{t.bookSuccessTitle}</h2>
        <div className="inline-block bg-green-soft/10 text-green-deep border border-green-soft/20 px-4 py-2 rounded-full font-mono text-sm font-semibold">
          ID: {successBooking.id}
        </div>
        <p className="font-sans text-sm md:text-base text-text-mid font-light leading-relaxed">
          {t.bookSuccessDesc}
        </p>
      </div>

      {/* Receipt Summary Box */}
      <div className="bg-cream/40 p-6 rounded-2xl border border-sand/20 text-left space-y-4">
        <h4 className="font-serif font-bold text-green-deep border-b border-sand/30 pb-2">{t.bookSuccessSummary}</h4>
        <div className="grid grid-cols-2 gap-y-3 text-sm font-sans">
          <span className="text-text-mid">{t.bookSuccessName}</span>
          <span className="text-right font-semibold text-green-deep">{successBooking.guest_name}</span>

          <span className="text-text-mid">Check-In</span>
          <span className="text-right font-semibold text-green-deep">
            {new Date(successBooking.check_in).toLocaleDateString(lang === 'ID' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>

          <span className="text-text-mid">Check-Out</span>
          <span className="text-right font-semibold text-green-deep">
            {new Date(successBooking.check_out).toLocaleDateString(lang === 'ID' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>

          <span className="text-text-mid">{lang === 'ID' ? 'Durasi' : 'Duration'}</span>
          <span className="text-right font-semibold text-green-deep">{successBooking.nights} {lang === 'ID' ? 'malam' : 'nights'}</span>

          <span className="text-text-mid">{lang === 'ID' ? 'Jumlah Tamu' : 'Guests Count'}</span>
          <span className="text-right font-semibold text-green-deep">{successBooking.guest_count} {lang === 'ID' ? 'orang' : 'guests'}</span>

          {selectedVilla && (
            <>
              <span className="text-text-mid">{lang === 'ID' ? 'Villa / Kamar' : 'Villa / Room'}</span>
              <span className="text-right font-semibold text-green-soft font-serif">{selectedVilla.title}</span>
            </>
          )}

          <div className="col-span-2 border-t border-sand/30 my-2" />

          <span className="text-text-dark font-medium">{lang === 'ID' ? 'Estimasi Tarif' : 'Estimated Rate'}</span>
          <span className="text-right font-serif text-lg font-bold text-green-deep">{convertAndFormatPrice(successBooking.total_eur, currency)}</span>
        </div>
      </div>

      {/* Buttons / Gateways */}
      <div className="space-y-4 pt-2">
        <h3 className="font-serif text-xs font-semibold text-text-mid uppercase tracking-wider text-center">
          {lang === 'ID' ? 'Pilih Metode Pengiriman Pemesanan' : 'Select Booking Delivery Gateway'}
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <a
            href={getWhatsAppLink(successBooking)}
            target="_blank"
            referrerPolicy="no-referrer"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center space-x-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-sans font-bold py-4 px-5 rounded-2xl shadow-md transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer text-sm"
          >
            <MessageSquare className="w-5 h-5 fill-white text-white" />
            <span>{lang === 'ID' ? 'Kirim via WhatsApp' : 'Send via WhatsApp'}</span>
          </a>

          <a
            href={getEmailLink(successBooking)}
            target="_blank"
            referrerPolicy="no-referrer"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center space-x-2.5 bg-blue-600 hover:bg-blue-700 text-white font-sans font-bold py-4 px-5 rounded-2xl shadow-md transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer text-sm"
          >
            <Mail className="w-5 h-5 text-white" />
            <span>{lang === 'ID' ? 'Kirim via Email' : 'Send via Email'}</span>
          </a>
        </div>

        <div className="pt-2 flex flex-col gap-2.5">
          <button
            onClick={handleResetBooking}
            className="w-full bg-cream hover:bg-sand/30 border border-sand/40 hover:border-sand text-green-deep font-sans font-medium py-3 rounded-full transition-all text-sm"
          >
            {t.bookSuccessAnotherBtn}
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="w-full text-green-soft hover:text-green-deep font-sans font-medium text-sm transition-colors"
          >
            {t.bookSuccessHomeBtn}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
