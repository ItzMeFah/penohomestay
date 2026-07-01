import { Booking, CMSHomepage, GalleryItem, AdminNotification } from '../types';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || "https://eszvodingaehsnahsvmb.supabase.co";
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzenZvZGluZ2FlaHNuYWhzdm1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2NDc3NDQsImV4cCI6MjA5ODIyMzc0NH0.UpoFJqht-1pybKBeadMctnIgI3PmiPMsqWU9uJnfy1Q";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const DEFAULT_HOMEPAGE: CMSHomepage = {
  hero: {
    headline: 'Rehat di Tengah <em>Kebun Kopi</em>',
    subheadline: 'Homestay keluarga di Banyuwangi — gerbang Kawah Ijen & Bromo',
    badge: '★★★★★ 4.9/5 · 90+ Ulasan Google'
  },
  stats: [
    { value: "4.9", label: "Rating Google", icon: "star" },
    { value: "90+", label: "Ulasan Positif", icon: "chat" },
    { value: "140K", label: "Mulai /malam", icon: "home" },
    { value: "10+", label: "Tahun Pengalaman", icon: "calendar" }
  ],
  about: {
    title: "Selamat Datang di Peno Homestay",
    body: "Kami adalah homestay keluarga yang terletak di tengah perkebunan kopi Gombengsari, Banyuwangi. Peno dan keluarga akan menyambut Anda dengan hangat, menemani tur kebun kopi, dan menyajikan masakan rumahan yang lezat.",
    highlights: [
      "Kebun Kopi Milik Sendiri",
      "Tur Alam Bersama Peno",
      "Masakan Keluarga Autentik",
      "Gerbang ke Kawah Ijen & Bromo"
    ],
    highlightItems: [
      {
        id: "hl-1",
        title: "Lush Coffee Plantation",
        description: "We will take you on a tour around the coffee plantation, see how coffee is harvested, roasted and served.",
        imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&h=400&q=80"
      },
      {
        id: "hl-2",
        title: "Tur Alam Bersama Peno",
        description: "Explore Gombengsari natural beauty, rice fields, and pristine rivers with Peno as your private local guide.",
        imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&h=400&q=80"
      },
      {
        id: "hl-3",
        title: "Warm Host Family",
        description: "Experience genuine Javanese hospitality. Peno and his warm family welcome you like a part of their own.",
        imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=600&h=400&q=80"
      },
      {
        id: "hl-4",
        title: "Close to Mount Ijen",
        description: "The perfect basecamp nestled close to Mount Ijen, making early morning climbs and blue fire viewings effortless.",
        imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&h=400&q=80"
      }
    ]
  },
  features: [
    { icon: "coffee", title: "Kopi Homegrown", desc: "Kopi terbaik dipanen dan disangrai langsung dari kebun kami sendiri." },
    { icon: "map", title: "Dekat Kawah Ijen", desc: "Lokasi strategis sebagai basecamp sebelum atau sesudah mendaki Ijen dan Bromo." },
    { icon: "home", title: "Keramahan Keluarga", desc: "Peno dan keluarga menyambut tamu seperti saudara sendiri." },
    { icon: "leaf", title: "Tur Perkebunan", desc: "Tur menyusuri perkebunan kopi, sawah, dan sungai bersama Peno." },
    { icon: "food", title: "Masakan Rumahan", desc: "Sarapan dan makanan segar dimasak langsung oleh keluarga Peno." },
    { icon: "river", title: "Alam & Sungai", desc: "Sungai jernih dan pemandangan alam yang memukau di sekitar homestay." }
  ],
  tours: [
    {
      id: 1,
      name: "Plantation Tour Gombengsari village",
      description: "We will take you on a tour around the coffee plantation. In addition, there are also community activities such as in the rice fields and other activities.",
      inclusions: ["Welcome drink", "Snack", "Tour packages", "Local Guide", "Documentation", "Finish"],
      contactPhone: "+6282332056148",
      contactSocial: "@Penohomestay",
      imageUrl: "",
      isActive: true
    }
  ],
  testimonials: [
    { text: "The most amazing Homestay ever… Peno and his family made us really feel at home. The best homegrown coffee ever!", author: "Tamu Google", rating: 5 },
    { text: "Perfect place to rest before or after Ijen/Bromo. Very peaceful — one of those places you feel sad leaving so soon!", author: "Tamu Google", rating: 5 },
    { text: "Peno guided us through the magnificent coffee plantation and rice fields — a true Indonesian experience!", author: "Tamu Google", rating: 5 }
  ],
  info: {
    checkin: "14:00",
    checkout: "12:00",
    price_from: 140,
    facilities: ["Kamar luas & bersih", "Sarapan tersedia", "Kopi gratis dari kebun", "Parkir gratis", "WiFi"],
    activities: ["Trekking Kawah Ijen", "Tur kebun kopi", "Bersepeda", "Menikmati sungai", "Fotografi alam"]
  },
  villas: [
    {
      id: "v-1",
      title: "Villa Robusta Kebun Kopi",
      description: "Villa kayu premium semi-terbuka dengan pemandangan langsung ke barisan pohon kopi Robusta yang asri. Dilengkapi dengan ranjang king-size, teras santai pribadi, kamar mandi semi-outdoor dengan air hangat, dan ketenangan alam pedesaan Gombengsari.",
      capacity: 2,
      includeBreakfast: true,
      imageUrl: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=600&h=400&q=80",
      pricePerPax: 140
    },
    {
      id: "v-2",
      title: "Family Suite Liberika",
      description: "Villa keluarga berkapasitas besar dengan ruang tengah yang lapang dan desain interior bernuansa etnik bambu yang elegan. Pintu kaca geser memberikan akses pemandangan hijau kebun kopi dan kebun durian. Sangat cocok untuk trip keluarga hangat Anda.",
      capacity: 4,
      includeBreakfast: true,
      imageUrl: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=600&h=400&q=80",
      pricePerPax: 180
    }
  ]
};

