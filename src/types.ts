export type Room = {
  id: string;
  name: string;
  type: string;
  price: number;
  description: string;
  amenities: string[];
  capacity: number;
  image_url: string;
  size?: string;
  bed_type?: string;
  images?: string[];
};

export type BookingStatus = 'Pending' | 'Confirmed' | 'Checked In' | 'Checked Out' | 'Cancelled';

export type Booking = {
  id: string;
  room_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in: string;
  check_out: string;
  adults: number;
  kids: number;
  total_price: number;
  status: BookingStatus;
  created_at: string;
};

export type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  is_veg: boolean;
  image_url?: string;
  description?: string;
};

export type ContactInquiry = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'New' | 'Read' | 'Replied';
  created_at?: string;
};

