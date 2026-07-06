export function Banquet() {
  return (
    <div className="bg-white rounded-3xl p-8 border border-[#E5E2D9] min-h-full flex flex-col items-center justify-center text-center">
      <div className="w-20 h-20 bg-[#FDF7F2] rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl">🎊</span>
      </div>
      <h2 className="text-4xl font-serif font-bold mb-4">Royal Banquet Hall</h2>
      <p className="text-lg text-gray-600 max-w-2xl mb-8">
        Perfect for weddings, corporate events, and family gatherings. Our banquet hall can accommodate up to 500 guests with premium catering services.
      </p>
      <button className="bg-[#E67E22] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#D35400] transition-colors">
        Enquire Now
      </button>
    </div>
  );
}
