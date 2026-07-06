import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { formatCurrency } from '../lib/utils';
import { UtensilsCrossed, Leaf } from 'lucide-react';
import SafeImage from '../components/SafeImage';

export default function Restaurant() {
  const { data: menuItems, isLoading } = useQuery({ queryKey: ['menu'], queryFn: api.getMenu });

  const categories = menuItems ? Array.from(new Set(menuItems.map(item => item.category))) : [];

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto pt-32 pb-16 px-4 md:px-8">
      <div className="max-w-[1280px] w-full mx-auto">
        <div className="mb-10 text-center">
          <span className="text-bento-primary font-bold text-xs md:text-sm uppercase tracking-[0.2em] mb-2 block">
            Pure Vegetarian Fine Dining
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-bento-text">SATTVA RESTAURANT</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Experience culinary excellence with our curated selection of authentic vegetarian delicacies.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bento-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="order-2 lg:order-1 space-y-12">
              {categories.map(category => (
                <div key={category} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                  <h3 className="text-2xl font-serif font-bold mb-6 text-gray-900 border-b border-gray-100 pb-4">{category}</h3>
                  <div className="space-y-6">
                    {menuItems?.filter(item => item.category === category).map(item => (
                      <div key={item.id} className="flex justify-between items-center group gap-4">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100 shadow-sm relative flex">
                          <SafeImage 
                            src={item.image_url} 
                            alt={item.name} 
                            referrerPolicy="no-referrer"
                            fallbackType="menu"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-lg font-medium text-gray-900 group-hover:text-bento-primary transition-colors">{item.name}</h4>
                            {item.is_veg && <Leaf className="w-4 h-4 text-green-500 shrink-0" />}
                          </div>
                          {item.description && <p className="text-sm text-gray-500 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>}
                        </div>
                        <div className="font-bold text-lg text-gray-900 ml-4 shrink-0">
                          {formatCurrency(item.price)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="sticky top-32 rounded-3xl overflow-hidden shadow-xl">
                <SafeImage 
                  src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=800&auto=format&fit=crop" 
                  alt="Sattva Restaurant Interior" 
                  fallbackType="menu"
                  className="w-full h-[400px] lg:h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8 text-white">
                  <UtensilsCrossed className="w-10 h-10 mb-4 opacity-80" />
                  <h3 className="text-2xl font-serif font-bold mb-2">A Feast for the Senses</h3>
                  <p className="text-white/80">Locally sourced ingredients crafted with passion.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
