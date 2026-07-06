import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { ContactInquiry } from '../../types';
import React, { useState } from 'react';
import { Mail, Trash2, Search, CheckCircle, MailOpen, Download, MessageSquare } from 'lucide-react';

export default function Inquiries() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'New' | 'Read' | 'Replied'>('All');

  const { data: inquiries = [], isLoading, error } = useQuery<ContactInquiry[]>({
    queryKey: ['inquiries'],
    queryFn: api.getContactInquiries
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ContactInquiry['status'] }) => 
      api.updateInquiryStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteInquiry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    }
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this inquiry?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleStatusChange = (id: string, currentStatus: ContactInquiry['status']) => {
    const nextStatus = currentStatus === 'New' ? 'Read' : currentStatus === 'Read' ? 'Replied' : 'Read';
    updateStatusMutation.mutate({ id, status: nextStatus });
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = 
      inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inquiry.phone && inquiry.phone.includes(searchTerm)) ||
      inquiry.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || inquiry.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const exportCSV = () => {
    if (filteredInquiries.length === 0) return;
    
    const headers = ['Date', 'Name', 'Email', 'Phone', 'Message', 'Status'];
    const rows = filteredInquiries.map(i => [
      i.created_at ? new Date(i.created_at).toLocaleDateString() : '',
      i.name,
      i.email,
      i.phone || '',
      i.message.replace(/,/g, ';'), // Escape commas
      i.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Sonakunj_Inquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center gap-3">
            <Mail className="w-8 h-8 text-bento-primary animate-pulse" />
            Contact & Event Inquiries
          </h1>
          <p className="text-gray-500 mt-1">Manage event enquiries and client contact forms submitted on the website.</p>
        </div>
        
        <button 
          onClick={exportCSV}
          disabled={filteredInquiries.length === 0}
          className="bg-bento-primary text-white font-semibold px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-bento-primary-hover transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed self-start md:self-auto"
        >
          <Download className="w-5 h-5" />
          Export CSV
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Search by name, email, phone or message content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-bento-primary/20 focus:border-bento-primary outline-none transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm font-medium text-gray-500">Status:</span>
          <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
            {(['All', 'New', 'Read', 'Replied'] as const).map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  statusFilter === status 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-24 bg-white rounded-3xl border border-gray-200 shadow-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bento-primary"></div>
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-red-50 border border-red-200 text-red-600 rounded-2xl">
          Failed to load inquiries. Please check your Supabase connection or local storage setup.
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 shadow-sm space-y-3">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-serif font-bold text-gray-900">No Inquiries Found</h3>
          <p className="text-gray-500 max-w-sm mx-auto">There are no inquiries matching your search criteria or none have been submitted yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInquiries.map((inquiry) => (
            <div 
              key={inquiry.id} 
              className={`bg-white rounded-3xl p-6 border transition-all duration-300 relative group flex flex-col justify-between shadow-sm hover:shadow-md ${
                inquiry.status === 'New' 
                  ? 'border-l-4 border-l-bento-primary border-gray-200' 
                  : 'border-gray-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    inquiry.status === 'New' 
                      ? 'bg-rose-50 text-rose-600 border border-rose-200' 
                      : inquiry.status === 'Read'
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'bg-green-50 text-green-600 border border-green-200'
                  }`}>
                    {inquiry.status}
                  </span>
                  
                  <span className="text-xs font-mono text-gray-400">
                    {inquiry.created_at ? new Date(inquiry.created_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'N/A'}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-lg text-gray-900 mb-1">{inquiry.name}</h3>
                
                <div className="space-y-1 mb-4 text-sm text-gray-500 font-medium">
                  <p className="hover:text-bento-primary transition-colors">
                    <a href={`mailto:${inquiry.email}`}>{inquiry.email}</a>
                  </p>
                  {inquiry.phone && (
                    <p className="hover:text-bento-primary transition-colors">
                      <a href={`tel:${inquiry.phone.replace(/[\s\-\(\)]/g, '')}`}>{inquiry.phone}</a>
                    </p>
                  )}
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-sm text-gray-700 leading-relaxed min-h-[80px]">
                  {inquiry.message}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 mt-6 pt-4">
                <button 
                  onClick={() => handleStatusChange(inquiry.id, inquiry.status)}
                  className={`text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all ${
                    inquiry.status === 'New'
                      ? 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
                      : inquiry.status === 'Read'
                      ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                      : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                  }`}
                  title="Toggle status"
                >
                  {inquiry.status === 'New' ? (
                    <>
                      <MailOpen className="w-3.5 h-3.5" />
                      Mark as Read
                    </>
                  ) : inquiry.status === 'Read' ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" />
                      Mark as Replied
                    </>
                  ) : (
                    <>
                      <Mail className="w-3.5 h-3.5" />
                      Reset to Read
                    </>
                  )}
                </button>

                <button 
                  onClick={() => handleDelete(inquiry.id)}
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-100"
                  title="Delete Inquiry"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
