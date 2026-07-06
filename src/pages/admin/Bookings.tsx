import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { formatCurrency } from '../../lib/utils';
import { format } from 'date-fns';
import { useState } from 'react';
import { Download, Trash2, CalendarDays, AlertTriangle } from 'lucide-react';

export default function Bookings() {
  const queryClient = useQueryClient();
  const { data: bookings, isLoading } = useQuery({ queryKey: ['bookings'], queryFn: api.getBookings });
  const [updating, setUpdating] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string, status: any }) => api.updateBookingStatus(id, status),
    onMutate: (vars) => setUpdating(vars.id),
    onSettled: () => {
      setUpdating(null);
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    }
  });

  const deleteBooking = useMutation({
    mutationFn: (id: string) => api.deleteBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    }
  });

  const deleteOlderBookings = useMutation({
    mutationFn: () => api.deleteOlderBookings(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    }
  });

  const handleDeleteIndividual = (id: string) => {
    if (confirm('Are you sure you want to delete this booking reservation permanently?')) {
      deleteBooking.mutate(id);
    }
  };

  const handleDeleteOlder = () => {
    if (confirm('Are you sure you want to delete all older bookings whose checkout date has passed? This will permanently delete them from both Supabase and LocalStorage.')) {
      deleteOlderBookings.mutate();
    }
  };

  const filteredBookings = bookings?.filter(b => 
    b.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.guest_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.guest_phone.includes(searchTerm) ||
    b.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadAllBookings = () => {
    const dataToDownload = filteredBookings || bookings;
    if (!dataToDownload || dataToDownload.length === 0) {
      alert("No booking data available to download.");
      return;
    }

    // Define CSV header
    const headers = [
      "Booking ID",
      "Guest Name",
      "Phone",
      "Email",
      "Check-In Date",
      "Check-Out Date",
      "Adults",
      "Kids",
      "Total Price",
      "Status",
      "Booking Date"
    ];

    // Format row values cleanly
    const rows = dataToDownload.map(booking => [
      `"${booking.id}"`,
      `"${booking.guest_name.replace(/"/g, '""')}"`,
      `"${booking.guest_phone}"`,
      `"${booking.guest_email}"`,
      `"${format(new Date(booking.check_in), 'yyyy-MM-dd')}"`,
      `"${format(new Date(booking.check_out), 'yyyy-MM-dd')}"`,
      booking.adults,
      booking.kids,
      booking.total_price,
      `"${booking.status}"`,
      `"${booking.created_at ? format(new Date(booking.created_at), 'yyyy-MM-dd HH:mm:ss') : ''}"`
    ]);

    // Build full CSV string
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    // Create a client-side Blob
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Trigger direct browser download
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `bookings_report_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900 flex items-center gap-2">
            <CalendarDays className="w-7 h-7 text-bento-primary" />
            Bookings Management
          </h1>
          <p className="text-sm text-gray-500">Manage all guest reservations and check-ins.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleDeleteOlder}
            className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 px-4 py-2 rounded-xl font-medium text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Clean up completed checkouts in the past"
          >
            <AlertTriangle className="w-4 h-4" /> Clear Past Bookings
          </button>
          <button
            onClick={downloadAllBookings}
            className="bg-bento-primary hover:bg-bento-primary-hover text-white px-5 py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
          >
            <Download className="w-4 h-4" /> Export Bookings CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center shrink-0">
          <input 
            type="text" 
            placeholder="Search bookings..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-bento-primary w-64 bg-white"
          />
        </div>
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm text-left relative">
            <thead className="text-xs text-gray-500 uppercase bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-6 py-3 font-medium">ID</th>
                <th className="px-6 py-3 font-medium">Guest Details</th>
                <th className="px-6 py-3 font-medium">Dates</th>
                <th className="px-6 py-3 font-medium">Guests</th>
                <th className="px-6 py-3 font-medium">Total</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {isLoading && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">Loading bookings...</td>
                </tr>
              )}
              {filteredBookings?.map(booking => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-xs font-mono text-gray-500">#{booking.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{booking.guest_name}</div>
                    <div className="text-xs text-gray-500">{booking.guest_phone}</div>
                    <div className="text-xs text-gray-500">{booking.guest_email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{format(new Date(booking.check_in), 'dd MMM yyyy')}</div>
                    <div className="text-xs text-gray-500">to {format(new Date(booking.check_out), 'dd MMM yyyy')}</div>
                  </td>
                  <td className="px-6 py-4">
                    {booking.adults} Adults<br/>
                    <span className="text-xs text-gray-500">{booking.kids} Kids</span>
                  </td>
                  <td className="px-6 py-4 font-medium">{formatCurrency(booking.total_price)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold
                      ${booking.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' : 
                        booking.status === 'Checked In' ? 'bg-green-100 text-green-800 border border-green-200' : 
                        booking.status === 'Checked Out' ? 'bg-gray-100 text-gray-800' : 
                        booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                        'bg-orange-100 text-orange-800'}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      <select 
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-bento-primary disabled:opacity-50"
                        value={booking.status}
                        disabled={updating === booking.id}
                        onChange={(e) => updateStatus.mutate({ id: booking.id, status: e.target.value })}
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Checked In">Check In</option>
                        <option value="Checked Out">Check Out</option>
                        <option value="Cancelled">Cancel</option>
                      </select>
                      <button
                        onClick={() => handleDeleteIndividual(booking.id)}
                        className="text-rose-600 hover:text-rose-900 hover:bg-rose-50 p-2 rounded-lg transition-all border border-transparent hover:border-rose-100"
                        title="Delete Reservation permanently"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!bookings || bookings.length === 0) && !isLoading && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <p className="text-lg font-medium mb-1">No bookings yet</p>
                      <p className="text-sm">When guests book rooms, they will appear here.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
