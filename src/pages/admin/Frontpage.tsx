import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, FrontpageImage, GalleryItem } from '../../lib/api';
import { Plus, Edit2, Trash2, Loader2, X, Image as ImageIcon, Video, Play } from 'lucide-react';

export default function AdminFrontpage() {
  const queryClient = useQueryClient();

  const { data: images, isLoading: isImagesLoading } = useQuery({ 
    queryKey: ['frontpage'], 
    queryFn: api.getFrontpageImages 
  });

  const { data: galleryItems, isLoading: isGalleryLoading } = useQuery({
    queryKey: ['gallery'],
    queryFn: api.getGalleryItems
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<FrontpageImage | null>(null);

  // Form State for Hero Images
  const [url, setUrl] = useState('');
  const [caption, setCaption] = useState('');

  // Gallery Manager Form State
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  const [galleryUrl, setGalleryUrl] = useState('');
  const [galleryType, setGalleryType] = useState<'image' | 'video'>('image');
  const [galleryCaption, setGalleryCaption] = useState('');

  const openAddModal = () => {
    setEditingImage(null);
    setUrl('');
    setCaption('');
    setIsModalOpen(true);
  };

  const openEditModal = (img: FrontpageImage) => {
    setEditingImage(img);
    setUrl(img.url);
    setCaption(img.caption);
    setIsModalOpen(true);
  };

  const openAddGalleryModal = () => {
    setEditingGalleryItem(null);
    setGalleryUrl('');
    setGalleryType('image');
    setGalleryCaption('');
    setIsGalleryModalOpen(true);
  };

  const openEditGalleryModal = (item: GalleryItem) => {
    setEditingGalleryItem(item);
    setGalleryUrl(item.url);
    setGalleryType(item.type);
    setGalleryCaption(item.caption || '');
    setIsGalleryModalOpen(true);
  };

  // Hero Image Mutations
  const createMutation = useMutation({
    mutationFn: api.createFrontpageImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['frontpage'] });
      setIsModalOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: Partial<FrontpageImage> }) => 
      api.updateFrontpageImage(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['frontpage'] });
      setIsModalOpen(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteFrontpageImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['frontpage'] });
    }
  });

  // Gallery Mutations
  const createGalleryMutation = useMutation({
    mutationFn: api.createGalleryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      setIsGalleryModalOpen(false);
    }
  });

  const updateGalleryMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: Partial<GalleryItem> }) => 
      api.updateGalleryItem(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      setIsGalleryModalOpen(false);
    }
  });

  const deleteGalleryMutation = useMutation({
    mutationFn: api.deleteGalleryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingImage) {
      updateMutation.mutate({
        id: editingImage.id,
        updates: { url, caption }
      });
    } else {
      createMutation.mutate({ url, caption });
    }
  };

  const handleGallerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGalleryItem) {
      updateGalleryMutation.mutate({
        id: editingGalleryItem.id,
        updates: { url: galleryUrl, type: galleryType, caption: galleryCaption }
      });
    } else {
      createGalleryMutation.mutate({ url: galleryUrl, type: galleryType, caption: galleryCaption });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this scroller image?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleGalleryDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this gallery item?')) {
      deleteGalleryMutation.mutate(id);
    }
  };

  if (isImagesLoading || isGalleryLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-bento-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-serif font-bold text-gray-900">Frontpage Content</h2>
        <p className="text-gray-500 mt-1">Manage scrolling images and captions on the website's homepage hero section.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold font-serif text-gray-900">Hero Image Scroller</h3>
          <button 
            onClick={openAddModal}
            className="bg-bento-primary text-white px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-bento-primary-hover transition-colors shadow-sm text-sm cursor-pointer font-medium"
          >
            <Plus className="w-4 h-4" /> Add Image
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images?.map((img) => (
            <div key={img.id} className="relative group rounded-xl overflow-hidden border border-gray-200 shadow-xs hover:shadow-md transition-shadow">
              <img src={img.url} alt={img.caption} className="w-full h-48 object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button 
                  onClick={() => openEditModal(img)}
                  className="p-2 bg-white rounded-lg shadow-sm text-gray-700 hover:text-bento-primary transition-colors cursor-pointer"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(img.id)}
                  className="p-2 bg-white rounded-lg shadow-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="p-3 bg-white text-center text-sm font-semibold font-serif text-gray-800 border-t border-gray-100">
                {img.caption}
              </div>
            </div>
          ))}

          {(!images || images.length === 0) && (
            <div className="col-span-full bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-12 text-center text-gray-500">
              <p className="text-lg font-medium mb-1">No scroller images added yet</p>
              <p className="text-sm">Click "Add Image" to load customized backdrops on the home hero banner.</p>
            </div>
          )}
        </div>
      </div>

      {/* Gallery Section */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold font-serif text-gray-900">Multimedia Gallery</h3>
            <p className="text-gray-500 text-xs mt-1">Add, update, or remove immersive photos and videos displayed on the homepage gallery.</p>
          </div>
          <button 
            onClick={openAddGalleryModal}
            className="bg-bento-primary text-white px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-bento-primary-hover transition-colors shadow-sm text-sm cursor-pointer font-medium whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {galleryItems?.map((item, i) => {
            const isVideo = item.type === 'video';
            return (
              <div key={item.id || i} className="relative group rounded-xl overflow-hidden border border-gray-200 shadow-xs hover:shadow-md transition-shadow aspect-square flex flex-col">
                <div className="flex-1 relative bg-black/5 flex items-center justify-center overflow-hidden">
                  {isVideo ? (
                    <div className="relative w-full h-full">
                      <video src={item.url} muted className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Play className="w-8 h-8 text-white fill-white opacity-80" />
                      </div>
                    </div>
                  ) : (
                    <img src={item.url} alt={item.caption || 'Gallery Item'} className="w-full h-full object-cover" />
                  )}
                  
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button 
                      onClick={() => openEditGalleryModal(item)}
                      className="p-2 bg-white rounded-lg shadow-sm text-gray-700 hover:text-bento-primary transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleGalleryDelete(item.id)}
                      className="p-2 bg-white rounded-lg shadow-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="p-2 bg-white border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                    {item.type}
                  </span>
                  {item.caption && (
                    <span className="text-xs truncate max-w-[100px] text-gray-600 font-medium">
                      {item.caption}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {(!galleryItems || galleryItems.length === 0) && (
            <div className="col-span-full bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-12 text-center text-gray-500">
              <p className="text-lg font-medium mb-1">No gallery items added yet</p>
              <p className="text-sm">Click "Add Item" to feature exquisite photos or MP4 video clips.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold font-serif text-gray-900">
                {editingImage ? 'Edit Hero Image' : 'Add Hero Image'}
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
                <label className="text-xs font-bold text-gray-500 uppercase">Image URL</label>
                <div className="relative">
                  <ImageIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input 
                    type="url" 
                    value={url} 
                    onChange={e => setUrl(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bento-primary/20 focus:border-bento-primary text-sm"
                    placeholder="https://images.unsplash.com/..."
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Caption / Section Name</label>
                <input 
                  type="text" 
                  value={caption} 
                  onChange={e => setCaption(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bento-primary/20 focus:border-bento-primary text-sm"
                  placeholder="e.g. Lawn Area, Luxury Suite"
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
                    'Save Image'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Add / Edit Modal */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setIsGalleryModalOpen(false)}></div>
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold font-serif text-gray-900">
                {editingGalleryItem ? 'Edit Gallery Item' : 'Add Gallery Item'}
              </h3>
              <button 
                onClick={() => setIsGalleryModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleGallerySubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Item Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setGalleryType('image')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-medium transition-colors ${
                      galleryType === 'image'
                        ? 'border-bento-primary bg-bento-primary/5 text-bento-primary'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" /> Image
                  </button>
                  <button
                    type="button"
                    onClick={() => setGalleryType('video')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-medium transition-colors ${
                      galleryType === 'video'
                        ? 'border-bento-primary bg-bento-primary/5 text-bento-primary'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <Video className="w-4 h-4" /> Video
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Media URL</label>
                <div className="relative">
                  {galleryType === 'video' ? (
                    <Video className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  ) : (
                    <ImageIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  )}
                  <input 
                    type="url" 
                    value={galleryUrl} 
                    onChange={e => setGalleryUrl(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bento-primary/20 focus:border-bento-primary text-sm"
                    placeholder={galleryType === 'video' ? 'e.g. https://assets.mixkit.co/video/...mp4' : 'https://images.unsplash.com/...'}
                    required
                  />
                </div>
                <p className="text-[10px] text-gray-400">
                  {galleryType === 'video' 
                    ? 'Use direct links to MP4/WebM videos or embeddable YouTube links.'
                    : 'Use high-quality web URLs for gallery pictures.'}
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Caption (Optional)</label>
                <input 
                  type="text" 
                  value={galleryCaption} 
                  onChange={e => setGalleryCaption(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bento-primary/20 focus:border-bento-primary text-sm"
                  placeholder="e.g. Sunset view from central courtyard"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsGalleryModalOpen(false)}
                  className="px-5 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={createGalleryMutation.isPending || updateGalleryMutation.isPending}
                  className="px-5 py-3 bg-bento-primary text-white rounded-xl hover:bg-bento-primary-hover text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {(createGalleryMutation.isPending || updateGalleryMutation.isPending) ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    'Save Item'
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
