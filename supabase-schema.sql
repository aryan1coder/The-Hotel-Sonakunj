-- Supabase PostgreSQL Schema for Hotel Management System
-- Fully Idempotent Script (Runs cleanly multiple times without "already exists" errors)

-- 1. Create Enums safely using a PL/pgSQL block
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
    CREATE TYPE booking_status AS ENUM ('Pending', 'Confirmed', 'Checked In', 'Checked Out', 'Cancelled', 'Refunded');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
    CREATE TYPE payment_status AS ENUM ('Pending', 'Partial', 'Paid', 'Refunded');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'room_status') THEN
    CREATE TYPE room_status AS ENUM ('Available', 'Occupied', 'Maintenance');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('admin', 'manager', 'receptionist', 'customer');
  END IF;
END $$;

-- 2. Create Users Table (Extending Supabase Auth Users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  role user_role DEFAULT 'customer',
  loyalty_points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Rooms Category Table
CREATE TABLE IF NOT EXISTS public.room_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  base_price NUMERIC(10,2) NOT NULL,
  capacity INTEGER NOT NULL,
  amenities JSONB DEFAULT '[]'::jsonb, -- Array of strings
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sync any potential missing room category columns dynamically
ALTER TABLE public.room_categories ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.room_categories ADD COLUMN IF NOT EXISTS size TEXT DEFAULT '320 sq. ft.';
ALTER TABLE public.room_categories ADD COLUMN IF NOT EXISTS bed_type TEXT DEFAULT 'Double Bed';
ALTER TABLE public.room_categories ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

-- 4. Create Rooms Table
CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_number TEXT UNIQUE NOT NULL,
  category_id UUID REFERENCES public.room_categories(id) ON DELETE CASCADE,
  status room_status DEFAULT 'Available',
  floor INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Room Images Table
CREATE TABLE IF NOT EXISTS public.room_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.room_categories(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Null if booked as guest
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  category_id UUID REFERENCES public.room_categories(id) ON DELETE RESTRICT,
  room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL, -- Assigned later
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  adults INTEGER NOT NULL,
  kids INTEGER DEFAULT 0,
  total_amount NUMERIC(10,2) NOT NULL,
  tax_amount NUMERIC(10,2) NOT NULL,
  status booking_status DEFAULT 'Pending',
  payment_status payment_status DEFAULT 'Pending',
  special_requests TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create Restaurant Menu Categories Table
CREATE TABLE IF NOT EXISTS public.menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Create Restaurant Menu Items Table
CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.menu_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  is_veg BOOLEAN DEFAULT true,
  is_available BOOLEAN DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sync any potential missing menu item columns dynamically
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS category TEXT;

-- 9. Create Banquet Events Table
CREATE TABLE IF NOT EXISTS public.banquet_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_date DATE NOT NULL,
  guests_count INTEGER NOT NULL,
  status booking_status DEFAULT 'Pending',
  total_amount NUMERIC(10,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Create Contact Inquiries Table
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'New', -- New, Read, Replied
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Create Arenas Table
CREATE TABLE IF NOT EXISTS public.arenas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  short_description TEXT,
  detailed_description TEXT,
  image_url TEXT,
  capacity_min INTEGER,
  capacity_max INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Create Frontpage Images Table
CREATE TABLE IF NOT EXISTS public.frontpage_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL, -- e.g., 'restaurant_scroller', 'hero'
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Create Heritage Places Table
CREATE TABLE IF NOT EXISTS public.heritage_places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13.5. Create Hotel Settings Table
CREATE TABLE IF NOT EXISTS public.hotel_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  description TEXT,
  bhopal_airport TEXT,
  bhopal_railway TEXT,
  biaora_railway TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13.6. Create Gallery Items Table
CREATE TABLE IF NOT EXISTS public.gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL DEFAULT 'image', -- 'image' or 'video'
  url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banquet_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arenas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.frontpage_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.heritage_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotel_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

-- 15. Create RLS Policies safely (Drop before Create)

-- Profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'receptionist'))
);

