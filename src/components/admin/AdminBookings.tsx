import React from 'react';
import { Search, Plus, Download, Printer, Eye, Trash2 } from 'lucide-react';
import { Booking, CMSHomepage } from '../../types';
import { convertAndFormatPrice } from '../../utils/storage';
import { isBookingCurrentlyOccupied } from '../../utils/bookingStatus';

interface AdminBookingsProps {
  processedBookings: Booking[];
  bookingSearch: string;
  setBookingSearch: (val: string) => void;
  bookingStatusFilter: string;
  setBookingStatusFilter: (val: string) => void;
  filterRoomCode: string;
  setFilterRoomCode: (val: string) => void;
  filterTimeRange: string;
  setFilterTimeRange: (val: string) => void;
  bookingSort: string;
  setBookingSort: (val: string) => void;
  homepageData: CMSHomepage;
  settings: any;
  setShowAddOfflineModal: (show: boolean) => void;
  setOfflineCheckIn: (val: string) => void;
  setOfflineCheckOut: (val: string) => void;
  handleExportCSV: () => void;
  handlePrintReport: () => void;
  handleUpdateBookingStatus: (id: string, status: any) => void;
  setSelectedBookingDetail: (b: Booking) => void;
  handleDeleteBooking: (id: string) => void;
}

