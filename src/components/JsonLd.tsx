import React from 'react';

export function LodgingBusinessJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: 'Peno Homestay Banyuwangi',
    alternateName: 'Peno Homestay & Coffee Plantation',
    image: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'
    ],
    '@id': 'https://penohomestay.com/#lodging',
    url: 'https://penohomestay.com/home',
    telephone: '+6281233800631',
    priceRange: 'IDR 140.000 - IDR 250.000',
    currenciesAccepted: 'IDR, USD, EUR',
    paymentAccepted: 'Cash, Bank Transfer, QRIS',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Jl. Samarinda, Lingkungan Lerek RT 02 RW 01, Gombengsari',
      addressLocality: 'Kalipuro',
      addressRegion: 'Jawa Timur',
      postalCode: '68411',
      addressCountry: 'ID'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -8.138622,
      longitude: 114.341852
    },
    checkinTime: '14:00',
    checkoutTime: '12:00',
    numberOfRooms: 3,
    amenityFeature: [
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Free WiFi',
        value: true
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Coffee Plantation Experience & Tasting',
        value: true
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Traditional Breakfast Included',
        value: true
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Hot Shower',
        value: true
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Free Parking',
        value: true
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Kawah Ijen & Bromo Tour Assistance',
        value: true
      }
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '92',
      bestRating: '5',
      worstRating: '1'
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export const JsonLd = LodgingBusinessJsonLd;

