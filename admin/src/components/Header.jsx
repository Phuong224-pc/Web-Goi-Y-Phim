import React, { useState } from 'react';
import { Menu, Bell, Search, ChevronDown, ShieldAlert, CheckCircle, Flame } from 'lucide-react';

export default function Header({ setSidebarOpen, activeTab }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard Overview';
      case 'movies': return 'Movie Performance Analytics';
      case 'users': return 'User Account Management';
      case 'comments': return 'Comments Management';
      case 'settings': return 'System Settings';
      default: return 'Admin Panel';
    }
  };

  const notifications = [
    { id: 1, text: "New comment from Trần Thanh Phương on Dune 2", type: "comment", time: "5m ago" },
    { id: 2, text: "High traffic spike detected: 1.2k guest views/min", type: "alert", time: "15m ago" },
    { id: 3, text: "Guest GST-0294 blocked due to malicious script activity", type: "block", time: "1h ago" },
  ];

  return (
    <header className="h-16 sticky top-0 bg-[#0a0a0c]/80 backdrop-blur-md border-b border-dark-border z-30 flex items-center justify-between px-6">
      {/* Left side: Hamburger (mobile) + Active view Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 hover:bg-[#121216] rounded-xl text-dark-muted hover:text-white transition-colors"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-bold text-white tracking-wide">{getTitle()}</h1>
      </div>

      {/* Right side: Health status + Search indicator + Notifications + Admin Panel */}
      <div className="flex items-center gap-4">
        {/* Server Status Indicator (Desktop only) */}
        <div className="hidden md:flex items-center gap-2 bg-[#121216]/50 border border-dark-border px-3 py-1.5 rounded-full text-[11px] text-green-400 font-medium font-mono">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-slow"></span>
          <span>System Status: Healthy</span>
        </div>

        {/* Search indicator */}
        <div className="hidden sm:flex items-center gap-2 bg-[#121216]/80 border border-dark-border px-3 py-1.5 rounded-xl text-xs text-dark-muted w-48 hover:border-[#33334d] transition-all cursor-pointer">
          <Search size={14} />
          <span>Quick search...</span>
          <span className="ml-auto text-[9px] bg-dark-border px-1.5 py-0.5 rounded font-mono">⌘K</span>
        </div>

        {/* Notifications Icon with dropdown */}
        <div className="relative">
          <button 
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileOpen(false);
            }}
            className={`p-2.5 rounded-xl border transition-all text-dark-muted hover:text-white hover:bg-[#121216] ${
              notificationsOpen ? 'bg-[#121216] border-brand text-white' : 'border-dark-border'
            }`}
          >
            <div className="relative">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand rounded-full glow-red"></span>
            </div>
          </button>

          {/* Notifications Dropdown menu */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 glass-panel rounded-2xl shadow-xl py-2 z-50 animate-slide-up">
              <div className="px-4 py-2 border-b border-dark-border flex justify-between items-center">
                <span className="text-xs font-bold text-white">Notifications</span>
                <span className="text-[10px] text-brand hover:underline cursor-pointer">Mark all read</span>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.map((notif) => (
                  <div key={notif.id} className="px-4 py-3 hover:bg-[#121216] border-b border-dark-border/40 last:border-b-0 cursor-pointer transition-colors">
                    <div className="flex gap-2.5">
                      <div className="mt-0.5">
                        {notif.type === 'alert' ? (
                          <Flame size={14} className="text-amber-500" />
                        ) : notif.type === 'block' ? (
                          <ShieldAlert size={14} className="text-red-500" />
                        ) : (
                          <CheckCircle size={14} className="text-blue-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-gray-200 leading-snug">{notif.text}</p>
                        <span className="text-[10px] text-dark-muted mt-1 inline-block">{notif.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-dark-border hover:bg-[#121216] hover:border-[#33334d] transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-brand/20 border border-brand/40 flex items-center justify-center font-bold text-brand text-xs">
              TP
            </div>
            <span className="hidden sm:block text-xs font-medium text-white">Admin</span>
            <ChevronDown size={14} className="text-dark-muted" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-3 w-48 glass-panel rounded-2xl shadow-xl py-2 z-50 animate-slide-up">
              <div className="px-4 py-2 border-b border-dark-border">
                <p className="text-xs font-bold text-white">Thanh Phương</p>
                <p className="text-[10px] text-dark-muted">support@moviepro.vn</p>
              </div>
              <button 
                onClick={() => { setProfileOpen(false); alert("Opening Profile Settings..."); }}
                className="w-full text-left px-4 py-2 text-xs text-gray-200 hover:bg-[#121216] transition-colors"
              >
                My Profile
              </button>
              <button 
                onClick={() => { setProfileOpen(false); alert("Viewing Activity Logs..."); }}
                className="w-full text-left px-4 py-2 text-xs text-gray-200 hover:bg-[#121216] transition-colors"
              >
                Activity Log
              </button>
              <div className="border-t border-dark-border my-1"></div>
              <button 
                onClick={() => { setProfileOpen(false); alert("Signing out..."); }}
                className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-red-950/20 transition-colors"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
