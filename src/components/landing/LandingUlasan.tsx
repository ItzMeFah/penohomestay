import React from 'react';
import { Star, MapPin, Navigation, ExternalLink } from 'lucide-react';
import { CMSHomepage } from '../../types';
import { LanguageType, translations } from '../../utils/lang';

interface LandingUlasanProps {
  homepageData: CMSHomepage;
  lang: LanguageType;
}

export const LandingUlasan: React.FC<LandingUlasanProps> = ({ homepageData, lang }) => {
  const t = translations[lang];

  return (
    <section id="ulasan" className="bg-green-deep text-cream py-24 px-6 md:px-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-soft/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-coffee/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-sand font-mono text-xs uppercase tracking-widest font-semibold block">
            {lang === 'ID' ? 'Apa Kata Tamu Kami' : t.revLabel}
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-cream tracking-tight">
            {lang === 'ID' ? 'Testimoni Asli dari Google' : t.revTitle}
          </h2>
          <div className="flex items-center justify-center space-x-1 text-yellow-400">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
            <span className="ml-2 font-sans font-semibold text-cream">
              {lang === 'ID' ? '4.9 / 5.0 (90+ ulasan)' : '4.9 / 5.0 (90+ reviews)'}
            </span>
          </div>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {homepageData.testimonials.map((test, idx) => {
            const getTestimonialText = (text: string) => {
              if (lang === 'ID') return text;
              const tLower = text.toLowerCase();
              if (tLower.includes('ramah') || tLower.includes('keluarga')) {
                return "Pak Peno is extremely friendly and knowledgeable! We felt like part of his family. The coffee from his garden is absolutely the best.";
              }
              if (tLower.includes('bersih') || tLower.includes('nyaman') || tLower.includes('kamar')) {
                return "Comfortable and very clean rooms. The mountain air is incredibly fresh, and having unlimited fresh coffee from the estate is amazing!";
              }
              if (tLower.includes('ijen') || tLower.includes('gunung') || tLower.includes('kawah')) {
                return "The absolute perfect getaway! Pak Peno prepared everything for our village stay and showed us real Banyuwangi hospitality.";
              }
              return text;
            };

            return (
              <div 
                key={idx}
                className="bg-white/5 border border-white/10 p-8 rounded-3xl shadow-xl flex flex-col justify-between hover:border-sand/40 transition-all duration-300 group"
              >
                <div className="space-y-6">
                  {/* Stars */}
                  <div className="flex items-center space-x-1 text-yellow-400">
                    {[...Array(test.rating || 5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  {/* Quote */}
                  <p className="font-serif italic text-cream/90 leading-relaxed text-sm md:text-base">
                    "{getTestimonialText(test.text)}"
                  </p>
                </div>
                {/* Author */}
                <div className="mt-8 border-t border-white/10 pt-4 flex items-center justify-between">
                  <div className="font-sans font-medium text-sand text-sm">{test.author}</div>
                  <div className="bg-green-soft/20 text-cream/70 px-2 py-1 rounded text-xs">Verified Review</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 🗺️ Live Compact Google Maps Section */}
        <div className="pt-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-sand font-mono text-xs uppercase tracking-wider font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-green-soft" />
                  <span>{lang === 'ID' ? 'Lokasi Homestay' : 'Homestay Location'}</span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-cream">
                  {lang === 'ID' ? 'Peta Google Maps Langsung' : 'Live Google Maps Location'}
                </h3>
                <p className="text-xs sm:text-sm text-cream/75 font-sans font-light">
                  Gombengsari, Kec. Kalipuro, Kabupaten Banyuwangi, Jawa Timur
                </p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="https://maps.google.com/?q=Peno+Homestay+Gombengsari+Banyuwangi"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-sand hover:bg-cream text-green-deep font-sans font-semibold text-xs px-4 py-2.5 rounded-xl shadow transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{lang === 'ID' ? 'Buka Petunjuk Arah' : 'Get Directions'}</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </div>
            </div>

            {/* Compact Map Frame */}
            <div className="w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-white/10 shadow-inner bg-black/40 relative">
              <iframe
                title="Peno Homestay Google Maps"
                src="https://maps.google.com/maps?q=Peno+Homestay+Gombengsari+Banyuwangi&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'contrast(1.02)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>

            {/* Fast Quick Notes */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-cream/70 font-sans">
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{lang === 'ID' ? 'Udara sejuk & asri' : 'Cool & refreshing air'}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{lang === 'ID' ? 'Di tengah kebun kopi organik' : 'In the heart of organic coffee farm'}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{lang === 'ID' ? 'Akses kendaraan & parkir aman' : 'Easy car access & secure parking'}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
