import React from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, CalendarRange, Bell, Check, Info, FileEdit } from 'lucide-react';
import { Booking, CMSHomepage } from '../../types';
import { convertAndFormatPrice } from '../../utils/storage';

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
  const confirmedCount = bookings.filter(b => b.status === 'paid').length;
  const totalRevenue = bookings
    .filter(b => b.status === 'paid')
    .reduce((sum, b) => sum + b.total_eur, 0);

  // Recent Bookings Log
  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4);

  return (
    <div id="admin-dashboard-view" className="space-y-8 animate-fade-in no-print">
      
      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Stat 1: Revenue */}
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
            <p className="font-sans text-[10px] text-gray-400 font-light">Estimasi terhitung lunas (PAID)</p>
          </div>
        </div>

        {/* Stat 2: Total Bookings */}
        <div className="bg-white p-6 rounded-2xl border border-gray-150/40 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider font-sans">Total Transaksi</span>
            <span className="p-1.5 bg-green-soft/10 text-green-deep rounded-lg">
              <LayoutDashboard className="w-4 h-4" />
            </span>
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-2xl text-green-deep">
              {totalBookingsCount} <span className="text-xs font-sans font-normal text-text-mid">Pemesanan</span>
            </h3>
            <p className="font-sans text-[10px] text-gray-400 font-light">Seluruh status di dalam sistem</p>
          </div>
        </div>

        {/* Stat 3: Confirmed */}
        <div className="bg-white p-6 rounded-2xl border border-gray-150/40 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider font-sans">Okupansi Kamar Lunas</span>
            <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <Check className="w-4 h-4" />
            </span>
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-2xl text-green-deep">
              {confirmedCount} <span className="text-xs font-sans font-normal text-text-mid">Kamar Terisi</span>
            </h3>
            <p className="font-sans text-[10px] text-gray-400 font-light">Booking aktif & lunas terverifikasi</p>
          </div>
        </div>

        {/* Stat 4: Pending Bookings */}
        <div className="bg-white p-6 rounded-2xl border border-gray-150/40 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider font-sans">Menunggu Pembayaran</span>
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <Info className="w-4 h-4" />
            </span>
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-2xl text-amber-700">
              {pendingCount} <span className="text-xs font-sans font-normal text-text-mid">Pending</span>
            </h3>
            <p className="font-sans text-[10px] text-gray-400 font-light">Menunggu transfer dari pelanggan</p>
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

                return (
                  <div 
                    key={b.id} 
                    onClick={() => setSelectedBookingDetail(b)}
                    className="flex items-center justify-between p-3.5 border border-gray-50 hover:border-green-soft/20 rounded-xl transition-all cursor-pointer bg-gray-50/20 hover:bg-white"
                  >
                    <div className="min-w-0 space-y-1">
                      <p className="font-serif font-bold text-sm text-green-deep truncate">{b.guest_name}</p>
                      <div className="flex items-center space-x-2 text-[10px] text-gray-400">
                        <span className="font-mono text-gray-300">ID: {b.id}</span>
                        <span>•</span>
                        <span className="truncate max-w-[120px]">{roomName}</span>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-xs font-serif font-extrabold text-green-soft">{convertAndFormatPrice(b.total_eur, 'IDR')}</p>
                      <span className={`inline-block px-2 py-0.5 rounded text-[9px] uppercase font-bold ${
                        b.status === 'paid' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : b.status === 'cancelled' 
                            ? 'bg-rose-100 text-rose-800' 
                            : 'bg-amber-100 text-amber-800'
                      }`}>
                        {b.status === 'paid' ? 'Paid' : b.status === 'cancelled' ? 'Cancelled' : 'Pending'}
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
