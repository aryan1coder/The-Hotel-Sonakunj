import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { formatCurrency } from '../lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import SafeImage from '../components/SafeImage';
import { ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight, Info, Coffee, ShieldCheck, HelpCircle, Sparkles, Compass, Bed, Users } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const bookingSchema = z.object({
  guest_name: z.string().min(2, "Name is required"),
  guest_email: z.string().email("Valid email is required"),
  guest_phone: z.string().min(10, "Valid phone number is required"),
  check_in: z.string(),
  check_out: z.string(),
  rooms_count: z.string(),
  adults: z.string(),
  kids: z.string(),
  breakfast: z.boolean(),
});

type BookingForm = z.infer<typeof bookingSchema>;

export default function RoomDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [bookingComplete, setBookingComplete] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(true);

  const { data: room, isLoading } = useQuery({
    queryKey: ['room', id],
    queryFn: () => api.getRoomById(id!),
    enabled: !!id
  });

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      check_in: '2026-07-06',
      check_out: '2026-07-07',
      rooms_count: '1',
      adults: '1',
      kids: '0',
      breakfast: true,
    }
  });

  const checkIn = watch('check_in');
  const checkOut = watch('check_out');
  const roomsCount = parseInt(watch('rooms_count') || '1');
  const adultsCount = parseInt(watch('adults') || '1');
  const hasBreakfast = watch('breakfast');

  // Multi-image list setup
  const getRoomImages = () => {
    if (!room) return [];
    const imgs = [];
    if (room.image_url) imgs.push(room.image_url);
    if (room.images && room.images.length > 0) {
      room.images.forEach(img => {
        if (img !== room.image_url) imgs.push(img);
      });
    }
    // Fallback if no images
    if (imgs.length === 0) {
      imgs.push('https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1000&auto=format&fit=crop');
    }
    return imgs;
  };

  const images = getRoomImages();

  const getDays = () => {
    if (!checkIn || !checkOut) return 1;
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return days > 0 ? days : 1;
  };

  const days = getDays();
  
  // Custom exact breakdown calculation requested:
  // Base Price: room.price per night (Default to 1999)
  const pricePerNight = room ? room.price : 1999;
  const basePriceForStay = pricePerNight * days * roomsCount;
  
  // Breakfast: charge 300 Rs per room per day of stay if selected
  const breakfastCharge = hasBreakfast ? (300 * days * roomsCount) : 0;
  
  // We'll calculate the subtotal.
  const subtotal = basePriceForStay + breakfastCharge;
  const taxAmount = parseFloat((subtotal * 0.05).toFixed(2));
  const totalCost = subtotal + taxAmount;

  const mutation = useMutation({
    mutationFn: api.createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      setBookingComplete(true);
    }
  });

  const onSubmit = (data: BookingForm) => {
    if (!room) return;
    mutation.mutate({
      guest_name: data.guest_name,
      guest_email: data.guest_email,
      guest_phone: data.guest_phone,
      check_in: data.check_in,
      check_out: data.check_out,
      adults: parseInt(data.adults),
      kids: parseInt(data.kids),
      room_id: room.id,
      total_price: totalCost,
    });
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bento-primary"></div>
    </div>
  );
  
  if (!room) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-center">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 font-serif mb-2">Room Not Found</h2>
        <button onClick={() => navigate('/')} className="text-bento-primary hover:underline">Return Home</button>
      </div>
    </div>
  );

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Sonakunj Premium Custom Amenities Requested
  const premiumAmenities = [
    "Luggage trolley with bell boy service",
    "Tea - Coffee Machine",
    "24x7 House Keeping",
    "24x7 Hot Water",
    "Iron – On Call",
    "Hair Dryer – On Call",
    "24x7 Generator Backup",
    "Premium Toiletries"
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-gray-50/50 pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-7xl w-full mx-auto">
        
        {/* Back Link */}
        <button onClick={() => navigate(-1)} className="flex items-center text-sm font-medium text-gray-500 hover:text-bento-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Rooms List
        </button>

        {bookingComplete ? (
          <div className="bg-white rounded-3xl border border-bento-border p-8 md:p-16 text-center max-w-2xl mx-auto shadow-lg animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-200">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">Reservation Confirmed!</h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Congratulations! Your stay at <strong className="text-bento-primary">{room.name}</strong> is successfully locked in.
              A booking confirmation has been registered. You only need to pay <strong>{formatCurrency(totalCost)}</strong> at checkout.
            </p>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 mb-8 text-left space-y-2">
              <p className="text-sm text-gray-500"><strong>Check-In Date:</strong> {checkIn}</p>
              <p className="text-sm text-gray-500"><strong>Check-Out Date:</strong> {checkOut}</p>
              <p className="text-sm text-gray-500"><strong>Rooms Reserved:</strong> {roomsCount} Room(s)</p>
              <p className="text-sm text-gray-500"><strong>Amount Payable:</strong> {formatCurrency(totalCost)}</p>
            </div>
            <button onClick={() => navigate('/')} className="bg-bento-primary text-white font-bold px-8 py-4 rounded-xl hover:bg-bento-primary-hover transition-colors w-full shadow-md">
              Return to Website
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Content Area (Columns 1-7) */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Image Gallery/Slider section */}
              <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm overflow-hidden">
                <div className="relative h-64 sm:h-[420px] w-full rounded-2xl overflow-hidden bg-gray-100 group shadow-inner">
                  <SafeImage 
                    src={images[activeImageIndex]} 
                    alt={`${room.name} view`} 
                    fallbackType="room" 
                    className="w-full h-full object-cover transition-all duration-500" 
                  />
                  
                  {images.length > 1 && (
                    <>
                      <button 
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 backdrop-blur-md border border-white/20 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 backdrop-blur-md border border-white/20 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  
                  <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-full text-xs font-mono backdrop-blur-md border border-white/10">
                    {activeImageIndex + 1} / {images.length}
                  </div>
                </div>

                {/* Thumbnails list */}
                {images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pt-4 pb-2 scrollbar-thin">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImageIndex(index)}
                        className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                          index === activeImageIndex 
                            ? 'border-bento-primary ring-2 ring-bento-primary/20 scale-95' 
                            : 'border-transparent hover:border-gray-300'
                        }`}
                      >
                        <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Room Description and Specifications */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm space-y-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-3">{room.name}</h1>
                  <p className="text-gray-600 text-lg leading-relaxed">{room.description}</p>
                </div>

                {/* Specifications Bar */}
                <div className="grid grid-cols-3 gap-4 py-6 border-t border-b border-gray-100 text-center md:text-left">
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-wider text-gray-400 font-bold flex items-center justify-center md:justify-start gap-1.5">
                      <Compass className="w-4 h-4 text-bento-primary" /> Room Size
                    </span>
                    <p className="text-base md:text-lg font-serif font-bold text-gray-900">{room.size || '320 sq. ft.'}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-wider text-gray-400 font-bold flex items-center justify-center md:justify-start gap-1.5">
                      <Bed className="w-4 h-4 text-bento-primary" /> Bed Configuration
                    </span>
                    <p className="text-base md:text-lg font-serif font-bold text-gray-900">{room.bed_type || 'Premium Double Bed'}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-wider text-gray-400 font-bold flex items-center justify-center md:justify-start gap-1.5">
                      <Users className="w-4 h-4 text-bento-primary" /> Capacity
                    </span>
                    <p className="text-base md:text-lg font-serif font-bold text-gray-900">{room.capacity ? `${room.capacity} Guests` : '2 Adults, 1 Child'}</p>
                  </div>
                </div>
              </div>

              {/* Amenities Section */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2.5 mb-6">
                  <Sparkles className="w-6 h-6 text-bento-primary" />
                  <h2 className="text-2xl font-serif font-bold text-gray-900">Amenities</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {premiumAmenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center text-gray-700 bg-amber-50/30 px-4 py-3 rounded-2xl border border-amber-100/50 hover:bg-amber-50/50 transition-colors">
                      <span className="w-2 h-2 bg-bento-primary rounded-full mr-3 shrink-0"></span>
                      <span className="text-sm font-medium">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Booking Policy Section */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm space-y-6">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-6 h-6 text-bento-primary" />
                  <h2 className="text-2xl font-serif font-bold text-gray-900">Booking & Stay Policy</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
                  <div className="space-y-3">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="font-bold text-gray-900 mb-1">Check-In Schedule</p>
                      <p>Check-in starts from 12:00 PM. Early check-in is subject to room availability.</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="font-bold text-gray-900 mb-1">Identification Requirement</p>
                      <p>All visiting guests must carry a valid Government-approved ID (Aadhar, Driving License, or Passport).</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="font-bold text-gray-900 mb-1">Check-Out Schedule</p>
                      <p>Check-out time is strictly before 11:00 AM. Late check-out may invite extra day tariff charges.</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="font-bold text-gray-900 mb-1">Cancellation Rule</p>
                      <p>Enjoy free reservation modification or cancellation up to 24 hours prior to check-in date.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Booking Sidebar Form (Columns 8-12) */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                
                {/* Visual Header matching exact user demand */}
                <div className="bg-bento-text text-white p-6 md:p-8 text-center border-b border-bento-dark-border">
                  <span className="text-xs uppercase tracking-[0.2em] text-bento-primary font-bold block mb-1">Reserve Room</span>
                  <p className="font-serif text-3xl font-bold">
                    From {formatCurrency(pricePerNight)}<span className="text-sm font-sans font-normal text-gray-400">/night</span>
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-4">
                  
                  {/* Guest details */}
                  <div className="space-y-3">
                    <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl">
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1">Your Full Name *</label>
                      <input 
                        required
                        {...register('guest_name')} 
                        className="font-medium bg-transparent outline-none w-full text-gray-900 placeholder-gray-400 text-sm focus:text-bento-primary" 
                        placeholder="e.g. Sonakunj Guest" 
                      />
                      {errors.guest_name && <span className="text-rose-500 text-xs mt-1 block">{errors.guest_name.message}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl">
                        <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1">Email *</label>
                        <input 
                          required
                          {...register('guest_email')} 
                          type="email" 
                          className="font-medium bg-transparent outline-none w-full text-gray-900 placeholder-gray-400 text-sm focus:text-bento-primary" 
                          placeholder="name@email.com" 
                        />
                      </div>
                      <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl">
                        <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1">Phone *</label>
                        <input 
                          required
                          {...register('guest_phone')} 
                          type="tel" 
                          className="font-medium bg-transparent outline-none w-full text-gray-900 placeholder-gray-400 text-sm focus:text-bento-primary" 
                          placeholder="Phone Number" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dates input matching checkin/checkout formatting */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl">
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1">Check In *</label>
                      <input 
                        required
                        {...register('check_in')} 
                        type="date" 
                        className="font-medium bg-transparent outline-none w-full text-gray-900 text-sm cursor-pointer" 
                      />
                    </div>
                    <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl">
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1">Check Out *</label>
                      <input 
                        required
                        {...register('check_out')} 
                        type="date" 
                        className="font-medium bg-transparent outline-none w-full text-gray-900 text-sm cursor-pointer" 
                      />
                    </div>
                  </div>

                  {/* Rooms selection dropdown */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl">
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1">Rooms</label>
                      <select 
                        {...register('rooms_count')}
                        className="font-medium bg-transparent outline-none w-full text-gray-900 text-sm cursor-pointer appearance-none"
                      >
                        <option value="1">1 Room</option>
                        <option value="2">2 Rooms</option>
                        <option value="3">3 Rooms</option>
                        <option value="4">4 Rooms</option>
                      </select>
                    </div>
                    
                    <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl">
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1">Adults</label>
                      <select 
                        {...register('adults')}
                        className="font-medium bg-transparent outline-none w-full text-gray-900 text-sm cursor-pointer appearance-none"
                      >
                        <option value="1">1 Adult</option>
                        <option value="2">2 Adults</option>
                        <option value="3">3 Adults</option>
                        <option value="4">4 Adults</option>
                      </select>
                    </div>

                    <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl">
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1">Children</label>
                      <select 
                        {...register('kids')}
                        className="font-medium bg-transparent outline-none w-full text-gray-900 text-sm cursor-pointer appearance-none"
                      >
                        <option value="0">0 Kids</option>
                        <option value="1">1 Kid</option>
                        <option value="2">2 Kids</option>
                      </select>
                    </div>
                  </div>

                  {/* Extra Services checkbox */}
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Coffee className="w-5 h-5 text-bento-primary" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Breakfast Included</p>
                        <p className="text-[11px] text-gray-500">Premium veg breakfast spread</p>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      {...register('breakfast')}
                      className="w-5 h-5 accent-bento-primary rounded border-gray-300 focus:ring-bento-primary cursor-pointer" 
                    />
                  </div>

                  {/* Cost breakdown widget matching exact user requirements */}
                  <div className="border-t border-gray-150 pt-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <button 
                        type="button" 
                        onClick={() => setShowDetails(!showDetails)}
                        className="text-xs font-bold tracking-wider uppercase text-bento-primary hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        Total Cost
                        <span className="text-[10px] lowercase text-gray-400">({showDetails ? 'hide details' : 'view details'})</span>
                      </button>
                      <span className="text-xl font-serif font-bold text-gray-900">{formatCurrency(totalCost)}</span>
                    </div>

                    {showDetails && (
                      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-xs text-gray-600 space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-1 font-medium">
                            Total Base Price 
                            <span className="text-[9px] w-3.5 h-3.5 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold font-mono" title="Base tariff of the room per night">i</span>
                          </span>
                          <span className="font-semibold text-gray-900">{formatCurrency(basePriceForStay)}</span>
                        </div>
                        
                        {hasBreakfast && (
                          <div className="flex justify-between items-center text-emerald-600 font-medium">
                            <span>Breakfast Service (₹300/day)</span>
                            <span className="font-semibold">{formatCurrency(breakfastCharge)}</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center">
                          <span>Tax (5%)</span>
                          <span className="font-semibold text-gray-900">{formatCurrency(taxAmount)}</span>
                        </div>
                        
                        <div className="border-t border-gray-200 pt-2 flex justify-between items-center font-bold text-gray-900">
                          <span>Total</span>
                          <span>{formatCurrency(totalCost)}</span>
                        </div>
                        
                        <div className="text-[10px] text-center text-gray-400 pt-1 border-t border-dashed border-gray-200">
                          (Total Before Tax {formatCurrency(subtotal)})
                        </div>
                      </div>
                    )}
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting || mutation.isPending}
                    className="w-full bg-bento-primary hover:bg-bento-primary-hover disabled:bg-bento-primary/50 text-white font-bold py-4.5 rounded-2xl transition-all shadow-md mt-4 flex items-center justify-center gap-2"
                  >
                    {isSubmitting || mutation.isPending ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Locking in Stay...</span>
                      </>
                    ) : (
                      <div className="flex flex-col items-center">
                        <span className="font-serif font-bold text-lg">Confirm Booking</span>
                        <span className="text-[10px] uppercase tracking-widest opacity-90 font-medium">No deposit - Pay at Check-in</span>
                      </div>
                    )}
                  </button>
                  
                </form>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
