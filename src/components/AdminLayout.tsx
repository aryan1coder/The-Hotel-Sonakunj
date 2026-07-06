import { Outlet, Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { LayoutDashboard, CalendarDays, Hotel, UtensilsCrossed, Settings, LogOut, Menu, X, Lock, MapPin, Mail } from 'lucide-react';
import { useAdminAuth } from '../lib/auth';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import React, { useState, useEffect } from 'react';

export default function AdminLayout() {
  const location = useLocation();
  const { isAuthenticated, login, logout, lockoutUntil, isLoading: isAuthLoading } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: settings } = useQuery({ queryKey: ['settings'], queryFn: api.getSettings });

  const hotelName = settings?.hotel_name || 'The Sonakunj';
  const logoUrl = settings?.logo_url;

  useEffect(() => {
    if (lockoutUntil) {
      const interval = setInterval(() => {
        const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000);
        if (remaining <= 0) {
          setTimeLeft(0);
          clearInterval(interval);
        } else {
          setTimeLeft(remaining);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [lockoutUntil]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    const result = await login(email || 'jcs26051109@gmail.com', password);
    setIsSubmitting(false);
    if (!result.success) {
      setError(result.error!);
    }
  };
  
  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Bookings', path: '/admin/bookings', icon: CalendarDays },
    { name: 'Rooms', path: '/admin/rooms', icon: Hotel },
    { name: 'Restaurant', path: '/admin/restaurant', icon: UtensilsCrossed },
    { name: 'Arenas', path: '/admin/arenas', icon: Hotel },
    { name: 'Inquiries', path: '/admin/inquiries', icon: Mail },
    { name: 'Frontpage', path: '/admin/frontpage', icon: LayoutDashboard },
    { name: 'Heritage', path: '/admin/heritage', icon: MapPin },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-bento-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-bento-primary rounded-xl flex items-center justify-center overflow-hidden">
              {logoUrl ? (
                <img src={logoUrl} alt={hotelName} className="w-full h-full object-cover" />
              ) : (
                <Lock className="w-8 h-8 text-white" />
              )}
            </div>
          </div>
          <h2 className="text-2xl font-serif font-bold text-center mb-2">Admin Login</h2>
          <p className="text-gray-500 text-center text-sm mb-8">Enter email and password to access the panel.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jcs26051109@gmail.com" 
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-bento-primary focus:border-bento-primary outline-none transition-all"
                disabled={timeLeft > 0 || isSubmitting}
              />
              <span className="text-[10px] text-gray-400 mt-1 block">Leave empty to use default admin email</span>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password" 
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-bento-primary focus:border-bento-primary outline-none transition-all"
                disabled={timeLeft > 0 || isSubmitting}
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            {timeLeft > 0 && (
              <p className="text-orange-500 text-sm text-center">Please wait {timeLeft} seconds before trying again.</p>
            )}
            <button 
              type="submit"
              disabled={timeLeft > 0 || isSubmitting}
              className="w-full bg-bento-text text-white font-bold py-3 rounded-xl hover:bg-black transition-colors disabled:opacity-50 flex justify-center items-center"
            >
              {isSubmitting ? 'Authenticating...' : 'Login'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-gray-500 hover:text-bento-primary transition-colors">
              Return to Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0 md:hidden sticky top-0 z-20">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-bento-primary rounded flex items-center justify-center mr-3 overflow-hidden">
            {logoUrl ? (
              <img src={logoUrl} alt={hotelName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-white font-bold">S</span>
            )}
          </div>
          <h2 className="font-serif font-bold text-lg">{hotelName} Admin</h2>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-gray-100 rounded-lg text-gray-600"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 absolute top-16 left-0 w-full z-10 shadow-lg">
          <nav className="p-4 flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors",
                    isActive 
                      ? "bg-bento-primary text-white" 
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <Icon className={cn("mr-3 h-5 w-5", isActive ? "text-white" : "text-gray-400")} />
                  {item.name}
                </Link>
              );
            })}
            <button onClick={logout} className="flex items-center px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 mt-2 text-left">
              <LogOut className="mr-3 h-5 w-5 text-red-500" />
              Sign Out
            </button>
          </nav>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex-col hidden md:flex h-screen sticky top-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 shrink-0">
          <div className="w-8 h-8 bg-bento-primary rounded flex items-center justify-center mr-3 overflow-hidden">
            {logoUrl ? (
              <img src={logoUrl} alt={hotelName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-white font-bold">S</span>
            )}
          </div>
          <h2 className="font-serif font-bold text-lg">{hotelName}</h2>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                  isActive 
                    ? "bg-bento-primary text-white shadow-sm" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Icon className={cn("mr-3 h-5 w-5", isActive ? "text-white" : "text-gray-400")} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-200 shrink-0">
          <button onClick={logout} className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors mb-2">
            <LogOut className="mr-3 h-5 w-5 text-red-500" />
            Sign Out
          </button>
          <Link to="/" className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
            <Hotel className="mr-3 h-5 w-5 text-gray-400" />
            View Website
          </Link>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col h-[calc(100vh-64px)] md:h-screen overflow-hidden bg-gray-50/50">
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
