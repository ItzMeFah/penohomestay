import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Booking, CMSHomepage } from '../../types';

interface AdminCalendarProps {
  calYear: number;
  setCalYear: React.Dispatch<React.SetStateAction<number>>;
  calMonth: number;
  setCalMonth: React.Dispatch<React.SetStateAction<number>>;
  selectedCalendarVillaId: string;
  setSelectedCalendarVillaId: (val: string) => void;
  MONTHS_ID: string[];
  DAYS_ID: string[];
  bookings: Booking[];
  blockedDates: string[];
  onUpdateBlockedDates: (dates: string[]) => void;
  setSelectedBookingDetail: (b: Booking) => void;
  showAdminToast: (message: string, type?: 'success' | 'danger' | 'info') => void;
  homepageData: CMSHomepage;
}

export const AdminCalendar: React.FC<AdminCalendarProps> = ({
  calYear,
  setCalYear,
  calMonth,
  setCalMonth,
  selectedCalendarVillaId,
  setSelectedCalendarVillaId,
  MONTHS_ID,
  DAYS_ID,
  bookings,
  blockedDates,
  onUpdateBlockedDates,
  setSelectedBookingDetail,
  showAdminToast,
  homepageData
}) => {
  const villasList = homepageData.villas || [];
  const currentCalendarVillaId = selectedCalendarVillaId || (villasList[0]?.id || "");

  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayIndex = new Date(calYear, calMonth, 1).getDay();
  const startOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  const dayCells = [];

  // Padding cells for starting offset spacing
  for (let i = 0; i < startOffset; i++) {
    dayCells.push(<div key={`empty-${i}`} className="aspect-square w-full bg-gray-50/20 border border-gray-100/40 rounded-lg" />);
  }

  // Monthly active days
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(calYear, calMonth, d);
    const key = `${calYear}-${calMonth + 1}-${d}`;
    
    const paidBooking = bookings.find(b => {
      if (b.status !== 'paid') return false;
      const bVillaId = b.villa_id || (villasList[0]?.id || "");
      if (bVillaId !== currentCalendarVillaId) return false;
      let start = new Date(b.check_in);
      let end = new Date(b.check_out);
      start.setHours(0,0,0,0);
      end.setHours(0,0,0,0);
      return date >= start && date < end;
    });

    const today = new Date();
    today.setHours(0,0,0,0);
    
    const pendingBooking = bookings.find(b => {
      if (b.status !== 'pending') return false;
      const bVillaId = b.villa_id || (villasList[0]?.id || "");
      if (bVillaId !== currentCalendarVillaId) return false;
      let start = new Date(b.check_in);
      let end = new Date(b.check_out);
      start.setHours(0,0,0,0);
      end.setHours(0,0,0,0);
      if (start < today) return false;
      return date >= start && date < end;
    });

    const activeBooking = paidBooking || pendingBooking;
    const isBlocked = blockedDates.includes(key) || blockedDates.includes(`${currentCalendarVillaId}:${key}`);

    let statusType: 'available' | 'paid' | 'pending' | 'blocked' = 'available';
    let label = "";

    if (activeBooking) {
      if (activeBooking.status === 'paid') {
        statusType = 'paid';
      } else {
        statusType = 'pending';
      }
      label = activeBooking.guest_name;
    } else if (isBlocked) {
      statusType = 'blocked';
      label = "BLOCKED";
    } else {
      statusType = 'available';
      label = "KOSONG";
    }

    dayCells.push(
      <div
        key={d}
        id={`calendar-cell-${d}`}
        onClick={() => {
          if (activeBooking) {
            setSelectedBookingDetail(activeBooking);
          } else {
            if (isBlocked) {
              const updated = blockedDates.filter(k => k !== key && k !== `${currentCalendarVillaId}:${key}`);
              onUpdateBlockedDates(updated);
              showAdminToast(`Tanggal ${d} ${MONTHS_ID[calMonth]} ${calYear} diatur kembali sebagai TERSEDIA!`, "success");
            } else {
              const updated = [...blockedDates, `${currentCalendarVillaId}:${key}`];
              onUpdateBlockedDates(updated);
              showAdminToast(`Tanggal ${d} ${MONTHS_ID[calMonth]} ${calYear} diatur sebagai BOOKED!`, "success");
            }
          }
        }}
        className={`aspect-square w-full p-1.5 flex flex-col items-center justify-center transition-all duration-200 relative group rounded-xl border ${
          statusType === 'paid'
            ? 'bg-rose-50/70 border-rose-200 text-rose-900 hover:bg-rose-100/70'
            : statusType === 'pending'
              ? 'bg-amber-50/70 border-amber-200 text-amber-950 hover:bg-amber-100/70'
              : statusType === 'blocked'
                ? 'bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-200/50'
                : 'bg-emerald-50/30 border-emerald-100 text-emerald-900 hover:bg-emerald-50/90'
        } cursor-pointer hover:scale-105 active:scale-95 shadow-xs`}
      >
        <span className={`text-xs sm:text-sm font-extrabold ${
          statusType === 'paid' ? 'text-rose-700' :
          statusType === 'pending' ? 'text-amber-700' :
          statusType === 'blocked' ? 'text-gray-500' : 'text-emerald-800'
        }`}>
          {d}
        </span>
        
        <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
          statusType === 'paid' ? 'bg-rose-500 shadow-rose-200 shadow' :
          statusType === 'pending' ? 'bg-amber-500 shadow-amber-200 shadow' :
          statusType === 'blocked' ? 'bg-gray-400' : 'bg-emerald-500 shadow-emerald-200 shadow'
        }`} />

        {/* Elegant Hover Tooltip */}
        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center pointer-events-none z-50">
          <div className="bg-gray-900/95 text-white text-[9px] font-sans font-medium px-2 py-1 rounded-md shadow-lg whitespace-nowrap leading-tight text-center">
            {statusType === 'paid' && `Lunas: ${label}`}
            {statusType === 'pending' && `Menunggu: ${label}`}
            {statusType === 'blocked' && "Ditutup Admin"}
            {statusType === 'available' && "Tersedia (Kosong)"}
          </div>
          <div className="w-1.5 h-1.5 bg-gray-900/95 rotate-45 -mt-1" />
        </div>
      </div>
    );
  }

  return (
    <div id="admin-calendar-view" className="space-y-6 max-w-4xl mx-auto">
      {/* Villa / Room Filter Tabs */}
      <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm no-print space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif font-bold text-base text-green-deep">Integrasi Kalender Okupansi Kamar</h3>
            <p className="text-xs text-gray-400">Pilih salah satu dari 3 tipe kamar untuk melihat kalender ketersediaan & jadwal booked</p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {villasList.length} Tipe Kamar
            </span>
          </div>
        </div>

        {/* Room Tab Pills */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-gray-100">
          {villasList.map((v: any) => {
            const isSelected = currentCalendarVillaId === v.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedCalendarVillaId(v.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-green-deep text-cream shadow-sm scale-102 ring-2 ring-green-soft/30'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-green-deep border border-gray-150'
                }`}
              >
                <span>{v.title}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${isSelected ? 'bg-amber-500 text-cream' : 'bg-gray-200 text-gray-700'}`}>
                  {v.capacity} Pax
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Month Calendar Card */}
      <div className="bg-white rounded-3xl border border-gray-150/40 p-5 md:p-6 shadow-sm space-y-4">
        {/* Header Navigation */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="space-y-0.5">
            <h3 className="font-serif font-bold text-lg text-green-deep">
              {MONTHS_ID[calMonth]} {calYear}
            </h3>
            <p className="text-xs text-gray-400 font-sans">
              Klik tanggal untuk atur status <strong className="text-rose-600">BOOKED / DIBLOKIR</strong> atau <strong className="text-emerald-600 font-semibold">TERSEDIA</strong>
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              id="calendar-prev-month-btn"
              onClick={() => {
                setCalMonth(prev => {
                  if (prev === 0) {
                    setCalYear(y => y - 1);
                    return 11;
                  }
                  return prev - 1;
                });
              }}
              className="p-2 bg-gray-50 hover:bg-gray-100 text-green-deep rounded-xl border border-gray-200 hover:border-green-soft/30 transition-all cursor-pointer flex items-center justify-center shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              id="calendar-current-month-btn"
              onClick={() => {
                const today = new Date();
                setCalMonth(today.getMonth());
                setCalYear(today.getFullYear());
              }}
              className="px-3 py-1.5 bg-green-deep/10 hover:bg-green-deep/15 text-green-deep font-sans font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Bulan Ini
            </button>
            <button
              id="calendar-next-month-btn"
              onClick={() => {
                setCalMonth(prev => {
                  if (prev === 11) {
                    setCalYear(y => y + 1);
                    return 0;
                  }
                  return prev + 1;
                });
              }}
              className="p-2 bg-gray-50 hover:bg-gray-100 text-green-deep rounded-xl border border-gray-200 hover:border-green-soft/30 transition-all cursor-pointer flex items-center justify-center shadow-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Legend Indicator */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-sans text-gray-500 font-medium bg-gray-50/70 p-3 rounded-2xl border border-gray-100">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="font-semibold text-emerald-800">Tersedia (Kosong)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="font-semibold text-rose-800">Terisi (Lunas)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="font-semibold text-amber-800">Menunggu Pembayaran</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-gray-400" />
            <span className="font-semibold text-gray-600">Diblokir Admin</span>
          </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 pt-2">
          {DAYS_ID.map(day => <div key={day} className="py-0.5">{day}</div>)}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {dayCells}
        </div>
      </div>
    </div>
  );
};
