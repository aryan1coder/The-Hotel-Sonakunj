import { Link } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { formatCurrency } from '../lib/utils';
import { addDays, format } from 'date-fns';
import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import SafeImage from '../components/SafeImage';

export default function Home() {
  const { data: menu } = useQuery({ queryKey: ['menu'], queryFn: api.getMenu });
  const { data: rooms } = useQuery({ queryKey: ['rooms'], queryFn: api.getRooms });
  const { data: heritageList } = useQuery({ queryKey: ['heritage'], queryFn: api.getHeritagePlaces });
  const { data: frontpageImages } = useQuery({ queryKey: ['frontpage'], queryFn: api.getFrontpageImages });
  const { data: settings } = useQuery({ queryKey: ['settings'], queryFn: api.getSettings });
  const { data: galleryItems } = useQuery({ queryKey: ['gallery'], queryFn: api.getGalleryItems });

  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const deluxeRoom = rooms?.find(r => r.type === 'Deluxe');
  
  const today = new Date();
  const checkOutDate = addDays(today, 3);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    event: 'Wedding',
    date: format(today, 'yyyy-MM-dd')
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [selectedArena, setSelectedArena] = useState<{name: string, desc: string, img: string} | null>(null);

  const arenasData = [
    { name: 'Nidhivan Lawn', img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=600&auto=format&fit=crop', desc: 'A beautiful lush green lawn for outdoor events, weddings, and large gatherings under the open sky.' },
    { name: 'Vrindavan Hall', img: 'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?q=80&w=600&auto=format&fit=crop', desc: 'An elegant banquet hall for grand celebrations, complete with luxury interiors and premium lighting.' },
    { name: 'Madhuban Hall', img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=600&auto=format&fit=crop', desc: 'A versatile hall perfect for corporate conferences, team-building activities, and intimate events.' },
    { name: 'Sattva Restaurant', img: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=600&auto=format&fit=crop', desc: 'Fine dining experience offering pure vegetarian delicacies with locally sourced ingredients.' }
  ];

  const scrollerImages = frontpageImages && frontpageImages.length > 0 
    ? frontpageImages.map(img => img.url)
    : [
        'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1200&auto=format&fit=crop'
      ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (scrollerImages.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % scrollerImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [scrollerImages.length]);

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);
    try {
      await api.createContactInquiry({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        message: `Event Inquiry - Type: ${formData.event}, Preferred Date: ${formData.date}`
      });
      setSubmitSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        event: 'Wedding',
        date: format(new Date(), 'yyyy-MM-dd')
      });
      // Clear success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      console.error('Failed to submit enquiry', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full w-full">
      {/* Full Screen Hero with Scroller */}
      <section className="relative w-full h-screen min-h-[600px] flex flex-col items-center justify-center text-white overflow-hidden">
        {scrollerImages.map((img, idx) => (
          <div 
            key={idx}
            className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <div className="absolute inset-0 bg-black/40 z-10" />
            <img src={img} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover scale-105 animate-kenburns" />
          </div>
        ))}
        
        <div className="relative z-20 text-center px-4 max-w-4xl mt-16">
          <span className="text-white/80 font-medium text-xs md:text-sm uppercase tracking-[0.3em] mb-4 block drop-shadow-md">
            Welcome to
          </span>
          <h2 className="text-5xl md:text-8xl font-serif font-bold mb-6 tracking-tight drop-shadow-xl text-white">
            {settings?.hotel_name || 'The Sonakunj'}
          </h2>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-10 leading-relaxed font-light drop-shadow-md">
            {settings?.description || 'Nestled in a charming town embraced by majestic mountains, our hotel is a haven for those seeking luxury, comfort, and unforgettable experiences.'}
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/rooms" className="bg-white/20 backdrop-blur-md text-white border border-white/40 px-8 py-4 rounded-full font-medium tracking-widest uppercase text-sm hover:bg-white hover:text-black transition-all duration-300">
              Discover Rooms
            </Link>
            <a href="#contact" className="bg-white text-black px-8 py-4 rounded-full font-medium tracking-widest uppercase text-sm hover:bg-white/90 transition-all duration-300">
              Book Your Stay
            </a>
          </div>
        </div>

        <button 
          onClick={() => setCurrentSlide((prev) => (prev - 1 + scrollerImages.length) % scrollerImages.length)}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-4 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white transition-all z-20"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button 
          onClick={() => setCurrentSlide((prev) => (prev + 1) % scrollerImages.length)}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-4 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white transition-all z-20"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </section>

      <div className="max-w-[1280px] w-full mx-auto px-4 md:px-8 py-16 flex flex-col gap-16 md:gap-24">
        
        {/* Book Room & Arenas Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="col-span-1 lg:col-span-4 bg-bento-text rounded-3xl p-6 md:p-8 text-white flex flex-col min-h-[400px] shadow-2xl">
            <div className="mb-8 text-center">
              <h3 className="text-2xl md:text-3xl font-serif mb-2 font-bold">Book Your Room</h3>
              <p className="text-gray-400 text-sm tracking-widest uppercase">Experience luxury and comfort</p>
            </div>
            <div className="space-y-5 flex-1">
              <div className="bg-bento-dark-bg p-4 rounded-2xl border border-bento-dark-border group hover:border-bento-primary transition-colors">
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Check-in Date</label>
                <input type="date" className="font-medium bg-transparent outline-none w-full text-white cursor-pointer [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" defaultValue={format(today, 'yyyy-MM-dd')} />
              </div>
              <div className="bg-bento-dark-bg p-4 rounded-2xl border border-bento-dark-border group hover:border-bento-primary transition-colors">
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Check-out Date</label>
                <input type="date" className="font-medium bg-transparent outline-none w-full text-white cursor-pointer [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" defaultValue={format(checkOutDate, 'yyyy-MM-dd')} />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="bg-bento-dark-bg p-4 rounded-2xl border border-bento-dark-border group hover:border-bento-primary transition-colors">
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Adults</label>
                  <input type="number" min="1" max="10" className="font-medium bg-transparent outline-none w-full text-white placeholder-gray-400" placeholder="e.g. 2" defaultValue="2" />
                </div>
                <div className="bg-bento-dark-bg p-4 rounded-2xl border border-bento-dark-border group hover:border-bento-primary transition-colors">
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Kids</label>
                  <input type="number" min="0" max="10" className="font-medium bg-transparent outline-none w-full text-white placeholder-gray-400" placeholder="e.g. 0" defaultValue="0" />
                </div>
              </div>
              <div className="bg-bento-dark-bg p-4 rounded-2xl border border-bento-dark-border relative group hover:border-bento-primary transition-colors">
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Room Type</label>
                <select className="font-medium bg-transparent outline-none w-full text-white cursor-pointer pr-8 appearance-none">
                  <option value="" disabled>Select a room</option>
                  {rooms?.map(r => (
                    <option key={r.id} value={r.id} className="text-black">{r.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <Link to="/rooms" className="mt-8 bg-bento-primary p-5 rounded-2xl text-center block hover:bg-bento-primary-hover transition-colors shadow-lg">
              <div className="uppercase text-sm font-bold tracking-widest text-white">Check Availability</div>
            </Link>
          </aside>

          <div className="col-span-1 lg:col-span-8 flex flex-col gap-8">
            <section id="arenas" className="bg-white rounded-3xl p-8 border border-bento-border flex-1 shadow-sm">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-serif font-bold tracking-tight text-gray-900">OUR ARENAS</h3>
                <p className="text-gray-500 uppercase tracking-widest text-sm mt-2">Versatile Spaces for Every Occasion</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {arenasData.map(arena => (
                  <div 
                    key={arena.name} 
                    onClick={() => setSelectedArena(arena)}
                    className="relative group overflow-hidden rounded-2xl aspect-[4/3] bg-gray-100 flex items-center justify-center cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500"
                  >
                    <div className="absolute inset-0 bg-black/30 z-10 transition-opacity duration-500 group-hover:bg-black/50 backdrop-blur-[2px] group-hover:backdrop-blur-sm"></div>
                    <img src={arena.img} alt={arena.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                    <div className="relative z-20 text-center px-6 transform group-hover:-translate-y-2 transition-transform duration-500">
                      <h4 className="text-white font-serif font-bold text-2xl tracking-wide drop-shadow-lg mb-2">{arena.name}</h4>
                      <p className="text-white/90 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2">Click to view details</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

      {/* Rooms & Amenities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-bento-light rounded-3xl p-6 md:p-10 border border-bento-border">
          <h3 className="text-2xl font-serif font-bold mb-6 text-center">ROOMS & SUITES</h3>
          <ul className="space-y-4 text-lg font-medium text-center">
            {['Standard Room', 'Deluxe Room', 'Premium Room', 'Premium Room with Balcony', 'Deluxe Twin Room', 'Executive Suites'].map(room => (
              <li key={room} className="border-b border-bento-border pb-3 last:border-0">{room}</li>
            ))}
          </ul>
        </section>

        <section className="bg-bento-primary text-white rounded-3xl p-6 md:p-10 border border-bento-primary-hover shadow-md">
          <h3 className="text-2xl font-serif font-bold mb-6 text-center">AMENITIES</h3>
          <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-center md:text-left text-sm md:text-base font-medium">
            {['Room Service', 'Wifi', 'Laundry Service', 'Breakfast', 'Parking Space', 'Security & Surveillance', '24x7 Generator Backup', 'Toiletries', 'Restaurant', 'Lift'].map(amenity => (
              <div key={amenity} className="bg-black/10 rounded-lg p-3">{amenity}</div>
            ))}
          </div>
        </section>
      </div>

      {/* Restaurant Section */}
      <section id="restaurant" className="bg-white rounded-3xl overflow-hidden border border-bento-border shadow-sm flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 h-[300px] md:h-auto relative">
          <img src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=800&auto=format&fit=crop" alt="Sattva Restaurant" className="absolute inset-0 w-full h-full object-cover" />
        </div>
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
          <span className="text-bento-primary font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-4 block">
            Pure Vegetarian Fine Dining
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">SATTVA RESTAURANT</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Experience culinary excellence at Sattva Restaurant. We offer a curated selection of authentic vegetarian delicacies, crafted with the freshest locally sourced ingredients. Whether it's a hearty breakfast or an intimate dinner, our elegant ambiance perfectly complements our extraordinary flavors.
          </p>
          <div className="flex flex-wrap gap-4 mb-8">
            <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium">North Indian</span>
            <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium">South Indian</span>
            <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium">Chinese</span>
            <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium">Continental</span>
          </div>
          <Link to="/restaurant" className="bg-bento-primary text-white px-8 py-4 rounded-xl font-bold text-sm tracking-widest uppercase hover:bg-black transition-colors self-start shadow-md">
            View Full Menu
          </Link>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="bg-bento-light rounded-3xl p-8 md:p-12 border border-bento-border">
        <div className="text-center mb-10">
          <span className="text-bento-primary font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-2 block">
            Visual Journey
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold">GALLERY</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(galleryItems || []).map((item, i) => {
            const isVideo = item.type === 'video';
            return (
              <div 
                key={item.id || i} 
                className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer border border-gray-100 shadow-sm flex"
                onClick={() => {
                  if (isVideo) {
                    setActiveVideo(item.url);
                  } else {
                    // Open image in a light overlay
                    setActiveVideo(item.url);
                  }
                }}
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-all duration-300 z-10 flex items-center justify-center">
                  {isVideo ? (
                    <div className="w-12 h-12 rounded-full bg-white/25 backdrop-blur border border-white/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-5 h-5 text-white fill-white ml-0.5" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-white/0 group-hover:bg-white/20 backdrop-blur border border-white/0 group-hover:border-white/30 flex items-center justify-center scale-75 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <svg className="w-5 h-5 text-white stroke-white fill-none stroke-2" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                    </div>
                  )}
                </div>
                {isVideo ? (
                  <video 
                    src={item.url} 
                    muted 
                    loop 
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onMouseOver={e => {
                      try { (e.currentTarget as HTMLVideoElement).play(); } catch (_) {}
                    }}
                    onMouseOut={e => {
                      try { (e.currentTarget as HTMLVideoElement).pause(); } catch (_) {}
                    }}
                  />
                ) : (
                  <SafeImage 
                    src={item.url} 
                    alt={item.caption || `Gallery Image ${i}`} 
                    fallbackType="general"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                )}
                {item.caption && (
                  <div className="absolute bottom-3 left-3 z-20 bg-black/50 backdrop-blur px-2.5 py-1 rounded-lg">
                    <p className="text-[10px] font-sans font-medium text-white tracking-wider uppercase">{item.caption}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Narsinghgarh Info */}
      <section id="heritage" className="bg-white rounded-3xl p-6 md:p-12 border border-bento-border text-center">
        <span className="text-bento-primary font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-2 block">
          Malwa Ka Kashmir
        </span>
        <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">NATURAL & HERITAGE</h2>
        <p className="text-base md:text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12">
          Narsinghgarh is a historic town located about 80 km from Bhopal in Madhya Pradesh, India. Known for its rich cultural heritage and scenic beauty, the town is surrounded by the Vindhya hills and lush forests. With its blend of history, nature, and local traditions, Narsinghgarh is a hidden gem worth exploring.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {(heritageList || [
            { id: 'h1', name: 'Narsinghgarh Fort', image_url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=600&auto=format&fit=crop', description: 'A grand fort overlooking the town with stunning architectural heritage.' },
            { id: 'h2', name: 'Chidi Kho', image_url: 'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?q=80&w=600&auto=format&fit=crop', description: 'A beautiful wildlife sanctuary and lake perfect for nature lovers.' },
            { id: 'h3', name: 'Solah Khamb', image_url: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=600&auto=format&fit=crop', description: 'A historical monument featuring intricate 16 stone pillars and ancient carvings.' }
          ]).map(place => (
            <div key={place.id} className="group rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="h-48 overflow-hidden bg-gray-100 relative">
                <img src={place.image_url} alt={place.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <h4 className="font-serif font-bold text-xl mb-2 text-gray-900">{place.name}</h4>
                <p className="text-gray-600 text-sm">{place.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Wedding/Event Enquiry */}
      <section className="bg-bento-text text-white rounded-3xl p-6 md:p-12">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">PERFECT DESTINATION FOR YOUR DREAM WEDDING</h2>
          <p className="text-gray-400">ENQUIRE NOW</p>
        </div>
        
        {submitSuccess ? (
          <div className="max-w-4xl mx-auto bg-green-900/30 border border-green-500/50 rounded-2xl p-8 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-serif font-bold text-white mb-2">Thank you for your enquiry!</h3>
            <p className="text-gray-300">Our reservations manager will get in touch with you shortly to plan your event.</p>
          </div>
        ) : (
          <form onSubmit={handleEnquirySubmit} className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase text-gray-400 mb-2">First Name *</label>
                  <input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full bg-bento-dark-bg border border-bento-dark-border rounded-xl p-4 text-white focus:outline-none focus:border-bento-primary" />
                </div>
                <div>
                  <label className="block text-xs uppercase text-gray-400 mb-2">Last Name *</label>
                  <input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full bg-bento-dark-bg border border-bento-dark-border rounded-xl p-4 text-white focus:outline-none focus:border-bento-primary" />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase text-gray-400 mb-2">Phone *</label>
                <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-bento-dark-bg border border-bento-dark-border rounded-xl p-4 text-white focus:outline-none focus:border-bento-primary" />
              </div>
              <div>
                <label className="block text-xs uppercase text-gray-400 mb-2">Email *</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-bento-dark-bg border border-bento-dark-border rounded-xl p-4 text-white focus:outline-none focus:border-bento-primary" />
              </div>
            </div>
            
            <div className="space-y-4 flex flex-col justify-between">
              <div>
                <label className="block text-xs uppercase text-gray-400 mb-2">Event *</label>
                <select value={formData.event} onChange={e => setFormData({...formData, event: e.target.value})} className="w-full bg-bento-dark-bg border border-bento-dark-border rounded-xl p-4 text-white focus:outline-none focus:border-bento-primary appearance-none">
                  {['Wedding', 'Engagement', 'Sangeet', 'Birthday', 'Anniversary', 'Baby Shower', 'Kitty Party', 'Conference', 'Get Together', 'Community', 'Corporate', 'Bhagwat Katha', 'Pravchan', 'Others'].map(evt => (
                    <option key={evt} value={evt}>{evt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase text-gray-400 mb-2">Date</label>
                <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-bento-dark-bg border border-bento-dark-border rounded-xl p-4 text-white focus:outline-none focus:border-bento-primary [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" />
              </div>
              
              <button disabled={isSubmitting} type="submit" className="w-full bg-bento-primary hover:bg-bento-primary-hover disabled:bg-bento-primary/50 text-white font-bold py-4 rounded-xl transition-colors mt-auto flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit Enquiry</span>
                )}
              </button>
            </div>
          </form>
        )}
      </section>

      {/* Contact Us & Footer */}
      <footer id="contact" className="bg-white rounded-3xl p-6 md:p-12 border border-bento-border text-center md:text-left grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-serif font-bold mb-6">CONTACT US</h2>
          <div className="space-y-4 text-lg text-gray-700">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Click to call / contact</p>
              <a 
                href={`tel:${(settings?.phone || '+91 8989010919').replace(/[\s\-\(\)]/g, '')}`} 
                className="font-bold text-2xl md:text-3xl text-bento-primary hover:text-black transition-colors inline-block"
                title="Open Call Log"
              >
                {settings?.phone || '+91 8989010919'}
              </a>
            </div>
            <p className="text-gray-600 font-medium">
              <a href={`mailto:${settings?.email || 'reservations@thesonakunj.com'}`} className="hover:underline text-bento-primary">
                {settings?.email || 'reservations@thesonakunj.com'}
              </a>
            </p>
            <p className="max-w-xs mx-auto md:mx-0">{settings?.address || 'Sonakunj Estate NH-46 Narsinghgarh, Dist. Rajgarh, M.P.- 465669'}</p>
            
            <div className="pt-4 border-t border-gray-200 mt-4 text-sm text-gray-500">
              <p>{settings?.bhopal_airport || 'Bhopal International Airport – 75 Kms'}</p>
              <p>{settings?.bhopal_railway || 'Bhopal Railway Station – 84 Kms'}</p>
              <p>{settings?.biaora_railway || 'Biaora Railway Station – 34 kms'}</p>
            </div>
          </div>
        </div>
        
        <div className="h-[300px] md:h-[400px] w-full bg-gray-200 rounded-2xl overflow-hidden shadow-inner">
           <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14644.270912111816!2d77.08630046556134!3d23.606272545593847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397b9736c2a11b05%3A0xc6c7d1e8ef9d4e5f!2sNarsinghgarh%2C%20Madhya%20Pradesh%20465669!5e0!3m2!1sen!2sin!4v1708453303104!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        
        <div className="col-span-1 md:col-span-2 pt-8 border-t border-gray-200 mt-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© Copyright 2025 by Thesonakunj.com</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-bento-primary">Privacy Policy</a>
            <a href="#" className="hover:text-bento-primary">Terms of use</a>
          </div>
        </div>
      </footer>

      {/* Arena Modal */}
      {selectedArena && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedArena(null)}></div>
          <div className="relative bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedArena(null)}
              className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 transition-colors backdrop-blur-md"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="h-64 sm:h-80 w-full relative">
              <img src={selectedArena.img} alt={selectedArena.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-6 sm:p-8">
              <h3 className="text-3xl font-serif font-bold text-gray-900 mb-4">{selectedArena.name}</h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">{selectedArena.desc}</p>
              <button 
                onClick={() => {
                  setSelectedArena(null);
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-bento-primary text-white font-bold py-3 px-8 rounded-xl hover:bg-bento-primary-hover transition-colors"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Video & Image Lightbox Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setActiveVideo(null)}></div>
          <div className="relative w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 bg-black flex items-center justify-center">
            <button 
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 z-[130] bg-white/10 hover:bg-white/20 text-white rounded-full p-2.5 transition-colors backdrop-blur-md border border-white/10 shadow-lg"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="w-full h-full flex items-center justify-center p-1 md:p-4">
              {activeVideo.endsWith('.mp4') || activeVideo.includes('assets.mixkit.co') || activeVideo.includes('video') || activeVideo.includes('.webm') ? (
                <video 
                  src={activeVideo} 
                  controls 
                  autoPlay 
                  playsInline
                  className="max-h-[80vh] max-w-full rounded-2xl shadow-2xl focus:outline-none" 
                />
              ) : activeVideo.includes('youtube.com') || activeVideo.includes('youtu.be') ? (
                <div className="w-full aspect-video">
                  <iframe 
                    src={activeVideo.includes('embed') ? activeVideo : `https://www.youtube.com/embed/${activeVideo.includes('v=') ? activeVideo.split('v=')[1]?.split('&')[0] : activeVideo.split('/').pop()}?autoplay=1`}
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen
                    className="w-full h-[60vh] rounded-2xl"
                  ></iframe>
                </div>
              ) : (
                <img 
                  src={activeVideo} 
                  alt="Gallery full-size view" 
                  className="max-h-[80vh] max-w-full rounded-2xl object-contain shadow-2xl" 
                />
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
