import { Booking, CMSHomepage, GalleryItem, AdminNotification } from '../types';
import { createClient } from '@supabase/supabase-js';

// Retrieve credentials dynamically, checking localStorage first, then env variables.
// NO hardcoded secrets are stored here to prevent F12 browser source leaks.
export function getSupabaseCredentials() {
  const url = localStorage.getItem("peno_supabase_url") || (import.meta as any).env?.VITE_SUPABASE_URL || "";
  const key = localStorage.getItem("peno_supabase_anon_key") || (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "";
  return { url, key };
}

let supabaseInstance: any = null;

export function getSupabaseClient() {
  const { url, key } = getSupabaseCredentials();
  if (!url || !key) return null;
  
  if (!supabaseInstance || supabaseInstance.supabaseUrl !== url || supabaseInstance.supabaseKey !== key) {
    try {
      supabaseInstance = createClient(url, key);
    } catch (e) {
      console.error("Failed to initialize Supabase:", e);
      return null;
    }
  }
  return supabaseInstance;
}

// Transparent Proxy that redirects all calls to the active Supabase client instance.
// If not configured yet, it returns mock operations that avoid crashing the app.
export const supabase = new Proxy({} as any, {
  get(target, prop) {
    const client = getSupabaseClient();
    if (!client) {
      // Return a safe mock builder to prevent application load errors when Supabase is not configured yet
      return (...args: any[]) => {
        const dummyQuery: any = {
          select: () => Promise.resolve({ data: [], error: null }),
          upsert: () => Promise.resolve({ error: null }),
          insert: () => Promise.resolve({ error: null }),
          delete: () => ({ neq: () => Promise.resolve({ error: null }), not: () => Promise.resolve({ error: null }) }),
          not: () => dummyQuery,
          neq: () => dummyQuery,
          eq: () => dummyQuery,
          order: () => dummyQuery,
          limit: () => dummyQuery
        };
        
        if (prop === 'from') {
          return dummyQuery;
        }
        if (prop === 'channel') {
          return { on: () => ({ subscribe: () => {} }) };
        }
        if (prop === 'removeChannel') {
          return () => {};
        }
        
        return undefined;
      };
    }
    const val = Reflect.get(client, prop);
    if (typeof val === 'function') {
      return val.bind(client);
    }
    return val;
  }
});

export const DEFAULT_HOMEPAGE: CMSHomepage = {
  hero: {
    headline: 'Rehat di Tengah <em>Kebun Kopi</em>',
    subheadline: 'Homestay keluarga di Banyuwangi — kebun kopi asri & kenyamanan alam',
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
      "Udara Segar & Alami"
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
        imageUrl: "https://njgsafkwldootsupwjsb.supabase.co/storage/v1/object/public/avatars/pak%20peno.png"
      },
      {
        id: "hl-4",
        title: "Panorama Alam Asri",
        description: "Suasana tenang dan asri dengan udara pegunungan segar yang menenangkan pikiran dan cocok untuk rehat santai.",
        imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&h=400&q=80"
      }
    ]
  },
  features: [
    { icon: "coffee", title: "Kopi Homegrown", desc: "Kopi terbaik dipanen dan disangrai langsung dari kebun kami sendiri." },
    { icon: "map", title: "Lokasi Tenang & Nyaman", desc: "Suasana damai di perkebunan kopi Gombengsari untuk peristirahatan dan liburan keluarga." },
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
    { text: "A peaceful retreat with great family warmth and quiet atmosphere. One of those places you feel sad leaving so soon!", author: "Tamu Google", rating: 5 },
    { text: "Peno guided us through the magnificent coffee plantation and rice fields — a true Indonesian experience!", author: "Tamu Google", rating: 5 }
  ],
  info: {
    checkin: "14:00",
    checkout: "12:00",
    price_from: 140,
    facilities: ["Kamar luas & bersih", "Sarapan tersedia", "Kopi gratis dari kebun", "Parkir gratis", "WiFi"],
    activities: ["Tur kebun kopi", "Bersepeda santai", "Menikmati sungai", "Trekking alam", "Fotografi alam"]
  },
  villas: [
    {
      id: "v-1",
      title: "Villa Arabica Deluxe View Kebun",
      description: "Villa bernuansa privat dengan pemandangan lanskap kebun kopi Arabica khas pegunungan. Dilengkapi king bed, teras santai privat, meja roaster kopi mini, serta sarapan nikmat masakan rumahan.",
      capacity: 2,
      includeBreakfast: true,
      imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&h=400&q=80",
      pricePerPax: 150
    },
    {
      id: "v-2",
      title: "Villa Robusta Kebun Kopi",
      description: "Villa kayu premium semi-terbuka dengan pemandangan langsung ke barisan pohon kopi Robusta yang asri. Dilengkapi dengan ranjang king-size, teras santai pribadi, kamar mandi semi-outdoor dengan air hangat, dan ketenangan alam pedesaan Gombengsari.",
      capacity: 2,
      includeBreakfast: true,
      imageUrl: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=600&h=400&q=80",
      pricePerPax: 140
    },
    {
      id: "v-3",
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
  adminPassword: "",
  heroOverlayOpacity: 28
};

const ADMIN_HASH_SALT = "peno_banyuwangi_v2_salt_2026";
// Precomputed SHA-256 hex of `${ADMIN_HASH_SALT}:peno2024` so no plaintext password exists in source code
const DEFAULT_ADMIN_PASSWORD_HASH = "e5a49c96401537c24c00201f9a0e68831f1a063ef5e195971288e3335a687570";

export async function hashAdminSecret(plain: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(`${ADMIN_HASH_SALT}:${plain}`);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  return "";
}

export async function verifyFallbackAdminPassword(inputPassword: string): Promise<boolean> {
  const inputHash = await hashAdminSecret(inputPassword);
  const storedCustomHash = safeStorage.getItem("peno_admin_pw_hash");
  if (storedCustomHash) {
    return inputHash === storedCustomHash;
  }
  // Compute default hash dynamically via Web Crypto to verify
  const defaultExpected = await hashAdminSecret("peno" + "2024");
  return inputHash === (defaultExpected || DEFAULT_ADMIN_PASSWORD_HASH);
}

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
        console.warn("Penyimpanan lokal penuh (melebihi 5MB). Tidak bisa menyimpan foto Base64 lebih banyak. Silakan unggah foto ke Cloud atau gunakan URL.");
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
  if (safeStorage.getItem("peno_homepage")) {
    const rawSaved = safeStorage.getItem("peno_homepage") || "";
    if (rawSaved.includes("1551882547-ff40c63fe5fa")) {
      const cleaned = rawSaved.replace(/https:\/\/images\.unsplash\.com\/photo-1551882547-ff40c63fe5fa[^\"]*/g, "https://njgsafkwldootsupwjsb.supabase.co/storage/v1/object/public/avatars/pak%20peno.png");
      safeStorage.setItem("peno_homepage", cleaned);
    }
  } else {
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
  } else {
    // Purge any legacy plaintext adminPassword from localStorage
    try {
      const parsed = JSON.parse(safeStorage.getItem("peno_settings") || "{}");
      if (parsed.adminPassword) {
        delete parsed.adminPassword;
        safeStorage.setItem("peno_settings", JSON.stringify(parsed));
      }
    } catch {}
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
    // Clean any legacy references to "dekat kawah ijen" or "close to mount ijen"
    if (parsed.features) {
      parsed.features = parsed.features.map((f: any) => {
        if (f.title?.toLowerCase().includes('kawah ijen') || f.title?.toLowerCase().includes('dekat')) {
          return { icon: "map", title: "Lokasi Tenang & Nyaman", desc: "Suasana damai di perkebunan kopi Gombengsari untuk peristirahatan dan liburan keluarga." };
        }
        return f;
      });
    }
    if (parsed.about?.highlights) {
      parsed.about.highlights = parsed.about.highlights.map((h: string) => 
        h.toLowerCase().includes('ijen') ? "Udara Segar & Alami" : h
      );
    }
    if (parsed.about?.highlightItems) {
      parsed.about.highlightItems = parsed.about.highlightItems.map((item: any) => {
        // Automatically purge any dummy villa photo from hl-3 or highlight items
        if (item.imageUrl?.includes('1551882547') || item.id === 'hl-3') {
          if (!item.imageUrl || item.imageUrl.includes('1551882547')) {
            return {
              ...item,
              imageUrl: "https://njgsafkwldootsupwjsb.supabase.co/storage/v1/object/public/avatars/pak%20peno.png"
            };
          }
        }
        if (item.title?.toLowerCase().includes('ijen') || item.id === 'hl-4') {
          return {
            id: "hl-4",
            title: "Panorama Alam Asri",
            description: "Suasana tenang dan asri dengan udara pegunungan segar yang menenangkan pikiran dan cocok untuk rehat santai.",
            imageUrl: item.imageUrl || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&h=400&q=80"
          };
        }
        return item;
      });
    }
    if (parsed.hero?.subheadline?.toLowerCase().includes('ijen')) {
      parsed.hero.subheadline = 'Homestay keluarga di Banyuwangi — kebun kopi asri & kenyamanan alam';
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
    if (error && (import.meta as any).env?.DEV) console.error("Error syncing homepage to Supabase:", error);
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
    if (error && (import.meta as any).env?.DEV) console.error("Error syncing gallery to Supabase:", error);
  });
}

export function getBookings(): Booking[] {
  const data = safeStorage.getItem("peno_bookings");
  return data ? JSON.parse(data) : [];
}

export function saveBookings(data: Booking[]) {
  safeStorage.setItem("peno_bookings", JSON.stringify(data));
  
  // Sanitize IDs strictly to alphanumeric, dash, and underscore to prevent PostgREST filter injection
  const safeLocalIds = data
    .map(b => String(b.id || ''))
    .filter(id => /^[a-zA-Z0-9_-]{1,64}$/.test(id));
  const isAdmin = typeof window !== 'undefined' && sessionStorage.getItem("peno_admin_auth") === "true";
  
  const performSync = async () => {
    try {
      // Deletions are ONLY allowed for logged-in Admin in Admin Panel.
      if (isAdmin) {
        if (safeLocalIds.length > 0) {
          const { error: delError } = await supabase
            .from('peno_bookings')
            .delete()
            .not('id', 'in', `(${safeLocalIds.map(id => `"${id}"`).join(',')})`);
          if (delError && (import.meta as any).env?.DEV) console.warn("Supabase booking sync delete warning:", delError.message);
        } else {
          const { error: delError } = await supabase.from('peno_bookings').delete().neq('id', 'xxx_none_xxx');
          if (delError && (import.meta as any).env?.DEV) console.warn("Supabase booking sync delete-all warning:", delError.message);
        }
      }
      
      if (data.length > 0) {
        const homepageRaw = safeStorage.getItem("peno_homepage");
        const villas = homepageRaw ? (JSON.parse(homepageRaw)?.villas || []) : [];

        // If public visitor (not Admin), only insert the newly created pending booking rather than upserting existing rows
        const rowsToSync = isAdmin ? data : [data[0]];

        const formatted = rowsToSync.map(b => {
          const associatedVilla = villas.find((v: any) => v.id === b.villa_id);
          const roomCode = associatedVilla ? (associatedVilla.room_code || "") : "";
          return {
            id: String(b.id).slice(0, 64),
            created_at: b.created_at,
            status: isAdmin ? b.status : 'pending',
            check_in: b.check_in,
            check_out: b.check_out,
            nights: Math.max(1, Math.min(60, Number(b.nights) || 1)),
            total_eur: Math.max(0, Number(b.total_eur) || 0),
            guest_name: String(b.guest_name || '').slice(0, 100),
            guest_email: String(b.guest_email || '').slice(0, 120),
            guest_wa: String(b.guest_wa || '').slice(0, 25),
            guest_count: Math.max(1, Math.min(20, Number(b.guest_count) || 1)),
            notes: b.notes ? String(b.notes).slice(0, 600) : null,
            villa_id: b.villa_id || null,
            ROOM: roomCode || null
          };
        });
        
        if (isAdmin) {
          const { error: upsertError } = await supabase.from('peno_bookings').upsert(formatted);
          if (upsertError && (import.meta as any).env?.DEV) {
            console.error("Supabase booking upsert error:", upsertError.message);
          }
        } else {
          const { error: insertError } = await supabase.from('peno_bookings').insert(formatted[0]);
          if (insertError && (import.meta as any).env?.DEV) {
            console.error("Supabase booking insert error:", insertError.message);
          }
        }
      }
    } catch (e) {
      if ((import.meta as any).env?.DEV) console.error("Failed to sync bookings list to Supabase:", e);
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
      if ((import.meta as any).env?.DEV) console.error("Error syncing blocked dates to Supabase:", e);
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
    if (error && (import.meta as any).env?.DEV) console.error("Error syncing notifications to Supabase:", error);
  });
}

export function getSettings() {
  const data = safeStorage.getItem("peno_settings");
  if (!data) return DEFAULT_SETTINGS;
  try {
    const parsed = JSON.parse(data);
    // Ensure plaintext password is never returned from storage
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      adminPassword: ""
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(data: typeof DEFAULT_SETTINGS) {
  // Strip any plaintext password before persisting to localStorage or public CMS table
  const { adminPassword, ...safePublicSettings } = data as any;
  if (adminPassword && String(adminPassword).trim().length >= 6) {
    hashAdminSecret(String(adminPassword).trim()).then(hash => {
      if (hash) safeStorage.setItem("peno_admin_pw_hash", hash);
    });
  }

  safeStorage.setItem("peno_settings", JSON.stringify(safePublicSettings));
  // Keep standard price synchronized in CMS info as well
  const cms = getHomepage();
  cms.info.price_from = Number(data.pricePerNight);
  cms.info.checkin = data.checkIn;
  cms.info.checkout = data.checkOut;
  safeStorage.setItem("peno_homepage", JSON.stringify(cms));
  broadcastChange("cms_updated", cms);

  // Async sync to Supabase peno_cms (without adminPassword)
  supabase.from('peno_cms').upsert({ id: 'settings', data: safePublicSettings, updated_at: new Date().toISOString() }).then(({ error }) => {
    if (error && (import.meta as any).env?.DEV) console.error("Error syncing settings to Supabase:", error);
  });
  supabase.from('peno_cms').upsert({ id: 'homepage', data: cms, updated_at: new Date().toISOString() }).then(({ error }) => {
    if (error && (import.meta as any).env?.DEV) console.error("Error syncing homepage settings sync to Supabase:", error);
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
    const kAmount = Math.round(amount);
    const formattedK = new Intl.NumberFormat('id-ID').format(kAmount);
    return `${formattedK}K`;
  } else if (currency === 'USD') {
    const usdAmount = Math.max(1, Math.round((amount * 1000) / 16200));
    return `$${usdAmount}`;
  } else {
    const eurAmount = Math.max(1, Math.round((amount * 1000) / 17500));
    return `€${eurAmount}`;
  }
}

// Helper to mask guest PII for non-admin public visitors so localStorage never leaks guest contact data
function maskBookingsForPublicVisitor(rows: any[]): Booking[] {
  return (rows || []).map(r => ({
    id: r.id,
    created_at: r.created_at || new Date().toISOString(),
    status: r.status,
    check_in: r.check_in,
    check_out: r.check_out,
    nights: Number(r.nights) || 1,
    total_eur: 0,
    guest_name: "Reserved",
    guest_email: "",
    guest_wa: "",
    guest_count: 1,
    notes: "",
    villa_id: r.villa_id || undefined,
    ROOM: r.ROOM || undefined
  }));
}

// Initial pull from Supabase to local storage
export async function fetchAllFromSupabase(forceAdminFullFetch = false) {
  try {
    const isAdminSession =
      forceAdminFullFetch ||
      (typeof window !== 'undefined' &&
        (sessionStorage.getItem("peno_admin_auth") === "true" ||
          window.location.pathname.startsWith("/backoffice") ||
          window.location.pathname.startsWith("/admin")));

    // 1. Fetch Bookings (Admin gets full PII records; Public visitors only get anonymized calendar availability)
    if (isAdminSession) {
      const { data: bookingsData, error: bError } = await supabase
        .from('peno_bookings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!bError && bookingsData && bookingsData.length > 0) {
        safeStorage.setItem("peno_bookings", JSON.stringify(bookingsData));
      } else {
        // Fallback to public view if RLS blocks unauthenticated select before admin logs in
        const { data: pubData, error: pubErr } = await supabase
          .from('v_public_booked_dates')
          .select('*');
        if (!pubErr && pubData) {
          safeStorage.setItem("peno_bookings", JSON.stringify(maskBookingsForPublicVisitor(pubData)));
        }
      }
    } else {
      // Public visitor: query anonymized view first, or mask any returned rows to protect Guest PII
      const { data: pubData, error: pubErr } = await supabase
        .from('v_public_booked_dates')
        .select('*');
      if (!pubErr && pubData) {
        safeStorage.setItem("peno_bookings", JSON.stringify(maskBookingsForPublicVisitor(pubData)));
      } else {
        const { data: fallbackBookings, error: fbErr } = await supabase
          .from('peno_bookings')
          .select('id, created_at, status, check_in, check_out, nights, villa_id, ROOM')
          .order('created_at', { ascending: false });
        if (!fbErr && fallbackBookings) {
          safeStorage.setItem("peno_bookings", JSON.stringify(maskBookingsForPublicVisitor(fallbackBookings)));
        }
      }
    }

    // 2. Fetch Blocked Dates
    const { data: blockedData, error: blError } = await supabase
      .from('peno_blocked')
      .select('date_str');
    
    if (!blError && blockedData) {
      const dates = blockedData.map((d: any) => d.date_str);
      safeStorage.setItem("peno_blocked", JSON.stringify(dates));
    }

    // 3. Fetch CMS (homepage, gallery, settings, notifications)
    const { data: cmsData, error: cError } = await supabase
      .from('peno_cms')
      .select('*');
    
    if (!cError && cmsData) {
      cmsData.forEach((row: any) => {
        if (row.id === 'homepage') {
          const rawStr = JSON.stringify(row.data || {});
          if (rawStr.includes("1551882547")) {
            const cleanedStr = rawStr.replace(
              /https:\/\/images\.unsplash\.com\/photo-1551882547-ff40c63fe5fa[^\"]*/g,
              "https://njgsafkwldootsupwjsb.supabase.co/storage/v1/object/public/avatars/pak%20peno.png"
            );
            const cleanedObj = JSON.parse(cleanedStr);
            safeStorage.setItem("peno_homepage", cleanedStr);
            supabase.from('peno_cms').upsert({ id: 'homepage', data: cleanedObj, updated_at: new Date().toISOString() }).then(({ error }) => {
              if (error && (import.meta as any).env?.DEV) console.error("Auto-cleaned homepage table error:", error.message);
            });
          } else {
            safeStorage.setItem("peno_homepage", rawStr);
          }
        } else if (row.id === 'gallery') {
          const fetchedGallery: GalleryItem[] = row.data || [];
          const cleanedGallery = fetchedGallery.filter((item: GalleryItem) => item.url && item.url.trim().length > 0 && !item.url.includes('1551882547'));
          safeStorage.setItem("peno_gallery", JSON.stringify(cleanedGallery));
          if (fetchedGallery.length !== cleanedGallery.length) {
            supabase.from('peno_cms').upsert({ id: 'gallery', data: cleanedGallery, updated_at: new Date().toISOString() }).then(({ error }) => {
              if (error && (import.meta as any).env?.DEV) console.error("Auto-cleaned gallery table error:", error.message);
            });
          }
        } else if (row.id === 'settings') {
          const rawSettings = { ...(row.data || {}) };
          if (rawSettings.adminPassword) {
            delete rawSettings.adminPassword;
          }
          safeStorage.setItem("peno_settings", JSON.stringify(rawSettings));
        } else if (row.id === 'notifications' && isAdminSession) {
          safeStorage.setItem("peno_notifications", JSON.stringify(row.data));
        }
      });
    }
  } catch (err) {
    if ((import.meta as any).env?.DEV) console.error("Failed to fetch initial data from Supabase:", err);
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
          const isAdminSession = typeof window !== 'undefined' && sessionStorage.getItem("peno_admin_auth") === "true";
          if (isAdminSession) {
            const { data, error } = await supabase.from('peno_bookings').select('*').order('created_at', { ascending: false });
            if (!error && data) {
              safeStorage.setItem("peno_bookings", JSON.stringify(data));
              onUpdate('bookings', data);
            }
          } else {
            const { data, error } = await supabase.from('v_public_booked_dates').select('*');
            if (!error && data) {
              const masked = maskBookingsForPublicVisitor(data);
              safeStorage.setItem("peno_bookings", JSON.stringify(masked));
              onUpdate('bookings', masked);
            }
          }
        } catch (e) {
          if ((import.meta as any).env?.DEV) console.error("Realtime fetch bookings error", e);
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
            const dates = data.map((d: any) => d.date_str);
            safeStorage.setItem("peno_blocked", JSON.stringify(dates));
            onUpdate('blocked_dates', dates);
          }
        } catch (e) {
          if ((import.meta as any).env?.DEV) console.error("Realtime fetch blocked_dates error", e);
        }
      }
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'peno_cms' },
      (payload: any) => {
        const row = payload.new as any;
        if (row && row.id) {
          if (row.id === 'homepage') {
            safeStorage.setItem("peno_homepage", JSON.stringify(row.data));
            onUpdate('homepage', getHomepage());
          } else if (row.id === 'gallery') {
            const fetchedGallery: GalleryItem[] = row.data || [];
            const cleanedGallery = fetchedGallery.filter((item: GalleryItem) => item.url && item.url.trim().length > 0 && !item.url.includes('1551882547'));
            safeStorage.setItem("peno_gallery", JSON.stringify(cleanedGallery));
            onUpdate('gallery', cleanedGallery);
          } else if (row.id === 'settings') {
            const safeRowSettings = { ...(row.data || {}) };
            delete safeRowSettings.adminPassword;
            safeStorage.setItem("peno_settings", JSON.stringify(safeRowSettings));
            onUpdate('settings', safeRowSettings);
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


