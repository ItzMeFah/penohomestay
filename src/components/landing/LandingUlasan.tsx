import React from 'react';
import { Star } from 'lucide-react';
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
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-sand text-xs uppercase tracking-wider font-semibold block">
            {lang === 'ID' ? 'Ulasan Tamu' : t.revLabel}
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-cream tracking-tight">
            {lang === 'ID' ? 'Pengalaman Tamu' : t.revTitle}
          </h2>
          <div className="flex items-center justify-center space-x-1 text-yellow-400 pt-1">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
            <span className="ml-2 font-sans font-medium text-cream text-xs">
              {lang === 'ID' ? '4.9 / 5.0 di Google' : '4.9 / 5.0 on Google'}
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
                return "The absolute perfect gateway to Mount Ijen! Pak Peno prepared everything for our hiking tour and showed us real village hospitality.";
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
      </div>
    </section>
  );
};
