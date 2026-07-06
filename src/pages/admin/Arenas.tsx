import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function AdminArenas() {
  const [arenas, setArenas] = useState([
    { id: '1', name: 'Nidhivan Lawn', short_description: 'A beautiful lush green lawn for outdoor events.', image_url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=600&auto=format&fit=crop' },
    { id: '2', name: 'Vrindavan Hall', short_description: 'An elegant banquet hall for grand celebrations.', image_url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=600&auto=format&fit=crop' },
    { id: '3', name: 'Madhuban Hall', short_description: 'A versatile hall for conferences and events.', image_url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=600&auto=format&fit=crop' },
    { id: '4', name: 'Sattva Restaurant', short_description: 'Fine dining experience with pure veg delicacies.', image_url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=600&auto=format&fit=crop' }
  ]);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-serif font-bold text-gray-900">Manage Arenas</h2>
          <p className="text-gray-500 mt-1">Edit the venues displayed on the homepage.</p>
        </div>
        <button className="bg-bento-primary text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-bento-primary-hover transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Add Arena
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {arenas.map((arena) => (
          <div key={arena.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="h-48 bg-gray-100 relative">
              <img src={arena.image_url} alt={arena.name} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 flex gap-2">
                <button className="p-2 bg-white rounded-lg shadow-sm text-gray-700 hover:text-bento-primary transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-2 bg-white rounded-lg shadow-sm text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-lg font-serif mb-2">{arena.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{arena.short_description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
