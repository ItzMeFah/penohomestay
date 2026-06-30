import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, CalendarRange, Lock, Bell, FileEdit, Image as ImageIcon, 
  Settings as SettingsIcon, LogOut, Search, ChevronLeft, ChevronRight, Eye, 
  Check, X, Trash2, ShieldAlert, Download, Printer, Plus, Edit2, Info, EyeOff, Save, RefreshCw,
  MessageSquare, Upload, Layers, MapPin, Star, Menu
} from 'lucide-react';
import { Booking, CMSHomepage, GalleryItem, AdminNotification, CMSTourPackage, CMSHighlightItem } from '../types';
import { createClient } from '@supabase/supabase-js';
import { DEFAULT_GALLERY, convertAndFormatPrice } from '../utils/storage';

// Setup Supabase Client matching credentials in SupabasePlaybook
const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || "https://eszvodingaehsnahsvmb.supabase.co";
const ACTUAL_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzenZvZGluZ2FlaHNuYWhzdm1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2NDc3NDQsImV4cCI6MjA5ODIyMzc0NH0.UpoFJqht-1pybKBeadMctnIgI3PmiPMsqWU9uJnfy1Q";
const supabase = createClient(SUPABASE_URL, ACTUAL_KEY);

interface AdminPanelProps {
  bookings: Booking[];
  blockedDates: string[];
  homepageData: CMSHomepage;
  galleryData: GalleryItem[];
  settings: any;
  notifications: AdminNotification[];
  onUpdateBookings: (b: Booking[]) => void;
  onUpdateBlockedDates: (d: string[]) => void;
  onUpdateHomepage: (data: CMSHomepage) => void;
  onUpdateGallery: (data: GalleryItem[]) => void;
  onUpdateSettings: (s: any) => void;
  onUpdateNotifications: (n: AdminNotification[]) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  bookings,
  blockedDates,
  homepageData,
  galleryData,
  settings,
  notifications,
  onUpdateBookings,
  onUpdateBlockedDates,
  onUpdateHomepage,
  onUpdateGallery,
  onUpdateSettings,
  onUpdateNotifications
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Navigation / Sidebar tabs
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'calendar' | 'tours' | 'block' | 'notifications' | 'cms' | 'header' | 'gallery' | 'settings'>('dashboard');

  // Booking Filtering / Sorting states
  const [bookingSearch, setBookingSearch] = useState("");
  const [bookingStatusFilter, setBookingStatusFilter] = useState("all");
  const [bookingSort, setBookingSort] = useState("newest");
  const [selectedBookingDetail, setSelectedBookingDetail] = useState<Booking | null>(null);

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

  // Block Dates state
  const [blockStartStr, setBlockStartStr] = useState("");
  const [blockEndStr, setBlockEndStr] = useState("");
  const [blockReason, setBlockReason] = useState("");

  // CMS Sub-tabs
  const [activeCmsTab, setActiveCmsTab] = useState<'hero' | 'stats' | 'about' | 'features' | 'testimonials' | 'info'>('hero');

  // CMS Local States for edits
  const [cmsHero, setCmsHero] = useState(homepageData.hero);
  const [cmsStats, setCmsStats] = useState(homepageData.stats);
  const [cmsAbout, setCmsAbout] = useState(homepageData.about);
  const [cmsFeatures, setCmsFeatures] = useState(homepageData.features);
  const [cmsTestimonials, setCmsTestimonials] = useState(homepageData.testimonials);
  const [cmsInfo, setCmsInfo] = useState(homepageData.info);

  // Gallery CMS edit states
  const [showAddGalleryModal, setShowAddGalleryModal] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  const [galleryLabel, setGalleryLabel] = useState("");
  const [galleryCategory, setGalleryCategory] = useState("Alam");
  const [galleryColor, setGalleryColor] = useState("#4a8a68");
  const [galleryUrl, setGalleryUrl] = useState("");
  const [galleryOrder, setGalleryOrder] = useState(1);
  const [galleryShowInSlideshow, setGalleryShowInSlideshow] = useState(true);
  const [galleryShowInGallery, setGalleryShowInGallery] = useState(true);

  // Tour Packages CMS edit states
  const [showTourModal, setShowTourModal] = useState(false);
  const [editingTour, setEditingTour] = useState<CMSTourPackage | null>(null);
  const [tourName, setTourName] = useState("");
  const [tourDescription, setTourDescription] = useState("");
  const [tourPrice, setTourPrice] = useState("");
  const [tourInclusions, setTourInclusions] = useState("");
  const [tourPhone, setTourPhone] = useState("+6282332056148");
  const [tourSocial, setTourSocial] = useState("@Penohomestay");
  const [tourImageUrl, setTourImageUrl] = useState("");
  const [tourIsActive, setTourIsActive] = useState(true);
  const [activeTourTab, setActiveTourTab] = useState<'upload' | 'url'>('upload');

  // Highlights CMS edit states
  const [showHighlightModal, setShowHighlightModal] = useState(false);
  const [editingHighlight, setEditingHighlight] = useState<CMSHighlightItem | null>(null);
  const [highlightTitle, setHighlightTitle] = useState("");
  const [highlightDescription, setHighlightDescription] = useState("");
  const [highlightImageUrl, setHighlightImageUrl] = useState("");
  const [activeHighlightTab, setActiveHighlightTab] = useState<'upload' | 'url'>('upload');

