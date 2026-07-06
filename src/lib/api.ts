import { createClient } from '@supabase/supabase-js';
import { Room, Booking, MenuItem, ContactInquiry } from '../types';

// Supabase Configuration
const metaEnv = (import.meta as any).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL;
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY;

// Only initialize Supabase if valid credentials are provided
export const supabase = (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project-ref'))
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Default Mock Data in case database or local storage is empty
const DEFAULT_ROOMS: Room[] = [
  {
    id: 'r1',
    name: 'Standard Room',
    type: 'Standard',
    price: 1999,
    description: 'Comfortable room with essential amenities, perfect for a short stay.',
    amenities: ['Free WiFi', 'TV', 'Room Service', 'Hot Water'],
    capacity: 2,
    image_url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800',
    size: '280 sq. ft.',
    bed_type: 'Double Bed',
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    id: 'r2',
    name: 'Deluxe Room',
    type: 'Deluxe',
    price: 2499,
    description: 'Spacious air-conditioned room with premium bedding, courtyard view, and modern amenities.',
    amenities: ['Free WiFi', 'AC', 'TV', 'Room Service', 'Hot Water'],
    capacity: 2,
    image_url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800',
    size: '320 sq. ft.',
    bed_type: 'Double Bed',
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    id: 'r3',
    name: 'Deluxe Twin Room',
    type: 'Deluxe',
    price: 2699,
    description: 'Perfect for friends or colleagues with two comfortable twin beds and modern amenities.',
    amenities: ['Free WiFi', 'AC', 'TV', 'Room Service', 'Hot Water'],
    capacity: 2,
    image_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800',
    size: '340 sq. ft.',
    bed_type: 'Twin Bed',
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    id: 'r4',
    name: 'Premium Room',
    type: 'Premium',
    price: 3499,
    description: 'Luxurious room with extra space, king-size bed, and premium toiletries.',
    amenities: ['Free WiFi', 'AC', 'TV', 'Mini Fridge', 'Breakfast', 'Hot Water'],
    capacity: 3,
    image_url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800',
    size: '380 sq. ft.',
    bed_type: 'King Bed',
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    id: 'r5',
    name: 'Premium Balcony Room',
    type: 'Premium',
    price: 3999,
    description: 'Enjoy the view from your private balcony along with premium amenities and extra space.',
    amenities: ['Free WiFi', 'AC', 'TV', 'Balcony', 'Mini Fridge', 'Breakfast', 'Hot Water'],
    capacity: 3,
    image_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800',
    size: '410 sq. ft.',
    bed_type: 'King Bed',
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    id: 'r6',
    name: 'Executive suite',
    type: 'Suite',
    price: 6999,
    description: 'The ultimate luxury experience with a separate living area, premium amenities, and exclusive services.',
    amenities: ['Free WiFi', 'AC', '2 TVs', 'Living Area', 'Mini Bar', 'Breakfast', 'Hot Water'],
    capacity: 4,
    image_url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800',
    size: '550 sq. ft.',
    bed_type: 'King Bed',
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800'
    ]
  }
];