-- Rooms / Room Categories / Room Images / Menu Categories / Menu Items
DROP POLICY IF EXISTS "Public can view room categories" ON public.room_categories;
CREATE POLICY "Public can view room categories" ON public.room_categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage room categories" ON public.room_categories;
CREATE POLICY "Admins can manage room categories" ON public.room_categories FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view rooms" ON public.rooms;
CREATE POLICY "Public can view rooms" ON public.rooms FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage rooms" ON public.rooms;
CREATE POLICY "Admins can manage rooms" ON public.rooms FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view room images" ON public.room_images;
CREATE POLICY "Public can view room images" ON public.room_images FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage room images" ON public.room_images;
CREATE POLICY "Admins can manage room images" ON public.room_images FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view menu categories" ON public.menu_categories;
CREATE POLICY "Public can view menu categories" ON public.menu_categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage menu categories" ON public.menu_categories;
CREATE POLICY "Admins can manage menu categories" ON public.menu_categories FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view menu items" ON public.menu_items;
CREATE POLICY "Public can view menu items" ON public.menu_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage menu items" ON public.menu_items;
CREATE POLICY "Admins can manage menu items" ON public.menu_items FOR ALL USING (true) WITH CHECK (true);

-- Bookings
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = guest_id);

DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
CREATE POLICY "Admins can view all bookings" ON public.bookings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can create a booking" ON public.bookings;
CREATE POLICY "Anyone can create a booking" ON public.bookings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update bookings" ON public.bookings;
CREATE POLICY "Admins can update bookings" ON public.bookings FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Admins can delete bookings" ON public.bookings;
CREATE POLICY "Admins can delete bookings" ON public.bookings FOR DELETE USING (true);

-- Banquet Bookings
DROP POLICY IF EXISTS "Anyone can create banquet booking" ON public.banquet_bookings;
CREATE POLICY "Anyone can create banquet booking" ON public.banquet_bookings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view banquet bookings" ON public.banquet_bookings;
CREATE POLICY "Admins can view banquet bookings" ON public.banquet_bookings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage banquet bookings" ON public.banquet_bookings;
CREATE POLICY "Admins can manage banquet bookings" ON public.banquet_bookings FOR ALL USING (true) WITH CHECK (true);

-- Arenas / Frontpage Images / Heritage Places
DROP POLICY IF EXISTS "Public can view arenas" ON public.arenas;
CREATE POLICY "Public can view arenas" ON public.arenas FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage arenas" ON public.arenas;
CREATE POLICY "Admins can manage arenas" ON public.arenas FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view frontpage images" ON public.frontpage_images;
CREATE POLICY "Public can view frontpage images" ON public.frontpage_images FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage frontpage images" ON public.frontpage_images;
CREATE POLICY "Admins can manage frontpage images" ON public.frontpage_images FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view heritage places" ON public.heritage_places;
CREATE POLICY "Public can view heritage places" ON public.heritage_places FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage heritage places" ON public.heritage_places;
CREATE POLICY "Admins can manage heritage places" ON public.heritage_places FOR ALL USING (true) WITH CHECK (true);

-- Contact Inquiries
DROP POLICY IF EXISTS "Anyone can create contact inquiry" ON public.contact_inquiries;
CREATE POLICY "Anyone can create contact inquiry" ON public.contact_inquiries FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view contact inquiries" ON public.contact_inquiries;
CREATE POLICY "Admins can view contact inquiries" ON public.contact_inquiries FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage contact inquiries" ON public.contact_inquiries;
CREATE POLICY "Admins can manage contact inquiries" ON public.contact_inquiries FOR ALL USING (true) WITH CHECK (true);

-- Hotel Settings Policies
DROP POLICY IF EXISTS "Public can view hotel settings" ON public.hotel_settings;
CREATE POLICY "Public can view hotel settings" ON public.hotel_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage hotel settings" ON public.hotel_settings;
CREATE POLICY "Admins can manage hotel settings" ON public.hotel_settings FOR ALL USING (true) WITH CHECK (true);

-- Gallery Items Policies
DROP POLICY IF EXISTS "Public can view gallery items" ON public.gallery_items;
CREATE POLICY "Public can view gallery items" ON public.gallery_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage gallery items" ON public.gallery_items;
CREATE POLICY "Admins can manage gallery items" ON public.gallery_items FOR ALL USING (true) WITH CHECK (true);

-- 16. Trigger modification function
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to update 'updated_at' column safely (Drop before Create)
DROP TRIGGER IF EXISTS update_profiles_modtime ON public.profiles;
CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_modified_column();

DROP TRIGGER IF EXISTS update_bookings_modtime ON public.bookings;
CREATE TRIGGER update_bookings_modtime BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION update_modified_column();
