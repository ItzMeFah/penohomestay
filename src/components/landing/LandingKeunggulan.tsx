import React from 'react';
import { motion } from 'motion/react';
import { 
  Star, MessageSquare, Calendar, Coffee, Compass, Utensils, MapPin, Droplets, Heart, Home, Map 
} from 'lucide-react';
import { CMSHomepage } from '../../types';
import { LanguageType, translations } from '../../utils/lang';

interface LandingKeunggulanProps {
  homepageData: CMSHomepage;
  lang: LanguageType;
}

export const LandingKeunggulan: React.FC<LandingKeunggulanProps> = ({ homepageData, lang }) => {
  const t = translations[lang];

  const renderIcon = (iconName: string, className = "w-6 h-6") => {
    switch (iconName.toLowerCase()) {
      case 'star': return <Star className={`${className} text-sand fill-sand`} />;
      case 'chat':
      case 'message': return <MessageSquare className={className} />;
      case 'euro': return <span className={`${className} font-serif font-bold text-center flex items-center justify-center text-lg`}>€</span>;
      case 'calendar': return <Calendar className={className} />;
      case 'coffee': return <Coffee className={className} />;
      case 'compass': return <Compass className={className} />;
      case 'utensils': return <Utensils className={className} />;
      case 'map-pin': return <MapPin className={className} />;
      case 'droplets': return <Droplets className={className} />;
      case 'heart': return <Heart className={className} />;
      case 'home': return <Home className={className} />;
      case 'map': return <Map className={className} />;
      case 'leaf':
      default: return <Coffee className={className} />;
    }
  };

  return (
    <section id="keunggulan" className="bg-white/50 backdrop-blur-sm border-y border-sand/30 py-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-green-soft text-xs uppercase tracking-wider font-semibold block">
            {lang === 'ID' ? 'Keunggulan Kami' : t.expLabel}
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-green-deep tracking-tight">
            {lang === 'ID' ? 'Fasilitas & Keunggulan' : t.expTitle}
          </h2>
          <p className="font-sans text-xs md:text-sm text-text-mid font-light leading-relaxed">
            {lang === 'ID' 
              ? 'Pengalaman menginap bernuansa alam dengan fasilitas lengkap dan keramahan khas keluarga pedesaan.' 
              : t.expDesc}
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {homepageData.features.map((item, idx) => {
            const getFeatureTitle = () => {
              if (lang === 'ID') return item.title;
              const titleLower = item.title.toLowerCase();
              if (titleLower.includes('kopi')) return "Unlimited Estate Coffee";
              if (titleLower.includes('ijen') || titleLower.includes('tur')) return "Mount Ijen Guiding";
              if (titleLower.includes('sarapan') || titleLower.includes('kuliner')) return "Authentic Farm Breakfast";
              if (titleLower.includes('kambing') || titleLower.includes('etawa') || titleLower.includes('susu')) return "Milking Etawa Goats";
              if (titleLower.includes('keluarga') || titleLower.includes('ramah')) return "Local Family Warmth";
              if (titleLower.includes('tenang') || titleLower.includes('damai') || titleLower.includes('udara')) return "Peaceful & Crisp Air";
              return item.title;
            };

            const getFeatureDesc = () => {
              if (lang === 'ID') return item.desc;
              const titleLower = item.title.toLowerCase();
              if (titleLower.includes('kopi')) return "Enjoy unlimited, fresh organic robusta & liberika coffee brewed straight from our farm.";
              if (titleLower.includes('ijen') || titleLower.includes('tur')) return "Get direct, experienced local guiding and equipment preparation for Mount Ijen hiking.";
              if (titleLower.includes('sarapan') || titleLower.includes('kuliner')) return "Wake up to delicious, home-cooked traditional Banyuwangi breakfast made with fresh ingredients.";
              if (titleLower.includes('kambing') || titleLower.includes('etawa') || titleLower.includes('susu')) return "Experience dairy goat farming, feed our local goats, and try milking them yourself.";
              if (titleLower.includes('keluarga') || titleLower.includes('ramah')) return "Be hosted like family with authentic stories, sincere hospitality, and comfortable village living.";
              if (titleLower.includes('tenang') || titleLower.includes('damai') || titleLower.includes('udara')) return "Rejuvenate in a quiet coffee farm far from city noise, with clean mountain air.";
              return item.desc;
            };

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6, delay: (idx % 3) * 0.1, ease: "easeOut" }}
                className="bg-white hover:bg-cream/40 border border-sand/20 hover:border-green-soft/20 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col space-y-4 group"
              >
                <div className="bg-green-deep/5 text-green-soft group-hover:bg-green-soft group-hover:text-cream p-4 rounded-xl w-14 h-14 flex items-center justify-center transition-colors duration-300">
                  {renderIcon(item.icon, "w-6 h-6")}
                </div>
                <h3 className="font-serif text-lg font-bold text-green-deep group-hover:text-green-soft transition-colors duration-300">
                  {getFeatureTitle()}
                </h3>
                <p className="font-sans text-sm text-text-mid font-light leading-relaxed">
                  {getFeatureDesc()}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