export const DEFAULT_GALLERY: GalleryItem[] = [];

export const DEFAULT_SETTINGS = {
  homestayName: "Peno Homestay",
  tagline: "Rehat di Tengah Kebun Kopi — Banyuwangi",
  pricePerNight: 140,
  whatsappNumber: "+62 812-3380-0631",
  whatsappUrl: "https://wa.me/6281233800631",
  instagramUser: "@penohomestaybanyuwangi",
  instagramUrl: "https://www.instagram.com/penohomestaybanyuwangi/",
  address: "Jl. Samarinda, Gombengsari, Kalipuro, Banyuwangi 68411",
  mapsUrl: "https://maps.google.com/?cid=7953698942961987726",
  checkIn: "14:00",
  checkOut: "12:00",
  adminUsername: "admin",
  adminPassword: "peno2024",
  heroOverlayOpacity: 28
};

export const DEFAULT_BLOCKED_DATES = [
  "2026-7-2", "2026-7-3", "2026-7-4", "2026-7-5",
  "2026-7-13", "2026-7-14", "2026-7-15", "2026-7-16",
  "2026-7-27", "2026-7-28", "2026-7-29", "2026-7-30", "2026-7-31",
  "2026-8-1", "2026-8-2", "2026-8-3", "2026-8-4", "2026-8-5"
];

export const safeStorage = {
  getItem(key: string): string | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {
      console.warn('localStorage is not available', e);
    }
    return null;
  },
  setItem(key: string, value: string) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (e: any) {
      console.warn('localStorage setItem failed, likely due to quota exceeded', e);
      if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
        alert("Penyimpanan lokal penuh (melebihi 5MB). Tidak bisa menyimpan foto Base64 lebih banyak. Silakan unggah foto ke Cloud atau gunakan URL.");
      }
    }
  }
};

export function initDefaultData() {
  if (!safeStorage.getItem("peno_bookings")) {
    safeStorage.setItem("peno_bookings", JSON.stringify([]));
  }
  if (!safeStorage.getItem("peno_blocked")) {
    safeStorage.setItem("peno_blocked", JSON.stringify(DEFAULT_BLOCKED_DATES));
  }
  if (!safeStorage.getItem("peno_homepage")) {
    safeStorage.setItem("peno_homepage", JSON.stringify(DEFAULT_HOMEPAGE));
  }
  if (!safeStorage.getItem("peno_gallery")) {
    safeStorage.setItem("peno_gallery", JSON.stringify(DEFAULT_GALLERY));
  }
  if (!safeStorage.getItem("peno_notifications")) {
    safeStorage.setItem("peno_notifications", JSON.stringify([]));
  }
  if (!safeStorage.getItem("peno_settings")) {
    safeStorage.setItem("peno_settings", JSON.stringify(DEFAULT_SETTINGS));
  }
}

