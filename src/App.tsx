import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import SplashLoader from './components/SplashLoader';
import Layout from './components/Layout';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import RoomDetails from './pages/RoomDetails';
import Restaurant from './pages/Restaurant';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminBookings from './pages/admin/Bookings';
import AdminRooms from './pages/admin/Rooms';
import AdminRestaurant from './pages/admin/Restaurant';
import AdminArenas from './pages/admin/Arenas';
import AdminInquiries from './pages/admin/Inquiries';
import AdminFrontpage from './pages/admin/Frontpage';
import AdminHeritage from './pages/admin/Heritage';
import AdminSettings from './pages/admin/Settings';

const queryClient = new QueryClient();

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      {showSplash && <SplashLoader onComplete={() => setShowSplash(false)} />}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="rooms" element={<Rooms />} />
            <Route path="rooms/:id" element={<RoomDetails />} />
            <Route path="restaurant" element={<Restaurant />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="rooms" element={<AdminRooms />} />
            <Route path="restaurant" element={<AdminRestaurant />} />
            <Route path="arenas" element={<AdminArenas />} />
            <Route path="inquiries" element={<AdminInquiries />} />
            <Route path="frontpage" element={<AdminFrontpage />} />
            <Route path="heritage" element={<AdminHeritage />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