  // File upload states for gallery photos (Base64 local & Supabase cloud)
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isUploadingCloud, setIsUploadingCloud] = useState(false);
  const [cloudUploadSuccess, setCloudUploadSuccess] = useState<boolean | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Settings local states
  const [setHomestayName, setSetHomestayName] = useState(settings.homestayName);
  const [setTagline, setSetTagline] = useState(settings.tagline);
  const [setPrice, setSetPrice] = useState(settings.pricePerNight);
  const [setWa, setSetWa] = useState(settings.whatsappNumber);
  const [setInsta, setSetInsta] = useState(settings.instagramUser);
  const [setAddress, setSetAddress] = useState(settings.address);
  const [setMaps, setSetMaps] = useState(settings.mapsUrl);
  const [setInTime, setSetInTime] = useState(settings.checkIn);
  const [setOutTime, setSetOutTime] = useState(settings.checkOut);
  const [setAdminUser, setSetAdminUser] = useState(settings.adminUsername);
  const [setAdminPass, setSetAdminPass] = useState(settings.adminPassword);
  const [setHeroOverlayOpacity, setSetHeroOverlayOpacity] = useState(settings.heroOverlayOpacity ?? 28);
  const [showAdminPass, setShowAdminPass] = useState(false);

  // Admin View Large Calendar
  const [calYear, setCalYear] = useState(2026);
  const [calMonth, setCalMonth] = useState(5); // June

  // Toast / Status state
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<'success' | 'danger' | 'info'>('success');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const MONTHS_ID = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const DAYS_ID = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

  // Supabase connection status state
  const [supabaseStatus, setSupabaseStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  useEffect(() => {
    let isMounted = true;
    const checkSupabaseConn = async () => {
      try {
        // Simple light query to check if Supabase is reachable and peno_cms table is accessible
        const { error } = await supabase.from('peno_cms').select('id').limit(1);
        if (error && error.code !== 'PGRST116') {
          // If it is another kind of error (like schema doesn't exist yet but we connected), we still consider it connected if it's a valid API response
          if (error.message && (error.message.includes('relation') || error.message.includes('does not exist'))) {
            if (isMounted) setSupabaseStatus('connected');
            return;
          }
          throw error;
        }
        if (isMounted) setSupabaseStatus('connected');
      } catch (err) {
        console.warn("Supabase check error:", err);
        if (isMounted) setSupabaseStatus('error');
      }
    };

    checkSupabaseConn();
    // Also re-verify periodically every 20 seconds
    const interval = setInterval(checkSupabaseConn, 20000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Authenticate Session on mount
  useEffect(() => {
    const auth = sessionStorage.getItem("peno_admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const [hasShownPendingToast, setHasShownPendingToast] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !hasShownPendingToast) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const pendingCount = bookings.filter(b => b.status === 'pending' && new Date(b.check_in) >= today).length;
      if (pendingCount > 0) {
        // slightly delay the toast so it doesn't overlap immediately with login toast
        setTimeout(() => {
          showAdminToast(`Ada ${pendingCount} pemesanan yang belum melakukan pembayaran!`, "info");
        }, 500);
      }
      setHasShownPendingToast(true);
    }
  }, [isAuthenticated, bookings, hasShownPendingToast]);

  // Sync CMS local state with loaded database data on prop changes
  useEffect(() => {
    setCmsHero(homepageData.hero);
    setCmsStats(homepageData.stats);
    setCmsAbout(homepageData.about);
    setCmsFeatures(homepageData.features);
    setCmsTestimonials(homepageData.testimonials);
    setCmsInfo(homepageData.info);
  }, [homepageData]);

  // Sync Settings form local state on change
  useEffect(() => {
    setSetHomestayName(settings.homestayName);
    setSetTagline(settings.tagline);
    setSetPrice(settings.pricePerNight);
    setSetWa(settings.whatsappNumber);
    setSetInsta(settings.instagramUser);
    setSetAddress(settings.address);
    setSetMaps(settings.mapsUrl);
    setSetInTime(settings.checkIn);
    setSetOutTime(settings.checkOut);
    setSetAdminUser(settings.adminUsername);
    setSetAdminPass(settings.adminPassword);
    setSetHeroOverlayOpacity(settings.heroOverlayOpacity ?? 28);
  }, [settings]);

  // Toast Utility
  const showAdminToast = (message: string, type: 'success' | 'danger' | 'info' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage("");
    }, 4000);
  };

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (usernameInput === settings.adminUsername && passwordInput === settings.adminPassword) {
      sessionStorage.setItem("peno_admin_auth", "true");
      setIsAuthenticated(true);
      showAdminToast("Selamat datang kembali, Admin!");
    } else {
      setLoginError("Username atau password salah!");
    }
  };

  // Logout handler
  const handleLogout = () => {
    sessionStorage.removeItem("peno_admin_auth");
    setIsAuthenticated(false);
    setUsernameInput("");
    setPasswordInput("");
  };

  // Booking Actions
  const handleUpdateBookingStatus = (bookingId: string, newStatus: 'pending' | 'paid' | 'cancelled') => {
    const updated = bookings.map(b => {
      if (b.id === bookingId) {
        // Send notification sync
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
    if (!window.confirm("Apakah Anda yakin ingin menghapus pemesanan ini secara permanen dari basis data? Tindakan ini tidak dapat dibatalkan.")) return;
    const updated = bookings.filter(b => b.id !== bookingId);
    onUpdateBookings(updated);
    showAdminToast(`Pemesanan ${bookingId} telah dihapus!`, 'danger');
    setSelectedBookingDetail(null);
  };

  const calculateNights = (inStr: string, outStr: string): number => {
    if (!inStr || !outStr) return 1;
    const d1 = new Date(inStr);
    const d2 = new Date(outStr);
    const diffTime = d2.getTime() - d1.getTime();
    if (diffTime <= 0) return 1;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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

    // Check overlaps with existing active bookings
    const hasOverlap = bookings.some(b => {
      if (b.status !== 'paid') return false;
      const bStart = new Date(b.check_in);
      const bEnd = new Date(b.check_out);
      bStart.setHours(0,0,0,0);
      bEnd.setHours(0,0,0,0);
      return (start < bEnd && end > bStart);
    });

    if (hasOverlap) {
      showAdminToast("Tanggal tersebut sudah terisi oleh pemesanan lain!", "danger");
      return;
    }

    const nightsCount = calculateNights(offlineCheckIn, offlineCheckOut);
    const totalEurAmount = Number((offlinePriceIdr / 17500).toFixed(4));

    const newBooking: Booking = {
      id: "OFF-" + Date.now().toString().slice(-6),
      created_at: new Date().toISOString(),
      status: 'paid', // Offline bookings are active immediately
      check_in: offlineCheckIn,
      check_out: offlineCheckOut,
      nights: nightsCount,
      total_eur: totalEurAmount,
      guest_name: offlineGuestName,
      guest_email: offlineGuestEmail || "offline@penohomestay.com",
      guest_wa: offlineGuestWa,
      guest_count: offlineGuestCount,
      notes: offlineNotes || "Offline Booking"
    };

    const updatedBookings = [newBooking, ...bookings];
    onUpdateBookings(updatedBookings);

    // Record system notification
    const notif: AdminNotification = {
      id: Date.now(),
      read: false,
      type: 'booking_confirmed',
      booking: newBooking,
      time: new Date().toISOString()
    };
    onUpdateNotifications([notif, ...notifications]);

    showAdminToast("Pemesanan Offline Berhasil Disimpan & Sinkron ke Kalender & Keuangan!", "success");
    
    // Reset form states
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

  // Notification mark as read
  const handleMarkNotifRead = (id: number) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    onUpdateNotifications(updated);
  };

  const handleMarkAllNotifsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    onUpdateNotifications(updated);
    showAdminToast("Semua notifikasi telah ditandai sebagai dibaca.", "success");
  };

  // Block Dates actions
  const handleBlockDates = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockStartStr || !blockEndStr) {
      showAdminToast("Pilih rentang tanggal mulai dan akhir!", "danger");
      return;
    }

    const start = new Date(blockStartStr);
    const end = new Date(blockEndStr);

    if (end < start) {
      showAdminToast("Tanggal akhir tidak boleh mendahului tanggal mulai!", "danger");
      return;
    }

    const newBlocked = [...blockedDates];
    let d = new Date(start);
    while (d <= end) {
      const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      if (!newBlocked.includes(key)) {
        newBlocked.push(key);
      }
      d.setDate(d.getDate() + 1);
    }

    onUpdateBlockedDates(newBlocked);
    showAdminToast("Rentang tanggal berhasil diatur sebagai Not Available!", "success");
    setBlockStartStr("");
    setBlockEndStr("");
    setBlockReason("");
  };

  const handleUnblockDate = (key: string) => {
    const updated = blockedDates.filter(k => k !== key);
    onUpdateBlockedDates(updated);
    showAdminToast(`Tanggal ${key} kembali tersedia!`, "success");
  };

  // CSV Export
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Tanggal Pesan,Nama,Email,WhatsApp,Check-in,Check-out,Malam,Tamu,Total EUR,Status,Catatan\n";

    bookings.forEach(b => {
      const row = [
        b.id,
        b.created_at,
        `"${b.guest_name.replace(/"/g, '""')}"`,
        b.guest_email,
        b.guest_wa,
        b.check_in,
        b.check_out,
        b.nights,
        b.guest_count,
        b.total_eur,
        b.status,
        `"${(b.notes || '').replace(/"/g, '""')}"`
      ].join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `laporan_pemesanan_peno_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showAdminToast("Ekspor berkas CSV selesai!", "success");
  };

  // Print Reports
  const handlePrintReport = () => {
    window.print();
  };

  // WhatsApp Messages
  const getAdminWhatsAppMessage = (b: Booking) => {
    const checkinDate = new Date(b.check_in).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const checkoutDate = new Date(b.check_out).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    return `Halo ${b.guest_name}! 👋\n\nKami dengan senang hati mengkonfirmasi pemesanan Anda di *Peno Homestay Banyuwangi* 🏡\n\n✅ *KONFIRMASI PEMESANAN*\n━━━━━━━━━━━━━━━━━━━\n📋 ID Pemesanan : ${b.id}\n👤 Nama         : ${b.guest_name}\n📅 Check-in     : ${checkinDate}, pukul ${settings.checkIn || '14:00'}\n📅 Check-out    : ${checkoutDate}, pukul ${settings.checkOut || '12:00'}\n🌙 Durasi       : ${b.nights} malam\n👥 Jumlah Tamu  : ${b.guest_count} orang\n💵 Total        : ${convertAndFormatPrice(b.total_eur, 'IDR')}\n━━━━━━━━━━━━━━━━━━━\n📍 Alamat: ${settings.address}\n📞 Kontak: ${settings.whatsappNumber}\n\nSampai jumpa di Peno Homestay! ☕🌿`;
  };

  const getAdminWhatsAppLink = (b: Booking) => {
    const cleanNumber = b.guest_wa.replace(/[^0-9]/g, "");
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(getAdminWhatsAppMessage(b))}`;
  };

  // CMS Savers
  const handleSaveCmsHero = () => {
    setSaveStatus('saving');
    onUpdateHomepage({ ...homepageData, hero: cmsHero });
    showAdminToast("Konten Hero berhasil disimpan!", "success");
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 1500);
  };

  const handleSaveCmsStats = () => {
    setSaveStatus('saving');
    onUpdateHomepage({ ...homepageData, stats: cmsStats });
    showAdminToast("Konten Statistik berhasil disimpan!", "success");
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 1500);
  };

  const handleSaveCmsAbout = () => {
    setSaveStatus('saving');
    onUpdateHomepage({ ...homepageData, about: cmsAbout });
    showAdminToast("Konten Tentang Kami berhasil disimpan!", "success");
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 1500);
  };

  const handleSaveCmsFeatures = () => {
    setSaveStatus('saving');
    onUpdateHomepage({ ...homepageData, features: cmsFeatures });
    showAdminToast("Konten Keunggulan berhasil disimpan!", "success");
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 1500);
  };

  const handleSaveCmsTestimonials = () => {
    setSaveStatus('saving');
    onUpdateHomepage({ ...homepageData, testimonials: cmsTestimonials });
    showAdminToast("Ulasan Tamu berhasil disimpan!", "success");
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 1500);
  };

  const handleSaveCmsInfo = () => {
    setSaveStatus('saving');
    onUpdateHomepage({ ...homepageData, info: cmsInfo });
    // Also sync Settings Base Price, Checkin, Checkout
    onUpdateSettings({
      ...settings,
      pricePerNight: cmsInfo.price_from,
      checkIn: cmsInfo.checkin,
      checkOut: cmsInfo.checkout
    });
    showAdminToast("Informasi Menginap berhasil disimpan!", "success");
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 1500);
  };

  // Gallery CMS Savers
  const [activeGalleryTab, setActiveGalleryTab] = useState<'upload' | 'url'>('upload');

  const handleOpenAddGallery = () => {
    setEditingGalleryItem(null);
    setGalleryLabel("");
    setGalleryCategory("Alam");
    setGalleryColor("#4a8a68");
    setGalleryUrl("");
    setGalleryOrder(galleryData.length + 1);
    setGalleryShowInSlideshow(activeTab === 'header');
    setGalleryShowInGallery(activeTab === 'gallery' || activeTab !== 'header');
    setSelectedImageFile(null);
    setUploadError("");
    setCloudUploadSuccess(null);
    setIsUploadingCloud(false);
    setActiveGalleryTab('upload');
    setShowAddGalleryModal(true);
  };

  const handleOpenEditGallery = (item: GalleryItem) => {
    setEditingGalleryItem(item);
    setGalleryLabel(item.label);
    setGalleryCategory(item.category);
    setGalleryColor(item.color);
    setGalleryUrl(item.url);
    setGalleryOrder(item.order);
    setGalleryShowInSlideshow(item.showInSlideshow !== false);
    setGalleryShowInGallery(item.showInGallery !== false);
    setSelectedImageFile(null);
    setUploadError("");
    setCloudUploadSuccess(null);
    setIsUploadingCloud(false);
    setActiveGalleryTab(item.url ? 'url' : 'upload');
    setShowAddGalleryModal(true);
  };

  const handleSaveGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryLabel.trim()) {
      showAdminToast("Label foto tidak boleh kosong!", "danger");
      return;
    }

    setSaveStatus('saving');
    let finalUrl = galleryUrl;

    if (selectedImageFile && activeGalleryTab === 'upload') {
      const uploadedUrl = await handleUploadToSupabase();
      if (uploadedUrl) {
        finalUrl = uploadedUrl;
      }
    }

    if (editingGalleryItem) {
      // Edit existing
      const updated = galleryData.map(g => {
        if (g.id === editingGalleryItem.id) {
          return {
            ...g,
            label: galleryLabel,
            category: galleryCategory,
            color: galleryColor,
            url: finalUrl,
            order: Number(galleryOrder),
            showInSlideshow: galleryShowInSlideshow,
            showInGallery: galleryShowInGallery
          };
        }
        return g;
      });
      onUpdateGallery(updated);
      showAdminToast("Item galeri berhasil diperbarui!", "success");
    } else {
      // Add new
      const newItem: GalleryItem = {
        id: Date.now(),
        label: galleryLabel,
        category: galleryCategory,
        color: galleryColor,
        url: finalUrl,
        order: Number(galleryOrder),
        showInSlideshow: galleryShowInSlideshow,
        showInGallery: galleryShowInGallery
      };
      onUpdateGallery([...galleryData, newItem]);
      showAdminToast("Item galeri berhasil ditambahkan!", "success");
    }

    setSaveStatus('saved');
    setTimeout(() => {
      setSaveStatus('idle');
      setShowAddGalleryModal(false);
    }, 1500);
  };

  const handleDeleteGalleryItem = (id: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus foto galeri ini?")) return;
    const updated = galleryData.filter(g => g.id !== id);
    onUpdateGallery(updated);
    showAdminToast("Foto galeri berhasil dihapus!", "success");
  };

  const handleResetGallery = () => {
    if (window.confirm("Apakah Anda yakin ingin mereset semua galeri ke gambar bawaan? Ini berguna jika memori penuh karena pernah mengunggah foto berukuran sangat besar.")) {
      onUpdateGallery(DEFAULT_GALLERY);
      showAdminToast("Galeri berhasil direset ke gambar bawaan!", "success");
    }
  };

  // ==========================================
  // 🗺️ TOUR PACKAGES CMS HANDLERS
  // ==========================================
  const handleOpenAddTour = () => {
    setEditingTour(null);
    setTourName("");
    setTourDescription("");
    setTourPrice("");
    setTourInclusions("");
    setTourPhone("+6282332056148");
    setTourSocial("@Penohomestay");
    setTourImageUrl("");
    setTourIsActive(true);
    setSelectedImageFile(null);
    setUploadError("");
    setCloudUploadSuccess(null);
    setIsUploadingCloud(false);
    setActiveTourTab('upload');
    setShowTourModal(true);
  };

  const handleOpenEditTour = (tour: CMSTourPackage) => {
    setEditingTour(tour);
    setTourName(tour.name || "");
    setTourDescription(tour.description || "");
    setTourPrice(tour.price || "");
    setTourInclusions((tour.inclusions || []).join(", "));
    setTourPhone(tour.contactPhone || "+6282332056148");
    setTourSocial(tour.contactSocial || "@Penohomestay");
    setTourImageUrl(tour.imageUrl || "");
    setTourIsActive(tour.isActive !== false);
    setSelectedImageFile(null);
    setUploadError("");
    setCloudUploadSuccess(null);
    setIsUploadingCloud(false);
    setActiveTourTab(tour.imageUrl ? 'url' : 'upload');
    setShowTourModal(true);
  };

  const handleSaveTour = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tourName.trim()) {
      showAdminToast("Nama paket wisata tidak boleh kosong!", "danger");
      return;
    }

    setSaveStatus('saving');
    let finalUrl = tourImageUrl;

    if (selectedImageFile && activeTourTab === 'upload') {
      const uploadedUrl = await handleUploadToSupabase();
      if (uploadedUrl) {
        finalUrl = uploadedUrl;
      }
    }

    const inclusionsArray = tourInclusions
      ? tourInclusions.split(",").map(item => item.trim()).filter(item => item.length > 0)
      : [];

    const existingTours = homepageData.tours || [];

    if (editingTour) {
      // Edit existing tour
      const updatedTours = existingTours.map(t => {
        if (t.id === editingTour.id) {
          return {
            ...t,
            name: tourName,
            description: tourDescription,
            price: tourPrice,
            inclusions: inclusionsArray,
            contactPhone: tourPhone,
            contactSocial: tourSocial,
            imageUrl: finalUrl,
            isActive: tourIsActive
          };
        }
        return t;
      });
      onUpdateHomepage({ ...homepageData, tours: updatedTours });
      showAdminToast("Paket wisata berhasil diperbarui!", "success");
    } else {
      // Add new tour
      const newTour: CMSTourPackage = {
        id: Date.now(),
        name: tourName,
        description: tourDescription,
        price: tourPrice,
        inclusions: inclusionsArray,
        contactPhone: tourPhone,
        contactSocial: tourSocial,
        imageUrl: finalUrl,
        isActive: tourIsActive
      };
      onUpdateHomepage({ ...homepageData, tours: [...existingTours, newTour] });
      showAdminToast("Paket wisata berhasil ditambahkan!", "success");
    }

    setSaveStatus('saved');
    setTimeout(() => {
      setSaveStatus('idle');
      setShowTourModal(false);
    }, 1500);
  };

  const handleDeleteTour = (id: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus paket wisata ini?")) return;
    const existingTours = homepageData.tours || [];
    const updatedTours = existingTours.filter(t => t.id !== id);
    onUpdateHomepage({ ...homepageData, tours: updatedTours });
    showAdminToast("Paket wisata berhasil dihapus!", "success");
  };

  // 🌟 HIGHLIGHTS CMS HANDLERS
  // ==========================================
  const handleOpenAddHighlight = () => {
    setEditingHighlight(null);
    setHighlightTitle("");
    setHighlightDescription("");
    setHighlightImageUrl("");
    setSelectedImageFile(null);
    setUploadError("");
    setCloudUploadSuccess(null);
    setIsUploadingCloud(false);
    setActiveHighlightTab('upload');
    setShowHighlightModal(true);
  };

  const handleOpenEditHighlight = (item: CMSHighlightItem) => {
    setEditingHighlight(item);
    setHighlightTitle(item.title || "");
    setHighlightDescription(item.description || "");
    setHighlightImageUrl(item.imageUrl || "");
    setSelectedImageFile(null);
    setUploadError("");
    setCloudUploadSuccess(null);
    setIsUploadingCloud(false);
    setActiveHighlightTab(item.imageUrl ? 'url' : 'upload');
    setShowHighlightModal(true);
  };

  const handleSaveHighlight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!highlightTitle.trim()) {
      showAdminToast("Judul highlight tidak boleh kosong!", "danger");
      return;
    }

    setSaveStatus('saving');
    let finalUrl = highlightImageUrl;

    if (selectedImageFile && activeHighlightTab === 'upload') {
      const uploadedUrl = await handleUploadToSupabase();
      if (uploadedUrl) {
        finalUrl = uploadedUrl;
      }
    }

    const currentAbout = homepageData.about || { title: "", body: "", highlights: [] };
    const existingHighlights = currentAbout.highlightItems || [];

    if (editingHighlight) {
      // Edit existing highlight
      const updatedHighlights = existingHighlights.map(h => {
        if (h.id === editingHighlight.id) {
          return {
            ...h,
            title: highlightTitle,
            description: highlightDescription,
            imageUrl: finalUrl
          };
        }
        return h;
      });
      onUpdateHomepage({
        ...homepageData,
        about: {
          ...currentAbout,
          highlightItems: updatedHighlights
        }
      });
      showAdminToast("Highlight berhasil diperbarui!", "success");
    } else {
      // Add new highlight
      const newHighlight: CMSHighlightItem = {
        id: "hl-" + Date.now(),
        title: highlightTitle,
        description: highlightDescription,
        imageUrl: finalUrl
      };
      onUpdateHomepage({
        ...homepageData,
        about: {
          ...currentAbout,
          highlightItems: [...existingHighlights, newHighlight]
        }
      });
      showAdminToast("Highlight berhasil ditambahkan!", "success");
    }

    setSaveStatus('saved');
    setTimeout(() => {
      setSaveStatus('idle');
      setShowHighlightModal(false);
    }, 1500);
  };

  const handleDeleteHighlight = (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus highlight ini?")) return;
    const currentAbout = homepageData.about || { title: "", body: "", highlights: [] };
    const existingHighlights = currentAbout.highlightItems || [];
    const updatedHighlights = existingHighlights.filter(h => h.id !== id);
    onUpdateHomepage({
      ...homepageData,
      about: {
        ...currentAbout,
        highlightItems: updatedHighlights
      }
    });
    showAdminToast("Highlight berhasil dihapus!", "success");
  };

  // Reorder gallery helper by ID and view filter
  const handleMoveGalleryItem = (id: number, direction: 'up' | 'down', isHeaderView?: boolean) => {
    const items = [...galleryData].sort((a, b) => a.order - b.order);
    const filtered = isHeaderView 
      ? items.filter(g => g.showInSlideshow !== false)
      : items.filter(g => g.showInGallery !== false);
      
    const index = filtered.findIndex(g => g.id === id);
    if (index === -1) return;
    
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= filtered.length) return;

    const itemA = filtered[index];
    const itemB = filtered[targetIndex];

    // Swap order property
    const temp = itemA.order;
    itemA.order = itemB.order;
    itemB.order = temp;

    onUpdateGallery(items);
    showAdminToast("Urutan berhasil diubah!", "success");
  };

  // ==========================================
  // 📸 INTEGRASI FILE UPLOADER (Base64 & Supabase Storage)
  // ==========================================
  
  // Fungsi kompresi gambar client-side menggunakan Canvas
  const compressImage = (base64Str: string, maxWidth = 800, maxHeight = 800, quality = 0.7): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Pertahankan rasio aspek
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Kompresi ke format JPEG dengan kualitas tereduksi (0.7)
          const compressed = canvas.toDataURL("image/jpeg", quality);
          resolve(compressed);
        } else {
          resolve(base64Str);
        }
      };
      img.onerror = () => {
        resolve(base64Str);
      };
      img.src = base64Str;
    });
  };

  // Memproses file yang dipilih untuk dibaca menjadi string Base64
  const handleFileRead = (file: File) => {
    setUploadError("");
    setCloudUploadSuccess(null);
    setSelectedImageFile(file);
    
    if (!file.type.startsWith("image/")) {
      setUploadError("Format berkas harus berupa gambar (.jpg, .jpeg, .png, .webp, .gif)!");
      setSelectedImageFile(null);
      return;
    }
    
    // Tampilkan informasi kompresi otomatis
    showAdminToast("Membaca file & mengompresi gambar otomatis agar hemat ruang...", "info");

    const reader = new FileReader();
    reader.onload = async (event) => {
      if (event.target && event.target.result) {
        const rawBase64 = event.target.result as string;
        try {
          const compressedBase64 = await compressImage(rawBase64);
          if (showTourModal) {
            setTourImageUrl(compressedBase64);
          } else if (showHighlightModal) {
            setHighlightImageUrl(compressedBase64);
          } else {
            setGalleryUrl(compressedBase64);
          }
          showAdminToast("Gambar berhasil dikompresi dan dimuat secara lokal!", "success");
        } catch (e) {
          console.error("Gagal kompresi, menggunakan file asli", e);
          if (showTourModal) {
            setTourImageUrl(rawBase64);
          } else if (showHighlightModal) {
            setHighlightImageUrl(rawBase64);
          } else {
            setGalleryUrl(rawBase64);
          }
          showAdminToast("Gambar berhasil dimuat lokal tanpa kompresi.", "info");
        }
      }
    };
    reader.onerror = () => {
      setUploadError("Gagal membaca file gambar lokal!");
    };
    reader.readAsDataURL(file);
  };

  // Drag & Drop Handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileRead(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileRead(e.target.files[0]);
    }
  };

  // Fungsi mengunggah berkas gambar langsung ke Supabase Storage (Cloud)
  const handleUploadToSupabase = async (customFile?: File): Promise<string | null> => {
    const fileToUpload = customFile || selectedImageFile;
    if (!fileToUpload) {
      setUploadError("Pilih file gambar terlebih dahulu!");
      return null;
    }
    
    setIsUploadingCloud(true);
    setUploadError("");
    setCloudUploadSuccess(null);
    showAdminToast("Mengunggah foto ke Supabase Storage...", "info");
    
    try {
      const fileExt = fileToUpload.name.split('.').pop();
      const fileName = `gallery/${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExt}`;
      
      // Try to upload to 'gallery' bucket first, fall back to 'avatars' if there is any issue
      let bucketName = 'gallery';
      let uploadResult = await supabase.storage
        .from(bucketName)
        .upload(fileName, fileToUpload, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadResult.error) {
        console.warn("Failed to upload to 'gallery' bucket, trying 'avatars' bucket...", uploadResult.error.message);
        bucketName = 'avatars';
        uploadResult = await supabase.storage
          .from(bucketName)
          .upload(fileName, fileToUpload, {
            cacheControl: '3600',
            upsert: true
          });
      }

      if (uploadResult.error) {
        throw new Error(uploadResult.error.message);
      }

      // Mengambil URL Publik
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      if (showTourModal) {
        setTourImageUrl(publicUrl);
      } else if (showHighlightModal) {
        setHighlightImageUrl(publicUrl);
      } else {
        setGalleryUrl(publicUrl);
      }
      setCloudUploadSuccess(true);
      showAdminToast("Foto berhasil diunggah ke Supabase Cloud!", "success");
      return publicUrl;
    } catch (err: any) {
      console.error("Gagal mengunggah berkas ke Supabase:", err);
      
      const isRlsError = err.message?.toLowerCase().includes("row-level security") || 
                         err.message?.toLowerCase().includes("security policy") ||
                         err.message?.toLowerCase().includes("violates");
      
      if (isRlsError) {
        setUploadError("Gagal upload cloud karena kebijakan keamanan Supabase (RLS). Namun jangan khawatir, gambar Anda TELAH berhasil dikompresi dan dimuat secara lokal (Base64 luring)! Anda dapat langsung mengklik tombol Simpan/Tambah di bawah untuk menyimpannya.");
        showAdminToast("Gambar lokal siap digunakan sebagai Base64 luring!", "success");
      } else {
        setUploadError(`Gagal upload cloud: ${err.message}. Pastikan bucket 'avatars' sudah ada dan RLS storage telah dikonfigurasi.`);
        showAdminToast("Gagal mengunggah gambar ke cloud.", "danger");
      }
      setCloudUploadSuccess(false);
      return null;
    } finally {
      setIsUploadingCloud(false);
    }
  };

  // Settings Savers
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    onUpdateSettings({
      homestayName: setHomestayName,
      tagline: setTagline,
      pricePerNight: Number(setPrice),
      whatsappNumber: setWa,
      whatsappUrl: `https://wa.me/${setWa.replace(/[^0-9]/g, "")}`,
      instagramUser: setInsta,
      instagramUrl: `https://www.instagram.com/${setInsta.replace("@", "")}/`,
      address: setAddress,
      mapsUrl: setMaps,
      checkIn: setInTime,
      checkOut: setOutTime,
      adminUsername: setAdminUser,
      adminPassword: setAdminPass,
      heroOverlayOpacity: Number(setHeroOverlayOpacity)
    });

    showAdminToast("Semua pengaturan sistem berhasil disimpan!", "success");
    setSaveStatus('saved');
    setTimeout(() => {
      setSaveStatus('idle');
    }, 1500);
  };

  // Booking Filters / Sorters Processing
  const processedBookings = React.useMemo(() => {
    let result = [...bookings];

    // Search by guest name or ID
    if (bookingSearch.trim()) {
      const q = bookingSearch.toLowerCase();
      result = result.filter(b => 
        b.guest_name.toLowerCase().includes(q) || 
        b.id.toLowerCase().includes(q)
      );
    }

    // Filter by Status
    if (bookingStatusFilter !== 'all') {
      result = result.filter(b => b.status === bookingStatusFilter);
    }

    // Sort options
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
  }, [bookings, bookingSearch, bookingStatusFilter, bookingSort]);

  // Calculations for Admin Dashboard counters
  const totalBookingsCount = bookings.length;
  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const confirmedCount = bookings.filter(b => b.status === 'paid').length;
  const totalRevenue = bookings
    .filter(b => b.status === 'paid')
    .reduce((sum, b) => sum + b.total_eur, 0);

  // Large Calendar Days Calculation
  const renderAdminLargeCalendar = () => {
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const firstDayIndex = new Date(calYear, calMonth, 1).getDay();
    const startOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    const dayCells = [];

    // Spacing
    for (let i = 0; i < startOffset; i++) {
      dayCells.push(<div key={`empty-${i}`} className="aspect-square bg-gray-50/40 border border-gray-100 rounded-xl" />);
    }

    // Monthly cells
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(calYear, calMonth, d);
      const key = `${calYear}-${calMonth + 1}-${d}`;
      
      const paidBooking = bookings.find(b => {
        if (b.status !== 'paid') return false;
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
        let start = new Date(b.check_in);
        let end = new Date(b.check_out);
        start.setHours(0,0,0,0);
        end.setHours(0,0,0,0);
        if (start < today) return false;
        return date >= start && date < end;
      });

      const activeBooking = paidBooking || pendingBooking;

      const isBlocked = blockedDates.includes(key);

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
          onClick={() => {
            if (activeBooking) {
              setSelectedBookingDetail(activeBooking);
            } else {
              if (isBlocked) {
                const updated = blockedDates.filter(k => k !== key);
                onUpdateBlockedDates(updated);
                showAdminToast(`Tanggal ${d} ${MONTHS_ID[calMonth]} ${calYear} diatur kembali sebagai TERSEDIA!`, "success");
              } else {
                const updated = [...blockedDates, key];
                onUpdateBlockedDates(updated);
                showAdminToast(`Tanggal ${d} ${MONTHS_ID[calMonth]} ${calYear} diatur sebagai BOOKED!`, "success");
              }
            }
          }}
          className={`aspect-square min-h-[56px] md:min-h-[72px] p-2 flex flex-col justify-between transition-all duration-200 relative group rounded-xl shadow-xs border ${
            statusType === 'paid'
              ? 'bg-rose-50/70 border-rose-200 text-rose-900 hover:bg-rose-100/70'
              : statusType === 'pending'
                ? 'bg-amber-50/70 border-amber-200 text-amber-950 hover:bg-amber-100/70'
                : statusType === 'blocked'
                  ? 'bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-200/50'
                  : 'bg-emerald-50/40 border-emerald-100 text-emerald-900 hover:bg-emerald-50/90'
          } cursor-pointer hover:-translate-y-0.5`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs md:text-sm font-extrabold ${
              statusType === 'paid' ? 'text-rose-700' :
              statusType === 'pending' ? 'text-amber-700' :
              statusType === 'blocked' ? 'text-gray-500' : 'text-emerald-800'
            }`}>{d}</span>
            
            {/* Minimal dot indicator */}
            <span className={`w-2 h-2 rounded-full ${
              statusType === 'paid' ? 'bg-rose-500 shadow-rose-200 shadow' :
              statusType === 'pending' ? 'bg-amber-500 shadow-amber-200 shadow' :
              statusType === 'blocked' ? 'bg-gray-400' : 'bg-emerald-500 shadow-emerald-200 shadow'
            }`} />
          </div>

          <div className="mt-1 w-full overflow-hidden">
            {statusType === 'paid' && (
              <span className="text-[8px] md:text-[9px] font-bold tracking-tight truncate block px-1.5 py-0.5 rounded-md bg-rose-500/10 text-rose-800 text-center uppercase">
                {label.length > 8 ? label.substring(0, 8) + '..' : label}
              </span>
            )}
            {statusType === 'pending' && (
              <span className="text-[8px] md:text-[9px] font-bold tracking-tight truncate block px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-800 text-center uppercase">
                {label.length > 8 ? label.substring(0, 8) + '..' : label}
              </span>
            )}
            {statusType === 'blocked' && (
              <span className="text-[8px] md:text-[9px] font-semibold tracking-tight truncate block px-1.5 py-0.5 rounded-md bg-gray-200 text-gray-600 text-center uppercase">
                BLOCKED
              </span>
            )}
            {statusType === 'available' && (
              <span className="text-[8px] md:text-[9px] font-bold tracking-tight truncate block px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 text-center uppercase">
                KOSONG
              </span>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-3xl border border-gray-150/40 p-6 shadow-md">
        <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
          <div className="space-y-0.5">
            <h3 className="font-serif font-bold text-lg text-green-deep">
              {MONTHS_ID[calMonth]} {calYear}
            </h3>
            <p className="text-[10px] text-gray-400 font-sans">Gunakan panah untuk navigasi bulan</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
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
              onClick={() => {
                const today = new Date();
                setCalMonth(today.getMonth());
                setCalYear(today.getFullYear());
              }}
              className="px-3 py-1.5 bg-green-deep/5 hover:bg-green-deep/10 text-green-deep font-sans font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Bulan Ini
            </button>
            <button
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

        <div className="grid grid-cols-7 gap-1.5 mb-2 text-center text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2.5">
          {DAYS_ID.map(day => <div key={day} className="py-1">{day}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {dayCells}
        </div>
      </div>
    );
  };

  // LOGIN GATE SCREEN
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-green-deep flex items-center justify-center p-6 z-50 overflow-hidden">
        {/* Background shapes */}
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-green-soft/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-coffee/5 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-sand/30 p-8 md:p-12 max-w-md w-full shadow-2xl space-y-8 relative z-10"
        >
          <div className="text-center space-y-2">
            <h2 className="font-serif text-3xl font-bold text-green-deep">Peno Homestay</h2>
            <p className="font-sans text-sm text-text-mid font-light">Admin Portal Login Gate</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="font-sans text-xs font-semibold uppercase text-text-dark tracking-wider">Username</label>
              <input
                type="text"
                required
                placeholder="Masukkan username"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full bg-cream/30 border border-sand/40 hover:border-sand focus:border-green-soft px-4 py-3 rounded-xl font-sans text-sm text-text-dark outline-none focus:ring-1 focus:ring-green-soft transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="font-sans text-xs font-semibold uppercase text-text-dark tracking-wider flex justify-between">
                <span>Password</span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-green-soft hover:text-green-deep normal-case text-[10px] font-sans"
                >
                  {showPassword ? "Sembunyikan" : "Tampilkan"}
                </button>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Masukkan password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-cream/30 border border-sand/40 hover:border-sand focus:border-green-soft px-4 py-3 rounded-xl font-sans text-sm text-text-dark outline-none focus:ring-1 focus:ring-green-soft transition-all"
              />
            </div>

            {loginError && (
              <div className="bg-rose-50 text-rose-700 text-xs font-sans font-medium p-3 border border-rose-100 rounded-xl">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-green-deep hover:bg-green-mid text-cream font-sans font-semibold py-3.5 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 active:scale-95 cursor-pointer text-center flex items-center justify-center space-x-2"
            >
              <Lock className="w-4 h-4" />
              <span>Masuk Portal Admin</span>
            </button>
          </form>

          <div className="text-center font-mono text-[10px] text-gray-400 uppercase tracking-widest pt-4">
            Security Authenticator Gate
          </div>
        </motion.div>
      </div>
    );
  }

  // CORE ADMIN PANEL LAYOUT
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row relative text-text-dark">
      
      {/* Real-time Side Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, x: 50, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 50, y: 20 }}
            className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl border flex items-center space-x-3 ${
              toastType === 'success' 
                ? 'bg-emerald-500 text-white border-emerald-600' 
                : toastType === 'danger' 
                  ? 'bg-rose-500 text-white border-rose-600' 
                  : 'bg-amber-500 text-white border-amber-600'
            }`}
          >
            {toastType === 'success' ? <Check className="w-5 h-5" /> : toastType === 'danger' ? <ShieldAlert className="w-5 h-5" /> : <Info className="w-5 h-5" />}
            <span className="font-sans font-medium text-sm">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. SIDEBAR BACKDROP OVERLAY */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* 2. SIDEBAR PANEL (DRAWER 1/3 SCREEN) */}
      <aside className={`fixed inset-y-0 left-0 bg-green-deep text-cream flex-shrink-0 flex flex-col justify-between p-6 shadow-2xl z-40 transition-transform duration-300 ease-in-out w-72 sm:w-80 md:w-1/3 max-w-[420px] ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="space-y-6 overflow-y-auto max-h-[85vh] pr-1">
          {/* Logo / Header with Close Button */}
          <div className="border-b border-green-soft/20 pb-4 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold tracking-tight text-cream">Peno Admin</h2>
              <p className="font-mono text-[10px] text-sand/65 uppercase tracking-widest">Homestay Control Center</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 text-cream/70 hover:text-cream hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-black/15 px-2.5 py-1.5 rounded-lg border border-white/5 flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              {supabaseStatus === 'connected' && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                supabaseStatus === 'connected' 
                  ? 'bg-emerald-500' 
                  : supabaseStatus === 'checking' 
                    ? 'bg-amber-500 animate-pulse' 
                    : 'bg-rose-500'
              }`}></span>
            </span>
            <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-sand/90">
              Supabase: {
                supabaseStatus === 'connected' 
                  ? 'Aktif / Connected' 
                  : supabaseStatus === 'checking' 
                    ? 'Checking...' 
                    : 'Inactive / Error'
              }
            </span>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col space-y-1">
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setSidebarOpen(false);
              }}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-sans text-sm font-medium transition-all text-left w-full cursor-pointer ${
                activeTab === 'dashboard' ? 'bg-green-soft text-cream border-l-4 border-sand shadow-md' : 'text-cream/80 hover:bg-cream/10 hover:text-cream'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('bookings');
                setSidebarOpen(false);
              }}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-sans text-sm font-medium transition-all text-left w-full cursor-pointer ${
                activeTab === 'bookings' ? 'bg-green-soft text-cream border-l-4 border-sand shadow-md' : 'text-cream/80 hover:bg-cream/10 hover:text-cream'
              }`}
            >
              <CalendarRange className="w-4 h-4" />
              <span>Manajemen Pemesanan</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('calendar');
                setSidebarOpen(false);
              }}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-sans text-sm font-medium transition-all text-left w-full cursor-pointer ${
                activeTab === 'calendar' ? 'bg-green-soft text-cream border-l-4 border-sand shadow-md' : 'text-cream/80 hover:bg-cream/10 hover:text-cream'
              }`}
            >
              <CalendarRange className="w-4 h-4" />
              <span>Kalender Ketersediaan</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('tours');
                setSidebarOpen(false);
              }}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-sans text-sm font-medium transition-all text-left w-full cursor-pointer ${
                activeTab === 'tours' ? 'bg-green-soft text-cream border-l-4 border-sand shadow-md' : 'text-cream/80 hover:bg-cream/10 hover:text-cream'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Paket Wisata</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('notifications');
                setSidebarOpen(false);
              }}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-sans text-sm font-medium transition-all text-left w-full cursor-pointer ${
                activeTab === 'notifications' ? 'bg-green-soft text-cream border-l-4 border-sand shadow-md' : 'text-cream/80 hover:bg-cream/10 hover:text-cream'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Notifikasi Realtime</span>
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="ml-auto w-5 h-5 flex items-center justify-center bg-rose-500 text-white rounded-full text-[10px] font-bold animate-pulse">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('header');
                setSidebarOpen(false);
              }}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-sans text-sm font-medium transition-all text-left w-full cursor-pointer ${
                activeTab === 'header' ? 'bg-green-soft text-cream border-l-4 border-sand shadow-md' : 'text-cream/80 hover:bg-cream/10 hover:text-cream'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Manajemen Header</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('gallery');
                setSidebarOpen(false);
              }}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-sans text-sm font-medium transition-all text-left w-full cursor-pointer ${
                activeTab === 'gallery' ? 'bg-green-soft text-cream border-l-4 border-sand shadow-md' : 'text-cream/80 hover:bg-cream/10 hover:text-cream'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Manajemen Galeri</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('cms');
                setSidebarOpen(false);
              }}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-sans text-sm font-medium transition-all text-left w-full cursor-pointer ${
                activeTab === 'cms' ? 'bg-green-soft text-cream border-l-4 border-sand shadow-md' : 'text-cream/80 hover:bg-cream/10 hover:text-cream'
              }`}
            >
              <FileEdit className="w-4 h-4" />
              <span>CMS Edit Home</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('settings');
                setSidebarOpen(false);
              }}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-sans text-sm font-medium transition-all text-left w-full cursor-pointer ${
                activeTab === 'settings' ? 'bg-green-soft text-cream border-l-4 border-sand shadow-md' : 'text-cream/80 hover:bg-cream/10 hover:text-cream'
              }`}
            >
              <SettingsIcon className="w-4 h-4" />
              <span>Pengaturan</span>
            </button>
          </nav>
        </div>

        {/* Logout action */}
        <button
          onClick={() => {
            setSidebarOpen(false);
            handleLogout();
          }}
          className="flex items-center space-x-3 px-4 py-3 rounded-xl font-sans text-sm font-medium text-rose-300 hover:bg-rose-500/10 hover:text-rose-400 mt-8 transition-colors text-left w-full cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar Portal</span>
        </button>
      </aside>

      {/* 3. TOPBAR + CONTENT PANEL */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Topbar sticky header */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-20 px-8 py-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 text-green-deep hover:bg-gray-100 rounded-xl transition-colors cursor-pointer flex items-center justify-center border border-gray-100 hover:border-green-soft/30 shadow-xs"
              title="Buka Navigasi"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-serif font-bold text-green-deep capitalize">
              {activeTab === 'cms' ? 'CMS Pengelola Konten' : 
               activeTab === 'block' ? 'Manajemen Not Available (Tutup Tanggal)' : 
               activeTab === 'bookings' ? 'Daftar Pemesanan Tamu' : 
               activeTab === 'calendar' ? 'Kalender Ketersediaan' :
               activeTab === 'tours' ? 'Manajemen Paket Wisata' :
               activeTab === 'notifications' ? 'Notifikasi Realtime' :
               activeTab === 'header' ? 'Manajemen Slideshow Header' : 
               activeTab === 'settings' ? 'Pengaturan Homestay' :
               activeTab === 'gallery' ? 'Manajemen Galeri Homestay' : activeTab}
            </h1>
          </div>

          <div className="flex items-center space-x-6">
            {/* Realtime Bells indicator */}
            <button
              onClick={() => setActiveTab('notifications')}
              className="relative p-2 text-gray-500 hover:text-green-deep hover:bg-gray-100 rounded-full transition-colors"
            >
              <Bell className="w-5 h-5" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
              )}
            </button>

            {/* Quick stats indicator */}
            <div className="hidden sm:flex items-center space-x-2 text-xs font-sans text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Server Live Sync</span>
            </div>
          </div>
        </header>

        {/* Content body scrollable */}
        <main className="flex-grow p-8 overflow-y-auto max-w-7xl w-full mx-auto space-y-8">
          
          {/* TAB 1: DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Quick Counter Stats cards row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Pemesanan</span>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="font-serif text-3xl font-bold text-green-deep">{totalBookingsCount}</span>
                    <span className="text-xs font-sans text-gray-500">keseluruhan</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">Menunggu Konfirmasi</span>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="font-serif text-3xl font-bold text-amber-600">{pendingCount}</span>
                    <span className="text-xs font-sans text-amber-500">pending</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">Terkonfirmasi</span>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="font-serif text-3xl font-bold text-emerald-600">{confirmedCount}</span>
                    <span className="text-xs font-sans text-emerald-500">aktif</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-xs font-semibold text-green-soft uppercase tracking-wider">Total Pendapatan</span>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="font-serif text-2xl md:text-3xl font-bold text-green-deep">{convertAndFormatPrice(totalRevenue, 'IDR')}</span>
                    <span className="text-xs font-sans text-green-soft font-semibold">confirmed</span>
                  </div>
                </div>
              </div>

              {/* Dashboard sections split row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left panel: 5 recent bookings table */}
                <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-serif text-lg font-bold text-green-deep">5 Pemesanan Terbaru</h3>
                    <button 
                      onClick={() => setActiveTab('bookings')} 
                      className="text-xs text-green-soft hover:text-green-deep font-semibold"
                    >
                      Lihat Semua &rarr;
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-400 font-semibold uppercase tracking-wider">
                          <th className="pb-3">ID</th>
                          <th className="pb-3">Tamu</th>
                          <th className="pb-3">Check-In</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {bookings.slice(0, 5).map(b => (
                          <tr key={b.id} className="hover:bg-cream/25">
                            <td className="py-3 font-mono font-bold text-green-deep">{b.id}</td>
                            <td className="py-3 font-medium">{b.guest_name}</td>
                            <td className="py-3">{new Date(b.check_in).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</td>
                            <td className="py-3">
                              <select
                                value={b.status}
                                onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value as any)}
                                className={`px-2 py-0.5 rounded-full font-bold text-[10px] outline-none border cursor-pointer uppercase tracking-wider ${
                                  b.status === 'paid'
                                    ? 'bg-emerald-500 text-white border-emerald-600'
                                    : b.status === 'cancelled'
                                      ? 'bg-rose-500 text-white border-rose-600'
                                      : 'bg-amber-100 text-amber-900 border-amber-300'
                                }`}
                              >
                                <option value="pending" className="bg-white text-gray-700">Pending</option>
                                <option value="paid" className="bg-white text-gray-700">Paid</option>
                                <option value="cancelled" className="bg-white text-gray-700">Cancelled</option>
                              </select>
                            </td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => setSelectedBookingDetail(b)}
                                className="p-1 bg-cream hover:bg-sand/30 text-green-deep rounded"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {bookings.length === 0 && (
                          <tr>
                            <td colSpan={5} className="py-6 text-center text-gray-400">Belum ada pemesanan terekam.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right panel: Mini Availability Calendar overview */}
                <div className="lg:col-span-5 space-y-4">
                  <h3 className="font-serif text-lg font-bold text-green-deep">Ketersediaan Bulan Ini</h3>
                  {renderAdminLargeCalendar()}
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: BOOKINGS LIST VIEW */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              
              {/* Toolbar search & sort */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm no-print">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari nama tamu atau ID..."
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-green-soft rounded-xl text-sm outline-none font-sans"
                  />
                </div>

                <div className="flex flex-wrap gap-3 items-center w-full md:w-auto justify-end">
                  <select
                    value={bookingStatusFilter}
                    onChange={(e) => setBookingStatusFilter(e.target.value)}
                    className="px-4 py-2 bg-gray-50 border border-gray-200 focus:border-green-soft rounded-xl text-sm outline-none font-sans"
                  >
                    <option value="all">Semua Status</option>
                    <option value="pending">Menunggu (Pending)</option>
                    <option value="paid">Lunas (Paid)</option>
                    <option value="cancelled">Dibatalkan</option>
                  </select>

                  <select
                    value={bookingSort}
                    onChange={(e) => setBookingSort(e.target.value)}
                    className="px-4 py-2 bg-gray-50 border border-gray-200 focus:border-green-soft rounded-xl text-sm outline-none font-sans"
                  >
                    <option value="newest">Terbaru Dipesan</option>
                    <option value="oldest">Terlama Dipesan</option>
                    <option value="checkin">Check-In Terdekat</option>
                  </select>

                  <button
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
                    onClick={handleExportCSV}
                    className="p-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-sm hover:shadow transition-shadow flex items-center justify-center"
                    title="Export CSV Excel"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handlePrintReport}
                    className="p-2.5 bg-gray-500 hover:bg-gray-600 text-white rounded-xl shadow-sm hover:shadow transition-shadow flex items-center justify-center"
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
                      {processedBookings.map((b, idx) => (
                        <tr key={b.id} className="hover:bg-cream/15 transition-colors">
                          <td className="p-4 font-semibold text-gray-400">{idx + 1}</td>
                          <td className="p-4 font-mono font-bold text-green-deep">{b.id}</td>
                          <td className="p-4">
                            <div>
                              <div className="font-semibold text-text-dark">{b.guest_name}</div>
                              <div className="text-[10px] text-gray-400">{b.guest_email}</div>
                            </div>
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
                            <select
                              value={b.status}
                              onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value as any)}
                              className={`px-2.5 py-1 rounded-xl text-xs font-bold border outline-none cursor-pointer transition-all uppercase tracking-wider ${
                                b.status === 'paid'
                                  ? 'bg-emerald-500 text-white border-emerald-600'
                                  : b.status === 'cancelled'
                                    ? 'bg-rose-500 text-white border-rose-600'
                                    : 'bg-amber-100 text-amber-950 border-amber-300 text-amber-900'
                              }`}
                            >
                              <option value="pending" className="bg-white text-gray-700">Pending</option>
                              <option value="paid" className="bg-white text-gray-700">Paid</option>
                              <option value="cancelled" className="bg-white text-gray-700">Cancelled</option>
                            </select>
                          </td>
                          <td className="p-4 text-right space-x-2 no-print">
                            <button
                              onClick={() => setSelectedBookingDetail(b)}
                              className="p-1.5 bg-cream hover:bg-sand/30 text-green-deep rounded-lg"
                              title="Detail"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteBooking(b.id)}
                              className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {processedBookings.length === 0 && (
                        <tr>
                          <td colSpan={10} className="p-12 text-center text-gray-400 font-sans font-light">
                            Tidak ditemukan data pemesanan tamu yang cocok.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: CALENDAR KETERSEDIAAN VIEW */}
          {activeTab === 'calendar' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-gray-100 p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="space-y-1 text-center md:text-left">
                  <h3 className="font-serif font-bold text-lg text-green-deep">Peta Ketersediaan & Hunian</h3>
                  <p className="font-sans text-xs text-gray-500 leading-relaxed">
                    Kelola ketersediaan kamar homestay. Klik sel tanggal kosong untuk menutup/membuka tanggal secara instan, atau klik pesanan berwarna merah/kuning untuk melihat detail tamu lengkap.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 justify-center items-center text-xs shrink-0 border-t md:border-t-0 border-gray-100 pt-3 md:pt-0 w-full md:w-auto">
                  <div className="flex items-center space-x-2 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-100 shadow-xs">
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-emerald-200 shadow" />
                    <span className="font-bold text-emerald-800 uppercase tracking-wider text-[10px]">Tersedia</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-rose-50 px-2.5 py-1.5 rounded-xl border border-rose-100 shadow-xs">
                    <div className="w-2.5 h-2.5 bg-rose-500 rounded-full shadow-rose-200 shadow" />
                    <span className="font-bold text-rose-800 uppercase tracking-wider text-[10px]">Lunas (Paid)</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-amber-50 px-2.5 py-1.5 rounded-xl border border-amber-100 shadow-xs">
                    <div className="w-2.5 h-2.5 bg-amber-500 rounded-full shadow-amber-200 shadow" />
                    <span className="font-bold text-amber-800 uppercase tracking-wider text-[10px]">Menunggu (Pending)</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-gray-100 px-2.5 py-1.5 rounded-xl border border-gray-200 shadow-xs">
                    <div className="w-2.5 h-2.5 bg-gray-400 rounded-full" />
                    <span className="font-bold text-gray-700 uppercase tracking-wider text-[10px]">Ditutup Admin</span>
                  </div>
                </div>
              </div>

              <div className="max-w-4xl mx-auto">
                {renderAdminLargeCalendar()}
              </div>
            </div>
          )}



          {/* TAB 5: NOTIFICATIONS VIEW */}
          {activeTab === 'notifications' && (
            <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-sand/15 pb-4">
                <h3 className="font-serif text-lg font-bold text-green-deep">Daftar Notifikasi Sistem</h3>
                <button
                  onClick={handleMarkAllNotifsRead}
                  className="text-xs text-green-soft hover:text-green-deep font-semibold"
                >
                  Tandai Semua Dibaca
                </button>
              </div>

              <div className="divide-y divide-gray-50 max-h-[500px] overflow-y-auto space-y-2">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => {
                      handleMarkNotifRead(n.id);
                      setSelectedBookingDetail(n.booking);
                    }}
                    className={`p-4 rounded-2xl flex items-start space-x-4 cursor-pointer transition-all ${
                      n.read ? 'bg-white hover:bg-gray-50' : 'bg-green-50/20 border border-green-soft/10 shadow-sm'
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
                        <span className="text-[10px] text-gray-400 font-sans">{new Date(n.time).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
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
          )}

          {/* TAB 6: CMS MANAGEMENT VIEW */}
          {activeTab === 'cms' && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[500px]">
              
              {/* Left Sub-tabs Sidebar */}
              <div className="w-full md:w-48 border-r border-gray-100 p-4 bg-gray-50/50 flex-shrink-0 flex flex-col space-y-1">
                <button
                  onClick={() => setActiveCmsTab('hero')}
                  className={`px-4 py-2 text-left rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                    activeCmsTab === 'hero' ? 'bg-green-soft text-cream' : 'text-gray-500 hover:bg-gray-100 hover:text-green-deep'
                  }`}
                >
                  Banner Hero
                </button>
                <button
                  onClick={() => setActiveCmsTab('stats')}
                  className={`px-4 py-2 text-left rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                    activeCmsTab === 'stats' ? 'bg-green-soft text-cream' : 'text-gray-500 hover:bg-gray-100 hover:text-green-deep'
                  }`}
                >
                  Statistik Bar
                </button>
                <button
                  onClick={() => setActiveCmsTab('about')}
                  className={`px-4 py-2 text-left rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                    activeCmsTab === 'about' ? 'bg-green-soft text-cream' : 'text-gray-500 hover:bg-gray-100 hover:text-green-deep'
                  }`}
                >
                  Tentang Kami
                </button>
                <button
                  onClick={() => setActiveCmsTab('features')}
                  className={`px-4 py-2 text-left rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                    activeCmsTab === 'features' ? 'bg-green-soft text-cream' : 'text-gray-500 hover:bg-gray-100 hover:text-green-deep'
                  }`}
                >
                  Keunggulan
                </button>
                <button
                  onClick={() => setActiveCmsTab('testimonials')}
                  className={`px-4 py-2 text-left rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                    activeCmsTab === 'testimonials' ? 'bg-green-soft text-cream' : 'text-gray-500 hover:bg-gray-100 hover:text-green-deep'
                  }`}
                >
                  Ulasan Tamu
                </button>
                <button
                  onClick={() => setActiveCmsTab('info')}
                  className={`px-4 py-2 text-left rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                    activeCmsTab === 'info' ? 'bg-green-soft text-cream' : 'text-gray-500 hover:bg-gray-100 hover:text-green-deep'
                  }`}
                >
                  Detail Menginap
                </button>

              </div>

              {/* Right Panel fields Form */}
              <div className="flex-grow p-8 space-y-6">
                
                {activeCmsTab === 'hero' && (
                  <div className="space-y-4">
                    <h4 className="font-serif text-lg font-bold text-green-deep border-b border-gray-100 pb-2">Edit Banner Hero</h4>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-text-dark">Headline (HTML / em supported)</label>
                      <textarea
                        rows={3}
                        value={cmsHero.headline}
                        onChange={(e) => setCmsHero({ ...cmsHero, headline: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft p-3 rounded-xl text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-text-dark">Subheadline</label>
                      <textarea
                        rows={2}
                        value={cmsHero.subheadline}
                        onChange={(e) => setCmsHero({ ...cmsHero, subheadline: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft p-3 rounded-xl text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-text-dark">Badge Rating Google</label>
                      <input
                        type="text"
                        value={cmsHero.badge}
                        onChange={(e) => setCmsHero({ ...cmsHero, badge: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-4 py-2.5 rounded-xl text-sm"
                      />
                    </div>
                    <button
                      onClick={handleSaveCmsHero}
                      disabled={saveStatus !== 'idle'}
                      className="inline-flex items-center space-x-2 bg-green-deep hover:bg-green-mid disabled:bg-gray-400 text-cream font-semibold px-6 py-2.5 rounded-xl text-sm shadow cursor-pointer transition-all"
                    >
                      {saveStatus === 'saving' ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : saveStatus === 'saved' ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Saved</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save changes</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {activeCmsTab === 'stats' && (
                  <div className="space-y-6">
                    <h4 className="font-serif text-lg font-bold text-green-deep border-b border-gray-100 pb-2">Edit Statistik Bar</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {cmsStats.map((stat, idx) => (
                        <div key={idx} className="bg-gray-50 p-4 rounded-2xl border border-gray-150 space-y-3">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Kolom {idx + 1}</span>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Angka / Nilai</label>
                            <input
                              type="text"
                              value={stat.value}
                              onChange={(e) => {
                                const copy = [...cmsStats];
                                copy[idx].value = e.target.value;
                                setCmsStats(copy);
                              }}
                              className="w-full bg-white border border-gray-200 focus:border-green-soft px-3 py-2 rounded-lg text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Label Keterangan</label>
                            <input
                              type="text"
                              value={stat.label}
                              onChange={(e) => {
                                const copy = [...cmsStats];
                                copy[idx].label = e.target.value;
                                setCmsStats(copy);
                              }}
                              className="w-full bg-white border border-gray-200 focus:border-green-soft px-3 py-2 rounded-lg text-sm"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handleSaveCmsStats}
                      disabled={saveStatus !== 'idle'}
                      className="inline-flex items-center space-x-2 bg-green-deep hover:bg-green-mid disabled:bg-gray-400 text-cream font-semibold px-6 py-2.5 rounded-xl text-sm shadow cursor-pointer transition-all"
                    >
                      {saveStatus === 'saving' ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : saveStatus === 'saved' ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Saved</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save changes</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {activeCmsTab === 'about' && (
                  <div className="space-y-6">
                    <div className="border-b border-gray-100 pb-4">
                      <h4 className="font-serif text-lg font-bold text-green-deep">Edit Tentang Kami</h4>
                      <p className="text-xs text-gray-400">Atur deskripsi selamat datang homestay di halaman utama.</p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-text-dark">Judul Utama</label>
                        <input
                          type="text"
                          value={cmsAbout.title}
                          onChange={(e) => setCmsAbout({ ...cmsAbout, title: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-4 py-2.5 rounded-xl text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-text-dark">Teks Deskripsi</label>
                        <textarea
                          rows={4}
                          value={cmsAbout.body}
                          onChange={(e) => setCmsAbout({ ...cmsAbout, body: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft p-3 rounded-xl text-sm"
                        />
                      </div>
                      <button
                        onClick={handleSaveCmsAbout}
                        disabled={saveStatus !== 'idle'}
                        className="inline-flex items-center space-x-2 bg-green-deep hover:bg-green-mid disabled:bg-gray-400 text-cream font-semibold px-5 py-2 rounded-xl text-xs shadow cursor-pointer transition-all active:scale-95"
                      >
                        {saveStatus === 'saving' ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : saveStatus === 'saved' ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Saved</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5" />
                            <span>Save changes</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Highlights Section */}
                    <div className="pt-6 border-t border-gray-100 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h5 className="font-serif text-base font-bold text-green-deep">Manajemen Grid Highlights (4 Cards)</h5>
                          <p className="text-xs text-gray-400">Atur kartu-kartu nilai tambah yang tampil di landing page.</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleOpenAddHighlight}
                          className="inline-flex items-center space-x-1.5 bg-green-soft hover:bg-green-mid text-cream font-semibold px-4 py-2 rounded-xl text-xs shadow cursor-pointer transition-all self-start sm:self-center"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Tambah Highlight</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(homepageData.about.highlightItems || []).map((hl) => (
                          <div 
                            key={hl.id} 
                            className="bg-white border border-gray-100 rounded-xl p-4 flex space-x-4 items-center shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                          >
                            <div className="w-16 h-16 rounded-xl bg-gray-50 overflow-hidden shrink-0 border border-gray-100 relative">
                              {hl.imageUrl ? (
                                <img src={hl.imageUrl} alt={hl.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-green-deep/5 text-green-soft">
                                  <ImageIcon className="w-6 h-6 opacity-40" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0 pr-16">
                              <h6 className="font-sans font-bold text-green-deep text-xs truncate">{hl.title}</h6>
                              <p className="text-[10px] text-gray-400 line-clamp-2 mt-0.5">{hl.description || "Tidak ada deskripsi."}</p>
                            </div>
                            <div className="absolute right-3 flex items-center space-x-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditHighlight(hl)}
                                className="p-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-100 text-gray-700 rounded-lg transition-colors"
                                title="Ubah"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteHighlight(hl.id)}
                                className="p-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-600 rounded-lg transition-colors"
                                title="Hapus"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}

                        {(!homepageData.about.highlightItems || homepageData.about.highlightItems.length === 0) && (
                          <div className="col-span-full py-8 text-center text-gray-400 text-xs bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                            Belum ada highlights. Klik "Tambah Highlight" untuk membuatnya.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeCmsTab === 'features' && (
                  <div className="space-y-6">
                    <h4 className="font-serif text-lg font-bold text-green-deep border-b border-gray-100 pb-2">Edit 6 Keunggulan</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[400px] overflow-y-auto pr-2">
                      {cmsFeatures.map((item, idx) => (
                        <div key={idx} className="bg-gray-50 p-4 rounded-2xl border border-gray-150 space-y-3">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Keunggulan Ke-{idx + 1}</span>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Judul</label>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => {
                                const copy = [...cmsFeatures];
                                copy[idx].title = e.target.value;
                                setCmsFeatures(copy);
                              }}
                              className="w-full bg-white border border-gray-200 focus:border-green-soft px-3 py-1.5 rounded-lg text-xs"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Deskripsi Ringkas</label>
                            <textarea
                              rows={2}
                              value={item.desc}
                              onChange={(e) => {
                                const copy = [...cmsFeatures];
                                copy[idx].desc = e.target.value;
                                setCmsFeatures(copy);
                              }}
                              className="w-full bg-white border border-gray-200 focus:border-green-soft p-2 rounded-lg text-xs"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handleSaveCmsFeatures}
                      disabled={saveStatus !== 'idle'}
                      className="inline-flex items-center space-x-2 bg-green-deep hover:bg-green-mid disabled:bg-gray-400 text-cream font-semibold px-6 py-2.5 rounded-xl text-sm shadow cursor-pointer transition-all"
                    >
                      {saveStatus === 'saving' ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : saveStatus === 'saved' ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Saved</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save changes</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {activeCmsTab === 'testimonials' && (
                  <div className="space-y-6">
                    <h4 className="font-serif text-lg font-bold text-green-deep border-b border-gray-100 pb-2">Edit Ulasan Tamu</h4>
                    <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
                      {cmsTestimonials.map((test, idx) => (
                        <div key={idx} className="bg-gray-50 p-5 rounded-2xl border border-gray-150 space-y-3">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Ulasan Ke-{idx + 1}</span>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Nama Reviewer</label>
                            <input
                              type="text"
                              value={test.author}
                              onChange={(e) => {
                                const copy = [...cmsTestimonials];
                                copy[idx].author = e.target.value;
                                setCmsTestimonials(copy);
                              }}
                              className="w-full bg-white border border-gray-200 focus:border-green-soft px-3 py-1.5 rounded-lg text-xs"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Teks Ulasan</label>
                            <textarea
                              rows={3}
                              value={test.text}
                              onChange={(e) => {
                                const copy = [...cmsTestimonials];
                                copy[idx].text = e.target.value;
                                setCmsTestimonials(copy);
                              }}
                              className="w-full bg-white border border-gray-200 focus:border-green-soft p-2.5 rounded-lg text-xs"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handleSaveCmsTestimonials}
                      disabled={saveStatus !== 'idle'}
                      className="inline-flex items-center space-x-2 bg-green-deep hover:bg-green-mid disabled:bg-gray-400 text-cream font-semibold px-6 py-2.5 rounded-xl text-sm shadow cursor-pointer transition-all"
                    >
                      {saveStatus === 'saving' ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : saveStatus === 'saved' ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Saved</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save changes</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {activeCmsTab === 'info' && (
                  <div className="space-y-4">
                    <h4 className="font-serif text-lg font-bold text-green-deep border-b border-gray-100 pb-2">Detail & Kebijakan Menginap</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-text-dark">Waktu Check-In</label>
                        <input
                          type="text"
                          value={cmsInfo.checkin}
                          onChange={(e) => setCmsInfo({ ...cmsInfo, checkin: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-3 py-2 rounded-xl text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-text-dark">Waktu Check-Out</label>
                        <input
                          type="text"
                          value={cmsInfo.checkout}
                          onChange={(e) => setCmsInfo({ ...cmsInfo, checkout: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-3 py-2 rounded-xl text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-text-dark">Harga Dasar (€ / EUR)</label>
                        <input
                          type="number"
                          value={cmsInfo.price_from}
                          onChange={(e) => setCmsInfo({ ...cmsInfo, price_from: Number(e.target.value) })}
                          className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-3 py-2 rounded-xl text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-text-dark">Fasilitas (1 per baris)</label>
                        <textarea
                          rows={5}
                          value={cmsInfo.facilities.join("\n")}
                          onChange={(e) => setCmsInfo({ ...cmsInfo, facilities: e.target.value.split("\n") })}
                          className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft p-3 rounded-xl text-sm font-sans"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-text-dark">Aktivitas (1 per baris)</label>
                        <textarea
                          rows={5}
                          value={cmsInfo.activities.join("\n")}
                          onChange={(e) => setCmsInfo({ ...cmsInfo, activities: e.target.value.split("\n") })}
                          className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft p-3 rounded-xl text-sm font-sans"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleSaveCmsInfo}
                      disabled={saveStatus !== 'idle'}
                      className="inline-flex items-center space-x-2 bg-green-deep hover:bg-green-mid disabled:bg-gray-400 text-cream font-semibold px-6 py-2.5 rounded-xl text-sm shadow cursor-pointer transition-all"
                    >
                      {saveStatus === 'saving' ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : saveStatus === 'saved' ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Saved</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save changes</span>
                        </>
                      )}
                    </button>
                  </div>
                )}



              </div>
            </div>
          )}

          {/* TAB 4: COMPREHENSIVE TOURS MANAGEMENT VIEW */}
          {activeTab === 'tours' && (
            <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-150 pb-5">
                <div>
                  <h3 className="font-serif text-xl font-bold text-green-deep">Manajemen Paket Wisata</h3>
                  <p className="text-xs text-gray-500">Atur paket pengalaman alam dan kuliner Banyuwangi yang ditawarkan kepada tamu.</p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAddTour}
                  className="inline-flex items-center space-x-1.5 bg-green-deep hover:bg-green-mid text-cream font-semibold px-5 py-2.5 rounded-xl text-xs shadow hover:shadow-md cursor-pointer transition-all self-start sm:self-center active:scale-[0.98]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Paket Wisata</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(homepageData.tours || []).map((tour) => (
                  <div 
                    key={tour.id} 
                    className="bg-white border border-gray-150 rounded-2xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow group"
                  >
                    {/* Image preview */}
                    <div className="aspect-[16/10] w-full bg-gray-50 relative flex-shrink-0 overflow-hidden">
                      {tour.imageUrl ? (
                        <img 
                          src={tour.imageUrl} 
                          alt={tour.name} 
                          referrerPolicy="no-referrer" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-green-deep/5 text-green-soft">
                          <MapPin className="w-10 h-10 opacity-30" />
                        </div>
                      )}
                      <div className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        tour.isActive ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-gray-100 text-gray-800 border border-gray-200'
                      }`}>
                        {tour.isActive ? 'Aktif' : 'Nonaktif'}
                      </div>
                    </div>

                    {/* Tour info */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-serif font-bold text-green-deep text-base line-clamp-1 group-hover:text-green-soft transition-colors">{tour.name}</h4>
                        {tour.price && (
                          <p className="text-xs font-bold text-green-soft">{tour.price}</p>
                        )}
                        <p className="text-xs text-text-mid font-light leading-relaxed line-clamp-3">{tour.description}</p>
                        
                        {tour.inclusions && tour.inclusions.length > 0 && (
                          <div className="pt-2 flex flex-wrap gap-1">
                            {tour.inclusions.map((inc, i) => (
                              <span key={i} className="bg-sand/20 text-text-dark text-[10px] px-2 py-0.5 rounded-md font-medium border border-sand/30">
                                ✓ {inc}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 pt-4 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => handleOpenEditTour(tour)}
                          className="flex-1 px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-semibold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Ubah</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTour(tour.id)}
                          className="flex-1 px-3 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-600 font-semibold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {(!homepageData.tours || homepageData.tours.length === 0) && (
                  <div className="col-span-full py-16 text-center text-gray-400 text-xs">
                    Belum ada paket wisata. Klik "Tambah Paket Wisata" untuk membuatnya.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 7: GALLERY MANAGEMENT VIEW */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              
              <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-lg text-green-deep">Manajemen Galeri Homestay</h3>
                  <p className="font-sans text-xs text-gray-500">Kelola visual, kategori, atau ubah urutan tampilan galeri dengan menekan tombol panah naik-turun.</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleResetGallery}
                    className="border border-rose-200 hover:bg-rose-50 text-rose-600 font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center space-x-2 shadow-sm cursor-pointer"
                    title="Reset seluruh foto galeri ke bawaan jika memori penyimpanan penuh."
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Reset Galeri</span>
                  </button>
                  <button
                    onClick={handleOpenAddGallery}
                    className="bg-green-soft hover:bg-green-deep text-cream font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center space-x-2 shadow cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Foto</span>
                  </button>
                </div>
              </div>

              {/* Gallery Items Cards List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...galleryData]
                  .filter(item => item.showInGallery !== false)
                  .sort((a, b) => a.order - b.order)
                  .map((item, idx, arr) => (
                    <div key={item.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-4">
                      <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-gray-50 border flex items-center justify-center relative">
                        {item.url ? (
                          <img src={item.url} alt={item.label} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-mono text-xs font-semibold" style={{ color: item.color }}>Placeholder Illustration</span>
                        )}
                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-full font-mono">
                          Urutan: {item.order}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-serif font-bold text-sm text-green-deep">{item.label}</h4>
                            <div className="flex items-center space-x-2">
                              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider font-sans">{item.category}</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {item.showInSlideshow !== false ? (
                                <span className="bg-amber-50 text-amber-700 text-[9px] font-bold px-1.5 py-0.5 rounded border border-amber-200">Header Slide</span>
                              ) : null}
                              {item.showInGallery !== false ? (
                                <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-200">Menu Galeri</span>
                              ) : null}
                              {item.showInSlideshow === false && item.showInGallery === false ? (
                                <span className="bg-gray-100 text-gray-400 text-[9px] font-bold px-1.5 py-0.5 rounded border border-gray-200">Sembunyi</span>
                              ) : null}
                            </div>
                          </div>
                        </div>

                        {/* Control arrows for manual reordering */}
                        <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                          <div className="flex space-x-1">
                            <button
                              disabled={idx === 0}
                              onClick={() => handleMoveGalleryItem(item.id, 'up', false)}
                              className="p-1 bg-gray-100 hover:bg-green-soft/15 hover:text-green-deep text-gray-500 rounded disabled:opacity-30"
                              title="Geser Naik"
                            >
                              <ChevronLeft className="w-4 h-4 rotate-90" />
                            </button>
                            <button
                              disabled={idx === arr.length - 1}
                              onClick={() => handleMoveGalleryItem(item.id, 'down', false)}
                              className="p-1 bg-gray-100 hover:bg-green-soft/15 hover:text-green-deep text-gray-500 rounded disabled:opacity-30"
                              title="Geser Turun"
                            >
                              <ChevronRight className="w-4 h-4 rotate-90" />
                            </button>
                          </div>

                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleOpenEditGallery(item)}
                              className="p-1.5 bg-gray-50 hover:bg-green-soft/10 text-green-soft rounded-lg"
                              title="Ubah"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteGalleryItem(item.id)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg"
                              title="Hapus"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  ))}
              </div>

            </div>
          )}

          {/* TAB 7.5: HEADER MANAGEMENT VIEW */}
          {activeTab === 'header' && (
            <div className="space-y-6">
              
              <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-lg text-green-deep">Manajemen Slideshow Header</h3>
                  <p className="font-sans text-xs text-gray-500">Kelola foto latar belakang berputar (slideshow) di bagian atas Landing Page. Disarankan rasio lanskap 16:9.</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleResetGallery}
                    className="border border-rose-200 hover:bg-rose-50 text-rose-600 font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center space-x-2 shadow-sm cursor-pointer"
                    title="Reset seluruh foto ke bawaan jika memori penyimpanan penuh."
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Reset Slideshow</span>
                  </button>
                  <button
                    onClick={handleOpenAddGallery}
                    className="bg-green-soft hover:bg-green-deep text-cream font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center space-x-2 shadow cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Slide</span>
                  </button>
                </div>
              </div>

              {/* Header Slides List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...galleryData]
                  .filter(item => item.showInSlideshow !== false)
                  .sort((a, b) => a.order - b.order)
                  .map((item, idx, arr) => (
                    <div key={item.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-4">
                      <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-gray-50 border flex items-center justify-center relative">
                        {item.url ? (
                          <img src={item.url} alt={item.label} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-mono text-xs font-semibold" style={{ color: item.color }}>Placeholder Illustration</span>
                        )}
                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-full font-mono">
                          Slide #{idx + 1} (Urutan: {item.order})
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-serif font-bold text-sm text-green-deep">{item.label}</h4>
                            <div className="flex items-center space-x-2">
                              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider font-sans">{item.category}</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {item.showInSlideshow !== false ? (
                                <span className="bg-amber-50 text-amber-700 text-[9px] font-bold px-1.5 py-0.5 rounded border border-amber-200">Header Slide</span>
                              ) : null}
                              {item.showInGallery !== false ? (
                                <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-200">Menu Galeri</span>
                              ) : null}
                              {item.showInSlideshow === false && item.showInGallery === false ? (
                                <span className="bg-gray-100 text-gray-400 text-[9px] font-bold px-1.5 py-0.5 rounded border border-gray-200">Sembunyi</span>
                              ) : null}
                            </div>
                          </div>
                        </div>

                        {/* Control arrows for manual reordering */}
                        <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                          <div className="flex space-x-1">
                            <button
                              disabled={idx === 0}
                              onClick={() => handleMoveGalleryItem(item.id, 'up', true)}
                              className="p-1 bg-gray-100 hover:bg-green-soft/15 hover:text-green-deep text-gray-500 rounded disabled:opacity-30"
                              title="Geser Naik"
                            >
                              <ChevronLeft className="w-4 h-4 rotate-90" />
                            </button>
                            <button
                              disabled={idx === arr.length - 1}
                              onClick={() => handleMoveGalleryItem(item.id, 'down', true)}
                              className="p-1 bg-gray-100 hover:bg-green-soft/15 hover:text-green-deep text-gray-500 rounded disabled:opacity-30"
                              title="Geser Turun"
                            >
                              <ChevronRight className="w-4 h-4 rotate-90" />
                            </button>
                          </div>

                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleOpenEditGallery(item)}
                              className="p-1.5 bg-gray-50 hover:bg-green-soft/10 text-green-soft rounded-lg"
                              title="Ubah"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteGalleryItem(item.id)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg"
                              title="Hapus"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  ))}
              </div>

            </div>
          )}

          {/* TAB 8: SYSTEM SETTINGS VIEW */}
          {activeTab === 'settings' && (
            <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-green-deep border-b border-gray-100 pb-4 mb-6">
                Pengaturan Umum Homestay & Kredensial Admin
              </h3>

              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-dark">Nama Homestay</label>
                    <input
                      type="text"
                      required
                      value={setHomestayName}
                      onChange={(e) => setSetHomestayName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-4 py-2.5 rounded-xl text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-dark">Tagline Utama</label>
                    <input
                      type="text"
                      required
                      value={setTagline}
                      onChange={(e) => setSetTagline(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-4 py-2.5 rounded-xl text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-dark">Nomor WhatsApp Bisnis</label>
                    <input
                      type="text"
                      required
                      placeholder="+62 812-3380-0631"
                      value={setWa}
                      onChange={(e) => setSetWa(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-4 py-2.5 rounded-xl text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-dark">Instagram Handle</label>
                    <input
                      type="text"
                      required
                      placeholder="@penohomestaybanyuwangi"
                      value={setInsta}
                      onChange={(e) => setSetInsta(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-4 py-2.5 rounded-xl text-sm"
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold text-text-dark">Alamat Lengkap</label>
                    <textarea
                      rows={2}
                      required
                      value={setAddress}
                      onChange={(e) => setSetAddress(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft p-3 rounded-xl text-sm font-sans"
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold text-text-dark">Google Maps Share URL Link</label>
                    <input
                      type="text"
                      required
                      value={setMaps}
                      onChange={(e) => setSetMaps(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-4 py-2.5 rounded-xl text-sm"
                    />
                  </div>

                  {/* Pricing / Times */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-dark">Harga Dasar Per Malam (EUR)</label>
                    <input
                      type="number"
                      required
                      value={setPrice}
                      onChange={(e) => setSetPrice(Number(e.target.value))}
                      className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-4 py-2.5 rounded-xl text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text-dark">Hero Slider Image Opacity (%)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="100"
                      value={setHeroOverlayOpacity}
                      onChange={(e) => setSetHeroOverlayOpacity(Number(e.target.value))}
                      className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-4 py-2.5 rounded-xl text-sm"
                    />
                    <p className="text-[10px] text-gray-400">0% = Transparan penuh, 100% = Foto jelas (overlay gelap hilang)</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-text-dark">Check-In</label>
                      <input
                        type="text"
                        required
                        value={setInTime}
                        onChange={(e) => setSetInTime(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-4 py-2.5 rounded-xl text-sm text-center"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-text-dark">Check-Out</label>
                      <input
                        type="text"
                        required
                        value={setOutTime}
                        onChange={(e) => setSetOutTime(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-4 py-2.5 rounded-xl text-sm text-center"
                      />
                    </div>
                  </div>

                  {/* KREDENSIAL */}
                  <div className="col-span-1 md:col-span-2 border-t border-gray-100 pt-6 mt-2 space-y-4">
                    <h4 className="font-serif text-base font-bold text-green-deep">Kredensial Autentikasi Admin</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-text-dark">Username Admin Portal</label>
                        <input
                          type="text"
                          required
                          value={setAdminUser}
                          onChange={(e) => setSetAdminUser(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-4 py-2.5 rounded-xl text-sm"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-text-dark flex justify-between">
                          <span>Password Admin Portal</span>
                          <button
                            type="button"
                            onClick={() => setShowAdminPass(!showAdminPass)}
                            className="text-green-soft hover:text-green-deep text-[10px]"
                          >
                            {showAdminPass ? "Sembunyikan" : "Tampilkan"}
                          </button>
                        </label>
                        <input
                          type={showAdminPass ? "text" : "password"}
                          required
                          value={setAdminPass}
                          onChange={(e) => setSetAdminPass(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-4 py-2.5 rounded-xl text-sm"
                        />
                      </div>
                    </div>

                  </div>

                </div>

                <button
                  type="submit"
                  disabled={saveStatus !== 'idle'}
                  className="inline-flex items-center space-x-2 bg-green-deep hover:bg-green-mid disabled:bg-gray-400 text-cream font-semibold px-8 py-3 rounded-full shadow cursor-pointer text-sm transition-all hover:-translate-y-0.5 active:scale-95"
                >
                  {saveStatus === 'saving' ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : saveStatus === 'saved' ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Saved</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save changes</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* 3. BOOKING DETAIL MODAL */}
      <AnimatePresence>
        {selectedBookingDetail && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl relative space-y-6"
            >
              <button
                onClick={() => setSelectedBookingDetail(null)}
                className="absolute top-4 right-4 p-2 bg-cream/40 hover:bg-cream hover:text-rose-500 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="border-b border-gray-100 pb-3">
                <h3 className="font-serif text-2xl font-bold text-green-deep flex items-center space-x-2">
                  <span>Rincian Pemesanan</span>
                  <span className="text-xs font-mono px-3 py-1 bg-green-soft/10 text-green-deep rounded-full border border-green-soft/20 uppercase font-bold tracking-wider">{selectedBookingDetail.id}</span>
                </h3>
                <p className="text-xs text-gray-400 font-sans mt-1">Dipesan pada: {new Date(selectedBookingDetail.created_at).toLocaleString('id-ID')}</p>
              </div>

              {/* Data fields list */}
              <div className="grid grid-cols-2 gap-y-3 font-sans text-sm border-b border-gray-50 pb-4">
                <span className="text-gray-400">Nama Tamu</span>
                <span className="text-right font-semibold text-text-dark">{selectedBookingDetail.guest_name}</span>

                <span className="text-gray-400">Email</span>
                <span className="text-right font-semibold text-text-dark truncate">{selectedBookingDetail.guest_email}</span>

                <span className="text-gray-400">WhatsApp</span>
                <span className="text-right font-semibold text-text-dark">{selectedBookingDetail.guest_wa}</span>

                <span className="text-gray-400">Jumlah Tamu</span>
                <span className="text-right font-semibold text-text-dark">{selectedBookingDetail.guest_count} orang</span>

                <span className="text-gray-400">Mulai Check-In</span>
                <span className="text-right font-semibold text-green-deep">
                  {new Date(selectedBookingDetail.check_in).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>

                <span className="text-gray-400">Mulai Check-Out</span>
                <span className="text-right font-semibold text-green-deep">
                  {new Date(selectedBookingDetail.check_out).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>

                <span className="text-gray-400">Durasi Tinggal</span>
                <span className="text-right font-semibold text-text-dark">{selectedBookingDetail.nights} malam</span>

                <span className="text-gray-400">Estimasi Tagihan</span>
                <span className="text-right font-serif font-bold text-green-deep text-base">{convertAndFormatPrice(selectedBookingDetail.total_eur, 'IDR')}</span>

                <span className="text-gray-400">Status</span>
                <span className="text-right">
                  <select
                    value={selectedBookingDetail.status}
                    onChange={(e) => handleUpdateBookingStatus(selectedBookingDetail.id, e.target.value as any)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold border outline-none cursor-pointer transition-all uppercase tracking-wider ${
                      selectedBookingDetail.status === 'paid'
                        ? 'bg-emerald-500 text-white border-emerald-600'
                        : selectedBookingDetail.status === 'cancelled'
                          ? 'bg-rose-500 text-white border-rose-600'
                          : 'bg-amber-100 text-amber-900 border-amber-300'
                    }`}
                  >
                    <option value="pending" className="bg-white text-gray-700">Pending</option>
                    <option value="paid" className="bg-white text-gray-700">Paid</option>
                    <option value="cancelled" className="bg-white text-gray-700">Cancelled</option>
                  </select>
                </span>
              </div>

              {/* Guest Notes box */}
              {selectedBookingDetail.notes && (
                <div className="bg-cream/40 p-4 rounded-xl border border-sand/20 space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-sans">Catatan Permintaan</span>
                  <p className="text-xs text-text-mid font-sans font-light leading-relaxed">"{selectedBookingDetail.notes}"</p>
                </div>
              )}

              {/* Modal controls */}
              <div className="flex flex-col gap-3 pt-2">
                <a
                  href={getAdminWhatsAppLink(selectedBookingDetail)}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white font-sans font-semibold py-3.5 rounded-full shadow-md text-sm transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 fill-white text-white" />
                  <span>Kirim Konfirmasi via WhatsApp</span>
                </a>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleDeleteBooking(selectedBookingDetail.id)}
                    className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-3.5 rounded-full font-sans font-semibold text-xs transition-colors"
                  >
                    Hapus Permanen
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. GALLERY ADD/EDIT MODAL */}
      {/* 🌟 HIGHLIGHTS ADD/EDIT MODAL */}
      <AnimatePresence>
        {showHighlightModal && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <button
                type="button"
                onClick={() => setShowHighlightModal(false)}
                className="absolute top-4 right-4 p-2 bg-cream/40 hover:bg-cream hover:text-rose-500 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="border-b border-gray-150 pb-3">
                <h3 className="font-serif text-xl font-bold text-green-deep flex items-center space-x-2">
                  <span className="p-1.5 bg-green-deep/10 rounded-lg text-green-deep">
                    <Star className="w-5 h-5 fill-green-deep" />
                  </span>
                  <span>{editingHighlight ? 'Ubah Highlight' : 'Tambah Highlight Baru'}</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">Buat atau ubah kartu nilai tambah yang tampil di landing page.</p>
              </div>

              <form onSubmit={handleSaveHighlight} className="space-y-4 font-sans">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Judul Highlight <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Lush Coffee Plantation"
                    value={highlightTitle}
                    onChange={(e) => setHighlightTitle(e.target.value)}
                    className="w-full bg-cream/15 border border-sand/40 hover:border-sand focus:border-green-soft px-3.5 py-2.5 rounded-xl text-sm text-text-dark outline-none focus:ring-1 focus:ring-green-soft transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Deskripsi Singkat</label>
                  <textarea
                    rows={3}
                    placeholder="Contoh: Tur keliling kebun kopi, belajar cara panen, sangrai tradisional..."
                    value={highlightDescription}
                    onChange={(e) => setHighlightDescription(e.target.value)}
                    className="w-full bg-cream/15 border border-sand/40 hover:border-sand focus:border-green-soft p-3 rounded-xl text-sm text-text-dark outline-none focus:ring-1 focus:ring-green-soft transition-all"
                  />
                </div>

                {/* IMAGE TAB SELECTOR */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Foto Highlight</label>
                  <div className="flex border border-gray-150 rounded-xl p-1 bg-gray-50">
                    <button
                      type="button"
                      onClick={() => setActiveHighlightTab('upload')}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        activeHighlightTab === 'upload' ? 'bg-white shadow-sm text-green-deep' : 'text-gray-400 hover:text-green-soft'
                      }`}
                    >
                      Unggah File Gambar
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveHighlightTab('url')}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        activeHighlightTab === 'url' ? 'bg-white shadow-sm text-green-deep' : 'text-gray-400 hover:text-green-soft'
                      }`}
                    >
                      Alamat URL Gambar
                    </button>
                  </div>

                  {activeHighlightTab === 'upload' ? (
                    <div className="space-y-3">
                      {/* Drag and Drop Zone */}
                      <div 
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                          dragActive 
                            ? 'border-green-soft bg-green-deep/5 scale-[0.99]' 
                            : 'border-sand/40 hover:border-sand bg-cream/5 hover:bg-cream/10'
                        }`}
                      >
                        <Upload className="w-8 h-8 mx-auto text-green-soft/60 mb-2" />
                        <p className="text-xs font-bold text-green-deep">Klik untuk memilih atau seret gambar ke sini</p>
                        <p className="text-[10px] text-gray-400 mt-1">PNG, JPG, JPEG (Maks. 2MB). Kompresi otomatis aktif.</p>
                        <input 
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileSelectChange}
                        />
                      </div>

                      {/* Preview Image */}
                      {highlightImageUrl && (
                        <div className="flex items-center space-x-3 bg-gray-50 border border-gray-150 p-2.5 rounded-xl">
                          <img 
                            src={highlightImageUrl} 
                            alt="Preview" 
                            className="w-12 h-12 object-cover rounded-lg border border-gray-200" 
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold text-green-deep truncate">Pratinjau Gambar</p>
                            <p className="text-[9px] text-gray-400 truncate">Selesai dimuat lokal atau diunggah.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setHighlightImageUrl("")}
                            className="p-1 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-rose-50"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      {/* File selected indicator */}
                      {selectedImageFile && (
                        <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-bold text-emerald-800 truncate">Berkas siap: {selectedImageFile.name}</p>
                            <p className="text-[9px] text-emerald-600">Akan diunggah otomatis saat Anda mengklik tombol "Save changes" di bawah.</p>
                          </div>
                        </div>
                      )}

                      {uploadError && (
                        <p className="text-[10px] font-bold text-rose-500">{uploadError}</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <input
                        type="url"
                        placeholder="Masukkan alamat URL foto (https://...)"
                        value={highlightImageUrl}
                        onChange={(e) => setHighlightImageUrl(e.target.value)}
                        className="w-full bg-cream/15 border border-sand/40 hover:border-sand focus:border-green-soft px-3.5 py-2.5 rounded-xl text-sm text-text-dark outline-none focus:ring-1 focus:ring-green-soft transition-all"
                      />
                      {highlightImageUrl && (
                        <div className="mt-2 aspect-[16/10] bg-gray-50 border border-gray-150 rounded-xl overflow-hidden">
                          <img 
                            src={highlightImageUrl} 
                            alt="Preview" 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=600&h=400&q=80';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex space-x-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowHighlightModal(false)}
                    className="flex-1 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition-colors text-center"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saveStatus !== 'idle'}
                    className="flex-1 py-3 bg-green-deep hover:bg-green-mid disabled:bg-gray-400 text-cream font-semibold rounded-xl text-xs shadow transition-all hover:-translate-y-0.5 active:scale-95 text-center flex items-center justify-center space-x-2"
                  >
                    {saveStatus === 'saving' ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : saveStatus === 'saved' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Saved</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Save changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. OFFLINE BOOKING ADD MODAL */}
      <AnimatePresence>
        {showAddOfflineModal && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <button
                type="button"
                onClick={() => setShowAddOfflineModal(false)}
                className="absolute top-4 right-4 p-2 bg-cream/40 hover:bg-cream hover:text-rose-500 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="border-b border-gray-150 pb-3">
                <h3 className="font-serif text-xl font-bold text-green-deep flex items-center space-x-2">
                  <span className="p-1.5 bg-green-deep/10 rounded-lg text-green-deep">
                    <CalendarRange className="w-5 h-5" />
                  </span>
                  <span>Tambah Booking Offline</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">Dipesan & Bayar langsung (Offline). Ketersediaan kalender & laporan keuangan akan langsung ter-sinkronisasi.</p>
              </div>

              <form onSubmit={handleSaveOfflineBooking} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Nama Tamu <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso"
                    value={offlineGuestName}
                    onChange={(e) => setOfflineGuestName(e.target.value)}
                    className="w-full bg-cream/15 border border-sand/40 hover:border-sand focus:border-green-soft px-3.5 py-2.5 rounded-xl font-sans text-sm text-text-dark outline-none focus:ring-1 focus:ring-green-soft transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">No WhatsApp / HP <span className="text-rose-500">*</span></label>
                    <input
                      type="tel"
                      required
                      placeholder="Contoh: 08123456789"
                      value={offlineGuestWa}
                      onChange={(e) => setOfflineGuestWa(e.target.value)}
                      className="w-full bg-cream/15 border border-sand/40 hover:border-sand focus:border-green-soft px-3.5 py-2.5 rounded-xl font-sans text-sm text-text-dark outline-none focus:ring-1 focus:ring-green-soft transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Email (Opsional)</label>
                    <input
                      type="email"
                      placeholder="Contoh: budi@gmail.com"
                      value={offlineGuestEmail}
                      onChange={(e) => setOfflineGuestEmail(e.target.value)}
                      className="w-full bg-cream/15 border border-sand/40 hover:border-sand focus:border-green-soft px-3.5 py-2.5 rounded-xl font-sans text-sm text-text-dark outline-none focus:ring-1 focus:ring-green-soft transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Check-In <span className="text-rose-500">*</span></label>
                    <input
                      type="date"
                      required
                      value={offlineCheckIn}
                      onChange={(e) => setOfflineCheckIn(e.target.value)}
                      className="w-full bg-cream/15 border border-sand/40 hover:border-sand focus:border-green-soft px-3.5 py-2.5 rounded-xl font-sans text-sm text-text-dark outline-none focus:ring-1 focus:ring-green-soft transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Check-Out <span className="text-rose-500">*</span></label>
                    <input
                      type="date"
                      required
                      value={offlineCheckOut}
                      onChange={(e) => setOfflineCheckOut(e.target.value)}
                      className="w-full bg-cream/15 border border-sand/40 hover:border-sand focus:border-green-soft px-3.5 py-2.5 rounded-xl font-sans text-sm text-text-dark outline-none focus:ring-1 focus:ring-green-soft transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Jumlah Tamu</label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={offlineGuestCount}
                      onChange={(e) => setOfflineGuestCount(parseInt(e.target.value) || 1)}
                      className="w-full bg-cream/15 border border-sand/40 hover:border-sand focus:border-green-soft px-3.5 py-2.5 rounded-xl font-sans text-sm text-text-dark outline-none focus:ring-1 focus:ring-green-soft transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Tarif yang Dibayarkan (Rp)</label>
                    <input
                      type="number"
                      min={0}
                      step={10000}
                      required
                      value={offlinePriceIdr}
                      onChange={(e) => setOfflinePriceIdr(parseInt(e.target.value) || 0)}
                      className="w-full bg-cream/15 border border-sand/40 hover:border-sand focus:border-green-soft px-3.5 py-2.5 rounded-xl font-sans text-sm text-text-dark outline-none focus:ring-1 focus:ring-green-soft transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Catatan Tambahan (Opsional)</label>
                  <textarea
                    rows={2}
                    placeholder="Contoh: Dibayar lunas tunai di tempat"
                    value={offlineNotes}
                    onChange={(e) => setOfflineNotes(e.target.value)}
                    className="w-full bg-cream/15 border border-sand/40 hover:border-sand focus:border-green-soft p-3 rounded-xl font-sans text-sm text-text-dark outline-none focus:ring-1 focus:ring-green-soft transition-all"
                  />
                </div>

                {offlineCheckIn && offlineCheckOut && (
                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 space-y-1.5 text-xs text-emerald-800">
                    <div className="flex justify-between">
                      <span className="font-medium">Durasi Menginap:</span>
                      <span className="font-bold">{calculateNights(offlineCheckIn, offlineCheckOut)} malam</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Status Pembayaran:</span>
                      <span className="font-bold uppercase tracking-wider text-emerald-600">Lunas & Terkunci (Paid)</span>
                    </div>
                    <div className="flex justify-between border-t border-emerald-100 pt-1.5 font-bold">
                      <span>Total Masuk Keuangan:</span>
                      <span className="font-mono text-sm">{convertAndFormatPrice(Number((offlinePriceIdr / 17500).toFixed(4)), 'IDR')}</span>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddOfflineModal(false)}
                    className="flex-1 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition-colors text-center"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-green-deep hover:bg-green-mid text-cream font-semibold rounded-xl text-xs shadow transition-all hover:-translate-y-0.5 active:scale-95 text-center"
                  >
                    Simpan Booking Offline
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddGalleryModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 md:p-7 max-w-2xl w-full shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowAddGalleryModal(false)}
                className="absolute top-4 right-4 p-2 bg-cream/40 hover:bg-cream hover:text-rose-500 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="border-b border-gray-100 pb-2">
                <h3 className="font-serif text-xl md:text-2xl font-bold text-green-deep">
                  {editingGalleryItem ? "Ubah Foto Galeri" : "Tambah Foto Baru"}
                </h3>
              </div>

              <form onSubmit={handleSaveGalleryItem} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Left Column: Metadata Details */}
                  <div className="space-y-2.5">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-0.5">
                        <label className="text-[11px] font-bold text-text-dark">Caption / Label Foto</label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Kamar Utama"
                          value={galleryLabel}
                          onChange={(e) => setGalleryLabel(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-2.5 py-1.5 rounded-xl text-xs"
                        />
                      </div>

                      <div className="space-y-0.5">
                        <label className="text-[11px] font-bold text-text-dark">Kategori</label>
                        <select
                          value={galleryCategory}
                          onChange={(e) => setGalleryCategory(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-2 py-1.5 rounded-xl text-xs"
                        >
                          <option value="Alam">Alam & Sungai</option>
                          <option value="Kamar">Kamar & Akomodasi</option>
                          <option value="Kuliner">Kuliner & Sarapan</option>
                          <option value="Aktivitas">Aktivitas & Tur</option>
                          <option value="Sekitar">Sekitar Banyuwangi</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-0.5">
                        <label className="text-[11px] font-bold text-text-dark block truncate">Warna Placeholder</label>
                        <div className="flex space-x-1.5 items-center">
                          <input
                            type="color"
                            value={galleryColor}
                            onChange={(e) => setGalleryColor(e.target.value)}
                            className="w-7 h-7 border border-gray-200 rounded-lg cursor-pointer p-0.5 bg-white shrink-0"
                          />
                          <input
                            type="text"
                            required
                            value={galleryColor}
                            onChange={(e) => setGalleryColor(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 px-1.5 py-1 rounded-lg text-[10px] font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        <label className="text-[11px] font-bold text-text-dark">No. Urutan</label>
                        <input
                          type="number"
                          required
                          value={galleryOrder}
                          onChange={(e) => setGalleryOrder(Number(e.target.value))}
                          className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-2 py-1 rounded-lg text-xs"
                        />
                      </div>
                    </div>


                  </div>

                  {/* Right Column: Media Upload / URL Source */}
                  <div className="space-y-2.5 border-t md:border-t-0 md:border-l border-gray-150 pt-2.5 md:pt-0 md:pl-4">
                    <div className="flex border-b border-gray-100">
                      <button
                        type="button"
                        onClick={() => setActiveGalleryTab('upload')}
                        className={`flex-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-center border-b-2 transition-all ${
                          activeGalleryTab === 'upload' ? 'border-green-deep text-green-deep font-bold' : 'border-transparent text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        Unggah File Foto
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveGalleryTab('url')}
                        className={`flex-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-center border-b-2 transition-all ${
                          activeGalleryTab === 'url' ? 'border-green-deep text-green-deep font-bold' : 'border-transparent text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        Tautan URL Gambar
                      </button>
                    </div>

                    {activeGalleryTab === 'upload' ? (
                      <div className="space-y-2">
                        {/* Drag and Drop Zone */}
                        <div
                          onDragEnter={handleDrag}
                          onDragOver={handleDrag}
                          onDragLeave={handleDrag}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-1 ${
                            dragActive 
                              ? 'border-green-deep bg-green-50/10 scale-[0.99]' 
                              : 'border-gray-200 hover:border-green-soft bg-gray-50/50 hover:bg-white'
                          }`}
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelectChange}
                            className="hidden"
                          />
                          
                          {galleryUrl ? (
                            <div className="relative group w-full aspect-video max-h-24 rounded-lg overflow-hidden border">
                              <img src={galleryUrl} alt="Preview" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                <span className="text-white text-[9px] font-semibold bg-green-deep px-2 py-0.5 rounded-md shadow">Ganti Foto</span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-3 text-left w-full py-0.5">
                              <div className="p-1.5 bg-green-soft/10 text-green-deep rounded-full shrink-0">
                                <Upload className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-text-dark">Pilih foto atau seret ke sini</p>
                                <p className="text-[8px] text-gray-400">JPG, PNG, WEBP (Maks 5MB)</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Info / Actions if file selected */}
                        {selectedImageFile && (
                          <div className="bg-emerald-50 rounded-xl p-2.5 border border-emerald-100 flex items-center space-x-2 text-left">
                            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-[10px] font-bold text-emerald-800 truncate">Berkas siap: {selectedImageFile.name}</p>
                              <p className="text-[9px] text-emerald-600 leading-normal">
                                Berkas terkompresi otomatis. Foto akan disimpan dan diunggah otomatis saat Anda mengklik "Save changes" di bawah.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedImageFile(null);
                                setGalleryUrl("");
                                if (fileInputRef.current) fileInputRef.current.value = "";
                              }}
                              className="text-rose-500 hover:text-rose-700 font-bold flex-shrink-0 text-[10px] pl-2 border-l border-emerald-200"
                            >
                              Batal
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1.5 text-left">
                        <label className="text-xs font-semibold text-text-dark">URL Tautan Gambar (HTTP Link)</label>
                        <input
                          type="text"
                          placeholder="https://example.com/images/room.jpg"
                          value={galleryUrl}
                          onChange={(e) => setGalleryUrl(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-3 py-2 rounded-xl text-xs"
                        />
                        <p className="text-[9px] text-gray-400 leading-relaxed mt-1">
                          Gunakan URL jika gambar sudah dihosting di tempat lain seperti Supabase Storage, Imgur, Cloudinary, atau platform lainnya.
                        </p>
                      </div>
                    )}
                  </div>

                </div>

                {/* Bottom Bar: Action buttons */}
                <div className="pt-3 border-t border-gray-100 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowAddGalleryModal(false)}
                    className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-500 rounded-xl font-semibold text-xs transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saveStatus !== 'idle'}
                    className="px-5 py-2 bg-green-deep hover:bg-green-mid disabled:bg-gray-400 text-cream font-semibold rounded-xl transition-all shadow text-xs flex items-center space-x-1.5"
                  >
                    {saveStatus === 'saving' ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : saveStatus === 'saved' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Saved</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Save changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. TOUR ADD/EDIT MODAL */}
      <AnimatePresence>
        {showTourModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 md:p-7 max-w-3xl w-full shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <button
                type="button"
                onClick={() => setShowTourModal(false)}
                className="absolute top-4 right-4 p-2 bg-cream/40 hover:bg-cream hover:text-rose-500 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="border-b border-gray-100 pb-2">
                <h3 className="font-serif text-xl md:text-2xl font-bold text-green-deep">
                  {editingTour ? "Ubah Paket Wisata" : "Tambah Paket Wisata"}
                </h3>
              </div>

              <form onSubmit={handleSaveTour} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Left Column: Form Details */}
                  <div className="space-y-3">
                    <div className="space-y-0.5">
                      <label className="text-[11px] font-bold text-text-dark">Nama Paket Wisata</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Kawah Ijen Blue Fire Tour"
                        value={tourName}
                        onChange={(e) => setTourName(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-3 py-2 rounded-xl text-xs"
                      />
                    </div>

                    <div className="space-y-0.5">
                      <label className="text-[11px] font-bold text-text-dark">Harga Paket Wisata (Bisa teks bebas)</label>
                      <input
                        type="text"
                        placeholder="Contoh: Rp 350.000 / orang, atau Hubungi Kami"
                        value={tourPrice}
                        onChange={(e) => setTourPrice(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-3 py-2 rounded-xl text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-0.5">
                        <label className="text-[11px] font-bold text-text-dark">WhatsApp Kontak</label>
                        <input
                          type="text"
                          required
                          placeholder="+628123456789"
                          value={tourPhone}
                          onChange={(e) => setTourPhone(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-3 py-2 rounded-xl text-xs font-mono"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <label className="text-[11px] font-bold text-text-dark">Instagram Kontak</label>
                        <input
                          type="text"
                          placeholder="@username"
                          value={tourSocial}
                          onChange={(e) => setTourSocial(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-3 py-2 rounded-xl text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <label className="text-[11px] font-bold text-text-dark">Deskripsi Singkat Paket</label>
                      <textarea
                        rows={3}
                        placeholder="Berikan gambaran aktivitas tur, rute, atau pengalaman yang akan didapatkan..."
                        value={tourDescription}
                        onChange={(e) => setTourDescription(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft p-3 rounded-xl text-xs leading-relaxed"
                      />
                    </div>

                    <div className="space-y-0.5">
                      <label className="text-[11px] font-bold text-text-dark">Fasilitas / Inklusi Tur (Pisahkan dengan koma)</label>
                      <textarea
                        rows={2}
                        placeholder="Contoh: Tiket Masuk, Air Mineral, Masker Gas, Pemandu Lokal"
                        value={tourInclusions}
                        onChange={(e) => setTourInclusions(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft p-3 rounded-xl text-xs leading-relaxed"
                      />
                      <p className="text-[9px] text-gray-400">Setiap fasilitas dipisahkan tanda koma (,)</p>
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                      <input
                        type="checkbox"
                        id="tourIsActive"
                        checked={tourIsActive}
                        onChange={(e) => setTourIsActive(e.target.checked)}
                        className="rounded text-green-soft focus:ring-green-soft w-4 h-4"
                      />
                      <label htmlFor="tourIsActive" className="text-xs font-semibold text-text-dark select-none cursor-pointer">
                        Aktifkan paket wisata ini agar langsung tayang di Landing Page
                      </label>
                    </div>
                  </div>

                  {/* Right Column: Image Manager */}
                  <div className="space-y-3 flex flex-col justify-between">
                    <div className="space-y-2.5">
                      <label className="text-[11px] font-bold text-text-dark block">Foto Sampul Paket Wisata</label>
                      
                      {/* Sub-tabs untuk Tour Image: Upload vs URL */}
                      <div className="flex border-b border-gray-100 pb-1">
                        <button
                          type="button"
                          onClick={() => setActiveTourTab('upload')}
                          className={`px-3 py-1 text-xs border-b-2 font-semibold transition-all ${
                            activeTourTab === 'upload' ? 'border-green-deep border-green-deep font-bold' : 'border-transparent text-gray-400 hover:text-gray-600'
                          }`}
                        >
                          Unggah File
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTourTab('url')}
                          className={`px-3 py-1 text-xs border-b-2 font-semibold transition-all ${
                            activeTourTab === 'url' ? 'border-green-deep border-green-deep font-bold' : 'border-transparent text-gray-400 hover:text-gray-600'
                          }`}
                        >
                          Tautan URL Gambar
                        </button>
                      </div>

                      {activeTourTab === 'upload' ? (
                        <div className="space-y-3">
                          {/* File input */}
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelectChange}
                            accept="image/*"
                            className="hidden"
                          />

                          {/* Image preview box */}
                          <div className="border border-dashed border-gray-200 rounded-2xl p-4 bg-gray-50/50 flex flex-col items-center justify-center text-center space-y-3 min-h-[160px] relative overflow-hidden group">
                            {tourImageUrl ? (
                              <>
                                <img
                                  src={tourImageUrl}
                                  alt="Preview"
                                  referrerPolicy="no-referrer"
                                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="bg-white/90 text-text-dark text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm"
                                  >
                                    Ubah Gambar
                                  </button>
                                </div>
                              </>
                            ) : (
                              <>
                                <div 
                                  onDragEnter={handleDrag}
                                  onDragOver={handleDrag}
                                  onDragLeave={handleDrag}
                                  onDrop={handleDrop}
                                  onClick={() => fileInputRef.current?.click()}
                                  className={`absolute inset-0 flex flex-col items-center justify-center p-4 cursor-pointer transition-colors ${
                                    dragActive ? 'bg-green-deep/5 border-green-soft/50' : 'hover:bg-gray-100/50'
                                  }`}
                                >
                                  <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                                  <span className="text-[10px] text-gray-500 font-semibold">Tarik & lepas foto Anda ke sini</span>
                                  <span className="text-[8px] text-gray-400 mt-0.5">Atau klik untuk menelusuri folder</span>
                                </div>
                              </>
                            )}
                          </div>

                          {/* Cloud upload or selected file actions */}
                          <div className="space-y-2">
                            {selectedImageFile && (
                              <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl">
                                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                <div className="min-w-0 flex-1 text-left">
                                  <p className="text-[10px] font-bold text-emerald-800 truncate">Berkas siap: {selectedImageFile.name}</p>
                                  <p className="text-[9px] text-emerald-600 leading-normal">
                                    Berkas terkompresi otomatis. Foto akan disimpan dan diunggah otomatis saat Anda mengklik "Save changes" di bawah.
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedImageFile(null);
                                    setTourImageUrl("");
                                    if (fileInputRef.current) fileInputRef.current.value = "";
                                  }}
                                  className="text-rose-500 hover:text-rose-700 font-bold flex-shrink-0 text-[10px] pl-2 border-l border-emerald-200"
                                >
                                  Batal
                                </button>
                              </div>
                            )}
                            {uploadError && (
                              <div className="p-2 bg-rose-50 border border-rose-150 rounded-lg text-[9px] text-rose-700 leading-relaxed font-semibold text-left">
                                {uploadError}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1.5 text-left">
                          <label className="text-xs font-semibold text-text-dark">URL Tautan Gambar (HTTP Link)</label>
                          <input
                            type="text"
                            placeholder="https://example.com/images/tour.jpg"
                            value={tourImageUrl}
                            onChange={(e) => setTourImageUrl(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 focus:border-green-soft px-3 py-2 rounded-xl text-xs"
                          />
                          <p className="text-[9px] text-gray-400 leading-relaxed mt-1">
                            Gunakan URL jika gambar sudah dihosting di tempat lain seperti Supabase Storage, Imgur, Cloudinary, atau platform lainnya.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* Bottom Bar: Action buttons */}
                <div className="pt-3 border-t border-gray-100 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowTourModal(false)}
                    className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-500 rounded-xl font-semibold text-xs transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saveStatus !== 'idle'}
                    className="px-5 py-2 bg-green-deep hover:bg-green-mid disabled:bg-gray-400 text-cream font-semibold rounded-xl transition-all shadow text-xs flex items-center space-x-1.5"
                  >
                    {saveStatus === 'saving' ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : saveStatus === 'saved' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Saved</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Save changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
