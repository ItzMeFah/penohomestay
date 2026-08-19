import React from 'react';
import { 
  LayoutDashboard, CalendarRange, Bell, FileEdit, Image as ImageIcon, 
  Settings as SettingsIcon, LogOut, Printer, Plus, Edit2, Layers, MapPin, Home 
} from 'lucide-react';
import { AdminNotification } from '../../types';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  notifications: AdminNotification[];
  handleLogout: () => void;
  homestayName: string;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  notifications,
  handleLogout,
  homestayName
}) => {
  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  const menuItems = [
    { id: 'dashboard', label: 'Ringkasan Dashboard', icon: LayoutDashboard },
    { id: 'bookings', label: 'Daftar Pemesanan', icon: Printer },
    { id: 'calendar', label: 'Kalender Okupansi', icon: CalendarRange },
    { id: 'tours', label: 'Paket Wisata & Tur', icon: MapPin },
    { id: 'block', label: 'Tutup Tanggal Kamar', icon: CalendarRange },
    { id: 'notifications', label: 'Notifikasi Sistem', icon: Bell, badge: unreadNotifsCount },
    { id: 'cms', label: 'Edit Konten Beranda', icon: FileEdit },
    { id: 'header', label: 'Slideshow Header', icon: Layers },
    { id: 'gallery', label: 'Menu Galeri Foto', icon: ImageIcon },
    { id: 'settings', label: 'Pengaturan Kredensial', icon: SettingsIcon },
  ];

  return (
    <aside 
      id="admin-sidebar"
      className={`fixed inset-y-0 left-0 bg-green-deep text-cream flex-shrink-0 flex flex-col justify-between p-6 shadow-2xl z-40 transition-transform duration-300 ease-in-out w-72 sm:w-80 md:w-1/3 max-w-[420px] md:static md:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="space-y-8 overflow-y-auto max-h-[80vh] pr-2 scrollbar-thin">
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-cream/10 pb-4">
          <div className="space-y-1">
            <h1 className="font-serif font-bold text-xl tracking-tight text-cream">Admin Portal</h1>
            <p className="font-sans text-[11px] font-bold text-cream/60 tracking-wider uppercase truncate max-w-[220px]">
              {homestayName || "Peno Homestay"}
            </p>
          </div>
          {/* Quick link back to landing page */}
          <a 
            href="/"
            className="p-2 bg-cream/10 hover:bg-cream hover:text-green-deep rounded-full transition-colors"
            title="Lihat Beranda Utama"
          >
            <Home className="w-4 h-4" />
          </a>
        </div>

        {/* Navigation Tabs List */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`tab-btn-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-cream text-green-deep font-extrabold shadow-md' 
                    : 'text-cream/85 hover:bg-cream/10 hover:text-cream'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-green-deep' : 'text-cream/60'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && item.badge > 0 ? (
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${isActive ? 'bg-green-deep text-white' : 'bg-rose-500 text-white animate-pulse'}`}>
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout button */}
      <div className="border-t border-cream/10 pt-4 mt-6">
        <button
          id="logout-btn"
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2.5 bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-semibold py-3 rounded-xl text-xs tracking-wider uppercase transition-all shadow cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar Portal</span>
        </button>
      </div>
    </aside>
  );
};
