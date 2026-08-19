import React, { useState, useMemo } from 'react';
import { Booking, AdminNotification, CMSHomepage } from '../types';
import { convertAndFormatPrice } from '../utils/storage';

interface UseAdminBookingsProps {
  bookings: Booking[];
  homepageData: CMSHomepage;
  notifications: AdminNotification[];
  onUpdateBookings: (b: Booking[]) => void;
  onUpdateNotifications: (n: AdminNotification[]) => void;
  showAdminToast: (message: string, type?: 'success' | 'danger' | 'info') => void;
  requestConfirmation: (config: any) => void;
}

export const useAdminBookings = ({
  bookings,
  homepageData,
  notifications,
  onUpdateBookings,
  onUpdateNotifications,
  showAdminToast,
  requestConfirmation
}: UseAdminBookingsProps) => {
  // Booking Filtering / Sorting states
  const [bookingSearch, setBookingSearch] = useState("");
  const [bookingStatusFilter, setBookingStatusFilter] = useState("all");
  const [bookingSort, setBookingSort] = useState("newest");
  const [selectedBookingDetail, setSelectedBookingDetail] = useState<Booking | null>(null);

  // Room code and Time filters states
  const [filterRoomCode, setFilterRoomCode] = useState("all");
  const [filterTimeRange, setFilterTimeRange] = useState("all");

  // State for Offline Book & Pay feature
  const [showAddOfflineModal, setShowAddOfflineModal] = useState(false);
  const [offlineGuestName, setOfflineGuestName] = useState("");
  const [offlineGuestEmail, setOfflineGuestEmail] = useState("");
  const [offlineGuestWa, setOfflineGuestWa] = useState("");
  const [offlineCheckIn, setOfflineCheckIn] = useState("");
  const [offlineCheckOut, setOfflineCheckOut] = useState("");
  const [offlineGuestCount, setOfflineGuestCount] = useState(1);
  const [offlinePriceIdr, setOfflinePriceIdr] = useState(350000);
  const [offlineNotes, setOfflineNotes] = useState("");
  const [offlineSelectedVillaId, setOfflineSelectedVillaId] = useState("");

  const calculateNights = (inStr: string, outStr: string): number => {
    if (!inStr || !outStr) return 1;
    const d1 = new Date(inStr);
    const d2 = new Date(outStr);
    const diffTime = d2.getTime() - d1.getTime();
    if (diffTime <= 0) return 1;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleUpdateBookingStatus = (bookingId: string, newStatus: 'pending' | 'paid' | 'cancelled') => {
    const updated = bookings.map(b => {
      if (b.id === bookingId) {
        const notif: AdminNotification = {
          id: Date.now(),
          read: false,
          type: newStatus === 'paid' ? 'booking_confirmed' as const : newStatus === 'cancelled' ? 'booking_cancelled' : 'new_booking',
          booking: { ...b, status: newStatus },
          time: new Date().toISOString()
        };
        onUpdateNotifications([notif, ...notifications]);
        return { ...b, status: newStatus };
      }
      return b;
    });
    onUpdateBookings(updated);

    if (newStatus === 'paid') {
      showAdminToast(`Pemesanan ${bookingId} telah di-stel ke PAID! Kamar sekarang otomatis terisi di kalender ketersediaan.`, 'success');
    } else if (newStatus === 'cancelled') {
      showAdminToast(`Pemesanan ${bookingId} telah dibatalkan (CANCELLED)!`, 'danger');
    } else {
      showAdminToast(`Pemesanan ${bookingId} di-stel kembali ke PENDING!`, 'info');
    }

    if (selectedBookingDetail?.id === bookingId) {
      setSelectedBookingDetail(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleDeleteBooking = (bookingId: string) => {
    requestConfirmation({
      title: "Hapus Pemesanan Secara Permanen",
      message: `Apakah Anda yakin ingin menghapus pemesanan ${bookingId} secara permanen dari basis data? Tindakan ini tidak dapat dibatalkan.`,
      isDanger: true,
      confirmText: "Ya, Hapus",
      cancelText: "Batal",
      onConfirm: () => {
        const updated = bookings.filter(b => b.id !== bookingId);
        onUpdateBookings(updated);
        showAdminToast(`Pemesanan ${bookingId} telah dihapus!`, 'danger');
        setSelectedBookingDetail(null);
      }
    });
  };

  const handleSaveOfflineBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offlineGuestName || !offlineCheckIn || !offlineCheckOut || !offlineGuestWa) {
      showAdminToast("Mohon lengkapi data Nama, Check-In, Check-Out, dan No WhatsApp!", "danger");
      return;
    }

    const start = new Date(offlineCheckIn);
    const end = new Date(offlineCheckOut);
    if (end <= start) {
      showAdminToast("Tanggal Check-Out harus setelah tanggal Check-In!", "danger");
      return;
    }

    const selectedVillaIdForOffline = offlineSelectedVillaId || (homepageData.villas?.[0]?.id || "");
    const hasOverlap = bookings.some(b => {
      if (b.status !== 'paid') return false;
      const bVillaId = b.villa_id || (homepageData.villas?.[0]?.id || "");
      if (bVillaId !== selectedVillaIdForOffline) return false;
      const bStart = new Date(b.check_in);
      const bEnd = new Date(b.check_out);
      bStart.setHours(0,0,0,0);
      bEnd.setHours(0,0,0,0);
      return (start < bEnd && end > bStart);
    });

    if (hasOverlap) {
      showAdminToast("Tanggal tersebut sudah terisi oleh pemesanan lain di Villa/Kamar ini!", "danger");
      return;
    }

    const nightsCount = calculateNights(offlineCheckIn, offlineCheckOut);
    const totalEurAmount = Number((offlinePriceIdr / 17500).toFixed(4));

    const newBooking: Booking = {
      id: "OFF-" + Date.now().toString().slice(-6),
      created_at: new Date().toISOString(),
      status: 'paid',
      check_in: offlineCheckIn,
      check_out: offlineCheckOut,
      nights: nightsCount,
      total_eur: totalEurAmount,
      guest_name: offlineGuestName,
      guest_email: offlineGuestEmail || "offline@penohomestay.com",
      guest_wa: offlineGuestWa,
      guest_count: offlineGuestCount,
      notes: offlineNotes || "Offline Booking",
      villa_id: selectedVillaIdForOffline
    };

    onUpdateBookings([newBooking, ...bookings]);

    const notif: AdminNotification = {
      id: Date.now(),
      read: false,
      type: 'booking_confirmed',
      booking: newBooking,
      time: new Date().toISOString()
    };
    onUpdateNotifications([notif, ...notifications]);

    showAdminToast("Pemesanan Offline Berhasil Disimpan & Sinkron ke Kalender & Keuangan!", "success");

    setShowAddOfflineModal(false);
    setOfflineGuestName("");
    setOfflineGuestEmail("");
    setOfflineGuestWa("");
    setOfflineCheckIn("");
    setOfflineCheckOut("");
    setOfflineGuestCount(1);
    setOfflinePriceIdr(350000);
    setOfflineNotes("");
  };

  const processedBookings = useMemo(() => {
    let result = [...bookings];

    if (bookingSearch.trim()) {
      const q = bookingSearch.toLowerCase();
      result = result.filter(b =>
        b.guest_name.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q)
      );
    }

    if (bookingStatusFilter !== 'all') {
      result = result.filter(b => b.status === bookingStatusFilter);
    }

    if (filterRoomCode !== 'all') {
      const villas = homepageData.villas || [];
      result = result.filter(b => {
        const v = villas.find((vl: any) => vl.id === b.villa_id);
        const rCodeFromVilla = v ? (v.room_code || "") : "";
        const rCodeFromBooking = (b as any).ROOM || "";
        return rCodeFromVilla === filterRoomCode || rCodeFromBooking === filterRoomCode;
      });
    }

    if (filterTimeRange !== 'all') {
      if (filterTimeRange === 'week') {
        const today = new Date();
        today.setHours(0,0,0,0);
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
        const startOfWeek = new Date(today);
        startOfWeek.setDate(diff);
        startOfWeek.setHours(0,0,0,0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23,59,59,999);

        result = result.filter(b => {
          const checkInDate = new Date(b.check_in);
          return checkInDate >= startOfWeek && checkInDate <= endOfWeek;
        });
      } else if (filterTimeRange.startsWith('month:')) {
        const targetMonth = parseInt(filterTimeRange.split(':')[1], 10);
        result = result.filter(b => {
          const checkInDate = new Date(b.check_in);
          return checkInDate.getMonth() === targetMonth;
        });
      }
    }

    result.sort((a, b) => {
      if (bookingSort === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (bookingSort === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (bookingSort === 'checkin') {
        return new Date(a.check_in).getTime() - new Date(b.check_in).getTime();
      }
      return 0;
    });

    return result;
  }, [bookings, bookingSearch, bookingStatusFilter, bookingSort, filterRoomCode, filterTimeRange, homepageData]);

  return {
    bookingSearch,
    setBookingSearch,
    bookingStatusFilter,
    setBookingStatusFilter,
    bookingSort,
    setBookingSort,
    selectedBookingDetail,
    setSelectedBookingDetail,
    filterRoomCode,
    setFilterRoomCode,
    filterTimeRange,
    setFilterTimeRange,
    showAddOfflineModal,
    setShowAddOfflineModal,
    offlineGuestName,
    setOfflineGuestName,
    offlineGuestEmail,
    setOfflineGuestEmail,
    offlineGuestWa,
    setOfflineGuestWa,
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
    offlineSelectedVillaId,
    setOfflineSelectedVillaId,
    calculateNights,
    handleUpdateBookingStatus,
    handleDeleteBooking,
    handleSaveOfflineBooking,
    processedBookings
  };
};
