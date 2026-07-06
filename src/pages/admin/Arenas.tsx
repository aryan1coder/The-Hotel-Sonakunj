import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, X, Save, Sparkles } from 'lucide-react';
import { api } from '../../lib/api';
import { Arena } from '../../types';

export default function AdminArenas() {
  const queryClient = useQueryClient();
  const { data: arenas, isLoading } = useQuery({
    queryKey: ['arenas'],
    queryFn: api.getArenas
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArena, setEditingArena] = useState<Arena | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    short_description: '',
    detailed_description: '',
    image_url: '',
    capacity_min: 50,
    capacity_max: 1000
  });

  const [errorMsg, setErrorMsg] = useState('');

  const openAddModal = () => {
    setEditingArena(null);
    setFormData({
      name: '',
      short_description: '',
      detailed_description: '',
      image_url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=600&auto=format&fit=crop',
      capacity_min: 50,
      capacity_max: 1000
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const openEditModal = (arena: Arena) => {
    setEditingArena(arena);
    setFormData({
      name: arena.name,
      short_description: arena.short_description || '',
      detailed_description: arena.detailed_description || arena.short_description || '',
      image_url: arena.image_url || '',
      capacity_min: arena.capacity_min || 50,
      capacity_max: arena.capacity_max || 1000
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const createMutation = useMutation({
    mutationFn: api.createArena,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['arenas'] });
      setIsModalOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: Partial<Arena> }) => api.updateArena(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['arenas'] });
      setIsModalOpen(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteArena,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['arenas'] });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg('Arena Name is required');
      return;
    }

    if (editingArena) {
      updateMutation.mutate({
        id: editingArena.id,
        updates: formData
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this arena?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-serif font-bold text-gray-900">Manage Arenas</h2>
          <p className="text-gray-500 mt-1">Add, edit, or remove arenas and venues shown on the home page.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-bento-primary text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-bento-primary-hover transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" /> Add Arena
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading arenas...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(arenas || []).map((arena) => (
            <div key={arena.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="h-48 bg-gray-100 relative">
                <img src={arena.image_url} alt={arena.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button 
                    onClick={() => openEditModal(arena)}
                    className="p-2 bg-white rounded-lg shadow-sm text-gray-700 hover:text-bento-primary transition-colors"
                    title="Edit Arena"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(arena.id)}
                    className="p-2 bg-white rounded-lg shadow-sm text-red-500 hover:bg-red-50 transition-colors"
                    title="Delete Arena"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg font-serif mb-2">{arena.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">{arena.short_description}</p>
                </div>
                <div className="pt-3 border-t border-gray-100 text-xs text-gray-400 font-mono flex justify-between">
                  <span>Min Capacity: {arena.capacity_min || 50}</span>
                  <span>Max Capacity: {arena.capacity_max || 1000}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Arena Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold font-serif text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-bento-primary" />
                {editingArena ? 'Edit Arena Details' : 'Add New Arena'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Arena Name</label>
                <input 
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Nidhivan Lawn"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bento-primary/20 focus:border-bento-primary text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Short Description</label>
                <textarea 
                  required
                  rows={2}
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  placeholder="A quick summary shown on listings"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bento-primary/20 focus:border-bento-primary text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Detailed Description</label>
                <textarea 
                  rows={4}
                  value={formData.detailed_description}
                  onChange={(e) => setFormData({ ...formData, detailed_description: e.target.value })}
                  placeholder="Full description displayed inside the details modal"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bento-primary/20 focus:border-bento-primary text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Image URL</label>
                <input 
                  type="text"
                  required
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="Unsplash image URL"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bento-primary/20 focus:border-bento-primary text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Min Capacity</label>
                  <input 
                    type="number"
                    min="1"
                    value={formData.capacity_min}
                    onChange={(e) => setFormData({ ...formData, capacity_min: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bento-primary/20 focus:border-bento-primary text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Max Capacity</label>
                  <input 
                    type="number"
                    min="1"
                    value={formData.capacity_max}
                    onChange={(e) => setFormData({ ...formData, capacity_max: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bento-primary/20 focus:border-bento-primary text-sm"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="bg-bento-primary hover:bg-bento-primary-hover text-white px-5 py-2 rounded-xl flex items-center gap-1.5 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Arena'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
