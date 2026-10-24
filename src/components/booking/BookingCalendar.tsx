import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LanguageType } from '../../utils/lang';

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

const SINGLE_DAYS = {
  ID: ["S", "S", "R", "K", "J", "S", "M"],
  EN: ["M", "T", "W", "T", "F", "S", "S"]
};

interface BookingCalendarProps {
  lang: LanguageType;
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
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  lang,
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
  unavailableDates
}) => {

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

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

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
        setSelectEnd(selectStart);
        setSelectStart(date);
      } else {
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

  const renderSingleMonthBlock = (year: number, month: number, index: number, displayClass = "") => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const startOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dayCells = [];

    for (let i = 0; i < startOffset; i++) {
      dayCells.push(<div key={`empty-${i}`} className="aspect-square w-full" />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const key = `${year}-${month + 1}-${d}`;
      const isPast = isPastDate(date);
      const isUnavailable = isPast || unavailableDates.has(key);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const isToday = date.getTime() === today.getTime();

      let cellClass = "bg-[#dcfce7] text-green-900 font-semibold border border-green-250 hover:bg-emerald-100 cursor-pointer";
      let tooltip = "";

      if (isPast) {
        cellClass = "bg-gray-100 text-gray-300 cursor-not-allowed opacity-40";
        tooltip = lang === 'ID' ? "Sudah lewat" : "Past date";
      } else if (isUnavailable) {
        if (isToday) {
          cellClass = "bg-indigo-600 text-white font-bold cursor-not-allowed relative border border-indigo-700 rounded-md shadow-xs ring-2 ring-indigo-300";
          tooltip = lang === 'ID' ? "OCCUPIED (Sedang Ditempati)" : "OCCUPIED (In Stay)";
        } else {
          cellClass = "bg-rose-500 text-white font-bold cursor-not-allowed relative border border-rose-600 rounded-md shadow-xs";
          tooltip = lang === 'ID' ? "BOOKED (Reservasi Mendatang)" : "BOOKED (Upcoming)";
        }
      } else {
        cellClass = "cursor-pointer hover:bg-emerald-600 hover:text-white bg-emerald-500 text-white font-bold border border-emerald-600 rounded-md shadow-xs active:scale-95 transition-all";
        tooltip = lang === 'ID' ? "TERSEDIA (Available)" : "AVAILABLE";
      }

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
          {(!isPast && isUnavailable) && <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-white opacity-90" />}
        </div>
      );
    }

    return (
      <div className={`bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col ${displayClass}`}>
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

  return (
    <div className="space-y-6">
      {/* Legend Bar at the Top */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-sans text-gray-500 font-medium">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-4 bg-emerald-500 border border-emerald-600 rounded" />
            <span className="font-bold text-emerald-600">{lang === 'ID' ? 'TERSEDIA (HIJAU)' : 'AVAILABLE (GREEN)'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-5 h-4 bg-indigo-600 border border-indigo-700 rounded shadow-xs" />
            <span className="font-bold text-indigo-700">{lang === 'ID' ? 'OCCUPIED (SEDANG DITEMPATI)' : 'OCCUPIED (IN STAY)'}</span>
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
        {renderSingleMonthBlock(viewYear, viewMonth, 0, "block")}
        
        {renderSingleMonthBlock(
          getMonthYearOffset(viewYear, viewMonth, 1).year, 
          getMonthYearOffset(viewYear, viewMonth, 1).month,
          1,
          "hidden md:flex"
        )}

        {renderSingleMonthBlock(
          getMonthYearOffset(viewYear, viewMonth, 2).year, 
          getMonthYearOffset(viewYear, viewMonth, 2).month,
          2,
          "hidden lg:flex"
        )}
      </div>
    </div>
  );
};
