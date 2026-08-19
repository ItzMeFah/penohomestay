import React from 'react';
import { User, Mail, Phone, MessageSquare, ArrowRight } from 'lucide-react';
import { LanguageType, translations } from '../../utils/lang';

interface BookingFormProps {
  lang: LanguageType;
  formRef: React.RefObject<HTMLDivElement | null>;
  guestName: string;
  setGuestName: (v: string) => void;
  guestEmail: string;
  setGuestEmail: (v: string) => void;
  guestWa: string;
  setGuestWa: (v: string) => void;
  guestCount: number;
  setGuestCount: (v: number) => void;
  guestNotes: string;
  setGuestNotes: (v: string) => void;
  agreeTerms: boolean;
  setAgreeTerms: (v: boolean) => void;
  formError: string;
  handleBookingSubmit: (e: React.FormEvent) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  lang,
  formRef,
  guestName,
  setGuestName,
  guestEmail,
  setGuestEmail,
  guestWa,
  setGuestWa,
  guestCount,
  setGuestCount,
  guestNotes,
  setGuestNotes,
  agreeTerms,
  setAgreeTerms,
  formError,
  handleBookingSubmit
}) => {
  const t = translations[lang];

  return (
    <div
      id="booking-form"
      ref={formRef}
      className="bg-white rounded-3xl border border-sand/30 p-8 md:p-12 shadow-xl space-y-8"
    >
      <div className="border-b border-sand/20 pb-4">
        <h3 className="font-serif text-2xl md:text-3xl font-bold text-green-deep">
          {t.bookFormTitle}
        </h3>
        <p className="font-sans text-sm md:text-base text-text-mid font-light">
          {t.bookFormDesc}
        </p>
      </div>

      <form onSubmit={handleBookingSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* DETAILS GUEST */}
        <div className="col-span-1 md:col-span-2 border-t border-sand/10 pt-4 mt-2">
          <h4 className="font-serif font-bold text-lg text-green-deep mb-1">
            {lang === 'ID' ? 'Data Diri & Rincian Kontak' : 'Guest Details & Contact'}
          </h4>
          <p className="text-xs font-light text-text-mid">
            {lang === 'ID' ? 'Lengkapi detail pemesanan di bawah ini.' : 'Please enter your contact details below.'}
          </p>
        </div>

        {/* Left fields */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="font-sans text-sm font-semibold text-text-dark flex items-center space-x-2">
              <User className="w-4 h-4 text-green-soft" />
              <span>{t.bookFormName} *</span>
            </label>
            <input
              type="text"
              required
              placeholder={t.bookFormNamePlaceholder}
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full bg-cream/30 border border-sand/40 hover:border-sand focus:border-green-soft px-4 py-3 rounded-xl font-sans text-sm text-text-dark outline-none focus:ring-1 focus:ring-green-soft transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="font-sans text-sm font-semibold text-text-dark flex items-center space-x-2">
              <Mail className="w-4 h-4 text-green-soft" />
              <span>{t.bookFormEmail} *</span>
            </label>
            <input
              type="email"
              required
              placeholder="your-email@example.com"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              className="w-full bg-cream/30 border border-sand/40 hover:border-sand focus:border-green-soft px-4 py-3 rounded-xl font-sans text-sm text-text-dark outline-none focus:ring-1 focus:ring-green-soft transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="font-sans text-sm font-semibold text-text-dark flex items-center space-x-2">
              <Phone className="w-4 h-4 text-green-soft" />
              <span>{t.bookFormWa} *</span>
            </label>
            <input
              type="tel"
              required
              placeholder="+6281234567890"
              value={guestWa}
              onChange={(e) => setGuestWa(e.target.value)}
              className="w-full bg-cream/30 border border-sand/40 hover:border-sand focus:border-green-soft px-4 py-3 rounded-xl font-sans text-sm text-text-dark outline-none focus:ring-1 focus:ring-green-soft transition-all"
            />
          </div>
        </div>

        {/* Right fields */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="font-sans text-sm font-semibold text-text-dark flex items-center space-x-2">
              <User className="w-4 h-4 text-green-soft" />
              <span>{t.bookFormGuests} *</span>
            </label>
            <select
              value={guestCount}
              onChange={(e) => setGuestCount(Number(e.target.value))}
              className="w-full bg-cream/30 border border-sand/40 hover:border-sand focus:border-green-soft px-4 py-3 rounded-xl font-sans text-sm text-text-dark outline-none focus:ring-1 focus:ring-green-soft transition-all"
            >
              {[...Array(10)].map((_, i) => (
                <option key={i+1} value={i+1}>{i+1} {lang === 'ID' ? 'Orang' : 'Guests'}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="font-sans text-sm font-semibold text-text-dark flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-green-soft" />
              <span>{t.bookFormNotes}</span>
            </label>
            <textarea
              placeholder={t.bookFormNotesPlaceholder}
              rows={4}
              value={guestNotes}
              onChange={(e) => setGuestNotes(e.target.value)}
              className="w-full bg-cream/30 border border-sand/40 hover:border-sand focus:border-green-soft p-4 rounded-xl font-sans text-sm text-text-dark outline-none focus:ring-1 focus:ring-green-soft transition-all resize-none"
            />
          </div>

          <div className="space-y-2 pt-2">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-5 h-5 accent-green-soft mt-0.5 rounded cursor-pointer"
              />
              <span className="font-sans text-xs md:text-sm text-text-mid font-light leading-relaxed select-none">
                {t.bookFormAgree}
              </span>
            </label>
          </div>

          {formError && (
            <div className="bg-rose-50 text-rose-700 text-xs md:text-sm font-sans font-medium px-4 py-2.5 border border-rose-100 rounded-xl">
              {formError}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-green-deep hover:bg-green-mid text-cream font-sans font-semibold py-4 rounded-full shadow-lg transition-transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>{t.bookFormSubmit}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </form>
    </div>
  );
};
