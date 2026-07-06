import { Link, Outlet } from "react-router-dom";

export function MainLayout() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#2D2D2D] font-sans flex flex-col p-4 md:p-6 select-none">
      <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col">
        <header className="flex flex-wrap justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border border-[#E5E2D9] gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#E67E22] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <h1 className="text-xl md:text-2xl font-serif font-bold tracking-tight">
              Raj Mahal Hotel & Dining
            </h1>
          </Link>
          <nav className="hidden md:flex gap-6 lg:gap-8 font-medium text-sm uppercase tracking-wide">
            <Link to="/" className="hover:text-[#E67E22] transition-colors">Home</Link>
            <Link to="/rooms" className="hover:text-[#E67E22] transition-colors">Rooms</Link>
            <Link to="/restaurant" className="hover:text-[#E67E22] transition-colors">Restaurant</Link>
            <Link to="/banquet" className="hover:text-[#E67E22] transition-colors">Banquet</Link>
            <Link to="/contact" className="hover:text-[#E67E22] transition-colors">Contact</Link>
          </nav>
          <div className="flex items-center gap-4 text-sm font-semibold">
            <span className="bg-[#F5F5F0] px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-[#E5E2D9]">
              Helpline: 011-2345678
            </span>
          </div>
        </header>
        
        <main className="flex-1 flex flex-col">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
