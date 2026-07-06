import { Link } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { formatCurrency } from '../lib/utils';
import { Users, Wifi, Wind, Tv } from 'lucide-react';
import SafeImage from '../components/SafeImage';

export default function Rooms() {
  const { data: rooms, isLoading } = useQuery({ queryKey: ['rooms'], queryFn: api.getRooms });

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto pt-32 pb-16 px-4 md:px-8">
      <div className="max-w-[1280px] w-full mx-auto">
        <div className="mb-10 text-center">
          <span className="text-bento-primary font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-2 block">
            Luxury Stays
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-bento-text">OUR ROOMS</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Choose from our premium selection of rooms designed for your comfort and ultimate relaxation.</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-3xl p-4 border border-bento-border animate-pulse h-96">
                <div className="w-full h-48 bg-gray-200 rounded-2xl mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms?.map(room => (
              <div key={room.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm flex flex-col group hover:shadow-xl transition-all duration-500">
                <div className="h-56 md:h-64 overflow-hidden relative flex">
                  <SafeImage 
                    src={room.image_url} 
                    alt={room.name} 
                    fallbackType="room"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-gray-900 px-4 py-2 rounded-full text-sm font-bold shadow-md tracking-wider">
                    {formatCurrency(room.price)} / night
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-serif font-bold tracking-tight">{room.name}</h3>
                  </div>
                  <p className="text-gray-500 text-sm mb-6 leading-relaxed flex-1 line-clamp-3">{room.description}</p>
                  
                  <div className="flex flex-wrap gap-4 mb-8">
                    <div className="flex items-center text-xs text-gray-500 font-medium">
                      <Users className="w-4 h-4 mr-1.5 text-bento-primary" /> {room.capacity} Guests
                    </div>
                    <div className="flex items-center text-xs text-gray-500 font-medium">
                      <Wifi className="w-4 h-4 mr-1.5 text-bento-primary" /> WiFi
                    </div>
                    <div className="flex items-center text-xs text-gray-500 font-medium">
                      <Wind className="w-4 h-4 mr-1.5 text-bento-primary" /> AC
                    </div>
                    <div className="flex items-center text-xs text-gray-500 font-medium">
                      <Tv className="w-4 h-4 mr-1.5 text-bento-primary" /> TV
                    </div>
                  </div>

                  <Link to={`/rooms/${room.id}`} className="bg-black text-white text-center py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-bento-primary transition-colors w-full">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
