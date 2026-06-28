import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, ChevronRight, Calendar, User, Mail, Phone, 
  MessageSquare, CheckCircle2, ArrowRight, X, Info, Clock, Shield, Compass, MapPin
} from 'lucide-react';
import { Booking, CMSHomepage } from '../types';
import { SwayingCoffeeTree, CoffeeBean, CoffeeLeaf } from './CoffeeDecoration';
import { CurrencyType, convertAndFormatPrice } from '../utils/storage';
import { translations, LanguageType } from '../utils/lang';

const MONTHS = {
  ID: [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ],
  EN: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]
};

const DAYS = {
  ID: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
  EN: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
};

const SINGLE_DAYS = {
  ID: ["S", "S", "R", "K", "J", "S", "M"],
  EN: ["M", "T", "W", "T", "F", "S", "S"]
};

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
  homepageData
}) => {
  const t = translations[lang];
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(5); // 0-indexed (5 = June)
  const [selectStart, setSelectStart] = useState<Date | null>(null);
  const [selectEnd, setSelectEnd] = useState<Date | null>(null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [successBooking, setSuccessBooking] = useState<Booking | null>(null);

  // Form states
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestWa, setGuestWa] = useState("");
  const [guestCount, setGuestCount] = useState(2);
  const [guestNotes, setGuestNotes] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Form errors
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

  const pricePerNight = settings.pricePerNight || 140;

  // Build unavailable dates set
  const unavailableDates = React.useMemo(() => {
    const set = new Set<string>();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Process active bookings (PAID, or PENDING that are not expired)
    bookings.forEach(b => {
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

    // 2. Process admin manually booked dates
    blockedDates.forEach(key => set.add(key));

    return set;
  }, [bookings, blockedDates]);

  // Calendar logic helpers
  const handleMonthPrev = () => {
    setViewMonth(prev => {
      if (prev === 0) {
        setViewYear(y => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const handleMonthNext = () => {
    setViewMonth(prev => {
      if (prev === 11) {
        setViewYear(y => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  const getMonthYearOffset = (year: number, month: number, offset: number) => {
    let targetMonth = month + offset;
    let targetYear = year;
    if (targetMonth > 11) {
      targetMonth = targetMonth % 12;
      targetYear += 1;
    } else if (targetMonth < 0) {
      targetMonth = 12 + (targetMonth % 12);
      targetYear -= 1;
    }
    return { year: targetYear, month: targetMonth };
  };

  // Check if a date is past
  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Day cell click handler
  const handleDateClick = (date: Date, key: string) => {
    if (isPastDate(date)) return;
    if (unavailableDates.has(key)) return;

    if (!selectStart || (selectStart && selectEnd)) {
      setSelectStart(date);
      setSelectEnd(null);
      setHoveredDate(null);
    } else {
      // Second click: select end date
      if (date < selectStart) {
        // Swap if end is before start
        setSelectEnd(selectStart);
        setSelectStart(date);
      } else {
        // Ensure no blocked dates inside the selected range
        let temp = new Date(selectStart);
        let hasBlocked = false;
        while (temp < date) {
          const tempKey = `${temp.getFullYear()}-${temp.getMonth() + 1}-${temp.getDate()}`;
          if (unavailableDates.has(tempKey)) {
            hasBlocked = true;
            break;
          }
          temp.setDate(temp.getDate() + 1);
        }

        if (hasBlocked) {
          setSelectStart(date);
          setSelectEnd(null);
        } else {
          setSelectEnd(date);
        }
      }
    }
  };

  // Get days in a range
  const getNightsCount = () => {
    if (!selectStart || !selectEnd) return 0;
    const diffTime = Math.abs(selectEnd.getTime() - selectStart.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const nights = getNightsCount();
  const totalCost = nights * pricePerNight;

  // Render a calendar block with minimalist horizontal aesthetics
  const renderSingleMonthBlock = (year: number, month: number, index: number, displayClass = "") => {
    const firstDayIndex = new Date(year, month, 1).getDay(); // Sunday=0, Monday=1, ...
    // Map Sunday=0 to index 6, Monday=1 to index 0, etc.
    const startOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dayCells = [];

    // Empty spaces before first day of month
    for (let i = 0; i < startOffset; i++) {
      dayCells.push(<div key={`empty-${i}`} className="aspect-square w-full" />);
    }

    // Days of the month
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const key = `${year}-${month + 1}-${d}`;
      const isPast = isPastDate(date);
      
      const isUnavailable = isPast || unavailableDates.has(key);

      // Status checks for rendering to match Peno Homestay style
      let cellClass = "bg-[#dcfce7] text-green-900 font-semibold border border-green-250 hover:bg-emerald-100 cursor-pointer";
      let tooltip = "";

      if (isPast) {
        cellClass = "bg-gray-100 text-gray-300 cursor-not-allowed opacity-40";
        tooltip = "Sudah lewat";
      } else if (isUnavailable) {
        cellClass = "bg-rose-500 text-white font-bold cursor-not-allowed relative border border-rose-600 rounded-md shadow-xs";
        tooltip = "BOOKED";
      } else {
        cellClass = "cursor-pointer hover:bg-emerald-600 hover:text-white bg-emerald-500 text-white font-bold border border-emerald-600 rounded-md shadow-xs active:scale-95 transition-all";
      }

      // Check range selection
      const isSelectedStart = selectStart && date.getTime() === selectStart.getTime();
      const isSelectedEnd = selectEnd && date.getTime() === selectEnd.getTime();

      let isInRange = false;
      let isHoverInRange = false;

      if (selectStart && selectEnd && date >= selectStart && date <= selectEnd) {
        isInRange = true;
      } else if (selectStart && !selectEnd && hoveredDate && date >= selectStart && date <= hoveredDate) {
        isHoverInRange = true;
      }

      if (isSelectedStart) {
        cellClass = "bg-green-deep text-cream font-bold scale-105 z-10 rounded-md shadow-md border border-green-deep cursor-pointer";
      } else if (isSelectedEnd) {
        cellClass = "bg-green-deep text-cream font-bold scale-105 z-10 rounded-md shadow-md border border-green-deep cursor-pointer";
      } else if (isInRange) {
        cellClass = "bg-green-soft text-cream font-semibold rounded-md border border-green-soft cursor-pointer";
      } else if (isHoverInRange) {
        cellClass = "bg-green-soft/40 text-green-deep rounded-md border border-dashed border-green-soft/50 cursor-pointer";
      }

      dayCells.push(
        <div 
          key={d} 
          onClick={() => handleDateClick(date, key)}
          onMouseEnter={() => !selectEnd && selectStart && setHoveredDate(date)}
          className={`aspect-square w-full flex items-center justify-center rounded-md text-xs sm:text-sm transition-all duration-150 relative ${cellClass}`}
          title={tooltip}
        >
          <span>{d}</span>
          {/* Subtle dots for booked/blocked */}
          {(!isPast && isUnavailable) && <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-white opacity-90" />}
        </div>
      );
    }

    return (
      <div className={`bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col ${displayClass}`}>
        {/* Header Block with background */}
        <div className="bg-gray-50 border-b border-gray-150 px-4 py-3 flex items-center justify-between">
          {index === 0 ? (
            <button
              type="button"
              onClick={handleMonthPrev}
              className="p-1 w-7 h-7 flex items-center justify-center bg-white hover:bg-gray-100 text-gray-500 hover:text-gray-800 border border-gray-200 rounded-md transition-all cursor-pointer shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          ) : (
            <div className="w-7 h-7" />
          )}

          <div className="font-sans font-semibold text-xs text-gray-600 uppercase tracking-wider select-none">
            {MONTHS[lang][month]} {year}
          </div>

          {index === 0 ? (
            <button
              type="button"
              onClick={handleMonthNext}
              className="p-1 w-7 h-7 flex items-center justify-center bg-white hover:bg-gray-100 text-gray-500 hover:text-gray-800 border border-gray-200 rounded-md transition-all cursor-pointer shadow-xs md:hidden"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : index === 1 ? (
            <button
              type="button"
              onClick={handleMonthNext}
              className="p-1 w-7 h-7 flex items-center justify-center bg-white hover:bg-gray-100 text-gray-500 hover:text-gray-800 border border-gray-200 rounded-md transition-all cursor-pointer shadow-xs hidden md:flex lg:hidden"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : index === 2 ? (
            <button
              type="button"
              onClick={handleMonthNext}
              className="p-1 w-7 h-7 flex items-center justify-center bg-white hover:bg-gray-100 text-gray-500 hover:text-gray-800 border border-gray-200 rounded-md transition-all cursor-pointer shadow-xs hidden lg:flex"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="w-7 h-7" />
          )}
        </div>

        {/* Calendar Body */}
        <div className="p-4 flex-grow">
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] md:text-xs font-bold text-gray-400 uppercase mb-3 select-none">
            {SINGLE_DAYS[lang].map((day, i) => (
              <div key={i} className="py-0.5">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {dayCells}
          </div>
        </div>
      </div>
    );
  };

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

    // Open confirm dialog
    setIsConfirmModalOpen(true);
  };

  const confirmSubmit = () => {
    if (!selectStart || !selectEnd) return;

    const newBooking = onSubmitBooking({
      check_in: selectStart.toISOString(),
      check_out: selectEnd.toISOString(),
      nights: nights,
      guest_name: guestName,
      guest_email: guestEmail,
      guest_wa: guestWa,
      guest_count: guestCount,
      notes: guestNotes
    });

    setSuccessBooking(newBooking);
    setIsConfirmModalOpen(false);

    // Scroll to success page or top of window
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      
      {/* Dynamic Animated Coffee Leaf/Bean decorations */}
      <CoffeeBean className="top-24 left-[5%] w-10 h-10 text-coffee/15" delay={0.5} duration={7} yOffset={35} rotateSpeed={180} />
      <CoffeeBean className="top-40 right-[5%] w-14 h-14 text-coffee/10" delay={2} duration={9} yOffset={45} rotateSpeed={-240} />
      <CoffeeBean className="bottom-24 left-[10%] w-8 h-8 text-coffee/20" delay={1} duration={5} yOffset={25} rotateSpeed={360} />
      <CoffeeBean className="bottom-40 right-[10%] w-12 h-12 text-coffee/15" delay={3.5} duration={8} yOffset={30} rotateSpeed={-120} />
      <CoffeeLeaf className="top-[35%] left-[6%] w-10 h-10 text-green-soft/15" delay={1.5} duration={7} sway={15} />
      <CoffeeLeaf className="top-[55%] right-[6%] w-12 h-12 text-green-soft/12" delay={0.5} duration={9} sway={18} />

      <SwayingCoffeeTree position="left" className="opacity-[0.18] -left-12 bottom-0 h-[650px] w-[240px]" />
      <SwayingCoffeeTree position="right" className="opacity-[0.18] -right-12 bottom-0 h-[650px] w-[240px]" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* 1. SUCCESS BOOKING STATE */}
        {successBooking ? (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto bg-white border border-sand/30 rounded-3xl p-8 md:p-12 text-center shadow-2xl space-y-8"
          >
            <div className="flex justify-center">
              <CheckCircle2 className="w-20 h-20 text-emerald-500 animate-bounce" />
            </div>
            
            <div className="space-y-3">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto stroke-[1.5]" />
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
        ) : (
          <div className="space-y-12">
            
            {/* 2. HERO STRIP PANEL & STAY GUIDELINES (Unified Section) */}
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="bg-green-deep rounded-3xl p-8 md:p-10 text-center text-cream relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-48 h-48 bg-green-soft/10 rounded-full blur-2xl" />
                <div className="relative z-10 max-w-2xl mx-auto space-y-3">
                  <span className="text-sand font-mono text-xs uppercase tracking-widest font-semibold block">{lang === 'ID' ? 'Peno Homestay Gombengsari' : 'Peno Homestay Gombengsari'}</span>
                  <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-cream">{lang === 'ID' ? 'Pesan Kamar Anda' : 'Book Your Stay'}</h1>
                  <p className="font-sans text-xs md:text-sm text-cream/80 font-light leading-relaxed">
                    {t.bookEngineDesc}
                  </p>
                </div>
              </div>

              {/* Amenities & Guidelines Card */}
              <div id="info" className="bg-white border border-sand/30 rounded-3xl p-6 md:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center scroll-mt-24">
                <div className="lg:col-span-5 space-y-4">
                  <span className="text-green-soft font-mono text-xs uppercase tracking-widest font-semibold block">
                    {lang === 'ID' ? 'Panduan Menginap' : 'Stay Guidelines'}
                  </span>
                  <h2 className="font-serif text-xl md:text-2xl font-bold text-green-deep tracking-tight">
                    {lang === 'ID' ? 'Fasilitas & Aturan' : 'Amenities & Guidelines'}
                  </h2>
                  <p className="font-sans text-xs text-text-mid font-light leading-relaxed">
                    {lang === 'ID' 
                      ? 'Agar kenyamanan liburan Anda maksimal, perhatikan detail waktu check-in, check-out, serta harga menginap di Peno Homestay.' 
                      : 'To ensure your absolute holiday comfort, please take note of the check-in, check-out times, and pricing details at Peno Homestay.'}
                  </p>

                  <div className="space-y-2.5 divide-y divide-sand/20">
                    <div className="flex items-center justify-between py-1">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-4 h-4 text-green-soft" />
                        <span className="font-sans text-xs font-medium text-text-dark">
                          {lang === 'ID' ? 'Waktu Check-In' : 'Check-In Time'}
                        </span>
                      </div>
                      <span className="font-sans text-xs font-semibold text-green-deep">{homepageData.info.checkin} WIB</span>
                    </div>
                    <div className="flex items-center justify-between py-1 pt-2">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-4 h-4 text-green-soft" />
                        <span className="font-sans text-xs font-medium text-text-dark">
                          {lang === 'ID' ? 'Waktu Check-Out' : 'Check-Out Time'}
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
                        {lang === 'ID' ? 'Mulai ' : 'Starting from '}{convertAndFormatPrice(homepageData.info.price_from, currency)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Facilities Box */}
                  <div className="bg-cream/40 p-4 rounded-2xl border border-sand/20 space-y-2.5">
                    <h4 className="font-serif text-sm font-bold text-green-deep flex items-center space-x-2">
                      <Info className="w-4 h-4 text-green-soft" />
                      <span>{lang === 'ID' ? 'Fasilitas Homestay' : 'Homestay Amenities'}</span>
                    </h4>
                    <ul className="space-y-1">
                      {homepageData.info.facilities.map((fac, idx) => {
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

                        return (
                          <li key={idx} className="flex items-center space-x-2 font-sans text-xs text-text-mid font-light">
                            <span className="w-1 h-1 rounded-full bg-green-soft" />
                            <span>{getFacilityText(fac)}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Activities Box */}
                  <div className="bg-cream/40 p-4 rounded-2xl border border-sand/20 space-y-2.5">
                    <h4 className="font-serif text-sm font-bold text-green-deep flex items-center space-x-2">
                      <Compass className="w-4 h-4 text-green-soft" />
                      <span>{lang === 'ID' ? 'Aktivitas Menarik' : 'Exciting Activities'}</span>
                    </h4>
                    <ul className="space-y-1">
                      {homepageData.info.activities.map((act, idx) => {
                        const getActivityText = (text: string) => {
                          if (lang === 'ID') return text;
                          const a = text.toLowerCase();
                          if (a.includes('kopi') || a.includes('edukasi')) return "Coffee estate & traditional brewing tour";
                          if (a.includes('ijen') || a.includes('kawah')) return "Guided night hiking to Mount Ijen Crater";
                          if (a.includes('etawa') || a.includes('kambing')) return "Milking experience with local dairy goats";
                          if (a.includes('sungai') || a.includes('trekking')) return "Jungle trekking & natural river swimming";
                          if (a.includes('banyuwangi') || a.includes('wisata')) return "Custom local Banyuwangi nature excursions";
                          return text;
                        };

                        return (
                          <li key={idx} className="flex items-center space-x-2 font-sans text-xs text-text-mid font-light">
                            <span className="w-1 h-1 rounded-full bg-coffee" />
                            <span>{getActivityText(act)}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. CALENDAR AREA (Spacious 3-Column horizontal grid) */}
            <div className="space-y-6">
              
              {/* Legend Bar at the Top (Minimalist and clear) */}
              <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-sans text-gray-500 font-medium">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-4 bg-emerald-550 bg-emerald-500 border border-emerald-600 rounded" />
                    <span className="font-bold text-emerald-600">{lang === 'ID' ? 'TERSEDIA (HIJAU)' : 'AVAILABLE (GREEN)'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-4 bg-rose-500 border border-rose-600 rounded" />
                    <span className="font-bold text-rose-600">{lang === 'ID' ? 'BOOKED (MERAH)' : 'BOOKED (RED)'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-4 bg-green-deep rounded" />
                    <span className="font-semibold text-green-deep">{lang === 'ID' ? 'Pilihan Anda' : 'Your Selection'}</span>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-gray-400 uppercase tracking-wider select-none hidden md:block">
                  {lang === 'ID' ? 'Pilih tanggal menginap pada kalender' : 'Click check-in & check-out dates'}
                </div>
              </div>

              {/* Grid Calendar 3 Months Side-by-side */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Month 1 */}
                {renderSingleMonthBlock(viewYear, viewMonth, 0, "block")}
                
                {/* Month 2 */}
                {renderSingleMonthBlock(
                  getMonthYearOffset(viewYear, viewMonth, 1).year, 
                  getMonthYearOffset(viewYear, viewMonth, 1).month,
                  1,
                  "hidden md:flex"
                )}

                {/* Month 3 */}
                {renderSingleMonthBlock(
                  getMonthYearOffset(viewYear, viewMonth, 2).year, 
                  getMonthYearOffset(viewYear, viewMonth, 2).month,
                  2,
                  "hidden lg:flex"
                )}
              </div>

            </div>

            {/* 4. DETAILS & SUMMARY ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Pricing & Stay Summary Card */}
              <div className="lg:col-span-8">
                <div className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-100 pb-5">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-green-soft font-bold">Peno Homestay Rate</span>
                      <div className="flex items-baseline space-x-2">
                        <span className="font-serif text-3xl font-bold text-green-deep">{convertAndFormatPrice(pricePerNight, currency)}</span>
                        <span className="font-sans text-sm text-text-mid font-light">/ {lang === 'ID' ? 'malam' : 'night'}</span>
                      </div>
                    </div>

                    {/* Currency Selector */}
                    <div className="flex flex-col sm:items-end space-y-1.5">
                      <span className="text-[10px] font-sans font-bold text-gray-400 uppercase tracking-wider">{lang === 'ID' ? 'Pilih Mata Uang' : 'Choose Currency'}</span>
                      <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200">
                        {(['IDR', 'USD', 'EUR'] as CurrencyType[]).map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => onChangeCurrency(c)}
                            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                              currency === c
                                ? 'bg-green-deep text-cream shadow-xs'
                                : 'text-text-mid hover:text-green-deep hover:bg-green-deep/5'
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
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
              <div className="lg:col-span-4 space-y-6">
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

            {/* 4. BOOKING FORM (Appears only when range is selected) */}
            <AnimatePresence>
              {selectStart && selectEnd && (
                <motion.div
                  id="booking-form"
                  ref={formRef}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
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
                </motion.div>
              )}
            </AnimatePresence>



          </div>
        )}

      </div>

      {/* 5. CONFIRMATION MODAL */}
      <AnimatePresence>
        {isConfirmModalOpen && selectStart && selectEnd && (
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

    </div>
  );
};
