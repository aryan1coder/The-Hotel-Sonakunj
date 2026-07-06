import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, HeritagePlace } from '../../lib/api';
import { Plus, Edit2, Trash2, Loader2, X, Image as ImageIcon } from 'lucide-react';

export default function AdminHeritage() {
  const queryClient = useQueryClient();
  
  const { data: places, isLoading } = useQuery({ 
    queryKey: ['heritage'], 
    queryFn: api.getHeritagePlaces 
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState<HeritagePlace | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const openAddModal = () => {
    setEditingPlace(null);
    setName('');
    setDescription('');
    setImageUrl('');
    setIsModalOpen(true);
  };

  const openEditModal = (place: HeritagePlace) => {
    setEditingPlace(place);
    setName(place.name);
    setDescription(place.description);
    setImageUrl(place.image_url);
    setIsModalOpen(true);
  };

  // Mutations
  const createMutation = useMutation({
    mutationFn: api.createHeritagePlace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heritage'] });
      setIsModalOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: Partial<HeritagePlace> }) => 
      api.updateHeritagePlace(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heritage'] });
      setIsModalOpen(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteHeritagePlace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heritage'] });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPlace) {
      updateMutation.mutate({
        id: editingPlace.id,
        updates: { name, description, image_url: imageUrl }
      });
    } else {
      createMutation.mutate({ name, description, image_url: imageUrl });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this heritage place?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-bento-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-serif font-bold text-gray-900">Natural & Heritage</h2>
          <p className="text-gray-500 mt-1">Manage heritage places displayed on the homepage.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-bento-primary text-white px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-bento-primary-hover transition-colors shadow-sm cursor-pointer font-medium"
        >
          <Plus className="w-5 h-5" /> Add Place
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {places?.map((place) => (
          <div key={place.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
            <div className="h-48 bg-gray-100 relative shrink-0">
              <img src={place.image_url} alt={place.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3 flex gap-2">
                <button 
                  onClick={() => openEditModal(place)}
                  className="p-2 bg-white rounded-lg shadow-sm text-gray-700 hover:text-bento-primary transition-colors cursor-pointer"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(place.id)}
                  className="p-2 bg-white rounded-lg shadow-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg font-serif mb-2 text-gray-900">{place.name}</h3>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{place.description}</p>
              </div>
            </div>
          </div>
        ))}

        {(!places || places.length === 0) && (
          <div className="col-span-full bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-12 text-center text-gray-500">
            <p className="text-lg font-medium mb-1">No heritage places added yet</p>
            <p className="text-sm">Click "Add Place" to display local attractions on the homepage.</p>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold font-serif text-gray-900">
                {editingPlace ? 'Edit Heritage Place' : 'Add Heritage Place'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Place Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bento-primary/20 focus:border-bento-primary text-sm"
                  placeholder="e.g. Narsinghgarh Fort"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Image URL</label>
                <div className="relative">
                  <ImageIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input 
                    type="url" 
                    value={imageUrl} 
                    onChange={e => setImageUrl(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bento-primary/20 focus:border-bento-primary text-sm"
                    placeholder="https://images.unsplash.com/..."
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                <textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bento-primary/20 focus:border-bento-primary text-sm resize-none"
                  placeholder="Describe the historical or scenic background..."
                  required
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-5 py-3 bg-bento-primary text-white rounded-xl hover:bg-bento-primary-hover text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {(createMutation.isPending || updateMutation.isPending) ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    'Save Place'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
