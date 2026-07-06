import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, BedDouble, UtensilsCrossed, Settings, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  const { data: settings } = useQuery({ queryKey: ['settings'], queryFn: api.getSettings });

  if (isAdmin) {
    return <Outlet />;
  }

  const hotelName = settings?.hotel_name || 'The Sonakunj';
  const logoUrl = settings?.logo_url;
  const phoneNumber = settings?.phone || '+91 8989010919';

  return (
    <div className="min-h-screen bg-bento-bg text-bento-text font-sans flex flex-col overflow-hidden relative">
      <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[1200px] flex justify-between items-center bg-black/20 backdrop-blur-md p-3 md:p-4 rounded-full shadow-2xl border border-white/20 z-[100] text-white transition-all duration-300">
        <Link to="/" className="flex items-center gap-3 pl-2 md:pl-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-inner overflow-hidden">
            {logoUrl ? (
              <img src={logoUrl} alt={hotelName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-white font-bold text-xl md:text-2xl">S</span>
            )}
          </div>
          <h1 className="text-xl md:text-2xl font-serif font-bold tracking-widest uppercase hidden sm:block drop-shadow-lg">{hotelName}</h1>
        </Link>
        
        <nav className="hidden lg:flex gap-8 font-medium text-xs uppercase tracking-widest items-center">
          <Link to="/" className="hover:text-white/70 transition-colors drop-shadow">Home</Link>
          <Link to="/rooms" className="hover:text-white/70 transition-colors drop-shadow">Rooms</Link>
          <Link to="/restaurant" className="hover:text-white/70 transition-colors drop-shadow">Restaurant</Link>
          <a href="/#arenas" className="hover:text-white/70 transition-colors drop-shadow">Arenas</a>
          <a href="/#gallery" className="hover:text-white/70 transition-colors drop-shadow">Gallery</a>
          <a href="/#heritage" className="hover:text-white/70 transition-colors drop-shadow">Heritage</a>
          <a href="/#contact" className="hover:text-white/70 transition-colors drop-shadow">Contact</a>
        </nav>
        
        <div className="flex items-center gap-3 pr-2 md:pr-4">
          <span className="bg-white/10 backdrop-blur-sm px-4 py-2 md:px-6 md:py-3 rounded-full border border-white/20 text-xs md:text-sm tracking-widest font-semibold drop-shadow hidden sm:block">
            {phoneNumber}
          </span>
          <button 
            className="lg:hidden p-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed top-[100px] left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[400px] bg-black/60 backdrop-blur-xl z-[100] rounded-3xl shadow-2xl border border-white/20 p-6 flex flex-col gap-4 lg:hidden text-white animate-in slide-in-from-top-4">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/10 transition-colors font-medium tracking-wider uppercase text-sm">
            <Home className="w-5 h-5 opacity-70" /> Home
          </Link>
          <Link to="/rooms" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/10 transition-colors font-medium tracking-wider uppercase text-sm">
            <BedDouble className="w-5 h-5 opacity-70" /> Rooms
          </Link>
          <Link to="/restaurant" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/10 transition-colors font-medium tracking-wider uppercase text-sm">
            <UtensilsCrossed className="w-5 h-5 opacity-70" /> Restaurant
          </Link>
          <a href="/#arenas" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/10 transition-colors font-medium tracking-wider uppercase text-sm">
            <Settings className="w-5 h-5 opacity-70" /> Arenas
          </a>
          <a href="/#gallery" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/10 transition-colors font-medium tracking-wider uppercase text-sm">
            <Settings className="w-5 h-5 opacity-70" /> Gallery
          </a>
          <a href="/#heritage" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/10 transition-colors font-medium tracking-wider uppercase text-sm">
            <Settings className="w-5 h-5 opacity-70" /> Heritage
          </a>
          <a href="/#contact" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/10 transition-colors font-medium tracking-wider uppercase text-sm">
            <Settings className="w-5 h-5 opacity-70" /> Contact
          </a>
        </div>
      )}

      <main className="flex-1 flex flex-col h-full w-full relative">
        <Outlet />
      </main>

      <a 
        href="https://wa.me/918989010919" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white shadow-xl hover:bg-green-600 transition-all hover:scale-110 z-[90] animate-bounce"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </a>
    </div>
  );
}
