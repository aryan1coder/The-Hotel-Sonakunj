import { useState } from "react";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E5E2D9] min-h-[80vh] flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-64 flex flex-col gap-2">
        <div className="font-serif font-bold text-xl mb-6 pl-4 border-l-4 border-[#E67E22]">Admin Panel</div>
        {[
          { id: "dashboard", label: "Dashboard" },
          { id: "bookings", label: "Bookings" },
          { id: "rooms", label: "Rooms" },
          { id: "restaurant", label: "Restaurant" },
          { id: "content", label: "CMS Content" },
          { id: "settings", label: "Settings" },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-left px-4 py-3 rounded-xl font-medium transition-colors ${
              activeTab === tab.id 
                ? "bg-[#2D2D2D] text-white" 
                : "text-gray-600 hover:bg-[#FAF9F6]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </aside>
      
      <div className="flex-1">
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold font-serif mb-6">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#FAF9F6] p-6 rounded-2xl border border-[#E5E2D9]">
                <div className="text-gray-500 text-sm font-medium mb-1">Today's Revenue</div>
                <div className="text-3xl font-bold text-[#E67E22]">₹ 24,500</div>
              </div>
              <div className="bg-[#FAF9F6] p-6 rounded-2xl border border-[#E5E2D9]">
                <div className="text-gray-500 text-sm font-medium mb-1">Pending Bookings</div>
                <div className="text-3xl font-bold">12</div>
              </div>
              <div className="bg-[#FAF9F6] p-6 rounded-2xl border border-[#E5E2D9]">
                <div className="text-gray-500 text-sm font-medium mb-1">Available Rooms</div>
                <div className="text-3xl font-bold">8</div>
              </div>
            </div>
            
            <h3 className="text-xl font-bold font-serif mt-10 mb-4">Recent Bookings</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-100 text-gray-500 text-sm">
                    <th className="pb-3 font-medium">Guest</th>
                    <th className="pb-3 font-medium">Room</th>
                    <th className="pb-3 font-medium">Check-in</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    { name: "Rahul Sharma", room: "Deluxe AC", date: "Oct 15", status: "Pending" },
                    { name: "Priya Singh", room: "Standard", date: "Oct 14", status: "Checked In" },
                    { name: "Amit Kumar", room: "Royal Suite", date: "Oct 12", status: "Checked Out" },
                  ].map((b, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-4 font-medium">{b.name}</td>
                      <td className="py-4 text-gray-600">{b.room}</td>
                      <td className="py-4 text-gray-600">{b.date}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          b.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                          b.status === 'Checked In' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab !== "dashboard" && (
          <div className="h-full flex items-center justify-center text-gray-400">
            {activeTab} management panel coming soon.
          </div>
        )}
      </div>
    </div>
  );
}
