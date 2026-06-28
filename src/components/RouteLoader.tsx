import { motion } from 'motion/react';

export function RouteLoader() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[99999] bg-cream flex items-center justify-center pointer-events-none"
    >
      <div className="relative flex items-center justify-center w-32 h-32">
        <div className="absolute text-coffee flex items-center justify-center w-12 h-12">
          {/* Custom Minimalist Coffee Bean SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 animate-pulse">
            <path d="M11.92,19.34a7.07,7.07,0,0,1-3.6-1.07c-2.85-1.81-4-5-4.47-7.79a9.69,9.69,0,0,1-.13-1.81,6.86,6.86,0,0,1,3-5.32A7,7,0,0,1,10.6,2.22c2.81-1.53,6.23-1,8.38,1.48a7.84,7.84,0,0,1,2.06,5.18c0,2.15-1,5.32-3.1,8A8.87,8.87,0,0,1,11.92,19.34Zm-2.8-2a5,5,0,0,0,2.8.84A6.81,6.81,0,0,0,16.53,16c1.78-2.22,2.54-4.88,2.54-6.69A5.85,5.85,0,0,0,17.51,5.42a5.1,5.1,0,0,0-5.69-1,5,5,0,0,0-2.8,2.68,7.74,7.74,0,0,0,.1,1.45c.42,2.4,1.38,5,3.64,6.46a1,1,0,0,1-1.06,1.7C9.36,15.19,8.27,12.43,8,9.75A1,1,0,1,1,10,9.52c.23,2.2,1,4.3,2.53,5.27a1,1,0,0,1-1,1.71A5.33,5.33,0,0,1,9.12,17.34Z" />
          </svg>
        </div>
        {/* Orbiting loading indicator */}
        <div className="absolute w-20 h-20 border-2 border-transparent border-t-coffee border-b-coffee/20 rounded-full animate-spin pointer-events-none"></div>
      </div>
    </motion.div>
  );
}
