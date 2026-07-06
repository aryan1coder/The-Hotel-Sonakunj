import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { api, HotelSettings } from '../lib/api';

interface SplashLoaderProps {
  onComplete: () => void;
}

export default function SplashLoader({ onComplete }: SplashLoaderProps) {
  const [settings, setSettings] = useState<HotelSettings | null>(null);
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Fetch hotel settings for branding
    api.getSettings().then(setSettings);

    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 600); // Allow exit animation to complete
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const hotelName = settings?.hotel_name || "The Sonakunj";
  const logoUrl = settings?.logo_url;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[200] bg-neutral-950 flex flex-col items-center justify-center select-none"
        >
          {/* Ambient background glow */}
          <div className="absolute w-[400px] h-[400px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />

          <div className="flex flex-col items-center max-w-md text-center px-6">
            {/* Elegant Logo Circle */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-28 h-28 rounded-full border border-amber-500/20 bg-neutral-900 flex items-center justify-center shadow-2xl mb-8"
            >
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt={hotelName} 
                  className="w-20 h-20 rounded-full object-cover" 
                />
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <span className="text-4xl font-serif text-amber-500 tracking-widest font-extrabold select-none">S</span>
                  <div className="absolute inset-2 border border-dashed border-amber-500/10 rounded-full animate-[spin_20s_linear_infinite]" />
                </div>
              )}
            </motion.div>

            {/* Welcome Text */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 0.7 }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
              className="text-amber-500 text-xs md:text-sm font-bold uppercase tracking-[0.3em] mb-3"
            >
              Welcome to
            </motion.p>

            {/* Hotel Name Heading */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl md:text-5xl font-serif font-bold text-white tracking-wider mb-8"
            >
              {hotelName.toUpperCase()}
            </motion.h1>

            {/* Premium Loader Bar */}
            <div className="w-48 h-[1px] bg-neutral-800 rounded-full overflow-hidden relative">
              <motion.div
                initial={{ left: "-100%" }}
                animate={{ left: "100%" }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent"
              />
            </div>

            {/* Footer Tag */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="text-[10px] text-gray-500 tracking-[0.15em] uppercase font-sans mt-12"
            >
              Exquisite Heritage Hospitality
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