export const AdminBookings: React.FC<AdminBookingsProps> = ({
  processedBookings,
  bookingSearch,
  setBookingSearch,
  bookingStatusFilter,
  setBookingStatusFilter,
  filterRoomCode,
  setFilterRoomCode,
  filterTimeRange,
  setFilterTimeRange,
  bookingSort,
  setBookingSort,
  homepageData,
  settings,
  setShowAddOfflineModal,
  setOfflineCheckIn,
  setOfflineCheckOut,
  handleExportCSV,
  handlePrintReport,
  handleUpdateBookingStatus,
  setSelectedBookingDetail,
  handleDeleteBooking
}) => {
  return (
    <div id="admin-bookings-tab" className="space-y-6">
      {/* Toolbar search & sort */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm no-print">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="bookings-search"
            type="text"
            placeholder="Cari nama tamu atau ID..."
            value={bookingSearch}
            onChange={(e) => setBookingSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-green-soft rounded-xl text-sm outline-none font-sans"
          />
        </div>

        <div className="flex flex-wrap gap-3 items-center w-full md:w-auto justify-end">
          <select
            id="bookings-filter-status"
            value={bookingStatusFilter}
            onChange={(e) => setBookingStatusFilter(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 focus:border-green-soft rounded-xl text-sm outline-none font-sans"
          >
            <option value="all">Semua Status</option>
            <option value="occupied">Sedang Ditempati (OCCUPIED)</option>
            <option value="paid">Lunas / Terpesan (Booked)</option>
            <option value="pending">Menunggu (Pending)</option>
            <option value="cancelled">Dibatalkan</option>
          </select>

          {/* Filter Room Code */}
          <select
            id="bookings-filter-room"
            value={filterRoomCode}
            onChange={(e) => setFilterRoomCode(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 focus:border-green-soft rounded-xl text-sm outline-none font-sans"
          >
            <option value="all">Semua Kamar (All Room)</option>
            <option value="1">Kamar 1</option>
            <option value="2">Kamar 2</option>
            <option value="3">Kamar 3</option>
            {Array.from(new Set(
              (homepageData.villas || [])
                .map((v: any) => v.room_code)
                .filter((code: string | undefined): code is string => !!code && code !== "1" && code !== "2" && code !== "3")
            )).map(code => (
              <option key={code} value={code}>Kamar {code}</option>
            ))}
          </select>

          {/* Filter Waktu */}
          <select
            id="bookings-filter-time"
            value={filterTimeRange}
            onChange={(e) => setFilterTimeRange(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 focus:border-green-soft rounded-xl text-sm outline-none font-sans"
          >
            <option value="all">Semua Waktu (All Time)</option>
            <option value="week">Minggu Ini (Week)</option>
            <option value="month:0">Januari</option>
            <option value="month:1">Februari</option>
            <option value="month:2">Maret</option>
            <option value="month:3">April</option>
            <option value="month:4">Mei</option>
            <option value="month:5">Juni</option>
            <option value="month:6">Juli</option>
            <option value="month:7">Agustus</option>
            <option value="month:8">September</option>
            <option value="month:9">Oktober</option>
            <option value="month:10">November</option>
            <option value="month:11">Desember</option>
          </select>

          <select
            id="bookings-sort"
            value={bookingSort}
            onChange={(e) => setBookingSort(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 focus:border-green-soft rounded-xl text-sm outline-none font-sans"
          >
            <option value="newest">Terbaru Dipesan</option>
            <option value="oldest">Terlama Dipesan</option>
            <option value="checkin">Check-In Terdekat</option>
          </select>

          <button
            id="bookings-add-offline-btn"
            onClick={() => {
              const today = new Date();
              const tomorrow = new Date(today);
              tomorrow.setDate(today.getDate() + 1);
              setOfflineCheckIn(today.toISOString().split('T')[0]);
              setOfflineCheckOut(tomorrow.toISOString().split('T')[0]);
              setShowAddOfflineModal(true);
            }}
            className="flex items-center space-x-1.5 px-4 py-2.5 bg-green-deep hover:bg-green-mid text-cream font-semibold rounded-xl text-xs shadow-sm hover:shadow transition-all cursor-pointer hover:-translate-y-0.5 active:scale-95"
            title="Booking Offline"
          >
            <Plus className="w-4 h-4" />
            <span>Booking Offline</span>
          </button>

          <button
            id="bookings-export-csv-btn"
            onClick={handleExportCSV}
            className="p-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-sm hover:shadow transition-shadow flex items-center justify-center cursor-pointer"
            title="Export CSV Excel"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            id="bookings-print-btn"
            onClick={handlePrintReport}
            className="p-2.5 bg-gray-500 hover:bg-gray-600 text-white rounded-xl shadow-sm hover:shadow transition-shadow flex items-center justify-center cursor-pointer"
            title="Cetak Laporan Rapi"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* TABLE LIST PRINT HEADER */}
      <div className="print-header hidden">
        <h2>{settings.homestayName} - Laporan Pemesanan Tamu</h2>
        <p>Dicetak pada: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
      </div>

      {/* Core Bookings Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                <th className="p-4">No</th>
                <th className="p-4">ID Pemesanan</th>
                <th className="p-4">Nama Tamu</th>
                <th className="p-4">Kamar</th>
                <th className="p-4">Check-In</th>
                <th className="p-4">Check-Out</th>
                <th className="p-4 text-center">Malam</th>
                <th className="p-4 text-center">Tamu</th>
                <th className="p-4">Total Tarif</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right no-print">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {processedBookings.map((b, idx) => {
                const matchingVilla = (homepageData.villas || []).find((v: any) => v.id === b.villa_id) || homepageData.villas?.[0];
                const roomName = matchingVilla ? matchingVilla.title : "Kamar Utama";

                return (
                  <tr key={b.id} className="hover:bg-cream/15 transition-colors">
                    <td className="p-4 font-semibold text-gray-400">{idx + 1}</td>
                    <td className="p-4 font-mono font-bold text-green-deep">{b.id}</td>
                    <td className="p-4">
                      <div>
                        <div className="font-semibold text-text-dark">{b.guest_name}</div>
                        <div className="text-[10px] text-gray-400">{b.guest_email}</div>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-text-dark">
                      <span className="px-2.5 py-1 bg-green-soft/5 text-green-deep border border-green-soft/10 text-[11px] font-bold rounded-lg uppercase tracking-wide">
                        {roomName}
                      </span>
                    </td>
                    <td className="p-4">
                      {new Date(b.check_in).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-4">
                      {new Date(b.check_out).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-4 text-center font-medium">{b.nights}</td>
                    <td className="p-4 text-center text-gray-500">{b.guest_count}</td>
                    <td className="p-4 font-serif font-bold text-green-deep">{convertAndFormatPrice(b.total_eur, 'IDR')}</td>
                    <td className="p-4">
                      {(() => {
                        const isCurrentlyOccupied = isBookingCurrentlyOccupied(b);
                        const effectiveStatus = b.status === 'occupied' || (b.status === 'paid' && isCurrentlyOccupied) ? 'occupied' : b.status;
                        
                        return (
                          <div className="flex flex-col gap-1">
                            <select
                              value={b.status}
                              onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value as any)}
                              className={`px-2.5 py-1 rounded-xl text-xs font-bold border outline-none cursor-pointer transition-all uppercase tracking-wider ${
                                b.status === 'occupied' || (b.status === 'paid' && isCurrentlyOccupied)
                                  ? 'bg-indigo-600 text-white border-indigo-700 ring-2 ring-indigo-300'
                                  : b.status === 'paid'
                                    ? 'bg-emerald-500 text-white border-emerald-600'
                                    : b.status === 'cancelled'
                                      ? 'bg-rose-500 text-white border-rose-600'
                                      : 'bg-amber-100 text-amber-950 border-amber-300'
                              }`}
                            >
                              <option value="pending" className="bg-white text-gray-700">Pending</option>
                              <option value="paid" className="bg-white text-gray-700">Paid (Booked)</option>
                              <option value="occupied" className="bg-white text-gray-700">Occupied (Sedang Ditempati)</option>
                              <option value="cancelled" className="bg-white text-gray-700">Cancelled</option>
                            </select>
                            {isCurrentlyOccupied && b.status !== 'occupied' && (
                              <span className="text-[9px] font-bold text-indigo-700 uppercase tracking-tight">
                                Aktif Menginap (OCCUPIED)
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </td>
                    <td className="p-4 text-right space-x-2 no-print">
                      <button
                        onClick={() => setSelectedBookingDetail(b)}
                        className="p-1.5 bg-cream hover:bg-sand/30 text-green-deep rounded-lg cursor-pointer"
                        title="Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBooking(b.id)}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {processedBookings.length === 0 && (
                <tr>
                  <td colSpan={11} className="p-12 text-center text-gray-400 font-sans font-light">
                    Tidak ditemukan data pemesanan tamu yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
