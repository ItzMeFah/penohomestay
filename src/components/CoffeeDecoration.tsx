import React from 'react';
import { motion } from 'motion/react';

// Animated Swaying Coffee Tree
interface SwayingCoffeeTreeProps {
  position?: 'left' | 'right';
  className?: string;
}

export const SwayingCoffeeTree: React.FC<SwayingCoffeeTreeProps> = ({ position = 'left', className = '' }) => (
  <motion.div
    animate={{
      rotate: position === 'left' ? [-1.5, 1.5, -1.5] : [1.5, -1.5, 1.5],
      skewX: position === 'left' ? [-1, 1, -1] : [1, -1, 1],
    }}
    transition={{
      duration: 10,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    style={{ transformOrigin: "bottom center" }}
    className={`absolute bottom-0 pointer-events-none select-none z-10 opacity-25 hover:opacity-45 transition-opacity duration-700 hidden xl:block ${
      position === 'left' ? 'left-0' : 'right-0'
    } ${className}`}
  >
    <svg viewBox="0 0 300 800" className="w-[280px] h-[750px]">
      {/* Trunk / Branches */}
      <path d="M150,800 C150,600 120,400 160,200" stroke="#6b4c35" strokeWidth="18" fill="none" strokeLinecap="round" />
      <path d="M142,550 C100,500 50,480 30,420" stroke="#6b4c35" strokeWidth="12" fill="none" strokeLinecap="round" />
      <path d="M152,480 C200,430 250,420 270,360" stroke="#6b4c35" strokeWidth="12" fill="none" strokeLinecap="round" />
      <path d="M148,350 C90,300 70,250 50,180" stroke="#6b4c35" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M155,280 C210,240 230,190 250,120" stroke="#6b4c35" strokeWidth="10" fill="none" strokeLinecap="round" />

      {/* Swaying Leaves */}
      {/* Leaf 1 */}
      <path d="M30,420 C5,410 -15,360 10,340 C35,340 40,390 30,420 Z" fill="#2d5a45" />
      {/* Leaf 2 */}
      <path d="M270,360 C295,350 315,300 290,280 C265,280 260,330 270,360 Z" fill="#4a8a68" />
      {/* Leaf 3 */}
      <path d="M50,180 C25,170 15,120 40,100 C65,100 60,150 50,180 Z" fill="#2d5a45" />
      {/* Leaf 4 */}
      <path d="M250,120 C275,110 295,60 270,40 C245,40 240,90 250,120 Z" fill="#4a8a68" />
      {/* Leaf Top */}
      <path d="M160,200 C145,170 145,110 170,80 C195,110 185,170 160,200 Z" fill="#2d5a45" />

      {/* Coffee Cherries (Biji Kopi Merah & Kuning) */}
      <circle cx="130" cy="510" r="14" fill="#c0392b" />
      <circle cx="145" cy="505" r="12" fill="#e74c3c" />
      <circle cx="138" cy="520" r="13" fill="#962d22" />
      <circle cx="142" cy="512" r="8" fill="#f1c40f" />

      <circle cx="165" cy="440" r="13" fill="#c0392b" />
      <circle cx="178" cy="435" r="11" fill="#e74c3c" />
      <circle cx="172" cy="445" r="12" fill="#962d22" />

      <circle cx="130" cy="320" r="12" fill="#c0392b" />
      <circle cx="140" cy="315" r="10" fill="#e74c3c" />

      <circle cx="175" cy="250" r="11" fill="#c0392b" />
      <circle cx="185" cy="245" r="9" fill="#e74c3c" />
    </svg>
  </motion.div>
);

// Animated Floating Coffee Bean
interface CoffeeBeanProps {
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
  rotateSpeed?: number;
}

export const CoffeeBean: React.FC<CoffeeBeanProps> = ({ 
  className = "w-8 h-8 text-coffee/20", 
  delay = 0, 
  duration = 6, 
  yOffset = 25, 
  rotateSpeed = 360 
}) => (
  <motion.div
    animate={{
      y: [0, -yOffset, 0],
      rotate: [0, rotateSpeed],
    }}
    transition={{
      duration: duration,
      repeat: Infinity,
      ease: "easeInOut",
      delay: delay,
    }}
    className={`absolute pointer-events-none select-none z-0 ${className}`}
  >
    <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
      <ellipse cx="50" cy="50" rx="42" ry="28" transform="rotate(-30 50 50)" />
      <path
        d="M20,65 Q50,35 80,35"
        stroke="#f7f3ec"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  </motion.div>
);

// Animated Floating Coffee Leaf
interface CoffeeLeafProps {
  className?: string;
  delay?: number;
  duration?: number;
  sway?: number;
}

export const CoffeeLeaf: React.FC<CoffeeLeafProps> = ({ 
  className = "w-10 h-10 text-green-soft/20", 
  delay = 1, 
  duration = 8, 
  sway = 15 
}) => (
  <motion.div
    animate={{
      rotate: [-sway, sway, -sway],
      y: [0, -15, 0],
    }}
    transition={{
      duration: duration,
      repeat: Infinity,
      ease: "easeInOut",
      delay: delay,
    }}
    className={`absolute pointer-events-none select-none origin-bottom z-0 ${className}`}
  >
    <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
      <path d="M50,15 C85,40 85,80 50,90 C15,80 15,40 50,15 Z" />
      <line x1="50" y1="90" x2="50" y2="25" stroke="#f7f3ec" strokeWidth="4" opacity="0.3" />
      <path d="M50,75 Q65,65 75,65" stroke="#f7f3ec" strokeWidth="3" fill="none" opacity="0.25" />
      <path d="M50,60 Q68,50 78,50" stroke="#f7f3ec" strokeWidth="3" fill="none" opacity="0.25" />
      <path d="M50,75 Q35,65 25,65" stroke="#f7f3ec" strokeWidth="3" fill="none" opacity="0.25" />
      <path d="M50,60 Q32,50 22,50" stroke="#f7f3ec" strokeWidth="3" fill="none" opacity="0.25" />
    </svg>
  </motion.div>
);
