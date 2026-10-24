import { Booking } from '../types';

/**
 * Checks if a given date falls within the stay window of check-in and check-out dates.
 * Window: date >= checkIn && date < checkOut (or departure date check)
 */
export function isDateWithinStay(date: Date, checkInStr: string, checkOutStr: string): boolean {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const start = new Date(checkInStr);
  start.setHours(0, 0, 0, 0);
  const end = new Date(checkOutStr);
  end.setHours(0, 0, 0, 0);
  return d >= start && d < end;
}

/**
 * Evaluates if a booking is actively in progress right now (occupied).
 * A room is considered OCCUPIED when:
 * 1. Booking status is explicitly 'occupied', OR
 * 2. Booking status is 'paid' (confirmed) and today's date falls within [check_in, check_out)
 */
export function isBookingCurrentlyOccupied(booking: Booking): boolean {
  if (booking.status === 'cancelled') return false;
  if (booking.status === 'occupied') return true;
  if (booking.status === 'paid') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(booking.check_in);
    start.setHours(0, 0, 0, 0);
    const end = new Date(booking.check_out);
    end.setHours(0, 0, 0, 0);
    return today >= start && today < end;
  }
  return false;
}

/**
 * Evaluates the effective operational status of a booking.
 * Returns 'occupied' if currently staying, 'paid' if future/completed, 'pending', or 'cancelled'.
 */
export function getEffectiveBookingStatus(booking: Booking): 'pending' | 'paid' | 'occupied' | 'cancelled' {
  if (booking.status === 'cancelled') return 'cancelled';
  if (booking.status === 'pending') return 'pending';
  if (booking.status === 'occupied') return 'occupied';
  if (isBookingCurrentlyOccupied(booking)) {
    return 'occupied';
  }
  return 'paid';
}

export interface RoomOccupancyInfo {
  isOccupied: boolean;
  isBookedFuture: boolean;
  currentBooking?: Booking;
  statusLabel: 'OCCUPIED' | 'BOOKED' | 'AVAILABLE';
  displayBadge: {
    textId: string;
    textEn: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
    dotClass: string;
  };
}

/**
 * Evaluates current real-time occupancy status of a room / villa.
 * - If guest is currently staying today: OCCUPIED (Sedang Ditempati)
 * - If there are upcoming confirmed bookings: BOOKED (Reservasi Mendatang)
 * - If no active stays: AVAILABLE (Tersedia)
 */
export function getRoomCurrentOccupancy(
  villaId: string,
  bookings: Booking[],
  blockedDates?: string[]
): RoomOccupancyInfo {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1. Check if occupied today
  const activeBooking = bookings.find(b => {
    if (b.status === 'cancelled') return false;
    const bVillaId = b.villa_id || "";
    if (villaId && bVillaId && bVillaId !== villaId) return false;

    if (b.status === 'occupied') return true;
    if (b.status === 'paid') {
      const start = new Date(b.check_in);
      start.setHours(0, 0, 0, 0);
      const end = new Date(b.check_out);
      end.setHours(0, 0, 0, 0);
      return today >= start && today < end;
    }
    return false;
  });

  if (activeBooking) {
    return {
      isOccupied: true,
      isBookedFuture: false,
      currentBooking: activeBooking,
      statusLabel: 'OCCUPIED',
      displayBadge: {
        textId: 'OCCUPIED (Sedang Ditempati)',
        textEn: 'OCCUPIED (Currently In Stay)',
        bgClass: 'bg-indigo-600',
        textClass: 'text-white',
        borderClass: 'border-indigo-700',
        dotClass: 'bg-white'
      }
    };
  }

  // 2. Check if booked for future
  const futureBooking = bookings.find(b => {
    if (b.status === 'cancelled') return false;
    const bVillaId = b.villa_id || "";
    if (villaId && bVillaId && bVillaId !== villaId) return false;

    if (b.status === 'paid' || b.status === 'pending') {
      const start = new Date(b.check_in);
      start.setHours(0, 0, 0, 0);
      return start > today;
    }
    return false;
  });

  if (futureBooking) {
    return {
      isOccupied: false,
      isBookedFuture: true,
      currentBooking: futureBooking,
      statusLabel: 'BOOKED',
      displayBadge: {
        textId: 'BOOKED (Ada Reservasi)',
        textEn: 'BOOKED (Upcoming)',
        bgClass: 'bg-rose-500',
        textClass: 'text-white',
        borderClass: 'border-rose-600',
        dotClass: 'bg-white'
      }
    };
  }

  return {
    isOccupied: false,
    isBookedFuture: false,
    statusLabel: 'AVAILABLE',
    displayBadge: {
      textId: 'TERSEDIA (AVAILABLE)',
      textEn: 'AVAILABLE',
      bgClass: 'bg-emerald-500',
      textClass: 'text-white',
      borderClass: 'border-emerald-600',
      dotClass: 'bg-white'
    }
  };
}