export function getHomepage(): CMSHomepage {
  const data = safeStorage.getItem("peno_homepage");
  if (!data) return DEFAULT_HOMEPAGE;
  try {
    const parsed = JSON.parse(data);
    if (!parsed.about.highlightItems) {
      parsed.about.highlightItems = DEFAULT_HOMEPAGE.about.highlightItems;
    }
    if (!parsed.villas || parsed.villas.length === 0) {
      parsed.villas = DEFAULT_HOMEPAGE.villas;
    }
    return parsed;
  } catch (e) {
    return DEFAULT_HOMEPAGE;
  }
}

export function saveHomepage(data: CMSHomepage) {
  safeStorage.setItem("peno_homepage", JSON.stringify(data));
  broadcastChange("cms_updated", data);
  // Async sync to Supabase
  supabase.from('peno_cms').upsert({ id: 'homepage', data, updated_at: new Date().toISOString() }).then(({ error }) => {
    if (error) console.error("Error syncing homepage to Supabase:", error);
  });
}

export function getGallery(): GalleryItem[] {
  const data = safeStorage.getItem("peno_gallery");
  const list: GalleryItem[] = data ? JSON.parse(data) : DEFAULT_GALLERY;
  // Filter out any dummy items that don't have a valid url
  return list.filter(item => item.url && item.url.trim().length > 0);
}

export function saveGallery(data: GalleryItem[]) {
  const cleaned = data.filter(item => item.url && item.url.trim().length > 0);
  safeStorage.setItem("peno_gallery", JSON.stringify(cleaned));
  broadcastChange("cms_updated", cleaned);
  // Async sync to Supabase
  supabase.from('peno_cms').upsert({ id: 'gallery', data: cleaned, updated_at: new Date().toISOString() }).then(({ error }) => {
    if (error) console.error("Error syncing gallery to Supabase:", error);
  });
}

export function getBookings(): Booking[] {
  const data = safeStorage.getItem("peno_bookings");
  return data ? JSON.parse(data) : [];
}

export function saveBookings(data: Booking[]) {
  safeStorage.setItem("peno_bookings", JSON.stringify(data));
  
  // Async sync bookings to individual records in Supabase
  const localIds = data.map(b => b.id);
  const isAdmin = typeof window !== 'undefined' && sessionStorage.getItem("peno_admin_auth") === "true";
  
  const performSync = async () => {
    try {
      // Deletions are ONLY allowed for logged-in Admin in Admin Panel.
      // This protects bookings made by other users from being cleared by visitors.
      if (isAdmin) {
        if (localIds.length > 0) {
          // Delete records not in local list
          const { error: delError } = await supabase.from('peno_bookings').delete().not('id', 'in', `(${localIds.map(id => `'${id}'`).join(',')})`);
          if (delError) console.warn("Supabase booking sync delete warning:", delError.message);
        } else {
          const { error: delError } = await supabase.from('peno_bookings').delete().neq('id', 'xxx_none_xxx');
          if (delError) console.warn("Supabase booking sync delete-all warning:", delError.message);
        }
      }
      
      if (data.length > 0) {
        // Resolve homepageData to fetch room_codes
        const homepageRaw = safeStorage.getItem("peno_homepage");
        const villas = homepageRaw ? (JSON.parse(homepageRaw)?.villas || []) : [];

        const formatted = data.map(b => {
          const associatedVilla = villas.find((v: any) => v.id === b.villa_id);
          const roomCode = associatedVilla ? (associatedVilla.room_code || "") : "";
          return {
            id: b.id,
            created_at: b.created_at,
            status: b.status,
            check_in: b.check_in,
            check_out: b.check_out,
            nights: Number(b.nights),
            total_eur: Number(b.total_eur),
            guest_name: b.guest_name,
            guest_email: b.guest_email,
            guest_wa: b.guest_wa,
            guest_count: Number(b.guest_count),
            notes: b.notes || null,
            ROOM: roomCode || null // Map to uppercase 'ROOM' column in Supabase
          };
        });
        
        const { error: upsertError } = await supabase.from('peno_bookings').upsert(formatted);
        if (upsertError) {
          console.error("Supabase booking upsert error:", upsertError.message);
        }
      }
    } catch (e) {
      console.error("Failed to sync bookings list to Supabase:", e);
    }
  };
  
  performSync();
}

