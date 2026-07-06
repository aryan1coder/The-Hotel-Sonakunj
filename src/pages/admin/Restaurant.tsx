import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { MenuItem } from '../../types';
import SafeImage from '../../components/SafeImage';

export default function AdminRestaurant() {
  const queryClient = useQueryClient();
  const { data: menu = [], isLoading } = useQuery({ queryKey: ['menu'], queryFn: api.getMenu });
  
  const [isEditing, setIsEditing] = useState<MenuItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: api.deleteMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu'] });
    }
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this menu item?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-serif font-bold text-gray-900">Manage Restaurant</h2>
          <p className="text-gray-500 mt-1">Manage menu items, categories, and pricing here.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-bento-primary text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-bento-primary-hover transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Menu Item
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-bento-primary"></div></div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 border-b border-gray-200">
                <th className="p-4 font-medium text-sm">Image</th>
                <th className="p-4 font-medium text-sm">Item Name</th>
                <th className="p-4 font-medium text-sm">Category</th>
                <th className="p-4 font-medium text-sm">Price</th>
                <th className="p-4 font-medium text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {menu.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4 w-20">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 relative">
                      <SafeImage 
                        src={item.image_url} 
                        alt={item.name} 
                        fallbackType="menu"
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  </td>
                  <td className="p-4 font-medium text-gray-900">
                    {item.name} {item.is_veg && <span className="text-green-500 text-xs ml-1">(Veg)</span>}
                  </td>
                  <td className="p-4 text-gray-600">
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium">{item.category}</span>
                  </td>
                  <td className="p-4 font-bold text-gray-900">{formatCurrency(item.price)}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setIsEditing(item)}
                        className="p-2 text-gray-600 hover:text-bento-primary bg-white border border-gray-200 rounded-lg shadow-sm transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
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
        <MenuModal 
          item={isEditing} 
          onClose={() => { setIsEditing(null); setIsAdding(false); }} 
        />
      )}
    </div>
  );
}

function MenuModal({ item, onClose }: { item: MenuItem | null, onClose: () => void }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<MenuItem>>(item || {
    name: '', category: 'Main Course', price: 0, is_veg: true, description: '', image_url: ''
  });

  const createMutation = useMutation({
    mutationFn: api.createMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu'] });
      onClose();
    }
  });

  const updateMutation = useMutation({
    mutationFn: (variables: {id: string, updates: Partial<MenuItem>}) => api.updateMenuItem(variables.id, variables.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu'] });
      onClose();
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (item) {
      updateMutation.mutate({ id: item.id, updates: formData });
    } else {
      createMutation.mutate(formData as Omit<MenuItem, 'id'>);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-serif font-bold">{item ? 'Edit Menu Item' : 'Add Menu Item'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input type="text" required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-bento-primary" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <input type="text" required value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-bento-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
              <input type="number" required min="0" value={formData.price || 0} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-bento-primary" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional - leaves a premium placeholder if blank)</label>
            <input type="text" value={formData.image_url || ''} onChange={e => setFormData({...formData, image_url: e.target.value})} placeholder="https://example.com/food.jpg" className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-bento-primary" />
          </div>
          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="isVeg" checked={formData.is_veg || false} onChange={e => setFormData({...formData, is_veg: e.target.checked})} className="w-4 h-4 text-bento-primary accent-bento-primary rounded" />
            <label htmlFor="isVeg" className="text-sm font-medium text-gray-700 cursor-pointer">Is Vegetarian</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-bento-primary h-20 resize-none"></textarea>
          </div>
          <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="w-full bg-bento-primary text-white py-3 rounded-xl font-bold hover:bg-bento-primary-hover transition-colors shadow-sm">
            {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Item'}
          </button>
        </form>
      </div>
    </div>
  );
}
