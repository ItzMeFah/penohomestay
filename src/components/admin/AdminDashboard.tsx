import React from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, CalendarRange, Bell, Check, Info, FileEdit, Users, Clock } from 'lucide-react';
import { Booking, CMSHomepage } from '../../types';
import { convertAndFormatPrice } from '../../utils/storage';
import { isBookingCurrentlyOccupied, getEffectiveBookingStatus } from '../../utils/bookingStatus';

interface AdminDashboardProps {
  bookings: Booking[];
  homepageData: CMSHomepage;
  setActiveTab: (tab: any) => void;
  setSelectedBookingDetail: (b: Booking) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  bookings,
  homepageData,
  setActiveTab,
  setSelectedBookingDetail
}) => {
  const totalBookingsCount = bookings.length;
  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  
  // Real-time calculation: Kamar sedang ditempati (OCCUPIED)
  const occupiedCount = bookings.filter(b => isBookingCurrentlyOccupied(b)).length;

  // Reservasi mendatang (BOOKED)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const futureBookedCount = bookings.filter(b => {
    if (b.status === 'paid' && !isBookingCurrentlyOccupied(b)) {
      const start = new Date(b.check_in);
      start.setHours(0, 0, 0, 0);
      return start > today;
    }
    return false;
  }).length;

  const totalRevenue = bookings
    .filter(b => b.status === 'paid' || b.status === 'occupied')
    .reduce((sum, b) => sum + b.total_eur, 0);

  // Recent Bookings Log
  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4);

  return (
    <div id="admin-dashboard-view" className="space-y-8 animate-fade-in no-print">
      
      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Stat 1: Kamar Sedang Ditempati (OCCUPIED) */}
        <div className="bg-white p-6 rounded-2xl border-2 border-indigo-200/80 shadow-sm flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-indigo-700 tracking-wider font-sans flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              <span>Sedang Ditempati (OCCUPIED)</span>
            </span>
            <span className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-3xl text-indigo-900">
              {occupiedCount} <span className="text-xs font-sans font-normal text-indigo-700">Kamar Aktif</span>
            </h3>
            <p className="font-sans text-[10px] text-gray-500 font-light">Tamu sedang menginap di homestay hari ini</p>
          </div>
        </div>

        {/* Stat 2: Reservasi Mendatang (BOOKED) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-150/40 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-rose-600 tracking-wider font-sans">Reservasi Terjadwal (BOOKED)</span>
            <span className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
              <CalendarRange className="w-4 h-4" />
            </span>
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-3xl text-rose-800">
              {futureBookedCount} <span className="text-xs font-sans font-normal text-text-mid">Jadwal</span>
            </h3>
            <p className="font-sans text-[10px] text-gray-400 font-light">Kamar terpesan untuk tanggal mendatang</p>
          </div>
        </div>

        {/* Stat 3: Total Keuangan Lunas */}
        <div className="bg-white p-6 rounded-2xl border border-gray-150/40 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider font-sans">Total Keuangan Lunas</span>
            <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <Check className="w-4 h-4" />
            </span>
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-xl text-green-deep truncate">
              {convertAndFormatPrice(totalRevenue, 'IDR')}
            </h3>
            <p className="font-sans text-[10px] text-gray-400 font-light">Akumulasi pendapatan transaksi lunas</p>
          </div>
        </div>

        {/* Stat 4: Pending Bookings */}
        <div className="bg-white p-6 rounded-2xl border border-gray-150/40 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider font-sans">Menunggu Pembayaran</span>
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-3xl text-amber-700">
              {pendingCount} <span className="text-xs font-sans font-normal text-text-mid">Pending</span>
            </h3>
            <p className="font-sans text-[10px] text-gray-400 font-light">Menunggu verifikasi / transfer tamu</p>
          </div>
        </div>

      </div>

      {/* Main Panel grid: Recent bookings & Quick controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent logs */}
        <div className="bg-white p-6 rounded-3xl border border-gray-150/40 shadow-sm lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between border-b border-gray-50 pb-3">
            <h3 className="font-serif font-bold text-base text-green-deep">Pemesanan Terbaru Masuk</h3>
            <button 
              onClick={() => setActiveTab('bookings')}
              className="text-[10px] font-bold text-green-soft hover:text-green-deep uppercase tracking-wider"
            >
              Lihat Semua
            </button>
          </div>

          <div className="space-y-3.5">
            {recentBookings.length === 0 ? (
              <p className="text-center text-xs text-gray-400 py-6">Belum ada pemesanan terdaftar.</p>
            ) : (
              recentBookings.map((b) => {
                const matchingVilla = (homepageData.villas || []).find((v: any) => v.id === b.villa_id) || homepageData.villas?.[0];
                const roomName = matchingVilla ? matchingVilla.title : "Kamar Utama";
                const isOccupied = isBookingCurrentlyOccupied(b);

                return (
                  <div 
                    key={b.id} 
                    onClick={() => setSelectedBookingDetail(b)}
                    className={`flex items-center justify-between p-3.5 border rounded-xl transition-all cursor-pointer ${
                      isOccupied 
                        ? 'bg-indigo-50/40 border-indigo-200 hover:bg-indigo-50/70' 
                        : 'border-gray-50 hover:border-green-soft/20 bg-gray-50/20 hover:bg-white'
                    }`}
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-serif font-bold text-sm text-green-deep truncate">{b.guest_name}</p>
                        {isOccupied && (
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-indigo-600 text-white animate-pulse">
                            Sedang Ditempati
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-[10px] text-gray-400">
                        <span className="font-mono text-gray-400">ID: {b.id}</span>
                        <span>•</span>
                        <span className="truncate max-w-[120px] font-medium text-text-dark">{roomName}</span>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-xs font-serif font-extrabold text-green-soft">{convertAndFormatPrice(b.total_eur, 'IDR')}</p>
                      <span className={`inline-block px-2 py-0.5 rounded text-[9px] uppercase font-bold ${
                        isOccupied
                          ? 'bg-indigo-600 text-white'
                          : b.status === 'paid' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : b.status === 'cancelled' 
                              ? 'bg-rose-100 text-rose-800' 
                              : 'bg-amber-100 text-amber-800'
                      }`}>
                        {isOccupied ? 'Occupied' : b.status === 'paid' ? 'Booked (Paid)' : b.status === 'cancelled' ? 'Cancelled' : 'Pending'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Quick controls */}
        <div className="bg-white p-6 rounded-3xl border border-gray-150/40 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-2">
            <h3 className="font-serif font-bold text-base text-green-deep">Navigasi Cepat</h3>
            <p className="font-sans text-xs text-gray-400 font-light leading-relaxed">Gunakan tombol akses cepat di bawah ini untuk memperbarui bagian Landing Page beranda Anda secara efisien.</p>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <button 
              onClick={() => setActiveTab('cms')}
              className="p-4 bg-gray-50 border hover:border-green-soft hover:bg-white rounded-2xl flex flex-col items-center justify-center space-y-2 text-center transition-all cursor-pointer"
            >
              <FileEdit className="w-5 h-5 text-green-soft" />
              <span className="text-[10px] font-bold text-green-deep">Edit Beranda</span>
            </button>

            <button 
              onClick={() => setActiveTab('calendar')}
              className="p-4 bg-gray-50 border hover:border-green-soft hover:bg-white rounded-2xl flex flex-col items-center justify-center space-y-2 text-center transition-all cursor-pointer"
            >
              <CalendarRange className="w-5 h-5 text-green-soft" />
              <span className="text-[10px] font-bold text-green-deep">Lihat Kalender</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
