import React from 'react';
import { motion } from 'motion/react';
import { Trees, Heart, Mountain, Star } from 'lucide-react';
import { CMSHomepage } from '../../types';
import { LanguageType, translations } from '../../utils/lang';

interface LandingAboutProps {
  homepageData: CMSHomepage;
  lang: LanguageType;
}

export const LandingAbout: React.FC<LandingAboutProps> = ({ homepageData, lang }) => {
  const t = translations[lang];

  return (
    <section id="tentang" className="py-24 px-6 md:px-12 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
      {/* Left column text */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="lg:col-span-7 space-y-6"
      >
        <div className="flex items-center space-x-2 text-green-soft font-mono text-xs uppercase tracking-widest font-semibold">
          <span>{t.aboutLabel}</span>
          <div className="w-8 h-px bg-green-soft/50" />
        </div>
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-green-deep leading-tight">
          {lang === 'ID' ? homepageData.about.title : t.aboutTitle}
        </h2>
        <p className="text-base md:text-lg text-text-mid font-sans font-light leading-relaxed whitespace-pre-line">
          {lang === 'ID' ? homepageData.about.body : `${t.aboutDesc1}\n\n${t.aboutDesc2}`}
        </p>
        
        {/* Highlights grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
          {(homepageData.about.highlightItems || []).map((item, idx) => {
            const defaultImages: Record<string, string> = {
              "hl-1": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&h=400&q=80",
              "hl-2": "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&h=400&q=80",
              "hl-3": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=600&h=400&q=80",
              "hl-4": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&h=400&q=80"
            };
            const imgUrl = item.imageUrl || defaultImages[item.id] || "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=600&h=400&q=80";

            // Get dynamic thematic icon based on highlight category or text
            const getHighlightIcon = () => {
              const lowerTitle = (item.title || "").toLowerCase();
              const itemId = item.id || "";
              if (lowerTitle.includes("coffee") || lowerTitle.includes("kopi") || itemId === "hl-1") {
                return (
                  <svg viewBox="0 0 100 100" fill="currentColor" className="w-3.5 h-3.5 text-sand">
                    <ellipse cx="50" cy="50" rx="42" ry="28" transform="rotate(-30 50 50)" />
                    <path
                      d="M20,62 Q50,35 80,38"
                      stroke="#4a2c11"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                );
              }
              if (lowerTitle.includes("tour") || lowerTitle.includes("tur") || lowerTitle.includes("alam") || lowerTitle.includes("explore") || itemId === "hl-2") {
                return <Trees className="w-3.5 h-3.5 text-sand" />;
              }
              if (lowerTitle.includes("family") || lowerTitle.includes("keluarga") || lowerTitle.includes("host") || lowerTitle.includes("warm") || itemId === "hl-3") {
                return <Heart className="w-3.5 h-3.5 fill-sand text-sand" />;
              }
              if (lowerTitle.includes("ijen") || lowerTitle.includes("kawah") || lowerTitle.includes("mount") || lowerTitle.includes("gunung") || itemId === "hl-4") {
                return <Mountain className="w-3.5 h-3.5 text-sand" />;
              }
              return <Star className="w-3.5 h-3.5 fill-sand text-sand" />;
            };

            return (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -60 : 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: "easeOut" }}
                className="relative h-48 sm:h-56 lg:h-60 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer border border-sand/20"
              >
                <img 
                  src={imgUrl} 
                  alt={item.title} 
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 group-hover:from-black/95" />
                
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 flex flex-col justify-end h-full z-10 text-left">
                  <div className="flex items-center space-x-2.5 mb-1.5">
                    <div className="bg-sand/25 backdrop-blur-md p-1.5 rounded-full text-sand shrink-0 border border-sand/40 flex items-center justify-center">
                      {getHighlightIcon()}
                    </div>
                    <span className="font-sans text-sm sm:text-base font-semibold text-white drop-shadow-sm group-hover:text-sand transition-colors duration-300">
                      {item.title}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-[10px] sm:text-[11px] text-cream/65 font-light tracking-wide line-clamp-2 leading-relaxed transition-all duration-300 group-hover:text-cream/85">
                      {item.description}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Right column illustration card of Pak Peno */}
      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
        className="lg:col-span-5 relative mt-16 lg:mt-20"
      >
        <div className="absolute inset-0 bg-green-soft rounded-3xl -rotate-3 scale-[1.02] opacity-10 pointer-events-none" />
        
        <div className="bg-green-deep rounded-3xl p-8 pt-20 md:p-10 md:pt-24 shadow-2xl text-cream relative">
          <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-soft/10 rounded-full blur-2xl" />
          </div>

          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-cream shadow-2xl overflow-hidden z-20 bg-cream-dark">
            <img 
              src="https://njgsafkwldootsupwjsb.supabase.co/storage/v1/object/public/avatars/pak%20peno.png" 
              alt="Pak Peno" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top hover:scale-110 transition-transform duration-500"
            />
          </div>

          <div className="space-y-6 relative z-10 text-center">
            <div className="space-y-1">
              <span className="text-sand font-mono text-[10px] uppercase tracking-widest font-bold">
                {lang === 'ID' ? 'Kisah Tuan Rumah' : 'Our Host Biography'}
              </span>
              <h3 className="font-serif text-xl md:text-2xl font-bold text-sand">
                Pak Peno
              </h3>
              <p className="font-sans text-[10px] text-cream/60">
                {lang === 'ID' ? 'Petani Kopi & Pemandu Wisata Senior' : 'Coffee Farmer & Senior Local Guide'}
              </p>
            </div>

            <div className="bg-green-soft/10 rounded-2xl p-4 border border-green-soft/20 text-left relative">
              <span className="font-serif text-5xl text-sand/20 absolute -top-3 -left-1 font-extrabold select-none">“</span>
              <p className="font-sans text-xs md:text-sm text-cream/90 font-light leading-relaxed relative z-10 pl-4 italic">
                {lang === 'ID' 
                  ? '"Peno Homestay bukan sekadar penginapan. Di sini, Anda terlelap dengan wangi cengkeh dan pala, terbangun oleh aroma sangrai kopi tradisional di dapur keluarga kami."' 
                  : t.aboutOwnerDesc}
              </p>
            </div>

            <div className="text-left bg-cream/5 rounded-2xl p-4 border border-cream/5 space-y-2">
              <h4 className="font-serif text-xs font-bold text-sand uppercase tracking-wider flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sand" />
                <span>{lang === 'ID' ? 'Sekilas Tentang Pak Peno' : 'About Pak Peno'}</span>
              </h4>
              <p className="font-sans text-xs text-cream/80 font-light leading-relaxed">
                {lang === 'ID' 
                  ? 'Pak Peno adalah generasi petani kopi Gombengsari yang mendedikasikan hidupnya untuk melestarikan kopi rakyat dan membagikan kehangatan budaya lokal kepada wisatawan mancanegara maupun domestik.'
                  : 'Pak Peno is a coffee farmer from Gombengsari who dedicates his life to preserving traditional farming and sharing the authentic warmth of local village culture with guests from all over the world.'}
              </p>
            </div>

            <div className="border-t border-cream/10 pt-4 flex items-center justify-between">
              <div className="flex items-center space-x-3 text-left">
                <div className="w-9 h-9 rounded-full bg-sand/20 border border-sand/40 flex items-center justify-center font-bold text-sand text-sm">P</div>
                <div>
                  <div className="font-sans text-xs font-semibold text-cream">
                    {lang === 'ID' ? 'Peno & Keluarga' : 'Peno & Family'}
                  </div>
                  <div className="font-sans text-[10px] text-cream/60">
                    {lang === 'ID' ? 'Tuan Rumah Anda' : 'Your Hosts'}
                  </div>
                </div>
              </div>
              
              <span className="inline-flex items-center bg-sand/15 px-2.5 py-1 rounded-full text-[9px] font-mono font-bold text-sand uppercase tracking-wider">
                ★ 4.9 Google Maps
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