export function getBlockedDates(): string[] {
  const data = safeStorage.getItem("peno_blocked");
  return data ? JSON.parse(data) : DEFAULT_BLOCKED_DATES;
}

export function saveBlockedDates(data: string[]) {
  safeStorage.setItem("peno_blocked", JSON.stringify(data));
  broadcastChange("dates_updated", data);

  // Async sync to Supabase peno_blocked table
  const performSync = async () => {
    try {
      await supabase.from('peno_blocked').delete().neq('date_str', 'xxx_none_xxx');
      if (data.length > 0) {
        const rows = data.map(d => ({ date_str: d }));
        await supabase.from('peno_blocked').insert(rows);
      }
    } catch (e) {
      console.error("Error syncing blocked dates to Supabase:", e);
    }
  };

  performSync();
}

export function getNotifications(): AdminNotification[] {
  const data = safeStorage.getItem("peno_notifications");
  return data ? JSON.parse(data) : [];
}

export function saveNotifications(data: AdminNotification[]) {
  safeStorage.setItem("peno_notifications", JSON.stringify(data));
  
  // Async sync to Supabase peno_cms
  supabase.from('peno_cms').upsert({ id: 'notifications', data, updated_at: new Date().toISOString() }).then(({ error }) => {
    if (error) console.error("Error syncing notifications to Supabase:", error);
  });
}

export function getSettings() {
  const data = safeStorage.getItem("peno_settings");
  return data ? JSON.parse(data) : DEFAULT_SETTINGS;
}

export function saveSettings(data: typeof DEFAULT_SETTINGS) {
  safeStorage.setItem("peno_settings", JSON.stringify(data));
  // Keep standard price synchronized in CMS info as well
  const cms = getHomepage();
  cms.info.price_from = Number(data.pricePerNight);
  cms.info.checkin = data.checkIn;
  cms.info.checkout = data.checkOut;
  safeStorage.setItem("peno_homepage", JSON.stringify(cms));
  broadcastChange("cms_updated", cms);

  // Async sync to Supabase peno_cms
  supabase.from('peno_cms').upsert({ id: 'settings', data, updated_at: new Date().toISOString() }).then(({ error }) => {
    if (error) console.error("Error syncing settings to Supabase:", error);
  });
  supabase.from('peno_cms').upsert({ id: 'homepage', data: cms, updated_at: new Date().toISOString() }).then(({ error }) => {
    if (error) console.error("Error syncing homepage settings sync to Supabase:", error);
  });
}

// Realtime sync with BroadcastChannel
export function broadcastChange(type: string, data: any = {}) {
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const ch = new BroadcastChannel("peno_realtime");
      ch.postMessage({ type, data, ts: Date.now() });
      ch.close();
    }
  } catch (e) {
    console.warn("BroadcastChannel error", e);
  }
}

export function listenToBroadcast(handlers: Record<string, (data: any) => void>) {
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const ch = new BroadcastChannel("peno_realtime");
      ch.onmessage = (e) => {
        const { type, data } = e.data;
        if (handlers[type]) {
          handlers[type](data);
        }
      };
      return ch;
    }
    return null;
  } catch (e) {
    console.warn("BroadcastChannel error in listening", e);
    return null;
  }
}

export type CurrencyType = 'IDR' | 'USD' | 'EUR';

export function convertAndFormatPrice(amount: number, currency: CurrencyType): string {
  if (currency === 'IDR') {
    // Treat base amount as thousands of Rupiah (e.g., 150 means 150K)
    const kAmount = Math.round(amount);
    const formattedK = new Intl.NumberFormat('id-ID').format(kAmount);
    return `${formattedK}K`;
  } else if (currency === 'USD') {
    // 1 USD is roughly 16.000 IDR, so we divide amount (thousands) by 16
    const usdAmount = Math.max(1, Math.round((amount * 1000) / 16200));
    return `$${usdAmount}`;
  } else {
    // 1 EUR is roughly 17.500 IDR, so we divide amount (thousands) by 17.5
    const eurAmount = Math.max(1, Math.round((amount * 1000) / 17500));
    return `€${eurAmount}`;
  }
}

