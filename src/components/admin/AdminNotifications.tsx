import React from 'react';
import { Bell } from 'lucide-react';
import { AdminNotification, Booking } from '../../types';

interface AdminNotificationsProps {
  notifications: AdminNotification[];
  handleMarkAllNotifsRead: () => void;
  handleMarkNotifRead: (id: number) => void;
  setSelectedBookingDetail: (b: Booking) => void;
}

export const AdminNotifications: React.FC<AdminNotificationsProps> = ({
  notifications,
  handleMarkAllNotifsRead,
  handleMarkNotifRead,
  setSelectedBookingDetail
}) => {
  return (
    <div id="admin-notifications-view" className="max-w-3xl mx-auto bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6">
      <div className="flex justify-between items-center border-b border-sand/15 pb-4">
        <h3 className="font-serif text-lg font-bold text-green-deep">Daftar Notifikasi Sistem</h3>
        <button
          id="notifs-mark-read-btn"
          onClick={handleMarkAllNotifsRead}
          className="text-xs text-green-soft hover:text-green-deep font-semibold cursor-pointer"
        >
          Tandai Semua Dibaca
        </button>
      </div>

      <div className="divide-y divide-gray-50 max-h-[500px] overflow-y-auto space-y-2 pr-2 scrollbar-thin">
        {notifications.map(n => (
          <div
            key={n.id}
            id={`notification-item-${n.id}`}
            onClick={() => {
              handleMarkNotifRead(n.id);
              setSelectedBookingDetail(n.booking);
            }}
            className={`p-4 rounded-2xl flex items-start space-x-4 cursor-pointer transition-all border ${
              n.read ? 'bg-white hover:bg-gray-50/50 border-gray-50' : 'bg-green-50/20 border-green-soft/15 shadow-sm'
            }`}
          >
            <div className={`p-2 rounded-full mt-1 ${
              n.type === 'new_booking' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
            }`}>
              <Bell className="w-4 h-4" />
            </div>
            <div className="flex-grow space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-sans text-xs font-semibold uppercase tracking-wider text-green-deep">
                  {n.type === 'new_booking' ? '🆕 Pemesanan Baru' : n.type === 'booking_confirmed' ? '✅ Dikonfirmasi' : '❌ Dibatalkan'}
                </span>
                <span className="text-[10px] text-gray-400 font-sans">
                  {new Date(n.time).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="font-sans text-sm text-text-dark font-medium leading-relaxed">
                Tamu <span className="font-semibold text-green-deep">{n.booking.guest_name}</span> memesan kamar untuk tanggal {new Date(n.booking.check_in).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} hingga {new Date(n.booking.check_out).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} ({n.booking.nights} malam).
              </p>
            </div>
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="p-12 text-center text-gray-400 font-sans font-light">Belum ada notifikasi sistem terekam.</div>
        )}
      </div>
    </div>
  );
};
