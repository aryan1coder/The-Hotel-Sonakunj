import React, { useState } from 'react';
import { Image as ImageIcon, BedDouble, UtensilsCrossed } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
  className?: string;
  fallbackType?: 'room' | 'menu' | 'general';
  referrerPolicy?: any;
}

export default function SafeImage({ src, alt, className, fallbackType = 'general', ...props }: SafeImageProps) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100 text-gray-400 p-4 select-none ${className}`}>
        {fallbackType === 'room' ? (
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-bento-primary/5 flex items-center justify-center mb-2.5">
              <BedDouble className="w-5 h-5 text-bento-primary" />
            </div>
            <p className="text-[10px] font-sans font-bold text-bento-primary uppercase tracking-widest">Comfort Suite</p>
            <p className="text-[9px] text-gray-400 mt-0.5">The Sonakunj Hospitality</p>
          </div>
        ) : fallbackType === 'menu' ? (
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-bento-primary/5 flex items-center justify-center mb-1.5">
              <UtensilsCrossed className="w-4 h-4 text-bento-primary" />
            </div>
            <p className="text-[9px] font-sans font-bold text-bento-primary uppercase tracking-wider">Sattva Fine Dine</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-bento-primary/5 flex items-center justify-center mb-1.5">
              <ImageIcon className="w-4 h-4 text-bento-primary" />
            </div>
            <p className="text-[9px] font-sans font-bold text-bento-primary uppercase tracking-wider">The Sonakunj</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      onError={() => setError(true)} 
      {...props} 
    />
  );
}
