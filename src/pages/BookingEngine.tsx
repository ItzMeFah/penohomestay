import React, { useState, useEffect, useRef } from 'react';
import { Booking, CMSHomepage } from '../types';
import { SwayingCoffeeTree, CoffeeBean, CoffeeLeaf } from '../components/CoffeeDecoration';
import { CurrencyType } from '../utils/storage';
import { translations, LanguageType } from '../utils/lang';

// Import modular sub-components
import { BookingSuccess } from '../components/booking/BookingSuccess';
import { BookingGuidelines } from '../components/booking/BookingGuidelines';
import { BookingVillaSelector } from '../components/booking/BookingVillaSelector';
import { BookingCalendar } from '../components/booking/BookingCalendar';
import { BookingSummaryCard } from '../components/booking/BookingSummaryCard';
import { BookingForm } from '../components/booking/BookingForm';
import { BookingConfirmModal } from '../components/booking/BookingConfirmModal';

interface BookingEngineProps {
  settings: any;
  bookings: Booking[];
  blockedDates: string[];
  onSubmitBooking: (bookingData: Omit<Booking, 'id' | 'created_at' | 'status' | 'total_eur'>) => Booking;
  onNavigate: (page: 'home' | 'booking') => void;
  currency: CurrencyType;
  onChangeCurrency: (c: CurrencyType) => void;
  lang: LanguageType;
  homepageData: CMSHomepage;
  selectedVillaId?: string;
  setSelectedVillaId?: (id: string) => void;
}