// Initial pull from Supabase to local storage
export async function fetchAllFromSupabase() {
  try {
    // 1. Fetch Bookings
    const { data: bookingsData, error: bError } = await supabase
      .from('peno_bookings')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!bError && bookingsData) {
      safeStorage.setItem("peno_bookings", JSON.stringify(bookingsData));
    }

    // 2. Fetch Blocked Dates
    const { data: blockedData, error: blError } = await supabase
      .from('peno_blocked')
      .select('date_str');
    
    if (!blError && blockedData) {
      const dates = blockedData.map(d => d.date_str);
      safeStorage.setItem("peno_blocked", JSON.stringify(dates));
    }

    // 3. Fetch CMS (homepage, gallery, settings, notifications)
    const { data: cmsData, error: cError } = await supabase
      .from('peno_cms')
      .select('*');
    
    if (!cError && cmsData) {
      cmsData.forEach(row => {
        if (row.id === 'homepage') {
          safeStorage.setItem("peno_homepage", JSON.stringify(row.data));
        } else if (row.id === 'gallery') {
          const fetchedGallery: GalleryItem[] = row.data || [];
          const cleanedGallery = fetchedGallery.filter((item: GalleryItem) => item.url && item.url.trim().length > 0);
          safeStorage.setItem("peno_gallery", JSON.stringify(cleanedGallery));
          // Proactively update Supabase if the fetched list contained dummy items to clean up database permanently!
          if (fetchedGallery.length !== cleanedGallery.length) {
            supabase.from('peno_cms').upsert({ id: 'gallery', data: cleanedGallery, updated_at: new Date().toISOString() }).then(({ error }) => {
              if (error) console.error("Auto-cleaned gallery table error:", error.message);
            });
          }
        } else if (row.id === 'settings') {
          safeStorage.setItem("peno_settings", JSON.stringify(row.data));
        } else if (row.id === 'notifications') {
          safeStorage.setItem("peno_notifications", JSON.stringify(row.data));
        }
      });
    }
  } catch (err) {
    console.error("Failed to fetch initial data from Supabase:", err);
  }
}

// Real-time listener for Supabase tables
export function subscribeToSupabaseRealtime(onUpdate: (type: string, data: any) => void) {
  const channel = supabase
    .channel('peno_realtime_sync')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'peno_bookings' },
      async () => {
        try {
          const { data, error } = await supabase.from('peno_bookings').select('*').order('created_at', { ascending: false });
          if (!error && data) {
            safeStorage.setItem("peno_bookings", JSON.stringify(data));
            onUpdate('bookings', data);
          }
        } catch (e) {
          console.error("Realtime fetch bookings error", e);
        }
      }
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'peno_blocked' },
      async () => {
        try {
          const { data, error } = await supabase.from('peno_blocked').select('date_str');
          if (!error && data) {
            const dates = data.map(d => d.date_str);
            safeStorage.setItem("peno_blocked", JSON.stringify(dates));
            onUpdate('blocked_dates', dates);
          }
        } catch (e) {
          console.error("Realtime fetch blocked_dates error", e);
        }
      }
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'peno_cms' },
      (payload) => {
        const row = payload.new as any;
        if (row && row.id) {
          if (row.id === 'homepage') {
            safeStorage.setItem("peno_homepage", JSON.stringify(row.data));
            onUpdate('homepage', row.data);
          } else if (row.id === 'gallery') {
            const fetchedGallery: GalleryItem[] = row.data || [];
            const cleanedGallery = fetchedGallery.filter((item: GalleryItem) => item.url && item.url.trim().length > 0);
            safeStorage.setItem("peno_gallery", JSON.stringify(cleanedGallery));
            onUpdate('gallery', cleanedGallery);
          } else if (row.id === 'settings') {
            safeStorage.setItem("peno_settings", JSON.stringify(row.data));
            onUpdate('settings', row.data);
          } else if (row.id === 'notifications') {
            safeStorage.setItem("peno_notifications", JSON.stringify(row.data));
            onUpdate('notifications', row.data);
          }
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

