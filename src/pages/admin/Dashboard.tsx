import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { formatCurrency } from '../../lib/utils';
import { Users, Banknote, CalendarCheck, CalendarX } from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const { data: bookings } = useQuery({ queryKey: ['bookings'], queryFn: api.getBookings });
  
  const totalRevenue = bookings?.filter(b => b.status === 'Confirmed' || b.status === 'Checked In' || b.status === 'Checked Out').reduce((acc, curr) => acc + curr.total_price, 0) || 0;
  const activeBookings = bookings?.filter(b => b.status === 'Confirmed' || b.status === 'Checked In').length || 0;
  const cancelledBookings = bookings?.filter(b => b.status === 'Cancelled').length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-sm text-gray-500">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center">
          <div className="w-12 h-12 bg-orange-100 text-bento-primary rounded-lg flex items-center justify-center mr-4">
            <Banknote className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mr-4">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Active Bookings</p>
            <p className="text-2xl font-bold text-gray-900">{activeBookings}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-lg flex items-center justify-center mr-4">
            <CalendarX className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Cancelled</p>
            <p className="text-2xl font-bold text-gray-900">{cancelledBookings}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mr-4">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Guests</p>
            <p className="text-2xl font-bold text-gray-900">{bookings?.reduce((acc, b) => acc + b.adults + b.kids, 0) || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-serif font-bold text-lg">Recent Bookings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 font-medium">Guest</th>
                <th className="px-6 py-3 font-medium">Check-in / Out</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings?.slice(0, 5).map(booking => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{booking.guest_name}</div>
                    <div className="text-xs text-gray-500">{booking.guest_phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div>{format(new Date(booking.check_in), 'dd MMM yyyy')}</div>
                    <div className="text-xs text-gray-500">to {format(new Date(booking.check_out), 'dd MMM yyyy')}</div>
                  </td>
                  <td className="px-6 py-4 font-medium">{formatCurrency(booking.total_price)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${booking.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' : 
                        booking.status === 'Checked In' ? 'bg-green-100 text-green-800' : 
                        booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
              {(!bookings || bookings.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No bookings found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