export const BookingEngine: React.FC<BookingEngineProps> = ({
  settings,
  bookings,
  blockedDates,
  onSubmitBooking,
  onNavigate,
  currency,
  onChangeCurrency,
  lang,
  homepageData,
  selectedVillaId,
  setSelectedVillaId
}) => {
  const t = translations[lang];
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth());
  const [selectStart, setSelectStart] = useState<Date | null>(null);
  const [selectEnd, setSelectEnd] = useState<Date | null>(null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [internalSelectedVillaId, setInternalSelectedVillaId] = useState<string>("");

  const activeVillaId = selectedVillaId !== undefined ? selectedVillaId : internalSelectedVillaId;
  const setActiveVillaId = setSelectedVillaId || setInternalSelectedVillaId;

  useEffect(() => {
    const villasList = homepageData.villas || [];
    if (villasList.length > 0 && !activeVillaId) {
      setActiveVillaId(villasList[0].id);
    }
  }, [homepageData.villas, activeVillaId, setActiveVillaId]);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [successBooking, setSuccessBooking] = useState<Booking | null>(null);

  // Form states
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestWa, setGuestWa] = useState("");
  const [guestCount, setGuestCount] = useState(2);
  const [guestNotes, setGuestNotes] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [formError, setFormError] = useState("");

  const formRef = useRef<HTMLDivElement>(null);

  // Auto scroll to form when range selected
  useEffect(() => {
    if (selectStart && selectEnd && formRef.current) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  }, [selectStart, selectEnd]);

  const selectedVilla = (homepageData.villas || []).find((v: any) => v.id === activeVillaId) || (homepageData.villas?.[0]);
  const pricePerNight = selectedVilla ? selectedVilla.pricePerPax : (settings.pricePerNight || 140);

  // Build unavailable dates set
  const unavailableDates = React.useMemo(() => {
    const set = new Set<string>();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    bookings.forEach(b => {
      const bVillaId = b.villa_id || (homepageData.villas?.[0]?.id || "");
      if (bVillaId !== activeVillaId) return;

      let isExpiredPending = false;
      if (b.status === 'pending') {
        const checkInDate = new Date(b.check_in);
        checkInDate.setHours(0, 0, 0, 0);
        if (checkInDate < today) {
          isExpiredPending = true;
        }
      }

      if ((b.status === 'paid' || b.status === 'pending') && !isExpiredPending) {
        let d = new Date(b.check_in);
        const end = new Date(b.check_out);
        while (d < end) {
          set.add(`${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`);
          d.setDate(d.getDate() + 1);
        }
      }
    });

    blockedDates.forEach(key => {
      if (key.includes(':')) {
        const [vId, dateStr] = key.split(':');
        if (vId === activeVillaId) {
          set.add(dateStr);
        }
      } else {
        set.add(key);
      }
    });

    return set;
  }, [bookings, blockedDates, activeVillaId, homepageData.villas]);

  const getNightsCount = () => {
    if (!selectStart || !selectEnd) return 0;
    const diffTime = Math.abs(selectEnd.getTime() - selectStart.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const nights = getNightsCount();
  const totalCost = nights * pricePerNight;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!selectStart || !selectEnd) {
      setFormError(lang === 'ID' ? "Silakan pilih tanggal check-in dan check-out terlebih dahulu." : "Please select check-in and check-out dates first.");
      return;
    }
    if (!guestName.trim()) {
      setFormError(lang === 'ID' ? "Silakan masukkan nama lengkap Anda." : "Please enter your full name.");
      return;
    }
    if (!guestEmail.trim() || !guestEmail.includes("@")) {
      setFormError(lang === 'ID' ? "Silakan masukkan alamat email yang valid." : "Please enter a valid email address.");
      return;
    }
    if (!guestWa.trim()) {
      setFormError(lang === 'ID' ? "Silakan masukkan nomor WhatsApp Anda." : "Please enter your WhatsApp number.");
      return;
    }
    if (!agreeTerms) {
      setFormError(lang === 'ID' ? "Anda harus menyetujui ketentuan menginap." : "You must agree to the terms and conditions.");
      return;
    }

    setIsConfirmModalOpen(true);
  };

  const confirmSubmit = () => {
    if (!selectStart || !selectEnd) return;

    const villaPrefix = selectedVilla ? `[Villa/Kamar: ${selectedVilla.title}] ` : "";
    const newBooking = onSubmitBooking({
      check_in: selectStart.toISOString(),
      check_out: selectEnd.toISOString(),
      nights: nights,
      guest_name: guestName,
      guest_email: guestEmail,
      guest_wa: guestWa,
      guest_count: guestCount,
      notes: `${villaPrefix}${guestNotes}`.trim(),
      villa_id: activeVillaId
    });

    setSuccessBooking(newBooking);
    setIsConfirmModalOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetBooking = () => {
    setSelectStart(null);
    setSelectEnd(null);
    setHoveredDate(null);
    setGuestName("");
    setGuestEmail("");
    setGuestWa("");
    setGuestCount(2);
    setGuestNotes("");
    setAgreeTerms(false);
    setSuccessBooking(null);
  };

  return (
    <div className="bg-cream/40 min-h-screen pt-24 pb-20 selection:bg-green-soft selection:text-cream">
      {/* Decorative coffee assets */}
      <CoffeeBean className="top-24 left-[5%] w-10 h-10 text-coffee/15" delay={0.5} duration={7} yOffset={35} rotateSpeed={180} />
      <CoffeeBean className="top-40 right-[5%] w-14 h-14 text-coffee/10" delay={2} duration={9} yOffset={45} rotateSpeed={-240} />
      <CoffeeBean className="bottom-24 left-[10%] w-8 h-8 text-coffee/20" delay={1} duration={5} yOffset={25} rotateSpeed={360} />
      <CoffeeBean className="bottom-40 right-[10%] w-12 h-12 text-coffee/15" delay={3.5} duration={8} yOffset={30} rotateSpeed={-120} />
      <CoffeeLeaf className="top-[35%] left-[6%] w-10 h-10 text-green-soft/15" delay={1.5} duration={7} sway={15} />
      <CoffeeLeaf className="top-[55%] right-[6%] w-12 h-12 text-green-soft/12" delay={0.5} duration={9} sway={18} />

      <SwayingCoffeeTree position="left" className="opacity-[0.18] -left-12 bottom-0 h-[650px] w-[240px]" />
      <SwayingCoffeeTree position="right" className="opacity-[0.18] -right-12 bottom-0 h-[650px] w-[240px]" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {successBooking ? (
          <BookingSuccess
            successBooking={successBooking}
            homepageData={homepageData}
            currency={currency}
            lang={lang}
            settings={settings}
            onNavigate={onNavigate}
            handleResetBooking={handleResetBooking}
          />
        ) : (
          <div className="space-y-12">
            {/* Header / Guidelines Block */}
            <div className="space-y-6">
              <div className="bg-green-deep rounded-3xl p-8 md:p-10 text-center md:text-left relative overflow-hidden shadow-md">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.06),transparent)] pointer-events-none" />
                <div className="relative z-10 max-w-2xl space-y-2">
                  <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-cream">
                    {lang === 'ID' ? 'Pemesanan Kamar' : 'Room Reservation'}
                  </h1>
                  <p className="font-sans text-xs md:text-sm text-cream/80 font-light leading-relaxed">
                    {t.bookEngineDesc}
                  </p>
                </div>
              </div>

              <BookingGuidelines
                homepageData={homepageData}
                currency={currency}
                lang={lang}
              />
            </div>

            {/* Step 1: Select Room / Villa with Slide-Down Calendar */}
            <BookingVillaSelector
              homepageData={homepageData}
              lang={lang}
              currency={currency}
              activeVillaId={activeVillaId}
              setActiveVillaId={setActiveVillaId}
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
              onScrollToForm={() => {
                if (formRef.current) {
                  formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            />

            {/* Step 3: Selected Range Summary */}
            <BookingSummaryCard
              lang={lang}
              currency={currency}
              onChangeCurrency={onChangeCurrency}
              pricePerNight={pricePerNight}
              selectStart={selectStart}
              selectEnd={selectEnd}
              setSelectStart={setSelectStart}
              setSelectEnd={setSelectEnd}
              setHoveredDate={setHoveredDate}
              nights={nights}
              totalCost={totalCost}
            />

            {/* Step 4: Booking Form details */}
            {selectStart && selectEnd && (
              <BookingForm
                lang={lang}
                formRef={formRef}
                guestName={guestName}
                setGuestName={setGuestName}
                guestEmail={guestEmail}
                setGuestEmail={setGuestEmail}
                guestWa={guestWa}
                setGuestWa={setGuestWa}
                guestCount={guestCount}
                setGuestCount={setGuestCount}
                guestNotes={guestNotes}
                setGuestNotes={setGuestNotes}
                agreeTerms={agreeTerms}
                setAgreeTerms={setAgreeTerms}
                formError={formError}
                handleBookingSubmit={handleBookingSubmit}
              />
            )}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {selectStart && selectEnd && (
        <BookingConfirmModal
          lang={lang}
          isConfirmModalOpen={isConfirmModalOpen}
          setIsConfirmModalOpen={setIsConfirmModalOpen}
          confirmSubmit={confirmSubmit}
          guestName={guestName}
          guestEmail={guestEmail}
          guestWa={guestWa}
          guestCount={guestCount}
          selectStart={selectStart}
          selectEnd={selectEnd}
          nights={nights}
          totalCost={totalCost}
          currency={currency}
        />
      )}
    </div>
  );
};
