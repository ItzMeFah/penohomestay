export interface Testimonial {
  quote: string;
  author: string;
  source: string;
  rating: number;
  country: string;
  flag: string;
}

export interface Highlight {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  accentColor: string;
  illustrationType: 'coffee' | 'room' | 'river' | 'breakfast' | 'tour' | 'ijen';
}

export const BUSINESS_INFO = {
  name: "Peno Homestay",
  tagline: "Rehat di Tengah Kebun Kopi — Surga Tersembunyi Banyuwangi",
  type: "Homestay keluarga autentik di perkebunan kopi",
  rating: 4.9,
  totalReviews: "90+",
  priceFrom: "140K",
  whatsappNumber: "+62 812-3380-0631",
  whatsappUrl: "https://wa.me/6281233800631?text=Halo%20Peno%20Homestay!%20Saya%20ingin%20menanyakan%20ketersediaan%20kamar.",
  instagramUser: "@penohomestaybanyuwangi",
  instagramUrl: "https://www.instagram.com/penohomestaybanyuwangi/",
  address: "Jl. Samarinda, Gombengsari, Kec. Kalipuro, Kabupaten Banyuwangi, Jawa Timur 68411",
  googleMapsUrl: "https://maps.google.com/?cid=7953698942961987726",
  checkIn: "14:00",
  checkOut: "12:00",
  languages: ["Indonesia", "English"],
  suitability: ["Backpacker", "Pasangan", "Keluarga", "Traveler Solo"],
  activities: ["Trekking Ijen", "Tur Kopi", "Bersepeda", "Menikmati Sungai"]
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "The most amazing Homestay ever, we can't recommend this place enough! Peno and his family are so welcoming and friendly, and made us really feel at home. The property is so peaceful, you are surrounded by nature and the rooms are spacious and well cared for. A wonderful experience all around. Also - the best, homegrown coffee ever!",
    author: "Tamu Google",
    source: "Ulasan Google Maps",
    rating: 5,
    country: "Germany",
    flag: "🇩🇪"
  },
  {
    quote: "We had a great time at Peno Homestay. The hosts are amazing and friendly, we had some great chats and they have the best coffee we have tried in Indonesia. The best of all is that it is all homegrown! It is the perfect homestay if you want to rest up before or after Ijen/Bromo. It is very peaceful. One of those accommodations where you feel sad for leaving so soon!",
    author: "Tamu Google",
    source: "Ulasan Google Maps",
    rating: 5,
    country: "Netherlands",
    flag: "🇳🇱"
  },
  {
    quote: "We had an incredible time at Peno Homestay. Peno guided us through the magnificent coffee plantation and rice fields. It was also very nice to meet through him the local people: a true Indonesian experience. Moreover, the food cooked by Peno's family is excellent. We recommend warmly this place!",
    author: "Tamu Google",
    source: "Ulasan Google Maps",
    rating: 5,
    country: "France",
    flag: "🇫🇷"
  },
  {
    quote: "Peno and his family are the perfect hosts, and his small guesthouse is the perfect place to relax and recharge. Come here after hiking Ijen if you want some rest! The river is beautiful, and Peno treated us like family. We enjoyed meeting people on his tour of coffee plantations and local Javanese life.",
    author: "Tamu Google",
    source: "Ulasan Google Maps",
    rating: 5,
    country: "United Kingdom",
    flag: "🇬🇧"
  },
  {
    quote: "A beautiful environment surrounding the villa. Forest garden with coffee, nutmeg, clover trees and plenty of flowers, orchids and fruit trees (papaya, guava, durian…). Not to mention the river. Perfect to refresh the legs after the morning exercise. Service is very welcoming, such generosity from all family members. Food was very good for adults and kids. Highly recommend.",
    author: "Tamu Google",
    source: "Ulasan Google Maps",
    rating: 5,
    country: "Belgium",
    flag: "🇧🇪"
  }
];

export const HIGHLIGHTS: Highlight[] = [
  {
    id: "kebun-kopi",
    title: "Kebun Kopi Sendiri",
    description: "Nikmati kopi robusta dan liberika terbaik, dipanen, disangrai, dan diseduh langsung dari kebun kopi keluarga Peno.",
    iconName: "coffee"
  },
  {
    id: "tur-peno",
    title: "Tur Alam Bersama Peno",
    description: "Trekking seru menyusuri perkebunan kopi, persawahan hijau, dan melihat keseharian hangat warga lokal Gombengsari.",
    iconName: "compass"
  },
  {
    id: "masakan-keluarga",
    title: "Masakan Keluarga",
    description: "Sajian khas lokal yang lezat dan otentik, dimasak dengan cinta oleh keluarga Peno menggunakan bahan-bahan segar.",
    iconName: "utensils"
  },
  {
    id: "lokasi-strategis",
    title: "Lokasi Strategis",
    description: "Tempat transit ideal di Banyuwangi, sangat pas untuk beristirahat sebelum atau sesudah ekspedisi ke Kawah Ijen & Bromo.",
    iconName: "map-pin"
  },
  {
    id: "sungai-alam",
    title: "Sungai & Alam Bebas",
    description: "Segarkan diri di sungai jernih yang mengalir di area homestay, lengkap dengan taman buah pala, cengkeh, dan durian.",
    iconName: "droplets"
  },
  {
    id: "keramahan-tuan-rumah",
    title: "Keramahan Tuan Rumah",
    description: "Rasakan kehangatan tinggal bersama keluarga lokal. Peno dan keluarga memperlakukan setiap tamu layaknya keluarga sendiri.",
    iconName: "heart"
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "g1",
    title: "Perkebunan Kopi",
    category: "Aktivitas & Alam",
    accentColor: "#2d5a45",
    illustrationType: "coffee"
  },
  {
    id: "g2",
    title: "Kamar & Teras",
    category: "Akomodasi",
    accentColor: "#6b4c35",
    illustrationType: "room"
  },
  {
    id: "g3",
    title: "Sungai & Alam",
    category: "Aktivitas & Alam",
    accentColor: "#1e3a2f",
    illustrationType: "river"
  },
  {
    id: "g4",
    title: "Sarapan & Kopi",
    category: "Kuliner",
    accentColor: "#4a8a68",
    illustrationType: "breakfast"
  },
  {
    id: "g5",
    title: "Tur Bersama Peno",
    category: "Aktivitas & Alam",
    accentColor: "#e8dfc8",
    illustrationType: "tour"
  },
  {
    id: "g6",
    title: "Kawah Ijen",
    category: "Destinasi",
    accentColor: "#c0392b",
    illustrationType: "ijen"
  }
];
