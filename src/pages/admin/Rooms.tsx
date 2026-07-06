import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Room } from '../../types';

export default function AdminRooms() {
  const queryClient = useQueryClient();
  const { data: rooms = [], isLoading } = useQuery({ queryKey: ['rooms'], queryFn: api.getRooms });
  const [isEditing, setIsEditing] = useState<Room | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: api.deleteRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    }
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this room?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-serif font-bold text-gray-900">Manage Rooms</h2>
          <p className="text-gray-500 mt-1">Manage room categories, pricing, and availability here.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-bento-primary text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-bento-primary-hover transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Room Category
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-bento-primary"></div></div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 border-b border-gray-200">
                <th className="p-4 font-medium text-sm">Room Name</th>
                <th className="p-4 font-medium text-sm">Base Price / Night</th>
                <th className="p-4 font-medium text-sm">Capacity</th>
                <th className="p-4 font-medium text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{room.name}</td>
                  <td className="p-4 text-gray-600">{formatCurrency(room.price)}</td>
                  <td className="p-4 text-gray-600">{room.capacity} Persons</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setIsEditing(room)}
                        className="p-2 text-gray-600 hover:text-bento-primary bg-white border border-gray-200 rounded-lg shadow-sm transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(room.id)}
                        className="p-2 text-red-500 hover:bg-red-50 bg-white border border-gray-200 rounded-lg shadow-sm transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(isEditing || isAdding) && (
        <RoomModal 
          room={isEditing} 
          onClose={() => { setIsEditing(null); setIsAdding(false); }} 
        />
      )}
    </div>
  );
}

function RoomModal({ room, onClose }: { room: Room | null, onClose: () => void }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<Room>>(room || {
    name: '', type: 'Standard', price: 0, capacity: 2, description: '', image_url: '', amenities: [], size: '320 sq. ft.', bed_type: 'Double Bed', images: []
  });
  
  const [imagesText, setImagesText] = useState<string>(
    room?.images && Array.isArray(room.images) ? room.images.join(', ') : (room?.image_url || '')
  );

  const [amenitiesText, setAmenitiesText] = useState<string>(
    room?.amenities && Array.isArray(room.amenities) ? room.amenities.join(', ') : ''
  );

  const createMutation = useMutation({
    mutationFn: api.createRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      onClose();
    }
  });

  const updateMutation = useMutation({
    mutationFn: (variables: {id: string, updates: Partial<Room>}) => api.updateRoom(variables.id, variables.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      onClose();
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedImages = imagesText
      ? imagesText.split(',').map(img => img.trim()).filter(Boolean)
      : [];

    const parsedAmenities = amenitiesText
      ? amenitiesText.split(',').map(a => a.trim()).filter(Boolean)
      : [];

    const finalData = {
      ...formData,
      images: parsedImages,
      amenities: parsedAmenities.length ? parsedAmenities : [
        "Luggage trolley with bell boy service",
        "Tea - Coffee Machine",
        "24x7 House Keeping",
        "24x7 Hot Water",
        "Iron – On Call"
      ]
    };

    if (room) {
      updateMutation.mutate({ id: room.id, updates: finalData });
    } else {
      createMutation.mutate(finalData as Omit<Room, 'id'>);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-serif font-bold">{room ? 'Edit Room' : 'Add Room'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input type="text" required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-bento-primary" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price / Night *</label>
              <input type="number" required min="0" value={formData.price || 0} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-bento-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacity (Persons) *</label>
              <input type="number" required min="1" value={formData.capacity || 2} onChange={e => setFormData({...formData, capacity: Number(e.target.value)})} className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-bento-primary" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room Size (e.g. 350 sq. ft.)</label>
              <input type="text" value={formData.size || ''} onChange={e => setFormData({...formData, size: e.target.value})} className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-bento-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bed Configuration</label>
              <input type="text" value={formData.bed_type || ''} onChange={e => setFormData({...formData, bed_type: e.target.value})} className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-bento-primary" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Image URL *</label>
            <input type="url" required value={formData.image_url || ''} onChange={e => setFormData({...formData, image_url: e.target.value})} className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-bento-primary" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Gallery Images (Comma-separated URLs)</label>
            <textarea 
              value={imagesText} 
              onChange={e => setImagesText(e.target.value)} 
              placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
              className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-bento-primary h-20 resize-none text-sm"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amenities (Comma-separated list)</label>
            <textarea 
              value={amenitiesText} 
              onChange={e => setAmenitiesText(e.target.value)} 
              placeholder="Luggage trolley with bell boy service, Tea - Coffee Machine, 24x7 House Keeping, 24x7 Hot Water, Iron – On Call"
              className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-bento-primary h-20 resize-none text-sm"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea required value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-bento-primary h-20 resize-none"></textarea>
          </div>

          <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="w-full bg-bento-primary text-white py-3.5 rounded-xl font-bold hover:bg-bento-primary-hover transition-colors shadow-sm">
            {createMutation.isPending || updateMutation.isPending ? 'Saving Room...' : 'Save Room Category'}
          </button>
        </form>
      </div>
    </div>
  );
}