const DEFAULT_MENU: MenuItem[] = [
  { id: 'm1', name: 'Special Rajwadi Thali', category: 'Thali', price: 350, is_veg: true, description: 'Traditional royal feast with authentic flavors', image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200&auto=format&fit=crop' },
  { id: 'm2', name: 'Paneer Butter Masala', category: 'Main Course', price: 280, is_veg: true, description: 'Paneer cubes in a rich and creamy tomato-based gravy', image_url: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?q=80&w=200&auto=format&fit=crop' },
  { id: 'm3', name: 'Dal Makhani', category: 'Main Course', price: 220, is_veg: true, description: 'Slow-cooked black lentils with cream and butter', image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=200&auto=format&fit=crop' },
  { id: 'm4', name: 'Garlic Naan', category: 'Breads', price: 60, is_veg: true, description: 'Freshly baked tandoori flatbread infused with garlic', image_url: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?q=80&w=200&auto=format&fit=crop' },
  { id: 'm5', name: 'Gulab Jamun (2 pcs)', category: 'Dessert', price: 80, is_veg: true, description: 'Soft, sweet milk dumplings dipped in warm sugar syrup', image_url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=200&auto=format&fit=crop' }
];

export interface HeritagePlace {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

const DEFAULT_HERITAGE: HeritagePlace[] = [
  { id: 'h1', name: 'Narsinghgarh Fort', description: 'A grand fort overlooking the town with stunning architectural heritage.', image_url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=600&auto=format&fit=crop' },
  { id: 'h2', name: 'Chidi Kho', description: 'A beautiful wildlife sanctuary and lake perfect for nature lovers.', image_url: 'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?q=80&w=600&auto=format&fit=crop' },
  { id: 'h3', name: 'Solah Khamb', description: 'A historical monument featuring intricate 16 stone pillars and ancient carvings.', image_url: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=600&auto=format&fit=crop' }
];

export interface FrontpageImage {
  id: string;
  url: string;
  caption: string;
}

const DEFAULT_FRONTPAGE: FrontpageImage[] = [
  { id: 'f1', url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop', caption: 'Lawn Area' },
  { id: 'f2', url: 'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?q=80&w=1200&auto=format&fit=crop', caption: 'Luxury Room' },
  { id: 'f3', url: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1200&auto=format&fit=crop', caption: 'Restaurant' }
];

export interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  caption?: string;
}

const DEFAULT_GALLERY: GalleryItem[] = [
  { id: 'g1', type: 'image', url: 'https://images.unsplash.com/photo-1542314831-c6a4d14cdce8?q=80&w=600&auto=format&fit=crop', caption: 'Elegant Lobby' },
  { id: 'g2', type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-luxury-resort-with-swimming-pool-and-palm-trees-40292-large.mp4', caption: 'Resort Walkthrough' },
  { id: 'g3', type: 'image', url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600&auto=format&fit=crop', caption: 'Suites Living' },
  { id: 'g4', type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-beautiful-landscape-of-green-mountains-under-white-clouds-40131-large.mp4', caption: 'Scenic Mountains' },
  { id: 'g5', type: 'image', url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=600&auto=format&fit=crop', caption: 'Lawn Area' },
  { id: 'g6', type: 'image', url: 'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?q=80&w=600&auto=format&fit=crop', caption: 'Cozy Bedrooms' },
  { id: 'g7', type: 'image', url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=600&auto=format&fit=crop', caption: 'Bathroom Luxury' },
  { id: 'g8', type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-pouring-hot-tea-into-a-cup-43187-large.mp4', caption: 'Sattva Tea' }
];

export interface HotelSettings {
  hotel_name: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  bhopal_airport: string;
  bhopal_railway: string;
  biaora_railway: string;
  logo_url: string;
}

const DEFAULT_SETTINGS: HotelSettings = {
  hotel_name: 'The Sonakunj',
  email: 'reservations@thesonakunj.com',
  phone: '+91 8989010919',
  address: 'Sonakunj Estate NH-46 Narsinghgarh, Dist. Rajgarh, M.P.- 465669',
  description: 'Nestled in a charming town embraced by majestic mountains, our hotel is a haven for those seeking luxury, comfort, and unforgettable experiences.',
  bhopal_airport: 'Bhopal International Airport – 75 Kms',
  bhopal_railway: 'Bhopal Railway Station – 84 Kms',
  biaora_railway: 'Biaora Railway Station – 34 kms',
  logo_url: ''
};

// Local storage Helper functions
function getLocal<T>(key: string, defaults: T): T {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaults));
    return defaults;
  }
  try {
    return JSON.parse(data) as T;
  } catch {
    return defaults;
  }
}

function setLocal<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export const api = {
  // 1. Rooms
  getRooms: async (): Promise<Room[]> => {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('room_categories').select('*');
        if (!error && data && data.length > 0) {
          return data.map(r => ({
            id: r.id,
            name: r.name,
            type: r.name.toLowerCase().includes('suite') ? 'Suite' : 'Standard',
            price: Number(r.base_price),
            description: r.description || '',
            capacity: r.capacity || 2,
            amenities: Array.isArray(r.amenities) ? r.amenities : ['Free WiFi', 'AC', 'TV'],
            image_url: r.image_url || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800',
            size: r.size || '320 sq. ft.',
            bed_type: r.bed_type || 'Double Bed',
            images: Array.isArray(r.images) ? r.images : (r.images ? String(r.images).split(',') : [])
          }));
        }
      } catch (e) {
        console.warn('Supabase rooms fetch failed, falling back to local storage', e);
      }
    }
    return getLocal<Room[]>('rooms', DEFAULT_ROOMS);
  },

  getRoomById: async (id: string): Promise<Room | undefined> => {
    const rooms = await api.getRooms();
    return rooms.find(r => r.id === id);
  },

  createRoom: async (roomData: Omit<Room, 'id'>): Promise<Room> => {
    const tempId = 'temp-' + Math.random().toString(36).substring(7);
    const newRoom: Room = { ...roomData, id: tempId };
    
    // Always update local storage first
    const list = getLocal<Room[]>('rooms', DEFAULT_ROOMS);
    list.push(newRoom);
    setLocal('rooms', list);

    if (supabase) {
      try {
        const { data, error } = await supabase.from('room_categories').insert({
          name: roomData.name,
          description: roomData.description,
          base_price: roomData.price,
          capacity: roomData.capacity,
          amenities: roomData.amenities,
          image_url: roomData.image_url,
          size: roomData.size || '320 sq. ft.',
          bed_type: roomData.bed_type || 'Double Bed',
          images: roomData.images || [roomData.image_url]
        }).select().single();
        if (!error && data) {
          const createdRoom = {
            id: data.id,
            name: data.name,
            type: data.name.toLowerCase().includes('suite') ? 'Suite' : 'Standard',
            price: Number(data.base_price),
            description: data.description || '',
            capacity: data.capacity,
            amenities: Array.isArray(data.amenities) ? data.amenities : [],
            image_url: data.image_url,
            size: data.size,
            bed_type: data.bed_type,
            images: Array.isArray(data.images) ? data.images : (data.images ? String(data.images).split(',') : [])
          };
          // Synchronize local id with generated id
          const updatedList = getLocal<Room[]>('rooms', DEFAULT_ROOMS);
          const idx = updatedList.findIndex(r => r.id === tempId);
          if (idx > -1) {
            updatedList[idx] = createdRoom;
            setLocal('rooms', updatedList);
          }
          return createdRoom;
        } else if (error) {
          console.error('Supabase room insert error:', error);
        }
      } catch (e) {
        console.warn('Supabase room create failed, stored locally', e);
      }
    }
    return newRoom;
  },

  updateRoom: async (id: string, updates: Partial<Room>): Promise<Room> => {
    // Always update local storage first
    const list = getLocal<Room[]>('rooms', DEFAULT_ROOMS);
    const index = list.findIndex(r => r.id === id);
    let updatedLocalRoom = {} as Room;
    if (index > -1) {
      list[index] = { ...list[index], ...updates };
      updatedLocalRoom = list[index];
      setLocal('rooms', list);
    } else {
      throw new Error('Room not found');
    }

    if (supabase) {
      try {
        const payload: any = {};
        if (updates.name !== undefined) payload.name = updates.name;
        if (updates.description !== undefined) payload.description = updates.description;
        if (updates.price !== undefined) payload.base_price = updates.price;
        if (updates.capacity !== undefined) payload.capacity = updates.capacity;
        if (updates.amenities !== undefined) payload.amenities = updates.amenities;
        if (updates.image_url !== undefined) payload.image_url = updates.image_url;
        if (updates.size !== undefined) payload.size = updates.size;
        if (updates.bed_type !== undefined) payload.bed_type = updates.bed_type;
        if (updates.images !== undefined) payload.images = updates.images;

        const { data, error } = await supabase.from('room_categories').update(payload).eq('id', id).select().single();
        if (!error && data) {
          return {
            id: data.id,
            name: data.name,
            type: data.name.toLowerCase().includes('suite') ? 'Suite' : 'Standard',
            price: Number(data.base_price),
            description: data.description || '',
            capacity: data.capacity,
            amenities: Array.isArray(data.amenities) ? data.amenities : [],
            image_url: data.image_url,
            size: data.size,
            bed_type: data.bed_type,
            images: Array.isArray(data.images) ? data.images : (data.images ? String(data.images).split(',') : [])
          };
        }
      } catch (e) {
        console.warn('Supabase room update failed, falling back to local storage', e);
      }
    }
    return updatedLocalRoom;
  },

  deleteRoom: async (id: string): Promise<void> => {
    if (supabase) {
      try {
        await supabase.from('room_categories').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase room delete failed', e);
      }
    }
    const list = getLocal<Room[]>('rooms', DEFAULT_ROOMS);
    const updated = list.filter(r => r.id !== id);
    setLocal('rooms', updated);
  },

  // 2. Menu Items
  getMenu: async (): Promise<MenuItem[]> => {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('menu_items').select('*');
        if (!error && data && data.length > 0) {
          return data.map(m => ({
            id: m.id,
            name: m.name,
            category: m.category_name || 'Main Course',
            price: Number(m.price),
            is_veg: m.is_veg ?? true,
            description: m.description,
            image_url: m.image_url
          }));
        }
      } catch (e) {
        console.warn('Supabase menu fetch failed, falling back to local storage', e);
      }
    }
    return getLocal<MenuItem[]>('menu', DEFAULT_MENU);
  },

  createMenuItem: async (itemData: Omit<MenuItem, 'id'>): Promise<MenuItem> => {
    const tempId = 'temp-' + Math.random().toString(36).substring(7);
    const newItem: MenuItem = { ...itemData, id: tempId };
    
    // Always write to local storage first
    const list = getLocal<MenuItem[]>('menu', DEFAULT_MENU);
    list.push(newItem);
    setLocal('menu', list);

    if (supabase) {
      try {
        const { data, error } = await supabase.from('menu_items').insert({
          name: itemData.name,
          category: itemData.category,
          price: itemData.price,
          is_veg: itemData.is_veg,
          description: itemData.description,
          image_url: itemData.image_url
        }).select().single();
        if (!error && data) {
          const createdItem: MenuItem = {
            id: data.id,
            name: data.name,
            category: data.category || itemData.category || 'Main Course',
            price: Number(data.price),
            is_veg: data.is_veg ?? true,
            description: data.description || '',
            image_url: data.image_url || ''
          };
          // Sync local ID
          const updatedList = getLocal<MenuItem[]>('menu', DEFAULT_MENU);
          const index = updatedList.findIndex(m => m.id === tempId);
          if (index > -1) {
            updatedList[index] = createdItem;
            setLocal('menu', updatedList);
          }
          return createdItem;
        } else if (error) {
          console.error('Supabase menu item insert error:', error);
        }
      } catch (e) {
        console.warn('Supabase menu item create failed, falling back to local storage', e);
      }
    }
    return newItem;
  },

  updateMenuItem: async (id: string, updates: Partial<MenuItem>): Promise<MenuItem> => {
    if (supabase) {
      try {
        const payload: any = {};
        if (updates.name !== undefined) payload.name = updates.name;
        if (updates.price !== undefined) payload.price = updates.price;
        if (updates.is_veg !== undefined) payload.is_veg = updates.is_veg;
        if (updates.description !== undefined) payload.description = updates.description;
        if (updates.image_url !== undefined) payload.image_url = updates.image_url;

        const { data, error } = await supabase.from('menu_items').update(payload).eq('id', id).select().single();
        if (!error && data) {
          return {
            id: data.id,
            name: data.name,
            category: data.category_name || updates.category || 'Main Course',
            price: Number(data.price),
            is_veg: data.is_veg,
            description: data.description,
            image_url: data.image_url
          };
        }
      } catch (e) {
        console.warn('Supabase menu item update failed, falling back to local storage', e);
      }
    }
    const list = getLocal<MenuItem[]>('menu', DEFAULT_MENU);
    const index = list.findIndex(m => m.id === id);
    if (index > -1) {
      list[index] = { ...list[index], ...updates };
      setLocal('menu', list);
      return list[index];
    }
    throw new Error('Menu item not found');
  },

  deleteMenuItem: async (id: string): Promise<void> => {
    if (supabase) {
      try {
        await supabase.from('menu_items').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase menu item delete failed', e);
      }
    }
    const list = getLocal<MenuItem[]>('menu', DEFAULT_MENU);
    const updated = list.filter(m => m.id !== id);
    setLocal('menu', updated);
  },

  // 3. Bookings
  getBookings: async (): Promise<Booking[]> => {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('bookings').select('*');
        if (!error && data && data.length > 0) {
          return data.map(b => ({
            id: b.id,
            room_id: b.category_id || b.room_id || '',
            guest_name: b.guest_name,
            guest_email: b.guest_email,
            guest_phone: b.guest_phone,
            check_in: b.check_in,
            check_out: b.check_out,
            adults: b.adults,
            kids: b.kids || 0,
            total_price: Number(b.total_amount),
            status: b.status as any,
            created_at: b.created_at
          }));
        }
      } catch (e) {
        console.warn('Supabase bookings fetch failed, falling back to local storage', e);
      }
    }
    return getLocal<Booking[]>('bookings', []);
  },

  createBooking: async (bookingData: Omit<Booking, 'id' | 'status' | 'created_at'>): Promise<Booking> => {
    const id = Math.random().toString(36).substring(7);
    const newBooking: Booking = {
      ...bookingData,
      id,
      status: 'Confirmed',
      created_at: new Date().toISOString()
    };
    
    // Always write to local storage first
    const list = getLocal<Booking[]>('bookings', []);
    list.push(newBooking);
    setLocal('bookings', list);

    if (supabase) {
      try {
        const { data, error } = await supabase.from('bookings').insert({
          guest_name: bookingData.guest_name,
          guest_email: bookingData.guest_email,
          guest_phone: bookingData.guest_phone,
          category_id: bookingData.room_id || null,
          check_in: bookingData.check_in,
          check_out: bookingData.check_out,
          adults: bookingData.adults,
          kids: bookingData.kids,
          total_amount: bookingData.total_price,
          tax_amount: 0,
          status: 'Confirmed',
          payment_status: 'Pending'
        }).select().single();
        if (!error && data) {
          // Synchronize local list with Supabase generated ID
          const updatedList = getLocal<Booking[]>('bookings', []);
          const index = updatedList.findIndex(b => b.id === id);
          if (index > -1) {
            updatedList[index].id = data.id;
            setLocal('bookings', updatedList);
          }
          newBooking.id = data.id;
        }
      } catch (e) {
        console.warn('Supabase booking create failed, stored locally', e);
      }
    }
    return newBooking;
  },

  updateBookingStatus: async (id: string, status: Booking['status']): Promise<void> => {
    // Always update locally first
    const list = getLocal<Booking[]>('bookings', []);
    const index = list.findIndex(b => b.id === id);
    if (index > -1) {
      list[index].status = status;
      setLocal('bookings', list);
    }

    if (supabase) {
      try {
        await supabase.from('bookings').update({ status }).eq('id', id);
      } catch (e) {
        console.warn('Supabase booking update failed', e);
      }
    }
  },

  deleteBooking: async (id: string): Promise<void> => {
    // Always delete locally first
    const list = getLocal<Booking[]>('bookings', []);
    const updated = list.filter(b => b.id !== id);
    setLocal('bookings', updated);

    if (supabase) {
      try {
        await supabase.from('bookings').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase booking delete failed', e);
      }
    }
  },

  deleteOlderBookings: async (): Promise<void> => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Delete past bookings locally first
    const list = getLocal<Booking[]>('bookings', []);
    const updated = list.filter(b => b.check_out >= todayStr);
    setLocal('bookings', updated);

    if (supabase) {
      try {
        await supabase.from('bookings').delete().lt('check_out', todayStr);
      } catch (e) {
        console.warn('Supabase delete older bookings failed', e);
      }
    }
  },

  // Contact Inquiries API
  getContactInquiries: async (): Promise<ContactInquiry[]> => {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('contact_inquiries').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map(i => ({
            id: i.id,
            name: i.name,
            email: i.email,
            phone: i.phone || '',
            message: i.message,
            status: i.status as any,
            created_at: i.created_at
          }));
        }
      } catch (e) {
        console.warn('Supabase fetch inquiries failed, falling back to local storage', e);
      }
    }
    return getLocal<ContactInquiry[]>('contact_inquiries', []);
  },

  createContactInquiry: async (inquiryData: Omit<ContactInquiry, 'id' | 'status' | 'created_at'>): Promise<ContactInquiry> => {
    const tempId = 'temp-' + Math.random().toString(36).substring(7);
    const newInquiry: ContactInquiry = {
      ...inquiryData,
      id: tempId,
      status: 'New',
      created_at: new Date().toISOString()
    };

    // Always save locally first
    const list = getLocal<ContactInquiry[]>('contact_inquiries', []);
    list.unshift(newInquiry);
    setLocal('contact_inquiries', list);

    if (supabase) {
      try {
        const { data, error } = await supabase.from('contact_inquiries').insert({
          name: inquiryData.name,
          email: inquiryData.email,
          phone: inquiryData.phone || '',
          message: inquiryData.message,
          status: 'New'
        }).select().single();
        if (!error && data) {
          const createdInquiry: ContactInquiry = {
            id: data.id,
            name: data.name,
            email: data.email,
            phone: data.phone || '',
            message: data.message,
            status: data.status as any || 'New',
            created_at: data.created_at
          };
          const updatedList = getLocal<ContactInquiry[]>('contact_inquiries', []);
          const index = updatedList.findIndex(i => i.id === tempId);
          if (index > -1) {
            updatedList[index] = createdInquiry;
            setLocal('contact_inquiries', updatedList);
          }
          newInquiry.id = data.id;
        } else if (error) {
          console.error('Supabase contact inquiry insert error:', error);
        }
      } catch (e) {
        console.warn('Supabase inquiry insert failed, stored locally', e);
      }
    }
    return newInquiry;
  },

  updateInquiryStatus: async (id: string, status: ContactInquiry['status']): Promise<void> => {
    const list = getLocal<ContactInquiry[]>('contact_inquiries', []);
    const index = list.findIndex(i => i.id === id);
    if (index > -1) {
      list[index].status = status;
      setLocal('contact_inquiries', list);
    }

    if (supabase) {
      try {
        await supabase.from('contact_inquiries').update({ status }).eq('id', id);
      } catch (e) {
        console.warn('Supabase inquiry status update failed', e);
      }
    }
  },

  deleteInquiry: async (id: string): Promise<void> => {
    const list = getLocal<ContactInquiry[]>('contact_inquiries', []);
    const updated = list.filter(i => i.id !== id);
    setLocal('contact_inquiries', updated);

    if (supabase) {
      try {
        await supabase.from('contact_inquiries').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase inquiry delete failed', e);
      }
    }
  },

  // 4. Heritage Places
  getHeritagePlaces: async (): Promise<HeritagePlace[]> => {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('heritage_places').select('*');
        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (e) {
        console.warn('Supabase heritage fetch failed, falling back to local storage', e);
      }
    }
    return getLocal<HeritagePlace[]>('heritage', DEFAULT_HERITAGE);
  },

  createHeritagePlace: async (place: Omit<HeritagePlace, 'id'>): Promise<HeritagePlace> => {
    const tempId = 'temp-' + Math.random().toString(36).substring(7);
    const newPlace = { ...place, id: tempId };
    
    // Always write locally first
    const list = getLocal<HeritagePlace[]>('heritage', DEFAULT_HERITAGE);
    list.push(newPlace);
    setLocal('heritage', list);

    if (supabase) {
      try {
        const { data, error } = await supabase.from('heritage_places').insert({
          name: place.name,
          description: place.description,
          image_url: place.image_url
        }).select().single();
        if (!error && data) {
          const createdPlace = {
            id: data.id,
            name: data.name,
            description: data.description || '',
            image_url: data.image_url || ''
          };
          const updatedList = getLocal<HeritagePlace[]>('heritage', DEFAULT_HERITAGE);
          const index = updatedList.findIndex(h => h.id === tempId);
          if (index > -1) {
            updatedList[index] = createdPlace;
            setLocal('heritage', updatedList);
          }
          return createdPlace;
        } else if (error) {
          console.error('Supabase heritage insert error:', error);
        }
      } catch (e) {
        console.warn('Supabase heritage create failed', e);
      }
    }
    return newPlace;
  },

  updateHeritagePlace: async (id: string, updates: Partial<HeritagePlace>): Promise<HeritagePlace> => {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('heritage_places').update(updates).eq('id', id).select().single();
        if (!error && data) return data;
      } catch (e) {
        console.warn('Supabase heritage update failed', e);
      }
    }
    const list = getLocal<HeritagePlace[]>('heritage', DEFAULT_HERITAGE);
    const index = list.findIndex(h => h.id === id);
    if (index > -1) {
      list[index] = { ...list[index], ...updates };
      setLocal('heritage', list);
      return list[index];
    }
    throw new Error('Heritage place not found');
  },

  deleteHeritagePlace: async (id: string): Promise<void> => {
    if (supabase) {
      try {
        await supabase.from('heritage_places').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase heritage delete failed', e);
      }
    }
    const list = getLocal<HeritagePlace[]>('heritage', DEFAULT_HERITAGE);
    const updated = list.filter(h => h.id !== id);
    setLocal('heritage', updated);
  },

  // 5. Frontpage Dynamic Content / Scroller Images
  getFrontpageImages: async (): Promise<FrontpageImage[]> => {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('frontpage_images').select('*');
        if (!error && data && data.length > 0) {
          return data.map(d => ({
            id: d.id,
            url: d.image_url,
            caption: d.section || 'Gallery'
          }));
        }
      } catch (e) {
        console.warn('Supabase frontpage fetch failed, falling back to local storage', e);
      }
    }
    return getLocal<FrontpageImage[]>('frontpage', DEFAULT_FRONTPAGE);
  },

  createFrontpageImage: async (image: Omit<FrontpageImage, 'id'>): Promise<FrontpageImage> => {
    const tempId = 'temp-' + Math.random().toString(36).substring(7);
    const newImage = { ...image, id: tempId };
    
    // Always write locally first
    const list = getLocal<FrontpageImage[]>('frontpage', DEFAULT_FRONTPAGE);
    list.push(newImage);
    setLocal('frontpage', list);

    if (supabase) {
      try {
        const { data, error } = await supabase.from('frontpage_images').insert({
          image_url: image.url,
          section: image.caption
        }).select().single();
        if (!error && data) {
          const createdImage = { id: data.id, url: data.image_url, caption: data.section };
          const updatedList = getLocal<FrontpageImage[]>('frontpage', DEFAULT_FRONTPAGE);
          const index = updatedList.findIndex(f => f.id === tempId);
          if (index > -1) {
            updatedList[index] = createdImage;
            setLocal('frontpage', updatedList);
          }
          return createdImage;
        } else if (error) {
          console.error('Supabase frontpage insert error:', error);
        }
      } catch (e) {
        console.warn('Supabase frontpage create failed', e);
      }
    }
    return newImage;
  },

  updateFrontpageImage: async (id: string, updates: Partial<FrontpageImage>): Promise<FrontpageImage> => {
    if (supabase) {
      try {
        const payload: any = {};
        if (updates.url !== undefined) payload.image_url = updates.url;
        if (updates.caption !== undefined) payload.section = updates.caption;
        const { data, error } = await supabase.from('frontpage_images').update(payload).eq('id', id).select().single();
        if (!error && data) {
          return { id: data.id, url: data.image_url, caption: data.section };
        }
      } catch (e) {
        console.warn('Supabase frontpage update failed', e);
      }
    }
    const list = getLocal<FrontpageImage[]>('frontpage', DEFAULT_FRONTPAGE);
    const index = list.findIndex(f => f.id === id);
    if (index > -1) {
      list[index] = { ...list[index], ...updates };
      setLocal('frontpage', list);
      return list[index];
    }
    throw new Error('Frontpage image not found');
  },

  deleteFrontpageImage: async (id: string): Promise<void> => {
    if (supabase) {
      try {
        await supabase.from('frontpage_images').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase frontpage delete failed', e);
      }
    }
    const list = getLocal<FrontpageImage[]>('frontpage', DEFAULT_FRONTPAGE);
    const updated = list.filter(f => f.id !== id);
    setLocal('frontpage', updated);
  },

  // 6. Settings
  getSettings: async (): Promise<HotelSettings> => {
    return getLocal<HotelSettings>('settings', DEFAULT_SETTINGS);
  },

  updateSettings: async (updates: Partial<HotelSettings>): Promise<HotelSettings> => {
    const current = getLocal<HotelSettings>('settings', DEFAULT_SETTINGS);
    const updated = { ...current, ...updates };
    setLocal('settings', updated);
    return updated;
  },

  // 7. Gallery Images & Videos
  getGalleryItems: async (): Promise<GalleryItem[]> => {
    return getLocal<GalleryItem[]>('gallery', DEFAULT_GALLERY);
  },

  createGalleryItem: async (item: Omit<GalleryItem, 'id'>): Promise<GalleryItem> => {
    const id = Math.random().toString(36).substring(7);
    const newItem = { ...item, id };
    const list = getLocal<GalleryItem[]>('gallery', DEFAULT_GALLERY);
    list.push(newItem);
    setLocal('gallery', list);
    return newItem;
  },

  updateGalleryItem: async (id: string, updates: Partial<GalleryItem>): Promise<GalleryItem> => {
    const list = getLocal<GalleryItem[]>('gallery', DEFAULT_GALLERY);
    const index = list.findIndex(g => g.id === id);
    if (index > -1) {
      list[index] = { ...list[index], ...updates };
      setLocal('gallery', list);
      return list[index];
    }
    throw new Error('Gallery item not found');
  },

  deleteGalleryItem: async (id: string): Promise<void> => {
    const list = getLocal<GalleryItem[]>('gallery', DEFAULT_GALLERY);
    const updated = list.filter(g => g.id !== id);
    setLocal('gallery', updated);
  }
};
