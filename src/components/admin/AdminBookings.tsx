import React from 'react';
import { Search, Plus, Download, Printer, Eye, Trash2 } from 'lucide-react';
import { Booking, CMSHomepage } from '../../types';
import { convertAndFormatPrice } from '../../utils/storage';

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
            <option value="pending">Menunggu (Pending)</option>
            <option value="paid">Lunas (Paid)</option>
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

      {/* Core Bookings Table & Mobile Cards (100% Fit, No Side Scrolling) */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden w-full">
        {/* Desktop & Tablet Table View (md+) */}
        <div className="hidden md:block w-full">
          <table className="w-full text-left border-collapse text-xs lg:text-sm table-auto">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 w-12 text-center">No</th>
                <th className="py-3.5 px-4">Tamu & ID</th>
                <th className="py-3.5 px-4">Kamar</th>
                <th className="py-3.5 px-4">Jadwal Menginap</th>
                <th className="py-3.5 px-4">Total Tarif</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right no-print">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {processedBookings.map((b, idx) => {
                const matchingVilla = (homepageData.villas || []).find((v: any) => v.id === b.villa_id) || homepageData.villas?.[0];
                const roomName = matchingVilla ? matchingVilla.title : "Kamar Utama";

                return (
                  <tr key={b.id} className="hover:bg-cream/15 transition-colors">
                    <td className="py-3 px-4 font-semibold text-gray-400 text-center">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-text-dark">{b.guest_name}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">{b.id}</span>
                        {b.guest_count && (
                          <span className="text-[10px] text-gray-500 font-medium">· {b.guest_count} Tamu</span>
                        )}
                      </div>
                      <div className="text-[10px] text-gray-400 truncate max-w-[180px]">{b.guest_email}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-text-dark">
                      <span className="px-2.5 py-1 bg-green-soft/10 text-green-deep border border-green-soft/20 text-[11px] font-bold rounded-lg uppercase tracking-wide inline-block">
                        {roomName}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-medium text-gray-800">
                        {new Date(b.check_in).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - {new Date(b.check_out).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5 font-sans font-normal">
                        Durasi: <span className="font-semibold text-gray-600">{b.nights} Malam</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-serif font-bold text-green-deep whitespace-nowrap">
                      {convertAndFormatPrice(b.total_eur, 'IDR')}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={b.status}
                        onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value as any)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold border outline-none cursor-pointer transition-all uppercase tracking-wider ${
                          b.status === 'paid'
                            ? 'bg-emerald-500 text-white border-emerald-600'
                            : b.status === 'cancelled'
                              ? 'bg-rose-500 text-white border-rose-600'
                              : 'bg-amber-100 text-amber-950 border-amber-300'
                        }`}
                      >
                        <option value="pending" className="bg-white text-gray-700">Pending</option>
                        <option value="paid" className="bg-white text-gray-700">Paid</option>
                        <option value="cancelled" className="bg-white text-gray-700">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 no-print whitespace-nowrap">
                      <button
                        onClick={() => setSelectedBookingDetail(b)}
                        className="p-2 bg-cream hover:bg-sand/30 text-green-deep rounded-xl transition-colors cursor-pointer inline-flex items-center justify-center"
                        title="Lihat Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBooking(b.id)}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors cursor-pointer inline-flex items-center justify-center"
                        title="Hapus Pemesanan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {processedBookings.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-gray-400 font-sans font-light">
                    Tidak ditemukan data pemesanan tamu yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards List View (<md) */}
        <div className="md:hidden divide-y divide-gray-100 w-full">
          {processedBookings.map((b, idx) => {
            const matchingVilla = (homepageData.villas || []).find((v: any) => v.id === b.villa_id) || homepageData.villas?.[0];
            const roomName = matchingVilla ? matchingVilla.title : "Kamar Utama";

            return (
              <div key={b.id} className="p-4 space-y-3 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-gray-400">#{idx + 1}</span>
                      <span className="font-mono text-[10px] bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded font-medium">{b.id}</span>
                      <span className="px-2 py-0.5 bg-green-soft/10 text-green-deep text-[10px] font-bold rounded-md uppercase">
                        {roomName}
                      </span>
                    </div>
                    <h4 className="font-serif font-bold text-sm text-green-deep mt-1">{b.guest_name}</h4>
                    <p className="text-xs text-gray-400">{b.guest_email}</p>
                  </div>

                  <div className="text-right">
                    <div className="font-serif font-bold text-sm text-green-deep">{convertAndFormatPrice(b.total_eur, 'IDR')}</div>
                    <div className="text-[10px] text-gray-400">{b.nights} Malam · {b.guest_count} Tamu</div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-2.5 flex items-center justify-between text-xs text-gray-600">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block">Check-In</span>
                    <span className="font-medium text-gray-800">{new Date(b.check_in).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                  </div>
                  <span className="text-gray-300 font-bold">➔</span>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block">Check-Out</span>
                    <span className="font-medium text-gray-800">{new Date(b.check_out).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <select
                    value={b.status}
                    onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border outline-none cursor-pointer uppercase tracking-wider ${
                      b.status === 'paid'
                        ? 'bg-emerald-500 text-white border-emerald-600'
                        : b.status === 'cancelled'
                          ? 'bg-rose-500 text-white border-rose-600'
                          : 'bg-amber-100 text-amber-950 border-amber-300'
                    }`}
                  >
                    <option value="pending" className="bg-white text-gray-700">Pending</option>
                    <option value="paid" className="bg-white text-gray-700">Paid</option>
                    <option value="cancelled" className="bg-white text-gray-700">Cancelled</option>
                  </select>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedBookingDetail(b)}
                      className="px-3 py-1.5 bg-cream hover:bg-sand/30 text-green-deep rounded-xl text-xs font-semibold flex items-center space-x-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Detail</span>
                    </button>
                    <button
                      onClick={() => handleDeleteBooking(b.id)}
                      className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {processedBookings.length === 0 && (
            <div className="p-8 text-center text-gray-400 text-xs">
              Tidak ditemukan data pemesanan tamu yang cocok.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
