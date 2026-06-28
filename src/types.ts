export interface Booking {
  id: string;
  created_at: string;
  status: 'pending' | 'paid' | 'cancelled';
  check_in: string; // ISO String
  check_out: string; // ISO String
  nights: number;
  total_eur: number;
  guest_name: string;
  guest_email: string;
  guest_wa: string;
  guest_count: number;
  notes?: string;
}

export interface CMSStat {
  value: string;
  label: string;
  icon: string;
}

export interface CMSFeature {
  icon: string;
  title: string;
  desc: string;
}

export interface CMSTestimonial {
  text: string;
  author: string;
  rating: number;
}

export interface CMSTourPackage {
  id: number;
  name: string;
  description: string;
  inclusions: string[];
  contactPhone: string;
  contactSocial: string;
  imageUrl: string;
  isActive: boolean;
  price?: string;
}

export interface CMSHighlightItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
}

export interface CMSHomepage {
  hero: {
    headline: string;
    subheadline: string;
    badge: string;
  };
  stats: CMSStat[];
  about: {
    title: string;
    body: string;
    highlights: string[];
    highlightItems?: CMSHighlightItem[];
  };
  features: CMSFeature[];
  tours: CMSTourPackage[];
  testimonials: CMSTestimonial[];
  info: {
    checkin: string;
    checkout: string;
    price_from: number;
    facilities: string[];
    activities: string[];
  };
}

export interface GalleryItem {
  id: number;
  label: string;
  category: string;
  color: string;
  url: string; // optional image url
  order: number;
  showInSlideshow?: boolean;
  showInGallery?: boolean;
}

export interface AdminNotification {
  id: number;
  read: boolean;
  type: 'new_booking' | 'booking_confirmed' | 'booking_cancelled';
  booking: Booking;
  time: string; // ISO String
}
