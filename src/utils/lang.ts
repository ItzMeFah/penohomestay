export type LanguageType = 'ID' | 'EN';

export const translations = {
  ID: {
    // Navbar
    navAbout: "Tentang",
    navExperience: "Pengalaman",
    navGallery: "Galeri",
    navTestimonials: "Ulasan",
    navBook: "Book Kamar",
    navContact: "Hubungi Kami",
    
    // Booking Button
    bookBtn: "BOOK KAMAR",
    bookBtnMobile: "BOOK",

    // Landing Page Hero
    heroSubtitle: "Akomodasi Kebun Kopi Autentik Gombengsari",
    heroTitle: "Peristirahatan Damai & Hangat di Banyuwangi",
    heroDesc: "Nikmati ketenangan sejati di lereng Gunung Ijen, dikelilingi kebun kopi yang asri, udara segar pegunungan, dan keramahan hangat keluarga lokal.",
    heroCtaBook: "Pesan Sekarang",
    heroCtaExplore: "Jelajahi Homestay",
    scrollDown: "Scroll ke Bawah",

    // Stats
    statRating: "Peringkat Ulasan",
    statRateValue: "4.9 / 5.0 Bintang",
    statDistance: "Jarak Kawah Ijen",
    statDistanceValue: "35 Menit Saja",
    statCoffee: "Sajian Kopi Kebun",
    statCoffeeValue: "Gratis & Sepuasnya",
    statPrice: "Mulai Dari",

    // About Section
    aboutLabel: "Tentang Peno Homestay",
    aboutTitle: "Rumah Hangat di Tengah Kebun Kopi Gombengsari",
    aboutDesc1: "Peno Homestay bukan sekadar tempat singgah, melainkan sebuah gerbang untuk merasakan kehidupan autentik pedesaan Banyuwangi. Terletak di kawasan perkebunan kopi Gombengsari yang subur, kami menawarkan ketenangan alam pegunungan dengan udara yang sejuk dan bebas polusi.",
    aboutDesc2: "Didirikan oleh Pak Peno, seorang petani kopi lokal dan pemandu berpengalaman, kami berkomitmen menyajikan kehangatan keluarga asli Banyuwangi. Di sini, Anda akan terbangun oleh aroma bunga kopi yang harum di pagi hari, menikmati seduhan kopi robusta & liberika organik segar, dan menyaksikan matahari terbit yang megah.",
    aboutOwnerTitle: "Pesan dari Pak Peno",
    aboutOwnerDesc: "\"Kami mengundang Anda merasakan ketulusan hidup di desa. Di sini Anda bukan sekadar tamu, melainkan bagian dari keluarga kami.\"",

    // Experience Section
    expLabel: "Pengalaman Unik",
    expTitle: "Aktivitas Tak Terlupakan Bersama Kami",
    expDesc: "Jadikan liburan Anda berkesan dengan mengikuti berbagai aktivitas otentik yang kami rancang khusus untuk para tamu.",

    // Gallery Section
    galLabel: "Galeri Homestay",
    galTitle: "Setiap Sudut Menyimpan Keindahan",
    galDesc: "Intip kenyamanan kamar tidur kami, asrinya kebun kopi di sekitar homestay, serta dokumentasi seru petualangan para tamu.",
    galFilterAll: "Semua",
    galFilterRoom: "Akomodasi",
    galFilterCulinary: "Kuliner",
    galFilterActivity: "Aktivitas & Alam",
    galFilterDest: "Destinasi",

    // Reviews Section
    revLabel: "Suara Tamu Kami",
    revTitle: "Ulasan Jujur dari Mereka yang Pernah Singgah",
    revSubtitle: "Peringkat rata-rata 4.9 dari 90+ ulasan di berbagai platform perjalanan.",

    // Information Section
    infoLabel: "Informasi Penting",
    infoTitle: "Panduan & Fasilitas Menginap",
    infoDesc: "Berikut adalah rangkuman detail fasilitas, ketentuan, serta petunjuk arah menuju Peno Homestay untuk kelancaran liburan Anda.",
    infoRateTitle: "Tarif per Malam",
    infoRateDesc: "Tarif standar fleksibel yang ramah di kantong dengan fasilitas lengkap.",
    infoAmenitiesTitle: "Fasilitas Kamar",
    infoAmenitiesDesc: "Kamar bersih, kasur nyaman king-size, selimut tebal hangat, teh/kopi gratis.",
    infoLocationTitle: "Lokasi Strategis",
    infoLocationDesc: "Gerbang pendakian Kawah Ijen. 30 menit berkendara dari Stasiun Karangasem/Ketapang.",
    infoCheckTitle: "Check-In & Check-Out",
    infoCheckDesc: "Check-in fleksibel setelah jam 14:00, check-out maksimal jam 12:00 siang.",

    // Footer
    footerDesc: "Akomodasi liburan keluarga autentik di tengah suburnya kebun kopi Gombengsari, Kalipuro, Banyuwangi. Gerbang peristirahatan Kawah Ijen & Bromo.",
    footerNav: "Navigasi Halaman",
    footerContact: "Hubungi Kami",
    footerAddress: "Alamat",
    footerMapsBtn: "Buka rute di Google Maps",

    // Booking Engine Page
    bookEngineTitle: "Pemesanan Kamar Online",
    bookEngineDesc: "Silakan pilih tanggal check-in dan check-out untuk memeriksa ketersediaan homestay.",
    bookFormTitle: "Lengkapi Data Pemesanan",
    bookFormDesc: "Lengkapi form di bawah dengan informasi yang benar untuk memproses pemesanan Anda.",
    bookFormName: "Nama Lengkap Anda *",
    bookFormEmail: "Alamat Email Aktif *",
    bookFormWa: "Nomor WhatsApp (Aktif) *",
    bookFormGuests: "Jumlah Tamu Menginap *",
    bookFormNotes: "Catatan Tambahan atau Permintaan Khusus",
    bookFormSubmit: "Kirim Form Pemesanan via WhatsApp",
    bookSelectRange: "Silakan pilih tanggal Check-Out...",
    bookFillData: "Isi Data Diri Anda",
    bookHowTo: "Petunjuk & Cara Kerja",
    bookHowTo1: "Pilih tanggal Check-In lalu Check-Out pada kalender di sebelah kiri.",
    bookHowTo2: "Isi form data diri lengkap yang muncul secara otomatis.",
    bookHowTo3: "Tekan tombol kirim untuk mengirimkan pemesanan otomatis ke WhatsApp Pak Peno.",
    bookHowTo4: "Peno akan mengonfirmasi ketersediaan dan rincian pembayaran DP/Lunas.",
    bookTerms: "Syarat & Ketentuan Pemesanan",
    bookTerms1: "Pembatalan gratis dilakukan maksimal 3 hari sebelum tanggal kedatangan.",
    bookTerms2: "Pembayaran DP/lunas dikonfirmasi manual via WA.",
    bookTerms3: "Termasuk sarapan sehat & seduhan kopi sepuasnya dari kebun.",
    bookTerms4: "Bantuan tur Kawah Ijen gratis disediakan oleh Peno.",
    bookCalendarHeader: "Pilih Tanggal Menginap Anda",
  },
  EN: {
    // Navbar
    navAbout: "About",
    navExperience: "Experience",
    navGallery: "Gallery",
    navTestimonials: "Testimonials",
    navBook: "Book Now",
    navContact: "Contact Us",
    
    // Booking Button
    bookBtn: "BOOK NOW",
    bookBtnMobile: "BOOK",

    // Landing Page Hero
    heroSubtitle: "Authentic Gombengsari Coffee Plantation Stay",
    heroTitle: "A Peaceful & Warm Retreat in Banyuwangi",
    heroDesc: "Experience true tranquility on the slopes of Mount Ijen, surrounded by lush coffee trees, crisp mountain air, and the warm hospitality of a local family.",
    heroCtaBook: "Book Now",
    heroCtaExplore: "Explore Homestay",
    scrollDown: "Scroll Down",

    // Stats
    statRating: "Review Rating",
    statRateValue: "4.9 / 5.0 Stars",
    statDistance: "Distance to Ijen Crater",
    statDistanceValue: "Only 35 Minutes",
    statCoffee: "Garden Brewed Coffee",
    statCoffeeValue: "Free & Unlimited",
    statPrice: "Starting From",

    // About Section
    aboutLabel: "About Peno Homestay",
    aboutTitle: "A Cozy Home Amidst Gombengsari Coffee Estate",
    aboutDesc1: "Peno Homestay is more than just a place to sleep; it is a gateway to experiencing the authentic rural life of Banyuwangi. Set in the fertile coffee plantation area of Gombengsari, we offer the quietude of nature with refreshing, pollution-free mountain air.",
    aboutDesc2: "Founded by Pak Peno, a local coffee farmer and experienced guide, we are committed to providing the true warmth of a local family. Here, you will wake up to the sweet fragrance of coffee blossoms, savor fresh organic robusta & liberica coffee, and witness majestic sunrises.",
    aboutOwnerTitle: "A Message from Pak Peno",
    aboutOwnerDesc: "\"We invite you to experience the simplicity and warmth of village life. Here, you are not just a guest, but a member of our family.\"",

    // Experience Section
    expLabel: "Unique Experiences",
    expTitle: "Unforgettable Activities with Us",
    expDesc: "Make your vacation memorable by joining various authentic activities we've designed specifically for our guests.",

    // Gallery Section
    galLabel: "Homestay Gallery",
    galTitle: "Every Corner Tells a Beautiful Story",
    galDesc: "Take a peek at our comfortable bedrooms, the lush coffee estate surrounding the homestay, and the fun adventures of our guests.",
    galFilterAll: "All",
    galFilterRoom: "Accommodations",
    galFilterCulinary: "Culinary",
    galFilterActivity: "Activities & Nature",
    galFilterDest: "Destinations",

    // Reviews Section
    revLabel: "Guest Reviews",
    revTitle: "Honest Words from Those Who Stayed",
    revSubtitle: "Average rating of 4.9 from over 90+ reviews across major travel platforms.",

    // Information Section
    infoLabel: "Essential Information",
    infoTitle: "Guide & Homestay Amenities",
    infoDesc: "Here is a summary of facilities, policies, and directions to Peno Homestay to ensure a seamless holiday.",
    infoRateTitle: "Nightly Rate",
    infoRateDesc: "Affordable and flexible standard rates with complete amenities.",
    infoAmenitiesTitle: "Room Amenities",
    infoAmenitiesDesc: "Clean room, comfortable king-size mattress, thick warm blankets, complimentary tea/coffee.",
    infoLocationTitle: "Strategic Location",
    infoLocationDesc: "Gateway to Mount Ijen. 30 minutes drive from Karangasem/Ketapang Station.",
    infoCheckTitle: "Check-In & Check-Out",
    infoCheckDesc: "Flexible check-in after 2:00 PM, check-out by 12:00 PM noon.",

    // Footer
    footerDesc: "Authentic family holiday accommodation amidst Gombengsari coffee plantation, Kalipuro, Banyuwangi. Gateway to Kawah Ijen & Bromo.",
    footerNav: "Page Navigation",
    footerContact: "Contact Us",
    footerAddress: "Address",
    footerMapsBtn: "Open route in Google Maps",

    // Booking Engine Page
    bookEngineTitle: "Online Room Booking",
    bookEngineDesc: "Secure your stay by selecting your check-in and check-out dates to view availability.",
    bookFormTitle: "Complete Your Booking Details",
    bookFormDesc: "Fill out the form below with correct information to process your booking.",
    bookFormName: "Your Full Name *",
    bookFormEmail: "Active Email Address *",
    bookFormWa: "WhatsApp Number (Active) *",
    bookFormGuests: "Number of Guests *",
    bookFormNotes: "Additional Notes or Special Requests",
    bookFormSubmit: "Send Booking Form via WhatsApp",
    bookSelectRange: "Please select your Check-Out date...",
    bookFillData: "Fill Your Personal Info",
    bookHowTo: "How It Works",
    bookHowTo1: "Select your Check-In and Check-Out dates on the calendar on the left.",
    bookHowTo2: "The booking details form will automatically appear.",
    bookHowTo3: "Press the submit button to send an automated booking message to Pak Peno.",
    bookHowTo4: "Pak Peno will confirm availability and payment details via WhatsApp.",
    bookTerms: "Booking Terms & Conditions",
    bookTerms1: "Free cancellation is available up to 3 days prior to your arrival date.",
    bookTerms2: "Downpayment/full payments are manually verified via WhatsApp.",
    bookTerms3: "Includes healthy breakfast & unlimited fresh coffee from the estate.",
    bookTerms4: "Complimentary Mount Ijen tour assistance is provided by Pak Peno.",
    bookCalendarHeader: "Select Your Booking Dates",
  }
};
