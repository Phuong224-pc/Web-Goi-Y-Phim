import React from 'react';
import { LayoutDashboard, Film, Users, Settings, LogOut, X, MessageSquare } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'movies', name: 'Movie Analytics', icon: Film },
    { id: 'users', name: 'User Management', icon: Users },
    { id: 'comments', name: 'Comments', icon: MessageSquare },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside 
        className={`fixed top-0 left-0 bottom-0 w-64 glass-panel border-r border-dark-border z-50 flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo Section */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-dark-border">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-wider text-white">
                MOVIE<span className="text-brand font-black">PRO</span>
              </span>
              <span className="text-[10px] bg-brand/10 text-brand px-1.5 py-0.5 rounded border border-brand/20 font-semibold uppercase">
                Admin
              </span>
            </div>
            {/* Close button for mobile */}
            <button 
              onClick={() => setSidebarOpen(false)}
              className="p-1 hover:bg-[#1a1a24] rounded-lg lg:hidden text-dark-muted hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive 
                      ? 'bg-brand text-white shadow-lg shadow-brand/20 glow-red' 
                      : 'text-dark-muted hover:text-white hover:bg-[#121216]/80'
                  }`}
                >
                  <Icon 
                    size={18} 
                    className={`transition-transform duration-300 group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-dark-muted group-hover:text-white'
                    }`} 
                  />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Admin Info / Logout */}
        <div className="p-4 border-t border-dark-border">
          <div className="flex items-center gap-3 px-2 py-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-brand/20 border border-brand/40 flex items-center justify-center font-bold text-brand">
              TP
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Thanh Phương</p>
              <p className="text-[10px] text-dark-muted">Super Administrator</p>
            </div>
          </div>
          
          <button 
            onClick={() => alert("Signing out...")}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-all duration-200 group"
          >
            <LogOut size={18} className="transition-transform group-hover:translate-x-1" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
