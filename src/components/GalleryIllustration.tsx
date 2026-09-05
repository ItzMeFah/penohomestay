import React from 'react';

interface GalleryIllustrationProps {
  type: 'coffee' | 'room' | 'river' | 'breakfast' | 'tour' | 'ijen';
  title: string;
}

export const GalleryIllustration: React.FC<GalleryIllustrationProps> = ({ type, title }) => {
  switch (type) {
    case 'coffee':
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" style={{ backgroundColor: '#1e3a2f' }}>
          <defs>
            <radialGradient id="grad-coffee" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#2d5a45" />
              <stop offset="100%" stopColor="#12241d" />
            </radialGradient>
          </defs>
          <rect width="400" height="300" fill="url(#grad-coffee)" />
          
          {/* Leaves and Branches */}
          <path d="M50 250 C 120 200, 200 220, 350 150" stroke="#6b4c35" strokeWidth="8" strokeLinecap="round" fill="none" />
          
          {/* Leaves */}
          <path d="M120 210 C 140 170, 180 170, 200 200 C 180 220, 140 220, 120 210 Z" fill="#4a8a68" opacity="0.9" />
          <path d="M220 170 C 240 130, 280 130, 300 160 C 280 180, 240 180, 220 170 Z" fill="#2d5a45" />
          <path d="M160 225 C 190 200, 220 230, 250 210 C 220 250, 180 240, 160 225 Z" fill="#4a8a68" />

          {/* Coffee Cherries */}
          <circle cx="150" cy="210" r="10" fill="#c0392b" />
          <circle cx="162" cy="205" r="8" fill="#e74c3c" />
          <circle cx="155" cy="218" r="9" fill="#962d22" />
          <circle cx="230" cy="170" r="11" fill="#c0392b" />
          <circle cx="242" cy="165" r="9" fill="#e74c3c" />
          
          {/* Coffee Cup silhouette */}
          <path d="M300 240 L340 240 C350 240, 350 255, 340 255 L300 255 Z" stroke="#e8dfc8" strokeWidth="4" fill="none" />
          <path d="M270 210 L330 210 C335 210, 340 215, 340 220 L335 260 C335 265, 330 270, 325 270 L275 270 C270 270, 265 265, 265 260 L260 220 C260 215, 265 210, 270 210 Z" fill="#e8dfc8" />
          <path d="M255 275 L345 275" stroke="#e8dfc8" strokeWidth="5" strokeLinecap="round" />
          
          {/* Steams */}
          <path d="M285 195 Q290 185, 285 175 T285 160" stroke="#f7f3ec" strokeWidth="2" fill="none" opacity="0.6" strokeLinecap="round" />
          <path d="M300 190 Q305 180, 300 170 T300 155" stroke="#f7f3ec" strokeWidth="2" fill="none" opacity="0.6" strokeLinecap="round" />
          <path d="M315 195 Q320 185, 315 175 T315 160" stroke="#f7f3ec" strokeWidth="2" fill="none" opacity="0.6" strokeLinecap="round" />

          {/* Badge Label Overlay */}
          <rect x="20" y="20" width="130" height="26" rx="13" fill="#6b4c35" opacity="0.9" />
          <text x="85" y="37" fill="#f7f3ec" fontSize="11" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">COFFEE ORIGIN</text>
        </svg>
      );
    case 'room':
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" style={{ backgroundColor: '#2d5a45' }}>
          <defs>
            <linearGradient id="grad-room" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2d5a45" />
              <stop offset="100%" stopColor="#1e3a2f" />
            </linearGradient>
            <linearGradient id="lamp-glow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f1c40f" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f1c40f" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#grad-room)" />
          
          {/* Wooden back wall */}
          <line x1="100" y1="0" x2="100" y2="240" stroke="#1e3a2f" strokeWidth="2" opacity="0.3" />
          <line x1="200" y1="0" x2="200" y2="240" stroke="#1e3a2f" strokeWidth="2" opacity="0.3" />
          <line x1="300" y1="0" x2="300" y2="240" stroke="#1e3a2f" strokeWidth="2" opacity="0.3" />

          {/* Large Window in Room looking out to nature */}
          <rect x="50" y="30" width="120" height="140" rx="10" fill="#1e3a2f" stroke="#e8dfc8" strokeWidth="4" />
          <path d="M60 170 Q110 80, 160 170" fill="#4a8a68" opacity="0.7" />
          <path d="M80 170 Q110 110, 140 170" fill="#2d5a45" />
          
          {/* Bed Base */}
          <rect x="180" y="160" width="190" height="80" rx="8" fill="#6b4c35" />
          {/* White Blanket / Bed Sheet */}
          <path d="M200 160 L370 160 C375 160, 375 210, 370 210 L200 210 Z" fill="#f7f3ec" />
          {/* Pillows */}
          <rect x="210" y="140" width="50" height="25" rx="5" fill="#e8dfc8" />
          <rect x="270" y="140" width="50" height="25" rx="5" fill="#e8dfc8" />
          
          {/* Warm Side Table and Lamp */}
          <rect x="330" y="180" width="40" height="60" fill="#503521" />
          {/* Lamp Stand */}
          <line x1="350" y1="180" x2="350" y2="160" stroke="#e8dfc8" strokeWidth="3" />
          {/* Lamp Shade */}
          <polygon points="340,160 360,160 365,145 335,145" fill="#e8dfc8" />
          {/* Lamp Light Glow */}
          <polygon points="350,160 310,240 390,240" fill="url(#lamp-glow)" />

          {/* Room Rug */}
          <ellipse cx="280" cy="245" rx="60" ry="15" fill="#e8dfc8" opacity="0.3" />

          {/* Badge Label Overlay */}
          <rect x="20" y="20" width="110" height="26" rx="13" fill="#6b4c35" opacity="0.9" />
          <text x="75" y="37" fill="#f7f3ec" fontSize="11" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">COZY ROOM</text>
        </svg>
      );
    case 'river':
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" style={{ backgroundColor: '#1e3a2f' }}>
          <defs>
            <linearGradient id="grad-river" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f7f3ec" />
              <stop offset="40%" stopColor="#e8dfc8" />
              <stop offset="100%" stopColor="#2d5a45" />
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#grad-river)" />

          {/* Mountains in background */}
          <path d="M-50 150 L100 60 L250 150 Z" fill="#4a8a68" opacity="0.4" />
          <path d="M120 150 L260 50 L420 150 Z" fill="#2d5a45" opacity="0.5" />

          {/* River bank land */}
          <path d="M0 150 Q 150 180, 120 300 L 0 300 Z" fill="#6b4c35" />
          <path d="M400 150 Q 250 180, 280 300 L 400 300 Z" fill="#6b4c35" />

          {/* Mossy Grass and Tropical trees */}
          <path d="M0 160 Q 130 180, 110 300 L 0 300 Z" fill="#2d5a45" />
          <path d="M400 160 Q 270 180, 290 300 L 400 300 Z" fill="#1e3a2f" />

          {/* Winding Blue River */}
          <path d="M120 150 C 180 150, 220 170, 180 200 C 130 240, 200 270, 200 300 L 280 300 C 280 260, 200 230, 250 190 C 300 150, 240 150, 180 150 Z" fill="#3498db" opacity="0.85" />
          {/* Water Highlights */}
          <path d="M160 170 Q 180 180, 170 195" stroke="#f7f3ec" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
          <path d="M210 240 Q 190 260, 205 285" stroke="#f7f3ec" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />

          {/* Boulders / River Stones */}
          <ellipse cx="90" cy="220" rx="15" ry="10" fill="#7f8c8d" />
          <ellipse cx="110" cy="235" rx="20" ry="12" fill="#95a5a6" />
          <ellipse cx="290" cy="210" rx="18" ry="11" fill="#7f8c8d" />
          <ellipse cx="270" cy="230" rx="22" ry="14" fill="#95a5a6" />

          {/* Tall Wild Plants / Leaves in foreground */}
          <path d="M20 300 Q 15 240, 5 200 Q 25 240, 40 300" fill="#4a8a68" opacity="0.9" />
          <path d="M380 300 Q 385 230, 395 190 Q 375 230, 360 300" fill="#4a8a68" opacity="0.9" />

          {/* Badge Label Overlay */}
          <rect x="20" y="20" width="130" height="26" rx="13" fill="#6b4c35" opacity="0.9" />
          <text x="85" y="37" fill="#f7f3ec" fontSize="11" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">SERENE RIVER</text>
        </svg>
      );
    case 'breakfast':
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" style={{ backgroundColor: '#f7f3ec' }}>
          <defs>
            <radialGradient id="grad-bf" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="#f7f3ec" />
              <stop offset="100%" stopColor="#e8dfc8" />
            </radialGradient>
          </defs>
          <rect width="400" height="300" fill="url(#grad-bf)" />

          {/* Wooden Table texture lines */}
          <line x1="0" y1="80" x2="400" y2="80" stroke="#e8dfc8" strokeWidth="1" />
          <line x1="0" y1="160" x2="400" y2="160" stroke="#e8dfc8" strokeWidth="1" />
          <line x1="0" y1="240" x2="400" y2="240" stroke="#e8dfc8" strokeWidth="1" />

          {/* Banana Leaf Placemat */}
          <path d="M40 150 C 60 70, 340 70, 360 150 C 340 230, 60 230, 40 150 Z" fill="#2d5a45" opacity="0.85" />
          <path d="M40 150 L 360 150" stroke="#4a8a68" strokeWidth="2" strokeDasharray="5,5" />

          {/* White Plate */}
          <circle cx="160" cy="150" r="65" fill="#ffffff" filter="drop-shadow(0px 5px 5px rgba(0,0,0,0.1))" />
          <circle cx="160" cy="150" r="50" fill="none" stroke="#f7f3ec" strokeWidth="2" />

          {/* Tropical Breakfast Food on Plate */}
          {/* Papaya Slice */}
          <path d="M125 140 C 120 120, 160 110, 175 125 C 160 135, 140 145, 125 140 Z" fill="#e67e22" />
          <circle cx="150" cy="128" r="2" fill="#2c3e50" />
          <circle cx="155" cy="125" r="2" fill="#2c3e50" />
          <circle cx="160" cy="130" r="2" fill="#2c3e50" />

          {/* Fresh Banana */}
          <path d="M130 175 Q 165 190, 195 160 Q 165 170, 130 175 Z" fill="#f1c40f" />

          {/* Coffee Cup & Saucer */}
          <circle cx="280" cy="150" r="45" fill="#ffffff" filter="drop-shadow(0px 5px 5px rgba(0,0,0,0.1))" />
          <circle cx="280" cy="150" r="30" fill="#6b4c35" /> {/* Black Coffee */}
          <path d="M315 140 C 330 140, 330 160, 315 160" stroke="#ffffff" strokeWidth="5" fill="none" /> {/* Cup Handle */}
          <ellipse cx="275" cy="148" rx="15" ry="8" fill="#503521" opacity="0.9" /> {/* Coffee inner shadow */}

          {/* Steaming hot steam swirl */}
          <path d="M275 110 Q280 100, 275 90 T275 75" stroke="#6b4c35" strokeWidth="2" fill="none" opacity="0.5" strokeLinecap="round" />

          {/* Flower decoration (Frangipani) */}
          <g transform="translate(100, 90) scale(0.6)">
            <circle cx="0" cy="0" r="10" fill="#f1c40f" />
            <ellipse cx="0" cy="-20" rx="10" ry="15" fill="#ffffff" />
            <ellipse cx="20" cy="0" rx="15" ry="10" fill="#ffffff" />
            <ellipse cx="0" cy="20" rx="10" ry="15" fill="#ffffff" />
            <ellipse cx="-20" cy="0" rx="15" ry="10" fill="#ffffff" />
          </g>

          {/* Badge Label Overlay */}
          <rect x="20" y="20" width="130" height="26" rx="13" fill="#6b4c35" opacity="0.9" />
          <text x="85" y="37" fill="#f7f3ec" fontSize="11" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">LOCAL BREAKFAST</text>
        </svg>
      );
    case 'tour':
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" style={{ backgroundColor: '#e8dfc8' }}>
          <defs>
            <linearGradient id="grad-tour" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#e8dfc8" />
              <stop offset="60%" stopColor="#f7f3ec" />
              <stop offset="100%" stopColor="#dbf0e5" />
            </linearGradient>
            <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f39c12" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f39c12" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="400" height="300" fill="url(#grad-tour)" />

          {/* Warm morning sun */}
          <circle cx="300" cy="80" r="70" fill="url(#sun-glow)" />
          <circle cx="300" cy="80" r="30" fill="#f1c40f" />

          {/* Mount Raung / Ijen silhouette in background */}
          <path d="M150 160 L280 80 L390 160 Z" fill="#4a8a68" opacity="0.3" />
          <path d="M220 160 L320 100 L420 160 Z" fill="#2d5a45" opacity="0.4" />

          {/* Terraced Rice Fields */}
          <path d="M0 160 C 100 160, 150 180, 200 180 C 250 180, 300 160, 400 160 L400 300 L0 300 Z" fill="#4a8a68" />
          <path d="M0 200 C 120 200, 180 220, 220 220 C 270 220, 320 200, 400 200 L400 300 L0 300 Z" fill="#2d5a45" />
          <path d="M0 240 C 140 240, 200 260, 250 260 C 300 260, 350 240, 400 240 L400 300 L0 300 Z" fill="#1e3a2f" />

          {/* Walk Trail */}
          <path d="M80 300 Q 110 240, 180 220 T 260 180" stroke="#e8dfc8" strokeWidth="12" strokeLinecap="round" fill="none" opacity="0.8" />
          <path d="M80 300 Q 110 240, 180 220 T 260 180" stroke="#6b4c35" strokeWidth="2" strokeDasharray="6,4" strokeLinecap="round" fill="none" opacity="0.6" />

          {/* Little Cozy Javanese Hut in distance */}
          <polygon points="320,150 340,135 360,150" fill="#6b4c35" />
          <rect x="325" y="150" width="30" height="15" fill="#e8dfc8" />
          <rect x="337" y="155" width="6" height="10" fill="#6b4c35" />

          {/* Guide post/sign */}
          <line x1="140" y1="260" x2="140" y2="230" stroke="#6b4c35" strokeWidth="4" />
          <rect x="120" y="220" width="40" height="12" rx="2" fill="#e8dfc8" stroke="#6b4c35" strokeWidth="2" />
          <line x1="125" y1="226" x2="135" y2="226" stroke="#2d5a45" strokeWidth="2" />

          {/* Badge Label Overlay */}
          <rect x="20" y="20" width="130" height="26" rx="13" fill="#6b4c35" opacity="0.9" />
          <text x="85" y="37" fill="#f7f3ec" fontSize="11" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">HOMESTEAD TOUR</text>
        </svg>
      );
    case 'ijen':
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" style={{ backgroundColor: '#112233' }}>
          <defs>
            <linearGradient id="sky-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0a1520" />
              <stop offset="60%" stopColor="#1e3c5a" />
              <stop offset="100%" stopColor="#f39c12" />
            </linearGradient>
            <radialGradient id="crater-glow" cx="50%" cy="50%" r="55%">
              <stop offset="0%" stopColor="#1abc9c" />
              <stop offset="70%" stopColor="#11a88b" />
              <stop offset="100%" stopColor="#123d30" />
            </radialGradient>
          </defs>
          {/* Sunrise Sky */}
          <rect width="400" height="180" fill="url(#sky-grad)" />

          {/* Stars */}
          <circle cx="50" cy="30" r="1.5" fill="#ffffff" opacity="0.8" />
          <circle cx="120" cy="50" r="1" fill="#ffffff" opacity="0.5" />
          <circle cx="210" cy="25" r="2" fill="#ffffff" opacity="0.9" />
          <circle cx="340" cy="40" r="1" fill="#ffffff" opacity="0.6" />

          {/* Volcanic Rim / Mountain Ridges */}
          <path d="M-20 180 L80 100 L180 180 Z" fill="#1a252f" />
          <path d="M220 180 L320 80 L420 180 Z" fill="#1a252f" />
          <path d="M50 180 L200 60 L350 180 Z" fill="#111a24" />

          {/* Turquoise Crater Acid Lake */}
          <ellipse cx="200" cy="220" rx="150" ry="50" fill="url(#crater-glow)" stroke="#f1c40f" strokeWidth="2" filter="drop-shadow(0px 8px 15px rgba(26,188,156,0.6))" />

          {/* Steaming Acid Gases */}
          <path d="M150 210 Q145 190, 155 170 T150 140" stroke="#ffffff" strokeWidth="4" fill="none" opacity="0.3" strokeLinecap="round" />
          <path d="M200 220 Q210 195, 195 170 T205 130" stroke="#ffffff" strokeWidth="6" fill="none" opacity="0.4" strokeLinecap="round" />
          <path d="M250 205 Q260 185, 245 160 T255 135" stroke="#ffffff" strokeWidth="4" fill="none" opacity="0.2" strokeLinecap="round" />

          {/* Sulfur rocky slopes (yellowish) */}
          <path d="M40 220 Q 90 230, 80 270" stroke="#f1c40f" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.7" />
          <path d="M360 210 Q 310 230, 320 260" stroke="#f1c40f" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.7" />

          {/* Sunrise Glow Reflection on Lake */}
          <ellipse cx="200" cy="205" rx="70" ry="12" fill="#f39c12" opacity="0.25" />

          {/* Badge Label Overlay */}
          <rect x="20" y="20" width="130" height="26" rx="13" fill="#6b4c35" opacity="0.9" />
          <text x="85" y="37" fill="#f7f3ec" fontSize="11" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">KAWAH IJEN CRATER</text>
        </svg>
      );
    default:
      return (
        <div className="w-full h-full bg-green-deep flex items-center justify-center text-cream">
          <span>{title}</span>
        </div>
      );
  }
};
